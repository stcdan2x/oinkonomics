import type { ItemCategory, TransactionKind } from '../types'
// Transaction categories (PLAN.md section 4 seed list). Capital vs operating
// is the transaction `kind`, not a category.
export const EXPENSE_CATEGORIES = [
  { id: 'feed', label: 'Feed' },
  { id: 'medicineVaccine', label: 'Medicine and vaccines' },
  { id: 'breedingService', label: 'Boar or AI service' },
  { id: 'labour', label: 'Labour' },
  { id: 'water', label: 'Water' },
  { id: 'electricity', label: 'Electricity' },
  { id: 'transport', label: 'Transport' },
  { id: 'permitsFees', label: 'Permits and fees' },
  { id: 'penConstruction', label: 'Pen construction and repair' },
  { id: 'equipment', label: 'Equipment' },
  { id: 'stockPurchase', label: 'Stock purchase (animals)' },
  { id: 'other', label: 'Other' },
] as const

export const REVENUE_CATEGORIES = [
  { id: 'hogSales', label: 'Hog sales' },
  { id: 'breedingFees', label: 'Breeding service fees' },
  { id: 'manure', label: 'Manure and by-products' },
  { id: 'otherIncome', label: 'Other income' },
] as const

export const FINANCING_CATEGORIES = {
  drawing: [{ id: 'drawing', label: 'Owner drawing' }],
  loan: [{ id: 'loan', label: 'Loan received' }],
  loanPayment: [{ id: 'loanPayment', label: 'Loan repayment' }],
} as const

export type Category = { id: string; label: string }

const CAPITAL_CATEGORY_IDS = ['penConstruction', 'equipment', 'stockPurchase', 'other']
export const CAPITAL_CATEGORIES = EXPENSE_CATEGORIES.filter((c) => CAPITAL_CATEGORY_IDS.includes(c.id))

// Capital purchases (pens, equipment, breeding stock) use the matching subset of
// the expense categories; drawings and loans carry one fixed category each.
export function categoriesFor(kind: TransactionKind): readonly Category[] {
  switch (kind) {
    case 'expense':
      return EXPENSE_CATEGORIES
    case 'capital':
      return CAPITAL_CATEGORIES
    case 'revenue':
      return REVENUE_CATEGORIES
    default:
      return FINANCING_CATEGORIES[kind]
  }
}

const ALL_CATEGORIES: readonly Category[] = [
  ...EXPENSE_CATEGORIES,
  ...REVENUE_CATEGORIES,
  ...Object.values(FINANCING_CATEGORIES).flat(),
]

export const categoryLabel = (id: string): string => ALL_CATEGORIES.find((c) => c.id === id)?.label ?? id

export const KIND_LABEL: Record<TransactionKind, string> = {
  expense: 'Expense',
  revenue: 'Revenue',
  capital: 'Capital purchase',
  drawing: 'Drawing',
  loan: 'Loan in',
  loanPayment: 'Loan payment',
}

// Ledger category of a stock purchase, from the inventory item's category.
export const ITEM_EXPENSE_CATEGORY: Record<ItemCategory, string> = {
  feed: 'feed',
  medicine: 'medicineVaccine',
  vaccine: 'medicineVaccine',
  supplement: 'medicineVaccine',
  supply: 'other',
  equipment: 'equipment',
}
