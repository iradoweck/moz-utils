import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  isValidNUIT, getNUITEntityType, isValidBI,
  getDistrictsByProvince, isValidNewCEP, suggestCEPs,
  isValidPostalCode, getPostalCodeLocality, getPostalCodeProvince,
  isValidMozambicanPhone, getMobileOperator, getMobileWallet, formatMZN, parseMZN, buildWhatsAppUrl
} from 'moz-utils';
import { CreditCard, Fingerprint, Phone, MapPin, Map, Coins, MessageCircle, Terminal, CheckCircle2, XCircle, ArrowRightLeft } from 'lucide-react';

const getValidators = (t) => [
  { id: 'nuit', label: t('unified_simulator.labels.nuit'), icon: <CreditCard size={18} />, placeholder: t('simulator.placeholders.nuit') },
  { id: 'bi', label: t('unified_simulator.labels.bi'), icon: <Fingerprint size={18} />, placeholder: t('simulator.placeholders.bi') },
  { id: 'phone', label: t('unified_simulator.labels.phone'), icon: <Phone size={18} />, placeholder: t('simulator.placeholders.phone') },
  { id: 'new_cep', label: t('unified_simulator.labels.new_cep'), icon: <Map size={18} />, placeholder: 'Ex: 1100' },
  { id: 'legacy_postal', label: t('unified_simulator.labels.legacy_postal'), icon: <MapPin size={18} />, placeholder: 'Ex: 1100' },
  { id: 'migration', label: t('unified_simulator.labels.migration'), icon: <ArrowRightLeft size={18} />, placeholder: 'Ex: Maputo' },
  { id: 'province', label: t('unified_simulator.labels.province'), icon: <MapPin size={18} />, placeholder: 'Ex: Maputo' },
  { id: 'money', label: t('unified_simulator.labels.money'), icon: <Coins size={18} />, placeholder: t('simulator.placeholders.money') },
  { id: 'whatsapp', label: t('unified_simulator.labels.whatsapp'), icon: <MessageCircle size={18} />, placeholder: t('simulator.placeholders.whatsapp') }
];

export default function UnifiedSimulator() {
  const { t } = useTranslation();
  const validators = getValidators(t);
  const [activeValidator, setActiveValidator] = useState(validators[0]);
  const [inputValue, setInputValue] = useState('');

  // Computes the result based on active validator and input
  const getResult = () => {
    if (!inputValue) return null;

    try {
      switch (activeValidator.id) {
        case 'nuit': {
          const valid = isValidNUIT(inputValue);
          if (valid) return { success: true, text: `${t('unified_simulator.results.nuitValid')} ${getNUITEntityType(inputValue)}` };
          return { success: false, text: t('unified_simulator.results.nuitInvalid') };
        }
        case 'bi': {
          const valid = isValidBI(inputValue);
          return { success: valid, text: valid ? t('unified_simulator.results.biValid') : t('unified_simulator.results.biInvalid') };
        }
        case 'phone': {
          const valid = isValidMozambicanPhone(inputValue);
          if (valid) {
            const op = getMobileOperator(inputValue);
            const wallet = getMobileWallet(inputValue);
            return { success: true, text: `${t('unified_simulator.results.phoneValid')} ${op}. Carteira: ${wallet || 'Nenhuma'}` };
          }
          return { success: false, text: t('unified_simulator.results.phoneInvalid') };
        }
        case 'new_cep': {
          const valid = isValidNewCEP(inputValue);
          if (valid) {
            const suggestions = suggestCEPs(inputValue);
            if (suggestions.length > 0) {
              return { success: true, text: `${t('unified_simulator.results.newCepValid')} ${suggestions[0].locality} (${suggestions[0].province})` };
            }
            return { success: true, text: t('unified_simulator.results.newCepValidFormat') };
          }
          return { success: false, text: t('unified_simulator.results.newCepInvalid') };
        }
        case 'legacy_postal': {
          const valid = isValidPostalCode(inputValue);
          if (valid) {
            return { success: true, text: `${t('unified_simulator.results.legacyCepValid')} ${getPostalCodeLocality(inputValue)} (${getPostalCodeProvince(inputValue)})` };
          }
          return { success: false, text: t('unified_simulator.results.legacyCepInvalid') };
        }
        case 'migration': {
          const suggestions = suggestCEPs(inputValue);
          if (suggestions.length > 0) {
            return { success: true, text: `${t('unified_simulator.results.migrationFound')} ${suggestions.length} locais:\n${suggestions.slice(0, 5).map(s => `${s.cep} - ${s.locality}`).join('\n')}${suggestions.length > 5 ? '\n...' : ''}` };
          }
          return { success: false, text: t('unified_simulator.results.migrationNotFound') };
        }
        case 'province': {
          const districts = getDistrictsByProvince(inputValue);
          if (districts.length > 0) {
            return { success: true, text: `${t('unified_simulator.results.provinceFound')} ${districts.length} distritos:\n${districts.slice(0, 10).join(', ')}${districts.length > 10 ? '...' : ''}` };
          }
          return { success: false, text: t('unified_simulator.results.provinceNotFound') };
        }
        case 'money': {
          const parsed = parseMZN(inputValue);
          if (parsed !== null) {
            return { success: true, text: `${t('unified_simulator.results.moneyValid')} ${formatMZN(parsed)}` };
          }
          return { success: false, text: t('unified_simulator.results.moneyInvalid') };
        }
        case 'whatsapp': {
          if (isValidMozambicanPhone(inputValue)) {
            return { success: true, text: `${t('unified_simulator.results.whatsappValid')}\n${buildWhatsAppUrl(inputValue, "Olá!")}` };
          }
          return { success: false, text: t('unified_simulator.results.whatsappInvalid') };
        }
        default:
          return null;
      }
    } catch (e) {
      return { success: false, text: t('unified_simulator.error') };
    }
  };

  const result = getResult();

  return (
    <div className="glass-panel" style={{ padding: '32px', overflow: 'hidden' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px' }}>
        
        {/* Left Side: Inputs */}
        <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', color: 'var(--text-primary)' }}>{t('unified_simulator.choose')}</h3>
          
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
              {t('unified_simulator.insertValue')}
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
                <p style={{ color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{t('unified_simulator.waitingInput')}</p>
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
