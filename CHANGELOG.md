# Changelog — moz-utils

Histórico de alterações de todas as versões do projecto **moz-utils** (TypeScript, Dart, Python, PHP e Kotlin).

---

## 0.2.0

> **Versão minor — Nova funcionalidade: Códigos Postais Legados**

### Novas funcionalidades
- Adicionado suporte ao sistema clássico (legado) de códigos postais de Moçambique, historicamente gerido pelos **Correios de Moçambique** — base de dados com 100 códigos de 4 dígitos organizados por Província e Localidade.
- Funções de validação e consulta implementadas em todas as 5 linguagens:
  - `isValidPostalCode` / `is_valid_postal_code` — verifica se o código pertence à tabela oficial.
  - `getPostalCodeLocality` / `get_postal_code_locality` — retorna a localidade do código.
  - `getPostalCodeProvince` / `get_postal_code_province` — retorna a província do código.

### Documentação e exemplos
- Todos os ficheiros `README.md` (raiz, ts, dart, python, php, kotlin) atualizados com exemplos de utilização de códigos postais.
- Criado ficheiro oficial de exemplo em Dart (`dart/example/example.dart`) exigido pelo pub.dev.
- Documentação dartdoc adicionada à classe `MozUtils` e construtor público ocultado.
- Referências de instalação atualizadas para `0.2.0` em toda a documentação.

### Segurança
- Auditoria completa de segurança — zero vulnerabilidades em todas as stacks.
- Pacotes PHP, Python e Kotlin confirmados sem dependências externas de runtime.

---

## 0.1.3

> **Versão patch — Internacionalização e Segurança**

### Alterações
- Internacionalização: tradução da documentação, metadados e workflows para Inglês.
- Adição da secção Quick Installation ao `README.md` raiz para facilitar a adopção rápida.
- Adição de workflow customizado do CodeQL com compilação explícita do Kotlin para análise de segurança do código.

---

## 0.1.2

> **Versão patch — Build e Simplificação**

### Alterações
- Atualização sincronizada da versão dos pacotes em todos os ecossistemas (TS, Dart, Python, PHP, Kotlin) para 0.1.2.
- Remoção do escopo `@iradoweck/` do pacote NPM para simplificar o uso como `moz-utils`.

---

## 0.1.1

> **Versão patch — Publicação e CI**

### Alterações
- Adição do `composer.json` na raiz para suporte ao Packagist.
- Definição de permissões mínimas de leitura nos workflows do GitHub Actions (segurança).
- Preparação dos metadados de publicação nos registos oficiais: NPM, PyPI, Packagist, Pub.dev, e JitPack.
- Atualização da política de segurança (`SECURITY.md`) em Português.
- Correção de compatibilidade do Gradle com Kotlin na CI (Gradle 8.7).
- Adição de testes unitários nativos para Python, PHP, Dart e Kotlin.
- Atualização da configuração da CI do GitHub Actions.

---

## 0.1.0

> **Lançamento inicial**

### Funcionalidades
- Validação de NUIT (Número Único de Identificação Tributária) seguindo o algoritmo Módulo 11 da Autoridade Tributária.
- Classificação de entidades com base no primeiro dígito do NUIT (Singular, Equiparada, Colectiva, Público).
- Validação do BI (Bilhete de Identidade) moçambicano — 12 dígitos + 1 letra.
- Validação e identificação de operadoras móveis (Vodacom, Tmcel, Movitel).
- Formatação de números de telemóvel no padrão internacional (+258 XX XXX XXXX).
- Geração de links de conversa para WhatsApp com mensagens pré-preenchidas.
- Formatação monetária oficial em Meticais (MZN) — separador de milhares por espaço, separador decimal por vírgula.
- Base de dados geográfica completa e offline (Províncias, Distritos, Postos Administrativos e Bairros).

### Ecossistemas suportados
- TypeScript / JavaScript (NPM)
- Dart / Flutter (Pub.dev)
- Python (PyPI)
- PHP (Packagist / Composer)
- Kotlin / Java (JitPack / Gradle)
