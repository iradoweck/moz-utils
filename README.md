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
  <code>moz-utils</code> is a collection of essential utility functions tailored for the Mozambican software development ecosystem. It standardizes critical validations such as <b>NUIT</b> (Unique Tax Identification Number), <b>BI</b> (National ID), <b>DIRE</b> (Foreign Resident ID), <b>Passports</b>, <b>Driving Licenses</b>, <b>mobile phone numbers</b> (Vodacom, Tmcel, Movitel / M-Pesa, e-Mola, mKesh), <b>Metical currency formatting</b> (MZN), and <b>national geographical data</b> (including the New Postal Code System - CEP).
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

All heavy technical logic (NUIT mathematics, document Regex validation, and Mozambique maps) has been isolated. To read detailed technical documentation on how algorithms work and the structure of Mozambican geographical databases, check out our official document:
👉 **[Mozambique Kiwi Docs (Validations & Maps)](./mozambiquekiwi.md)**

### 1. Telephony and Mobile Wallets

Identification and validation of Mozambican 9-digit numbers (starting with 82, 83, 84, 85, 86, 87, 88). Robustly identifies if the number supports **M-Pesa** (Vodacom), **e-Mola** (Movitel), or **mKesh** (Tmcel).

### 2. Postal Codes (Legacy vs New CEP)

The ecosystem implements the **New Mozambican CEP System** (6 digits `XXXX-XX`).
More than just a list, we built an intelligent suggestion logic:
- If a user inputs an old postal code (e.g., `3100`), the library automatically translates and suggests an *array* of corresponding New CEPs (e.g., `0909-01`, `0909-02`), allowing you to build perfect frontend dropdown menus for the end user to choose the exact neighborhood.

---

## 🚀 Interactive Emulator (CLI)

To test how this library behaves "in production" without needing to write code, we included a **CLI Emulator**.

Simply run this in the root of your project:
```bash
npx tsx emulator.ts
```
This will launch an interactive menu where you can type NUITs, phones, BIs, or CEPs and check the library's real-time response!

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
      moz_utils: ^0.3.3
    ```

=== "Kotlin"
    ```kotlin
    // Add to your build.gradle.kts (JitPack)
    repositories {
        maven { url = uri("https://jitpack.io") }
    }
    dependencies {
        implementation("com.github.iradoweck:moz-utils:v0.3.5")
    }
    ```

---

## 🧮 O Algoritmo NUIT (A Verdadeira Fórmula Moçambicana)

Ao contrário do NIF de Portugal (que usa multiplicadores de 9 a 2), a Autoridade Tributária de Moçambique utiliza a seguinte matriz de pesos para calcular o Módulo 11 do NUIT.

**A Fórmula e os Pesos Oficiais:**
```text
NUIT a Validar: 401626638

Posição:   1   2   3   4   5   6   7   8
Dígitos:   4   0   1   6   2   6   6   3
Pesos:     8   9   4   5   6   7   8   9
           |   |   |   |   |   |   |   |
Mult:     32 + 0 + 4 +30 +12 +42 +48 +27 = 195 (Soma)

Cálculo do Módulo 11:
1. Resto = Soma % 11
   195 % 11 = 8
2. O "Resto" é o Índice (Posição 0 a 10) na string de controlo "01234567891".
3. A 8ª posição de "01234567891" é '8'.
4. Como o 9º dígito do NUIT (Dígito de Controlo) é '8', o NUIT é Válido!
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
      suggestCEPs, formatMZN, parseMZN 
    } from 'moz-utils';
    
    // NUIT e Documentos
    console.log(isValidNUIT('401626638')); // true (Algoritmo Moz-Mod11)
    console.log(isValidDIRE(' 00008312-c ')); // true (auto-sanitized)
    
    // Tratamento de Dinheiro de "Sujo" para "BD" e depois para "UI"
    const dbValue = parseMZN('1.500,00 MT'); // 1500.00 (float puro para a BD)
    console.log(formatMZN(dbValue));         // "1 500,00 MT" (padrão oficial de exibição)
    
    // Auto-fallback and suggestions for legacy postal codes
    const suggestions = suggestCEPs('3100');
    console.log(suggestions[0]); // { cep: '0909-09', locality: 'Namutequeliua', district: 'Nampula', province: 'Nampula' }
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

---

## 💬 Official Community & Forum

<p align="justify">
  We have a dedicated Community Portal integrated directly into our official website. Whether you have questions, ideas, want to showcase your projects, or propose B2B partnerships, everything happens there natively through GitHub Discussions.
</p>

👉 **[Join the Community Discussions](https://iradoweck.github.io/moz-utils/#/community)**

---

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
  Developed by <b>Open Source Contributors</b> & supported by <b>Edmilson Muacigarro</b>
</p>
