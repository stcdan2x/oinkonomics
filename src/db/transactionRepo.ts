import { isValid, parseISO } from 'date-fns'
import { categoriesFor } from '../knowledge/categories'
import type { ISODate, Transaction, TransactionKind } from '../types'
import { db } from './db'
import { create, softDelete, type NewRow } from './repo'

export type TransactionInput = NewRow<Transaction>

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

export function validateTransaction(input: TransactionInput): void {
  if (!ISO_DATE.test(input.date) || !isValid(parseISO(input.date))) throw new Error('Date must be a valid YYYY-MM-DD date')
  if (!Number.isFinite(input.amount) || input.amount <= 0) throw new Error('Amount must be more than 0')
  if (!categoriesFor(input.kind).some((c) => c.id === input.category)) {
    throw new Error(`Category "${input.category}" is not valid for a ${input.kind} transaction`)
  }
}

export async function addTransaction(input: TransactionInput): Promise<Transaction> {
  validateTransaction(input)
  return create(db.transactions, { ...input, note: input.note?.trim() || undefined })
}

export interface TransactionFilter {
  from?: ISODate
  to?: ISODate
  kind?: TransactionKind
}

// Newest first; `from` and `to` are inclusive calendar days.
export async function listTransactions(filter: TransactionFilter): Promise<Transaction[]> {
  let rows: Transaction[]
  if (filter.from && filter.to) rows = await db.transactions.where('date').between(filter.from, filter.to, true, true).toArray()
  else if (filter.from) rows = await db.transactions.where('date').aboveOrEqual(filter.from).toArray()
  else if (filter.to) rows = await db.transactions.where('date').belowOrEqual(filter.to).toArray()
  else rows = await db.transactions.toArray()
  return rows
    .filter((t) => !t.deletedAt && (!filter.kind || t.kind === filter.kind))
    .sort((a, b) => b.date.localeCompare(a.date) || b.updatedAt.localeCompare(a.updatedAt))
}

export async function removeTransaction(id: string): Promise<void> {
  await softDelete(db.transactions, id)
}
