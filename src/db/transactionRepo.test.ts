import 'fake-indexeddb/auto'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from './db'
import { addTransaction, listTransactions, removeTransaction } from './transactionRepo'

beforeEach(async () => {
  await db.transactions.clear()
})

describe('addTransaction', () => {
  it('stores an expense with a seed category and a batch link', async () => {
    const tx = await addTransaction({ date: '2026-03-02', kind: 'expense', category: 'feed', amount: 1500, links: { batchId: 'b1' } })
    expect(tx.id).toBeTruthy()
    expect(tx.deletedAt).toBeNull()
    expect(await db.transactions.get(tx.id)).toMatchObject({ kind: 'expense', category: 'feed', amount: 1500, links: { batchId: 'b1' } })
  })

  it('rejects a zero or negative amount and a non-finite amount', async () => {
    await expect(addTransaction({ date: '2026-03-02', kind: 'expense', category: 'feed', amount: 0, links: {} })).rejects.toThrow(/amount/i)
    await expect(addTransaction({ date: '2026-03-02', kind: 'expense', category: 'feed', amount: -5, links: {} })).rejects.toThrow(/amount/i)
    await expect(addTransaction({ date: '2026-03-02', kind: 'expense', category: 'feed', amount: NaN, links: {} })).rejects.toThrow(/amount/i)
  })

  it('rejects a category outside the list for the kind', async () => {
    await expect(addTransaction({ date: '2026-03-02', kind: 'expense', category: 'hogSales', amount: 10, links: {} })).rejects.toThrow(/category/i)
    await expect(addTransaction({ date: '2026-03-02', kind: 'revenue', category: 'feed', amount: 10, links: {} })).rejects.toThrow(/category/i)
    await expect(addTransaction({ date: '2026-03-02', kind: 'capital', category: 'feed', amount: 10, links: {} })).rejects.toThrow(/category/i)
  })

  it('accepts capital with an expense category and fixes the category of drawings and loans', async () => {
    const cap = await addTransaction({ date: '2026-03-02', kind: 'capital', category: 'penConstruction', amount: 20000, links: {} })
    expect(cap.category).toBe('penConstruction')
    const draw = await addTransaction({ date: '2026-03-03', kind: 'drawing', category: 'drawing', amount: 500, links: {} })
    expect(draw.category).toBe('drawing')
    await expect(addTransaction({ date: '2026-03-03', kind: 'loan', category: 'feed', amount: 500, links: {} })).rejects.toThrow(/category/i)
  })

  it('rejects a malformed date', async () => {
    await expect(addTransaction({ date: '2/3/2026', kind: 'expense', category: 'feed', amount: 10, links: {} })).rejects.toThrow(/date/i)
  })
})

describe('listTransactions', () => {
  it('filters by period inclusive and by kind, newest first', async () => {
    await addTransaction({ date: '2026-02-28', kind: 'expense', category: 'feed', amount: 1, links: {} })
    await addTransaction({ date: '2026-03-01', kind: 'expense', category: 'feed', amount: 2, links: {} })
    await addTransaction({ date: '2026-03-15', kind: 'revenue', category: 'hogSales', amount: 3, links: {} })
    await addTransaction({ date: '2026-03-31', kind: 'expense', category: 'labour', amount: 4, links: {} })
    await addTransaction({ date: '2026-04-01', kind: 'expense', category: 'feed', amount: 5, links: {} })
    const march = await listTransactions({ from: '2026-03-01', to: '2026-03-31' })
    expect(march.map((t) => t.amount)).toEqual([4, 3, 2])
    const marchExpenses = await listTransactions({ from: '2026-03-01', to: '2026-03-31', kind: 'expense' })
    expect(marchExpenses.map((t) => t.amount)).toEqual([4, 2])
    const all = await listTransactions({})
    expect(all).toHaveLength(5)
  })

  it('hides soft-deleted rows', async () => {
    const tx = await addTransaction({ date: '2026-03-01', kind: 'expense', category: 'feed', amount: 2, links: {} })
    await removeTransaction(tx.id)
    expect(await listTransactions({})).toHaveLength(0)
    const row = await db.transactions.get(tx.id)
    expect(row?.deletedAt).toBe(row?.updatedAt)
  })
})
