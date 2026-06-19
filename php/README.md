# moz-utils (PHP)

The definitive, zero-dependency, offline-first open-source library for software built in or for **Mozambique**.

[![Packagist](https://img.shields.io/packagist/v/iradoweck/moz-utils?label=Packagist&color=F28D1A)](https://packagist.org/packages/iradoweck/moz-utils)
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

- **PHP**: `>= 8.3`
- **Ecosystem**: Laravel, Symfony, WordPress, or raw scripts. Takes full advantage of the strict Type Hinting system introduced in PHP 8.3.

---

## 📦 Installation

Install via Composer:

```bash
composer require iradoweck/moz-utils
```

---

## 🚀 Comprehensive Usage Guide

### 📱 Phones & Mobile

Validating and extracting information from Mozambican mobile numbers. Fully supports Vodacom, Tmcel, and Movitel.

```php
use MozUtils\MozUtils;

// Validation
var_dump(MozUtils::isValidMozambicanPhone("841234567"));       // bool(true)
var_dump(MozUtils::isValidMozambicanPhone("+258 82 123 4567")); // bool(true)
var_dump(MozUtils::isValidMozambicanPhone("811234567"));        // bool(false)

// Operator & Wallet Extraction
echo MozUtils::getMobileOperator("841234567"); // "Vodacom"
echo MozUtils::getMobileWallet("861234567");   // "e-Mola"

// Formatting
echo MozUtils::formatMozambicanPhone("84 123 4567"); // "+258841234567"

// WhatsApp Links
$url = MozUtils::buildWhatsAppUrl("841234567", "Hello!");
echo $url; // "https://wa.me/258841234567?text=Hello%21"
```

#### ⚙️ Under the Hood: Operator Prefixes
Telecommunication operators in Mozambique acquire specific number blocks through the INCM. We map operators using this offline logic:
- **Vodacom**: Starts with `84` or `85`.
- **Tmcel**: Starts with `82` or `83`.
- **Movitel**: Starts with `86` or `87` or `88`.

---

### 🪪 Identity Documents

Validating documents prevents fraudulent registrations in systems deployed in Maputo, Nampula, or any other province.

```php
use MozUtils\MozUtils;

// NUIT (Tax ID)
var_dump(MozUtils::isValidNUIT("400000008")); // bool(true)
echo MozUtils::getNUITEntityType("400000008"); // "Singular" (Individual)

// BI (Identity Card)
var_dump(MozUtils::isValidBI("123456789123A")); // bool(true)

// Passports, DIRE & Driving License
var_dump(MozUtils::isValidPassport("AO1234567")); // bool(true)
var_dump(MozUtils::isValidDIRE("120345678A"));   // bool(true)
var_dump(MozUtils::isValidDrivingLicense("MP1234567")); // bool(true)
```

#### ⚙️ Under the Hood: The NUIT Algorithm
Unlike other tax numbers that use descending multipliers, the Mozambican Tax Authority uses a specific fixed matrix of weights `[8, 9, 4, 5, 6, 7, 8, 9]` to calculate the Modulo 11 for the NUIT. `moz-utils` replicates this exact mathematical equation offline.

---

### 💰 Currency (MZN)

Format numbers into the official Metical standard.

```php
use MozUtils\MozUtils;

echo MozUtils::formatMZN(1500); // "1 500,00 MT"
echo MozUtils::formatMZN(2500000.5); // "2 500 000,50 MT"
```

---

### 🗺️ Geography & Districts

An offline database containing all 11 provinces and 161 districts of Mozambique.

```php
use MozUtils\MozUtils;

// Get districts for a specific province
$maputoDistricts = MozUtils::getDistrictsByProvince("Maputo");
print_r($maputoDistricts); // ["Boane", "Magude", "Manhiça", "Marracuene", ...]

// Get all 161 districts in a flat array
$allDistricts = MozUtils::getAllDistricts();
```

---

### 📬 Postal Codes (CEP)

Mozambique recently transitioned from the classic 4-digit code to a modern 6-digit CEP (`XXXX-XX`). `moz-utils` supports both!

```php
use MozUtils\MozUtils;

// Modern CEP
var_dump(MozUtils::isValidNewCEP("3100-05")); // bool(true)

// Autocomplete / Suggestion Engine
$results = MozUtils::suggestCEPs("namutequeliua");
print_r($results[0]); 
// ['cep' => '3100-05', 'province' => 'Nampula', 'district' => 'Nampula', 'locality' => 'Namutequeliua']

// Legacy Postal Codes
var_dump(MozUtils::isValidPostalCode("3100")); // bool(true)
echo MozUtils::getPostalCodeLocality("3100"); // "Nampula"
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
