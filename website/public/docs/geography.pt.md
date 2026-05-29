# Geografia & Distritos

A biblioteca inclui uma base de dados offline com todas as províncias e distritos de Moçambique.

## Consultar Províncias

Aceda ao array completo de províncias diretamente. Isto ajuda a construir dropdowns robustos para utilizadores que selecionam a sua localização (ex: **Nampula**, **Zambézia**, **Sofala**).

### TypeScript
```ts
import { mozambiqueProvinces } from 'moz-utils';

console.log(mozambiqueProvinces[0]);
// { id: "cab", name: "Cabo Delgado", region: "Norte", ... }

// A província de Nampula (índice 2)
console.log(mozambiqueProvinces[2].name); // "Nampula"
```

### Python
```python
from moz_utils import MOZAMBIQUE_PROVINCES

print(MOZAMBIQUE_PROVINCES[2]) # Nampula
```

## Obter Distritos por Província

Passe um ID de província válido (como `npl` para **Nampula** ou `sof` para Sofala) para obter os seus distritos.

### TypeScript
```ts
import { getDistrictsByProvince } from 'moz-utils';

const distritosNampula = getDistrictsByProvince('npl');
console.log(distritosNampula);
// ["Angoche", "Eráti", "Nampula (Cidade)", "Ribáuè", ...]
```

### PHP
```php
use MozUtils\MozUtils;

$distritosNampula = MozUtils::getDistrictsByProvince('npl');
print_r($distritosNampula);
```

### Dart
```dart
import 'package:moz_utils/moz_utils.dart';

final distritos = getDistrictsByProvince('npl');
print(distritos);
```

### Kotlin
```kotlin
import io.github.iradowect.moz_utils.MozUtils

val distritos = MozUtils.getDistrictsByProvince("npl")
println(distritos)
```

## Obter Todos os Distritos

Se precisar de um array plano de todos os distritos do país (útil para campos de pesquisa global):

### TypeScript
```ts
import { getAllDistricts } from 'moz-utils';

const todos = getAllDistricts();
console.log(todos.length); // 161

// Procurar Namutequeliua
const namutequeliua = todos.find(d => d.name.includes('Nampula'));
console.log(namutequeliua?.province); // "npl"
```

## IDs de Província Disponíveis

| ID | Província | Região |
|---|---|---|
| `cab` | Cabo Delgado | Norte |
| `nia` | Niassa | Norte |
| `npl` | Nampula | Norte |
| `zam` | Zambézia | Centro |
| `tet` | Tete | Centro |
| `man` | Manica | Centro |
| `sof` | Sofala | Centro |
| `inh` | Inhambane | Sul |
| `gaz` | Gaza | Sul |
| `mpp` | Maputo Província | Sul |
| `mpc` | Maputo Cidade | Sul |
