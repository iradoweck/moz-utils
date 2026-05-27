<h1 align="center">Moz-Utils</h1>

<p align="center">
  <b>Moz Utils Patch Dev</b> 🇲🇿
</p>

<p align="center">
  <a href="https://www.gnu.org/licenses/agpl-3.0">
    <img src="https://img.shields.io/badge/License-AGPL%20v3-blue.svg" alt="License: AGPL v3" />
  </a>
  <a href="http://makeapullrequest.com">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square" alt="PRs Welcome" />
  </a>
  <a href="#">
    <img src="https://img.shields.io/badge/Made%20in-Mozambique-red?labelColor=black&color=009639" alt="Mozambique" />
  </a>
</p>

<p align="center">
  <i>The Definitive Swiss Army Knife for Software Developers in Mozambique.</i>
</p>

<p align="justify">
  <code>moz-utils</code> is a collection of essential utility functions tailored for the Mozambican software development ecosystem. It standardizes critical validations such as <b>NUIT</b> (Unique Tax Identification Number), <b>BI</b>, <b>DIRE</b>, <b>Passaportes</b>, <b>Cartas de Condução</b>, <b>mobile phone numbers</b> (Vodacom, Tmcel, Movitel / M-Pesa, e-Mola, mKesh), <b>Metical currency formatting</b> (MZN), and <b>national geographical data</b> (including the Novo Código de Endereçamento Postal - CEP).
</p>

<p align="justify">
  The project is actively maintained and ported to the most popular programming languages used across Africa.
</p>

### ℹ️ Mozambique Specifications

| Parameter | Details |
| :--- | :--- |
| **Country** | Mozambique |
| **Calling Code (DDI)** | `+258` |
| **Official Language** | Portuguese (pt-MZ) |
| **Official Currency** | Metical (`MZN` / `MT`) |

---

## 🗺️ Workflows and Architecture

### 1. NUIT Validation (Modulo 11)

<p align="justify">
  The validation strictly follows the rules defined by the Tax Authority of Mozambique, validating the 9 digits and resolving the Módulo 11 checksum for the 9th digit. It also detects the Entity Type (Singular, Coletiva, etc.).
</p>

### 2. Validação de Documentos Oficiais

Oferece validação precisa através de RegEx (incluindo limpeza e sanitização de formatações, espaços e minúsculas) para:
- **BI**: 12 dígitos e 1 letra.
- **DIRE**: Exatamente 8 dígitos e 1 letra.
- **Passaporte**: 2 letras seguidas de 7 dígitos.
- **Carta de Condução**: 1 letra seguida de 5 a 7 dígitos.

### 3. Telefonia e Carteiras Móveis

Identificação e validação de números moçambicanos de 9 dígitos (começados por 82, 83, 84, 85, 86, 87, 88). Identifica de forma robusta se o número suporta **M-Pesa** (Vodacom), **e-Mola** (Movitel) ou **mKesh** (Tmcel).

### 4. Códigos Postais (Legado vs Novo CEP)

O ecossistema implementa o **Novo Sistema de CEP de Moçambique** (6 dígitos `XXXX-XX`).
Mais do que apenas uma lista, construímos uma lógica inteligente de sugestão:
- Se um utilizador inserir o código postal antigo (ex: `3100`), a biblioteca traduz automaticamente e sugere um *array* de Novos CEPs correspondentes (ex: `0909-01`, `0909-02`), permitindo construir menus *dropdown* perfeitos no Frontend para o utilizador final escolher o bairro exato.

Podes consultar a lista completa em: [Documentação de Códigos Postais](./docs/postal_codes_mocambique.md).

---

## 🚀 Emulador Interativo (CLI)

Para testar como esta biblioteca se comporta "em produção" sem precisares de escrever código, incluímos um **Emulador de CLI**.

