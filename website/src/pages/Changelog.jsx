import React from 'react';
import { useTranslation } from 'react-i18next';
import { FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import changelogText from '../../../CHANGELOG.md?raw';

export default function Changelog() {
  const { t } = useTranslation();

  return (
    <div className="container animate-fade-up" style={{ padding: '60px 20px', maxWidth: '900px' }}>
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '16px' }}>{t('nav.changelog')}</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto' }}>
          Acompanha todas as novidades, correções e atualizações em cada versão da <strong className="text-neon">moz-utils</strong>.
        </p>
      </div>

      <div className="glass-panel" style={{ padding: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', borderBottom: '1px solid var(--panel-border)', paddingBottom: '16px' }}>
          <FileText color="var(--neon-green)" size={28} />
          <h2 style={{ margin: 0 }}>CHANGELOG.md</h2>
        </div>
        
        <div className="markdown-body" style={{ 
          color: 'var(--text-primary)', 
          lineHeight: '1.6',
          fontSize: '1.05rem'
        }}>
          <ReactMarkdown
            components={{
              h1: ({node, ...props}) => <h1 style={{ borderBottom: '1px solid var(--panel-border)', paddingBottom: '10px', marginTop: '40px' }} {...props} />,
              h2: ({node, ...props}) => <h2 style={{ color: 'var(--neon-green)', marginTop: '30px' }} {...props} />,
              h3: ({node, ...props}) => <h3 style={{ marginTop: '20px' }} {...props} />,
              blockquote: ({node, ...props}) => <blockquote style={{ borderLeft: '4px solid var(--neon-green)', paddingLeft: '16px', color: 'var(--text-secondary)', fontStyle: 'italic', background: 'rgba(0,0,0,0.2)', padding: '10px 16px', borderRadius: '0 8px 8px 0' }} {...props} />,
              code: ({node, inline, ...props}) => 
                inline 
                  ? <code style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px', color: 'var(--neon-green)', fontFamily: 'monospace' }} {...props} />
                  : <code style={{ display: 'block', background: 'rgba(0,0,0,0.4)', padding: '16px', borderRadius: '8px', overflowX: 'auto', fontFamily: 'monospace' }} {...props} />,
              ul: ({node, ...props}) => <ul style={{ paddingLeft: '20px', marginBottom: '16px' }} {...props} />,
              li: ({node, ...props}) => <li style={{ marginBottom: '8px' }} {...props} />,
              hr: ({node, ...props}) => <hr style={{ border: 'none', borderTop: '1px solid var(--panel-border)', margin: '40px 0' }} {...props} />,
            }}
          >
            {changelogText}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
