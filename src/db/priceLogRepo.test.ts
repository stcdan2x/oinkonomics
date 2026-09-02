import 'fake-indexeddb/auto'
import { beforeEach, describe, expect, it } from 'vitest'
import { defaultParams } from '../engine/params'
import { db } from './db'
import { latestPrices, listPrices, paramsFromPrices, recordPrice, removePrice } from './priceLogRepo'

beforeEach(async () => {
  await db.priceLog.clear()
})

describe('recordPrice', () => {
  it('stores an observation', async () => {
    const o = await recordPrice({ date: '2026-08-30', item: 'liveweightPerKg', value: 165, source: 'heard', market: 'Kabankalan', note: 'viajero quote' })
    expect(await db.priceLog.get(o.id)).toMatchObject({ item: 'liveweightPerKg', value: 165, source: 'heard', market: 'Kabankalan' })
  })

  it('rejects a non-positive value, a bad date and an unknown item', async () => {
    await expect(recordPrice({ date: '2026-08-30', item: 'liveweightPerKg', value: 0, source: 'own' })).rejects.toThrow(/value/i)
    await expect(recordPrice({ date: '2026-02-30', item: 'liveweightPerKg', value: 100, source: 'own' })).rejects.toThrow(/date/i)
    await expect(recordPrice({ date: '2026-08-30', item: 'porkChop' as never, value: 100, source: 'own' })).rejects.toThrow(/item/i)
  })
})

describe('listPrices, latestPrices, removePrice', () => {
  it('lists newest first, optionally per item, and picks the latest dated observation per item', async () => {
    await recordPrice({ date: '2026-08-01', item: 'liveweightPerKg', value: 170, source: 'published' })
    const later = await recordPrice({ date: '2026-08-30', item: 'liveweightPerKg', value: 165, source: 'heard' })
    await recordPrice({ date: '2026-07-15', item: 'pigletPerHead', value: 2800, source: 'own' })
    expect((await listPrices()).map((o) => o.value)).toEqual([165, 170, 2800])
    expect((await listPrices('pigletPerHead')).map((o) => o.value)).toEqual([2800])
    const latest = await latestPrices()
    expect(latest.get('liveweightPerKg')?.value).toBe(165)
    expect(latest.get('pigletPerHead')?.value).toBe(2800)
    expect(latest.has('feedBag')).toBe(false)
    await removePrice(later.id)
    expect((await latestPrices()).get('liveweightPerKg')?.value).toBe(170)
  })
})

describe('paramsFromPrices', () => {
  it('maps the latest observations onto the engine parameters and leaves the rest at the defaults', async () => {
    await recordPrice({ date: '2026-08-30', item: 'liveweightPerKg', value: 165, source: 'heard' })
    await recordPrice({ date: '2026-08-30', item: 'pigletPerHead', value: 2800, source: 'own' })
    await recordPrice({ date: '2026-08-30', item: 'feedBag', value: 1900, source: 'own' })
    await recordPrice({ date: '2026-08-30', item: 'lechonPerHead', value: 5000, source: 'heard' })
    const { params, applied } = paramsFromPrices(await latestPrices(), defaultParams())
    expect(params.liveweightPerKg).toBe(165)
    expect(params.weanerPerHead).toBe(2800)
    expect(params.growOutFeedPricePerKg).toBe(38) // 1,900 per 50 kg bag
    expect(params.lechonPerKgLive).toBe(200) // 5,000 per head at the 25 kg roaster weight
    expect(params.fcrGrowOut).toBe(defaultParams().fcrGrowOut)
    expect(applied.map((a) => a.key).sort()).toEqual(['growOutFeedPricePerKg', 'lechonPerKgLive', 'liveweightPerKg', 'weanerPerHead'])
  })

  it('applies nothing when the log is empty', () => {
    const { params, applied } = paramsFromPrices(new Map(), defaultParams())
    expect(params).toEqual(defaultParams())
    expect(applied).toEqual([])
  })
})
