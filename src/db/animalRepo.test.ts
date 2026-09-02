import 'fake-indexeddb/auto'
import { beforeEach, describe, expect, it } from 'vitest'
import { addAnimal, listAnimals, listBreeders, setAnimalStatus } from './animalRepo'
import { db } from './db'
import { softDelete } from './repo'

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
