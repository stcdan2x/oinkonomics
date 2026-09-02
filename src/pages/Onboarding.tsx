import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { saveFarm } from '../db/farmRepo'
import type { Farm } from '../types'

const today = () => new Date().toISOString().slice(0, 10)

export default function Onboarding({ farm }: { farm: Farm | null }) {
  const editMode = farm !== null
  const [name, setName] = useState(farm?.name ?? '')
  const [location, setLocation] = useState(farm?.location ?? '')
  const [startDate, setStartDate] = useState(farm?.startDate ?? today())
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  async function finish() {
    if (!name.trim()) return setError('Please enter the farm name.')
    if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate)) return setError('Please pick the start date.')
    setError(null)
    await saveFarm({
      name: name.trim(),
      ...(location.trim() ? { location: location.trim() } : {}),
      startDate,
    })
    // justOnboarded: the live query has not re-emitted yet on this render, so
    // App must not bounce straight back here (same pattern as hf-tracker).
    navigate(editMode ? '/settings' : '/', { replace: true, state: { justOnboarded: true } })
  }

  const inputCls =
    'w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base outline-none focus:border-brand-500'

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col px-5 pb-8 pt-8">
      {!editMode && (
        <div className="mb-8 flex flex-col items-center text-center">
          <img src="icon.svg" alt="" className="mb-4 h-20 w-20 rounded-3xl" />
          <h1 className="text-3xl font-bold">Oinkonomics</h1>
          <p className="mt-2 max-w-xs text-slate-500">
            Track your herd, money and feed, and see which way of raising and selling pays best.
          </p>
        </div>
      )}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold">{editMode ? 'Farm profile' : 'Your farm'}</h2>
        <label className="flex flex-col gap-1 text-sm font-medium">
          Farm name
          <input className={inputCls} placeholder="e.g. Dela Cruz Piggery" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          Location <span className="font-normal text-slate-400">(optional)</span>
          <input className={inputCls} placeholder="Barangay, town, province" value={location} onChange={(e) => setLocation(e.target.value)} />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          Records start from
          <input className={inputCls} type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </label>
        <p className="text-sm text-slate-500">
          Amounts are in Philippine pesos. Your data stays on this device; back it up or sync it
          through your Google account later from Settings.
        </p>
      </div>
      <div className="mt-auto pt-6">
        {error && <p className="mb-3 text-sm font-medium text-red-600">{error}</p>}
        <div className="flex gap-3">
          {editMode && (
            <button className="rounded-xl px-5 py-3.5 font-semibold text-slate-500 ring-1 ring-slate-300" onClick={() => navigate('/settings')}>
              Back
            </button>
          )}
          <button className="flex-1 rounded-xl bg-brand-600 py-3.5 font-semibold text-white" onClick={finish}>
            {editMode ? 'Save changes' : 'Start'}
          </button>
        </div>
      </div>
    </div>
  )
}
