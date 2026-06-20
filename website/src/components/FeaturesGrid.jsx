import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Map, Zap, Database } from 'lucide-react';

export default function FeaturesGrid() {
  const { t } = useTranslation();

  const features = [
    {
      icon: <ShieldCheck size={32} color="var(--neon-green)" />,
      title: t('features_grid.cards.0.title'),
      description: t('features_grid.cards.0.description')
    },
    {
      icon: <Zap size={32} color="#ff9f0a" />,
      title: t('features_grid.cards.1.title'),
      description: t('features_grid.cards.1.description')
    },
    {
      icon: <Map size={32} color="#bf5af2" />,
      title: t('features_grid.cards.2.title'),
      description: t('features_grid.cards.2.description')
    },
    {
      icon: <Database size={32} color="#0a84ff" />,
      title: t('features_grid.cards.3.title'),
      description: t('features_grid.cards.3.description')
    }
  ];

  return (
    <section style={{ padding: '80px 0', background: 'var(--body-bg-gradient)' }}>
      <div className="container animate-fade-up">
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>{t('features_grid.title')}<span className="text-neon">{t('features_grid.titleHighlight')}</span></h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
            {t('features_grid.desc')}
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '24px' 
        }}>
          {features.map((f, i) => (
            <div key={i} className="glass-panel" style={{
              padding: '32px 24px',
              transition: 'transform 0.3s ease',
              border: '1px solid var(--panel-border)'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ marginBottom: '20px', background: 'var(--overlay-2)', display: 'inline-block', padding: '12px', borderRadius: '12px' }}>
                {f.icon}
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '12px', color: 'var(--text-primary)' }}>{f.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
