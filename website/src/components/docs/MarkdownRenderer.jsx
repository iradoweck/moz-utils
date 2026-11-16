import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import { Copy, Check, Terminal } from 'lucide-react';
import 'highlight.js/styles/atom-one-dark.css';

const extractText = (node) => {
  if (typeof node === 'string') return node;
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (node && node.props && node.props.children) return extractText(node.props.children);
  return '';
};

const PreBlock = ({ children, className }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const codeText = extractText(children);
    navigator.clipboard.writeText(codeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={className} style={{ position: 'relative', marginBottom: '24px', marginTop: '16px' }}>
      <button
        onClick={handleCopy}
        title="Copiar código"
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          zIndex: 10,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          padding: '5px 10px',
          borderRadius: '6px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          background: copied ? 'rgba(0, 255, 136, 0.15)' : 'rgba(15, 17, 26, 0.85)',
          color: copied ? 'var(--moz-green)' : 'var(--text-secondary)',
          fontSize: '0.75rem',
          fontWeight: '600',
          cursor: 'pointer',
          backdropFilter: 'blur(6px)',
          transition: 'all 0.15s ease'
        }}
      >
        {copied ? <Check size={13} /> : <Copy size={13} />}
        <span>{copied ? 'Copiado!' : 'Copiar'}</span>
      </button>
      <pre style={{
        background: '#050608',
        padding: '18px 20px',
        paddingRight: '90px',
        borderRadius: '10px',
        overflowX: 'auto',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-md)',
        lineHeight: '1.6',
        margin: 0
      }}>
        {children}
      </pre>
    </div>
  );
};

