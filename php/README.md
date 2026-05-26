<h1 align="center">moz-utils</h1>

<p align="center">
  <b>PHP</b>
</p>

<p align="center">
  <i>The Swiss Army Knife for developers in Mozambique — ported to PHP. Ideal for integration with Laravel, Symfony, WordPress, and modern PHP applications.</i>
</p>

---

## 📦 Installation

You can install the library via Composer locally (pointing to the local directory path) or using VCS:

```json
// In your project's composer.json
{
    "repositories": [
        {
            "type": "path",
            "url": "../path/to/moz-utils/php"
        }
    ],
    "require": {
        "iradoweck/moz-utils": "*"
    }
}
```

Then run:
```bash
composer update
```

---

## 🚀 API Reference Guide

All utilities are exposed as static methods on the `Iradoweck\MozUtils\MozUtils` class.

### 1. Document Validation

#### `MozUtils::isValidNUIT(string|int $nuit): bool`
Validates if a NUIT (Unique Tax Identification Number) is syntactically valid according to the Modulo 11 rules of the Tax Authority (AT).
```php
use Iradoweck\MozUtils\MozUtils;

MozUtils::isValidNUIT('123456789'); // true
MozUtils::isValidNUIT(111111111);   // false
```

#### `MozUtils::getNUITEntityType(string|int $nuit): ?string`
Returns the entity type based on the provided NUIT. Returns `null` if the NUIT is invalid.
```php
use Iradoweck\MozUtils\MozUtils;

MozUtils::getNUITEntityType('100000008'); // "Singular (Cidadãos nacionais/estrangeiros e ENI)"
MozUtils::getNUITEntityType('400000006'); // "Colectiva (Sociedades por Quotas, SA, Lda, Associações)"
```

#### `MozUtils::isValidBI(string $bi): bool`
Validates the Mozambican National Identity Card (BI) (12 digits + 1 letter). It ignores spaces and dashes.
```php
use Iradoweck\MozUtils\MozUtils;

MozUtils::isValidBI('110101234567A');  // true
MozUtils::isValidBI('110101234567 a');  // true
```

---

### 2. Telecommunications and WhatsApp

#### `MozUtils::isValidMozambicanPhone(string $phone): bool`
Validates if the number is from Mozambique and belongs to one of the local mobile carriers (Vodacom, Tmcel, or Movitel).
```php
use Iradoweck\MozUtils\MozUtils;

MozUtils::isValidMozambicanPhone('841234567');     // true
MozUtils::isValidMozambicanPhone('+258861234567'); // true
```

#### `MozUtils::formatMozambicanPhone(string $phone): string`
Formats the phone number to the standard international display format: `+258 XX XXX XXXX`. Throws an `InvalidArgumentException` if the number is invalid.
```php
use Iradoweck\MozUtils\MozUtils;

MozUtils::formatMozambicanPhone('841234567'); // "+258 84 123 4567"
```

#### `MozUtils::getMobileOperator(string $phone): ?string`
Identifies and returns the mobile carrier name (`'Vodacom'`, `'Tmcel'`, or `'Movitel'`).
```php
use Iradoweck\MozUtils\MozUtils;

MozUtils::getMobileOperator('841234567'); // "Vodacom"
```

#### `MozUtils::buildWhatsAppUrl(string $phone, string $message = ''): string`
Generates a direct link to initiate a WhatsApp conversation.
```php
use Iradoweck\MozUtils\MozUtils;

MozUtils::buildWhatsAppUrl('841234567', 'Olá Formiga Antonio, bem-vindo a Nampula!');
// "https://wa.me/258841234567?text=Ol%C3%A1%20Formiga%20Antonio%2C%20bem-vindo%20a%20Nampula%21"
```

---

### 3. National Currency

#### `MozUtils::formatMZN(float $value, string $currency = 'MT'): string`
Formats monetary values in Meticais according to the official local standard (e.g., `-1 500,00 MT`).
```php
use Iradoweck\MozUtils\MozUtils;

MozUtils::formatMZN(1250.5);          // "1 250,50 MT"
MozUtils::formatMZN(10000000, 'MZN'); // "10 000 000,00 MZN"
```

---

### 4. Legacy Postal Codes

#### `MozUtils::isValidPostalCode(string $code): bool`
Validates if a legacy postal code of Moçambique is valid (exactly 4 digits belonging to the classic system of the Correios de Moçambique).
```php
use Iradoweck\MozUtils\MozUtils;

MozUtils::isValidPostalCode('1100');   // true
MozUtils::isValidPostalCode('1199');   // false
```

#### `MozUtils::getPostalCodeLocality(string $code): ?string`
Returns the locality associated with the legacy postal code, or `null`.
```php
use Iradoweck\MozUtils\MozUtils;

MozUtils::getPostalCodeLocality('1100'); // "Maputo ECP (Sede)"
```

#### `MozUtils::getPostalCodeProvince(string $code): ?string`
Returns the province associated with the legacy postal code, or `null`.
```php
use Iradoweck\MozUtils\MozUtils;

MozUtils::getPostalCodeProvince('1100'); // "Maputo"
```

---

### 5. Geographical Database

```php
use Iradoweck\MozUtils\MozUtils;

// 1. Get an array containing all provinces, districts, administrative posts, and neighborhoods
$provinces = MozUtils::getMozambiqueProvinces();

// 2. Get districts of a specific province (e.g., 'npl' for Nampula)
$districts = MozUtils::getDistrictsByProvince('npl'); // ['Angoche', 'Eráti', ...]

// 3. Get all flat districts of the country
$allDistricts = MozUtils::getAllDistricts();
```

## 📄 License

This project is licensed under the **AGPL-3.0-or-later** license.

---

<p align="center">
  Developed by <b>Edmilson Muacigarro</b> and contributors.
</p>
