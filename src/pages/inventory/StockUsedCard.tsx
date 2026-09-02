import { useLiveQuery } from 'dexie-react-hooks'
import { Card, Empty, peso, Row } from '../../components/ui'
import { db } from '../../db/db'
import { movesForBatch } from '../../db/inventoryRepo'
import { qtyLabel } from './labels'

// Stock consumed against one batch, by item, at the cost snapshotted on each move.
export default function StockUsedCard({ batchId }: { batchId: string }) {
  const moves = useLiveQuery(() => movesForBatch(batchId), [batchId]) ?? []
  const items = useLiveQuery(() => db.inventoryItems.toArray(), []) ?? []
  const used = moves.filter((m) => m.reason === 'consumption')
  const byItem = new Map<string, { qty: number; cost: number }>()
  for (const m of used) {
    const acc = byItem.get(m.itemId) ?? { qty: 0, cost: 0 }
    acc.qty += -m.qtyDelta
    acc.cost += -m.qtyDelta * (m.unitCost ?? 0)
    byItem.set(m.itemId, acc)
  }
  const total = [...byItem.values()].reduce((s, v) => s + v.cost, 0)
  return (
    <Card title="Stock used">
      {used.length === 0 && <Empty>No feed or medicine recorded against this batch yet.</Empty>}
      {[...byItem.entries()].map(([itemId, v]) => {
        const item = items.find((i) => i.id === itemId)
        return (
          <Row key={itemId} label={item?.name ?? 'item'}>
            {item ? qtyLabel(v.qty, item.unit, item.kgPerUnit) : v.qty} · {peso(v.cost)}
          </Row>
        )
      })}
      {used.length > 0 && <Row label="Total at cost">{peso(total)}</Row>}
    </Card>
  )
}
