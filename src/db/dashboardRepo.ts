import { breedingCalendar } from '../engine/breeding'
import type { HeadCountChange } from '../engine/costing'
import {
  ALERT_MILESTONE_DAYS,
  batchesReady,
  chartRange,
  costPerKgGain,
  dashboardAlerts,
  deathsInPeriod,
  feedDaysRemaining,
  headsByStage,
  herdCountSeries,
  monthlyFinance,
  sowsDue,
  type BatchReady,
  type DashboardAlert,
  type HeadsByStage,
  type HerdCountPoint,
  type MonthPoint,
  type SowDue,
} from '../engine/dashboard'
import { plusDays } from '../engine/dates'
import { cashFlow, incomeStatement, type IncomeStatement, type Period } from '../engine/finance'
import { stockAlerts } from '../engine/inventory'
import type { ISODate } from '../types'
import { batchSummary, weightsForBatch } from './batchRepo'
import { computeFarmCosting } from './costingRepo'
import { db } from './db'
import { getFarm } from './farmRepo'
import { listPrices } from './priceLogRepo'

export interface DashboardData {
  heads: HeadsByStage
  sowsDue: SowDue[]
  ready: BatchReady[]
  cashOnHand: number
  statement: IncomeStatement
  deaths: number
  feedDays: number | null
  alerts: DashboardAlert[]
  monthly: MonthPoint[]
  herd: HerdCountPoint[]
  costPerKgGain: { batchId: string; name: string; value: number }[]
  prices: { date: ISODate; value: number }[]
  names: { sows: Map<string, string>; batches: Map<string, string>; items: Map<string, string> }
}

// Gathers every dashboard input from the tables and applies the engine rules
// (TASK 001 section 4, Phase P7). Period figures use `period`; herd, stock and
// alert figures use `today`.
export async function computeDashboard(period: Period, today: ISODate): Promise<DashboardData> {
  const [farm, animals, batches, litters, events, txs, items, moves, priceRows, costing] = await Promise.all([
    getFarm(),
    db.animals.toArray(),
    db.batches.toArray(),
    db.litters.toArray(),
    db.events.toArray(),
    db.transactions.toArray(),
    db.inventoryItems.toArray(),
    db.stockMoves.toArray(),
    listPrices('liveweightPerKg'),
    computeFarmCosting(today),
  ])
  const liveBatches = batches.filter((b) => !b.deletedAt)
  const liveItems = items.filter((i) => !i.deletedAt)

  const statuses = await Promise.all(
    liveBatches.filter((b) => b.headCount > 0).map(async (b) => ({ batch: b, ...(await batchSummary(b, today)) })),
  )
  const ready = batchesReady(statuses, today)
  const due = sowsDue(litters, today)

  const changes = new Map<string, HeadCountChange[]>()
  for (const e of events) {
    if (e.deletedAt || e.subjectType !== 'batch' || typeof e.data.delta !== 'number') continue
    changes.set(e.subjectId, [...(changes.get(e.subjectId) ?? []), { date: e.date, delta: e.data.delta }])
  }

  const gains = await Promise.all(
    costing.batches.map(async (row) => ({
      batchId: row.batch.id,
      name: row.batch.name,
      value: costPerKgGain({ direct: row.costing.directTotal, allocated: row.costing.allocated }, await weightsForBatch(row.batch.id), row.batch.headCount),
    })),
  )

  // Charts show the period clamped to the months that hold records.
  const dated = [
    ...(farm ? [farm.startDate] : []),
    ...txs.filter((t) => !t.deletedAt).map((t) => t.date),
    ...liveBatches.map((b) => b.startDate),
    ...litters.filter((l) => !l.deletedAt).map((l) => l.serviceDate),
  ]
  const range = chartRange(period, dated, today)

  return {
    heads: headsByStage(animals, batches),
    sowsDue: due,
    ready,
    cashOnHand: cashFlow(txs, '0001-01-01', period.to).closingBalance,
    statement: incomeStatement(txs, period.from, period.to),
    deaths: deathsInPeriod(events, period.from, period.to),
    feedDays: feedDaysRemaining(liveItems, moves, today),
    alerts: dashboardAlerts({
      stock: stockAlerts(liveItems, today),
      sowsDue: due,
      ready,
      calendar: breedingCalendar(litters.filter((l) => !l.deletedAt), today, plusDays(today, ALERT_MILESTONE_DAYS)),
    }),
    monthly: monthlyFinance(txs, range.from, range.to),
    herd: herdCountSeries(animals, liveBatches.map((b) => ({ batch: b, changes: changes.get(b.id) ?? [] })), range.from, range.to),
    costPerKgGain: gains.filter((g): g is { batchId: string; name: string; value: number } => g.value !== null),
    prices: [...priceRows].reverse().map((o) => ({ date: o.date, value: o.value })),
    names: {
      sows: new Map(animals.map((a) => [a.id, a.tag])),
      batches: new Map(batches.map((b) => [b.id, b.name])),
      items: new Map(items.map((i) => [i.id, i.name])),
    },
  }
}
