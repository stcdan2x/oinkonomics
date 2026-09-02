import 'fake-indexeddb/auto'
import { beforeAll, describe, expect, it } from 'vitest'
import { breedingCalendar, sowStage } from '../engine/breeding'
import { earliestSaleDate } from '../engine/withdrawal'
import { addAnimal, listBreeders } from './animalRepo'
import { batchSummary, createBatchFromLitter, recordBatchWeight } from './batchRepo'
import { db } from './db'
import { eventsFor, recordTreatment } from './eventRepo'
import { latestLitterForSow, openLitters, recordFarrowing, recordService, recordWeaning } from './litterRepo'
import { recordSale } from './saleRepo'

// PLAN.md section 9, P3 verify column: a seeded farm walks a full cycle -
// service, farrowing, weaning, batch, weights, treatment, sale.
describe('one production cycle on a seeded farm', () => {
  let sowId = ''
  let boarId = ''
  let litterId = ''
  let batchId = ''

  beforeAll(async () => {
    await Promise.all([db.animals, db.litters, db.batches, db.events, db.sales, db.transactions].map((t) => t.clear()))
    sowId = (await addAnimal({ tag: 'Inday', role: 'sow', sex: 'female', source: 'bought', breed: 'Landrace x Large White' })).id
    boarId = (await addAnimal({ tag: 'Bogart', role: 'boar', sex: 'male', source: 'bought' })).id
  })

  it('serves the sow: expected farrowing 115 days on, stage served, calendar shows the checks', async () => {
    const l = await recordService({ sowId, sireId: boarId, serviceDate: '2026-01-05' })
    litterId = l.id
    expect(l.expectedFarrowDate).toBe('2026-04-30')
    expect(sowStage(l, '2026-01-10').stage).toBe('served')
    const cal = breedingCalendar(await openLitters(), '2026-01-05', '2026-02-05')
    expect(cal.map((c) => `${c.date} ${c.type}`)).toEqual(['2026-01-26 heatCheck', '2026-02-02 pregCheck'])
    expect((await listBreeders()).map((a) => a.tag)).toEqual(['Bogart', 'Inday'])
  })

  it('farrows 12 alive, then weans 11 at 28 days', async () => {
    await recordFarrowing(litterId, { farrowDate: '2026-04-29', bornAlive: 12, stillborn: 1, mummified: 0 })
    const lact = sowStage((await latestLitterForSow(sowId))!, '2026-05-10')
    expect(lact).toEqual({ stage: 'lactating', next: { type: 'weaning', date: '2026-05-27' } })
    const cal = breedingCalendar(await openLitters(), '2026-04-29', '2026-05-13')
    expect(cal.map((c) => c.type)).toEqual(['ironShot', 'castration', 'creepFeed', 'ironShot'])
    await recordWeaning(litterId, { weanDate: '2026-05-27', weanedCount: 11 })
    expect(sowStage((await latestLitterForSow(sowId))!, '2026-05-28')).toEqual({ stage: 'weaned', next: { type: 'rebreed', date: '2026-06-01' } })
  })

  it('the weaned litter becomes a batch of 11 whose weights give an ADG', async () => {
    const b = await createBatchFromLitter(litterId, { strategy: 'growToMarket' })
    batchId = b.id
    expect(b.headCount).toBe(11)
    await recordBatchWeight(batchId, { date: '2026-05-27', avgKg: 8.5, sampleSize: 11 })
    await recordBatchWeight(batchId, { date: '2026-07-26', avgKg: 38.5, sampleSize: 6 })
    const s = await batchSummary(b, '2026-07-26')
    expect(s.adg).toBeCloseTo(0.5, 6)
    expect(s.daysOnFarm).toBe(60)
  })

  it('a deworming with a 28-day withdrawal blocks a sale until day 28, then the sale goes through', async () => {
    await recordTreatment({ subjectType: 'batch', subjectId: batchId, type: 'deworming', date: '2026-08-01', product: 'Ivermectin 1% injectable (GenVet Ivermec, Univet)', withdrawalDays: 28 })
    expect(earliestSaleDate(await eventsFor('batch', batchId))).toBe('2026-08-29')
    const line = { batchId, headCount: 11, liveWeightKg: 11 * 90, pricePerKg: 185 }
    await expect(recordSale({ date: '2026-08-20', buyerType: 'viajero', lines: [line] })).rejects.toThrow(/withdrawal/)
    const sale = await recordSale({ date: '2026-10-15', buyerType: 'viajero', buyerName: 'Aling Nena', lines: [line] })
    expect(sale.total).toBe(11 * 90 * 185)
    expect((await db.batches.get(batchId))!.headCount).toBe(0)
    const tx = (await db.transactions.get(sale.transactionId!))!
    expect(tx.amount).toBe(183150)
    expect(tx.links.saleId).toBe(sale.id)
  })

  it('leaves a coherent record: 1 sow, 1 boar, 1 closed litter, 1 empty batch, 1 sale, 1 revenue', async () => {
    expect(await db.animals.count()).toBe(2)
    expect((await openLitters()).length).toBe(0)
    expect(await db.batches.count()).toBe(1)
    expect(await db.sales.count()).toBe(1)
    expect(await db.transactions.where('kind').equals('revenue').count()).toBe(1)
    const types = (await db.events.toArray()).map((e) => e.type).sort()
    expect(types).toEqual(['deworming', 'farrowing', 'sale', 'service', 'weaning', 'weight', 'weight'])
  })
})
