import 'fake-indexeddb/auto'
import { beforeEach, describe, expect, it } from 'vitest'
import { TABLES, exportData, importData, type Backup } from './backup'
import { db } from './db'
import { saveFarm } from './farmRepo'
import { create, softDelete, update } from './repo'

const clearAll = () => Promise.all(db.tables.map((t) => t.clear()))
const pen = { name: 'Farrowing 1', stage: 'farrowing' as const, capacity: 1 }

describe('backup export (TASK 001 step 9.1)', () => {
  beforeEach(clearAll)

  it('exports every farm table with tombstones and never the settings table', async () => {
    await saveFarm({ name: 'Dela Cruz Piggery', startDate: '2026-09-01' })
    const live = await create(db.pens, pen)
    const gone = await create(db.pens, { ...pen, name: 'Old pen' })
    await softDelete(db.pens, gone.id)
    await db.settings.put({ key: 'lastSyncAt', value: 'x', updatedAt: '2026-09-02T00:00:00.000Z' })

    const backup = await exportData()
    expect(backup.app).toBe('oinkonomics')
    expect(backup.version).toBe(1)
    expect(backup.exportedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/)
    expect(Object.keys(backup.tables).sort()).toEqual([...TABLES].sort())
    expect(TABLES).toHaveLength(12)
    expect(TABLES).not.toContain('settings')
    expect(backup.tables.farm).toHaveLength(1)
    const pens = backup.tables.pens as { id: string; deletedAt: string | null }[]
    expect(pens.map((p) => p.id).sort()).toEqual([live.id, gone.id].sort())
    expect(pens.find((p) => p.id === gone.id)!.deletedAt).toBeTruthy()
    expect(backup.tables.animals).toEqual([])
  })
})

describe('backup import (TASK 001 step 9.1)', () => {
  beforeEach(clearAll)

  it('restores a backup onto an empty database and reports the rows written', async () => {
    await saveFarm({ name: 'Dela Cruz Piggery', startDate: '2026-09-01' })
    const p = await create(db.pens, pen)
    const backup = await exportData()
    await clearAll()
    expect(await db.pens.count()).toBe(0)

    expect(await importData(backup)).toBe(2)
    expect((await db.pens.get(p.id))!.name).toBe('Farrowing 1')
    expect((await db.farm.toArray())[0].name).toBe('Dela Cruz Piggery')
  })

  it('imports the same file twice without writing anything the second time', async () => {
    await create(db.pens, pen)
    const backup = await exportData()
    expect(await importData(backup)).toBe(0)
    expect(await db.pens.count()).toBe(1)
  })

  it('keeps a local row that is newer than the backup copy and takes an older one from the backup', async () => {
    const a = await create(db.pens, pen)
    const b = await create(db.pens, { ...pen, name: 'Grower 1', stage: 'grower' as const })
    const backup = await exportData()
    await new Promise((r) => setTimeout(r, 2))
    await update(db.pens, a.id, { name: 'Farrowing 1 (renamed here)' })
    // Simulate the other device editing b after this export was taken.
    const rows = backup.tables.pens as { id: string; name: string; updatedAt: string }[]
    const remoteB = rows.find((r) => r.id === b.id)!
    remoteB.name = 'Grower 1 (renamed there)'
    remoteB.updatedAt = new Date(Date.now() + 1000).toISOString()

    expect(await importData(backup)).toBe(1)
    expect((await db.pens.get(a.id))!.name).toBe('Farrowing 1 (renamed here)')
    expect((await db.pens.get(b.id))!.name).toBe('Grower 1 (renamed there)')
  })

  it('carries a deletion made elsewhere onto this device', async () => {
    const a = await create(db.pens, pen)
    const backup = await exportData()
    const row = (backup.tables.pens as { id: string; updatedAt: string; deletedAt: string | null }[])[0]
    row.updatedAt = row.deletedAt = new Date(Date.now() + 1000).toISOString()

    await importData(backup)
    expect((await db.pens.get(a.id))!.deletedAt).toBe(row.deletedAt)
  })

  it('rejects files that are not Oinkonomics backups and rows without id or updatedAt', async () => {
    await expect(importData({ app: 'hf-tracker', version: 1 } as unknown as Backup)).rejects.toThrow('Not an Oinkonomics backup')
    await expect(importData({ app: 'oinkonomics', version: 2, tables: {} } as unknown as Backup)).rejects.toThrow('Not an Oinkonomics backup')
    await expect(importData({ app: 'oinkonomics', version: 1 } as unknown as Backup)).rejects.toThrow('Not an Oinkonomics backup')
    const bad: Backup = { app: 'oinkonomics', version: 1, exportedAt: '2026-09-02T00:00:00.000Z', tables: { pens: [{ name: 'no id' }] } }
    await expect(importData(bad)).rejects.toThrow('pens row 1 has no id or updatedAt')
    expect(await db.pens.count()).toBe(0)
  })

  it('ignores tables it does not know', async () => {
    const backup: Backup = { app: 'oinkonomics', version: 1, exportedAt: '2026-09-02T00:00:00.000Z', tables: { settings: [{ key: 'x' }], nothing: [{ id: '1', updatedAt: '2026-09-02T00:00:00.000Z' }] } }
    expect(await importData(backup)).toBe(0)
    expect(await db.settings.count()).toBe(0)
  })
})
