import React from 'react';
import { useSEO } from '../hooks/useSEO';
import Hero from '../components/Hero';
import MetricsShowcase from '../components/MetricsShowcase';
import DogfoodingShowcase from '../components/DogfoodingShowcase';
import BeforeAfterShowcase from '../components/BeforeAfterShowcase';
import EcosystemInstallation from '../components/EcosystemInstallation';
import { 
  Building2, Phone, CreditCard, 
  MapPin, Coins, ArrowRight, Bot 
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  
  useSEO(
    'moz-utils — Biblioteca Oficial de Utilitários de Moçambique',
    'Validação oficial de NUIT com Módulo 11, Bilhetes de Identidade, novo sistema bancário NIB/IBAN, roteamento de carteiras móveis (M-Pesa, e-Mola, mKesh) e Código de Endereçamento Postal (CEP).'
  );

  const featureCards = [
    {
      icon: <CreditCard size={24} color="var(--moz-green)" />,
      title: "Documentos de Identidade & Fiscais",
      desc: "Validação oficial de NUIT com algoritmo Módulo 11, Bilhete de Identidade (BI), DIRE, Passaporte Moçambicano e Carta de Condução com zero dependências.",
      tag: "Fiscal & Identidade",
      link: "/docs/documents"
    },
    {
      icon: <Building2 size={24} color="var(--moz-green)" />,
      title: "Módulo Bancário Nacional (NIB & IBAN)",
      desc: "Suporte completo a NIB (21 dígitos sob ISO 7064 Módulo 97-10), geração de IBAN MZ59 e catálogo oficial de 22 bancos comerciais regulados pelo Banco de Moçambique.",
      tag: "Fintech & Bancos",
      link: "/docs/banking"
    },
    {
      icon: <Phone size={24} color="var(--moz-green)" />,
      title: "Telefonia & Carteiras Móveis",
      desc: "Parsing e formatação E.164 para Vodacom (84/85), Tmcel (82/83) e Movitel (86/87/88) com roteamento direto para M-Pesa, e-Mola e mKesh.",
      tag: "Telecom & Inclusão",
      link: "/docs/phones"
    },
    {
      icon: <MapPin size={24} color="var(--moz-green)" />,
      title: "Geografia & Novo CEP (Offline)",
      desc: "Base de dados offline com as 11 províncias, distritos, postos e motor de autocompletar do Novo Código de Endereçamento Postal de 6 dígitos.",
      tag: "Logística & Endereços",
      link: "/docs/postal"
    },
    {
      icon: <Coins size={24} color="var(--moz-green)" />,
      title: "Moeda Metical (MZN / MT)",
      desc: "Formatação conforme o padrão oficial e parsing seguro de strings monetárias para cálculos financeiros sem quebras de precisão.",
      tag: "Financeiro",
      link: "/docs/currency"
    },
    {
      icon: <Bot size={24} color="var(--moz-green)" />,
      title: "Pronto para Desenvolvedores & Agentes de IA",
      desc: "Assinaturas de métodos padronizadas, tipagens TypeScript puras, documento llms.txt embutido e exportação rápida de contexto para LLMs.",
      tag: "Developer Experience & AI",
      link: "/docs/overview"
    }
  ];

  return (
    <div style={{ paddingBottom: '40px' }}>
      
      {/* 1. Hero Imersivo de Alto Nível */}
      <Hero />

      {/* 2. Métricas de Impacto Big Tech */}
      <MetricsShowcase />

      {/* 3. Prova Real (Dogfooding com Checkout & KYC Moçambicano) */}
      <DogfoodingShowcase />

      {/* 4. Showcase Antes vs Depois */}
      <BeforeAfterShowcase />

      {/* 5. Grid de Funcionalidades & Apresentação */}
      <section style={{ padding: '80px 20px' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: '800', letterSpacing: '-0.03em' }}>
              Construído para a Realidade Tecnológica de Moçambique
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '680px', margin: '10px auto 0 auto', fontSize: '1.05rem' }}>
              Elimine código duplicado, regex frágeis e validações incorretas em formulários e APIs de produção.
            </p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
            gap: '24px' 
          }}>
            {featureCards.map((feat, idx) => (
              <div key={idx} className="clean-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ 
                      width: '44px', 
                      height: '44px', 
                      borderRadius: '10px', 
                      backgroundColor: 'rgba(255, 255, 255, 0.05)', 
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {feat.icon}
                    </div>

                    <span style={{ 
                      fontSize: '0.75rem', 
                      fontWeight: '700', 
                      color: 'var(--text-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      {feat.tag}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', marginBottom: '10px', color: 'var(--text-primary)' }}>
                    {feat.title}
                  </h3>

                  <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '20px' }}>
                    {feat.desc}
                  </p>
                </div>

                <Link 
                  to={feat.link} 
                  style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '6px', 
                    fontSize: '0.9rem', 
                    fontWeight: '600', 
                    color: 'var(--moz-green)',
                    textDecoration: 'none'
                  }}
                >
                  <span>Ver documentação e exemplos</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Instalação e Tabs Poliglotas das 5 Stacks */}
      <EcosystemInstallation />

      {/* 7. Convite discreto para contribuição */}
      <section style={{ padding: '24px 20px 10px 20px' }}>
        <div className="container" style={{ maxWidth: '960px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            padding: '18px 24px',
            borderRadius: '12px',
            border: '1px solid var(--border-subtle)',
            background: 'rgba(255, 255, 255, 0.02)'
          }}>
            <div style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
              <strong style={{ color: 'var(--text-primary)' }}>Open-source feito para evoluir.</strong>{' '}
              Encontrou uma nova regra regional ou quer melhorar alguma stack?
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <a
                href="https://github.com/iradoweck/moz-utils/pulls"
                target="_blank"
                rel="noreferrer"
                style={{ fontSize: '0.86rem', fontWeight: '600', color: 'var(--moz-green)', textDecoration: 'none' }}
              >
                Abrir um PR →
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
