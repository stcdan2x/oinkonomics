import { isValid, parseISO } from 'date-fns'
import { ITEM_EXPENSE_CATEGORY } from '../knowledge/categories'
import type { InventoryItem, ISODate, StockMove, StockMoveReason, Transaction } from '../types'
import { db } from './db'
import { liveAll, liveWhere, newId, now, update, type NewRow } from './repo'

export type ItemInput = Omit<NewRow<InventoryItem>, 'qtyOnHand'>

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/
const isDate = (d: string) => ISO_DATE.test(d) && isValid(parseISO(d))

function validateItem(input: Partial<ItemInput>): void {
  if (input.name !== undefined && !input.name.trim()) throw new Error('An item name is required')
  if (input.unit !== undefined && !input.unit.trim()) throw new Error('A unit is required (bag, kg, vial, ...)')
  if (input.reorderLevel !== undefined && !(Number.isFinite(input.reorderLevel) && input.reorderLevel >= 0)) throw new Error('Reorder level must be 0 or more')
  if (input.unitCost !== undefined && !(Number.isFinite(input.unitCost) && input.unitCost >= 0)) throw new Error('Unit cost must be 0 or more')
  if (input.kgPerUnit !== undefined && !(Number.isFinite(input.kgPerUnit) && input.kgPerUnit > 0)) throw new Error('Kg per unit must be above 0')
  if (input.expiryDate !== undefined && !isDate(input.expiryDate)) throw new Error('Expiry must be a valid YYYY-MM-DD date')
}

// Items start empty; opening stock is recorded as an adjustment move so the
// quantity on hand is always explained by the move history.
export async function createItem(input: ItemInput): Promise<InventoryItem> {
  validateItem(input)
  const row: InventoryItem = { ...input, name: input.name.trim(), unit: input.unit.trim(), qtyOnHand: 0, id: newId(), updatedAt: now(), deletedAt: null }
  await db.inventoryItems.add(row)
  return row
}

export async function updateItem(id: string, patch: Partial<ItemInput>): Promise<InventoryItem> {
  validateItem(patch)
  return update(db.inventoryItems, id, patch)
}

export async function listItems(): Promise<InventoryItem[]> {
  const rows = await liveAll(db.inventoryItems)
  return rows.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name))
}

export async function movesForItem(itemId: string): Promise<StockMove[]> {
  const rows = await liveWhere(db.stockMoves, 'itemId', itemId)
  return rows.sort((a, b) => b.date.localeCompare(a.date) || b.updatedAt.localeCompare(a.updatedAt))
}

export interface StockMoveInput {
  itemId: string
  date: ISODate
  qtyDelta: number
  reason: StockMoveReason
  batchId?: string
  animalId?: string
  transactionId?: string
}

const SIGN: Record<StockMoveReason, 'in' | 'out' | 'any'> = { purchase: 'in', consumption: 'out', loss: 'out', adjustment: 'any' }

function validateMove(input: StockMoveInput): void {
  if (!isDate(input.date)) throw new Error('Date must be a valid YYYY-MM-DD date')
  if (!Number.isFinite(input.qtyDelta) || input.qtyDelta === 0) throw new Error('Quantity must be a number other than 0')
  if (SIGN[input.reason] === 'in' && input.qtyDelta < 0) throw new Error('A purchase adds stock: the quantity must be positive')
  if (SIGN[input.reason] === 'out' && input.qtyDelta > 0) throw new Error(`A ${input.reason} removes stock: the quantity must be negative`)
}

const sumLive = (moves: StockMove[]) => moves.filter((m) => !m.deletedAt).reduce((s, m) => s + m.qtyDelta, 0)

// The move and the item's new quantity are written together, so qtyOnHand is
// always the sum of the live moves. The move keeps the item's unit cost at
// that moment; costing values consumption with it.
export async function recordStockMove(input: StockMoveInput): Promise<StockMove> {
  validateMove(input)
  return db.transaction('rw', db.inventoryItems, db.stockMoves, async () => {
    const item = await db.inventoryItems.get(input.itemId)
    if (!item || item.deletedAt) throw new Error('Item not found')
    const qtyOnHand = item.qtyOnHand + input.qtyDelta
    if (qtyOnHand < 0) throw new Error(`Only ${item.qtyOnHand} ${item.unit} of ${item.name} on hand`)
    const ts = now()
    const move: StockMove = { ...input, unitCost: item.unitCost, id: newId(), updatedAt: ts, deletedAt: null }
    await db.stockMoves.add(move)
    await db.inventoryItems.put({ ...item, qtyOnHand, updatedAt: ts })
    return move
  })
}

