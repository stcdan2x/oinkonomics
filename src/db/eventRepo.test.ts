import 'fake-indexeddb/auto'
import { beforeEach, describe, expect, it } from 'vitest'
import { earliestSaleDate } from '../engine/withdrawal'
import { addAnimal, setAnimalStatus } from './animalRepo'
import { changeHeadCount, createBatch, recordBatchWeight } from './batchRepo'
import { db } from './db'
import { addEvent, eventsFor, recordTreatment, undoEvent, updateEvent } from './eventRepo'

describe('event repository', () => {
  beforeEach(async () => {
    await db.events.clear()
  })

  it('lists a subject\'s events newest first and ignores other subjects', async () => {
    await addEvent({ subjectType: 'batch', subjectId: 'B1', type: 'weight', date: '2026-06-01', data: { avgKg: 20 } })
    await addEvent({ subjectType: 'batch', subjectId: 'B1', type: 'weight', date: '2026-06-15', data: { avgKg: 27 } })
    await addEvent({ subjectType: 'batch', subjectId: 'B2', type: 'weight', date: '2026-06-20', data: { avgKg: 30 } })
    await addEvent({ subjectType: 'animal', subjectId: 'B1', type: 'note', date: '2026-06-30', data: {} })
    expect((await eventsFor('batch', 'B1')).map((e) => e.date)).toEqual(['2026-06-15', '2026-06-01'])
  })

  it('records a treatment with the withdrawal days frozen on the event', async () => {
    const e = await recordTreatment({ subjectType: 'batch', subjectId: 'B1', type: 'treatment', date: '2026-06-01', product: 'Ivermec', withdrawalDays: 28, dose: '1 mL per 33 kg' })
    expect(e.data).toMatchObject({ product: 'Ivermec', withdrawalDays: 28 })
    expect(earliestSaleDate(await eventsFor('batch', 'B1'))).toBe('2026-06-29')
    await expect(recordTreatment({ subjectType: 'batch', subjectId: 'B1', type: 'treatment', date: '2026-06-01', product: ' ', withdrawalDays: 1 })).rejects.toThrow(/product/i)
    await expect(recordTreatment({ subjectType: 'batch', subjectId: 'B1', type: 'treatment', date: '2026-06-01', product: 'x', withdrawalDays: -1 })).rejects.toThrow(/withdrawal/i)
  })
})

// TASK 003 Phase 1, step 1.1: corrections. An edit changes fields only; an undo
// tombstones the event and reverses what it did to the batch or the animal.
describe('event corrections', () => {
  beforeEach(async () => {
    await Promise.all([db.events.clear(), db.batches.clear(), db.animals.clear()])
  })

  it('edits a weighing or a health event in place and refuses other types', async () => {
    const b = await createBatch({ name: 'W', kind: 'growers', litterIds: [], headCount: 10, startDate: '2026-05-01', strategy: 'undecided' })
    const w = await recordBatchWeight(b.id, { date: '2026-06-01', avgKg: 20 })
    const edited = await updateEvent(w.id, { date: '2026-06-02', data: { avgKg: 22 } })
    expect(edited.date).toBe('2026-06-02')
    expect(edited.data.avgKg).toBe(22)
    expect(edited.updatedAt > w.updatedAt).toBe(true)
    await expect(updateEvent(w.id, { data: { avgKg: 0 } })).rejects.toThrow(/weight/i)
    const t = await recordTreatment({ subjectType: 'batch', subjectId: b.id, type: 'treatment', date: '2026-06-01', product: 'Ivermec', withdrawalDays: 28 })
    expect((await updateEvent(t.id, { data: { product: 'Ivermec 1%', withdrawalDays: 21 } })).data).toMatchObject({ product: 'Ivermec 1%', withdrawalDays: 21 })
    await expect(updateEvent(t.id, { data: { product: ' ' } })).rejects.toThrow(/product/i)
    const d = await changeHeadCount(b.id, -1, 'death', '2026-06-03')
    const death = (await eventsFor('batch', b.id)).find((e) => e.type === 'death')!
    expect(d.headCount).toBe(9)
    await expect(updateEvent(death.id, { date: '2026-06-04' })).rejects.toThrow(/undo/i)
  })

  it('undoes a batch death and restores the head count in the same step', async () => {
    const b = await createBatch({ name: 'D', kind: 'growers', litterIds: [], headCount: 10, startDate: '2026-05-01', strategy: 'undecided' })
    await changeHeadCount(b.id, -2, 'death', '2026-06-03')
    const death = (await eventsFor('batch', b.id)).find((e) => e.type === 'death')!
    await undoEvent(death.id)
    expect((await db.batches.get(b.id))!.headCount).toBe(10)
    expect((await db.events.get(death.id))!.deletedAt).toBeTruthy()
    expect(await eventsFor('batch', b.id)).toEqual([])
    await expect(undoEvent(death.id)).rejects.toThrow(/already/i)
  })

  it('undoes an animal cull and reactivates the animal', async () => {
    const a = await addAnimal({ tag: 'S-01', role: 'sow', sex: 'female', source: 'bought' })
    await setAnimalStatus(a.id, 'culled', '2026-06-03', 'lame')
    const cull = (await eventsFor('animal', a.id)).find((e) => e.type === 'cull')!
    await undoEvent(cull.id)
    const back = (await db.animals.get(a.id))!
    expect(back.status).toBe('active')
    expect(back.statusDate).toBeUndefined()
    expect(await eventsFor('animal', a.id)).toEqual([])
  })

  it('refuses to undo a sale event or a litter event from here', async () => {
    const b = await createBatch({ name: 'S', kind: 'finishers', litterIds: [], headCount: 10, startDate: '2026-05-01', strategy: 'growToMarket' })
    await changeHeadCount(b.id, -3, 'sale', '2026-06-03')
    const sale = (await eventsFor('batch', b.id)).find((e) => e.type === 'sale')!
    await expect(undoEvent(sale.id)).rejects.toThrow(/sale/i)
    const f = await addEvent({ subjectType: 'litter', subjectId: 'L1', type: 'farrowing', date: '2026-06-01', data: { bornAlive: 10 } })
    await expect(undoEvent(f.id)).rejects.toThrow(/litter/i)
    expect((await db.batches.get(b.id))!.headCount).toBe(7)
  })
})
