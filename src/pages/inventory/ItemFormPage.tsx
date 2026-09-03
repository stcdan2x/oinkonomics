import { useLiveQuery } from 'dexie-react-hooks'
import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageHeader from '../../components/PageHeader'
import { btnPrimary, btnSecondary, Card, ErrorText, Field, inputCls } from '../../components/ui'
import GuideLink from '../../components/GuideLink'
import { db } from '../../db/db'
import { createItem, updateItem } from '../../db/inventoryRepo'
import type { ItemCategory } from '../../types'
import { ITEM_CATEGORIES, ITEM_CATEGORY_LABEL } from './labels'

// One form for a new item and for editing an existing one (`/inventory/items/:id/edit`).
export default function ItemFormPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const existing = useLiveQuery(() => (id ? db.inventoryItems.get(id) : undefined), [id])
  const [name, setName] = useState('')
  const [category, setCategory] = useState<ItemCategory>('feed')
  const [unit, setUnit] = useState('bag')
  const [kgPerUnit, setKgPerUnit] = useState('50')
  const [reorderLevel, setReorderLevel] = useState('0')
  const [unitCost, setUnitCost] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!existing) return
    setName(existing.name)
    setCategory(existing.category)
    setUnit(existing.unit)
    setKgPerUnit(existing.kgPerUnit ? String(existing.kgPerUnit) : '')
    setReorderLevel(String(existing.reorderLevel))
    setUnitCost(String(existing.unitCost))
    setExpiryDate(existing.expiryDate ?? '')
  }, [existing])

  // TASK 003 §7 D8: kg per unit is a feed thing (a 50 kg sack); any other
  // category starts blank so a medicine does not carry 50 kg into costing labels.
  const pickCategory = (c: ItemCategory) => {
    setCategory(c)
    setKgPerUnit(c === 'feed' ? '50' : '')
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setSaving(true)
    try {
      const data = {
        name,
        category,
        unit,
        kgPerUnit: kgPerUnit.trim() ? Number(kgPerUnit) : undefined,
        reorderLevel: Number(reorderLevel),
        unitCost: unitCost.trim() ? Number(unitCost) : 0,
        expiryDate: expiryDate || undefined,
      }
      if (id) await updateItem(id, data)
      else await createItem(data)
      navigate(-1)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setSaving(false)
    }
  }

  if (id && existing === undefined) return null
  return (
    <>
      <PageHeader title={id ? 'Edit item' : 'New inventory item'} subtitle="Stock is added through purchases and adjustments, not here" />
      <form onSubmit={submit}>
        <Card action={<GuideLink id="stock-rules" />}>
          <Field label="Name">
            <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Hog grower pellets" required />
          </Field>
          <Field label="Category">
            <select className={inputCls} value={category} onChange={(e) => pickCategory(e.target.value as ItemCategory)}>
              {ITEM_CATEGORIES.map((c) => <option key={c} value={c}>{ITEM_CATEGORY_LABEL[c]}</option>)}
            </select>
          </Field>
          <Field label="Unit" hint="bag, kg, vial, bottle, piece">
            <input className={inputCls} value={unit} onChange={(e) => setUnit(e.target.value)} required />
          </Field>
          <Field label="Kg per unit (optional)" hint="lets feed be entered in kg">
            <input type="number" inputMode="decimal" min="0.01" step="0.01" className={inputCls} value={kgPerUnit} onChange={(e) => setKgPerUnit(e.target.value)} />
          </Field>
          <Field label="Reorder level" hint="alert when on hand is at or below this">
            <input type="number" inputMode="decimal" min="0" step="0.01" className={inputCls} value={reorderLevel} onChange={(e) => setReorderLevel(e.target.value)} required />
          </Field>
          <Field label="Unit cost (₱, optional)" hint="purchases update this automatically">
            <input type="number" inputMode="decimal" min="0" step="0.01" className={inputCls} value={unitCost} onChange={(e) => setUnitCost(e.target.value)} />
          </Field>
          <Field label="Expiry date (optional)">
            <input type="date" className={inputCls} value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
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
