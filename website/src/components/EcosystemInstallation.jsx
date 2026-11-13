import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const ECOSYSTEMS = [
  {
    id: 'ts',
    name: 'TypeScript / Node',
    badge: 'npm',
    badgeColor: '#cb3837',
    install: 'npm install moz-utils',
    codeSnippet: `import { isValidNUIT, formatMozambicanPhone, isValidNIB, getBankFromNIB } from 'moz-utils';

// Validação fiscal instantânea (Módulo 11)
console.log(isValidNUIT("400000008")); // true

// Formatação padronizada de telemóveis (+258)
console.log(formatMozambicanPhone("881234567")); // "+258 88 123 4567"

// Sistema Bancário (ISO 7064 Módulo 97-10)
const bank = getBankFromNIB("000100000000000000033");
console.log(bank?.name); // "Banco Comercial e de Investimentos (Millennium BIM)"`
  },
  {
    id: 'python',
    name: 'Python',
    badge: 'PyPI',
    badgeColor: '#3776ab',
    install: 'pip install moz-utils',
    codeSnippet: `from moz_utils import is_valid_nuit, format_mozambican_phone, is_valid_nib, get_bank_by_nib

# NUIT e Pessoas Colectivas
if is_valid_nuit("400000008"):
    print("NUIT regularizado na AT Moçambique")

# Telefonia com deteção de carteira móvel (e-Mola / M-Pesa)
formatted = format_mozambican_phone("881234567")
print(formatted) # "+258 88 123 4567"

# Módulo Bancário
bank = get_bank_by_nib("000100000000000000033")
print(bank["name"]) # "Banco Comercial e de Investimentos (Millennium BIM)"`
  },
  {
    id: 'php',
    name: 'PHP',
    badge: 'Packagist',
    badgeColor: '#8892bf',
    install: 'composer require iradoweck/moz-utils',
    codeSnippet: `<?php
use Iradoweck\\MozUtils\\MozUtils;

// Suporte nativo para Laravel, Symfony e PHP puro (>=8.3 || 8.4+)
if (MozUtils::isValidNUIT('400000008')) {
    echo "NUIT Válido";
}

// Detecção e formatação de carteiras móveis
$wallet = MozUtils::getMobileWallet('881234567');
echo $wallet; // "e-Mola"

// Validação de NIB e IBAN Moçambicano (MZ59)
$isNib = MozUtils::isValidNIB('000100000000000000033');
$iban = MozUtils::nibToIBAN('000100000000000000033');
echo $iban; // "MZ59000100000000000000033"`
  },
  {
    id: 'dart',
    name: 'Dart / Flutter',
    badge: 'pub.dev',
    badgeColor: '#0175c2',
    install: 'flutter pub add moz_utils',
    codeSnippet: `import 'package:moz_utils/moz_utils.dart';

// Ideal para formulários em Flutter (iOS, Android, Web, Desktop)
void main() {
  final isValid = MozUtils.isValidMozambicanPhone('881234567');
  print('Telefone válido: ' + isValid.toString()); // true

  final operator = MozUtils.getMobileOperator('881234567');
  print('Operadora: ' + operator); // "Movitel"

  // Validação bancária nativa com BigInt modular
  final validNIB = MozUtils.isValidNIB('000100000000000000033');
  print('NIB Válido: ' + validNIB.toString());
}`
  },
  {
    id: 'kotlin',
    name: 'Kotlin / Android',
    badge: 'JitPack',
    badgeColor: '#7f52ff',
    install: 'implementation("com.github.iradoweck:moz-utils:v0.4.0")',
    codeSnippet: `import com.edmilsonmuacigarro.mozutils.MozUtils

// Compatível com Jetpack Compose, Spring Boot e Java legado
fun main() {
    val isPhoneValid = MozUtils.isValidMozambicanPhone("+258 88 123 4567")
    println(isPhoneValid) // true

    // Identificação de carteira móvel
    val wallet = MozUtils.getMobileWallet("881234567")
    println(wallet) // "e-Mola"

    // Validação de NIB e conversão para IBAN
    val iban = MozUtils.nibToIBAN("000100000000000000033")
    println(iban) // "MZ59000100000000000000033"
}`
  }
];

export default function EcosystemInstallation() {
  const [activeTab, setActiveTab] = useState('ts');
  const [copied, setCopied] = useState(false);

  const currentEco = ECOSYSTEMS.find(e => e.id === activeTab) || ECOSYSTEMS[0];

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section style={{ 
      padding: '70px 20px', 
      backgroundColor: 'var(--bg-subtle)', 
      borderTop: '1px solid var(--border-subtle)'
    }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        
        {/* Título da Seção */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '800', letterSpacing: '-0.03em' }}>
            Paridade Absoluta em 5 Ecossistemas
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '620px', margin: '8px auto 0 auto', fontSize: '1rem' }}>
            A mesma API, os mesmos contratos e as mesmas garantias de precisão algorítmica para a sua stack favorita.
          </p>
        </div>

        {/* Card Principal */}
        <div className="clean-panel" style={{ padding: '0', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
          
          {/* Tabs dos Ecossistemas */}
          <div style={{ 
            display: 'flex', 
            backgroundColor: 'var(--bg-muted)', 
            borderBottom: '1px solid var(--border-subtle)',
            overflowX: 'auto',
            padding: '6px'
          }}>
            {ECOSYSTEMS.map((eco) => (
              <button
                key={eco.id}
                onClick={() => setActiveTab(eco.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  backgroundColor: activeTab === eco.id ? 'var(--bg-main)' : 'transparent',
                  color: activeTab === eco.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                  boxShadow: activeTab === eco.id ? 'var(--shadow-sm)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{eco.name}</span>
                <span style={{ 
                  fontSize: '0.7rem', 
                  backgroundColor: eco.badgeColor, 
                  color: 'white', 
                  padding: '2px 6px', 
                  borderRadius: '4px',
                  fontWeight: '700'
                }}>
                  {eco.badge}
                </span>
              </button>
            ))}
          </div>

          {/* Área do Comando de Instalação */}
          <div style={{ 
            padding: '16px 24px', 
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#ffffff'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontFamily: 'monospace', fontSize: '0.95rem' }}>
              <span style={{ color: 'var(--moz-green)', fontWeight: 'bold' }}>$</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{currentEco.install}</span>
            </div>

            <button
              onClick={() => handleCopy(currentEco.install)}
              className="btn-secondary-clean"
              style={{ padding: '6px 12px', fontSize: '0.85rem' }}
            >
              {copied ? <Check size={16} color="var(--moz-green)" /> : <Copy size={16} />}
              <span>{copied ? 'Copiado!' : 'Copiar'}</span>
            </button>
          </div>

          {/* Snippet de Código */}
          <div style={{ padding: '24px', backgroundColor: '#0f172a' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Exemplo de Integração
              </span>
              <button
                onClick={() => handleCopy(currentEco.codeSnippet)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.8rem'
                }}
              >
                <Copy size={14} />
                <span>Copiar Código</span>
              </button>
            </div>

            <pre style={{ 
              margin: 0, 
              fontFamily: "'Fira Code', 'JetBrains Mono', Consolas, monospace", 
              fontSize: '0.88rem', 
              lineHeight: '1.6', 
              color: '#e2e8f0',
              overflowX: 'auto' 
            }}>
              <code>{currentEco.codeSnippet}</code>
            </pre>
          </div>

        </div>

      </div>
    </section>
  );
}
