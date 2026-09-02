import { isValid, parseISO } from 'date-fns'
import { defaultParams, type EngineParams } from '../engine/params'
import { projectFarm, type FarmProjection } from '../engine/projection'
import type { Scenario, StrategyId } from '../types'
import { db } from './db'
import { create, now, softDelete } from './repo'

// A saved scenario is a farm projection input (PLAN.md section 7): N sows on
// one strategy from a start date, over 12 to 36 months, with any parameter
// overrides on top of the knowledge defaults.
export interface ScenarioParams {
  sows: number
  startDate: string
  months: number
  startupCost: number
  overrides: Partial<EngineParams>
}

export interface ScenarioInput extends ScenarioParams {
  name: string
  strategy: StrategyId
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

export function validateScenario(input: ScenarioInput): void {
  if (!input.name.trim()) throw new Error('Name is required')
  if (!Number.isInteger(input.sows) || input.sows < 1) throw new Error('Sows must be a whole number of at least 1')
  if (!Number.isInteger(input.months) || input.months < 12 || input.months > 36) throw new Error('Months must be between 12 and 36')
  if (!ISO_DATE.test(input.startDate) || !isValid(parseISO(input.startDate))) throw new Error('Start date must be a valid YYYY-MM-DD date')
  if (!Number.isFinite(input.startupCost) || input.startupCost < 0) throw new Error('Startup cost cannot be negative')
}

export async function saveScenario(input: ScenarioInput): Promise<Scenario> {
  validateScenario(input)
  const { name, strategy, ...params } = input
  return create(db.scenarios, { name: name.trim(), strategy, params: { ...params }, createdAt: now() })
}

export async function listScenarios(): Promise<Scenario[]> {
  const rows = await db.scenarios.toArray()
  return rows.filter((s) => !s.deletedAt).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export async function removeScenario(id: string): Promise<void> {
  await softDelete(db.scenarios, id)
}

export const scenarioInput = (s: Scenario): ScenarioParams => s.params as unknown as ScenarioParams

export function scenarioParams(s: Scenario): EngineParams {
  return { ...defaultParams(), ...scenarioInput(s).overrides }
}

export function runScenario(s: Scenario): FarmProjection {
  const { sows, startDate, months, startupCost } = scenarioInput(s)
  return projectFarm({ sows, strategy: s.strategy, startDate, months, startupCost }, scenarioParams(s))
}
