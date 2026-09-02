import 'fake-indexeddb/auto'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { db } from './db'
import { listScenarios, removeScenario, runScenario, saveScenario, scenarioParams } from './scenarioRepo'

beforeEach(async () => {
  await db.scenarios.clear()
})

const base = { name: 'Two sows, weaners', strategy: 'sellWeaners' as const, sows: 2, startDate: '2026-01-01', months: 12, startupCost: 0, overrides: {} }

describe('saveScenario', () => {
  it('stores the scenario with its parameters and stamps createdAt', async () => {
    const s = await saveScenario({ ...base, overrides: { weanerPerHead: 3000 } })
    expect(s.id).toBeTruthy()
    expect(s.createdAt).toBeTruthy()
    expect(await db.scenarios.get(s.id)).toMatchObject({ name: 'Two sows, weaners', strategy: 'sellWeaners', params: { sows: 2, months: 12, overrides: { weanerPerHead: 3000 } } })
  })

  it('rejects a blank name, fewer than one sow, a horizon outside 12 to 36 months, a bad date and a negative startup cost', async () => {
    await expect(saveScenario({ ...base, name: '  ' })).rejects.toThrow(/name/i)
    await expect(saveScenario({ ...base, sows: 0 })).rejects.toThrow(/sow/i)
    await expect(saveScenario({ ...base, sows: 1.5 })).rejects.toThrow(/sow/i)
    await expect(saveScenario({ ...base, months: 6 })).rejects.toThrow(/months/i)
    await expect(saveScenario({ ...base, months: 48 })).rejects.toThrow(/months/i)
    await expect(saveScenario({ ...base, startDate: '2026-13-01' })).rejects.toThrow(/date/i)
    await expect(saveScenario({ ...base, startupCost: -1 })).rejects.toThrow(/startup/i)
  })
})

describe('listScenarios and removeScenario', () => {
  afterEach(() => vi.useRealTimers())

  it('lists live scenarios newest first and hides removed ones', async () => {
    // Pin the clock: on a fast runner two saves can share a millisecond and tie on createdAt.
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2026-09-03T00:00:00.000Z'))
    const a = await saveScenario({ ...base, name: 'A' })
    vi.setSystemTime(new Date('2026-09-03T00:00:01.000Z'))
    const b = await saveScenario({ ...base, name: 'B' })
    expect((await listScenarios()).map((s) => s.name)).toEqual(['B', 'A'])
    await removeScenario(b.id)
    expect((await listScenarios()).map((s) => s.name)).toEqual(['A'])
    expect(a.deletedAt).toBeNull()
  })
})

describe('scenarioParams and runScenario', () => {
  it('merges overrides onto the knowledge defaults and runs the projection', async () => {
    const s = await saveScenario({ ...base, overrides: { weanerPerHead: 3000, weanedPerLitter: 10 } })
    const p = scenarioParams(s)
    expect(p.weanerPerHead).toBe(3000)
    expect(p.weanedPerLitter).toBe(10)
    expect(p.gestationDays).toBe(115)
    const run = runScenario(s)
    expect(run.rows).toHaveLength(12)
    expect(run.rows[0].sows).toBe(2)
    // first litters sell in June: 2 sows x 10 weaned x 3,000
    expect(run.rows.find((r) => r.month === '2026-06')!.revenue).toBe(60000)
  })
})
