import Dexie, { type EntityTable, type Table } from 'dexie'
import type {
  Animal,
  BaseRow,
  Batch,
  Farm,
  FarmEvent,
  InventoryItem,
  Litter,
  Pen,
  PriceObservation,
  Sale,
  Scenario,
  Setting,
  StockMove,
  Transaction,
} from '../types'

// Compile-time guard: a table can only hold rows that carry the sync stamps.
export type SyncTable<T extends BaseRow> = Table<T, string>

export const db = new Dexie('oinkonomics') as Dexie & {
  farm: SyncTable<Farm>
  pens: SyncTable<Pen>
  animals: SyncTable<Animal>
  litters: SyncTable<Litter>
  batches: SyncTable<Batch>
  events: SyncTable<FarmEvent>
  sales: SyncTable<Sale>
  transactions: SyncTable<Transaction>
  inventoryItems: SyncTable<InventoryItem>
  stockMoves: SyncTable<StockMove>
  priceLog: SyncTable<PriceObservation>
  scenarios: SyncTable<Scenario>
  settings: EntityTable<Setting, 'key'>
}

// Only indexed fields are listed; Dexie stores every property of the object.
db.version(1).stores({
  farm: 'id',
  pens: 'id, name, stage',
  animals: 'id, tag, role, status, litterId, batchId, penId',
  litters: 'id, sowId, serviceDate, expectedFarrowDate, farrowDate',
  batches: 'id, kind, strategy, startDate',
  events: 'id, subjectId, type, date, [subjectType+subjectId]',
  sales: 'id, date',
  transactions: 'id, date, kind, category, links.batchId',
  inventoryItems: 'id, name, category',
  stockMoves: 'id, itemId, date, batchId',
  priceLog: 'id, date, item',
  scenarios: 'id, name',
  settings: 'key',
})

// One farm per install (decision 5: one Google account shared by the farm).
export const FARM_ID = 'farm'
