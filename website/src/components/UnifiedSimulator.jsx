import React, { useState } from 'react';
import { 
  CheckCircle2, XCircle, AlertCircle, Copy, Check
} from 'lucide-react';

import {
  isValidNUIT, getNUITEntityType,
  isValidMozambicanPhone, getMobileOperator, getMobileWallet, formatMozambicanPhone,
  isValidNIB, formatNIB, getBankFromNIB, nibToIBAN,
  isValidBI, isValidPassport, isValidDIRE, isValidDrivingLicense,
  formatMZN,
  isValidNewCEP, suggestCEPs
} from 'moz-utils';

export default function UnifiedSimulator() {
  const [activeTab, setActiveTab] = useState('nuit');
  const [inputVal, setInputVal] = useState('400000001');
  const [copied, setCopied] = useState(false);

  // Tabs de Validação do Playground
  const tabs = [
    { id: 'nuit', label: 'NUIT Fiscal', defaultVal: '400000001', placeholder: 'Ex: 400000001' },
    { id: 'nib', label: 'NIB & Bancos', defaultVal: '000100000000000000060', placeholder: 'Ex: 000100000000000000060' },
    { id: 'phone', label: 'Telemóvel & Wallets', defaultVal: '+258 84 123 4567', placeholder: 'Ex: 841234567 ou 881234567' },
    { id: 'bi', label: 'BI & Documentos', defaultVal: '110100123456A', placeholder: 'Ex: 110100123456A' },
    { id: 'mzn', label: 'Moeda MZN', defaultVal: '1500.50', placeholder: 'Ex: 1500.50' },
    { id: 'cep', label: 'Novo CEP', defaultVal: '0901-01', placeholder: 'Ex: 0901-01 ou Namutequeliua' },
  ];

  const handleTabChange = (tab) => {
    setActiveTab(tab.id);
    setInputVal(tab.defaultVal);
  };

  const copyResult = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Motor de Avaliação em Tempo Real
  const renderEvaluation = () => {
    switch (activeTab) {
      case 'nuit': {
        const valid = isValidNUIT(inputVal);
        const entityType = valid ? getNUITEntityType(inputVal) : null;
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {valid ? (
                <span className="badge-moz" style={{ fontSize: '0.9rem', padding: '6px 14px' }}>
                  <CheckCircle2 size={18} /> NUIT Válido (Módulo 11)
                </span>
              ) : (
                <span className="badge-red" style={{ fontSize: '0.9rem', padding: '6px 14px' }}>
                  <XCircle size={18} /> NUIT Inválido
                </span>
              )}
            </div>

            {valid && entityType && (
              <div style={{ 
                background: 'var(--bg-subtle)', 
                padding: '16px', 
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                marginTop: '8px'
              }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Classificação da Entidade (AT Moçambique):</div>
                <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--moz-green)' }}>{entityType}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Primeiro dígito '{inputVal.charAt(0)}' regulamentado oficialmente.
                </div>
              </div>
            )}
          </div>
        );
      }

      case 'nib': {
        const valid = isValidNIB(inputVal);
        const bank = valid ? getBankFromNIB(inputVal) : null;
        const iban = valid ? nibToIBAN(inputVal) : null;
        const formatted = valid ? formatNIB(inputVal) : null;

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {valid ? (
                <span className="badge-moz" style={{ fontSize: '0.9rem', padding: '6px 14px' }}>
                  <CheckCircle2 size={18} /> NIB Válido (ISO 7064 Módulo 97-10)
                </span>
              ) : (
                <span className="badge-red" style={{ fontSize: '0.9rem', padding: '6px 14px' }}>
                  <XCircle size={18} /> NIB Inválido (Checksum ou banco inexistente)
                </span>
              )}
            </div>

            {valid && (
              <div style={{ 
                background: 'var(--bg-subtle)', 
                padding: '16px', 
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
                marginTop: '8px'
              }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Instituição Bancária:</div>
                  <div style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                    {bank?.name || 'Banco Comercial Registrado'} ({bank?.shortName || bank?.code})
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Código de Compensação: <strong>{bank?.code}</strong>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>IBAN Internacional:</div>
                  <div style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--moz-green)', fontFamily: 'monospace' }}>
                    {iban}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    NIB Formatado: {formatted}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      }

      case 'phone': {
        const valid = isValidMozambicanPhone(inputVal);
        const operator = valid ? getMobileOperator(inputVal) : null;
        const wallet = valid ? getMobileWallet(inputVal) : null;
        const formattedIntl = valid ? formatMozambicanPhone(inputVal, { format: 'international' }) : null;
        const formattedE164 = valid ? formatMozambicanPhone(inputVal, { format: 'e164' }) : null;

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {valid ? (
                <span className="badge-moz" style={{ fontSize: '0.9rem', padding: '6px 14px' }}>
                  <CheckCircle2 size={18} /> Número Válido (+258)
                </span>
              ) : (
                <span className="badge-red" style={{ fontSize: '0.9rem', padding: '6px 14px' }}>
                  <XCircle size={18} /> Número Inválido (requer prefixo 82-88)
                </span>
              )}
            </div>

            {valid && (
              <div style={{ 
                background: 'var(--bg-subtle)', 
                padding: '16px', 
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '16px',
                marginTop: '8px'
              }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Operadora:</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                    {operator}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Carteira Financeira:</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--moz-green)' }}>
                    {wallet}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Formatos Padronizados:</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '600', fontFamily: 'monospace' }}>{formattedIntl}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{formattedE164}</div>
                </div>
              </div>
            )}
          </div>
        );
      }

      case 'bi': {
        const isBi = isValidBI(inputVal);
        const isPassport = isValidPassport(inputVal);
        const isDire = isValidDIRE(inputVal);
        const isLicense = isValidDrivingLicense(inputVal);

        const hasAny = isBi || isPassport || isDire || isLicense;

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              {isBi && <span className="badge-moz"><CheckCircle2 size={16} /> Bilhete de Identidade (BI)</span>}
              {isPassport && <span className="badge-moz"><CheckCircle2 size={16} /> Passaporte Moçambicano</span>}
              {isDire && <span className="badge-moz"><CheckCircle2 size={16} /> DIRE Estrangeiro</span>}
              {isLicense && <span className="badge-moz"><CheckCircle2 size={16} /> Carta de Condução</span>}
              {!hasAny && <span className="badge-red"><XCircle size={16} /> Formato Não Reconhecido</span>}
            </div>

            <div style={{ 
              background: 'var(--bg-subtle)', 
              padding: '16px', 
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.85rem',
              color: 'var(--text-secondary)'
            }}>
              <strong>Formatos aceites:</strong> BI (12 dígitos + 1 letra), Passaporte (2 letras + 7 dígitos), DIRE (8-9 caracteres) e Carta de Condução oficial.
            </div>
          </div>
        );
      }

      case 'mzn': {
        const num = parseFloat(inputVal) || 0;
        const formattedMT = formatMZN(num, 'MT');
        const formattedMZN = formatMZN(num, 'MZN');

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ 
              background: 'var(--bg-subtle)', 
              padding: '16px', 
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px'
            }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Padrão Nacional (MT):</div>
                <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--moz-green)' }}>
                  {formattedMT}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Padrão ISO 4217 (MZN):</div>
                <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                  {formattedMZN}
                </div>
              </div>
            </div>
          </div>
        );
      }

      case 'cep': {
        const isCep = isValidNewCEP(inputVal);
        const suggestions = suggestCEPs(inputVal);

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {isCep ? (
                <span className="badge-moz"><CheckCircle2 size={16} /> Código CEP Válido</span>
              ) : (
                <span className="badge-yellow"><AlertCircle size={16} /> Pesquisa por Localidade / Bairro</span>
              )}
            </div>

            {suggestions.length > 0 && (
              <div style={{ 
                background: 'var(--bg-subtle)', 
                padding: '14px', 
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                maxHeight: '160px',
                overflowY: 'auto'
              }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  Resultados encontrados ({suggestions.length}):
                </div>
                {suggestions.slice(0, 4).map((item, idx) => (
                  <div key={idx} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    padding: '6px 0',
                    borderBottom: idx < 3 ? '1px solid var(--border-subtle)' : 'none',
                    fontSize: '0.85rem'
                  }}>
                    <span><strong>{item.locality}</strong> — {item.district}, {item.province}</span>
                    <span style={{ fontFamily: 'monospace', fontWeight: '700', color: 'var(--moz-green)' }}>{item.cep}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="clean-panel" style={{ maxWidth: '880px', margin: '0 auto', boxShadow: 'var(--shadow-lg)' }}>
      
      {/* Header do Playground */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        borderBottom: '1px solid var(--border-subtle)',
        paddingBottom: '16px',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>Playground Interativo ao Vivo</h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: 0 }}>
            Experimente em tempo real as validações e parsers da biblioteca com dados moçambicanos.
          </p>
        </div>

        <span className="badge-moz">Execução 100% Client-Side</span>
      </div>

      {/* Navegação de Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: '6px', 
        overflowX: 'auto', 
        paddingBottom: '8px',
        marginBottom: '20px',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab)}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '0.88rem',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              backgroundColor: activeTab === tab.id ? 'var(--moz-green)' : 'transparent',
              color: activeTab === tab.id ? 'white' : 'var(--text-secondary)',
              transition: 'all 0.15s ease'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Input de Teste */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px' }}>
          Digite ou cole um valor para testar:
        </label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            className="clean-input"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={tabs.find(t => t.id === activeTab)?.placeholder}
            style={{ fontSize: '1.05rem', fontFamily: 'monospace' }}
          />

          <button
            onClick={() => copyResult(inputVal)}
            className="btn-secondary-clean"
            title="Copiar valor"
            style={{ padding: '0 16px' }}
          >
            {copied ? <Check size={18} color="var(--moz-green)" /> : <Copy size={18} />}
          </button>
        </div>
      </div>

      {/* Resultados e Informações de Negócio */}
      <div style={{ minHeight: '120px' }}>
        {renderEvaluation()}
      </div>

    </div>
  );
}
