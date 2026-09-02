import { addDays, differenceInCalendarDays, format, parseISO } from 'date-fns'
import type { ISODate } from '../types'

export const toISODate = (d: Date): ISODate => format(d, 'yyyy-MM-dd')
export const todayISO = (): ISODate => toISODate(new Date())
export const plusDays = (date: ISODate, n: number): ISODate => toISODate(addDays(parseISO(date), n))
// Calendar days from `from` to `to`; negative when `to` is earlier.
export const daysBetween = (from: ISODate, to: ISODate): number =>
  differenceInCalendarDays(parseISO(to), parseISO(from))
