import { useState } from 'react'
import { recordTreatment, type TreatmentInput } from '../../db/eventRepo'
import { todayISO } from '../../engine/dates'
import { withdrawalEnd } from '../../engine/withdrawal'
import { WITHDRAWAL_PRODUCTS, findProduct } from '../../knowledge/withdrawal'
import type { SubjectType } from '../../types'
import { btnPrimary, btnSecondary, ErrorText, Field, inputCls } from '../../components/ui'

const OTHER = '__other__'
const TYPES: { id: TreatmentInput['type']; label: string }[] = [
  { id: 'treatment', label: 'Treatment (medicine)' },
  { id: 'deworming', label: 'Deworming' },
  { id: 'vaccination', label: 'Vaccination' },
  { id: 'ironShot', label: 'Iron shot' },
]

export default function TreatmentForm({ subjectType, subjectId, onDone }: { subjectType: SubjectType; subjectId: string; onDone: () => void }) {
  const [type, setType] = useState<TreatmentInput['type']>('treatment')
  const [productKey, setProductKey] = useState(WITHDRAWAL_PRODUCTS[0].name)
  const [custom, setCustom] = useState('')
  const [days, setDays] = useState(String(WITHDRAWAL_PRODUCTS[0].days ?? ''))
  const [date, setDate] = useState(todayISO())
  const [dose, setDose] = useState('')
  const [note, setNote] = useState('')
  const [error, setError] = useState<string | null>(null)

  const product = productKey === OTHER ? custom : productKey
  const known = findProduct(productKey)
  const daysNum = days.trim() === '' ? null : Number(days)

  function pick(key: string) {
    setProductKey(key)
    const p = findProduct(key)
    setDays(p && p.days !== null ? String(p.days) : '')
  }

  async function save() {
    try {
      if (type !== 'ironShot' && daysNum === null) throw new Error('Enter the withdrawal days from the product label (0 if none)')
      await recordTreatment({ subjectType, subjectId, type, date, product, withdrawalDays: daysNum, dose: dose || undefined, note: note || undefined })
      onDone()
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <Field label="Type">
        <select className={inputCls} value={type} onChange={(e) => setType(e.target.value as TreatmentInput['type'])}>
          {TYPES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
        </select>
      </Field>
      <Field label="Product">
        <select className={inputCls} value={productKey} onChange={(e) => pick(e.target.value)}>
          {WITHDRAWAL_PRODUCTS.map((p) => <option key={p.name} value={p.name}>{p.name}</option>)}
          <option value={OTHER}>Other (type the name)</option>
        </select>
      </Field>
      {productKey === OTHER && (
        <Field label="Product name">
          <input className={inputCls} value={custom} onChange={(e) => setCustom(e.target.value)} />
        </Field>
      )}
      <div className="grid grid-cols-2 gap-3">
        <Field label="Date given">
          <input type="date" className={inputCls} value={date} onChange={(e) => setDate(e.target.value)} />
        </Field>
        <Field label="Withdrawal days" hint={known ? `(${known.labelType})` : '(from the label)'}>
          <input type="number" min={0} inputMode="numeric" className={inputCls} value={days} onChange={(e) => setDays(e.target.value)} />
        </Field>
      </div>
      {known?.note && <p className="text-xs text-slate-500">{known.note}</p>}
      {daysNum !== null && Number.isInteger(daysNum) && daysNum >= 0 && (
        <p className="text-sm">
          Earliest sale after this dose: <span className="font-semibold">{withdrawalEnd(date, daysNum)}</span>
        </p>
      )}
      <Field label="Dose" hint="(optional)">
        <input className={inputCls} placeholder="e.g. 1 mL per 33 kg" value={dose} onChange={(e) => setDose(e.target.value)} />
      </Field>
      <Field label="Note" hint="(optional)">
        <input className={inputCls} value={note} onChange={(e) => setNote(e.target.value)} />
      </Field>
      <ErrorText error={error} />
      <div className="flex gap-2">
        <button className={btnSecondary} onClick={onDone}>Cancel</button>
        <button className={`flex-1 ${btnPrimary}`} onClick={save}>Save</button>
      </div>
    </div>
  )
}
