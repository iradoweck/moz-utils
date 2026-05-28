import React from 'react';
import { BookOpen, ShieldCheck, Cpu, Code } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSEO } from '../hooks/useSEO';

export default function Documentation() {
  const { t } = useTranslation();
  useSEO(
    'Documentation',
    'Everything you need to use, test, contribute to, and integrate moz-utils in a professional or monorepo environment. Guides for TypeScript, Python, PHP, Dart, and Kotlin.'
  );

  return (
    <div className="container animate-fade-up" style={{ padding: '60px 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '16px' }}>{t('nav.docs')}</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto' }}>
          Everything you need to use, test, contribute to, and integrate <strong className="text-neon">moz-utils</strong> in a professional or monorepo environment.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        <div className="glass-panel">
          <BookOpen size={32} color="var(--neon-green)" style={{ marginBottom: '16px' }} />
          <h3>How to Use</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
            Install via npm, composer, pip, or pub. Learn how to import NUIT, BI, Phone, and CEP functions into your projects.
          </p>
          <a href="https://github.com/iradoweck/moz-utils/tree/main/ts" target="_blank" rel="noreferrer" className="btn-primary" style={{ marginTop: '16px' }}>Read the Getting Started Guide</a>
        </div>

        <div className="glass-panel">
          <Code size={32} color="var(--neon-green)" style={{ marginBottom: '16px' }} />
          <h3>How to Contribute</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
            The community grows with your help. See the rules for Pull Requests, per-stack tests, and code formatting guidelines.
          </p>
          <a href="https://github.com/iradoweck/moz-utils/blob/main/CONTRIBUTING.md" target="_blank" rel="noreferrer" className="btn-primary" style={{ marginTop: '16px' }}>Contribution Guide</a>
        </div>

        <div className="glass-panel">
          <ShieldCheck size={32} color="var(--neon-green)" style={{ marginBottom: '16px' }} />
          <h3>Testing and Validation</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
            Each stack (TS, PHP, Python, Dart) has its own test suite (Vitest, Pest, Pytest). Learn how to run them locally.
          </p>
        </div>

        <div className="glass-panel">
          <Cpu size={32} color="var(--neon-green)" style={{ marginBottom: '16px' }} />
          <h3>Monorepos and Integrations</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
            Our structure is built around a monorepo architecture. Learn how to link our libraries to other internal packages in your organization.
          </p>
        </div>
      </div>
    </div>
  );
}
