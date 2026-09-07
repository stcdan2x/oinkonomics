import { describe, expect, it } from 'vitest'
import type { BooksRows } from '../db/exportRepo'
import type { FarmCosting } from '../db/costingRepo'
import { batchCosting } from '../engine/costing'
import { cashFlow, incomeStatement, type Period } from '../engine/finance'
import type { Animal, Batch, Farm, InventoryItem, Litter, Sale, StockMove, Transaction } from '../types'
import { booksFilename, buildBooks } from './books'
import { MONEY_FORMAT, type Cell, type Sheet } from './xlsx'

const AT = '2026-09-01T00:00:00.000Z'
const period: Period = { from: '2026-08-01', to: '2026-08-31' }
const money = (n: number): Cell => ({ value: n, format: MONEY_FORMAT })

const farm: Farm = { id: 'farm', name: 'Kubo Piggery', location: 'Tanauan, Batangas', currency: 'PHP', startDate: '2026-05-01', updatedAt: AT }
const sow: Animal = { id: 'sow1', tag: 'S1', role: 'sow', sex: 'female', source: 'bought', status: 'active', updatedAt: AT }
const litter: Litter = { id: 'lit1', sowId: 'sow1', serviceDate: '2026-03-01', expectedFarrowDate: '2026-06-23', farrowDate: '2026-06-24', bornAlive: 9, stillborn: 1, mummified: 0, weanDate: '2026-07-22', weanedCount: 8, outcome: 'farrowed', updatedAt: AT }
const batch: Batch = { id: 'b1', name: 'Batch A', kind: 'growers', litterIds: ['lit1'], headCount: 6, startDate: '2026-07-22', strategy: 'growToMarket', updatedAt: AT }
const item: InventoryItem = { id: 'item1', name: 'Grower feed', category: 'feed', unit: 'bag', kgPerUnit: 50, qtyOnHand: 3, reorderLevel: 2, unitCost: 1500, expiryDate: '2026-12-31', updatedAt: AT }
const item2: InventoryItem = { id: 'item2', name: 'Iron dextran', category: 'medicine', unit: 'vial', qtyOnHand: 0, reorderLevel: 1, unitCost: 250, updatedAt: AT }

const tx = (id: string, date: string, kind: Transaction['kind'], category: string, amount: number, links: Transaction['links'] = {}, note?: string): Transaction => ({ id, date, kind, category, amount, links, note, updatedAt: AT })
const transactions: Transaction[] = [
  tx('t-cap', '2026-06-15', 'capital', 'penConstruction', 20000),
  tx('t-owner', '2026-08-01', 'ownerCapital', 'ownerContribution', 5000),
  tx('t-feed', '2026-08-11', 'expense', 'feed', 4500, { itemId: 'item1' }, '3 bags'),
  tx('t-labour', '2026-08-15', 'expense', 'labour', 2000),
  tx('t-vet', '2026-08-16', 'expense', 'medicineVaccine', 350, { animalId: 'sow1' }),
  tx('t-draw', '2026-08-20', 'drawing', 'drawing', 1000),
  tx('t-sale', '2026-08-31', 'revenue', 'hogSales', 21000, { batchId: 'b1', saleId: 's1' }),
  { ...tx('t-gone', '2026-08-12', 'expense', 'feed', 900), deletedAt: AT },
  tx('t-after', '2026-09-02', 'expense', 'water', 700),
]
const sale: Sale = {
  id: 's1',
  date: '2026-08-31',
  buyerType: 'viajero',
  buyerName: 'Mang Tonyo',
  lines: [
    { batchId: 'b1', headCount: 2, pricePerHead: 3000 },
    { animalIds: ['sow1'], headCount: 1, liveWeightKg: 100, pricePerKg: 150 },
  ],
  total: 21000,
  transactionId: 't-sale',
  updatedAt: AT,
}
const moves: StockMove[] = [
  { id: 'm1', itemId: 'item1', date: '2026-08-11', qtyDelta: 3, reason: 'purchase', transactionId: 't-feed', unitCost: 1500, updatedAt: AT },
  { id: 'm2', itemId: 'item1', date: '2026-08-25', qtyDelta: -1, reason: 'consumption', batchId: 'b1', unitCost: 1500, updatedAt: AT },
  { id: 'm3', itemId: 'gone-item', date: '2026-08-26', qtyDelta: -1, reason: 'loss', updatedAt: AT },
]
const costing: FarmCosting = {
  batches: [
    {
      batch,
      startHead: 8,
      headSold: 2,
      kgSold: 180,
      pigletCostPerHead: 400,
      costing: batchCosting({ batchId: 'b1', txs: [transactions[6], tx('t-stock', '2026-08-25', 'expense', 'feed', 1500, { batchId: 'b1' })], allocated: 1200, headDays: 240, startHead: 8, pigletCostPerHead: 400 }),
    },
  ],
  herdByMonth: new Map([
    ['2026-07', { direct: 2000, allocated: 500, weaned: 8 }],
    ['2026-08', { direct: 350, allocated: 300, weaned: 0 }],
  ]),
  unallocated: 150,
}
const rows: BooksRows = { farm, transactions, sales: [sale], moves, items: [item, item2], batches: [batch], animals: [sow], litters: [litter], costing, asAt: '2026-08-31' }

