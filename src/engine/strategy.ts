import { SEASONAL_INDEX } from '../knowledge/parameters'
import { STRATEGY_INFO } from '../knowledge/strategies'
import type { StrategyId } from '../types'
import { type Assumption, type EngineParams } from './params'
import { projectStrategy, type PigState, type StrategyProjection } from './projection'

// Decision rules from research/business-models-and-strategies.md, on the
// per-pig arithmetic of projection.ts. All money is PHP.

// Rule 1: the weaner price at which selling now and growing to market are equal.
export function breakEvenWeanerPrice(p: EngineParams, weightKg = p.weanerWeightKg): number {
  const g = projectStrategy('growToMarket', { head: 1, weightKg }, p)
  return g.revenuePerHead - g.feedCostPerHead - g.otherCostPerHead
}

// Rule 2: the live price per kg a roaster must pay for holding a weaner to
// roaster size to beat selling the weaner.
export function breakEvenLechonPrice(p: EngineParams, weightKg = p.weanerWeightKg): number {
  const r = projectStrategy('growToRoaster', { head: 1, weightKg }, p)
  return (r.valueTodayPerHead + r.feedCostPerHead + r.otherCostPerHead) / (r.survivorShare * r.targetKg)
}

// Rule 3: weaners to sell so that their proceeds pay the grow-out feed of the rest.
export function cashNeutralWeaners(weaned: number, p: EngineParams): number {
  const feed = projectStrategy('growToMarket', { head: 1, weightKg: p.weanerWeightKg }, p).feedCostPerHead
  return Math.min(weaned, Math.ceil((weaned * feed) / (p.weanerPerHead + feed)))
}

const sowFeedPerLitter = (p: EngineParams) => p.sowFeedKgPerCycle * p.sowFeedPricePerKg
const pigletFeedPerPiglet = (p: EngineParams) => p.pigletFeedKgPerPiglet * p.pigletFeedPricePerKg
const litterOverheads = (p: EngineParams) => p.breedingCostPerLitter + p.utilitiesPerLitter + p.labourPerLitter

// Rule 4: farrow-to-wean net per litter at the parameters' litter size.
export function farrowToWeanNet(p: EngineParams): number {
  const n = p.weanedPerLitter
  return n * p.weanerPerHead - (1 + p.otherCostRate) * (sowFeedPerLitter(p) + n * pigletFeedPerPiglet(p)) - litterOverheads(p)
}

// Litter size at which Rule 4 is zero (Infinity when a piglet cannot cover its own feed).
export function breakEvenWeanedPerLitter(p: EngineParams): number {
  const perPiglet = p.weanerPerHead - (1 + p.otherCostRate) * pigletFeedPerPiglet(p)
  if (perPiglet <= 0) return Infinity
  return ((1 + p.otherCostRate) * sowFeedPerLitter(p) + litterOverheads(p)) / perPiglet
}

// Rule 6: base price times the sale month's seasonal index (month 1 to 12).
export const seasonalFactor = (month: number) => SEASONAL_INDEX[month - 1].value
export const expectedLiveweightPrice = (basePerKg: number, month: number) => basePerKg * seasonalFactor(month)

export const SCORED: StrategyId[] = ['sellWeaners', 'growToRoaster', 'growToMarket']

export interface StrategyScore {
  state: PigState
  ranked: StrategyProjection[] // applicable strategies, best margin first
  breakEvenWeanerPrice: number
  cashNeutralWeaners: number
  weanerWeightKg: number
}

export function scoreStrategies(state: PigState, p: EngineParams): StrategyScore {
  const ranked = SCORED.map((s) => projectStrategy(s, state, p))
    .filter((r) => r.applicable)
    .sort((a, b) => b.margin - a.margin || a.days - b.days)
  return { state, ranked, breakEvenWeanerPrice: breakEvenWeanerPrice(p, state.weightKg), cashNeutralWeaners: cashNeutralWeaners(state.head, p), weanerWeightKg: p.weanerWeightKg }
}

export interface Explanation {
  summary: string
  lines: string[] // one per assumption: label, value, unit, source
  assumptions: Assumption[]
}

const n0 = (v: number) => Math.round(v).toLocaleString('en-PH')
const fmtValue = (v: unknown) => (Array.isArray(v) ? v.join(' to ') : typeof v === 'number' ? (Number.isInteger(v) ? String(v) : v.toFixed(v < 1 ? 3 : 2)) : String(v))

// One paragraph the user can read, plus every assumption the ranking used.
export function explain(score: StrategyScore): Explanation {
  const [best, ...rest] = score.ranked
  const { head, weightKg } = score.state
  if (!best) return { summary: 'No strategy applies to pigs of this weight.', lines: [], assumptions: [] }
  const name = STRATEGY_INFO[best.strategy].name
  const parts: string[] = []
  if (best.strategy === 'sellWeaners') {
    parts.push(`${name}: selling the ${head} pigs now at ${n0(best.valueTodayPerHead)} per head (${n0(best.revenue)} in total) beats growing them.`)
  } else {
    parts.push(
      `${name}: growing the ${head} pigs from ${weightKg} kg to ${best.targetKg} kg over about ${best.days} days is expected to earn ${n0(best.margin)} more than selling them now (${n0(best.marginPerHead)} per head, ${best.marginPerDay === null ? 'n/a' : n0(best.marginPerDay)} per day), after ${n0(best.cash)} of feed and other cash costs and ${Math.round((1 - best.survivorShare) * 100)} percent mortality.`,
    )
  }
  for (const r of rest) {
    parts.push(`${STRATEGY_INFO[r.strategy].name}: ${r.margin >= 0 ? '+' : ''}${n0(r.margin)} over selling now.`)
  }
  parts.push(`The break-even sell-now price is ${n0(score.breakEvenWeanerPrice)} per head: grow out while the price offered for these pigs today is below it, sell when it is above.`)
  if (weightKg <= score.weanerWeightKg) parts.push(`Selling ${score.cashNeutralWeaners} of the ${head} as weaners would pay the grow-out feed of the rest.`)
  const seen = new Map<string, Assumption>()
  for (const r of score.ranked) for (const a of r.assumptions) if (!seen.has(a.key)) seen.set(a.key, a)
  const assumptions = [...seen.values()]
  const lines = assumptions.map((a) => `${a.label}: ${fmtValue(a.value)} ${a.unit} (${a.source}${a.note ? '; ' + a.note : ''})`)
  return { summary: parts.join(' '), lines, assumptions }
}
