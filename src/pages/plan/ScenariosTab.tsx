import { useLiveQuery } from 'dexie-react-hooks'
import { Card, Empty, LinkButton, ListItem, peso } from '../../components/ui'
import { listScenarios, runScenario, scenarioInput } from '../../db/scenarioRepo'
import { STRATEGY_INFO } from '../../knowledge/strategies'

// Saved scenarios side by side (PLAN.md section 7 projection view).
export default function ScenariosTab() {
  const scenarios = useLiveQuery(() => listScenarios(), [])
  if (!scenarios) return null
  const runs = scenarios.map((s) => ({ s, run: runScenario(s) }))
  return (
    <>
      <div className="mx-4 mb-4"><LinkButton to="/plan/scenarios/new">New scenario</LinkButton></div>
      {runs.length === 0 && <Card><Empty>No scenarios yet. A scenario projects N sows on one strategy month by month.</Empty></Card>}
      {runs.length > 0 && (
        <Card title="Side by side">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-left text-slate-500">
                  <th className="py-1 pr-2"></th>
                  {runs.map(({ s }) => <th key={s.id} className="py-1 pr-2 text-right">{s.name}</th>)}
                </tr>
              </thead>
              <tbody>
                <Line label="Sows" cells={runs.map(({ s }) => String(scenarioInput(s).sows))} />
                <Line label="Strategy" cells={runs.map(({ s }) => STRATEGY_INFO[s.strategy].name)} />
                <Line label="Months" cells={runs.map(({ s }) => String(scenarioInput(s).months))} />
                <Line label="Revenue" cells={runs.map(({ run }) => peso(run.totals.revenue))} />
                <Line label="Expenses" cells={runs.map(({ run }) => peso(run.totals.expenses))} />
                <Line label="Net" cells={runs.map(({ run }) => peso(run.totals.net))} />
                <Line label="Peak capital" cells={runs.map(({ run }) => peso(run.peakCapital))} />
                <Line label="Payback" cells={runs.map(({ run }) => run.paybackMonth ?? 'not reached')} />
              </tbody>
            </table>
          </div>
        </Card>
      )}
      {runs.length > 0 && (
        <Card title="Scenarios">
          {runs.map(({ s, run }) => (
            <ListItem key={s.id} to={`/plan/scenarios/${s.id}`} title={s.name} subtitle={`${scenarioInput(s).sows} sows, ${STRATEGY_INFO[s.strategy].name}, from ${scenarioInput(s).startDate}`} right={<span className={run.totals.net < 0 ? 'text-red-600' : 'text-green-700'}>{peso(run.totals.net)}</span>} />
          ))}
        </Card>
      )}
    </>
  )
}

function Line({ label, cells }: { label: string; cells: string[] }) {
  return (
    <tr className="border-t border-slate-100">
      <td className="py-1 pr-2 text-slate-500">{label}</td>
      {cells.map((c, i) => <td key={i} className="py-1 pr-2 text-right font-medium">{c}</td>)}
    </tr>
  )
}
