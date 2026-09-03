import { useLiveQuery } from 'dexie-react-hooks'
import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import PageHeader from '../../components/PageHeader'
import { btnPrimary, btnSecondary, Card, ErrorText, Field, inputCls } from '../../components/ui'
import GuideLink from '../../components/GuideLink'
import { listBreeders } from '../../db/animalRepo'
import { listBatches } from '../../db/batchRepo'
import { db } from '../../db/db'
import { addTransaction, updateTransaction } from '../../db/transactionRepo'
import { todayISO } from '../../engine/dates'
import { categoriesFor, KIND_LABEL } from '../../knowledge/categories'
import type { TransactionKind } from '../../types'
import { ROLE_LABEL } from '../herd/labels'

const KINDS = Object.keys(KIND_LABEL) as TransactionKind[]

// "Applies to" is encoded as `batch:<id>` or `animal:<id>`; empty means shared
// (whole farm), which the costing engine allocates by head-days. With an `id`
// in the route (`/finance/:id/edit`, TASK 003) the same form edits a typed
// entry; what it applies to stays as it was.
export default function TransactionFormPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const existing = useLiveQuery(() => (id ? db.transactions.get(id) : undefined), [id])
  const [params] = useSearchParams()
  const batches = useLiveQuery(() => listBatches({ includeEmpty: true }), []) ?? []
  const breeders = useLiveQuery(() => listBreeders(), []) ?? []
  const [kind, setKind] = useState<TransactionKind>('expense')
  const [category, setCategory] = useState('feed')
  const [date, setDate] = useState(todayISO())
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [target, setTarget] = useState(params.get('batchId') ? `batch:${params.get('batchId')}` : params.get('animalId') ? `animal:${params.get('animalId')}` : '')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!existing) return
    setKind(existing.kind)
    setCategory(existing.category)
    setDate(existing.date)
    setAmount(String(existing.amount))
    setNote(existing.note ?? '')
    setTarget(existing.links.batchId ? `batch:${existing.links.batchId}` : existing.links.animalId ? `animal:${existing.links.animalId}` : '')
  }, [existing])

  const changeKind = (k: TransactionKind) => {
    setKind(k)
    setCategory(categoriesFor(k)[0].id)
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setSaving(true)
    try {
      if (id) {
        await updateTransaction(id, { date, kind, category, amount: Number(amount), note })
      } else {
        const [type, targetId] = target.split(':')
        await addTransaction({
          date,
          kind,
          category,
          amount: Number(amount),
          note,
          links: type === 'batch' ? { batchId: targetId } : type === 'animal' ? { animalId: targetId } : {},
        })
      }
      navigate(-1)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <PageHeader title={id ? 'Edit transaction' : 'Record a transaction'} subtitle="Expenses, revenue, capital purchases, drawings and loans" />
      <form onSubmit={submit}>
        <Card action={<GuideLink id="money-rules" />}>
          <Field label="Kind">
            <select className={inputCls} value={kind} onChange={(e) => changeKind(e.target.value as TransactionKind)}>
              {KINDS.map((k) => <option key={k} value={k}>{KIND_LABEL[k]}</option>)}
            </select>
          </Field>
          <Field label="Category">
            <select className={inputCls} value={category} onChange={(e) => setCategory(e.target.value)}>
              {categoriesFor(kind).map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </Field>
          <Field label="Date">
            <input type="date" className={inputCls} value={date} onChange={(e) => setDate(e.target.value)} required />
          </Field>
          <Field label="Amount (₱)">
            <input type="number" inputMode="decimal" min="0.01" step="0.01" className={inputCls} value={amount} onChange={(e) => setAmount(e.target.value)} required />
          </Field>
          <Field label="Applies to" hint="Shared costs are split across batches and the breeding herd by head-days.">
            <select className={inputCls} value={target} onChange={(e) => setTarget(e.target.value)} disabled={!!id}>
              <option value="">Shared (whole farm)</option>
              {batches.length > 0 && (
                <optgroup label="Batches">
                  {batches.map((b) => <option key={b.id} value={`batch:${b.id}`}>{b.name}{b.headCount === 0 ? ' (sold out)' : ''}</option>)}
                </optgroup>
              )}
              {breeders.length > 0 && (
                <optgroup label="Breeders">
                  {breeders.map((a) => <option key={a.id} value={`animal:${a.id}`}>{a.tag} ({ROLE_LABEL[a.role]})</option>)}
                </optgroup>
              )}
            </select>
          </Field>
          <Field label="Note (optional)">
            <input className={inputCls} value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. 5 sacks hog grower, ABC Agrivet" />
          </Field>
          <ErrorText error={error} />
          <div className="mt-3 flex gap-2">
            <button type="submit" className={btnPrimary} disabled={saving}>Save</button>
            <button type="button" className={btnSecondary} onClick={() => navigate(-1)}>Cancel</button>
          </div>
        </Card>
      </form>
    </>
  )
}
