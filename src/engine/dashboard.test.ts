import { describe, expect, it } from 'vitest'
import type { Animal, Batch, FarmEvent, InventoryItem, Litter, StockMove, Transaction } from '../types'
import {
  batchesReady,
  chartRange,
  costPerKgGain,
  dashboardAlerts,
  deathsInPeriod,
  feedDaysRemaining,
  headsByStage,
  herdCountSeries,
  monthlyFinance,
  sowsDue,
} from './dashboard'
import { periodPresets } from './finance'

const TODAY = '2026-09-02'
const stamp = { updatedAt: '2026-01-01T00:00:00.000Z' }

const animal = (id: string, role: Animal['role'], extra: Partial<Animal> = {}): Animal => ({
  id,
  tag: id,
  role,
  sex: role === 'boar' ? 'male' : 'female',
  source: 'bought',
  status: 'active',
  ...stamp,
  ...extra,
})

const batch = (id: string, kind: Batch['kind'], headCount: number, extra: Partial<Batch> = {}): Batch => ({
  id,
  name: id,
  kind,
  litterIds: [],
  headCount,
  startDate: '2026-01-20',
  strategy: 'growToMarket',
  ...stamp,
  ...extra,
})

const litter = (id: string, expectedFarrowDate: string, extra: Partial<Litter> = {}): Litter => ({
  id,
  sowId: `sow-${id}`,
  serviceDate: '2026-05-01',
  expectedFarrowDate,
  bornAlive: 0,
  stillborn: 0,
  mummified: 0,
  weanedCount: 0,
  ...stamp,
  ...extra,
})

const tx = (date: string, kind: Transaction['kind'], amount: number, category = 'feed'): Transaction => ({
  id: `${date}-${kind}-${amount}`,
  date,
  kind,
  category,
  amount,
  links: {},
  ...stamp,
})

const event = (subjectType: FarmEvent['subjectType'], type: FarmEvent['type'], date: string, data: Record<string, unknown> = {}): FarmEvent => ({
  id: `${subjectType}-${type}-${date}`,
  subjectType,
  subjectId: 'x',
  type,
  date,
  data,
  ...stamp,
})

describe('headsByStage', () => {
  it('counts active breeders by role and pigs by batch kind, individual pigs only outside a batch', () => {
    const animals = [
      animal('S1', 'sow'),
      animal('S2', 'sow'),
      animal('S3', 'sow', { status: 'sold', statusDate: '2026-03-01' }),
      animal('G1', 'gilt'),
      animal('B1', 'boar'),
      animal('P1', 'grower', { batchId: 'growers' }), // inside a batch: counted there
      animal('P2', 'finisher'), // on its own: counted
      animal('P3', 'finisher', { deletedAt: '2026-02-01T00:00:00.000Z' }),
    ]
    const batches = [
      batch('piglets', 'piglets', 10),
      batch('growers', 'growers', 8),
      batch('gone', 'finishers', 5, { deletedAt: '2026-02-01T00:00:00.000Z' }),
      batch('empty', 'finishers', 0),
    ]
    expect(headsByStage(animals, batches)).toEqual({ sows: 2, gilts: 1, boars: 1, piglets: 10, growers: 8, finishers: 1, total: 23 })
  })
})

describe('sowsDue', () => {
  it('lists open litters due within 14 days, overdue first, and skips farrowed or closed litters', () => {
    const litters = [
      litter('a', '2026-09-10'),
      litter('b', '2026-09-16'), // day 14: included
      litter('c', '2026-09-17'), // day 15: not
      litter('d', '2026-08-30'), // overdue
      litter('e', '2026-09-05', { farrowDate: '2026-09-01', bornAlive: 9 }),
      litter('f', '2026-09-05', { outcome: 'notPregnant' }),
      litter('g', '2026-09-05', { deletedAt: '2026-02-01T00:00:00.000Z' }),
    ]
    expect(sowsDue(litters, TODAY)).toEqual([
      { litterId: 'd', sowId: 'sow-d', date: '2026-08-30', overdue: true },
      { litterId: 'a', sowId: 'sow-a', date: '2026-09-10', overdue: false },
      { litterId: 'b', sowId: 'sow-b', date: '2026-09-16', overdue: false },
    ])
  })
})

