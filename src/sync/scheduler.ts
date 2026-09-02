// When a background sync attempt runs (TASK 001 section 4, Phase P9 rules):
// on app open, every five minutes, when the tab becomes visible and when the
// connection returns. A missing or expired token never opens a Google prompt
// by itself: the decision is `reconnect` and the banner asks for one tap.
import { tokenValid } from './googleDrive'
import { getSyncState, refreshSync, runSync, setSyncStatus } from './store'

export const INTERVAL_MS = 5 * 60_000
export const MIN_GAP_MS = 60_000

export interface SyncInput {
  connected: boolean
  online: boolean
  tokenValid: boolean
  busy: boolean
  lastAttemptAt: number | null
  now: number
}

export type SyncDecision = 'sync' | 'reconnect' | 'skip'

export function decideSync(i: SyncInput): SyncDecision {
  if (!i.connected || !i.online || i.busy) return 'skip'
  if (i.lastAttemptAt !== null && i.now - i.lastAttemptAt < MIN_GAP_MS) return 'skip'
  return i.tokenValid ? 'sync' : 'reconnect'
}

// Browser wiring (excluded from TDD, verified in Chrome). Returns the cleanup.
export function startScheduler(): () => void {
  const attempt = async () => {
    const s = getSyncState()
    const decision = decideSync({
      connected: s.connected,
      online: navigator.onLine,
      tokenValid: tokenValid(),
      busy: s.status === 'syncing',
      lastAttemptAt: s.lastAttemptAt,
      now: Date.now(),
    })
    if (decision === 'sync') {
      await runSync(false)
    } else if (decision === 'reconnect') {
      setSyncStatus('reconnect')
    }
  }
  const onVisible = () => {
    if (document.visibilityState === 'visible') void attempt()
  }
  const onOnline = () => {
    if (getSyncState().status === 'offline') setSyncStatus('idle')
    void attempt()
  }
  const onOffline = () => {
    if (getSyncState().connected) setSyncStatus('offline')
  }
  void refreshSync().then(attempt)
  const id = setInterval(attempt, INTERVAL_MS)
  document.addEventListener('visibilitychange', onVisible)
  window.addEventListener('online', onOnline)
  window.addEventListener('offline', onOffline)
  return () => {
    clearInterval(id)
    document.removeEventListener('visibilitychange', onVisible)
    window.removeEventListener('online', onOnline)
    window.removeEventListener('offline', onOffline)
  }
}
