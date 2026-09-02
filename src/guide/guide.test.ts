import { describe, expect, it } from 'vitest'
import { APP_KPIS, GUIDE_SECTIONS } from './types'
import { ARTICLES, PRICE_DISCLAIMER_ID, STRATEGY_ARTICLE, findArticle, glossaryTerms } from './articles'

// PLAN.md section 9, P8 verify column: every catalog strategy and every KPI has a
// Guide page; the price disclaimer is present. Plus the content rules from
// TASK 001 section 4, Phase P8: sources resolve, links resolve, no em dash.
// Every page source, so the GuideLink ids used by the forms can be checked.
const pages = import.meta.glob('../pages/**/*.tsx', { query: '?raw', import: 'default', eager: true }) as Record<string, string>
const EM_DASH = '—'
const text = (a: (typeof ARTICLES)[number]) => [a.title, a.summary, a.body, ...(a.terms ?? []).flatMap((t) => [t.term, t.tagalog ?? '', t.meaning])].join('\n')

describe('guide articles', () => {
  it('have unique kebab-case ids, a known section, a title, a summary and a body', () => {
    const ids = ARTICLES.map((a) => a.id)
    expect(new Set(ids).size).toBe(ids.length)
    const sections = new Set(GUIDE_SECTIONS.map((s) => s.id))
    for (const a of ARTICLES) {
      expect(a.id, a.id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
      expect(sections.has(a.section), `${a.id}: section ${a.section}`).toBe(true)
      expect(a.title.length, `${a.id}: title`).toBeGreaterThan(0)
      expect(a.summary.length, `${a.id}: summary`).toBeGreaterThan(0)
      expect(a.body.trim().length, `${a.id}: body`).toBeGreaterThan(0)
    }
    expect(findArticle('no-such-article')).toBeUndefined()
  })

  it('link only to articles that exist', () => {
    const problems: string[] = []
    for (const a of ARTICLES) {
      for (const m of a.body.matchAll(/\]\(\/guide\/([^)]+)\)/g)) if (!findArticle(m[1])) problems.push(`${a.id} -> ${m[1]}`)
    }
    expect(problems).toEqual([])
  })

  it('contain no em dash', () => {
    expect(ARTICLES.filter((a) => text(a).includes(EM_DASH)).map((a) => a.id)).toEqual([])
  })

  it('cover every strategy catalog entry 1 to 11 and every StrategyId', () => {
    const catalog = ARTICLES.filter((a) => a.catalog !== undefined).map((a) => a.catalog)
    expect([...new Set(catalog)].sort((x, y) => Number(x) - Number(y))).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
    expect(Object.keys(STRATEGY_ARTICLE).sort()).toEqual(['growToMarket', 'growToRoaster', 'sellWeaners', 'undecided'])
    for (const id of Object.values(STRATEGY_ARTICLE)) expect(findArticle(id), id).toBeDefined()
  })

  it('define every app KPI', () => {
    const defined = new Set(ARTICLES.flatMap((a) => a.kpis ?? []))
    expect(APP_KPIS.filter((k) => !defined.has(k.id)).map((k) => k.id)).toEqual([])
    const known = new Set(APP_KPIS.map((k) => k.id))
    expect([...defined].filter((id) => !known.has(id))).toEqual([])
  })

  it('carry the price disclaimer', () => {
    const d = findArticle(PRICE_DISCLAIMER_ID)
    expect(d).toBeDefined()
    expect(d?.body).toContain('dated observation')
    expect(ARTICLES.filter((a) => a.section === 'market' && !a.prices).map((a) => a.id)).toEqual([])
  })

  it('collect glossary terms with a Tagalog column', () => {
    const terms = glossaryTerms()
    expect(terms.length).toBeGreaterThan(10)
    expect(terms.map((t) => t.term)).toEqual([...terms.map((t) => t.term)].sort((x, y) => x.localeCompare(y)))
    expect(terms.some((t) => t.tagalog === 'biik')).toBe(true)
  })

  it('every GuideLink id in src/pages resolves', () => {
    const problems: string[] = []
    for (const [file, src] of Object.entries(pages)) {
      for (const m of src.matchAll(/<GuideLink\s+id="([^"]+)"/g)) if (!findArticle(m[1])) problems.push(`${file}: ${m[1]}`)
    }
    expect(problems).toEqual([])
    expect(Object.keys(pages).length).toBeGreaterThan(0)
  })
})
