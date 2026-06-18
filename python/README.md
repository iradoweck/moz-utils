<h1 align="center">moz-utils</h1>

<p align="center">
  <b>Python (Django/FastAPI)</b>
</p>

<p align="center">
  <a href="https://pypi.org/project/moz-utils/">
    <img src="https://img.shields.io/pypi/v/moz-utils?color=3776ab&logo=python&logoColor=white" alt="PyPI Version" />
  </a>
  <a href="https://pypi.org/project/moz-utils/">
    <img src="https://img.shields.io/pypi/dm/moz-utils" alt="PyPI Downloads" />
  </a>
</p>

<p align="center">
  <i>The digital foundation of Mozambican identity. The definitive Swiss army knife for validations, postal codes, and financial ecosystems in Mozambique, natively ported to the Python ecosystem.</i>
</p>

---

## 📜 The Vision

In Mozambique, digital accuracy is the foundation of the future. From the pulse of mobile wallets in the squares to the rigorous structure of the National ID (BI), **moz-utils** exists to ensure that every piece of data that crosses your backend (Django, Flask, FastAPI) or Data Science script is validated, structured, and authentic.

Built impeccably for the Python ecosystem, this package is more than a library — it is the open-source validation infrastructure our country deserves. Clean code, tested, and poetically engineered for Mozambique.

---

## 📦 Installation

Install using `pip`:

```bash
pip install moz-utils
```

Or using `poetry`:

```bash
poetry add moz-utils
```

---

## 🚀 API Reference Guide

### 1. Identity & Documents

```python
from moz_utils import (
    is_valid_bi,
    is_valid_nuit,
    get_nuit_entity_type,
    is_valid_dire,
    is_valid_passport,
    is_valid_driving_license
)

# National ID (12 digits + 1 letter)
is_valid_bi("110101234567A")  # True

# NUIT - Unique Tax Identification Number (Per AT Decree n. 28/2012)
is_valid_nuit("401626638")    # True
get_nuit_entity_type("400000006")  # "Pessoas Colectivas"
get_nuit_entity_type("100000008")  # "Pessoas Singulares"

# DIRE - Foreign Resident Identification Document
is_valid_dire("00008312C")    # True

# Passport and Driving License
is_valid_passport("AO1234567")       # True
is_valid_driving_license("M123456")   # True
```

---

### 2. Name & String Sanitization

Clean up dirty user input from forms before saving to your database:

```python
from moz_utils import (
    is_valid_name,
    sanitize_name,
    sanitize_document_field,
    sanitize_alphanumeric_field
)

is_valid_name("Edmilson O'Brian-Muacigarro") # True
is_valid_name("Edmilson 123")                # False

sanitize_name("  EDMILSON  muacigarro ")    # "Edmilson Muacigarro"
sanitize_name("João", all_caps=True)        # "JOÃO"

sanitize_document_field("123 456-789")       # "123456789"
sanitize_alphanumeric_field("110 101 a")     # "110101A"
```

---

### 3. Financial Toolkit (Metical)

```python
from moz_utils import format_mzn, parse_mzn

# Format database floats into official AT formats
format_mzn(1500)          # "1 500,00 MT"
format_mzn(50000, "MZN")  # "50 000,00 MZN"

# Parse dirty strings back into database floats
parse_mzn("1.500,00 MT")  # 1500.00
parse_mzn("1 500,00MZN")  # 1500.00
```

---

### 4. Financial Ecosystem and Telecommunications

Deep mapping of the Mozambican digital circulatory system — identifies operators and the pulse of associated mobile wallets.

```python
from moz_utils import (
    is_valid_mozambican_phone,
    format_mozambican_phone,
    get_mobile_operator,
    get_mobile_wallet,
    build_whatsapp_url
)

# Validation and Formatting
is_valid_mozambican_phone("841234567")  # True
format_mozambican_phone("841234567")   # "+258 84 123 4567"

# Telecom and Financial Intelligence
get_mobile_operator("841234567")  # "Vodacom"
get_mobile_wallet("841234567")    # "M-Pesa"
get_mobile_wallet("821234567")    # "mKesh"
get_mobile_wallet("861234567")    # "e-Mola"

# Social Connections
build_whatsapp_url("841234567", "Hello, Mozambique!") 
# "https://wa.me/258841234567?text=Hello%2C%20Mozambique%21"
```

---

### 3. Postal Codes (Legacy and New CEP)

A graceful transition between the past and the future: from the old post office stations to the geo-referenced New CEP.

```python
from moz_utils import (
    is_valid_new_cep,
    suggest_ceps,
    is_valid_postal_code,
    get_postal_code_locality
)

# The Future (New CEP: Province, District, and Locality)
is_valid_new_cep("0101-01")  # True

# Intelligent Suggestion Engine (Supports Legacy -> New Transition)
# Search by the old code "3100" (Nampula) or by a neighborhood
suggest_ceps("3100")
suggest_ceps("Namutequeliua")

# The Legacy
is_valid_postal_code("3100")            # True
get_postal_code_locality("3100")        # "Nampula"
```

---

### 4. National Geography and Finances

```python
from moz_utils import (
    format_mzn,
    get_mozambique_provinces,
    get_districts_by_province
)

# Monumental Value
format_mzn(1250.5)         # "1 250,50 MT"

# Full Geography
provinces = get_mozambique_provinces()
nampula_districts = get_districts_by_province("npl")
```

---

## 🤝 Rules of Conduct and Contribution

This is not just any project. It is a project of national pride. We ask for excellence in code, compassion with colleagues, and the ambition to make the Mozambican web world-class. Read our `CODE_OF_CONDUCT.md` in the project root.

## 📄 License

The code lives and breathes the freedom of Open Source. Licensed under **AGPL-3.0-or-later**.

---

<p align="center">
  Developed by <b>Open Source Contributors</b> & supported by <b>Edmilson Muacigarro</b>
</p>


---

## 🧮 O Algoritmo NUIT (A Verdadeira Fórmula Moçambicana)

Ao contrário do NIF de Portugal (que usa multiplicadores de 9 a 2), a Autoridade Tributária de Moçambique utiliza a seguinte matriz de pesos para calcular o Módulo 11 do NUIT.

**A Fórmula e os Pesos Oficiais:**
```text
NUIT a Validar: 401626638

Posição:   1   2   3   4   5   6   7   8
Dígitos:   4   0   1   6   2   6   6   3
Pesos:     8   9   4   5   6   7   8   9
           |   |   |   |   |   |   |   |
Mult:     32 + 0 + 4 +30 +12 +42 +48 +27 = 195 (Soma)

Cálculo do Módulo 11:
1. Resto = Soma % 11
   195 % 11 = 8
2. O "Resto" é o Índice (Posição 0 a 10) na string de controlo "01234567891".
3. A 8ª posição de "01234567891" é '8'.
4. Como o 9º dígito do NUIT (Dígito de Controlo) é '8', o NUIT é Válido!
```
