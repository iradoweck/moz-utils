<h1 align="center">moz-utils</h1>

<p align="center">
  <b>Kotlin</b>
</p>

<p align="center">
  <i>O Canivete Suíço para programadores em Moçambique — portado para Kotlin/JVM. Ideal para integração em backends com Spring Boot, Ktor, Micronaut ou desenvolvimento de aplicações Android nativas.</i>
</p>

---

## 📦 Instalação

Como o projeto está estruturado como um subprojeto multi-pacotes local, pode incluí-lo na sua build do Gradle ou Maven:

### Gradle (Kotlin DSL)
Adicione o subprojeto local no seu `settings.gradle.kts`:
```kotlin
include(":packages:moz-utils:kotlin") // Ajuste o caminho de acordo com a sua estrutura
```

E declare a dependência no seu `build.gradle.kts`:
```kotlin
dependencies {
    implementation(project(":packages:moz-utils:kotlin"))
}
```

### Publicação Local (Maven Local)
Pode publicar o pacote para o seu repositório Maven local executando o seguinte comando a partir do diretório `kotlin`:
```bash
./gradlew publishToMavenLocal
```

E no seu projeto de consumo, certifique-se de que tem `mavenLocal()` nos repositórios e adicione:
```kotlin
implementation("com.edmilsonmuacigarro:moz-utils:0.1.0")
```

---

## 🚀 Guia de Referência da API

Todas as funcionalidades estão disponíveis através do objeto estático `MozUtils` sob o pacote `com.edmilsonmuacigarro.mozutils`.

### 1. Validação de Documentos

#### `MozUtils.isValidNUIT(nuit: Any): Boolean`
Valida se um NUIT é sintaticamente válido seguindo as regras da AT (Autoridade Tributária) baseadas no cálculo do Módulo 11. Aceita tanto `String` quanto `Int`/`Long`.
```kotlin
import com.edmilsonmuacigarro.mozutils.MozUtils

val valido = MozUtils.isValidNUIT("123456789")  // true
val invalido = MozUtils.isValidNUIT(111111111)   // false (dígitos repetidos)
```

#### `MozUtils.getNUITEntityType(nuit: Any): String?`
Retorna a classificação da entidade com base no primeiro dígito do NUIT. Retorna `null` se o NUIT for inválido.
```kotlin
val tipo = MozUtils.getNUITEntityType("400000006")
// Retorna: "Colectiva (Sociedades por Quotas, SA, Lda, Associações)"
```

#### `MozUtils.isValidBI(bi: String): Boolean`
Valida se o formato do Bilhete de Identidade moçambicano está correto (12 dígitos seguidos de 1 letra). Ignora espaços e traços.
```kotlin
val biValido = MozUtils.isValidBI("110101234567A")   // true
val biInvalido = MozUtils.isValidBI("11010123456")   // false
```

---

### 2. Utilitários de Telemóvel e Comunicação

#### `MozUtils.isValidMozambicanPhone(phone: String): Boolean`
Valida se o número pertence a uma operadora de telecomunicações móveis nacional válida (Vodacom, Tmcel ou Movitel).
```kotlin
MozUtils.isValidMozambicanPhone("841234567")      // true
MozUtils.isValidMozambicanPhone("+258869876543")  // true
MozUtils.isValidMozambicanPhone("991234567")      // false
```

#### `MozUtils.formatMozambicanPhone(phone: String): String`
Formata o número de telemóvel para o padrão internacional: `+258 XX XXX XXXX`. Lança uma exceção `IllegalArgumentException` se o número for inválido.
```kotlin
val formatado = MozUtils.formatMozambicanPhone("841234567")
// Retorna: "+258 84 123 4567"
```

#### `MozUtils.getMobileOperator(phone: String): String?`
Retorna o nome da operadora móvel nacional associada ao número (`Vodacom`, `Tmcel` ou `Movitel`). Retorna `null` se for inválido.
```kotlin
val operadora = MozUtils.getMobileOperator("841234567") // "Vodacom"
```

#### `MozUtils.buildWhatsAppUrl(phone: String, message: String): String`
Gera uma ligação direta para o WhatsApp com DDI moçambicano (`258`) e a mensagem desejada codificada em formato URL.
```kotlin
val url = MozUtils.buildWhatsAppUrl("841234567", "Olá Formiga Antonio, bem-vindo a Nampula!")
// Retorna: "https://wa.me/258841234567?text=Ol%C3%A1+Formiga+Antonio%2C+bem-vindo+a+Nampula%21"
```

---

### 3. Utilitário Monetário

#### `MozUtils.formatMZN(value: Double, currency: String): String`
Formata um valor monetário no padrão oficial de Moçambique (espaço para milhares, vírgula para decimais e símbolo no final). O parâmetro `currency` padrão é `"MT"`.
```kotlin
val preco1 = MozUtils.formatMZN(1250.50)         // "1 250,50 MT"
val preco2 = MozUtils.formatMZN(5000000.0, "MZN") // "5 000 000,00 MZN"
```

---

### 4. Base de Dados Geográfica

A biblioteca fornece os seguintes métodos para consultar a estrutura administrativa oficial de Moçambique:

```kotlin
// 1. Obter a lista completa com todas as províncias, distritos, postos e bairros
val provincias: List<Map<String, Any>> = MozUtils.getMozambiqueProvinces()

// 2. Obter distritos de uma província específica pelo ID (ex: "npl" para Nampula)
val distritosNampula: List<String> = MozUtils.getDistrictsByProvince("npl")
// Exemplo de retorno: ["Angoche", "Eráti", "Ilha de Moçambique", ...]

// 3. Obter uma lista plana de todos os distritos através da data class District
val todosDistritos: List<District> = MozUtils.getAllDistricts()

// Estrutura de District:
// data class District(
//     val name: String,
//     val provinceId: String,
//     val postos_administrativos: List<String>,
//     val bairros: List<String>
// )
```

## 📄 Licença

Este projeto é licenciado sob a licença **AGPL-3.0-or-later**.

---

<p align="center">
  Desenvolvido por <b>Edmilson Muacigarro</b> e contribuidores.
</p>
