<h1 align="center">moz-utils</h1>

<p align="center">
  <b>Dart & Flutter</b>
</p>

<p align="center">
  <i>The digital foundation of Mozambican identity. The definitive Swiss army knife for validations, postal codes, and financial ecosystems in Mozambique, natively ported to the Dart ecosystem.</i>
</p>

---

## 📜 The Vision

In Mozambique, digital accuracy is the foundation of the future. From the pulse of mobile wallets in the squares to the rigorous structure of the National ID (BI), **moz-utils** exists to ensure that every piece of data that crosses your mobile application (Flutter) or backend (Dart Server) is validated, structured, and authentic.

Built impeccably for the Dart ecosystem, this package is more than a library — it is the open-source validation infrastructure our country deserves. Clean code, tested, and poetically engineered for Mozambique.

---

## 📦 Installation

Add the dependency to your `pubspec.yaml`:

```yaml
dependencies:
  moz_utils: ^0.3.2
```

---

## 🚀 API Reference Guide

### 1. Documents and Citizen Identity

```dart
import 'package:moz_utils/moz_utils.dart';

// National ID (12 digits + 1 letter)
MozUtils.isValidBI('110101234567A');  // true

// NUIT - Unique Tax Identification Number
MozUtils.isValidNUIT('123456789');    // true
MozUtils.getNUITEntityType('400000006');  // "Collective (Quotas Companies...)"

// DIRE - Foreign Resident Identification Document
MozUtils.isValidDIRE('00008312C');    // true

// Passport and Driving License
MozUtils.isValidPassport('AO1234567');       // true
MozUtils.isValidDrivingLicense('M123456');   // true
```

---

### 2. Financial Ecosystem and Telecommunications

Deep mapping of the Mozambican digital circulatory system — identifies operators and the pulse of associated mobile wallets.

```dart
import 'package:moz_utils/moz_utils.dart';

// Validation and Formatting
MozUtils.isValidMozambicanPhone('841234567');  // true
MozUtils.formatMozambicanPhone('841234567');   // "+258 84 123 4567"

// Telecom and Financial Intelligence
MozUtils.getMobileOperator('841234567');  // "Vodacom"
MozUtils.getMobileWallet('841234567');    // "M-Pesa"
MozUtils.getMobileWallet('821234567');    // "mKesh"
MozUtils.getMobileWallet('861234567');    // "e-Mola"

// Social Connections
MozUtils.buildWhatsAppUrl('841234567', 'Hello, Mozambique!'); 
// "https://wa.me/258841234567?text=Hello%2C%20Mozambique%21"
```

---

### 3. Postal Codes (Legacy and New CEP)

A graceful transition between the past and the future: from the old post office stations to the geo-referenced New CEP.

```dart
import 'package:moz_utils/moz_utils.dart';

// The Future (New CEP: Province, District, and Locality)
MozUtils.isValidNewCEP('0101-01');  // true

// Intelligent Suggestion Engine (Supports Legacy -> New Transition)
// Search by the old code "3100" (Nampula) or by a neighborhood
MozUtils.suggestCEPs('3100');
MozUtils.suggestCEPs('Namutequeliua');

// The Legacy
MozUtils.isValidPostalCode('3100');            // true
MozUtils.getPostalCodeLocality('3100');        // "Nampula"
```

---

### 4. National Geography and Finances

```dart
import 'package:moz_utils/moz_utils.dart';

// Monumental Value
MozUtils.formatMZN(1250.5);         // "1 250,50 MT"

// Full Geography
final provinces = MozUtils.getMozambiqueProvinces();
final nampulaDistricts = MozUtils.getDistrictsByProvince('npl');
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
