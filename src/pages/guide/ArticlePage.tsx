import { Link, useParams } from 'react-router-dom'
import PageHeader from '../../components/PageHeader'
import { Badge, Card, Empty } from '../../components/ui'
import { GUIDE_SECTIONS, PRICE_DISCLAIMER_ID, articlesInSection, findArticle, glossaryTerms } from '../../guide/articles'
import Markdown from './Markdown'

// One Guide article: the rendered body, its glossary terms, the disclaimer
// when it quotes prices, the source rows, and the rest of its section.
export default function ArticlePage() {
  const { id = '' } = useParams()
  const article = findArticle(id)
  if (!article) {
    return (
      <>
        <PageHeader title="Guide" />
        <Card><Empty>No such article. <Link to="/guide" className="text-brand-600 underline">Back to the Guide</Link></Empty></Card>
      </>
    )
  }
  const section = GUIDE_SECTIONS.find((s) => s.id === article.section)
  const siblings = articlesInSection(article.section).filter((a) => a.id !== article.id)
  const terms = article.id === 'glossary' ? glossaryTerms() : (article.terms ?? []).map((t) => ({ ...t, articleId: article.id }))
  return (
    <>
      <div className="px-4 pt-4 text-xs">
        <Link to="/guide" className="text-brand-600">Guide</Link>
        <span className="text-slate-400"> / {section?.title}</span>
      </div>
      <PageHeader title={article.title} subtitle={article.summary} />
      <Card>
        <Markdown body={article.body} />
        {article.prices && article.id !== PRICE_DISCLAIMER_ID && (
          <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
            Every price above is a dated observation from a named source, not today's market. <Link to={`/guide/${PRICE_DISCLAIMER_ID}`} className="font-medium underline">Read the price disclaimer</Link> and log your own prices on the Plan page.
          </p>
        )}
        {article.sources.length > 0 && (
          <p className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-500">
            <span className="font-semibold text-slate-600">Sources:</span> {article.sources.join(', ')} (rows of the research parameter table behind this Guide: each carries its value, unit, source and date observed)
          </p>
        )}
      </Card>
      {terms.length > 0 && (
        <Card title={article.id === 'glossary' ? `All terms (${terms.length})` : 'Terms'}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-500"><tr><th className="py-1 pr-2 font-semibold">Term</th><th className="py-1 pr-2 font-semibold">Tagalog / trade</th><th className="py-1 font-semibold">Meaning</th></tr></thead>
              <tbody>
                {terms.map((t, i) => (
                  <tr key={i} className="border-t border-slate-100 align-top">
                    <td className="py-1.5 pr-2 font-medium">{t.term}</td>
                    <td className="py-1.5 pr-2 text-slate-600">{t.tagalog ?? ''}</td>
                    <td className="py-1.5">
                      {t.meaning}
                      {article.id === 'glossary' && t.articleId !== 'glossary' && (
                        <> <Link to={`/guide/${t.articleId}`} className="text-brand-600">(more)</Link></>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
      {siblings.length > 0 && (
        <Card title={`More in ${section?.title ?? 'this section'}`}>
          {siblings.map((a) => (
            <Link key={a.id} to={`/guide/${a.id}`} className="flex items-center justify-between gap-3 border-b border-slate-100 py-2 last:border-0">
              <span className="font-medium">{a.title}</span>
              {a.catalog !== undefined && <Badge>{`Strategy ${a.catalog}`}</Badge>}
            </Link>
          ))}
        </Card>
      )}
    </>
  )
}
