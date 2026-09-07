import { describe, expect, it } from 'vitest'
import type { RecordsRows } from '../db/exportRepo'
import { PRICE_ITEM_LABEL } from '../db/priceLogRepo'
import { buildRecords, recordsFilename } from './records'
import { MONEY_FORMAT, type Cell, type Sheet } from './xlsx'

const AT = '2026-09-01T00:00:00.000Z'
const money = (n: number): Cell => ({ value: n, format: MONEY_FORMAT })

const rows: RecordsRows = {
  tables: {
    farm: [{ id: 'farm', name: 'Kubo Piggery', location: 'Tanauan, Batangas', currency: 'PHP', startDate: '2026-05-01', updatedAt: AT }],
    pens: [{ id: 'pen1', name: 'Pen 1', stage: 'grower', capacity: 10, updatedAt: AT }],
    animals: [
      { id: 'sow1', tag: 'S1', role: 'sow', breed: 'Large White', sex: 'female', birthDate: '2025-01-10', source: 'bought', purchaseTransactionId: 't-sow', damId: 'gone-dam', status: 'active', notes: 'good mother', updatedAt: AT },
      { id: 'boar1', tag: 'B1', role: 'boar', sex: 'male', source: 'bought', status: 'active', updatedAt: AT },
      { id: 'pig1', tag: 'P1', role: 'grower', sex: 'male', birthDate: '2026-06-24', source: 'born', damId: 'sow1', sireId: 'boar1', litterId: 'lit1', batchId: 'b1', penId: 'pen1', status: 'sold', statusDate: '2026-08-31', updatedAt: AT },
    ],
    litters: [{ id: 'lit1', sowId: 'sow1', sireId: 'boar1', serviceDate: '2026-03-01', expectedFarrowDate: '2026-06-23', farrowDate: '2026-06-24', bornAlive: 9, stillborn: 1, mummified: 0, weanDate: '2026-07-22', weanedCount: 8, outcome: 'farrowed', notes: 'easy farrowing', updatedAt: AT }],
    batches: [{ id: 'b1', name: 'Batch A', kind: 'growers', litterIds: ['lit1'], headCount: 6, startDate: '2026-07-22', penId: 'pen1', strategy: 'growToMarket', updatedAt: AT }],
    events: [
      { id: 'e1', subjectType: 'animal', subjectId: 'pig1', type: 'weight', date: '2026-08-01', data: { kg: 25 }, updatedAt: AT },
      { id: 'e2', subjectType: 'litter', subjectId: 'lit1', type: 'weaning', date: '2026-07-22', data: { weanedCount: 8 }, updatedAt: AT },
      { id: 'e3', subjectType: 'batch', subjectId: 'b1', type: 'vaccination', date: '2026-08-05', data: {}, costTransactionId: 't-vac', updatedAt: AT },
    ],
    sales: [{ id: 's1', date: '2026-08-31', buyerType: 'viajero', buyerName: 'Mang Tonyo', lines: [{ batchId: 'b1', animalIds: ['pig1'], headCount: 1, liveWeightKg: 90, pricePerKg: 150 }], total: 13500, transactionId: 't-sale', updatedAt: AT }],
    transactions: [
      { id: 't-sow', date: '2026-05-02', kind: 'capital', category: 'stockPurchase', amount: 15000, links: { animalId: 'sow1' }, updatedAt: AT },
      { id: 't-vac', date: '2026-08-05', kind: 'expense', category: 'medicineVaccine', amount: 500, links: { batchId: 'b1' }, updatedAt: AT },
      { id: 't-sale', date: '2026-08-31', kind: 'revenue', category: 'hogSales', amount: 13500, links: { batchId: 'b1', saleId: 's1' }, updatedAt: AT },
    ],
    inventoryItems: [{ id: 'item1', name: 'Grower feed', category: 'feed', unit: 'bag', kgPerUnit: 50, qtyOnHand: 3, reorderLevel: 2, unitCost: 1500, expiryDate: '2026-12-31', updatedAt: AT }],
    stockMoves: [{ id: 'm1', itemId: 'item1', date: '2026-08-11', qtyDelta: 3, reason: 'purchase', transactionId: 't-feed', unitCost: 1500, updatedAt: AT }],
    priceLog: [{ id: 'p1', date: '2026-08-20', market: 'Tanauan', item: 'liveweightPerKg', value: 160, source: 'heard', note: 'from a viajero', updatedAt: AT }],
    scenarios: [{ id: 'sc1', name: 'Grow all to market', strategy: 'growToMarket', params: { sows: 3, feedPricePerKg: 32 }, createdAt: '2026-08-15T08:00:00.000Z', updatedAt: AT }],
  },
}

const sheets = buildRecords(rows)
const sheet = (name: string): Sheet => {
  const s = sheets.find((x) => x.name === name)
  if (!s) throw new Error(`no sheet ${name}`)
  return s
}

