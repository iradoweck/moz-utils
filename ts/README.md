<h1 align="center">moz-utils</h1>

<p align="center">
  <b>TypeScript & JavaScript (Node.js/Browser)</b>
</p>

<p align="center">
  <i>The digital foundation of Mozambican identity. The definitive Swiss army knife for validations, postal codes, and financial ecosystems in Mozambique, natively in TypeScript.</i>
</p>

---

## 📜 The Vision

In Mozambique, digital accuracy is the foundation of the future. From the pulse of mobile wallets in the squares to the rigorous structure of the National ID (BI), **moz-utils** exists to ensure that every piece of data that crosses your frontend (React, Vue, Angular) or backend (Node.js) is validated, structured, and authentic.

Built as the "Source of Truth" for the MozUtils ecosystem, this package is more than a library — it is the open-source validation infrastructure our country deserves. Clean code, strongly typed, and poetically engineered for Mozambique.

---

## 📦 Installation

```bash
npm install moz-utils
# or
yarn add moz-utils
# or
pnpm add moz-utils
```

---

## 🚀 API Reference Guide

### 1. Documents and Citizen Identity

```typescript
import { 
  isValidBI, 
  isValidNUIT, 
  getNUITEntityType,
  isValidDIRE,
  isValidPassport,
  isValidDrivingLicense
} from 'moz-utils';

// National ID (12 digits + 1 letter)
isValidBI('110101234567A');  // true

// NUIT - Unique Tax Identification Number
isValidNUIT('123456789');    // true
getNUITEntityType('400000006');  // "Collective (Quotas Companies...)"

// DIRE - Foreign Resident Identification Document
isValidDIRE('00008312C');    // true

// Passport and Driving License
isValidPassport('AO1234567');       // true
isValidDrivingLicense('M123456');   // true
```

---

### 2. Financial Ecosystem and Telecommunications

Deep mapping of the Mozambican digital circulatory system — identifies operators and the pulse of associated mobile wallets.

```typescript
import { 
  isValidMozambicanPhone, 
  formatMozambicanPhone, 
  getMobileOperator,
  getMobileWallet,
  buildWhatsAppUrl
} from 'moz-utils';

// Validation and Formatting
isValidMozambicanPhone('841234567');  // true
formatMozambicanPhone('841234567');   // "+258 84 123 4567"

// Telecom and Financial Intelligence
getMobileOperator('841234567');  // "Vodacom"
getMobileWallet('841234567');    // "M-Pesa"
getMobileWallet('821234567');    // "mKesh"
getMobileWallet('861234567');    // "e-Mola"

// Social Connections
buildWhatsAppUrl('841234567', 'Hello, Mozambique!'); 
// "https://wa.me/258841234567?text=Hello%2C%20Mozambique%21"
```

---

### 3. Postal Codes (Legacy and New CEP)

A graceful transition between the past and the future: from the old post office stations to the geo-referenced New CEP.

```typescript
import { 
  isValidNewCEP,
  suggestCEPs,
  isValidPostalCode,
  getPostalCodeLocality
} from 'moz-utils';

// The Future (New CEP: Province, District, and Locality)
isValidNewCEP('0101-01');  // true

// Intelligent Suggestion Engine (Supports Legacy -> New Transition)
// Search by the old code "3100" (Nampula) or by a neighborhood
suggestCEPs('3100');
suggestCEPs('Namutequeliua');

// The Legacy
isValidPostalCode('3100');            // true
getPostalCodeLocality('3100');        // "Nampula"
```

---

### 4. National Geography and Finances

```typescript
import { 
  formatMZN,
  getMozambiqueProvinces, 
  getDistrictsByProvince 
} from 'moz-utils';

// Monumental Value
formatMZN(1250.5);         // "1 250.50 MT"

// Full Geography
const provinces = getMozambiqueProvinces();
const nampulaDistricts = getDistrictsByProvince('npl');
```

---

## 🤝 Rules of Conduct and Contribution

This is not just any project. It is a project of national pride. We ask for excellence in code, compassion with colleagues, and the ambition to make the Mozambican web world-class. Read our `CODE_OF_CONDUCT.md` in the project root.

## 📄 License

The code lives and breathes the freedom of Open Source. Licensed under **AGPL-3.0-or-later**.

---

<p align="center">
  Developed by <b>Open Source Contributors</b> & supported by <b>Edmilson Muacigarro</b>
</p>


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
