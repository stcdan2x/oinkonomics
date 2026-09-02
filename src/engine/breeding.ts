import { HERD_DEFAULTS as D } from '../knowledge/parameters'
import type { ISODate, Litter } from '../types'
import { daysBetween, plusDays } from './dates'

export const expectedFarrowDate = (serviceDate: ISODate, gestationDays = D.gestationDays.value) =>
  plusDays(serviceDate, gestationDays)
export const heatCheckDate = (serviceDate: ISODate, day = D.heatCheckDay.value) => plusDays(serviceDate, day)
export const pregCheckDate = (serviceDate: ISODate, day = D.pregCheckDay.value) => plusDays(serviceDate, day)
export const expectedWeanDate = (farrowDate: ISODate, ageDays = D.weaningAgeDays.value) =>
  plusDays(farrowDate, ageDays)
export const expectedRebreedDate = (weanDate: ISODate, days = D.weanToServiceDays.value) =>
  plusDays(weanDate, days)

export type SowStageId =
  | 'open'
  | 'served'
  | 'heatCheckDue'
  | 'pregnant'
  | 'dueSoon'
  | 'overdue'
  | 'lactating'
  | 'weaned'

export type MilestoneType =
  | 'heatCheck'
  | 'pregCheck'
  | 'farrowing'
  | 'weaning'
  | 'rebreed'
  | 'ironShot'
  | 'castration'
  | 'creepFeed'

export interface Milestone {
  type: MilestoneType
  date: ISODate
}

export interface SowStage {
  stage: SowStageId
  next: Milestone | null
}

const DUE_SOON_DAYS = 7

// A litter is open from service until weaning unless it ended without a farrowing.
export const isOpenLitter = (l: Litter) => !l.weanDate && l.outcome !== 'notPregnant' && l.outcome !== 'aborted'

export function sowStage(latest: Litter | null | undefined, today: ISODate): SowStage {
  if (!latest || !isOpenLitter(latest)) {
    if (latest?.weanDate) return { stage: 'weaned', next: { type: 'rebreed', date: expectedRebreedDate(latest.weanDate) } }
    return { stage: 'open', next: null }
  }
  if (latest.farrowDate) {
    return { stage: 'lactating', next: { type: 'weaning', date: expectedWeanDate(latest.farrowDate) } }
  }
  const since = daysBetween(latest.serviceDate, today)
  if (since < D.heatCheckDay.value) return { stage: 'served', next: { type: 'heatCheck', date: heatCheckDate(latest.serviceDate) } }
  if (since <= D.pregCheckDay.value) return { stage: 'heatCheckDue', next: { type: 'pregCheck', date: pregCheckDate(latest.serviceDate) } }
  const toFarrow = daysBetween(today, latest.expectedFarrowDate)
  const next: Milestone = { type: 'farrowing', date: latest.expectedFarrowDate }
  if (toFarrow < 0) return { stage: 'overdue', next }
  if (toFarrow <= DUE_SOON_DAYS) return { stage: 'dueSoon', next }
  return { stage: 'pregnant', next }
}

export interface CalendarItem extends Milestone {
  litterId: string
  sowId: string
}

// Upcoming milestones for every open litter, inclusive window, sorted by
// date then type. Piglet-care items appear once the litter has farrowed.
export function breedingCalendar(litters: Litter[], from: ISODate, to: ISODate): CalendarItem[] {
  const items: CalendarItem[] = []
  for (const l of litters) {
    if (!isOpenLitter(l)) continue
    const add = (type: MilestoneType, date: ISODate) => items.push({ type, date, litterId: l.id, sowId: l.sowId })
    if (l.farrowDate) {
      const [iron1, iron2] = D.ironShotDays.value
      add('ironShot', plusDays(l.farrowDate, iron1))
      add('ironShot', plusDays(l.farrowDate, iron2))
      add('castration', plusDays(l.farrowDate, D.castrationDays.value[1]))
      add('creepFeed', plusDays(l.farrowDate, D.creepFeedStartDay.value))
      const wean = expectedWeanDate(l.farrowDate)
      add('weaning', wean)
      add('rebreed', expectedRebreedDate(wean))
    } else {
      add('heatCheck', heatCheckDate(l.serviceDate))
      add('pregCheck', pregCheckDate(l.serviceDate))
      add('farrowing', l.expectedFarrowDate)
    }
  }
  return items
    .filter((i) => i.date >= from && i.date <= to)
    .sort((a, b) => a.date.localeCompare(b.date) || a.type.localeCompare(b.type) || a.litterId.localeCompare(b.litterId))
}
