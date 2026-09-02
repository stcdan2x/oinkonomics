// Google Drive appDataFolder sync (TASK 001 section 4, Phase P9 rules), entirely
// client-side: Google Identity Services token flow, one snapshot file in the
// app-data space of the one account the farm shares (decision 5). The token
// lives in memory only and expires after an hour; a non-interactive request
// never opens a Google prompt (the scheduler shows the reconnect banner instead).
import { exportData, importData, type Backup } from '../db/backup'
import { db } from '../db/db'
import { newerRowCount } from './merge'

// The app's own OAuth client (step 0.4): a public identifier, not a secret.
export const GOOGLE_CLIENT_ID = '910236752367-gm3podd0cvuc8d65tivu8m280td1hrld.apps.googleusercontent.com'
export const SCOPE = 'https://www.googleapis.com/auth/drive.appdata'
export const FILE_NAME = 'oinkonomics-backup.json'
const GIS_SRC = 'https://accounts.google.com/gsi/client'

export class TokenExpired extends Error {
  constructor() {
    super('Google sign-in has expired. Tap Reconnect to keep syncing.')
    this.name = 'TokenExpired'
  }
}

// Minimal typings for the GIS token client.
interface TokenResponse {
  access_token?: string
  expires_in?: number
  error?: string
}
interface TokenClient {
  requestAccessToken: (opts?: { prompt?: string }) => void
}
declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string
            scope: string
            callback: (response: TokenResponse) => void
            error_callback?: (error: { type: string; message?: string }) => void
          }) => TokenClient
        }
      }
    }
  }
}

let cachedToken: { token: string; expiresAt: number } | null = null

export function tokenValid(now = Date.now()): boolean {
  return cachedToken !== null && cachedToken.expiresAt > now + 60_000
}

export function clearToken(): void {
  cachedToken = null
}

function loadGis(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.oauth2) return resolve()
    const script = document.createElement('script')
    script.src = GIS_SRC
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Could not load Google sign-in (are you offline?).'))
    document.head.appendChild(script)
  })
}

// Interactive: from a user tap, opens the Google prompt: the consent screen on a
// fresh Connect, only the account pick (or nothing) on a Reconnect of a device
// that was already granted. Non-interactive: the cached token or TokenExpired,
// so a background sync never pops anything up.
export async function getAccessToken(interactive: boolean, prompt: 'consent' | '' = 'consent'): Promise<string> {
  if (tokenValid()) return cachedToken!.token
  if (!interactive) throw new TokenExpired()
  await loadGis()
  return new Promise((resolve, reject) => {
    const client = window.google!.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: SCOPE,
      callback: (response) => {
        if (response.error || !response.access_token) {
          reject(new Error(response.error ?? 'Google sign-in was cancelled.'))
          return
        }
        cachedToken = { token: response.access_token, expiresAt: Date.now() + (response.expires_in ?? 3600) * 1000 }
        resolve(response.access_token)
      },
      error_callback: (error) => reject(new Error(error.message ?? `Google sign-in failed (${error.type}).`)),
    })
    client.requestAccessToken({ prompt })
  })
}

export interface SyncDeps {
  getToken: (interactive: boolean) => Promise<string>
  fetch: typeof globalThis.fetch
}

export const defaultDeps = (prompt: 'consent' | '' = 'consent'): SyncDeps => ({
  getToken: (interactive) => getAccessToken(interactive, prompt),
  fetch: (...args) => globalThis.fetch(...args),
})

async function driveFetch(deps: SyncDeps, token: string, url: string, init?: RequestInit): Promise<Response> {
  const res = await deps.fetch(url, { ...init, headers: { ...(init?.headers as Record<string, string>), Authorization: `Bearer ${token}` } })
  if (!res.ok) throw new Error(`Google Drive error ${res.status}: ${await res.text()}`)
  return res
}

async function findBackupFileId(deps: SyncDeps, token: string): Promise<string | null> {
  const res = await driveFetch(deps, token, `https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&fields=files(id,name)&q=name='${FILE_NAME}'`)
  const data = (await res.json()) as { files: { id: string }[] }
  return data.files[0]?.id ?? null
}

async function downloadBackup(deps: SyncDeps, token: string, fileId: string): Promise<Backup> {
  const res = await driveFetch(deps, token, `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`)
  return (await res.json()) as Backup
}

async function uploadBackup(deps: SyncDeps, token: string, fileId: string | null, backup: Backup): Promise<void> {
  const metadata = fileId ? {} : { name: FILE_NAME, parents: ['appDataFolder'] }
  const boundary = 'oinkonomics-sync'
  const body =
    `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}\r\n` +
    `--${boundary}\r\nContent-Type: application/json\r\n\r\n${JSON.stringify(backup)}\r\n--${boundary}--`
  const url = fileId
    ? `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=multipart`
    : 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart'
  await driveFetch(deps, token, url, { method: fileId ? 'PATCH' : 'POST', headers: { 'Content-Type': `multipart/related; boundary=${boundary}` }, body })
}

export interface SyncResult {
  pulled: boolean // a remote file existed and was merged in
  written: number // remote rows written locally
  uploaded: boolean // the merged snapshot went up (only when the remote lacked something)
  at: string
}

// One sync cycle: pull the remote snapshot (if any), write its newer rows
// locally, then upload the merged local snapshot when the remote lacks rows
// or holds older ones. The first sync of a device with no remote file uploads
// the local snapshot as the new file.
export async function syncNow(interactive: boolean, deps: SyncDeps = defaultDeps()): Promise<SyncResult> {
  const token = await deps.getToken(interactive)
  const fileId = await findBackupFileId(deps, token)
  let pulled = false
  let written = 0
  let remote: Backup | null = null
  if (fileId) {
    remote = await downloadBackup(deps, token, fileId)
    written = await importData(remote)
    pulled = true
  }
  const local = await exportData()
  const uploaded = remote === null || newerRowCount(local, remote) > 0
  if (uploaded) await uploadBackup(deps, token, fileId, local)
  const at = new Date().toISOString()
  await db.settings.put({ key: 'lastSyncAt', value: at, updatedAt: at })
  return { pulled, written, uploaded, at }
}
