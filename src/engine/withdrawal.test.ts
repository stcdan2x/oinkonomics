import { describe, expect, it } from 'vitest'
import { WITHDRAWAL_PRODUCTS, findProduct } from '../knowledge/withdrawal'
import type { FarmEvent } from '../types'
import { earliestSaleDate, saleBlockedBy, withdrawalEnd } from './withdrawal'

const treatment = (id: string, date: string, withdrawalDays: number | null, product = 'Test'): FarmEvent => ({
  id,
  subjectType: 'batch',
  subjectId: 'B1',
  type: 'treatment',
  date,
  data: { product, withdrawalDays },
  updatedAt: '2026-01-01T00:00:00.000Z',
})

describe('withdrawal knowledge table', () => {
  it('carries every product with a numeric figure, its label type and a source', () => {
    expect(WITHDRAWAL_PRODUCTS.length).toBeGreaterThanOrEqual(20)
    for (const p of WITHDRAWAL_PRODUCTS) {
      expect(p.name).toBeTruthy()
      expect(typeof p.days === 'number' || p.days === null).toBe(true)
      expect(['PH label', 'US label', 'extension']).toContain(p.labelType)
      expect(p.source).toMatch(/S\d+/)
    }
    expect(findProduct('Levamisole (Latigo, Univet)')!.days).toBe(30)
    expect(findProduct('Ivermectin 1% injectable (GenVet Ivermec, Univet)')!.days).toBe(28)
    expect(findProduct('nope')).toBeUndefined()
  })
})

describe('withdrawal engine', () => {
  it('withdrawal ends on the last dose date plus the label days', () => {
    expect(withdrawalEnd('2026-06-01', 28)).toBe('2026-06-29')
    expect(withdrawalEnd('2026-06-01', 0)).toBe('2026-06-01')
  })

  it('earliest sale date is the latest withdrawal end across treatments; null without any', () => {
    const events = [treatment('a', '2026-06-01', 28), treatment('b', '2026-06-10', 5), treatment('c', '2026-05-01', 30)]
    expect(earliestSaleDate(events)).toBe('2026-06-29')
    expect(earliestSaleDate([])).toBeNull()
    expect(earliestSaleDate([treatment('d', '2026-06-01', null)])).toBeNull()
  })

  it('names the treatment that blocks a sale date, and clears once past it', () => {
    const events = [treatment('a', '2026-06-01', 28, 'Ivermec'), treatment('b', '2026-06-10', 5, 'Draxxin')]
    const block = saleBlockedBy(events, '2026-06-20')
    expect(block).toMatchObject({ eventId: 'a', product: 'Ivermec', until: '2026-06-29' })
    expect(saleBlockedBy(events, '2026-06-29')).toBeNull()
    expect(saleBlockedBy(events, '2026-07-01')).toBeNull()
  })
})
