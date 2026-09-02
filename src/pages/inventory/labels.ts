import type { ItemCategory, StockMoveReason } from '../../types'

export const ITEM_CATEGORY_LABEL: Record<ItemCategory, string> = {
  feed: 'Feed',
  medicine: 'Medicine',
  vaccine: 'Vaccines',
  supplement: 'Supplements',
  supply: 'Supplies',
  equipment: 'Equipment',
}

export const ITEM_CATEGORIES = Object.keys(ITEM_CATEGORY_LABEL) as ItemCategory[]

export const REASON_LABEL: Record<StockMoveReason, string> = {
  purchase: 'Purchase',
  consumption: 'Used',
  adjustment: 'Adjustment',
  loss: 'Loss',
}

// Quantities are shown in the item's own unit; kg only when the unit converts.
export const qtyLabel = (qty: number, unit: string, kgPerUnit?: number) =>
  `${Number.isInteger(qty) ? qty : qty.toFixed(2)} ${unit}${kgPerUnit ? ` (${(qty * kgPerUnit).toFixed(0)} kg)` : ''}`
