import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronUp, Layers, Terminal, Globe, Code, Box, Layout } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useSEO } from '../hooks/useSEO';

import changelogGlobal from '../../../CHANGELOG.md?raw';
import changelogTs from '../../../ts/CHANGELOG.md?raw';
import changelogPhp from '../../../php/CHANGELOG.md?raw';
import changelogPython from '../../../python/CHANGELOG.md?raw';
import changelogDart from '../../../dart/CHANGELOG.md?raw';
import changelogKotlin from '../../../kotlin/CHANGELOG.md?raw';
import changelogWebsite from '../../../website/CHANGELOG.md?raw';

import tsConfig from '../../../ts/package.json?raw';
import phpConfig from '../../../php/composer.json?raw';
import pythonConfig from '../../../python/pyproject.toml?raw';
import dartConfig from '../../../dart/pubspec.yaml?raw';
import kotlinConfig from '../../../kotlin/build.gradle.kts?raw';

import websiteConfig from '../../../website/package.json?raw';

const extractVersion = (text, regex) => {
  const match = text.match(regex);
  return match ? match[1] : 'N/A';
};

const stackVersions = [
  { name: 'Global', icon: Globe, markdown: changelogGlobal, version: '0.3.1', isGlobal: true },
  { name: 'TypeScript', icon: Code, markdown: changelogTs, version: extractVersion(tsConfig, /"version":\s*"([^"]+)"/) },
  { name: 'Python', icon: Terminal, markdown: changelogPython, version: extractVersion(pythonConfig, /version\s*=\s*"([^"]+)"/) },
  { name: 'PHP', icon: Box, markdown: changelogPhp, version: extractVersion(phpConfig, /"version":\s*"([^"]+)"/) },
  { name: 'Dart', icon: Box, markdown: changelogDart, version: extractVersion(dartConfig, /^version:\s*([^\s]+)/m) },
  { name: 'Kotlin', icon: Box, markdown: changelogKotlin, version: extractVersion(kotlinConfig, /version\s*=\s*"([^"]+)"/) },
  { name: 'Website', icon: Layout, markdown: changelogWebsite, version: extractVersion(websiteConfig, /"version":\s*"([^"]+)"/), isWebsite: true },
];

const ChangelogSection = ({ titleKey, titleFallback, markdown, limit, icon: Icon }) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  const sections = markdown.split(/(?=\n## )/);
  const header = sections[0];
  const versionSections = sections.slice(1);
  
  const displayedVersions = expanded ? versionSections : versionSections.slice(0, limit || versionSections.length);
  const displayedMarkdown = header + displayedVersions.join('');
  const hasMore = versionSections.length > (limit || versionSections.length);

  return (
    <div className="glass-panel animate-fade-up" style={{ padding: '40px', marginBottom: '30px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', borderBottom: '1px solid var(--panel-border)', paddingBottom: '16px' }}>
        <Icon color="var(--neon-green)" size={28} />
        <h2 style={{ margin: 0, fontSize: '1.5rem' }}>{titleKey ? t(titleKey) : titleFallback}</h2>
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
            blockquote: ({node, ...props}) => <blockquote style={{ borderLeft: '4px solid var(--neon-green)', paddingLeft: '16px', color: 'var(--text-secondary)', fontStyle: 'italic', background: 'var(--overlay-3)', padding: '10px 16px', borderRadius: '0 8px 8px 0' }} {...props} />,
            code: ({node, inline, ...props}) => 
              inline 
                ? <code style={{ background: 'var(--overlay-2)', padding: '2px 6px', borderRadius: '4px', color: 'var(--neon-green)', fontFamily: 'monospace' }} {...props} />
                : <code style={{ display: 'block', background: 'var(--overlay-3)', padding: '16px', borderRadius: '8px', overflowX: 'auto', fontFamily: 'monospace' }} {...props} />,
            ul: ({node, ...props}) => <ul style={{ paddingLeft: '20px', marginBottom: '16px' }} {...props} />,
            li: ({node, ...props}) => <li style={{ marginBottom: '8px' }} {...props} />,
            hr: ({node, ...props}) => <hr style={{ border: 'none', borderTop: '1px solid var(--panel-border)', margin: '40px 0' }} {...props} />,
          }}
        >
          {displayedMarkdown}
        </ReactMarkdown>
      </div>

      {hasMore && (
        <div style={{ textAlign: 'center', marginTop: '40px', borderTop: '1px solid var(--panel-border)', paddingTop: '20px' }}>
          <button 
            onClick={() => setExpanded(!expanded)}
            style={{
              background: 'transparent',
              border: '1px solid var(--neon-green)',
              color: 'var(--neon-green)',
              padding: '10px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '1rem',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'var(--success-bg)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            {expanded ? (
              <>{t('changelog_page.view_less')} <ChevronUp size={20} /></>
            ) : (
              <>{t('changelog_page.view_all')} <ChevronDown size={20} /></>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default function Changelog() {
  const { t } = useTranslation();
  useSEO(
    'Changelog',
    'Version history and release notes for moz-utils across all stacks: TypeScript, Python, PHP, Dart, Kotlin, and the official website.'
  );

  const [activeStack, setActiveStack] = useState('Global');

  const activeConfig = stackVersions.find(s => s.name === activeStack) || stackVersions[0];

  return (
    <div className="container animate-fade-up" style={{ padding: '60px 20px', maxWidth: '900px' }}>
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '16px' }}>{t('nav.changelog')}</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto' }}>
          {t('changelog_page.description')} <strong className="text-neon">moz-utils</strong>.
        </p>
      </div>

      <div className="glass-panel" style={{ padding: '30px', marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', borderBottom: '1px solid var(--panel-border)', paddingBottom: '16px' }}>
          <Layers color="var(--neon-green)" size={28} />
          <h2 style={{ margin: 0, fontSize: '1.5rem' }}>{t('changelog_page.current_stacks')}</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '16px' }}>
          {stackVersions.map(stack => (
            <div 
              key={stack.name} 
              onClick={() => setActiveStack(stack.name)}
              style={{ 
                background: activeStack === stack.name ? 'var(--success-bg)' : 'var(--overlay-3)', 
                padding: '16px', 
                borderRadius: '12px', 
                textAlign: 'center', 
                border: `1px solid ${activeStack === stack.name ? 'var(--neon-green)' : 'var(--panel-border)'}`,
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ color: activeStack === stack.name ? 'var(--neon-green)' : 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <stack.icon size={16} />
                {stack.isGlobal ? t('changelog_page.global_history') : stack.name}
              </div>
              <div style={{ color: activeStack === stack.name ? 'var(--text-primary)' : 'var(--neon-green)', fontSize: '1.2rem', fontWeight: 'bold', fontFamily: 'monospace' }}>
                v{stack.version}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div key={activeStack}>
        <ChangelogSection 
          titleFallback={activeConfig.isGlobal ? t('changelog_page.global_history') : activeConfig.name} 
          markdown={activeConfig.markdown} 
          limit={1} 
          icon={activeConfig.icon} 
        />
      </div>

    </div>
  );
}
