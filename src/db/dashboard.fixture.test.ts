import 'fake-indexeddb/auto'
import { beforeAll, describe, expect, it } from 'vitest'
import { addAnimal } from './animalRepo'
import { changeHeadCount, createBatch, createBatchFromLitter, recordBatchWeight } from './batchRepo'
import { computeDashboard, type DashboardData } from './dashboardRepo'
import { db } from './db'
import { createItem, recordStockMove } from './inventoryRepo'
import { recordFarrowing, recordService, recordWeaning } from './litterRepo'
import { recordPrice } from './priceLogRepo'
import { addTransaction } from './transactionRepo'

// PLAN.md section 9, P7 verify column: seeded data renders correct totals.
// Today 2026-09-02. Farm: sows S1, S2, S3, boar B1, gilt G1 (born 2026-03-10),
// one loose finisher F1. S1's litter served 2026-01-05, farrowed 2026-04-29,
// weaned 11 on 2026-05-27 -> batch "Weaners" (kind piglets), one death
// 2026-06-10 and one 2026-09-01 (9 left); weighed 12 kg at weaning and 86 kg on
// 2026-08-26: ADG 74/91, projected today 86 + 7 x 74/91 = 91.69 kg >= 90, ready.
// S2 served 2026-05-24 -> due 2026-09-16 (day 14, included). S3 served
// 2026-05-01 -> due 2026-08-24, overdue. Batch "Bought": 4 piglets from
// 2026-08-20, sell as weaners, no weighing, 13 days on farm < 32: not ready.
//
// Ledger: capital 50,000 (01-10); feed 2,000 linked to Weaners (07-01); shared
// feed 5,000 (08-15) and 3,000 (09-01); hog sales 20,000 (09-02).
// Stock: Grower feed (unit cost 1,500, reorder at 12): +12 bags 08-25, -1 on
// 09-01 and 09-02 for Weaners -> 10 on hand, 1 bag per day, 10 days left; low.
// Amoxicillin: 2 on hand, expires 2026-09-20 (18 days).
//
// September: revenue 20,000, expenses 3,000, profit 17,000, deaths 1.
// Cash to 09-30: -50,000 - 2,000 - 5,000 - 3,000 + 20,000 = -40,000.
// Weaners costing: direct 2,000 + 2 bags x 1,500 = 5,000; allocated
//   Aug 5,000 x 310 / (310 + 48 + 155) = 3,021.44   (head-days: Weaners 10 x 31,
//   Bought 4 x 12, herd 5 x 31)
//   Sep 3,000 x 270 / (270 + 120 + 150) = 1,500     (Weaners 9 x 30, Bought 4 x 30, herd 5 x 30)
//   cost per kg gained = 9,521.44 / (74 kg x 9 head) = 14.297
// Herd count at month end, July to September: Jul 5 + 10 = 15; Aug 5 + 10 + 4 = 19; Sep 5 + 9 + 4 = 18.
describe('dashboard fixture', () => {
  const TODAY = '2026-09-02'
  let sep: DashboardData
  let quarter: DashboardData
  let weanersId = ''

  beforeAll(async () => {
    await Promise.all(
      [db.animals, db.litters, db.batches, db.events, db.sales, db.transactions, db.inventoryItems, db.stockMoves, db.priceLog].map((t) => t.clear()),
    )
    const s1 = await addAnimal({ tag: 'S1', role: 'sow', sex: 'female', source: 'bought', birthDate: '2024-01-01' })
    const s2 = await addAnimal({ tag: 'S2', role: 'sow', sex: 'female', source: 'bought' })
    const s3 = await addAnimal({ tag: 'S3', role: 'sow', sex: 'female', source: 'bought' })
    await addAnimal({ tag: 'B1', role: 'boar', sex: 'male', source: 'bought' })
    await addAnimal({ tag: 'G1', role: 'gilt', sex: 'female', source: 'born', birthDate: '2026-03-10' })
    await addAnimal({ tag: 'F1', role: 'finisher', sex: 'male', source: 'bought' })

    const l0 = await recordService({ sowId: s1.id, serviceDate: '2026-01-05' })
    await recordFarrowing(l0.id, { farrowDate: '2026-04-29', bornAlive: 12, stillborn: 1, mummified: 0 })
    await recordWeaning(l0.id, { weanDate: '2026-05-27', weanedCount: 11 })
    const weaners = await createBatchFromLitter(l0.id, { strategy: 'growToMarket', name: 'Weaners' })
    weanersId = weaners.id
    await changeHeadCount(weanersId, -1, 'death', '2026-06-10')
    await changeHeadCount(weanersId, -1, 'death', '2026-09-01')
    await recordBatchWeight(weanersId, { date: '2026-05-27', avgKg: 12 })
    await recordBatchWeight(weanersId, { date: '2026-08-26', avgKg: 86 })
    await recordService({ sowId: s2.id, serviceDate: '2026-05-24' })
    await recordService({ sowId: s3.id, serviceDate: '2026-05-01' })
    await createBatch({ name: 'Bought', kind: 'piglets', litterIds: [], headCount: 4, startDate: '2026-08-20', strategy: 'sellWeaners' })

    await addTransaction({ date: '2026-01-10', kind: 'capital', category: 'penConstruction', amount: 50000, links: {} })
    await addTransaction({ date: '2026-07-01', kind: 'expense', category: 'feed', amount: 2000, links: { batchId: weanersId } })
    await addTransaction({ date: '2026-08-15', kind: 'expense', category: 'feed', amount: 5000, links: {} })
    await addTransaction({ date: '2026-09-01', kind: 'expense', category: 'feed', amount: 3000, links: {} })
    await addTransaction({ date: '2026-09-02', kind: 'revenue', category: 'hogSales', amount: 20000, links: {} })

    const grower = await createItem({ name: 'Grower', category: 'feed', unit: 'bag', kgPerUnit: 50, reorderLevel: 12, unitCost: 1500 })
    await recordStockMove({ itemId: grower.id, date: '2026-08-25', qtyDelta: 12, reason: 'purchase' })
    await recordStockMove({ itemId: grower.id, date: '2026-09-01', qtyDelta: -1, reason: 'consumption', batchId: weanersId })
    await recordStockMove({ itemId: grower.id, date: '2026-09-02', qtyDelta: -1, reason: 'consumption', batchId: weanersId })
    const amox = await createItem({ name: 'Amoxicillin', category: 'medicine', unit: 'vial', reorderLevel: 0, unitCost: 150, expiryDate: '2026-09-20' })
    await recordStockMove({ itemId: amox.id, date: '2026-08-01', qtyDelta: 2, reason: 'purchase' })

    await recordPrice({ date: '2026-08-01', item: 'liveweightPerKg', value: 170, source: 'heard' })
    await recordPrice({ date: '2026-09-01', item: 'liveweightPerKg', value: 165, source: 'heard' })

    sep = await computeDashboard({ from: '2026-09-01', to: '2026-09-30' }, TODAY)
    quarter = await computeDashboard({ from: '2026-07-01', to: '2026-09-30' }, TODAY)
  })

  it('counts heads by stage', () => {
    expect(sep.heads).toEqual({ sows: 3, gilts: 1, boars: 1, piglets: 13, growers: 0, finishers: 1, total: 19 })
  })

  it('lists the sows due with the overdue one first', () => {
    expect(sep.sowsDue.map((s) => [sep.names.sows.get(s.sowId), s.date, s.overdue])).toEqual([
      ['S3', '2026-08-24', true],
      ['S2', '2026-09-16', false],
    ])
  })

  it('flags the batch at market weight', () => {
    expect(sep.ready.map((r) => [r.batch.name, r.by, r.targetKg])).toEqual([['Weaners', 'weight', 90]])
    expect(sep.ready[0].kgNow).toBeCloseTo(86 + (7 * 74) / 91, 2)
  })

  it('gives the period money, deaths and cash on hand', () => {
    expect(sep.statement.totalRevenue).toBe(20000)
    expect(sep.statement.totalExpenses).toBe(3000)
    expect(sep.statement.netIncome).toBe(17000)
    expect(sep.deaths).toBe(1)
    expect(sep.cashOnHand).toBe(-40000)
  })

  it('gives the feed days left and the alerts in order', () => {
    expect(sep.feedDays).toBe(10)
    expect(sep.alerts.map((a) => a.type)).toEqual(['farrowingOverdue', 'stock', 'stock', 'batchReady'])
    const [, low, expiring] = sep.alerts
    expect(low).toMatchObject({ type: 'stock', alert: 'lowStock' })
    expect(sep.names.items.get((low as { itemId: string }).itemId)).toBe('Grower')
    expect(expiring).toMatchObject({ type: 'stock', alert: 'expiring', daysToExpiry: 18 })
  })

  it('builds the chart series', () => {
    expect(quarter.monthly).toEqual([
      { month: '2026-07', revenue: 0, expenses: 2000, profit: -2000 },
      { month: '2026-08', revenue: 0, expenses: 5000, profit: -5000 },
      { month: '2026-09', revenue: 20000, expenses: 3000, profit: 17000 },
    ])
    expect(quarter.herd).toEqual([
      { month: '2026-07', breeders: 5, pigs: 10, total: 15 },
      { month: '2026-08', breeders: 5, pigs: 14, total: 19 },
      { month: '2026-09', breeders: 5, pigs: 13, total: 18 },
    ])
    expect(sep.costPerKgGain.map((g) => g.name)).toEqual(['Weaners'])
    expect(sep.costPerKgGain[0].value).toBeCloseTo(9521.44 / (74 * 9), 2)
    expect(sep.prices).toEqual([
      { date: '2026-08-01', value: 170 },
      { date: '2026-09-01', value: 165 },
    ])
  })
})
