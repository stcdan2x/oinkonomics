import { endOfMonth, endOfQuarter, endOfYear, parseISO, startOfMonth, startOfQuarter, startOfYear, subMonths } from 'date-fns'
import type { ISODate, Transaction } from '../types'
import { toISODate } from './dates'

export interface Period {
  from: ISODate
  to: ISODate
}

export const ALL_TIME: Period = { from: '0001-01-01', to: '9999-12-31' }

export function periodPresets(today: ISODate) {
  const d = parseISO(today)
  const last = subMonths(d, 1)
  return {
    thisMonth: { from: toISODate(startOfMonth(d)), to: toISODate(endOfMonth(d)) },
    lastMonth: { from: toISODate(startOfMonth(last)), to: toISODate(endOfMonth(last)) },
    thisQuarter: { from: toISODate(startOfQuarter(d)), to: toISODate(endOfQuarter(d)) },
    thisYear: { from: toISODate(startOfYear(d)), to: toISODate(endOfYear(d)) },
    all: ALL_TIME,
  } satisfies Record<string, Period>
}

export interface CategoryTotal {
  category: string
  amount: number
}

export interface IncomeStatement {
  revenue: CategoryTotal[]
  expenses: CategoryTotal[]
  totalRevenue: number
  totalExpenses: number
  netIncome: number
}

export interface CashFlow {
  operatingIn: number
  operatingOut: number
  capitalOut: number
  loansIn: number
  loanPaymentsOut: number
  drawingsOut: number
  ownerCapitalIn: number
  netCash: number
  openingBalance: number
  closingBalance: number
}

const live = (txs: Transaction[]) => txs.filter((t) => !t.deletedAt)
const inPeriod = (txs: Transaction[], from: ISODate, to: ISODate) => live(txs).filter((t) => t.date >= from && t.date <= to)
const sum = (txs: Transaction[]) => txs.reduce((s, t) => s + t.amount, 0)

// Largest first, so the report reads top-down; ties keep category order.
export function byCategory(txs: Transaction[]): CategoryTotal[] {
  const map = new Map<string, number>()
  for (const t of txs) map.set(t.category, (map.get(t.category) ?? 0) + t.amount)
  return [...map].map(([category, amount]) => ({ category, amount })).sort((a, b) => b.amount - a.amount || a.category.localeCompare(b.category))
}

// Operating result only: capital purchases, drawings, loans and the owner's
// capital in never touch it.
export function incomeStatement(txs: Transaction[], from: ISODate, to: ISODate): IncomeStatement {
  const rows = inPeriod(txs, from, to)
  const revenue = byCategory(rows.filter((t) => t.kind === 'revenue'))
  const expenses = byCategory(rows.filter((t) => t.kind === 'expense'))
  const totalRevenue = sum(rows.filter((t) => t.kind === 'revenue'))
  const totalExpenses = sum(rows.filter((t) => t.kind === 'expense'))
  return { revenue, expenses, totalRevenue, totalExpenses, netIncome: totalRevenue - totalExpenses }
}

const INFLOW: Record<Transaction['kind'], 1 | -1> = { revenue: 1, loan: 1, ownerCapital: 1, expense: -1, capital: -1, drawing: -1, loanPayment: -1 }
const signed = (txs: Transaction[]) => txs.reduce((s, t) => s + INFLOW[t.kind] * t.amount, 0)

export function cashFlow(txs: Transaction[], from: ISODate, to: ISODate): CashFlow {
  const rows = inPeriod(txs, from, to)
  const of = (kind: Transaction['kind']) => sum(rows.filter((t) => t.kind === kind))
  const netCash = signed(rows)
  const openingBalance = signed(live(txs).filter((t) => t.date < from))
  return {
    operatingIn: of('revenue'),
    operatingOut: of('expense'),
    capitalOut: of('capital'),
    loansIn: of('loan'),
    loanPaymentsOut: of('loanPayment'),
    drawingsOut: of('drawing'),
    ownerCapitalIn: of('ownerCapital'),
    netCash,
    openingBalance,
    closingBalance: openingBalance + netCash,
  }
}
