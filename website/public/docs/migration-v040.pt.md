# Guia de Migração para v0.4.0

A versão **v0.4.0** do `moz-utils` representa a maior evolução da biblioteca desde o seu lançamento, consolidando a padronização e paridade estrita entre os 5 ecossistemas suportados (**TypeScript**, **Python**, **PHP**, **Dart/Flutter** e **Kotlin/Android**).

Este guia resume as novas funcionalidades, melhorias de API e orientações para atualizar projetos existentes.

---

## 🚀 Principais Novidades da v0.4.0

### 1. Módulo Bancário Completo (NIB & IBAN Moçambicano)
- **Validação de NIB (21 dígitos):** Algoritmo oficial **ISO 7064 Módulo 97-10** regulado pelo Banco de Moçambique (`isValidNIB`).
- **Formatação de NIB:** Divisão visual em 4 blocos padronizados com separador por espaço ou ponto (`formatNIB`).
- **Roteamento de Bancos:** Identificação automática dos 18 bancos comerciais autorizados pelo Banco de Moçambique (`getBankFromNIB`).
- **Suporte a IBAN:** Conversão de NIB para padrão internacional `MZ59` (`nibToIBAN`) e validação de conformidade (`isValidIBAN`).

### 2. Flexibilização de `getDistrictsByProvince`
Anteriormente, a função exigia estritamente o ID interno em minúsculas (ex: `'npl'`, `'mpp'`). Na versão v0.4.0, a consulta aceita de forma transparente:
- **ID:** `'npl'`, `'mpp'`, `'mpc'`, `'cab'`...
- **Sigla:** `'NPL'`, `'MPT'`, `'MC'`, `'CBD'`...
- **Nome por Extenso:** `'Nampula'`, `'Maputo'`, `'Cabo Delgado'`, com tolerância a acentos e maiúsculas.

```ts
// Todos os formatos abaixo agora funcionam perfeitamente:
getDistrictsByProvince('npl');
getDistrictsByProvince('NPL');
getDistrictsByProvince('Nampula');
getDistrictsByProvince('Cabo Delgado');
```

### 3. Saneamento e Normalização Robusta
- **`sanitizeName`:** Converte nomes para **Title Case** mesmo que a entrada original esteja integralmente em maiúsculas (ex: `"EDMILSON DE JESUS"` → `"Edmilson de Jesus"`). Preserva partículas de ligação portuguesas em minúsculas (`de`, `da`, `do`, `dos`, `das`, `e`). Suporta `{ allCaps: true }`.
- **`isValidName`:** Exige pelo menos 2 caracteres alfabéticos Unicode, rejeitando entradas espúrias como `"---"` ou sequências puramente numéricas.
- **`sanitizeDocumentField`:** Extrai apenas dígitos numéricos (`\D` removidos), ideal para pré-processar NUIT, NIB e telefones.
- **`sanitizeAlphanumericField`:** Remove símbolos e formata em MAIÚSCULAS para BI moçambicano, DIRE e passaportes.

### 4. Opções de Formatação de Telefone
A função `formatMozambicanPhone` agora aceita opções configuráveis de formato:
```ts
formatMozambicanPhone("841234567", { format: 'international' }); // "+258 84 123 4567" (padrão)
formatMozambicanPhone("841234567", { format: 'e164' });          // "+258841234567"
formatMozambicanPhone("841234567", { format: 'national' });      // "84 123 4567"
formatMozambicanPhone("841234567", { format: 'dashed' });        // "84-123-4567"
```

### 5. Correção de Dados Postais
- O CEP do bairro Namutequeliua (Nampula) foi alinhado com o registro cadastral oficial dos Correios: `"0909-09"` (em substituição à referência preliminar `"3100-05"`).
- O autocomplete de `suggestCEPs` agora pesquisa simultaneamente em localidade, distrito e província com tolerância a acentuação.

---

## ⚠️ Possíveis Quebras de Compatibilidade (Breaking Changes)

1. **Parâmetros Fictícios em Moeda:**
   - Se o seu código utilizava um terceiro parâmetro em `formatMZN(value, 'MT', true)`, este parâmetro nunca existiu formalmente na biblioteca e deve ser removido. A assinatura é `formatMZN(value: number, currency: 'MT' | 'MZN' = 'MT')`.
2. **Exceção em `formatMozambicanPhone`:**
   - Passar valores que não sejam strings ou telefones completamente inválidos lança `Error` amigável em vez de produzir formatos corrompidos.
3. **Validação de Nomes com Símbolos:**
   - Se o seu sistema confiava em `isValidName` aceitando caracteres sem letras (como traços soltos), observe que a validação agora rejeita strings que não possuam ao menos 2 letras alfabéticas.

---

## 📦 Como Atualizar por Ecossistema

### TypeScript / Node.js
```bash
npm install moz-utils@^0.4.0
```

### Python
```bash
pip install --upgrade moz-utils
```

### PHP
```bash
composer require iradoweck/moz-utils:^0.4.0
```

### Dart / Flutter
```yaml
dependencies:
  moz_utils: ^0.4.0
```
```bash
dart pub get
```

### Kotlin / Android (Gradle)
```kotlin
dependencies {
    implementation("com.github.iradoweck:moz-utils:v0.4.0")
}
```
