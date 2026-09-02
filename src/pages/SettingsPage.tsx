import { format } from 'date-fns'
import { useLiveQuery } from 'dexie-react-hooks'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import GuideLink from '../components/GuideLink'
import PageHeader from '../components/PageHeader'
import { Badge, Card, Row, btnDanger, btnPrimary, btnSecondary } from '../components/ui'
import { exportData, importData, pendingChanges } from '../db/backup'
import { disconnectSync, runSync, useSync } from '../sync/store'
import type { Farm } from '../types'

export default function SettingsPage({ farm }: { farm: Farm }) {
  return (
    <>
      <PageHeader title="Settings" subtitle="Farm profile, backup and Google Drive sync" />
      <Card title="Farm">
        <Row label="Farm">{farm.name}</Row>
        <Row label="Location">{farm.location ?? 'not set'}</Row>
        <Row label="Records from">{farm.startDate}</Row>
        <Row label="Currency">{farm.currency}</Row>
        <Link to="/onboarding" className="mt-3 inline-block font-semibold text-brand-700">
          Edit farm profile
        </Link>
      </Card>
      <BackupCard />
      <GoogleDriveCard />
    </>
  )
}

// Manual JSON backup: the path that does not depend on Google.
function BackupCard() {
  const [msg, setMsg] = useState<string | null>(null)

  async function downloadBackup() {
    const backup = await exportData()
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `oinkonomics-backup-${backup.exportedAt.slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    setMsg('Backup file created.')
  }

  async function restoreBackup(file: File) {
    try {
      const written = await importData(JSON.parse(await file.text()))
      setMsg(written === 0 ? 'Nothing new in that file: every record is already here.' : `Restored ${written} record${written === 1 ? '' : 's'} from the backup.`)
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Could not read that file.')
    }
  }

  return (
    <Card title="Backup">
      <p className="mb-3 text-xs text-slate-500">
        Your records live on this device. Export a file any time and keep it somewhere safe; importing merges the file in (newer records win, deletions carry over) and never removes anything newer here.
      </p>
      <div className="flex gap-2">
        <button className={`flex-1 ${btnPrimary}`} onClick={() => void downloadBackup()}>
          Export file
        </button>
        <label className={`flex flex-1 cursor-pointer items-center justify-center ${btnSecondary}`}>
          Import file
          <input type="file" accept="application/json,.json" className="hidden" onChange={(e) => e.target.files?.[0] && void restoreBackup(e.target.files[0])} />
        </label>
      </div>
      {msg && <p className="mt-2 text-xs font-medium text-brand-700">{msg}</p>}
      <div className="mt-2"><GuideLink id="how-the-app-works" label="How deletions and backups work" /></div>
    </Card>
  )
}

const STATUS_LABEL: Record<string, { text: string; tone: 'green' | 'amber' | 'red' | 'slate' | 'brand' }> = {
  idle: { text: 'Connected', tone: 'green' },
  syncing: { text: 'Syncing', tone: 'brand' },
  reconnect: { text: 'Reconnect needed', tone: 'amber' },
  offline: { text: 'Offline', tone: 'slate' },
  error: { text: 'Error', tone: 'red' },
}

function GoogleDriveCard() {
  const sync = useSync()
  const pending = useLiveQuery(() => pendingChanges(sync.lastSyncAt), [sync.lastSyncAt])
  const busy = sync.status === 'syncing'

  if (!sync.connected) {
    return (
      <Card title="Google Drive sync">
        <p className="mb-3 text-xs text-slate-500">
          Keep the phone and the desktop in step through a private app folder in the farm's own Google Drive. No server, no account with us: sign in once with the farm's Google account. Sign-in lasts an hour; after that a one-tap Reconnect appears and your changes wait here until then.
        </p>
        <button className={`w-full ${btnPrimary}`} disabled={busy} onClick={() => void runSync(true)}>
          {busy ? 'Connecting...' : 'Connect Google Drive'}
        </button>
        {sync.message && <p className="mt-2 text-xs font-medium text-red-700">{sync.message}</p>}
      </Card>
    )
  }

  const label = STATUS_LABEL[sync.status] ?? STATUS_LABEL.idle
  return (
    <Card title="Google Drive sync" action={<Badge tone={label.tone}>{label.text}</Badge>}>
      <Row label="Last synced">{sync.lastSyncAt ? format(new Date(sync.lastSyncAt), 'd MMM yyyy HH:mm') : 'never'}</Row>
      <Row label="Changes waiting">{pending ?? '...'}</Row>
      <p className="my-3 text-xs text-slate-500">
        Syncs on open, every five minutes, when you come back to the app and when the connection returns. Changes made offline are sent on the next sync.
      </p>
      <div className="flex gap-2">
        <button className={`flex-1 ${btnPrimary}`} disabled={busy} onClick={() => void runSync(sync.status === 'reconnect')}>
          {busy ? 'Syncing...' : sync.status === 'reconnect' ? 'Reconnect and sync' : 'Sync now'}
        </button>
        <button className={btnDanger} disabled={busy} onClick={() => void disconnectSync()}>
          Disconnect
        </button>
      </div>
      {sync.message && <p className="mt-2 text-xs font-medium text-slate-600">{sync.message}</p>}
    </Card>
  )
}
