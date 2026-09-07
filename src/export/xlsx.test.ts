import { strFromU8, unzipSync } from 'fflate'
import { describe, expect, it } from 'vitest'
import { MONEY_FORMAT, sheetsToBlob, XLSX_TYPE, type Sheet } from './xlsx'

const sheets: Sheet[] = [
  { name: 'Summary', columns: [{ header: 'Item', width: 40 }, { header: 'Amount', width: 16 }], rows: [['Farm', 'Kubo Piggery'], ['Total revenue', { value: 48250, format: MONEY_FORMAT }]] },
  { name: 'Ledger', columns: [{ header: 'Date', width: 12 }, { header: 'Amount', width: 14 }], rows: [['2026-08-05', { value: 1750.5, format: MONEY_FORMAT }], ['2026-08-09', null]] },
]

describe('sheetsToBlob', () => {
  it('writes an xlsx zip with one worksheet per sheet, named and in order, headers first', async () => {
    const blob = await sheetsToBlob(sheets)
    expect(blob.type).toBe(XLSX_TYPE)
    const bytes = new Uint8Array(await blob.arrayBuffer())
    expect([...bytes.slice(0, 2)]).toEqual([0x50, 0x4b]) // PK
    const files = unzipSync(bytes)
    const workbook = strFromU8(files['xl/workbook.xml'])
    const names = [...workbook.matchAll(/<sheet [^>]*name="([^"]+)"/g)].map((x) => x[1])
    expect(names).toEqual(['Summary', 'Ledger'])
    const sheet2 = strFromU8(files['xl/worksheets/sheet2.xml'])
    expect(sheet2).toContain('<row r="1"')
    expect(sheet2).toContain('1750.5')
    const strings = strFromU8(files['xl/sharedStrings.xml'] ?? new Uint8Array())
    expect(`${sheet2}${strings}`).toContain('Date')
    expect(`${sheet2}${strings}`).toContain('2026-08-05')
    const styles = strFromU8(files['xl/styles.xml'])
    expect(styles).toContain('#,##0.00')
  })
})
