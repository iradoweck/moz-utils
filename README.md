<h1 align="center">Moz-Utils 🇲🇿</h1>

<p align="center">
  <b>A Biblioteca Definitiva de Utilitários de Software para Moçambique</b>
</p>

<p align="center">
  <a href="https://github.com/iradoweck/moz-utils/actions/workflows/ci.yml">
    <img src="https://github.com/iradoweck/moz-utils/actions/workflows/ci.yml/badge.svg" alt="CI Status" />
  </a>
  <a href="https://www.npmjs.com/package/moz-utils">
    <img src="https://img.shields.io/npm/v/moz-utils?label=npm&color=00ff88&logo=npm" alt="npm version" />
  </a>
  <a href="https://pypi.org/project/moz-utils/">
    <img src="https://img.shields.io/pypi/v/moz-utils?label=PyPI&color=3776ab&logo=pypi&logoColor=white" alt="PyPI version" />
  </a>
  <a href="https://packagist.org/packages/iradoweck/moz-utils">
    <img src="https://img.shields.io/packagist/v/iradoweck/moz-utils?label=Packagist&color=F28D1A&logo=packagist&logoColor=white" alt="Packagist version" />
  </a>
  <a href="https://pub.dev/packages/moz_utils">
    <img src="https://img.shields.io/pub/v/moz_utils?label=pub.dev&color=0175C2&logo=dart&logoColor=white" alt="pub.dev version" />
  </a>
  <a href="https://jitpack.io/#iradoweck/moz-utils">
    <img src="https://img.shields.io/badge/JitPack-0.4.0-B07219?logo=gradle&logoColor=white" alt="JitPack version" />
  </a>
  <a href="https://www.apache.org/licenses/LICENSE-2.0">
    <img src="https://img.shields.io/badge/License-Apache%202.0-blue.svg" alt="License: Apache 2.0" />
  </a>
  <a href="https://ko-fi.com/edmilsonmuacigarro" target="_blank">
    <img src="https://img.shields.io/badge/Ko--fi-Apoiar-FF5E5B?style=flat-square&logo=kofi&logoColor=white" alt="Apoiar no Ko-fi" />
  </a>
</p>

<p align="center">
  <i>O canivete suíço essencial para desenvolvedores e empresas de software em Moçambique.</i>
</p>

<p align="justify">
  O <b>moz-utils</b> é uma suíte completa e padronizada de funções utilitárias e regras de negócio essenciais concebidas especificamente para o ecossistema tecnológico moçambicano. Resolve validações críticas e frequentes como <b>NUIT</b> (Módulo 11 da Autoridade Tributária), <b>Bilhete de Identidade (B.I.)</b>, <b>DIRE</b>, <b>Passaportes</b>, <b>Cartas de Condução</b>, <b>telecomunicações móveis (+258)</b> com identificação de operadoras (Vodacom, Tmcel, Movitel) e carteiras móveis (M-Pesa, e-Mola, mKesh), <b>valores monetários em Meticais (MZN/MT)</b>, <b>divisão territorial oficial</b> (11 províncias e 161 distritos), a base oficial dos <b>555 Novos Códigos de Endereçamento Postal (CEPs)</b> e, na versão v0.4.0, o <b>Módulo Bancário Moçambicano completo (NIB e IBAN)</b>.
</p>

<p align="justify">
  O projeto é <b>zero-dependency</b>, <b>offline-first</b> e mantido ativamente com <b>100% de paridade</b> entre as cinco linguagens de programação mais utilizadas no desenvolvimento de software em África: <b>TypeScript / JavaScript</b>, <b>Python</b>, <b>PHP</b>, <b>Dart / Flutter</b> e <b>Kotlin / Android</b>.
</p>

---

## 🏛️ Especificações Nacionais de Moçambique

| Parâmetro | Detalhes Oficiais |
| :--- | :--- |
| **País** | República de Moçambique |
| **Código Telefónico Internacional (DDI)** | `+258` |
| **Língua Oficial** | Português (`pt-MZ`) |
| **Moeda Oficial** | Metical (`MZN` / `MT`) |
| **Regulador de Telecomunicações** | Instituto Nacional das Comunicações de Moçambique (INCM) |
| **Regulador Fiscal** | Autoridade Tributária de Moçambique (AT) |
| **Regulador do Sistema Financeiro** | Banco de Moçambique (BM / SIMO) |
| **Autoridade de Trânsito** | Instituto Nacional dos Transportes Terrestres (INATRO) |
| **Autoridade Migratória** | Serviço Nacional de Migração (SENAMI) |

