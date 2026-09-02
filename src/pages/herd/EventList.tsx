import { useLiveQuery } from 'dexie-react-hooks'
import { eventsFor } from '../../db/eventRepo'
import { withdrawalEnd } from '../../engine/withdrawal'
import type { FarmEvent, SubjectType } from '../../types'
import { Card, Empty } from '../../components/ui'
import { EVENT_LABEL } from './labels'

function summary(e: FarmEvent): string {
  const d = e.data
  const parts: string[] = []
  if (typeof d.product === 'string') parts.push(d.product)
  if (typeof d.withdrawalDays === 'number') parts.push(`withdrawal ${d.withdrawalDays} d, until ${withdrawalEnd(e.date, d.withdrawalDays)}`)
  if (typeof d.dose === 'string' && d.dose) parts.push(d.dose)
  if (typeof d.avgKg === 'number') parts.push(`${d.avgKg} kg avg${typeof d.sampleSize === 'number' ? ` (n=${d.sampleSize})` : ''}`)
  if (typeof d.bornAlive === 'number') parts.push(`${d.bornAlive} alive, ${d.stillborn} stillborn, ${d.mummified} mummified`)
  if (typeof d.weanedCount === 'number') parts.push(`${d.weanedCount} weaned`)
  if (typeof d.delta === 'number') parts.push(`${d.delta > 0 ? '+' : ''}${d.delta} head, now ${d.headCountAfter}`)
  if (typeof d.total === 'number') parts.push(`total ${d.total}`)
  if (typeof d.outcome === 'string') parts.push(d.outcome)
  if (typeof d.note === 'string' && d.note) parts.push(d.note)
  return parts.join(' / ')
}

export default function EventList({ subjectType, subjectId }: { subjectType: SubjectType; subjectId: string }) {
  const events = useLiveQuery(() => eventsFor(subjectType, subjectId), [subjectType, subjectId])
  return (
    <Card title="History">
      {!events?.length ? (
        <Empty>No events yet.</Empty>
      ) : (
        <ul>
          {events.map((e) => (
            <li key={e.id} className="flex gap-3 border-b border-slate-100 py-2 last:border-0">
              <span className="w-24 shrink-0 text-slate-500">{e.date}</span>
              <span>
                <span className="font-semibold">{EVENT_LABEL[e.type]}</span>
                {summary(e) && <span className="text-slate-500"> {summary(e)}</span>}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
