import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/PageHeader'
import { btnPrimary, btnSecondary, Card, ErrorText, Field, inputCls } from '../../components/ui'
import GuideLink from '../../components/GuideLink'
import { saveScenario } from '../../db/scenarioRepo'
import { todayISO } from '../../engine/dates'
import { defaultParams } from '../../engine/params'
import { STRATEGY_INFO } from '../../knowledge/strategies'
import type { StrategyId } from '../../types'
import ParamFields, { overridesFrom, stringsFrom, type NumericKey } from './ParamFields'

const STRATEGIES: StrategyId[] = ['sellWeaners', 'growToRoaster', 'growToMarket']
const KEYS: NumericKey[] = ['weanerPerHead', 'liveweightPerKg', 'lechonPerKgLive', 'growOutFeedPricePerKg', 'sowFeedPricePerKg', 'weanedPerLitter', 'littersPerSowYear', 'weanToFinishMortality', 'labourPerLitter']

export default function ScenarioFormPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [sows, setSows] = useState('2')
  const [strategy, setStrategy] = useState<StrategyId>('growToMarket')
  const [startDate, setStartDate] = useState(todayISO())
  const [months, setMonths] = useState('24')
  const [startupCost, setStartupCost] = useState('0')
  const [strings, setStrings] = useState(() => stringsFrom(defaultParams(), KEYS))
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setSaving(true)
    try {
      const s = await saveScenario({ name, strategy, sows: Number(sows), startDate, months: Number(months), startupCost: Number(startupCost) || 0, overrides: overridesFrom(strings) })
      navigate(`/plan/scenarios/${s.id}`, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <PageHeader title="New scenario" subtitle="N sows on one strategy, month by month" />
      <form onSubmit={submit}>
        <Card>
          <Field label="Name"><input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. 2 sows, grow to market" required /></Field>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Field label="Sows"><input type="number" inputMode="numeric" min={1} className={inputCls} value={sows} onChange={(e) => setSows(e.target.value)} required /></Field>
            <Field label="Strategy">
              <select className={inputCls} value={strategy} onChange={(e) => setStrategy(e.target.value as StrategyId)}>
                {STRATEGIES.map((s) => <option key={s} value={s}>{STRATEGY_INFO[s].name}</option>)}
              </select>
            </Field>
            <Field label="Start date" hint="sows served"><input type="date" className={inputCls} value={startDate} onChange={(e) => setStartDate(e.target.value)} required /></Field>
            <Field label="Months" hint="12 to 36"><input type="number" inputMode="numeric" min={12} max={36} className={inputCls} value={months} onChange={(e) => setMonths(e.target.value)} required /></Field>
          </div>
          <div className="mt-3">
            <Field label="Startup cost (₱)" hint="pens, gilts, permits paid in the first month"><input type="number" inputMode="decimal" min={0} className={inputCls} value={startupCost} onChange={(e) => setStartupCost(e.target.value)} /></Field>
          </div>
        </Card>
        <Card title="Assumptions" action={<GuideLink id="projection-assumptions" />}>
          <ParamFields keys={KEYS} values={strings} onChange={setStrings} />
          <ErrorText error={error} />
          <div className="mt-3 flex gap-2">
            <button type="submit" className={btnPrimary} disabled={saving}>Save and project</button>
            <button type="button" className={btnSecondary} onClick={() => navigate(-1)}>Cancel</button>
          </div>
        </Card>
      </form>
    </>
  )
}
