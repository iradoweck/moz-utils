# Moeda (MZN)

Formatar e manipular valores monetários em Meticais exige rigor com as convenções locais: separador de milhares por espaço, decimais com vírgula e símbolos oficiais (`MT` ou `MZN` conforme a norma ISO 4217).

---

## 💶 Fluxo de Conversão e Parsing

```mermaid
flowchart LR
    Raw["String Bruta (ex: '15.000,50 MT')"] --> Clean["parseMZN(): Limpar e converter"]
    Clean --> Float["Número (15000.5)"]
    Float --> Format["formatMZN(): Padrão nacional"]
    Format --> Output["'15 000,50 MT'"]
```

---

## Formatar Meticais (`formatMZN`)

A função `formatMZN` converte valores numéricos em strings monetárias oficiais moçambicanas:

<div className="code-tabs" data-labels="TypeScript,Python,PHP,Dart,Kotlin">

```ts
import { formatMZN } from 'moz-utils';

console.log(formatMZN(15000.5));        // "15 000,50 MT"
console.log(formatMZN(1234567.89));     // "1 234 567,89 MT"
console.log(formatMZN(1500, 'MZN'));     // "1 500,00 MZN"
console.log(formatMZN(250, 'MT', true)); // "MT 250,00" (símbolo à esquerda)
```

```python
from moz_utils import format_mzn

print(format_mzn(15000.5))        # "15 000,50 MT"
print(format_mzn(1234567.89))     # "1 234 567,89 MT"
print(format_mzn(1500, 'MZN'))     # "1 500,00 MZN"
```

```php
use MozUtils\MozUtils;

echo MozUtils::formatMZN(15000.5);        // "15 000,50 MT"
echo MozUtils::formatMZN(1234567.89);     // "1 234 567,89 MT"
echo MozUtils::formatMZN(1500, 'MZN');     // "1 500,00 MZN"
```

```dart
import 'package:moz_utils/moz_utils.dart';

print(formatMZN(15000.5));        // "15 000,50 MT"
print(formatMZN(1234567.89));     // "1 234 567,89 MT"
print(formatMZN(1500, currency: 'MZN')); // "1 500,00 MZN"
```

```kotlin
import com.edmilsonmuacigarro.mozutils.MozUtils

println(MozUtils.formatMZN(15000.5))        // "15 000,50 MT"
println(MozUtils.formatMZN(1234567.89))     // "1 234 567,89 MT"
println(MozUtils.formatMZN(1500.0, "MZN"))  // "1 500,00 MZN"
```

</div>

---

## Converter Strings Financeiras para Número (`parseMZN`)

Muitas vezes recebemos valores formatados pelo utilizador ou provenientes de APIs de SMS/M-Pesa. A função `parseMZN` sanitiza e converte para número em ponto flutuante:

<div className="code-tabs" data-labels="TypeScript,Python,PHP,Dart,Kotlin">

```ts
import { parseMZN } from 'moz-utils';

console.log(parseMZN("15 000,50 MT"));  // 15000.5
console.log(parseMZN("MT 1.250,00"));   // 1250
console.log(parseMZN("250,75 MZN"));    // 250.75
```

```python
from moz_utils import parse_mzn

print(parse_mzn("15 000,50 MT"))  # 15000.5
print(parse_mzn("MT 1.250,00"))   # 1250.0
```

```php
use MozUtils\MozUtils;

echo MozUtils::parseMZN("15 000,50 MT");  // 15000.5
echo MozUtils::parseMZN("MT 1.250,00");   // 1250
```

```dart
import 'package:moz_utils/moz_utils.dart';

print(parseMZN('15 000,50 MT'));  // 15000.5
```

```kotlin
import com.edmilsonmuacigarro.mozutils.MozUtils

println(MozUtils.parseMZN("15 000,50 MT"))  // 15000.5
```

</div>
