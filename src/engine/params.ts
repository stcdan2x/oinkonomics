import { COST_DEFAULTS, GROWTH_DEFAULTS, HERD_DEFAULTS, PRICE_DEFAULTS, type Parameter } from '../knowledge/parameters'

// The engine runs on plain values; every value starts from a sourced knowledge
// Parameter and can be overridden per run. `assumption` turns a value back
// into a labelled, cited line for the recommendation explanation.
type Values<T> = { [K in keyof T]: T[K] extends Parameter<infer V> ? V : never }

const SOURCES = {
  ...GROWTH_DEFAULTS,
  ...COST_DEFAULTS,
  ...PRICE_DEFAULTS,
  gestationDays: HERD_DEFAULTS.gestationDays,
  creepFeedStartDay: HERD_DEFAULTS.creepFeedStartDay,
}

export type EngineParams = Values<typeof SOURCES>
export type ParamKey = keyof EngineParams

export const PARAM_INFO: Record<ParamKey, Parameter<unknown>> = SOURCES

export const PARAM_LABEL: Record<ParamKey, string> = {
  weanerWeightKg: 'Weaner sale weight',
  weanerSaleAgeDays: 'Weaner sale age',
  roasterWeightKg: 'Roaster (lechon) sale weight',
  roasterAgeDays: 'Roaster sale age',
  marketWeightKg: 'Market sale weight',
  marketAgeDays: 'Market sale age',
  weightWindowKg: 'Market weight window without deduction',
  weightWindowDeduction: 'Price deduction outside the window',
  adgNursery: 'Daily gain, nursery',
  adgGrowOut: 'Daily gain, grow-out',
  fcrGrowOut: 'Feed per kg of gain, grow-out',
  fcrNursery: 'Feed per kg of gain, nursery',
  nurseryMortality: 'Mortality, weaner to roaster',
  weanToFinishMortality: 'Mortality, weaner to market',
  weanedPerLitter: 'Piglets weaned per litter',
  littersPerSowYear: 'Litters per sow per year',
  sowFeedKgPerCycle: 'Sow feed per litter cycle',
  pigletFeedKgPerPiglet: 'Piglet feed to weaner sale',
  growOutFeedPricePerKg: 'Grow-out feed price',
  nurseryFeedPricePerKg: 'Nursery feed price',
  sowFeedPricePerKg: 'Sow feed price',
  pigletFeedPricePerKg: 'Piglet feed price',
  otherCostRate: 'Biologics, repairs and sundries',
  fixedOtherPerPig: 'Wages, water and electricity per pig grown',
  breedingCostPerLitter: 'Breeding cost per litter',
  utilitiesPerLitter: 'Utilities per litter',
  labourPerLitter: 'Family labour per litter',
  weanerPerHead: 'Weaner price',
  liveweightPerKg: 'Liveweight price',
  lechonPerKgLive: 'Lechon live price',
  gestationDays: 'Gestation',
  creepFeedStartDay: 'Creep feed start',
}

export function defaultParams(): EngineParams {
  const out = {} as Record<string, unknown>
  for (const [k, p] of Object.entries(SOURCES)) out[k] = p.value
  return out as EngineParams
}

export interface Assumption {
  key: ParamKey
  label: string
  value: unknown
  unit: string
  source: string
  note?: string
}

export function assumption(key: ParamKey, params: EngineParams): Assumption {
  const info = PARAM_INFO[key]
  return { key, label: PARAM_LABEL[key], value: params[key], unit: info.unit, source: info.source, note: info.note }
}

export const assumptions = (keys: ParamKey[], params: EngineParams): Assumption[] => keys.map((k) => assumption(k, params))
