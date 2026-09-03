import 'fake-indexeddb/auto'
import { beforeAll, describe, expect, it } from 'vitest'
import { cashFlow, incomeStatement } from '../engine/finance'
import { costPerWeanedPiglet, paybackDate, roi } from '../engine/unitCosts'
import { addAnimal } from './animalRepo'
import { createBatch, createBatchFromLitter, changeHeadCount, recordBatchWeight, removeBatch } from './batchRepo'
import { computeFarmCosting, herdTotals, type FarmCosting } from './costingRepo'
import { db } from './db'
import { eventsFor, undoEvent } from './eventRepo'
import { recordFarrowing, recordService, recordWeaning } from './litterRepo'
import { recordSale, undoSale } from './saleRepo'
import { addTransaction } from './transactionRepo'

// PLAN.md section 9, P4 verify column: every report matches a hand-computed fixture.
// Farm: sow S1 and boar B1 on farm all year (2 breeders). Litter served 2026-01-05,
// farrowed 12 alive, weaned 11 on 2026-05-27 -> batch "Weaners" (11 head). One death
// 2026-06-10 (10 left), 10 sold 2026-06-30 at 900 kg x 185 = 166,500. Batch "Bought"
// of 4 weaners started 2026-06-01, stock purchase 10,000 linked to it.
//
// Head-days per month:            Weaners      Bought    Herd(2)   Total
//   March                              0           0        62        62
//   May (27-31: 5 x 11)               55           0        62       117
//   June (1-9: 9x11=99; 10-29: 20x10=200; 30th: sold, 0) = 299
//                                    299     30x4=120        60       479
// Shared expenses: March feed 1,000 -> herd 1,000
//                  May feed 1,170   -> Weaners 550, herd 620
//                  June feed 4,790  -> Weaners 2,990, Bought 1,200, herd 600
// Herd direct: medicine 200 linked to S1 on 06-05.
// Piglet cost for Weaners (months Jan-May): herd 1,000 + 620 = 1,620 / 11 weaned = 147.27 per head;
// piglet value 11 x 147.27 = 1,620. Bought carries no piglet value.
//
// TASK 003 step 1.6: three mistakes are made and undone before the reports run (a
// batch "Oops" deleted, a death on Bought undone, a sale from Bought undone); every
// figure below must be unchanged, which proves the tombstones are ignored.
describe('finance fixture', () => {
  let costing: FarmCosting
  let weanersId = ''
  let boughtId = ''
  const TODAY = '2026-07-31'

  beforeAll(async () => {
    await Promise.all([db.animals, db.litters, db.batches, db.events, db.sales, db.transactions].map((t) => t.clear()))
    const sow = await addAnimal({ tag: 'S1', role: 'sow', sex: 'female', source: 'bought', birthDate: '2024-01-01' })
    await addAnimal({ tag: 'B1', role: 'boar', sex: 'male', source: 'bought', birthDate: '2024-01-01' })
    const litter = await recordService({ sowId: sow.id, serviceDate: '2026-01-05' })
    await recordFarrowing(litter.id, { farrowDate: '2026-04-29', bornAlive: 12, stillborn: 1, mummified: 0 })
    await recordWeaning(litter.id, { weanDate: '2026-05-27', weanedCount: 11 })
    const weaners = await createBatchFromLitter(litter.id, { strategy: 'growToMarket', name: 'Weaners' })
    weanersId = weaners.id
    await changeHeadCount(weanersId, -1, 'death', '2026-06-10')
    const bought = await createBatch({ name: 'Bought', kind: 'piglets', litterIds: [], headCount: 4, startDate: '2026-06-01', strategy: 'growToMarket' })
    boughtId = bought.id

    await addTransaction({ date: '2026-01-10', kind: 'capital', category: 'penConstruction', amount: 50000, links: {} })
    await addTransaction({ date: '2026-03-01', kind: 'expense', category: 'feed', amount: 1000, links: {} })
    await addTransaction({ date: '2026-05-20', kind: 'expense', category: 'feed', amount: 1170, links: {} })
    await addTransaction({ date: '2026-06-01', kind: 'expense', category: 'feed', amount: 4790, links: {} })
    await addTransaction({ date: '2026-06-01', kind: 'expense', category: 'stockPurchase', amount: 10000, links: { batchId: boughtId } })
    await addTransaction({ date: '2026-06-03', kind: 'expense', category: 'feed', amount: 2000, links: { batchId: weanersId } })
    await addTransaction({ date: '2026-06-05', kind: 'expense', category: 'medicineVaccine', amount: 200, links: { animalId: sow.id } })
    await recordSale({ date: '2026-06-30', buyerType: 'viajero', lines: [{ batchId: weanersId, headCount: 10, liveWeightKg: 900, pricePerKg: 185 }] })

    const oops = await createBatch({ name: 'Oops', kind: 'growers', litterIds: [], headCount: 3, startDate: '2026-06-15', strategy: 'undecided' })
    await recordBatchWeight(oops.id, { date: '2026-06-16', avgKg: 30 })
    await removeBatch(oops.id)
    await changeHeadCount(boughtId, -1, 'death', '2026-06-20')
    await undoEvent((await eventsFor('batch', boughtId)).find((e) => e.type === 'death')!.id)
    const wrong = await recordSale({ date: '2026-06-25', buyerType: 'market', lines: [{ batchId: boughtId, headCount: 1, pricePerHead: 5000 }] })
    await undoSale(wrong.id)
    costing = await computeFarmCosting(TODAY)
  })

  it('income statement for June', async () => {
    const txs = await db.transactions.toArray()
    const s = incomeStatement(txs, '2026-06-01', '2026-06-30')
    expect(s.revenue).toEqual([{ category: 'hogSales', amount: 166500 }])
    expect(s.expenses).toEqual([
      { category: 'stockPurchase', amount: 10000 },
      { category: 'feed', amount: 6790 }, // 4790 shared + 2000 Weaners
      { category: 'medicineVaccine', amount: 200 },
    ])
    expect(s.netIncome).toBe(149510) // 166500 - 16990
  })

  it('cash flow for the whole year to date', async () => {
    const txs = await db.transactions.toArray()
    const c = cashFlow(txs, '2026-01-01', TODAY)
    expect(c.capitalOut).toBe(50000)
    expect(c.operatingIn).toBe(166500)
    expect(c.operatingOut).toBe(19160) // 1000 + 1170 + 4790 + 10000 + 2000 + 200
    expect(c.netCash).toBe(97340) // 166500 - 19160 - 50000
    expect(c.openingBalance).toBe(0)
    expect(c.closingBalance).toBe(97340)
  })

  it('allocates every shared peso and costs the litter-born batch', () => {
    expect(costing.unallocated).toBe(0)
    const w = costing.batches.find((r) => r.batch.id === weanersId)!
    expect(w.startHead).toBe(11)
    expect(w.headSold).toBe(10)
    expect(w.kgSold).toBe(900)
    expect(w.costing.headDays).toBe(354) // 55 + 299 + 0 in July
    expect(w.costing.direct).toEqual([{ category: 'feed', amount: 2000 }])
    expect(w.costing.allocated).toBeCloseTo(3540, 6) // 550 + 2990
    expect(w.pigletCostPerHead).toBeCloseTo(1620 / 11, 6)
    expect(w.costing.pigletValue).toBeCloseTo(1620, 6)
    expect(w.costing.totalCost).toBeCloseTo(7160, 6) // 2000 + 3540 + 1620
    expect(w.costing.revenue).toBe(166500)
    expect(w.costing.profit).toBeCloseTo(159340, 6)
  })

  it('costs the bought batch with its stock purchase and no piglet value', () => {
    const b = costing.batches.find((r) => r.batch.id === boughtId)!
    expect(b.startHead).toBe(4)
    expect(b.pigletCostPerHead).toBeNull()
    expect(b.costing.headDays).toBe(244) // 30 + 31 days x 4
    expect(b.costing.direct).toEqual([{ category: 'stockPurchase', amount: 10000 }])
    expect(b.costing.allocated).toBeCloseTo(1200, 6)
    expect(b.costing.pigletValue).toBe(0)
    expect(b.costing.totalCost).toBeCloseTo(11200, 6)
    expect(b.costing.profit).toBeCloseTo(-11200, 6)
  })

  it('breeding herd cost, cost per weaned piglet, ROI and payback', async () => {
    const h = herdTotals(costing, '2026-01-01', '2026-06-30')
    expect(h.months).toHaveLength(6)
    expect(h.cost).toBeCloseTo(2420, 6) // 1000 + 620 + 600 + 200
    expect(h.weaned).toBe(11)
    expect(costPerWeanedPiglet(h.cost, h.weaned)).toBeCloseTo(220, 6)
    expect(costing.herdByMonth.get('2026-06')).toEqual({ direct: 200, allocated: 600, weaned: 0 })
    const txs = await db.transactions.toArray()
    expect(roi(149510, 50000)).toBeCloseTo(2.9902, 4)
    expect(paybackDate(txs)).toBe('2026-06-30')
  })
})
