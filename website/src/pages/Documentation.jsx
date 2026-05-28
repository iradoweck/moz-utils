import React from 'react';
import { BookOpen, ShieldCheck, Cpu, Code } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Documentation() {
  const { t } = useTranslation();

  return (
    <div className="container animate-fade-up" style={{ padding: '60px 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '16px' }}>{t('nav.docs')}</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto' }}>
          Tudo o que precisas para usar, testar, contribuir e integrar a <strong className="text-neon">moz-utils</strong> num ambiente profissional ou monorepo.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        <div className="glass-panel">
          <BookOpen size={32} color="var(--neon-green)" style={{ marginBottom: '16px' }} />
          <h3>Como Usar</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
            Instala via npm, composer, pip ou pub. Vê como importar as funções de NUIT, BI, Telefone e CEP nos teus projetos.
          </p>
          <a href="https://github.com/iradoweck/moz-utils/tree/main/ts" target="_blank" rel="noreferrer" className="btn-primary" style={{ marginTop: '16px' }}>Ler Guia Inicial</a>
        </div>

        <div className="glass-panel">
          <Code size={32} color="var(--neon-green)" style={{ marginBottom: '16px' }} />
          <h3>Como Contribuir</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
            A comunidade cresce com a tua ajuda. Vê as regras para Pull Requests, testes em cada stack e formatação de código.
          </p>
          <a href="https://github.com/iradoweck/moz-utils/blob/main/CONTRIBUTING.md" target="_blank" rel="noreferrer" className="btn-primary" style={{ marginTop: '16px' }}>Guia de Contribuição</a>
        </div>

        <div className="glass-panel">
          <ShieldCheck size={32} color="var(--neon-green)" style={{ marginBottom: '16px' }} />
          <h3>Testar e Validar</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
            Cada stack (TS, PHP, Python, Dart) tem a sua suite de testes (Vitest, Pest, Pytest). Descobre como os correr.
          </p>
        </div>

        <div className="glass-panel">
          <Cpu size={32} color="var(--neon-green)" style={{ marginBottom: '16px' }} />
          <h3>Monorepos e Integrações</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
            A nossa estrutura baseia-se em repositórios monorepo. Sabe como ligar as nossas bibliotecas a outros pacotes internos da tua empresa.
          </p>
        </div>
      </div>
    </div>
  );
}
