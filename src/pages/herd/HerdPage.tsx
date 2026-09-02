import { useLiveQuery } from 'dexie-react-hooks'
import { useState } from 'react'
import PageHeader from '../../components/PageHeader'
import { Badge, btnPrimary, btnSecondary, Card, Empty, ErrorText, Field, inputCls, LinkButton, ListItem, peso, SubNav } from '../../components/ui'
import GuideLink from '../../components/GuideLink'
import { STRATEGY_ARTICLE } from '../../guide/types'
import { listBreeders } from '../../db/animalRepo'
import { batchSummary, createBatch, listBatches } from '../../db/batchRepo'
import { db } from '../../db/db'
import { latestLitterForSow, openLitters } from '../../db/litterRepo'
import { listSales } from '../../db/saleRepo'
import { liveAll } from '../../db/repo'
import { breedingCalendar, sowStage } from '../../engine/breeding'
import { plusDays, todayISO } from '../../engine/dates'
import type { Animal, BatchKind, StrategyId } from '../../types'
import { BUYER_LABEL, MILESTONE_LABEL, ROLE_LABEL, STAGE_LABEL, STAGE_TONE, STRATEGY_LABEL } from './labels'

export type HerdTab = 'breeders' | 'litters' | 'batches' | 'calendar' | 'sales'

const TABS = [
  { to: '/herd', label: 'Breeders', end: true },
  { to: '/herd/litters', label: 'Litters' },
  { to: '/herd/batches', label: 'Batches' },
  { to: '/herd/calendar', label: 'Calendar' },
  { to: '/herd/sales', label: 'Sales' },
]

export default function HerdPage({ tab }: { tab: HerdTab }) {
  return (
    <>
      <PageHeader title="Herd" subtitle="Sows, boars, litters and batches" />
      <SubNav items={TABS} />
      {tab === 'breeders' && <BreedersTab />}
      {tab === 'litters' && <LittersTab />}
      {tab === 'batches' && <BatchesTab />}
      {tab === 'calendar' && <CalendarTab />}
      {tab === 'sales' && <SalesTab />}
    </>
  )
}

function useSowStages(animals: Animal[] | undefined) {
  const today = todayISO()
  return useLiveQuery(async () => {
    const out: Record<string, ReturnType<typeof sowStage>> = {}
    for (const a of animals ?? []) {
      if (a.sex === 'female') out[a.id] = sowStage(await latestLitterForSow(a.id), today)
    }
    return out
  }, [animals, today])
}

function BreedersTab() {
  const breeders = useLiveQuery(listBreeders, [])
  const stages = useSowStages(breeders)
  return (
    <Card title="Breeding stock" action={<LinkButton to="/herd/animals/new">Add animal</LinkButton>}>
      {!breeders?.length ? (
        <Empty>No sows, gilts or boars yet. Add your first animal.</Empty>
      ) : (
        breeders.map((a) => {
          const st = stages?.[a.id]
          return (
            <ListItem
              key={a.id}
              to={`/herd/animals/${a.id}`}
              title={<>{a.tag} <span className="ml-1 font-normal text-slate-500">{ROLE_LABEL[a.role]}{a.breed ? `, ${a.breed}` : ''}</span></>}
              subtitle={st?.next ? `${MILESTONE_LABEL[st.next.type]}: ${st.next.date}` : undefined}
              right={st && <Badge tone={STAGE_TONE[st.stage]}>{STAGE_LABEL[st.stage]}</Badge>}
            />
          )
        })
      )}
    </Card>
  )
}

function LittersTab() {
  const open = useLiveQuery(openLitters, [])
  const sows = useLiveQuery(() => liveAll(db.animals), [])
  const closedCount = useLiveQuery(async () => (await liveAll(db.litters)).length - (await openLitters()).length, [])
  const tag = (id: string) => sows?.find((s) => s.id === id)?.tag ?? 'Sow'
  const today = todayISO()
  return (
    <>
      <Card title="Open litters">
        {!open?.length ? (
          <Empty>No open litters. Record a service from a sow's card.</Empty>
        ) : (
          open.map((l) => {
            const st = sowStage(l, today)
            return (
              <ListItem
                key={l.id}
                to={`/herd/litters/${l.id}`}
                title={<>{tag(l.sowId)} <span className="font-normal text-slate-500">served {l.serviceDate}</span></>}
                subtitle={l.farrowDate ? `Farrowed ${l.farrowDate}: ${l.bornAlive} alive` : `Farrowing due ${l.expectedFarrowDate}`}
                right={<Badge tone={STAGE_TONE[st.stage]}>{STAGE_LABEL[st.stage]}</Badge>}
              />
            )
          })
        )}
      </Card>
      {!!closedCount && <p className="mx-4 text-xs text-slate-400">{closedCount} closed litter{closedCount === 1 ? '' : 's'} on the sow cards.</p>}
    </>
  )
}

