# moz_utils (Python)

> O Canivete Suíço para programadores em Moçambique — portado para Python. Ideal para integração em backends com Django, Flask, FastAPI e projetos de ciência de dados.

---

## 📦 Instalação

Pode instalar a biblioteca diretamente do diretório local ou através do seu gestor de pacotes preferido:

```bash
# Instalação a partir da raiz da pasta python
pip install .
```

---

## 🚀 Guia de Referência da API

### 1. Validação de Documentos

#### `is_valid_nuit(nuit: Union[str, int]) -> bool`
Valida se um NUIT é sintaticamente válido seguindo as regras da AT (Autoridade Tributária) baseadas no Módulo 11.
```python
from moz_utils import is_valid_nuit

is_valid_nuit('123456789')  # True
is_valid_nuit(111111111)    # False (dígito repetido)
```

#### `get_nuit_entity_type(nuit: Union[str, int]) -> Optional[str]`
Retorna a classificação da entidade correspondente ao primeiro dígito do NUIT. Retorna `None` se o NUIT for inválido.
```python
from moz_utils import get_nuit_entity_type

get_nuit_entity_type('100000008')  # "Singular (Cidadãos nacionais/estrangeiros e ENI)"
get_nuit_entity_type('400000006')  # "Colectiva (Sociedades por Quotas, SA, Lda, Associações)"
```

#### `is_valid_bi(bi: str) -> bool`
Valida se o formato do Bilhete de Identidade moçambicano está correto (12 dígitos + 1 letra). Ignora espaços e traços.
```python
from moz_utils import is_valid_bi

is_valid_bi('110101234567A')  # True
is_valid_bi('110101234567 a')  # True (caso insensível a maiúsculas/espaços)
is_valid_bi('11010123456')     # False
```

---

### 2. Utilitários de Telemóvel e Comunicação

#### `is_valid_mozambican_phone(phone: str) -> bool`
Valida se o número pertence a uma operadora de telecomunicações móveis nacional válida (Vodacom, Tmcel ou Movitel).
```python
from moz_utils import is_valid_mozambican_phone

is_valid_mozambican_phone('841234567')      # True
is_valid_mozambican_phone('+258869876543')  # True
is_valid_mozambican_phone('991234567')      # False
```

#### `format_mozambican_phone(phone: str) -> str`
Formata o número de telemóvel para o padrão internacional: `+258 XX XXX XXXX`. Lança `ValueError` se for inválido.
```python
from moz_utils import format_mozambican_phone

format_mozambican_phone('841234567')  # "+258 84 123 4567"
```

#### `get_mobile_operator(phone: str) -> Optional[str]`
Retorna o nome da operadora associada ao telemóvel (`'Vodacom'`, `'Tmcel'` ou `'Movitel'`).
```python
from moz_utils import get_mobile_operator

get_mobile_operator('841234567')  # "Vodacom"
get_mobile_operator('821234567')  # "Tmcel"
```

#### `build_whatsapp_url(phone: str, message: str = "") -> str`
Gera uma ligação direta para o WhatsApp com DDI moçambicano (`258`) e mensagem configurada.
```python
from moz_utils import build_whatsapp_url

build_whatsapp_url('841234567', 'Olá Formiga Antonio, bem-vindo a Nampula!')
# "https://wa.me/258841234567?text=Ol%C3%A1%20Formiga%20Antonio%2C%20bem-vindo%20a%20Nampula%21"
```

---

### 3. Utilitário Monetário

#### `format_mzn(value: float, currency: str = 'MT') -> str`
Formata um valor no padrão oficial de Meticais (espaço para milhares, vírgula para decimais).
```python
from moz_utils import format_mzn

format_mzn(1250.5)         # "1 250,50 MT"
format_mzn(5000000, 'MZN') # "5 000 000,00 MZN"
```

---

### 4. Base de Dados Geográfica

```python
from moz_utils import get_mozambique_provinces, get_districts_by_province, get_all_districts

# 1. Obter a lista completa com todas as províncias, distritos, postos e bairros
provincias = get_mozambique_provinces()

# 2. Obter distritos de uma província específica pelo seu ID (ex: 'npl' para Nampula)
distritos_nampula = get_districts_by_province('npl')  # ['Angoche', 'Eráti', ...]

# 3. Obter uma lista contendo todos os distritos planos e sua respetiva província
todos_distritos = get_all_districts()
```

## 📄 Licença

Este projeto é licenciado sob a licença **AGPL-3.0-or-later**.

---

<p align="center">
  Desenvolvido por <b>Edmilson Muacigarro</b> e contribuidores.
</p>
