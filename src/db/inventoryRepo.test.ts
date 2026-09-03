import 'fake-indexeddb/auto'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from './db'
import { recordTreatment, undoEvent } from './eventRepo'
import { createItem, listItems, movesForItem, purchaseStock, recordStockMove, removeStockMove, updateItem } from './inventoryRepo'
import { listTransactions } from './transactionRepo'

beforeEach(async () => {
  await db.inventoryItems.clear()
  await db.stockMoves.clear()
})

const feed = () => createItem({ name: '  Hog grower  ', category: 'feed', unit: 'bag', kgPerUnit: 50, reorderLevel: 2, unitCost: 1450 })

describe('createItem', () => {
  it('stores a trimmed item starting with nothing on hand', async () => {
    const item = await feed()
    expect(item.name).toBe('Hog grower')
    expect(item.qtyOnHand).toBe(0)
    expect(await db.inventoryItems.get(item.id)).toMatchObject({ category: 'feed', unit: 'bag', kgPerUnit: 50, reorderLevel: 2, unitCost: 1450 })
  })

  it('rejects a blank name or unit, negative levels and costs, a non-positive kg per unit and a bad expiry', async () => {
    const base = { name: 'Iron', category: 'medicine' as const, unit: 'vial', reorderLevel: 1, unitCost: 120 }
    await expect(createItem({ ...base, name: ' ' })).rejects.toThrow(/name/i)
    await expect(createItem({ ...base, unit: '' })).rejects.toThrow(/unit/i)
    await expect(createItem({ ...base, reorderLevel: -1 })).rejects.toThrow(/reorder/i)
    await expect(createItem({ ...base, unitCost: -1 })).rejects.toThrow(/cost/i)
    await expect(createItem({ ...base, kgPerUnit: 0 })).rejects.toThrow(/kg/i)
    await expect(createItem({ ...base, expiryDate: '2026-13-40' })).rejects.toThrow(/expiry/i)
  })
})

describe('recordStockMove', () => {
  it('keeps qtyOnHand equal to the sum of live moves and snapshots the unit cost', async () => {
    const item = await feed()
    const bought = await recordStockMove({ itemId: item.id, date: '2026-06-01', qtyDelta: 10, reason: 'purchase' })
    await recordStockMove({ itemId: item.id, date: '2026-06-02', qtyDelta: -3, reason: 'consumption', batchId: 'b1' })
    await recordStockMove({ itemId: item.id, date: '2026-06-03', qtyDelta: -1, reason: 'loss' })
    expect((await db.inventoryItems.get(item.id))!.qtyOnHand).toBe(6)
    expect(bought.unitCost).toBe(1450)
    const moves = await movesForItem(item.id)
    expect(moves.map((m) => m.date)).toEqual(['2026-06-03', '2026-06-02', '2026-06-01'])
    expect(moves[1]).toMatchObject({ batchId: 'b1', unitCost: 1450 })
  })

  it('refuses to take stock below zero', async () => {
    const item = await feed()
    await recordStockMove({ itemId: item.id, date: '2026-06-01', qtyDelta: 2, reason: 'purchase' })
    await expect(recordStockMove({ itemId: item.id, date: '2026-06-02', qtyDelta: -3, reason: 'consumption' })).rejects.toThrow(/only 2 bag/i)
    expect((await db.inventoryItems.get(item.id))!.qtyOnHand).toBe(2)
    expect(await movesForItem(item.id)).toHaveLength(1)
  })

  it('enforces the sign per reason and rejects zero, non-finite and bad dates', async () => {
    const item = await feed()
    await expect(recordStockMove({ itemId: item.id, date: '2026-06-01', qtyDelta: -1, reason: 'purchase' })).rejects.toThrow(/purchase/i)
    await expect(recordStockMove({ itemId: item.id, date: '2026-06-01', qtyDelta: 1, reason: 'consumption' })).rejects.toThrow(/consumption/i)
    await expect(recordStockMove({ itemId: item.id, date: '2026-06-01', qtyDelta: 1, reason: 'loss' })).rejects.toThrow(/loss/i)
    await expect(recordStockMove({ itemId: item.id, date: '2026-06-01', qtyDelta: 0, reason: 'adjustment' })).rejects.toThrow(/quantity/i)
    await expect(recordStockMove({ itemId: item.id, date: '2026-06-01', qtyDelta: NaN, reason: 'purchase' })).rejects.toThrow(/quantity/i)
    await expect(recordStockMove({ itemId: item.id, date: '2026-6-1', qtyDelta: 1, reason: 'purchase' })).rejects.toThrow(/date/i)
    await expect(recordStockMove({ itemId: 'nope', date: '2026-06-01', qtyDelta: 1, reason: 'purchase' })).rejects.toThrow(/item/i)
  })

  // TASK 003 Phase 3, step 3.1: a consumption can name the animal it was for.
  it('keeps the animal a consumption was drawn for', async () => {
    const item = await feed()
    await recordStockMove({ itemId: item.id, date: '2026-06-01', qtyDelta: 10, reason: 'purchase' })
    const used = await recordStockMove({ itemId: item.id, date: '2026-06-02', qtyDelta: -1, reason: 'consumption', animalId: 'sow1' })
    expect(await db.stockMoves.get(used.id)).toMatchObject({ animalId: 'sow1', qtyDelta: -1 })
    expect((await db.inventoryItems.get(item.id))!.qtyOnHand).toBe(9)
  })

  it('accepts a positive or negative adjustment', async () => {
    const item = await feed()
    await recordStockMove({ itemId: item.id, date: '2026-06-01', qtyDelta: 5, reason: 'adjustment' })
    await recordStockMove({ itemId: item.id, date: '2026-06-02', qtyDelta: -2, reason: 'adjustment' })
    expect((await db.inventoryItems.get(item.id))!.qtyOnHand).toBe(3)
  })
})

