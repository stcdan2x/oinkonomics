import 'fake-indexeddb/auto'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from './db'
import { create, liveAll, liveWhere, newId, softDelete, update } from './repo'

const pen = { name: 'Farrowing 1', stage: 'farrowing' as const, capacity: 1 }

describe('repository helpers', () => {
  beforeEach(async () => {
    await db.pens.clear()
  })

  it('generates unique ids', () => {
    const a = newId()
    const b = newId()
    expect(a).not.toBe(b)
    expect(a.length).toBeGreaterThan(20)
  })

  it('create stamps id and updatedAt and leaves the row live', async () => {
    const row = await create(db.pens, pen)
    expect(row.id).toBeTruthy()
    expect(row.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/)
    expect(row.deletedAt ?? null).toBeNull()
    const stored = await db.pens.get(row.id)
    expect(stored).toEqual(row)
  })

  it('update merges the patch and bumps updatedAt', async () => {
    const row = await create(db.pens, pen)
    await new Promise((r) => setTimeout(r, 2))
    const changed = await update(db.pens, row.id, { capacity: 2 })
    expect(changed.capacity).toBe(2)
    expect(changed.name).toBe('Farrowing 1')
    expect(changed.updatedAt > row.updatedAt).toBe(true)
    expect(await db.pens.count()).toBe(1)
  })

  it('update rejects an unknown id', async () => {
    await expect(update(db.pens, 'missing', { capacity: 2 })).rejects.toThrow(/missing/)
  })

  it('softDelete keeps the row as a tombstone with deletedAt and a fresh updatedAt', async () => {
    const row = await create(db.pens, pen)
    await new Promise((r) => setTimeout(r, 2))
    await softDelete(db.pens, row.id)
    const stored = (await db.pens.get(row.id))!
    expect(stored.deletedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/)
    expect(stored.updatedAt).toBe(stored.deletedAt)
    expect(stored.updatedAt > row.updatedAt).toBe(true)
    expect(await db.pens.count()).toBe(1)
  })

  it('liveAll and liveWhere exclude tombstones', async () => {
    const a = await create(db.pens, pen)
    const b = await create(db.pens, { ...pen, name: 'Nursery 1', stage: 'nursery' })
    const c = await create(db.pens, { ...pen, name: 'Farrowing 2' })
    await softDelete(db.pens, c.id)

    const all = await liveAll(db.pens)
    expect(all.map((p) => p.id).sort()).toEqual([a.id, b.id].sort())

    const farrowing = await liveWhere(db.pens, 'stage', 'farrowing')
    expect(farrowing.map((p) => p.id)).toEqual([a.id])
  })
})
