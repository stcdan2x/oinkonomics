import { useLiveQuery } from 'dexie-react-hooks'
import { useState, type FormEvent } from 'react'
import { useParams } from 'react-router-dom'
import PageHeader from '../../components/PageHeader'
import { Badge, btnDanger, btnPrimary, btnSecondary, Card, Empty, ErrorText, Field, inputCls, LinkButton, peso, Row } from '../../components/ui'
import { db } from '../../db/db'
import { movesForItem, recordStockMove, removeStockMove } from '../../db/inventoryRepo'
import { todayISO } from '../../engine/dates'
import type { InventoryItem, StockMove } from '../../types'
import { ITEM_CATEGORY_LABEL, qtyLabel, REASON_LABEL } from './labels'

export default function ItemPage() {
  const { id = '' } = useParams()
  const item = useLiveQuery(() => db.inventoryItems.get(id), [id])
  const moves = useLiveQuery(() => movesForItem(id), [id]) ?? []
  const batches = useLiveQuery(() => db.batches.toArray(), []) ?? []
  const animals = useLiveQuery(() => db.animals.toArray(), []) ?? []
  const [adjusting, setAdjusting] = useState(false)
  if (item === undefined) return null
  if (!item || item.deletedAt) return <PageHeader title="Item not found" />
  // The batch the move went to, or the animal a health event drew it for (TASK 004 G6).
  const batchName = (m: StockMove) =>
    m.batchId ? batches.find((b) => b.id === m.batchId)?.name ?? 'batch' : m.animalId ? animals.find((a) => a.id === m.animalId)?.tag ?? 'animal' : null
  return (
    <>
      <PageHeader title={item.name} subtitle={ITEM_CATEGORY_LABEL[item.category]} />
      <Card>
        <Row label="On hand">
          {qtyLabel(item.qtyOnHand, item.unit, item.kgPerUnit)} {item.qtyOnHand <= item.reorderLevel && <Badge tone="red">{item.qtyOnHand === 0 ? 'out of stock' : 'low'}</Badge>}
        </Row>
        <Row label="Reorder level">{qtyLabel(item.reorderLevel, item.unit)}</Row>
        <Row label="Unit cost">{peso(item.unitCost)} per {item.unit}</Row>
        <Row label="Value on hand">{peso(item.qtyOnHand * item.unitCost)}</Row>
        {item.expiryDate && <Row label="Expiry">{item.expiryDate}</Row>}
      </Card>
      <div className="mx-4 mb-4 flex flex-wrap gap-2">
        <LinkButton to={`/inventory/purchase?itemId=${item.id}`}>Buy</LinkButton>
        <button className={`text-sm ${btnSecondary}`} onClick={() => setAdjusting(true)}>Adjust or record loss</button>
        <LinkButton to={`/inventory/items/${item.id}/edit`} secondary>Edit item</LinkButton>
      </div>
      {adjusting && (
        <Card title="Adjust stock">
          <AdjustForm item={item} onDone={() => setAdjusting(false)} />
        </Card>
      )}
      <Card title={`Stock moves (${moves.length})`}>
        {moves.length === 0 && <Empty>No moves yet. Purchases, use and adjustments appear here.</Empty>}
        {moves.map((m) => (
          <MoveRow key={m.id} move={m} item={item} batch={batchName(m)} />
        ))}
      </Card>
    </>
  )
}

// A count correction (either direction) or a loss (spoiled, spilled, expired).
function AdjustForm({ item, onDone }: { item: InventoryItem; onDone: () => void }) {
  const [mode, setMode] = useState<'count' | 'loss'>('count')
  const [date, setDate] = useState(todayISO())
  const [qty, setQty] = useState('')
  const [error, setError] = useState<string | null>(null)
  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      const n = Number(qty)
      if (mode === 'count') await recordStockMove({ itemId: item.id, date, qtyDelta: n - item.qtyOnHand, reason: 'adjustment' })
      else await recordStockMove({ itemId: item.id, date, qtyDelta: -Math.abs(n), reason: 'loss' })
      onDone()
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    }
  }
  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <Field label="What happened">
        <select className={inputCls} value={mode} onChange={(e) => setMode(e.target.value as 'count' | 'loss')}>
          <option value="count">Physical count differs (set the new count)</option>
          <option value="loss">Loss: spoiled, spilled or expired</option>
        </select>
      </Field>
      <Field label="Date">
        <input type="date" className={inputCls} value={date} onChange={(e) => setDate(e.target.value)} required />
      </Field>
      <Field label={mode === 'count' ? `Counted (${item.unit})` : `Lost (${item.unit})`} hint={mode === 'count' ? `now ${item.qtyOnHand}` : undefined}>
        <input type="number" inputMode="decimal" min="0" step="0.01" className={inputCls} value={qty} onChange={(e) => setQty(e.target.value)} required />
      </Field>
      <ErrorText error={error} />
      <div className="flex gap-2">
        <button type="submit" className={mode === 'loss' ? btnDanger : btnPrimary}>Save</button>
        <button type="button" className={btnSecondary} onClick={onDone}>Cancel</button>
      </div>
    </form>
  )
}

function MoveRow({ move, item, batch }: { move: StockMove; item: InventoryItem; batch: string | null }) {
  const [confirming, setConfirming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const remove = async () => {
    try {
      await removeStockMove(move.id)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    }
  }
  const out = move.qtyDelta < 0
  return (
    <div className="flex items-center justify-between gap-3 border-b border-slate-100 py-3 last:border-0">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold">{REASON_LABEL[move.reason]}</span>
          {batch && <Badge>{batch}</Badge>}
          {move.transactionId && <Badge tone="amber">in ledger</Badge>}
        </div>
        <div className="text-xs text-slate-500">
          {move.date}
          {move.unitCost !== undefined && out ? ` · ${peso(Math.abs(move.qtyDelta) * move.unitCost)} at cost` : ''}
        </div>
        <ErrorText error={error} />
      </div>
      <div className="shrink-0 text-right">
        <div className={`font-semibold ${out ? 'text-red-600' : 'text-green-700'}`}>{out ? '' : '+'}{qtyLabel(move.qtyDelta, item.unit)}</div>
        {confirming ? (
          <button type="button" className="text-xs font-semibold text-red-600" onClick={remove}>Confirm delete</button>
        ) : (
          <button type="button" className="text-xs text-slate-400" onClick={() => setConfirming(true)}>Delete</button>
        )}
      </div>
    </div>
  )
}
