// The Guide body markdown subset (TASK 001 section 4, Phase P8): `##` and
// `###` headings, paragraphs, `-` and `1.` lists, pipe tables, `>` notes,
// **bold**, [label](/guide/id) and [label](https://...) links. Blank lines
// separate blocks. No markdown dependency.

export type Inline = { type: 'text'; text: string } | { type: 'bold'; text: string } | { type: 'link'; text: string; href: string }

export type Block =
  | { type: 'heading'; level: 2 | 3; text: string }
  | { type: 'paragraph'; inlines: Inline[] }
  | { type: 'list'; ordered: boolean; items: Inline[][] }
  | { type: 'table'; header: Inline[][]; rows: Inline[][][] }
  | { type: 'note'; inlines: Inline[] }

const INLINE = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)]+)\)/g

export function parseInline(text: string): Inline[] {
  const out: Inline[] = []
  let last = 0
  for (const m of text.matchAll(INLINE)) {
    if (m.index! > last) out.push({ type: 'text', text: text.slice(last, m.index) })
    if (m[1] !== undefined) out.push({ type: 'bold', text: m[1] })
    else out.push({ type: 'link', text: m[2], href: m[3] })
    last = m.index! + m[0].length
  }
  if (last < text.length) out.push({ type: 'text', text: text.slice(last) })
  return out
}

const cells = (line: string) =>
  line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((c) => parseInline(c.trim()))

const isSeparator = (line: string) => /^\|?\s*:?-{2,}/.test(line.trim())

export function parseMarkdown(body: string): Block[] {
  const blocks: Block[] = []
  const lines = body.split('\n')
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    const t = line.trim()
    if (t === '') {
      i++
      continue
    }
    const heading = /^(#{2,3})\s+(.*)$/.exec(t)
    if (heading) {
      blocks.push({ type: 'heading', level: heading[1].length as 2 | 3, text: heading[2].trim() })
      i++
      continue
    }
    if (t.startsWith('|')) {
      const rows: Inline[][][] = []
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        if (!isSeparator(lines[i])) rows.push(cells(lines[i]))
        i++
      }
      const [header, ...rest] = rows
      blocks.push({ type: 'table', header, rows: rest })
      continue
    }
    const bullet = /^[-*]\s+/
    const numbered = /^\d+[.)]\s+/
    if (bullet.test(t) || numbered.test(t)) {
      const ordered = numbered.test(t)
      const re = ordered ? numbered : bullet
      const items: Inline[][] = []
      while (i < lines.length && re.test(lines[i].trim())) {
        items.push(parseInline(lines[i].trim().replace(re, '')))
        i++
      }
      blocks.push({ type: 'list', ordered, items })
      continue
    }
    if (t.startsWith('>')) {
      const parts: string[] = []
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        parts.push(lines[i].trim().replace(/^>\s?/, ''))
        i++
      }
      blocks.push({ type: 'note', inlines: parseInline(parts.join(' ')) })
      continue
    }
    const parts: string[] = []
    while (i < lines.length) {
      const s = lines[i].trim()
      if (s === '' || /^(#{2,3})\s/.test(s) || s.startsWith('|') || s.startsWith('>') || bullet.test(s) || numbered.test(s)) break
      parts.push(s)
      i++
    }
    blocks.push({ type: 'paragraph', inlines: parseInline(parts.join(' ')) })
  }
  return blocks
}

const inlineText = (inlines: Inline[]) => inlines.map((x) => x.text).join('')

// The body without markup, for search and snippets.
export function plainText(body: string): string {
  return parseMarkdown(body)
    .map((b) => {
      switch (b.type) {
        case 'heading':
          return b.text
        case 'paragraph':
        case 'note':
          return inlineText(b.inlines)
        case 'list':
          return b.items.map(inlineText).join(' ')
        case 'table':
          return [b.header, ...b.rows].map((r) => r.map(inlineText).join(' ')).join(' ')
      }
    })
    .join(' ')
}
