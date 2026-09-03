import { useLiveQuery } from 'dexie-react-hooks'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageHeader from '../../components/PageHeader'
import { Badge, btnDanger, btnPrimary, btnSecondary, Card, ErrorText, Field, inputCls, LinkButton, Row } from '../../components/ui'
import GuideLink from '../../components/GuideLink'
import { STRATEGY_ARTICLE } from '../../guide/types'
import { createBatchFromLitter, listBatches } from '../../db/batchRepo'
import { db } from '../../db/db'
import { closeLitterWithoutFarrowing, recordFarrowing, recordWeaning, reopenLitter, undoFarrowing, undoWeaning, updateFarrowing, updateWeaning } from '../../db/litterRepo'
import { breedingCalendar, expectedWeanDate, isOpenLitter, sowStage } from '../../engine/breeding'
import { plusDays, todayISO } from '../../engine/dates'
import type { Litter, StrategyId } from '../../types'
import EventList from './EventList'
import { MILESTONE_LABEL, STAGE_LABEL, STAGE_TONE, STRATEGY_LABEL, OUTCOME_LABEL } from './labels'

export default function LitterPage() {
  const { id = '' } = useParams()
  const litter = useLiveQuery(() => db.litters.get(id), [id])
  const sow = useLiveQuery(() => (litter ? db.animals.get(litter.sowId) : undefined), [litter?.sowId])
  const sire = useLiveQuery(() => (litter?.sireId ? db.animals.get(litter.sireId) : undefined), [litter?.sireId])
  const batch = useLiveQuery(async () => (await listBatches({ includeEmpty: true })).find((b) => b.litterIds.includes(id)), [id])
  const [closing, setClosing] = useState(false)
  const [fix, setFix] = useState<null | 'farrowing' | 'weaning'>(null)
  const [confirm, setConfirm] = useState<null | 'farrowing' | 'weaning' | 'reopen'>(null)
  const [fixError, setFixError] = useState<string | null>(null)
  const today = todayISO()
  if (litter === undefined) return null
  if (!litter || litter.deletedAt) return <PageHeader title="Litter not found" />

  const stage = sowStage(litter, today)
  const open = isOpenLitter(litter)
  const care = litter.farrowDate ? breedingCalendar([litter], litter.farrowDate, plusDays(litter.farrowDate, 40)) : []
  const closed = litter.outcome === 'notPregnant' || litter.outcome === 'aborted'
  const run = async (fn: () => Promise<unknown>) => {
    setFixError(null)
    try {
      await fn()
      setConfirm(null)
    } catch (e) {
      setFixError(e instanceof Error ? e.message : String(e))
    }
  }
  const confirmButton = (key: 'farrowing' | 'weaning' | 'reopen', label: string, fn: () => Promise<unknown>) =>
    confirm === key ? (
      <button className={`text-sm ${btnDanger}`} onClick={() => run(fn)}>Confirm {label.toLowerCase()}</button>
    ) : (
      <button className="text-sm text-slate-400" onClick={() => { setConfirm(key); setFixError(null) }}>{label}</button>
    )

  return (
    <>
      <PageHeader title={`${sow?.tag ?? 'Sow'}: litter`} subtitle={`Served ${litter.serviceDate}${sire ? ` by ${sire.tag}` : litter.aiNote ? ` (${litter.aiNote})` : ''}`} />
      <Card>
        <Row label="Stage"><Badge tone={STAGE_TONE[stage.stage]}>{STAGE_LABEL[stage.stage]}</Badge></Row>
        {stage.next && <Row label="Next">{MILESTONE_LABEL[stage.next.type]}: {stage.next.date}</Row>}
        <Row label="Expected farrowing">{litter.expectedFarrowDate}</Row>
        {litter.farrowDate && <Row label="Farrowed">{litter.farrowDate}: {litter.bornAlive} alive, {litter.stillborn} stillborn, {litter.mummified} mummified</Row>}
        {litter.farrowDate && !litter.weanDate && <Row label="Wean around">{expectedWeanDate(litter.farrowDate)} (28 days)</Row>}
        {litter.weanDate && <Row label="Weaned">{litter.weanDate}: {litter.weanedCount} of {litter.bornAlive}</Row>}
        {(litter.outcome === 'notPregnant' || litter.outcome === 'aborted') && <Row label="Outcome">{OUTCOME_LABEL[litter.outcome]}</Row>}
        {batch && <Row label="Batch"><LinkButton to={`/herd/batches/${batch.id}`} secondary>{batch.name}</LinkButton></Row>}
        {sow && <Row label="Sow"><LinkButton to={`/herd/animals/${sow.id}`} secondary>{sow.tag}</LinkButton></Row>}
      </Card>

      {open && !litter.farrowDate && (
        <>
          <Card title="Record farrowing" action={<GuideLink id="farrowing-week-checklist" />}><FarrowingForm litter={litter} /></Card>
          <div className="mx-4 mb-4">
            {closing ? <Card title="Close without farrowing"><CloseForm litter={litter} onDone={() => setClosing(false)} /></Card> : (
              <button className={`text-sm ${btnDanger}`} onClick={() => setClosing(true)}>Not pregnant / aborted</button>
            )}
          </div>
        </>
      )}
      {open && litter.farrowDate && !litter.weanDate && <Card title="Record weaning" action={<GuideLink id="lactation-and-weaning" />}><WeaningForm litter={litter} /></Card>}
      {litter.weanDate && !batch && <Card title="Start a batch from this litter" action={<GuideLink id="decision-rules" />}><BatchFromLitterForm litter={litter} /></Card>}

      {(litter.farrowDate || closed) && (
        <div className="mx-4 mb-4 flex flex-wrap items-center gap-2">
          {litter.farrowDate && !litter.weanDate && <button className="text-sm text-slate-400" onClick={() => setFix('farrowing')}>Edit farrowing</button>}
          {litter.farrowDate && !litter.weanDate && confirmButton('farrowing', 'Undo farrowing', () => undoFarrowing(litter.id))}
          {litter.weanDate && !batch && <button className="text-sm text-slate-400" onClick={() => setFix('weaning')}>Edit weaning</button>}
          {litter.weanDate && !batch && confirmButton('weaning', 'Undo weaning', () => undoWeaning(litter.id))}
          {closed && confirmButton('reopen', 'Reopen litter', () => reopenLitter(litter.id))}
          {confirm && <button className={`text-sm ${btnSecondary}`} onClick={() => { setConfirm(null); setFixError(null) }}>Cancel</button>}
        </div>
      )}
      <div className="mx-4"><ErrorText error={fixError} /></div>
      {fix === 'farrowing' && <Card title="Edit farrowing"><EditFarrowingForm litter={litter} onDone={() => setFix(null)} /></Card>}
      {fix === 'weaning' && <Card title="Edit weaning"><EditWeaningForm litter={litter} onDone={() => setFix(null)} /></Card>}

      {!!care.length && !litter.weanDate && (
        <Card title="Piglet care schedule">
          {care.map((c, k) => (
            <Row key={k} label={c.date}>{MILESTONE_LABEL[c.type]}{c.date < today && <Badge tone="amber">past</Badge>}</Row>
          ))}
        </Card>
      )}
      <EventList subjectType="litter" subjectId={litter.id} />
    </>
  )
}