---

## 🏦 Novidade em Destaque na v0.4.0: Módulo Bancário Moçambicano (NIB & IBAN)

A versão **v0.4.0** introduz o módulo financeiro e bancário homologado para transações em Moçambique:
- 💳 **Validação de NIB (21 dígitos):** Cálculo algorítmico do dígito de controlo pelo padrão internacional **ISO 7064 Módulo 97-10** (`BigInt(nib) % 97n === 1n`).
- 🏢 **Catálogo Oficial dos 18 Bancos Comerciais:** Identificação automática da instituição financeira através do código de compensação bancária (Millennium BIM `0001`, Standard Bank `0003`, Absa `0006`, Nedbank `0007`, BCI `0008`, FNB `0014`, Moza Banco `0016`/`0034`, Access Bank `0021`, Ecobank `0024`, BNI `0025`/`0057`, Société Générale `0030`, First Capital Bank `0038`/`0043`, Letshego `0041`/`0056`, MyBucks `0044`, BDM `0045`, Banco Mais `0048`, Standard Chartered `0050`, Banco Big `0052`).
- 🌍 **Padrão Internacional IBAN Moçambicano:** Conversão automática e validação de IBAN moçambicano (`MZ59` + 21 dígitos do NIB) em conformidade com a norma **ISO 13616**.
- 📋 **Formatação Padronizada:** Formatação em 4 blocos (`0001 0000 12345678901 94` ou com separador por ponto para extratos).

---

## ⚖️ Matriz de Paridade de Recursos entre Ecossistemas (v0.4.0)

Todos os recursos foram implementados e auditados para garantir paridade absoluta de contratos entre os 5 ecossistemas:

