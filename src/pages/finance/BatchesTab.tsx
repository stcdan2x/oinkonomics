import { useLiveQuery } from 'dexie-react-hooks'
import { Link } from 'react-router-dom'
import { Card, Empty, peso } from '../../components/ui'
import { computeFarmCosting } from '../../db/costingRepo'
import { todayISO } from '../../engine/dates'
import { BatchCostingDetail } from './costingView'

// Batch profitability is lifetime, not period-bound: a batch spans months.
export default function BatchesTab() {
  const today = todayISO()
  const costing = useLiveQuery(() => computeFarmCosting(today), [today])
  if (!costing) return null
  return (
    <>
      {costing.batches.length === 0 && <Card><Empty>No batches yet. Batches are created from a weaned litter or on the Herd page.</Empty></Card>}
      {costing.batches.map((row) => (
        <Card
          key={row.batch.id}
          title={row.batch.name}
          action={<Link to={`/herd/batches/${row.batch.id}`} className="text-sm font-semibold text-brand-700">Open</Link>}
        >
          <p className="mb-2 text-xs text-slate-500">
            Started {row.batch.startDate}, {row.batch.headCount} on farm, {row.headSold} sold. Profit <span className={row.costing.profit < 0 ? 'text-red-600' : 'text-green-700'}>{peso(row.costing.profit)}</span>
          </p>
          <BatchCostingDetail row={row} />
        </Card>
      ))}
      {costing.unallocated > 0 && (
        <p className="mx-4 mb-4 text-xs text-amber-700">
          {peso(costing.unallocated)} of shared expenses fell in months with no batch or breeder on farm and is not allocated anywhere.
        </p>
      )}
    </>
  )
}
