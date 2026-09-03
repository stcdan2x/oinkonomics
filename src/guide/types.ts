// Guide articles (TASK 001 section 4, Phase P8 rules). Content lives in
// ./content/*.ts, compiled from research/ and the app rules; the body is the
// markdown subset parsed by ./markdown.ts.

import type { StrategyId } from '../types'

export type GuideSectionId = 'using' | 'start' | 'cycle' | 'feeding' | 'health' | 'housing' | 'market' | 'strategies' | 'records' | 'rules' | 'glossary'

export interface GlossaryTerm {
  term: string
  tagalog?: string
  meaning: string
}

export interface GuideArticle {
  id: string // the route: /guide/:id
  section: GuideSectionId
  title: string
  summary: string
  body: string
  sources: string[] // research/parameters.md row ids (PC-24, GN-08, ...)
  catalog?: number // strategy catalog entry (1 to 11) this article documents
  kpis?: string[] // APP_KPIS ids this article defines
  terms?: GlossaryTerm[]
  prices?: boolean // quotes peso prices: the disclaimer renders under it
}

export const PRICE_DISCLAIMER_ID = 'price-disclaimer'

// The article each batch strategy links to (catalog 1, 2, 3; undecided links to
// the decision rules). Lives here, not in articles.ts, so the pages that need
// it do not pull the article content into the app shell (step 10.0).
export const STRATEGY_ARTICLE: Record<StrategyId, string> = {
  sellWeaners: 'strategy-sell-weaners',
  growToRoaster: 'strategy-grow-to-roaster',
  growToMarket: 'strategy-grow-to-market',
  undecided: 'decision-rules',
}

export const GUIDE_SECTIONS: { id: GuideSectionId; title: string; blurb: string }[] = [
  { id: 'using', title: 'Using the app', blurb: 'How to run the farm on the app, screen by screen, in the order the work happens.' },
  { id: 'start', title: 'How Oinkonomics works', blurb: 'What the app records and how it computes every number it shows.' },
  { id: 'cycle', title: 'Breeding and the production cycle', blurb: 'Heat, service, gestation, farrowing, weaning and the sow year.' },
  { id: 'feeding', title: 'Feeding and growth', blurb: 'Stages, feed phases, gain, conversion and judging target weight.' },
  { id: 'health', title: 'Health and biosecurity', blurb: 'ASF, vaccines, common diseases, withdrawal periods and mortality.' },
  { id: 'housing', title: 'Housing and daily routine', blurb: 'Pens, ventilation, water, waste and the daily, weekly and monthly checklists.' },
  { id: 'market', title: 'Selling and prices', blurb: 'Buyers, pricing units, seasonality and where to find current prices.' },
  { id: 'strategies', title: 'Strategies', blurb: 'The eleven ways to make money from pigs, the decision rules and their risks.' },
  { id: 'records', title: 'Records and KPIs', blurb: 'The standard records, the figures professionals track and their benchmarks.' },
  { id: 'rules', title: 'Permits and tax', blurb: 'Registrations, movement rules, welfare law and tax in plain language.' },
  { id: 'glossary', title: 'Glossary', blurb: 'English and Tagalog terms used in the app and in the trade.' },
]

// The figures the app computes and shows (dashboard tiles, Reports, Costing,
// batch page, Plan). Every one must be defined by a Guide article (P8 verify).
export const APP_KPIS: { id: string; label: string }[] = [
  { id: 'pigsOnFarm', label: 'Pigs on farm (heads by stage)' },
  { id: 'sowsDue', label: 'Sows due to farrow' },
  { id: 'batchesReady', label: 'Batches ready to sell' },
  { id: 'cashOnHand', label: 'Cash on hand' },
  { id: 'revenue', label: 'Revenue' },
  { id: 'expenses', label: 'Expenses' },
  { id: 'netIncome', label: 'Net income (profit)' },
  { id: 'netCash', label: 'Net cash and closing balance' },
  { id: 'feedDaysRemaining', label: 'Feed days remaining' },
  { id: 'deaths', label: 'Deaths (mortality)' },
  { id: 'headDays', label: 'Head-days' },
  { id: 'allocatedCost', label: 'Allocated shared costs' },
  { id: 'pigletValue', label: 'Piglet transfer value' },
  { id: 'batchProfit', label: 'Batch profit' },
  { id: 'costPerKgGain', label: 'Cost per kg gained' },
  { id: 'costPerKgSold', label: 'Cost per kg sold' },
  { id: 'costPerWeanedPiglet', label: 'Cost per weaned piglet' },
  { id: 'breakEvenPerKg', label: 'Break-even per kg' },
  { id: 'breakEvenPerHead', label: 'Break-even per head' },
  { id: 'roi', label: 'ROI' },
  { id: 'payback', label: 'Payback' },
  { id: 'adg', label: 'Average daily gain' },
  { id: 'estimatedWeight', label: 'Estimated weight today and date to target' },
  { id: 'saleAllowedFrom', label: 'Sale allowed from (withdrawal)' },
  { id: 'marginPerHead', label: 'Margin per head and per day' },
  { id: 'cashRequired', label: 'Cash required' },
  { id: 'breakEvenWeanerPrice', label: 'Break-even weaner price' },
  { id: 'breakEvenLechonPrice', label: 'Break-even lechon live price' },
  { id: 'cashNeutralSplit', label: 'Cash-neutral split' },
  { id: 'peakCapital', label: 'Peak capital needed' },
  { id: 'paybackMonth', label: 'Payback month (scenario)' },
]
