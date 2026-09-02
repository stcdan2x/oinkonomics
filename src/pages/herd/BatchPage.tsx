import { useLiveQuery } from 'dexie-react-hooks'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import PageHeader from '../../components/PageHeader'
import { Badge, btnDanger, btnPrimary, btnSecondary, Card, Empty, ErrorText, Field, inputCls, LinkButton, Row } from '../../components/ui'
import GuideLink from '../../components/GuideLink'
import { STRATEGY_ARTICLE } from '../../guide/types'
import { batchSummary, changeHeadCount, recordBatchWeight, weightsForBatch, type HeadCountReason } from '../../db/batchRepo'
import { db } from '../../db/db'
import { computeFarmCosting } from '../../db/costingRepo'
import { eventsFor } from '../../db/eventRepo'
import { todayISO } from '../../engine/dates'
import { dateToTarget, projectedWeight } from '../../engine/growth'
import { earliestSaleDate } from '../../engine/withdrawal'
import { HERD_DEFAULTS } from '../../knowledge/parameters'
import type { Batch } from '../../types'
import EventList from './EventList'
import { STRATEGY_LABEL } from './labels'
import SaleForm from './SaleForm'
import TreatmentForm from './TreatmentForm'
import { BatchCostingDetail } from '../finance/costingView'
import StockUsedCard from '../inventory/StockUsedCard'

type Panel = null | 'weight' | 'treatment' | 'heads' | 'sale'
const TARGET = HERD_DEFAULTS.marketLiveWeightKg.value

export default function BatchPage() {
  const { id = '' } = useParams()
  const batch = useLiveQuery(() => db.batches.get(id), [id])
  const today = todayISO()
  const summary = useLiveQuery(() => (batch ? batchSummary(batch, today) : undefined), [batch, today])
  const weights = useLiveQuery(() => weightsForBatch(id), [id]) ?? []
  const events = useLiveQuery(() => eventsFor('batch', id), [id]) ?? []
  const costingRow = useLiveQuery(async () => (await computeFarmCosting(today)).batches.find((r) => r.batch.id === id), [id, today])
  const [panel, setPanel] = useState<Panel>(null)
  if (batch === undefined) return null
  if (!batch || batch.deletedAt) return <PageHeader title="Batch not found" />

  const earliest = earliestSaleDate(events)
  const inWithdrawal = !!earliest && earliest > today
  const last = summary?.lastWeight ?? null
  const adg = summary?.adg ?? null
  const projected = last && adg !== null ? projectedWeight(last, adg, today) : null
  const targetDate = last ? dateToTarget(last, TARGET, adg) : null

  return (
    <>
      <PageHeader title={batch.name} subtitle={`${batch.kind}, started ${batch.startDate}. ${STRATEGY_LABEL[batch.strategy]}`} />
      <Card>
        <Row label="Plan"><span className="inline-flex flex-wrap items-center justify-end gap-2">{STRATEGY_LABEL[batch.strategy]} <GuideLink id={STRATEGY_ARTICLE[batch.strategy]} label="Guide" /></span></Row>
        <Row label="Head count">{batch.headCount}</Row>
        <Row label="Days on farm">{summary?.daysOnFarm ?? 0}</Row>
        <Row label="Last weighing">{last ? `${last.kg} kg avg on ${last.date}` : 'none yet'}</Row>
        <Row label="ADG">{adg !== null ? `${(adg * 1000).toFixed(0)} g/day` : 'needs two weighings'}</Row>
        {projected !== null && <Row label="Estimated today">{projected.toFixed(1)} kg avg</Row>}
        {last && <Row label={`Reach ${TARGET} kg (market)`}>{targetDate ?? 'not growing'}</Row>}
        <Row label="Sale allowed from">{earliest ? <>{earliest} {inWithdrawal && <Badge tone="red">in withdrawal</Badge>}</> : 'no withdrawal on record'}</Row>
      </Card>

      {batch.headCount > 0 && (
        <div className="mx-4 mb-4 flex flex-wrap gap-2">
          <button className={`text-sm ${btnPrimary}`} onClick={() => setPanel('weight')}>Weigh</button>
          <button className={`text-sm ${btnSecondary}`} onClick={() => setPanel('treatment')}>Health event</button>
          <button className={`text-sm ${btnSecondary}`} onClick={() => setPanel('sale')}>Sell</button>
          <button className={`text-sm ${btnDanger}`} onClick={() => setPanel('heads')}>Deaths / removals</button>
          <LinkButton to={`/finance/new?batchId=${batch.id}`} secondary>Record expense</LinkButton>
          <LinkButton to={`/inventory/feed?batchId=${batch.id}`} secondary>Record feed</LinkButton>
        </div>
      )}
      {panel === 'weight' && <Card title="Record weighing" action={<GuideLink id="judging-target-weight" />}><WeightForm batch={batch} onDone={() => setPanel(null)} /></Card>}
      {panel === 'treatment' && <Card title="Health event (whole batch)" action={<GuideLink id="withdrawal-periods" />}><TreatmentForm subjectType="batch" subjectId={batch.id} onDone={() => setPanel(null)} /></Card>}
      {panel === 'sale' && <Card title="Sell from this batch" action={<GuideLink id="sale-channels-and-buyers" />}><SaleForm subjectType="batch" subjectId={batch.id} maxHead={batch.headCount} onDone={() => setPanel(null)} /></Card>}
      {panel === 'heads' && <Card title="Deaths and removals" action={<GuideLink id="mortality-benchmarks" />}><HeadCountForm batch={batch} onDone={() => setPanel(null)} /></Card>}

      <StockUsedCard batchId={batch.id} />
      {costingRow && (
        <Card title="Costing" action={<GuideLink id="cost-allocation" />}>
          <BatchCostingDetail row={costingRow} />
        </Card>
      )}

      <Card title="Weights">
        {!weights.length ? <Empty>No weighings yet.</Empty> : weights.map((w) => <Row key={w.date + w.kg} label={w.date}>{w.kg} kg avg</Row>)}
      </Card>
      <EventList subjectType="batch" subjectId={batch.id} />
    </>
  )
}

