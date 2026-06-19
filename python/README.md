# moz-utils (Python)

The definitive, zero-dependency, offline-first open-source library for software built in or for **Mozambique**.

[![PyPI](https://img.shields.io/pypi/v/moz-utils?label=PyPI&color=3776ab)](https://pypi.org/project/moz-utils/)
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

- **Python**: `>= 3.8`
- **Ecosystem**: Natively tested on Django, FastAPI, Flask, and raw Data Science scripts (Jupyter/Pandas).

---

## 📦 Installation

Install via pip:

```bash
pip install moz-utils
```

---

## 🚀 Comprehensive Usage Guide

### 📱 Phones & Mobile

Validating and extracting information from Mozambican mobile numbers. Fully supports Vodacom, Tmcel, and Movitel.

```python
from moz_utils import (
    is_valid_mozambican_phone, 
    get_mobile_operator, 
    get_mobile_wallet, 
    format_mozambican_phone,
    build_whatsapp_url 
)

# Validation
print(is_valid_mozambican_phone("841234567"))       # True
print(is_valid_mozambican_phone("+258 82 123 4567")) # True
print(is_valid_mozambican_phone("811234567"))        # False

# Operator & Wallet Extraction
print(get_mobile_operator("841234567")) # "Vodacom"
print(get_mobile_wallet("861234567"))   # "e-Mola"

# Formatting
print(format_mozambican_phone("84 123 4567")) # "+258841234567"

# WhatsApp Links
url = build_whatsapp_url("841234567", "Hello!")
print(url) # "https://wa.me/258841234567?text=Hello%21"
```

#### ⚙️ Under the Hood: Operator Prefixes
Telecommunication operators in Mozambique acquire specific number blocks through the INCM. We map operators using this offline logic:
- **Vodacom**: Starts with `84` or `85`.
- **Tmcel**: Starts with `82` or `83`.
- **Movitel**: Starts with `86` or `87` or `88`.

---

### 🪪 Identity Documents

Validating documents prevents fraudulent registrations in systems deployed in Maputo, Nampula, or any other province.

```python
from moz_utils import (
    is_valid_nuit, 
    get_nuit_entity_type, 
    is_valid_bi, 
    is_valid_passport, 
    is_valid_dire, 
    is_valid_driving_license 
)

# NUIT (Tax ID)
print(is_valid_nuit("400000008")) # True
print(get_nuit_entity_type("400000008")) # "Singular" (Individual)

# BI (Identity Card)
print(is_valid_bi("123456789123A")) # True

# Passports, DIRE & Driving License
print(is_valid_passport("AO1234567")) # True
print(is_valid_dire("120345678A"))   # True
print(is_valid_driving_license("MP1234567")) # True
```

#### ⚙️ Under the Hood: The NUIT Algorithm
Unlike other tax numbers that use descending multipliers, the Mozambican Tax Authority uses a specific fixed matrix of weights `[8, 9, 4, 5, 6, 7, 8, 9]` to calculate the Modulo 11 for the NUIT. `moz-utils` replicates this exact mathematical equation offline.

---

### 💰 Currency (MZN)

Format numbers into the official Metical standard.

```python
from moz_utils import format_mzn

print(format_mzn(1500)) # "1 500,00 MT"
print(format_mzn(2500000.5)) # "2 500 000,50 MT"
```

---

### 🗺️ Geography & Districts

An offline database containing all 11 provinces and 161 districts of Mozambique.

```python
from moz_utils import MOZAMBIQUE_PROVINCES, get_districts_by_province, get_all_districts

# Loop through provinces
for p in MOZAMBIQUE_PROVINCES:
    print(p['name'])

# Get districts for a specific province
maputo_districts = get_districts_by_province("Maputo")
print(maputo_districts) # ["Boane", "Magude", "Manhiça", "Marracuene", ...]

# Get all 161 districts in a flat array
all_districts = get_all_districts()
```

---

### 📬 Postal Codes (CEP)

Mozambique recently transitioned from the classic 4-digit code to a modern 6-digit CEP (`XXXX-XX`). `moz-utils` supports both!

```python
from moz_utils import is_valid_new_cep, suggest_ceps, is_valid_postal_code, get_postal_code_locality

# Modern CEP
print(is_valid_new_cep("3100-05")) # True

# Autocomplete / Suggestion Engine
results = suggest_ceps("namutequeliua")
print(results[0]) 
# {'cep': '3100-05', 'province': 'Nampula', 'district': 'Nampula', 'locality': 'Namutequeliua'}

# Legacy Postal Codes
print(is_valid_postal_code("3100")) # True
print(get_postal_code_locality("3100")) # "Nampula"
```

#### ⚙️ Under the Hood: The New CEP
The New Postal Addressing Code (CEP) abandons the old 4-digit system in favor of a geospatial alphanumeric format (`XXXX-XX`). We ported the entire official geographic mapping tree to provide instant autocomplete.

---

## 🛠️ Troubleshooting

- **My NUIT fails validation, but the user swears it's real!**
  *Cause:* The Mozambican NUIT uses a Check Digit generated through a Modulo 11 algorithm. `moz-utils` does not make exceptions to the mathematical algorithm. If your system accepts mathematically invalid NUITs, your company might face integration issues with the government's e-Tributação systems.
  
- **Names Returning Empty to the Database (Sanitize)**
  *Cause:* The `sanitize_name()` function aggressively strips mathematical characters and numbers. Always run `is_valid_name()` **before** sanitizing and saving to the database to ensure the string contains actual alphabetical characters.

---

## 📜 License

This project is licensed under the **AGPL-3.0 License** - see the LICENSE file for details.
