import writeXlsxFile, { type Cell as XlsxCell } from 'write-excel-file/universal'

// The workbook writer behind both Excel exports (TASK 005): one worksheet per
// Sheet, a bold sticky header row, the column widths from the sheet, money cells
// with their format. `write-excel-file/universal` returns a Blob in the browser
// and in Node alike, so the tests can unzip what the pages will share or download.

export type Cell = string | number | null | { value: number; format: string }

export interface Column {
  header: string
  width: number
}

export interface Sheet {
  name: string
  columns: Column[]
  rows: Cell[][]
}

export const MONEY_FORMAT = '#,##0.00'
export const XLSX_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

const cell = (c: Cell): XlsxCell => (c !== null && typeof c === 'object' ? { value: c.value, format: c.format } : c)

export function sheetsToBlob(sheets: Sheet[]): Promise<Blob> {
  return writeXlsxFile(
    sheets.map((s) => ({
      sheet: s.name,
      columns: s.columns.map((c) => ({ width: c.width })),
      stickyRowsCount: 1,
      data: [s.columns.map((c): XlsxCell => ({ value: c.header, fontWeight: 'bold' })), ...s.rows.map((r) => r.map(cell))],
    })),
  ).toBlob()
}