const sheets = buildBooks(period, AT, rows)
const sheet = (name: string): Sheet => {
  const s = sheets.find((x) => x.name === name)
  if (!s) throw new Error(`no sheet ${name}`)
  return s
}
const amount = (s: Sheet, label: string): Cell => {
  const r = s.rows.find((x) => x[0] === label)
  if (!r) throw new Error(`no row ${label}`)
  return r[1]
}

describe('buildBooks', () => {
  it('returns the seven sheets in order, each with headers and widths', () => {
    expect(sheets.map((s) => s.name)).toEqual(['Summary', 'Ledger', 'Sales', 'Sale lines', 'Batch costs', 'Stock moves', 'Stock on hand'])
    for (const s of sheets) {
      expect(s.columns.length).toBeGreaterThan(0)
      for (const c of s.columns) expect(c.width).toBeGreaterThan(0)
      for (const r of s.rows) expect(r.length).toBe(s.columns.length)
    }
  })
})

describe('Summary', () => {
  const s = sheet('Summary')
  const is = incomeStatement(transactions, period.from, period.to)
  const cf = cashFlow(transactions, period.from, period.to)
  it('names the farm, the range and the export time', () => {
    expect(amount(s, 'Farm')).toBe('Kubo Piggery')
    expect(amount(s, 'Location')).toBe('Tanauan, Batangas')
    expect(amount(s, 'From')).toBe('2026-08-01')
    expect(amount(s, 'To')).toBe('2026-08-31')
    expect(amount(s, 'Exported at')).toMatch(/^2026-09-01 /)
  })
  it('carries the income statement by category with the same figures as the engine', () => {
    expect(amount(s, 'Revenue: Hog sales')).toEqual(money(21000))
    expect(amount(s, 'Total revenue')).toEqual(money(is.totalRevenue))
    expect(amount(s, 'Expense: Feed')).toEqual(money(4500))
    expect(amount(s, 'Expense: Labour')).toEqual(money(2000))
    expect(amount(s, 'Expense: Medicine and vaccines')).toEqual(money(350))
    expect(amount(s, 'Total expenses')).toEqual(money(is.totalExpenses))
    expect(amount(s, 'Net income')).toEqual(money(is.netIncome))
    expect(is.netIncome).toBe(21000 - 6850)
  })
  it('carries the cash flow lines with the Reports tab signs', () => {
    expect(amount(s, 'Opening balance')).toEqual(money(cf.openingBalance))
    expect(cf.openingBalance).toBe(-20000)
    expect(amount(s, 'Operating in (revenue)')).toEqual(money(21000))
    expect(amount(s, 'Operating out (expenses)')).toEqual(money(-6850))
    expect(amount(s, 'Capital purchases')).toEqual(money(0))
    expect(amount(s, 'Loans received')).toEqual(money(0))
    expect(amount(s, 'Loan repayments')).toEqual(money(0))
    expect(amount(s, "Owner's capital in")).toEqual(money(5000))
    expect(amount(s, 'Owner drawings')).toEqual(money(-1000))
    expect(amount(s, 'Net cash this period')).toEqual(money(cf.netCash))
    expect(amount(s, 'Closing balance')).toEqual(money(cf.closingBalance))
  })
  it('carries the unit-costs card figures', () => {
    expect(amount(s, 'Breeding herd cost (1 month)')).toEqual(money(650))
    expect(amount(s, 'Piglets weaned')).toBe(0)
    expect(amount(s, 'Cost per weaned piglet')).toBe('no weaning in these months')
    expect(amount(s, 'Capital spent to 2026-08-31')).toEqual(money(20000))
    expect(amount(s, 'ROI (net income / capital)')).toBe('70.8%')
    expect(amount(s, 'Capital paid back')).toBe('not yet')
  })
  it('reads the whole herd for All time and shows a piglet cost when there was weaning', () => {
    const all = buildBooks({ from: '0001-01-01', to: '9999-12-31' }, AT, rows)
    const sum = all[0]
    expect(amount(sum, 'Breeding herd cost (2 months)')).toEqual(money(3150))
    expect(amount(sum, 'Piglets weaned')).toBe(8)
    expect(amount(sum, 'Cost per weaned piglet')).toEqual(money(393.75))
    expect(amount(sum, 'Capital spent to date')).toEqual(money(20000))
  })
})

