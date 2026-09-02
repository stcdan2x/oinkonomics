// Snapshot merge (TASK 001 section 4, Phase P9 rules). Rows match on id; the
// row with the newer updatedAt wins whole, whatever side it is on; a tie keeps
// the local row; a row present on one side only is kept. A tombstone is an
// ordinary row (softDelete sets updatedAt = deletedAt), so a deletion dated
// after the other side's last edit propagates and a later edit revives the row.
import type { Backup } from '../db/backup'
import { TABLES } from '../db/tables'

export interface Stamped {
  id: string
  updatedAt: string
}

const stamp = (row: Stamped) => (typeof row.updatedAt === 'string' ? row.updatedAt : '')

export function mergeRows<T extends Stamped>(local: T[], remote: T[]): T[] {
  const merged = new Map<string, T>()
  for (const row of remote) merged.set(row.id, row)
  for (const row of local) {
    const other = merged.get(row.id)
    if (!other || stamp(row) >= stamp(other)) merged.set(row.id, row)
  }
  return [...merged.values()]
}

// The rows of `from` that `to` lacks or holds in an older version: what a
// device must write after a pull, or upload after a merge.
export function newerRows<T extends Stamped>(from: T[], to: T[]): T[] {
  const index = new Map(to.map((row) => [row.id, stamp(row)]))
  return from.filter((row) => {
    const there = index.get(row.id)
    return there === undefined || stamp(row) > there
  })
}

const rows = (backup: Backup, table: string) => (backup.tables[table] ?? []) as Stamped[]

export function mergeBackups(local: Backup, remote: Backup): Backup {
  const tables: Record<string, unknown[]> = {}
  for (const table of TABLES) tables[table] = mergeRows(rows(local, table), rows(remote, table))
  return { app: 'oinkonomics', version: 1, exportedAt: new Date().toISOString(), tables }
}

export function newerRowCount(from: Backup, to: Backup): number {
  return TABLES.reduce((n, table) => n + newerRows(rows(from, table), rows(to, table)).length, 0)
}
