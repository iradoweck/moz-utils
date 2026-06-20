import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { GitBranch, Heart, Sun, Moon } from 'lucide-react';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    }
    return 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'pt' ? 'en' : 'pt');
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
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
      backgroundColor: 'var(--nav-bg)',
      backdropFilter: 'blur(10px)',
      zIndex: 1000
    }}>
      <div style={{ fontWeight: 'bold', fontSize: '1.2rem', letterSpacing: '-0.5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Link to="/" style={{ color: 'var(--text-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src="/logo.svg" alt="moz-utils logo" style={{ width: '28px', height: '28px' }} />
          <span>moz-<span className="text-neon">utils</span></span>
        </Link>
      </div>
      
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <Link to="/docs" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: '500' }}>{t('nav.docs')}</Link>
        <Link to="/insights" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: '500' }}>{t('nav.insights')}</Link>
        <Link to="/community" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: '500' }}>{t('nav.community')}</Link>
        <Link to="/changelog" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: '500' }}>{t('nav.changelog')}</Link>
        
        <button 
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Mudar para Claro' : 'Mudar para Escuro'}
          style={{ 
            background: 'transparent', 
            border: 'none', 
            color: 'var(--text-primary)', 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            padding: '4px'
          }}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

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

        <a href="https://github.com/iradoweck/moz-utils" target="_blank" rel="noreferrer" style={{ color: 'var(--text-primary)', display: 'flex', alignItems: 'center' }}>
          <GitBranch size={20} />
        </a>

        <a href="https://github.com/sponsors/iradoweck" target="_blank" rel="noreferrer" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px' }}>
          <Heart size={16} fill="currentColor" /> {t('nav.donate')}
        </a>
      </div>
    </nav>
  );
}