describe('Ledger', () => {
  const s = sheet('Ledger')
  it('lists the live entries of the period oldest first, with labels, names and the reference', () => {
    expect(s.columns.map((c) => c.header)).toEqual(['Date', 'Kind', 'Category', 'Amount', 'Batch', 'Animal', 'Item', 'Sale', 'Note', 'Reference'])
    expect(s.rows.map((r) => r[9])).toEqual(['t-owner', 't-feed', 't-labour', 't-vet', 't-draw', 't-sale'])
    expect(s.rows[1]).toEqual(['2026-08-11', 'Expense', 'Feed', money(4500), null, null, 'Grower feed', null, '3 bags', 't-feed'])
    expect(s.rows[3]).toEqual(['2026-08-16', 'Expense', 'Medicine and vaccines', money(350), null, 'S1', null, null, null, 't-vet'])
    expect(s.rows[5]).toEqual(['2026-08-31', 'Revenue', 'Hog sales', money(21000), 'Batch A', null, null, 'Mang Tonyo', null, 't-sale'])
    expect(s.rows[4][1]).toBe('Drawing')
    expect(s.rows[0][1]).toBe("Owner's capital in")
  })
})

describe('Sales and Sale lines', () => {
  it('lists the sales of the period with buyer, head, kg and total', () => {
    const s = sheet('Sales')
    expect(s.columns.map((c) => c.header)).toEqual(['Date', 'Buyer type', 'Buyer', 'Head', 'Live weight kg', 'Total', 'Reference'])
    expect(s.rows).toEqual([['2026-08-31', 'Viajero (trader)', 'Mang Tonyo', 3, 100, money(21000), 's1']])
  })
  it('lists one row per line with the batch name, the animal tags and the line total', () => {
    const s = sheet('Sale lines')
    expect(s.columns.map((c) => c.header)).toEqual(['Sale date', 'Buyer', 'Batch', 'Animals', 'Head', 'Live weight kg', 'Price per kg', 'Price per head', 'Line total'])
    expect(s.rows).toEqual([
      ['2026-08-31', 'Mang Tonyo', 'Batch A', null, 2, null, null, money(3000), money(6000)],
      ['2026-08-31', 'Mang Tonyo', null, 'S1', 1, 100, money(150), null, money(15000)],
    ])
  })
  it('leaves out sales dated outside the period', () => {
    const later = buildBooks({ from: '2026-09-01', to: '2026-09-30' }, AT, rows)
    expect(later.find((x) => x.name === 'Sales')?.rows).toEqual([])
  })
})

describe('Batch costs', () => {
  const s = sheet('Batch costs')
  it('lists every batch with the Batches tab figures and the unallocated line', () => {
    expect(s.columns.map((c) => c.header)).toEqual(['Batch', 'Kind', 'Strategy', 'Started', 'Start head', 'On farm', 'Head sold', 'Kg sold', 'Piglet value', 'Direct costs', 'Allocated shared', 'Total cost', 'Revenue', 'Profit', 'Cost per kg sold', 'Break-even per head', 'Break-even per kg'])
    const c = costing.batches[0].costing
    expect(c.totalCost).toBe(1500 + 1200 + 3200)
    expect(s.rows[0]).toEqual(['Batch A', 'Growers', 'Grow to market weight', '2026-07-22', 8, 6, 2, 180, money(3200), money(1500), money(1200), money(5900), money(21000), money(15100), money(5900 / 180), money(2950), money(5900 / 180)])
    expect(s.rows[1][0]).toBe('Unallocated shared expenses')
    expect(s.rows[1][11]).toEqual(money(150))
  })
})

describe('Stock moves', () => {
  const s = sheet('Stock moves')
  it('lists the moves of the period with item names, reason labels and values', () => {
    expect(s.columns.map((c) => c.header)).toEqual(['Date', 'Item', 'Reason', 'Quantity', 'Unit', 'Unit cost', 'Value', 'Batch', 'Animal', 'Reference'])
    expect(s.rows).toEqual([
      ['2026-08-11', 'Grower feed', 'Purchase', 3, 'bag', money(1500), money(4500), null, null, 'm1'],
      ['2026-08-25', 'Grower feed', 'Used', -1, 'bag', money(1500), money(-1500), 'Batch A', null, 'm2'],
      ['2026-08-26', 'gone-item', 'Loss', -1, null, null, null, null, null, 'm3'],
    ])
  })
})

describe('Stock on hand', () => {
  const s = sheet('Stock on hand')
  it('lists every item with quantity, unit cost and value, and a total row', () => {
    expect(s.columns.map((c) => c.header)).toEqual(['Item', 'Category', 'Unit', 'On hand', 'Unit cost', 'Value', 'Reorder level', 'Expiry'])
    expect(s.rows).toEqual([
      ['Grower feed', 'Feed', 'bag', 3, money(1500), money(4500), 2, '2026-12-31'],
      ['Iron dextran', 'Medicine', 'vial', 0, money(250), money(0), 1, null],
      ['Total', null, null, null, null, money(4500), null, null],
    ])
  })
})

describe('booksFilename', () => {
  it('names the file by the range', () => {
    expect(booksFilename({ from: '2026-08-01', to: '2026-08-31' })).toBe('oinkonomics-books-2026-08-01-to-2026-08-31.xlsx')
  })
  it('names the All-time file by name, not by the sentinel dates', () => {
    expect(booksFilename({ from: '0001-01-01', to: '9999-12-31' })).toBe('oinkonomics-books-all-time.xlsx')
  })
})
