import { describe, expect, it } from 'vitest'
import { defaultParams } from './params'
import { projectFarm, projectStrategy } from './projection'

// Golden cases from research/business-models-and-strategies.md "Decision rules",
// Rule 1 worked defaults (W_w 12, W_m 90, FCR 2.65, d 1).
describe('projectStrategy', () => {
  it('2026 national price and dealer feed: growing a 12 kg weaner to 90 kg earns about 2,663 over selling it at 2,586', () => {
    const p = { ...defaultParams(), weanToFinishMortality: 0.0918, weanerPerHead: 2586 }
    const r = projectStrategy('growToMarket', { head: 1, weightKg: 12 }, p)
    expect(r.applicable).toBe(true)
    // The research works with 206.4 kg of feed (its FCR 2.65 is 206.4 / 78
    // rounded); 2.65 x 78 = 206.7 kg, so its money figures are reproduced to
    // within that rounding (about 11 pesos on the feed line).
    expect(r.feedKgPerHead).toBeCloseTo(206.7, 1)
    expect(Math.abs(r.feedCostPerHead - 7544)).toBeLessThan(12)
    expect(Math.abs(r.otherCostPerHead - 1317)).toBeLessThan(2)
    expect(r.revenuePerHead).toBeCloseTo(14110, 0)
    expect(r.valueTodayPerHead).toBe(2586)
    expect(Math.abs(r.marginPerHead - 2663)).toBeLessThan(14)
    expect(r.cashPerHead).toBeCloseTo(r.feedCostPerHead + r.otherCostPerHead, 6)
    expect(r.days).toBe(120) // 78 kg of gain at 0.65 kg per day
  })

  it('2022 case: liveweight 110 and feed 25 leave a margin of about 274 over a 2,500 weaner', () => {
    const p = { ...defaultParams(), weanToFinishMortality: 0.0918, liveweightPerKg: 110, growOutFeedPricePerKg: 25 }
    const r = projectStrategy('growToMarket', { head: 1, weightKg: 12 }, p)
    expect(Math.abs(r.marginPerHead - 274)).toBeLessThan(8) // same FCR rounding as above (0.3 kg x 25)
  })

  it('market price is cut by the deduction when the target weight is outside 80 to 100 kg', () => {
    const p = { ...defaultParams(), marketWeightKg: 70, weanToFinishMortality: 0 }
    const r = projectStrategy('growToMarket', { head: 1, weightKg: 12 }, p)
    expect(r.revenuePerHead).toBeCloseTo((172.62 - 5) * 70, 2)
  })

  it('roaster: 25 kg of nursery feed at 29.5 per kg, 11 percent other cost, 2 percent mortality (Rule 2 inputs)', () => {
    const p = { ...defaultParams(), nurseryFeedPricePerKg: 29.5, lechonPerKgLive: 200 }
    const r = projectStrategy('growToRoaster', { head: 1, weightKg: 12 }, p)
    expect(r.feedKgPerHead).toBeCloseTo(25, 6)
    expect(r.feedCostPerHead).toBeCloseTo(737.5, 2)
    expect(r.otherCostPerHead).toBeCloseTo(81.1, 1)
    expect(r.revenuePerHead).toBeCloseTo(0.98 * 25 * 200, 2)
    expect(r.marginPerHead).toBeCloseTo(4900 - 737.5 - 81.125 - 2500, 2)
  })

  it('selling weaners is the baseline: no feed, no cost, zero margin', () => {
    const r = projectStrategy('sellWeaners', { head: 8, weightKg: 12 }, defaultParams())
    expect(r.feedCostPerHead).toBe(0)
    expect(r.marginPerHead).toBe(0)
    expect(r.revenue).toBe(8 * 2500)
    expect(r.days).toBe(0)
  })

  it('a strategy whose target weight is below the current weight is not applicable', () => {
    const r = projectStrategy('sellWeaners', { head: 1, weightKg: 40 }, defaultParams())
    expect(r.applicable).toBe(false)
  })

  it('a 40 kg grower is valued today per kg, and its market margin is scaled by the head count', () => {
    const p = { ...defaultParams(), weanToFinishMortality: 0 }
    const r = projectStrategy('growToMarket', { head: 10, weightKg: 40 }, p)
    expect(r.valueTodayPerHead).toBeCloseTo((172.62 - 5) * 40, 2)
    expect(r.feedKgPerHead).toBeCloseTo(2.65 * 50, 6)
    expect(r.margin).toBeCloseTo(r.marginPerHead * 10, 6)
    expect(r.assumptions.map((a) => a.key)).toContain('fcrGrowOut')
    for (const a of r.assumptions) expect(a.source).toMatch(/[A-Z]{2}-\d{2,3}/)
  })
})

