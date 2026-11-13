import React, { useState } from 'react';
import {
  isValidNUIT, getNUITEntityType,
  isValidBI,
  isValidMozambicanPhone, getMobileOperator, getMobileWallet, formatMozambicanPhone, buildWhatsAppUrl,
  isValidNIB, getBankFromNIB, nibToIBAN,
  formatMZN,
  mozambiqueProvinces, getDistrictsByProvince
} from 'moz-utils';
import { CheckCircle2, XCircle, Sparkles, ShieldCheck, Building2, Smartphone, MapPin, Coins, ExternalLink } from 'lucide-react';

export default function DogfoodingShowcase() {
  const [nuit, setNuit] = useState('400000001');
  const [bi, setBi] = useState('110100123456A');
  const [phone, setPhone] = useState('881234567');
  const [nib, setNib] = useState('000100000000000000060');
  const [province, setProvince] = useState('Maputo Cidade');
  const [amount, setAmount] = useState('2500');

  const provincesList = Object.keys(mozambiqueProvinces || {});
  const districts = getDistrictsByProvince(province) || [];

  const nuitValid = isValidNUIT(nuit);
  const nuitType = nuitValid ? getNUITEntityType(nuit) : null;
  const biValid = isValidBI(bi);
  const phoneValid = isValidMozambicanPhone(phone);
  const operator = phoneValid ? getMobileOperator(phone) : null;
  const wallet = phoneValid ? getMobileWallet(phone) : null;
  const formattedPhone = phoneValid ? formatMozambicanPhone(phone) : null;
  const whatsappLink = phoneValid ? buildWhatsAppUrl(phone, 'Olá! Pagamento validado via moz-utils.') : null;
  const nibValid = isValidNIB(nib);
  const bank = nibValid ? getBankFromNIB(nib) : null;
  const iban = nibValid ? nibToIBAN(nib) : null;
  const mznFormatted = formatMZN(parseFloat(amount) || 0);

  const fillPreset = (type) => {
    if (type === 'emola') {
      setNuit('400000001');
      setBi('110100123456A');
      setPhone('881234567');
      setNib('000100000000000000060');
      setProvince('Nampula');
      setAmount('4850.75');
    } else {
      setNuit('100000008');
      setBi('110100123456A');
      setPhone('841234567');
      setNib('000800000000000000085');
      setProvince('Maputo Cidade');
      setAmount('12500');
    }
  };

  return (
    <section style={{ padding: '70px 20px', borderTop: '1px solid var(--border-subtle)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <span className="badge-moz" style={{ marginBottom: '12px' }}>
            <ShieldCheck size={14} />
            Dogfooding ao Vivo · moz-utils@0.4.0
          </span>
          <h2 style={{ fontSize: '2.3rem', fontWeight: '800', letterSpacing: '-0.03em' }}>
            Prova Real: Checkout & KYC Moçambicano em Produção
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '680px', margin: '10px auto 0 auto', fontSize: '1.02rem' }}>
            Este próprio formulário está a executar a biblioteca <code style={{ color: 'var(--moz-green)' }}>moz-utils</code> no seu navegador — zero chamadas de API, validação fiscal, bancária e de carteiras em tempo real.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px', flexWrap: 'wrap' }}>
            <button onClick={() => fillPreset('emola')} className="btn-secondary-clean" style={{ fontSize: '0.84rem', padding: '7px 14px' }}>
              <Sparkles size={14} color="var(--moz-green)" />
              Cenário 1: Movitel e-Mola (Prefixo 88) · Nampula
            </button>
            <button onClick={() => fillPreset('mpesa')} className="btn-secondary-clean" style={{ fontSize: '0.84rem', padding: '7px 14px' }}>
              <Sparkles size={14} color="var(--moz-yellow)" />
              Cenário 2: Vodacom M-Pesa · Maputo
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
                <span>NUIT (Autoridade Tributária)</span>
                <span style={{ color: nuitValid ? 'var(--moz-green)' : 'var(--moz-red)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {nuitValid ? <><CheckCircle2 size={13} /> {nuitType}</> : <><XCircle size={13} /> Inválido</>}
                </span>
              </label>
              <input className="clean-input" value={nuit} onChange={(e) => setNuit(e.target.value)} style={{ fontFamily: 'monospace' }} />
            </div>

            <div>
              <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                <span>Bilhete de Identidade (BI)</span>
                <span style={{ color: biValid ? 'var(--moz-green)' : 'var(--moz-red)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {biValid ? <><CheckCircle2 size={13} /> Válido</> : <><XCircle size={13} /> Inválido</>}
                </span>
              </label>
              <input className="clean-input" value={bi} onChange={(e) => setBi(e.target.value)} style={{ fontFamily: 'monospace' }} />
            </div>

            <div>
              <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                <span>Telemóvel / Carteira Móvel</span>
                <span style={{ color: phoneValid ? 'var(--moz-green)' : 'var(--moz-red)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {phoneValid ? <><CheckCircle2 size={13} /> {operator} · {wallet}</> : <><XCircle size={13} /> Inválido</>}
                </span>
              </label>
              <input className="clean-input" value={phone} onChange={(e) => setPhone(e.target.value)} style={{ fontFamily: 'monospace' }} />
            </div>

            <div>
              <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                <span>NIB Bancário (21 dígitos)</span>
                <span style={{ color: nibValid ? 'var(--moz-green)' : 'var(--moz-red)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {nibValid ? <><CheckCircle2 size={13} /> {bank?.shortName || 'Válido'}</> : <><XCircle size={13} /> Inválido</>}
                </span>
              </label>
              <input className="clean-input" value={nib} onChange={(e) => setNib(e.target.value)} style={{ fontFamily: 'monospace' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Província (Offline)
                </label>
                <select className="clean-input" value={province} onChange={(e) => setProvince(e.target.value)}>
                  {provincesList.map((p) => (
                    <option key={p} value={p} style={{ background: '#090a0f', color: '#f8fafc' }}>{p}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Valor (MZN)
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
              <div style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--moz-green)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '14px' }}>
                Payload Validado & Normalizado
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.88rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)' }}>
                  <Smartphone size={17} color="var(--moz-green)" />
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.76rem' }}>Roteamento Telecom & Wallet</div>
                    <div style={{ color: 'var(--text-primary)', fontFamily: 'monospace' }}>
                      {phoneValid ? `${formattedPhone} → ${operator} (${wallet})` : 'Número inválido'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)' }}>
                  <Building2 size={17} color="var(--moz-green)" />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.76rem' }}>Banco & IBAN Calculado</div>
                    <div style={{ color: 'var(--text-primary)', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                      {nibValid ? `${bank?.name || 'Banco'} · ${iban}` : 'NIB inválido'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)' }}>
                  <MapPin size={17} color="var(--moz-green)" />
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.76rem' }}>Distritos Carregados Offline ({province})</div>
                    <div style={{ color: 'var(--text-primary)' }}>
                      {districts.length} distritos disponíveis ({districts.slice(0, 3).join(', ')}...)
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)' }}>
                  <Coins size={17} color="var(--moz-yellow)" />
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.76rem' }}>Total Formatado (MZN)</div>
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
                <span>Abrir Recibo no WhatsApp (buildWhatsAppUrl)</span>
                <ExternalLink size={15} />
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