function BatchesTab() {
  const batches = useLiveQuery(() => listBatches(), [])
  const today = todayISO()
  const summaries = useLiveQuery(async () => {
    const out: Record<string, Awaited<ReturnType<typeof batchSummary>>> = {}
    for (const b of batches ?? []) out[b.id] = await batchSummary(b, today)
    return out
  }, [batches, today])
  const [adding, setAdding] = useState(false)
  return (
    <>
      <Card title="Batches" action={<button className={`text-sm ${btnPrimary}`} onClick={() => setAdding((v) => !v)}>{adding ? 'Close' : 'New batch'}</button>}>
        {adding && <NewBatchForm onDone={() => setAdding(false)} />}
        {!batches?.length ? (
          !adding && <Empty>No batches. Wean a litter or add bought-in pigs as a new batch.</Empty>
        ) : (
          batches.map((b) => {
            const s = summaries?.[b.id]
            return (
              <ListItem
                key={b.id}
                to={`/herd/batches/${b.id}`}
                title={b.name}
                subtitle={`${b.headCount} head, ${b.kind}, since ${b.startDate}. ${STRATEGY_LABEL[b.strategy]}`}
                right={s?.lastWeight ? <>{s.lastWeight.kg} kg avg{s.adg !== null && <><br />{(s.adg * 1000).toFixed(0)} g/day</>}</> : 'no weights'}
              />
            )
          })
        )}
      </Card>
    </>
  )
}

function NewBatchForm({ onDone }: { onDone: () => void }) {
  const [name, setName] = useState('')
  const [kind, setKind] = useState<BatchKind>('growers')
  const [head, setHead] = useState('')
  const [start, setStart] = useState(todayISO())
  const [strategy, setStrategy] = useState<StrategyId>('growToMarket')
  const [error, setError] = useState<string | null>(null)
  async function save() {
    try {
      await createBatch({ name, kind, litterIds: [], headCount: Number(head), startDate: start, strategy })
      onDone()
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }
  return (
    <div className="mb-4 flex flex-col gap-3 rounded-xl bg-slate-50 p-3">
      <Field label="Batch name"><input className={inputCls} placeholder="e.g. Bought-in growers Sept" value={name} onChange={(e) => setName(e.target.value)} /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Stage">
          <select className={inputCls} value={kind} onChange={(e) => setKind(e.target.value as BatchKind)}>
            <option value="piglets">Piglets / weaners</option><option value="growers">Growers</option><option value="finishers">Finishers</option>
          </select>
        </Field>
        <Field label="Head count"><input type="number" min={1} inputMode="numeric" className={inputCls} value={head} onChange={(e) => setHead(e.target.value)} /></Field>
        <Field label="Start date"><input type="date" className={inputCls} value={start} onChange={(e) => setStart(e.target.value)} /></Field>
        <Field label="Plan">
          <select className={inputCls} value={strategy} onChange={(e) => setStrategy(e.target.value as StrategyId)}>
            {(Object.keys(STRATEGY_LABEL) as StrategyId[]).map((s) => <option key={s} value={s}>{STRATEGY_LABEL[s]}</option>)}
          </select>
          <GuideLink id={STRATEGY_ARTICLE[strategy]} />
        </Field>
      </div>
      <ErrorText error={error} />
      <div className="flex gap-2"><button className={btnSecondary} onClick={onDone}>Cancel</button><button className={`flex-1 ${btnPrimary}`} onClick={save}>Create</button></div>
    </div>
  )
}

function CalendarTab() {
  const today = todayISO()
  const data = useLiveQuery(async () => {
    const litters = await openLitters()
    const animals = await liveAll(db.animals)
    const tag = (id: string) => animals.find((a) => a.id === id)?.tag ?? 'Sow'
    const overdue = breedingCalendar(litters, plusDays(today, -60), plusDays(today, -1)).map((i) => ({ ...i, tag: tag(i.sowId) }))
    const upcoming = breedingCalendar(litters, today, plusDays(today, 30)).map((i) => ({ ...i, tag: tag(i.sowId) }))
    return { overdue, upcoming }
  }, [today])
  const Item = ({ i }: { i: { date: string; type: keyof typeof MILESTONE_LABEL; litterId: string; tag: string } }) => (
    <ListItem to={`/herd/litters/${i.litterId}`} title={`${i.tag}: ${MILESTONE_LABEL[i.type]}`} right={i.date === today ? <Badge tone="brand">today</Badge> : i.date} />
  )
  return (
    <>
      {!!data?.overdue.length && (
        <Card title="Overdue">
          {data.overdue.map((i, k) => <Item key={k} i={i} />)}
        </Card>
      )}
      <Card title="Next 30 days">
        {!data?.upcoming.length ? <Empty>Nothing due. Open litters drive this calendar.</Empty> : data.upcoming.map((i, k) => <Item key={k} i={i} />)}
      </Card>
      <p className="mx-4 text-xs text-slate-400">Dates use the research defaults: gestation 115 d, heat check day 21, pregnancy check day 28, weaning at 28 d, rebreed 5 d after weaning, iron at day 3 and 14, castration by day 7, creep feed from day 14.</p>
    </>
  )
}

function SalesTab() {
  const sales = useLiveQuery(listSales, [])
  const batches = useLiveQuery(() => listBatches({ includeEmpty: true }), [])
  return (
    <Card title="Sales">
      {!sales?.length ? (
        <Empty>No sales yet. Sell from a batch or an animal card.</Empty>
      ) : (
        sales.map((s) => {
          const head = s.lines.reduce((n, l) => n + l.headCount, 0)
          const batchId = s.lines.find((l) => l.batchId)?.batchId
          const name = batchId ? batches?.find((b) => b.id === batchId)?.name : 'individual animal'
          return (
            <ListItem
              key={s.id}
              to={batchId ? `/herd/batches/${batchId}` : '/herd'}
              title={`${s.date}: ${head} head, ${peso(s.total)}`}
              subtitle={`${BUYER_LABEL[s.buyerType]}${s.buyerName ? `, ${s.buyerName}` : ''}. ${name ?? ''}`}
            />
          )
        })
      )}
    </Card>
  )
}
