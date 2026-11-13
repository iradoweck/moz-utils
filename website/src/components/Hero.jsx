import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Copy, Check, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export default function Hero() {
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
        
        {/* Release Pill Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
          <span className="badge-moz">
            <Sparkles size={13} />
            <span>Versão 0.4.0 Pronta para Produção</span>
          </span>
          <span className="badge-yellow">
            <span>Paridade em 5 Stacks</span>
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
          A Biblioteca Definitiva de <br />
          <span style={{ 
            background: 'linear-gradient(135deg, #00ff88 0%, #38bdf8 60%, #facc15 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 40px rgba(0, 255, 136, 0.2)'
          }}>
            Software para Moçambique
          </span>
        </h1>

        {/* Subtitle */}
        <p style={{ 
          fontSize: '1.25rem', 
          color: 'var(--text-secondary)', 
          maxWidth: '720px', 
          margin: '0 auto 36px auto',
          lineHeight: '1.6'
        }}>
          Validação oficial de NUIT com Módulo 11, Bilhetes de Identidade, novo sistema bancário 
          NIB/IBAN, roteamento de carteiras móveis (M-Pesa, e-Mola, mKesh) e Código de Endereçamento Postal (CEP).
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap', marginBottom: '40px' }}>
          <a href="#playground" className="btn-primary-moz" style={{ textDecoration: 'none', padding: '12px 24px', fontSize: '1rem' }}>
            <span>Testar no Playground ao Vivo</span>
            <ArrowRight size={18} />
          </a>

          <Link to="/docs" className="btn-secondary-clean" style={{ textDecoration: 'none', padding: '12px 24px', fontSize: '1rem' }}>
            <span>Explorar Documentação Completa</span>
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
