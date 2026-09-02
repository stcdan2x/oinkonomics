import { Bar, CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, Empty, peso } from '../../components/ui'
import type { DashboardData } from '../../db/dashboardRepo'
import type { HerdCountPoint, MonthPoint } from '../../engine/dashboard'

// The dashboard loads this module lazily (React.lazy needs a default export),
// so Recharts stays out of the first bundle (TASK 001 section 4, step 10.0).
export default function DashboardCharts({ data }: { data: DashboardData }) {
  return (
    <>
      <FinanceChart data={data.monthly} />
      <HerdChart data={data.herd} />
      <CostPerKgChart data={data.costPerKgGain} />
      <PriceChart data={data.prices} />
    </>
  )
}

// Series colours validated for colour-vision separation and contrast on the
// white card (dataviz palette check, 2026-09-02): revenue brand pink, expenses
// blue, profit yellow (below 3:1 on white, so the profit tile and the tooltip
// carry the number).
const REVENUE = '#db2777'
const EXPENSES = '#2a78d6'
const PROFIT = '#eda100'
const BREEDERS = '#db2777'
const PIGS = '#2a78d6'
const GRID = '#e2e8f0'
const INK = '#64748b'

const monthLabel = (m: string) => new Date(`${m}-01T00:00:00`).toLocaleString('en-PH', { month: 'short' })
const shortPeso = (n: number) => (Math.abs(n) >= 1000 ? `${Math.round(n / 1000)}k` : String(Math.round(n)))
const axis = { tick: { fontSize: 11, fill: INK }, axisLine: false, tickLine: false } as const
const tooltipStyle = { fontSize: 12, borderRadius: 8, border: `1px solid ${GRID}` }
// Recharts sorts legend and tooltip items alphabetically by default; keep the series order.
const inOrder = { itemSorter: null } as const
const tooltipInOrder = { itemSorter: () => 0 } as const

export function FinanceChart({ data }: { data: MonthPoint[] }) {
  const empty = data.every((d) => d.revenue === 0 && d.expenses === 0)
  return (
    <Card title="Revenue, expenses and profit by month">
      {empty ? (
        <Empty>No transactions in this period.</Empty>
      ) : (
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barGap={2}>
              <CartesianGrid vertical={false} stroke={GRID} />
              <XAxis dataKey="month" tickFormatter={monthLabel} {...axis} />
              <YAxis tickFormatter={shortPeso} width={40} {...axis} />
              <Tooltip formatter={(v) => peso(Number(v))} labelFormatter={(l) => String(l)} contentStyle={tooltipStyle} {...tooltipInOrder} />
              <Legend wrapperStyle={{ fontSize: 12 }} {...inOrder} />
              <Bar dataKey="revenue" name="Revenue" fill={REVENUE} radius={[4, 4, 0, 0]} maxBarSize={28} />
              <Bar dataKey="expenses" name="Expenses" fill={EXPENSES} radius={[4, 4, 0, 0]} maxBarSize={28} />
              <Line dataKey="profit" name="Profit" stroke={PROFIT} strokeWidth={2} dot={{ r: 4, fill: PROFIT, strokeWidth: 0 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  )
}

export function HerdChart({ data }: { data: HerdCountPoint[] }) {
  const empty = data.every((d) => d.total === 0)
  return (
    <Card title="Herd count at month end">
      {empty ? (
        <Empty>No animals on farm in this period.</Empty>
      ) : (
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke={GRID} />
              <XAxis dataKey="month" tickFormatter={monthLabel} {...axis} />
              <YAxis width={32} allowDecimals={false} {...axis} />
              <Tooltip contentStyle={tooltipStyle} {...tooltipInOrder} />
              <Legend wrapperStyle={{ fontSize: 12 }} {...inOrder} />
              <Bar dataKey="breeders" name="Breeders" stackId="herd" fill={BREEDERS} maxBarSize={28} />
              <Bar dataKey="pigs" name="Pigs in batches" stackId="herd" fill={PIGS} radius={[4, 4, 0, 0]} maxBarSize={28} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  )
}

export function CostPerKgChart({ data }: { data: { batchId: string; name: string; value: number }[] }) {
  return (
    <Card title="Cost per kg gained, per batch">
      {data.length === 0 ? (
        <Empty>Needs a batch with two weighings and some cost recorded.</Empty>
      ) : (
        <div style={{ height: 40 + data.length * 36 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} layout="vertical" margin={{ top: 4, right: 48, left: 8, bottom: 0 }}>
              <CartesianGrid horizontal={false} stroke={GRID} />
              <XAxis type="number" tickFormatter={(v) => `₱${Math.round(Number(v))}`} {...axis} />
              <YAxis type="category" dataKey="name" width={96} {...axis} />
              <Tooltip formatter={(v) => `${peso(Number(v))} per kg`} contentStyle={tooltipStyle} />
              <Bar dataKey="value" name="Cost per kg gained" fill={REVENUE} radius={[0, 4, 4, 0]} maxBarSize={20} label={{ position: 'right', fontSize: 11, fill: INK, formatter: (v: unknown) => `₱${Math.round(Number(v))}` }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  )
}

export function PriceChart({ data }: { data: { date: string; value: number }[] }) {
  return (
    <Card title="Liveweight price log (₱ per kg)">
      {data.length === 0 ? (
        <Empty>Log liveweight prices on the Plan page to see the trend.</Empty>
      ) : (
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke={GRID} />
              <XAxis dataKey="date" tickFormatter={(d) => String(d).slice(5)} {...axis} />
              <YAxis width={36} domain={['auto', 'auto']} {...axis} />
              <Tooltip formatter={(v) => `₱${Number(v)} per kg`} contentStyle={tooltipStyle} />
              <Line dataKey="value" name="Liveweight" stroke={REVENUE} strokeWidth={2} dot={{ r: 4, fill: REVENUE, strokeWidth: 0 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  )
}
