import type { EventType, FarmEvent, ISODate, SubjectType } from '../types'
import { db } from './db'
import { recordStockMove, removeStockMove, type StockMoveInput } from './inventoryRepo'
import { create, softDelete, update, type NewRow } from './repo'

export async function addEvent(data: NewRow<FarmEvent>): Promise<FarmEvent> {
  return create(db.events, data)
}

// Events of one subject, newest first (same-day events keep insertion order reversed).
export async function eventsFor(subjectType: SubjectType, subjectId: string): Promise<FarmEvent[]> {
  const rows = await db.events.where('[subjectType+subjectId]').equals([subjectType, subjectId]).toArray()
  return rows
    .filter((e) => !e.deletedAt)
    .sort((a, b) => b.date.localeCompare(a.date) || b.updatedAt.localeCompare(a.updatedAt))
}

// TASK 003 Phase 3: the product drawn from stock, in the item's unit.
export interface StockDraw {
  itemId: string
  qty: number
}

export interface TreatmentInput {
  subjectType: SubjectType
  subjectId: string
  type: 'treatment' | 'vaccination' | 'deworming' | 'ironShot'
  date: ISODate
  product: string
  withdrawalDays: number | null
  dose?: string
  note?: string
  stock?: StockDraw
}

// Health events carry the withdrawal days at the time of dosing, so a later
// table change never rewrites a past record. A draw from stock writes the
// consumption move with the event, valued at the item's unit cost at that
// moment, and keeps the move's id in the event data.
export async function recordTreatment(input: TreatmentInput): Promise<FarmEvent> {
  const product = checkTreatment(input.product, input.withdrawalDays)
  const event = {
    subjectType: input.subjectType,
    subjectId: input.subjectId,
    type: input.type,
    date: input.date,
    data: { product, withdrawalDays: input.withdrawalDays, dose: input.dose ?? null, note: input.note ?? null } as Record<string, unknown>,
  }
  if (!input.stock) return addEvent(event)
  const draw = checkDraw(input.stock)
  return db.transaction('rw', db.events, db.inventoryItems, db.stockMoves, async () => {
    const move = await drawStock(draw, input.subjectType, input.subjectId, input.date)
    return addEvent({ ...event, data: { ...event.data, stockMoveId: move.id } })
  })
}

function checkDraw(stock: StockDraw): StockDraw {
  if (!(Number.isFinite(stock.qty) && stock.qty > 0)) throw new Error('Quantity used must be above 0')
  return stock
}

// The consumption move names what it was for: the batch, or the animal (§7 D5,
// so a breeder's medicine reaches costing as a herd direct cost).
function drawStock(stock: StockDraw, subjectType: SubjectType, subjectId: string, date: ISODate) {
  const input: StockMoveInput = { itemId: stock.itemId, date, qtyDelta: -stock.qty, reason: 'consumption' }
  if (subjectType === 'batch') input.batchId = subjectId
  if (subjectType === 'animal') input.animalId = subjectId
  return recordStockMove(input)
}

// The move an event drew from stock, if it is still live (a gone move, say one
// removed on another device before the event synced, counts as none).
async function liveMoveOf(e: FarmEvent) {
  const id = typeof e.data.stockMoveId === 'string' ? e.data.stockMoveId : null
  const move = id ? await db.stockMoves.get(id) : undefined
  return move && !move.deletedAt ? move : null
}

function checkTreatment(product: unknown, withdrawalDays: unknown): string {
  const name = typeof product === 'string' ? product.trim() : ''
  if (!name) throw new Error('Name the product')
  if (withdrawalDays !== null && !(Number.isInteger(withdrawalDays) && (withdrawalDays as number) >= 0))
    throw new Error('Withdrawal days must be a whole number of 0 or more')
  return name
}

// Tombstone every live event of a subject (used inside the transaction that
// deletes or reverses the subject itself).
export async function tombstoneEventsFor(subjectType: SubjectType, subjectId: string): Promise<void> {
  const rows = await db.events.where('[subjectType+subjectId]').equals([subjectType, subjectId]).toArray()
  for (const e of rows) if (!e.deletedAt) await softDelete(db.events, e.id)
}

