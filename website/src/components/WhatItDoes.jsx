import React, { useState } from 'react';
import { CreditCard, Fingerprint, Phone, MapPin } from 'lucide-react';

const capabilities = [
  {
    id: 'nuit',
    icon: <CreditCard size={24} />,
    title: 'Validação de NUIT',
    desc: 'Algoritmo Módulo 11 da AT',
    details: 'Não usamos apenas Expressões Regulares. A biblioteca aplica o algoritmo matemático oficial exigido pela Autoridade Tributária de Moçambique para calcular e validar o dígito de controlo do NUIT.',
    code: `import { validateNUIT } from 'moz-utils';\n\n// Exemplo de uso\nconst isValid = validateNUIT('400000000');\nconsole.log(isValid); // true`
  },
  {
    id: 'bi',
    icon: <Fingerprint size={24} />,
    title: 'Validação de BI',
    desc: 'Suporte a vários formatos',
    details: 'Quer seja o BI antigo (12 números + 1 letra) ou as emissões mais modernas, a ferramenta verifica as estruturas e formatos estabelecidos pela DIC.',
    code: `import { validateBI } from 'moz-utils';\n\n// Verifica a integridade da String\nconst check = validateBI('110100000000B'); \nconsole.log(check); // true`
  },
  {
    id: 'phone',
    icon: <Phone size={24} />,
    title: 'Telefones e Redes',
    desc: 'Normalização e deteção de operadora',
    details: 'Deteta automaticamente se um número pertence à Tmcel, Vodacom ou Movitel. Também lida com prefixos internacionais (+258) e números de telefone fixo.',
    code: `import { getPhoneOperator } from 'moz-utils';\n\nconst details = getPhoneOperator('841234567');\n/* Retorna:\n{\n  isValid: true,\n  operator: 'Vodacom',\n  formatted: '+258 84 123 4567'\n}\n*/`
  },
  {
    id: 'geo',
    icon: <MapPin size={24} />,
    title: 'Geografia Local',
    desc: 'Mapas de Províncias e CEPs',
    details: 'Contém uma base de dados integrada de alta performance (O(1)) para consultar códigos postais e cruzar províncias com distritos sem precisar de internet.',
    code: `import { getProvinceByCEP } from 'moz-utils';\n\nconst prov = getProvinceByCEP('1100');\nconsole.log(prov); // 'Maputo Cidade'`
  }
];

export default function WhatItDoes() {
  const [activeCap, setActiveCap] = useState(capabilities[0]);

  return (
    <section style={{ padding: '80px 0', background: 'var(--body-bg-gradient)' }}>
      <div className="container animate-fade-up">
        
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>O que faz e <span className="text-neon">Como faz</span>?</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
            Não é mágica, é matemática pura. Veja os casos de uso reais que o moz-utils resolve para si.
          </p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px', background: 'var(--panel-bg)', borderRadius: '24px', border: '1px solid var(--panel-border)', padding: '24px', boxShadow: '0 20px 40px var(--shadow-color)' }}>
          
          {/* Menu à Esquerda */}
          <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {capabilities.map(cap => (
              <div 
                key={cap.id} 
                onClick={() => setActiveCap(cap)}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '16px', 
                  padding: '16px', 
                  borderRadius: '16px', 
                  cursor: 'pointer',
                  background: activeCap.id === cap.id ? 'var(--overlay-2)' : 'transparent',
                  border: activeCap.id === cap.id ? '1px solid var(--panel-border)' : '1px solid transparent',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ color: activeCap.id === cap.id ? 'var(--neon-green)' : 'var(--text-secondary)' }}>
                  {cap.icon}
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.1rem', color: activeCap.id === cap.id ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{cap.title}</h4>
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