describe('buildRecords', () => {
  it('returns the thirteen sheets in order, one row per live record, every row as wide as its header', () => {
    expect(sheets.map((s) => s.name)).toEqual(['Farm', 'Pens', 'Animals', 'Litters', 'Batches', 'Events', 'Sales', 'Sale lines', 'Transactions', 'Inventory items', 'Stock moves', 'Price log', 'Scenarios'])
    expect(sheets.map((s) => s.rows.length)).toEqual([1, 1, 3, 1, 1, 3, 1, 1, 3, 1, 1, 1, 1])
    for (const s of sheets) for (const r of s.rows) expect(r.length).toBe(s.columns.length)
  })
  it('writes the farm and the pens with labels', () => {
    expect(sheet('Farm').rows).toEqual([['Kubo Piggery', 'Tanauan, Batangas', 'PHP', '2026-05-01', 'farm']])
    expect(sheet('Pens').columns.map((c) => c.header)).toEqual(['Name', 'Stage', 'Capacity', 'Reference'])
    expect(sheet('Pens').rows).toEqual([['Pen 1', 'Grower', 10, 'pen1']])
  })
  it('resolves the animals to tags, names and labels, keeping an id that is gone', () => {
    const s = sheet('Animals')
    expect(s.columns.map((c) => c.header)).toEqual(['Tag', 'Role', 'Sex', 'Breed', 'Birth date', 'Source', 'Dam', 'Sire', 'Litter', 'Batch', 'Pen', 'Status', 'Status date', 'Notes', 'Reference'])
    expect(s.rows[0]).toEqual(['S1', 'Sow', 'Female', 'Large White', '2025-01-10', 'Bought', 'gone-dam', null, null, null, null, 'Active', null, 'good mother', 'sow1'])
    expect(s.rows[2]).toEqual(['P1', 'Grower', 'Male', null, '2026-06-24', 'Born', 'S1', 'B1', 'S1 2026-03-01', 'Batch A', 'Pen 1', 'Sold', '2026-08-31', null, 'pig1'])
  })
  it('writes the litters with the sow and sire tags and the outcome label', () => {
    const s = sheet('Litters')
    expect(s.columns.map((c) => c.header)).toEqual(['Sow', 'Sire', 'AI note', 'Service date', 'Expected farrow', 'Farrow date', 'Born alive', 'Stillborn', 'Mummified', 'Wean date', 'Weaned', 'Outcome', 'Notes', 'Reference'])
    expect(s.rows[0]).toEqual(['S1', 'B1', null, '2026-03-01', '2026-06-23', '2026-06-24', 9, 1, 0, '2026-07-22', 8, 'Farrowed', 'easy farrowing', 'lit1'])
  })
  it('writes the batches with their litters, kind, strategy and pen', () => {
    const s = sheet('Batches')
    expect(s.columns.map((c) => c.header)).toEqual(['Name', 'Kind', 'Strategy', 'Litters', 'Head count', 'Start date', 'Pen', 'Reference'])
    expect(s.rows[0]).toEqual(['Batch A', 'Growers', 'Grow to market weight', 'S1 2026-03-01', 6, '2026-07-22', 'Pen 1', 'b1'])
  })
  it('writes the events oldest first with the subject resolved, the type label and the details as JSON', () => {
    const s = sheet('Events')
    expect(s.columns.map((c) => c.header)).toEqual(['Date', 'Subject type', 'Subject', 'Type', 'Details', 'Cost transaction', 'Reference'])
    expect(s.rows).toEqual([
      ['2026-07-22', 'Litter', 'S1 2026-03-01', 'Weaning', '{"weanedCount":8}', null, 'e2'],
      ['2026-08-01', 'Animal', 'P1', 'Weighing', '{"kg":25}', null, 'e1'],
      ['2026-08-05', 'Batch', 'Batch A', 'Vaccination', null, 't-vac', 'e3'],
    ])
  })
  it('writes the sales, the sale lines and the transactions in the books shapes', () => {
    expect(sheet('Sales').rows).toEqual([['2026-08-31', 'Viajero (trader)', 'Mang Tonyo', 1, 90, money(13500), 's1']])
    expect(sheet('Sale lines').rows).toEqual([['2026-08-31', 'Mang Tonyo', 'Batch A', 'P1', 1, 90, money(150), null, money(13500)]])
    const t = sheet('Transactions')
    expect(t.columns.map((c) => c.header)).toEqual(['Date', 'Kind', 'Category', 'Amount', 'Batch', 'Animal', 'Item', 'Sale', 'Note', 'Reference'])
    expect(t.rows[0]).toEqual(['2026-05-02', 'Capital purchase', 'Stock purchase (animals)', money(15000), null, 'S1', null, null, null, 't-sow'])
  })
  it('writes the inventory items, the stock moves, the price log and the scenarios', () => {
    expect(sheet('Inventory items').columns.map((c) => c.header)).toEqual(['Name', 'Category', 'Unit', 'Kg per unit', 'On hand', 'Reorder level', 'Unit cost', 'Value', 'Expiry', 'Reference'])
    expect(sheet('Inventory items').rows).toEqual([['Grower feed', 'Feed', 'bag', 50, 3, 2, money(1500), money(4500), '2026-12-31', 'item1']])
    expect(sheet('Stock moves').rows).toEqual([['2026-08-11', 'Grower feed', 'Purchase', 3, 'bag', money(1500), money(4500), null, null, 'm1']])
    expect(sheet('Price log').columns.map((c) => c.header)).toEqual(['Date', 'Item', 'Value', 'Market', 'Source', 'Note', 'Reference'])
    expect(sheet('Price log').rows).toEqual([['2026-08-20', PRICE_ITEM_LABEL.liveweightPerKg, money(160), 'Tanauan', 'Heard', 'from a viajero', 'p1']])
    expect(sheet('Scenarios').columns.map((c) => c.header)).toEqual(['Name', 'Strategy', 'Created', 'Parameters', 'Reference'])
    expect(sheet('Scenarios').rows).toEqual([['Grow all to market', 'Grow to market weight', '2026-08-15T08:00:00.000Z', '{"sows":3,"feedPricePerKg":32}', 'sc1']])
  })
})

describe('recordsFilename', () => {
  it('names the file by the day', () => {
    expect(recordsFilename('2026-09-08')).toBe('oinkonomics-records-2026-09-08.xlsx')
  })
})
