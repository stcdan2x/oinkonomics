import { describe, expect, it } from 'vitest'
import { defaultParams } from './params'
import {
  breakEvenLechonPrice,
  breakEvenWeanedPerLitter,
  breakEvenWeanerPrice,
  cashNeutralWeaners,
  explain,
  expectedLiveweightPrice,
  farrowToWeanNet,
  scoreStrategies,
} from './strategy'

// Golden cases: research/business-models-and-strategies.md "Decision rules".
// The research rounds FCR to 2.65 (206.4 / 78), so money lines match to
// within that rounding (0.3 kg of feed plus 11 percent: about 12 pesos at
// dealer feed prices, 17 at online prices, plus the research's own rounding).
const near = (actual: number, expected: number, tol: number) => expect(Math.abs(actual - expected)).toBeLessThan(tol)

describe('Rule 1: break-even weaner price', () => {
  it('2026 national price, dealer feed: about 5,249', () => near(breakEvenWeanerPrice({ ...defaultParams(), weanToFinishMortality: 0.0918 }), 5249, 15))
  it('2022 case (110 per kg, feed 25): about 2,774', () => near(breakEvenWeanerPrice({ ...defaultParams(), weanToFinishMortality: 0.0918, liveweightPerKg: 110, growOutFeedPricePerKg: 25 }), 2774, 8))
  it('2026 online feed (49.45): about 2,294', () => near(breakEvenWeanerPrice({ ...defaultParams(), weanToFinishMortality: 0.0918, growOutFeedPricePerKg: 49.45 }), 2294, 20))
  it('surplus-region quote (120 per kg), dealer feed: about 948', () => near(breakEvenWeanerPrice({ ...defaultParams(), weanToFinishMortality: 0.0918, liveweightPerKg: 120 }), 948, 15))
})

describe('Rule 2: break-even lechon live price for a 25 kg pig', () => {
  it('2,500 weaner, 2022 nursery feed 29.5: about 135', () => near(breakEvenLechonPrice({ ...defaultParams(), nurseryFeedPricePerKg: 29.5 }), 135.5, 0.6))
  it('3,500 weaner: about 176', () => near(breakEvenLechonPrice({ ...defaultParams(), nurseryFeedPricePerKg: 29.5, weanerPerHead: 3500 }), 176.3, 0.6))
  it('2026 dealer feed 36.55: about 143', () => near(breakEvenLechonPrice({ ...defaultParams(), nurseryFeedPricePerKg: 36.55 }), 143.5, 0.6))
})

describe('Rule 3: cash-neutral weaners to sell', () => {
  it('8 weaned, grow-out feed about 5,162, weaner 2,500: sell 6', () => expect(cashNeutralWeaners(8, { ...defaultParams(), growOutFeedPricePerKg: 25 })).toBe(6))
  it('8 weaned, feed about 7,544, weaner 3,500: sell 6', () => expect(cashNeutralWeaners(8, { ...defaultParams(), weanerPerHead: 3500 })).toBe(6))
  it('never more than the litter', () => expect(cashNeutralWeaners(3, { ...defaultParams(), weanerPerHead: 1 })).toBe(3))
})

describe('Rule 4: farrow-to-wean net per litter', () => {
  // 2022 inputs: sow feed 10,356 per cycle, piglet feed 361 per piglet, AI 1,450, utilities 1,000, labour 3,000
  const p2022 = { ...defaultParams(), sowFeedKgPerCycle: 468, sowFeedPricePerKg: 10356 / 468, pigletFeedKgPerPiglet: 11.16, pigletFeedPricePerKg: 361 / 11.16 }
  it('7 weaned at 2,500: about -2,250 with labour costed', () => near(farrowToWeanNet({ ...p2022, weanedPerLitter: 7 }), -2252, 4))
  it('7 weaned at 2,500 without labour: about +748', () => near(farrowToWeanNet({ ...p2022, weanedPerLitter: 7, labourPerLitter: 0 }), 748, 4))
  it('break-even litter size at 2,500 is about 8.1 weaned', () => near(breakEvenWeanedPerLitter(p2022), 8.07, 0.05))
})

describe('Rule 6: expected liveweight price by sale month', () => {
  it('June carries the 1.048 index, October 0.951, January none', () => {
    expect(expectedLiveweightPrice(100, 6)).toBeCloseTo(104.8, 6)
    expect(expectedLiveweightPrice(100, 10)).toBeCloseTo(95.1, 6)
    expect(expectedLiveweightPrice(100, 1)).toBe(100)
  })
})

describe('scoreStrategies', () => {
  it('ranks applicable strategies by total margin, weaner sale as the zero baseline', () => {
    const p = { ...defaultParams(), lechonPerKgLive: 250 }
    const s = scoreStrategies({ head: 8, weightKg: 12 }, p)
    expect(s.ranked.map((r) => r.strategy)).toHaveLength(3)
    const margins = s.ranked.map((r) => r.margin)
    expect([...margins].sort((a, b) => b - a)).toEqual(margins)
    expect(s.ranked.find((r) => r.strategy === 'sellWeaners')!.margin).toBe(0)
    near(s.breakEvenWeanerPrice, breakEvenWeanerPrice(p), 1e-9)
    expect(s.cashNeutralWeaners).toBe(cashNeutralWeaners(8, p))
  })

  it('recommends selling now when the weaner price is above the break-even', () => {
    const p = { ...defaultParams(), weanerPerHead: 6000, lechonPerKgLive: 172.62 }
    const s = scoreStrategies({ head: 8, weightKg: 12 }, p)
    expect(s.ranked[0].strategy).toBe('sellWeaners')
  })

  it('drops strategies the pigs have outgrown', () => {
    const s = scoreStrategies({ head: 5, weightKg: 40 }, defaultParams())
    expect(s.ranked.map((r) => r.strategy)).toEqual(['growToMarket'])
  })
})

describe('explain', () => {
  it('names the recommended strategy, its margin and lists every assumption with its source row', () => {
    const p = { ...defaultParams(), lechonPerKgLive: 250 }
    const s = scoreStrategies({ head: 8, weightKg: 12 }, p)
    const e = explain(s)
    expect(e.summary).toContain(s.ranked[0].strategy === 'growToRoaster' ? 'roaster' : 'market')
    expect(e.summary).toContain('break-even sell-now price')
    const keys = new Set(s.ranked.flatMap((r) => r.assumptions.map((a) => a.key)))
    expect(new Set(e.assumptions.map((a) => a.key))).toEqual(keys)
    for (const a of e.assumptions) {
      expect(a.source).toMatch(/[A-Z]{2}-\d{2,3}/)
      expect(e.lines.some((l) => l.includes(a.label) && l.includes(a.source))).toBe(true)
    }
  })
})
