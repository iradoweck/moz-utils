<h1 align="center">moz-utils</h1>

<p align="center">
  <b>Dart & Flutter</b>
</p>

<p align="center">
  <i>The Swiss Army Knife for developers in Mozambique — ported to Dart. Ideal for mobile and multi-platform applications developed with Flutter.</i>
</p>

---

## 📦 Installation

You can add the library to your Flutter or Dart project. In your `pubspec.yaml` file, add the package using the local path:

```yaml
dependencies:
  moz_utils:
    path: ../path/to/moz-utils/dart
```

Then run:
```bash
dart pub get
# or for Flutter projects
flutter pub get
```

---

## 🚀 API Reference Guide

All utilities are exposed as static methods on the `MozUtils` class.

### 1. Document Validation

#### `MozUtils.isValidNUIT(dynamic nuit): bool`
Validates if a NUIT (Unique Tax Identification Number) is syntactically valid following the Modulo 11 rules of the Tax Authority (AT). Accepts both `String` and `int`.
```dart
import 'package:moz_utils/moz_utils.dart';

print(MozUtils.isValidNUIT('123456789')); // true
print(MozUtils.isValidNUIT(111111111));   // false
```

#### `MozUtils.getNUITEntityType(dynamic nuit): String?`
Classifies the entity associated with the NUIT based on its first digit. Returns `null` if the NUIT is invalid.
```dart
import 'package:moz_utils/moz_utils.dart';

print(MozUtils.getNUITEntityType('100000008')); // "Singular (Cidadãos nacionais/estrangeiros e ENI)"
print(MozUtils.getNUITEntityType('400000006')); // "Colectiva (Sociedades por Quotas, SA, Lda, Associações)"
```

#### `MozUtils.isValidBI(String bi): bool`
Validates the Mozambican National Identity Card (BI) (12 digits + 1 letter). It ignores spaces and dashes.
```dart
import 'package:moz_utils/moz_utils.dart';

print(MozUtils.isValidBI('110101234567A'));  // true
print(MozUtils.isValidBI('110101234567 a'));  // true
```

---

### 2. Telecommunications and WhatsApp

#### `MozUtils.isValidMozambicanPhone(String phone): bool`
Validates if the number belongs to a valid national mobile carrier (Vodacom, Tmcel, or Movitel).
```dart
import 'package:moz_utils/moz_utils.dart';

print(MozUtils.isValidMozambicanPhone('841234567'));     // true
print(MozUtils.isValidMozambicanPhone('+258861234567')); // true
```

#### `MozUtils.formatMozambicanPhone(String phone): String`
Formats the mobile number to the standard international display format: `+258 XX XXX XXXX`. Throws `ArgumentError` if the number is invalid.
```dart
import 'package:moz_utils/moz_utils.dart';

print(MozUtils.formatMozambicanPhone('841234567')); // "+258 84 123 4567"
```

#### `MozUtils.getMobileOperator(String phone): String?`
Identifies and returns the mobile carrier name (`'Vodacom'`, `'Tmcel'`, or `'Movitel'`).
```dart
import 'package:moz_utils/moz_utils.dart';

print(MozUtils.getMobileOperator('841234567')); // "Vodacom"
```

#### `MozUtils.buildWhatsAppUrl(String phone, [String message = '']): String`
Creates a direct link to open a WhatsApp conversation.
```dart
import 'package:moz_utils/moz_utils.dart';

print(MozUtils.buildWhatsAppUrl('841234567', 'Olá Formiga Antonio, bem-vindo a Nampula!'));
// "https://wa.me/258841234567?text=Ol%C3%A1%20Formiga%20Antonio%2C%20bem-vindo%20a%20Nampula%21"
```

---

### 3. National Currency

#### `MozUtils.formatMZN(double value, [String currency = 'MT']): String`
Formats monetary values in Meticais according to the official local standard (e.g., `1 500,00 MT`).
```dart
import 'package:moz_utils/moz_utils.dart';

print(MozUtils.formatMZN(1250.5));          // "1 250,50 MT"
print(MozUtils.formatMZN(10000000, 'MZN')); // "10 000 000,00 MZN"
```

---

### 4. Legacy Postal Codes

#### `MozUtils.isValidPostalCode(String code): bool`
Validates if a legacy postal code of Moçambique is valid (exactly 4 digits belonging to the classic system of the Correios de Moçambique).
```dart
import 'package:moz_utils/moz_utils.dart';

print(MozUtils.isValidPostalCode('1100'));   // true
print(MozUtils.isValidPostalCode('1199'));   // false
```

#### `MozUtils.getPostalCodeLocality(String code): String?`
Returns the locality associated with the legacy postal code, or `null`.
```dart
import 'package:moz_utils/moz_utils.dart';

print(MozUtils.getPostalCodeLocality('1100')); // "Maputo ECP (Sede)"
```

#### `MozUtils.getPostalCodeProvince(String code): String?`
Returns the province associated with the legacy postal code, or `null`.
```dart
import 'package:moz_utils/moz_utils.dart';

print(MozUtils.getPostalCodeProvince('1100')); // "Maputo"
```

---

### 5. Geographical Database

```dart
import 'package:moz_utils/moz_utils.dart';

// 1. Get the complete list containing all provinces, districts, posts, and neighborhoods
final provinces = MozUtils.getMozambiqueProvinces();

// 2. Get districts of a specific province (e.g., 'npl' for Nampula)
final districts = MozUtils.getDistrictsByProvince('npl'); // ['Angoche', 'Eráti', ...]

// 3. Get all flat districts of the country
final allDistricts = MozUtils.getAllDistricts();
```

## 📄 License

This project is licensed under the **AGPL-3.0-or-later** license.

---

<p align="center">
  Developed by <b>Edmilson Muacigarro</b> and contributors.
</p>
