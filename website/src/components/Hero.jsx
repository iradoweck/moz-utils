import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Terminal } from 'lucide-react';
import { Link } from 'react-router-dom';
import WorldMapNodes from './WorldMapNodes';
import PolyglotShowcase from './PolyglotShowcase';

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section style={{ paddingTop: '160px', paddingBottom: '40px', textAlign: 'center', position: 'relative', overflow: 'hidden', minHeight: '90vh', display: 'flex', alignItems: 'center' }}>
      
      {/* Vercel-style Top Glow */}
      <div style={{
        position: 'absolute', top: '-20%', left: '50%', transform: 'translateX(-50%)',
        width: '600px', height: '600px',
        background: 'radial-gradient(circle, var(--neon-green) 0%, transparent 60%)',
        opacity: '0.07',
        filter: 'blur(80px)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      {/* Interactive Map Background (Watermark Mode) */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, opacity: 0.1, pointerEvents: 'none' }}>
        <WorldMapNodes />
      </div>

      <div className="container animate-fade-up" style={{ position: 'relative', zIndex: 10, width: '100%' }}>

        <h1 style={{ 
          fontSize: 'clamp(3.5rem, 8vw, 6.5rem)', 
          marginBottom: '24px', 
          lineHeight: '1',
          letterSpacing: '-0.06em',
          fontWeight: '800',
          color: 'var(--text-primary)',
          textWrap: 'balance'
        }}>
          Mozambique Utilities
        </h1>
        
        <p style={{ 
          fontSize: '1.25rem', 
          color: 'var(--text-secondary)', 
          maxWidth: '750px', 
          margin: '0 auto 48px auto',
          lineHeight: '1.6',
          fontWeight: '400',
          letterSpacing: '-0.01em',
          textWrap: 'balance'
        }}>
          A fundação open-source definitiva para software em Moçambique. Muito além de simples validações: algoritmos matemáticos rigorosos, inteligência de operadoras, dados geográficos estruturados e formatação financeira, perfeitamente integrados em 5 ecossistemas nativos.
        </p>
        
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '80px' }}>
          <Link to="/docs" className="btn-primary">
            <Terminal size={18} /> Explorar a Documentação
          </Link>
          <a href="https://github.com/iradoweck/moz-utils" target="_blank" rel="noreferrer" className="btn-secondary">
            Ver no GitHub <ArrowRight size={18} />
          </a>
        </div>

        {/* Embedded PolyglotShowcase directly in Hero (React.dev style) */}
        <div style={{ margin: '0 auto', maxWidth: '1000px', textAlign: 'left' }}>
          <PolyglotShowcase embedded={true} />
        </div>
      </div>
    </section>
  );
}
