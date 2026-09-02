import 'fake-indexeddb/auto'
import { beforeEach, describe, expect, it } from 'vitest'
import { earliestSaleDate } from '../engine/withdrawal'
import { db } from './db'
import { addEvent, eventsFor, recordTreatment } from './eventRepo'

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
