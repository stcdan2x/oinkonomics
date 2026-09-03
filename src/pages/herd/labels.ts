import type { MilestoneType, SowStageId } from '../../engine/breeding'
import type { AnimalRole, BuyerType, EventType, StrategyId } from '../../types'

export const STAGE_LABEL: Record<SowStageId, string> = {
  open: 'Open',
  served: 'Served',
  heatCheckDue: 'Heat check due',
  pregnant: 'Pregnant',
  dueSoon: 'Due soon',
  overdue: 'Overdue',
  lactating: 'Lactating',
  weaned: 'Weaned',
}

export const STAGE_TONE: Record<SowStageId, 'brand' | 'slate' | 'amber' | 'red' | 'green'> = {
  open: 'slate',
  served: 'brand',
  heatCheckDue: 'amber',
  pregnant: 'green',
  dueSoon: 'amber',
  overdue: 'red',
  lactating: 'brand',
  weaned: 'slate',
}

export const MILESTONE_LABEL: Record<MilestoneType, string> = {
  heatCheck: 'Heat check (return to heat?)',
  pregCheck: 'Pregnancy check',
  farrowing: 'Farrowing due',
  weaning: 'Weaning due',
  rebreed: 'Rebreed (watch for heat)',
  ironShot: 'Iron shot',
  castration: 'Castrate by today',
  creepFeed: 'Start creep feed',
}

export const ROLE_LABEL: Record<AnimalRole, string> = {
  sow: 'Sow',
  gilt: 'Gilt',
  boar: 'Boar',
  piglet: 'Piglet',
  grower: 'Grower',
  finisher: 'Finisher',
}

export const STRATEGY_LABEL: Record<StrategyId, string> = {
  undecided: 'Undecided',
  sellWeaners: 'Sell as weaners (biik)',
  growToRoaster: 'Grow to roaster (lechon) size',
  growToMarket: 'Grow to market weight',
}

export const BUYER_LABEL: Record<BuyerType, string> = {
  viajero: 'Viajero (trader)',
  roaster: 'Lechonero / roaster',
  market: 'Market / slaughterhouse',
  direct: 'Direct to consumer',
  other: 'Other',
}

export const EVENT_LABEL: Record<EventType, string> = {
  heat: 'Heat',
  service: 'Service',
  pregCheck: 'Pregnancy check',
  farrowing: 'Farrowing',
  weaning: 'Weaning',
  weight: 'Weighing',
  vaccination: 'Vaccination',
  deworming: 'Deworming',
  treatment: 'Treatment',
  ironShot: 'Iron shot',
  castration: 'Castration',
  transfer: 'Transfer',
  death: 'Death',
  cull: 'Cull',
  sale: 'Sale',
  note: 'Note',
}

// A litter closed without a farrowing (TASK 004 G3): the outcome id is stored
// on the litter and its close note; the pages show the form's own wording.
export const OUTCOME_LABEL: Record<'notPregnant' | 'aborted', string> = {
  notPregnant: 'Returned to heat / not pregnant',
  aborted: 'Aborted',
}
