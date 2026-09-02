import { describe, expect, it } from 'vitest'
import type { Backup } from '../db/backup'
import { TABLES } from '../db/backup'
import { mergeBackups, mergeRows, newerRowCount, newerRows } from './merge'

type Pen = { id: string; name: string; updatedAt: string; deletedAt?: string | null }
const backup = (tables: Record<string, unknown[]>): Backup => ({ app: 'oinkonomics', version: 1, exportedAt: '2026-09-02T00:00:00.000Z', tables })

describe('mergeRows (TASK 001 step 9.2: newest updatedAt wins, tombstones are rows)', () => {
  it('keeps rows unique to either side', () => {
    const merged = mergeRows<Pen>([{ id: 'a', name: 'Local', updatedAt: '2026-09-01T00:00:00.000Z' }], [{ id: 'b', name: 'Remote', updatedAt: '2026-09-02T00:00:00.000Z' }])
    expect(merged.map((r) => r.id).sort()).toEqual(['a', 'b'])
  })

  it('the newer row wins whole whatever side it is on; a tie keeps the local row', () => {
    const older = { id: 'a', name: 'older', updatedAt: '2026-09-01T00:00:00.000Z' }
    const newer = { id: 'a', name: 'newer', updatedAt: '2026-09-03T00:00:00.000Z' }
    expect(mergeRows<Pen>([older], [newer])).toEqual([newer])
    expect(mergeRows<Pen>([newer], [older])).toEqual([newer])
    const local = { id: 'a', name: 'local', updatedAt: '2026-09-03T00:00:00.000Z' }
    const remote = { id: 'a', name: 'remote', updatedAt: '2026-09-03T00:00:00.000Z' }
    expect(mergeRows<Pen>([local], [remote])).toEqual([local])
  })

  it('a deletion dated after the other side\'s edit propagates; an edit dated after the deletion revives the row', () => {
    const edited = { id: 'a', name: 'edited', updatedAt: '2026-09-02T10:00:00.000Z', deletedAt: null }
    const deleted = { id: 'a', name: 'edited', updatedAt: '2026-09-02T11:00:00.000Z', deletedAt: '2026-09-02T11:00:00.000Z' }
    expect(mergeRows<Pen>([edited], [deleted])[0].deletedAt).toBe('2026-09-02T11:00:00.000Z')
    const revived = { id: 'a', name: 'back', updatedAt: '2026-09-02T12:00:00.000Z', deletedAt: null }
    expect(mergeRows<Pen>([deleted], [revived])[0]).toEqual(revived)
  })

  it('a row without updatedAt never beats one that has it', () => {
    const stamped = { id: 'a', name: 'stamped', updatedAt: '2026-09-01T00:00:00.000Z' }
    const bare = { id: 'a', name: 'bare' } as unknown as Pen
    expect(mergeRows<Pen>([bare], [stamped])).toEqual([stamped])
    expect(mergeRows<Pen>([stamped], [bare])).toEqual([stamped])
  })
})

describe('newerRows (the rows one side must write or upload)', () => {
  it('counts rows missing on the other side or strictly newer there, never equal ones', () => {
    const t1 = '2026-09-01T00:00:00.000Z'
    const t2 = '2026-09-02T00:00:00.000Z'
    const from: Pen[] = [
      { id: 'same', name: 'x', updatedAt: t1 },
      { id: 'newer', name: 'x', updatedAt: t2 },
      { id: 'older', name: 'x', updatedAt: t1 },
      { id: 'only', name: 'x', updatedAt: t1 },
    ]
    const to: Pen[] = [
      { id: 'same', name: 'x', updatedAt: t1 },
      { id: 'newer', name: 'x', updatedAt: t1 },
      { id: 'older', name: 'x', updatedAt: t2 },
    ]
    expect(newerRows(from, to).map((r) => r.id)).toEqual(['newer', 'only'])
    expect(newerRows(to, from).map((r) => r.id)).toEqual(['older'])
    expect(newerRows([], to)).toEqual([])
  })
})

describe('mergeBackups and newerRowCount over whole snapshots', () => {
  it('merges every farm table and counts the rows the remote lacks', () => {
    const t1 = '2026-09-01T00:00:00.000Z'
    const t2 = '2026-09-02T00:00:00.000Z'
    const local = backup({ pens: [{ id: 'p', name: 'local', updatedAt: t2 }], animals: [{ id: 'a', updatedAt: t1 }] })
    const remote = backup({ pens: [{ id: 'p', name: 'remote', updatedAt: t1 }], sales: [{ id: 's', updatedAt: t1 }] })
    const merged = mergeBackups(local, remote)
    expect(Object.keys(merged.tables).sort()).toEqual([...TABLES].sort())
    expect(merged.tables.pens).toEqual([{ id: 'p', name: 'local', updatedAt: t2 }])
    expect(merged.tables.animals).toHaveLength(1)
    expect(merged.tables.sales).toHaveLength(1)
    expect(merged.tables.litters).toEqual([])
    expect(merged.app).toBe('oinkonomics')
    expect(newerRowCount(local, remote)).toBe(2) // the newer pen and the animal
    expect(newerRowCount(remote, local)).toBe(1) // the sale
    expect(newerRowCount(merged, merged)).toBe(0)
  })
})
