import type { FarmEvent, ISODate, SubjectType } from '../types'
import { db } from './db'
import { create, type NewRow } from './repo'

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
  if (!input.product.trim()) throw new Error('Name the product')
  if (input.withdrawalDays !== null && !(Number.isInteger(input.withdrawalDays) && input.withdrawalDays >= 0))
    throw new Error('Withdrawal days must be a whole number of 0 or more')
  return addEvent({
    subjectType: input.subjectType,
    subjectId: input.subjectId,
    type: input.type,
    date: input.date,
    data: { product: input.product.trim(), withdrawalDays: input.withdrawalDays, dose: input.dose ?? null, note: input.note ?? null },
  })
}