describe('batchesReady', () => {
  it('flags batches at their strategy target by projected weight, or by days on farm without a weighing', () => {
    const statuses = [
      // 85 kg ten days ago at 0.65 kg/day = 91.5 kg today: at the 90 kg market target
      { batch: batch('m1', 'finishers', 8), lastWeight: { date: '2026-08-23', kg: 85 }, adg: 0.65, daysOnFarm: 150 },
      // one weighing only: taken as today's weight, below target
      { batch: batch('m2', 'growers', 8), lastWeight: { date: '2026-08-23', kg: 60 }, adg: null, daysOnFarm: 150 },
      // no weighing: 32 days on farm = 60 - 28, at the weaner age target
      { batch: batch('w1', 'piglets', 10, { strategy: 'sellWeaners' }), lastWeight: null, adg: null, daysOnFarm: 32 },
      // no weighing: 40 days < 83 - 28
      { batch: batch('r1', 'piglets', 10, { strategy: 'growToRoaster' }), lastWeight: null, adg: null, daysOnFarm: 40 },
      // undecided: never ready
      { batch: batch('u1', 'finishers', 4, { strategy: 'undecided' }), lastWeight: { date: TODAY, kg: 100 }, adg: null, daysOnFarm: 200 },
      // empty batch: never ready
      { batch: batch('e1', 'finishers', 0), lastWeight: { date: TODAY, kg: 100 }, adg: null, daysOnFarm: 200 },
    ]
    const ready = batchesReady(statuses, TODAY)
    expect(ready.map((r) => [r.batch.id, r.targetKg, r.by, r.kgNow])).toEqual([
      ['m1', 90, 'weight', 91.5],
      ['w1', 12, 'age', null],
    ])
  })
})

describe('deathsInPeriod', () => {
  it('sums batch death head and counts animal deaths inside the period only', () => {
    const events = [
      event('batch', 'death', '2026-09-01', { delta: -2, headCountAfter: 8 }),
      event('animal', 'death', '2026-09-02'),
      event('batch', 'death', '2026-08-31', { delta: -1 }),
      event('batch', 'cull', '2026-09-01', { delta: -1 }),
      { ...event('batch', 'death', '2026-09-01', { delta: -5 }), deletedAt: '2026-09-01T00:00:00.000Z' },
    ]
    expect(deathsInPeriod(events, '2026-09-01', '2026-09-30')).toBe(3)
  })
})

describe('monthlyFinance', () => {
  it('gives one point per month of the period with the operating revenue, expenses and profit', () => {
    const txs = [
      tx('2026-01-05', 'revenue', 10000, 'hogSales'),
      tx('2026-01-20', 'expense', 4000),
      tx('2026-03-02', 'expense', 1000),
      tx('2026-02-10', 'capital', 50000, 'penConstruction'),
      tx('2025-12-31', 'expense', 999),
    ]
    expect(monthlyFinance(txs, '2026-01-01', '2026-03-31')).toEqual([
      { month: '2026-01', revenue: 10000, expenses: 4000, profit: 6000 },
      { month: '2026-02', revenue: 0, expenses: 0, profit: 0 },
      { month: '2026-03', revenue: 0, expenses: 1000, profit: -1000 },
    ])
  })
})

describe('herdCountSeries', () => {
  it('counts breeders alive and batch head at each month end', () => {
    const animals = [
      animal('S1', 'sow', { birthDate: '2024-01-01' }),
      animal('B1', 'boar', { status: 'sold', statusDate: '2026-02-15' }),
      animal('G1', 'gilt', { birthDate: '2026-03-10' }), // arrives in March
    ]
    const batches = [
      { batch: batch('b', 'piglets', 9, { startDate: '2026-01-20' }), changes: [{ date: '2026-03-05', delta: -1 }] },
    ]
    expect(herdCountSeries(animals, batches, '2026-01-01', '2026-03-31')).toEqual([
      { month: '2026-01', breeders: 2, pigs: 10, total: 12 },
      { month: '2026-02', breeders: 1, pigs: 10, total: 11 },
      { month: '2026-03', breeders: 2, pigs: 9, total: 11 },
    ])
  })
})

describe('costPerKgGain', () => {
  it('divides direct plus allocated cost by the kg gained across the current head', () => {
    const weights = [
      { date: '2026-06-01', kg: 12 },
      { date: '2026-07-15', kg: 40 },
    ]
    // 6,000 / (28 kg x 8 head) = 26.7857
    expect(costPerKgGain({ direct: 5000, allocated: 1000 }, weights, 8)).toBeCloseTo(26.7857, 3)
  })
  it('is null with fewer than two weighings or no gain', () => {
    expect(costPerKgGain({ direct: 5000, allocated: 1000 }, [{ date: '2026-06-01', kg: 12 }], 8)).toBeNull()
    expect(costPerKgGain({ direct: 5000, allocated: 1000 }, [{ date: '2026-06-01', kg: 12 }, { date: '2026-06-02', kg: 12 }], 8)).toBeNull()
  })
})

