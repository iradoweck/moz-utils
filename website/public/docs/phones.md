# Phones & Mobile

Validating and extracting information from Mozambican mobile numbers is one of the most common requirements for local applications, whether you are building a delivery app in **Nampula**, an e-commerce store in **Beira**, or a fintech in **Maputo**. 

The library fully supports **Vodacom**, **Tmcel**, and **Movitel**.

## Validating a Phone Number

The `isValidMozambicanPhone` function checks if the number belongs to one of the official telecom operators. It intelligently strips out spaces, dashes, and country codes (`+258` ou `00258`).

### TypeScript / Node.js
```ts
import { isValidMozambicanPhone } from 'moz-utils';

// Example: Validating a customer from Namutequeliua (Nampula)
console.log(isValidMozambicanPhone("841234567")); // true
console.log(isValidMozambicanPhone("+258 82 123 4567")); // true
console.log(isValidMozambicanPhone("811234567")); // false (No operator uses 81)
```

### Python
```python
from moz_utils import is_valid_mozambican_phone

print(is_valid_mozambican_phone("841234567")) # True
```

### PHP
```php
use MozUtils\MozUtils;

echo MozUtils::isValidMozambicanPhone("841234567"); // 1 (true)
```

### Dart
```dart
import 'package:moz_utils/moz_utils.dart';

print(isValidMozambicanPhone('841234567')); // true
```

### Kotlin
```kotlin
import io.github.iradoweck.moz_utils.MozUtils

println(MozUtils.isValidMozambicanPhone("841234567")) // true
```

## Extracting the Operator
You can discover which network a number belongs to. This is especially useful for targeting promotions in specific regions like **Nampula**.

### TypeScript
```ts
import { getMobileOperator } from 'moz-utils';

console.log(getMobileOperator("841234567")); // "Vodacom"
console.log(getMobileOperator("821234567")); // "Tmcel"
console.log(getMobileOperator("861234567")); // "Movitel"
```

### Python
```python
from moz_utils import get_mobile_operator

print(get_mobile_operator("841234567")) # "Vodacom"
```

## Identifying Mobile Wallets
A number can also be mapped to its corresponding mobile money platform (M-Pesa, e-Mola, mKesh).

### TypeScript
```ts
import { getMobileWallet } from 'moz-utils';

console.log(getMobileWallet("841234567")); // "M-Pesa"
console.log(getMobileWallet("861234567")); // "e-Mola"
```

## Formatting to International Standard
To store the number safely in your database, always format it to the international standard.

### TypeScript
```ts
import { formatMozambicanPhone } from 'moz-utils';

console.log(formatMozambicanPhone("84 123 4567")); // "+258841234567"
```

## Generating WhatsApp Links
Want to redirect your users to WhatsApp directly?

### TypeScript
```ts
import { buildWhatsAppUrl } from 'moz-utils';

// E.g.: A buyer from Namutequeliua, Nampula
const url = buildWhatsAppUrl("841234567", "Olá, estou em Nampula e quero comprar!");
console.log(url); 
// "https://wa.me/258841234567?text=Ol%C3%A1%2C%20estou%20em%20Nampula%20e%20quero%20comprar%21"
```
