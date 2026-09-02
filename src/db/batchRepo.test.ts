import 'fake-indexeddb/auto'
import { beforeEach, describe, expect, it } from 'vitest'
import { addAnimal } from './animalRepo'
import { batchSummary, changeHeadCount, createBatch, createBatchFromLitter, listBatches, recordBatchWeight, weightsForBatch } from './batchRepo'
import { db } from './db'
import { recordFarrowing, recordService, recordWeaning } from './litterRepo'

describe('batch repository', () => {
  beforeEach(async () => {
    await Promise.all([db.animals.clear(), db.litters.clear(), db.events.clear(), db.batches.clear()])
  })

  it('creates a batch and lists live batches', async () => {
    const b = await createBatch({ name: 'Growers Sept', kind: 'growers', litterIds: [], headCount: 8, startDate: '2026-09-01', strategy: 'growToMarket' })
    expect(b.headCount).toBe(8)
    expect((await listBatches()).map((x) => x.id)).toEqual([b.id])
    await expect(createBatch({ name: '', kind: 'growers', litterIds: [], headCount: 8, startDate: '2026-09-01', strategy: 'undecided' })).rejects.toThrow(/name/i)
    await expect(createBatch({ name: 'x', kind: 'growers', litterIds: [], headCount: 0, startDate: '2026-09-01', strategy: 'undecided' })).rejects.toThrow(/head/i)
  })

  it('creates a batch from a weaned litter with its weaned count and wean date', async () => {
    const sow = await addAnimal({ tag: 'S-01', role: 'sow', sex: 'female', source: 'bought' })
    const l = await recordService({ sowId: sow.id, serviceDate: '2026-01-01' })
    await expect(createBatchFromLitter(l.id, { strategy: 'undecided' })).rejects.toThrow(/wean/i)
    await recordFarrowing(l.id, { farrowDate: '2026-04-27', bornAlive: 12, stillborn: 1, mummified: 0 })
    await recordWeaning(l.id, { weanDate: '2026-05-25', weanedCount: 11 })
    const b = await createBatchFromLitter(l.id, { strategy: 'sellWeaners' })
    expect(b.kind).toBe('piglets')
    expect(b.headCount).toBe(11)
    expect(b.startDate).toBe('2026-05-25')
    expect(b.litterIds).toEqual([l.id])
    expect(b.name).toContain('S-01')
    await expect(createBatchFromLitter(l.id, { strategy: 'undecided' })).rejects.toThrow(/already/i)
  })

  it('records weights as events and summarises ADG, last weight and age', async () => {
    const b = await createBatch({ name: 'W', kind: 'piglets', litterIds: [], headCount: 10, startDate: '2026-05-25', strategy: 'undecided' })
    await recordBatchWeight(b.id, { date: '2026-05-25', avgKg: 8, sampleSize: 10 })
    await recordBatchWeight(b.id, { date: '2026-06-24', avgKg: 23 })
    await expect(recordBatchWeight(b.id, { date: '2026-06-25', avgKg: 0 })).rejects.toThrow(/weight/i)
    const ws = await weightsForBatch(b.id)
    expect(ws.map((x) => x.kg)).toEqual([8, 23])
    const s = await batchSummary(b, '2026-06-24')
    expect(s.adg).toBeCloseTo(0.5, 6)
    expect(s.lastWeight).toEqual({ date: '2026-06-24', kg: 23 })
    expect(s.daysOnFarm).toBe(30)
    expect(s.weighings).toBe(2)
  })

  it('changes head count with a reason event and never below zero', async () => {
    const b = await createBatch({ name: 'W', kind: 'growers', litterIds: [], headCount: 10, startDate: '2026-05-25', strategy: 'undecided' })
    const after = await changeHeadCount(b.id, -2, 'death', '2026-06-01', 'scours')
    expect(after.headCount).toBe(8)
    await expect(changeHeadCount(b.id, -9, 'death', '2026-06-02')).rejects.toThrow(/head/i)
    const ev = await db.events.where('subjectId').equals(b.id).toArray()
    expect(ev.map((e) => e.type)).toEqual(['death'])
    expect(ev[0].data).toMatchObject({ delta: -2, note: 'scours' })
  })
})
