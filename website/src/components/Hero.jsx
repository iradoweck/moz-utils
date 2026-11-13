import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Copy, Check, ArrowRight, Sparkles, CheckCircle2, Cpu } from 'lucide-react';

export default function Hero() {
  const { i18n } = useTranslation();
  const isPt = i18n.language?.startsWith('pt');
  const [copied, setCopied] = useState(false);
  const [activeStack, setActiveStack] = useState('npm');

  const installCommands = {
    npm: 'npm install moz-utils',
    pip: 'pip install moz-utils',
    composer: 'composer require iradoweck/moz-utils',
    flutter: 'flutter pub add moz_utils',
    gradle: 'implementation("com.github.iradoweck:moz-utils:v0.4.0")'
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(installCommands[activeStack]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section style={{ 
      padding: '70px 20px 50px 20px', 
      textAlign: 'center', 
      position: 'relative'
    }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        
        {/* Original Glowing Cpu Icon */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '16px',
            background: 'rgba(0, 255, 136, 0.08)',
            border: '1px solid var(--moz-green-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 32px rgba(0, 255, 136, 0.25)'
          }}>
            <Cpu size={32} color="var(--moz-green)" />
          </div>
        </div>

        {/* Release Pill Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <span className="badge-moz">
            <Sparkles size={13} />
            <span>{isPt ? 'Versão 0.4.0 Pronta para Produção' : 'Version 0.4.0 Production Ready'}</span>
          </span>
          <span className="badge-yellow">
            <span>{isPt ? 'Paridade em 5 Stacks' : '5-Stack Parity'}</span>
          </span>
          <span className="badge-red">
            <span>Zero Runtime Dependencies</span>
          </span>
        </div>

        {/* Main Title Bigtech style */}
        <h1 style={{ 
          fontSize: '3.6rem', 
          lineHeight: '1.1', 
          fontWeight: '800', 
          marginBottom: '20px',
          color: 'var(--text-primary)',
          letterSpacing: '-0.04em'
        }}>
          {isPt ? 'Feita para Moçambique.' : 'Built for Mozambique.'} <br />
          <span style={{ 
            background: 'linear-gradient(135deg, #00ff88 0%, #38bdf8 60%, #facc15 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 40px rgba(0, 255, 136, 0.2)'
          }}>
            {isPt ? 'Usada por Devs no Mundo Todo.' : 'Used by Devs Worldwide.'}
          </span>
        </h1>

        {/* Subtitle */}
        <p style={{ 
          fontSize: '1.2rem', 
          color: 'var(--text-secondary)', 
          maxWidth: '740px', 
          margin: '0 auto 36px auto',
          lineHeight: '1.6'
        }}>
          {isPt
            ? 'Integre dados e regras oficiais de Moçambique em qualquer sistema global — validação de NUIT (Módulo 11), Bilhete de Identidade, NIB/IBAN bancário, carteiras móveis (M-Pesa, e-Mola, mKesh) e Novo CEP offline em 5 linguagens.'
            : 'Integrate official Mozambican rules and data into any global system — NUIT (Mod 11), National ID (BI), NIB/IBAN banking, mobile wallets (M-Pesa, e-Mola, mKesh), and offline Postal Codes (CEP) across 5 languages.'}
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap', marginBottom: '40px' }}>
          <button
            type="button"
            onClick={() => document.getElementById('playground')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-primary-moz"
            style={{ padding: '12px 24px', fontSize: '1rem' }}
          >
            <span>{isPt ? 'Testar no Playground ao Vivo' : 'Try Live Playground'}</span>
            <ArrowRight size={18} />
          </button>

          <Link to="/docs" className="btn-secondary-clean" style={{ textDecoration: 'none', padding: '12px 24px', fontSize: '1rem' }}>
            <span>{isPt ? 'Explorar Documentação Completa' : 'Explore Full Documentation'}</span>
          </Link>
        </div>

        {/* Terminal Quick Install Box */}
        <div style={{ 
          maxWidth: '580px', 
          margin: '0 auto', 
          background: 'var(--bg-card)', 
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
          boxShadow: 'var(--shadow-glow-terminal)',
          backdropFilter: 'blur(12px)',
          overflow: 'hidden'
        }}>
          {/* Tabs dos Gerenciadores */}
          <div style={{ 
            display: 'flex', 
            backgroundColor: 'rgba(0, 0, 0, 0.4)', 
            borderBottom: '1px solid var(--border-subtle)',
            padding: '4px'
          }}>
            {Object.keys(installCommands).map((stack) => (
              <button
                key={stack}
                onClick={() => setActiveStack(stack)}
                style={{
                  flex: 1,
                  padding: '7px 10px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  backgroundColor: activeStack === stack ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                  color: activeStack === stack ? 'var(--moz-green)' : 'var(--text-secondary)',
                  boxShadow: activeStack === stack ? 'var(--shadow-sm)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                {stack.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Linha de Código */}
          <div style={{ 
            padding: '14px 20px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            fontFamily: 'monospace',
            fontSize: '0.92rem',
            color: 'var(--text-primary)',
            backgroundColor: 'rgba(5, 6, 8, 0.8)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
              <span style={{ color: 'var(--moz-green)', fontWeight: 'bold' }}>$</span>
              <span style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{installCommands[activeStack]}</span>
            </div>

            <button
              onClick={handleCopy}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: copied ? 'var(--moz-green)' : 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.8rem',
                fontWeight: '600',
                padding: '4px 8px',
                borderRadius: '4px',
                marginLeft: '12px'
              }}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span>{copied ? 'Copiado!' : 'Copiar'}</span>
            </button>
          </div>
        </div>

        {/* Selos de Confiança / Benefícios Chave */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          gap: '24px', 
          flexWrap: 'wrap', 
          marginTop: '36px',
          color: 'var(--text-muted)',
          fontSize: '0.88rem'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={16} color="var(--moz-green)" />
            Aritmética Módulo 11 & Módulo 97-10 exata
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={16} color="var(--moz-green)" />
            Zero chamadas de rede ou telemetria
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={16} color="var(--moz-green)" />
            100% Cobertura de Testes Unitários
          </span>
        </div>

      </div>
    </section>
  );
}
