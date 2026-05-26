<h1 align="center">moz-utils</h1>

<p align="center">
  <b>TypeScript & JavaScript</b>
</p>

<p align="center">
  <i>The Swiss Army Knife for developers in Mozambique — now ready for use in the Node.js ecosystem, web browsers, and modern frameworks.</i>
</p>

---

## 📦 Installation

Add the package to your project using your favorite package manager:

```bash
# Using NPM
npm install moz-utils

# Using PNPM
pnpm add moz-utils

# Using Yarn
yarn add moz-utils

# Using Bun
bun add moz-utils
```

---

## 🚀 API Reference Guide

### 1. Document Validation

#### `isValidNUIT(nuit: string | number): boolean`
Validates if a NUIT (Unique Tax Identification Number) is syntactically valid following the Modulo 11 rules defined by the Tax Authority.
```typescript
import { isValidNUIT } from 'moz-utils';

isValidNUIT('123456789'); // true
isValidNUIT(111111111);   // false (repeated numbers)
```

#### `getNUITEntityType(nuit: string | number): string | null`
Returns the descriptive entity classification associated with the NUIT based on its first digit. Returns `null` if the NUIT is invalid.
```typescript
import { getNUITEntityType } from 'moz-utils';

getNUITEntityType('100000008'); // "Singular (Cidadãos nacionais/estrangeiros e ENI)"
getNUITEntityType('400000006'); // "Colectiva (Sociedades por Quotas, SA, Lda, Associações)"
```

#### `isValidBI(bi: string): boolean`
Validates if the Mozambican National Identity Card (BI) format is correct (12 digits + 1 letter). It ignores spaces and dashes, and is case-insensitive for the final letter.
```typescript
import { isValidBI } from 'moz-utils';

isValidBI('110101234567A'); // true
isValidBI('110101234567 a'); // true (ignores spaces and handles lowercase)
isValidBI('11010123456');    // false
```

---

### 2. Communication and Mobile Network Utilities

#### `isValidMozambicanPhone(phone: string): boolean`
Validates if the phone number belongs to a national mobile network (Vodacom, Tmcel, or Movitel) and matches the correct format (with or without the international prefix `+258`).
```typescript
import { isValidMozambicanPhone } from 'moz-utils';

isValidMozambicanPhone('841234567');      // true
isValidMozambicanPhone('+258869876543');  // true
isValidMozambicanPhone('991234567');      // false
```

#### `formatMozambicanPhone(phone: string): string`
Formats a valid phone number into the standard international display format: `+258 XX XXX XXXX`. Throws an error if the number is invalid.
```typescript
import { formatMozambicanPhone } from 'moz-utils';

formatMozambicanPhone('841234567'); // "+258 84 123 4567"
```

#### `getMobileOperator(phone: string): 'Vodacom' | 'Tmcel' | 'Movitel' | null`
Identifies and returns the carrier of the provided phone number. Returns `null` if the number is invalid or does not match any known national carrier.
```typescript
import { getMobileOperator } from 'moz-utils';

getMobileOperator('841234567'); // "Vodacom"
getMobileOperator('823214567'); // "Tmcel"
```

#### `buildWhatsAppUrl(phone: string, message?: string): string`
Generates a direct link to open a WhatsApp conversation for the specified number, pre-filled with the Mozambican country code (`258`) and the optional URL-encoded message.
```typescript
import { buildWhatsAppUrl } from 'moz-utils';

buildWhatsAppUrl('841234567', 'Olá Formiga Antonio, bem-vindo a Nampula!');
// "https://wa.me/258841234567?text=Ol%C3%A1%20Formiga%20Antonio%2C%20bem-vindo%20a%20Nampula%21"
```

---

### 3. Currency Utilities

#### `formatMZN(value: number, currency?: 'MT' | 'MZN'): string`
Formats a numeric value (decimal or integer) into the Metical representation standard, with space separators for thousands and commas for decimals.
```typescript
import { formatMZN } from 'moz-utils';

formatMZN(1250.50);        // "1 250,50 MT"
formatMZN(5000000, 'MZN'); // "5 000 000,00 MZN"
formatMZN(-500);           // "-500,00 MT"
```

---

### 4. Legacy Postal Codes

#### `isValidPostalCode(code: string): boolean`
Validates if a legacy postal code of Moçambique is valid (exactly 4 digits belonging to the classic system of the Correios de Moçambique).
```typescript
import { isValidPostalCode } from 'moz-utils';

isValidPostalCode('1100');   // true
isValidPostalCode('1199');   // false
```

#### `getPostalCodeLocality(code: string): string | null`
Returns the locality associated with the legacy postal code, or `null`.
```typescript
import { getPostalCodeLocality } from 'moz-utils';

getPostalCodeLocality('1100'); // "Maputo ECP (Sede)"
```

#### `getPostalCodeProvince(code: string): string | null`
Returns the province associated with the legacy postal code, or `null`.
```typescript
import { getPostalCodeProvince } from 'moz-utils';

getPostalCodeProvince('1100'); // "Maputo"
```

---

### 5. Integrated Geographical Database

The package exports the `mozambiqueProvinces` constant and two helper functions for administrative queries:

```typescript
import { 
  mozambiqueProvinces, 
  getDistrictsByProvince, 
  getAllDistricts,
  District 
} from 'moz-utils';

// 1. Access the static hierarchical list directly
console.log(mozambiqueProvinces[0]);
/*
{
  id: 'cab',
  name: 'Cabo Delgado',
  region: 'Norte',
  sigla: 'CBD',
  districts: [
    { name: 'Ancuabe', postos_administrativos: [...], bairros: [] },
    ...
  ]
}
*/

// 2. Get districts of a specific province by ID (e.g., 'npl' for Nampula)
const nampulaDistricts = getDistrictsByProvince('npl');
// ['Angoche', 'Eráti', 'Ilha de Moçambique', 'Lalaua', ..., 'Nampula (Cidade)', ...]

// 3. Get a flat list of all 161 national districts
const allDistricts = getAllDistricts(); // Array of District
```

## 📄 License

This project is licensed under the **AGPL-3.0-or-later** license.

---

<p align="center">
  Developed by <b>Edmilson Muacigarro</b> and contributors.
</p>
