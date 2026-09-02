import 'fake-indexeddb/auto'
import { beforeEach, describe, expect, it } from 'vitest'
import { db, FARM_ID } from './db'
import { getFarm, saveFarm } from './farmRepo'

const profile = { name: 'Dela Cruz Piggery', location: 'Batangas', startDate: '2026-09-01' }

describe('farm profile', () => {
  beforeEach(async () => {
    await db.farm.clear()
  })

  it('is undefined before onboarding', async () => {
    expect(await getFarm()).toBeUndefined()
  })

  it('saves and reads back the single farm row in PHP', async () => {
    const saved = await saveFarm(profile)
    const stored = await getFarm()
    expect(stored).toEqual(saved)
    expect(stored!.id).toBe(FARM_ID)
    expect(stored!.currency).toBe('PHP')
    expect(stored!.name).toBe('Dela Cruz Piggery')
    expect(stored!.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/)
  })

  it('updates in place, keeping one row and bumping updatedAt', async () => {
    const first = await saveFarm(profile)
    await new Promise((r) => setTimeout(r, 2))
    const second = await saveFarm({ ...profile, location: 'Laguna' })
    expect(second.location).toBe('Laguna')
    expect(second.updatedAt > first.updatedAt).toBe(true)
    expect(await db.farm.count()).toBe(1)
  })
})
