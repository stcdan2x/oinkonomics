import { addMonths, endOfMonth, format, parseISO } from 'date-fns'
import type { ISODate, StrategyId } from '../types'
import { monthOf } from './costing'
import { daysBetween, plusDays } from './dates'
import { assumptions, type Assumption, type EngineParams, type ParamKey } from './params'

// Per-pig economics of one strategy from the pigs' state today (PLAN.md
// section 7; TASK 001 section 4 P6 rules). Money is PHP; weights kg.
export interface PigState {
  head: number
  weightKg: number
}

export interface StrategyProjection {
  strategy: StrategyId
  applicable: boolean // false when the pigs are already past the strategy's sale weight
  targetKg: number
  days: number // to sale from today
  survivorShare: number
  feedKgPerHead: number
  feedCostPerHead: number
  otherCostPerHead: number
  cashPerHead: number // feed + other, paid before the sale
  revenuePerHead: number // after mortality
  valueTodayPerHead: number // what the pig fetches if sold now
  marginPerHead: number // revenue - feed - other - value today
  marginPerDay: number | null
  head: number
  revenue: number
  cash: number
  margin: number
  assumptions: Assumption[]
}

const inWindow = (kg: number, [lo, hi]: [number, number]) => kg >= lo && kg <= hi

// Liveweight price after the trader's deduction outside the 80 to 100 kg window.
export const effectiveLiveweightPrice = (kg: number, p: EngineParams) =>
  p.liveweightPerKg - (inWindow(kg, p.weightWindowKg) ? 0 : p.weightWindowDeduction)

// A weaner is worth the weaner price; a heavier pig is worth its live weight.
export function valueToday(weightKg: number, p: EngineParams): { value: number; keys: ParamKey[] } {
  if (weightKg <= p.weanerWeightKg) return { value: p.weanerPerHead, keys: ['weanerPerHead', 'weanerWeightKg'] }
  return { value: effectiveLiveweightPrice(weightKg, p) * weightKg, keys: ['liveweightPerKg', 'weightWindowKg', 'weightWindowDeduction'] }
}

interface Stage {
  targetKg: number
  fcr: number
  feedPrice: number
  adg: number
  mortality: number
  fixedOther: number
  pricePerHead: (targetKg: number) => number
  keys: ParamKey[]
}

function stage(strategy: StrategyId, p: EngineParams): Stage {
  switch (strategy) {
    case 'sellWeaners':
      return { targetKg: p.weanerWeightKg, fcr: 0, feedPrice: 0, adg: p.adgNursery, mortality: 0, fixedOther: 0, pricePerHead: () => p.weanerPerHead, keys: ['weanerWeightKg', 'weanerPerHead'] }
    case 'growToRoaster':
      return {
        targetKg: p.roasterWeightKg,
        fcr: p.fcrNursery,
        feedPrice: p.nurseryFeedPricePerKg,
        adg: p.adgNursery,
        mortality: p.nurseryMortality,
        fixedOther: 0,
        pricePerHead: (kg) => p.lechonPerKgLive * kg,
        keys: ['roasterWeightKg', 'fcrNursery', 'nurseryFeedPricePerKg', 'adgNursery', 'nurseryMortality', 'otherCostRate', 'lechonPerKgLive'],
      }
    default:
      return {
        targetKg: p.marketWeightKg,
        fcr: p.fcrGrowOut,
        feedPrice: p.growOutFeedPricePerKg,
        adg: p.adgGrowOut,
        mortality: p.weanToFinishMortality,
        fixedOther: p.fixedOtherPerPig,
        pricePerHead: (kg) => effectiveLiveweightPrice(kg, p) * kg,
        keys: ['marketWeightKg', 'fcrGrowOut', 'growOutFeedPricePerKg', 'adgGrowOut', 'weanToFinishMortality', 'otherCostRate', 'fixedOtherPerPig', 'liveweightPerKg', 'weightWindowKg', 'weightWindowDeduction'],
      }
  }
}

export function projectStrategy(strategy: StrategyId, state: PigState, p: EngineParams): StrategyProjection {
  const s = stage(strategy, p)
  const gain = Math.max(0, s.targetKg - state.weightKg)
  const applicable = state.weightKg <= s.targetKg
  const feedKgPerHead = s.fcr * gain
  const feedCostPerHead = feedKgPerHead * s.feedPrice
  const otherCostPerHead = feedCostPerHead > 0 ? p.otherCostRate * feedCostPerHead + s.fixedOther : 0
  const survivorShare = 1 - s.mortality
  const revenuePerHead = survivorShare * s.pricePerHead(s.targetKg)
  const today = valueToday(state.weightKg, p)
  const marginPerHead = revenuePerHead - feedCostPerHead - otherCostPerHead - today.value
  const days = gain > 0 ? Math.round(gain / s.adg) : 0
  const cashPerHead = feedCostPerHead + otherCostPerHead
  const keys = Array.from(new Set<ParamKey>([...s.keys, ...today.keys]))
  return {
    strategy,
    applicable,
    targetKg: s.targetKg,
    days,
    survivorShare,
    feedKgPerHead,
    feedCostPerHead,
    otherCostPerHead,
    cashPerHead,
    revenuePerHead,
    valueTodayPerHead: today.value,
    marginPerHead,
    marginPerDay: days > 0 ? marginPerHead / days : null,
    head: state.head,
    revenue: revenuePerHead * state.head,
    cash: cashPerHead * state.head,
    margin: marginPerHead * state.head,
    assumptions: assumptions(keys, p),
  }
}

