import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CreditCard, Fingerprint, Phone, MapPin } from 'lucide-react';

export default function WhatItDoes() {
  const { t } = useTranslation();

  const capabilities = [
    {
      id: 'nuit',
      icon: <CreditCard size={24} />,
      title: t('what_it_does.cards.nuit.title'),
      desc: t('what_it_does.cards.nuit.desc'),
      details: t('what_it_does.cards.nuit.details'),
      code: `import { isValidNUIT } from 'moz-utils';\n\n// Validação de NUIT Singular (Pessoa Física)\nconst valid = isValidNUIT('100000008'); \nconsole.log(valid); // true`
    },
    {
      id: 'bi',
      icon: <Fingerprint size={24} />,
      title: t('what_it_does.cards.bi.title'),
      desc: t('what_it_does.cards.bi.desc'),
      details: t('what_it_does.cards.bi.details'),
      code: `import { isValidBI } from 'moz-utils';\n\n// Verificação estrutural e de check-digit\nconst check = isValidBI('110101234567A'); \nconsole.log(check); // true`
    },
    {
      id: 'phone',
      icon: <Phone size={24} />,
      title: t('what_it_does.cards.phone.title'),
      desc: t('what_it_does.cards.phone.desc'),
      details: t('what_it_does.cards.phone.details'),
      code: `import { getPhoneOperator } from 'moz-utils';\n\nconst details = getPhoneOperator('841234567');\n/* Retorna:\n{\n  isValid: true,\n  operator: 'Vodacom',\n  formatted: '+258 84 123 4567'\n}\n*/`
    },
    {
      id: 'geo',
      icon: <MapPin size={24} />,
      title: t('what_it_does.cards.geo.title'),
      desc: t('what_it_does.cards.geo.desc'),
      details: t('what_it_does.cards.geo.details'),
      code: `import { getProvinceByCEP } from 'moz-utils';\n\nconst prov = getProvinceByCEP('1100');\nconsole.log(prov); // 'Maputo Cidade'`
    }
  ];

  const [activeId, setActiveId] = useState('nuit');
  const activeCap = capabilities.find(c => c.id === activeId) || capabilities[0];

  return (
    <section style={{ padding: '80px 0', background: 'var(--body-bg-gradient)' }}>
      <div className="container animate-fade-up">
        
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>{t('what_it_does.title')}<span className="text-neon">{t('what_it_does.titleHighlight')}</span></h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
            {t('what_it_does.desc')}
          </p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px', background: 'var(--panel-bg)', borderRadius: '24px', border: '1px solid var(--panel-border)', padding: '24px', boxShadow: '0 20px 40px var(--shadow-color)' }}>
          
          {/* Menu à Esquerda */}
          <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {capabilities.map(cap => (
              <div 
                key={cap.id} 
                onClick={() => setActiveId(cap.id)}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '16px', 
                  padding: '16px', 
                  borderRadius: '16px', 
                  cursor: 'pointer',
                  background: activeId === cap.id ? 'var(--overlay-2)' : 'transparent',
                  border: activeId === cap.id ? '1px solid var(--panel-border)' : '1px solid transparent',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ color: activeId === cap.id ? 'var(--neon-green)' : 'var(--text-secondary)' }}>
                  {cap.icon}
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.1rem', color: activeId === cap.id ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{cap.title}</h4>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{cap.desc}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Área de Detalhes à Direita */}
          <div style={{ flex: '2 1 400px', display: 'flex', flexDirection: 'column', gap: '20px', padding: '16px' }}>
            <h3 style={{ fontSize: '1.8rem', color: 'var(--text-primary)' }}>{activeCap.title}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.6' }}>
              {activeCap.details}
            </p>
            
            <div style={{ 
              background: 'var(--dark-bg)', 
              borderRadius: '12px', 
              padding: '24px', 
              border: '1px solid var(--panel-border)',
              marginTop: 'auto'
            }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--error-text)' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--warning-bg)' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--success-bg)' }} />
              </div>
              <pre style={{ margin: 0, fontFamily: 'monospace', color: 'var(--text-primary)', fontSize: '0.95rem', overflowX: 'auto', whiteSpace: 'pre-wrap' }}>
                <code>{activeCap.code}</code>
              </pre>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
