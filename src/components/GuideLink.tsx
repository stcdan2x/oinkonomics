import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

// A contextual link from a form or card into the Guide article that explains
// it (TASK 001 section 4, Phase P8, step 8.3). A test checks every id used
// in src/pages resolves to an article. The article titles live in the lazily
// loaded Guide content (step 10.0), so a link without a label reads "Guide"
// until that module has arrived once; after that the title is immediate.
type Articles = typeof import('../guide/articles')
let articles: Articles | null = null
const loadArticles = import('../guide/articles').then((m) => (articles = m))

export default function GuideLink({ id, label }: { id: string; label?: string }) {
  const [title, setTitle] = useState(() => label ?? articles?.findArticle(id)?.title)
  useEffect(() => {
    if (title !== undefined) return
    let live = true
    void loadArticles.then((m) => live && setTitle(m.findArticle(id)?.title ?? id))
    return () => { live = false }
  }, [id, title])
  return (
    <Link to={`/guide/${id}`} className="inline-flex min-w-0 items-center gap-1 text-xs font-medium text-brand-600" title="Open in the Guide">
      <span aria-hidden="true">📖</span>
      <span className="truncate">{title ?? 'Guide'}</span>
    </Link>
  )
}
