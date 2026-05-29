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
      <div style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span>{t('footer.sponsoredBy', 'Sponsored and supported by')}</span>
          <img 
            src="/moz-utils/zedecks-it-logo.png" 
            alt="Zedeck's IT" 
            style={{ height: '24px', objectFit: 'contain' }}
            onError={(e) => {
              e.target.src = '/zedecks-it-logo.png';
            }}
          />
          <span>{t('footer.developedByShort', 'and Developed by Edmilson Muacigaro & Community')}</span>
        </div>

        <div style={{ fontSize: '0.9rem', color: 'var(--neon-green)' }}>
          {t('footer.openSource', 'Open Source under AGPL-3.0 License')}
        </div>
        
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <a href="https://github.com/sponsors/iradoweck" target="_blank" rel="noreferrer" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Heart size={16} fill="currentColor" /> {t('footer.donatePrimary', 'Sponsor')}
        </a>
        <a href="https://paypal.me/iradoweck" target="_blank" rel="noreferrer" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--text-secondary)', padding: '12px 24px', borderRadius: '4px', color: 'white', textDecoration: 'none' }}>
          <CreditCard size={16} /> {t('footer.donateSecondary', 'PayPal')}
        </a>
      </div>
    </footer>
  );
}