const CodeTabsWidget = ({ labels, children }) => {
  const [active, setActive] = useState(0);
  
  return (
    <div className="code-tabs-widget" style={{ 
      marginBottom: '28px', 
      marginTop: '18px', 
      border: '1px solid var(--border-subtle)', 
      borderRadius: '12px', 
      overflow: 'hidden',
      background: 'var(--bg-card)',
      boxShadow: 'var(--shadow-md)'
    }}>
      <div className="tab-buttons" style={{ 
        display: 'flex', 
        alignItems: 'center',
        background: 'rgba(0, 0, 0, 0.45)', 
        borderBottom: '1px solid var(--border-subtle)', 
        overflowX: 'auto',
        padding: '0 8px'
      }}>
        <Terminal size={14} color="var(--text-muted)" style={{ margin: '0 8px', flexShrink: 0 }} />
        {labels.map((label, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            style={{
              padding: '11px 18px',
              background: active === i ? 'rgba(0, 255, 136, 0.1)' : 'transparent',
              border: 'none',
              borderBottom: active === i ? '2px solid var(--moz-green)' : '2px solid transparent',
              color: active === i ? 'var(--moz-green)' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontWeight: active === i ? '700' : '500',
              fontSize: '0.86rem',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap'
            }}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="tab-content" style={{ padding: '4px' }}>
        <div style={{ marginTop: '-16px', marginBottom: '-24px' }}>
           {children[active]}
        </div>
      </div>
    </div>
  );
};

export default function MarkdownRenderer({ content }) {
  const headingCounters = new Map();

  const makeUniqueId = (rawId) => {
    if (!rawId) return rawId;
    const count = (headingCounters.get(rawId) || 0) + 1;
    headingCounters.set(rawId, count);
    return count === 1 ? rawId : `${rawId}-${count - 1}`;
  };

  return (
    <div className="markdown-body" style={{ 
      color: 'var(--text-primary)', 
      lineHeight: '1.75', 
      fontSize: '1rem',
      maxWidth: '880px'
    }}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
        components={{
          h1: ({children, id, className}) => (
            <h1 id={id} className={className} style={{ 
              color: 'var(--text-primary)', 
              fontSize: '2.4rem',
              fontWeight: '800',
              letterSpacing: '-0.03em',
              borderBottom: '1px solid var(--border-subtle)', 
              paddingBottom: '16px', 
              marginTop: '10px', 
              marginBottom: '24px' 
            }}>
              {children}
            </h1>
          ),
          h2: ({node, children, className}) => {
            const rawId = node.children[0]?.value?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
            const id = makeUniqueId(rawId);
            return (
              <h2 id={id} className={className} style={{ 
                color: 'var(--text-primary)', 
                fontSize: '1.65rem',
                fontWeight: '700',
                letterSpacing: '-0.02em',
                marginTop: '44px', 
                marginBottom: '16px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                paddingBottom: '8px'
              }}>
                {children}
              </h2>
            );
          },
          h3: ({node, children, className}) => {
            const rawId = node.children[0]?.value?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
            const id = makeUniqueId(rawId);
            return (
              <h3 id={id} className={className} style={{ 
                color: 'var(--moz-green)', 
                fontSize: '1.25rem',
                fontWeight: '600',
                marginTop: '32px', 
                marginBottom: '14px' 
              }}>
                {children}
              </h3>
            );
          },
          a: ({children, href, className, target, rel}) => (
            <a href={href} target={target} rel={rel} className={className} style={{ 
              color: 'var(--moz-green)', 
              textDecoration: 'none',
              fontWeight: '500',
              borderBottom: '1px dashed var(--moz-green-border)'
            }}>
              {children}
            </a>
          ),
          p: ({children, className}) => (
            <p className={className} style={{ marginBottom: '18px', color: 'var(--text-secondary)' }}>
              {children}
            </p>
          ),
          ul: ({children, className}) => (
            <ul className={className} style={{ marginBottom: '20px', paddingLeft: '22px', color: 'var(--text-secondary)' }}>
              {children}
            </ul>
          ),
          li: ({children, className}) => (
            <li className={className} style={{ marginBottom: '8px' }}>{children}</li>
          ),
          table: ({children}) => (
            <div style={{ overflowX: 'auto', marginBottom: '28px', marginTop: '16px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.92rem' }}>
                {children}
              </table>
            </div>
          ),
          th: ({children}) => (
            <th style={{ backgroundColor: 'rgba(255, 255, 255, 0.04)', color: 'var(--text-primary)', padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)', fontWeight: '700' }}>
              {children}
            </th>
          ),
          td: ({children}) => (
            <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
              {children}
            </td>
          ),
          code: ({inline, className, children}) => {
            if (inline || !className) {
              return (
                <code style={{ 
                  background: 'rgba(255, 255, 255, 0.08)', 
                  padding: '3px 7px', 
                  borderRadius: '5px',
                  color: 'var(--moz-green)',
                  fontFamily: 'Fira Code, JetBrains Mono, monospace',
                  fontSize: '0.88em',
                  border: '1px solid rgba(255, 255, 255, 0.06)'
                }}>
                  {children}
                </code>
              );
            }
            return <code className={className} style={{ fontFamily: 'Fira Code, JetBrains Mono, monospace', fontSize: '0.9rem' }}>{children}</code>;
          },
          pre: ({children, className}) => (
            <PreBlock className={className}>{children}</PreBlock>
          ),
          blockquote: ({children, className}) => (
            <blockquote className={className} style={{
              borderLeft: '4px solid var(--moz-green)',
              padding: '12px 18px',
              color: 'var(--text-secondary)',
              margin: '24px 0',
              background: 'var(--moz-green-subtle)',
              borderRadius: '0 8px 8px 0'
            }}>
              {children}
            </blockquote>
          ),
          div: ({className, children, ...props}) => {
            if (className && className.includes('code-tabs')) {
              const labels = (props['data-labels'] || '').split(',');
              const blocks = React.Children.toArray(children).filter(child => child && typeof child !== 'string' && child.props);
              return <CodeTabsWidget labels={labels}>{blocks}</CodeTabsWidget>;
            }
            return <div className={className} {...props}>{children}</div>;
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
