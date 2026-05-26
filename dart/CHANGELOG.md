# Changelog

## 0.2.0

- Adicionado suporte a códigos postais legados de Moçambique (sistema clássico dos Correios de Moçambique).
- Implementação das funções utilitárias `isValidPostalCode`, `getPostalCodeLocality` e `getPostalCodeProvince`.
- Adicionado diretório de exemplos (`example/example.dart`) e documentação completa de toda a API pública.
- Correção de pendências de documentação (dartdoc comments) exigidas pelo pub.dev.

## 0.1.3

- Internacionalização: tradução da documentação, metadados e workflows para Inglês.
- Adição da secção Quick Installation ao README raiz.
- Adição de workflow customizado do CodeQL com compilação explícita do Kotlin.

## 0.1.2

- Atualização sincronizada da versão dos pacotes em todos os ecossistemas para 0.1.2.
- Remoção do escopo `@iradoweck/` do pacote NPM para simplificar o uso como `moz-utils`.

## 0.1.1

- Adição do `composer.json` na raiz para suporte ao Packagist.
- Definição de permissões mínimas de leitura nos workflows do GitHub Actions.
- Preparação dos metadados de publicação nos registos oficiais (NPM, PyPI, Packagist, Pub.dev, JitPack).
- Atualização da política de segurança (SECURITY.md).
- Correção de compatibilidade do Gradle com Kotlin na CI (Gradle 8.7).
- Adição de testes unitários nativos para Python, PHP, Dart e Kotlin.
- Atualização da CI do GitHub Actions.

## 0.1.0

- Lançamento inicial do pacote `moz_utils` em Dart.
- Implementação de validações de NUIT (Módulo 11) e BI moçambicano.
- Validação e identificação de operadoras móveis (Vodacom, Tmcel, Movitel).
- Formatação de números de telemóvel no padrão internacional (+258).
- Geração de links de conversa para WhatsApp com mensagens personalizadas.
- Formatação monetária oficial em Meticais (MZN).
- Integração da base de dados geográfica administrativa de Moçambique (Províncias, Distritos, Postos e Bairros).
