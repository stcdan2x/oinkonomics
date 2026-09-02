import type { InventoryItem, ISODate, StockMove } from '../types'
import { daysBetween, plusDays } from './dates'

export const EXPIRY_WARNING_DAYS = 30
export const USAGE_WINDOW_DAYS = 14
// Key for consumption recorded without a batch (breeding herd or general use).
export const HERD_USAGE = 'herd'

export type StockAlertType = 'lowStock' | 'expiring' | 'expired'
export interface StockAlert {
  itemId: string
  type: StockAlertType
  daysToExpiry?: number
}

// Low stock at or below the reorder level (a level of 0 still alerts at 0);
// expiry alerts only while there is stock to worry about.
export function stockAlerts(items: InventoryItem[], today: ISODate): StockAlert[] {
  const out: StockAlert[] = []
  for (const i of items) {
    if (i.deletedAt) continue
    if (i.qtyOnHand <= i.reorderLevel) out.push({ itemId: i.id, type: 'lowStock' })
    if (i.expiryDate && i.qtyOnHand > 0) {
      const days = daysBetween(today, i.expiryDate)
      if (days < 0) out.push({ itemId: i.id, type: 'expired', daysToExpiry: days })
      else if (days <= EXPIRY_WARNING_DAYS) out.push({ itemId: i.id, type: 'expiring', daysToExpiry: days })
    }
  }
  return out
}

const liveConsumption = (moves: StockMove[]) => moves.filter((m) => !m.deletedAt && m.reason === 'consumption')

// Days the average is taken over: the window, or the shorter history since the
// first consumption on record, so a feed started three days ago is not
// averaged over fourteen.
function usageDays(consumption: StockMove[], today: ISODate, windowDays: number): number {
  if (!consumption.length) return 0
  const first = consumption.reduce((a, m) => (m.date < a ? m.date : a), consumption[0].date)
  return Math.max(1, Math.min(windowDays, daysBetween(first, today) + 1))
}

function inWindow(moves: StockMove[], today: ISODate, windowDays: number): StockMove[] {
  const from = plusDays(today, -(windowDays - 1))
  return moves.filter((m) => m.date >= from && m.date <= today)
}

// Average units consumed per day over the window ending today; 0 without history.
export function dailyUsage(moves: StockMove[], today: ISODate, windowDays = USAGE_WINDOW_DAYS): number {
  const consumption = liveConsumption(moves)
  const days = usageDays(consumption, today, windowDays)
  if (!days) return 0
  const used = inWindow(consumption, today, windowDays).reduce((s, m) => s - m.qtyDelta, 0)
  return used / days
}

export function daysRemaining(qtyOnHand: number, perDay: number): number | null {
  if (!(perDay > 0)) return null
  return Math.floor(qtyOnHand / perDay)
}

// The same daily rate split by the batch each consumption was recorded against.
export function usageByBatch(moves: StockMove[], today: ISODate, windowDays = USAGE_WINDOW_DAYS): Map<string, number> {
  const consumption = liveConsumption(moves)
  const days = usageDays(consumption, today, windowDays)
  const out = new Map<string, number>()
  if (!days) return out
  for (const m of inWindow(consumption, today, windowDays)) {
    const key = m.batchId ?? HERD_USAGE
    out.set(key, (out.get(key) ?? 0) - m.qtyDelta / days)
  }
  return out
}