| Recurso / Funcionalidade | TypeScript | Python | PHP | Dart / Flutter | Kotlin / Android |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Validação Telefónica (+258)** | 🟢 `isValidMozambicanPhone` | 🟢 `is_valid_mozambican_phone` | 🟢 `isValidMozambicanPhone` | 🟢 `isValidMozambicanPhone` | 🟢 `isValidMozambicanPhone` |
| **Formatação Telefónica Avançada** | 🟢 `formatMozambicanPhone` | 🟢 `format_mozambican_phone` | 🟢 `formatMozambicanPhone` | 🟢 `formatMozambicanPhone` | 🟢 `formatMozambicanPhone` |
| **Operadora (Vodacom, Tmcel, Movitel)** | 🟢 `getMobileOperator` | 🟢 `get_mobile_operator` | 🟢 `getMobileOperator` | 🟢 `getMobileOperator` | 🟢 `getMobileOperator` |
| **Carteiras Móveis (M-Pesa, e-Mola, mKesh)**| 🟢 `getMobileWallet` | 🟢 `get_mobile_wallet` | 🟢 `getMobileWallet` | 🟢 `getMobileWallet` | 🟢 `getMobileWallet` |
| **Links WhatsApp com Mensagem** | 🟢 `buildWhatsAppUrl` | 🟢 `build_whatsapp_url` | 🟢 `buildWhatsAppUrl` | 🟢 `buildWhatsAppUrl` | 🟢 `buildWhatsAppUrl` |
| **Validação NUIT (Módulo 11 da AT)** | 🟢 `isValidNUIT` | 🟢 `is_valid_nuit` | 🟢 `isValidNUIT` | 🟢 `isValidNUIT` | 🟢 `isValidNUIT` |
| **Formatação de NUIT (3 blocos)** | 🟢 `formatNUIT` | 🟢 `format_nuit` | 🟢 `formatNUIT` | 🟢 `formatNUIT` | 🟢 `formatNUIT` |
| **Classificação de Entidades NUIT (1-9)** | 🟢 `getNUITEntityType` | 🟢 `get_nuit_entity_type` | 🟢 `getNUITEntityType` | 🟢 `getNUITEntityType` | 🟢 `getNUITEntityType` |
| **Bilhete de Identidade (B.I.)** | 🟢 `isValidBI` | 🟢 `is_valid_bi` | 🟢 `isValidBI` | 🟢 `isValidBI` | 🟢 `isValidBI` |
| **DIRE (SENAMI)** | 🟢 `isValidDIRE` | 🟢 `is_valid_dire` | 🟢 `isValidDIRE` | 🟢 `isValidDIRE` | 🟢 `isValidDIRE` |
| **Passaporte Nacional** | 🟢 `isValidPassport` | 🟢 `is_valid_passport` | 🟢 `isValidPassport` | 🟢 `isValidPassport` | 🟢 `isValidPassport` |
| **Carta de Condução (INATRO)** | 🟢 `isValidDrivingLicense` | 🟢 `is_valid_driving_license`| 🟢 `isValidDrivingLicense` | 🟢 `isValidDrivingLicense` | 🟢 `isValidDrivingLicense` |
| **Validação de NIB (Módulo 97 ISO 7064)** | 🟢 `isValidNIB` | 🟢 `is_valid_nib` | 🟢 `isValidNIB` | 🟢 `isValidNIB` | 🟢 `isValidNIB` |
| **Formatação de NIB** | 🟢 `formatNIB` | 🟢 `format_nib` | 🟢 `formatNIB` | 🟢 `formatNIB` | 🟢 `formatNIB` |
| **Catálogo dos 18 Bancos Comerciais** | 🟢 `getBankFromNIB` | 🟢 `get_bank_from_nib` | 🟢 `getBankFromNIB` | 🟢 `getBankFromNIB` | 🟢 `getBankFromNIB` |
| **Conversão para IBAN Moçambicano** | 🟢 `nibToIBAN` | 🟢 `nib_to_iban` | 🟢 `nibToIBAN` | 🟢 `nibToIBAN` | 🟢 `nibToIBAN` |
| **Validação de IBAN (MZ59...)** | 🟢 `isValidIBAN` | 🟢 `is_valid_iban` | 🟢 `isValidIBAN` | 🟢 `isValidIBAN` | 🟢 `isValidIBAN` |
| **Formatação de Meticais (MZN/MT)** | 🟢 `formatMZN` | 🟢 `format_mzn` | 🟢 `formatMZN` | 🟢 `formatMZN` | 🟢 `formatMZN` |
| **Conversão de Texto Monetário (Parse)** | 🟢 `parseMZN` | 🟢 `parse_mzn` | 🟢 `parseMZN` | 🟢 `parseMZN` | 🟢 `parseMZN` |
| **11 Províncias e 161 Distritos** | 🟢 `getDistrictsByProvince` | 🟢 `get_districts_by_province`| 🟢 `getDistrictsByProvince`| 🟢 `getDistrictsByProvince`| 🟢 `getDistrictsByProvince`|
| **Busca Territorial Flexível** | 🟢 (ID / Sigla / Nome) | 🟢 (ID / Sigla / Nome) | 🟢 (ID / Sigla / Nome) | 🟢 (ID / Sigla / Nome) | 🟢 (ID / Sigla / Nome) |
| **Códigos Postais Legados (4 dígitos)**| 🟢 `isValidPostalCode` | 🟢 `is_valid_postal_code` | 🟢 `isValidPostalCode` | 🟢 `isValidPostalCode` | 🟢 `isValidPostalCode` |
| **Base Oficial dos 555 Novos CEPs** | 🟢 `suggestCEPs` | 🟢 `suggest_ceps` | 🟢 `suggestCEPs` | 🟢 `suggestCEPs` | 🟢 `suggestCEPs` |
| **Saneamento Title Case com Partículas**| 🟢 `sanitizeName` | 🟢 `sanitize_name` | 🟢 `sanitizeName` | 🟢 `sanitizeName` | 🟢 `sanitizeName` |
| **Validação de Nomes Próprios** | 🟢 `isValidName` | 🟢 `is_valid_name` | 🟢 `isValidName` | 🟢 `isValidName` | 🟢 `isValidName` |

---

## 📦 Instalação Rápida por Ecossistema

Escolha o seu ecossistema e instale em segundos:

### 1. TypeScript & JavaScript (Node.js, Browser, Edge)
```bash
# Via npm
npm install moz-utils

# Via pnpm
pnpm add moz-utils

# Via yarn
yarn add moz-utils
```
*Documentação detalhada:* [**ts/README.md**](./ts/README.md)

