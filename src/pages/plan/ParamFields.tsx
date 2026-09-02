import { Field, inputCls } from '../../components/ui'
import { PARAM_INFO, PARAM_LABEL, type EngineParams, type ParamKey } from '../../engine/params'

export type NumericKey = Exclude<ParamKey, 'weightWindowKg'>

// Editable engine parameters: the page keeps strings, the engine gets numbers.
export type ParamStrings = Partial<Record<NumericKey, string>>

export function stringsFrom(params: EngineParams, keys: NumericKey[]): ParamStrings {
  const out: ParamStrings = {}
  for (const k of keys) out[k] = String(params[k])
  return out
}

export function overridesFrom(strings: ParamStrings): Partial<EngineParams> {
  const out: Partial<EngineParams> = {}
  for (const [k, v] of Object.entries(strings)) {
    const n = Number(v)
    if (v !== undefined && v.trim() !== '' && Number.isFinite(n)) (out as Record<string, number>)[k] = n
  }
  return out
}

export default function ParamFields({ keys, values, onChange }: { keys: NumericKey[]; values: ParamStrings; onChange: (v: ParamStrings) => void }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {keys.map((k) => (
        <Field key={k} label={PARAM_LABEL[k]} hint={PARAM_INFO[k].unit}>
          <input
            type="number"
            inputMode="decimal"
            step="any"
            className={inputCls}
            value={values[k] ?? ''}
            onChange={(e) => onChange({ ...values, [k]: e.target.value })}
          />
        </Field>
      ))}
    </div>
  )
}
