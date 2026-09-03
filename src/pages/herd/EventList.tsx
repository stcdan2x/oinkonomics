import { useLiveQuery } from 'dexie-react-hooks'
import { useState } from 'react'
import { db } from '../../db/db'
import { eventsFor, undoEvent, updateEvent } from '../../db/eventRepo'
import { withdrawalEnd } from '../../engine/withdrawal'
import type { FarmEvent, SubjectType } from '../../types'
import { btnPrimary, btnSecondary, Card, Empty, ErrorText, Field, inputCls } from '../../components/ui'
import { EVENT_LABEL, OUTCOME_LABEL } from './labels'
import { StockDrawFields, useStockItems } from './TreatmentForm'

function summary(e: FarmEvent): string {
  const d = e.data
  const parts: string[] = []
  if (typeof d.product === 'string') parts.push(d.product)
  if (typeof d.withdrawalDays === 'number') parts.push(`withdrawal ${d.withdrawalDays} d, until ${withdrawalEnd(e.date, d.withdrawalDays)}`)
  if (typeof d.dose === 'string' && d.dose) parts.push(d.dose)
  if (typeof d.stockMoveId === 'string') parts.push('from stock')
  if (typeof d.avgKg === 'number') parts.push(`${d.avgKg} kg avg${typeof d.sampleSize === 'number' ? ` (n=${d.sampleSize})` : ''}`)
  if (typeof d.bornAlive === 'number') parts.push(`${d.bornAlive} alive, ${d.stillborn} stillborn, ${d.mummified} mummified`)
  if (typeof d.weanedCount === 'number') parts.push(`${d.weanedCount} weaned`)
  if (typeof d.delta === 'number') parts.push(`${d.delta > 0 ? '+' : ''}${d.delta} head, now ${d.headCountAfter}`)
  if (typeof d.total === 'number') parts.push(`total ${d.total}`)
  if (d.outcome === 'notPregnant' || d.outcome === 'aborted') parts.push(OUTCOME_LABEL[d.outcome])
  else if (typeof d.outcome === 'string') parts.push(d.outcome)
  if (typeof d.note === 'string' && d.note) parts.push(d.note)
  return parts.join(' / ')
}

// TASK 003 Phase 1: a weighing or a health event can be edited or undone from
// its row; a death, cull or transfer can be undone (the head count or the
// status comes back with it). Sale events go with the sale, litter events with
// the litter, so those rows carry no action.
const EDITABLE = new Set<FarmEvent['type']>(['weight', 'treatment', 'vaccination', 'deworming', 'ironShot'])
const UNDOABLE = new Set<FarmEvent['type']>([...EDITABLE, 'death', 'cull', 'transfer'])

