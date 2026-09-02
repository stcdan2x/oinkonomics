import type { Farm } from '../types'
import { db, FARM_ID } from './db'
import { now } from './repo'

export type FarmProfile = Omit<Farm, 'id' | 'currency' | 'updatedAt' | 'deletedAt'>

export async function getFarm(): Promise<Farm | undefined> {
  return db.farm.get(FARM_ID)
}

// Single row, fixed id; currency is PHP for every farm in v1 (PLAN.md section 11).
export async function saveFarm(data: FarmProfile): Promise<Farm> {
  const farm: Farm = { ...data, id: FARM_ID, currency: 'PHP', updatedAt: now(), deletedAt: null }
  await db.farm.put(farm)
  return farm
}
