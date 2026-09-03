import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from '@/components/common/Layout/Layout'
import ScrollToTop from '@/components/common/ScrollToTop/ScrollToTop'

const Home           = lazy(() => import('@/pages/Home/Home'))
const Servicos       = lazy(() => import('@/pages/Servicos/Servicos'))
const Infraestrutura = lazy(() => import('@/pages/Infraestrutura/Infraestrutura'))
const MauroGambini   = lazy(() => import('@/pages/MauroGambini/MauroGambini'))
const Hipnoterapia   = lazy(() => import('@/pages/Hipnoterapia/Hipnoterapia'))
const Galeria        = lazy(() => import('@/pages/Galeria/Galeria'))
const Clientes       = lazy(() => import('@/pages/Clientes/Clientes'))
const Contato        = lazy(() => import('@/pages/Contato/Contato'))

function PageLoader() {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 40, height: 40, border: '3px solid #2A2A2A', borderTopColor: '#F5A623', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

export default function App() {
  return (
    <Layout>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/"                  element={<Home />} />
          <Route path="/servicos"          element={<Servicos />} />
          <Route path="/infraestrutura"    element={<Infraestrutura />} />
          <Route path="/mauro-gambini"     element={<MauroGambini />} />
          <Route path="/hipnoterapia"      element={<Hipnoterapia />} />
          <Route path="/galeria"           element={<Galeria />} />
          <Route path="/clientes"          element={<Clientes />} />
          <Route path="/contato"           element={<Contato />} />
        </Routes>
      </Suspense>
    </Layout>
  )
}
