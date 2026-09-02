import { describe, expect, it } from 'vitest'
import type { InventoryItem, StockMove } from '../types'
import { dailyUsage, daysRemaining, EXPIRY_WARNING_DAYS, stockAlerts, usageByBatch, USAGE_WINDOW_DAYS } from './inventory'

const item = (over: Partial<InventoryItem>): InventoryItem =>
  ({ id: 'i', name: 'Item', category: 'feed', unit: 'bag', qtyOnHand: 5, reorderLevel: 2, unitCost: 0, updatedAt: '', ...over }) as InventoryItem
const use = (over: Partial<StockMove>): StockMove =>
  ({ id: 'm', itemId: 'i', date: '2026-06-10', qtyDelta: -1, reason: 'consumption', updatedAt: '', ...over }) as StockMove

const TODAY = '2026-06-14'

describe('stockAlerts', () => {
  it('flags stock at or below the reorder level, including out of stock at level 0', () => {
    const alerts = stockAlerts([item({ id: 'low', qtyOnHand: 2 }), item({ id: 'out', qtyOnHand: 0, reorderLevel: 0 }), item({ id: 'ok' })], TODAY)
    expect(alerts).toEqual([
      { itemId: 'low', type: 'lowStock' },
      { itemId: 'out', type: 'lowStock' },
    ])
  })

  it('warns on expiry within the window and reports expired stock, but only while stock is on hand', () => {
    expect(EXPIRY_WARNING_DAYS).toBe(30)
    const alerts = stockAlerts(
      [
        item({ id: 'soon', expiryDate: '2026-07-14' }),
        item({ id: 'later', expiryDate: '2026-07-15' }),
        item({ id: 'gone', expiryDate: '2026-06-13' }),
        item({ id: 'empty', expiryDate: '2026-06-01', qtyOnHand: 0, reorderLevel: 0 }),
        item({ id: 'deleted', expiryDate: '2026-06-01', deletedAt: '2026-06-02T00:00:00.000Z' }),
      ],
      TODAY,
    )
    expect(alerts).toEqual([
      { itemId: 'soon', type: 'expiring', daysToExpiry: 30 },
      { itemId: 'gone', type: 'expired', daysToExpiry: -1 },
      { itemId: 'empty', type: 'lowStock' },
    ])
  })
})

describe('dailyUsage', () => {
  it('averages consumption over the 14-day window ending today, ignoring other moves', () => {
    expect(USAGE_WINDOW_DAYS).toBe(14)
    const moves = [
      use({ id: 'a', date: '2026-05-31', qtyDelta: -2 }), // day before the window
      use({ id: 'b', date: '2026-06-01', qtyDelta: -3 }),
      use({ id: 'c', date: '2026-06-10', qtyDelta: -4 }),
      use({ id: 'd', date: '2026-06-05', qtyDelta: 10, reason: 'purchase' }),
      use({ id: 'e', date: '2026-06-08', qtyDelta: -1, reason: 'loss' }),
      use({ id: 'f', date: '2026-06-12', qtyDelta: -5, deletedAt: '2026-06-12T00:00:00.000Z' }),
    ]
    expect(dailyUsage(moves, TODAY)).toBeCloseTo(7 / 14, 9)
  })

  it('divides by the days since the first consumption when the history is younger than the window', () => {
    const moves = [use({ id: 'a', date: '2026-06-12', qtyDelta: -3 }), use({ id: 'b', date: '2026-06-13', qtyDelta: -3 })]
    expect(dailyUsage(moves, TODAY)).toBe(2)
  })

  it('is 0 with no consumption at all', () => {
    expect(dailyUsage([use({ reason: 'purchase', qtyDelta: 4 })], TODAY)).toBe(0)
    expect(dailyUsage([], TODAY)).toBe(0)
  })
})

describe('daysRemaining', () => {
  it('rounds down the days the stock on hand lasts, or has no answer without usage', () => {
    expect(daysRemaining(10, 0)).toBeNull()
    expect(daysRemaining(10, 0.5)).toBe(20)
    expect(daysRemaining(7, 2)).toBe(3)
    expect(daysRemaining(0, 2)).toBe(0)
  })
})

describe('usageByBatch', () => {
  it('splits the daily rate by batch, with unlinked use under the herd key', () => {
    const moves = [
      use({ id: 'a', date: '2026-06-10', qtyDelta: -3, batchId: 'b1' }),
      use({ id: 'b', date: '2026-06-12', qtyDelta: -1, batchId: 'b1' }),
      use({ id: 'c', date: '2026-06-11', qtyDelta: -2 }),
    ]
    const rate = usageByBatch(moves, TODAY)
    expect(rate.get('b1')).toBeCloseTo(0.8, 9)
    expect(rate.get('herd')).toBeCloseTo(0.4, 9)
  })
})
