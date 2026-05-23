<h1 align="center">moz-utils</h1>

<p align="center">
  <b>Kotlin</b>
</p>

<p align="center">
  <i>The Swiss Army Knife for developers in Mozambique — ported to Kotlin/JVM. Ideal for integration into backends with Spring Boot, Ktor, Micronaut, or native Android application development.</i>
</p>

---

## 📦 Installation

Since the project is structured as a local multi-package subproject, you can include it in your Gradle or Maven build:

### Gradle (Kotlin DSL)
Add the local subproject in your `settings.gradle.kts`:
```kotlin
include(":packages:moz-utils:kotlin") // Adjust path according to your structure
```

And declare the dependency in your `build.gradle.kts`:
```kotlin
dependencies {
    implementation(project(":packages:moz-utils:kotlin"))
}
```

### Local Publication (Maven Local)
You can publish the package to your local Maven repository by running the following command from the `kotlin` directory:
```bash
./gradlew publishToMavenLocal
```

And in your consuming project, ensure you have `mavenLocal()` in your repositories and add:
```kotlin
implementation("com.edmilsonmuacigarro:moz-utils:0.1.2")
```

---

## 🚀 API Reference Guide

All features are available through the static `MozUtils` object under the `com.edmilsonmuacigarro.mozutils` package.

### 1. Document Validation

#### `MozUtils.isValidNUIT(nuit: Any): Boolean`
Validates if a NUIT (Unique Tax Identification Number) is syntactically valid following the Modulo 11 calculation rules of the Tax Authority (AT). Accepts both `String` and `Int`/`Long`.
```kotlin
import com.edmilsonmuacigarro.mozutils.MozUtils

val valid = MozUtils.isValidNUIT("123456789")  // true
val invalid = MozUtils.isValidNUIT(111111111)   // false (repeated digits)
```

#### `MozUtils.getNUITEntityType(nuit: Any): String?`
Returns the entity classification based on the first digit of the NUIT. Returns `null` if the NUIT is invalid.
```kotlin
val type = MozUtils.getNUITEntityType("400000006")
// Returns: "Colectiva (Sociedades por Quotas, SA, Lda, Associações)"
```

#### `MozUtils.isValidBI(bi: String): Boolean`
Validates if the Mozambican National Identity Card (BI) format is correct (12 digits followed by 1 letter). It ignores spaces and dashes.
```kotlin
val validBi = MozUtils.isValidBI("110101234567A")   // true
val invalidBi = MozUtils.isValidBI("11010123456")   // false
```

---

### 2. Mobile Phone and Communication Utilities

#### `MozUtils.isValidMozambicanPhone(phone: String): Boolean`
Validates if the number belongs to a valid national mobile carrier (Vodacom, Tmcel, or Movitel).
```kotlin
MozUtils.isValidMozambicanPhone("841234567")      // true
MozUtils.isValidMozambicanPhone("+258869876543")  // true
MozUtils.isValidMozambicanPhone("991234567")      // false
```

#### `MozUtils.formatMozambicanPhone(phone: String): String`
Formats the mobile number to the standard international display format: `+258 XX XXX XXXX`. Throws an `IllegalArgumentException` if the number is invalid.
```kotlin
val formatted = MozUtils.formatMozambicanPhone("841234567")
// Returns: "+258 84 123 4567"
```

#### `MozUtils.getMobileOperator(phone: String): String?`
Returns the national mobile carrier name associated with the number (`Vodacom`, `Tmcel`, or `Movitel`). Returns `null` if invalid.
```kotlin
val carrier = MozUtils.getMobileOperator("841234567") // "Vodacom"
```

#### `MozUtils.buildWhatsAppUrl(phone: String, message: String): String`
Generates a direct link to open a WhatsApp conversation pre-filled with the Mozambican country code (`258`) and the URL-encoded message.
```kotlin
val url = MozUtils.buildWhatsAppUrl("841234567", "Olá Formiga Antonio, bem-vindo a Nampula!")
// Returns: "https://wa.me/258841234567?text=Ol%C3%A1+Formiga+Antonio%2C+bem-vindo+a+Nampula%21"
```

---

### 3. Currency Utilities

#### `MozUtils.formatMZN(value: Double, currency: String): String`
Formats a monetary value according to the official Mozambican standard (space separator for thousands, comma for decimals, and currency symbol at the end). The default `currency` parameter is `"MT"`.
```kotlin
val price1 = MozUtils.formatMZN(1250.50)         // "1 250,50 MT"
val price2 = MozUtils.formatMZN(5000000.0, "MZN") // "5 000 000,00 MZN"
```

---

### 4. Geographical Database

The library provides the following methods to query the official administrative structure of Mozambique:

```kotlin
// 1. Get the complete list containing all provinces, districts, posts, and neighborhoods
val provinces: List<Map<String, Any>> = MozUtils.getMozambiqueProvinces()

// 2. Get districts of a specific province by ID (e.g., "npl" for Nampula)
val nampulaDistricts: List<String> = MozUtils.getDistrictsByProvince("npl")
// Returns: ["Angoche", "Eráti", "Ilha de Moçambique", ...]

// 3. Get all flat districts of the country using the District data class
val allDistricts: List<District> = MozUtils.getAllDistricts()

// District structure:
// data class District(
//     val name: String,
//     val provinceId: String,
//     val postos_administrativos: List<String>,
//     val bairros: List<String>
// )
```

## 📄 License

This project is licensed under the **AGPL-3.0-or-later** license.

---

<p align="center">
  Developed by <b>Edmilson Muacigarro</b> and contributors.
</p>
