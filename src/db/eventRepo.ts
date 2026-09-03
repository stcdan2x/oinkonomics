import type { EventType, FarmEvent, ISODate, SubjectType } from '../types'
import { db } from './db'
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

export interface TreatmentInput {
  subjectType: SubjectType
  subjectId: string
  type: 'treatment' | 'vaccination' | 'deworming' | 'ironShot'
  date: ISODate
  product: string
  withdrawalDays: number | null
  dose?: string
  note?: string
}

// Health events carry the withdrawal days at the time of dosing, so a later
// table change never rewrites a past record.
export async function recordTreatment(input: TreatmentInput): Promise<FarmEvent> {
  const product = checkTreatment(input.product, input.withdrawalDays)
  return addEvent({
    subjectType: input.subjectType,
    subjectId: input.subjectId,
    type: input.type,
    date: input.date,
    data: { product, withdrawalDays: input.withdrawalDays, dose: input.dose ?? null, note: input.note ?? null },
  })
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

export async function updateEvent(id: string, patch: { date?: ISODate; data?: Record<string, unknown> }): Promise<FarmEvent> {
  const e = await db.events.get(id)
  if (!e || e.deletedAt) throw new Error('Entry not found')
  if (!EDITABLE_TYPES.includes(e.type)) throw new Error('This entry cannot be edited: undo it and enter it again')
  const data = { ...e.data, ...(patch.data ?? {}) }
  if (e.type === 'weight') {
    if (!(Number(data.avgKg) > 0)) throw new Error('Average weight must be above 0 kg')
  } else {
    data.product = checkTreatment(data.product, data.withdrawalDays)
  }
  return update(db.events, id, { date: patch.date ?? e.date, data })
}

// Undo tombstones the event and reverses its effect in the same transaction: a
// batch head-count event puts the delta back, an animal death or cull makes the
// animal active again. Sale events belong to the sale (undoSale) and litter
// events to the litter (litterRepo), so they are refused here.
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
  await softDelete(db.events, id)
}
