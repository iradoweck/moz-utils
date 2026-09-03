# Postal Codes (CEP)

Mozambique recently transitioned from the classic 4-digit code (Correios de Moçambique) to a modern 6-digit CEP (Código de Endereçamento Postal). `moz-utils` supports both!

## Validating New CEP
The new format looks like `XXXX-XX`.

<div className="code-tabs" data-labels="TypeScript,Python,PHP">

```ts
import { isValidNewCEP } from 'moz-utils';

// E.g.: CEP for Namutequeliua, Nampula
console.log(isValidNewCEP("3100-05")); // true
console.log(isValidNewCEP("310005")); // false
```

```python
from moz_utils import is_valid_new_cep

print(is_valid_new_cep("3100-05")) # True
```

```php
use MozUtils\MozUtils;

echo MozUtils::isValidNewCEP("3100-05"); // 1 (true)
```

</div>

## Searching and Suggesting CEPs
You can query the internal database using a partial CEP or locality name. This is extremely useful for building autocomplete address fields.

<div className="code-tabs" data-labels="TypeScript,Dart,Kotlin">

```ts
import { suggestCEPs } from 'moz-utils';

const results = suggestCEPs("namutequeliua");
console.log(results[0]); 
// { cep: "3100-05", province: "Nampula", district: "Nampula", locality: "Namutequeliua" }
```

```dart
import 'package:moz_utils/moz_utils.dart';

final results = suggestCEPs('namutequeliua');
print(results[0].cep);
```

```kotlin
import io.github.iradowect.moz_utils.MozUtils

val results = MozUtils.suggestCEPs("namutequeliua")
println(results[0].cep)
```

</div>

## Legacy Postal Codes
If you still use the 4-digit codes, you can validate and extract information from them.

### TypeScript
```ts
import { isValidPostalCode, getPostalCodeLocality } from 'moz-utils';

console.log(isValidPostalCode("3100")); // true
console.log(getPostalCodeLocality("3100")); // "Nampula"
```

## ⚙️ Under the Hood: The New CEP

The New Postal Addressing Code (CEP) of Mozambique abandons the old 4-digit system in favor of a geospatial alphanumeric format (`XXXX-XX`).
`moz-utils` doesn't just do Regex validation. We ported the entire official geographic mapping tree.

**How the Format is Read:**
Example: `0101-01`
- `01` (First 2 digits): **Province** (Maputo Cidade)
- `01` (Middle digits): **District / Neighborhood** (KaMpfumo)
- `01` (Last 2 digits after the hyphen): **Locality / Specific Zone**

The library validates whether the province prefix corresponds to a real province and whether the overall format matches the syntax from the official decree by Correios de Moçambique.