describe('projectFarm', () => {
  // One sow selling weaners over 2026 with round-number overrides so every
  // month can be checked by hand: sow feed 20 per day, breeding 1,000 at
  // service, utilities 500 at farrowing, piglet feed 10 per day for 46 days
  // (day 14 to day 59 of age), sale at 60 days for 2,500 x 10 weaned.
  const p = {
    ...defaultParams(),
    littersPerSowYear: 2, // 183-day cycle
    gestationDays: 115,
    weanedPerLitter: 10,
    sowFeedKgPerCycle: 366,
    sowFeedPricePerKg: 10,
    pigletFeedKgPerPiglet: 4.6,
    pigletFeedPricePerKg: 10,
    breedingCostPerLitter: 1000,
    utilitiesPerLitter: 500,
    labourPerLitter: 0,
    weanerPerHead: 2500,
  }
  const farm = projectFarm({ sows: 1, strategy: 'sellWeaners', startDate: '2026-01-01', months: 12, startupCost: 0 }, p)
  const row = (m: string) => farm.rows.find((r) => r.month === m)!

  it('lays out twelve months from the start date', () => {
    expect(farm.rows).toHaveLength(12)
    expect(farm.rows[0].month).toBe('2026-01')
    expect(farm.rows[11].month).toBe('2026-12')
  })

  it('January: breeding cost plus 31 days of sow feed', () => {
    expect(row('2026-01').expenses).toBeCloseTo(1000 + 31 * 20, 6)
    expect(row('2026-01').revenue).toBe(0)
    expect(row('2026-01').pigsOnHand).toBe(0)
  })

  it('farrowing on 26 April: utilities land in April and the piglets are on hand', () => {
    expect(row('2026-04').expenses).toBeCloseTo(500 + 30 * 20, 6)
    expect(row('2026-04').pigsOnHand).toBe(10)
  })

  it('June: the litter sells on the 25th for 25,000 and the second service starts in July', () => {
    expect(row('2026-06').revenue).toBe(25000)
    expect(row('2026-06').pigsOnHand).toBe(0)
    expect(row('2026-07').expenses).toBeCloseTo(1000 + 31 * 20, 6)
  })

  it('year totals: revenue 50,000, expenses 11,220, net 38,780', () => {
    expect(farm.totals.revenue).toBe(50000)
    expect(farm.totals.expenses).toBeCloseTo(11220, 6)
    expect(farm.totals.net).toBeCloseTo(38780, 6)
  })

  it('peak capital is the deepest cumulative deficit (end of May) and payback is June', () => {
    expect(farm.peakCapital).toBeCloseTo(4740, 6)
    expect(farm.paybackMonth).toBe('2026-06')
  })

  it('startup cost lands in the first month and delays payback', () => {
    const f = projectFarm({ sows: 1, strategy: 'sellWeaners', startDate: '2026-01-01', months: 12, startupCost: 30000 }, p)
    expect(f.rows[0].expenses).toBeCloseTo(30000 + 1620, 6)
    expect(f.paybackMonth).toBe('2026-12')
  })

  it('two sows double every money line', () => {
    const f = projectFarm({ sows: 2, strategy: 'sellWeaners', startDate: '2026-01-01', months: 12, startupCost: 0 }, p)
    expect(f.totals.revenue).toBe(100000)
    expect(f.totals.expenses).toBeCloseTo(22440, 6)
  })

  it('grow to market: grow-out feed is spread from weaning age to sale and revenue lands at 154 days', () => {
    const f = projectFarm({ sows: 1, strategy: 'growToMarket', startDate: '2026-01-01', months: 12, startupCost: 0 }, { ...p, weanToFinishMortality: 0 })
    // farrow 26 Apr; sale at day 154 of age = 27 Sep
    expect(row('2026-06').revenue).toBe(25000) // unchanged baseline for comparison
    expect(f.rows.find((r) => r.month === '2026-09')!.revenue).toBeCloseTo(10 * 90 * 172.62, 2)
    expect(f.rows.find((r) => r.month === '2026-08')!.pigsOnHand).toBe(10)
  })
})
