import { describe, expect, it } from 'vitest'
import { SEASONAL_INDEX } from './parameters'

// The row-citation checks live in parameters.research.test.ts (private corpus).
describe('knowledge parameters', () => {
  it('seasonal index has twelve months, neutral where nothing is sourced', () => {
    expect(SEASONAL_INDEX).toHaveLength(12)
    expect(SEASONAL_INDEX[0].value).toBe(1)
    expect(SEASONAL_INDEX[5].value).toBeGreaterThan(1) // June high
    expect(SEASONAL_INDEX[9].value).toBeLessThan(1) // October trough
  })
})
