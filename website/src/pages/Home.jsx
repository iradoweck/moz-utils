import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSEO } from '../hooks/useSEO';
import Hero from '../components/Hero';
import FeaturesGrid from '../components/FeaturesGrid';
import WhatItDoes from '../components/WhatItDoes';
import PolyglotShowcase from '../components/PolyglotShowcase';
import EcosystemInstallation from '../components/EcosystemInstallation';
import UnifiedSimulator from '../components/UnifiedSimulator';
import CommunityCTA from '../components/CommunityCTA';

export default function Home() {
  const { t } = useTranslation();
  useSEO(
    'Mozambique Utility Library',
    'Validate Mozambican NUIT, BI, phone numbers, postal codes (CEP), and explore geographic data. Open-source for TypeScript, Python, PHP, Dart, and Kotlin.'
  );

  return (
    <div>
      {/* 1. Hero */}
      <Hero />
      
      {/* 2. Features Grid */}
      <FeaturesGrid />
      
      {/* 3. O que faz e como faz */}
      <WhatItDoes />
      
      {/* 4. Polyglot Showcase */}
      <PolyglotShowcase />
      
      {/* 4. Quick Install */}
      <EcosystemInstallation />
      
      {/* 5. Central de Testes (Simulador Unificado) */}
      <section style={{ padding: '80px 0', background: 'var(--body-bg-gradient)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>{t('home.testCenterTitle')}<span className="text-neon">{t('home.testCenterHighlight')}</span></h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
              {t('home.testCenterDesc')}
            </p>
          </div>
          <UnifiedSimulator />
        </div>
      </section>

      {/* 6. Comunidade */}
      <CommunityCTA />
      
    </div>
  );
}
