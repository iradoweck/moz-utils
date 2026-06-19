import React, { useState } from 'react';
import { 
  getDistrictsByProvince,
  isValidPostalCode,
  getPostalCodeLocality,
  getPostalCodeProvince,
  isValidNewCEP,
  suggestCEPs
} from 'moz-utils';
import { Map, Mail, ArrowRightLeft } from 'lucide-react';

export default function GeoSimulator() {
  const [activeTab, setActiveTab] = useState('province');
  const [inputValue, setInputValue] = useState('');

  // Local state for districts and CEPs
  let resultJSX = null;

  if (inputValue) {
    if (activeTab === 'province') {
      let districts = [];
      let found = false;
      try {
        districts = getDistrictsByProvince(inputValue);
        found = true;
      } catch (e) {
        found = false;
      }
      
      if (found) {
        resultJSX = (
          <div style={{ color: 'var(--neon-green)', fontWeight: '500' }}>
            <p>Província Encontrada! Distritos ({districts.length}):</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
              {districts.map(d => (
                <span key={d} style={{ background: 'var(--success-bg)', padding: '4px 12px', borderRadius: '16px', fontSize: '0.9rem' }}>
                  {d}
                </span>
              ))}
            </div>
          </div>
        );
      } else {
        resultJSX = <div className="text-error">Província não encontrada. Usa um ID válido (ex: mpt, mpc, npl).</div>;
      }
    } else if (activeTab === 'legacy_postal') {
      const isValid = isValidPostalCode(inputValue);
      if (isValid) {
        const loc = getPostalCodeLocality(inputValue);
        const prov = getPostalCodeProvince(inputValue);
        resultJSX = <div style={{ color: 'var(--neon-green)', fontWeight: '500' }}>Código Válido: {loc} ({prov})</div>;
      } else {
        resultJSX = <div className="text-error">Código Postal Legado Inválido</div>;
      }
    } else if (activeTab === 'new_cep') {
      const isValid = isValidNewCEP(inputValue);
      resultJSX = isValid 
        ? <div style={{ color: 'var(--neon-green)', fontWeight: '500' }}>Formato de Novo CEP Válido!</div>
        : <div className="text-error">Formato Inválido (Esperado: XXXX-XX)</div>;
    } else if (activeTab === 'migration') {
      const suggestions = suggestCEPs(inputValue);
      if (suggestions.length > 0) {
        resultJSX = (
          <div>
            <p style={{ color: 'var(--neon-green)', fontWeight: '500', marginBottom: '12px' }}>
              {suggestions.length} CEP(s) correspondente(s):
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
              {suggestions.map((cep, i) => (
                <div key={i} style={{ background: 'var(--overlay-1)', padding: '8px', borderRadius: '4px', fontSize: '0.9rem' }}>
                  <strong>{cep.cep}</strong> - {cep.locality} ({cep.district}, {cep.province})
                </div>
              ))}
            </div>
          </div>
        );
      } else {
        resultJSX = <div className="text-error">Nenhum CEP correspondente encontrado para '{inputValue}'</div>;
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
    minWidth: '150px'
  });

  return (
    <section id="geo-simulator" style={{ padding: '60px 0', backgroundColor: 'var(--overlay-3)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>
            Dados <span className="text-neon">Geográficos e Postais</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>Explora a validação de províncias e a migração de códigos postais (CEPs).</p>
        </div>

        <div className={`glass-panel`} style={{ maxWidth: '700px', margin: '0 auto', borderColor: inputValue && resultJSX ? 'rgba(0,255,136,0.3)' : 'var(--panel-border)' }}>
          
          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
            <button onClick={() => handleTabChange('province')} className="btn-primary" style={getTabStyle('province')}>
              <Map size={16} /> Províncias
            </button>
            <button onClick={() => handleTabChange('legacy_postal')} className="btn-primary" style={getTabStyle('legacy_postal')}>
              <Mail size={16} /> Postal Legado
            </button>
            <button onClick={() => handleTabChange('new_cep')} className="btn-primary" style={getTabStyle('new_cep')}>
              <Mail size={16} /> Novo CEP
            </button>
            <button onClick={() => handleTabChange('migration')} className="btn-primary" style={getTabStyle('migration')}>
              <ArrowRightLeft size={16} /> Migração Legado → CEP
            </button>
          </div>

          <div>
            <label className="input-label">
              {activeTab === 'province' && 'Digita o ID da Província (ex: mpt, mpc, npl, sof, zam, cab)'}
              {activeTab === 'legacy_postal' && 'Digita o Código Postal antigo (ex: 1100, 3100)'}
              {activeTab === 'new_cep' && 'Digita o Novo CEP (ex: 0909-01)'}
              {activeTab === 'migration' && 'Digita o Código Postal legado ou parcial (ex: 1100) para ver as novas zonas'}
            </label>
            <input 
              type="text" 
              className="input-field" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="..."
            />
          </div>

          {inputValue && resultJSX && (
            <div style={{ 
              marginTop: '24px', 
              padding: '16px', 
              borderRadius: '8px',
              backgroundColor: 'var(--overlay-3)',
              borderLeft: `4px solid ${resultJSX.props?.className === 'text-error' ? 'var(--error-text)' : 'var(--neon-green)'}`
            }}>
              {resultJSX}
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
