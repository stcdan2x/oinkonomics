import 'fake-indexeddb/auto'
import { beforeEach, describe, expect, it } from 'vitest'
import { earliestSaleDate } from '../engine/withdrawal'
import { addAnimal, setAnimalStatus } from './animalRepo'
import { changeHeadCount, createBatch, recordBatchWeight } from './batchRepo'
import { db } from './db'
import { stockCostRows } from '../engine/costing'
import { computeFarmCosting } from './costingRepo'
import { addEvent, eventsFor, recordTreatment, undoEvent, updateEvent } from './eventRepo'
import { createItem, purchaseStock, updateItem } from './inventoryRepo'

describe('event repository', () => {
  beforeEach(async () => {
    await db.events.clear()
  })

  it('lists a subject\'s events newest first and ignores other subjects', async () => {
    await addEvent({ subjectType: 'batch', subjectId: 'B1', type: 'weight', date: '2026-06-01', data: { avgKg: 20 } })
    await addEvent({ subjectType: 'batch', subjectId: 'B1', type: 'weight', date: '2026-06-15', data: { avgKg: 27 } })
    await addEvent({ subjectType: 'batch', subjectId: 'B2', type: 'weight', date: '2026-06-20', data: { avgKg: 30 } })
    await addEvent({ subjectType: 'animal', subjectId: 'B1', type: 'note', date: '2026-06-30', data: {} })
    expect((await eventsFor('batch', 'B1')).map((e) => e.date)).toEqual(['2026-06-15', '2026-06-01'])
  })

  it('records a treatment with the withdrawal days frozen on the event', async () => {
    const e = await recordTreatment({ subjectType: 'batch', subjectId: 'B1', type: 'treatment', date: '2026-06-01', product: 'Ivermec', withdrawalDays: 28, dose: '1 mL per 33 kg' })
    expect(e.data).toMatchObject({ product: 'Ivermec', withdrawalDays: 28 })
    expect(earliestSaleDate(await eventsFor('batch', 'B1'))).toBe('2026-06-29')
    await expect(recordTreatment({ subjectType: 'batch', subjectId: 'B1', type: 'treatment', date: '2026-06-01', product: ' ', withdrawalDays: 1 })).rejects.toThrow(/product/i)
    await expect(recordTreatment({ subjectType: 'batch', subjectId: 'B1', type: 'treatment', date: '2026-06-01', product: 'x', withdrawalDays: -1 })).rejects.toThrow(/withdrawal/i)
  })
})

