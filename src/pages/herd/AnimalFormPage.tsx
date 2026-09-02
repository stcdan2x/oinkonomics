import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/PageHeader'
import { btnPrimary, btnSecondary, Card, ErrorText, Field, inputCls } from '../../components/ui'
import { addAnimal } from '../../db/animalRepo'
import { todayISO } from '../../engine/dates'
import type { AnimalRole, Sex } from '../../types'
import { ROLE_LABEL } from './labels'

const FIXED_SEX: Partial<Record<AnimalRole, Sex>> = { sow: 'female', gilt: 'female', boar: 'male' }

export default function AnimalFormPage() {
  const [tag, setTag] = useState('')
  const [role, setRole] = useState<AnimalRole>('sow')
  const [sex, setSex] = useState<Sex>('female')
  const [breed, setBreed] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [source, setSource] = useState<'bought' | 'born'>('bought')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  function pickRole(r: AnimalRole) {
    setRole(r)
    if (FIXED_SEX[r]) setSex(FIXED_SEX[r]!)
  }

  async function save() {
    try {
      const a = await addAnimal({ tag, role, sex, breed: breed || undefined, birthDate: birthDate || undefined, source, notes: notes || undefined })
      navigate(`/herd/animals/${a.id}`, { replace: true })
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }

  return (
    <>
      <PageHeader title="Add animal" subtitle="Sows, gilts and boars get their own card; growers only when one pig needs its own record" />
      <Card>
        <div className="flex flex-col gap-3">
          <Field label="Tag or name"><input className={inputCls} placeholder="e.g. S-01 or Inday" value={tag} onChange={(e) => setTag(e.target.value)} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Role">
              <select className={inputCls} value={role} onChange={(e) => pickRole(e.target.value as AnimalRole)}>
                {(Object.keys(ROLE_LABEL) as AnimalRole[]).map((r) => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}
              </select>
            </Field>
            <Field label="Sex">
              <select className={inputCls} value={sex} disabled={!!FIXED_SEX[role]} onChange={(e) => setSex(e.target.value as Sex)}>
                <option value="female">Female</option><option value="male">Male</option>
              </select>
            </Field>
            <Field label="Breed" hint="(optional)"><input className={inputCls} value={breed} onChange={(e) => setBreed(e.target.value)} /></Field>
            <Field label="Birth date" hint="(optional)"><input type="date" className={inputCls} max={todayISO()} value={birthDate} onChange={(e) => setBirthDate(e.target.value)} /></Field>
            <Field label="Source">
              <select className={inputCls} value={source} onChange={(e) => setSource(e.target.value as 'bought' | 'born')}>
                <option value="bought">Bought</option><option value="born">Born here</option>
              </select>
            </Field>
          </div>
          <Field label="Notes" hint="(optional)"><input className={inputCls} value={notes} onChange={(e) => setNotes(e.target.value)} /></Field>
          <ErrorText error={error} />
          <div className="flex gap-2">
            <button className={btnSecondary} onClick={() => navigate(-1)}>Cancel</button>
            <button className={`flex-1 ${btnPrimary}`} onClick={save}>Save</button>
          </div>
        </div>
      </Card>
    </>
  )
}
