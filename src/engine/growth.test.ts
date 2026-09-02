import { describe, expect, it } from 'vitest'
import { adg, dateToTarget, daysToTarget, projectedWeight } from './growth'

const w = (date: string, kg: number) => ({ date, kg })

describe('growth', () => {
  it('ADG is (last - first) / days across the sorted weights, in kg/day', () => {
    expect(adg([w('2026-01-31', 23), w('2026-01-01', 8)])).toBeCloseTo(0.5, 6)
    expect(adg([w('2026-01-01', 8)])).toBeNull()
    expect(adg([w('2026-01-01', 8), w('2026-01-01', 9)])).toBeNull()
    expect(adg([])).toBeNull()
  })

  it('projects weight forward from the last weighing', () => {
    expect(projectedWeight(w('2026-01-31', 23), 0.5, '2026-03-02')).toBeCloseTo(38, 6)
    expect(projectedWeight(w('2026-01-31', 23), 0.5, '2026-01-31')).toBe(23)
  })

  it('days and date to a target weight; null when not growing or already there', () => {
    expect(daysToTarget(23, 90, 0.8)).toBe(84)
    expect(daysToTarget(90, 90, 0.8)).toBe(0)
    expect(daysToTarget(95, 90, 0.8)).toBe(0)
    expect(daysToTarget(23, 90, 0)).toBeNull()
    expect(daysToTarget(23, 90, null)).toBeNull()
    expect(dateToTarget(w('2026-01-31', 23), 90, 0.8)).toBe('2026-04-25')
    expect(dateToTarget(w('2026-01-31', 23), 90, null)).toBeNull()
  })
})
