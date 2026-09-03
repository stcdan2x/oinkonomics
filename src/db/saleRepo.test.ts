import 'fake-indexeddb/auto'
import { beforeEach, describe, expect, it } from 'vitest'
import { addAnimal } from './animalRepo'
import { createBatch } from './batchRepo'
import { db } from './db'
import { eventsFor, recordTreatment } from './eventRepo'
import { softDelete } from './repo'
import { listSales, recordSale, saleTotal, undoSale } from './saleRepo'

describe('sale repository', () => {
  beforeEach(async () => {
    await Promise.all([db.animals.clear(), db.batches.clear(), db.events.clear(), db.sales.clear(), db.transactions.clear()])
  })

  it('totals per-head and per-kg lines', () => {
    expect(saleTotal([{ headCount: 5, pricePerHead: 3500 }])).toBe(17500)
    expect(saleTotal([{ headCount: 2, liveWeightKg: 180, pricePerKg: 190 }])).toBe(34200)
    expect(saleTotal([{ headCount: 5, pricePerHead: 3500 }, { headCount: 2, liveWeightKg: 180, pricePerKg: 190 }])).toBe(51700)
  })

  it('sells part of a batch: revenue transaction, head count down, sale event', async () => {
    const b = await createBatch({ name: 'W', kind: 'piglets', litterIds: [], headCount: 11, startDate: '2026-05-25', strategy: 'sellWeaners' })
    const s = await recordSale({ date: '2026-06-10', buyerType: 'viajero', buyerName: 'Mang Tonyo', lines: [{ batchId: b.id, headCount: 8, pricePerHead: 3500 }] })
    expect(s.total).toBe(28000)
    const t = (await db.transactions.get(s.transactionId!))!
    expect(t).toMatchObject({ kind: 'revenue', category: 'hogSales', amount: 28000, date: '2026-06-10' })
    expect(t.links).toMatchObject({ saleId: s.id, batchId: b.id })
    expect((await db.batches.get(b.id))!.headCount).toBe(3)
    const ev = await db.events.where('subjectId').equals(b.id).toArray()
    expect(ev.map((e) => e.type)).toEqual(['sale'])
    expect((await listSales()).map((x) => x.id)).toEqual([s.id])
  })

  it('sells an individual animal per kg and marks it sold', async () => {
    const sow = await addAnimal({ tag: 'S-01', role: 'sow', sex: 'female', source: 'bought' })
    const s = await recordSale({ date: '2026-06-10', buyerType: 'market', lines: [{ animalIds: [sow.id], headCount: 1, liveWeightKg: 180, pricePerKg: 120 }] })
    expect(s.total).toBe(21600)
    const a = (await db.animals.get(sow.id))!
    expect(a.status).toBe('sold')
    expect(a.statusDate).toBe('2026-06-10')
  })

  it('rejects more head than the batch has, empty lines, and missing prices', async () => {
    const b = await createBatch({ name: 'W', kind: 'growers', litterIds: [], headCount: 3, startDate: '2026-05-25', strategy: 'undecided' })
    await expect(recordSale({ date: '2026-06-10', buyerType: 'viajero', lines: [{ batchId: b.id, headCount: 4, pricePerHead: 1 }] })).rejects.toThrow(/head/i)
    await expect(recordSale({ date: '2026-06-10', buyerType: 'viajero', lines: [] })).rejects.toThrow(/line/i)
    await expect(recordSale({ date: '2026-06-10', buyerType: 'viajero', lines: [{ batchId: b.id, headCount: 1 }] })).rejects.toThrow(/price/i)
    expect((await db.batches.get(b.id))!.headCount).toBe(3)
    expect(await db.transactions.count()).toBe(0)
  })

  it('blocks a sale inside a withdrawal period unless acknowledged', async () => {
    const b = await createBatch({ name: 'W', kind: 'growers', litterIds: [], headCount: 3, startDate: '2026-05-25', strategy: 'undecided' })
    await recordTreatment({ subjectType: 'batch', subjectId: b.id, type: 'treatment', date: '2026-06-01', product: 'Ivermec', withdrawalDays: 28 })
    const line = { batchId: b.id, headCount: 1, pricePerHead: 6000 }
    await expect(recordSale({ date: '2026-06-20', buyerType: 'viajero', lines: [line] })).rejects.toThrow(/withdrawal.*2026-06-29/i)
    const s = await recordSale({ date: '2026-06-20', buyerType: 'viajero', lines: [line], acknowledgeWithdrawal: true })
    expect(s.total).toBe(6000)
    const ok = await recordSale({ date: '2026-06-29', buyerType: 'viajero', lines: [line] })
    expect(ok.total).toBe(6000)
  })
})

// TASK 003 Phase 1, step 1.2: undoing a sale reverses everything it wrote.
describe('undoSale', () => {
  beforeEach(async () => {
    await Promise.all([db.animals.clear(), db.batches.clear(), db.events.clear(), db.sales.clear(), db.transactions.clear()])
  })

  it('restores the head count and the animal, tombstones the sale, its revenue entry and its events', async () => {
    const b = await createBatch({ name: 'W', kind: 'piglets', litterIds: [], headCount: 11, startDate: '2026-05-25', strategy: 'sellWeaners' })
    const sow = await addAnimal({ tag: 'S-01', role: 'sow', sex: 'female', source: 'bought' })
    const s = await recordSale({ date: '2026-06-10', buyerType: 'viajero', lines: [{ batchId: b.id, headCount: 8, pricePerHead: 3500 }, { animalIds: [sow.id], headCount: 1, pricePerHead: 9000 }] })
    expect((await db.batches.get(b.id))!.headCount).toBe(3)
    await undoSale(s.id)
    expect((await db.batches.get(b.id))!.headCount).toBe(11)
    const a = (await db.animals.get(sow.id))!
    expect(a.status).toBe('active')
    expect(a.statusDate).toBeUndefined()
    expect((await db.transactions.get(s.transactionId!))!.deletedAt).toBeTruthy()
    expect((await db.sales.get(s.id))!.deletedAt).toBeTruthy()
    expect(await eventsFor('batch', b.id)).toEqual([])
    expect(await eventsFor('animal', sow.id)).toEqual([])
    expect(await listSales()).toEqual([])
    await expect(undoSale(s.id)).rejects.toThrow(/already/i)
  })

  it('refuses when a batch of the sale was deleted, and leaves everything as it was', async () => {
    const b = await createBatch({ name: 'W', kind: 'growers', litterIds: [], headCount: 5, startDate: '2026-05-25', strategy: 'undecided' })
    const s = await recordSale({ date: '2026-06-10', buyerType: 'market', lines: [{ batchId: b.id, headCount: 2, pricePerHead: 6000 }] })
    await softDelete(db.batches, b.id)
    await expect(undoSale(s.id)).rejects.toThrow(/batch/i)
    expect((await db.sales.get(s.id))!.deletedAt).toBeNull()
    expect((await db.transactions.get(s.transactionId!))!.deletedAt).toBeNull()
  })
})
