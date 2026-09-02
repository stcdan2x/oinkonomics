import { HERD_DEFAULTS as H } from '../knowledge/parameters'
import type { Animal, Batch, FarmEvent, InventoryItem, ISODate, Litter, StockMove, StrategyId, Transaction } from '../types'
import type { CalendarItem, MilestoneType } from './breeding'
import { isOpenLitter } from './breeding'
import { headCountOn, monthOf, monthRange, type HeadCountChange } from './costing'
import { plusDays } from './dates'
import { incomeStatement, type Period } from './finance'
import { projectedWeight, type Weighing } from './growth'
import { dailyUsage, daysRemaining, type StockAlert, type StockAlertType } from './inventory'
import { defaultParams, type EngineParams } from './params'

// Dashboard rules fixed for v1 are written in TASK 001 section 4 (Phase P7).

const live = <T extends { deletedAt?: string | null }>(rows: T[]) => rows.filter((r) => !r.deletedAt)

export interface HeadsByStage {
  sows: number
  gilts: number
  boars: number
  piglets: number
  growers: number
  finishers: number
  total: number
}

// Breeders from the animal rows; pigs from the batch head counts by kind, plus
// any individual active pig that is not inside a batch (a pig in a batch is
// counted once, in its batch).
export function headsByStage(animals: Animal[], batches: Batch[]): HeadsByStage {
  const out = { sows: 0, gilts: 0, boars: 0, piglets: 0, growers: 0, finishers: 0, total: 0 }
  for (const a of live(animals)) {
    if (a.status !== 'active') continue
    if (a.role === 'sow') out.sows++
    else if (a.role === 'gilt') out.gilts++
    else if (a.role === 'boar') out.boars++
    else if (!a.batchId) {
      if (a.role === 'piglet') out.piglets++
      else if (a.role === 'grower') out.growers++
      else out.finishers++
    }
  }
  for (const b of live(batches)) out[b.kind] += b.headCount
  out.total = out.sows + out.gilts + out.boars + out.piglets + out.growers + out.finishers
  return out
}

export const SOWS_DUE_DAYS = 14

export interface SowDue {
  litterId: string
  sowId: string
  date: ISODate
  overdue: boolean
}

// Open litters not yet farrowed whose expected farrowing is within the window,
// plus the overdue ones; earliest first.
export function sowsDue(litters: Litter[], today: ISODate, days = SOWS_DUE_DAYS): SowDue[] {
  const to = plusDays(today, days)
  return live(litters)
    .filter((l) => isOpenLitter(l) && !l.farrowDate && l.expectedFarrowDate <= to)
    .map((l) => ({ litterId: l.id, sowId: l.sowId, date: l.expectedFarrowDate, overdue: l.expectedFarrowDate < today }))
    .sort((a, b) => a.date.localeCompare(b.date) || a.litterId.localeCompare(b.litterId))
}

export interface BatchStatus {
  batch: Batch
  lastWeight: Weighing | null
  adg: number | null
  daysOnFarm: number
}

export interface BatchReady {
  batch: Batch
  targetKg: number
  by: 'weight' | 'age'
  kgNow: number | null
}

function target(strategy: StrategyId, p: EngineParams): { kg: number; ageDays: number } | null {
  if (strategy === 'sellWeaners') return { kg: p.weanerWeightKg, ageDays: p.weanerSaleAgeDays }
  if (strategy === 'growToRoaster') return { kg: p.roasterWeightKg, ageDays: p.roasterAgeDays }
  if (strategy === 'growToMarket') return { kg: p.marketWeightKg, ageDays: p.marketAgeDays }
  return null
}

// Ready by weight when the projected weight today (last weighing plus ADG, or
// the last weighing alone) reaches the strategy's target kg; with no weighing,
// ready by age when the days on farm reach the target age less the weaning age
// (a litter batch starts at weaning). Undecided and empty batches never.
export function batchesReady(statuses: BatchStatus[], today: ISODate, p: EngineParams = defaultParams()): BatchReady[] {
  const out: BatchReady[] = []
  for (const s of statuses) {
    if (s.batch.deletedAt || s.batch.headCount <= 0) continue
    const t = target(s.batch.strategy, p)
    if (!t) continue
    if (s.lastWeight) {
      const kgNow = s.adg !== null ? projectedWeight(s.lastWeight, s.adg, today) : s.lastWeight.kg
      if (kgNow >= t.kg) out.push({ batch: s.batch, targetKg: t.kg, by: 'weight', kgNow })
    } else if (s.daysOnFarm >= t.ageDays - H.weaningAgeDays.value) {
      out.push({ batch: s.batch, targetKg: t.kg, by: 'age', kgNow: null })
    }
  }
  return out
}

// Batch death events carry the head removed as a negative delta; an animal
// death event is one pig.
export function deathsInPeriod(events: FarmEvent[], from: ISODate, to: ISODate): number {
  return live(events)
    .filter((e) => e.type === 'death' && e.date >= from && e.date <= to)
    .reduce((n, e) => n + (e.subjectType === 'batch' ? Math.abs(Number(e.data.delta) || 0) : 1), 0)
}

export function monthsOf(from: ISODate, to: ISODate): string[] {
  const out: string[] = []
  for (let m = monthOf(from); m <= monthOf(to); m = monthOf(plusDays(monthRange(m).to, 1))) out.push(m)
  return out
}