Basta executares na raiz do teu projeto:
```bash
npx tsx emulator.ts
```
Isto lançará um menu interativo onde podes digitar os teus NUITs, telefones, BIs ou CEPs e verificar a resposta da biblioteca em tempo real!

---

## 🌍 Ecosystems and Usage Examples

| Ecosystem | Folder | Package Manager | Primary Use Case |
| :--- | :--- | :--- | :--- |
| **[TypeScript / JS](./ts)** | `/ts` | NPM / PNPM / Yarn | React Web, Next.js, Node.js, Express |
| **[Python](./python)** | `/python` | Pip / Poetry | Django, FastAPI, Data Science |
| **[PHP](./php)** | `/php` | Composer | Laravel, Symfony, WordPress |
| **[Dart](./dart)** | `/dart` | Pub | Flutter (Mobile Applications) |
| **[Kotlin / Java](./kotlin)**| `/kotlin` | Gradle / Maven | Native Android, Spring Boot |

---

## 📦 Quick Installation

<p align="justify">
  Get started immediately by installing the package for your preferred ecosystem:
</p>

=== "TypeScript"
    ```bash
    npm install moz-utils
    ```

=== "Python"
    ```bash
    pip install moz-utils
    ```

=== "PHP"
    ```bash
    composer require iradoweck/moz-utils
    ```

=== "Dart"
    ```yaml
    # Add to your pubspec.yaml
    dependencies:
      moz_utils: ^0.2.0
    ```

=== "Kotlin"
    ```kotlin
    // Add to your build.gradle.kts (JitPack)
    repositories {
        maven { url = uri("https://jitpack.io") }
    }
    dependencies {
        implementation("com.github.iradoweck:moz-utils:v0.2.0")
    }
    ```

---

## 💻 Syntax Comparison

<p align="justify">
  Below is an example showing how homogeneous the API design is across all supported languages (TypeScript example with new features):
</p>

=== "TypeScript"
    ```typescript
    import { 
      isValidNUIT, isValidDIRE, isValidMozambicanPhone,
      suggestCEPs, formatMZN 
    } from 'moz-utils';
    
    console.log(isValidNUIT('123456789')); // true
    console.log(isValidDIRE(' 00008312-c ')); // true (auto-sanitizado)
    console.log(formatMZN(1500));          // "1 500,00 MT"
    console.log(isValidMozambicanPhone('+258 841234567')); // true
    
    // Auto-fallback and suggestions for legacy postal codes
    const suggestions = suggestCEPs('3100');
    console.log(suggestions[0]); // { cep: '0909-01', locality: 'Anchilo', ... }
    ```

---

## 🤝 Contribution and Portability

<p align="justify">
  <code>moz-utils</code> is an open-source project, and we would love to have your support to port it to more languages (such as <b>Go</b>, <b>Rust</b>, <b>Ruby</b>, or <b>C#</b>) or to optimize regex patterns and geographic databases!
</p>

<p align="justify">
  Please refer to our <a href="./CONTRIBUTING.md">Contribution Guide</a> to learn more about:
</p>
* The mathematical implementation of NUIT validation.
* Code style and naming conventions.
* Writing unit tests to maintain parity across ecosystems.

## 👥 Authors and Contributors

<p align="justify">
  This project was conceptualized and is maintained by:
</p>

<p align="center">
  <a href="https://github.com/iradoweck" title="Edmilson Muacigarro (@iradoweck)">
    <img src="https://github.com/iradoweck.png" width="60" height="60" style="border-radius: 50%;" alt="iradoweck" />
  </a>
  &nbsp;&nbsp;
  <a href="https://github.com/zedecks" title="Zedecks IT (@zedecks)">
    <img src="https://github.com/zedecks.png" width="60" height="60" style="border-radius: 50%;" alt="zedecks" />
  </a>
</p>

---

## 📄 License

This project is licensed under the **AGPL-3.0-or-later** license.

---

<p align="center">
  Developed by <b>Edmilson Muacigarro</b> and contributors.
</p>
