// Row types for the Dexie tables in src/db/db.ts (PLAN.md section 4).
// Every table row extends BaseRow: `updatedAt` drives the newest-wins merge and
// `deletedAt` is the tombstone that lets sync propagate deletions (P9).

export type ISODate = string // 'YYYY-MM-DD'
export type ISOTime = string // ISO 8601 timestamp, e.g. 2026-09-01T10:15:00.000Z

export interface BaseRow {
  id: string
  updatedAt: ISOTime
  deletedAt?: ISOTime | null
}

export interface Farm extends BaseRow {
  name: string
  location?: string
  currency: 'PHP'
  startDate: ISODate
}

export type PenStage =
  | 'breeding'
  | 'farrowing'
  | 'nursery'
  | 'grower'
  | 'finisher'
  | 'boar'
  | 'isolation'
  | 'other'

export interface Pen extends BaseRow {
  name: string
  stage: PenStage
  capacity?: number
}

export type AnimalRole = 'sow' | 'boar' | 'gilt' | 'piglet' | 'grower' | 'finisher'
export type AnimalStatus = 'active' | 'sold' | 'dead' | 'culled'
export type Sex = 'female' | 'male'

// Sows, boars and gilts always have a row; piglets, growers and finishers only
// when one pig needs its own record (decision 6, granularity).
export interface Animal extends BaseRow {
  tag: string
  role: AnimalRole
  breed?: string
  sex: Sex
  birthDate?: ISODate
  source: 'born' | 'bought'
  purchaseTransactionId?: string
  damId?: string
  sireId?: string
  litterId?: string
  batchId?: string
  penId?: string
  status: AnimalStatus
  statusDate?: ISODate
  notes?: string
}

export interface Litter extends BaseRow {
  sowId: string
  sireId?: string
  aiNote?: string
  serviceDate: ISODate
  expectedFarrowDate: ISODate
  farrowDate?: ISODate
  bornAlive: number
  stillborn: number
  mummified: number
  weanDate?: ISODate
  weanedCount: number
  outcome?: 'farrowed' | 'notPregnant' | 'aborted'
  notes?: string
}

export type BatchKind = 'piglets' | 'growers' | 'finishers'
export type StrategyId = 'sellWeaners' | 'growToRoaster' | 'growToMarket' | 'undecided'

export interface Batch extends BaseRow {
  name: string
  kind: BatchKind
  litterIds: string[]
  headCount: number
  startDate: ISODate
  penId?: string
  strategy: StrategyId
}

export type SubjectType = 'animal' | 'litter' | 'batch'
export type EventType =
  | 'heat'
  | 'service'
  | 'pregCheck'
  | 'farrowing'
  | 'weaning'
  | 'weight'
  | 'vaccination'
  | 'deworming'
  | 'treatment'
  | 'ironShot'
  | 'castration'
  | 'transfer'
  | 'death'
  | 'cull'
  | 'sale'
  | 'note'

export interface FarmEvent extends BaseRow {
  subjectType: SubjectType
  subjectId: string
  type: EventType
  date: ISODate
  data: Record<string, unknown>
  costTransactionId?: string
}

export type BuyerType = 'viajero' | 'roaster' | 'market' | 'direct' | 'other'

export interface SaleLine {
  animalIds?: string[]
  batchId?: string
  headCount: number
  liveWeightKg?: number
  pricePerKg?: number
  pricePerHead?: number
}

export interface Sale extends BaseRow {
  date: ISODate
  buyerType: BuyerType
  buyerName?: string
  lines: SaleLine[]
  total: number
  transactionId?: string
}

export type TransactionKind = 'expense' | 'revenue' | 'capital' | 'drawing' | 'loan' | 'loanPayment' | 'ownerCapital'

export interface Transaction extends BaseRow {
  date: ISODate
  kind: TransactionKind
  category: string
  amount: number
  note?: string
  links: { batchId?: string; animalId?: string; itemId?: string; saleId?: string }
}

export type ItemCategory = 'feed' | 'medicine' | 'vaccine' | 'supplement' | 'supply' | 'equipment'

export interface InventoryItem extends BaseRow {
  name: string
  category: ItemCategory
  unit: string
  kgPerUnit?: number // set when the unit is a bag or sack, so feed can be entered in kg
  qtyOnHand: number // always the sum of the item's live stock moves (inventoryRepo keeps it)
  reorderLevel: number
  unitCost: number // moving weighted average of purchases
  expiryDate?: ISODate
}

export type StockMoveReason = 'purchase' | 'consumption' | 'adjustment' | 'loss'

export interface StockMove extends BaseRow {
  itemId: string
  date: ISODate
  qtyDelta: number
  reason: StockMoveReason
  batchId?: string
  transactionId?: string
  unitCost?: number // the item's unit cost when the move was recorded; values consumption for costing
}

export type PriceItem = 'pigletPerHead' | 'liveweightPerKg' | 'lechonPerHead' | 'feedBag'

export interface PriceObservation extends BaseRow {
  date: ISODate
  market?: string
  item: PriceItem
  value: number
  source: 'own' | 'heard' | 'published'
  note?: string
}

export interface Scenario extends BaseRow {
  name: string
  strategy: StrategyId
  params: Record<string, unknown>
  createdAt: ISOTime
}

// Keyed by name rather than id; still stamped so sync can merge it.
export interface Setting {
  key: string
  value: unknown
  updatedAt: ISOTime
}
