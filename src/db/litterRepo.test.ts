import 'fake-indexeddb/auto'
import { beforeEach, describe, expect, it } from 'vitest'
import { addAnimal } from './animalRepo'
import { db } from './db'
import { closeLitterWithoutFarrowing, latestLitterForSow, littersForSow, openLitters, recordFarrowing, recordService, recordWeaning } from './litterRepo'

async function seed() {
  const sow = await addAnimal({ tag: 'S-01', role: 'sow', sex: 'female', source: 'bought' })
  const boar = await addAnimal({ tag: 'B-01', role: 'boar', sex: 'male', source: 'bought' })
  return { sow, boar }
}

describe('litter repository', () => {
  beforeEach(async () => {
    await Promise.all([db.animals.clear(), db.litters.clear(), db.events.clear()])
  })

  it('records a service with the expected farrowing date and a service event on the sow', async () => {
    const { sow, boar } = await seed()
    const l = await recordService({ sowId: sow.id, sireId: boar.id, serviceDate: '2026-01-01' })
    expect(l.expectedFarrowDate).toBe('2026-04-26')
    expect(l.bornAlive).toBe(0)
    const ev = await db.events.where('subjectId').equals(sow.id).toArray()
    expect(ev).toHaveLength(1)
    expect(ev[0].type).toBe('service')
    expect(ev[0].date).toBe('2026-01-01')
    expect(ev[0].data).toMatchObject({ litterId: l.id, sireId: boar.id })
  })

  it('refuses a service for an unknown sow, a boar, or a sow with an open litter', async () => {
    const { sow, boar } = await seed()
    await expect(recordService({ sowId: 'nope', serviceDate: '2026-01-01' })).rejects.toThrow(/sow/i)
    await expect(recordService({ sowId: boar.id, serviceDate: '2026-01-01' })).rejects.toThrow(/female/i)
    await recordService({ sowId: sow.id, serviceDate: '2026-01-01' })
    await expect(recordService({ sowId: sow.id, serviceDate: '2026-01-25' })).rejects.toThrow(/open litter/i)
  })

  it('closes a litter without farrowing so the sow can be served again', async () => {
    const { sow } = await seed()
    const l = await recordService({ sowId: sow.id, serviceDate: '2026-01-01' })
    await closeLitterWithoutFarrowing(l.id, 'notPregnant', '2026-01-22')
    expect((await openLitters()).length).toBe(0)
    const again = await recordService({ sowId: sow.id, serviceDate: '2026-01-23' })
    expect(again.id).not.toBe(l.id)
    expect((await latestLitterForSow(sow.id))!.id).toBe(again.id)
  })

  it('records farrowing and weaning with events and validation', async () => {
    const { sow } = await seed()
    const l = await recordService({ sowId: sow.id, serviceDate: '2026-01-01' })
    await expect(recordFarrowing(l.id, { farrowDate: '2026-04-27', bornAlive: -1, stillborn: 0, mummified: 0 })).rejects.toThrow()
    const f = await recordFarrowing(l.id, { farrowDate: '2026-04-27', bornAlive: 12, stillborn: 1, mummified: 0 })
    expect(f.outcome).toBe('farrowed')
    await expect(recordWeaning(l.id, { weanDate: '2026-05-25', weanedCount: 13 })).rejects.toThrow(/born alive/i)
    const w = await recordWeaning(l.id, { weanDate: '2026-05-25', weanedCount: 11 })
    expect(w.weanedCount).toBe(11)
    const types = (await db.events.where('subjectId').equals(l.id).toArray()).map((e) => e.type).sort()
    expect(types).toEqual(['farrowing', 'weaning'])
    expect((await openLitters()).length).toBe(0)
  })

  it('lists a sow\'s litters newest first', async () => {
    const { sow } = await seed()
    const a = await recordService({ sowId: sow.id, serviceDate: '2025-06-01' })
    await recordFarrowing(a.id, { farrowDate: '2025-09-24', bornAlive: 9, stillborn: 0, mummified: 0 })
    await recordWeaning(a.id, { weanDate: '2025-10-22', weanedCount: 8 })
    const b = await recordService({ sowId: sow.id, serviceDate: '2025-10-27' })
    expect((await littersForSow(sow.id)).map((l) => l.id)).toEqual([b.id, a.id])
  })
})
