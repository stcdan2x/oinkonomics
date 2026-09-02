import { useLiveQuery } from 'dexie-react-hooks'
import { useEffect, useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import PageHeader from '../../components/PageHeader'
import { Badge, btnPrimary, btnSecondary, Card, Empty, ErrorText, Field, inputCls, LinkButton } from '../../components/ui'
import GuideLink from '../../components/GuideLink'
import { listBatches } from '../../db/batchRepo'
import { db } from '../../db/db'
import { listItems, recordStockMove, removeStockMove } from '../../db/inventoryRepo'
import { todayISO } from '../../engine/dates'
import type { InventoryItem, StockMove } from '../../types'
import { qtyLabel } from './labels'

const REMEMBER_KEY = 'oinkonomics.feedEntry'
type Remembered = { batchId: string; itemId: string; qty: string; inKg: boolean }

function remembered(): Partial<Remembered> {
  try {
    return JSON.parse(localStorage.getItem(REMEMBER_KEY) ?? '{}') as Partial<Remembered>
  } catch {
    return {}
  }
}

const BAG_PRESETS = ['0.5', '1', '2', '3']
const KG_PRESETS = ['5', '10', '25', '50']

// One-thumb daily feed entry: pick the batch, pick the feed, tap a quantity.
// The last batch, feed, quantity and unit are remembered on this device.
export default function FeedEntryPage() {
  const [params] = useSearchParams()
  const today = todayISO()
  const batches = useLiveQuery(() => listBatches(), []) ?? []
  const items = useLiveQuery(() => listItems(), [])
  const todayMoves = useLiveQuery(() => db.stockMoves.where('date').equals(today).toArray(), [today]) ?? []
  const last = remembered()
  const [batchId, setBatchId] = useState(params.get('batchId') ?? last.batchId ?? '')
  const [itemId, setItemId] = useState(last.itemId ?? '')
  const [qty, setQty] = useState(last.qty ?? '1')
  const [inKg, setInKg] = useState(last.inKg ?? false)
  const [date, setDate] = useState(today)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState<string | null>(null)

  const feeds = (items ?? []).filter((i) => i.category === 'feed')
  useEffect(() => {
    if (feeds.length && !feeds.some((f) => f.id === itemId)) setItemId(feeds[0].id)
  }, [feeds, itemId])

  const item = feeds.find((f) => f.id === itemId)
  const canKg = !!item?.kgPerUnit
  const useKg = inKg && canKg
  const unitsFromInput = (n: number) => (useKg && item?.kgPerUnit ? n / item.kgPerUnit : n)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setSaved(null)
    try {
      if (!item) throw new Error('Add a feed item first')
      const n = Number(qty)
      if (!(n > 0)) throw new Error('Enter a quantity above 0')
      const units = unitsFromInput(n)
      await recordStockMove({ itemId: item.id, date, qtyDelta: -units, reason: 'consumption', batchId: batchId || undefined })
      localStorage.setItem(REMEMBER_KEY, JSON.stringify({ batchId, itemId, qty, inKg } satisfies Remembered))
      setSaved(`Recorded ${qtyLabel(units, item.unit, item.kgPerUnit)} of ${item.name}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    }
  }

  if (!items) return null
  const todayFeed = todayMoves
    .filter((m) => !m.deletedAt && m.reason === 'consumption' && feeds.some((f) => f.id === m.itemId))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  return (
    <>
      <PageHeader title="Daily feed" subtitle="Record what was fed today; stock and batch costs follow" />
      {feeds.length === 0 ? (
        <Card>
          <Empty>No feed items yet.</Empty>
          <div className="text-center"><LinkButton to="/inventory/items/new">Add a feed</LinkButton></div>
        </Card>
      ) : (
        <form onSubmit={submit}>
          <Card action={<GuideLink id="feed-phases" />}>
            <Field label="Fed to">
              <select className={inputCls} value={batchId} onChange={(e) => setBatchId(e.target.value)}>
                <option value="">Breeding herd / general</option>
                {batches.map((b) => <option key={b.id} value={b.id}>{b.name} ({b.headCount} head)</option>)}
              </select>
            </Field>
            <Field label="Feed" hint={item ? `${qtyLabel(item.qtyOnHand, item.unit, item.kgPerUnit)} on hand` : undefined}>
              <select className={inputCls} value={itemId} onChange={(e) => setItemId(e.target.value)}>
                {feeds.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
            </Field>
            <Field label="Quantity">
              <div className="flex gap-2">
                <input type="number" inputMode="decimal" min="0.01" step="0.01" className={`${inputCls} text-2xl font-bold`} value={qty} onChange={(e) => setQty(e.target.value)} required />
                {canKg ? (
                  <div className="flex shrink-0 overflow-hidden rounded-xl ring-1 ring-slate-300">
                    <button type="button" className={`px-3 text-sm font-semibold ${!useKg ? 'bg-brand-600 text-white' : 'bg-white text-slate-600'}`} onClick={() => setInKg(false)}>{item?.unit}</button>
                    <button type="button" className={`px-3 text-sm font-semibold ${useKg ? 'bg-brand-600 text-white' : 'bg-white text-slate-600'}`} onClick={() => setInKg(true)}>kg</button>
                  </div>
                ) : (
                  <span className="self-center text-sm text-slate-500">{item?.unit}</span>
                )}
              </div>
            </Field>
            <div className="mt-2 flex flex-wrap gap-2">
              {(useKg ? KG_PRESETS : BAG_PRESETS).map((p) => (
                <button key={p} type="button" className={`min-w-14 ${qty === p ? btnPrimary : btnSecondary}`} onClick={() => setQty(p)}>{p}</button>
              ))}
            </div>
            <div className="mt-3">
              <Field label="Date">
                <input type="date" className={inputCls} value={date} onChange={(e) => setDate(e.target.value)} required />
              </Field>
            </div>
            <ErrorText error={error} />
            {saved && <p className="text-sm font-medium text-green-700">{saved}</p>}
            <div className="mt-3">
              <button type="submit" className={`w-full py-3 text-lg ${btnPrimary}`}>Record feed</button>
            </div>
          </Card>
        </form>
      )}
      <Card title={`Fed today (${todayFeed.length})`}>
        {todayFeed.length === 0 && <Empty>Nothing recorded today yet.</Empty>}
        {todayFeed.map((m) => (
          <TodayRow key={m.id} move={m} item={feeds.find((f) => f.id === m.itemId)!} batch={batches.find((b) => b.id === m.batchId)?.name ?? null} />
        ))}
      </Card>
    </>
  )
}

function TodayRow({ move, item, batch }: { move: StockMove; item: InventoryItem; batch: string | null }) {
  const [confirming, setConfirming] = useState(false)
  return (
    <div className="flex items-center justify-between gap-3 border-b border-slate-100 py-2 last:border-0">
      <div className="min-w-0">
        <span className="font-semibold">{qtyLabel(-move.qtyDelta, item.unit, item.kgPerUnit)}</span> <span className="text-slate-500">{item.name}</span>{' '}
        <Badge>{batch ?? 'herd'}</Badge>
      </div>
      {confirming ? (
        <button type="button" className="text-xs font-semibold text-red-600" onClick={() => removeStockMove(move.id)}>Confirm delete</button>
      ) : (
        <button type="button" className="text-xs text-slate-400" onClick={() => setConfirming(true)}>Delete</button>
      )}
    </div>
  )
}
