// Sync status shared by the banner, the Settings page and the scheduler
// (TASK 001 section 4, Phase P9 rules). The connection flag and the last sync
// time live in the device-local settings table; the token lives in memory.
import { useSyncExternalStore } from 'react'
import { db } from '../db/db'
import { TokenExpired, clearToken, defaultDeps, syncNow } from './googleDrive'

export type SyncStatus = 'off' | 'idle' | 'syncing' | 'reconnect' | 'offline' | 'error'

export interface SyncState {
  status: SyncStatus
  connected: boolean
  lastSyncAt: string | null
  lastAttemptAt: number | null // any sync attempt, tap or scheduled: the scheduler waits a minute after it
  message: string | null
}

let state: SyncState = { status: 'off', connected: false, lastSyncAt: null, lastAttemptAt: null, message: null }
const listeners = new Set<() => void>()

function set(patch: Partial<SyncState>) {
  state = { ...state, ...patch }
  listeners.forEach((l) => l())
}

export const getSyncState = () => state
export const setSyncStatus = (status: SyncStatus, message: string | null = null) => set({ status, message })

export function useSync(): SyncState {
  return useSyncExternalStore((l) => (listeners.add(l), () => listeners.delete(l)), getSyncState)
}

const setting = async <T,>(key: string): Promise<T | undefined> => (await db.settings.get(key))?.value as T | undefined
const putSetting = (key: string, value: unknown) => db.settings.put({ key, value, updatedAt: new Date().toISOString() })

// Reads the device-local settings into the store; keeps a live status as is.
export async function refreshSync(): Promise<void> {
  const connected = (await setting<boolean>('googleConnected')) === true
  const lastSyncAt = (await setting<string>('lastSyncAt')) ?? null
  const keep = state.status === 'syncing' || state.status === 'reconnect' || state.status === 'error' || state.status === 'offline'
  set({ connected, lastSyncAt, status: connected ? (keep ? state.status : 'idle') : 'off' })
}

// Interactive from a tap (Connect, Sync now, Reconnect); non-interactive from
// the scheduler. An expired token turns into the reconnect banner, never a prompt.
export async function runSync(interactive: boolean): Promise<boolean> {
  if (state.status === 'syncing') return false
  set({ status: 'syncing', message: null, lastAttemptAt: Date.now() })
  try {
    // A device already granted reconnects without the consent screen.
    const result = await syncNow(interactive, defaultDeps(state.connected ? '' : 'consent'))
    if (!state.connected) await putSetting('googleConnected', true)
    set({
      connected: true,
      lastSyncAt: result.at,
      status: 'idle',
      message: result.pulled
        ? `Synced with Google Drive: ${result.written} change${result.written === 1 ? '' : 's'} received${result.uploaded ? ', local changes sent' : ''}.`
        : 'First backup uploaded to Google Drive.',
    })
    return true
  } catch (err) {
    if (err instanceof TokenExpired) set({ status: 'reconnect', message: err.message })
    else set({ status: state.connected ? 'error' : 'off', message: err instanceof Error ? err.message : 'Sync failed.' })
    return false
  }
}

export async function disconnectSync(): Promise<void> {
  clearToken()
  await db.settings.delete('googleConnected')
  set({ connected: false, status: 'off', message: 'Disconnected. Your data stays on this device.' })
}
