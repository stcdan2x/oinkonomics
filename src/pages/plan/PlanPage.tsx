import PageHeader from '../../components/PageHeader'
import { SubNav } from '../../components/ui'
import PricesTab from './PricesTab'
import RecommendTab from './RecommendTab'
import ScenariosTab from './ScenariosTab'

export type PlanTab = 'recommend' | 'scenarios' | 'prices'

export default function PlanPage({ tab }: { tab: PlanTab }) {
  const tabs = [
    { to: '/plan', label: 'Recommend', end: true },
    { to: '/plan/scenarios', label: 'Scenarios' },
    { to: '/plan/prices', label: 'Prices' },
  ]
  return (
    <>
      <PageHeader title="Plan" subtitle="Sell now or grow out, farm projections, price log" />
      <SubNav items={tabs} />
      {tab === 'recommend' && <RecommendTab />}
      {tab === 'scenarios' && <ScenariosTab />}
      {tab === 'prices' && <PricesTab />}
    </>
  )
}
