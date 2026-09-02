import type { Animal, Batch, ISODate, Transaction } from '../types'
import { plusDays } from '../engine/dates'
import {
  allocateSharedByMonth,
  batchCosting,
  headCountOn,
  headDays,
  intervalHeadDays,
  isShared,
  isStockPurchase,
  monthOf,
  monthRange,
  stockCostRows,
  type BatchCosting,
  type HeadCountChange,
  type Interval,
} from '../engine/costing'
import { db } from './db'

export const HERD_UNIT = 'herd'
// Cost per weaned piglet looks back over the batch start month and the four
// before it (about one gestation plus lactation), so sow costs incurred
// during the pregnancy reach the piglets they produced.
export const PIGLET_COST_MONTHS = 5

export interface HerdMonth {
  direct: number
  allocated: number
  weaned: number
}

export interface BatchCostingRow {
  batch: Batch
  costing: BatchCosting
  startHead: number
  headSold: number
  kgSold: number | null
  pigletCostPerHead: number | null
}

export interface FarmCosting {
  batches: BatchCostingRow[]
  herdByMonth: Map<string, HerdMonth>
  unallocated: number
}

const BREEDER_ROLES = new Set<Animal['role']>(['sow', 'gilt', 'boar'])

function breederInterval(a: Animal, txById: Map<string, Transaction>): Interval {
  const purchase = a.purchaseTransactionId ? txById.get(a.purchaseTransactionId)?.date : undefined
  return { from: purchase ?? a.birthDate, to: a.status === 'active' ? undefined : a.statusDate }
}

function monthsBetween(from: ISODate, to: ISODate): string[] {
  const out: string[] = []
  for (let m = monthOf(from); m <= monthOf(to); m = monthOf(plusDays(monthRange(m).to, 1))) out.push(m)
  return out
}

export async function computeFarmCosting(today: ISODate): Promise<FarmCosting> {
  const [allTxs, allBatches, animals, events, litters, sales, moves, items] = await Promise.all([
    db.transactions.toArray(),
    db.batches.toArray(),
    db.animals.toArray(),
    db.events.toArray(),
    db.litters.toArray(),
    db.sales.toArray(),
    db.stockMoves.toArray(),
    db.inventoryItems.toArray(),
  ])
  // Stock purchases leave the ledger rows here and come back as consumption
  // and loss rows valued at cost (P5 rule): bought-but-unused stock is on hand,
  // charged to nobody yet.
  const txs = [...allTxs.filter((t) => !t.deletedAt && !isStockPurchase(t)), ...stockCostRows(moves, items)]
  const batches = allBatches.filter((b) => !b.deletedAt)
  const txById = new Map(txs.map((t) => [t.id, t]))
  const breeders = animals.filter((a) => !a.deletedAt && BREEDER_ROLES.has(a.role))
  const breederIds = new Set(breeders.map((a) => a.id))
  const intervals = breeders.map((a) => breederInterval(a, txById))

  const changesByBatch = new Map<string, HeadCountChange[]>()
  for (const e of events) {
    if (e.deletedAt || e.subjectType !== 'batch' || typeof e.data.delta !== 'number') continue
    const list = changesByBatch.get(e.subjectId) ?? []
    list.push({ date: e.date, delta: e.data.delta })
    changesByBatch.set(e.subjectId, list)
  }
  const changesFor = (b: Batch) => changesByBatch.get(b.id) ?? []

  // Expenses linked to a breeder are herd direct costs; expenses linked to any
  // other animal have no batch and are treated as shared.
  const herdDirect = txs.filter((t) => t.kind === 'expense' && t.links.animalId && breederIds.has(t.links.animalId))
  const shared = txs.filter((t) => isShared(t) || (t.kind === 'expense' && t.links.animalId && !breederIds.has(t.links.animalId)))

  const unitsFor = (month: string) => {
    const { from, to } = monthRange(month)
    return [
      ...batches.map((b) => ({ id: b.id, headDays: headDays(b, changesFor(b), from, to) })),
      { id: HERD_UNIT, headDays: intervalHeadDays(intervals, from, to) },
    ]
  }
  const alloc = allocateSharedByMonth(shared, unitsFor)

  const dates = [...txs.map((t) => t.date), ...batches.map((b) => b.startDate), ...litters.map((l) => l.weanDate).filter((d): d is ISODate => !!d)]
  const first = dates.length ? dates.reduce((a, b) => (a < b ? a : b)) : today
  const herdByMonth = new Map<string, HerdMonth>()
  for (const m of monthsBetween(first, today)) {
    herdByMonth.set(m, {
      direct: herdDirect.filter((t) => monthOf(t.date) === m).reduce((s, t) => s + t.amount, 0),
      allocated: alloc.byUnitMonth.get(HERD_UNIT)?.get(m) ?? 0,
      weaned: litters.filter((l) => !l.deletedAt && l.weanDate && monthOf(l.weanDate) === m).reduce((s, l) => s + l.weanedCount, 0),
    })
  }

  const pigletCostAt = (startDate: ISODate): number | null => {
    const months = [...herdByMonth.keys()].filter((m) => m <= monthOf(startDate)).slice(-PIGLET_COST_MONTHS)
    const rows = months.map((m) => herdByMonth.get(m)!)
    const weaned = rows.reduce((s, r) => s + r.weaned, 0)
    const cost = rows.reduce((s, r) => s + r.direct + r.allocated, 0)
    return weaned > 0 ? cost / weaned : null
  }

  const rows: BatchCostingRow[] = batches.map((b) => {
    const changes = changesFor(b)
    const startHead = headCountOn(b, changes, b.startDate)
    // Only litter-born batches carry a piglet transfer value; bought weaners are a direct stock purchase.
    const pigletCostPerHead = b.litterIds.length > 0 ? pigletCostAt(b.startDate) : null
    const lines = sales.filter((s) => !s.deletedAt).flatMap((s) => s.lines.filter((l) => l.batchId === b.id))
    const headSold = lines.reduce((s, l) => s + l.headCount, 0)
    const kgs = lines.map((l) => l.liveWeightKg).filter((k): k is number => typeof k === 'number')
    return {
      batch: b,
      startHead,
      headSold,
      kgSold: kgs.length ? kgs.reduce((s, k) => s + k, 0) : null,
      pigletCostPerHead,
      costing: batchCosting({
        batchId: b.id,
        txs,
        allocated: alloc.byUnit.get(b.id) ?? 0,
        headDays: headDays(b, changes, b.startDate, today),
        startHead,
        pigletCostPerHead: pigletCostPerHead ?? 0,
      }),
    }
  })
  rows.sort((a, b) => b.batch.startDate.localeCompare(a.batch.startDate) || a.batch.name.localeCompare(b.batch.name))
  return { batches: rows, herdByMonth, unallocated: alloc.unallocated }
}

// Breeding-herd cost and weaned count over the calendar months touching a period.
export function herdTotals(costing: FarmCosting, from: ISODate, to: ISODate): { cost: number; weaned: number; months: string[] } {
  const months = [...costing.herdByMonth.keys()].filter((m) => m >= monthOf(from) && m <= monthOf(to))
  const rows = months.map((m) => costing.herdByMonth.get(m)!)
  return { cost: rows.reduce((s, r) => s + r.direct + r.allocated, 0), weaned: rows.reduce((s, r) => s + r.weaned, 0), months }
}
