import type { Animal, BaseRow, Batch, Farm, FarmEvent, InventoryItem, ISODate, Litter, Pen, PriceObservation, Sale, Scenario, StockMove, Transaction } from '../types'
import { computeFarmCosting, type FarmCosting } from './costingRepo'
import { db, type SyncTable } from './db'
import { getFarm } from './farmRepo'
import { liveAll } from './repo'

// Everything the two Excel exports read (TASK 005).
//
// booksRows: the accountant workbook for a period. Every live transaction is
// loaded (the cash flow's opening balance and the payback date read rows before
// the period); sales and stock moves are the live rows dated up to and including
// To, through the date index; the name tables come whole; the batch costing is
// computed as at the To date clamped to today, because computeFarmCosting walks
// month by month up to its argument (the All-time preset ends in 9999).
export interface BooksRows {
  farm: Farm | undefined
  transactions: Transaction[]
  sales: Sale[]
  moves: StockMove[]
  items: InventoryItem[]
  batches: Batch[]
  animals: Animal[]
  litters: Litter[]
  costing: FarmCosting
  asAt: ISODate
}

const upTo = <T extends BaseRow & { date: ISODate }>(table: SyncTable<T>, to: ISODate): Promise<T[]> =>
  table
    .where('date')
    .belowOrEqual(to)
    .filter((r) => !r.deletedAt)
    .toArray()

export async function booksRows(to: ISODate, today: ISODate): Promise<BooksRows> {
  const asAt = to < today ? to : today
  const [farm, transactions, sales, moves, items, batches, animals, litters, costing] = await Promise.all([
    getFarm(),
    liveAll(db.transactions),
    upTo(db.sales, to),
    upTo(db.stockMoves, to),
    liveAll(db.inventoryItems),
    liveAll(db.batches),
    liveAll(db.animals),
    liveAll(db.litters),
    computeFarmCosting(asAt),
  ])
  return { farm, transactions, sales, moves, items, batches, animals, litters, costing, asAt }
}

// recordsRows: the records workbook, every exported table's live rows. The
// settings table is device-local and stays out, as in the JSON backup.
export interface RecordsRows {
  tables: {
    farm: Farm[]
    pens: Pen[]
    animals: Animal[]
    litters: Litter[]
    batches: Batch[]
    events: FarmEvent[]
    sales: Sale[]
    transactions: Transaction[]
    inventoryItems: InventoryItem[]
    stockMoves: StockMove[]
    priceLog: PriceObservation[]
    scenarios: Scenario[]
  }
}

export async function recordsRows(): Promise<RecordsRows> {
  const [farm, pens, animals, litters, batches, events, sales, transactions, inventoryItems, stockMoves, priceLog, scenarios] = await Promise.all([
    liveAll(db.farm),
    liveAll(db.pens),
    liveAll(db.animals),
    liveAll(db.litters),
    liveAll(db.batches),
    liveAll(db.events),
    liveAll(db.sales),
    liveAll(db.transactions),
    liveAll(db.inventoryItems),
    liveAll(db.stockMoves),
    liveAll(db.priceLog),
    liveAll(db.scenarios),
  ])
  return { tables: { farm, pens, animals, litters, batches, events, sales, transactions, inventoryItems, stockMoves, priceLog, scenarios } }
}
