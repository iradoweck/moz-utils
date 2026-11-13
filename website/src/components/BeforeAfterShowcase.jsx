import React, { useState } from 'react';
import { Check, X, Sparkles } from 'lucide-react';

export default function BeforeAfterShowcase() {
  const [activeExample, setActiveExample] = useState('phone');

  const examples = {
    phone: {
      title: 'Identificação & Roteamento de Operadora e Carteira Móvel',
      subtitle: 'Com prefixo 88 da Movitel e-Mola recém integrado na v0.4.0',
      before: `// [ANTES] Regex frágil, sem validação INCM e manutenção dolorosa
function getOperator(num) {
  const clean = num.replace(/\\D/g, '');
  if (/^(\\+?258)?(84|85)\\d{7}$/.test(clean)) return "Vodacom";
  if (/^(\\+?258)?(82|83)\\d{7}$/.test(clean)) return "Tmcel";
  if (/^(\\+?258)?(86|87)\\d{7}$/.test(clean)) return "Movitel"; // Esqueceu o prefixo 88!
  return "Desconhecido"; // Sem carteira móvel nem normalização E.164
}`,
      after: `// [COM MOZ-UTILS] Roteamento oficial e suporte total a carteiras móveis
import { isValidMozambicanPhone, getMobileOperator, getMobileWallet } from 'moz-utils';

if (isValidMozambicanPhone(userInput)) {
  const operator = getMobileOperator(userInput); // "Movitel"
  const wallet = getMobileWallet(userInput);     // "e-Mola" (suporta 86, 87 e 88)
  // Roteamento imediato para a API C2B correta!
}`
    },
    nuit: {
      title: 'Validação de NUIT da Autoridade Tributária',
      subtitle: 'Algoritmo oficial Módulo 11 com pesos ponderados',
      before: `// [ANTES] Checagem ingênua apenas por tamanho numérico
function checkNUIT(nuit) {
  return /^\\d{9}$/.test(nuit); // Aceita NUITs falsos como 111111111 ou 123456789!
  // Nenhuma checagem de dígito de controle da Autoridade Tributária.
}`,
      after: `// [COM MOZ-UTILS] Módulo 11 rigoroso e classificação jurídica
import { isValidNUIT, getNUITEntityType } from 'moz-utils';

if (isValidNUIT(nuit)) {
  const type = getNUITEntityType(nuit); // "Pessoa Singular" | "Pessoa Colectiva"
  // Rejeita automaticamente dígitos de controle forjados ou corrompidos.
}`
    },
    nib: {
      title: 'Módulo Bancário Nacional & Geração de IBAN',
      subtitle: '21 dígitos sob ISO 7064 Mod 97-10 e catálogo de 22 bancos',
      before: `// [ANTES] Código de terceiro importado ou regex não confiável
function checkNIB(nib) {
  return nib.length === 21; // Falha na compensação bancária e gera estornos!
}`,
      after: `// [COM MOZ-UTILS] Validação do Banco de Moçambique e IBAN MZ59
import { isValidNIB, getBankFromNIB, nibToIBAN } from 'moz-utils';

if (isValidNIB(userNIB)) {
  const bank = getBankFromNIB(userNIB); // { code: "0001", name: "Banco Comercial e de Investimentos" }
  const iban = nibToIBAN(userNIB);       // "MZ59000100000000000003345"
}`
    }
  };

  const cur = examples[activeExample];

  return (
    <section style={{ padding: '70px 20px', borderTop: '1px solid var(--border-subtle)' }}>
      <div className="container">
        
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span className="badge-moz" style={{ marginBottom: '12px' }}>
            <Sparkles size={14} />
            Engenharia de Produção
          </span>
          <h2 style={{ fontSize: '2.3rem', fontWeight: '800', letterSpacing: '-0.03em' }}>
            O Que Muda com o <span style={{ color: 'var(--moz-green)' }}>moz-utils</span> no Seu Código?
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '640px', margin: '12px auto 0 auto', fontSize: '1.05rem' }}>
            Elimine gambiarras, vulnerabilidades e manutenções manuais em validações de Moçambique.
          </p>
        </div>

        {/* Tabs de Seleção */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '32px' }}>
          {[
            { id: 'phone', label: 'Operadoras & Carteiras (Prefixo 88)' },
            { id: 'nuit', label: 'NUIT Fiscal (Módulo 11)' },
            { id: 'nib', label: 'NIB & Bancos (ISO 7064)' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveExample(tab.id)}
              style={{
                padding: '10px 18px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '700',
                backgroundColor: activeExample === tab.id ? 'var(--moz-green)' : 'rgba(255, 255, 255, 0.05)',
                color: activeExample === tab.id ? '#050505' : 'var(--text-secondary)',
                boxShadow: activeExample === tab.id ? 'var(--shadow-glow-green)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Comparação Lado a Lado */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px'
        }}>
          {/* Card Antes */}
          <div style={{
            background: 'rgba(255, 77, 109, 0.04)',
            border: '1px solid var(--moz-red-border)',
            borderRadius: '12px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--moz-red-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={16} color="var(--moz-red)" />
              </div>
              <h4 style={{ margin: 0, color: 'var(--moz-red)', fontSize: '1.1rem' }}>Como a maioria faz (Frágil & Inseguro)</h4>
            </div>

            <pre style={{
              background: '#07080c',
              border: '1px solid rgba(255, 77, 109, 0.2)',
              borderRadius: '8px',
              padding: '16px',
              color: '#f87171',
              fontFamily: 'Fira Code, JetBrains Mono, monospace',
              fontSize: '0.85rem',
              lineHeight: '1.5',
              overflowX: 'auto',
              flex: 1
            }}>
              <code>{cur.before}</code>
            </pre>
          </div>

          {/* Card Depois */}
          <div style={{
            background: 'rgba(0, 255, 136, 0.04)',
            border: '1px solid var(--moz-green-border)',
            borderRadius: '12px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--moz-green-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Check size={16} color="var(--moz-green)" />
              </div>
              <h4 style={{ margin: 0, color: 'var(--moz-green)', fontSize: '1.1rem' }}>Com moz-utils (Oficial & Robusto)</h4>
            </div>

            <pre style={{
              background: '#07080c',
              border: '1px solid rgba(0, 255, 136, 0.25)',
              borderRadius: '8px',
              padding: '16px',
              color: '#4ade80',
              fontFamily: 'Fira Code, JetBrains Mono, monospace',
              fontSize: '0.85rem',
              lineHeight: '1.5',
              overflowX: 'auto',
              flex: 1
            }}>
              <code>{cur.after}</code>
            </pre>
          </div>
        </div>

      </div>
    </section>
  );
}