export default function EventList({ subjectType, subjectId }: { subjectType: SubjectType; subjectId: string }) {
  const events = useLiveQuery(() => eventsFor(subjectType, subjectId), [subjectType, subjectId])
  const [editing, setEditing] = useState<string | null>(null)
  const [confirming, setConfirming] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  async function undo(id: string) {
    setError(null)
    try {
      await undoEvent(id)
      setConfirming(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }
  return (
    <Card title="History">
      {!events?.length ? (
        <Empty>No events yet.</Empty>
      ) : (
        <ul>
          {events.map((e) => {
            const canUndo = subjectType !== 'litter' && UNDOABLE.has(e.type)
            return (
              <li key={e.id} className="border-b border-slate-100 py-2 last:border-0">
                <div className="flex gap-3">
                  <span className="w-24 shrink-0 text-slate-500">{e.date}</span>
                  <span className="min-w-0 flex-1">
                    <span className="font-semibold">{EVENT_LABEL[e.type]}</span>
                    {summary(e) && <span className="text-slate-500"> {summary(e)}</span>}
                  </span>
                  {canUndo && editing !== e.id && (
                    <span className="flex shrink-0 gap-2 text-xs">
                      {EDITABLE.has(e.type) && <button type="button" className="text-slate-400" onClick={() => { setEditing(e.id); setConfirming(null); setError(null) }}>Edit</button>}
                      {confirming === e.id ? (
                        <button type="button" className="font-semibold text-red-600" onClick={() => undo(e.id)}>Confirm undo</button>
                      ) : (
                        <button type="button" className="text-slate-400" onClick={() => { setConfirming(e.id); setError(null) }}>Undo</button>
                      )}
                    </span>
                  )}
                </div>
                {editing === e.id && <EventEditForm event={e} onDone={() => setEditing(null)} />}
              </li>
            )
          })}
        </ul>
      )}
      <ErrorText error={error} />
    </Card>
  )
}

function EventEditForm({ event, onDone }: { event: FarmEvent; onDone: () => void }) {
  const weight = event.type === 'weight'
  const d = event.data
  const [date, setDate] = useState(event.date)
  const [avg, setAvg] = useState(typeof d.avgKg === 'number' ? String(d.avgKg) : '')
  const [n, setN] = useState(typeof d.sampleSize === 'number' ? String(d.sampleSize) : '')
  const [product, setProduct] = useState(typeof d.product === 'string' ? d.product : '')
  const [days, setDays] = useState(typeof d.withdrawalDays === 'number' ? String(d.withdrawalDays) : '')
  const [dose, setDose] = useState(typeof d.dose === 'string' ? d.dose : '')
  const [note, setNote] = useState(typeof d.note === 'string' ? d.note : '')
  // TASK 003 Phase 3: the draw from stock starts from the event's live move and
  // is sent on every save (the repo keeps an unchanged draw and its cost).
  const stockItems = useStockItems()
  const moveId = typeof d.stockMoveId === 'string' ? d.stockMoveId : null
  const move = useLiveQuery(async () => (moveId ? ((await db.stockMoves.get(moveId)) ?? null) : null), [moveId])
  const [draw, setDraw] = useState<{ itemId: string; qty: string } | null>(null)
  const current = draw ?? (move && !move.deletedAt ? { itemId: move.itemId, qty: String(-move.qtyDelta) } : { itemId: '', qty: '' })
  const [error, setError] = useState<string | null>(null)
  async function save() {
    try {
      const data = weight
        ? { avgKg: Number(avg), sampleSize: n ? Number(n) : null }
        : { product, withdrawalDays: days.trim() ? Number(days) : null, dose: dose || null, note: note || null }
      const stock = weight ? undefined : current.itemId ? { itemId: current.itemId, qty: Number(current.qty) } : moveId ? null : undefined
      await updateEvent(event.id, { date, data, stock })
      onDone()
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }
  return (
    <div className="mt-2 flex flex-col gap-3 rounded-xl bg-slate-50 p-3">
      {weight ? (
        <div className="grid grid-cols-3 gap-3">
          <Field label="Date"><input type="date" className={inputCls} value={date} onChange={(e) => setDate(e.target.value)} /></Field>
          <Field label="Average kg"><input type="number" min={0} step="0.1" inputMode="decimal" className={inputCls} value={avg} onChange={(e) => setAvg(e.target.value)} /></Field>
          <Field label="Pigs weighed" hint="(opt.)"><input type="number" min={1} inputMode="numeric" className={inputCls} value={n} onChange={(e) => setN(e.target.value)} /></Field>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Date"><input type="date" className={inputCls} value={date} onChange={(e) => setDate(e.target.value)} /></Field>
            <Field label="Product"><input className={inputCls} value={product} onChange={(e) => setProduct(e.target.value)} /></Field>
            <Field label="Withdrawal days" hint="(blank if none)"><input type="number" min={0} inputMode="numeric" className={inputCls} value={days} onChange={(e) => setDays(e.target.value)} /></Field>
            <Field label="Dose" hint="(optional)"><input className={inputCls} value={dose} onChange={(e) => setDose(e.target.value)} /></Field>
          </div>
          <StockDrawFields items={stockItems} itemId={current.itemId} qty={current.qty} onItem={(itemId) => setDraw({ itemId, qty: itemId ? current.qty : '' })} onQty={(qty) => setDraw({ itemId: current.itemId, qty })} />
          <Field label="Note" hint="(optional)"><input className={inputCls} value={note} onChange={(e) => setNote(e.target.value)} /></Field>
        </>
      )}
      <ErrorText error={error} />
      <div className="flex gap-2"><button type="button" className={btnSecondary} onClick={onDone}>Cancel</button><button type="button" className={`flex-1 ${btnPrimary}`} onClick={save}>Save</button></div>
    </div>
  )
}
