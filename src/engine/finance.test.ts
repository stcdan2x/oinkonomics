import { describe, expect, it } from 'vitest'
import { periodPresets } from './finance'

describe('periodPresets', () => {
  it('builds this month, last month, this year and all-time from a date', () => {
    const p = periodPresets('2026-03-15')
    expect(p.thisMonth).toEqual({ from: '2026-03-01', to: '2026-03-31' })
    expect(p.lastMonth).toEqual({ from: '2026-02-01', to: '2026-02-28' })
    expect(p.thisYear).toEqual({ from: '2026-01-01', to: '2026-12-31' })
    expect(p.all.from < '1990-01-01' && p.all.to > '2100-01-01').toBe(true)
  })

  it('handles January and leap years', () => {
    const p = periodPresets('2028-01-10')
    expect(p.lastMonth).toEqual({ from: '2027-12-01', to: '2027-12-31' })
    expect(periodPresets('2028-02-05').thisMonth.to).toBe('2028-02-29')
  })
})

import { cashFlow, incomeStatement } from './finance'
import type { Transaction } from '../types'

let n = 0
const tx = (date: string, kind: Transaction['kind'], category: string, amount: number, deleted = false): Transaction => ({
  id: `t${++n}`,
  updatedAt: '2026-03-31T00:00:00.000Z',
  deletedAt: deleted ? '2026-03-31T00:00:00.000Z' : null,
  date,
  kind,
  category,
  amount,
  links: {},
})

// March 2026 fixture, numbers hand-computed in the comments.
const TXS: Transaction[] = [
  tx('2026-03-10', 'revenue', 'hogSales', 183150),
  tx('2026-03-12', 'revenue', 'manure', 500),
  tx('2026-03-01', 'expense', 'feed', 40000),
  tx('2026-03-20', 'expense', 'feed', 12000),
  tx('2026-03-31', 'expense', 'labour', 6000),
  tx('2026-03-05', 'capital', 'penConstruction', 25000),
  tx('2026-03-15', 'drawing', 'drawing', 3000),
  tx('2026-03-02', 'loan', 'loan', 50000),
  tx('2026-03-30', 'loanPayment', 'loanPayment', 5000),
  tx('2026-03-03', 'ownerCapital', 'ownerContribution', 20000), // TASK 003 Phase 2: cash in, never income
  tx('2026-02-28', 'expense', 'feed', 999), // before the period: only in the opening balance
  tx('2026-04-01', 'expense', 'feed', 777), // after the period: ignored
  tx('2026-03-16', 'expense', 'feed', 5555, true), // tombstone: ignored everywhere
]
const MARCH = { from: '2026-03-01', to: '2026-03-31' }

describe('incomeStatement', () => {
  it('sums revenue and expenses by category inside the period, operating kinds only', () => {
    const s = incomeStatement(TXS, MARCH.from, MARCH.to)
    expect(s.revenue).toEqual([
      { category: 'hogSales', amount: 183150 },
      { category: 'manure', amount: 500 },
    ])
    expect(s.expenses).toEqual([
      { category: 'feed', amount: 52000 }, // 40000 + 12000
      { category: 'labour', amount: 6000 },
    ])
    expect(s.totalRevenue).toBe(183650)
    expect(s.totalExpenses).toBe(58000)
    expect(s.netIncome).toBe(125650) // 183650 - 58000
  })

  it('returns zeros for an empty period', () => {
    const s = incomeStatement(TXS, '2026-05-01', '2026-05-31')
    expect(s).toEqual({ revenue: [], expenses: [], totalRevenue: 0, totalExpenses: 0, netIncome: 0 })
  })
})

describe('cashFlow', () => {
  it('splits operating, capital and financing flows and carries the opening balance', () => {
    const c = cashFlow(TXS, MARCH.from, MARCH.to)
    expect(c.operatingIn).toBe(183650)
    expect(c.operatingOut).toBe(58000)
    expect(c.capitalOut).toBe(25000)
    expect(c.loansIn).toBe(50000)
    expect(c.loanPaymentsOut).toBe(5000)
    expect(c.drawingsOut).toBe(3000)
    expect(c.ownerCapitalIn).toBe(20000)
    expect(c.netCash).toBe(162650) // 183650 - 58000 - 25000 + 50000 - 5000 - 3000 + 20000
    expect(c.openingBalance).toBe(-999) // the February feed purchase
    expect(c.closingBalance).toBe(161651) // -999 + 162650
  })
})
