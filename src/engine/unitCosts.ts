import type { ISODate, Transaction } from '../types'

const perUnit = (total: number, units: number): number | null => (units > 0 ? total / units : null)

// Breeding-herd cost in a period over the piglets weaned in it.
export const costPerWeanedPiglet = (breedingCost: number, weaned: number) => perUnit(breedingCost, weaned)
export const costPerKgSold = (totalCost: number, kgSold: number) => perUnit(totalCost, kgSold)
// Break-even: the sale price that recovers the whole batch cost.
export const breakEvenPerKg = (totalCost: number, kg: number) => perUnit(totalCost, kg)
export const breakEvenPerHead = (totalCost: number, head: number) => perUnit(totalCost, head)

export const roi = (netIncome: number, capitalSpent: number): number | null => (capitalSpent > 0 ? netIncome / capitalSpent : null)

// Walks the ledger in date order; the last day on which cumulative operating
// income (revenue - expenses) caught up with cumulative capital spend, if it
// is still caught up at the end. Loans and drawings do not count.
export function paybackDate(txs: Transaction[]): ISODate | null {
  const rows = txs.filter((t) => !t.deletedAt).sort((a, b) => a.date.localeCompare(b.date))
  let capital = 0
  let operating = 0
  let covered = false
  let date: ISODate | null = null
  for (const t of rows) {
    if (t.kind === 'capital') capital += t.amount
    else if (t.kind === 'revenue') operating += t.amount
    else if (t.kind === 'expense') operating -= t.amount
    const nowCovered = capital > 0 && operating >= capital
    if (nowCovered && !covered) date = t.date
    covered = nowCovered
  }
  return covered ? date : null
}
