import { Link } from 'react-router-dom'
import { parseMarkdown, type Block, type Inline } from '../../guide/markdown'

// Renders the Guide markdown subset (src/guide/markdown.ts) as page content.
export default function Markdown({ body }: { body: string }) {
  return <div className="space-y-3 text-sm leading-relaxed text-slate-700">{parseMarkdown(body).map((b, i) => <BlockView key={i} block={b} />)}</div>
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case 'heading':
      return block.level === 2 ? <h2 className="pt-3 text-base font-bold text-slate-900">{block.text}</h2> : <h3 className="pt-2 font-semibold text-slate-900">{block.text}</h3>
    case 'paragraph':
      return <p><Inlines inlines={block.inlines} /></p>
    case 'note':
      return <p className="rounded-lg border-l-4 border-brand-300 bg-brand-50 px-3 py-2 text-brand-900"><Inlines inlines={block.inlines} /></p>
    case 'list':
      return block.ordered ? (
        <ol className="list-decimal space-y-1 pl-5">{block.items.map((it, i) => <li key={i}><Inlines inlines={it} /></li>)}</ol>
      ) : (
        <ul className="list-disc space-y-1 pl-5">{block.items.map((it, i) => <li key={i}><Inlines inlines={it} /></li>)}</ul>
      )
    case 'table':
      return (
        <div className="overflow-x-auto rounded-lg ring-1 ring-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600">
              <tr>{block.header.map((c, i) => <th key={i} className="px-2 py-1.5 font-semibold"><Inlines inlines={c} /></th>)}</tr>
            </thead>
            <tbody>
              {block.rows.map((r, i) => (
                <tr key={i} className="border-t border-slate-100 align-top">{r.map((c, j) => <td key={j} className="px-2 py-1.5"><Inlines inlines={c} /></td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      )
  }
}

function Inlines({ inlines }: { inlines: Inline[] }) {
  return (
    <>
      {inlines.map((x, i) => {
        if (x.type === 'bold') return <strong key={i} className="font-semibold text-slate-900">{x.text}</strong>
        if (x.type === 'link') {
          return x.href.startsWith('/') ? (
            <Link key={i} to={x.href} className="font-medium text-brand-600 underline decoration-brand-200 underline-offset-2">{x.text}</Link>
          ) : (
            <a key={i} href={x.href} target="_blank" rel="noopener noreferrer" className="font-medium text-brand-600 underline decoration-brand-200 underline-offset-2">{x.text}</a>
          )
        }
        return <span key={i}>{x.text}</span>
      })}
    </>
  )
}
