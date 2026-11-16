# Mozambican Banking Module (NIB & IBAN)

The Mozambican banking system operates under the supervision of the **Bank of Mozambique** (*Banco de Moçambique*) and the national interbank clearing network (**SIMO**). `moz-utils` v0.4.0 introduces complete support for validating, formatting, and identifying bank accounts across Mozambique.

---

## 🏛️ Mozambican NIB Structure (21 Digits)

The **National Bank Identification Number (NIB)** strictly consists of 21 numeric digits divided into four functional blocks:

```mermaid
flowchart LR
    NIB["NIB: 21 Digits"]
    NIB --> B["4 Digits: Bank Code (e.g. 0001)"]
    NIB --> A["4 Digits: Branch / Agency Code"]
    NIB --> C["11 Digits: Account Number"]
    NIB --> D["2 Digits: Check Digits"]
```

### Mathematical Validation (ISO 7064 MOD 97-10)
Mathematical validation follows the international **ISO 7064 Modulo 97-10** standard:
- Interpreting the 21 digits as a Big Integer, the remainder of division by **97** must equal **1** (`BigInt(NIB) % 97 === 1`).
- The institution code (first 4 digits) must belong to the official clearing directory.

---

## 🌍 Mozambican IBAN Structure (25 Characters)

Following international standard ISO 13616 and the central bank directive:
- Country prefix: `MZ` (ISO 3166-1 alpha-2).
- Fixed national check digits: `59`.
- Followed by the 21-digit local NIB.
- **Total length:** 25 alphanumeric characters (e.g., `MZ59000100001234567890194`).

---

## Validate NIB (`isValidNIB`)

<div className="code-tabs" data-labels="TypeScript,Python,PHP,Dart,Kotlin">

```ts
import { isValidNIB } from 'moz-utils';

console.log(isValidNIB('000100001234567890194')); // true (Millennium BIM)
console.log(isValidNIB('000800001234567890194')); // false (checksum mismatch)
console.log(isValidNIB('999900001234567890194')); // false (unknown bank)
```

```python
from moz_utils import is_valid_nib

print(is_valid_nib("000100001234567890194")) # True
print(is_valid_nib("999900001234567890194")) # False
```

```php
use Iradoweck\MozUtils\MozUtils;

echo MozUtils::isValidNIB("000100001234567890194"); // true
```

```dart
import 'package:moz_utils/moz_utils.dart';

print(isValidNIB('000100001234567890194')); // true
```

```kotlin
import com.edmilsonmuacigarro.mozutils.MozUtils

println(MozUtils.isValidNIB("000100001234567890194")) // true
```

</div>

---

## Format NIB (`formatNIB`)

<div className="code-tabs" data-labels="TypeScript,Python,PHP,Dart,Kotlin">

```ts
import { formatNIB } from 'moz-utils';

console.log(formatNIB('000100001234567890194'));
// "0001 0000 12345678901 94"

console.log(formatNIB('000100001234567890194', '.'));
// "0001.0000.12345678901.94"
```

```python
from moz_utils import format_nib

print(format_nib("000100001234567890194"))
# "0001 0000 12345678901 94"
```

```php
use Iradoweck\MozUtils\MozUtils;

echo MozUtils::formatNIB("000100001234567890194");
// "0001 0000 12345678901 94"
```

```dart
import 'package:moz_utils/moz_utils.dart';

print(formatNIB('000100001234567890194'));
// "0001 0000 12345678901 94"
```

```kotlin
import com.edmilsonmuacigarro.mozutils.MozUtils

println(MozUtils.formatNIB("000100001234567890194"))
// "0001 0000 12345678901 94"
```

</div>

---

## Identify Bank from NIB (`getBankFromNIB` / `getBankByNIB`)

<div className="code-tabs" data-labels="TypeScript,Python,PHP,Dart,Kotlin">

```ts
import { getBankFromNIB } from 'moz-utils';

const bank = getBankFromNIB('000100001234567890194');
console.log(bank);
// {
//   code: "0001",
//   name: "Banco Internacional de Moçambique",
//   shortName: "Millennium BIM"
// }
```

