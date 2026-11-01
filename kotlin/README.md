# moz-utils (Kotlin / Android / Java)

A biblioteca oficial e de código aberto para a linguagem Kotlin e o ecossistema JVM / Android, com zero dependências externas, execução *offline-first* e compatibilidade total com Java, desenvolvida para **Moçambique**.

[![JitPack](https://img.shields.io/badge/JitPack-0.4.0-B07219?logo=gradle&logoColor=white)](https://jitpack.io/#iradoweck/moz-utils)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://github.com/iradoweck/moz-utils/blob/main/LICENSE)
[![CI](https://github.com/iradoweck/moz-utils/actions/workflows/ci.yml/badge.svg)](https://github.com/iradoweck/moz-utils/actions/workflows/ci.yml)
[![Website](https://img.shields.io/badge/Docs-Website-blue)](https://iradoweck.github.io/moz-utils/)

> **Autor:** Edmilson Muacigarro (@iradoweck)  
> **Documentação Oficial:** [iradoweck.github.io/moz-utils](https://iradoweck.github.io/moz-utils/)  
> **Repositório GitHub:** [iradoweck/moz-utils](https://github.com/iradoweck/moz-utils)

---

## 🌍 A Visão

Criar soluções robustas e integradas para o mercado moçambicano em plataformas JVM e Android requer conformidade técnica e regulamentar:
- 📱 **Aplicações Android Nativas & Jetpack Compose** — Feedback instantâneo na digitação de números de telefone com identificação de operadora (Vodacom, Tmcel, Movitel) e carteira móvel (M-Pesa, e-Mola, mKesh).
- 🏦 **Módulo Bancário (NIB e IBAN)** — Validação da norma ISO 7064 Módulo 97-10 para os 21 dígitos do NIB moçambicano e conversão automática para o IBAN oficial (`MZ59`).
- 🔎 **Validação do NUIT pela Autoridade Tributária** — Verificação do algoritmo Módulo 11 com suporte a todas as 9 classes de entidades moçambicanas (Singulares, Colectivas, Públicas, etc.).
- 🗺️ **Divisão Territorial e Novo CEP** — Base geográfica offline com 11 províncias, 161 distritos e autocompletar do novo código postal de 6 dígitos (`XXXX-XX`).
- 🪪 **Validação de Documentos Civis** — Bilhete de Identidade (12 dígitos + 1 letra), DIRE, Passaporte e Carta de Condução.

O `moz-utils` é distribuído como um `object` Kotlin puro (compatível nativamente como métodos estáticos em Java), garantindo portabilidade para Android, Ktor, Spring Boot e Micronaut.

---

## 💻 Requisitos do Sistema

- **Kotlin**: `>= 1.9.0` (totalmente homologado e compatível com Kotlin 2.x).
- **JVM Target**: Java 21+ (totalmente compatível com Java 17+ e Android API 21+ com desugaring ativado).
- **Zero Dependências de Terceiros**: Apenas as bibliotecas fundamentais do Kotlin/Java standard library.

---

## 📦 Instalação

Adicione o repositório JitPack ao seu arquivo `settings.gradle.kts`:

```kotlin
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
        maven { url = uri("https://jitpack.io") }
    }
}
```

Em seguida, adicione a dependência no seu `build.gradle.kts` (módulo da aplicação):

```kotlin
dependencies {
    implementation("com.github.iradoweck:moz-utils:v0.4.0")
}
```

No seu código Kotlin, importe a classe utilitária oficial:

```kotlin
import com.edmilsonmuacigarro.mozutils.MozUtils
```

---

## 🚀 Guia Completo de Utilização

### 🏦 Sistema Financeiro e Bancário (NIB, IBAN e Catálogo de Bancos)

Validação matemática rigorosa do **Número de Identificação Bancária (NIB)** conforme as diretrizes do Banco de Moçambique e a norma **ISO 7064 Módulo 97-10**, com suporte completo ao **IBAN Moçambicano** (`MZ59` + 21 dígitos).

```kotlin
import com.edmilsonmuacigarro.mozutils.MozUtils

fun main() {
    // NIB de 21 dígitos (BBBB AAAA CCCCCCCCCCC KK)
    val nibExemplo = "000100001234567890194"

    // 1. Validação matemática oficial (Módulo 97-10 com BigInteger)
    println(MozUtils.isValidNIB(nibExemplo)) // true
    println(MozUtils.isValidNIB("000100001234567890100")) // false (dígito de controlo adulterado)
    println(MozUtils.isValidNIB("999900001234567890100")) // false (banco inexistente)

    // 2. Formatação canónica (BBBB AAAA CCCCCCCCCCC KK)
    println(MozUtils.formatNIB(nibExemplo)) // "0001 0000 12345678901 94"

    // 3. Obtenção de dados cadastrais do banco emissor
    val banco = MozUtils.getBankByNIB(nibExemplo)
    println(banco)
    // {code=0001, name=Banco Internacional de Moçambique, S.A., shortName=Millennium BIM}

    // 4. Conversão para o IBAN oficial de Moçambique (MZ59 + 21 dígitos)
    val iban = MozUtils.nibToIBAN(nibExemplo)
    println(iban) // "MZ59000100001234567890194"

    // 5. Validação de IBAN moçambicano
    println(MozUtils.isValidIBAN(iban)) // true
    println(MozUtils.isValidIBAN("MZ59 0001 0000 1234 5678 9019 4")) // true (tolerante a espaços)
    println(MozUtils.isValidIBAN("PT50000100001234567890194")) // false (prefixo internacional inválido)

    // 6. Catálogo dos 18 bancos comerciais oficiais
    println("Total de bancos catalogados: ${MozUtils.BANKS.size}")
    println("Banco 0008: ${MozUtils.BANKS.firstOrNull { it["code"] == "0008" }?.get("shortName")}") // BCI
}
```

#### ⚙️ Por Dentro da Lógica Bancária: Módulo 97-10
O NIB moçambicano é composto por:
- `BBBB` (4 dígitos): Código de compensação da instituição bancária.
- `AAAA` (4 dígitos): Código do balcão ou agência.
- `CCCCCCCCCCC` (11 dígitos): Número da conta bancária (zeros à esquerda).
- `KK` (2 dígitos): Dígitos verificadores de segurança.

A validação em Kotlin utiliza `java.math.BigInteger` para execução exata da divisão modular ($NIB \pmod{97} == 1$), prevenindo imprecisões ou estouros numéricos.

---

### 📱 Telefonia, Operadoras e Carteiras Móveis

```kotlin
import com.edmilsonmuacigarro.mozutils.MozUtils

fun main() {
    // 1. Validação (aceita formatos locais, com código de país +258, hífens ou espaços)
    println(MozUtils.isValidMozambicanPhone("841234567"))          // true
    println(MozUtils.isValidMozambicanPhone("+258 82 123 4567"))    // true
    println(MozUtils.isValidMozambicanPhone("811234567"))           // false (prefixo 81 não existe)

    // 2. Identificação de Operadora Móvel
    println(MozUtils.getMobileOperator("841234567")) // "Vodacom"
    println(MozUtils.getMobileOperator("821234567")) // "Tmcel"
    println(MozUtils.getMobileOperator("861234567")) // "Movitel"

    // 3. Identificação de Carteira Móvel (Mobile Money)
    println(MozUtils.getMobileWallet("841234567")) // "M-Pesa"
    println(MozUtils.getMobileWallet("821234567")) // "mKesh"
    println(MozUtils.getMobileWallet("861234567")) // "e-Mola"

    // 4. Formatação no padrão internacional legível
    println(MozUtils.formatMozambicanPhone("841234567")) // "+258 84 123 4567"

    // 5. Geração de Links Directos para WhatsApp
    val url = MozUtils.buildWhatsAppUrl("841234567", "Olá, preciso de suporte!")
    println(url)
    // "https://wa.me/258841234567?text=Ol%C3%A1%2C+preciso+de+suporte%21"
}
```

#### ⚙️ Prefixos Oficiais atribuídos pelo INCM:
- **Vodacom Moçambique**: Prefixos `84` e `85` (Carteira: **M-Pesa**).
- **Tmcel (Moçambique Telecom)**: Prefixos `82` e `83` (Carteira: **mKesh**).
- **Movitel**: Prefixos `86`, `87` e `88` (Carteira: **e-Mola**).

---

### 🪪 Documentos de Identificação Civil e Fiscal

```kotlin
import com.edmilsonmuacigarro.mozutils.MozUtils

fun main() {
    // 1. NUIT (Número Único de Identificação Tributária - 9 dígitos, classes 1 a 9)
    println(MozUtils.isValidNUIT("100000008")) // true (Pessoa Singular)
    println(MozUtils.isValidNUIT("400000001")) // true (Pessoa Colectiva)
    println(MozUtils.isValidNUIT("123456789")) // false (checksum inválido)

    // Classificação da Entidade perante a Autoridade Tributária
    println(MozUtils.getNUITEntityType("100000008")) // "Pessoas Singulares"
    println(MozUtils.getNUITEntityType("400000001")) // "Pessoas Colectivas"

    // 2. Bilhete de Identidade (B.I. - 12 dígitos seguidos de 1 letra maiúscula)
    println(MozUtils.isValidBI("110101234567A")) // true
    println(MozUtils.isValidBI("1101012345671")) // false (terminação deve ser letra)

    // 3. DIRE (Documento de Identificação e Residência para Estrangeiros)
    println(MozUtils.isValidDIRE("120345678A")) // true

    // 4. Passaporte Moçambicano (2 letras seguidas de 7 dígitos)
    println(MozUtils.isValidPassport("AO1234567")) // true

    // 5. Carta de Condução
    println(MozUtils.isValidDrivingLicense("MP1234567")) // true
}
```

---

### 💰 Moeda Nacional (Metical - MZN)

```kotlin
import com.edmilsonmuacigarro.mozutils.MozUtils

fun main() {
    // Formatação monetária (espaço nos milhares, vírgula decimal)
    println(MozUtils.formatMZN(1500.0))          // "1 500,00 MT"
    println(MozUtils.formatMZN(2500000.50))      // "2 500 000,50 MT"
    println(MozUtils.formatMZN(75.25, "MZN"))    // "75,25 MZN"

    // Parsing seguro de strings monetárias para Double
    println(MozUtils.parseMZN("1 500,00 MT"))      // 1500.0
    println(MozUtils.parseMZN("2.500.000,50 MZN")) // 2500000.5
}
```

---

### 🗺️ Divisão Geográfica e Distritos

```kotlin
import com.edmilsonmuacigarro.mozutils.MozUtils

fun main() {
    // 1. Iteração pelas províncias oficiais
    for (prov in MozUtils.getMozambiqueProvinces()) {
        println("${prov["name"]} (${prov["sigla"]})")
    }

    // 2. Busca flexível de distritos (aceita "Maputo", "mpp", "MPT", "Nampula", etc.)
    val distritosMaputo = MozUtils.getDistrictsByProvince("Maputo")
    println(distritosMaputo)
    // [Boane, Magude, Manhiça, Marracuene, Matola, Matutuíne, Moamba, Namaacha]

    val distritosNampula = MozUtils.getDistrictsByProvince("NPL")
    println("Total de distritos em Nampula: ${distritosNampula.size}")

    // 3. Lista global dos 161 distritos
    val todosDistritos = MozUtils.getAllDistricts()
    println("Total nacional de distritos: ${todosDistritos.size}")
}
```

---

### 📬 Sistema Postal e Novo CEP Moçambicano

```kotlin
import com.edmilsonmuacigarro.mozutils.MozUtils

fun main() {
    // 1. Novo CEP (XXXX-XX)
    println(MozUtils.isValidNewCEP("0909-09")) // true (Namutequeliua, Nampula)
    println(MozUtils.isValidNewCEP("1100-01")) // true (Maputo Central)

    // Motor de autocompletar e sugestão offline
    val resultados = MozUtils.suggestCEPs("namutequeliua")
    println(resultados[0]["cep"])       // "0909-09"
    println(resultados[0]["province"])  // "Nampula"
    println(resultados[0]["district"])  // "Nampula"
    println(resultados[0]["locality"])  // "Namutequeliua"

    // 2. Códigos Postais Legados (4 dígitos)
    println(MozUtils.isValidPostalCode("3100")) // true
    println(MozUtils.getPostalCodeLocality("3100")) // "Nampula"
    println(MozUtils.getPostalCodeProvince("3100")) // "Nampula"
}
```

---

### 🧹 Saneamento e Higienização de Dados

```kotlin
import com.edmilsonmuacigarro.mozutils.MozUtils

fun main() {
    // Validação de nomes (exige no mínimo 2 caracteres alfabéticos)
    println(MozUtils.isValidName("Carlos Alberto da Costa")) // true
    println(MozUtils.isValidName("---"))                     // false

    // Sanitização de nomes (Title Case com preposições minúsculas)
    println(MozUtils.sanitizeName("CARLOS ALBERTO DA COSTA E SILVA"))
    // "Carlos Alberto da Costa e Silva"

    // Sanitização de campos de documento e alfanuméricos
    println(MozUtils.sanitizeDocumentField(" 100.000.008 ")) // "100000008"
    println(MozUtils.sanitizeAlphanumericField("110 101 234567a")) // "110101234567A"
}
```

---

## 🛠️ Guia Prático para Android & Jetpack Compose

Implementação completa de um formulário de registo reativo com `StateFlow` e Jetpack Compose, com validação de estado e detecção em tempo real:

```kotlin
package com.example.mozapp.ui

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AccountBalance
import androidx.compose.material.icons.filled.Badge
import androidx.compose.material.icons.filled.CreditCard
import androidx.compose.material.icons.filled.Phone
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardCapitalization
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import com.edmilsonmuacigarro.mozutils.MozUtils

@Composable
fun MozRegistrationScreen() {
    var phone by remember { mutableStateOf("") }
    var nuit by remember { mutableStateOf("") }
    var bi by remember { mutableStateOf("") }
    var nib by remember { mutableStateOf("") }

    // Reatividade em tempo real
    val isPhoneValid = remember(phone) { MozUtils.isValidMozambicanPhone(phone) }
    val operator = remember(phone) { MozUtils.getMobileOperator(phone) }
    val wallet = remember(phone) { MozUtils.getMobileWallet(phone) }

    val isNuitValid = remember(nuit) { MozUtils.isValidNUIT(nuit) }
    val entityType = remember(nuit) { MozUtils.getNUITEntityType(nuit) }

    val isBiValid = remember(bi) { MozUtils.isValidBI(bi) }

    val isNibValid = remember(nib) { MozUtils.isValidNIB(nib) }
    val bankName = remember(nib) { MozUtils.getBankByNIB(nib)?.get("shortName") }

    val isFormValid = isPhoneValid && isNuitValid && isBiValid && (nib.isEmpty() || isNibValid)

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
            .verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Text(
            text = "Cadastro Moçambique",
            style = MaterialTheme.typography.headlineMedium
        )

        // 1. Campo de Telefone com Detecção em Tempo Real
        OutlinedTextField(
            value = phone,
            onValueChange = { phone = it },
            label = { Text("Número de Telefone Móvel") },
            placeholder = { Text("Ex: 841234567 ou +258 84 123 4567") },
            leadingIcon = { Icon(Icons.Default.Phone, contentDescription = null) },
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Phone),
            isError = phone.isNotEmpty() && !isPhoneValid,
            supportingText = {
                if (operator != null) {
                    Text("Operadora: $operator • Carteira: ${wallet ?: "N/D"}")
                } else if (phone.isNotEmpty() && !isPhoneValid) {
                    Text("Número inválido (use Vodacom, Tmcel ou Movitel)")
                }
            },
            modifier = Modifier.fillMaxWidth()
        )

        // 2. Campo de NUIT com Classificação de Entidade
        OutlinedTextField(
            value = nuit,
            onValueChange = {
                if (it.length <= 9) nuit = MozUtils.sanitizeDocumentField(it)
            },
            label = { Text("NUIT (9 Dígitos)") },
            placeholder = { Text("Ex: 100000008") },
            leadingIcon = { Icon(Icons.Default.Badge, contentDescription = null) },
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
            isError = nuit.length == 9 && !isNuitValid,
            supportingText = {
                if (isNuitValid && entityType != null) {
                    Text("Classificação: $entityType")
                } else if (nuit.length == 9 && !isNuitValid) {
                    Text("Dígito de controlo do Módulo 11 inválido")
                }
            },
            modifier = Modifier.fillMaxWidth()
        )

        // 3. Campo de Bilhete de Identidade (B.I.)
        OutlinedTextField(
            value = bi,
            onValueChange = {
                if (it.length <= 13) bi = MozUtils.sanitizeAlphanumericField(it)
            },
            label = { Text("Bilhete de Identidade (B.I.)") },
            placeholder = { Text("12 dígitos + 1 letra (Ex: 110101234567A)") },
            leadingIcon = { Icon(Icons.Default.CreditCard, contentDescription = null) },
            keyboardOptions = KeyboardOptions(capitalization = KeyboardCapitalization.Characters),
            isError = bi.isNotEmpty() && !isBiValid,
            supportingText = {
                if (bi.isNotEmpty() && !isBiValid) {
                    Text("O B.I. deve ter 12 dígitos seguidos de 1 letra")
                }
            },
            modifier = Modifier.fillMaxWidth()
        )

        // 4. Campo de NIB Bancário
        OutlinedTextField(
            value = nib,
            onValueChange = {
                if (it.length <= 21) nib = MozUtils.sanitizeDocumentField(it)
            },
            label = { Text("NIB Bancário (21 Dígitos)") },
            placeholder = { Text("Ex: 000100001234567890194") },
            leadingIcon = { Icon(Icons.Default.AccountBalance, contentDescription = null) },
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
            isError = nib.isNotEmpty() && !isNibValid,
            supportingText = {
                if (isNibValid && bankName != null) {
                    Text("Instituição: $bankName")
                } else if (nib.length == 21 && !isNibValid) {
                    Text("NIB inválido perante o Banco de Moçambique")
                }
            },
            modifier = Modifier.fillMaxWidth()
        )

        Button(
            onClick = {
                val formattedPhone = MozUtils.formatMozambicanPhone(phone)
                val formattedNib = if (nib.isNotEmpty()) MozUtils.formatNIB(nib) else ""
                // Submeter dados para a API / Repositório
            },
            enabled = isFormValid,
            modifier = Modifier.fillMaxWidth()
        ) {
            Text("Confirmar e Registar")
        }
    }
}
```

---

## 🛠️ Resolução de Problemas (Troubleshooting)

- **Erro de compilação: Unresolved reference: io.github.iradowect**  
  *Causa:* O pacote oficial da biblioteca em Kotlin é `com.edmilsonmuacigarro.mozutils.MozUtils`. Ajuste sua declaração de importação para `import com.edmilsonmuacigarro.mozutils.MozUtils`.

- **Erro ao acessar campos do mapa de retorno de `suggestCEPs` (`results[0].cep`)**  
  *Causa:* Em Kotlin, o retorno é `List<Map<String, String>>`. Utilize a sintaxe de acesso a mapas indexados: `results[0]["cep"]`.

---

## 📜 Licença

Distribuído sob a licença de código aberto **Apache-2.0**. Consulte o arquivo [LICENSE](https://github.com/iradoweck/moz-utils/blob/main/LICENSE) para mais detalhes.
