<h1 align="center">moz-utils</h1>

<p align="center">
  <b>Python</b>
</p>

<p align="center">
  <i>The Swiss Army Knife for developers in Mozambique — ported to Python. Ideal for integration into backends with Django, Flask, FastAPI, and data science projects.</i>
</p>

---

## 📦 Installation

You can install the library directly from the local directory or using pip:

```bash
# Installation from the python folder root
pip install .
```

---

## 🚀 API Reference Guide

### 1. Document Validation

#### `is_valid_nuit(nuit: Union[str, int]) -> bool`
Validates if a NUIT (Unique Tax Identification Number) is syntactically valid following the Modulo 11 rules of the Tax Authority (AT).
```python
from moz_utils import is_valid_nuit

is_valid_nuit('123456789')  # True
is_valid_nuit(111111111)    # False (repeated digit)
```

#### `get_nuit_entity_type(nuit: Union[str, int]) -> Optional[str]`
Returns the entity classification corresponding to the first digit of the NUIT. Returns `None` if the NUIT is invalid.
```python
from moz_utils import get_nuit_entity_type

get_nuit_entity_type('100000008')  # "Singular (Cidadãos nacionais/estrangeiros e ENI)"
get_nuit_entity_type('400000006')  # "Colectiva (Sociedades por Quotas, SA, Lda, Associações)"
```

#### `is_valid_bi(bi: str) -> bool`
Validates if the Mozambican National Identity Card (BI) format is correct (12 digits + 1 letter). It ignores spaces and dashes.
```python
from moz_utils import is_valid_bi

is_valid_bi('110101234567A')  # True
is_valid_bi('110101234567 a')  # True (case-insensitive and ignores spaces)
is_valid_bi('11010123456')     # False
```

---

### 2. Mobile Phone and Communication Utilities

#### `is_valid_mozambican_phone(phone: str) -> bool`
Validates if the number belongs to a valid national mobile carrier (Vodacom, Tmcel, or Movitel).
```python
from moz_utils import is_valid_mozambican_phone

is_valid_mozambican_phone('841234567')      # True
is_valid_mozambican_phone('+258869876543')  # True
is_valid_mozambican_phone('991234567')      # False
```

#### `format_mozambican_phone(phone: str) -> str`
Formats the mobile number to the standard international display format: `+258 XX XXX XXXX`. Throws `ValueError` if the number is invalid.
```python
from moz_utils import format_mozambican_phone

format_mozambican_phone('841234567')  # "+258 84 123 4567"
```

#### `get_mobile_operator(phone: str) -> Optional[str]`
Returns the carrier name associated with the phone number (`'Vodacom'`, `'Tmcel'`, or `'Movitel'`).
```python
from moz_utils import get_mobile_operator

get_mobile_operator('841234567')  # "Vodacom"
get_mobile_operator('821234567')  # "Tmcel"
```

#### `build_whatsapp_url(phone: str, message: str = "") -> str`
Generates a direct link to open a WhatsApp conversation pre-filled with the Mozambican country code (`258`) and the optional URL-encoded message.
```python
from moz_utils import build_whatsapp_url

build_whatsapp_url('841234567', 'Olá Formiga Antonio, bem-vindo a Nampula!')
# "https://wa.me/258841234567?text=Ol%C3%A1%20Formiga%20Antonio%2C%20bem-vindo%20a%20Nampula%21"
```

---

### 3. Currency Utilities

#### `format_mzn(value: float, currency: str = 'MT') -> str`
Formats a value into the official Metical format (space separator for thousands, comma for decimals).
```python
from moz_utils import format_mzn

format_mzn(1250.5)         # "1 250,50 MT"
format_mzn(5000000, 'MZN') # "5 000 000,00 MZN"
```

---

### 4. Geographical Database

```python
from moz_utils import get_mozambique_provinces, get_districts_by_province, get_all_districts

# 1. Get the complete list with all provinces, districts, posts, and neighborhoods
provinces = get_mozambique_provinces()

# 2. Get districts of a specific province by its ID (e.g., 'npl' for Nampula)
nampula_districts = get_districts_by_province('npl')  # ['Angoche', 'Eráti', ...]

# 3. Get a flat list of all districts along with their respective provinces
all_districts = get_all_districts()
```

## 📄 License

This project is licensed under the **AGPL-3.0-or-later** license.

---

<p align="center">
  Developed by <b>Edmilson Muacigarro</b> and contributors.
</p>