describe('removeStockMove', () => {
  it('tombstones the move and recounts the item', async () => {
    const item = await feed()
    await recordStockMove({ itemId: item.id, date: '2026-06-01', qtyDelta: 10, reason: 'purchase' })
    const used = await recordStockMove({ itemId: item.id, date: '2026-06-02', qtyDelta: -4, reason: 'consumption' })
    await removeStockMove(used.id)
    expect((await db.inventoryItems.get(item.id))!.qtyOnHand).toBe(10)
    expect(await movesForItem(item.id)).toHaveLength(1)
    const row = await db.stockMoves.get(used.id)
    expect(row!.deletedAt).toBe(row!.updatedAt)
  })

  it('refuses a removal that would leave the stock negative', async () => {
    const item = await feed()
    const bought = await recordStockMove({ itemId: item.id, date: '2026-06-01', qtyDelta: 5, reason: 'purchase' })
    await recordStockMove({ itemId: item.id, date: '2026-06-02', qtyDelta: -4, reason: 'consumption' })
    await expect(removeStockMove(bought.id)).rejects.toThrow(/below zero/i)
    expect((await db.inventoryItems.get(item.id))!.qtyOnHand).toBe(1)
  })

  // TASK 003 Phase 3, step 3.5 (§7 D7): the move a live health event drew
  // belongs to the event; only the event's own undo or edit removes it.
  const medicine = async () => {
    await db.events.clear()
    const med = await createItem({ name: 'Amoxicillin', category: 'medicine', unit: 'mL', reorderLevel: 0, unitCost: 12 })
    await recordStockMove({ itemId: med.id, date: '2026-06-01', qtyDelta: 100, reason: 'purchase' })
    const event = await recordTreatment({ subjectType: 'batch', subjectId: 'b1', type: 'treatment', date: '2026-06-02', product: 'Amoxicillin', withdrawalDays: 14, stock: { itemId: med.id, qty: 5 } })
    return { med, event, moveId: event.data.stockMoveId as string }
  }

  it('refuses to remove a move a live health event drew, while the event itself still can', async () => {
    const { med, event, moveId } = await medicine()
    await expect(removeStockMove(moveId)).rejects.toThrow(/health event/i)
    expect((await db.inventoryItems.get(med.id))!.qtyOnHand).toBe(95)
    expect((await db.stockMoves.get(moveId))!.deletedAt).toBeNull()
    await undoEvent(event.id)
    expect((await db.inventoryItems.get(med.id))!.qtyOnHand).toBe(100)
    expect((await db.stockMoves.get(moveId))!.deletedAt).not.toBeNull()
  })

  it('lets the move go once the event that drew it is a tombstone', async () => {
    const { med, event, moveId } = await medicine()
    await db.events.put({ ...event, deletedAt: event.updatedAt })
    await removeStockMove(moveId)
    expect((await db.inventoryItems.get(med.id))!.qtyOnHand).toBe(100)
  })
})

