import { useLiveQuery } from 'dexie-react-hooks'
import { useState } from 'react'
import PageHeader from '../../components/PageHeader'
import PeriodPicker, { usePeriod } from '../../components/PeriodPicker'
import { Badge, Card, Empty, LinkButton, peso, SubNav } from '../../components/ui'
import { db } from '../../db/db'
import { listTransactions, removeTransaction } from '../../db/transactionRepo'
import { categoryLabel, KIND_LABEL } from '../../knowledge/categories'
import type { Transaction, TransactionKind } from '../../types'
import ReportsTab from './ReportsTab'
import BatchesTab from './BatchesTab'

export type FinanceTab = 'ledger' | 'reports' | 'batches'

const KIND_TONE: Record<TransactionKind, 'brand' | 'slate' | 'amber' | 'red' | 'green'> = {
  expense: 'red',
  revenue: 'green',
  capital: 'amber',
  drawing: 'slate',
  loan: 'brand',
  loanPayment: 'slate',
}

// Money leaving the farm is shown negative in the ledger; money coming in, positive.
export const OUTFLOW_KINDS: TransactionKind[] = ['expense', 'capital', 'drawing', 'loanPayment']

export default function FinancePage({ tab }: { tab: FinanceTab }) {
  const [period, setPeriod, search] = usePeriod()
  const tabs = [
    { to: `/finance${search}`, label: 'Ledger', end: true },
    { to: `/finance/reports${search}`, label: 'Reports' },
    { to: `/finance/batches${search}`, label: 'Batches' },
  ]
  return (
    <>
      <PageHeader title="Finance" subtitle="Ledger, reports and batch costs" />
      <SubNav items={tabs} />
      {tab !== 'batches' && <PeriodPicker period={period} onChange={setPeriod} />}
      {tab === 'ledger' && <LedgerTab from={period.from} to={period.to} />}
      {tab === 'reports' && <ReportsTab from={period.from} to={period.to} />}
      {tab === 'batches' && <BatchesTab />}
    </>
  )
}

function LedgerTab({ from, to }: { from: string; to: string }) {
  const txs = useLiveQuery(() => listTransactions({ from, to }), [from, to])
  const batches = useLiveQuery(() => db.batches.toArray(), []) ?? []
  const animals = useLiveQuery(() => db.animals.toArray(), []) ?? []
  if (!txs) return null
  const revenue = txs.filter((t) => t.kind === 'revenue').reduce((s, t) => s + t.amount, 0)
  const expenses = txs.filter((t) => t.kind === 'expense').reduce((s, t) => s + t.amount, 0)
  const linkName = (t: Transaction) => {
    if (t.links.batchId) return batches.find((b) => b.id === t.links.batchId)?.name ?? 'batch'
    if (t.links.animalId) return animals.find((a) => a.id === t.links.animalId)?.tag ?? 'animal'
    return null
  }
  return (
    <>
      <Card>
        <div className="grid grid-cols-3 gap-2 text-center">
          <Stat label="Revenue" value={peso(revenue)} />
          <Stat label="Expenses" value={peso(expenses)} />
          <Stat label="Net" value={peso(revenue - expenses)} tone={revenue - expenses < 0 ? 'text-red-600' : 'text-green-700'} />
        </div>
        <p className="mt-2 text-center text-xs text-slate-400">Operating only: capital, drawings and loans are listed below but not in these totals.</p>
      </Card>
      <div className="mx-4 mb-4">
        <LinkButton to="/finance/new">Record a transaction</LinkButton>
      </div>
      <Card title={`Entries (${txs.length})`}>
        {txs.length === 0 && <Empty>No transactions in this period.</Empty>}
        {txs.map((t) => (
          <LedgerRow key={t.id} tx={t} link={linkName(t)} />
        ))}
      </Card>
    </>
  )
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div>
      <div className="text-xs text-slate-500">{label}</div>
      <div className={`text-lg font-bold ${tone ?? ''}`}>{value}</div>
    </div>
  )
}

function LedgerRow({ tx, link }: { tx: Transaction; link: string | null }) {
  const [confirming, setConfirming] = useState(false)
  const out = OUTFLOW_KINDS.includes(tx.kind)
  return (
    <div className="flex items-center justify-between gap-3 border-b border-slate-100 py-3 last:border-0">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold">{categoryLabel(tx.category)}</span>
          <Badge tone={KIND_TONE[tx.kind]}>{KIND_LABEL[tx.kind]}</Badge>
          {link && <Badge>{link}</Badge>}
          {tx.links.itemId && <Badge tone="amber">Stock</Badge>}
        </div>
        <div className="truncate text-xs text-slate-500">
          {tx.date}
          {tx.note ? ` · ${tx.note}` : ''}
        </div>
      </div>
      <div className="shrink-0 text-right">
        <div className={`font-semibold ${out ? 'text-red-600' : 'text-green-700'}`}>{out ? '-' : '+'}{peso(tx.amount)}</div>
        {tx.links.saleId ? (
          <span className="text-xs text-slate-400">from sale</span>
        ) : tx.links.itemId ? (
          <span className="text-xs text-slate-400">from inventory</span>
        ) : confirming ? (
          <button type="button" className="text-xs font-semibold text-red-600" onClick={() => removeTransaction(tx.id)}>Confirm delete</button>
        ) : (
          <button type="button" className="text-xs text-slate-400" onClick={() => setConfirming(true)}>Delete</button>
        )}
      </div>
    </div>
  )
}
