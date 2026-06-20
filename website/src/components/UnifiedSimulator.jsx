import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  isValidNUIT, getNUITEntityType, isValidBI,
  getDistrictsByProvince, isValidNewCEP, suggestCEPs,
  isValidPostalCode, getPostalCodeLocality, getPostalCodeProvince,
  isValidMozambicanPhone, getMobileOperator, getMobileWallet, formatMZN, parseMZN, buildWhatsAppUrl
} from 'moz-utils';
import { CreditCard, Fingerprint, Phone, MapPin, Map, Coins, MessageCircle, Terminal, CheckCircle2, XCircle, ArrowRightLeft } from 'lucide-react';

const validators = [
  { id: 'nuit', label: 'NUIT', icon: <CreditCard size={18} />, placeholder: 'Ex: 400000000' },
  { id: 'bi', label: 'B. Identidade', icon: <Fingerprint size={18} />, placeholder: 'Ex: 110100000000B' },
  { id: 'phone', label: 'Telefone', icon: <Phone size={18} />, placeholder: 'Ex: 841234567' },
  { id: 'new_cep', label: 'Novo CEP', icon: <Map size={18} />, placeholder: 'Ex: 1100' },
  { id: 'legacy_postal', label: 'CEP Antigo', icon: <MapPin size={18} />, placeholder: 'Ex: 1100' },
  { id: 'migration', label: 'Migração CEP', icon: <ArrowRightLeft size={18} />, placeholder: 'Ex: Maputo' },
  { id: 'province', label: 'Distritos', icon: <MapPin size={18} />, placeholder: 'Ex: Maputo' },
  { id: 'money', label: 'Dinheiro', icon: <Coins size={18} />, placeholder: 'Ex: 1500.50' },
  { id: 'whatsapp', label: 'WhatsApp Link', icon: <MessageCircle size={18} />, placeholder: 'Ex: 841234567' }
];

