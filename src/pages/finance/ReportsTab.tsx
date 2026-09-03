import { useLiveQuery } from 'dexie-react-hooks'
import { Card, peso } from '../../components/ui'
import GuideLink from '../../components/GuideLink'
import { db } from '../../db/db'
import { cashFlow, incomeStatement, type CategoryTotal } from '../../engine/finance'
import { categoryLabel } from '../../knowledge/categories'
import UnitCostsCard from './UnitCostsCard'

export default function ReportsTab({ from, to }: { from: string; to: string }) {
  const txs = useLiveQuery(() => db.transactions.toArray(), [])
  if (!txs) return null
  const is = incomeStatement(txs, from, to)
  const cf = cashFlow(txs, from, to)
  return (
    <>
      <Card title="Income statement" action={<GuideLink id="money-rules" />}>
        <Section title="Revenue" rows={is.revenue} />
        <Total label="Total revenue" value={is.totalRevenue} />
        <Section title="Expenses" rows={is.expenses} />
        <Total label="Total expenses" value={is.totalExpenses} />
        <Total label="Net income" value={is.netIncome} strong />
        <p className="mt-2 text-xs text-slate-400">Operating result: capital purchases, drawings, loans and the owner's capital in are in the cash flow below, not here.</p>
      </Card>
      <Card title="Cash flow" action={<GuideLink id="money-rules" label="Money rules" />}>
        <Line label="Opening balance" value={cf.openingBalance} />
        <Line label="Operating in (revenue)" value={cf.operatingIn} />
        <Line label="Operating out (expenses)" value={-cf.operatingOut} />
        <Line label="Capital purchases" value={-cf.capitalOut} />
        <Line label="Loans received" value={cf.loansIn} />
        <Line label="Loan repayments" value={-cf.loanPaymentsOut} />
        <Line label="Owner's capital in" value={cf.ownerCapitalIn} />
        <Line label="Owner drawings" value={-cf.drawingsOut} />
        <Total label="Net cash this period" value={cf.netCash} />
        <Total label="Closing balance" value={cf.closingBalance} strong />
        <p className="mt-2 text-xs text-slate-400">The opening balance is the sum of every entry before the period; it assumes the ledger starts at zero.</p>
      </Card>
      <UnitCostsCard from={from} to={to} netIncome={is.netIncome} />
    </>
  )
}

function Section({ title, rows }: { title: string; rows: CategoryTotal[] }) {
  return (
    <>
      <div className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-400">{title}</div>
      {rows.length === 0 && <div className="py-1 text-sm text-slate-400">none</div>}
      {rows.map((r) => <Line key={r.category} label={categoryLabel(r.category)} value={r.amount} />)}
    </>
  )
}

function Line({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between py-1 text-sm">
      <span className="text-slate-600">{label}</span>
      <span className={value < 0 ? 'text-red-600' : ''}>{value < 0 ? '-' : ''}{peso(Math.abs(value))}</span>
    </div>
  )
}

function Total({ label, value, strong }: { label: string; value: number; strong?: boolean }) {
  return (
    <div className={`flex justify-between border-t border-slate-200 py-1.5 text-sm font-semibold ${strong ? 'text-base' : ''}`}>
      <span>{label}</span>
      <span className={value < 0 ? 'text-red-600' : strong ? 'text-green-700' : ''}>{value < 0 ? '-' : ''}{peso(Math.abs(value))}</span>
    </div>
  )
}
