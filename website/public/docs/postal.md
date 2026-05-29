# Postal Codes (CEP)

Mozambique recently transitioned from the classic 4-digit code (Correios de Moçambique) to a modern 6-digit CEP (Código de Endereçamento Postal). `moz-utils` supports both!

## Validating New CEP
The new format looks like `XXXX-XX`.

### TypeScript
```ts
import { isValidNewCEP } from 'moz-utils';

// E.g.: CEP for Namutequeliua, Nampula
console.log(isValidNewCEP("3100-05")); // true
console.log(isValidNewCEP("310005")); // false
```

### Python
```python
from moz_utils import is_valid_new_cep

print(is_valid_new_cep("3100-05")) # True
```

### PHP
```php
use MozUtils\MozUtils;

echo MozUtils::isValidNewCEP("3100-05"); // 1 (true)
```

## Searching and Suggesting CEPs
You can query the internal database using a partial CEP or locality name. This is extremely useful for building autocomplete address fields.

### TypeScript
```ts
import { suggestCEPs } from 'moz-utils';

const results = suggestCEPs("namutequeliua");
console.log(results[0]); 
// { cep: "3100-05", province: "Nampula", district: "Nampula", locality: "Namutequeliua" }
```

### Dart
```dart
import 'package:moz_utils/moz_utils.dart';

final results = suggestCEPs('namutequeliua');
print(results[0].cep);
```

### Kotlin
```kotlin
import io.github.iradoweck.moz_utils.MozUtils

val results = MozUtils.suggestCEPs("namutequeliua")
println(results[0].cep)
```

## Legacy Postal Codes
If you still use the 4-digit codes, you can validate and extract information from them.

### TypeScript
```ts
import { isValidPostalCode, getPostalCodeLocality } from 'moz-utils';

console.log(isValidPostalCode("3100")); // true
console.log(getPostalCodeLocality("3100")); // "Nampula"
```
