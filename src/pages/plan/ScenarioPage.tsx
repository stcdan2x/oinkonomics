import { useLiveQuery } from 'dexie-react-hooks'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageHeader from '../../components/PageHeader'
import { btnDanger, Card, peso, Row } from '../../components/ui'
import { db } from '../../db/db'
import { removeScenario, runScenario, scenarioInput } from '../../db/scenarioRepo'
import { STRATEGY_INFO } from '../../knowledge/strategies'

export default function ScenarioPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const scenario = useLiveQuery(() => db.scenarios.get(id), [id])
  const [confirm, setConfirm] = useState(false)
  if (scenario === undefined) return null
  if (!scenario || scenario.deletedAt) return <PageHeader title="Scenario not found" />
  const input = scenarioInput(scenario)
  const run = runScenario(scenario)
  const fmt = (v: unknown) => (Array.isArray(v) ? v.join(' to ') : typeof v === 'number' && !Number.isInteger(v) ? v.toFixed(v < 1 ? 3 : 2) : String(v))
  return (
    <>
      <PageHeader title={scenario.name} subtitle={`${input.sows} sows, ${STRATEGY_INFO[scenario.strategy].name}, ${input.months} months from ${input.startDate}`} />
      <Card>
        <Row label="Revenue">{peso(run.totals.revenue)}</Row>
        <Row label="Expenses">{peso(run.totals.expenses)}</Row>
        <Row label="Net">{peso(run.totals.net)}</Row>
        <Row label="Peak capital needed">{peso(run.peakCapital)}</Row>
        <Row label="Payback month">{run.paybackMonth ?? 'not reached in the horizon'}</Row>
        {input.startupCost > 0 && <Row label="Startup cost (month 1)">{peso(input.startupCost)}</Row>}
      </Card>
      <Card title="Month by month">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="py-1 pr-2">Month</th>
                <th className="py-1 pr-2 text-right">Pigs</th>
                <th className="py-1 pr-2 text-right">Revenue</th>
                <th className="py-1 pr-2 text-right">Expenses</th>
                <th className="py-1 pr-2 text-right">Net</th>
                <th className="py-1 pr-2 text-right">Cumulative</th>
              </tr>
            </thead>
            <tbody>
              {run.rows.map((r) => (
                <tr key={r.month} className="border-t border-slate-100">
                  <td className="py-1 pr-2 font-medium">{r.month}</td>
                  <td className="py-1 pr-2 text-right">{Math.round(r.pigsOnHand)}</td>
                  <td className="py-1 pr-2 text-right">{peso(r.revenue)}</td>
                  <td className="py-1 pr-2 text-right">{peso(r.expenses)}</td>
                  <td className={`py-1 pr-2 text-right ${r.net < 0 ? 'text-red-600' : ''}`}>{peso(r.net)}</td>
                  <td className={`py-1 pr-2 text-right ${r.cumulative < 0 ? 'text-red-600' : 'text-green-700'}`}>{peso(r.cumulative)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-slate-400">Pigs on hand at month end (weaned piglets until their sale). Expected values: mortality is applied as a share, not as whole pigs.</p>
      </Card>
      <Card title={`Assumptions (${run.assumptions.length})`}>
        <ul className="list-disc space-y-1 pl-4 text-xs text-slate-600">
          {run.assumptions.map((a) => <li key={a.key}>{a.label}: {fmt(a.value)} {a.unit} ({a.source}{a.note ? `; ${a.note}` : ''})</li>)}
        </ul>
      </Card>
      <div className="mx-4 mb-4">
        {!confirm && <button className={`text-sm ${btnDanger}`} onClick={() => setConfirm(true)}>Delete scenario</button>}
        {confirm && (
          <button className={`text-sm ${btnDanger}`} onClick={async () => { await removeScenario(scenario.id); navigate('/plan/scenarios', { replace: true }) }}>
            Tap again to delete
          </button>
        )}
      </div>
    </>
  )
}
