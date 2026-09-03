import { useLiveQuery } from 'dexie-react-hooks'
import { Card, peso, Row } from '../../components/ui'
import GuideLink from '../../components/GuideLink'
import { computeFarmCosting, herdTotals } from '../../db/costingRepo'
import { db } from '../../db/db'
import { todayISO } from '../../engine/dates'
import { ALL_TIME } from '../../engine/finance'
import { costPerWeanedPiglet, paybackDate, roi } from '../../engine/unitCosts'

export default function UnitCostsCard({ from, to, netIncome }: { from: string; to: string; netIncome: number }) {
  const today = todayISO()
  const costing = useLiveQuery(() => computeFarmCosting(today), [today])
  const txs = useLiveQuery(() => db.transactions.toArray(), [])
  if (!costing || !txs) return null
  const herd = herdTotals(costing, from, to)
  const perPiglet = costPerWeanedPiglet(herd.cost, herd.weaned)
  const capital = txs.filter((t) => !t.deletedAt && t.kind === 'capital' && t.date <= to).reduce((s, t) => s + t.amount, 0)
  const r = roi(netIncome, capital)
  const payback = paybackDate(txs)
  return (
    <Card title="Unit costs and capital" action={<GuideLink id="unit-costs-and-break-even" />}>
      <Row label={`Breeding herd cost (${herd.months.length} month${herd.months.length === 1 ? '' : 's'})`}>{peso(herd.cost)}</Row>
      <Row label="Piglets weaned">{herd.weaned}</Row>
      <Row label="Cost per weaned piglet">{perPiglet !== null ? peso(perPiglet) : 'no weaning in these months'}</Row>
      <Row label={to === ALL_TIME.to ? 'Capital spent to date' : `Capital spent to ${to}`}>{peso(capital)}</Row>
      <Row label="ROI (net income / capital)">{r !== null ? `${(r * 100).toFixed(1)}%` : 'no capital recorded'}</Row>
      <Row label="Capital paid back">{payback ?? 'not yet'}</Row>
      <p className="mt-2 text-xs text-slate-400">Herd cost = expenses linked to sows, gilts and boars plus their head-day share of shared expenses, over the calendar months touching the period. Payback is the day cumulative net operating income first covered all capital spent.</p>
    </Card>
  )
}
