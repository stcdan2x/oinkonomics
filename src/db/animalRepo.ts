import type { Animal, AnimalRole, AnimalStatus, ISODate } from '../types'
import { db } from './db'
import { addEvent, eventsFor, tombstoneEventsFor } from './eventRepo'
import { create, liveAll, softDelete, update, type NewRow } from './repo'

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

// TASK 003 Phase 1 (§7 D1): a breeder marked culled or died by mistake comes
// back active, and the status event goes; a sold animal comes back through
// the sale's undo, which also restores the money.
export async function reactivateAnimal(id: string): Promise<Animal> {
  const animal = await db.animals.get(id)
  if (!animal || animal.deletedAt) throw new Error('Animal not found')
  if (animal.status === 'active') throw new Error(`${animal.tag} is already active`)
  if (animal.status === 'sold') throw new Error(`${animal.tag} was sold: undo the sale to bring it back`)
  return db.transaction('rw', db.animals, db.events, async () => {
    for (const e of await eventsFor('animal', id)) if (e.type === 'cull' || e.type === 'death') await softDelete(db.events, e.id)
    return update(db.animals, id, { status: 'active', statusDate: undefined })
  })
}

// TASK 003 Phase 1 (§7 D2): an animal created by mistake is deleted with its
// events. One with a litter, a sale or a purchase entry is refused with the
// reason: those records rest on it, so they are undone first.
export async function removeAnimal(id: string): Promise<void> {
  const animal = await db.animals.get(id)
  if (!animal || animal.deletedAt) throw new Error('Animal not found')
  const litter = (await liveAll(db.litters)).find((l) => l.sowId === id || l.sireId === id)
  if (litter) throw new Error(`${animal.tag} has a litter (served ${litter.serviceDate}): it stays in the herd history`)
  const sale = (await liveAll(db.sales)).find((s) => s.lines.some((l) => l.animalIds?.includes(id)))
  if (sale) throw new Error(`${animal.tag} has a sale (${sale.date}): undo the sale first`)
  if (animal.purchaseTransactionId) {
    const tx = await db.transactions.get(animal.purchaseTransactionId)
    if (tx && !tx.deletedAt) throw new Error(`${animal.tag} has a purchase entry in the ledger (${tx.date}): delete that entry first`)
  }
  await db.transaction('rw', db.animals, db.events, async () => {
    await softDelete(db.animals, id)
    await tombstoneEventsFor('animal', id)
  })
}
