import type { ISODate } from '../types'
import { daysBetween, plusDays } from './dates'

export interface Weighing {
  date: ISODate
  kg: number
}

// Average daily gain in kg/day between the earliest and latest weighing.
export function adg(weights: Weighing[]): number | null {
  if (weights.length < 2) return null
  const sorted = [...weights].sort((a, b) => a.date.localeCompare(b.date))
  const first = sorted[0]
  const last = sorted[sorted.length - 1]
  const days = daysBetween(first.date, last.date)
  if (days <= 0) return null
  return (last.kg - first.kg) / days
}

export function projectedWeight(last: Weighing, adgKgPerDay: number, onDate: ISODate): number {
  return last.kg + adgKgPerDay * daysBetween(last.date, onDate)
}

// Whole days until the target weight; 0 when already there; null when not growing.
export function daysToTarget(currentKg: number, targetKg: number, adgKgPerDay: number | null): number | null {
  if (currentKg >= targetKg) return 0
  if (!adgKgPerDay || adgKgPerDay <= 0) return null
  return Math.ceil((targetKg - currentKg) / adgKgPerDay)
}

export function dateToTarget(last: Weighing, targetKg: number, adgKgPerDay: number | null): ISODate | null {
  const days = daysToTarget(last.kg, targetKg, adgKgPerDay)
  return days === null ? null : plusDays(last.date, days)
}
