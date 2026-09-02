import { describe, expect, it } from 'vitest'
import { parseInline, parseMarkdown, plainText } from './markdown'

// The Guide body markdown subset (TASK 001 section 4, Phase P8 rules).
describe('guide markdown subset', () => {
  it('parses headings, paragraphs, lists, tables and notes as blocks', () => {
    const body = [
      '## Heat and service',
      '',
      'A sow cycles every 21 days.',
      'Service twice, 12 hours apart.',
      '',
      '- Standing heat',
      '- Swollen vulva',
      '',
      '1. Check at day 18',
      '2. Check at day 24',
      '',
      '| Stage | Days |',
      '|---|---|',
      '| Gestation | 115 |',
      '| Lactation | 28 |',
      '',
      '> Prices are dated observations.',
      '',
      '### Records',
      'Write the service date.',
    ].join('\n')
    const blocks = parseMarkdown(body)
    expect(blocks.map((b) => b.type)).toEqual(['heading', 'paragraph', 'list', 'list', 'table', 'note', 'heading', 'paragraph'])
    expect(blocks[0]).toEqual({ type: 'heading', level: 2, text: 'Heat and service' })
    expect(blocks[1]).toEqual({ type: 'paragraph', inlines: [{ type: 'text', text: 'A sow cycles every 21 days. Service twice, 12 hours apart.' }] })
    expect(blocks[2]).toMatchObject({ type: 'list', ordered: false, items: [[{ type: 'text', text: 'Standing heat' }], [{ type: 'text', text: 'Swollen vulva' }]] })
    expect(blocks[3]).toMatchObject({ type: 'list', ordered: true, items: [[{ type: 'text', text: 'Check at day 18' }], [{ type: 'text', text: 'Check at day 24' }]] })
    expect(blocks[4]).toEqual({
      type: 'table',
      header: [[{ type: 'text', text: 'Stage' }], [{ type: 'text', text: 'Days' }]],
      rows: [
        [[{ type: 'text', text: 'Gestation' }], [{ type: 'text', text: '115' }]],
        [[{ type: 'text', text: 'Lactation' }], [{ type: 'text', text: '28' }]],
      ],
    })
    expect(blocks[5]).toEqual({ type: 'note', inlines: [{ type: 'text', text: 'Prices are dated observations.' }] })
    expect(blocks[6]).toEqual({ type: 'heading', level: 3, text: 'Records' })
  })

  it('parses bold, internal links and external links inline', () => {
    expect(parseInline('Sell at **12 kg**, see [weaning](/guide/weaning) or [PSA](https://psa.gov.ph).')).toEqual([
      { type: 'text', text: 'Sell at ' },
      { type: 'bold', text: '12 kg' },
      { type: 'text', text: ', see ' },
      { type: 'link', text: 'weaning', href: '/guide/weaning' },
      { type: 'text', text: ' or ' },
      { type: 'link', text: 'PSA', href: 'https://psa.gov.ph' },
      { type: 'text', text: '.' },
    ])
  })

  it('strips the markup for search', () => {
    expect(plainText('## Title\n\nSee **bold** and [link](/guide/x).\n\n| a | b |\n|---|---|\n| 1 | 2 |')).toBe('Title See bold and link. a b 1 2')
  })
})
