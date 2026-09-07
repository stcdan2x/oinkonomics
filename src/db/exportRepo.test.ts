import 'fake-indexeddb/auto'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from './db'
import { booksRows, recordsRows } from './exportRepo'
import { saveFarm } from './farmRepo'
import { create, softDelete } from './repo'
import { TABLES } from './tables'

const clearAll = () => Promise.all(db.tables.map((t) => t.clear()))

const tx = (date: string, amount: number, kind: 'expense' | 'revenue' | 'capital' = 'expense') =>
  create(db.transactions, { date, kind, category: kind === 'revenue' ? 'hogSales' : 'feed', amount, links: {} })

describe('booksRows (TASK 005 step 1.2)', () => {
  beforeEach(clearAll)

  it('loads every live transaction, the dated rows up to To, the name tables and the farm', async () => {
    await saveFarm({ name: 'Kubo Piggery', startDate: '2026-05-01' })
    const before = await tx('2026-05-20', 300)
    const inside = await tx('2026-08-10', 500)
    const after = await tx('2026-09-02', 700)
    const gone = await tx('2026-08-12', 900)
    await softDelete(db.transactions, gone.id)
    const item = await create(db.inventoryItems, { name: 'Grower feed', category: 'feed', unit: 'bag', kgPerUnit: 50, qtyOnHand: 2, reorderLevel: 1, unitCost: 1500 })
    const moveIn = await create(db.stockMoves, { itemId: item.id, date: '2026-08-11', qtyDelta: 2, reason: 'purchase', unitCost: 1500 })
    const moveAfter = await create(db.stockMoves, { itemId: item.id, date: '2026-09-01', qtyDelta: -1, reason: 'consumption', unitCost: 1500 })
    const saleIn = await create(db.sales, { date: '2026-08-31', buyerType: 'viajero', lines: [{ headCount: 2, pricePerHead: 3000 }], total: 6000 })
    const saleAfter = await create(db.sales, { date: '2026-09-01', buyerType: 'market', lines: [{ headCount: 1, pricePerHead: 3000 }], total: 3000 })
    const saleGone = await create(db.sales, { date: '2026-08-20', buyerType: 'other', lines: [{ headCount: 1, pricePerHead: 100 }], total: 100 })
    await softDelete(db.sales, saleGone.id)
    const batch = await create(db.batches, { name: 'Batch A', kind: 'growers', litterIds: [], headCount: 5, startDate: '2026-07-01', strategy: 'growToMarket' })
    const sow = await create(db.animals, { tag: 'S1', role: 'sow', sex: 'female', source: 'bought', status: 'active' })
    const litter = await create(db.litters, { sowId: sow.id, serviceDate: '2026-03-01', expectedFarrowDate: '2026-06-23', bornAlive: 0, stillborn: 0, mummified: 0, weanedCount: 0 })

    const rows = await booksRows('2026-08-31', '2026-09-08')
    expect(rows.farm?.name).toBe('Kubo Piggery')
    expect(rows.transactions.map((t) => t.id).sort()).toEqual([before.id, inside.id, after.id].sort())
    expect(rows.moves.map((m) => m.id)).toEqual([moveIn.id])
    expect(rows.moves.map((m) => m.id)).not.toContain(moveAfter.id)
    expect(rows.sales.map((s) => s.id)).toEqual([saleIn.id])
    expect(rows.sales.map((s) => s.id)).not.toContain(saleAfter.id)
    expect(rows.items.map((i) => i.id)).toEqual([item.id])
    expect(rows.batches.map((b) => b.id)).toEqual([batch.id])
    expect(rows.animals.map((a) => a.id)).toEqual([sow.id])
    expect(rows.litters.map((l) => l.id)).toEqual([litter.id])
    expect(rows.asAt).toBe('2026-08-31')
    expect(rows.costing.batches.map((r) => r.batch.id)).toEqual([batch.id])
  })

  it('computes the costing as at the To date, clamped to today for a To in the future', async () => {
    await saveFarm({ name: 'Kubo Piggery', startDate: '2026-05-01' })
    await tx('2026-05-20', 300)
    const past = await booksRows('2026-06-30', '2026-09-08')
    expect([...past.costing.herdByMonth.keys()]).toEqual(['2026-05', '2026-06'])
    expect(past.asAt).toBe('2026-06-30')
    const future = await booksRows('9999-12-31', '2026-09-08')
    const months = [...future.costing.herdByMonth.keys()]
    expect(months[months.length - 1]).toBe('2026-09')
    expect(future.asAt).toBe('2026-09-08')
  })
})

describe('recordsRows (TASK 005 step 1.2)', () => {
  beforeEach(clearAll)

  it('returns every exported table with its live rows only, never the settings table', async () => {
    await saveFarm({ name: 'Kubo Piggery', startDate: '2026-05-01' })
    const pen = await create(db.pens, { name: 'Pen 1', stage: 'grower' })
    const gone = await create(db.pens, { name: 'Old pen', stage: 'other' })
    await softDelete(db.pens, gone.id)
    await db.settings.put({ key: 'lastSyncAt', value: 'x', updatedAt: '2026-09-02T00:00:00.000Z' })

    const rows = await recordsRows()
    expect(Object.keys(rows.tables).sort()).toEqual([...TABLES].sort())
    expect(rows.tables.pens.map((p) => p.id)).toEqual([pen.id])
    expect(rows.tables.farm.map((f) => f.name)).toEqual(['Kubo Piggery'])
    expect('settings' in rows.tables).toBe(false)
  })
})
