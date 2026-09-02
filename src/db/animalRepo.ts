import type { Animal, AnimalRole, AnimalStatus, ISODate } from '../types'
import { db } from './db'
import { addEvent } from './eventRepo'
import { create, liveAll, update, type NewRow } from './repo'

export type NewAnimal = Omit<NewRow<Animal>, 'status' | 'statusDate'> & { status?: AnimalStatus }

const BREEDER_ROLES: AnimalRole[] = ['sow', 'gilt', 'boar']

// Tags are the farm's own labels (ear tag, notch, name); they must be unique
// among live animals so a card is never ambiguous. Comparison ignores case.
export async function addAnimal(data: NewAnimal): Promise<Animal> {
  const tag = data.tag.trim()
  if (!tag) throw new Error('A tag is required')
  const clash = (await liveAll(db.animals)).find((a) => a.tag.toLowerCase() === tag.toLowerCase())
  if (clash) throw new Error(`Tag ${clash.tag} is already in use`)
  return create(db.animals, { ...data, tag, status: data.status ?? 'active' })
}

export async function listAnimals(
  role?: AnimalRole,
  opts: { includeInactive?: boolean } = {},
): Promise<Animal[]> {
  const rows = await liveAll(db.animals)
  return rows
    .filter((a) => (role ? a.role === role : true))
    .filter((a) => (opts.includeInactive ? true : a.status === 'active'))
    .sort((a, b) => a.tag.localeCompare(b.tag, undefined, { numeric: true }))
}

export async function listBreeders(): Promise<Animal[]> {
  return (await listAnimals()).filter((a) => BREEDER_ROLES.includes(a.role))
}

export async function setAnimalStatus(id: string, status: AnimalStatus, date: ISODate, note?: string): Promise<Animal> {
  const animal = await update(db.animals, id, { status, statusDate: date })
  if (status === 'culled' || status === 'dead') {
    await addEvent({ subjectType: 'animal', subjectId: id, type: status === 'culled' ? 'cull' : 'death', date, data: { note: note ?? null } })
  }
  return animal
}
