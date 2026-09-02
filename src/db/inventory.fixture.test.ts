import 'fake-indexeddb/auto'
import { beforeAll, describe, expect, it } from 'vitest'
import { dailyUsage, daysRemaining, stockAlerts, usageByBatch } from '../engine/inventory'
import { createBatch } from './batchRepo'
import { computeFarmCosting } from './costingRepo'
import { db } from './db'
import { createItem, listItems, movesForItem, purchaseStock, recordStockMove } from './inventoryRepo'
import { addTransaction, listTransactions } from './transactionRepo'

// Hand-computed inventory fixture (today 2026-06-20). Batch of 10 started 06-01.
//   Grower feed: bought 10 bags for 14,500 on 06-02 (1,450 each); 2 bags fed 06-08; then 10 bags
//     for 15,400 on 06-10 with 8 on hand (average after: (8 x 1,450 + 15,400) / 18 = 1,500).
//     Fed to batch: 2 bags 06-08 (at 1,450 = 2,900), 2 bags 06-10 after the second purchase
//     (at 1,500 = 3,000); herd 1 bag 06-12 (1,500); loss 1 bag 06-13 (1,500). On hand 14.
//   Amoxicillin: 3 vials for 450 on 06-03 (150 each), 1 vial to the batch 06-04 (150). On hand 2,
//     expires 07-05 (15 days away).
//   Starter: item with nothing on hand, reorder level 2 (low stock).
//   Labour 3,000 on 06-15, shared, no item.
// Ledger expenses: 14,500 + 15,400 + 450 + 3,000 = 33,350.
// Costing: batch direct 2,900 + 3,000 + 150 = 6,050 (feed 5,900, medicineVaccine 150);
//   shared June = herd feed 1,500 + loss 1,500 + labour 3,000 = 6,000, all to the only unit
//   (300 head-days, no breeders) -> total 12,050; the 30,350 of purchases never enters costing.
// Feed usage window 06-07..06-20, first consumption 06-08 -> 13 days; used 5 -> 5/13 per day;
//   days remaining floor(14 / (5/13)) = 36; by batch 4/13, herd 1/13.
const TODAY = '2026-06-20'
let batchId = ''
let feedId = ''
let amoxId = ''

beforeAll(async () => {
  await Promise.all(db.tables.map((t) => t.clear()))
  const batch = await createBatch({ name: 'Weaners', kind: 'piglets', litterIds: [], headCount: 10, startDate: '2026-06-01', strategy: 'growToMarket' })
  batchId = batch.id
  const feed = await createItem({ name: 'Grower', category: 'feed', unit: 'bag', kgPerUnit: 50, reorderLevel: 2, unitCost: 0 })
  feedId = feed.id
  const amox = await createItem({ name: 'Amoxicillin', category: 'medicine', unit: 'vial', reorderLevel: 1, unitCost: 0, expiryDate: '2026-07-05' })
  amoxId = amox.id
  await createItem({ name: 'Starter', category: 'feed', unit: 'bag', reorderLevel: 2, unitCost: 0 })

  await purchaseStock({ itemId: feedId, date: '2026-06-02', qty: 10, totalCost: 14500 })
  await purchaseStock({ itemId: amoxId, date: '2026-06-03', qty: 3, totalCost: 450 })
  await recordStockMove({ itemId: amoxId, date: '2026-06-04', qtyDelta: -1, reason: 'consumption', batchId })
  await recordStockMove({ itemId: feedId, date: '2026-06-08', qtyDelta: -2, reason: 'consumption', batchId })
  await purchaseStock({ itemId: feedId, date: '2026-06-10', qty: 10, totalCost: 15400 })
  await recordStockMove({ itemId: feedId, date: '2026-06-10', qtyDelta: -2, reason: 'consumption', batchId })
  await recordStockMove({ itemId: feedId, date: '2026-06-12', qtyDelta: -1, reason: 'consumption' })
  await recordStockMove({ itemId: feedId, date: '2026-06-13', qtyDelta: -1, reason: 'loss' })
  await addTransaction({ date: '2026-06-15', kind: 'expense', category: 'labour', amount: 3000, links: {} })
})

describe('inventory fixture', () => {
  it('stock and ledger agree on the purchases', async () => {
    const txs = await listTransactions({ kind: 'expense' })
    expect(txs.reduce((s, t) => s + t.amount, 0)).toBe(33350)
    const purchases = txs.filter((t) => t.links.itemId)
    expect(purchases).toHaveLength(3)
    for (const tx of purchases) {
      const move = (await movesForItem(tx.links.itemId!)).find((m) => m.transactionId === tx.id)!
      expect(move.reason).toBe('purchase')
      expect(move.qtyDelta * move.unitCost!).toBeCloseTo(tx.amount, 6)
    }
  })

  it('keeps on hand equal to the sum of moves and the unit cost as the weighted average', async () => {
    const feed = (await db.inventoryItems.get(feedId))!
    expect(feed.qtyOnHand).toBe(14)
    expect((await movesForItem(feedId)).reduce((s, m) => s + m.qtyDelta, 0)).toBe(14)
    expect(feed.unitCost).toBe(1500)
    expect((await db.inventoryItems.get(amoxId))!).toMatchObject({ qtyOnHand: 2, unitCost: 150 })
  })

  it('fires the low-stock and expiry alerts', async () => {
    const items = await listItems()
    const starter = items.find((i) => i.name === 'Starter')!
    expect(stockAlerts(items, TODAY)).toEqual([
      { itemId: starter.id, type: 'lowStock' },
      { itemId: amoxId, type: 'expiring', daysToExpiry: 15 },
    ])
  })

  it('estimates the feed days remaining from the 14-day usage', async () => {
    const moves = await movesForItem(feedId)
    const perDay = dailyUsage(moves, TODAY)
    expect(perDay).toBeCloseTo(5 / 13, 9)
    expect(daysRemaining(14, perDay)).toBe(36)
    const byBatch = usageByBatch(moves, TODAY)
    expect(byBatch.get(batchId)).toBeCloseTo(4 / 13, 9)
    expect(byBatch.get('herd')).toBeCloseTo(1 / 13, 9)
  })

  it('charges consumption to the batch at the snapshot cost and keeps purchases out of the shared pool', async () => {
    const costing = await computeFarmCosting(TODAY)
    const row = costing.batches.find((r) => r.batch.id === batchId)!
    expect(row.costing.directTotal).toBe(6050)
    expect(row.costing.direct).toEqual([
      { category: 'feed', amount: 5900 },
      { category: 'medicineVaccine', amount: 150 },
    ])
    expect(row.costing.allocated).toBe(6000)
    expect(row.costing.totalCost).toBe(12050)
    expect(costing.unallocated).toBe(0)
  })
})
