# moz_utils (Dart & Flutter)

> O Canivete Suíço para programadores em Moçambique — portado para Dart. Ideal para aplicações móveis e multi-plataforma desenvolvidas com Flutter.

---

## 📦 Instalação

Pode adicionar a biblioteca ao seu projeto Flutter ou Dart. No seu ficheiro `pubspec.yaml`, adicione o pacote a partir do caminho local:

```yaml
dependencies:
  moz_utils:
    path: ../caminho/para/moz-utils/dart
```

E execute:
```bash
dart pub get
# ou para projetos Flutter
flutter pub get
```

---

## 🚀 Guia de Referência da API

Todas as utilidades são expostas como métodos estáticos na classe `MozUtils`.

### 1. Validação de Documentos

#### `MozUtils.isValidNUIT(dynamic nuit): bool`
Valida se um NUIT é sintaticamente válido seguindo as regras da AT (Autoridade Tributária) baseadas no Módulo 11. Aceita tanto `String` quanto `int`.
```dart
import 'package:moz_utils/moz_utils.dart';

print(MozUtils.isValidNUIT('123456789')); // true
print(MozUtils.isValidNUIT(111111111));   // false
```

#### `MozUtils.getNUITEntityType(dynamic nuit): String?`
Classifica a entidade associada ao NUIT com base no primeiro dígito. Retorna `null` se for inválido.
```dart
import 'package:moz_utils/moz_utils.dart';

print(MozUtils.getNUITEntityType('100000008')); // "Singular (Cidadãos nacionais/estrangeiros e ENI)"
print(MozUtils.getNUITEntityType('400000006')); // "Colectiva (Sociedades por Quotas, SA, Lda, Associações)"
```

#### `MozUtils.isValidBI(String bi): bool`
Valida o Bilhete de Identidade moçambicano (12 dígitos + 1 letra). Ignora espaços e traços.
```dart
import 'package:moz_utils/moz_utils.dart';

print(MozUtils.isValidBI('110101234567A'));  // true
print(MozUtils.isValidBI('110101234567 a'));  // true
```

---

### 2. Telecomunicações e WhatsApp

#### `MozUtils.isValidMozambicanPhone(String phone): bool`
Valida se o número pertence a uma operadora de telecomunicações móveis nacional (Vodacom, Tmcel ou Movitel).
```dart
import 'package:moz_utils/moz_utils.dart';

print(MozUtils.isValidMozambicanPhone('841234567'));     // true
print(MozUtils.isValidMozambicanPhone('+258861234567')); // true
```

#### `MozUtils.formatMozambicanPhone(String phone): String`
Formata o número de telemóvel para o padrão internacional: `+258 XX XXX XXXX`. Lança `ArgumentError` se for inválido.
```dart
import 'package:moz_utils/moz_utils.dart';

print(MozUtils.formatMozambicanPhone('841234567')); // "+258 84 123 4567"
```

#### `MozUtils.getMobileOperator(String phone): String?`
Identifica a operadora móvel (`'Vodacom'`, `'Tmcel'` ou `'Movitel'`).
```dart
import 'package:moz_utils/moz_utils.dart';

print(MozUtils.getMobileOperator('841234567')); // "Vodacom"
```

#### `MozUtils.buildWhatsAppUrl(String phone, [String message = '']): String`
Cria uma ligação direta para abrir uma conversa no WhatsApp.
```dart
import 'package:moz_utils/moz_utils.dart';

print(MozUtils.buildWhatsAppUrl('841234567', 'Olá Formiga Antonio, bem-vindo a Nampula!'));
// "https://wa.me/258841234567?text=Ol%C3%A1%20Formiga%20Antonio%2C%20bem-vindo%20a%20Nampula%21"
```

---

### 3. Moeda Nacional

#### `MozUtils.formatMZN(double value, [String currency = 'MT']): String`
Formata valores monetários em Meticais de acordo com o padrão local (ex: `1 500,00 MT`).
```dart
import 'package:moz_utils/moz_utils.dart';

print(MozUtils.formatMZN(1250.5));          // "1 250,50 MT"
print(MozUtils.formatMZN(10000000, 'MZN')); // "10 000 000,00 MZN"
```

---

### 4. Base Geográfica

```dart
import 'package:moz_utils/moz_utils.dart';

// 1. Obter a lista completa com todas as províncias, distritos, postos e bairros
final provinces = MozUtils.getMozambiqueProvinces();

// 2. Obter distritos de uma província (ex: 'npl' para Nampula)
final districts = MozUtils.getDistrictsByProvince('npl'); // ['Angoche', 'Eráti', ...]

// 3. Obter todos os distritos planos do país
final allDistricts = MozUtils.getAllDistricts();
```

## 📄 Licença

Este projeto é licenciado sob a licença **AGPL-3.0-or-later**.

---

<p align="center">
  Desenvolvido por <b>Edmilson Muacigarro</b> e contribuidores.
</p>
