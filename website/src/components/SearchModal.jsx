import React, { useState, useEffect } from 'react';
import { Search, ArrowRight, X, Phone, Building2, CreditCard, Landmark, MapPin, ShieldCheck, Sparkles, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SEARCH_INDEX = [
  {
    id: 'nuit',
    title: 'isValidNUIT & getNUITEntityType',
    desc: 'Validação oficial de NUIT pelo algoritmo Módulo 11 da Autoridade Tributária.',
    category: 'Documentos Fiscais',
    link: '/docs/documents',
    icon: <CreditCard size={18} color="#00ff88" />
  },
  {
    id: 'nib',
    title: 'isValidNIB & getBankFromNIB & nibToIBAN',
    desc: 'Validação ISO 7064 Mod 97-10, catálogo de 22 bancos nacionais e conversão para IBAN MZ59.',
    category: 'Módulo Bancário',
    link: '/docs/banking',
    icon: <Building2 size={18} color="#00ff88" />
  },
  {
    id: 'phones',
    title: 'isValidMozambicanPhone & getMobileWallet',
    desc: 'Validação de operadoras (Vodacom, Tmcel, Movitel) e carteiras móveis (M-Pesa, e-Mola com prefixo 88, mKesh).',
    category: 'Telefonia & Carteiras',
    link: '/docs/phones',
    icon: <Phone size={18} color="#00ff88" />
  },
  {
    id: 'bi',
    title: 'isValidBI, isValidDIRE, isValidPassport, isValidDrivingLicense',
    desc: 'Validação estrutural e cálculo de dígito de controlo para documentos oficiais.',
    category: 'Identidade Civil',
    link: '/docs/documents',
    icon: <ShieldCheck size={18} color="#00ff88" />
  },
  {
    id: 'mzn',
    title: 'formatMZN & parseMZN',
    desc: 'Formatação oficial da moeda moçambicana (Meticais MT) e conversão segura.',
    category: 'Moeda & Finanças',
    link: '/docs/currency',
    icon: <Landmark size={18} color="#facc15" />
  },
  {
    id: 'cep',
    title: 'isValidNewCEP & suggestCEPs & Base Offline',
    desc: 'Novo Código de Endereçamento Postal de 6 dígitos e dados de distritos/províncias.',
    category: 'Geografia & Logística',
    link: '/docs/postal',
    icon: <MapPin size={18} color="#00ff88" />
  },
  {
    id: 'geography',
    title: 'mozambiqueProvinces & getAllDistricts',
    desc: 'Base de dados offline completa das 11 províncias e 161 distritos de Moçambique.',
    category: 'Geografia',
    link: '/docs/geography',
    icon: <MapPin size={18} color="#00ff88" />
  },
  {
    id: 'quickstart',
    title: 'Instalação Polyglot (npm, pip, composer, pub, gradle)',
    desc: 'Guia de instalação e configuração inicial nas 5 linguagens com paridade absoluta.',
    category: 'Primeiros Passos',
    link: '/docs/installation',
    icon: <Sparkles size={18} color="#00ff88" />
  },
  {
    id: 'frameworks',
    title: 'Guias de Integração em Frameworks',
    desc: 'Como integrar moz-utils no Laravel, Django, Next.js, Flutter, Spring Boot e Fastify.',
    category: 'Guias & Frameworks',
    link: '/docs/web-frameworks',
    icon: <BookOpen size={18} color="#00ff88" />
  }
];

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // abre via parent se configurado
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filtered = SEARCH_INDEX.filter((item) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      item.title.toLowerCase().includes(q) ||
      item.desc.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  });

  const handleSelect = (item) => {
    navigate(item.link);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      paddingTop: '100px',
      zIndex: 9999
    }} onClick={onClose}>
      <div 
        style={{
          width: '100%',
          maxWidth: '640px',
          backgroundColor: '#0c0e17',
          border: '1px solid var(--border-strong)',
          borderRadius: '14px',
          boxShadow: 'var(--shadow-glow-terminal)',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-subtle)',
          gap: '12px'
        }}>
          <Search size={20} color="var(--moz-green)" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
            placeholder="Buscar funções, módulos bancários, prefixos ou CEPs..."
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: '1.05rem',
              fontFamily: 'inherit'
            }}
          />
          <button 
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Results List */}
        <div style={{ maxHeight: '380px', overflowY: 'auto', padding: '8px' }}>
          {filtered.length === 0 ? (
            <div style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
              Nenhum resultado encontrado para &quot;{query}&quot;
            </div>
          ) : (
            filtered.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    backgroundColor: isSelected ? 'rgba(0, 255, 136, 0.08)' : 'transparent',
                    border: isSelected ? '1px solid var(--moz-green-border)' : '1px solid transparent',
                    transition: 'all 0.12s ease'
                  }}
                >
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {item.icon}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.92rem', fontWeight: '700', color: isSelected ? 'var(--moz-green)' : 'var(--text-primary)', fontFamily: 'Fira Code, monospace' }}>
                        {item.title}
                      </span>
                      <span style={{ fontSize: '0.72rem', padding: '1px 6px', borderRadius: '4px', backgroundColor: 'rgba(255, 255, 255, 0.08)', color: 'var(--text-muted)' }}>
                        {item.category}
                      </span>
                    </div>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.desc}
                    </p>
                  </div>

                  <ArrowRight size={16} color={isSelected ? 'var(--moz-green)' : 'transparent'} />
                </div>
              );
            })
          )}
        </div>

        {/* Footer Shortcut Helper */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 16px',
          borderTop: '1px solid var(--border-subtle)',
          backgroundColor: 'rgba(0, 0, 0, 0.25)',
          fontSize: '0.78rem',
          color: 'var(--text-muted)'
        }}>
          <span>Navegue com setas ou clique</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ padding: '2px 6px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px' }}>ESC</span> para fechar
          </div>
        </div>

      </div>
    </div>
  );
}
