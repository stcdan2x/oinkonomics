import { useState } from 'react'
import { btnPrimary, Card, ErrorText } from '../../components/ui'
import GuideLink from '../../components/GuideLink'
import { booksRows } from '../../db/exportRepo'
import { now } from '../../db/repo'
import { todayISO } from '../../engine/dates'
import type { Period } from '../../engine/finance'
import { booksFilename, buildBooks } from '../../export/books'
import { deliverFile } from '../../export/deliver'
import { sheetsToBlob, XLSX_TYPE } from '../../export/xlsx'

const SHEETS = ['Summary', 'Ledger', 'Sales', 'Sale lines', 'Batch costs', 'Stock moves', 'Stock on hand']

// The accountant workbook for the page's period (TASK 005): one .xlsx built by
// the tested builders, shared or downloaded.
export default function ExportTab({ period }: { period: Period }) {
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function exportBooks() {
    setMessage(null)
    setError(null)
    setBusy(true)
    try {
      const rows = await booksRows(period.to, todayISO())
      const blob = await sheetsToBlob(buildBooks(period, now(), rows))
      const name = booksFilename(period)
      const result = await deliverFile(blob, name, XLSX_TYPE)
      if (result === 'shared') setMessage(`Shared ${name}`)
      if (result === 'saved') setMessage(`Saved ${name}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <Card title="Export to Excel" action={<GuideLink id="read-the-reports" label="Read the reports" />}>
      <p className="text-sm text-slate-600">
        One Excel workbook for {period.from} to {period.to}, the figures the Reports tab shows plus the entries behind them, ready to send to an accountant.
      </p>
      <p className="mt-2 text-xs text-slate-500">Sheets: {SHEETS.join(', ')}. Batch costs are lifetime figures as at the end of the period; Stock on hand is the stock right now.</p>
      <button type="button" className={`mt-3 w-full ${btnPrimary}`} disabled={busy} onClick={() => void exportBooks()}>
        {busy ? 'Building the file' : 'Export to Excel'}
      </button>
      {message && <p className="mt-2 text-sm text-green-700">{message}</p>}
      <ErrorText error={error} />
    </Card>
  )
}
