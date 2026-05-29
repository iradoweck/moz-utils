import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/atom-one-dark.css'; // Good dark theme for code blocks

// Extensão personalizada do renderer
export default function MarkdownRenderer({ content }) {
  // Track occurrence counts to make duplicate heading IDs unique within this render
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
      lineHeight: '1.7', 
      fontSize: '1.05rem',
      maxWidth: '850px'
    }}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
        components={{
          h1: ({node, children, id, className}) => <h1 id={id} className={className} style={{ color: 'var(--neon-green)', borderBottom: '1px solid var(--panel-border)', paddingBottom: '12px', marginTop: '40px', marginBottom: '24px' }}>{children}</h1>,
          h2: ({node, children, className}) => {
            const rawId = node.children[0]?.value?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
            const id = makeUniqueId(rawId);
            return <h2 id={id} className={className} style={{ color: '#fff', marginTop: '40px', marginBottom: '16px' }}>{children}</h2>;
          },
          h3: ({node, children, className}) => {
            const rawId = node.children[0]?.value?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
            const id = makeUniqueId(rawId);
            return <h3 id={id} className={className} style={{ color: '#e2e8f0', marginTop: '32px', marginBottom: '16px' }}>{children}</h3>;
          },
          a: ({node, children, href, className, target, rel}) => <a href={href} target={target} rel={rel} className={className} style={{ color: 'var(--neon-green)', textDecoration: 'none' }}>{children}</a>,
          p: ({node, children, className}) => <p className={className} style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>{children}</p>,
          ul: ({node, children, className}) => <ul className={className} style={{ marginBottom: '16px', paddingLeft: '24px', color: 'var(--text-secondary)' }}>{children}</ul>,
          li: ({node, children, className}) => <li className={className} style={{ marginBottom: '8px' }}>{children}</li>,
          code: ({node, inline, className, children}) => {
            // For inline code (not wrapped in pre), or code that has no specific block properties
            if (inline || !className) {
              return <code style={{ 
                background: 'rgba(255,255,255,0.1)', 
                padding: '2px 6px', 
                borderRadius: '4px',
                color: '#f472b6',
                fontFamily: 'monospace',
                fontSize: '0.9em'
              }}>{children}</code>
            }
            // Block code is handled inside <pre>
            return <code className={className} style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>{children}</code>
          },
          pre: ({node, children, className}) => (
            <div className={className} style={{ position: 'relative', marginBottom: '24px', marginTop: '16px' }}>
              <pre style={{
                background: '#111',
                padding: '16px',
                borderRadius: '8px',
                overflowX: 'auto',
                border: '1px solid var(--panel-border)'
              }}>{children}</pre>
            </div>
          ),
          blockquote: ({node, children, className}) => (
            <blockquote className={className} style={{
              borderLeft: '4px solid var(--neon-green)',
              paddingLeft: '16px',
              color: 'var(--text-secondary)',
              fontStyle: 'italic',
              margin: '24px 0',
              background: 'rgba(0,255,136,0.05)'
            }}>{children}</blockquote>
          )
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
