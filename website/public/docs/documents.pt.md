# Documentos de Identidade

Os cidadãos moçambicanos usam vários documentos legais de identificação. Os mais comuns são o BI (Bilhete de Identidade) e o NUIT (Número Único de Identificação Tributária). Validar estes dados de forma rigorosa previne registos fraudulentos em sistemas implementados em **Maputo, Nampula** ou qualquer outra província.

## Validar o NUIT

O NUIT usa um dígito de controlo baseado no Módulo 11. A biblioteca valida o algoritmo matemático exato usado pela Autoridade Tributária (AT).

### TypeScript
```ts
import { isValidNUIT } from 'moz-utils';

// Validar o NUIT de uma empresa registada na Beira
console.log(isValidNUIT("400000008")); // true
console.log(isValidNUIT("400000009")); // false
```

### Python
```python
from moz_utils import is_valid_nuit

print(is_valid_nuit("400000008")) # True
```

### PHP
```php
use MozUtils\MozUtils;

echo MozUtils::isValidNUIT("400000008"); // 1 (true)
```

### Dart
```dart
import 'package:moz_utils/moz_utils.dart';

print(isValidNUIT('400000008')); // true
```

### Kotlin
```kotlin
import io.github.iradowect.moz_utils.MozUtils

println(MozUtils.isValidNUIT("400000008")) // true
```

## Identificar o Tipo de Entidade

Determine que tipo de entidade um NUIT representa, com base no seu primeiro dígito.

### TypeScript
```ts
import { getNUITEntityType } from 'moz-utils';

console.log(getNUITEntityType("400000008")); // "Singular (Cidadãos nacionais/estrangeiros e ENI)"
console.log(getNUITEntityType("500000008")); // "Público (Instituições do Estado e Ministérios)"
```

## Validar o Bilhete de Identidade (BI)

Um BI deve ter exatamente 12 dígitos seguidos de uma única letra maiúscula.

### TypeScript
```ts
import { isValidBI } from 'moz-utils';

// Utilizador de Nampula a registar com o BI
console.log(isValidBI("123456789123A")); // true
console.log(isValidBI("12345A6789123")); // false
```

### Python
```python
from moz_utils import is_valid_bi

print(is_valid_bi("123456789123A")) # True
```

## Passaporte e DIRE

Outros documentos como Passaportes e DIRE (Documento de Identificação de Residente Estrangeiro) também podem ser validados.

### TypeScript
```ts
import { isValidPassport, isValidDIRE, isValidDrivingLicense } from 'moz-utils';

console.log(isValidPassport("AO1234567")); // true
console.log(isValidDIRE("00008312C"));    // true
console.log(isValidDrivingLicense("M123456")); // true
```
