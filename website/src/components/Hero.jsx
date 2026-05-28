import React from 'react';
import { useTranslation } from 'react-i18next';
import { Terminal, Code, Cpu } from 'lucide-react';

export default function Hero() {
  const { t } = useTranslation();
  
  const scrollToSimulator = () => {
    document.getElementById('simulator')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section style={{ padding: '80px 0', textAlign: 'center' }}>
      <div className="container animate-fade-up">
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <div style={{ 
            background: 'rgba(0, 255, 136, 0.1)', 
            padding: '16px', 
            borderRadius: '50%',
            boxShadow: '0 0 30px rgba(0, 255, 136, 0.2)'
          }}>
            <Cpu size={48} color="var(--neon-green)" />
          </div>
        </div>
        
        <h1 style={{ fontSize: '4rem', marginBottom: '16px', letterSpacing: '-1px' }}>
          {t('hero.title1')}<span className="text-neon">{t('hero.title2')}</span>
        </h1>
        
        <p style={{ 
          fontSize: '1.2rem', 
          color: 'var(--text-secondary)', 
          maxWidth: '600px', 
          margin: '0 auto 40px auto',
          lineHeight: '1.6'
        }}>
          {t('hero.description')}
        </p>
        
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <button onClick={scrollToSimulator} className="btn-primary">
            <Terminal size={20} />
            {t('hero.cta')}
          </button>
          <a href="https://github.com/iradoweck/moz-utils" target="_blank" rel="noreferrer" className="btn-primary" style={{ backgroundColor: 'white', color: 'black', borderColor: 'white' }}>
            <Code size={20} />
            Ver no GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