describe('feedDaysRemaining', () => {
  const item = (id: string, category: InventoryItem['category'], qtyOnHand: number): InventoryItem => ({
    id,
    name: id,
    category,
    unit: 'bag',
    qtyOnHand,
    reorderLevel: 0,
    unitCost: 0,
    ...stamp,
  })
  const move = (itemId: string, date: string, qtyDelta: number): StockMove => ({ id: `${itemId}-${date}`, itemId, date, qtyDelta, reason: 'consumption', ...stamp })
  it('takes the shortest days-left over the feed items with usage', () => {
    const items = [item('grower', 'feed', 10), item('starter', 'feed', 30), item('amox', 'medicine', 1)]
    const moves = [
      // grower: 4 bags over the 2 days since the first use = 2 per day -> 5 days
      move('grower', '2026-09-01', -2),
      move('grower', '2026-09-02', -2),
      // starter: 1 per day -> 30 days
      move('starter', '2026-09-02', -1),
      // medicine usage is ignored
      move('amox', '2026-09-02', -1),
    ]
    expect(feedDaysRemaining(items, moves, TODAY)).toBe(5)
  })
  it('is null when no feed item has usage', () => {
    expect(feedDaysRemaining([{ ...({} as InventoryItem), id: 'g', category: 'feed', qtyOnHand: 10 } as InventoryItem], [], TODAY)).toBeNull()
  })
})

describe('dashboardAlerts', () => {
  it('orders overdue farrowings, then stock by severity, then batches ready, then this week milestones by date', () => {
    const alerts = dashboardAlerts({
      stock: [{ itemId: 'amox', type: 'expiring', daysToExpiry: 12 }, { itemId: 'feed', type: 'lowStock' }],
      sowsDue: [
        { litterId: 'L1', sowId: 'S1', date: '2026-08-30', overdue: true },
        { litterId: 'L2', sowId: 'S2', date: '2026-09-10', overdue: false },
      ],
      ready: [{ batch: batch('m1', 'finishers', 8), targetKg: 90, by: 'weight', kgNow: 91.5 }],
      calendar: [
        { type: 'weaning', date: '2026-09-04', litterId: 'L3', sowId: 'S3' },
        { type: 'heatCheck', date: '2026-09-03', litterId: 'L4', sowId: 'S4' },
      ],
    })
    expect(alerts).toEqual([
      { type: 'farrowingOverdue', litterId: 'L1', sowId: 'S1', date: '2026-08-30' },
      { type: 'stock', itemId: 'feed', alert: 'lowStock', daysToExpiry: undefined },
      { type: 'stock', itemId: 'amox', alert: 'expiring', daysToExpiry: 12 },
      { type: 'batchReady', batchId: 'm1', targetKg: 90, by: 'weight', kgNow: 91.5 },
      { type: 'milestone', litterId: 'L4', sowId: 'S4', milestone: 'heatCheck', date: '2026-09-03' },
      { type: 'milestone', litterId: 'L3', sowId: 'S3', milestone: 'weaning', date: '2026-09-04' },
    ])
  })
})

describe('periodPresets.thisQuarter', () => {
  it('spans the calendar quarter of today', () => {
    expect(periodPresets('2026-09-02').thisQuarter).toEqual({ from: '2026-07-01', to: '2026-09-30' })
    expect(periodPresets('2026-01-15').thisQuarter).toEqual({ from: '2026-01-01', to: '2026-03-31' })
  })
})

describe('chartRange', () => {
  it('clamps an open-ended period to the months that hold data, and never past this month or the latest dated record', () => {
    // all-time period, farm started 2026-03-15, records to 2026-10-15, today 2026-09-02
    expect(chartRange({ from: '0001-01-01', to: '9999-12-31' }, ['2026-03-15', '2026-10-15', '2026-05-01'], TODAY)).toEqual({ from: '2026-03-01', to: '2026-10-31' })
    // a bounded period stays as it is
    expect(chartRange({ from: '2026-07-01', to: '2026-09-30' }, ['2026-03-15'], TODAY)).toEqual({ from: '2026-07-01', to: '2026-09-30' })
    // no records: this month only
    expect(chartRange({ from: '0001-01-01', to: '9999-12-31' }, [], TODAY)).toEqual({ from: '2026-09-01', to: '2026-09-30' })
  })
})
