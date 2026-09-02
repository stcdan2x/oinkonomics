import { useLiveQuery } from 'dexie-react-hooks'
import { useState, type FormEvent } from 'react'
import { Badge, btnPrimary, Card, Empty, ErrorText, Field, inputCls } from '../../components/ui'
import GuideLink from '../../components/GuideLink'
import { listPrices, PRICE_ITEM_LABEL, PRICE_ITEMS, recordPrice, removePrice } from '../../db/priceLogRepo'
import { todayISO } from '../../engine/dates'
import type { PriceItem, PriceObservation } from '../../types'

const SOURCES: PriceObservation['source'][] = ['own', 'heard', 'published']
const SOURCE_LABEL: Record<PriceObservation['source'], string> = { own: 'My own sale or purchase', heard: 'Heard from a trader or neighbour', published: 'Published (PSA, DA, news)' }

// Price log: the latest observation per item feeds the recommendation.
export default function PricesTab() {
  const prices = useLiveQuery(() => listPrices(), []) ?? []
  const [date, setDate] = useState(todayISO())
  const [item, setItem] = useState<PriceItem>('liveweightPerKg')
  const [value, setValue] = useState('')
  const [source, setSource] = useState<PriceObservation['source']>('heard')
  const [market, setMarket] = useState('')
  const [note, setNote] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pendingDelete, setPendingDelete] = useState<string | null>(null)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await recordPrice({ date, item, value: Number(value), source, market: market || undefined, note: note || undefined })
      setValue('')
      setNote('')
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    }
  }

  return (
    <>
      <form onSubmit={submit}>
        <Card title="Log a price" action={<GuideLink id="price-disclaimer" />}>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Date"><input type="date" className={inputCls} value={date} onChange={(e) => setDate(e.target.value)} required /></Field>
            <Field label="Item">
              <select className={inputCls} value={item} onChange={(e) => setItem(e.target.value as PriceItem)}>
                {PRICE_ITEMS.map((i) => <option key={i} value={i}>{PRICE_ITEM_LABEL[i]}</option>)}
              </select>
            </Field>
            <Field label="Price (₱)"><input type="number" inputMode="decimal" min="0.01" step="0.01" className={inputCls} value={value} onChange={(e) => setValue(e.target.value)} required /></Field>
            <Field label="Source">
              <select className={inputCls} value={source} onChange={(e) => setSource(e.target.value as PriceObservation['source'])}>
                {SOURCES.map((s) => <option key={s} value={s}>{SOURCE_LABEL[s]}</option>)}
              </select>
            </Field>
            <Field label="Market or buyer (optional)"><input className={inputCls} value={market} onChange={(e) => setMarket(e.target.value)} placeholder="e.g. Kabankalan viajero" /></Field>
            <Field label="Note (optional)"><input className={inputCls} value={note} onChange={(e) => setNote(e.target.value)} /></Field>
          </div>
          <ErrorText error={error} />
          <div className="mt-3"><button type="submit" className={btnPrimary}>Save price</button></div>
        </Card>
      </form>
      <Card title={`Price log (${prices.length})`}>
        {prices.length === 0 && <Empty>No prices logged yet. The recommendation uses the knowledge defaults until you log your local prices.</Empty>}
        {prices.map((o) => (
          <div key={o.id} className="flex items-center justify-between gap-3 border-b border-slate-100 py-2 last:border-0">
            <div className="min-w-0">
              <div className="font-semibold">{PRICE_ITEM_LABEL[o.item]}</div>
              <div className="truncate text-xs text-slate-500">{o.date} <Badge>{o.source}</Badge> {o.market ?? ''} {o.note ?? ''}</div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className="font-bold">₱{o.value.toLocaleString('en-PH')}</span>
              <button className="text-xs text-red-600" onClick={async () => { if (pendingDelete === o.id) { await removePrice(o.id); setPendingDelete(null) } else setPendingDelete(o.id) }}>
                {pendingDelete === o.id ? 'confirm' : 'delete'}
              </button>
            </div>
          </div>
        ))}
      </Card>
    </>
  )
}
