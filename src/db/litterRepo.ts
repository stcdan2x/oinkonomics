import { expectedFarrowDate, isOpenLitter } from '../engine/breeding'
import type { ISODate, Litter } from '../types'
import { db } from './db'
import { addEvent } from './eventRepo'
import { create, liveWhere, update } from './repo'

export interface ServiceInput {
  sowId: string
  sireId?: string
  aiNote?: string
  serviceDate: ISODate
  notes?: string
}

export async function littersForSow(sowId: string): Promise<Litter[]> {
  const rows = await liveWhere(db.litters, 'sowId', sowId)
  return rows.sort((a, b) => b.serviceDate.localeCompare(a.serviceDate))
}

export async function latestLitterForSow(sowId: string): Promise<Litter | undefined> {
  return (await littersForSow(sowId))[0]
}

export async function openLitters(): Promise<Litter[]> {
  const rows = await db.litters.filter((l) => !l.deletedAt && isOpenLitter(l)).toArray()
  return rows.sort((a, b) => a.serviceDate.localeCompare(b.serviceDate))
}

// A service opens a litter: expected farrowing is computed here, once, so the
// card and the calendar agree even if the default changes later.
export async function recordService(input: ServiceInput): Promise<Litter> {
  const sow = await db.animals.get(input.sowId)
  if (!sow || sow.deletedAt) throw new Error('Sow not found')
  if (sow.sex !== 'female') throw new Error(`${sow.tag} is not female`)
  const open = (await littersForSow(sow.id)).find(isOpenLitter)
  if (open) throw new Error(`${sow.tag} already has an open litter (served ${open.serviceDate}); close it first`)
  const litter = await create(db.litters, {
    sowId: sow.id,
    sireId: input.sireId,
    aiNote: input.aiNote,
    serviceDate: input.serviceDate,
    expectedFarrowDate: expectedFarrowDate(input.serviceDate),
    bornAlive: 0,
    stillborn: 0,
    mummified: 0,
    weanedCount: 0,
    notes: input.notes,
  })
  await addEvent({
    subjectType: 'animal',
    subjectId: sow.id,
    type: 'service',
    date: input.serviceDate,
    data: { litterId: litter.id, sireId: input.sireId ?? null, aiNote: input.aiNote ?? null },
  })
  return litter
}

export async function closeLitterWithoutFarrowing(
  litterId: string,
  outcome: 'notPregnant' | 'aborted',
  date: ISODate,
  note?: string,
): Promise<Litter> {
  const l = await update(db.litters, litterId, { outcome, notes: note })
  await addEvent({ subjectType: 'litter', subjectId: litterId, type: 'note', date, data: { outcome, note: note ?? null } })
  return l
}

const nonNegativeInt = (n: number, label: string) => {
  if (!Number.isInteger(n) || n < 0) throw new Error(`${label} must be a whole number of 0 or more`)
}

export async function recordFarrowing(
  litterId: string,
  input: { farrowDate: ISODate; bornAlive: number; stillborn: number; mummified: number; notes?: string },
): Promise<Litter> {
  nonNegativeInt(input.bornAlive, 'Born alive')
  nonNegativeInt(input.stillborn, 'Stillborn')
  nonNegativeInt(input.mummified, 'Mummified')
  const l = await update(db.litters, litterId, { ...input, outcome: 'farrowed' })
  await addEvent({
    subjectType: 'litter',
    subjectId: litterId,
    type: 'farrowing',
    date: input.farrowDate,
    data: { bornAlive: input.bornAlive, stillborn: input.stillborn, mummified: input.mummified },
  })
  return l
}

export async function recordWeaning(
  litterId: string,
  input: { weanDate: ISODate; weanedCount: number; notes?: string },
): Promise<Litter> {
  nonNegativeInt(input.weanedCount, 'Weaned count')
  const existing = await db.litters.get(litterId)
  if (!existing) throw new Error('Litter not found')
  if (!existing.farrowDate) throw new Error('Record the farrowing before the weaning')
  if (input.weanedCount > existing.bornAlive) throw new Error(`Weaned count cannot exceed born alive (${existing.bornAlive})`)
  const l = await update(db.litters, litterId, input)
  await addEvent({ subjectType: 'litter', subjectId: litterId, type: 'weaning', date: input.weanDate, data: { weanedCount: input.weanedCount } })
  return l
}
