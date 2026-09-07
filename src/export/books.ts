import { format } from 'date-fns'
import type { BooksRows } from '../db/exportRepo'
import { herdTotals } from '../db/costingRepo'
import { lineTotal } from '../db/saleRepo'
import { ALL_TIME, cashFlow, incomeStatement, type Period } from '../engine/finance'
import { breakEvenPerHead, breakEvenPerKg, costPerKgSold, costPerWeanedPiglet, paybackDate, roi } from '../engine/unitCosts'
import { categoryLabel, KIND_LABEL } from '../knowledge/categories'
import { HERD_DEFAULTS } from '../knowledge/parameters'
import { BUYER_LABEL, STRATEGY_LABEL } from '../pages/herd/labels'
import { ITEM_CATEGORY_LABEL, REASON_LABEL } from '../pages/inventory/labels'
import type { Animal, Batch, BaseRow, InventoryItem, ISODate, ISOTime, Litter, Pen, Sale, StockMove, Transaction } from '../types'
import { MONEY_FORMAT, type Cell, type Column, type Sheet } from './xlsx'

// The accountant workbook (TASK 005): the pure builder behind "Export to Excel"
// on the Finance page's Export tab. Seven sheets for a period: the Summary
// repeats the Reports tab (income statement, cash flow, unit costs and capital)
// on the same engine functions; Ledger, Sales, Sale lines and Stock moves list
// the live rows dated inside the period; Batch costs is the Batches tab as at
// the To date; Stock on hand is the stock right now. Names and tags replace ids
// wherever the app stores one; a name that is gone keeps the id. Dates stay ISO
// text so they sort and never shift by a time zone; money is a number cell with
// a two-decimal format; numbers are left as the engine computes them.

// A zero stays +0: a negated zero total would print as -0 in the cell.
export const money = (n: number): Cell => ({ value: n === 0 ? 0 : n, format: MONEY_FORMAT })
export const col = (header: string, width: number): Column => ({ header, width })
const orNull = (v: string | number | undefined | null): Cell => (v === undefined || v === null || v === '' ? null : v)
const moneyOrNull = (n: number | undefined | null): Cell => (typeof n === 'number' ? money(n) : null)
export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
export const byDate = <T extends BaseRow & { date: ISODate }>(a: T, b: T) => a.date.localeCompare(b.date) || a.updatedAt.localeCompare(b.updatedAt)
export const within = <T extends BaseRow & { date: ISODate }>(rows: T[], p: Period) => rows.filter((r) => !r.deletedAt && r.date >= p.from && r.date <= p.to)
export const exportedAtText = (at: ISOTime) => format(new Date(at), 'yyyy-MM-dd HH:mm')

// The lookups every sheet resolves ids through.
export interface Names {
  animal: (id?: string) => Cell
  batch: (id?: string) => Cell
  item: (id?: string) => InventoryItem | undefined
  litter: (id?: string) => Cell
  pen: (id?: string) => Cell
  sale: (id?: string) => Cell
}

export function namesOf(rows: { animals: Animal[]; batches: Batch[]; items: InventoryItem[]; sales: Sale[]; litters?: Litter[]; pens?: Pen[] }): Names {
  const animals = new Map(rows.animals.map((a) => [a.id, a]))
  const batches = new Map(rows.batches.map((b) => [b.id, b]))
  const items = new Map(rows.items.map((i) => [i.id, i]))
  const sales = new Map(rows.sales.map((s) => [s.id, s]))
  const litters = new Map((rows.litters ?? []).map((l) => [l.id, l]))
  const pens = new Map((rows.pens ?? []).map((p) => [p.id, p]))
  const tag = (id?: string) => (id ? (animals.get(id)?.tag ?? id) : null)
  return {
    animal: (id) => orNull(tag(id)),
    batch: (id) => (id ? (batches.get(id)?.name ?? id) : null),
    item: (id) => (id ? items.get(id) : undefined),
    litter: (id) => {
      if (!id) return null
      const l = litters.get(id)
      return l ? `${tag(l.sowId)} ${l.serviceDate}` : id
    },
    pen: (id) => (id ? (pens.get(id)?.name ?? id) : null),
    sale: (id) => {
      if (!id) return null
      const s = sales.get(id)
      return s ? (s.buyerName ?? BUYER_LABEL[s.buyerType]) : id
    },
  }
}

