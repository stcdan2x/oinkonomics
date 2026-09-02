// Every farm table a backup carries, tombstones included (TASK 001 Phase P9
// rules). The settings table is device-local (sync keys) and is never exported.
export const TABLES = [
  'farm',
  'pens',
  'animals',
  'litters',
  'batches',
  'events',
  'sales',
  'transactions',
  'inventoryItems',
  'stockMoves',
  'priceLog',
  'scenarios',
] as const

export type TableName = (typeof TABLES)[number]
