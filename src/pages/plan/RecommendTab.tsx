import { useLiveQuery } from 'dexie-react-hooks'
import { useEffect, useMemo, useState } from 'react'
import { Badge, Card, Empty, Field, inputCls, peso, Row } from '../../components/ui'
import GuideLink from '../../components/GuideLink'
import { batchSummary, listBatches } from '../../db/batchRepo'
import { latestPrices, paramsFromPrices, PRICE_ITEM_LABEL } from '../../db/priceLogRepo'
import { todayISO } from '../../engine/dates'
import { projectedWeight } from '../../engine/growth'
import { defaultParams, type EngineParams } from '../../engine/params'
import { sensitivity, SENSITIVITY_CASES } from '../../engine/sensitivity'
import { breakEvenLechonPrice, explain, scoreStrategies, seasonalFactor } from '../../engine/strategy'
import { STRATEGY_INFO } from '../../knowledge/strategies'
import type { BatchKind } from '../../types'
import ParamFields, { overridesFrom, stringsFrom, type NumericKey, type ParamStrings } from './ParamFields'

const PRICE_KEYS: NumericKey[] = ['weanerPerHead', 'liveweightPerKg', 'lechonPerKgLive', 'growOutFeedPricePerKg', 'nurseryFeedPricePerKg']
const GROWTH_KEYS: NumericKey[] = ['marketWeightKg', 'roasterWeightKg', 'adgGrowOut', 'fcrGrowOut', 'weanToFinishMortality', 'nurseryMortality']
const KIND_WEIGHT: Record<BatchKind, number> = { piglets: 12, growers: 40, finishers: 70 }
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

