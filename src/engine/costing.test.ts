import { describe, expect, it } from 'vitest'
import type { InventoryItem, StockMove, Transaction } from '../types'
import { allocate, allocateSharedByMonth, batchCosting, headCountOn, headDays, intervalHeadDays, isShared, isStockPurchase, monthOf, monthRange, stockCostRows } from './costing'

// Batch of 11 started 2026-05-27; 1 death on 06-10 (10 left), 4 sold on 07-01 (6 left), 6 sold on 07-15 (0 left).
const batch = { id: 'b1', startDate: '2026-05-27', headCount: 0 }
const changes = [
  { date: '2026-06-10', delta: -1 },
  { date: '2026-07-01', delta: -4 },
  { date: '2026-07-15', delta: -6 },
]

describe('headCountOn', () => {
  it('walks the head-count history backwards from the current count', () => {
    expect(headCountOn(batch, changes, '2026-05-26')).toBe(0) // before start
    expect(headCountOn(batch, changes, '2026-05-27')).toBe(11)
    expect(headCountOn(batch, changes, '2026-06-09')).toBe(11)
    expect(headCountOn(batch, changes, '2026-06-10')).toBe(10) // a change counts on its own day
    expect(headCountOn(batch, changes, '2026-07-01')).toBe(6)
    expect(headCountOn(batch, changes, '2026-07-15')).toBe(0)
  })
})

describe('headDays', () => {
  it('sums the daily head count over an inclusive period, clipped to the batch life', () => {
    // May 27-31: 5 days x 11 = 55
    expect(headDays(batch, changes, '2026-05-01', '2026-05-31')).toBe(55)
    // June 1-9: 9 x 11 = 99; June 10-30: 21 x 10 = 210; total 309
    expect(headDays(batch, changes, '2026-06-01', '2026-06-30')).toBe(309)
    // July 1-14: 14 x 6 = 84; July 15-31: 0
    expect(headDays(batch, changes, '2026-07-01', '2026-07-31')).toBe(84)
    expect(headDays(batch, changes, '2026-08-01', '2026-08-31')).toBe(0)
  })
})

describe('intervalHeadDays', () => {
  it('counts the overlap of each breeder interval with the period', () => {
    const breeders = [
      { from: '2026-01-10', to: undefined }, // sow on farm all month
      { from: '2026-06-16', to: undefined }, // gilt bought mid-June: 15 days
      { from: undefined, to: '2026-06-05' }, // boar culled 06-05, no known start: 5 days
      { from: '2026-07-01', to: undefined }, // arrives after the period: 0
    ]
    expect(intervalHeadDays(breeders, '2026-06-01', '2026-06-30')).toBe(30 + 15 + 5)
  })
})

describe('allocate', () => {
  it('splits an amount in proportion to head-days', () => {
    const out = allocate(1000, [{ id: 'a', headDays: 300 }, { id: 'b', headDays: 100 }])
    expect(out.get('a')).toBeCloseTo(750)
    expect(out.get('b')).toBeCloseTo(250)
  })
  it('allocates nothing when no unit has head-days', () => {
    expect(allocate(1000, [{ id: 'a', headDays: 0 }]).size).toBe(0)
  })
})

describe('month helpers', () => {
  it('keys and bounds a calendar month', () => {
    expect(monthOf('2026-06-10')).toBe('2026-06')
    expect(monthRange('2026-02')).toEqual({ from: '2026-02-01', to: '2026-02-28' })
  })
})

let n = 0
const tx = (date: string, kind: Transaction['kind'], category: string, amount: number, links: Transaction['links'] = {}): Transaction => ({
  id: `t${++n}`, updatedAt: 'x', deletedAt: null, date, kind, category, amount, links,
})

describe('allocateSharedByMonth', () => {
  it('allocates each month of shared expenses by that month head-days and reports what could not be allocated', () => {
    const shared = [
      tx('2026-06-01', 'expense', 'feed', 3090), // June: b1 309 hd, herd 30 hd -> b1 2816.37, herd 273.63
      tx('2026-06-20', 'expense', 'labour', 339), // June too: total 3429
      tx('2026-07-05', 'expense', 'feed', 840), // July: b1 84 hd, herd 0 -> all to b1
      tx('2026-08-02', 'expense', 'water', 100), // August: nobody -> unallocated
    ]
    const units = (month: string) =>
      month === '2026-06' ? [{ id: 'b1', headDays: 309 }, { id: 'herd', headDays: 30 }]
      : month === '2026-07' ? [{ id: 'b1', headDays: 84 }, { id: 'herd', headDays: 0 }]
      : [{ id: 'b1', headDays: 0 }, { id: 'herd', headDays: 0 }]
    const r = allocateSharedByMonth(shared, units)
    expect(r.byUnit.get('b1')).toBeCloseTo(3429 * 309 / 339 + 840, 2) // 3125.5 + 840 = 3965.5
    expect(r.byUnit.get('herd')).toBeCloseTo(3429 * 30 / 339, 2) // 303.45
    expect(r.byUnitMonth.get('herd')?.get('2026-06')).toBeCloseTo(3429 * 30 / 339, 2)
    expect(r.unallocated).toBe(100)
  })
})

