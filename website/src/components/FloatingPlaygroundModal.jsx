import React, { useState } from 'react';
import { 
  CheckCircle2, XCircle, Copy, Check, Sparkles, X 
} from 'lucide-react';
import {
  isValidNUIT, getNUITEntityType,
  isValidMozambicanPhone, getMobileOperator, getMobileWallet, formatMozambicanPhone,
  isValidNIB, getBankFromNIB, nibToIBAN,
  isValidBI, isValidPassport, isValidDIRE, isValidDrivingLicense,
  formatMZN,
  isValidNewCEP, suggestCEPs
} from 'moz-utils';

export default function FloatingPlaygroundModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('nuit');
  const [inputVal, setInputVal] = useState('400000001');
  const [copied, setCopied] = useState(false);

  const tabs = [
    { id: 'nuit', label: 'NUIT Fiscal', defaultVal: '400000001', placeholder: 'Ex: 400000001' },
    { id: 'nib', label: 'NIB & Bancos', defaultVal: '000100000000000000060', placeholder: 'Ex: 000100000000000000060' },
    { id: 'phone', label: 'Telemóvel & Wallets', defaultVal: '+258 88 123 4567', placeholder: 'Ex: 841234567 ou 881234567' },
    { id: 'bi', label: 'BI & Documentos', defaultVal: '110100123456A', placeholder: 'Ex: 110100123456A' },
    { id: 'mzn', label: 'Moeda MZN', defaultVal: '1500.50', placeholder: 'Ex: 1500.50' },
    { id: 'cep', label: 'Novo CEP', defaultVal: '0901-01', placeholder: 'Ex: 0901-01 ou Namutequeliua' },
  ];

  if (!isOpen) return null;

  const handleTabChange = (t) => {
    setActiveTab(t.id);
    setInputVal(t.defaultVal);
  };

  const copyVal = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderResult = () => {
    switch (activeTab) {
      case 'nuit': {
        const valid = isValidNUIT(inputVal);
        const entity = valid ? getNUITEntityType(inputVal) : null;
        return (
          <div style={{ padding: '16px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              {valid ? <span className="badge-moz"><CheckCircle2 size={15} /> NUIT Válido (Mod 11)</span> : <span className="badge-red"><XCircle size={15} /> NUIT Inválido</span>}
              {entity && <span className="badge-yellow">{entity}</span>}
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {valid ? 'Dígito de controlo verificado com sucesso pelo algoritmo Módulo 11 da Autoridade Tributária.' : 'O dígito verificador ou o tamanho não obedecem à especificação tributária.'}
            </p>
          </div>
        );
      }
      case 'nib': {
        const valid = isValidNIB(inputVal);
        const bank = valid ? getBankFromNIB(inputVal) : null;
        const iban = valid ? nibToIBAN(inputVal) : null;
        return (
          <div style={{ padding: '16px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              {valid ? <span className="badge-moz"><CheckCircle2 size={15} /> NIB Válido (ISO 7064 Mod 97-10)</span> : <span className="badge-red"><XCircle size={15} /> NIB Inválido</span>}
              {bank && <span className="badge-yellow">{bank.name} ({bank.code})</span>}
            </div>
            {iban && (
              <div style={{ marginTop: '8px', fontSize: '0.88rem', fontFamily: 'monospace', color: 'var(--moz-green)' }}>
                IBAN Moçambicano: {iban}
              </div>
            )}
          </div>
        );
      }
      case 'phone': {
        const valid = isValidMozambicanPhone(inputVal);
        const operator = valid ? getMobileOperator(inputVal) : null;
        const wallet = valid ? getMobileWallet(inputVal) : null;
        return (
          <div style={{ padding: '16px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              {valid ? <span className="badge-moz"><CheckCircle2 size={15} /> Telemóvel Válido</span> : <span className="badge-red"><XCircle size={15} /> Número Inválido</span>}
              {operator && <span className="badge-yellow">Operadora: {operator}</span>}
              {wallet && <span className="badge-moz">Carteira: {wallet}</span>}
            </div>
            {valid && (
              <div style={{ marginTop: '8px', fontSize: '0.88rem', fontFamily: 'monospace', color: 'var(--text-primary)' }}>
                E.164: {formatMozambicanPhone(inputVal)}
              </div>
            )}
          </div>
        );
      }
      case 'bi': {
        const isBI = isValidBI(inputVal);
        const isPass = isValidPassport(inputVal);
        const isDIRE = isValidDIRE(inputVal);
        const isLic = isValidDrivingLicense(inputVal);
        const any = isBI || isPass || isDIRE || isLic;
        return (
          <div style={{ padding: '16px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {isBI && <span className="badge-moz"><CheckCircle2 size={15} /> Bilhete de Identidade (BI)</span>}
              {isPass && <span className="badge-moz"><CheckCircle2 size={15} /> Passaporte Moçambicano</span>}
              {isDIRE && <span className="badge-moz"><CheckCircle2 size={15} /> DIRE Válido</span>}
              {isLic && <span className="badge-moz"><CheckCircle2 size={15} /> Carta de Condução</span>}
              {!any && <span className="badge-red"><XCircle size={15} /> Documento Inválido</span>}
            </div>
          </div>
        );
      }
      case 'mzn': {
        const num = parseFloat(inputVal) || 0;
        return (
          <div style={{ padding: '16px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '1.2rem', fontFamily: 'monospace', fontWeight: '800', color: 'var(--moz-green)' }}>
              {formatMZN(num)}
            </div>
          </div>
        );
      }
      case 'cep': {
        const validCep = isValidNewCEP(inputVal);
        const suggestions = suggestCEPs(inputVal);
        return (
          <div style={{ padding: '16px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ marginBottom: '8px' }}>
              {validCep ? <span className="badge-moz"><CheckCircle2 size={15} /> CEP Válido</span> : <span className="badge-yellow">Busca por Bairro / Cidade</span>}
            </div>
            {suggestions.slice(0, 3).map((s, idx) => (
              <div key={idx} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', padding: '4px 0' }}>
                {s.locality} ({s.district}, {s.province}) — <strong style={{ color: 'var(--moz-green)' }}>{s.cep}</strong>
              </div>
            ))}
          </div>
        );
      }
      default:
        return null;
    }
  };

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
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }} onClick={onClose}>
      <div 
        style={{
          width: '100%',
          maxWidth: '680px',
          backgroundColor: '#0c0e17',
          border: '1px solid var(--border-strong)',
          borderRadius: '16px',
          boxShadow: 'var(--shadow-glow-terminal)',
          padding: '24px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={20} color="var(--moz-green)" />
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', margin: 0 }}>Playground Rápido Flutuante</h3>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', marginBottom: '16px', paddingBottom: '4px' }}>
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => handleTabChange(t)}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                fontSize: '0.82rem',
                fontWeight: '600',
                cursor: 'pointer',
                backgroundColor: activeTab === t.id ? 'var(--moz-green)' : 'rgba(255, 255, 255, 0.06)',
                color: activeTab === t.id ? '#050505' : 'var(--text-secondary)'
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Input */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <input
            type="text"
            className="clean-input"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            style={{ fontSize: '1rem', fontFamily: 'monospace' }}
          />
          <button onClick={() => copyVal(inputVal)} className="btn-secondary-clean" style={{ padding: '0 14px' }}>
            {copied ? <Check size={16} color="var(--moz-green)" /> : <Copy size={16} />}
          </button>
        </div>

        {/* Results */}
        {renderResult()}

      </div>
    </div>
  );
}
