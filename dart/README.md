# moz_utils (Dart & Flutter)

The definitive, zero-dependency, offline-first open-source library for software built in or for **Mozambique**.

[![pub.dev](https://img.shields.io/pub/v/moz_utils?label=pub.dev&color=0175C2)](https://pub.dev/packages/moz_utils)
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

`moz_utils` solves all of this **out-of-the-box**, with **zero runtime dependencies**, **offline-first algorithms**, and **strict privacy** (we don't send data anywhere).

---

## 💻 System Requirements

- **Dart SDK**: `>= 3.5.0 < 4.0.0`
- **Ecosystem**: Fully compatible with AOT (Ahead-of-Time) compilers for native compilation on Android, iOS, Windows, macOS, and Linux via Flutter.

---

## 📦 Installation

Install via Flutter or Dart CLI:

```bash
flutter pub add moz_utils
```

Or by adding manually to `pubspec.yaml`:
```yaml
dependencies:
  moz_utils: ^0.3.9
```

---

## 🚀 Comprehensive Usage Guide

### 📱 Phones & Mobile

Validating and extracting information from Mozambican mobile numbers. Fully supports Vodacom, Tmcel, and Movitel.

```dart
import 'package:moz_utils/moz_utils.dart';

// Validation
print(isValidMozambicanPhone("841234567"));       // true
print(isValidMozambicanPhone("+258 82 123 4567")); // true
print(isValidMozambicanPhone("811234567"));        // false

// Operator & Wallet Extraction
print(getMobileOperator("841234567")); // "Vodacom"
print(getMobileWallet("861234567"));   // "e-Mola"

// Formatting
print(formatMozambicanPhone("84 123 4567")); // "+258841234567"

// WhatsApp Links
final url = buildWhatsAppUrl("841234567", "Hello!");
print(url); // "https://wa.me/258841234567?text=Hello%21"
```

#### ⚙️ Under the Hood: Operator Prefixes
Telecommunication operators in Mozambique acquire specific number blocks through the INCM. We map operators using this offline logic:
- **Vodacom**: Starts with `84` or `85`.
- **Tmcel**: Starts with `82` or `83`.
- **Movitel**: Starts with `86` or `87` or `88`.

---

### 🪪 Identity Documents

Validating documents prevents fraudulent registrations in systems deployed in Maputo, Nampula, or any other province.

```dart
import 'package:moz_utils/moz_utils.dart';

// NUIT (Tax ID)
print(isValidNUIT("400000008")); // true
print(getNUITEntityType("400000008")); // "Singular" (Individual)

// BI (Identity Card)
print(isValidBI("123456789123A")); // true

// Passports, DIRE & Driving License
print(isValidPassport("AO1234567")); // true
print(isValidDIRE("120345678A"));   // true
print(isValidDrivingLicense("MP1234567")); // true
```

#### ⚙️ Under the Hood: The NUIT Algorithm
Unlike other tax numbers that use descending multipliers, the Mozambican Tax Authority uses a specific fixed matrix of weights `[8, 9, 4, 5, 6, 7, 8, 9]` to calculate the Modulo 11 for the NUIT. `moz_utils` replicates this exact mathematical equation offline.

---

### 💰 Currency (MZN)

Format numbers into the official Metical standard.

```dart
import 'package:moz_utils/moz_utils.dart';

print(formatMZN(1500)); // "1 500,00 MT"
print(formatMZN(2500000.5)); // "2 500 000,50 MT"
```

---

### 🗺️ Geography & Districts

An offline database containing all 11 provinces and 161 districts of Mozambique.

```dart
import 'package:moz_utils/moz_utils.dart';

// Loop through provinces
for (var p in mozambiqueProvinces) {
    print(p.name);
}

// Get districts for a specific province
final maputoDistricts = getDistrictsByProvince("Maputo");
print(maputoDistricts); // ["Boane", "Magude", "Manhiça", "Marracuene", ...]

// Get all 161 districts in a flat list
final allDistricts = getAllDistricts();
```

---

### 📬 Postal Codes (CEP)

Mozambique recently transitioned from the classic 4-digit code to a modern 6-digit CEP (`XXXX-XX`). `moz_utils` supports both!

```dart
import 'package:moz_utils/moz_utils.dart';

// Modern CEP
print(isValidNewCEP("3100-05")); // true

// Autocomplete / Suggestion Engine
final results = suggestCEPs("namutequeliua");
print(results[0].cep); // "3100-05"

// Legacy Postal Codes
print(isValidPostalCode("3100")); // true
print(getPostalCodeLocality("3100")); // "Nampula"
```

#### ⚙️ Under the Hood: The New CEP
The New Postal Addressing Code (CEP) abandons the old 4-digit system in favor of a geospatial alphanumeric format (`XXXX-XX`). We ported the entire official geographic mapping tree to provide instant autocomplete.

---

## 🛠️ Troubleshooting

- **My NUIT fails validation, but the user swears it's real!**
  *Cause:* The Mozambican NUIT uses a Check Digit generated through a Modulo 11 algorithm. `moz_utils` does not make exceptions to the mathematical algorithm. If your system accepts mathematically invalid NUITs, your company might face integration issues with the government's e-Tributação systems.
  
- **Names Returning Empty to the Database (Sanitize)**
  *Cause:* The `sanitizeName()` function aggressively strips mathematical characters and numbers. Always run `isValidName()` **before** sanitizing and saving to the database to ensure the string contains actual alphabetical characters.

---

## 📜 License

This project is licensed under the **AGPL-3.0 License** - see the LICENSE file for details.
