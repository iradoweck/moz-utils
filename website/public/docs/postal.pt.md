# Códigos Postais (CEP)

Moçambique está em transição do antigo código de 4 dígitos (Correios de Moçambique) para um novo CEP moderno de 6 dígitos (Código de Endereçamento Postal). O `moz-utils` suporta ambos!

## Validar o Novo CEP

O novo formato é `XXXX-XX`.

<div className="code-tabs" data-labels="TypeScript,Python,PHP">

```ts
import { isValidNewCEP } from 'moz-utils';

// Ex.: CEP de Namutequeliua, Nampula
console.log(isValidNewCEP("3100-05")); // true
console.log(isValidNewCEP("310005"));  // false (falta o hífen)
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

## Pesquisar e Sugerir CEPs

Pesquise na base de dados interna usando um CEP parcial ou o nome de uma localidade. Extremamente útil para campos de endereço com autocomplete.

<div className="code-tabs" data-labels="TypeScript,Dart,Kotlin">

```ts
import { suggestCEPs } from 'moz-utils';

const resultados = suggestCEPs("namutequeliua");
console.log(resultados[0]);
// { cep: "3100-05", province: "Nampula", district: "Nampula", locality: "Namutequeliua" }
```

```dart
import 'package:moz_utils/moz_utils.dart';

final resultados = suggestCEPs('namutequeliua');
print(resultados[0].cep);
```

```kotlin
import io.github.iradowect.moz_utils.MozUtils

val resultados = MozUtils.suggestCEPs("namutequeliua")
println(resultados[0].cep)
```

</div>

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

## ⚙️ A Mecânica Interna: O Novo CEP

O Novo Código de Endereçamento Postal (CEP) de Moçambique abandona o sistema antigo de 4 dígitos em favor de um formato numérico geo-espacial (`XXXX-XX`).
O `moz-utils` não faz apenas validação por Regex. Nós portámos a árvore inteira do mapeamento geográfico oficial.

**Como o Formato é Lido:**
Exemplo: `0101-01`
- `01` (Primeiros 2 dígitos): **Província** (Maputo Cidade)
- `01` (Dígitos do meio): **Distrito / Bairro** (KaMpfumo)
- `01` (Últimos 2 dígitos após o hífen): **Localidade / Zona Específica**

A biblioteca valida se o prefixo de província corresponde a uma província real e se o formato global corresponde à sintaxe do decreto oficial dos Correios de Moçambique.
