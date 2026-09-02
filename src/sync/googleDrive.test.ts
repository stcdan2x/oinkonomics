import 'fake-indexeddb/auto'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { exportData, type Backup } from '../db/backup'
import { db } from '../db/db'
import { create } from '../db/repo'
import { FILE_NAME, GOOGLE_CLIENT_ID, TokenExpired, clearToken, getAccessToken, syncNow, tokenValid } from './googleDrive'

const pen = { name: 'Farrowing 1', stage: 'farrowing' as const, capacity: 1 }
const clearAll = () => Promise.all(db.tables.map((t) => t.clear()))

// A fake Drive: answers the list, media and upload calls and records them.
function fakeDrive(remote: Backup | null) {
  const calls: { method: string; url: string; body?: string }[] = []
  const fetch = vi.fn(async (url: string, init?: RequestInit) => {
    const method = init?.method ?? 'GET'
    calls.push({ method, url, body: typeof init?.body === 'string' ? init.body : undefined })
    expect((init?.headers as Record<string, string>).Authorization).toBe('Bearer tok')
    if (url.includes('/drive/v3/files?')) return new Response(JSON.stringify({ files: remote ? [{ id: 'f1', name: FILE_NAME }] : [] }), { status: 200 })
    if (url.includes('/drive/v3/files/f1?alt=media')) return new Response(JSON.stringify(remote), { status: 200 })
    if (url.includes('/upload/drive/v3/files')) return new Response(JSON.stringify({ id: 'f1' }), { status: 200 })
    return new Response('not found', { status: 404 })
  })
  const uploads = () => calls.filter((c) => c.url.includes('/upload/'))
  return { fetch: fetch as unknown as typeof globalThis.fetch, calls, uploads }
}
const getToken = async () => 'tok'
const uploadedSnapshot = (body: string): Backup => JSON.parse(body.split('\r\n\r\n')[2].split('\r\n--')[0])

describe('Google Drive sync (TASK 001 step 9.3)', () => {
  beforeEach(async () => {
    await clearAll()
    clearToken()
  })

  it('uses the Oinkonomics client id and the appdata file name', () => {
    expect(GOOGLE_CLIENT_ID).toBe('910236752367-gm3podd0cvuc8d65tivu8m280td1hrld.apps.googleusercontent.com')
    expect(FILE_NAME).toBe('oinkonomics-backup.json')
  })

  it('a non-interactive token request with no valid cached token fails with TokenExpired and never loads Google', async () => {
    expect(tokenValid()).toBe(false)
    await expect(getAccessToken(false)).rejects.toBeInstanceOf(TokenExpired)
  })

  it('first sync of a device with no remote file uploads the local snapshot as a new appdata file', async () => {
    const local = await create(db.pens, pen)
    const drive = fakeDrive(null)
    const result = await syncNow(false, { getToken, fetch: drive.fetch })
    expect(result).toMatchObject({ pulled: false, written: 0, uploaded: true })
    expect(result.at).toMatch(/^\d{4}-\d{2}-\d{2}T/)
    expect(drive.uploads()).toHaveLength(1)
    const up = drive.uploads()[0]
    expect(up.method).toBe('POST')
    expect(up.body).toContain(`"name":"${FILE_NAME}"`)
    expect(up.body).toContain('"parents":["appDataFolder"]')
    const snapshot = uploadedSnapshot(up.body!)
    expect(snapshot.app).toBe('oinkonomics')
    expect((snapshot.tables.pens as { id: string }[])[0].id).toBe(local.id)
    expect((await db.settings.get('lastSyncAt'))?.value).toBe(result.at)
  })

  it('pulls the remote file, writes its newer rows locally and uploads the merge when the remote lacks local rows', async () => {
    const local = await create(db.pens, pen)
    const remote = await exportData()
    const remoteRow = { ...(remote.tables.pens[0] as typeof local), name: 'Renamed there', updatedAt: new Date(Date.now() + 1000).toISOString() }
    remote.tables.pens = [remoteRow]
    const mine = await create(db.pens, { ...pen, name: 'Only here' })
    const drive = fakeDrive(remote)

    const result = await syncNow(false, { getToken, fetch: drive.fetch })
    expect(result).toMatchObject({ pulled: true, written: 1, uploaded: true })
    expect((await db.pens.get(local.id))!.name).toBe('Renamed there')
    const up = drive.uploads()[0]
    expect(up.method).toBe('PATCH')
    expect(up.url).toContain('/files/f1?uploadType=multipart')
    const ids = (uploadedSnapshot(up.body!).tables.pens as { id: string }[]).map((r) => r.id).sort()
    expect(ids).toEqual([local.id, mine.id].sort())
  })

  it('does not upload when the remote already holds everything local has', async () => {
    await create(db.pens, pen)
    const drive = fakeDrive(await exportData())
    const result = await syncNow(false, { getToken, fetch: drive.fetch })
    expect(result).toMatchObject({ pulled: true, written: 0, uploaded: false })
    expect(drive.uploads()).toHaveLength(0)
    expect((await db.settings.get('lastSyncAt'))?.value).toBe(result.at)
  })

  it('surfaces a Drive error with its status and leaves lastSyncAt alone', async () => {
    const fetch = (async () => new Response('denied', { status: 401 })) as unknown as typeof globalThis.fetch
    await expect(syncNow(false, { getToken, fetch })).rejects.toThrow('Google Drive error 401')
    expect(await db.settings.get('lastSyncAt')).toBeUndefined()
  })
})
