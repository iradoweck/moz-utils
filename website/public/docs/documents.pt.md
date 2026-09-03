# Documentos de Identidade

Os cidadãos moçambicanos usam vários documentos legais de identificação. Os mais comuns são o BI (Bilhete de Identidade) e o NUIT (Número Único de Identificação Tributária). Validar estes dados de forma rigorosa previne registos fraudulentos em sistemas implementados em **Maputo, Nampula** ou qualquer outra província.

## Validar o NUIT

O NUIT usa um dígito de controlo baseado no Módulo 11. A biblioteca valida o algoritmo matemático exato usado pela Autoridade Tributária (AT).

<div className="code-tabs" data-labels="TypeScript,Python,PHP,Dart,Kotlin">

```ts
import { isValidNUIT } from 'moz-utils';

// Validar o NUIT de uma empresa registada na Beira
console.log(isValidNUIT("400000008")); // true
console.log(isValidNUIT("400000009")); // false
```

```python
from moz_utils import is_valid_nuit

print(is_valid_nuit("400000008")) # True
```

```php
use MozUtils\MozUtils;

echo MozUtils::isValidNUIT("400000008"); // 1 (true)
```

```dart
import 'package:moz_utils/moz_utils.dart';

print(isValidNUIT('400000008')); // true
```

```kotlin
import io.github.iradowect.moz_utils.MozUtils

println(MozUtils.isValidNUIT("400000008")) // true
```

</div>

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

<div className="code-tabs" data-labels="TypeScript,Python">

```ts
import { isValidBI } from 'moz-utils';

// Utilizador de Nampula a registar com o BI
console.log(isValidBI("123456789123A")); // true
console.log(isValidBI("12345A6789123")); // false
```

```python
from moz_utils import is_valid_bi

print(is_valid_bi("123456789123A")) # True
```

</div>

## Passaporte, DIRE e Carta de Condução

Outros documentos como Passaportes, DIRE (Documento de Identificação de Residente Estrangeiro) e a Carta de Condução também podem ser validados. A biblioteca suporta a retrocompatibilidade dos formatos.

Para o **DIRE**, é suportado o formato legado (ex: `00008312C` ou `12C00008312C`) e o novo formato do SENAMI (9 dígitos e 1 letra, ex: `120345678A`).
Para a **Carta de Condução**, é suportado o formato legado (ex: `M123456` ou `123456789123A`) e o novo formato biométrico do INATRO (2 letras e 7 dígitos, ex: `MP1234567`).

### TypeScript
```ts
import { isValidPassport, isValidDIRE, isValidDrivingLicense } from 'moz-utils';

</div>

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

## ⚙️ A Mecânica Interna: O Algoritmo NUIT

Ao contrário do NIF de Portugal (que usa multiplicadores de 9 a 2 em ordem decrescente), a Autoridade Tributária de Moçambique utiliza uma matriz de pesos fixa e específica para calcular o Módulo 11 do NUIT.

**A Fórmula e os Pesos Oficiais:**
```text
NUIT a Validar: 401626638

Posição:   1   2   3   4   5   6   7   8
Dígitos:   4   0   1   6   2   6   6   3
Pesos:     8   9   4   5   6   7   8   9
           |   |   |   |   |   |   |   |
Mult:     32 + 0 + 4 +30 +12 +42 +48 +27 = 195 (Soma)

Cálculo do Módulo 11:
1. Resto = Soma % 11
   195 % 11 = 8
2. O "Resto" é o Índice (Posição 0 a 10) na string de controlo "01234567891".
3. A 8ª posição de "01234567891" é '8'.
4. Como o 9º dígito do NUIT (Dígito de Controlo) é '8', o NUIT é Válido!
```
