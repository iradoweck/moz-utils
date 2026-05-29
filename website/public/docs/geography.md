# Geography & Districts

The library comes embedded with an offline database containing all the provinces and districts of Mozambique.

## Fetching Provinces

You can access the full array of provinces directly. This helps you build robust dropdowns for users selecting their location (e.g. **Nampula**, **Zambézia**, **Sofala**).

### TypeScript
```ts
import { mozambiqueProvinces } from 'moz-utils';

console.log(mozambiqueProvinces[0]);
// { id: "cab", name: "Cabo Delgado", region: "Norte", ... }
```

### Python
```python
from moz_utils import MOZAMBIQUE_PROVINCES

print(MOZAMBIQUE_PROVINCES[2]) # Nampula
```

## Fetching Districts by Province

Pass a valid province ID (like `npl` for **Nampula** or `sof` for Sofala) to get its respective districts.

### TypeScript
```ts
import { getDistrictsByProvince } from 'moz-utils';

const nampulaDistricts = getDistrictsByProvince('npl');
console.log(nampulaDistricts);
// ["Angoche", "Eráti", "Nampula (Cidade)", "Ribáuè", ...]
```

### PHP
```php
use MozUtils\MozUtils;

$nampulaDistricts = MozUtils::getDistrictsByProvince('npl');
print_r($nampulaDistricts);
```

### Dart
```dart
import 'package:moz_utils/moz_utils.dart';

final districts = getDistrictsByProvince('npl');
print(districts);
```

### Kotlin
```kotlin
import io.github.iradoweck.moz_utils.MozUtils

val districts = MozUtils.getDistrictsByProvince("npl")
println(districts)
```

## Getting All Districts

If you need a flat array of all districts in the country (useful for global search inputs):

### TypeScript
```ts
import { getAllDistricts } from 'moz-utils';

console.log(getAllDistricts().length); // 161
```
