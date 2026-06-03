import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  isValidNUIT, getNUITEntityType, isValidBI, isValidDIRE, isValidPassport, isValidDrivingLicense,
  getDistrictsByProvince, isValidPostalCode, getPostalCodeLocality, getPostalCodeProvince, isValidNewCEP, suggestCEPs,
  isValidMozambicanPhone, getMobileOperator, getMobileWallet, formatMZN, parseMZN, buildWhatsAppUrl
} from 'moz-utils';
import { CheckCircle2, XCircle, Users, Map, Settings } from 'lucide-react';

export default function UnifiedSimulator() {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('entities');
  
  const [activeTabEntities, setActiveTabEntities] = useState('nuit');
  const [activeTabLogistics, setActiveTabLogistics] = useState('province');
  const [activeTabOthers, setActiveTabOthers] = useState('phone');
  
  const [inputValue, setInputValue] = useState('');

  const categories = [
    { id: 'entities', label: t('simulator.catEntities'), icon: <Users size={18} /> },
    { id: 'logistics', label: t('simulator.catLogistics'), icon: <Map size={18} /> },
    { id: 'others', label: t('simulator.catOthers'), icon: <Settings size={18} /> }
  ];

  const handleCategoryChange = (catId) => {
    setActiveCategory(catId);
    setInputValue('');
  };

  // ----- LOGIC FOR ENTITIES -----
  let entitiesValid = false;
  let entitiesResult = '';
  if (activeCategory === 'entities' && inputValue) {
    if (activeTabEntities === 'nuit') {
      entitiesValid = isValidNUIT(inputValue);
      entitiesResult = entitiesValid ? `${t('simulator.results.nuitValid')} ${getNUITEntityType(inputValue)}` : t('simulator.results.nuitInvalid');
    } else if (activeTabEntities === 'bi') {
      entitiesValid = isValidBI(inputValue);
      entitiesResult = entitiesValid ? t('simulator.results.biValid') : t('simulator.results.biInvalid');
    } else if (activeTabEntities === 'dire') {
      entitiesValid = isValidDIRE(inputValue);
      entitiesResult = entitiesValid ? t('simulator.results.direValid') : t('simulator.results.direInvalid');
    } else if (activeTabEntities === 'passport') {
      entitiesValid = isValidPassport(inputValue);
      entitiesResult = entitiesValid ? t('simulator.results.passportValid') : t('simulator.results.passportInvalid');
    } else if (activeTabEntities === 'license') {
      entitiesValid = isValidDrivingLicense(inputValue);
      entitiesResult = entitiesValid ? t('simulator.results.licenseValid') : t('simulator.results.licenseInvalid');
    }
  }

  // ----- LOGIC FOR LOGISTICS -----
  let logisticsJSX = null;
  let logisticsError = false;
  if (activeCategory === 'logistics' && inputValue) {
    if (activeTabLogistics === 'province') {
      let districts = [];
      let found = false;
      try {
        districts = getDistrictsByProvince(inputValue);
        found = true;
      } catch (e) {
        found = false;
      }

      if (found) {
        logisticsJSX = (
          <div style={{ color: 'var(--neon-green)', fontWeight: '500' }}>
            <p style={{ margin: '0 0 8px 0', fontSize: '0.9rem' }}>{t('simulator.results.districts')} ({districts.length}):</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {districts.slice(0, 15).map(d => (
                <span key={d} style={{ background: 'rgba(0,255,136,0.1)', padding: '2px 8px', borderRadius: '8px', fontSize: '0.75rem' }}>{d}</span>
              ))}
              {districts.length > 15 && <span style={{ fontSize: '0.75rem' }}>...</span>}
            </div>
          </div>
        );
      } else {
        logisticsError = true;
        logisticsJSX = <div className="text-error" style={{ fontSize: '0.9rem' }}>{t('simulator.results.provNotFound')}</div>;
      }
    } else if (activeTabLogistics === 'legacy_postal') {
      const isValid = isValidPostalCode(inputValue);
      if (isValid) {
        logisticsJSX = <div style={{ color: 'var(--neon-green)', fontWeight: '500', fontSize: '0.9rem' }}>{t('simulator.results.legacyValid')} {getPostalCodeLocality(inputValue)} ({getPostalCodeProvince(inputValue)})</div>;
      } else {
        logisticsError = true;
        logisticsJSX = <div className="text-error" style={{ fontSize: '0.9rem' }}>{t('simulator.results.legacyInvalid')}</div>;
      }
    } else if (activeTabLogistics === 'new_cep') {
      const isValid = isValidNewCEP(inputValue);
      if (isValid) {
        const suggestions = suggestCEPs(inputValue);
        if (suggestions.length > 0) {
          logisticsJSX = <div style={{ color: 'var(--neon-green)', fontWeight: '500', fontSize: '0.9rem' }}>{t('simulator.results.cepValid')} - {suggestions[0].locality} ({suggestions[0].province})</div>;
        } else {
          logisticsJSX = <div style={{ color: 'var(--neon-green)', fontWeight: '500', fontSize: '0.9rem' }}>{t('simulator.results.cepValid')}</div>;
        }
      } else {
        logisticsError = true;
        logisticsJSX = <div className="text-error" style={{ fontSize: '0.9rem' }}>{t('simulator.results.cepInvalid')}</div>;
      }
    } else if (activeTabLogistics === 'migration') {
      const suggestions = suggestCEPs(inputValue);
      if (suggestions.length > 0) {
        logisticsJSX = (
          <div>
            <p style={{ color: 'var(--neon-green)', fontWeight: '500', margin: '0 0 8px 0', fontSize: '0.9rem' }}>{suggestions.length} {t('simulator.results.cepMatches')}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '150px', overflowY: 'auto' }}>
              {suggestions.slice(0, 5).map((cep, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '4px', fontSize: '0.8rem' }}>
                  <strong>{cep.cep}</strong> - {cep.locality}
                </div>
              ))}
            </div>
          </div>
        );
      } else {
        logisticsError = true;
        logisticsJSX = <div className="text-error" style={{ fontSize: '0.9rem' }}>{t('simulator.results.cepNotFound')}</div>;
      }
    }
  }

  // ----- LOGIC FOR OTHERS -----
  let othersValid = false;
  let othersResult = '';
  if (activeCategory === 'others' && inputValue) {
    if (activeTabOthers === 'phone') {
      othersValid = isValidMozambicanPhone(inputValue);
      if (othersValid) {
        othersResult = `${getMobileOperator(inputValue)} (${getMobileWallet(inputValue)})`;
      } else {
        othersResult = t('simulator.results.phoneInvalid');
      }
    } else if (activeTabOthers === 'money') {
      const numValue = parseMZN(inputValue);
      if (numValue !== null) {
        othersValid = true;
        othersResult = `${formatMZN(numValue)}`;
      } else {
        othersValid = false;
        othersResult = t('simulator.results.moneyInvalid');
      }
    } else if (activeTabOthers === 'whatsapp') {
      if (isValidMozambicanPhone(inputValue)) {
        othersValid = true;
        othersResult = `${t('simulator.results.url')} ${buildWhatsAppUrl(inputValue, "Olá!")}`;
      } else {
        othersValid = false;
        othersResult = t('simulator.results.phoneInvalid');
      }
    }
  }

  const getTabStyle = (currentTab, tabName) => ({
    flex: '1 1 auto',
    backgroundColor: currentTab === tabName ? 'var(--neon-green)' : 'transparent',
    color: currentTab === tabName ? 'black' : 'var(--neon-green)',
    minWidth: '80px',
    padding: '8px 12px',
    fontSize: '0.85rem'
  });

  return (
    <div className="glass-panel" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        
        {/* Sidebar */}
        <div style={{ 
          flex: '1 1 200px', 
          backgroundColor: 'rgba(0,0,0,0.4)', 
          borderRight: '1px solid var(--panel-border)',
          display: 'flex',
          flexDirection: 'column',
          padding: '24px 0'
        }}>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              style={{
                background: 'transparent',
                border: 'none',
                borderRight: activeCategory === cat.id ? '3px solid var(--neon-green)' : '3px solid transparent',
                backgroundColor: activeCategory === cat.id ? 'rgba(0,255,136,0.05)' : 'transparent',
                color: activeCategory === cat.id ? 'var(--neon-green)' : 'var(--text-secondary)',
                padding: '16px 24px',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '1rem',
                transition: 'all 0.2s ease'
              }}
            >
              {cat.icon}
              {cat.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div style={{ 
          flex: '3 1 400px', 
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '300px'
        }}>
          
          {/* ENTITIES RENDER */}
          {activeCategory === 'entities' && (
            <div className="animate-fade-up">
              <h3 style={{ fontSize: '1.5rem', marginBottom: '24px' }}>{t('simulator.titleEntities')}</h3>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
                <button onClick={() => { setActiveTabEntities('nuit'); setInputValue(''); }} className="btn-primary" style={getTabStyle(activeTabEntities, 'nuit')}>{t('simulator.tabs.nuit')}</button>
                <button onClick={() => { setActiveTabEntities('bi'); setInputValue(''); }} className="btn-primary" style={getTabStyle(activeTabEntities, 'bi')}>{t('simulator.tabs.bi')}</button>
                <button onClick={() => { setActiveTabEntities('dire'); setInputValue(''); }} className="btn-primary" style={getTabStyle(activeTabEntities, 'dire')}>{t('simulator.tabs.dire')}</button>
                <button onClick={() => { setActiveTabEntities('passport'); setInputValue(''); }} className="btn-primary" style={getTabStyle(activeTabEntities, 'passport')}>{t('simulator.tabs.passport')}</button>
                <button onClick={() => { setActiveTabEntities('license'); setInputValue(''); }} className="btn-primary" style={getTabStyle(activeTabEntities, 'license')}>{t('simulator.tabs.license')}</button>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label className="input-label">
                  {activeTabEntities === 'nuit' && t('simulator.placeholders.nuit')}
                  {activeTabEntities === 'bi' && t('simulator.placeholders.bi')}
                  {activeTabEntities === 'dire' && t('simulator.placeholders.dire')}
                  {activeTabEntities === 'passport' && t('simulator.placeholders.passport')}
                  {activeTabEntities === 'license' && t('simulator.placeholders.license')}
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
                  padding: '16px', borderRadius: '8px', backgroundColor: 'rgba(0,0,0,0.3)',
                  display: 'flex', alignItems: 'center', gap: '12px',
                  borderLeft: `4px solid ${entitiesValid ? 'var(--neon-green)' : '#ff3366'}`
                }}>
                  {entitiesValid ? <CheckCircle2 color="var(--neon-green)" /> : <XCircle color="#ff3366" />}
                  <span style={{ color: entitiesValid ? 'var(--neon-green)' : '#ff3366', fontWeight: '500' }}>
                    {entitiesResult}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* LOGISTICS RENDER */}
          {activeCategory === 'logistics' && (
            <div className="animate-fade-up">
              <h3 style={{ fontSize: '1.5rem', marginBottom: '24px' }}>{t('simulator.titleLogistics')}</h3>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
                <button onClick={() => { setActiveTabLogistics('province'); setInputValue(''); }} className="btn-primary" style={getTabStyle(activeTabLogistics, 'province')}>{t('simulator.tabs.province')}</button>
                <button onClick={() => { setActiveTabLogistics('new_cep'); setInputValue(''); }} className="btn-primary" style={getTabStyle(activeTabLogistics, 'new_cep')}>{t('simulator.tabs.new_cep')}</button>
                <button onClick={() => { setActiveTabLogistics('legacy_postal'); setInputValue(''); }} className="btn-primary" style={getTabStyle(activeTabLogistics, 'legacy_postal')}>{t('simulator.tabs.legacy_postal')}</button>
                <button onClick={() => { setActiveTabLogistics('migration'); setInputValue(''); }} className="btn-primary" style={getTabStyle(activeTabLogistics, 'migration')}>{t('simulator.tabs.migration')}</button>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label className="input-label">
                  {activeTabLogistics === 'province' && t('simulator.placeholders.province')}
                  {activeTabLogistics === 'legacy_postal' && t('simulator.placeholders.legacy_postal')}
                  {activeTabLogistics === 'new_cep' && t('simulator.placeholders.new_cep')}
                  {activeTabLogistics === 'migration' && t('simulator.placeholders.migration')}
                </label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="..."
                />
              </div>

              {inputValue && logisticsJSX && (
                <div style={{ 
                  padding: '16px', borderRadius: '8px', backgroundColor: 'rgba(0,0,0,0.3)',
                  borderLeft: `4px solid ${logisticsError ? '#ff3366' : 'var(--neon-green)'}`
                }}>
                  {logisticsJSX}
                </div>
              )}
            </div>
          )}

          {/* OTHERS RENDER */}
          {activeCategory === 'others' && (
            <div className="animate-fade-up">
              <h3 style={{ fontSize: '1.5rem', marginBottom: '24px' }}>{t('simulator.titleOthers')}</h3>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
                <button onClick={() => { setActiveTabOthers('phone'); setInputValue(''); }} className="btn-primary" style={getTabStyle(activeTabOthers, 'phone')}>{t('simulator.tabs.phone')}</button>
                <button onClick={() => { setActiveTabOthers('whatsapp'); setInputValue(''); }} className="btn-primary" style={getTabStyle(activeTabOthers, 'whatsapp')}>{t('simulator.tabs.whatsapp')}</button>
                <button onClick={() => { setActiveTabOthers('money'); setInputValue(''); }} className="btn-primary" style={getTabStyle(activeTabOthers, 'money')}>{t('simulator.tabs.money')}</button>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label className="input-label">
                  {activeTabOthers === 'phone' && t('simulator.placeholders.phone')}
                  {activeTabOthers === 'whatsapp' && t('simulator.placeholders.whatsapp')}
                  {activeTabOthers === 'money' && t('simulator.placeholders.money')}
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
                  padding: '16px', borderRadius: '8px', backgroundColor: 'rgba(0,0,0,0.3)',
                  display: 'flex', alignItems: 'center', gap: '12px',
                  borderLeft: `4px solid ${othersValid ? 'var(--neon-green)' : '#ff3366'}`
                }}>
                  {othersValid ? <CheckCircle2 color="var(--neon-green)" /> : <XCircle color="#ff3366" />}
                  <span style={{ color: othersValid ? 'var(--neon-green)' : '#ff3366', fontWeight: '500', wordBreak: 'break-all' }}>
                    {othersResult}
                  </span>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
