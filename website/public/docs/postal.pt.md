# Códigos Postais (CEP)

Moçambique está em transição do antigo código de 4 dígitos (Correios de Moçambique) para um novo CEP moderno de 6 dígitos (Código de Endereçamento Postal). O `moz-utils` suporta ambos!

## Validar o Novo CEP

O novo formato é `XXXX-XX`.

### TypeScript
```ts
import { isValidNewCEP } from 'moz-utils';

// Ex.: CEP de Namutequeliua, Nampula
console.log(isValidNewCEP("3100-05")); // true
console.log(isValidNewCEP("310005"));  // false (falta o hífen)
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

## Pesquisar e Sugerir CEPs

Pesquise na base de dados interna usando um CEP parcial ou o nome de uma localidade. Extremamente útil para campos de endereço com autocomplete.

### TypeScript
```ts
import { suggestCEPs } from 'moz-utils';

const resultados = suggestCEPs("namutequeliua");
console.log(resultados[0]);
// { cep: "3100-05", province: "Nampula", district: "Nampula", locality: "Namutequeliua" }
```

### Dart
```dart
import 'package:moz_utils/moz_utils.dart';

final resultados = suggestCEPs('namutequeliua');
print(resultados[0].cep);
```

### Kotlin
```kotlin
import io.github.iradowect.moz_utils.MozUtils

val resultados = MozUtils.suggestCEPs("namutequeliua")
println(resultados[0].cep)
```

## Códigos Postais Legados

Se ainda usar os códigos de 4 dígitos, pode validar e extrair informação deles.

### TypeScript
```ts
import { isValidPostalCode, getPostalCodeLocality, getPostalCodeProvince } from 'moz-utils';

console.log(isValidPostalCode("3100"));       // true
console.log(getPostalCodeLocality("3100"));   // "Nampula ECP"
console.log(getPostalCodeProvince("3100"));   // "Nampula"

// Beira
console.log(getPostalCodeLocality("2100"));   // "Beira ECP"
// Maputo
console.log(getPostalCodeLocality("1100"));   // "Maputo ECP (Sede)"
```
