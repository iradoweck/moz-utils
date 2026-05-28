import React from 'react';
import { MessageSquare, Target, Users, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function CommunityPage() {
  const { t } = useTranslation();

  return (
    <div className="container animate-fade-up" style={{ padding: '60px 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '16px' }}>{t('nav.community')}</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto' }}>
          Junta-te aos debates, reporta bugs e ajuda a moldar o futuro da biblioteca.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <a href="https://github.com/iradoweck/moz-utils/discussions" target="_blank" rel="noreferrer" className="glass-panel" style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
          <MessageSquare size={32} color="var(--neon-green)" style={{ marginBottom: '16px' }} />
          <h3>Discussões e Debates</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
            Tens uma ideia para uma nova função? Queres discutir a arquitetura? Junta-te às discussões no GitHub.
          </p>
        </a>

        <a href="https://github.com/iradoweck/moz-utils/issues" target="_blank" rel="noreferrer" className="glass-panel" style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
          <AlertCircle size={32} color="#ff3366" style={{ marginBottom: '16px' }} />
          <h3>Reportar Bugs (Issues)</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
            Encontraste um erro na validação de um DIRE ou de um número? Abre uma Issue para podermos corrigir rapidamente.
          </p>
        </a>

        <div className="glass-panel" style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
          <Users size={48} color="var(--neon-green)" />
          <div style={{ flex: 1 }}>
            <h3>Queres tornar-te um Maintainer?</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
              Estamos sempre à procura de talento Moçambicano para ajudar a manter as bibliotecas de TypeScript, PHP, Python, Dart e Kotlin. Contribui ativamente e entra para a Core Team!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