describe('listItems and updateItem', () => {
  it('sorts by category then name and hides tombstones', async () => {
    const b = await createItem({ name: 'Starter', category: 'feed', unit: 'bag', reorderLevel: 0, unitCost: 0 })
    await createItem({ name: 'Amoxicillin', category: 'medicine', unit: 'vial', reorderLevel: 0, unitCost: 0 })
    const a = await createItem({ name: 'Grower', category: 'feed', unit: 'bag', reorderLevel: 0, unitCost: 0 })
    await db.inventoryItems.put({ ...b, deletedAt: b.updatedAt })
    expect((await listItems()).map((i) => i.name)).toEqual(['Grower', 'Amoxicillin'])
    await updateItem(a.id, { reorderLevel: 4, expiryDate: '2027-01-31' })
    expect(await db.inventoryItems.get(a.id)).toMatchObject({ reorderLevel: 4, expiryDate: '2027-01-31' })
    await expect(updateItem(a.id, { reorderLevel: -2 })).rejects.toThrow(/reorder/i)
  })
})

describe('purchaseStock', () => {
  it('writes one expense transaction and one purchase move that agree, and averages the unit cost', async () => {
    await db.transactions.clear()
    const item = await feed()
    await recordStockMove({ itemId: item.id, date: '2026-06-01', qtyDelta: 4, reason: 'adjustment' })
    const { transaction, move } = await purchaseStock({ itemId: item.id, date: '2026-06-05', qty: 6, totalCost: 9000, note: 'ABC Agrivet' })
    expect(transaction).toMatchObject({ kind: 'expense', category: 'feed', amount: 9000, date: '2026-06-05', note: 'ABC Agrivet', links: { itemId: item.id } })
    expect(move).toMatchObject({ reason: 'purchase', qtyDelta: 6, transactionId: transaction.id, unitCost: 1500 })
    const after = (await db.inventoryItems.get(item.id))!
    expect(after.qtyOnHand).toBe(10)
    expect(after.unitCost).toBeCloseTo((4 * 1450 + 6 * 1500) / 10, 6)
    expect(await listTransactions({})).toHaveLength(1)
  })

  it('maps the item category to the ledger category', async () => {
    await db.transactions.clear()
    const med = await createItem({ name: 'Amoxicillin', category: 'medicine', unit: 'vial', reorderLevel: 0, unitCost: 0 })
    const sup = await createItem({ name: 'Disinfectant', category: 'supply', unit: 'L', reorderLevel: 0, unitCost: 0 })
    const eq = await createItem({ name: 'Feeder', category: 'equipment', unit: 'piece', reorderLevel: 0, unitCost: 0 })
    expect((await purchaseStock({ itemId: med.id, date: '2026-06-05', qty: 2, totalCost: 300 })).transaction.category).toBe('medicineVaccine')
    expect((await purchaseStock({ itemId: sup.id, date: '2026-06-05', qty: 1, totalCost: 250 })).transaction.category).toBe('other')
    expect((await purchaseStock({ itemId: eq.id, date: '2026-06-05', qty: 1, totalCost: 800 })).transaction.category).toBe('equipment')
    expect((await db.inventoryItems.get(med.id))!.unitCost).toBe(150)
  })

  it('rejects a non-positive quantity or cost and a missing item, writing nothing', async () => {
    await db.transactions.clear()
    const item = await feed()
    await expect(purchaseStock({ itemId: item.id, date: '2026-06-05', qty: 0, totalCost: 100 })).rejects.toThrow(/quantity/i)
    await expect(purchaseStock({ itemId: item.id, date: '2026-06-05', qty: 2, totalCost: 0 })).rejects.toThrow(/cost/i)
    await expect(purchaseStock({ itemId: 'nope', date: '2026-06-05', qty: 2, totalCost: 100 })).rejects.toThrow(/item/i)
    expect(await listTransactions({})).toHaveLength(0)
    expect(await movesForItem(item.id)).toHaveLength(0)
  })

  it('removing the purchase move tombstones its transaction too', async () => {
    await db.transactions.clear()
    const item = await feed()
    const { transaction, move } = await purchaseStock({ itemId: item.id, date: '2026-06-05', qty: 6, totalCost: 9000 })
    await removeStockMove(move.id)
    expect((await db.inventoryItems.get(item.id))!.qtyOnHand).toBe(0)
    expect(await listTransactions({})).toHaveLength(0)
    const tx = (await db.transactions.get(transaction.id))!
    expect(tx.deletedAt).toBe(tx.updatedAt)
  })
})
