import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Globe, Bot, BookOpen, BarChart3, Users, History, PlayCircle, Heart, GitBranch } from 'lucide-react';
import FloatingPlaygroundModal from './FloatingPlaygroundModal';

const MozambiqueFlagSVG = () => (
  <svg width="28" height="20" viewBox="0 0 30 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: '3px', flexShrink: 0, boxShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
    <rect width="30" height="6.3" fill="#007168" />
    <rect y="6.3" width="30" height="0.6" fill="#FFFFFF" />
    <rect y="6.9" width="30" height="6.2" fill="#000000" />
    <rect y="13.1" width="30" height="0.6" fill="#FFFFFF" />
    <rect y="13.7" width="30" height="6.3" fill="#FCE100" />
    <polygon points="0,0 13,10 0,20" fill="#D21034" />
    <polygon points="4.2,7.2 4.9,9.2 7,9.2 5.3,10.4 5.9,12.4 4.2,11.2 2.5,12.4 3.1,10.4 1.4,9.2 3.5,9.2" fill="#FCE100" />
  </svg>
);

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [isPlaygroundOpen, setIsPlaygroundOpen] = useState(false);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'pt' ? 'en' : 'pt');
  };

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <nav style={{ 
        padding: '0 24px',
        height: '64px',
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        borderBottom: '1px solid var(--border-subtle)',
        position: 'sticky',
        top: 0,
        backgroundColor: 'rgba(9, 10, 15, 0.88)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        zIndex: 1000
      }}>
        {/* Brand & Mozambique Flag SVG */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <MozambiqueFlagSVG />
            <span style={{ fontWeight: '800', fontSize: '1.25rem', letterSpacing: '-0.03em', color: 'var(--text-primary)', display: 'inline-flex', alignItems: 'flex-start' }}>
              moz<span style={{ color: 'var(--moz-green)' }}>-utils</span>
              <sup style={{
                fontSize: '0.62rem',
                fontWeight: '700',
                color: 'var(--moz-green)',
                marginLeft: '4px',
                marginTop: '2px',
                letterSpacing: '0',
                opacity: 0.9
              }}>
                v0.4.0
              </sup>
            </span>
          </Link>
        </div>
        
        {/* Navigation Links */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={() => setIsPlaygroundOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '0.88rem',
              fontWeight: '700',
              color: '#050505',
              backgroundColor: 'var(--moz-green)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              boxShadow: '0 0 10px rgba(0, 255, 136, 0.25)'
            }}
          >
            <PlayCircle size={15} />
            <span>Playground</span>
          </button>

          <Link 
            to="/docs" 
            style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '0.9rem',
              fontWeight: '600',
              color: isActive('/docs') ? 'var(--moz-green)' : 'var(--text-secondary)',
              backgroundColor: isActive('/docs') ? 'var(--moz-green-subtle)' : 'transparent',
              textDecoration: 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <BookOpen size={15} />
            {t('nav.docs', 'Docs')}
          </Link>

          <Link 
            to="/insights" 
            style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '0.9rem',
              fontWeight: '600',
              color: isActive('/insights') ? 'var(--moz-green)' : 'var(--text-secondary)',
              backgroundColor: isActive('/insights') ? 'var(--moz-green-subtle)' : 'transparent',
              textDecoration: 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <BarChart3 size={15} />
            {t('nav.insights', 'Insights')}
          </Link>

          <Link 
            to="/community" 
            style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '0.9rem',
              fontWeight: '600',
              color: isActive('/community') ? 'var(--moz-green)' : 'var(--text-secondary)',
              backgroundColor: isActive('/community') ? 'var(--moz-green-subtle)' : 'transparent',
              textDecoration: 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <Users size={15} />
            {t('nav.community', 'Comunidade')}
          </Link>

          <Link 
            to="/changelog" 
            style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '0.9rem',
              fontWeight: '600',
              color: isActive('/changelog') ? 'var(--moz-green)' : 'var(--text-secondary)',
              backgroundColor: isActive('/changelog') ? 'var(--moz-green-subtle)' : 'transparent',
              textDecoration: 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <History size={15} />
            {t('nav.changelog', 'Changelog')}
          </Link>

          {/* Separador vertical */}
          <div style={{ width: '1px', height: '20px', backgroundColor: 'var(--border-subtle)', margin: '0 4px' }} />

          {/* Botão Contexto para IA */}
          <a 
            href="/llms.txt" 
            target="_blank" 
            rel="noreferrer"
            title="Ver especificação para Agentes de IA (llms.txt)"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 10px',
              borderRadius: '6px',
              fontSize: '0.85rem',
              fontWeight: '600',
              color: 'var(--moz-green)',
              backgroundColor: 'var(--moz-green-subtle)',
              border: '1px solid var(--moz-green-border)',
              textDecoration: 'none'
            }}
          >
            <Bot size={15} />
            <span>llms.txt</span>
          </a>

          {/* Idioma Switcher */}
          <button 
            onClick={toggleLanguage} 
            style={{ 
              background: 'var(--bg-muted)', 
              border: '1px solid var(--border-subtle)', 
              color: 'var(--text-primary)', 
              padding: '6px 10px', 
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Globe size={14} />
            {i18n.language.toUpperCase()}
          </button>

          {/* GitHub da Biblioteca */}
          <a
            href="https://github.com/iradoweck/moz-utils"
            target="_blank"
            rel="noreferrer"
            title="Repositório no GitHub"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '7px',
              borderRadius: '6px',
              color: 'var(--text-primary)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)',
              textDecoration: 'none'
            }}
          >
            <GitBranch size={16} />
          </a>

          {/* Botão Doar */}
          <a
            href="https://github.com/sponsors/iradoweck"
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '0.85rem',
              fontWeight: '700',
              color: '#ffffff',
              backgroundColor: 'var(--moz-red)',
              textDecoration: 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <Heart size={14} fill="currentColor" />
            <span>{t('nav.donate', 'Doar')}</span>
          </a>
        </div>
      </nav>

      {/* Modal Global de Playground */}
      <FloatingPlaygroundModal isOpen={isPlaygroundOpen} onClose={() => setIsPlaygroundOpen(false)} />
    </>
  );
}
