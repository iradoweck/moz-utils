import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText } from 'lucide-react';

export default function Changelog() {
  const { t } = useTranslation();
  const [changelog, setChangelog] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch directly from raw github content
    fetch('https://raw.githubusercontent.com/iradoweck/moz-utils/main/CHANGELOG.md')
      .then(res => res.text())
      .then(text => {
        setChangelog(text);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setChangelog('Erro ao carregar o changelog. Por favor, verifica diretamente no GitHub.');
        setLoading(false);
      });
  }, []);

  return (
    <div className="container animate-fade-up" style={{ padding: '60px 20px', maxWidth: '900px' }}>
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '16px' }}>{t('nav.changelog')}</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto' }}>
          Acompanha todas as novidades, correções e atualizações em cada versão da <strong className="text-neon">moz-utils</strong>.
        </p>
      </div>

      <div className="glass-panel" style={{ padding: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', borderBottom: '1px solid var(--panel-border)', paddingBottom: '16px' }}>
          <FileText color="var(--neon-green)" size={28} />
          <h2 style={{ margin: 0 }}>CHANGELOG.md</h2>
        </div>
        
        {loading ? (
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '40px' }}>A carregar histórico...</p>
        ) : (
          <div style={{ 
            color: 'var(--text-primary)', 
            whiteSpace: 'pre-wrap', 
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            lineHeight: '1.6'
          }}>
            {changelog}
          </div>
        )}
      </div>
    </div>
  );
}