// TASK 003 Phase 1, step 1.1: corrections. An edit changes fields only; an undo
// tombstones the event and reverses what it did to the batch or the animal.
describe('event corrections', () => {
  beforeEach(async () => {
    await Promise.all([db.events.clear(), db.batches.clear(), db.animals.clear()])
  })

  it('edits a weighing or a health event in place and refuses other types', async () => {
    const b = await createBatch({ name: 'W', kind: 'growers', litterIds: [], headCount: 10, startDate: '2026-05-01', strategy: 'undecided' })
    const w = await recordBatchWeight(b.id, { date: '2026-06-01', avgKg: 20 })
    const edited = await updateEvent(w.id, { date: '2026-06-02', data: { avgKg: 22 } })
    expect(edited.date).toBe('2026-06-02')
    expect(edited.data.avgKg).toBe(22)
    expect(edited.updatedAt > w.updatedAt).toBe(true)
    await expect(updateEvent(w.id, { data: { avgKg: 0 } })).rejects.toThrow(/weight/i)
    const t = await recordTreatment({ subjectType: 'batch', subjectId: b.id, type: 'treatment', date: '2026-06-01', product: 'Ivermec', withdrawalDays: 28 })
    expect((await updateEvent(t.id, { data: { product: 'Ivermec 1%', withdrawalDays: 21 } })).data).toMatchObject({ product: 'Ivermec 1%', withdrawalDays: 21 })
    await expect(updateEvent(t.id, { data: { product: ' ' } })).rejects.toThrow(/product/i)
    const d = await changeHeadCount(b.id, -1, 'death', '2026-06-03')
    const death = (await eventsFor('batch', b.id)).find((e) => e.type === 'death')!
    expect(d.headCount).toBe(9)
    await expect(updateEvent(death.id, { date: '2026-06-04' })).rejects.toThrow(/undo/i)
  })

  it('undoes a batch death and restores the head count in the same step', async () => {
    const b = await createBatch({ name: 'D', kind: 'growers', litterIds: [], headCount: 10, startDate: '2026-05-01', strategy: 'undecided' })
    await changeHeadCount(b.id, -2, 'death', '2026-06-03')
    const death = (await eventsFor('batch', b.id)).find((e) => e.type === 'death')!
    await undoEvent(death.id)
    expect((await db.batches.get(b.id))!.headCount).toBe(10)
    expect((await db.events.get(death.id))!.deletedAt).toBeTruthy()
    expect(await eventsFor('batch', b.id)).toEqual([])
    await expect(undoEvent(death.id)).rejects.toThrow(/already/i)
  })

  it('undoes an animal cull and reactivates the animal', async () => {
    const a = await addAnimal({ tag: 'S-01', role: 'sow', sex: 'female', source: 'bought' })
    await setAnimalStatus(a.id, 'culled', '2026-06-03', 'lame')
    const cull = (await eventsFor('animal', a.id)).find((e) => e.type === 'cull')!
    await undoEvent(cull.id)
    const back = (await db.animals.get(a.id))!
    expect(back.status).toBe('active')
    expect(back.statusDate).toBeUndefined()
    expect(await eventsFor('animal', a.id)).toEqual([])
  })

  it('refuses to undo a sale event or a litter event from here', async () => {
    const b = await createBatch({ name: 'S', kind: 'finishers', litterIds: [], headCount: 10, startDate: '2026-05-01', strategy: 'growToMarket' })
    await changeHeadCount(b.id, -3, 'sale', '2026-06-03')
    const sale = (await eventsFor('batch', b.id)).find((e) => e.type === 'sale')!
    await expect(undoEvent(sale.id)).rejects.toThrow(/sale/i)
    const f = await addEvent({ subjectType: 'litter', subjectId: 'L1', type: 'farrowing', date: '2026-06-01', data: { bornAlive: 10 } })
    await expect(undoEvent(f.id)).rejects.toThrow(/litter/i)
    expect((await db.batches.get(b.id))!.headCount).toBe(7)
  })
})

