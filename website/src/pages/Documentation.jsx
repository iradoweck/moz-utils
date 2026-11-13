import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';
import MarkdownRenderer from '../components/docs/MarkdownRenderer';
import { 
  Book, Compass, Download, Phone, CreditCard, Landmark, 
  Mail, ChevronRight, ChevronLeft, Cpu, AlertTriangle, 
  ShieldCheck, FileCode2, Check, Bot, Sparkles, Building2,
  Search
} from 'lucide-react';
import SearchModal from '../components/SearchModal';

const DOCS_CATEGORIES = [
  {
    name: 'Começar',
    items: [
      { id: 'overview', icon: <Compass size={15} />, label: 'Visão Geral & Paridade' },
      { id: 'installation', icon: <Download size={15} />, label: 'Instalação Polyglot' },
      { id: 'requirements', icon: <Cpu size={15} />, label: 'Requisitos do Sistema' },
      { id: 'migration-v040', icon: <Sparkles size={15} />, label: 'Novidades da v0.4.0' },
    ]
  },
  {
    name: 'Módulos de Domínio Nacional',
    items: [
      { id: 'banking', icon: <Building2 size={15} />, label: 'Módulo Bancário (NIB & IBAN)' },
      { id: 'phones', icon: <Phone size={15} />, label: 'Telefonia & Carteiras (88)' },
      { id: 'documents', icon: <CreditCard size={15} />, label: 'Documentos (NUIT & BI)' },
      { id: 'currency', icon: <Landmark size={15} />, label: 'Moeda Metical (MZN/MT)' },
      { id: 'geography', icon: <Book size={15} />, label: 'Geografia & Distritos' },
      { id: 'postal', icon: <Mail size={15} />, label: 'Novo CEP Moçambique' },
      { id: 'sanitization', icon: <ShieldCheck size={15} />, label: 'Sanitização de Dados' },
    ]
  },
  {
    name: 'Integração & Suporte',
    items: [
      { id: 'web-frameworks', icon: <FileCode2 size={15} />, label: 'Guias de Frameworks' },
      { id: 'troubleshooting', icon: <AlertTriangle size={15} />, label: 'Resolução de Problemas' },
    ]
  }
];

const ALL_PAGES = DOCS_CATEGORIES.flatMap(c => c.items);

