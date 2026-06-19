# Telefones & Mobile

Validar e extrair informação de números de telemóvel moçambicanos é uma das necessidades mais comuns em aplicações locais, seja numa app de entregas em **Nampula**, numa loja de e-commerce na **Beira**, ou numa fintech em **Maputo**.

A biblioteca suporta completamente a **Vodacom**, a **Tmcel** e a **Movitel**.

## Validar um Número de Telemóvel

A função `isValidMozambicanPhone` verifica se o número pertence a uma das operadoras oficiais. Remove inteligentemente espaços, traços e indicativos de país (`+258` ou `00258`).

<div className="code-tabs" data-labels="TypeScript,Python,PHP,Dart,Kotlin">

```ts
import { isValidMozambicanPhone } from 'moz-utils';

// Validar um cliente de Namutequeliua (Nampula)
console.log(isValidMozambicanPhone("841234567"));       // true
console.log(isValidMozambicanPhone("+258 82 123 4567")); // true
console.log(isValidMozambicanPhone("811234567"));        // false (Nenhuma operadora usa 81)
```

```python
from moz_utils import is_valid_mozambican_phone

print(is_valid_mozambican_phone("841234567")) # True
```

```php
use MozUtils\MozUtils;

echo MozUtils::isValidMozambicanPhone("841234567"); // 1 (true)
```

```dart
import 'package:moz_utils/moz_utils.dart';

print(isValidMozambicanPhone('841234567')); // true
```

```kotlin
import io.github.iradowect.moz_utils.MozUtils

println(MozUtils.isValidMozambicanPhone("841234567")) // true
```

</div>

## Identificar a Operadora

Descubra a que rede pertence um número. Muito útil para segmentar promoções por operadora em regiões como **Nampula**.

<div className="code-tabs" data-labels="TypeScript,Python">

```ts
import { getMobileOperator } from 'moz-utils';

console.log(getMobileOperator("841234567")); // "Vodacom"
console.log(getMobileOperator("821234567")); // "Tmcel"
console.log(getMobileOperator("861234567")); // "Movitel"
```

```python
from moz_utils import get_mobile_operator

print(get_mobile_operator("841234567")) # "Vodacom"
```

</div>

## Identificar a Carteira Móvel

Um número também pode ser mapeado para a sua plataforma de dinheiro móvel correspondente (M-Pesa, e-Mola, mKesh).

### TypeScript
```ts
import { getMobileWallet } from 'moz-utils';

console.log(getMobileWallet("841234567")); // "M-Pesa"
console.log(getMobileWallet("861234567")); // "e-Mola"
```

## Formatar para o Padrão Internacional

Para guardar o número de forma segura na sua base de dados, formate-o sempre para o padrão internacional.

### TypeScript
```ts
import { formatMozambicanPhone } from 'moz-utils';

console.log(formatMozambicanPhone("84 123 4567")); // "+258841234567"
```

## Gerar Links WhatsApp

Redirecione os seus utilizadores para o WhatsApp diretamente!

### TypeScript
</div>

## Identificar a Carteira Móvel

Um número também pode ser mapeado para a sua plataforma de dinheiro móvel correspondente (M-Pesa, e-Mola, mKesh).

### TypeScript
```ts
import { getMobileWallet } from 'moz-utils';

console.log(getMobileWallet("841234567")); // "M-Pesa"
console.log(getMobileWallet("861234567")); // "e-Mola"
```

## Formatar para o Padrão Internacional

Para guardar o número de forma segura na sua base de dados, formate-o sempre para o padrão internacional.

### TypeScript
```ts
import { formatMozambicanPhone } from 'moz-utils';

console.log(formatMozambicanPhone("84 123 4567")); // "+258841234567"
```

## Gerar Links WhatsApp

Redirecione os seus utilizadores para o WhatsApp diretamente!

### TypeScript
```ts
import { buildWhatsAppUrl } from 'moz-utils';

// Ex.: Um comprador de Namutequeliua, Nampula
const url = buildWhatsAppUrl("841234567", "Olá, estou em Nampula e quero comprar!");
console.log(url);
// "https://wa.me/258841234567?text=Ol%C3%A1%2C%20estou%20em%20Nampula%20e%20quero%20comprar%21"
```

## ⚙️ A Mecânica Interna: Prefixos das Operadoras

As operadoras de telecomunicações em Moçambique adquirem blocos numéricos específicos através do INCM (Instituto Nacional das Comunicações de Moçambique). O `moz-utils` mapeia as operadoras usando a seguinte lógica offline:

- **Vodacom**: Começa por `84` ou `85` (A Carteira M-Pesa está associada a estes números).
- **Tmcel**: Começa por `82` ou `83` (A Carteira mKesh está associada a estes números).
- **Movitel**: Começa por `86`, `87` ou `88` (A Carteira e-Mola está associada a estes números).

Quando a validação ou a extração da operadora é executada, a string é limpa de espaços e prefixos internacionais (`+258`, `00258`), e a expressão regular verifica se o número restante possui exatamente 9 dígitos e se o prefixo coincide com um bloco oficialmente alocado.
