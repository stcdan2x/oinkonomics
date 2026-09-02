import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../../components/PageHeader'
import { Badge, Card, Empty, inputCls } from '../../components/ui'
import { ARTICLES, GUIDE_SECTIONS, articlesInSection, glossaryTerms } from '../../guide/articles'
import { searchGuide } from '../../guide/search'

const sectionTitle = (id: string) => GUIDE_SECTIONS.find((s) => s.id === id)?.title ?? id

// The Guide index: search across every article, else the sections with their
// articles (TASK 001 section 4, Phase P8, step 8.2).
export default function GuidePage() {
  const [query, setQuery] = useState('')
  const hits = searchGuide(ARTICLES, query)
  const searching = query.trim().length > 0
  return (
    <>
      <PageHeader title="Guide" subtitle="Raising and selling know-how, with sources" />
      <div className="mx-4 mb-4">
        <input
          type="search"
          className={inputCls}
          placeholder="Search the Guide (e.g. weaning, ASF, break-even)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search the Guide"
        />
      </div>
      {searching ? (
        <Card title={`${hits.length} result${hits.length === 1 ? '' : 's'}`}>
          {hits.length === 0 && <Empty>Nothing matches every word of "{query.trim()}".</Empty>}
          {hits.map((h) => (
            <Link key={h.article.id} to={`/guide/${h.article.id}`} className="block border-b border-slate-100 py-2.5 last:border-0">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold">{h.article.title}</span>
                <Badge>{sectionTitle(h.article.section)}</Badge>
              </div>
              <div className="mt-0.5 text-xs text-slate-500">{h.snippet}</div>
            </Link>
          ))}
        </Card>
      ) : (
        GUIDE_SECTIONS.map((s) => (
          <Card key={s.id} title={s.title} action={s.id === 'glossary' ? <span className="text-xs text-slate-400">{glossaryTerms().length} terms</span> : undefined}>
            <p className="mb-2 text-xs text-slate-500">{s.blurb}</p>
            {articlesInSection(s.id).map((a) => (
              <Link key={a.id} to={`/guide/${a.id}`} className="block border-b border-slate-100 py-2 last:border-0">
                <div className="font-semibold">{a.title}</div>
                <div className="text-xs text-slate-500">{a.summary}</div>
              </Link>
            ))}
          </Card>
        ))
      )}
    </>
  )
}