### 2. Python (Django, FastAPI, Flask, Data Science)
```bash
pip install moz-utils
```
*Documentação detalhada:* [**python/README.md**](./python/README.md)

### 3. PHP (Laravel, Symfony, WordPress)
```bash
composer require iradoweck/moz-utils
```
*Documentação detalhada:* [**php/README.md**](./php/README.md)

### 4. Dart & Flutter (Aplicações Mobile e Multiplataforma)
```bash
# Adicionar ao projeto Flutter
flutter pub add moz_utils

# Ou projeto Dart puro
dart pub add moz_utils
```
*Documentação detalhada:* [**dart/README.md**](./dart/README.md)

### 5. Kotlin & Android (Android Nativo, JVM, Spring Boot)
Adicione ao seu repositório Gradle via JitPack:
```kotlin
// build.gradle.kts
repositories {
    mavenCentral()
    maven { url = uri("https://jitpack.io") }
}

dependencies {
    implementation("com.github.iradoweck:moz-utils:v0.4.0")
}
```
*Documentação detalhada:* [**kotlin/README.md**](./kotlin/README.md)

---

## 🧮 O Algoritmo NUIT (A Verdadeira Fórmula da Autoridade Tributária)

Diferente do NIF português (que utiliza multiplicadores decrescentes de 9 a 2), a Autoridade Tributária de Moçambique utiliza uma matriz de pesos fixa `[8, 9, 4, 5, 6, 7, 8, 9]` e tabela de controlo `"01234567891"`.

```text
Exemplo Prático: NUIT 401626638

Posição:   1   2   3   4   5   6   7   8
Dígitos:   4   0   1   6   2   6   6   3
Pesos:     8   9   4   5   6   7   8   9
           |   |   |   |   |   |   |   |
Mult:     32 + 0 + 4 +30 +12 +42 +48 +27 = 195 (Soma Ponderada)

Cálculo do Módulo 11:
1. Resto = Soma % 11 => 195 % 11 = 8
2. Tabela de Mapeamento: "01234567891"
3. O caractere no índice 8 da tabela é '8'.
4. Como o 9º dígito (Dígito de Controlo) é '8', o NUIT é AUTÊNTICO e VÁLIDO!
```

---

## 💻 Amostra de Uso em TypeScript (v0.4.0)

Abaixo está uma demonstração rápida de uso da biblioteca com as novidades da versão `0.4.0`:

```typescript
import { 
  // Identificação e Fiscal
  isValidNUIT, 
  getNUITEntityType,
  isValidBI,

  // Sistema Bancário (NIB & IBAN)
  isValidNIB,
  formatNIB,
  getBankFromNIB,
  nibToIBAN,

  // Telecomunicações
  isValidMozambicanPhone,
  formatMozambicanPhone,
  getMobileOperator,
  getMobileWallet,

  // Divisão Territorial e CEP
  getDistrictsByProvince,
  suggestCEPs,

  // Saneamento e Moeda
  sanitizeName,
  formatMZN,
  parseMZN
} from 'moz-utils';

// 1. Identificação Fiscal e Civil
console.log(isValidNUIT('401626638')); // true
console.log(getNUITEntityType('401626638')); // "Pessoas Colectivas"
console.log(isValidBI('110101234567A')); // true

// 2. Módulo Bancário Moçambicano
const nib = '000100001234567890194';
console.log(isValidNIB(nib)); // true (Módulo 97 ISO 7064)
console.log(formatNIB(nib)); // "0001 0000 12345678901 94"
console.log(getBankFromNIB(nib)?.shortName); // "Millennium BIM"
console.log(nibToIBAN(nib)); // "MZ59000100001234567890194"

// 3. Telecomunicações e Mobile Money
const phone = '841234567';
console.log(isValidMozambicanPhone(phone)); // true
console.log(getMobileOperator(phone)); // "Vodacom"
console.log(getMobileWallet(phone)); // "M-Pesa"
console.log(formatMozambicanPhone(phone, { format: 'e164' })); // "+258841234567"

// 4. Divisão Territorial Flexível (aceita nome, sigla ou ID)
console.log(getDistrictsByProvince('Maputo')); 
// ["Boane", "Magude", "Manhiça", "Marracuene", "Matutuíne", "Moamba", "Namaacha"]

// 5. Novo CEP de Namutequeliua (Nampula)
const cepResults = suggestCEPs('namutequeliua');
console.log(cepResults[0].cep); // "0909-09"

// 6. Saneamento e Valores Monetários
console.log(sanitizeName('EDMILSON DE JESUS MUACIGARRO')); 
// "Edmilson de Jesus Muacigarro"

const amount = parseMZN('25.500,00 MT'); // 25500
console.log(formatMZN(amount)); // "25 500,00 MT"
```

