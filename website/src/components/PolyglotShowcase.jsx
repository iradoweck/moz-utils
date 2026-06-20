import React, { useState } from 'react';
import { Terminal, CheckCircle2 } from 'lucide-react';

const codeSnippets = {
  TypeScript: `import { isValidNUIT } from 'moz-utils';

const isValid = isValidNUIT("100000008");
console.log(isValid ? "Valid NUIT!" : "Invalid");`,
  
  Python: `from moz_utils import is_valid_nuit

is_valid = is_valid_nuit("100000008")
print("Valid NUIT!" if is_valid else "Invalid")`,

  PHP: `<?php
require 'vendor/autoload.php';
use MozUtils\\Validator;

$isValid = Validator::isValidNUIT("100000008");
echo $isValid ? "Valid NUIT!" : "Invalid";
?>`,

  Dart: `import 'package:moz_utils/moz_utils.dart';

void main() {
  final isValid = MozUtils.isValidNUIT("100000008");
  print(isValid ? "Valid NUIT!" : "Invalid");
}`,

  Kotlin: `import mz.co.mozutils.MozUtils

fun main() {
    val isValid = MozUtils.isValidNUIT("100000008")
    println(if (isValid) "Valid NUIT!" else "Invalid")
}`
};

export default function PolyglotShowcase() {
  const [activeTab, setActiveTab] = useState('TypeScript');

  return (
    <section style={{ padding: '80px 0', position: 'relative' }}>
      <div className="container">
        
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Escreve Uma Vez, <span className="text-neon">Usa em Todo o Lado</span></h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
            A mesma API limpa e previsível desenhada nativamente para as linguagens mais amadas pela comunidade.
          </p>
        </div>

        <div style={{ maxWidth: '800px', margin: '0 auto', background: 'var(--panel-bg)', border: '1px solid var(--panel-border)', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 20px 40px var(--shadow-color)', backdropFilter: 'blur(10px)' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--panel-border)', background: 'var(--overlay-1)', overflowX: 'auto' }}>
            {Object.keys(codeSnippets).map(lang => (
              <button
                key={lang}
                onClick={() => setActiveTab(lang)}
                style={{
                  padding: '16px 24px',
                  background: activeTab === lang ? 'var(--overlay-2)' : 'transparent',
                  border: 'none',
                  borderBottom: activeTab === lang ? '2px solid var(--neon-green)' : '2px solid transparent',
                  color: activeTab === lang ? 'var(--neon-green)' : 'var(--text-secondary)',
                  fontWeight: activeTab === lang ? 'bold' : 'normal',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  flexShrink: 0
                }}
              >
                {lang}
              </button>
            ))}
          </div>

          {/* Code Window */}
          <div style={{ padding: '24px', background: 'var(--dark-bg)', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', gap: '8px' }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--error-text)' }} />
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--warning-bg)' }} />
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--success-bg)' }} />
            </div>
            
            <pre style={{ margin: 0, marginTop: '16px', fontFamily: 'monospace', fontSize: '1rem', color: 'var(--text-primary)', whiteSpace: 'pre-wrap', minHeight: '120px' }}>
              <code>
                {codeSnippets[activeTab]}
              </code>
            </pre>
          </div>

          {/* Footer of snippet */}
          <div style={{ padding: '16px 24px', background: 'var(--overlay-1)', borderTop: '1px solid var(--panel-border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <CheckCircle2 size={20} color="var(--neon-green)" />
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>100% Cobertura de Testes Unitários em todas as Stacks</span>
          </div>
        </div>

      </div>
    </section>
  );
}