function WeightForm({ batch, onDone }: { batch: Batch; onDone: () => void }) {
  const [date, setDate] = useState(todayISO())
  const [avg, setAvg] = useState('')
  const [n, setN] = useState('')
  const [error, setError] = useState<string | null>(null)
  async function save() {
    try {
      await recordBatchWeight(batch.id, { date, avgKg: Number(avg), sampleSize: n ? Number(n) : undefined })
      onDone()
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-3 gap-3">
        <Field label="Date"><input type="date" className={inputCls} value={date} onChange={(e) => setDate(e.target.value)} /></Field>
        <Field label="Average kg"><input type="number" min={0} step="0.1" inputMode="decimal" className={inputCls} value={avg} onChange={(e) => setAvg(e.target.value)} /></Field>
        <Field label="Pigs weighed" hint="(opt.)"><input type="number" min={1} inputMode="numeric" className={inputCls} value={n} onChange={(e) => setN(e.target.value)} /></Field>
      </div>
      <ErrorText error={error} />
      <div className="flex gap-2"><button className={btnSecondary} onClick={onDone}>Cancel</button><button className={`flex-1 ${btnPrimary}`} onClick={save}>Save</button></div>
    </div>
  )
}

function HeadCountForm({ batch, onDone }: { batch: Batch; onDone: () => void }) {
  const [reason, setReason] = useState<HeadCountReason>('death')
  const [count, setCount] = useState('1')
  const [date, setDate] = useState(todayISO())
  const [note, setNote] = useState('')
  const [error, setError] = useState<string | null>(null)
  async function save() {
    try {
      await changeHeadCount(batch.id, -Number(count), reason, date, note || undefined)
      onDone()
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-3 gap-3">
        <Field label="Reason">
          <select className={inputCls} value={reason} onChange={(e) => setReason(e.target.value as HeadCountReason)}>
            <option value="death">Died</option><option value="cull">Culled</option><option value="transfer">Moved out</option>
          </select>
        </Field>
        <Field label="Head"><input type="number" min={1} max={batch.headCount} inputMode="numeric" className={inputCls} value={count} onChange={(e) => setCount(e.target.value)} /></Field>
        <Field label="Date"><input type="date" className={inputCls} value={date} onChange={(e) => setDate(e.target.value)} /></Field>
      </div>
      <Field label="Note" hint="(optional)"><input className={inputCls} placeholder="e.g. scours" value={note} onChange={(e) => setNote(e.target.value)} /></Field>
      <ErrorText error={error} />
      <div className="flex gap-2"><button className={btnSecondary} onClick={onDone}>Cancel</button><button className={`flex-1 ${btnDanger}`} onClick={save}>Record</button></div>
    </div>
  )
}
