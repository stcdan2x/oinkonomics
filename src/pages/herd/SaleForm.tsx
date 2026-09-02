import { useLiveQuery } from 'dexie-react-hooks'
import { useState } from 'react'
import { eventsFor } from '../../db/eventRepo'
import { recordSale } from '../../db/saleRepo'
import { todayISO } from '../../engine/dates'
import { saleBlockedBy } from '../../engine/withdrawal'
import type { BuyerType, SaleLine, SubjectType } from '../../types'
import { btnPrimary, btnSecondary, ErrorText, Field, inputCls, peso } from '../../components/ui'
import { BUYER_LABEL } from './labels'

interface Props {
  subjectType: SubjectType
  subjectId: string
  maxHead: number
  onDone: () => void
}

export default function SaleForm({ subjectType, subjectId, maxHead, onDone }: Props) {
  const [date, setDate] = useState(todayISO())
  const [head, setHead] = useState(String(maxHead))
  const [mode, setMode] = useState<'perHead' | 'perKg'>(subjectType === 'batch' ? 'perHead' : 'perKg')
  const [price, setPrice] = useState('')
  const [weight, setWeight] = useState('')
  const [buyerType, setBuyerType] = useState<BuyerType>('viajero')
  const [buyerName, setBuyerName] = useState('')
  const [ack, setAck] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const events = useLiveQuery(() => eventsFor(subjectType, subjectId), [subjectType, subjectId]) ?? []
  const block = saleBlockedBy(events, date)

  const headN = Number(head)
  const priceN = Number(price)
  const weightN = Number(weight)
  const total = mode === 'perHead' ? headN * priceN : weightN * priceN

  async function save() {
    try {
      const line: SaleLine = mode === 'perHead' ? { headCount: headN, pricePerHead: priceN } : { headCount: headN, liveWeightKg: weightN, pricePerKg: priceN }
      if (subjectType === 'batch') line.batchId = subjectId
      else line.animalIds = [subjectId]
      if (!(priceN > 0)) throw new Error('Enter the price')
      if (mode === 'perKg' && !(weightN > 0)) throw new Error('Enter the total live weight')
      await recordSale({ date, buyerType, buyerName: buyerName || undefined, lines: [line], acknowledgeWithdrawal: ack })
      onDone()
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Sale date">
          <input type="date" className={inputCls} value={date} onChange={(e) => setDate(e.target.value)} />
        </Field>
        <Field label="Head" hint={subjectType === 'batch' ? `(of ${maxHead})` : undefined}>
          <input type="number" min={1} max={maxHead} inputMode="numeric" className={inputCls} value={head} disabled={subjectType === 'animal'} onChange={(e) => setHead(e.target.value)} />
        </Field>
      </div>
      <div className="flex overflow-hidden rounded-xl border border-slate-300 text-sm font-semibold">
        {(['perHead', 'perKg'] as const).map((m) => (
          <button key={m} className={`flex-1 py-2 ${mode === m ? 'bg-brand-600 text-white' : 'bg-white text-slate-500'}`} onClick={() => setMode(m)}>
            {m === 'perHead' ? 'Price per head' : 'Price per kg liveweight'}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {mode === 'perKg' && (
          <Field label="Total live weight (kg)">
            <input type="number" min={0} step="0.1" inputMode="decimal" className={inputCls} value={weight} onChange={(e) => setWeight(e.target.value)} />
          </Field>
        )}
        <Field label={mode === 'perHead' ? 'Price per head' : 'Price per kg'}>
          <input type="number" min={0} inputMode="decimal" className={inputCls} value={price} onChange={(e) => setPrice(e.target.value)} />
        </Field>
      </div>
      <p className="text-sm">
        Total: <span className="font-semibold">{Number.isFinite(total) ? peso(total) : peso(0)}</span>
      </p>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Buyer type">
          <select className={inputCls} value={buyerType} onChange={(e) => setBuyerType(e.target.value as BuyerType)}>
            {(Object.keys(BUYER_LABEL) as BuyerType[]).map((b) => <option key={b} value={b}>{BUYER_LABEL[b]}</option>)}
          </select>
        </Field>
        <Field label="Buyer name" hint="(optional)">
          <input className={inputCls} value={buyerName} onChange={(e) => setBuyerName(e.target.value)} />
        </Field>
      </div>
      {block && (
        <label className="flex items-start gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-700">
          <input type="checkbox" className="mt-1" checked={ack} onChange={(e) => setAck(e.target.checked)} />
          <span>
            In withdrawal for <b>{block.product}</b> until <b>{block.until}</b>. Selling before that date is a food-safety violation. Tick only if you accept responsibility.
          </span>
        </label>
      )}
      <ErrorText error={error} />
      <div className="flex gap-2">
        <button className={btnSecondary} onClick={onDone}>Cancel</button>
        <button className={`flex-1 ${btnPrimary}`} onClick={save}>Record sale</button>
      </div>
    </div>
  )
}