---

## 🔄 Ciclo de Lançamentos e Suporte (Enterprise Life Cycle)

O ecossistema **moz-utils** adota um ciclo de suporte previsível e seguro para sistemas de missão crítica:

| Linha de Versão | Status Oficial | Data de Lançamento | Política de Manutenção |
| :--- | :--- | :--- | :--- |
| **`0.4.x`** | 🟢 **Estável / Ativa** | 01 de Novembro de 2026 | Suporte ativo contínuo e paridade total |
| **`0.3.x`** | 🟡 **Manutenção** | 27 de Maio de 2026 | Correções de segurança críticas apenas |
| **`0.2.x`** | 🔴 **Fim de Vida (EOL)** | 26 de Maio de 2026 | Descontinuada; atualize para 0.4.x |
| **`0.1.x`** | 🔴 **Fim de Vida (EOL)** | 20 de Maio de 2026 | Descontinuada; atualize para 0.4.x |

---

## 🚀 Emulador Interativo em Linha de Comando (CLI)

Para testar o comportamento da biblioteca sem necessidade de escrever código, incluímos um emulador interativo na raiz do repositório:

```bash
npx tsx emulator.ts
```

Permite digitar números de telefone, NUITs, BIs, NIBs e CEPs, validando os resultados em tempo real!

---

## 🤝 Contribuição e Governança

O `moz-utils` é um projeto de código aberto mantido pela comunidade técnica moçambicana. Contribuições são bem-vindas, especialmente para:
- Portar a suíte para novas linguagens (ex.: **Go**, **Rust**, **C# / .NET**).
- Atualizar limites territoriais e novos postos administrativos homologados pelo Governo.
- Otimizar regras de validação cadastral.

Consulte o nosso [**Guia de Contribuição**](./CONTRIBUTING.md) para conhecer as diretrizes de código, nomenclatura e regras de testes unitários.

---

## 💬 Comunidade Oficial e Fórum

Junte-se à nossa comunidade para tirar dúvidas de integração, sugerir novas funcionalidades ou relatar casos de uso:

👉 **[Portal da Comunidade moz-utils](https://iradoweck.github.io/moz-utils/#/community)**

---

## 👥 Autoria e Mantenedores

Este projeto foi idealizado e é mantido por:

<p align="center">
  <a href="https://github.com/iradoweck" title="Edmilson Muacigarro (@iradoweck)">
    <img src="https://github.com/iradoweck.png" width="70" height="70" style="border-radius: 50%;" alt="iradoweck" />
  </a>
  &nbsp;&nbsp;&nbsp;&nbsp;
  <a href="https://github.com/zedecks" title="Zedecks IT (@zedecks)">
    <img src="https://github.com/zedecks.png" width="70" height="70" style="border-radius: 50%;" alt="zedecks" />
  </a>
</p>

- **Edmilson Muacigarro** ([@iradoweck](https://github.com/iradoweck)) — Criador e Arquiteto Líder
- **Zedecks IT** ([@zedecks](https://github.com/zedecks)) — Core Contributor

---

## 📄 Licença

Distribuído sob a licença **Apache License 2.0**. Consulte o arquivo [LICENSE](./LICENSE) para mais detalhes.

---

## 💖 Apoiar o Projeto

Se o `moz-utils` poupou horas de desenvolvimento à sua equipa ou à sua empresa em Moçambique, considere apoiar o desenvolvimento contínuo!

<p align="center">
  <a href="https://ko-fi.com/edmilsonmuacigarro" target="_blank">
    <img src="https://storage.ko-fi.com/cdn/kofi3.png?v=3" height="42" style="border:0px;height:42px;" alt="Apoiar no Ko-fi" />
  </a>
</p>