export default function UnifiedSimulator() {
  const { t } = useTranslation();
  const [activeValidator, setActiveValidator] = useState(validators[0]);
  const [inputValue, setInputValue] = useState('');

  // Computes the result based on active validator and input
  const getResult = () => {
    if (!inputValue) return null;

    try {
      switch (activeValidator.id) {
        case 'nuit': {
          const valid = isValidNUIT(inputValue);
          if (valid) return { success: true, text: `NUIT Válido. Entidade: ${getNUITEntityType(inputValue)}` };
          return { success: false, text: 'NUIT Inválido.' };
        }
        case 'bi': {
          const valid = isValidBI(inputValue);
          return { success: valid, text: valid ? 'BI Válido e estruturalmente correto.' : 'Formato de BI Inválido.' };
        }
        case 'phone': {
          const valid = isValidMozambicanPhone(inputValue);
          if (valid) {
            const op = getMobileOperator(inputValue);
            const wallet = getMobileWallet(inputValue);
            return { success: true, text: `Número Válido. Operadora: ${op}. Carteira: ${wallet || 'Nenhuma'}` };
          }
          return { success: false, text: 'Número de telefone inválido.' };
        }
        case 'new_cep': {
          const valid = isValidNewCEP(inputValue);
          if (valid) {
            const suggestions = suggestCEPs(inputValue);
            if (suggestions.length > 0) {
              return { success: true, text: `Novo CEP Válido: ${suggestions[0].locality} (${suggestions[0].province})` };
            }
            return { success: true, text: 'Novo CEP Válido (Formato correto).' };
          }
          return { success: false, text: 'Novo Código Postal Inválido.' };
        }
        case 'legacy_postal': {
          const valid = isValidPostalCode(inputValue);
          if (valid) {
            return { success: true, text: `CEP Antigo Válido: ${getPostalCodeLocality(inputValue)} (${getPostalCodeProvince(inputValue)})` };
          }
          return { success: false, text: 'CEP Antigo Inválido.' };
        }
        case 'migration': {
          const suggestions = suggestCEPs(inputValue);
          if (suggestions.length > 0) {
            return { success: true, text: `Encontrados ${suggestions.length} locais:\n${suggestions.slice(0, 5).map(s => `${s.cep} - ${s.locality}`).join('\n')}${suggestions.length > 5 ? '\n...' : ''}` };
          }
          return { success: false, text: 'Nenhum CEP encontrado para esta localidade.' };
        }
        case 'province': {
          const districts = getDistrictsByProvince(inputValue);
          if (districts.length > 0) {
            return { success: true, text: `Encontrados ${districts.length} distritos:\n${districts.slice(0, 10).join(', ')}${districts.length > 10 ? '...' : ''}` };
          }
          return { success: false, text: 'Província não encontrada.' };
        }
        case 'money': {
          const parsed = parseMZN(inputValue);
          if (parsed !== null) {
            return { success: true, text: `Formatado: ${formatMZN(parsed)}` };
          }
          return { success: false, text: 'Formato de valor inválido.' };
        }
        case 'whatsapp': {
          if (isValidMozambicanPhone(inputValue)) {
            return { success: true, text: `Link gerado:\n${buildWhatsAppUrl(inputValue, "Olá!")}` };
          }
          return { success: false, text: 'Insira um telefone válido primeiro.' };
        }
        default:
          return null;
      }
    } catch (e) {
      return { success: false, text: 'Erro ao processar o valor inserido.' };
    }
  };

  const result = getResult();

  return (
    <div className="glass-panel" style={{ padding: '32px', overflow: 'hidden' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px' }}>
        
        {/* Left Side: Inputs */}
        <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', color: 'var(--text-primary)' }}>Escolha o que validar:</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px', marginBottom: '24px' }}>
            {validators.map(v => (
              <button
                key={v.id}
                onClick={() => { setActiveValidator(v); setInputValue(''); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: activeValidator.id === v.id ? '2px solid var(--neon-green)' : '1px solid var(--panel-border)',
                  background: activeValidator.id === v.id ? 'var(--overlay-2)' : 'var(--panel-bg)',
                  color: activeValidator.id === v.id ? 'var(--neon-green)' : 'var(--text-secondary)',
                  fontWeight: activeValidator.id === v.id ? '600' : '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontSize: '0.9rem'
                }}
              >
                {v.icon}
                {v.label}
              </button>
            ))}
          </div>

          <div style={{ marginTop: 'auto' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontWeight: 'bold' }}>
              Insira o valor para testar
            </label>
            <input 
              type="text" 
              className="input-field" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={t(`simulator.placeholders.${activeValidator.id}`)}
              style={{ width: '100%', padding: '16px', fontSize: '1.2rem', borderRadius: '12px' }}
            />
          </div>
        </div>

        {/* Right Side: Console */}
        <div style={{ 
          flex: '1 1 350px', 
          background: 'var(--dark-bg)', 
          borderRadius: '16px', 
          border: '1px solid var(--panel-border)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Console Header */}
          <div style={{ background: 'var(--overlay-1)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid var(--panel-border)' }}>
            <Terminal size={18} color="var(--text-secondary)" />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>moz-utils/runtime</span>
          </div>

          {/* Console Body */}
          <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {!inputValue ? (
              <div style={{ textAlign: 'center', opacity: 0.5 }}>
                <Terminal size={48} color="var(--text-secondary)" style={{ margin: '0 auto 16px auto' }} />
                <p style={{ color: 'var(--text-secondary)', fontFamily: 'monospace' }}>Aguardando input...</p>
              </div>
            ) : (
              <div className="animate-fade-up" style={{ 
                background: result?.success ? 'rgba(0, 255, 136, 0.05)' : 'rgba(255, 51, 102, 0.05)',
                border: `1px solid ${result?.success ? 'var(--neon-green)' : 'var(--error-text)'}`,
                padding: '24px',
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '16px'
              }}>
                {result?.success ? <CheckCircle2 size={48} color="var(--neon-green)" /> : <XCircle size={48} color="var(--error-text)" />}
                <pre style={{ 
                  margin: 0, 
                  color: result?.success ? 'var(--neon-green)' : 'var(--error-text)',
                  fontFamily: 'monospace',
                  fontSize: '1.1rem',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}>
                  {result?.text}
                </pre>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
