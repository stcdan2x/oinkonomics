import 'fake-indexeddb/auto'
import { beforeEach, describe, expect, it } from 'vitest'
import { addAnimal, listAnimals, listBreeders, reactivateAnimal, removeAnimal, setAnimalStatus } from './animalRepo'
import { db } from './db'
import { addEvent } from './eventRepo'
import { recordService } from './litterRepo'
import { softDelete } from './repo'
import { recordSale } from './saleRepo'
import { addTransaction } from './transactionRepo'

const sow = { tag: 'S-01', role: 'sow' as const, sex: 'female' as const, source: 'bought' as const, breed: 'Large White' }

describe('animal repository', () => {
  beforeEach(async () => {
    await db.animals.clear()
  })

  it('adds an animal as active with a stamped row', async () => {
    const a = await addAnimal(sow)
    expect(a.status).toBe('active')
    expect(a.id).toBeTruthy()
    expect((await db.animals.get(a.id))!.tag).toBe('S-01')
  })

  it('rejects an empty tag and a tag already in use by a live animal', async () => {
    await expect(addAnimal({ ...sow, tag: '  ' })).rejects.toThrow(/tag/i)
    await addAnimal(sow)
    await expect(addAnimal({ ...sow, tag: 's-01' })).rejects.toThrow(/S-01/)
  })

  it('frees a tag once its animal is deleted', async () => {
    const a = await addAnimal(sow)
    await softDelete(db.animals, a.id)
    const again = await addAnimal(sow)
    expect(again.id).not.toBe(a.id)
  })

  it('lists live animals by role and breeders together, newest tag order stable', async () => {
    await addAnimal(sow)
    await addAnimal({ ...sow, tag: 'S-02' })
    await addAnimal({ tag: 'B-01', role: 'boar', sex: 'male', source: 'bought' })
    await addAnimal({ tag: 'G-01', role: 'gilt', sex: 'female', source: 'born' })
    const p = await addAnimal({ tag: 'P-77', role: 'piglet', sex: 'male', source: 'born' })
    await softDelete(db.animals, p.id)

    expect((await listAnimals('sow')).map((a) => a.tag)).toEqual(['S-01', 'S-02'])
    expect((await listAnimals()).map((a) => a.tag).sort()).toEqual(['B-01', 'G-01', 'S-01', 'S-02'])
    expect((await listBreeders()).map((a) => a.tag).sort()).toEqual(['B-01', 'G-01', 'S-01', 'S-02'])
  })

  it('changes status with a date and drops the animal from the active lists', async () => {
    const a = await addAnimal(sow)
    const culled = await setAnimalStatus(a.id, 'culled', '2026-10-01')
    expect(culled.status).toBe('culled')
    expect(culled.statusDate).toBe('2026-10-01')
    expect(await listBreeders()).toEqual([])
    expect((await listAnimals('sow', { includeInactive: true })).length).toBe(1)
  })
})

// TASK 003 Phase 1, step 1.4: a culled or died breeder comes back; an animal
// created by mistake is deleted unless something was built on it.
describe('animal corrections', () => {
  beforeEach(async () => {
    await Promise.all([db.animals.clear(), db.events.clear(), db.litters.clear(), db.sales.clear(), db.transactions.clear()])
  })

  it('reactivates a culled animal and tombstones the cull event; sold animals go through the sale', async () => {
    const a = await addAnimal(sow)
    await setAnimalStatus(a.id, 'culled', '2026-06-03', 'lame')
    await expect(reactivateAnimal(a.id)).resolves.toMatchObject({ status: 'active' })
    expect((await db.animals.get(a.id))!.statusDate).toBeUndefined()
    expect((await db.events.where('subjectId').equals(a.id).toArray()).filter((e) => !e.deletedAt)).toEqual([])
    await expect(reactivateAnimal(a.id)).rejects.toThrow(/active/i)
    await setAnimalStatus(a.id, 'sold', '2026-06-04')
    await expect(reactivateAnimal(a.id)).rejects.toThrow(/sale/i)
  })

  it('deletes an animal with no history and refuses one with a litter, a sale or a purchase entry', async () => {
    const a = await addAnimal(sow)
    await addEvent({ subjectType: 'animal', subjectId: a.id, type: 'note', date: '2026-06-01', data: {} })
    await removeAnimal(a.id)
    expect((await db.animals.get(a.id))!.deletedAt).toBeTruthy()
    expect((await db.events.where('subjectId').equals(a.id).toArray()).every((e) => e.deletedAt)).toBe(true)
    expect(await listAnimals()).toEqual([])
    const s = await addAnimal(sow)
    await recordService({ sowId: s.id, serviceDate: '2026-01-01' })
    await expect(removeAnimal(s.id)).rejects.toThrow(/litter/i)
    const tx = await addTransaction({ date: '2026-01-01', kind: 'capital', category: 'stockPurchase', amount: 15000, links: {} })
    const bought = await addAnimal({ tag: 'B-02', role: 'boar', sex: 'male', source: 'bought', purchaseTransactionId: tx.id })
    await expect(removeAnimal(bought.id)).rejects.toThrow(/purchase/i)
    const sold = await addAnimal({ tag: 'G-03', role: 'gilt', sex: 'female', source: 'bought' })
    await recordSale({ date: '2026-06-10', buyerType: 'market', lines: [{ animalIds: [sold.id], headCount: 1, pricePerHead: 9000 }] })
    await expect(removeAnimal(sold.id)).rejects.toThrow(/sale/i)
  })
})
