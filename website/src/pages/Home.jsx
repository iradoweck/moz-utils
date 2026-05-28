import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSEO } from '../hooks/useSEO';
import Hero from '../components/Hero';
import MotionDemo from '../components/MotionDemo';
import EcosystemInstallation from '../components/EcosystemInstallation';
import UnifiedSimulator from '../components/UnifiedSimulator';

export default function Home() {
  const { t } = useTranslation();
  useSEO(
    'Mozambique Utility Library',
    'Validate Mozambican NUIT, BI, phone numbers, postal codes (CEP), and explore geographic data. Open-source for TypeScript, Python, PHP, Dart, and Kotlin.'
  );
  
  return (
    <>
      <Hero />
      <MotionDemo />
      
      <section id="simulator" style={{ padding: '60px 20px', backgroundColor: 'rgba(0,0,0,0.2)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>{t('home.simulatorTitle')} <span className="text-neon">{t('home.simulatorTitleLive')}</span></h2>
            <p style={{ color: 'var(--text-secondary)' }}>{t('home.simulatorDesc')}</p>
          </div>
          
          <UnifiedSimulator />
        </div>
      </section>

      <EcosystemInstallation />
    </>
  );
}
