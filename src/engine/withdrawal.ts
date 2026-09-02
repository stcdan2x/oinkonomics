import type { FarmEvent, ISODate } from '../types'
import { plusDays } from './dates'

export const withdrawalEnd = (lastDoseDate: ISODate, withdrawalDays: number): ISODate =>
  plusDays(lastDoseDate, withdrawalDays)

export interface WithdrawalBlock {
  eventId: string
  product: string
  until: ISODate
}

const withdrawalDaysOf = (e: FarmEvent): number | null => {
  const d = e.data.withdrawalDays
  return typeof d === 'number' && Number.isFinite(d) && d >= 0 ? d : null
}

// Every treatment-like event with a numeric withdrawal contributes an end date.
function ends(events: FarmEvent[]): WithdrawalBlock[] {
  return events
    .filter((e) => !e.deletedAt && (e.type === 'treatment' || e.type === 'vaccination' || e.type === 'deworming'))
    .flatMap((e) => {
      const days = withdrawalDaysOf(e)
      if (days === null) return []
      return [{ eventId: e.id, product: String(e.data.product ?? e.type), until: withdrawalEnd(e.date, days) }]
    })
}

export function earliestSaleDate(events: FarmEvent[]): ISODate | null {
  const all = ends(events)
  if (!all.length) return null
  return all.reduce((max, b) => (b.until > max ? b.until : max), all[0].until)
}

// The treatment whose withdrawal still runs on saleDate (latest end wins), or null.
export function saleBlockedBy(events: FarmEvent[], saleDate: ISODate): WithdrawalBlock | null {
  const blocking = ends(events).filter((b) => b.until > saleDate)
  if (!blocking.length) return null
  return blocking.reduce((a, b) => (b.until > a.until ? b : a))
}
