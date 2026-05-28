import React, { useState } from 'react';
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
        resultText = `NUIT Válido. Entidade: ${type}`;
      } else {
        resultText = 'NUIT Inválido';
      }
    } else if (activeTab === 'bi') {
      isValid = isValidBI(inputValue);
      resultText = isValid ? 'BI Válido' : 'BI Inválido';
    } else if (activeTab === 'dire') {
      isValid = isValidDIRE(inputValue);
      resultText = isValid ? 'DIRE Válido' : 'DIRE Inválido';
    } else if (activeTab === 'passport') {
      isValid = isValidPassport(inputValue);
      resultText = isValid ? 'Passaporte Válido' : 'Passaporte Inválido';
    } else if (activeTab === 'license') {
      isValid = isValidDrivingLicense(inputValue);
      resultText = isValid ? 'Carta de Condução Válida' : 'Carta de Condução Inválida';
    } else if (activeTab === 'phone') {
      isValid = isValidMozambicanPhone(inputValue);
      if (isValid) {
        const operator = getMobileOperator(inputValue);
        const wallet = getMobileWallet(inputValue);
        resultText = `Telefone Válido. Operadora: ${operator} (${wallet})`;
      } else {
        resultText = 'Telefone Inválido';
      }
    } else if (activeTab === 'money') {
      const numValue = parseFloat(inputValue);
      if (!isNaN(numValue)) {
        isValid = true;
        resultText = `Formatado: ${formatMZN(numValue)}`;
      } else {
        isValid = false;
        resultText = 'Valor Inválido (digita um número)';
      }
    } else if (activeTab === 'whatsapp') {
      if (isValidMozambicanPhone(inputValue)) {
        isValid = true;
        const url = buildWhatsAppUrl(inputValue, "Olá da biblioteca moz-utils!");
        resultText = `URL Gerado: ${url}`;
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
          <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Simulador <span className="text-neon">Live</span></h2>
          <p style={{ color: 'var(--text-secondary)' }}>Testa o poder da biblioteca diretamente no teu browser.</p>
        </div>

        <div className={`glass-panel ${inputValue ? (isValid ? 'feedback-success' : 'feedback-error') : ''}`} style={{ maxWidth: '600px', margin: '0 auto' }}>
          
          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
            <button onClick={() => handleTabChange('nuit')} className="btn-primary" style={getTabStyle('nuit')}>NUIT</button>
            <button onClick={() => handleTabChange('bi')} className="btn-primary" style={getTabStyle('bi')}>BI Nacional</button>
            <button onClick={() => handleTabChange('dire')} className="btn-primary" style={getTabStyle('dire')}>DIRE</button>
            <button onClick={() => handleTabChange('passport')} className="btn-primary" style={getTabStyle('passport')}>Passaporte</button>
            <button onClick={() => handleTabChange('license')} className="btn-primary" style={getTabStyle('license')}>Carta de Condução</button>
            <button onClick={() => handleTabChange('phone')} className="btn-primary" style={getTabStyle('phone')}>Telefone</button>
            <button onClick={() => handleTabChange('whatsapp')} className="btn-primary" style={getTabStyle('whatsapp')}>Link WhatsApp</button>
            <button onClick={() => handleTabChange('money')} className="btn-primary" style={getTabStyle('money')}>Moeda (MZN)</button>
          </div>

          <div>
            <label className="input-label">
              {activeTab === 'nuit' && 'Digita um NUIT (ex: 400000008)'}
              {activeTab === 'bi' && 'Digita um BI (ex: 123456789123A)'}
              {activeTab === 'dire' && 'Digita um DIRE (ex: 00008312C)'}
              {activeTab === 'passport' && 'Digita um Passaporte (ex: AO1234567)'}
              {activeTab === 'license' && 'Digita uma Carta de Condução (ex: M123456)'}
              {activeTab === 'phone' && 'Digita um nº de telemóvel (ex: 841234567)'}
              {activeTab === 'whatsapp' && 'Digita um nº de telemóvel para gerar link WA'}
              {activeTab === 'money' && 'Digita um valor numérico (ex: 1500.50)'}
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
              backgroundColor: 'rgba(0,0,0,0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              borderLeft: `4px solid ${isValid ? 'var(--neon-green)' : '#ff3366'}`
            }}>
              {isValid ? <CheckCircle2 color="var(--neon-green)" /> : <XCircle color="#ff3366" />}
              <span style={{ color: isValid ? 'var(--neon-green)' : '#ff3366', fontWeight: '500' }}>
                {resultText}
              </span>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
