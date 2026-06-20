import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  isValidNUIT, getNUITEntityType, 
  isValidBI, 
  isValidMozambicanPhone, getMobileOperator, getMobileWallet,
  isValidDIRE,
  isValidPassport,
  isValidDrivingLicense,
  formatMZN,
  buildWhatsAppUrl
} from 'moz-utils';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function Simulator() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('nuit');
  const [inputValue, setInputValue] = useState('');

  // Validation logic
  let isValid = false;
  let resultText = '';

  if (inputValue) {
    if (activeTab === 'nuit') {
      isValid = isValidNUIT(inputValue);
      if (isValid) {
        const type = getNUITEntityType(inputValue);
        resultText = `${t('simulator.results.nuitValid')} ${type}`;
      } else {
        resultText = t('simulator.results.nuitInvalid');
      }
    } else if (activeTab === 'bi') {
      isValid = isValidBI(inputValue);
      resultText = isValid ? t('simulator.results.biValid') : t('simulator.results.biInvalid');
    } else if (activeTab === 'dire') {
      isValid = isValidDIRE(inputValue);
      resultText = isValid ? t('simulator.results.direValid') : t('simulator.results.direInvalid');
    } else if (activeTab === 'passport') {
      isValid = isValidPassport(inputValue);
      resultText = isValid ? t('simulator.results.passportValid') : t('simulator.results.passportInvalid');
    } else if (activeTab === 'license') {
      isValid = isValidDrivingLicense(inputValue);
      resultText = isValid ? t('simulator.results.licenseValid') : t('simulator.results.licenseInvalid');
    } else if (activeTab === 'phone') {
      isValid = isValidMozambicanPhone(inputValue);
      if (isValid) {
        const operator = getMobileOperator(inputValue);
        const wallet = getMobileWallet(inputValue);
        resultText = `${t('simulator.results.phoneValid', 'Telefone Válido.')} Operadora: ${operator} (${wallet})`;
      } else {
        resultText = t('simulator.results.phoneInvalid');
      }
    } else if (activeTab === 'money') {
      const numValue = parseFloat(inputValue);
      if (!isNaN(numValue)) {
        isValid = true;
        resultText = `Formatado: ${formatMZN(numValue)}`;
      } else {
        isValid = false;
        resultText = t('simulator.results.moneyInvalid');
      }
    } else if (activeTab === 'whatsapp') {
      if (isValidMozambicanPhone(inputValue)) {
        isValid = true;
        const url = buildWhatsAppUrl(inputValue, "Olá da biblioteca moz-utils!");
        resultText = `URL: ${url}`;
      } else {
        isValid = false;
        resultText = 'Insere um telefone válido para gerar o URL';
      }
    }
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setInputValue('');
  };

  const getTabStyle = (tab) => ({
    flex: '1 1 auto',
    backgroundColor: activeTab === tab ? 'var(--neon-green)' : 'transparent',
    color: activeTab === tab ? 'black' : 'var(--neon-green)',
    minWidth: '120px'
  });

  return (
    <section id="simulator" style={{ padding: '60px 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>{t('home.simulatorTitleLive')} <span className="text-neon">{t('home.simulatorTitle')}</span></h2>
          <p style={{ color: 'var(--text-secondary)' }}>{t('home.simulatorDesc')}</p>
        </div>

        <div className={`glass-panel ${inputValue ? (isValid ? 'feedback-success' : 'feedback-error') : ''}`} style={{ maxWidth: '600px', margin: '0 auto' }}>
          
          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
            <button onClick={() => handleTabChange('nuit')} className="btn-primary" style={getTabStyle('nuit')}>{t('simulator.tabs.nuit')}</button>
            <button onClick={() => handleTabChange('bi')} className="btn-primary" style={getTabStyle('bi')}>{t('simulator.tabs.bi')}</button>
            <button onClick={() => handleTabChange('dire')} className="btn-primary" style={getTabStyle('dire')}>{t('simulator.tabs.dire')}</button>
            <button onClick={() => handleTabChange('passport')} className="btn-primary" style={getTabStyle('passport')}>{t('simulator.tabs.passport')}</button>
            <button onClick={() => handleTabChange('license')} className="btn-primary" style={getTabStyle('license')}>{t('simulator.tabs.license')}</button>
            <button onClick={() => handleTabChange('phone')} className="btn-primary" style={getTabStyle('phone')}>{t('simulator.tabs.phone')}</button>
            <button onClick={() => handleTabChange('whatsapp')} className="btn-primary" style={getTabStyle('whatsapp')}>{t('simulator.tabs.whatsapp')}</button>
            <button onClick={() => handleTabChange('money')} className="btn-primary" style={getTabStyle('money')}>{t('simulator.tabs.money')}</button>
          </div>

          <div>
            <label className="input-label">
              {t(`simulator.placeholders.${activeTab}`)}
            </label>
            <input 
              type="text" 
              className="input-field" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="..."
            />
          </div>

          {inputValue && (
            <div style={{ 
              marginTop: '24px', 
              padding: '16px', 
              borderRadius: '8px',
              backgroundColor: 'var(--overlay-3)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              borderLeft: `4px solid ${isValid ? 'var(--neon-green)' : 'var(--error-text)'}`
            }}>
              {isValid ? <CheckCircle2 color="var(--neon-green)" /> : <XCircle color="#ff3366" />}
              <span style={{ color: isValid ? 'var(--neon-green)' : 'var(--error-text)', fontWeight: '500' }}>
                {resultText}
              </span>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
