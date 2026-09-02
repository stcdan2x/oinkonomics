import { useSearchParams } from 'react-router-dom'
import { todayISO } from '../engine/dates'
import { periodPresets, type Period } from '../engine/finance'
import { inputCls } from './ui'

const PRESETS: { id: keyof ReturnType<typeof periodPresets>; label: string }[] = [
  { id: 'thisMonth', label: 'This month' },
  { id: 'lastMonth', label: 'Last month' },
  { id: 'thisQuarter', label: 'This quarter' },
  { id: 'thisYear', label: 'This year' },
  { id: 'all', label: 'All time' },
]

// The period lives in the URL (?from=&to=) so it survives tab changes and reloads.
export function usePeriod(): [Period, (p: Period) => void, string] {
  const [params, setParams] = useSearchParams()
  const presets = periodPresets(todayISO())
  const from = params.get('from') || presets.thisMonth.from
  const to = params.get('to') || presets.thisMonth.to
  const set = (p: Period) => setParams({ from: p.from, to: p.to }, { replace: true })
  return [{ from, to }, set, `?from=${from}&to=${to}`]
}

export default function PeriodPicker({ period, onChange }: { period: Period; onChange: (p: Period) => void }) {
  const presets = periodPresets(todayISO())
  return (
    <div className="mx-4 mb-3 space-y-2">
      <div className="flex gap-1 overflow-x-auto">
        {PRESETS.map((p) => {
          const active = presets[p.id].from === period.from && presets[p.id].to === period.to
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onChange(presets[p.id])}
              className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${active ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'}`}
            >
              {p.label}
            </button>
          )
        })}
      </div>
      <div className="flex items-center gap-2 text-sm">
        <input type="date" className={`${inputCls} min-w-0`} value={period.from} max={period.to} onChange={(e) => e.target.value && onChange({ ...period, from: e.target.value })} aria-label="From" />
        <span className="text-slate-400">to</span>
        <input type="date" className={`${inputCls} min-w-0`} value={period.to} min={period.from} onChange={(e) => e.target.value && onChange({ ...period, to: e.target.value })} aria-label="To" />
      </div>
    </div>
  )
}
