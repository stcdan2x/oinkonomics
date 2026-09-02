import { saleBlockedBy } from '../engine/withdrawal'
import type { BuyerType, ISODate, Sale, SaleLine } from '../types'
import { changeHeadCount } from './batchRepo'
import { db } from './db'
import { addEvent, eventsFor } from './eventRepo'
import { create, liveAll, update } from './repo'

export interface SaleInput {
  date: ISODate
  buyerType: BuyerType
  buyerName?: string
  lines: SaleLine[]
  note?: string
  acknowledgeWithdrawal?: boolean
}

export function lineTotal(line: SaleLine): number {
  if (line.pricePerHead !== undefined) return line.headCount * line.pricePerHead
  if (line.pricePerKg !== undefined && line.liveWeightKg !== undefined) return line.liveWeightKg * line.pricePerKg
  throw new Error('Each line needs a price per head, or a live weight and a price per kg')
}

export const saleTotal = (lines: SaleLine[]) => lines.reduce((sum, l) => sum + lineTotal(l), 0)

export async function listSales(): Promise<Sale[]> {
  const rows = await liveAll(db.sales)
  return rows.sort((a, b) => b.date.localeCompare(a.date) || b.updatedAt.localeCompare(a.updatedAt))
}

// One sale = one revenue transaction. Validation and the withdrawal check run
// before anything is written, so a rejected sale leaves no partial records.
export async function recordSale(input: SaleInput): Promise<Sale> {
  if (!input.lines.length) throw new Error('Add at least one line')
  for (const line of input.lines) {
    if (!Number.isInteger(line.headCount) || line.headCount <= 0) throw new Error('Head count per line must be 1 or more')
    lineTotal(line)
    if (line.batchId) {
      const batch = await db.batches.get(line.batchId)
      if (!batch || batch.deletedAt) throw new Error('Batch not found')
      if (line.headCount > batch.headCount) throw new Error(`${batch.name} has only ${batch.headCount} head`)
      if (!input.acknowledgeWithdrawal) {
        const block = saleBlockedBy(await eventsFor('batch', batch.id), input.date)
        if (block) throw new Error(`${batch.name} is in withdrawal for ${block.product} until ${block.until}`)
      }
    }
    for (const animalId of line.animalIds ?? []) {
      const animal = await db.animals.get(animalId)
      if (!animal || animal.deletedAt) throw new Error('Animal not found')
      if (animal.status !== 'active') throw new Error(`${animal.tag} is already ${animal.status}`)
      if (!input.acknowledgeWithdrawal) {
        const block = saleBlockedBy(await eventsFor('animal', animal.id), input.date)
        if (block) throw new Error(`${animal.tag} is in withdrawal for ${block.product} until ${block.until}`)
      }
    }
  }

  const total = saleTotal(input.lines)
  const sale = await create(db.sales, {
    date: input.date,
    buyerType: input.buyerType,
    buyerName: input.buyerName?.trim() || undefined,
    lines: input.lines,
    total,
  })
  const firstBatch = input.lines.find((l) => l.batchId)?.batchId
  const firstAnimal = input.lines.flatMap((l) => l.animalIds ?? [])[0]
  const tx = await create(db.transactions, {
    date: input.date,
    kind: 'revenue',
    category: 'hogSales',
    amount: total,
    note: input.note ?? `Sale to ${input.buyerName?.trim() || input.buyerType}`,
    links: { saleId: sale.id, batchId: firstBatch, animalId: firstAnimal },
  })
  await update(db.sales, sale.id, { transactionId: tx.id })

  for (const line of input.lines) {
    if (line.batchId) {
      await changeHeadCount(line.batchId, -line.headCount, 'sale', input.date, `Sale ${sale.id}`)
    }
    for (const animalId of line.animalIds ?? []) {
      await update(db.animals, animalId, { status: 'sold', statusDate: input.date })
      await addEvent({ subjectType: 'animal', subjectId: animalId, type: 'sale', date: input.date, data: { saleId: sale.id, total: lineTotal(line) } })
    }
  }
  return { ...sale, transactionId: tx.id }
}
