import { daysBetween } from '../engine/dates'
import { adg, type Weighing } from '../engine/growth'
import type { Batch, ISODate, StrategyId } from '../types'
import { db } from './db'
import { addEvent, eventsFor } from './eventRepo'
import { create, liveAll, update, type NewRow } from './repo'

export async function createBatch(data: NewRow<Batch>): Promise<Batch> {
  const name = data.name.trim()
  if (!name) throw new Error('A batch name is required')
  if (!Number.isInteger(data.headCount) || data.headCount <= 0) throw new Error('Head count must be 1 or more')
  return create(db.batches, { ...data, name })
}

export async function listBatches(opts: { includeEmpty?: boolean } = {}): Promise<Batch[]> {
  const rows = await liveAll(db.batches)
  return rows
    .filter((b) => (opts.includeEmpty ? true : b.headCount > 0))
    .sort((a, b) => b.startDate.localeCompare(a.startDate) || a.name.localeCompare(b.name))
}

// Litters become batches at weaning (PLAN.md F4): the weaned count is the head
// count and the wean date is the start date.
export async function createBatchFromLitter(
  litterId: string,
  opts: { strategy: StrategyId; name?: string; penId?: string },
): Promise<Batch> {
  const litter = await db.litters.get(litterId)
  if (!litter || litter.deletedAt) throw new Error('Litter not found')
  if (!litter.weanDate) throw new Error('Record the weaning first; the batch takes its head count from it')
  const existing = (await liveAll(db.batches)).find((b) => b.litterIds.includes(litterId))
  if (existing) throw new Error(`This litter is already in batch ${existing.name}`)
  const sow = await db.animals.get(litter.sowId)
  return createBatch({
    name: opts.name?.trim() || `${sow?.tag ?? 'Litter'} weaned ${litter.weanDate}`,
    kind: 'piglets',
    litterIds: [litterId],
    headCount: litter.weanedCount,
    startDate: litter.weanDate,
    penId: opts.penId,
    strategy: opts.strategy,
  })
}

export async function recordBatchWeight(
  batchId: string,
  input: { date: ISODate; avgKg: number; sampleSize?: number; note?: string },
) {
  if (!(input.avgKg > 0)) throw new Error('Average weight must be above 0 kg')
  return addEvent({
    subjectType: 'batch',
    subjectId: batchId,
    type: 'weight',
    date: input.date,
    data: { avgKg: input.avgKg, sampleSize: input.sampleSize ?? null, note: input.note ?? null },
  })
}

export async function weightsForBatch(batchId: string): Promise<Weighing[]> {
  const events = await eventsFor('batch', batchId)
  return events
    .filter((e) => e.type === 'weight')
    .map((e) => ({ date: e.date, kg: Number(e.data.avgKg) }))
    .sort((a, b) => a.date.localeCompare(b.date))
}

export interface BatchSummary {
  adg: number | null
  lastWeight: Weighing | null
  weighings: number
  daysOnFarm: number
}

export async function batchSummary(batch: Batch, today: ISODate): Promise<BatchSummary> {
  const ws = await weightsForBatch(batch.id)
  return {
    adg: adg(ws),
    lastWeight: ws.length ? ws[ws.length - 1] : null,
    weighings: ws.length,
    daysOnFarm: daysBetween(batch.startDate, today),
  }
}

export type HeadCountReason = 'death' | 'cull' | 'transfer' | 'sale'

export async function changeHeadCount(
  batchId: string,
  delta: number,
  reason: HeadCountReason,
  date: ISODate,
  note?: string,
): Promise<Batch> {
  const batch = await db.batches.get(batchId)
  if (!batch || batch.deletedAt) throw new Error('Batch not found')
  if (!Number.isInteger(delta) || delta === 0) throw new Error('Change must be a whole number other than 0')
  const headCount = batch.headCount + delta
  if (headCount < 0) throw new Error(`Head count cannot go below 0 (batch has ${batch.headCount})`)
  const updated = await update(db.batches, batchId, { headCount })
  await addEvent({ subjectType: 'batch', subjectId: batchId, type: reason, date, data: { delta, headCountAfter: headCount, note: note ?? null } })
  return updated
}
