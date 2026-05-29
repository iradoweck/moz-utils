import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSEO } from '../hooks/useSEO';
import MarkdownRenderer from '../components/docs/MarkdownRenderer';
import { Book, Compass, Download, Phone, CreditCard, Landmark, ShieldCheck, Mail, ChevronRight, ChevronLeft } from 'lucide-react';

const DOCS_PAGES = [
  { id: 'overview', icon: <Compass size={16} />, label: 'Overview' },
  { id: 'installation', icon: <Download size={16} />, label: 'Installation' },
  { id: 'phones', icon: <Phone size={16} />, label: 'Phones & Mobile' },
  { id: 'documents', icon: <CreditCard size={16} />, label: 'Identity Documents' },
  { id: 'currency', icon: <Landmark size={16} />, label: 'Currency (MZN)' },
  { id: 'geography', icon: <Book size={16} />, label: 'Geography & Districts' },
  { id: 'postal', icon: <Mail size={16} />, label: 'Postal Codes (CEP)' },
];

export default function Documentation() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.startsWith('pt') ? 'pt' : 'en';
  useSEO(t('docs_page.title', 'Documentation'), t('docs_page.description', 'Comprehensive guide on how to use moz-utils across all supported ecosystems.'));

  const [activeDoc, setActiveDoc] = useState('overview');
  const [content, setContent] = useState('');
  const [headings, setHeadings] = useState([]);
  const [activeHeading, setActiveHeading] = useState('');

  const activeIndex = DOCS_PAGES.findIndex(p => p.id === activeDoc);
  const prevPage = activeIndex > 0 ? DOCS_PAGES.find((_, i) => i === activeIndex - 1) ?? null : null;
  const nextPage = activeIndex < DOCS_PAGES.length - 1 ? DOCS_PAGES.find((_, i) => i === activeIndex + 1) ?? null : null;

  // Fetch Markdown file — language-aware (*.pt.md or *.en.md)
  useEffect(() => {
    const page = DOCS_PAGES.find(p => p.id === activeDoc);
    if (!page) return;

    const localizedFile = `${page.id}.${lang}.md`;
    const fallbackFile = `${page.id}.en.md`;

    const tryFetch = (path) => fetch(path).then(res => {
      if (!res.ok) throw new Error('not found');
      return res.text();
    });

    tryFetch(`/docs/${localizedFile}`)
      .catch(() => tryFetch(`/moz-utils/docs/${localizedFile}`))
      .catch(() => tryFetch(`/docs/${fallbackFile}`))
      .catch(() => tryFetch(`/moz-utils/docs/${fallbackFile}`))
      .then(text => {
        setContent(text);

        // Extract headings for Table of Contents
        const extractedHeadings = [];
        const lines = text.split('\n');
        lines.forEach(line => {
          const match = line.match(/^(#{2,3})\s+(.*)/);
          if (match) {
            const level = match[1].length;
            const textContent = match[2].replace(/[\[\]]/g, '').replace(/\(.*\)/g, '');
            const id = textContent.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
            extractedHeadings.push({ id, text: textContent, level });
          }
        });
        setHeadings(extractedHeadings);
        window.scrollTo({ top: 0, behavior: 'auto' });
      })
      .catch(() => setContent('# Page Not Found\nWe could not load this documentation page.'));
  }, [activeDoc, lang]);

  // Track scroll for active heading in TOC
  useEffect(() => {
    const handleScroll = () => {
      let current = '';
      for (const heading of headings) {
        const el = document.getElementById(heading.id);
        if (el) {
          const top = el.getBoundingClientRect().top;
          if (top >= 0 && top < window.innerHeight / 3) {
            current = heading.id;
            break;
          } else if (top < 0) {
            current = heading.id;
          }
        }
      }
      if (current) setActiveHeading(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  return (
    <div className="animate-fade-up" style={{
      display: 'flex',
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '40px 20px',
      gap: '40px',
      position: 'relative'
    }}>

      {/* ── Left Sidebar (Navigation) ── */}
      <aside style={{
        width: '250px',
        flexShrink: 0,
        position: 'sticky',
        top: '80px',
        height: 'calc(100vh - 100px)',
        overflowY: 'auto'
      }} className="desktop-sidebar">
        <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '1px', marginBottom: '16px' }}>
          {t('docs_page.menu.title', 'Contents')}
        </h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {DOCS_PAGES.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveDoc(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  width: '100%',
                  textAlign: 'left',
                  cursor: 'pointer',
                  color: activeDoc === item.id ? 'var(--neon-green)' : 'var(--text-secondary)',
                  backgroundColor: activeDoc === item.id ? 'rgba(0, 255, 136, 0.1)' : 'transparent',
                  fontWeight: activeDoc === item.id ? '600' : 'normal',
                  transition: 'all 0.2s ease',
                  fontSize: '0.9rem'
                }}
                onMouseOver={e => { if (activeDoc !== item.id) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; }}
                onMouseOut={e => { if (activeDoc !== item.id) e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                {item.icon}
                {t(`docs_page.menu.${item.id}`, item.label)}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* ── Center Content (Markdown) ── */}
      <main style={{ flex: 1, minWidth: 0 }}>
        <MarkdownRenderer content={content} />

        {/* ── Prev / Next Pagination ── */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'stretch',
          gap: '16px',
          marginTop: '64px',
          paddingTop: '32px',
          borderTop: '1px solid var(--panel-border)'
        }}>

          {/* Previous */}
          {prevPage ? (
            <button
              onClick={() => setActiveDoc(prevPage.id)}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '20px 24px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--panel-border)',
                borderRadius: '12px',
                cursor: 'pointer',
                color: 'var(--text-primary)',
                textAlign: 'left',
                transition: 'all 0.2s ease',
                textDecoration: 'none'
              }}
              onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--neon-green)'; e.currentTarget.style.background = 'rgba(0,255,136,0.05)'; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--panel-border)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
            >
              <ChevronLeft size={20} style={{ color: 'var(--neon-green)', flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {t('docs_page.pagination.previous', 'Previous')}
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {prevPage.icon}
                  {prevPage.label}
                </div>
              </div>
            </button>
          ) : <div style={{ flex: 1 }} />}

          {/* Next */}
          {nextPage ? (
            <button
              onClick={() => setActiveDoc(nextPage.id)}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '12px',
                padding: '20px 24px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--panel-border)',
                borderRadius: '12px',
                cursor: 'pointer',
                color: 'var(--text-primary)',
                textAlign: 'right',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--neon-green)'; e.currentTarget.style.background = 'rgba(0,255,136,0.05)'; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--panel-border)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
            >
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {t('docs_page.pagination.next', 'Next')}
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {nextPage.icon}
                  {nextPage.label}
                </div>
              </div>
              <ChevronRight size={20} style={{ color: 'var(--neon-green)', flexShrink: 0 }} />
            </button>
          ) : <div style={{ flex: 1 }} />}

        </div>

        {/* ── Bottom spacer ── */}
        <div style={{ height: '80px' }} />
      </main>

      {/* ── Right Sidebar (Table of Contents) ── */}
      <aside style={{
        width: '200px',
        flexShrink: 0,
        position: 'sticky',
        top: '80px',
        height: 'calc(100vh - 100px)',
        overflowY: 'auto'
      }} className="desktop-toc">
        {headings.length > 0 && (
          <>
            <h3 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '1px', marginBottom: '16px' }}>
              {t('docs_page.on_this_page', 'On this page')}
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px', borderLeft: '1px solid var(--panel-border)' }}>
              {headings.map((h) => (
                <li key={h.id} style={{
                  paddingLeft: h.level === 3 ? '20px' : '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  {h.level === 2 ?
                    <ChevronRight size={12} style={{ color: activeHeading === h.id ? 'var(--neon-green)' : 'var(--text-secondary)', flexShrink: 0, transition: 'color 0.2s ease' }} /> :
                    <span style={{ width: '12px', textAlign: 'center', color: activeHeading === h.id ? 'var(--neon-green)' : 'var(--text-secondary)', fontSize: '10px' }}>—</span>
                  }
                  <a
                    href={`#${h.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      const element = document.getElementById(h.id);
                      if (element) {
                        const y = element.getBoundingClientRect().top + window.scrollY - 100;
                        window.scrollTo({ top: y, behavior: 'smooth' });
                      }
                    }}
                    style={{
                      textDecoration: 'none',
                      color: activeHeading === h.id ? 'var(--neon-green)' : 'var(--text-secondary)',
                      fontSize: '0.8rem',
                      display: 'block',
                      transition: 'color 0.2s ease',
                      fontWeight: activeHeading === h.id ? '600' : 'normal',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      lineHeight: '1.4'
                    }}
                  >
                    {h.text}
                  </a>
                </li>
              ))}
            </ul>
          </>
        )}
      </aside>

    </div>
  );
}
