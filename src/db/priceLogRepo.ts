import { isValid, parseISO } from 'date-fns'
import type { EngineParams, ParamKey } from '../engine/params'
import type { PriceItem, PriceObservation } from '../types'
import { db } from './db'
import { create, softDelete, type NewRow } from './repo'

export const PRICE_ITEMS: PriceItem[] = ['pigletPerHead', 'liveweightPerKg', 'lechonPerHead', 'feedBag']

export const PRICE_ITEM_LABEL: Record<PriceItem, string> = {
  pigletPerHead: 'Weaner (biik), per head',
  liveweightPerKg: 'Market hog, per kg liveweight',
  lechonPerHead: 'Lechon-size pig, per head (live)',
  feedBag: 'Grower feed, per 50 kg bag',
}

export const FEED_BAG_KG = 50 // GN-63: grower feed is sold in 50 kg bags

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

export type PriceInput = NewRow<PriceObservation>

export function validatePrice(input: PriceInput): void {
  if (!ISO_DATE.test(input.date) || !isValid(parseISO(input.date))) throw new Error('Date must be a valid YYYY-MM-DD date')
  if (!PRICE_ITEMS.includes(input.item)) throw new Error('Unknown price item')
  if (!Number.isFinite(input.value) || input.value <= 0) throw new Error('Value must be more than 0')
}

export async function recordPrice(input: PriceInput): Promise<PriceObservation> {
  validatePrice(input)
  return create(db.priceLog, { ...input, market: input.market?.trim() || undefined, note: input.note?.trim() || undefined })
}

const newestFirst = (a: PriceObservation, b: PriceObservation) => b.date.localeCompare(a.date) || b.updatedAt.localeCompare(a.updatedAt)

export async function listPrices(item?: PriceItem): Promise<PriceObservation[]> {
  const rows = item ? await db.priceLog.where('item').equals(item).toArray() : await db.priceLog.toArray()
  return rows.filter((o) => !o.deletedAt).sort(newestFirst)
}

// The latest dated observation per item (PLAN.md section 7 price input).
export async function latestPrices(): Promise<Map<PriceItem, PriceObservation>> {
  const out = new Map<PriceItem, PriceObservation>()
  for (const o of await listPrices()) if (!out.has(o.item)) out.set(o.item, o)
  return out
}

export async function removePrice(id: string): Promise<void> {
  await softDelete(db.priceLog, id)
}

export interface AppliedPrice {
  key: ParamKey
  observation: PriceObservation
}

// Overlays the latest observations on the engine parameters: piglet per head
// -> weaner price; liveweight per kg as is; lechon per head / roaster weight
// -> lechon live price per kg; feed bag / 50 kg -> grow-out feed price per kg.
export function paramsFromPrices(latest: Map<PriceItem, PriceObservation>, base: EngineParams): { params: EngineParams; applied: AppliedPrice[] } {
  const params = { ...base }
  const applied: AppliedPrice[] = []
  const piglet = latest.get('pigletPerHead')
  if (piglet) {
    params.weanerPerHead = piglet.value
    applied.push({ key: 'weanerPerHead', observation: piglet })
  }
  const live = latest.get('liveweightPerKg')
  if (live) {
    params.liveweightPerKg = live.value
    applied.push({ key: 'liveweightPerKg', observation: live })
  }
  const lechon = latest.get('lechonPerHead')
  if (lechon) {
    params.lechonPerKgLive = lechon.value / base.roasterWeightKg
    applied.push({ key: 'lechonPerKgLive', observation: lechon })
  }
  const bag = latest.get('feedBag')
  if (bag) {
    params.growOutFeedPricePerKg = bag.value / FEED_BAG_KG
    applied.push({ key: 'growOutFeedPricePerKg', observation: bag })
  }
  return { params, applied }
}
