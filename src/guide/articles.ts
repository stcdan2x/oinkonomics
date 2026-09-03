import { APP } from './content/app'
import { CYCLE } from './content/cycle'
import { FEEDING } from './content/feeding'
import { GLOSSARY } from './content/glossary'
import { HEALTH } from './content/health'
import { HOUSING } from './content/housing'
import { MARKET } from './content/market'
import { RECORDS } from './content/records'
import { RULES } from './content/rules'
import { STRATEGIES } from './content/strategies'
import { USING } from './content/using'
import type { GlossaryTerm, GuideArticle, GuideSectionId } from './types'

export { GUIDE_SECTIONS, PRICE_DISCLAIMER_ID, STRATEGY_ARTICLE } from './types'

// Every Guide article, in section order (TASK 001 section 4, Phase P8).
export const ARTICLES: GuideArticle[] = [...USING, ...APP, ...CYCLE, ...FEEDING, ...HEALTH, ...HOUSING, ...MARKET, ...STRATEGIES, ...RECORDS, ...RULES, ...GLOSSARY]


const byId = new Map(ARTICLES.map((a) => [a.id, a]))

export const findArticle = (id: string): GuideArticle | undefined => byId.get(id)

export const articlesInSection = (section: GuideSectionId): GuideArticle[] => ARTICLES.filter((a) => a.section === section)

// Every glossary term contributed by any article, alphabetical.
export function glossaryTerms(): (GlossaryTerm & { articleId: string })[] {
  return ARTICLES.flatMap((a) => (a.terms ?? []).map((t) => ({ ...t, articleId: a.id }))).sort((x, y) => x.term.localeCompare(y.term))
}
