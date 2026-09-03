import { useLiveQuery } from 'dexie-react-hooks'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageHeader from '../../components/PageHeader'
import { Badge, btnDanger, btnPrimary, btnSecondary, Card, Empty, ErrorText, Field, inputCls, ListItem, Row } from '../../components/ui'
import GuideLink from '../../components/GuideLink'
import { listAnimals, reactivateAnimal, removeAnimal, setAnimalStatus } from '../../db/animalRepo'
import { db } from '../../db/db'
import { littersForSow, recordService } from '../../db/litterRepo'
import { expectedFarrowDate, isOpenLitter, sowStage } from '../../engine/breeding'
import { todayISO } from '../../engine/dates'
import type { Animal } from '../../types'
import EventList from './EventList'
import { MILESTONE_LABEL, ROLE_LABEL, STAGE_LABEL, STAGE_TONE } from './labels'
import SaleForm from './SaleForm'
import TreatmentForm from './TreatmentForm'

type Panel = null | 'service' | 'treatment' | 'sale' | 'status'

export default function AnimalPage() {
  const { id = '' } = useParams()
  const animal = useLiveQuery(() => db.animals.get(id), [id])
  const litters = useLiveQuery(() => littersForSow(id), [id])
  const [panel, setPanel] = useState<Panel>(null)
  const [deleting, setDeleting] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const navigate = useNavigate()
  const today = todayISO()
  if (animal === undefined) return null
  if (!animal || animal.deletedAt) return <PageHeader title="Animal not found" />

  const female = animal.sex === 'female'
  const latest = litters?.[0]
  const stage = female ? sowStage(latest, today) : null
  const hasOpen = !!latest && isOpenLitter(latest)
  const active = animal.status === 'active'
  const run = async (fn: () => Promise<unknown>, then?: () => void) => {
    setActionError(null)
    try {
      await fn()
      then?.()
    } catch (e) {
      setActionError(e instanceof Error ? e.message : String(e))
    }
  }

  return (
    <>
      <PageHeader title={animal.tag} subtitle={`${ROLE_LABEL[animal.role]}${animal.breed ? `, ${animal.breed}` : ''}`} />
      <Card>
        <Row label="Status">{active ? 'Active' : `${animal.status} ${animal.statusDate ?? ''}`}</Row>
        {stage && <Row label="Stage"><Badge tone={STAGE_TONE[stage.stage]}>{STAGE_LABEL[stage.stage]}</Badge></Row>}
        {stage?.next && <Row label="Next">{MILESTONE_LABEL[stage.next.type]}: {stage.next.date}</Row>}
        {animal.birthDate && <Row label="Born">{animal.birthDate}</Row>}
        <Row label="Source">{animal.source}</Row>
        {animal.notes && <Row label="Notes">{animal.notes}</Row>}
      </Card>

      {active && (
        <div className="mx-4 mb-4 flex flex-wrap gap-2">
          {female && !hasOpen && <button className={`text-sm ${btnPrimary}`} onClick={() => setPanel('service')}>Record service</button>}
          <button className={`text-sm ${btnSecondary}`} onClick={() => setPanel('treatment')}>Health event</button>
          <button className={`text-sm ${btnSecondary}`} onClick={() => setPanel('sale')}>Sell</button>
          <button className={`text-sm ${btnDanger}`} onClick={() => setPanel('status')}>Cull / died</button>
        </div>
      )}

      {panel === 'service' && <Card title="Record service" action={<GuideLink id="heat-and-service" />}><ServiceForm sow={animal} onDone={() => setPanel(null)} /></Card>}
      {panel === 'treatment' && <Card title="Health event" action={<GuideLink id="withdrawal-periods" />}><TreatmentForm subjectType="animal" subjectId={animal.id} onDone={() => setPanel(null)} /></Card>}
      {panel === 'sale' && <Card title={`Sell ${animal.tag}`} action={<GuideLink id="sale-channels-and-buyers" />}><SaleForm subjectType="animal" subjectId={animal.id} maxHead={1} onDone={() => setPanel(null)} /></Card>}
      {panel === 'status' && <Card title="Remove from the herd"><StatusForm animal={animal} onDone={() => setPanel(null)} /></Card>}

      {female && (
        <Card title="Litters">
          {!litters?.length ? (
            <Empty>No litters recorded.</Empty>
          ) : (
            litters.map((l) => (
              <ListItem
                key={l.id}
                to={`/herd/litters/${l.id}`}
                title={`Served ${l.serviceDate}`}
                subtitle={l.farrowDate ? `Farrowed ${l.farrowDate}: ${l.bornAlive} alive, ${l.weanDate ? `${l.weanedCount} weaned ${l.weanDate}` : 'not yet weaned'}` : l.outcome ? l.outcome : `due ${l.expectedFarrowDate}`}
                right={isOpenLitter(l) ? <Badge tone="brand">open</Badge> : undefined}
              />
            ))
          )}
        </Card>
      )}
      <EventList subjectType="animal" subjectId={animal.id} />
      <div className="mx-4 mb-4 flex flex-wrap items-center gap-2">
        {(animal.status === 'culled' || animal.status === 'dead') && <button className={`text-sm ${btnSecondary}`} onClick={() => run(() => reactivateAnimal(animal.id))}>Reactivate</button>}
        {deleting ? (
          <>
            <button className={`text-sm ${btnDanger}`} onClick={() => run(() => removeAnimal(animal.id), () => navigate('/herd'))}>Confirm delete</button>
            <button className={`text-sm ${btnSecondary}`} onClick={() => { setDeleting(false); setActionError(null) }}>Cancel</button>
          </>
        ) : (
          <button className="text-sm text-slate-400" onClick={() => setDeleting(true)}>Delete animal</button>
        )}
      </div>
      <div className="mx-4"><ErrorText error={actionError} /></div>
    </>
  )
}

