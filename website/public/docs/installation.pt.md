# Instalação

O `moz-utils` está disponível nos 5 principais ecossistemas de desenvolvimento. Escolha o que corresponde ao seu projecto.

<div className="code-tabs" data-labels="TypeScript,Python,PHP,Dart,Kotlin">

```bash
npm install moz-utils
```

```bash
pip install moz-utils
```

```bash
composer require iradoweck/moz-utils
```

```bash
flutter pub add moz_utils
```

```kotlin
// settings.gradle.kts
dependencyResolutionManagement {
    repositories {
        maven { url = uri("https://jitpack.io") }
    }
}
// build.gradle.kts
dependencies {
    implementation("com.github.iradoweck:moz-utils:0.3.9")
}
```

</div>

## Uso Básico

<div className="code-tabs" data-labels="TypeScript,Python,PHP,Dart,Kotlin">

```ts
import { isValidNUIT, formatMozambicanPhone } from 'moz-utils';

console.log(isValidNUIT("400000008")); // true
console.log(formatMozambicanPhone("841234567")); // "+258 84 123 4567"
```

```python
from moz_utils import is_valid_nuit, format_mozambican_phone

print(is_valid_nuit("400000008"))        # True
print(format_mozambican_phone("841234567"))  # "+258 84 123 4567"
```

```php
use MozUtils\MozUtils;

var_dump(MozUtils::isValidNUIT("400000008"));          // bool(true)
echo MozUtils::formatMozambicanPhone("841234567");     // "+258 84 123 4567"
```

```dart
import 'package:moz_utils/moz_utils.dart';

print(isValidNUIT('400000008'));          // true
print(formatMozambicanPhone('841234567')); // '+258 84 123 4567'
```

```kotlin
import io.github.iradowect.moz_utils.MozUtils

println(MozUtils.isValidNUIT("400000008"))            // true
println(MozUtils.formatMozambicanPhone("841234567"))  // "+258 84 123 4567"
```

</div>