// TASK 003 Phase 3, step 3.1: a health event can draw the medicine from stock.
// The event and its consumption move are written together, valued at the item's
// unit cost at that moment; undoing the event puts the stock back, editing the
// quantity replaces the move (§7 D5: a breeder's medicine is a herd direct cost).
describe('treatment from stock', () => {
  beforeEach(async () => {
    await Promise.all([db.events.clear(), db.batches.clear(), db.animals.clear(), db.inventoryItems.clear(), db.stockMoves.clear(), db.transactions.clear()])
  })

  const medicine = async () => {
    const item = await createItem({ name: 'Amoxicillin', category: 'medicine', unit: 'mL', reorderLevel: 0, unitCost: 0 })
    await purchaseStock({ itemId: item.id, date: '2026-05-20', qty: 100, totalCost: 1200 })
    return item
  }
  const costRows = async () => stockCostRows(await db.stockMoves.toArray(), await db.inventoryItems.toArray())
  const onHand = async (id: string) => (await db.inventoryItems.get(id))!.qtyOnHand

  it('draws the medicine from stock against the batch at the unit cost of that moment', async () => {
    const b = await createBatch({ name: 'T', kind: 'growers', litterIds: [], headCount: 10, startDate: '2026-05-01', strategy: 'undecided' })
    const item = await medicine()
    const e = await recordTreatment({ subjectType: 'batch', subjectId: b.id, type: 'treatment', date: '2026-06-01', product: 'Amoxicillin', withdrawalDays: 14, stock: { itemId: item.id, qty: 5 } })
    const move = (await db.stockMoves.get(e.data.stockMoveId as string))!
    expect(move).toMatchObject({ reason: 'consumption', qtyDelta: -5, date: '2026-06-01', batchId: b.id, unitCost: 12, deletedAt: null })
    expect(move.animalId).toBeUndefined()
    expect(await onHand(item.id)).toBe(95)
    expect(await costRows()).toEqual([expect.objectContaining({ id: move.id, category: 'medicineVaccine', amount: 60, date: '2026-06-01', links: { batchId: b.id, itemId: item.id } })])
  })

  it('charges the medicine given to a breeder to the herd as a direct cost', async () => {
    const a = await addAnimal({ tag: 'S-01', role: 'sow', sex: 'female', source: 'bought' })
    const item = await medicine()
    const e = await recordTreatment({ subjectType: 'animal', subjectId: a.id, type: 'treatment', date: '2026-06-01', product: 'Amoxicillin', withdrawalDays: 14, stock: { itemId: item.id, qty: 5 } })
    const move = (await db.stockMoves.get(e.data.stockMoveId as string))!
    expect(move).toMatchObject({ animalId: a.id, qtyDelta: -5, unitCost: 12 })
    expect(move.batchId).toBeUndefined()
    expect((await costRows())[0].links).toMatchObject({ animalId: a.id, itemId: item.id })
    const costing = await computeFarmCosting('2026-06-30')
    expect(costing.herdByMonth.get('2026-06')!.direct).toBe(60)
    expect(costing.unallocated).toBe(0)
  })

  it('refuses a bad quantity, more than is on hand or an unknown item, writing no event', async () => {
    const b = await createBatch({ name: 'T', kind: 'growers', litterIds: [], headCount: 10, startDate: '2026-05-01', strategy: 'undecided' })
    const item = await medicine()
    const base = { subjectType: 'batch' as const, subjectId: b.id, type: 'treatment' as const, date: '2026-06-01', product: 'Amoxicillin', withdrawalDays: 14 }
    await expect(recordTreatment({ ...base, stock: { itemId: item.id, qty: 0 } })).rejects.toThrow(/quantity/i)
    await expect(recordTreatment({ ...base, stock: { itemId: item.id, qty: 500 } })).rejects.toThrow(/only 100 mL/i)
    await expect(recordTreatment({ ...base, stock: { itemId: 'nope', qty: 1 } })).rejects.toThrow(/item/i)
    expect(await eventsFor('batch', b.id)).toEqual([])
    expect(await onHand(item.id)).toBe(100)
  })

  it('undoing the treatment puts the medicine back', async () => {
    const b = await createBatch({ name: 'T', kind: 'growers', litterIds: [], headCount: 10, startDate: '2026-05-01', strategy: 'undecided' })
    const item = await medicine()
    const e = await recordTreatment({ subjectType: 'batch', subjectId: b.id, type: 'treatment', date: '2026-06-01', product: 'Amoxicillin', withdrawalDays: 14, stock: { itemId: item.id, qty: 5 } })
    await undoEvent(e.id)
    expect(await onHand(item.id)).toBe(100)
    expect((await db.stockMoves.get(e.data.stockMoveId as string))!.deletedAt).toBeTruthy()
    expect(await eventsFor('batch', b.id)).toEqual([])
    expect(await costRows()).toEqual([])
  })

  it('editing the quantity replaces the move at the current cost, the date follows, and clearing it puts the stock back', async () => {
    const b = await createBatch({ name: 'T', kind: 'growers', litterIds: [], headCount: 10, startDate: '2026-05-01', strategy: 'undecided' })
    const item = await medicine()
    const e = await recordTreatment({ subjectType: 'batch', subjectId: b.id, type: 'treatment', date: '2026-06-01', product: 'Amoxicillin', withdrawalDays: 14, stock: { itemId: item.id, qty: 5 } })
    const first = e.data.stockMoveId as string
    await updateItem(item.id, { unitCost: 20 })
    const edited = await updateEvent(e.id, { date: '2026-06-02', stock: { itemId: item.id, qty: 8 } })
    expect(edited.data.stockMoveId).not.toBe(first)
    expect((await db.stockMoves.get(first))!.deletedAt).toBeTruthy()
    expect(await db.stockMoves.get(edited.data.stockMoveId as string)).toMatchObject({ qtyDelta: -8, unitCost: 20, date: '2026-06-02', batchId: b.id, deletedAt: null })
    expect(await onHand(item.id)).toBe(92)
    expect(await costRows()).toEqual([expect.objectContaining({ amount: 160, date: '2026-06-02' })])
    await updateEvent(e.id, { date: '2026-06-03' })
    expect(await db.stockMoves.get(edited.data.stockMoveId as string)).toMatchObject({ qtyDelta: -8, unitCost: 20, date: '2026-06-03' })
    const cleared = await updateEvent(e.id, { stock: null })
    expect(cleared.data.stockMoveId).toBeNull()
    expect(await onHand(item.id)).toBe(100)
    expect(await costRows()).toEqual([])
    await expect(updateEvent(e.id, { stock: { itemId: item.id, qty: 0 } })).rejects.toThrow(/quantity/i)
  })
})
