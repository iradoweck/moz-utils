import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Documentation from './pages/Documentation';
import Insights from './pages/Insights';
import CommunityPage from './pages/CommunityPage';
import Changelog from './pages/Changelog';

function App() {
  const location = useLocation();
  const isDocsPage = location.pathname === '/docs';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/docs" element={<Documentation />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/changelog" element={<Changelog />} />
        </Routes>
      </main>

      {!isDocsPage && <Footer />}
    </div>
  );
}

export default App;
