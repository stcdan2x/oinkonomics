// Engine defaults with their evidence rows in research/parameters.md
// (ids like PC-24 point at the row; the row cites the primary source).
// P3 subset; P6 (knowledge modules) extends this into the full parameter set.

export interface Parameter<T = number> {
  value: T
  unit: string
  source: string // research row ids
  note?: string
}

export const HERD_DEFAULTS = {
  gestationDays: { value: 115, unit: 'days', source: 'PC-24', note: '115 to 116, most 110 to 117' },
  heatCheckDay: { value: 21, unit: 'days after service', source: 'PC-26, PC-09', note: 'return-to-heat window 18 to 24' },
  heatCheckWindow: { value: [18, 24] as [number, number], unit: 'days after service', source: 'PC-26' },
  pregCheckDay: { value: 28, unit: 'days after service', source: 'PC-27', note: 'ultrasound from day 27, over 95 pct accurate' },
  weaningAgeDays: { value: 28, unit: 'days', source: 'PC-46, PC-47, PC-45', note: 'PH commercial 27.7 d; welfare code 30 d; commercial benchmark 21 d' },
  weanToServiceDays: { value: 5, unit: 'days', source: 'PC-63', note: '3 to 7; allow 7 for detection' },
  estrousCycleDays: { value: 21, unit: 'days', source: 'PC-09', note: '18 to 24' },
  ironShotDays: { value: [3, 14] as [number, number], unit: 'days of age', source: 'HB-70, HB-69', note: '1 mL IM each; or 200 mg once at day 1 to 3' },
  castrationDays: { value: [3, 7] as [number, number], unit: 'days of age', source: 'PC-90' },
  creepFeedStartDay: { value: 14, unit: 'days of age', source: 'PC-62' },
  preSaleSegregationDays: { value: 15, unit: 'days before transport', source: 'HB-43' },
  minWeaningWeightKg: { value: 6, unit: 'kg', source: 'PC-48' },
  marketLiveWeightKg: { value: 90, unit: 'kg', source: 'GN-08', note: 'typical PH market liveweight; average sold 92 kg (2018)' },
} satisfies Record<string, Parameter<number> | Parameter<[number, number]>>

// P6 engine defaults (PLAN.md section 7; research/business-models-and-strategies.md
// "Decision rules"). Every value is overridable per run from the Plan pages.
export const GROWTH_DEFAULTS = {
  weanerWeightKg: { value: 12, unit: 'kg', source: 'BM-02, GN-04', note: 'trade 10 to 15 kg; about 12 kg at 2 months' },
  weanerSaleAgeDays: { value: 60, unit: 'days of age', source: 'BM-02', note: 'roadmap schedule: about 12 kg at 2 months' },
  roasterWeightKg: { value: 25, unit: 'kg', source: 'BM-59, GN-10', note: 'large lechon band 20 to 25 kg live' },
  roasterAgeDays: { value: 83, unit: 'days of age', source: 'GN-35', note: 'B-MEG schedule 25 kg at day 83; PIC 22.5 kg at day 63' },
  marketWeightKg: { value: 90, unit: 'kg', source: 'GN-08, RK-40', note: 'average sold 92 kg (2018); buyers want 80 to 100' },
  marketAgeDays: { value: 154, unit: 'days of age', source: 'GN-33', note: 'midpoint of 140 to 168 at 650 g ADG' },
  weightWindowKg: { value: [80, 100] as [number, number], unit: 'kg', source: 'PM-19, BM-79', note: 'no trader deduction inside the window' },
  weightWindowDeduction: { value: 5, unit: 'PHP per kg outside the window', source: 'PM-20' },
  adgNursery: { value: 0.487, unit: 'kg per day', source: 'GN-13', note: 'nursery, good; average 0.473' },
  adgGrowOut: { value: 0.65, unit: 'kg per day', source: 'GN-19, GN-20', note: 'DA feed budget; national average 0.561 (GN-17)' },
  fcrGrowOut: { value: 2.65, unit: 'kg feed per kg gain', source: 'BM-09', note: '206.4 kg for 78 kg of gain (12 to 90 kg); PH national 3.19, small farms 3.3' },
  fcrNursery: { value: 25 / 13, unit: 'kg feed per kg gain', source: 'BM-60', note: 'derived: 25 kg of pre-starter and starter feed from a 12 kg weaner to 25 kg' },
  nurseryMortality: { value: 0.02, unit: 'fraction', source: 'RK-34', note: '1.5 to 3 percent' },
  weanToFinishMortality: { value: 0.045, unit: 'fraction', source: 'RK-36', note: '3.5 to 7 percent; PH growing herd 9.18 percent (RK-38)' },
  weanedPerLitter: { value: 8.47, unit: 'piglets', source: 'PC-54', note: 'PH commercial; smallholder about 7.1 (PC-39, PC-58); roadmap budget 10' },
  littersPerSowYear: { value: 2.0, unit: 'litters', source: 'BM-11, PC-64', note: 'roadmap litter index 2.0; commercial 2.08; PH smallholder 1.2 to 1.8 (PC-66)' },
  sowFeedKgPerCycle: { value: 468, unit: 'kg per litter', source: 'GN-54', note: '413 kg plus 55 kg for 27.5 lost days' },
  pigletFeedKgPerPiglet: { value: 11.16, unit: 'kg per piglet', source: 'BM-03', note: 'booster 1.7 kg plus pre-starter 9.46 kg to 2 months' },
} satisfies Record<string, Parameter<number> | Parameter<[number, number]>>