export function ledgerSheet(name: string, txs: Transaction[], names: Names): Sheet {
  return {
    name,
    columns: [col('Date', 12), col('Kind', 18), col('Category', 28), col('Amount', 14), col('Batch', 16), col('Animal', 12), col('Item', 20), col('Sale', 18), col('Note', 40), col('Reference', 38)],
    rows: [...txs].sort(byDate).map((t) => [t.date, KIND_LABEL[t.kind], categoryLabel(t.category), money(t.amount), names.batch(t.links.batchId), names.animal(t.links.animalId), orNull(t.links.itemId ? (names.item(t.links.itemId)?.name ?? t.links.itemId) : null), names.sale(t.links.saleId), orNull(t.note), t.id]),
  }
}

const kgOf = (lines: Sale['lines']) => {
  const kgs = lines.map((l) => l.liveWeightKg).filter((k): k is number => typeof k === 'number')
  return kgs.length ? kgs.reduce((s, k) => s + k, 0) : null
}
const buyerOf = (s: Sale) => s.buyerName ?? BUYER_LABEL[s.buyerType]

export function salesSheet(sales: Sale[]): Sheet {
  return {
    name: 'Sales',
    columns: [col('Date', 12), col('Buyer type', 22), col('Buyer', 22), col('Head', 8), col('Live weight kg', 14), col('Total', 14), col('Reference', 38)],
    rows: [...sales].sort(byDate).map((s) => [s.date, BUYER_LABEL[s.buyerType], orNull(s.buyerName), s.lines.reduce((n, l) => n + l.headCount, 0), kgOf(s.lines), money(s.total), s.id]),
  }
}

export function saleLinesSheet(sales: Sale[], names: Names): Sheet {
  return {
    name: 'Sale lines',
    columns: [col('Sale date', 12), col('Buyer', 22), col('Batch', 16), col('Animals', 20), col('Head', 8), col('Live weight kg', 14), col('Price per kg', 12), col('Price per head', 14), col('Line total', 14)],
    rows: [...sales].sort(byDate).flatMap((s) => s.lines.map((l) => [s.date, buyerOf(s), names.batch(l.batchId), orNull(l.animalIds?.map((id) => names.animal(id)).join(', ')), l.headCount, orNull(l.liveWeightKg), moneyOrNull(l.pricePerKg), moneyOrNull(l.pricePerHead), money(lineTotal(l))])),
  }
}

export function stockMovesSheet(moves: StockMove[], names: Names): Sheet {
  return {
    name: 'Stock moves',
    columns: [col('Date', 12), col('Item', 22), col('Reason', 12), col('Quantity', 10), col('Unit', 8), col('Unit cost', 12), col('Value', 14), col('Batch', 16), col('Animal', 12), col('Reference', 38)],
    rows: [...moves].sort(byDate).map((m) => {
      const item = names.item(m.itemId)
      return [m.date, item?.name ?? m.itemId, REASON_LABEL[m.reason], m.qtyDelta, orNull(item?.unit), moneyOrNull(m.unitCost), typeof m.unitCost === 'number' ? money(m.qtyDelta * m.unitCost) : null, names.batch(m.batchId), names.animal(m.animalId), m.id]
    }),
  }
}

export function stockOnHandSheet(items: InventoryItem[]): Sheet {
  const sorted = [...items].sort((a, b) => a.name.localeCompare(b.name))
  const total = sorted.reduce((s, i) => s + i.qtyOnHand * i.unitCost, 0)
  return {
    name: 'Stock on hand',
    columns: [col('Item', 22), col('Category', 12), col('Unit', 8), col('On hand', 10), col('Unit cost', 12), col('Value', 14), col('Reorder level', 12), col('Expiry', 12)],
    rows: [...sorted.map((i): Cell[] => [i.name, ITEM_CATEGORY_LABEL[i.category], i.unit, i.qtyOnHand, money(i.unitCost), money(i.qtyOnHand * i.unitCost), i.reorderLevel, orNull(i.expiryDate)]), ['Total', null, null, null, null, money(total), null, null]],
  }
}

const MARKET_KG = HERD_DEFAULTS.marketLiveWeightKg.value

