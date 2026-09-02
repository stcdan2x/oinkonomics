import type { StrategyId } from '../types'
import type { EngineParams } from './params'
import { projectStrategy, type PigState } from './projection'
import { SCORED } from './strategy'

// PLAN.md section 7: margin at sale price -10 and -20 percent and feed price
// +10 percent. "Sale price" is the liveweight and lechon price; the weaner
// price is the yardstick (value today) and stays put.
export interface SensitivityCase {
  id: 'priceMinus10' | 'priceMinus20' | 'feedPlus10'
  label: string
  apply: (p: EngineParams) => EngineParams
}

const scalePrices = (p: EngineParams, f: number): EngineParams => ({ ...p, liveweightPerKg: p.liveweightPerKg * f, lechonPerKgLive: p.lechonPerKgLive * f })
const scaleFeed = (p: EngineParams, f: number): EngineParams => ({ ...p, growOutFeedPricePerKg: p.growOutFeedPricePerKg * f, nurseryFeedPricePerKg: p.nurseryFeedPricePerKg * f })

export const SENSITIVITY_CASES: SensitivityCase[] = [
  { id: 'priceMinus10', label: 'Sale price -10%', apply: (p) => scalePrices(p, 0.9) },
  { id: 'priceMinus20', label: 'Sale price -20%', apply: (p) => scalePrices(p, 0.8) },
  { id: 'feedPlus10', label: 'Feed price +10%', apply: (p) => scaleFeed(p, 1.1) },
]

export type SensitivityMargins = { base: number } & Record<SensitivityCase['id'], number>

export interface SensitivityRow {
  strategy: StrategyId
  applicable: boolean
  margins: SensitivityMargins
}

export function sensitivity(state: PigState, p: EngineParams): SensitivityRow[] {
  return SCORED.map((strategy) => {
    const base = projectStrategy(strategy, state, p)
    const margins = { base: base.margin } as SensitivityMargins
    for (const c of SENSITIVITY_CASES) margins[c.id] = projectStrategy(strategy, state, c.apply(p)).margin
    return { strategy, applicable: base.applicable, margins }
  })
}