export default function Documentation() {
  const { i18n } = useTranslation();
  const lang = i18n.language?.startsWith('pt') ? 'pt' : 'en';
  const { docId } = useParams();
  const navigate = useNavigate();

  const validDocId = docId && ALL_PAGES.some(p => p.id === docId) ? docId : 'overview';
  const [content, setContent] = useState('');
  const [headings, setHeadings] = useState([]);
  const [copiedContext, setCopiedContext] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useSEO(
    'Documentação Oficial e Guias Didáticos — moz-utils',
    'Guia completo e didático da biblioteca moz-utils para TypeScript, Python, PHP, Dart e Kotlin com exemplos e regras de negócio.'
  );

  const activeDoc = validDocId;
  const activeIndex = ALL_PAGES.findIndex(p => p.id === activeDoc);
  const prevPage = activeIndex > 0 ? ALL_PAGES[activeIndex - 1] : null;
  const nextPage = activeIndex < ALL_PAGES.length - 1 ? ALL_PAGES[activeIndex + 1] : null;

  const currentCategory = DOCS_CATEGORIES.find(c => c.items.some(p => p.id === activeDoc))?.name || 'Documentação';
  const currentPageInfo = ALL_PAGES.find(p => p.id === activeDoc);

  useEffect(() => {
    const page = ALL_PAGES.find(p => p.id === activeDoc);
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

        const extractedHeadings = [];
        const seenIds = {};
        const lines = text.split('\n');
        lines.forEach(line => {
          const match = line.match(/^(#{2,3})\s+(.*)/);
          if (match) {
            const level = match[1].length;
            const textContent = match[2].replace(/[[\]]/g, '').replace(/\(.*\)/g, '');
            const rawId = textContent.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
            seenIds[rawId] = (seenIds[rawId] || 0) + 1;
            const id = seenIds[rawId] === 1 ? rawId : `${rawId}-${seenIds[rawId] - 1}`;
            extractedHeadings.push({ id, text: textContent, level });
          }
        });
        setHeadings(extractedHeadings);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      })
      .catch(() => setContent('# Página Não Encontrada\nNão foi possível carregar este documento.'));
  }, [activeDoc, lang]);

  const copyAiContext = () => {
    fetch('/llms.txt')
      .then(r => r.text())
      .then(llmText => {
        const fullPayload = `--- INFORMAÇÕES DA LIB MOZ-UTILS (v0.4.0) ---\n${llmText}\n\n--- DOCUMENTAÇÃO ATUAL (${activeDoc}) ---\n${content}`;
        navigator.clipboard.writeText(fullPayload);
        setCopiedContext(true);
        setTimeout(() => setCopiedContext(false), 2500);
      })
      .catch(() => {
        navigator.clipboard.writeText(content);
        setCopiedContext(true);
        setTimeout(() => setCopiedContext(false), 2500);
      });
  };

  const handlePageSelect = (id) => {
    navigate(`/docs/${id}`);
  };

  return (
    <>
      <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', minHeight: 'calc(100vh - 64px)' }}>
        
        {/* 1. Sidebar Categorizada (Estilo TanStack / Tailwind Docs) */}
        <aside style={{ 
          width: '290px', 
          borderRight: '1px solid var(--border-subtle)', 
          backgroundColor: 'rgba(9, 10, 15, 0.95)',
          padding: '24px 16px',
          flexShrink: 0,
          position: 'sticky',
          top: '64px',
          height: 'calc(100vh - 64px)',
          overflowY: 'auto'
        }}>
          {/* Botão de Busca Rápida na Sidebar */}
          <button
            onClick={() => setIsSearchOpen(true)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 12px',
              marginBottom: '16px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-muted)',
              fontSize: '0.84rem',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Search size={14} color="var(--moz-green)" />
              <span>Pesquisar na doc...</span>
            </div>
            <kbd style={{ fontSize: '0.68rem', background: 'rgba(255,255,255,0.08)', padding: '1px 5px', borderRadius: '4px' }}>⌘K</kbd>
          </button>

          {/* Botão Contexto IA */}
          <button
            onClick={copyAiContext}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '9px 12px',
              marginBottom: '24px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: '700',
              backgroundColor: copiedContext ? 'var(--moz-green-subtle)' : 'rgba(99, 102, 241, 0.12)',
              color: copiedContext ? 'var(--moz-green)' : '#818cf8',
              border: copiedContext ? '1px solid var(--moz-green-border)' : '1px solid rgba(99, 102, 241, 0.3)',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            {copiedContext ? <Check size={15} /> : <Bot size={15} />}
            <span>{copiedContext ? 'Contexto de IA Copiado!' : 'Copiar Contexto para IA'}</span>
          </button>

          {/* Categorias e Tópicos */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {DOCS_CATEGORIES.map((cat, idx) => (
              <div key={idx}>
                <div style={{
                  fontSize: '0.74rem',
                  fontWeight: '800',
                  color: 'var(--moz-green)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: '8px',
                  paddingLeft: '10px'
                }}>
                  {cat.name}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  {cat.items.map((item) => {
                    const isCurrent = activeDoc === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handlePageSelect(item.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          border: isCurrent ? '1px solid var(--moz-green-border)' : '1px solid transparent',
                          fontSize: '0.88rem',
                          fontWeight: isCurrent ? '700' : '500',
                          color: isCurrent ? 'var(--moz-green)' : 'var(--text-secondary)',
                          backgroundColor: isCurrent ? 'rgba(0, 255, 136, 0.08)' : 'transparent',
                          textAlign: 'left',
                          cursor: 'pointer',
                          transition: 'all 0.12s ease'
                        }}
                      >
                        <span style={{ color: isCurrent ? 'var(--moz-green)' : 'var(--text-muted)' }}>
                          {item.icon}
                        </span>
                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        {/* 2. Conteúdo Central de Leitura */}
        <main style={{ 
          flex: 1, 
          padding: '36px 48px', 
          maxWidth: '920px',
          backgroundColor: 'transparent'
        }}>
          {/* Breadcrumbs de Navegação */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
            <span>Documentação</span>
            <ChevronRight size={14} />
            <span>{currentCategory}</span>
            <ChevronRight size={14} />
            <span style={{ color: 'var(--moz-green)', fontWeight: '600' }}>{currentPageInfo?.label}</span>
          </div>
          
          {/* Renderização do Artigo Markdown */}
          <div className="docs-content">
            <MarkdownRenderer content={content} />
          </div>

          {/* Paginação Inferior (Anterior / Próximo) */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginTop: '60px', 
            paddingTop: '24px', 
            borderTop: '1px solid var(--border-subtle)' 
          }}>
            {prevPage ? (
              <button
                onClick={() => handlePageSelect(prevPage.id)}
                className="btn-secondary-clean"
                style={{ padding: '8px 16px', fontSize: '0.88rem' }}
              >
                <ChevronLeft size={16} />
                <span>{prevPage.label}</span>
              </button>
            ) : <div />}

            {nextPage ? (
              <button
                onClick={() => handlePageSelect(nextPage.id)}
                className="btn-primary-moz"
                style={{ padding: '8px 16px', fontSize: '0.88rem' }}
              >
                <span>{nextPage.label}</span>
                <ChevronRight size={16} />
              </button>
            ) : <div />}
          </div>
        </main>

        {/* 3. Table of Contents Lateral Direito (TOC) */}
        <aside style={{ 
          width: '260px', 
          padding: '40px 20px', 
          flexShrink: 0,
          position: 'sticky',
          top: '64px',
          height: 'calc(100vh - 64px)',
          overflowY: 'auto'
        }}>
          {headings.length > 0 && (
            <div>
              <div style={{ fontSize: '0.74rem', fontWeight: '800', color: 'var(--moz-green)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '14px' }}>
                Nesta Página
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {headings.map((heading, idx) => (
                  <a
                    key={idx}
                    href={`#${heading.id}`}
                    style={{
                      fontSize: '0.82rem',
                      color: 'var(--text-muted)',
                      textDecoration: 'none',
                      paddingLeft: heading.level === 3 ? '14px' : '0px',
                      borderLeft: '2px solid transparent',
                      transition: 'all 0.12s ease',
                      lineHeight: '1.4'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = 'var(--moz-green)';
                      e.target.style.borderLeftColor = 'var(--moz-green)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = 'var(--text-muted)';
                      e.target.style.borderLeftColor = 'transparent';
                    }}
                  >
                    {heading.text}
                  </a>
                ))}
              </div>
            </div>
          )}
        </aside>

      </div>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
