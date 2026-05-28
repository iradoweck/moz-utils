import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { GitBranch, Heart } from 'lucide-react';

export default function Navbar() {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'pt' ? 'en' : 'pt');
  };

  return (
    <nav style={{ 
      padding: '20px 40px', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      borderBottom: '1px solid var(--panel-border)',
      position: 'sticky',
      top: 0,
      backgroundColor: 'rgba(10,10,10,0.8)',
      backdropFilter: 'blur(10px)',
      zIndex: 1000
    }}>
      <div style={{ fontWeight: 'bold', fontSize: '1.2rem', letterSpacing: '-0.5px' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
          moz-<span className="text-neon">utils</span>
        </Link>
      </div>
      
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <Link to="/docs" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>{t('nav.docs')}</Link>
        <Link to="/insights" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>{t('nav.insights')}</Link>
        <Link to="/community" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>{t('nav.community')}</Link>
        <Link to="/changelog" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>{t('nav.changelog')}</Link>
        
        <button 
          onClick={toggleLanguage} 
          style={{ 
            background: 'transparent', 
            border: '1px solid var(--neon-green)', 
            color: 'var(--neon-green)', 
            padding: '4px 8px', 
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          {i18n.language.toUpperCase()}
        </button>

        <a href="https://github.com/iradoweck/moz-utils" target="_blank" rel="noreferrer" style={{ color: 'white', display: 'flex', alignItems: 'center' }}>
          <GitBranch size={20} />
        </a>

        <a href="https://github.com/sponsors/iradoweck" target="_blank" rel="noreferrer" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px' }}>
          <Heart size={16} fill="currentColor" /> {t('nav.donate')}
        </a>
      </div>
    </nav>
  );
}
