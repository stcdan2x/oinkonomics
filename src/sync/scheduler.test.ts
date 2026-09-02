import 'fake-indexeddb/auto'
import { beforeEach, describe, expect, it } from 'vitest'
import { pendingChanges } from '../db/backup'
import { db } from '../db/db'
import { create, softDelete } from '../db/repo'
import { INTERVAL_MS, MIN_GAP_MS, decideSync, type SyncInput } from './scheduler'

const base: SyncInput = { connected: true, online: true, tokenValid: true, busy: false, lastAttemptAt: null, now: 1_000_000 }

describe('decideSync (TASK 001 step 9.4: when a background attempt runs)', () => {
  it('syncs when connected, online, idle and holding a valid token', () => {
    expect(decideSync(base)).toBe('sync')
  })

  it('skips when not connected, offline or already syncing', () => {
    expect(decideSync({ ...base, connected: false })).toBe('skip')
    expect(decideSync({ ...base, online: false })).toBe('skip')
    expect(decideSync({ ...base, busy: true })).toBe('skip')
  })

  it('skips an attempt made within the last minute, syncs after it', () => {
    expect(decideSync({ ...base, lastAttemptAt: base.now - MIN_GAP_MS + 1 })).toBe('skip')
    expect(decideSync({ ...base, lastAttemptAt: base.now - MIN_GAP_MS })).toBe('sync')
  })

  it('asks for a reconnect instead of opening Google when the token is missing or expired', () => {
    expect(decideSync({ ...base, tokenValid: false })).toBe('reconnect')
    expect(decideSync({ ...base, tokenValid: false, online: false })).toBe('skip')
    expect(decideSync({ ...base, tokenValid: false, connected: false })).toBe('skip')
  })

  it('runs every five minutes', () => {
    expect(INTERVAL_MS).toBe(5 * 60_000)
  })
})

describe('pendingChanges (rows changed since the last sync)', () => {
  beforeEach(() => Promise.all(db.tables.map((t) => t.clear())))

  it('counts every row when never synced, only later rows after a sync, deletions included', async () => {
    const pen = { name: 'Farrowing 1', stage: 'farrowing' as const, capacity: 1 }
    const a = await create(db.pens, pen)
    await create(db.pens, { ...pen, name: 'Grower 1', stage: 'grower' as const })
    expect(await pendingChanges(null)).toBe(2)
    await new Promise((r) => setTimeout(r, 2))
    const syncedAt = new Date().toISOString()
    expect(await pendingChanges(syncedAt)).toBe(0)
    await new Promise((r) => setTimeout(r, 2))
    await softDelete(db.pens, a.id)
    expect(await pendingChanges(syncedAt)).toBe(1)
  })
})
