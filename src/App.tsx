import { useLiveQuery } from 'dexie-react-hooks'
import { Suspense, lazy, useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Sidebar, TabBar, TopBar } from './components/AppNav'
import Loading from './components/Loading'
import SyncBanner from './components/SyncBanner'
import { getFarm } from './db/farmRepo'
import DashboardPage from './pages/dashboard/DashboardPage'
import FinancePage from './pages/finance/FinancePage'
import TransactionFormPage from './pages/finance/TransactionFormPage'
import AnimalFormPage from './pages/herd/AnimalFormPage'
import AnimalPage from './pages/herd/AnimalPage'
import BatchPage from './pages/herd/BatchPage'
import HerdPage from './pages/herd/HerdPage'
import LitterPage from './pages/herd/LitterPage'
import InventoryPage from './pages/inventory/InventoryPage'
import FeedEntryPage from './pages/inventory/FeedEntryPage'
import ItemFormPage from './pages/inventory/ItemFormPage'
import ItemPage from './pages/inventory/ItemPage'
import PurchaseFormPage from './pages/inventory/PurchaseFormPage'
import Onboarding from './pages/Onboarding'
import PlanPage from './pages/plan/PlanPage'
import ScenarioFormPage from './pages/plan/ScenarioFormPage'
import ScenarioPage from './pages/plan/ScenarioPage'
import SettingsPage from './pages/SettingsPage'
import { startScheduler } from './sync/scheduler'

// The Guide carries 89 articles: its pages load on first visit, not with the app shell.
const GuidePage = lazy(() => import('./pages/guide/GuidePage'))
const ArticlePage = lazy(() => import('./pages/guide/ArticlePage'))

export default function App() {
  // undefined = still loading, null = no farm yet
  const farm = useLiveQuery(async () => (await getFarm()) ?? null, [])
  const location = useLocation()
  // Background sync (P9): starts once the app is open; a no-op until connected.
  useEffect(() => startScheduler(), [])

  if (farm === undefined) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <div className="text-lg font-semibold text-brand-600">Oinkonomics</div>
      </div>
    )
  }

  const onOnboarding = location.pathname === '/onboarding'
  const justOnboarded = (location.state as { justOnboarded?: boolean } | null)?.justOnboarded
  if (farm === null && !onOnboarding && !justOnboarded) return <Navigate to="/onboarding" replace />
  if (onOnboarding) return <Onboarding farm={farm} />
  if (farm === null) return null // justOnboarded: the live query re-emits on the next tick

  return (
    <div className="min-h-dvh md:pl-56">
      <Sidebar />
      <TopBar />
      <main className="mx-auto max-w-3xl pb-20 md:pb-8">
        <SyncBanner />
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/herd" element={<HerdPage tab="breeders" />} />
            <Route path="/herd/litters" element={<HerdPage tab="litters" />} />
            <Route path="/herd/batches" element={<HerdPage tab="batches" />} />
            <Route path="/herd/calendar" element={<HerdPage tab="calendar" />} />
            <Route path="/herd/sales" element={<HerdPage tab="sales" />} />
            <Route path="/herd/animals/new" element={<AnimalFormPage />} />
            <Route path="/herd/animals/:id" element={<AnimalPage />} />
            <Route path="/herd/litters/:id" element={<LitterPage />} />
            <Route path="/herd/batches/:id" element={<BatchPage />} />
            <Route path="/finance" element={<FinancePage tab="ledger" />} />
            <Route path="/finance/reports" element={<FinancePage tab="reports" />} />
            <Route path="/finance/batches" element={<FinancePage tab="batches" />} />
            <Route path="/finance/new" element={<TransactionFormPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/inventory/items/new" element={<ItemFormPage />} />
            <Route path="/inventory/purchase" element={<PurchaseFormPage />} />
            <Route path="/inventory/feed" element={<FeedEntryPage />} />
            <Route path="/inventory/items/:id" element={<ItemPage />} />
            <Route path="/inventory/items/:id/edit" element={<ItemFormPage />} />
            <Route path="/plan" element={<PlanPage tab="recommend" />} />
            <Route path="/plan/scenarios" element={<PlanPage tab="scenarios" />} />
            <Route path="/plan/scenarios/new" element={<ScenarioFormPage />} />
            <Route path="/plan/scenarios/:id" element={<ScenarioPage />} />
            <Route path="/plan/prices" element={<PlanPage tab="prices" />} />
            <Route path="/guide" element={<GuidePage />} />
            <Route path="/guide/:id" element={<ArticlePage />} />
            <Route path="/settings" element={<SettingsPage farm={farm} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      <TabBar />
    </div>
  )
}
