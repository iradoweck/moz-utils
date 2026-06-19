import React from 'react';
import { ShieldCheck, Map, Zap, Database } from 'lucide-react';

export default function FeaturesGrid() {
  const features = [
    {
      icon: <ShieldCheck size={32} color="var(--neon-green)" />,
      title: "100% Cobertura de Testes",
      description: "Testes unitários rigorosos em todas as linguagens suportadas para garantir precisão absoluta na validação de dados críticos."
    },
    {
      icon: <Zap size={32} color="#ff9f0a" />,
      title: "Zero Dependências",
      description: "Pacotes extremamente leves que não poluem o seu projeto. Todo o código é nativo da linguagem escolhida."
    },
    {
      icon: <Map size={32} color="#bf5af2" />,
      title: "Dados Geográficos Embutidos",
      description: "Validação completa de Códigos Postais (antigos e novos) e mapeamento offline de Províncias e Distritos de Moçambique."
    },
    {
      icon: <Database size={32} color="#0a84ff" />,
      title: "Tipagem Estrita",
      description: "Totalmente compatível com TypeScript, Dart com null-safety e Kotlin, oferecendo autocompletar poderoso no seu IDE."
    }
  ];

  return (
    <section style={{ padding: '80px 0', background: 'var(--body-bg-gradient)' }}>
      <div className="container animate-fade-up">
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Porquê <span className="text-gradient">moz-utils?</span></h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
            Desenhado para o mercado local com a engenharia e qualidade do mercado global.
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '24px' 
        }}>
          {features.map((f, i) => (
            <div key={i} className="glass-panel" style={{
              padding: '32px 24px',
              transition: 'transform 0.3s ease',
              border: '1px solid var(--panel-border)'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ marginBottom: '20px', background: 'var(--overlay-2)', display: 'inline-block', padding: '12px', borderRadius: '12px' }}>
                {f.icon}
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '12px', color: 'var(--text-primary)' }}>{f.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
