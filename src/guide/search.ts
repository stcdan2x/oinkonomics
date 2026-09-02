import { plainText } from './markdown'
import type { GuideArticle } from './types'

// Guide search (TASK 001 section 4, Phase P8): every query word must appear,
// case-insensitive, in the title, summary, body or glossary terms; ranked by
// where the words hit (title 3, summary 2, body or terms 1, summed per word).
export interface SearchHit {
  article: GuideArticle
  score: number
  snippet: string
}

const SNIPPET = 140

export function searchGuide(articles: GuideArticle[], query: string): SearchHit[] {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean)
  if (words.length === 0) return []
  const hits: SearchHit[] = []
  for (const article of articles) {
    const title = article.title.toLowerCase()
    const summary = article.summary.toLowerCase()
    const body = plainText(article.body)
    const bodyLower = body.toLowerCase()
    const terms = (article.terms ?? [])
      .flatMap((t) => [t.term, t.tagalog ?? '', t.meaning])
      .join(' ')
      .toLowerCase()
    let score = 0
    let firstBodyHit = -1
    for (const w of words) {
      const inBody = bodyLower.indexOf(w)
      const s = title.includes(w) ? 3 : summary.includes(w) ? 2 : inBody >= 0 || terms.includes(w) ? 1 : 0
      if (s === 0) {
        score = 0
        break
      }
      score += s
      if (inBody >= 0 && (firstBodyHit < 0 || inBody < firstBodyHit)) firstBodyHit = inBody
    }
    if (score === 0) continue
    hits.push({ article, score, snippet: snippet(body, firstBodyHit, article.summary) })
  }
  return hits.sort((a, b) => b.score - a.score || a.article.title.localeCompare(b.article.title))
}

function snippet(body: string, at: number, fallback: string): string {
  if (at < 0) return fallback.slice(0, SNIPPET)
  const start = Math.max(0, at - 40)
  const end = Math.min(body.length, start + SNIPPET)
  return `${start > 0 ? '...' : ''}${body.slice(start, end).trim()}${end < body.length ? '...' : ''}`
}
