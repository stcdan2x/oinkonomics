import { Row } from '../../components/ui'
import type { BatchCostingRow } from '../../db/costingRepo'
import { breakEvenPerHead, breakEvenPerKg, costPerKgSold } from '../../engine/unitCosts'
import { categoryLabel } from '../../knowledge/categories'
import { HERD_DEFAULTS } from '../../knowledge/parameters'

const MARKET_KG = HERD_DEFAULTS.marketLiveWeightKg.value
const peso2 = (n: number) => '₱' + n.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const pesoWhole = (n: number) => '₱' + Math.round(n).toLocaleString('en-PH')

// One batch's costing, shared by the Finance Batches tab and the batch page.
export function BatchCostingDetail({ row }: { row: BatchCostingRow }) {
  const { costing: c, batch } = row
  const sold = row.headSold > 0
  const heads = sold ? row.headSold : batch.headCount
  const kg = sold ? row.kgSold : batch.headCount > 0 ? batch.headCount * MARKET_KG : null
  const bePerHead = breakEvenPerHead(c.totalCost, heads)
  const bePerKg = kg !== null ? breakEvenPerKg(c.totalCost, kg) : null
  const perKgSold = sold && row.kgSold !== null ? costPerKgSold(c.totalCost, row.kgSold) : null
  return (
    <>
      {c.direct.map((d) => <Row key={d.category} label={`Direct: ${categoryLabel(d.category)}`}>{pesoWhole(d.amount)}</Row>)}
      <Row label={`Allocated shared costs (${c.headDays} head-days)`}>{pesoWhole(c.allocated)}</Row>
      {batch.litterIds.length > 0 && (
        <Row label={`Piglets at start (${row.startHead} x ${row.pigletCostPerHead !== null ? peso2(row.pigletCostPerHead) : 'no herd cost yet'})`}>{pesoWhole(c.pigletValue)}</Row>
      )}
      <Row label="Total cost">{pesoWhole(c.totalCost)}</Row>
      <Row label="Revenue">{pesoWhole(c.revenue)}</Row>
      <Row label="Profit"><span className={c.profit < 0 ? 'text-red-600' : 'text-green-700'}>{pesoWhole(c.profit)}</span></Row>
      {perKgSold !== null && <Row label={`Cost per kg sold (${row.kgSold} kg)`}>{peso2(perKgSold)}</Row>}
      {bePerHead !== null && <Row label={`Break-even per head${sold ? '' : ' (current head count)'}`}>{pesoWhole(bePerHead)}</Row>}
      {bePerKg !== null && <Row label={`Break-even per kg${sold ? '' : ` (at ${MARKET_KG} kg each)`}`}>{peso2(bePerKg)}</Row>}
    </>
  )
}
