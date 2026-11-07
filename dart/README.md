# moz_utils (Dart & Flutter)

A biblioteca oficial e de código aberto para a linguagem Dart e o ecossistema Flutter, concebida para aplicações móveis, web e desktop em **Moçambique**, com arquitetura *offline-first* e zero dependências de terceiros.

[![pub.dev](https://img.shields.io/badge/pub.dev-v0.4.0-0175C2?logo=dart&logoColor=white)](https://pub.dev/packages/moz_utils)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://github.com/iradoweck/moz-utils/blob/main/LICENSE)
[![CI](https://github.com/iradoweck/moz-utils/actions/workflows/ci.yml/badge.svg)](https://github.com/iradoweck/moz-utils/actions/workflows/ci.yml)
[![Website](https://img.shields.io/badge/Docs-Website-blue)](https://iradoweck.github.io/moz-utils/)

> **Autor:** Edmilson Muacigarro (@iradoweck)  
> **Documentação Oficial:** [iradoweck.github.io/moz-utils](https://iradoweck.github.io/moz-utils/)  
> **Repositório GitHub:** [iradoweck/moz-utils](https://github.com/iradoweck/moz-utils)

---

## 🌍 A Visão

Desenvolver produtos digitais para Moçambique exige precisão e conformidade com os órgãos reguladores nacionais:
- 📱 **Experiência Mobile Fluida** — Detecção instantânea e em tempo real da operadora (Vodacom, Tmcel, Movitel) e carteira móvel (M-Pesa, e-Mola, mKesh) enquanto o utilizador digita o número.
- 🏦 **Módulo Bancário (NIB e IBAN)** — Validação algorítmica ISO 7064 Módulo 97-10 para os 21 dígitos do NIB moçambicano e conversão para o IBAN oficial (`MZ59`).
- 🔎 **Validação Tributária do NUIT** — Verificação do dígito de controlo do Módulo 11 da Autoridade Tributária e identificação do tipo de entidade (Pessoas Singulares, Colectivas, Públicas, etc.).
- 🗺️ **Divisão Territorial e Novo CEP** — Catálogo offline com as 11 províncias, 161 distritos e a base nacional de códigos de endereçamento postal (`XXXX-XX`).
- 🪪 **Documentação Civil** — B.I. moçambicano (12 dígitos + 1 letra), DIRE, Passaporte e Carta de Condução.

O `moz_utils` fornece todas essas capacidades em uma classe utilitária estática (`MozUtils`), sem sobrecarga no tamanho final do binário compilado (AOT) e com total segurança de tipos (`null-safety`).

---

## 💻 Requisitos do Sistema

- **Dart SDK**: `>= 3.0.0 < 4.0.0` (compatível com Flutter 3.x em Android, iOS, Web, macOS, Windows e Linux).
- **Sem Dependências**: Biblioteca pura em Dart, utilizável tanto em interfaces Flutter quanto em servidores backend Dart (Dart Frog, Serverpod, Jaspr) e CLIs.

---

## 📦 Instalação

Adicione o pacote ao seu projeto via Flutter CLI:

```bash
flutter pub add moz_utils
```

Ou no caso de um projeto Dart puro (backend ou CLI):

```bash
dart pub add moz_utils
```

Também é possível declarar diretamente no `pubspec.yaml`:

```yaml
dependencies:
  moz_utils: ^0.4.0
```

---

## 🚀 Guia Completo de Utilização

Todas as funções do pacote são acessadas através dos métodos estáticos da classe `MozUtils`:

```dart
import 'package:moz_utils/moz_utils.dart';
```

---

### 🏦 Sistema Financeiro e Bancário (NIB, IBAN e Catálogo de Bancos)

Validação matemática rigorosa do **Número de Identificação Bancária (NIB)** conforme as diretrizes do Banco de Moçambique e a norma **ISO 7064 Módulo 97-10**, com suporte completo ao **IBAN Moçambicano** (`MZ59` + 21 dígitos).

```dart
import 'package:moz_utils/moz_utils.dart';

void main() {
  // NIB de 21 dígitos (BBBB AAAA CCCCCCCCCCC KK)
  const nibExemplo = '000100001234567890194';

  // 1. Validação matemática oficial (Módulo 97-10)
  print(MozUtils.isValidNIB(nibExemplo)); // true
  print(MozUtils.isValidNIB('000100001234567890100')); // false (dígito de controlo inválido)
  print(MozUtils.isValidNIB('999900001234567890100')); // false (banco inexistente)

  // 2. Formatação no padrão nacional (BBBB AAAA CCCCCCCCCCC KK)
  print(MozUtils.formatNIB(nibExemplo)); // "0001 0000 12345678901 94"

  // 3. Obtenção de dados cadastrais do banco emissor
  final banco = MozUtils.getBankByNIB(nibExemplo);
  print(banco);
  // {code: 0001, name: Banco Internacional de Moçambique, S.A., shortName: Millennium BIM}

  // 4. Conversão para o IBAN oficial de Moçambique (MZ59 + 21 dígitos)
  final iban = MozUtils.nibToIBAN(nibExemplo);
  print(iban); // "MZ59000100001234567890194"

  // 5. Validação de IBAN moçambicano
  print(MozUtils.isValidIBAN(iban)); // true
  print(MozUtils.isValidIBAN('MZ59 0001 0000 1234 5678 9019 4')); // true (tolerante a espaços)
  print(MozUtils.isValidIBAN('PT50000100001234567890194')); // false (prefixo internacional inválido)

  // 6. Catálogo dos 18 bancos comerciais oficiais
  print('Bancos disponíveis: ${MozUtils.mozambiqueBanks.length}');
  print('Banco 0008: ${MozUtils.mozambiqueBanks.firstWhere((b) => b['code'] == '0008')['shortName']}'); // BCI
}
```

#### ⚙️ Por Dentro da Lógica Bancária: Módulo 97-10
O NIB em Moçambique é estruturado em:
- `BBBB` (4 dígitos): Código de compensação da instituição bancária perante o Banco de Moçambique.
- `AAAA` (4 dígitos): Código da agência/balcão.
- `CCCCCCCCCCC` (11 dígitos): Número da conta corrente (com preenchimento de zeros à esquerda).
- `KK` (2 dígitos): Dígitos verificadores de segurança.

A validação em Dart utiliza `BigInt` para cálculo exato da aritmética modular, assegurando precisão total em qualquer arquitetura (ARM, x86_64, WebAssembly).

---

### 📱 Telefonia, Operadoras e Carteiras Móveis

```dart
import 'package:moz_utils/moz_utils.dart';

void main() {
  // 1. Validação (aceita formatos locais, com código de país +258, hífens ou espaços)
  print(MozUtils.isValidMozambicanPhone('841234567'));          // true
  print(MozUtils.isValidMozambicanPhone('+258 82 123 4567'));    // true
  print(MozUtils.isValidMozambicanPhone('811234567'));           // false (prefixo 81 inexistente)

  // 2. Identificação de Operadora Móvel
  print(MozUtils.getMobileOperator('841234567')); // "Vodacom"
  print(MozUtils.getMobileOperator('821234567')); // "Tmcel"
  print(MozUtils.getMobileOperator('861234567')); // "Movitel"

  // 3. Identificação de Carteira Móvel (Mobile Money)
  print(MozUtils.getMobileWallet('841234567')); // "M-Pesa"
  print(MozUtils.getMobileWallet('821234567')); // "mKesh"
  print(MozUtils.getMobileWallet('861234567')); // "e-Mola"

  // 4. Formatação no padrão internacional legível
  print(MozUtils.formatMozambicanPhone('841234567')); // "+258 84 123 4567"

  // 5. Geração de Links Directos para WhatsApp com sanitização do número
  final url = MozUtils.buildWhatsAppUrl('841234567', 'Olá, tudo bem?');
  print(url); // "https://wa.me/258841234567?text=Ol%C3%A1%2C+tudo+bem%3F"
}
```

#### ⚙️ Prefixos Oficiais atribuídos pelo INCM:
- **Vodacom Moçambique**: Prefixos `84` e `85` (Carteira: **M-Pesa**).
- **Tmcel (Moçambique Telecom)**: Prefixos `82` e `83` (Carteira: **mKesh**).
- **Movitel**: Prefixos `86`, `87` e `88` (Carteira: **e-Mola**).

---

### 🪪 Documentos de Identificação Civil e Fiscal

```dart
import 'package:moz_utils/moz_utils.dart';

void main() {
  // 1. NUIT (Número Único de Identificação Tributária - 9 dígitos)
  print(MozUtils.isValidNUIT('100000008')); // true (Pessoa Singular)
  print(MozUtils.isValidNUIT('400000001')); // true (Pessoa Colectiva)
  print(MozUtils.isValidNUIT('123456789')); // false (checksum inválido)

  // Classificação da Entidade perante a Autoridade Tributária
  print(MozUtils.getNUITEntityType('100000008')); // "Pessoas Singulares"
  print(MozUtils.getNUITEntityType('400000001')); // "Pessoas Colectivas"

  // 2. Bilhete de Identidade (B.I. - 12 dígitos seguidos de 1 letra maiúscula)
  print(MozUtils.isValidBI('110101234567A')); // true
  print(MozUtils.isValidBI('1101012345671')); // false (terminação não alfabética)

  // 3. DIRE (Documento de Identificação e Residência para Estrangeiros)
  print(MozUtils.isValidDIRE('120345678A')); // true

  // 4. Passaporte Moçambicano (2 letras seguidas de 7 dígitos)
  print(MozUtils.isValidPassport('AO1234567')); // true

  // 5. Carta de Condução
  print(MozUtils.isValidDrivingLicense('MP1234567')); // true
}
```

---

### 💰 Moeda Nacional (Metical - MZN)

```dart
import 'package:moz_utils/moz_utils.dart';

void main() {
  // Formatação (espaço como separador de milhares e vírgula decimal)
  print(MozUtils.formatMZN(1500));         // "1 500,00 MT"
  print(MozUtils.formatMZN(2500000.5));    // "2 500 000,50 MT"
  print(MozUtils.formatMZN(75.25, 'MZN'));  // "75,25 MZN"

  // Parsing seguro de strings monetárias para double
  print(MozUtils.parseMZN('1 500,00 MT'));      // 1500.0
  print(MozUtils.parseMZN('2.500.000,50 MZN'));  // 2500000.5
}
```

---

### 🗺️ Divisão Geográfica e Distritos

```dart
import 'package:moz_utils/moz_utils.dart';

void main() {
  // 1. Iteração pelas províncias oficiais
  for (final prov in MozUtils.getMozambiqueProvinces()) {
    print('${prov['name']} (${prov['sigla']})');
  }

  // 2. Busca flexível de distritos (aceita "Maputo", "mpp", "MPT", "Nampula", etc.)
  final distritosMaputo = MozUtils.getDistrictsByProvince('Maputo');
  print(distritosMaputo);
  // [Boane, Magude, Manhiça, Marracuene, Matola, Matutuíne, Moamba, Namaacha]

  final distritosNampula = MozUtils.getDistrictsByProvince('NPL');
  print('Distritos em Nampula: ${distritosNampula.length}');

  // 3. Lista global dos 161 distritos
  final todos = MozUtils.getAllDistricts();
  print('Total nacional de distritos: ${todos.length}');
}
```

---

### 📬 Sistema Postal e Novo CEP Moçambicano

```dart
import 'package:moz_utils/moz_utils.dart';

void main() {
  // 1. Novo CEP (XXXX-XX)
  print(MozUtils.isValidNewCEP('0909-09')); // true (Namutequeliua, Nampula)
  print(MozUtils.isValidNewCEP('1100-01')); // true (Maputo Central)

  // Motor de busca e autocompletar offline
  final resultados = MozUtils.suggestCEPs('namutequeliua');
  print(resultados[0]['cep']);       // "0909-09"
  print(resultados[0]['province']);  // "Nampula"
  print(resultados[0]['district']);  // "Nampula"
  print(resultados[0]['locality']);  // "Namutequeliua"

  // 2. Códigos Postais Legados (4 dígitos)
  print(MozUtils.isValidPostalCode('3100')); // true
  print(MozUtils.getPostalCodeLocality('3100')); // "Nampula"
  print(MozUtils.getPostalCodeProvince('3100')); // "Nampula"
}
```

---

### 🧹 Saneamento e Higienização de Dados

```dart
import 'package:moz_utils/moz_utils.dart';

void main() {
  // Validação de nomes (exige no mínimo 2 caracteres alfabéticos)
  print(MozUtils.isValidName('Maria Manuela da Silva')); // true
  print(MozUtils.isValidName('---'));                    // false

  // Sanitização de nomes (Title Case preservando preposições da língua portuguesa)
  print(MozUtils.sanitizeName('MARIA MANUELA DA SILVA E COSTA'));
  // "Maria Manuela da Silva e Costa"

  // Sanitização de campos numéricos e alfanuméricos
  print(MozUtils.sanitizeDocumentField(' 100.000.008 ')); // "100000008"
  print(MozUtils.sanitizeAlphanumericField('110 101 234567a')); // "110101234567A"
}
```

---

## 🛠️ Guias Práticos para Flutter

### 1. `MozPhoneInputFormatter` (`TextInputFormatter` para formatação ao vivo)

Formate números moçambicanos dinamicamente à medida que o utilizador digita:

```dart
import 'package:flutter/services.dart';

/// Formatter dinâmico para números moçambicanos (+258 84 123 4567 ou 84 123 4567)
class MozPhoneInputFormatter extends TextInputFormatter {
  @override
  TextEditingValue formatEditUpdate(
    TextEditingValue oldValue,
    TextEditingValue newValue,
  ) {
    final digits = newValue.text.replaceAll(RegExp(r'\D'), '');
    if (digits.isEmpty) return newValue.copyWith(text: '');

    // Limita ao comprimento máximo (prefixo 258 + 9 dígitos = 12 dígitos)
    final truncated = digits.length > 12 ? digits.substring(0, 12) : digits;

    String formatted = '';
    if (truncated.startsWith('258')) {
      final national = truncated.substring(3);
      formatted = '+258';
      if (national.isNotEmpty) formatted += ' ${national.substring(0, national.length.clamp(0, 2))}';
      if (national.length > 2) formatted += ' ${national.substring(2, national.length.clamp(2, 5))}';
      if (national.length > 5) formatted += ' ${national.substring(5, national.length.clamp(5, 9))}';
    } else {
      if (truncated.isNotEmpty) formatted = truncated.substring(0, truncated.length.clamp(0, 2));
      if (truncated.length > 2) formatted += ' ${truncated.substring(2, truncated.length.clamp(2, 5))}';
      if (truncated.length > 5) formatted += ' ${truncated.substring(5, truncated.length.clamp(5, 9))}';
    }

    return TextEditingValue(
      text: formatted,
      selection: TextSelection.collapsed(offset: formatted.length),
    );
  }
}
```

---

### 2. `MozRegistrationForm` (Widget Completo com Detecção em Tempo Real)

Formulário Flutter interativo demonstrando validação de telefone, NUIT, BI e NIB com feedback visual imediato:

```dart
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:moz_utils/moz_utils.dart';

class MozRegistrationForm extends StatefulWidget {
  const MozRegistrationForm({super.key});

  @override
  State<MozRegistrationForm> createState() => _MozRegistrationFormState();
}

class _MozRegistrationFormState extends State<MozRegistrationForm> {
  final _formKey = GlobalKey<FormState>();
  final _phoneController = TextEditingController();
  final _nuitController = TextEditingController();
  final _biController = TextEditingController();
  final _nibController = TextEditingController();

  String? _detectedOperator;
  String? _detectedWallet;
  String? _nuitEntity;
  String? _bankName;

  @override
  void dispose() {
    _phoneController.dispose();
    _nuitController.dispose();
    _biController.dispose();
    _nibController.dispose();
    super.dispose();
  }

  void _onPhoneChanged(String value) {
    setState(() {
      _detectedOperator = MozUtils.getMobileOperator(value);
      _detectedWallet = MozUtils.getMobileWallet(value);
    });
  }

  void _onNuitChanged(String value) {
    setState(() {
      _nuitEntity = MozUtils.getNUITEntityType(value);
    });
  }

  void _onNibChanged(String value) {
    setState(() {
      final bank = MozUtils.getBankByNIB(value);
      _bankName = bank?['shortName'];
    });
  }

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      child: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Campo de Telefone com Detecção em Tempo Real
          TextFormField(
            controller: _phoneController,
            keyboardType: TextInputType.phone,
            onChanged: _onPhoneChanged,
            decoration: InputDecoration(
              labelText: 'Número de Telefone',
              hintText: '84 123 4567 ou +258 84 123 4567',
              prefixIcon: const Icon(Icons.phone),
              helperText: _detectedOperator != null
                  ? 'Operadora: $_detectedOperator • Carteira: $_detectedWallet'
                  : null,
              border: const OutlineInputBorder(),
            ),
            validator: (value) {
              if (value == null || !MozUtils.isValidMozambicanPhone(value)) {
                return 'Insira um número de telefone moçambicano válido.';
              }
              return null;
            },
          ),
          const SizedBox(height: 16),

          // Campo de NUIT com Classificação de Entidade
          TextFormField(
            controller: _nuitController,
            keyboardType: TextInputType.number,
            inputFormatters: [
              FilteringTextInputFormatter.digitsOnly,
              LengthLimitingTextInputFormatter(9),
            ],
            onChanged: _onNuitChanged,
            decoration: InputDecoration(
              labelText: 'NUIT (9 dígitos)',
              hintText: 'Ex: 100000008',
              prefixIcon: const Icon(Icons.badge),
              helperText: _nuitEntity != null ? 'Entidade: $_nuitEntity' : null,
              border: const OutlineInputBorder(),
            ),
            validator: (value) {
              if (value == null || !MozUtils.isValidNUIT(value)) {
                return 'NUIT inválido perante o algoritmo da Autoridade Tributária.';
              }
              return null;
            },
          ),
          const SizedBox(height: 16),

          // Campo de Bilhete de Identidade (B.I.)
          TextFormField(
            controller: _biController,
            textCapitalization: TextCapitalization.characters,
            inputFormatters: [
              LengthLimitingTextInputFormatter(13),
            ],
            decoration: const InputDecoration(
              labelText: 'Bilhete de Identidade (B.I.)',
              hintText: '12 dígitos seguidos de 1 letra (Ex: 110101234567A)',
              prefixIcon: const Icon(Icons.credit_card),
              border: const OutlineInputBorder(),
            ),
            validator: (value) {
              if (value == null || !MozUtils.isValidBI(value)) {
                return 'Formato de B.I. inválido (12 dígitos + 1 letra).';
              }
              return null;
            },
          ),
          const SizedBox(height: 16),

          // Campo de NIB Bancário
          TextFormField(
            controller: _nibController,
            keyboardType: TextInputType.number,
            inputFormatters: [
              FilteringTextInputFormatter.digitsOnly,
              LengthLimitingTextInputFormatter(21),
            ],
            onChanged: _onNibChanged,
            decoration: InputDecoration(
              labelText: 'NIB Bancário (21 dígitos)',
              hintText: 'Ex: 000100001234567890194',
              prefixIcon: const Icon(Icons.account_balance),
              helperText: _bankName != null ? 'Instituição: $_bankName' : null,
              border: const OutlineInputBorder(),
            ),
            validator: (value) {
              if (value == null || !MozUtils.isValidNIB(value)) {
                return 'NIB inválido perante a regra ISO 7064 do Banco de Moçambique.';
              }
              return null;
            },
          ),
          const SizedBox(height: 24),

          FilledButton.icon(
            onPressed: () {
              if (_formKey.currentState!.validate()) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Dados validados com sucesso!')),
                );
              }
            },
            icon: const Icon(Icons.check_circle),
            label: const Text('Submeter Cadastro'),
          ),
        ],
      ),
    );
  }
}
```

---

## 🛠️ Resolução de Problemas (Troubleshooting)

- **Erro de compilação: The method 'isValidMozambicanPhone' isn't defined for the class**  
  *Causa:* Todas as funções da biblioteca pertencem à classe estática `MozUtils`. Invoque `MozUtils.isValidMozambicanPhone(...)`.

- **Erro ao acessar campos de retorno de `suggestCEPs` (`results[0].cep`)**  
  *Causa:* O método `suggestCEPs` retorna uma lista de mapas fortemente tipados (`List<Map<String, String>>`). Acesse os valores através de chaves indexadas: `results[0]['cep']`, `results[0]['province']`, etc.

---

## 📜 Licença

Distribuído sob a licença de código aberto **Apache-2.0**. Consulte o arquivo [LICENSE](https://github.com/iradoweck/moz-utils/blob/main/LICENSE) para mais detalhes.
