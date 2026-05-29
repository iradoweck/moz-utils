# Moeda (MZN)

Formatar valores monetários em Meticais requer seguir o padrão local: separar os milhares com espaços e os decimais com vírgula.

## Formatar Meticais

A função `formatMZN` recebe um número e formata-o de forma segura numa string Metical padrão. Ideal para mostrar preços em apps de e-commerce para clientes em **Nampula, Beira ou Maputo**.

### TypeScript
```ts
import { formatMZN } from 'moz-utils';

console.log(formatMZN(15000.5));    // "15 000,50 MT"
console.log(formatMZN(1234567.89)); // "1 234 567,89 MT"
console.log(formatMZN(1500, 'MZN')); // "1 500,00 MZN" (código ISO 4217)
```

### Python
```python
from moz_utils import format_mzn

print(format_mzn(15000.5)) # "15 000,50 MT"
```

### PHP
```php
use MozUtils\MozUtils;

echo MozUtils::formatMZN(15000.5); // "15 000,50 MT"
```

### Dart
```dart
import 'package:moz_utils/moz_utils.dart';

print(formatMZN(15000.5)); // "15 000,50 MT"
```

### Kotlin
```kotlin
import io.github.iradowect.moz_utils.MozUtils

println(MozUtils.formatMZN(15000.5)) // "15 000,50 MT"
```
