import { useLiveQuery } from 'dexie-react-hooks'
import { Link } from 'react-router-dom'
import PageHeader from '../../components/PageHeader'
import { Badge, Card, Empty, LinkButton, ListItem, peso } from '../../components/ui'
import { db } from '../../db/db'
import { listItems } from '../../db/inventoryRepo'
import { todayISO } from '../../engine/dates'
import { dailyUsage, daysRemaining, stockAlerts, type StockAlert } from '../../engine/inventory'
import type { InventoryItem, ItemCategory } from '../../types'
import { ITEM_CATEGORIES, ITEM_CATEGORY_LABEL, qtyLabel } from './labels'

export default function InventoryPage() {
  const items = useLiveQuery(() => listItems(), [])
  const moves = useLiveQuery(() => db.stockMoves.toArray(), []) ?? []
  const today = todayISO()
  if (!items) return null
  const byCategory = new Map<ItemCategory, InventoryItem[]>()
  for (const i of items) byCategory.set(i.category, [...(byCategory.get(i.category) ?? []), i])
  const stockValue = items.reduce((s, i) => s + i.qtyOnHand * i.unitCost, 0)
  const alerts = stockAlerts(items, today)
  const usage = new Map(items.map((i) => [i.id, dailyUsage(moves.filter((m) => m.itemId === i.id), today)]))
  const daysLeft = (i: InventoryItem) => daysRemaining(i.qtyOnHand, usage.get(i.id) ?? 0)
  return (
    <>
      <PageHeader title="Inventory" subtitle="Feed, medicine and supplies on hand" />
      <div className="mx-4 mb-4 flex flex-wrap gap-2">
        <LinkButton to="/inventory/feed">Daily feed</LinkButton>
        <LinkButton to="/inventory/purchase" secondary>Buy stock</LinkButton>
        <LinkButton to="/inventory/items/new" secondary>Add item</LinkButton>
      </div>
      {alerts.length > 0 && (
        <Card title={`Alerts (${alerts.length})`}>
          {alerts.map((a) => (
            <AlertRow key={`${a.itemId}-${a.type}`} alert={a} item={items.find((i) => i.id === a.itemId)!} daysLeft={daysLeft(items.find((i) => i.id === a.itemId)!)} />
          ))}
        </Card>
      )}
      {items.length === 0 && (
        <Card>
          <Empty>No items yet. Add your feeds, medicines and vaccines, then record purchases against them.</Empty>
        </Card>
      )}
      {ITEM_CATEGORIES.filter((c) => byCategory.has(c)).map((c) => (
        <Card key={c} title={ITEM_CATEGORY_LABEL[c]}>
          {byCategory.get(c)!.map((i) => {
            const left = daysLeft(i)
            return (
              <ListItem
                key={i.id}
                to={`/inventory/items/${i.id}`}
                title={
                  <>
                    {i.name} {i.qtyOnHand <= i.reorderLevel && <Badge tone="red">{i.qtyOnHand === 0 ? 'out' : 'low'}</Badge>}
                  </>
                }
                subtitle={`${peso(i.unitCost)} per ${i.unit}${i.expiryDate ? ` · expires ${i.expiryDate}` : ''}${left !== null ? ` · about ${left} day${left === 1 ? '' : 's'} left` : ''}`}
                right={<span className="text-sm font-semibold text-slate-700">{qtyLabel(i.qtyOnHand, i.unit, i.kgPerUnit)}</span>}
              />
            )
          })}
        </Card>
      ))}
      {items.length > 0 && <p className="mx-4 mb-4 text-center text-xs text-slate-400">Stock on hand at cost: {peso(stockValue)}. Days left use the average of the last 14 days.</p>}
    </>
  )
}

function AlertRow({ alert, item, daysLeft }: { alert: StockAlert; item: InventoryItem; daysLeft: number | null }) {
  const text =
    alert.type === 'lowStock'
      ? item.qtyOnHand === 0
        ? 'Out of stock'
        : `Low: ${qtyLabel(item.qtyOnHand, item.unit)} left, reorder at ${item.reorderLevel}${daysLeft !== null ? `, about ${daysLeft} days` : ''}`
      : alert.type === 'expired'
        ? `Expired ${item.expiryDate}: ${qtyLabel(item.qtyOnHand, item.unit)} still on hand`
        : `Expires in ${alert.daysToExpiry} day${alert.daysToExpiry === 1 ? '' : 's'} (${item.expiryDate})`
  return (
    <Link to={`/inventory/items/${item.id}`} className="flex items-center justify-between gap-3 border-b border-slate-100 py-2 last:border-0">
      <div className="min-w-0">
        <div className="font-semibold">{item.name}</div>
        <div className="text-xs text-slate-500">{text}</div>
      </div>
      <Badge tone={alert.type === 'expiring' ? 'amber' : 'red'}>{alert.type === 'lowStock' ? 'stock' : alert.type === 'expired' ? 'expired' : 'expiry'}</Badge>
    </Link>
  )
}
