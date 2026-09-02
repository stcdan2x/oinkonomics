import { endOfMonth, parseISO } from 'date-fns'
import { ITEM_EXPENSE_CATEGORY } from '../knowledge/categories'
import type { InventoryItem, ISODate, StockMove, Transaction } from '../types'
import { daysBetween, plusDays, toISODate } from './dates'
import { byCategory, type CategoryTotal } from './finance'

// Batch costing rules (TASK 001 section 4, P4): shared expenses (no batch or
// animal link) are allocated per calendar month by head-days across the
// batches alive that month plus one breeding-herd unit. Batch cost = direct +
// allocated + piglet transfer value.

export interface HeadCountChange {
  date: ISODate
  delta: number
}

export interface BatchLife {
  id: string
  startDate: ISODate
  headCount: number
}

// Head count at the end of `date`: the current count with every later change undone.
export function headCountOn(batch: BatchLife, changes: HeadCountChange[], date: ISODate): number {
  if (date < batch.startDate) return 0
  return changes.filter((c) => c.date > date).reduce((n, c) => n - c.delta, batch.headCount)
}

export function headDays(batch: BatchLife, changes: HeadCountChange[], from: ISODate, to: ISODate): number {
  const start = from > batch.startDate ? from : batch.startDate
  let total = 0
  for (let d = start; d <= to; d = plusDays(d, 1)) total += headCountOn(batch, changes, d)
  return total
}

export interface Interval {
  from?: ISODate
  to?: ISODate
}

// Breeders: days each interval overlaps the inclusive period.
export function intervalHeadDays(intervals: Interval[], from: ISODate, to: ISODate): number {
  let total = 0
  for (const i of intervals) {
    const a = i.from && i.from > from ? i.from : from
    const b = i.to && i.to < to ? i.to : to
    if (b >= a) total += daysBetween(a, b) + 1
  }
  return total
}

export interface AllocationUnit {
  id: string
  headDays: number
}

export function allocate(amount: number, units: AllocationUnit[]): Map<string, number> {
  const total = units.reduce((s, u) => s + u.headDays, 0)
  const out = new Map<string, number>()
  if (total <= 0) return out
  for (const u of units) if (u.headDays > 0) out.set(u.id, (amount * u.headDays) / total)
  return out
}

export const monthOf = (date: ISODate): string => date.slice(0, 7)

export function monthRange(month: string): { from: ISODate; to: ISODate } {
  const from = `${month}-01`
  return { from, to: toISODate(endOfMonth(parseISO(from))) }
}

export interface SharedAllocation {
  byUnit: Map<string, number>
  byUnitMonth: Map<string, Map<string, number>>
  unallocated: number
}

export function allocateSharedByMonth(shared: Transaction[], unitsFor: (month: string) => AllocationUnit[]): SharedAllocation {
  const perMonth = new Map<string, number>()
  for (const t of shared) perMonth.set(monthOf(t.date), (perMonth.get(monthOf(t.date)) ?? 0) + t.amount)
  const byUnit = new Map<string, number>()
  const byUnitMonth = new Map<string, Map<string, number>>()
  let unallocated = 0
  for (const [month, amount] of perMonth) {
    const split = allocate(amount, unitsFor(month))
    if (split.size === 0) {
      unallocated += amount
      continue
    }
    for (const [id, share] of split) {
      byUnit.set(id, (byUnit.get(id) ?? 0) + share)
      const m = byUnitMonth.get(id) ?? new Map<string, number>()
      m.set(month, share)
      byUnitMonth.set(id, m)
    }
  }
  return { byUnit, byUnitMonth, unallocated }
}

export const isShared = (t: Transaction) => t.kind === 'expense' && !t.links.batchId && !t.links.animalId

// A ledger expense that bought inventory. Its money reaches costing through the
// stock moves that use the item up, never directly (that would count it twice).
export const isStockPurchase = (t: Transaction) => t.kind === 'expense' && !!t.links.itemId

// Consumption and loss moves as expense-shaped cost rows: valued at the unit
// cost snapshotted on the move (the item's current cost when the snapshot is
// missing), dated on the move, linked to the move's batch when it has one.
export function stockCostRows(moves: StockMove[], items: InventoryItem[]): Transaction[] {
  const itemById = new Map(items.map((i) => [i.id, i]))
  const rows: Transaction[] = []
  for (const m of moves) {
    if (m.deletedAt || (m.reason !== 'consumption' && m.reason !== 'loss')) continue
    const item = itemById.get(m.itemId)
    if (!item) continue
    rows.push({
      id: m.id,
      updatedAt: m.updatedAt,
      deletedAt: null,
      date: m.date,
      kind: 'expense',
      category: ITEM_EXPENSE_CATEGORY[item.category],
      amount: Math.abs(m.qtyDelta) * (m.unitCost ?? item.unitCost),
      links: { batchId: m.batchId, itemId: m.itemId },
    })
  }
  return rows
}

export interface BatchCostingInput {
  batchId: string
  txs: Transaction[]
  allocated: number
  headDays: number
  startHead: number
  pigletCostPerHead: number
}

export interface BatchCosting {
  direct: CategoryTotal[]
  directTotal: number
  allocated: number
  pigletValue: number
  totalCost: number
  revenue: number
  profit: number
  headDays: number
}

export function batchCosting(input: BatchCostingInput): BatchCosting {
  const mine = input.txs.filter((t) => !t.deletedAt && t.links.batchId === input.batchId)
  const directRows = mine.filter((t) => t.kind === 'expense')
  const direct = byCategory(directRows)
  const directTotal = directRows.reduce((s, t) => s + t.amount, 0)
  const revenue = mine.filter((t) => t.kind === 'revenue').reduce((s, t) => s + t.amount, 0)
  const pigletValue = input.startHead * input.pigletCostPerHead
  const totalCost = directTotal + input.allocated + pigletValue
  return { direct, directTotal, allocated: input.allocated, pigletValue, totalCost, revenue, profit: revenue - totalCost, headDays: input.headDays }
}