function batchCostsSheet(rows: BooksRows): Sheet {
  const out: Cell[][] = rows.costing.batches.map(({ batch, costing: c, startHead, headSold, kgSold }) => {
    // The same rules as costingView.tsx: sold batches read their sale figures, the rest the current head count at the market weight.
    const sold = headSold > 0
    const heads = sold ? headSold : batch.headCount
    const kg = sold ? kgSold : batch.headCount > 0 ? batch.headCount * MARKET_KG : null
    return [
      batch.name,
      capitalize(batch.kind),
      STRATEGY_LABEL[batch.strategy],
      batch.startDate,
      startHead,
      batch.headCount,
      headSold,
      kgSold,
      money(c.pigletValue),
      money(c.directTotal),
      money(c.allocated),
      money(c.totalCost),
      money(c.revenue),
      money(c.profit),
      moneyOrNull(sold && kgSold !== null ? costPerKgSold(c.totalCost, kgSold) : null),
      moneyOrNull(breakEvenPerHead(c.totalCost, heads)),
      moneyOrNull(kg !== null ? breakEvenPerKg(c.totalCost, kg) : null),
    ]
  })
  if (rows.costing.unallocated > 0) out.push(['Unallocated shared expenses', null, null, null, null, null, null, null, null, null, null, money(rows.costing.unallocated), null, null, null, null, null])
  return {
    name: 'Batch costs',
    columns: [col('Batch', 18), col('Kind', 10), col('Strategy', 26), col('Started', 12), col('Start head', 10), col('On farm', 8), col('Head sold', 10), col('Kg sold', 10), col('Piglet value', 12), col('Direct costs', 12), col('Allocated shared', 14), col('Total cost', 12), col('Revenue', 12), col('Profit', 12), col('Cost per kg sold', 14), col('Break-even per head', 16), col('Break-even per kg', 16)],
    rows: out,
  }
}

function summarySheet(period: Period, exportedAt: ISOTime, rows: BooksRows): Sheet {
  const is = incomeStatement(rows.transactions, period.from, period.to)
  const cf = cashFlow(rows.transactions, period.from, period.to)
  const herd = herdTotals(rows.costing, period.from, period.to)
  const perPiglet = costPerWeanedPiglet(herd.cost, herd.weaned)
  const capital = rows.transactions.filter((t) => !t.deletedAt && t.kind === 'capital' && t.date <= period.to).reduce((s, t) => s + t.amount, 0)
  const r = roi(is.netIncome, capital)
  const months = herd.months.length
  const out: Cell[][] = [
    ['Farm', rows.farm?.name ?? null],
    ['Location', orNull(rows.farm?.location)],
    ['From', period.from],
    ['To', period.to],
    ['Exported at', exportedAtText(exportedAt)],
    ['Income statement', null],
    ...is.revenue.map((x): Cell[] => [`Revenue: ${categoryLabel(x.category)}`, money(x.amount)]),
    ['Total revenue', money(is.totalRevenue)],
    ...is.expenses.map((x): Cell[] => [`Expense: ${categoryLabel(x.category)}`, money(x.amount)]),
    ['Total expenses', money(is.totalExpenses)],
    ['Net income', money(is.netIncome)],
    ['Cash flow', null],
    ['Opening balance', money(cf.openingBalance)],
    ['Operating in (revenue)', money(cf.operatingIn)],
    ['Operating out (expenses)', money(-cf.operatingOut)],
    ['Capital purchases', money(-cf.capitalOut)],
    ['Loans received', money(cf.loansIn)],
    ['Loan repayments', money(-cf.loanPaymentsOut)],
    ["Owner's capital in", money(cf.ownerCapitalIn)],
    ['Owner drawings', money(-cf.drawingsOut)],
    ['Net cash this period', money(cf.netCash)],
    ['Closing balance', money(cf.closingBalance)],
    ['Unit costs and capital', null],
    [`Breeding herd cost (${months} month${months === 1 ? '' : 's'})`, money(herd.cost)],
    ['Piglets weaned', herd.weaned],
    ['Cost per weaned piglet', perPiglet !== null ? money(perPiglet) : 'no weaning in these months'],
    [period.to === ALL_TIME.to ? 'Capital spent to date' : `Capital spent to ${period.to}`, money(capital)],
    ['ROI (net income / capital)', r !== null ? `${(r * 100).toFixed(1)}%` : 'no capital recorded'],
    ['Capital paid back', paybackDate(rows.transactions) ?? 'not yet'],
  ]
  return { name: 'Summary', columns: [col('Item', 40), col('Amount', 16)], rows: out }
}

export function buildBooks(period: Period, exportedAt: ISOTime, rows: BooksRows): Sheet[] {
  const names = namesOf(rows)
  const sales = within(rows.sales, period)
  return [
    summarySheet(period, exportedAt, rows),
    ledgerSheet('Ledger', within(rows.transactions, period), names),
    salesSheet(sales),
    saleLinesSheet(sales, names),
    batchCostsSheet(rows),
    stockMovesSheet(within(rows.moves, period), names),
    stockOnHandSheet(rows.items),
  ]
}

export const booksFilename = ({ from, to }: Period) => (from === ALL_TIME.from && to === ALL_TIME.to ? 'oinkonomics-books-all-time.xlsx' : `oinkonomics-books-${from}-to-${to}.xlsx`)
