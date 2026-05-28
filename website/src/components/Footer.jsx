import React from 'react';
import { useTranslation } from 'react-i18next';
import { Heart, CreditCard } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer style={{ 
      padding: '40px 20px', 
      textAlign: 'center', 
      borderTop: '1px solid var(--panel-border)',
      marginTop: '40px',
      color: 'var(--text-secondary)'
    }}>
      <div style={{ marginBottom: '20px' }}>
        <p style={{ marginBottom: '8px' }}>{t('footer.developedBy')}</p>
        <p style={{ fontSize: '0.9rem', color: 'var(--neon-green)' }}>{t('footer.openSource')}</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <a href="https://github.com/sponsors/iradoweck" target="_blank" rel="noreferrer" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Heart size={16} fill="currentColor" /> {t('footer.donatePrimary')}
        </a>
        <a href="https://paypal.me/iradoweck" target="_blank" rel="noreferrer" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--text-secondary)', padding: '12px 24px', borderRadius: '4px', color: 'white', textDecoration: 'none' }}>
          <CreditCard size={16} /> {t('footer.donateSecondary')}
        </a>
      </div>
    </footer>
  );
}
