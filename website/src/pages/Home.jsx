import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSEO } from '../hooks/useSEO';
import Hero from '../components/Hero';
import UnifiedSimulator from '../components/UnifiedSimulator';
import CommunityCTA from '../components/CommunityCTA';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div>
      <Hero />
      
      {/* Central de Testes (Simulador Unificado) */}
      <section style={{ padding: '80px 0', background: 'var(--body-bg-gradient)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Central de <span className="text-neon">Testes Universais</span></h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
              Valide NUITs, BIs, Códigos Postais e Números de Telemóvel em tempo real usando a nossa lógica matemática agnóstica. O que passa aqui, passa em qualquer stack.
            </p>
          </div>
          <UnifiedSimulator />
        </div>
      </section>

      <CommunityCTA />
      
      <Footer />
    </div>
  );
}
