import React from 'react';
import { Package, GitBranch, BookOpen } from 'lucide-react';

export default function Community() {
  const codeSnippets = {
    ts: 'npm install moz-utils',
    php: 'composer require iradoweck/moz-utils',
    python: 'pip install moz-utils',
    dart: 'dart pub add moz_utils',
    kotlin: 'implementation("com.github.iradoweck:moz-utils:0.3.1")'
  };

  return (
    <section style={{ padding: '60px 0', backgroundColor: 'var(--overlay-3)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>
            Instalação e <span className="text-neon">Comunidade</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>Um projeto open-source para 5 ecossistemas.</p>
        </div>

        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
          
          <div className="glass-panel" style={{ flex: '1 1 350px', maxWidth: '500px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <Package size={24} color="var(--neon-green)" /> Quick Start
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {Object.entries(codeSnippets).map(([lang, code]) => (
                <div key={lang} style={{ background: '#000', padding: '12px', borderRadius: '6px', border: '1px solid #333' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px', textTransform: 'uppercase' }}>{lang}</div>
                  <code style={{ color: 'var(--neon-green)', fontFamily: 'monospace' }}>{code}</code>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel" style={{ flex: '1 1 350px', maxWidth: '500px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            <GitBranch size={48} color="white" style={{ marginBottom: '16px' }} />
            <h3 style={{ marginBottom: '16px' }}>Junta-te a nós no GitHub</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Tens uma ideia para uma nova funcionalidade? Queres ajudar a melhorar as validações de CEPs? Faz um fork e envia-nos a tua PR!
            </p>
            <a href="https://github.com/iradoweck/moz-utils" target="_blank" rel="noreferrer" className="btn-primary">
              <BookOpen size={20} />
              Ler a Documentação
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
