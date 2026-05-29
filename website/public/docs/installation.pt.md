# Instalação

O `moz-utils` está disponível nos 5 principais ecossistemas de desenvolvimento. Escolha o que corresponde ao seu projecto.

## TypeScript / Node.js

```bash
npm install moz-utils
```

### Uso

```ts
import { isValidNUIT, formatMozambicanPhone } from 'moz-utils';

console.log(isValidNUIT("400000008")); // true
console.log(formatMozambicanPhone("841234567")); // "+258 84 123 4567"
```

## Python

```bash
pip install moz-utils
```

### Uso

```python
from moz_utils import is_valid_nuit, format_mozambican_phone

print(is_valid_nuit("400000008"))        # True
print(format_mozambican_phone("841234567"))  # "+258 84 123 4567"
```

## PHP (Composer)

```bash
composer require iradoweck/moz-utils
```

### Uso

```php
use MozUtils\MozUtils;

var_dump(MozUtils::isValidNUIT("400000008"));          // bool(true)
echo MozUtils::formatMozambicanPhone("841234567");     // "+258841234567"
```

## Dart / Flutter

```bash
flutter pub add moz_utils
```

Ou adicionando manualmente ao `pubspec.yaml`:

```yaml
dependencies:
  moz_utils: ^0.3.4
```

### Uso

```dart
import 'package:moz_utils/moz_utils.dart';

print(isValidNUIT('400000008'));          // true
print(formatMozambicanPhone('841234567')); // '+258841234567'
```

## Kotlin / Java (JitPack)

Adicione o repositório JitPack ao `settings.gradle.kts`:

```kotlin
dependencyResolutionManagement {
    repositories {
        maven { url = uri("https://jitpack.io") }
    }
}
```

Depois adicione a dependência ao `build.gradle.kts`:

```kotlin
dependencies {
    implementation("com.github.iradoweck:moz-utils:0.3.4")
}
```

### Uso

```kotlin
import io.github.iradowect.moz_utils.MozUtils

println(MozUtils.isValidNUIT("400000008"))            // true
println(MozUtils.formatMozambicanPhone("841234567"))  // "+258841234567"
```
