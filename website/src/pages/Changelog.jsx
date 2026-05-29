import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronUp, Layers, Terminal, Globe, Code, Box, Tag } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useSEO } from '../hooks/useSEO';

import changelogGlobal from '../../../CHANGELOG.md?raw';
import changelogTs from '../../../ts/CHANGELOG.md?raw';
import changelogPhp from '../../../php/CHANGELOG.md?raw';
import changelogPython from '../../../python/CHANGELOG.md?raw';
import changelogDart from '../../../dart/CHANGELOG.md?raw';
import changelogKotlin from '../../../kotlin/CHANGELOG.md?raw';

import tsConfig from '../../../ts/package.json?raw';
import websiteConfig from '../../package.json?raw';
import phpConfig from '../../../php/composer.json?raw';
import pythonConfig from '../../../python/pyproject.toml?raw';
import dartConfig from '../../../dart/pubspec.yaml?raw';
import kotlinConfig from '../../../kotlin/build.gradle.kts?raw';

const extractVersion = (text, regex) => {
  const match = text.match(regex);
  return match ? match[1] : 'N/A';
};

const stackVersions = [
  { name: 'TypeScript', version: extractVersion(tsConfig, /"version":\s*"([^"]+)"/) },
  { name: 'PHP', version: extractVersion(phpConfig, /"version":\s*"([^"]+)"/) },
  { name: 'Python', version: extractVersion(pythonConfig, /version\s*=\s*"([^"]+)"/) },
  { name: 'Dart', version: extractVersion(dartConfig, /^version:\s*([^\s]+)/m) },
  { name: 'Kotlin', version: extractVersion(kotlinConfig, /version\s*=\s*"([^"]+)"/) },
  { name: 'Website', version: extractVersion(websiteConfig, /"version":\s*"([^"]+)"/) },
];

const ChangelogSection = ({ titleKey, titleFallback, markdown, limit, icon: Icon }) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  // Split markdown by version headings
  const sections = markdown.split(/(?=\n## )/);
  const header = sections[0];
  const versionSections = sections.slice(1);
  
  const displayedVersions = expanded ? versionSections : versionSections.slice(0, limit || versionSections.length);
  const displayedMarkdown = header + displayedVersions.join('');
  const hasMore = versionSections.length > (limit || versionSections.length);

  return (
    <div className="glass-panel" style={{ padding: '40px', marginBottom: '30px' }}>
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
              e.currentTarget.style.background = 'rgba(0, 255, 170, 0.1)';
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
  const [githubTags, setGithubTags] = useState([]);

  useEffect(() => {
    fetch('https://api.github.com/repos/iradoweck/moz-utils/tags?per_page=5')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (Array.isArray(data)) {
          setGithubTags(data);
        }
      })
      .catch(() => {});
  }, []);

  useSEO(
    'Changelog',
    'Version history and release notes for moz-utils across all stacks: TypeScript, Python, PHP, Dart, Kotlin, and the official website.'
  );

  return (
    <div className="container animate-fade-up" style={{ padding: '60px 20px', maxWidth: '900px' }}>
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '16px' }}>{t('nav.changelog')}</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto' }}>
          {t('changelog_page.description')} <strong className="text-neon">moz-utils</strong>.
        </p>
      </div>

      {/* Stack Versions Panel */}
      <div className="glass-panel" style={{ padding: '30px', marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', borderBottom: '1px solid var(--panel-border)', paddingBottom: '16px' }}>
          <Layers color="var(--neon-green)" size={28} />
          <h2 style={{ margin: 0, fontSize: '1.5rem' }}>{t('changelog_page.current_stacks')}</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '16px', marginBottom: '40px' }}>
          {stackVersions.map(stack => (
            <div key={stack.name} style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--panel-border)' }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '8px' }}>{stack.name}</div>
              <div style={{ color: 'var(--neon-green)', fontSize: '1.2rem', fontWeight: 'bold', fontFamily: 'monospace' }}>v{stack.version}</div>
            </div>
          ))}
        </div>

        {githubTags.length > 0 && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', borderBottom: '1px solid var(--panel-border)', paddingBottom: '16px' }}>
              <Tag color="var(--neon-green)" size={24} />
              <h3 style={{ margin: 0, fontSize: '1.2rem' }}>GitHub Releases (Tags)</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '16px' }}>
              {githubTags.map(tag => (
                <a 
                  key={tag.name} 
                  href={`https://github.com/iradoweck/moz-utils/releases/tag/${tag.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ 
                    display: 'block', 
                    background: 'rgba(0,0,0,0.3)', 
                    padding: '16px', 
                    borderRadius: '12px', 
                    textAlign: 'center', 
                    border: '1px solid var(--panel-border)',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = 'var(--neon-green)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = 'var(--panel-border)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 'bold', fontFamily: 'monospace' }}>{tag.name}</div>
                </a>
              ))}
            </div>
          </>
        )}
      </div>

      <ChangelogSection titleKey="changelog_page.global_history" titleFallback="Histórico Geral (Global)" markdown={changelogGlobal} limit={1} icon={Globe} />
      <ChangelogSection titleFallback="TypeScript" markdown={changelogTs} limit={1} icon={Code} />
      <ChangelogSection titleFallback="Python" markdown={changelogPython} limit={1} icon={Terminal} />
      <ChangelogSection titleFallback="PHP" markdown={changelogPhp} limit={1} icon={Box} />
      <ChangelogSection titleFallback="Dart" markdown={changelogDart} limit={1} icon={Box} />
      <ChangelogSection titleFallback="Kotlin" markdown={changelogKotlin} limit={1} icon={Box} />

    </div>
  );
}