function ServiceForm({ sow, onDone }: { sow: Animal; onDone: () => void }) {
  const boars = useLiveQuery(() => listAnimals('boar'), []) ?? []
  const [date, setDate] = useState(todayISO())
  const [sireId, setSireId] = useState('')
  const [aiNote, setAiNote] = useState('')
  const [error, setError] = useState<string | null>(null)
  async function save() {
    try {
      await recordService({ sowId: sow.id, serviceDate: date, sireId: sireId || undefined, aiNote: aiNote || undefined })
      onDone()
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Service date"><input type="date" className={inputCls} value={date} onChange={(e) => setDate(e.target.value)} /></Field>
        <Field label="Boar">
          <select className={inputCls} value={sireId} onChange={(e) => setSireId(e.target.value)}>
            <option value="">AI or outside boar</option>
            {boars.map((b) => <option key={b.id} value={b.id}>{b.tag}</option>)}
          </select>
        </Field>
      </div>
      {!sireId && <Field label="AI / boar note" hint="(optional)"><input className={inputCls} placeholder="e.g. AI center, semen code" value={aiNote} onChange={(e) => setAiNote(e.target.value)} /></Field>}
      <p className="text-sm">Expected farrowing: <b>{expectedFarrowDate(date)}</b> (115 days)</p>
      <ErrorText error={error} />
      <div className="flex gap-2"><button className={btnSecondary} onClick={onDone}>Cancel</button><button className={`flex-1 ${btnPrimary}`} onClick={save}>Save</button></div>
    </div>
  )
}

function StatusForm({ animal, onDone }: { animal: Animal; onDone: () => void }) {
  const [status, setStatus] = useState<'culled' | 'dead'>('culled')
  const [date, setDate] = useState(todayISO())
  const [note, setNote] = useState('')
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  async function save() {
    try {
      await setAnimalStatus(animal.id, status, date, note || undefined)
      onDone()
      navigate('/herd')
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        <Field label="What happened">
          <select className={inputCls} value={status} onChange={(e) => setStatus(e.target.value as 'culled' | 'dead')}>
            <option value="culled">Culled (removed, not sold here)</option><option value="dead">Died</option>
          </select>
        </Field>
        <Field label="Date"><input type="date" className={inputCls} value={date} onChange={(e) => setDate(e.target.value)} /></Field>
      </div>
      <Field label="Reason" hint="(optional)"><input className={inputCls} value={note} onChange={(e) => setNote(e.target.value)} /></Field>
      <ErrorText error={error} />
      <div className="flex gap-2"><button className={btnSecondary} onClick={onDone}>Cancel</button><button className={`flex-1 ${btnDanger}`} onClick={save}>Confirm</button></div>
    </div>
  )
}
