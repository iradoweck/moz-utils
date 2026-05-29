import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/atom-one-dark.css'; // Good dark theme for code blocks

// Extensão personalizada do renderer
export default function MarkdownRenderer({ content }) {
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
          h1: ({node, ...props}) => <h1 style={{ color: 'var(--neon-green)', borderBottom: '1px solid var(--panel-border)', paddingBottom: '12px', marginTop: '40px', marginBottom: '24px' }} {...props} />,
          h2: ({node, ...props}) => {
            // Generate id from text for anchor links
            const id = node.children[0]?.value?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
            return <h2 id={id} style={{ color: '#fff', marginTop: '40px', marginBottom: '16px' }} {...props} />
          },
          h3: ({node, ...props}) => {
            const id = node.children[0]?.value?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
            return <h3 id={id} style={{ color: '#e2e8f0', marginTop: '32px', marginBottom: '16px' }} {...props} />
          },
          a: ({node, ...props}) => <a style={{ color: 'var(--neon-green)', textDecoration: 'none' }} {...props} />,
          p: ({node, ...props}) => <p style={{ marginBottom: '16px', color: 'var(--text-secondary)' }} {...props} />,
          ul: ({node, ...props}) => <ul style={{ marginBottom: '16px', paddingLeft: '24px', color: 'var(--text-secondary)' }} {...props} />,
          li: ({node, ...props}) => <li style={{ marginBottom: '8px' }} {...props} />,
          code: ({node, inline, className, children, ...props}) => {
            // For inline code (not wrapped in pre), or code that has no specific block properties
            if (inline || !className) {
              return <code style={{ 
                background: 'rgba(255,255,255,0.1)', 
                padding: '2px 6px', 
                borderRadius: '4px',
                color: '#f472b6',
                fontFamily: 'monospace',
                fontSize: '0.9em'
              }} {...props}>{children}</code>
            }
            // Block code is handled inside <pre>
            return <code className={className} style={{ fontFamily: 'monospace', fontSize: '0.9rem' }} {...props}>{children}</code>
          },
          pre: ({node, ...props}) => (
            <div style={{ position: 'relative', marginBottom: '24px', marginTop: '16px' }}>
              <pre style={{
                background: '#111',
                padding: '16px',
                borderRadius: '8px',
                overflowX: 'auto',
                border: '1px solid var(--panel-border)'
              }} {...props} />
            </div>
          ),
          blockquote: ({node, ...props}) => (
            <blockquote style={{
              borderLeft: '4px solid var(--neon-green)',
              paddingLeft: '16px',
              color: 'var(--text-secondary)',
              fontStyle: 'italic',
              margin: '24px 0',
              background: 'rgba(0,255,136,0.05)',
              padding: '16px'
            }} {...props} />
          )
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
