import 'fake-indexeddb/auto'
import { describe, expect, it } from 'vitest'
import { db, FARM_ID } from './db'

// PLAN.md section 4: thirteen tables, every row stamped with updatedAt and a
// nullable deletedAt tombstone so sync (P9) can propagate deletions.
const TABLES = [
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
  'settings',
]

function indexes(table: string): string[] {
  return db.table(table).schema.indexes.map((i) => i.keyPath as string | string[]).map(String)
}

describe('Dexie schema', () => {
  it('opens version 1 with the thirteen planned tables', async () => {
    await db.open()
    expect(db.verno).toBe(1)
    expect(db.tables.map((t) => t.name).sort()).toEqual([...TABLES].sort())
  })

  it('keys every table by id, except settings which is keyed by key', () => {
    for (const name of TABLES) {
      const expected = name === 'settings' ? 'key' : 'id'
      expect(db.table(name).schema.primKey.keyPath, name).toBe(expected)
    }
  })

  it('indexes the lookups the herd, finance and inventory pages query on', () => {
    expect(indexes('animals')).toEqual(expect.arrayContaining(['tag', 'role', 'status', 'litterId', 'batchId', 'penId']))
    expect(indexes('litters')).toEqual(expect.arrayContaining(['sowId', 'serviceDate', 'expectedFarrowDate']))
    expect(indexes('batches')).toEqual(expect.arrayContaining(['kind', 'strategy', 'startDate']))
    expect(indexes('events')).toEqual(expect.arrayContaining(['subjectId', 'type', 'date', 'subjectType,subjectId']))
    expect(indexes('sales')).toEqual(expect.arrayContaining(['date']))
    expect(indexes('transactions')).toEqual(expect.arrayContaining(['date', 'kind', 'category', 'links.batchId']))
    expect(indexes('inventoryItems')).toEqual(expect.arrayContaining(['name', 'category']))
    expect(indexes('stockMoves')).toEqual(expect.arrayContaining(['itemId', 'date', 'batchId']))
    expect(indexes('priceLog')).toEqual(expect.arrayContaining(['date', 'item']))
  })

  it('reserves a fixed id for the single farm row', () => {
    expect(FARM_ID).toBe('farm')
  })
})
