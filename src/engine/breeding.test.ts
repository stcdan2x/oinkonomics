import { describe, expect, it } from 'vitest'
import type { Litter } from '../types'
import {
  breedingCalendar,
  expectedFarrowDate,
  expectedRebreedDate,
  expectedWeanDate,
  heatCheckDate,
  pregCheckDate,
  sowStage,
} from './breeding'

const litter = (over: Partial<Litter>): Litter => ({
  id: 'L1',
  sowId: 'S1',
  serviceDate: '2026-01-01',
  expectedFarrowDate: '2026-04-26',
  bornAlive: 0,
  stillborn: 0,
  mummified: 0,
  weanedCount: 0,
  updatedAt: '2026-01-01T00:00:00.000Z',
  ...over,
})

describe('breeding dates (defaults from research/parameters.md)', () => {
  it('expected farrowing is service + 115 days (PC-24)', () => {
    expect(expectedFarrowDate('2026-01-01')).toBe('2026-04-26')
    expect(expectedFarrowDate('2026-01-01', 114)).toBe('2026-04-25')
  })

  it('heat check day 21 and pregnancy check day 28 after service (PC-26, PC-27)', () => {
    expect(heatCheckDate('2026-01-01')).toBe('2026-01-22')
    expect(pregCheckDate('2026-01-01')).toBe('2026-01-29')
  })

  it('weaning at 28 days of age and rebreed 5 days after weaning (PC-46, PC-63)', () => {
    expect(expectedWeanDate('2026-04-26')).toBe('2026-05-24')
    expect(expectedRebreedDate('2026-05-24')).toBe('2026-05-29')
  })
})

describe('sow stage from her latest litter', () => {
  it('is open with no litter', () => {
    expect(sowStage(null, '2026-01-01')).toEqual({ stage: 'open', next: null })
  })

  it('walks served, heat check due, pregnant, due soon', () => {
    const l = litter({})
    expect(sowStage(l, '2026-01-10').stage).toBe('served')
    expect(sowStage(l, '2026-01-10').next).toEqual({ type: 'heatCheck', date: '2026-01-22' })
    expect(sowStage(l, '2026-01-22').stage).toBe('heatCheckDue')
    expect(sowStage(l, '2026-02-15').stage).toBe('pregnant')
    expect(sowStage(l, '2026-02-15').next).toEqual({ type: 'farrowing', date: '2026-04-26' })
    expect(sowStage(l, '2026-04-20').stage).toBe('dueSoon')
    expect(sowStage(l, '2026-04-30').stage).toBe('overdue')
  })

  it('is lactating after farrowing and awaiting rebreed after weaning', () => {
    const farrowed = litter({ farrowDate: '2026-04-27', bornAlive: 12 })
    const s = sowStage(farrowed, '2026-05-01')
    expect(s.stage).toBe('lactating')
    expect(s.next).toEqual({ type: 'weaning', date: '2026-05-25' })
    const weaned = litter({ farrowDate: '2026-04-27', bornAlive: 12, weanDate: '2026-05-25', weanedCount: 11 })
    expect(sowStage(weaned, '2026-05-26')).toEqual({ stage: 'weaned', next: { type: 'rebreed', date: '2026-05-30' } })
  })
})

describe('breeding calendar', () => {
  it('lists upcoming milestones and piglet-care items in date order within the window', () => {
    const served = litter({ id: 'L1', sowId: 'S1', serviceDate: '2026-03-01', expectedFarrowDate: '2026-06-24' })
    const farrowed = litter({ id: 'L2', sowId: 'S2', serviceDate: '2025-11-05', expectedFarrowDate: '2026-02-28', farrowDate: '2026-02-28', bornAlive: 10 })
    const items = breedingCalendar([served, farrowed], '2026-03-01', '2026-04-15')
    expect(items.map((i) => `${i.date} ${i.type} ${i.litterId}`)).toEqual([
      '2026-03-03 ironShot L2',
      '2026-03-07 castration L2',
      '2026-03-14 creepFeed L2',
      '2026-03-14 ironShot L2',
      '2026-03-22 heatCheck L1',
      '2026-03-28 weaning L2',
      '2026-03-29 pregCheck L1',
      '2026-04-02 rebreed L2',
    ])
  })

  it('drops litters that are weaned and milestones outside the window', () => {
    const done = litter({ farrowDate: '2026-02-28', weanDate: '2026-03-28', weanedCount: 9 })
    expect(breedingCalendar([done], '2026-03-01', '2026-04-15')).toEqual([])
    const served = litter({ serviceDate: '2026-03-01', expectedFarrowDate: '2026-06-24' })
    expect(breedingCalendar([served], '2026-06-20', '2026-06-30').map((i) => i.type)).toEqual(['farrowing'])
  })
})