// TASK 003 Phase 1: corrections. Only a weighing or a health event is edited in
// place, because changing its fields moves nothing else. Everything that changed
// a head count, a status or a litter is undone instead (§7 D1).
const HEALTH_TYPES: EventType[] = ['treatment', 'vaccination', 'deworming', 'ironShot']
const EDITABLE_TYPES: EventType[] = ['weight', ...HEALTH_TYPES]
const LITTER_TYPES: EventType[] = ['service', 'farrowing', 'weaning']

// `stock` on a health event: a draw replaces the linked move at the unit cost of
// that moment (unchanged item and quantity keep the move and its cost), null
// removes it and puts the stock back; a new date re-dates a kept move.
export async function updateEvent(id: string, patch: { date?: ISODate; data?: Record<string, unknown>; stock?: StockDraw | null }): Promise<FarmEvent> {
  const e = await db.events.get(id)
  if (!e || e.deletedAt) throw new Error('Entry not found')
  if (!EDITABLE_TYPES.includes(e.type)) throw new Error('This entry cannot be edited: undo it and enter it again')
  const data = { ...e.data, ...(patch.data ?? {}) }
  if (e.type === 'weight') {
    if (!(Number(data.avgKg) > 0)) throw new Error('Average weight must be above 0 kg')
  } else {
    data.product = checkTreatment(data.product, data.withdrawalDays)
  }
  const date = patch.date ?? e.date
  if (patch.stock) checkDraw(patch.stock)
  return db.transaction('rw', db.events, db.inventoryItems, db.stockMoves, db.transactions, async () => {
    const move = await liveMoveOf(e)
    const same = !!move && !!patch.stock && move.itemId === patch.stock.itemId && -move.qtyDelta === patch.stock.qty
    if (patch.stock !== undefined && !same) {
      if (move) await removeStockMove(move.id, e.id)
      data.stockMoveId = patch.stock ? (await drawStock(patch.stock, e.subjectType, e.subjectId, date)).id : null
    } else if (move && date !== move.date) {
      await update(db.stockMoves, move.id, { date })
    }
    return update(db.events, id, { date, data })
  })
}

// Undo tombstones the event and reverses its effect in the same transaction: a
// batch head-count event puts the delta back, an animal death or cull makes the
// animal active again, a health event that drew from stock puts the stock back.
// Sale events belong to the sale (undoSale) and litter events to the litter
// (litterRepo), so they are refused here.
export async function undoEvent(id: string): Promise<void> {
  const e = await db.events.get(id)
  if (!e) throw new Error('Entry not found')
  if (e.deletedAt) throw new Error('This entry is already undone')
  if (e.type === 'sale') throw new Error('Undo the sale itself: that removes this entry with it')
  if (e.subjectType === 'litter' || LITTER_TYPES.includes(e.type)) throw new Error('Undo this from the litter page')
  if (e.subjectType === 'batch' && typeof e.data.delta === 'number') {
    const delta = e.data.delta
    await db.transaction('rw', db.events, db.batches, async () => {
      const batch = await db.batches.get(e.subjectId)
      if (!batch || batch.deletedAt) throw new Error('Batch not found')
      const headCount = batch.headCount - delta
      if (headCount < 0) throw new Error(`Head count cannot go below 0 (batch has ${batch.headCount})`)
      await update(db.batches, batch.id, { headCount })
      await softDelete(db.events, id)
    })
    return
  }
  if (e.subjectType === 'animal' && (e.type === 'death' || e.type === 'cull')) {
    await db.transaction('rw', db.events, db.animals, async () => {
      const animal = await db.animals.get(e.subjectId)
      if (!animal || animal.deletedAt) throw new Error('Animal not found')
      await update(db.animals, animal.id, { status: 'active', statusDate: undefined })
      await softDelete(db.events, id)
    })
    return
  }
  await db.transaction('rw', db.events, db.inventoryItems, db.stockMoves, db.transactions, async () => {
    const move = await liveMoveOf(e)
    if (move) await removeStockMove(move.id, e.id)
    await softDelete(db.events, id)
  })
}