// The months a chart shows: the period, clamped to the months that hold dated
// records and never past this month or the latest dated record (an all-time
// period would otherwise span years 0001 to 9999). No records: this month.
export function chartRange(period: Period, dates: ISODate[], today: ISODate): Period {
  const earliest = dates.length ? dates.reduce((a, b) => (a < b ? a : b)) : today
  const latest = dates.reduce((a, b) => (a > b ? a : b), today)
  const floor = monthRange(monthOf(earliest)).from
  const ceil = monthRange(monthOf(latest)).to
  return { from: period.from > floor ? period.from : floor, to: period.to < ceil ? period.to : ceil }
}

export interface MonthPoint {
  month: string
  revenue: number
  expenses: number
  profit: number
}

// One point per calendar month touching the period: the operating result only.
export function monthlyFinance(txs: Transaction[], from: ISODate, to: ISODate): MonthPoint[] {
  return monthsOf(from, to).map((month) => {
    const r = monthRange(month)
    const s = incomeStatement(txs, r.from, r.to)
    return { month, revenue: s.totalRevenue, expenses: s.totalExpenses, profit: s.netIncome }
  })
}

export interface BatchChanges {
  batch: Batch
  changes: HeadCountChange[]
}

export interface HerdCountPoint {
  month: string
  breeders: number
  pigs: number
  total: number
}

const BREEDER_ROLES = new Set<Animal['role']>(['sow', 'gilt', 'boar'])

// A breeder counts from its birth date (always, when none is recorded) until
// the date its status left active.
function breederAlive(a: Animal, date: ISODate): boolean {
  if (a.birthDate && a.birthDate > date) return false
  if (a.status !== 'active' && a.statusDate && a.statusDate <= date) return false
  return true
}

// Breeders alive and batch head at the end of each month of the period.
export function herdCountSeries(animals: Animal[], batches: BatchChanges[], from: ISODate, to: ISODate): HerdCountPoint[] {
  const breeders = live(animals).filter((a) => BREEDER_ROLES.has(a.role))
  const liveBatches = batches.filter((b) => !b.batch.deletedAt)
  return monthsOf(from, to).map((month) => {
    const end = monthRange(month).to
    const alive = breeders.filter((a) => breederAlive(a, end)).length
    const pigs = liveBatches.reduce((n, b) => n + headCountOn(b.batch, b.changes, end), 0)
    return { month, breeders: alive, pigs, total: alive + pigs }
  })
}

// (direct + allocated) / (kg gained per head x current head); null with fewer
// than two weighings or no gain.
export function costPerKgGain(costing: { direct: number; allocated: number }, weights: Weighing[], headCount: number): number | null {
  if (weights.length < 2 || headCount <= 0) return null
  const sorted = [...weights].sort((a, b) => a.date.localeCompare(b.date))
  const gain = sorted[sorted.length - 1].kg - sorted[0].kg
  if (!(gain > 0)) return null
  return (costing.direct + costing.allocated) / (gain * headCount)
}

// The shortest days-left over the feed items with usage; null when none has usage.
export function feedDaysRemaining(items: InventoryItem[], moves: StockMove[], today: ISODate): number | null {
  let min: number | null = null
  for (const i of live(items)) {
    if (i.category !== 'feed') continue
    const left = daysRemaining(i.qtyOnHand, dailyUsage(moves.filter((m) => m.itemId === i.id), today))
    if (left !== null && (min === null || left < min)) min = left
  }
  return min
}

export const ALERT_MILESTONE_DAYS = 7

export type DashboardAlert =
  | { type: 'farrowingOverdue'; litterId: string; sowId: string; date: ISODate }
  | { type: 'stock'; itemId: string; alert: StockAlertType; daysToExpiry: number | undefined }
  | { type: 'batchReady'; batchId: string; targetKg: number; by: 'weight' | 'age'; kgNow: number | null }
  | { type: 'milestone'; litterId: string; sowId: string; milestone: MilestoneType; date: ISODate }

export interface AlertInput {
  stock: StockAlert[]
  sowsDue: SowDue[]
  ready: BatchReady[]
  calendar: CalendarItem[] // milestones already limited to the coming week
}

const STOCK_RANK: Record<StockAlertType, number> = { expired: 0, lowStock: 1, expiring: 2 }

// Overdue farrowings first, then stock (expired, low, expiring), then batches
// ready, then this week's milestones by date.
export function dashboardAlerts(input: AlertInput): DashboardAlert[] {
  const out: DashboardAlert[] = []
  for (const s of input.sowsDue) if (s.overdue) out.push({ type: 'farrowingOverdue', litterId: s.litterId, sowId: s.sowId, date: s.date })
  const stock = [...input.stock].sort((a, b) => STOCK_RANK[a.type] - STOCK_RANK[b.type] || a.itemId.localeCompare(b.itemId))
  for (const a of stock) out.push({ type: 'stock', itemId: a.itemId, alert: a.type, daysToExpiry: a.daysToExpiry })
  for (const r of input.ready) out.push({ type: 'batchReady', batchId: r.batch.id, targetKg: r.targetKg, by: r.by, kgNow: r.kgNow })
  for (const c of [...input.calendar].sort((a, b) => a.date.localeCompare(b.date) || a.type.localeCompare(b.type))) {
    out.push({ type: 'milestone', litterId: c.litterId, sowId: c.sowId, milestone: c.type, date: c.date })
  }
  return out
}
