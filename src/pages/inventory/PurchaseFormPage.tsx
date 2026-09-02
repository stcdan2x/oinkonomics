import { useLiveQuery } from 'dexie-react-hooks'
import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import PageHeader from '../../components/PageHeader'
import { btnPrimary, btnSecondary, Card, Empty, ErrorText, Field, inputCls, LinkButton, peso } from '../../components/ui'
import GuideLink from '../../components/GuideLink'
import { listItems, purchaseStock } from '../../db/inventoryRepo'
import { todayISO } from '../../engine/dates'
import { ITEM_CATEGORY_LABEL } from './labels'

// A purchase writes the ledger expense and the stock move together (P5 rule).
export default function PurchaseFormPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const items = useLiveQuery(() => listItems(), [])
  const [itemId, setItemId] = useState(params.get('itemId') ?? '')
  const [date, setDate] = useState(todayISO())
  const [qty, setQty] = useState('')
  const [totalCost, setTotalCost] = useState('')
  const [note, setNote] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!itemId && items?.length) setItemId(items[0].id)
  }, [items, itemId])

  const item = items?.find((i) => i.id === itemId)
  const unit = Number(qty) > 0 && Number(totalCost) > 0 ? Number(totalCost) / Number(qty) : null

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setSaving(true)
    try {
      await purchaseStock({ itemId, date, qty: Number(qty), totalCost: Number(totalCost), note })
      navigate(-1)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setSaving(false)
    }
  }

  if (!items) return null
  return (
    <>
      <PageHeader title="Buy stock" subtitle="Adds to stock and records the expense in the ledger" />
      {items.length === 0 ? (
        <Card>
          <Empty>Add an item first.</Empty>
          <div className="text-center"><LinkButton to="/inventory/items/new">Add item</LinkButton></div>
        </Card>
      ) : (
        <form onSubmit={submit}>
          <Card action={<GuideLink id="stock-rules" />}>
            <Field label="Item">
              <select className={inputCls} value={itemId} onChange={(e) => setItemId(e.target.value)}>
                {items.map((i) => <option key={i.id} value={i.id}>{i.name} ({ITEM_CATEGORY_LABEL[i.category]}, {i.unit})</option>)}
              </select>
            </Field>
            <Field label="Date">
              <input type="date" className={inputCls} value={date} onChange={(e) => setDate(e.target.value)} required />
            </Field>
            <Field label={`Quantity${item ? ` (${item.unit})` : ''}`}>
              <input type="number" inputMode="decimal" min="0.01" step="0.01" className={inputCls} value={qty} onChange={(e) => setQty(e.target.value)} required />
            </Field>
            <Field label="Total paid (₱)" hint={unit !== null && item ? `${peso(unit)} per ${item.unit}` : undefined}>
              <input type="number" inputMode="decimal" min="0.01" step="0.01" className={inputCls} value={totalCost} onChange={(e) => setTotalCost(e.target.value)} required />
            </Field>
            <Field label="Note (optional)">
              <input className={inputCls} value={note} onChange={(e) => setNote(e.target.value)} placeholder="supplier, receipt number" />
            </Field>
            <ErrorText error={error} />
            <div className="mt-3 flex gap-2">
              <button type="submit" className={btnPrimary} disabled={saving}>Save</button>
              <button type="button" className={btnSecondary} onClick={() => navigate(-1)}>Cancel</button>
            </div>
          </Card>
        </form>
      )}
    </>
  )
}
