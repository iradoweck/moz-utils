import React from 'react';
import { useTranslation } from 'react-i18next';
import { Building2, MapPin, Smartphone, Layers } from 'lucide-react';

export default function MetricsShowcase() {
  const { i18n } = useTranslation();
  const isPt = i18n.language?.startsWith('pt');

  const metrics = [
    {
      icon: <Layers size={20} color="var(--moz-green)" />,
      value: isPt ? '5 Stacks' : '5 Stacks',
      label: isPt ? 'TypeScript, Python, PHP, Dart, Kotlin' : 'TypeScript, Python, PHP, Dart, Kotlin',
      desc: isPt ? '100% de paridade de assinaturas e algoritmos.' : '100% signature and algorithm parity.'
    },
    {
      icon: <Building2 size={20} color="var(--moz-green)" />,
      value: isPt ? '22 Bancos' : '22 Banks',
      label: isPt ? 'Regulados pelo Banco de Moçambique' : 'Regulated by Bank of Mozambique',
      desc: isPt ? 'Validação ISO 7064 Mod 97-10 e IBAN MZ59.' : 'ISO 7064 Mod 97-10 & MZ59 IBAN conversion.'
    },
    {
      icon: <MapPin size={20} color="var(--moz-green)" />,
      value: isPt ? '161 Distritos' : '161 Districts',
      label: isPt ? '11 Províncias em Base Offline' : '11 Provinces in Offline Database',
      desc: isPt ? 'Inclui o Novo Código Postal (CEP) de 6 dígitos.' : 'Includes the 6-digit New Postal Code (CEP).'
    },
    {
      icon: <Smartphone size={20} color="var(--moz-green)" />,
      value: isPt ? '3 Operadoras' : '3 Carriers',
      label: isPt ? 'Vodacom, Tmcel & Movitel (82–88)' : 'Vodacom, Tmcel & Movitel (82–88)',
      desc: isPt ? 'Roteamento para M-Pesa, mKesh e e-Mola.' : 'Routing for M-Pesa, mKesh, and e-Mola.'
    }
  ];

  return (
    <section style={{ padding: '32px 20px 56px 20px' }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '18px',
          alignItems: 'stretch'
        }}>
          {metrics.map((m, idx) => (
            <div key={idx} className="clean-panel" style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '12px',
              padding: '20px',
              height: '100%',
              border: '1px solid var(--border-subtle)',
              background: 'rgba(15, 17, 26, 0.75)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '9px',
                  backgroundColor: 'var(--moz-green-subtle)',
                  border: '1px solid var(--moz-green-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {m.icon}
                </div>
                <span style={{
                  fontSize: '1.35rem',
                  fontWeight: '800',
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.02em',
                  whiteSpace: 'nowrap'
                }}>
                  {m.value}
                </span>
              </div>

              <div>
                <div style={{
                  fontSize: '0.88rem',
                  fontWeight: '700',
                  color: 'var(--moz-green)',
                  marginBottom: '4px',
                  lineHeight: '1.35'
                }}>
                  {m.label}
                </div>
                <div style={{
                  fontSize: '0.82rem',
                  color: 'var(--text-secondary)',
                  lineHeight: '1.45'
                }}>
                  {m.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
