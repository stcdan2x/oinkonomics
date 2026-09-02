import { useLiveQuery } from 'dexie-react-hooks'
import { Link } from 'react-router-dom'
import { Suspense, lazy, type ReactNode } from 'react'
import PageHeader from '../../components/PageHeader'
import PeriodPicker, { usePeriod } from '../../components/PeriodPicker'
import { Badge, Card, Empty, peso } from '../../components/ui'
import GuideLink from '../../components/GuideLink'
import { computeDashboard, type DashboardData } from '../../db/dashboardRepo'
import { SOWS_DUE_DAYS, type DashboardAlert } from '../../engine/dashboard'
import { todayISO } from '../../engine/dates'
import { MILESTONE_LABEL } from '../herd/labels'
import Loading from '../../components/Loading'

const DashboardCharts = lazy(() => import('./Charts'))

// Herd, cash and alerts at a glance. Every number comes from the dashboard
// engine (TASK 001 section 4, Phase P7 rules) and links to the page that
// holds the records behind it.
export default function DashboardPage() {
  const today = todayISO()
  const [period, setPeriod, search] = usePeriod()
  const data = useLiveQuery(() => computeDashboard(period, today), [period.from, period.to, today])
  if (!data) return null
  const h = data.heads
  const profit = data.statement.netIncome
  return (
    <>
      <PageHeader title="Dashboard" subtitle="Herd, cash and alerts at a glance" />
      <PeriodPicker period={period} onChange={setPeriod} />
      <div className="mx-4 mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Tile to="/herd" label="Pigs on farm" value={String(h.total)} note={`${n(h.sows, 'sow')}, ${n(h.gilts, 'gilt')}, ${n(h.boars, 'boar')}; ${h.piglets + h.growers + h.finishers} growing`} />
        <Tile to="/herd/calendar" label={`Sows due (${SOWS_DUE_DAYS} days)`} value={String(data.sowsDue.length)} note={dueNote(data)} tone={data.sowsDue.some((s) => s.overdue) ? 'text-red-600' : undefined} />
        <Tile to="/herd/batches" label="Batches ready to sell" value={String(data.ready.length)} note={data.ready.length ? data.ready.map((r) => data.names.batches.get(r.batch.id)).join(', ') : 'none at target yet'} tone={data.ready.length ? 'text-green-700' : undefined} />
        <Tile to={`/finance/reports${search}`} label="Cash on hand" value={peso(data.cashOnHand)} note="ledger balance to the period end" tone={data.cashOnHand < 0 ? 'text-red-600' : undefined} />
        <Tile to={`/finance${search}`} label="Revenue" value={peso(data.statement.totalRevenue)} note="this period" />
        <Tile to={`/finance${search}`} label="Expenses" value={peso(data.statement.totalExpenses)} note="this period" />
        <Tile to={`/finance/reports${search}`} label="Profit" value={peso(profit)} note="operating result this period" tone={profit < 0 ? 'text-red-600' : 'text-green-700'} />
        <Tile to="/inventory" label="Feed days left" value={data.feedDays === null ? '-' : String(data.feedDays)} note={data.feedDays === null ? 'no feed usage yet' : 'shortest feed item, last 14 days'} tone={data.feedDays !== null && data.feedDays <= 7 ? 'text-amber-700' : undefined} />
        <Tile to="/herd/batches" label="Deaths" value={String(data.deaths)} note="this period" tone={data.deaths > 0 ? 'text-red-600' : undefined} />
      </div>
      <Card title={`Alerts (${data.alerts.length})`} action={<GuideLink id="dashboard-rules" />}>
        {data.alerts.length === 0 && <Empty>Nothing needs attention today.</Empty>}
        {data.alerts.map((a, i) => (
          <AlertRow key={i} alert={a} data={data} />
        ))}
      </Card>
      <Suspense fallback={<Loading />}>
        <DashboardCharts data={data} />
      </Suspense>
    </>
  )
}

const n = (count: number, noun: string) => `${count} ${noun}${count === 1 ? '' : 's'}`

function dueNote(data: DashboardData): string {
  if (!data.sowsDue.length) return 'no farrowing due'
  const overdue = data.sowsDue.filter((s) => s.overdue).length
  const next = data.sowsDue[0]
  return `${overdue ? `${overdue} overdue; ` : ''}next ${data.names.sows.get(next.sowId) ?? 'sow'} on ${next.date}`
}

function Tile({ to, label, value, note, tone }: { to: string; label: string; value: string; note?: string; tone?: string }) {
  return (
    <Link to={to} className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-200">
      <div className="text-xs text-slate-500">{label}</div>
      <div className={`text-xl font-bold ${tone ?? ''}`}>{value}</div>
      {note && <div className="mt-0.5 line-clamp-2 text-[11px] text-slate-400">{note}</div>}
    </Link>
  )
}

function AlertRow({ alert, data }: { alert: DashboardAlert; data: DashboardData }) {
  const { to, title, detail, badge, tone } = describe(alert, data)
  return (
    <Link to={to} className="flex items-center justify-between gap-3 border-b border-slate-100 py-2 last:border-0">
      <div className="min-w-0">
        <div className="font-semibold">{title}</div>
        <div className="text-xs text-slate-500">{detail}</div>
      </div>
      <Badge tone={tone}>{badge}</Badge>
    </Link>
  )
}

function describe(a: DashboardAlert, data: DashboardData): { to: string; title: ReactNode; detail: string; badge: string; tone: 'red' | 'amber' | 'green' | 'brand' } {
  switch (a.type) {
    case 'farrowingOverdue':
      return { to: `/herd/litters/${a.litterId}`, title: data.names.sows.get(a.sowId) ?? 'Sow', detail: `Farrowing was expected ${a.date}`, badge: 'overdue', tone: 'red' }
    case 'stock': {
      const name = data.names.items.get(a.itemId) ?? 'Item'
      const detail = a.alert === 'lowStock' ? 'At or below the reorder level' : a.alert === 'expired' ? 'Expired with stock on hand' : `Expires in ${a.daysToExpiry} day${a.daysToExpiry === 1 ? '' : 's'}`
      return { to: `/inventory/items/${a.itemId}`, title: name, detail, badge: a.alert === 'lowStock' ? 'stock' : a.alert === 'expired' ? 'expired' : 'expiry', tone: a.alert === 'expiring' ? 'amber' : 'red' }
    }
    case 'batchReady':
      return {
        to: `/herd/batches/${a.batchId}`,
        title: data.names.batches.get(a.batchId) ?? 'Batch',
        detail: a.by === 'weight' ? `About ${a.kgNow?.toFixed(1)} kg today, target ${a.targetKg} kg` : `At the target age for ${a.targetKg} kg (no weighing yet)`,
        badge: 'ready',
        tone: 'green',
      }
    case 'milestone':
      return { to: `/herd/litters/${a.litterId}`, title: data.names.sows.get(a.sowId) ?? 'Sow', detail: `${MILESTONE_LABEL[a.milestone]}: ${a.date}`, badge: 'this week', tone: 'brand' }
  }
}
