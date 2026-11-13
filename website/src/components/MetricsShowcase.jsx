import React from 'react';
import { Building2, MapPin, Smartphone, Layers } from 'lucide-react';

export default function MetricsShowcase() {
  const metrics = [
    {
      icon: <Layers size={22} color="var(--moz-green)" />,
      value: "5 Stacks Nativas",
      label: "TypeScript, Python, PHP, Dart & Kotlin",
      desc: "100% de paridade de assinaturas e algoritmos idênticos."
    },
    {
      icon: <Building2 size={22} color="var(--moz-green)" />,
      value: "22 Bancos Nacionais",
      label: "Regulados pelo Banco de Moçambique",
      desc: "ISO 7064 Módulo 97-10 e conversão para IBAN MZ59."
    },
    {
      icon: <MapPin size={22} color="var(--moz-green)" />,
      value: "161 Distritos & 11 Províncias",
      label: "Base Offline Embutida",
      desc: "Incluindo o Novo Código de Endereçamento Postal (CEP)."
    },
    {
      icon: <Smartphone size={22} color="var(--moz-green)" />,
      value: "3 Grandes Operadoras & Wallets",
      label: "Vodacom, Tmcel & Movitel",
      desc: "Suporte completo aos prefixos 82 a 88 e carteiras M-Pesa, e-Mola e mKesh."
    }
  ];

  return (
    <section style={{ padding: '40px 20px 60px 20px' }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px'
        }}>
          {metrics.map((m, idx) => (
            <div key={idx} className="clean-panel" style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              border: '1px solid var(--border-subtle)',
              background: 'rgba(15, 17, 26, 0.7)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--moz-green-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {m.icon}
                </div>
                <span style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                  {m.value}
                </span>
              </div>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--moz-green)', marginBottom: '2px' }}>
                  {m.label}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
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
