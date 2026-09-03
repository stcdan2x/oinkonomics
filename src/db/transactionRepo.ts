import { isValid, parseISO } from 'date-fns'
import { categoriesFor } from '../knowledge/categories'
import type { ISODate, Transaction, TransactionKind } from '../types'
import { db } from './db'
import { create, softDelete, update, type NewRow } from './repo'

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

// TASK 003 Phase 1 (§7 D3): a typed entry is edited in place. Entries a sale
// or a stock purchase wrote are corrected at their source, so the money and
// the record it came from stay in step.
export async function updateTransaction(id: string, patch: Partial<Omit<TransactionInput, 'links'>>): Promise<Transaction> {
  const existing = await db.transactions.get(id)
  if (!existing || existing.deletedAt) throw new Error('Entry not found')
  if (existing.links.saleId) throw new Error('This entry came from a sale: undo the sale to change it')
  if (existing.links.itemId) throw new Error('This entry came from a stock purchase: delete the purchase on the item to change it')
  const merged = { ...existing, ...patch }
  validateTransaction(merged)
  return update(db.transactions, id, { ...patch, note: merged.note?.trim() || undefined })
}

export async function removeTransaction(id: string): Promise<void> {
  await softDelete(db.transactions, id)
}
