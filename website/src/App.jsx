import React from 'react';
import Hero from './components/Hero';
import Simulator from './components/Simulator';
import GeoSimulator from './components/GeoSimulator';
import Community from './components/Community';

function App() {
  return (
    <div>
      <nav style={{ padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--panel-border)' }}>
        <div style={{ fontWeight: 'bold', fontSize: '1.2rem', letterSpacing: '-0.5px' }}>
          moz-<span className="text-neon">utils</span>
        </div>
        <div>
          <a href="https://github.com/iradoweck/moz-utils" target="_blank" rel="noreferrer" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>
            GitHub
          </a>
        </div>
      </nav>
      
      <main>
        <Hero />
        <Simulator />
        <GeoSimulator />
        <Community />
      </main>

      <footer style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem', borderTop: '1px solid var(--panel-border)', backgroundColor: 'var(--dark-bg)' }}>
        <p>Built with ❤️ by Edmilson Muacigarro, Zedecks IT & Community</p>
        <p style={{ marginTop: '8px' }}>Licença AGPL-3.0-or-later</p>
      </footer>
    </div>
  );
}

export default App;
