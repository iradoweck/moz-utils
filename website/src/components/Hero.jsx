import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Terminal } from 'lucide-react';
import { Link } from 'react-router-dom';
import WorldMapNodes from './WorldMapNodes';

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section style={{ padding: '120px 0 80px 0', textAlign: 'center', position: 'relative', overflow: 'hidden', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      
      {/* Interactive Map Background */}
      <WorldMapNodes />

      <div className="container animate-fade-up" style={{ position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
          <div className="animate-float" style={{ 
            background: 'var(--panel-bg)', 
            padding: '16px 24px', 
            borderRadius: '30px',
            boxShadow: '0 0 30px var(--shadow-color)',
            border: '1px solid var(--panel-border)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span style={{ fontSize: '1.2rem' }}>🇲🇿</span>
            <span style={{ fontWeight: '600', color: 'var(--text-primary)', letterSpacing: '0.5px' }}>
              Open Source from Nampula, MZ
            </span>
          </div>
        </div>
        
        <h1 style={{ 
          fontSize: '4.5rem', 
          marginBottom: '24px', 
          lineHeight: '1.1',
          letterSpacing: '-1.5px',
          fontWeight: '800',
          textShadow: '0 0 40px var(--shadow-color)'
        }}>
          Mozambique Utilities<br/>
          <span className="text-gradient">for Developers</span>
        </h1>
        
        <p style={{ 
          fontSize: '1.4rem', 
          color: 'var(--text-secondary)', 
          maxWidth: '650px', 
          margin: '0 auto 48px auto',
          lineHeight: '1.6',
          fontWeight: '400'
        }}>
          A biblioteca de validação open-source definitiva. Validando NUIT, BI, CEPs e Telemóveis com precisão absoluta. 
          <strong style={{ color: 'var(--text-primary)', fontWeight: '600' }}> De Nampula para toda a África e o Mundo.</strong>
        </p>
        
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/docs" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '16px 32px', fontSize: '1.1rem' }}>
            <Terminal size={20} /> Explorar a Documentação
          </Link>
          <a href="https://github.com/iradoweck/moz-utils" target="_blank" rel="noreferrer" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '16px 32px', fontSize: '1.1rem', background: 'var(--overlay-2)', borderColor: 'var(--panel-border)' }}>
            Ver no GitHub <ArrowRight size={20} />
          </a>
        </div>

        <div style={{ marginTop: '60px', opacity: 0.8, display: 'flex', gap: '16px', justifyContent: 'center', alignItems: 'center' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>Ecossistemas Suportados</span>
          <div style={{ height: '1px', width: '40px', background: 'var(--panel-border)' }} />
          <div style={{ display: 'flex', gap: '12px' }}>
            {['TypeScript', 'Python', 'PHP', 'Dart', 'Kotlin'].map(lang => (
              <span key={lang} style={{ color: 'var(--text-primary)', fontWeight: '500', fontSize: '0.9rem' }}>{lang}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