function FarrowingForm({ litter }: { litter: Litter }) {
  const [date, setDate] = useState(todayISO())
  const [alive, setAlive] = useState('')
  const [still, setStill] = useState('0')
  const [mumm, setMumm] = useState('0')
  const [error, setError] = useState<string | null>(null)
  async function save() {
    try {
      await recordFarrowing(litter.id, { farrowDate: date, bornAlive: Number(alive), stillborn: Number(still), mummified: Number(mumm) })
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Farrowing date"><input type="date" className={inputCls} value={date} onChange={(e) => setDate(e.target.value)} /></Field>
        <Field label="Born alive"><input type="number" min={0} inputMode="numeric" className={inputCls} value={alive} onChange={(e) => setAlive(e.target.value)} /></Field>
        <Field label="Stillborn"><input type="number" min={0} inputMode="numeric" className={inputCls} value={still} onChange={(e) => setStill(e.target.value)} /></Field>
        <Field label="Mummified"><input type="number" min={0} inputMode="numeric" className={inputCls} value={mumm} onChange={(e) => setMumm(e.target.value)} /></Field>
      </div>
      <ErrorText error={error} />
      <button className={btnPrimary} onClick={save}>Save farrowing</button>
    </div>
  )
}

function EditFarrowingForm({ litter, onDone }: { litter: Litter; onDone: () => void }) {
  const [date, setDate] = useState(litter.farrowDate ?? todayISO())
  const [alive, setAlive] = useState(String(litter.bornAlive))
  const [still, setStill] = useState(String(litter.stillborn))
  const [mumm, setMumm] = useState(String(litter.mummified))
  const [error, setError] = useState<string | null>(null)
  async function save() {
    try {
      await updateFarrowing(litter.id, { farrowDate: date, bornAlive: Number(alive), stillborn: Number(still), mummified: Number(mumm) })
      onDone()
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Farrowing date"><input type="date" className={inputCls} value={date} onChange={(e) => setDate(e.target.value)} /></Field>
        <Field label="Born alive"><input type="number" min={0} inputMode="numeric" className={inputCls} value={alive} onChange={(e) => setAlive(e.target.value)} /></Field>
        <Field label="Stillborn"><input type="number" min={0} inputMode="numeric" className={inputCls} value={still} onChange={(e) => setStill(e.target.value)} /></Field>
        <Field label="Mummified"><input type="number" min={0} inputMode="numeric" className={inputCls} value={mumm} onChange={(e) => setMumm(e.target.value)} /></Field>
      </div>
      <ErrorText error={error} />
      <div className="flex gap-2"><button className={btnSecondary} onClick={onDone}>Cancel</button><button className={`flex-1 ${btnPrimary}`} onClick={save}>Save</button></div>
    </div>
  )
}

function EditWeaningForm({ litter, onDone }: { litter: Litter; onDone: () => void }) {
  const [date, setDate] = useState(litter.weanDate ?? todayISO())
  const [count, setCount] = useState(String(litter.weanedCount))
  const [error, setError] = useState<string | null>(null)
  async function save() {
    try {
      await updateWeaning(litter.id, { weanDate: date, weanedCount: Number(count) })
      onDone()
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Weaning date"><input type="date" className={inputCls} value={date} onChange={(e) => setDate(e.target.value)} /></Field>
        <Field label="Piglets weaned" hint={`(of ${litter.bornAlive})`}><input type="number" min={0} max={litter.bornAlive} inputMode="numeric" className={inputCls} value={count} onChange={(e) => setCount(e.target.value)} /></Field>
      </div>
      <ErrorText error={error} />
      <div className="flex gap-2"><button className={btnSecondary} onClick={onDone}>Cancel</button><button className={`flex-1 ${btnPrimary}`} onClick={save}>Save</button></div>
    </div>
  )
}

function WeaningForm({ litter }: { litter: Litter }) {
  const [date, setDate] = useState(litter.farrowDate ? expectedWeanDate(litter.farrowDate) : todayISO())
  const [count, setCount] = useState(String(litter.bornAlive))
  const [error, setError] = useState<string | null>(null)
  async function save() {
    try {
      await recordWeaning(litter.id, { weanDate: date, weanedCount: Number(count) })
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Weaning date"><input type="date" className={inputCls} value={date} onChange={(e) => setDate(e.target.value)} /></Field>
        <Field label="Piglets weaned" hint={`(of ${litter.bornAlive})`}><input type="number" min={0} max={litter.bornAlive} inputMode="numeric" className={inputCls} value={count} onChange={(e) => setCount(e.target.value)} /></Field>
      </div>
      <ErrorText error={error} />
      <button className={btnPrimary} onClick={save}>Save weaning</button>
    </div>
  )
}

function CloseForm({ litter, onDone }: { litter: Litter; onDone: () => void }) {
  const [outcome, setOutcome] = useState<'notPregnant' | 'aborted'>('notPregnant')
  const [date, setDate] = useState(todayISO())
  const [note, setNote] = useState('')
  const [error, setError] = useState<string | null>(null)
  async function save() {
    try {
      await closeLitterWithoutFarrowing(litter.id, outcome, date, note || undefined)
      onDone()
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Outcome">
          <select className={inputCls} value={outcome} onChange={(e) => setOutcome(e.target.value as 'notPregnant' | 'aborted')}>
            <option value="notPregnant">Returned to heat / not pregnant</option><option value="aborted">Aborted</option>
          </select>
        </Field>
        <Field label="Date"><input type="date" className={inputCls} value={date} onChange={(e) => setDate(e.target.value)} /></Field>
      </div>
      <Field label="Note" hint="(optional)"><input className={inputCls} value={note} onChange={(e) => setNote(e.target.value)} /></Field>
      <ErrorText error={error} />
      <div className="flex gap-2"><button className={btnSecondary} onClick={onDone}>Cancel</button><button className={`flex-1 ${btnDanger}`} onClick={save}>Close litter</button></div>
    </div>
  )
}

function BatchFromLitterForm({ litter }: { litter: Litter }) {
  const [strategy, setStrategy] = useState<StrategyId>('undecided')
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  async function save() {
    try {
      const b = await createBatchFromLitter(litter.id, { strategy, name: name || undefined })
      navigate(`/herd/batches/${b.id}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-slate-500">{litter.weanedCount} weaned piglets become a batch you can weigh, treat and sell together.</p>
      <Field label="Plan for this batch">
        <select className={inputCls} value={strategy} onChange={(e) => setStrategy(e.target.value as StrategyId)}>
          {(Object.keys(STRATEGY_LABEL) as StrategyId[]).map((s) => <option key={s} value={s}>{STRATEGY_LABEL[s]}</option>)}
        </select>
        <GuideLink id={STRATEGY_ARTICLE[strategy]} />
      </Field>
      <Field label="Batch name" hint="(optional)"><input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} /></Field>
      <ErrorText error={error} />
      <button className={btnPrimary} onClick={save}>Create batch</button>
    </div>
  )
}
