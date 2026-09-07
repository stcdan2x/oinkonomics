import type { RecordsRows } from '../db/exportRepo'
import { PRICE_ITEM_LABEL } from '../db/priceLogRepo'
import { EVENT_LABEL, OUTCOME_LABEL, ROLE_LABEL, STRATEGY_LABEL } from '../pages/herd/labels'
import { ITEM_CATEGORY_LABEL } from '../pages/inventory/labels'
import type { ISODate } from '../types'
import { byDate, capitalize, col, ledgerSheet, money, namesOf, saleLinesSheet, salesSheet, stockMovesSheet, type Names } from './books'
import type { Cell, Sheet } from './xlsx'

// The records workbook (TASK 005): the pure builder behind "Export to Excel" on
// the Settings page, beside the JSON backup. One sheet per exported table with
// every live row, ids resolved to tags and names (a gone id stays as it is), the
// row id in a Reference column, and each event's details as compact JSON text.
// It is a file to read, not a backup: nothing imports it back.

const orNull = (v: string | number | undefined | null): Cell => (v === undefined || v === null || v === '' ? null : v)
const json = (o: Record<string, unknown>): Cell => (Object.keys(o).length ? JSON.stringify(o) : null)

export function buildRecords(rows: RecordsRows): Sheet[] {
  const t = rows.tables
  const names: Names = namesOf({ animals: t.animals, batches: t.batches, items: t.inventoryItems, sales: t.sales, litters: t.litters, pens: t.pens })
  const subject = (type: 'animal' | 'litter' | 'batch', id: string): Cell => (type === 'animal' ? names.animal(id) : type === 'litter' ? names.litter(id) : names.batch(id))
  return [
    {
      name: 'Farm',
      columns: [col('Name', 28), col('Location', 28), col('Currency', 10), col('Start date', 12), col('Reference', 38)],
      rows: t.farm.map((f) => [f.name, orNull(f.location), f.currency, f.startDate, f.id]),
    },
    {
      name: 'Pens',
      columns: [col('Name', 20), col('Stage', 12), col('Capacity', 10), col('Reference', 38)],
      rows: t.pens.map((p) => [p.name, capitalize(p.stage), orNull(p.capacity), p.id]),
    },
    {
      name: 'Animals',
      columns: [col('Tag', 10), col('Role', 10), col('Sex', 8), col('Breed', 16), col('Birth date', 12), col('Source', 8), col('Dam', 10), col('Sire', 10), col('Litter', 16), col('Batch', 16), col('Pen', 14), col('Status', 8), col('Status date', 12), col('Notes', 40), col('Reference', 38)],
      rows: t.animals.map((a) => [a.tag, ROLE_LABEL[a.role], capitalize(a.sex), orNull(a.breed), orNull(a.birthDate), capitalize(a.source), names.animal(a.damId), names.animal(a.sireId), names.litter(a.litterId), names.batch(a.batchId), names.pen(a.penId), capitalize(a.status), orNull(a.statusDate), orNull(a.notes), a.id]),
    },
    {
      name: 'Litters',
      columns: [col('Sow', 10), col('Sire', 10), col('AI note', 20), col('Service date', 12), col('Expected farrow', 14), col('Farrow date', 12), col('Born alive', 10), col('Stillborn', 10), col('Mummified', 10), col('Wean date', 12), col('Weaned', 8), col('Outcome', 30), col('Notes', 40), col('Reference', 38)],
      rows: t.litters.map((l) => [names.animal(l.sowId), names.animal(l.sireId), orNull(l.aiNote), l.serviceDate, l.expectedFarrowDate, orNull(l.farrowDate), l.bornAlive, l.stillborn, l.mummified, orNull(l.weanDate), l.weanedCount, l.outcome ? (l.outcome === 'farrowed' ? 'Farrowed' : OUTCOME_LABEL[l.outcome]) : null, orNull(l.notes), l.id]),
    },
    {
      name: 'Batches',
      columns: [col('Name', 18), col('Kind', 10), col('Strategy', 26), col('Litters', 30), col('Head count', 10), col('Start date', 12), col('Pen', 14), col('Reference', 38)],
      rows: t.batches.map((b) => [b.name, capitalize(b.kind), STRATEGY_LABEL[b.strategy], orNull(b.litterIds.map((id) => names.litter(id)).join(', ')), b.headCount, b.startDate, names.pen(b.penId), b.id]),
    },
    {
      name: 'Events',
      columns: [col('Date', 12), col('Subject type', 12), col('Subject', 18), col('Type', 16), col('Details', 40), col('Cost transaction', 38), col('Reference', 38)],
      rows: [...t.events].sort(byDate).map((e) => [e.date, capitalize(e.subjectType), subject(e.subjectType, e.subjectId), EVENT_LABEL[e.type], json(e.data), orNull(e.costTransactionId), e.id]),
    },
    salesSheet(t.sales),
    saleLinesSheet(t.sales, names),
    ledgerSheet('Transactions', t.transactions, names),
    {
      name: 'Inventory items',
      columns: [col('Name', 22), col('Category', 12), col('Unit', 8), col('Kg per unit', 10), col('On hand', 10), col('Reorder level', 12), col('Unit cost', 12), col('Value', 14), col('Expiry', 12), col('Reference', 38)],
      rows: [...t.inventoryItems].sort((a, b) => a.name.localeCompare(b.name)).map((i) => [i.name, ITEM_CATEGORY_LABEL[i.category], i.unit, orNull(i.kgPerUnit), i.qtyOnHand, i.reorderLevel, money(i.unitCost), money(i.qtyOnHand * i.unitCost), orNull(i.expiryDate), i.id]),
    },
    stockMovesSheet(t.stockMoves, names),
    {
      name: 'Price log',
      columns: [col('Date', 12), col('Item', 30), col('Value', 12), col('Market', 16), col('Source', 10), col('Note', 40), col('Reference', 38)],
      rows: [...t.priceLog].sort(byDate).map((p) => [p.date, PRICE_ITEM_LABEL[p.item], money(p.value), orNull(p.market), capitalize(p.source), orNull(p.note), p.id]),
    },
    {
      name: 'Scenarios',
      columns: [col('Name', 24), col('Strategy', 26), col('Created', 24), col('Parameters', 60), col('Reference', 38)],
      rows: t.scenarios.map((s) => [s.name, STRATEGY_LABEL[s.strategy], s.createdAt, json(s.params), s.id]),
    },
  ]
}

export const recordsFilename = (date: ISODate) => `oinkonomics-records-${date}.xlsx`