```python
from moz_utils import get_bank_from_nib

bank = get_bank_from_nib("000800001234567890123")
print(bank.short_name) # "BCI"
```

```php
use Iradoweck\MozUtils\MozUtils;

$bank = MozUtils::getBankFromNIB("000300001234567890123");
echo $bank['shortName']; // "Standard Bank"
```

```dart
import 'package:moz_utils/moz_utils.dart';

final bank = getBankFromNIB('003400001234567890123');
print(bank?.shortName); // "Moza Banco"
```

```kotlin
import com.edmilsonmuacigarro.mozutils.MozUtils

val bank = MozUtils.getBankFromNIB("000100001234567890194")
println(bank?.shortName) // "Millennium BIM"
```

</div>

---

## Convert to IBAN & Validate (`nibToIBAN` & `isValidIBAN`)

<div className="code-tabs" data-labels="TypeScript,Python,PHP,Dart,Kotlin">

```ts
import { nibToIBAN, isValidIBAN } from 'moz-utils';

const iban = nibToIBAN('000100001234567890194');
console.log(iban); // "MZ59000100001234567890194"

console.log(isValidIBAN('MZ59000100001234567890194')); // true
console.log(isValidIBAN('PT50000100001234567890194')); // false
```

```python
from moz_utils import nib_to_iban, is_valid_iban

iban = nib_to_iban("000100001234567890194")
print(iban) # "MZ59000100001234567890194"
print(is_valid_iban(iban)) # True
```

```php
use Iradoweck\MozUtils\MozUtils;

$iban = MozUtils::nibToIBAN("000100001234567890194");
echo MozUtils::isValidIBAN($iban); // true
```

```dart
import 'package:moz_utils/moz_utils.dart';

final iban = nibToIBAN('000100001234567890194');
print(isValidIBAN(iban)); // true
```

```kotlin
import com.edmilsonmuacigarro.mozutils.MozUtils

val iban = MozUtils.nibToIBAN("000100001234567890194")
println(MozUtils.isValidIBAN(iban)) // true
```

</div>

---

## 📋 Official Commercial Banks in Mozambique

| Code | Short / Commercial Name | Official Legal Name |
| :--- | :--- | :--- |
| `0001` | **Millennium BIM** | Banco Internacional de Moçambique, S.A. |
| `0003` | **Standard Bank** | Standard Bank Moçambique, S.A. |
| `0006` | **Absa** | Absa Bank Moçambique, S.A. |
| `0007` | **Nedbank** | Nedbank Moçambique, S.A. |
| `0008` | **BCI** | Banco Comercial e de Investimentos, S.A. |
| `0014` | **FNB** | First National Bank Moçambique, S.A. |
| `0016` | **Moza Banco** | Moza Banco, S.A. |
| `0021` | **Access Bank** | Access Bank Moçambique, S.A. |
| `0024` | **Ecobank** | Ecobank Moçambique, S.A. |
| `0025` | **BNI** | Banco Nacional de Investimento, S.A. |
| `0030` | **Société Générale** | Société Générale Moçambique, S.A. |
| `0034` | **Moza Banco** | Moza Banco, S.A. |
| `0038` | **First Capital Bank**| First Capital Bank Moçambique, S.A. |
| `0041` | **Letshego** | Banco Letshego, S.A. |
| `0043` | **First Capital Bank**| First Capital Bank Moçambique, S.A. |
| `0044` | **MyBucks** | MyBucks Banking Corporation, S.A. |
| `0045` | **BDM** | Banco de Desenvolvimento de Moçambique, S.A. |
| `0048` | **Banco Mais** | Banco Mais, S.A. |
| `0050` | **Standard Chartered** | Standard Chartered Bank Moçambique, S.A. |
| `0052` | **Banco Big** | Banco Big Moçambique, S.A. |
| `0056` | **Letshego** | Banco Letshego, S.A. |
| `0057` | **BNI** | Banco Nacional de Investimento, S.A. |
