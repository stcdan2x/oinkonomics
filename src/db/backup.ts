// JSON backup of the whole farm database (TASK 001 section 4, Phase P9 rules):
// the manual backup path, and the snapshot Google Drive sync exchanges.
import { newerRows, type Stamped } from '../sync/merge'
import { db } from './db'
import { TABLES, type TableName } from './tables'

export interface Backup {
  app: 'oinkonomics'
  version: 1
  exportedAt: string
  tables: Record<string, unknown[]>
}

export { TABLES, type TableName }

export async function exportData(): Promise<Backup> {
  const tables: Record<string, unknown[]> = {}
  for (const name of TABLES) tables[name] = await db.table(name).toArray()
  return { app: 'oinkonomics', version: 1, exportedAt: new Date().toISOString(), tables }
}

const isStamped = (row: unknown): row is Stamped =>
  typeof row === 'object' && row !== null && typeof (row as Stamped).id === 'string' && typeof (row as Stamped).updatedAt === 'string'

// Validates the file, then merges it in with the sync rule: a backup row is
// written only when it is missing here or newer than the local copy, so a
// restore and a Drive pull are the same operation and importing twice is
// harmless. Returns the number of rows written. Unknown tables are ignored.
export async function importData(backup: Backup): Promise<number> {
  if (!backup || backup.app !== 'oinkonomics' || backup.version !== 1 || typeof backup.tables !== 'object' || backup.tables === null) {
    throw new Error('Not an Oinkonomics backup file.')
  }
  const incoming: Partial<Record<TableName, Stamped[]>> = {}
  for (const name of TABLES) {
    const rows = backup.tables[name]
    if (!Array.isArray(rows)) continue
    rows.forEach((row, i) => {
      if (!isStamped(row)) throw new Error(`Not an Oinkonomics backup file: ${name} row ${i + 1} has no id or updatedAt.`)
    })
    incoming[name] = rows as Stamped[]
  }
  let written = 0
  await db.transaction('rw', TABLES.map((name) => db.table(name)), async () => {
    for (const name of TABLES) {
      const rows = incoming[name]
      if (!rows || rows.length === 0) continue
      const local = (await db.table(name).toArray()) as Stamped[]
      const toWrite = newerRows(rows, local)
      if (toWrite.length === 0) continue
      await db.table(name).bulkPut(toWrite)
      written += toWrite.length
    }
  })
  return written
}

// Rows changed since the last successful sync (every row when never synced),
// deletions included: the "pending" figure on the Settings page.
export async function pendingChanges(lastSyncAt: string | null): Promise<number> {
  let n = 0
  for (const name of TABLES) {
    const rows = (await db.table(name).toArray()) as Stamped[]
    n += lastSyncAt ? rows.filter((r) => r.updatedAt > lastSyncAt).length : rows.length
  }
  return n
}