describe('batchCosting', () => {
  it('adds direct, allocated and piglet costs and nets them against revenue', () => {
    const txs = [
      tx('2026-06-03', 'expense', 'feed', 2000, { batchId: 'b1' }),
      tx('2026-06-20', 'expense', 'medicineVaccine', 300, { batchId: 'b1' }),
      tx('2026-06-21', 'expense', 'feed', 999, { batchId: 'other' }), // another batch
      tx('2026-07-15', 'revenue', 'hogSales', 20000, { batchId: 'b1', saleId: 's1' }),
    ]
    const c = batchCosting({ batchId: 'b1', txs, allocated: 3965.5, headDays: 448, startHead: 11, pigletCostPerHead: 500 })
    expect(c.direct).toEqual([{ category: 'feed', amount: 2000 }, { category: 'medicineVaccine', amount: 300 }])
    expect(c.directTotal).toBe(2300)
    expect(c.allocated).toBe(3965.5)
    expect(c.pigletValue).toBe(5500) // 11 x 500
    expect(c.totalCost).toBe(11765.5) // 2300 + 3965.5 + 5500
    expect(c.revenue).toBe(20000)
    expect(c.profit).toBe(8234.5)
    expect(c.headDays).toBe(448)
  })
})

describe('stock costing', () => {
  const item = { id: 'i1', name: 'Grower', category: 'feed', unit: 'bag', qtyOnHand: 0, reorderLevel: 0, unitCost: 1400, updatedAt: '' } as InventoryItem
  const move = (over: Partial<StockMove>): StockMove => ({ id: 'm', itemId: 'i1', date: '2026-06-02', qtyDelta: -2, reason: 'consumption', unitCost: 1500, updatedAt: '', ...over })

  it('tells a stock purchase from a plain shared expense', () => {
    const purchase = { id: 't', kind: 'expense', category: 'feed', amount: 9000, date: '2026-06-01', links: { itemId: 'i1' }, updatedAt: '' } as Transaction
    expect(isStockPurchase(purchase)).toBe(true)
    expect(isStockPurchase({ ...purchase, links: {} })).toBe(false)
    expect(isShared({ ...purchase, links: {} })).toBe(true)
    // a consumption row with no batch is shared even though it names its item
    expect(isShared({ ...purchase, id: 'm', links: { itemId: 'i1' } })).toBe(true)
  })

  it('turns consumption and loss moves into expense rows at the snapshot cost, linked to their batch', () => {
    const rows = stockCostRows(
      [
        move({ id: 'a', batchId: 'b1' }),
        move({ id: 'b', reason: 'loss', qtyDelta: -1, unitCost: undefined }),
        move({ id: 'c', reason: 'purchase', qtyDelta: 10 }),
        move({ id: 'd', reason: 'adjustment', qtyDelta: -1 }),
        move({ id: 'e', batchId: 'b1', deletedAt: '2026-06-03T00:00:00.000Z' }),
      ],
      [item],
    )
    expect(rows).toEqual([
      expect.objectContaining({ id: 'a', kind: 'expense', category: 'feed', amount: 3000, date: '2026-06-02', links: { batchId: 'b1', itemId: 'i1' } }),
      expect.objectContaining({ id: 'b', kind: 'expense', category: 'feed', amount: 1400, links: { batchId: undefined, itemId: 'i1' } }),
    ])
  })

  it('maps medicine and supply items to their ledger categories and skips moves of unknown items', () => {
    const med = { ...item, id: 'i2', category: 'medicine', unitCost: 100 } as InventoryItem
    const rows = stockCostRows([move({ id: 'a', itemId: 'i2', qtyDelta: -1, unitCost: 120 }), move({ id: 'b', itemId: 'gone' })], [item, med])
    expect(rows).toHaveLength(1)
    expect(rows[0]).toMatchObject({ category: 'medicineVaccine', amount: 120 })
  })
})
