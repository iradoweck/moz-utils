<h1 align="center">moz-utils</h1>

<p align="center">
  <b>Dart & Flutter</b>
</p>

<p align="center">
  <a href="https://pub.dev/packages/moz_utils">
    <img src="https://img.shields.io/pub/v/moz_utils?color=0175c2&logo=dart&logoColor=white" alt="Pub Version" />
  </a>
  <a href="https://pub.dev/packages/moz_utils">
    <img src="https://img.shields.io/pub/points/moz_utils" alt="Pub Points" />
  </a>
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
  moz_utils: ^0.3.3
```

---

## 🚀 API Reference Guide

### 1. Identity & Documents

```dart
import 'package:moz_utils/moz_utils.dart';

// National ID (12 digits + 1 letter)
MozUtils.isValidBI('110101234567A');  // true

// NUIT - Unique Tax Identification Number (Per AT Decree n. 28/2012)
MozUtils.isValidNUIT('401626638');    // true
MozUtils.getNUITEntityType('400000006');  // "Pessoas Colectivas"
MozUtils.getNUITEntityType('100000008');  // "Pessoas Singulares"

// DIRE - Foreign Resident Identification Document
MozUtils.isValidDIRE('00008312C');    // true

// Passport and Driving License
MozUtils.isValidPassport('AO1234567');       // true
MozUtils.isValidDrivingLicense('M123456');   // true
```

---

### 2. Name & String Sanitization

Clean up dirty user input from forms before saving to your database:

```dart
import 'package:moz_utils/moz_utils.dart';

MozUtils.isValidName("Edmilson O'Brian-Muacigarro"); // true
MozUtils.isValidName("Edmilson 123");                // false

MozUtils.sanitizeName("  EDMILSON  muacigarro ");    // "Edmilson Muacigarro"
MozUtils.sanitizeName("João", allCaps: true);        // "JOÃO"

MozUtils.sanitizeDocumentField("123 456-789");       // "123456789"
MozUtils.sanitizeAlphanumericField("110 101 a");     // "110101A"
```

---

### 3. Financial Toolkit (Metical)

```dart
import 'package:moz_utils/moz_utils.dart';

// Format database floats into official AT formats
MozUtils.formatMZN(1500);          // "1 500,00 MT"
MozUtils.formatMZN(50000, 'MZN');  // "50 000,00 MZN"

// Parse dirty strings back into database floats
MozUtils.parseMZN("1.500,00 MT");  // 1500.00
MozUtils.parseMZN("1 500,00MZN");  // 1500.00
```

---

### 4. Financial Ecosystem and Telecommunications

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
