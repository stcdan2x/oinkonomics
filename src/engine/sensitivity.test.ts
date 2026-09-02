import { describe, expect, it } from 'vitest'
import { defaultParams } from './params'
import { projectStrategy } from './projection'
import { SCORED } from './strategy'
import { SENSITIVITY_CASES, sensitivity } from './sensitivity'

const state = { head: 8, weightKg: 12 }

describe('sensitivity', () => {
  it('reports the margin of every applicable strategy under each case', () => {
    const rows = sensitivity(state, defaultParams())
    expect(rows.map((r) => r.strategy)).toEqual(SCORED)
    for (const r of rows) {
      expect(Object.keys(r.margins)).toEqual(['base', ...SENSITIVITY_CASES.map((c) => c.id)])
    }
  })

  it('base equals the plain projection; price cuts and dearer feed never raise a margin', () => {
    const p = defaultParams()
    const rows = sensitivity(state, p)
    for (const r of rows) {
      expect(r.margins.base).toBeCloseTo(projectStrategy(r.strategy, state, p).margin, 6)
      for (const c of SENSITIVITY_CASES) expect(r.margins[c.id]).toBeLessThanOrEqual(r.margins.base + 1e-9)
    }
  })

  it('price minus 20 percent hits market hogs harder than price minus 10', () => {
    const market = sensitivity(state, defaultParams()).find((r) => r.strategy === 'growToMarket')!
    expect(market.margins.priceMinus20).toBeLessThan(market.margins.priceMinus10)
    expect(market.margins.priceMinus10).toBeLessThan(market.margins.base)
    // 8 pigs, 90 kg, 172.62 per kg, 4.5 percent mortality: 10 percent of revenue
    expect(market.margins.base - market.margins.priceMinus10).toBeCloseTo(0.1 * 0.955 * 172.62 * 90 * 8, 2)
  })

  it('feed plus 10 percent moves the market margin by 10 percent of feed and its 11 percent other cost', () => {
    const p = defaultParams()
    const market = sensitivity(state, p).find((r) => r.strategy === 'growToMarket')!
    const feed = projectStrategy('growToMarket', state, p).feedCostPerHead * 8
    expect(market.margins.base - market.margins.feedPlus10).toBeCloseTo(0.1 * feed * 1.11, 2)
  })

  it('a price cut leaves the weaner baseline at zero because its own price is the yardstick', () => {
    const weaners = sensitivity(state, defaultParams()).find((r) => r.strategy === 'sellWeaners')!
    expect(weaners.margins.priceMinus10).toBe(0)
  })

  it('property: revenue less cash never falls when the sale price rises, nor does a weaner\'s margin over selling now (200 random parameter sets)', () => {
    let seed = 42
    const rand = () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296)
    for (let i = 0; i < 200; i++) {
      const p = { ...defaultParams(), growOutFeedPricePerKg: 20 + 40 * rand(), fcrGrowOut: 2 + 1.5 * rand(), weanToFinishMortality: 0.1 * rand(), marketWeightKg: 70 + 50 * rand() }
      const weightKg = 5 + 60 * rand()
      let lastGross = -Infinity
      let lastWeaner = -Infinity
      for (const price of [100, 120, 150, 172.62, 200, 250]) {
        const grown = projectStrategy('growToMarket', { head: 1, weightKg }, { ...p, liveweightPerKg: price })
        const gross = grown.revenuePerHead - grown.cashPerHead
        expect(gross).toBeGreaterThanOrEqual(lastGross - 1e-9)
        lastGross = gross
        const weaner = projectStrategy('growToMarket', { head: 1, weightKg: p.weanerWeightKg }, { ...p, liveweightPerKg: price }).marginPerHead
        expect(weaner).toBeGreaterThanOrEqual(lastWeaner - 1e-9)
        lastWeaner = weaner
      }
    }
  })
})
