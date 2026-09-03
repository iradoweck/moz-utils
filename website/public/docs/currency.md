# Currency (MZN)

Formatting monetary values in Meticais requires following the local standard: separating thousands with spaces, and separating decimals with a comma.

## Formatting Meticais

The `formatMZN` function receives a number and formats it safely into a standard Metical string. This is ideal for showing product prices in e-commerce apps for customers in **Nampula, Beira or Maputo**.

<div className="code-tabs" data-labels="TypeScript,Python,PHP,Dart,Kotlin">

```ts
import { formatMZN } from 'moz-utils';

console.log(formatMZN(15000.5)); // "15 000,50 MT"
console.log(formatMZN(1234567.89)); // "1 234 567,89 MT"
```

```python
from moz_utils import format_mzn

print(format_mzn(15000.5)) # "15 000,50 MT"
```

```php
use MozUtils\MozUtils;

echo MozUtils::formatMZN(15000.5); // "15 000,50 MT"
```

```dart
import 'package:moz_utils/moz_utils.dart';

print(formatMZN(15000.5)); // "15 000,50 MT"
```

```kotlin
import io.github.iradoweck.moz_utils.MozUtils

println(MozUtils.formatMZN(15000.5)) // "15 000,50 MT"
```

</div>
