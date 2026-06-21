import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Terminal, Copy, Check } from 'lucide-react';

export default function EcosystemInstallation() {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('Node.js');

  const ecosystems = [
    { name: 'Node.js', cmd: 'npm install moz-utils' },
    { name: 'PHP', cmd: 'composer require iradoweck/moz-utils' },
    { name: 'Python', cmd: 'pip install moz-utils' },
    { name: 'Dart', cmd: 'dart pub add moz-utils' },
    { name: 'Kotlin', cmd: 'implementation("com.github.iradoweck:moz-utils:0.3.9")' }
  ];

  const handleCopy = () => {
    const activeEco = ecosystems.find(e => e.name === activeTab);
    if (activeEco) {
      navigator.clipboard.writeText(activeEco.cmd);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getActiveCommand = () => {
    return ecosystems.find(e => e.name === activeTab)?.cmd || '';
  };

  return (
    <section style={{ padding: '80px 20px', backgroundColor: 'rgba(0,255,136,0.02)' }}>
      <div className="container animate-fade-up">
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }} className="text-neon">{t('installation.title')}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            {t('installation.desc')}
          </p>
        </div>

        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
            
            {/* Window Header / Tabs */}
            <div style={{ 
              display: 'flex', 
              backgroundColor: 'var(--overlay-3)', 
              borderBottom: '1px solid var(--panel-border)',
              overflowX: 'auto',
              scrollbarWidth: 'none'
            }}>
              {ecosystems.map((eco) => (
                <button
                  key={eco.name}
                  onClick={() => setActiveTab(eco.name)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    borderBottom: activeTab === eco.name ? '2px solid var(--neon-green)' : '2px solid transparent',
                    color: activeTab === eco.name ? 'var(--text-primary)' : 'var(--text-secondary)',
                    padding: '12px 20px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '0.95rem',
                    transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {eco.name}
                </button>
              ))}
            </div>

            {/* Terminal Body */}
            <div style={{ 
              padding: '24px', 
              backgroundColor: 'var(--dark-bg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflowX: 'auto' }}>
                <Terminal size={20} color="var(--neon-green)" style={{ flexShrink: 0 }} />
                <code style={{ color: 'var(--text-primary)', fontSize: '1.1rem', fontFamily: 'monospace' }}>
                  <span style={{ color: 'var(--error-text)' }}>$</span> {getActiveCommand()}
                </code>
              </div>
              
              <button 
                onClick={handleCopy}
                style={{ 
                  background: 'var(--overlay-1)', 
                  border: '1px solid var(--panel-border)', 
                  color: copied ? 'var(--neon-green)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease',
                  flexShrink: 0,
                  marginLeft: '16px'
                }}
                title="Copiar comando"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{copied ? t('installation.copied') : t('installation.copy')}</span>
              </button>
            </div>
          </div>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link to="/community" className="btn-secondary" style={{ padding: '12px 32px' }}>
            {t('installation.joinCommunity')}
          </Link>
        </div>
      </div>
    </section>
  );
}
