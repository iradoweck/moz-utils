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

## Passaporte, DIRE e Carta de Condução

Outros documentos como Passaportes, DIRE (Documento de Identificação de Residente Estrangeiro) e a Carta de Condução também podem ser validados. A biblioteca suporta a retrocompatibilidade dos formatos.

Para o **DIRE**, é suportado o formato legado (ex: `00008312C` ou `12C00008312C`) e o novo formato do SENAMI (9 dígitos e 1 letra, ex: `120345678A`).
Para a **Carta de Condução**, é suportado o formato legado (ex: `M123456` ou `123456789123A`) e o novo formato biométrico do INATRO (2 letras e 7 dígitos, ex: `MP1234567`).

### TypeScript
```ts
import { isValidPassport, isValidDIRE, isValidDrivingLicense } from 'moz-utils';

console.log(isValidPassport("AO1234567")); // true

// Validação de DIRE (Legado e Moderno)
console.log(isValidDIRE("00008312C"));    // true
console.log(isValidDIRE("120345678A"));   // true

// Validação da Carta de Condução (Legado e Moderno)
console.log(isValidDrivingLicense("M123456")); // true
console.log(isValidDrivingLicense("MP1234567")); // true
```
