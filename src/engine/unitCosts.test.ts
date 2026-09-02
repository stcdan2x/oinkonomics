import { describe, expect, it } from 'vitest'
import type { Transaction } from '../types'
import { breakEvenPerHead, breakEvenPerKg, costPerKgSold, costPerWeanedPiglet, paybackDate, roi } from './unitCosts'

describe('unit costs', () => {
  it('divides cost by units and returns null when there are no units', () => {
    expect(costPerWeanedPiglet(27500, 11)).toBe(2500)
    expect(costPerWeanedPiglet(27500, 0)).toBeNull()
    expect(costPerKgSold(11765.5, 990)).toBeCloseTo(11.884, 3)
    expect(costPerKgSold(100, 0)).toBeNull()
  })

  it('break-even is the price that recovers total cost per kg or per head', () => {
    expect(breakEvenPerKg(148500, 990)).toBe(150) // 11 head x 90 kg sold for 148,500 total cost
    expect(breakEvenPerHead(148500, 11)).toBe(13500)
    expect(breakEvenPerKg(1, 0)).toBeNull()
    expect(breakEvenPerHead(1, 0)).toBeNull()
  })

  it('ROI is net income over capital spent, null without capital', () => {
    expect(roi(125650, 250000)).toBeCloseTo(0.5026, 4)
    expect(roi(125650, 0)).toBeNull()
  })
})

let n = 0
const tx = (date: string, kind: Transaction['kind'], amount: number): Transaction => ({
  id: `t${++n}`, updatedAt: 'x', deletedAt: null, date, kind, category: 'x', amount, links: {},
})

describe('paybackDate', () => {
  it('is the day cumulative operating income first covers cumulative capital and stays covered', () => {
    const txs = [
      tx('2026-01-05', 'capital', 100000),
      tx('2026-02-01', 'expense', 20000), // cum op -20000
      tx('2026-03-10', 'revenue', 90000), // cum op 70000
      tx('2026-04-10', 'revenue', 40000), // cum op 110000 >= 100000: paid back
      tx('2026-05-01', 'capital', 30000), // cum capital 130000: not covered again
      tx('2026-06-15', 'revenue', 25000), // cum op 135000 >= 130000: paid back again on 06-15
    ]
    expect(paybackDate(txs)).toBe('2026-06-15')
    expect(paybackDate(txs.slice(0, 4))).toBe('2026-04-10')
    expect(paybackDate(txs.slice(0, 5))).toBeNull()
    expect(paybackDate([tx('2026-02-01', 'revenue', 5)])).toBeNull() // no capital: nothing to pay back
  })
})
