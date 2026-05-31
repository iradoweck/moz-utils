# Identity Documents

Mozambican citizens use several legal documents for identification. The most common are the BI (Identity Card) and NUIT (Tax ID). Validating these strictly prevents fraudulent registrations in systems deployed in **Maputo, Nampula**, or any other province.

## Validating NUIT
The NUIT uses a Modulo 11 check digit. The library validates the exact math algorithm used by the Tax Authority (Autoridade Tributária - AT).

### TypeScript
```ts
import { isValidNUIT } from 'moz-utils';

// Validating a NUIT for a company registered in Beira
console.log(isValidNUIT("400000008")); // true
console.log(isValidNUIT("400000009")); // false
```

### Python
```python
from moz_utils import is_valid_nuit

print(is_valid_nuit("400000008")) # True
```

### PHP
```php
use MozUtils\MozUtils;

echo MozUtils::isValidNUIT("400000008"); // 1 (true)
```

### Dart
```dart
import 'package:moz_utils/moz_utils.dart';

print(isValidNUIT('400000008')); // true
```

### Kotlin
```kotlin
import io.github.iradoweck.moz_utils.MozUtils

println(MozUtils.isValidNUIT("400000008")) // true
```

## Identify Entity Type
You can also determine what kind of entity a NUIT belongs to based on the first digit.

### TypeScript
```ts
import { getNUITEntityType } from 'moz-utils';

console.log(getNUITEntityType("400000008")); // "Singular" (Individual)
console.log(getNUITEntityType("500000008")); // "Sociedade" (Corporate)
```

## Validating Identity Cards (BI)
A BI must have exactly 12 digits followed by a single uppercase letter.

### TypeScript
```ts
import { isValidBI } from 'moz-utils';

// User from Nampula registering with BI
console.log(isValidBI("123456789123A")); // true
console.log(isValidBI("12345A6789123")); // false
```

### Python
```python
from moz_utils import is_valid_bi

print(is_valid_bi("123456789123A")) # True
```

## Passports, DIRE & Driving License

Other documents like Passports, DIRE (Documento de Identificação de Residente Estrangeiro), and Driving Licenses can also be validated. The library supports backwards compatibility for document formats.

For **DIRE**, it supports the legacy format (e.g., `00008312C` or `12C00008312C`) and the new SENAMI format (9 digits and 1 letter, e.g., `120345678A`).
For the **Driving License**, it supports the legacy format (e.g., `M123456` or `123456789123A`) and the new INATRO biometric format (2 letters and 7 digits, e.g., `MP1234567`).

### TypeScript
```ts
import { isValidPassport, isValidDIRE, isValidDrivingLicense } from 'moz-utils';

console.log(isValidPassport("AO1234567")); // true

// Validate DIRE (Legacy and Modern)
console.log(isValidDIRE("00008312C"));    // true
console.log(isValidDIRE("120345678A"));   // true

// Validate Driving License (Legacy and Modern)
console.log(isValidDrivingLicense("M123456")); // true
console.log(isValidDrivingLicense("MP1234567")); // true
```