export const COST_DEFAULTS = {
  growOutFeedPricePerKg: { value: 36.55, unit: 'PHP per kg', source: 'BM-06', note: 'dealer quote, July 2026 (secondary); 25.0 in 2022 (BM-05), 49.45 online (BM-07); enter your bag price' },
  nurseryFeedPricePerKg: { value: 43.1, unit: 'PHP per kg', source: 'GN-59, BM-06', note: 'derived: 2022 pre-starter and starter midpoint 29.5, scaled x1.46; feeds the weaner-to-roaster stage' },
  sowFeedPricePerKg: { value: 32.3, unit: 'PHP per kg', source: 'BM-11, BM-06', note: 'derived: 2022 sow feed 10,356 / 468 kg = 22.1, scaled x1.46 (36.55 / 25.0) as BM-93 does' },
  pigletFeedPricePerKg: { value: 47.3, unit: 'PHP per kg', source: 'BM-03, BM-06', note: 'derived: 2022 piglet feed 361 / 11.16 kg = 32.35, scaled x1.46' },
  otherCostRate: { value: 0.11, unit: 'fraction of feed cost', source: 'RK-48, RK-49, RK-50', note: 'biologics 3 + repairs 3 + sundries 5 percent' },
  fixedOtherPerPig: { value: 487.5, unit: 'PHP per pig grown', source: 'BM-10', note: 'wages 87.50 + water and electricity 400, roadmap finisher column' },
  breedingCostPerLitter: { value: 1450, unit: 'PHP per litter', source: 'BM-13', note: '2 services x 725 (midpoint of village AI 200 and private AI 1,250)' },
  utilitiesPerLitter: { value: 1000, unit: 'PHP per litter', source: 'BM-14', note: 'half of the 1,950 per 10-pig cycle' },
  labourPerLitter: { value: 3000, unit: 'PHP per litter', source: 'BM-15', note: 'family labour, non-cash; set to 0 to leave it out' },
} satisfies Record<string, Parameter<number>>

export const PRICE_DEFAULTS = {
  weanerPerHead: { value: 2500, unit: 'PHP per head', source: 'BM-01, RK-64', note: 'roadmap budget; Cotabato survey 2,586 (2026-04); roadmap text 3,000 to 4,000' },
  liveweightPerKg: { value: 172.62, unit: 'PHP per kg liveweight', source: 'BM-102, PM-01', note: 'PSA Household farmgate, June 2026; trader quotes 105 to 150 in surplus regions (PM-07)' },
  lechonPerKgLive: { value: 172.62, unit: 'PHP per kg liveweight', source: 'PM-01, BM-61', note: 'no primary source for what lechoneros pay per live kg; default equals the market price (no premium); enter the roaster offer' },
} satisfies Record<string, Parameter<number>>

// Ratio of the month's farmgate price to the annual mean (PSA Household series,
// 2022 to 2025). Months with no sourced index are neutral (1.0).
const seasonal = (value: number, note: string): Parameter<number> => ({ value, unit: 'ratio to annual mean', source: 'PM-36, PM-37, PM-38', note })
export const SEASONAL_INDEX: Parameter<number>[] = [
  seasonal(1, 'January: no index sourced, neutral'),
  seasonal(1, 'February: no index sourced, neutral'),
  seasonal(1.038, 'March 1.038'),
  seasonal(1.035, 'April: midpoint of the March to June band 1.02 to 1.05'),
  seasonal(1.032, 'May 1.032'),
  seasonal(1.048, 'June 1.048'),
  seasonal(1, 'July: no index sourced, neutral'),
  seasonal(1, 'August: no index sourced, neutral'),
  seasonal(1, 'September: no index sourced, neutral'),
  seasonal(0.951, 'October 0.951'),
  seasonal(0.952, 'November 0.952'),
  seasonal(0.992, 'December 0.992 (2022 to 2025 mean; uplift in 3 of 7 years only)'),
]
