import React, { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';

// Lazy loading das rotas secundárias para divisão de código e otimização de chunks
const Documentation = lazy(() => import('./pages/Documentation'));
const Insights = lazy(() => import('./pages/Insights'));
const CommunityPage = lazy(() => import('./pages/CommunityPage'));
const Changelog = lazy(() => import('./pages/Changelog'));

function App() {
  const location = useLocation();
  const isDocsPage = location.pathname === '/docs';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      
      <main style={{ flex: 1 }}>
        <Suspense
          fallback={
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '50vh',
                color: 'var(--text-secondary)',
              }}
            >
              <div className="glass-panel" style={{ padding: '16px 24px', fontSize: '0.95rem' }}>
                A carregar...
              </div>
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/docs" element={<Documentation />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/changelog" element={<Changelog />} />
          </Routes>
        </Suspense>
      </main>

      {!isDocsPage && <Footer />}
    </div>
  );
}

export default App;
