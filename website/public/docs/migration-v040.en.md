# Migration Guide to v0.4.0

The **v0.4.0** release of `moz-utils` represents the most significant update to the library to date, ensuring strict parity and standard interfaces across all 5 supported ecosystems (**TypeScript**, **Python**, **PHP**, **Dart/Flutter**, and **Kotlin/Android**).

This guide outlines the new capabilities, API refinements, and upgrade steps.

---

## 🚀 What's New in v0.4.0

### 1. Comprehensive Banking Module (Mozambican NIB & IBAN)
- **21-Digit NIB Validation:** Official **ISO 7064 Modulo 97-10** check digit verification mandated by the Central Bank of Mozambique (`isValidNIB`).
- **NIB Formatting:** Format accounts into standard 4-block representations (`formatNIB`).
- **Bank Routing:** Lookup details for all 18 commercial banks licensed in Mozambique (`getBankFromNIB`).
- **IBAN Integration:** Generate standard `MZ59` international identifiers (`nibToIBAN`) and validate them (`isValidIBAN`).

### 2. Flexible Province Lookups in `getDistrictsByProvince`
Previously, `getDistrictsByProvince` required internal lowercase IDs (e.g. `'npl'`, `'mpp'`). In v0.4.0, queries accept any of the following:
- **Internal ID:** `'npl'`, `'mpp'`, `'mpc'`, `'cab'`...
- **Official Acronym:** `'NPL'`, `'MPT'`, `'MC'`, `'CBD'`...
- **Full Province Name:** `'Nampula'`, `'Maputo'`, `'Cabo Delgado'`, case-insensitive with accent tolerance.

```ts
// All forms are now accepted seamlessly:
getDistrictsByProvince('npl');
getDistrictsByProvince('NPL');
getDistrictsByProvince('Nampula');
getDistrictsByProvince('Cabo Delgado');
```

### 3. Robust Data Sanitization & Normalization
- **`sanitizeName`:** Converts uppercase or poorly formatted text to clean **Title Case** (e.g., `"EDMILSON DE JESUS"` → `"Edmilson de Jesus"`). Preserves Portuguese lowercase particles (`de`, `da`, `do`, `dos`, `das`, `e`). Optional `{ allCaps: true }`.
- **`isValidName`:** Requires at least 2 Unicode alphabetic letters, rejecting symbols or dashes (`---`).
- **`sanitizeDocumentField`:** Strips non-digits (`\D`) to normalize NUIT, NIB, and phone numbers.
- **`sanitizeAlphanumericField`:** Strips special characters and enforces uppercase formatting for national IDs and licenses.

### 4. Configurable Phone Formatting
`formatMozambicanPhone` now supports flexible output modes:
```ts
formatMozambicanPhone("841234567", { format: 'international' }); // "+258 84 123 4567" (default)
formatMozambicanPhone("841234567", { format: 'e164' });          // "+258841234567"
formatMozambicanPhone("841234567", { format: 'national' });      // "84 123 4567"
formatMozambicanPhone("841234567", { format: 'dashed' });        // "84-123-4567"
```

### 5. Postal Corrections
- The postal code for Namutequeliua (Nampula) is officially `"0909-09"` (replacing the preliminary code `"3100-05"`).
- `suggestCEPs` searches across localities, districts, and provinces with diacritic tolerance.

---

## ⚠️ Potential Breaking Changes

1. **Fictitious Currency Parameters Removed:**
   - Any custom calls passing a third boolean parameter to `formatMZN(value, 'MT', true)` must be updated to the valid 2-argument signature `formatMZN(value, currency = 'MT')`.
2. **Strict Guard on Phone Formatting:**
   - Invalid phone strings now throw descriptive `Error`s instead of producing broken outputs.
3. **Symbol-Only Names Disallowed:**
   - `isValidName` now requires at least 2 letters, correctly rejecting inputs like `---`.

---

## 📦 How to Upgrade

### TypeScript / Node.js
```bash
npm install moz-utils@^0.4.0
```

### Python
```bash
pip install --upgrade moz-utils
```

### PHP
```bash
composer require iradoweck/moz-utils:^0.4.0
```

### Dart / Flutter
```yaml
dependencies:
  moz_utils: ^0.4.0
```
```bash
dart pub get
```

### Kotlin / Android (Gradle)
```kotlin
dependencies {
    implementation("com.github.iradoweck:moz-utils:v0.4.0")
}
```
