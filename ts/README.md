# moz-utils (TypeScript)

The definitive, zero-dependency, offline-first open-source library for software built in or for **Mozambique**.

[![npm](https://img.shields.io/npm/v/moz-utils?label=npm&color=00ff88)](https://www.npmjs.com/package/moz-utils)
[![License: AGPL-3.0](https://img.shields.io/badge/license-AGPL--3.0-green)](https://github.com/iradoweck/moz-utils/blob/main/LICENSE)
[![Website](https://img.shields.io/badge/Docs-Website-blue)](https://iradoweck.github.io/moz-utils/)

> **Author:** Edmilson Muacigarro (@iradoweck)  
> **Official Documentation:** [iradoweck.github.io/moz-utils](https://iradoweck.github.io/moz-utils/)  
> **GitHub Repository:** [iradoweck/moz-utils](https://github.com/iradoweck/moz-utils)

---

## 🌍 The Vision

When developing applications for Mozambique, engineers constantly solve the exact same problems from scratch:
- 🔎 **Is this NUIT valid?** — The Tax Authority uses a Modulo 11 algorithm. A single wrong digit and your backend fails silently.
- 📱 **Is this number Vodacom, Tmcel or Movitel?** — The prefix rules are operator-specific and rarely documented publicly.
- 🗺️ **What is the new CEP for Namutequeliua, Nampula?** — The new 6-digit postal system has low adoption. We built the first offline database for it.
- 🪪 **Is this BI / DIRE / Passport valid?** — Every identity document has a strict format.

`moz-utils` solves all of this **out-of-the-box**, with **zero runtime dependencies**, **offline-first algorithms**, and **strict privacy** (we don't send data anywhere).

---

## 💻 System Requirements

This package is strictly compiled as an **ES Module (ESM)**. 
- **Node.js**: `>= 24.0.0`
- **TypeScript**: `>= 6.0` (For development/compilation)
- **Ecosystem**: Fully compatible with Browsers (ESM), Edge Runtimes (Cloudflare Workers, Vercel Edge), and modern Node.js.

*Note: If you encounter `require() of ES Module is not supported`, ensure your `package.json` has `"type": "module"` and your `tsconfig.json` uses `"moduleResolution": "Node16"` or `"Bundler"`.*

---

## 📦 Installation

Install via npm, yarn, or pnpm:

```bash
npm install moz-utils
```

---

## 🚀 Comprehensive Usage Guide

### 📱 Phones & Mobile

Validating and extracting information from Mozambican mobile numbers. Fully supports Vodacom, Tmcel, and Movitel.

```typescript
import { 
  isValidMozambicanPhone, 
  getMobileOperator, 
  getMobileWallet, 
  formatMozambicanPhone,
  buildWhatsAppUrl 
} from 'moz-utils';

// Validation
console.log(isValidMozambicanPhone("841234567"));       // true
console.log(isValidMozambicanPhone("+258 82 123 4567")); // true
console.log(isValidMozambicanPhone("811234567"));        // false

// Operator & Wallet Extraction
console.log(getMobileOperator("841234567")); // "Vodacom"
console.log(getMobileWallet("861234567"));   // "e-Mola"

// Formatting
console.log(formatMozambicanPhone("84 123 4567")); // "+258841234567"

// WhatsApp Links
const url = buildWhatsAppUrl("841234567", "Hello!");
console.log(url); // "https://wa.me/258841234567?text=Hello%21"
```

#### ⚙️ Under the Hood: Operator Prefixes
Telecommunication operators in Mozambique acquire specific number blocks through the INCM. We map operators using this offline logic:
- **Vodacom**: Starts with `84` or `85`.
- **Tmcel**: Starts with `82` or `83`.
- **Movitel**: Starts with `86` or `87` or `88`.

---

### 🪪 Identity Documents

Validating documents prevents fraudulent registrations in systems deployed in Maputo, Nampula, or any other province.

```typescript
import { 
  isValidNUIT, 
  getNUITEntityType, 
  isValidBI, 
  isValidPassport, 
  isValidDIRE, 
  isValidDrivingLicense 
} from 'moz-utils';

// NUIT (Tax ID)
console.log(isValidNUIT("400000008")); // true
console.log(getNUITEntityType("400000008")); // "Singular" (Individual)

// BI (Identity Card)
console.log(isValidBI("123456789123A")); // true

// Passports, DIRE & Driving License
console.log(isValidPassport("AO1234567")); // true
console.log(isValidDIRE("120345678A"));   // true
console.log(isValidDrivingLicense("MP1234567")); // true
```

#### ⚙️ Under the Hood: The NUIT Algorithm
Unlike other tax numbers that use descending multipliers, the Mozambican Tax Authority uses a specific fixed matrix of weights `[8, 9, 4, 5, 6, 7, 8, 9]` to calculate the Modulo 11 for the NUIT. `moz-utils` replicates this exact mathematical equation offline.

---

### 💰 Currency (MZN)

Format numbers into the official Metical standard.

```typescript
import { formatMZN } from 'moz-utils';

console.log(formatMZN(1500)); // "1 500,00 MT"
console.log(formatMZN(2500000.5)); // "2 500 000,50 MT"
```

---

### 🗺️ Geography & Districts

An offline database containing all 11 provinces and 161 districts of Mozambique.

```typescript
import { mozambiqueProvinces, getDistrictsByProvince, getAllDistricts } from 'moz-utils';

// Loop through provinces
mozambiqueProvinces.forEach(p => console.log(p.name)); 

// Get districts for a specific province
const maputoDistricts = getDistrictsByProvince("Maputo");
console.log(maputoDistricts); // ["Boane", "Magude", "Manhiça", "Marracuene", ...]

// Get all 161 districts in a flat array
const all = getAllDistricts();
```

---

### 📬 Postal Codes (CEP)

Mozambique recently transitioned from the classic 4-digit code to a modern 6-digit CEP (`XXXX-XX`). `moz-utils` supports both!

```typescript
import { isValidNewCEP, suggestCEPs, isValidPostalCode, getPostalCodeLocality } from 'moz-utils';

// Modern CEP
console.log(isValidNewCEP("3100-05")); // true

// Autocomplete / Suggestion Engine
const results = suggestCEPs("namutequeliua");
console.log(results[0]); 
// { cep: "3100-05", province: "Nampula", district: "Nampula", locality: "Namutequeliua" }

// Legacy Postal Codes
console.log(isValidPostalCode("3100")); // true
console.log(getPostalCodeLocality("3100")); // "Nampula"
```

#### ⚙️ Under the Hood: The New CEP
The New Postal Addressing Code (CEP) abandons the old 4-digit system in favor of a geospatial alphanumeric format (`XXXX-XX`). We ported the entire official geographic mapping tree to provide instant autocomplete.

---

## 🛠️ Troubleshooting

- **My NUIT fails validation, but the user swears it's real!**
  *Cause:* The Mozambican NUIT uses a Check Digit generated through a Modulo 11 algorithm. `moz-utils` does not make exceptions to the mathematical algorithm. If your system accepts mathematically invalid NUITs, your company might face integration issues with the government's e-Tributação systems.
  
- **Names Returning Empty to the Database (Sanitize)**
  *Cause:* The `sanitizeName()` function aggressively strips mathematical characters and numbers. Always run `isValidName()` **before** sanitizing and saving to the database to ensure the string contains actual alphabetical characters.

---

## 📜 License

This project is licensed under the **AGPL-3.0 License** - see the LICENSE file for details.