// Month-by-month farm projection for a saved scenario: N identical sows on
// one strategy, served on day 0 and every 365 / litters-per-year days after.
export interface ScenarioInput {
  sows: number
  strategy: StrategyId
  startDate: ISODate
  months: number
  startupCost: number
}

export interface MonthRow {
  month: string
  sows: number
  pigsOnHand: number // at month end
  revenue: number
  expenses: number
  net: number
  cumulative: number
}

export interface FarmProjection {
  rows: MonthRow[]
  totals: { revenue: number; expenses: number; net: number }
  peakCapital: number // deepest cumulative deficit, 0 when never negative
  paybackMonth: string | null // first month the cumulative is back at or above 0
  assumptions: Assumption[]
}

const saleAge = (strategy: StrategyId, p: EngineParams) =>
  strategy === 'sellWeaners' ? p.weanerSaleAgeDays : strategy === 'growToRoaster' ? p.roasterAgeDays : p.marketAgeDays

export function projectFarm(input: ScenarioInput, p: EngineParams): FarmProjection {
  const start = parseISO(input.startDate)
  const months = Array.from({ length: input.months }, (_, i) => format(addMonths(start, i), 'yyyy-MM'))
  const horizonDays = daysBetween(input.startDate, format(endOfMonth(addMonths(start, input.months - 1)), 'yyyy-MM-dd'))
  const cycleDays = Math.round(365 / p.littersPerSowYear)
  const n = p.weanedPerLitter
  const sale = saleAge(input.strategy, p)
  const growOut = projectStrategy(input.strategy, { head: n, weightKg: p.weanerWeightKg }, p)
  const pigletFeedDays = Math.max(1, Math.min(sale, p.weanerSaleAgeDays) - p.creepFeedStartDay)
  const growOutDays = Math.max(1, sale - p.weanerSaleAgeDays)

  const revenue = new Map<string, number>()
  const expenses = new Map<string, number>()
  const add = (map: Map<string, number>, day: number, amount: number) => {
    if (day < 0 || day > horizonDays || amount === 0) return
    const m = monthOf(plusDays(input.startDate, day))
    map.set(m, (map.get(m) ?? 0) + amount)
  }

  add(expenses, 0, input.startupCost)
  const sowFeedPerDay = (p.sowFeedKgPerCycle * p.sowFeedPricePerKg) / cycleDays
  for (let d = 0; d <= horizonDays; d++) add(expenses, d, sowFeedPerDay * input.sows)

  const litters: { farrow: number; sale: number }[] = []
  for (let service = 0; service <= horizonDays; service += cycleDays) {
    const farrow = service + p.gestationDays
    litters.push({ farrow, sale: farrow + sale })
    add(expenses, service, p.breedingCostPerLitter * input.sows)
    add(expenses, farrow, (p.utilitiesPerLitter + p.labourPerLitter) * input.sows)
    const pigletFeedPerDay = (n * p.pigletFeedKgPerPiglet * p.pigletFeedPricePerKg) / pigletFeedDays
    for (let i = 0; i < pigletFeedDays; i++) add(expenses, farrow + p.creepFeedStartDay + i, pigletFeedPerDay * input.sows)
    if (input.strategy !== 'sellWeaners') {
      const perDay = (growOut.cash) / growOutDays
      for (let i = 0; i < growOutDays; i++) add(expenses, farrow + p.weanerSaleAgeDays + i, perDay * input.sows)
    }
    add(revenue, farrow + sale, growOut.revenue * input.sows)
  }

  let cumulative = 0
  let paybackMonth: string | null = null
  let wasNegative = false
  let peak = 0
  const rows: MonthRow[] = months.map((month) => {
    const rev = revenue.get(month) ?? 0
    const exp = expenses.get(month) ?? 0
    cumulative += rev - exp
    if (cumulative < 0) wasNegative = true
    if (cumulative < peak) peak = cumulative
    if (wasNegative && cumulative >= 0 && paybackMonth === null) paybackMonth = month
    const dayEnd = daysBetween(input.startDate, format(endOfMonth(parseISO(month + '-01')), 'yyyy-MM-dd'))
    const onHand = litters.filter((l) => l.farrow <= dayEnd && dayEnd < l.sale).length * n * input.sows
    return { month, sows: input.sows, pigsOnHand: onHand, revenue: rev, expenses: exp, net: rev - exp, cumulative }
  })
  const totals = rows.reduce((t, r) => ({ revenue: t.revenue + r.revenue, expenses: t.expenses + r.expenses, net: t.net + r.net }), { revenue: 0, expenses: 0, net: 0 })
  const keys: ParamKey[] = ['littersPerSowYear', 'gestationDays', 'weanedPerLitter', 'sowFeedKgPerCycle', 'sowFeedPricePerKg', 'pigletFeedKgPerPiglet', 'pigletFeedPricePerKg', 'creepFeedStartDay', 'weanerSaleAgeDays', 'breedingCostPerLitter', 'utilitiesPerLitter', 'labourPerLitter']
  return { rows, totals, peakCapital: -peak, paybackMonth, assumptions: [...assumptions(keys, p), ...growOut.assumptions] }
}