// Sell now or grow out, for one batch (or any head count and weight typed in).
export default function RecommendTab() {
  const today = todayISO()
  const batches = useLiveQuery(() => listBatches(), []) ?? []
  const priced = useLiveQuery(async () => paramsFromPrices(await latestPrices(), defaultParams()), [])
  const [batchId, setBatchId] = useState('')
  const [head, setHead] = useState('8')
  const [weight, setWeight] = useState('12')
  const [saleMonth, setSaleMonth] = useState('')
  const [strings, setStrings] = useState<ParamStrings | null>(null)
  const [showGrowth, setShowGrowth] = useState(false)

  // Prefill the price fields once the price log has been read.
  useEffect(() => {
    if (priced && strings === null) setStrings(stringsFrom(priced.params, [...PRICE_KEYS, ...GROWTH_KEYS]))
  }, [priced, strings])

  // A chosen batch sets the head count and today's estimated weight.
  useEffect(() => {
    const b = batches.find((x) => x.id === batchId)
    if (!b) return
    let cancelled = false
    batchSummary(b, today).then((s) => {
      if (cancelled) return
      setHead(String(b.headCount))
      const last = s.lastWeight
      const kgNow = last ? (s.adg !== null ? projectedWeight(last, s.adg, today) : last.kg) : KIND_WEIGHT[b.kind]
      setWeight(kgNow.toFixed(1))
    })
    return () => {
      cancelled = true
    }
  }, [batchId, batches, today])

  const params = useMemo<EngineParams | null>(() => {
    if (!priced || !strings) return null
    const p = { ...priced.params, ...overridesFrom(strings) }
    if (saleMonth) p.liveweightPerKg = p.liveweightPerKg * seasonalFactor(Number(saleMonth))
    return p
  }, [priced, strings, saleMonth])

  if (!priced || !strings || !params) return null
  const state = { head: Number(head) || 0, weightKg: Number(weight) || 0 }
  const valid = state.head > 0 && state.weightKg > 0
  const score = valid ? scoreStrategies(state, params) : null
  const explanation = score ? explain(score) : null
  const rows = valid ? sensitivity(state, params).filter((r) => r.applicable) : []
  const isWeaner = state.weightKg <= params.weanerWeightKg
  const roasterApplies = !!score?.ranked.some((r) => r.strategy === 'growToRoaster')

  return (
    <>
      <Card title="Pigs">
        <Field label="Batch" hint="or type any head count and weight">
          <select className={inputCls} value={batchId} onChange={(e) => setBatchId(e.target.value)}>
            <option value="">Not from a batch</option>
            {batches.map((b) => <option key={b.id} value={b.id}>{b.name} ({b.headCount} head)</option>)}
          </select>
        </Field>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <Field label="Head"><input type="number" inputMode="numeric" min={1} className={inputCls} value={head} onChange={(e) => setHead(e.target.value)} /></Field>
          <Field label="Average weight now" hint="kg"><input type="number" inputMode="decimal" min={1} step="0.1" className={inputCls} value={weight} onChange={(e) => setWeight(e.target.value)} /></Field>
        </div>
      </Card>

      <Card title="Prices" action={<span className="flex items-center gap-2">{priced.applied.length > 0 ? <Badge tone="green">{priced.applied.length} from your price log</Badge> : <Badge>knowledge defaults</Badge>}<GuideLink id="price-disclaimer" label="Disclaimer" /></span>}>
        <ParamFields keys={PRICE_KEYS} values={strings} onChange={setStrings} />
        <div className="mt-3">
          <Field label="Planned sale month" hint="applies the seasonal price index to the liveweight price">
            <select className={inputCls} value={saleMonth} onChange={(e) => setSaleMonth(e.target.value)}>
              <option value="">No adjustment</option>
              {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m} (x{seasonalFactor(i + 1).toFixed(3)})</option>)}
            </select>
          </Field>
        </div>
        {priced.applied.length > 0 && (
          <p className="mt-2 text-xs text-slate-500">
            From the price log: {priced.applied.map((a) => `${PRICE_ITEM_LABEL[a.observation.item]} ${a.observation.value.toLocaleString('en-PH')} (${a.observation.date})`).join('; ')}.
          </p>
        )}
        <button className="mt-3 text-sm font-semibold text-brand-700" onClick={() => setShowGrowth((v) => !v)}>
          {showGrowth ? 'Hide' : 'Edit'} growth and mortality assumptions
        </button>
        {showGrowth && <div className="mt-3"><ParamFields keys={GROWTH_KEYS} values={strings} onChange={setStrings} /></div>}
      </Card>

      {!score && <Card><Empty>Enter a head count and a weight.</Empty></Card>}
      {score && explanation && (
        <>
          <Card title="Recommendation" action={<GuideLink id="decision-rules" />}>
            {score.ranked.length === 0 && <Empty>No strategy applies to pigs of this weight.</Empty>}
            {score.ranked.map((r, i) => (
              <div key={r.strategy} className={`mb-3 rounded-xl p-3 ring-1 ${i === 0 ? 'bg-brand-50 ring-brand-200' : 'ring-slate-200'}`}>
                <div className="mb-1 flex items-center justify-between gap-2">
                  <span className="font-bold">{i + 1}. {STRATEGY_INFO[r.strategy].name}</span>
                  <span className={`font-bold ${r.margin < 0 ? 'text-red-600' : 'text-green-700'}`}>{r.margin >= 0 ? '+' : ''}{peso(r.margin)}</span>
                </div>
                <p className="text-xs text-slate-500">
                  {r.strategy === 'sellWeaners'
                    ? `Sell the ${r.head} now for ${peso(r.revenue)}; the yardstick the others are measured against.`
                    : `Sell at ${r.targetKg} kg in about ${r.days} days for ${peso(r.revenue)} after ${Math.round((1 - r.survivorShare) * 100)}% mortality; ${peso(r.cash)} of feed and other costs first; ${peso(r.marginPerHead)} per head${r.marginPerDay !== null ? `, ${peso(r.marginPerDay)} per day` : ''} over selling now.`}
                </p>
              </div>
            ))}
            <Row label={isWeaner ? 'Break-even weaner price' : 'Break-even sell-now price'}>{peso(score.breakEvenWeanerPrice)} per head</Row>
            {roasterApplies && <Row label="Break-even lechon live price">{peso(breakEvenLechonPrice(params, state.weightKg))} per kg</Row>}
            {isWeaner && <Row label="Cash-neutral split">sell {score.cashNeutralWeaners} of {state.head} as weaners, grow the rest</Row>}
            <p className="mt-3 text-sm">{explanation.summary}</p>
            <p className="mt-2 text-xs text-slate-400">The app recommends; you decide. Prices move with the season and the trader.</p>
          </Card>

          {rows.length > 0 && (
            <Card title="If prices move">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-left text-slate-500">
                      <th className="py-1 pr-2">Strategy</th>
                      <th className="py-1 pr-2 text-right">Base</th>
                      {SENSITIVITY_CASES.map((c) => <th key={c.id} className="py-1 pr-2 text-right">{c.label}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr key={r.strategy} className="border-t border-slate-100">
                        <td className="py-1 pr-2 font-medium">{STRATEGY_INFO[r.strategy].name}</td>
                        <td className="py-1 pr-2 text-right">{peso(r.margins.base)}</td>
                        {SENSITIVITY_CASES.map((c) => (
                          <td key={c.id} className={`py-1 pr-2 text-right ${r.margins[c.id] < 0 ? 'text-red-600' : ''}`}>{peso(r.margins[c.id])}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-2 text-xs text-slate-400">Margin over selling now under each case; the weaner price is the yardstick and stays put.</p>
            </Card>
          )}

          <Card title={`Assumptions (${explanation.lines.length})`} action={<GuideLink id="projection-assumptions" />}>
            <ul className="list-disc space-y-1 pl-4 text-xs text-slate-600">
              {explanation.lines.map((l) => <li key={l}>{l}</li>)}
            </ul>
            <p className="mt-2 text-xs text-slate-400">Row ids refer to research/parameters.md; the Guide explains each one.</p>
          </Card>
        </>
      )}
    </>
  )
}
