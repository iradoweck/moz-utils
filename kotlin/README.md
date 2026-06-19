# moz-utils (Kotlin / Java)

The definitive, zero-dependency, offline-first open-source library for software built in or for **Mozambique**.

[![JitPack](https://img.shields.io/jitpack/v/github/iradoweck/moz-utils?label=JitPack&color=B07219)](https://jitpack.io/#iradoweck/moz-utils)
[![License: AGPL-3.0](https://img.shields.io/badge/license-AGPL--3.0-green)](https://github.com/iradoweck/moz-utils/blob/main/LICENSE)
[![Website](https://img.shields.io/badge/Docs-Website-blue)](https://iradoweck.github.io/moz-utils/)

> **Author:** Edmilson Muacigarro (@iradoweck)  
> **Official Documentation:** [iradoweck.github.io/moz-utils](https://iradoweck.github.io/moz-utils/)  
> **GitHub Repository:** [iradoweck/moz-utils](https://github.com/iradoweck/moz-utils)

---

## 🌍 The Vision

When developing applications for Mozambique, engineers constantly solve the exact same problems from scratch:
- 🔎 **Is this NUIT valid?** — The Tax Authority uses a Modulo 11 algorithm. A single wrong digit and your backend fails silently.
- 📱 **Is this number Vodacom, Tmcel or Movitel?** — The prefix rules are operator-specific and rarely documented publicly.
- 🗺️ **What is the new CEP for Namutequeliua, Nampula?** — The new 6-digit postal system has low adoption. We built the first offline database for it.
- 🪪 **Is this BI / DIRE / Passport valid?** — Every identity document has a strict format.

`moz-utils` solves all of this **out-of-the-box**, with **zero runtime dependencies**, **offline-first algorithms**, and **strict privacy** (we don't send data anywhere).

---

## 💻 System Requirements

- **Kotlin**: `>= 2.4.0`
- **JVM Target**: Preferably tested with Java 17+.
- **Ecosystem**: Spring Boot, Ktor, and Native Android. Full interoperability with legacy Java code.

---

## 📦 Installation

Add the JitPack repository to your `settings.gradle.kts`:

```kotlin
dependencyResolutionManagement {
    repositories {
        maven { url = uri("https://jitpack.io") }
    }
}
```

Then add the dependency to your `build.gradle.kts`:

```kotlin
dependencies {
    implementation("com.github.iradoweck:moz-utils:0.3.9")
}
```

---

## 🚀 Comprehensive Usage Guide

### 📱 Phones & Mobile

Validating and extracting information from Mozambican mobile numbers. Fully supports Vodacom, Tmcel, and Movitel.

```kotlin
import io.github.iradowect.moz_utils.MozUtils

// Validation
println(MozUtils.isValidMozambicanPhone("841234567"))       // true
println(MozUtils.isValidMozambicanPhone("+258 82 123 4567")) // true
println(MozUtils.isValidMozambicanPhone("811234567"))        // false

// Operator & Wallet Extraction
println(MozUtils.getMobileOperator("841234567")) // "Vodacom"
println(MozUtils.getMobileWallet("861234567"))   // "e-Mola"

// Formatting
println(MozUtils.formatMozambicanPhone("84 123 4567")) // "+258841234567"

// WhatsApp Links
val url = MozUtils.buildWhatsAppUrl("841234567", "Hello!")
println(url) // "https://wa.me/258841234567?text=Hello%21"
```

#### ⚙️ Under the Hood: Operator Prefixes
Telecommunication operators in Mozambique acquire specific number blocks through the INCM. We map operators using this offline logic:
- **Vodacom**: Starts with `84` or `85`.
- **Tmcel**: Starts with `82` or `83`.
- **Movitel**: Starts with `86` or `87` or `88`.

---

### 🪪 Identity Documents

Validating documents prevents fraudulent registrations in systems deployed in Maputo, Nampula, or any other province.

```kotlin
import io.github.iradowect.moz_utils.MozUtils

// NUIT (Tax ID)
println(MozUtils.isValidNUIT("400000008")) // true
println(MozUtils.getNUITEntityType("400000008")) // "Singular" (Individual)

// BI (Identity Card)
println(MozUtils.isValidBI("123456789123A")) // true

// Passports, DIRE & Driving License
println(MozUtils.isValidPassport("AO1234567")) // true
println(MozUtils.isValidDIRE("120345678A"))   // true
println(MozUtils.isValidDrivingLicense("MP1234567")) // true
```

#### ⚙️ Under the Hood: The NUIT Algorithm
Unlike other tax numbers that use descending multipliers, the Mozambican Tax Authority uses a specific fixed matrix of weights `[8, 9, 4, 5, 6, 7, 8, 9]` to calculate the Modulo 11 for the NUIT. `moz-utils` replicates this exact mathematical equation offline.

---

### 💰 Currency (MZN)

Format numbers into the official Metical standard.

```kotlin
import io.github.iradowect.moz_utils.MozUtils

println(MozUtils.formatMZN(1500.0)) // "1 500,00 MT"
println(MozUtils.formatMZN(2500000.5)) // "2 500 000,50 MT"
```

---

### 🗺️ Geography & Districts

An offline database containing all 11 provinces and 161 districts of Mozambique.

```kotlin
import io.github.iradowect.moz_utils.MozUtils

// Get districts for a specific province
val maputoDistricts = MozUtils.getDistrictsByProvince("Maputo")
println(maputoDistricts) // ["Boane", "Magude", "Manhiça", "Marracuene", ...]

// Get all 161 districts in a flat list
val allDistricts = MozUtils.getAllDistricts()
```

---

### 📬 Postal Codes (CEP)

Mozambique recently transitioned from the classic 4-digit code to a modern 6-digit CEP (`XXXX-XX`). `moz-utils` supports both!

```kotlin
import io.github.iradowect.moz_utils.MozUtils

// Modern CEP
println(MozUtils.isValidNewCEP("3100-05")) // true

// Autocomplete / Suggestion Engine
val results = MozUtils.suggestCEPs("namutequeliua")
println(results[0].cep) // "3100-05"

// Legacy Postal Codes
println(MozUtils.isValidPostalCode("3100")) // true
println(MozUtils.getPostalCodeLocality("3100")) // "Nampula"
```

#### ⚙️ Under the Hood: The New CEP
The New Postal Addressing Code (CEP) abandons the old 4-digit system in favor of a geospatial alphanumeric format (`XXXX-XX`). We ported the entire official geographic mapping tree to provide instant autocomplete.

---

## 🛠️ Troubleshooting

- **My NUIT fails validation, but the user swears it's real!**
  *Cause:* The Mozambican NUIT uses a Check Digit generated through a Modulo 11 algorithm. `moz-utils` does not make exceptions to the mathematical algorithm. If your system accepts mathematically invalid NUITs, your company might face integration issues with the government's e-Tributação systems.
  
- **Names Returning Empty to the Database (Sanitize)**
  *Cause:* The `sanitizeName()` function aggressively strips mathematical characters and numbers. Always run `isValidName()` **before** sanitizing and saving to the database to ensure the string contains actual alphabetical characters.
  
- **Kotlin Version Conflicts**
  *Cause:* The Gradle might warn about Kotlin compiler version mismatches. `moz-utils` uses Kotlin 2.4.0. If you are on a legacy project (e.g., Kotlin 1.8.x), you may need to force dependency resolution in Gradle or update your project's version.

---

## 📜 License

This project is licensed under the **AGPL-3.0 License** - see the LICENSE file for details.
