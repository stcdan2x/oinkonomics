import { describe, expect, it } from 'vitest'
import { searchGuide } from './search'
import type { GuideArticle } from './types'

const a = (id: string, title: string, summary: string, body: string, terms?: GuideArticle['terms']): GuideArticle => ({
  id,
  section: 'cycle',
  title,
  summary,
  body,
  sources: ['PC-24'],
  terms,
})

const ARTICLES = [
  a('weaning', 'Weaning', 'When and how to wean the litter.', 'Wean at 28 days. Creep feed from day 14 helps the piglets eat solid feed.'),
  a('feed-phases', 'Feed phases', 'Booster to finisher.', 'Creep feed is the first solid feed a piglet eats, from about day 14.'),
  a('heat', 'Heat and service', 'Signs of heat.', 'Standing heat lasts two to three days.', [{ term: 'Weaner', tagalog: 'biik', meaning: 'a weaned piglet' }]),
]

describe('guide search', () => {
  it('returns nothing for an empty query', () => {
    expect(searchGuide(ARTICLES, '')).toEqual([])
    expect(searchGuide(ARTICLES, '   ')).toEqual([])
  })

  it('needs every word, ignores case, and ranks title hits above summary above body', () => {
    const hits = searchGuide(ARTICLES, 'creep FEED')
    expect(hits.map((h) => h.article.id)).toEqual(['feed-phases', 'weaning'])
    expect(searchGuide(ARTICLES, 'weaning').map((h) => h.article.id)).toEqual(['weaning'])
    expect(searchGuide(ARTICLES, 'creep heat')).toEqual([])
  })

  it('matches glossary terms and gives a snippet around the first body hit', () => {
    expect(searchGuide(ARTICLES, 'biik').map((h) => h.article.id)).toEqual(['heat'])
    const [hit] = searchGuide(ARTICLES, 'helps')
    expect(hit.article.id).toBe('weaning')
    expect(hit.snippet).toContain('solid feed')
    expect(hit.snippet.length).toBeLessThanOrEqual(160)
  })
})
