import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  isValidNUIT, getNUITEntityType,
  isValidBI,
  isValidMozambicanPhone, getMobileOperator, getMobileWallet, formatMozambicanPhone, buildWhatsAppUrl,
  isValidNIB, getBankFromNIB, nibToIBAN,
  formatMZN,
  mozambiqueProvinces, getDistrictsByProvince, suggestCEPs,
  isValidPostalCode, getPostalCodeLocality, getPostalCodeProvince
} from 'moz-utils';
import { CheckCircle2, XCircle, Sparkles, ShieldCheck, Building2, Smartphone, MapPin, Coins, ExternalLink, Copy, Check } from 'lucide-react';

export default function DogfoodingShowcase() {
  const { i18n } = useTranslation();
  const isPt = i18n.language?.startsWith('pt');

  const provincesList = useMemo(() => {
    if (Array.isArray(mozambiqueProvinces)) {
      return mozambiqueProvinces.map((p) => (typeof p === 'string' ? p : p.name)).filter(Boolean);
    }
    return Object.keys(mozambiqueProvinces || {});
  }, []);

  const [nuit, setNuit] = useState('400000001');
  const [bi, setBi] = useState('110100123456A');
  const [phone, setPhone] = useState('881234567');
  const [nib, setNib] = useState('000100000000000000060');
  const [province, setProvince] = useState(provincesList[0] || 'Maputo Cidade');
  const [district, setDistrict] = useState('');
  const [postalCode, setPostalCode] = useState('3100');
  const [amount, setAmount] = useState('2500');
  const [copiedJson, setCopiedJson] = useState(false);

  const legacyPostalValid = isValidPostalCode(postalCode);
  const legacyLocality = legacyPostalValid ? getPostalCodeLocality(postalCode) : null;
  const legacyProvince = legacyPostalValid ? getPostalCodeProvince(postalCode) : null;

  const districts = useMemo(() => {
    const list = getDistrictsByProvince(province);
    return Array.isArray(list) ? list : [];
  }, [province]);

  const activeDistrict = districts.includes(district) ? district : (districts[0] || '');

  const cepSuggestions = useMemo(() => {
    const res = suggestCEPs(activeDistrict || province);
    return Array.isArray(res) ? res.slice(0, 2) : [];
  }, [activeDistrict, province]);

  const nuitValid = isValidNUIT(nuit);
  const nuitType = nuitValid ? getNUITEntityType(nuit) : null;
  const biValid = isValidBI(bi);
  const phoneValid = isValidMozambicanPhone(phone);
  const operator = phoneValid ? getMobileOperator(phone) : null;
  const wallet = phoneValid ? getMobileWallet(phone) : null;
  const formattedPhone = phoneValid ? formatMozambicanPhone(phone) : null;
  const whatsappLink = phoneValid
    ? buildWhatsAppUrl(phone, isPt ? 'Olá! Pagamento validado via moz-utils.' : 'Hello! Payment validated via moz-utils.')
    : null;
  const nibValid = isValidNIB(nib);
  const bank = nibValid ? getBankFromNIB(nib) : null;
  const iban = nibValid ? nibToIBAN(nib) : null;
  const mznFormatted = formatMZN(parseFloat(amount) || 0);

  const handleProvinceChange = (newProv) => {
    setProvince(newProv);
    const nextDistricts = getDistrictsByProvince(newProv);
    setDistrict(Array.isArray(nextDistricts) && nextDistricts.length > 0 ? nextDistricts[0] : '');
  };

  const fillPreset = (type) => {
    if (type === 'emola') {
      setNuit('400000001');
      setBi('110100123456A');
      setPhone('881234567');
      setNib('000100000000000000060');
      handleProvinceChange('Nampula');
      setPostalCode('3100');
      setAmount('4850.75');
    } else {
      setNuit('100000008');
      setBi('110100123456A');
      setPhone('841234567');
      setNib('000800000000000000085');
      handleProvinceChange('Maputo Cidade');
      setPostalCode('1100');
      setAmount('12500');
    }
  };

  const handleCopyJson = () => {
    const payload = {
      nuit: { value: nuit, valid: nuitValid, entityType: nuitType },
      bi: { value: bi, valid: biValid },
      phone: { e164: formattedPhone, valid: phoneValid, operator, wallet },
      banking: { nib, valid: nibValid, bank: bank?.shortName || null, iban },
      location: {
        province,
        district: activeDistrict,
        legacyPostalCode: { code: postalCode, valid: legacyPostalValid, locality: legacyLocality },
        suggestedNewCEP: cepSuggestions[0]?.cep || null
      },
      amount: { raw: parseFloat(amount) || 0, formatted: mznFormatted }
    };
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <section id="playground" style={{ padding: '70px 20px', borderTop: '1px solid var(--border-subtle)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <span className="badge-moz" style={{ marginBottom: '12px' }}>
            <ShieldCheck size={14} />
            {isPt ? 'Prova Real em Produção · moz-utils@0.4.0' : 'Live Production Proof · moz-utils@0.4.0'}
          </span>
          <h2 style={{ fontSize: '2.3rem', fontWeight: '800', letterSpacing: '-0.03em' }}>
            {isPt ? 'Veja em Ação: Checkout & KYC Moçambicano' : 'See It in Action: Mozambican Checkout & KYC'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '680px', margin: '10px auto 0 auto', fontSize: '1.02rem' }}>
            {isPt
              ? 'Este formulário executa a biblioteca moz-utils diretamente no seu navegador — zero chamadas de API, validação fiscal, bancária, geográfica e de carteiras em tempo real.'
              : 'This form runs moz-utils directly in your browser — zero API calls, real-time fiscal, banking, geographic, and mobile wallet validation.'}
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px', flexWrap: 'wrap' }}>
            <button type="button" onClick={() => fillPreset('emola')} className="btn-secondary-clean" style={{ fontSize: '0.84rem', padding: '7px 14px' }}>
              <Sparkles size={14} color="var(--moz-green)" />
              {isPt ? 'Cenário 1: Movitel e-Mola (Prefixo 88) · Nampula' : 'Scenario 1: Movitel e-Mola (Prefix 88) · Nampula'}
            </button>
            <button type="button" onClick={() => fillPreset('mpesa')} className="btn-secondary-clean" style={{ fontSize: '0.84rem', padding: '7px 14px' }}>
              <Sparkles size={14} color="var(--moz-yellow)" />
              {isPt ? 'Cenário 2: Vodacom M-Pesa · Maputo' : 'Scenario 2: Vodacom M-Pesa · Maputo'}
            </button>
          </div>
        </div>

        <div className="clean-panel" style={{
          maxWidth: '1040px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '28px',
          border: '1px solid var(--moz-green-border)',
          boxShadow: 'var(--shadow-glow-terminal)'
        }}>
          {/* Coluna Esquerda: Inputs Reais */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                <span>{isPt ? 'NUIT (Autoridade Tributária)' : 'NUIT (Tax ID)'}</span>
                <span style={{ color: nuitValid ? 'var(--moz-green)' : 'var(--moz-red)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {nuitValid ? <><CheckCircle2 size={13} /> {nuitType}</> : <><XCircle size={13} /> {isPt ? 'Inválido' : 'Invalid'}</>}
                </span>
              </label>
              <input className="clean-input" value={nuit} onChange={(e) => setNuit(e.target.value)} style={{ fontFamily: 'monospace' }} />
            </div>

            <div>
              <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                <span>{isPt ? 'Bilhete de Identidade (BI)' : 'National ID (BI)'}</span>
                <span style={{ color: biValid ? 'var(--moz-green)' : 'var(--moz-red)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {biValid ? <><CheckCircle2 size={13} /> {isPt ? 'Válido' : 'Valid'}</> : <><XCircle size={13} /> {isPt ? 'Inválido' : 'Invalid'}</>}
                </span>
              </label>
              <input className="clean-input" value={bi} onChange={(e) => setBi(e.target.value)} style={{ fontFamily: 'monospace' }} />
            </div>

            <div>
              <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                <span>{isPt ? 'Telemóvel / Carteira Móvel' : 'Phone / Mobile Wallet'}</span>
                <span style={{ color: phoneValid ? 'var(--moz-green)' : 'var(--moz-red)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {phoneValid ? <><CheckCircle2 size={13} /> {operator} · {wallet}</> : <><XCircle size={13} /> {isPt ? 'Inválido' : 'Invalid'}</>}
                </span>
              </label>
              <input className="clean-input" value={phone} onChange={(e) => setPhone(e.target.value)} style={{ fontFamily: 'monospace' }} />
            </div>

            <div>
              <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                <span>{isPt ? 'NIB Bancário (21 dígitos)' : 'Bank NIB (21 digits)'}</span>
                <span style={{ color: nibValid ? 'var(--moz-green)' : 'var(--moz-red)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {nibValid ? <><CheckCircle2 size={13} /> {bank?.shortName || (isPt ? 'Válido' : 'Valid')}</> : <><XCircle size={13} /> {isPt ? 'Inválido' : 'Invalid'}</>}
                </span>
              </label>
              <input className="clean-input" value={nib} onChange={(e) => setNib(e.target.value)} style={{ fontFamily: 'monospace' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  {isPt ? 'Província (Offline)' : 'Province (Offline)'}
                </label>
                <select className="clean-input" value={province} onChange={(e) => handleProvinceChange(e.target.value)}>
                  {provincesList.map((p) => (
                    <option key={p} value={p} style={{ background: '#090a0f', color: '#f8fafc' }}>{p}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  {isPt ? 'Distrito' : 'District'}
                </label>
                <select className="clean-input" value={activeDistrict} onChange={(e) => setDistrict(e.target.value)}>
                  {districts.map((d) => (
                    <option key={d} value={d} style={{ background: '#090a0f', color: '#f8fafc' }}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  <span>{isPt ? 'Código Postal (4 dígitos)' : 'Postal Code (4 digits)'}</span>
                  <span style={{ color: legacyPostalValid ? 'var(--moz-green)' : 'var(--moz-red)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {legacyPostalValid ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                  </span>
                </label>
                <input className="clean-input" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} placeholder="Ex: 3100, 1100" style={{ fontFamily: 'monospace' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  {isPt ? 'Valor (MZN)' : 'Amount (MZN)'}
                </label>
                <input className="clean-input" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} style={{ fontFamily: 'monospace' }} />
              </div>
            </div>
          </div>

          {/* Coluna Direita: Output Processado pela Lib */}
          <div style={{
            background: '#050608',
            borderRadius: '12px',
            border: '1px solid var(--border-subtle)',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '16px'
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--moz-green)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {isPt ? 'Payload Validado & Normalizado' : 'Validated & Normalized Payload'}
                </span>
                <button
                  type="button"
                  onClick={handleCopyJson}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-subtle)',
                    background: 'rgba(255,255,255,0.05)',
                    color: copiedJson ? 'var(--moz-green)' : 'var(--text-secondary)',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  {copiedJson ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copiedJson ? (isPt ? 'JSON Copiado!' : 'JSON Copied!') : (isPt ? 'Copiar JSON' : 'Copy JSON')}</span>
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.88rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)' }}>
                  <Smartphone size={17} color="var(--moz-green)" />
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.76rem' }}>{isPt ? 'Roteamento Telecom & Wallet' : 'Telecom & Wallet Routing'}</div>
                    <div style={{ color: 'var(--text-primary)', fontFamily: 'monospace' }}>
                      {phoneValid ? `${formattedPhone} → ${operator} (${wallet})` : (isPt ? 'Número inválido' : 'Invalid number')}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)' }}>
                  <Building2 size={17} color="var(--moz-green)" />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.76rem' }}>{isPt ? 'Banco & IBAN Calculado' : 'Bank & Computed IBAN'}</div>
                    <div style={{ color: 'var(--text-primary)', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                      {nibValid ? `${bank?.name || 'Banco'} · ${iban}` : (isPt ? 'NIB inválido' : 'Invalid NIB')}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)' }}>
                  <MapPin size={17} color="var(--moz-green)" />
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.76rem' }}>{isPt ? 'Localização, Código Postal (3100) & Novo CEP' : 'Location, Postal Code (3100) & New CEP'}</div>
                    <div style={{ color: 'var(--text-primary)' }}>
                      {activeDistrict}, {province}
                      {legacyPostalValid ? ` · CP ${postalCode} (${legacyLocality}, ${legacyProvince})` : ''}
                      {cepSuggestions[0]?.cep ? ` · Novo CEP ${cepSuggestions[0].cep}` : ''}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)' }}>
                  <Coins size={17} color="var(--moz-yellow)" />
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.76rem' }}>{isPt ? 'Total Formatado (MZN)' : 'Formatted Total (MZN)'}</div>
                    <div style={{ color: 'var(--moz-yellow)', fontWeight: '800', fontSize: '1.05rem', fontFamily: 'monospace' }}>
                      {mznFormatted}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {whatsappLink && (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="btn-primary-moz"
                style={{ width: '100%', textDecoration: 'none', fontSize: '0.88rem' }}
              >
                <span>{isPt ? 'Abrir Recibo no WhatsApp (buildWhatsAppUrl)' : 'Open Receipt on WhatsApp (buildWhatsAppUrl)'}</span>
                <ExternalLink size={15} />
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