// Tombstones the move and recounts the item from its remaining live moves; a
// purchase's transaction is tombstoned with it so the ledger and the stock agree.
export async function removeStockMove(id: string): Promise<void> {
  await db.transaction('rw', db.inventoryItems, db.stockMoves, db.transactions, async () => {
    const move = await db.stockMoves.get(id)
    if (!move || move.deletedAt) throw new Error('Stock move not found')
    const item = await db.inventoryItems.get(move.itemId)
    if (!item) throw new Error('Item not found')
    const others = (await db.stockMoves.where('itemId').equals(move.itemId).toArray()).filter((m) => m.id !== id)
    const qtyOnHand = sumLive(others)
    if (qtyOnHand < 0) throw new Error(`Removing this move would take ${item.name} below zero (${qtyOnHand} ${item.unit})`)
    const ts = now()
    await db.stockMoves.put({ ...move, updatedAt: ts, deletedAt: ts })
    await db.inventoryItems.put({ ...item, qtyOnHand, updatedAt: ts })
    if (move.transactionId) {
      const tx = await db.transactions.get(move.transactionId)
      if (tx && !tx.deletedAt) await db.transactions.put({ ...tx, updatedAt: ts, deletedAt: ts })
    }
  })
}

export interface PurchaseInput {
  itemId: string
  date: ISODate
  qty: number
  totalCost: number
  note?: string
  batchId?: string
}

// One purchase = one expense transaction (linked by itemId) plus one purchase
// move (linked by transactionId), written together. The item's unit cost
// becomes the moving weighted average of what is on hand and what was bought.
export async function purchaseStock(input: PurchaseInput): Promise<{ transaction: Transaction; move: StockMove }> {
  if (!isDate(input.date)) throw new Error('Date must be a valid YYYY-MM-DD date')
  if (!(Number.isFinite(input.qty) && input.qty > 0)) throw new Error('Quantity must be above 0')
  if (!(Number.isFinite(input.totalCost) && input.totalCost > 0)) throw new Error('Total cost must be above 0')
  return db.transaction('rw', db.inventoryItems, db.stockMoves, db.transactions, async () => {
    const item = await db.inventoryItems.get(input.itemId)
    if (!item || item.deletedAt) throw new Error('Item not found')
    const ts = now()
    const unitCost = input.totalCost / input.qty
    const transaction: Transaction = {
      id: newId(),
      updatedAt: ts,
      deletedAt: null,
      date: input.date,
      kind: 'expense',
      category: ITEM_EXPENSE_CATEGORY[item.category],
      amount: input.totalCost,
      note: input.note?.trim() || `${input.qty} ${item.unit} ${item.name}`,
      links: { itemId: item.id },
    }
    const move: StockMove = {
      id: newId(),
      updatedAt: ts,
      deletedAt: null,
      itemId: item.id,
      date: input.date,
      qtyDelta: input.qty,
      reason: 'purchase',
      transactionId: transaction.id,
      unitCost,
    }
    const qtyOnHand = item.qtyOnHand + input.qty
    const averageCost = (Math.max(item.qtyOnHand, 0) * item.unitCost + input.totalCost) / qtyOnHand
    await db.transactions.add(transaction)
    await db.stockMoves.add(move)
    await db.inventoryItems.put({ ...item, qtyOnHand, unitCost: averageCost, updatedAt: ts })
    return { transaction, move }
  })
}

export async function movesForBatch(batchId: string): Promise<StockMove[]> {
  const rows = await liveWhere(db.stockMoves, 'batchId', batchId)
  return rows.sort((a, b) => b.date.localeCompare(a.date) || b.updatedAt.localeCompare(a.updatedAt))
}
