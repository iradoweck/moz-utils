# moz-utils

The definitive open-source utility library for software built in or for **Mozambique**.

[![npm](https://img.shields.io/npm/v/moz-utils?label=npm&color=00ff88)](https://www.npmjs.com/package/moz-utils)
[![PyPI](https://img.shields.io/pypi/v/moz-utils?label=PyPI&color=3776ab)](https://pypi.org/project/moz-utils/)
[![pub.dev](https://img.shields.io/pub/v/moz_utils?label=pub.dev&color=0175C2)](https://pub.dev/packages/moz_utils)
[![Packagist](https://img.shields.io/packagist/v/iradoweck/moz-utils?label=Packagist&color=F28D1A)](https://packagist.org/packages/iradoweck/moz-utils)
[![JitPack](https://img.shields.io/jitpack/v/github/iradoweck/moz-utils?label=JitPack&color=B07219)](https://jitpack.io/#iradoweck/moz-utils)
[![License: AGPL-3.0](https://img.shields.io/badge/license-AGPL--3.0-green)](https://github.com/iradoweck/moz-utils/blob/main/LICENSE)

---

## Why moz-utils?

When building applications for Mozambique, developers constantly solve the same problems from scratch:

- 🔎 **Is this NUIT valid?** — The Tax Authority (AT) uses Modulo 11. One wrong digit and the check fails silently.
- 📱 **Is this mobile number from Vodacom, Tmcel or Movitel?** — The prefix rules are operator-specific and not publicly documented.
- 🗺️ **What is the new CEP for Namutequeliua, Nampula?** — The new 6-digit system is still poorly adopted. We built the first offline database for it.
- 🪪 **Is this BI / DIRE / Passport valid?** — Each document type has its own strict format.

`moz-utils` solves all of this **out of the box**, with **zero runtime dependencies**, **offline-first algorithms**, and **no data sent anywhere**.

---

## Quick Navigation

| Section | Description |
|---|---|
| 📦 [Installation](installation) | Install for npm, pip, composer, pub.dev, or gradle |
| 📱 [Phones & Mobile](phones) | Validate numbers, detect operators, build WhatsApp links |
| 🪪 [Identity Documents](documents) | Validate NUIT, BI, DIRE, Passport, Driving License |
| 💰 [Currency (MZN)](currency) | Format Meticais to the official standard |
| 🗺️ [Geography & Districts](geography) | Browse all provinces, districts, and administrative posts |
| 📬 [Postal Codes (CEP)](postal) | Validate legacy codes and the new 6-digit CEP |

---

## Full Function Reference

| Function | Category | Description | TS | PY | PHP | Dart | Kotlin |
|---|---|---|:---:|:---:|:---:|:---:|:---:|
| `isValidMozambicanPhone` | Phones | Validates a Mozambican mobile number (82-88) | ✅ | ✅ | ✅ | ✅ | ✅ |
| `formatMozambicanPhone` | Phones | Formats to international standard `+258 XX XXX XXXX` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `getMobileOperator` | Phones | Returns `Vodacom`, `Tmcel`, or `Movitel` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `getMobileWallet` | Phones | Returns `M-Pesa`, `mKesh`, or `e-Mola` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `buildWhatsAppUrl` | Phones | Generates a `wa.me` link with optional pre-filled message | ✅ | ✅ | ✅ | ✅ | ✅ |
| `isValidNUIT` | Documents | Validates NUIT using the AT Modulo 11 algorithm | ✅ | ✅ | ✅ | ✅ | ✅ |
| `getNUITEntityType` | Documents | Returns the entity type from the first NUIT digit | ✅ | ✅ | ✅ | ✅ | ✅ |
| `isValidBI` | Documents | Validates Mozambican BI (12 digits + 1 letter) | ✅ | ✅ | ✅ | ✅ | ✅ |
| `isValidDIRE` | Documents | Validates DIRE (8 digits + 1 letter) | ✅ | ✅ | ✅ | ✅ | ✅ |
| `isValidPassport` | Documents | Validates Mozambican Passport (2 letters + 7 digits) | ✅ | ✅ | ✅ | ✅ | ✅ |
| `isValidDrivingLicense` | Documents | Validates Driving License (1 letter + 5-7 digits) | ✅ | ✅ | ✅ | ✅ | ✅ |
| `formatMZN` | Currency | Formats a number as Meticais (`1 500,00 MT`) | ✅ | ✅ | ✅ | ✅ | ✅ |
| `mozambiqueProvinces` | Geography | Offline database of all 11 provinces and their districts | ✅ | ✅ | ✅ | ✅ | ✅ |
| `getDistrictsByProvince` | Geography | Returns a list of districts for a given province ID | ✅ | ✅ | ✅ | ✅ | ✅ |
| `getAllDistricts` | Geography | Returns a flat list of all 161 Mozambican districts | ✅ | ✅ | ✅ | ✅ | ✅ |
| `isValidName` | Sanitization | Validates a personal name (letters, spaces, hyphens, apostrophes) | ✅ | ✅ | ✅ | ✅ | ✅ |
| `sanitizeName` | Sanitization | Cleans and converts a name to Title Case or ALL CAPS | ✅ | ✅ | ✅ | ✅ | ✅ |
| `sanitizeDocumentField` | Sanitization | Strips all non-numeric characters from a field | ✅ | ✅ | ✅ | ✅ | ✅ |
| `sanitizeAlphanumericField` | Sanitization | Strips special chars, forces UPPERCASE | ✅ | ✅ | ✅ | ✅ | ✅ |
| `isValidPostalCode` | Postal | Validates a 4-digit legacy postal code | ✅ | ✅ | ✅ | ✅ | ✅ |
| `getPostalCodeLocality` | Postal | Returns the locality for a legacy code | ✅ | ✅ | ✅ | ✅ | ✅ |
| `getPostalCodeProvince` | Postal | Returns the province for a legacy code | ✅ | ✅ | ✅ | ✅ | ✅ |
| `isValidNewCEP` | Postal | Validates the new 6-digit CEP format (`XXXX-XX`) | ✅ | ✅ | ✅ | ✅ | ✅ |
| `suggestCEPs` | Postal | Searches the offline CEP database by locality name | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## Polyglot Ecosystem

This library was built from the ground up to support native execution across:

- **TypeScript / Node.js** — via `npm install moz-utils`
- **Python** — via `pip install moz-utils`
- **PHP** — via `composer require iradoweck/moz-utils`
- **Dart / Flutter** — via `flutter pub add moz_utils`
- **Kotlin / Java** — via JitPack + Gradle

### Privacy First

All validation algorithms are fully **offline**. We don't track queries or send data to external APIs.
