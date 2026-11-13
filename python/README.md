# moz-utils (Python)

A biblioteca de código aberto definitiva, com zero dependências externas e execução *offline-first*, desenvolvida para sistemas e softwares em **Moçambique**.

[![PyPI](https://img.shields.io/badge/PyPI-v0.4.0-3776ab?logo=pypi&logoColor=white)](https://pypi.org/project/moz-utils/)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://github.com/iradoweck/moz-utils/blob/main/LICENSE)
[![CI](https://github.com/iradoweck/moz-utils/actions/workflows/ci.yml/badge.svg)](https://github.com/iradoweck/moz-utils/actions/workflows/ci.yml)
[![Website](https://img.shields.io/badge/Docs-Website-blue)](https://iradoweck.github.io/moz-utils/)

> **Autor:** Edmilson Muacigarro (@iradoweck)  
> **Documentação Oficial:** [iradoweck.github.io/moz-utils](https://iradoweck.github.io/moz-utils/)  
> **Repositório GitHub:** [iradoweck/moz-utils](https://github.com/iradoweck/moz-utils)

---

## 🌍 A Visão

No desenvolvimento de aplicações em Moçambique, os engenheiros de software deparam-se continuamente com os mesmos desafios fundamentais:
- 🔎 **Este NUIT é matematicamente autêntico?** — A Autoridade Tributária de Moçambique (AT) utiliza o algoritmo do Módulo 11 com uma matriz de pesos específica. Um único dígito incorreto invalida faturas perante o sistema e-Tributação.
- 📱 **O número pertence à Vodacom, Tmcel ou Movitel?** — Cada operadora móvel possui faixas específicas atribuídas pelo INCM (Instituto Nacional das Comunicações de Moçambique), essenciais para integrações com carteiras móveis (M-Pesa, e-Mola, mKesh).
- 🏦 **Como validar e formatar contas bancárias (NIB e IBAN)?** — O Banco de Moçambique adota a norma internacional ISO 7064 Módulo 97-10 para os 21 dígitos do NIB e o prefixo internacional `MZ59` no IBAN.
- 🗺️ **Qual é o novo CEP de Namutequeliua em Nampula?** — A transição do código postal legado de 4 dígitos para o novo CEP de 6 dígitos (`XXXX-XX`) gerou um catálogo nacional moderno que disponibilizamos de forma offline.
- 🪪 **Como verificar B.I., DIRE ou Passaporte?** — Documentos de identificação moçambicanos possuem regras rígidas de estrutura e caracteres.

O `moz-utils` resolve todas estas necessidades **de forma nativa**, com **zero dependências externas de execução**, **algoritmos puramente offline**, **tipagem estrita (PEP 561 / py.typed)** e **privacidade absoluta** (nenhum dado do utilizador trafega pela rede).

---

## 💻 Requisitos do Sistema

- **Python**: `>= 3.9` (totalmente testado e homologado em Python 3.10, 3.11, 3.12 e 3.13).
- **Tipagem**: Compatível com PEP 561 (`py.typed`), com suporte integral a Mypy, Pyright e IDEs modernas.
- **Ecossistema**: Testado em FastAPI, Django, Flask, Celery, e scripts de Engenharia e Análise de Dados (Pandas, Polars, Jupyter).

---

## 📦 Instalação

Instale diretamente através do gerenciador de pacotes pip:

```bash
pip install moz-utils
```

Ou utilizando o Poetry:

```bash
poetry add moz-utils
```

Ou com `uv`:

```bash
uv add moz-utils
```

---

## 🚀 Guia Completo de Utilização

### 🏦 Sistema Financeiro e Bancário (NIB, IBAN e Catálogo de Bancos)

O módulo bancário do `moz-utils` implementa a validação matemática oficial do **Número de Identificação Bancária (NIB)** conforme as diretrizes do Banco de Moçambique e a norma **ISO 7064 Módulo 97-10**, além do suporte completo ao **IBAN Moçambicano** (`MZ59` + 21 dígitos).

```python
from moz_utils import (
    is_valid_nib,
    format_nib,
    get_bank_by_nib,
    nib_to_iban,
    is_valid_iban,
    MOZAMBIQUE_BANKS,
)

# NIB de 21 dígitos (BBBB AAAA CCCCCCCCCCC KK)
nib_exemplo = "000100001234567890194"

# 1. Validação matemática oficial (Módulo 97-10)
print(is_valid_nib(nib_exemplo))  # True
print(is_valid_nib("000100001234567890100"))  # False (dígito de controlo adulterado)
print(is_valid_nib("999900001234567890100"))  # False (banco inexistente)

# 2. Formatação canónica (BBBB.AAAA.CCCCCCCCCCC.KK)
print(format_nib(nib_exemplo))  # "0001.0000.12345678901.94"

# 3. Identificação da instituição bancária
banco = get_bank_by_nib(nib_exemplo)
print(banco)
# {
#     'code': '0001',
#     'name': 'Banco Internacional de Moçambique',
#     'short_name': 'Millennium BIM'
# }

# 4. Conversão de NIB para IBAN oficial (MZ59 + 21 dígitos)
iban = nib_to_iban(nib_exemplo)
print(iban)  # "MZ59000100001234567890194"

# 5. Validação de IBAN moçambicano
print(is_valid_iban(iban))  # True
print(is_valid_iban("MZ59 0001 0000 1234 5678 9019 4"))  # True (tolerante a espaços)
print(is_valid_iban("PT50000100001234567890194"))  # False (prefixo não moçambicano)

# 6. Catálogo dos 18 bancos comerciais oficiais
print(f"Total de bancos registados: {len(MOZAMBIQUE_BANKS)}")
print(MOZAMBIQUE_BANKS["0008"]["short_name"])  # "BCI"
print(MOZAMBIQUE_BANKS["0003"]["short_name"])  # "Standard Bank"
```

#### ⚙️ Por Dentro da Lógica Bancária: Módulo 97-10
O NIB em Moçambique é estruturado em:
- `BBBB` (4 dígitos): Código de compensação da instituição bancária.
- `AAAA` (4 dígitos): Código da agência ou balcão.
- `CCCCCCCCCCC` (11 dígitos): Número da conta corrente (preenchido com zeros à esquerda).
- `KK` (2 dígitos): Dígitos verificadores de segurança.

A equação algorítmica toma os 19 primeiros dígitos seguidos de dois zeros ($D = d_1 \dots d_{19} 00$) e calcula o resto da divisão inteira por 97:
$$K_{esperado} = 98 - (D \pmod{97})$$
Se o resultado obtido coincidir rigorosamente com os dois últimos dígitos `KK`, o NIB é válido.

---

### 📱 Telefonia, Operadoras e Carteiras Móveis

Validação, normalização e extração de metadados para telecomunicações de Moçambique, cobrindo Vodacom, Tmcel e Movitel.

```python
from moz_utils import (
    is_valid_mozambican_phone,
    format_mozambican_phone,
    get_mobile_operator,
    get_mobile_wallet,
    build_whatsapp_url,
)

# Validação (aceita formatos locais, com código de país +258, com hífens ou espaços)
print(is_valid_mozambican_phone("841234567"))          # True
print(is_valid_mozambican_phone("+258 82 123 4567"))    # True
print(is_valid_mozambican_phone("811234567"))           # False (prefixo 81 não existe)

# Identificação de Operadora e Carteira Móvel
print(get_mobile_operator("841234567"))  # "Vodacom"
print(get_mobile_operator("821234567"))  # "Tmcel"
print(get_mobile_operator("861234567"))  # "Movitel"

print(get_mobile_wallet("841234567"))    # "M-Pesa"
print(get_mobile_wallet("821234567"))    # "mKesh"
print(get_mobile_wallet("861234567"))    # "e-Mola"

# Formatação no padrão internacional legível
print(format_mozambican_phone("841234567"))  # "+258 84 123 4567"

# Geração de links directos para WhatsApp com sanitização do número
url = build_whatsapp_url("841234567", "Olá, preciso de informações!")
print(url)
# "https://wa.me/258841234567?text=Ol%C3%A1%2C+preciso+de+informa%C3%A7%C3%B5es%21"
```

#### ⚙️ Prefixos Oficiais atribuídos pelo INCM:
- **Vodacom Moçambique**: Prefixos `84` e `85` (Carteira: **M-Pesa**).
- **Tmcel (Moçambique Telecom)**: Prefixos `82` e `83` (Carteira: **mKesh**).
- **Movitel**: Prefixos `86`, `87` e `88` (Carteira: **e-Mola**).

---

### 🪪 Documentos de Identificação Civil e Fiscal

Validação estrutural e algorítmica para evitar fraudes cadastrais em portais web e sistemas corporativos.

```python
from moz_utils import (
    is_valid_nuit,
    get_nuit_entity_type,
    is_valid_bi,
    is_valid_dire,
    is_valid_passport,
    is_valid_driving_license,
)

# 1. NUIT (Número Único de Identificação Tributária - 9 dígitos)
print(is_valid_nuit("100000008"))  # True (Pessoa Singular)
print(is_valid_nuit("400000001"))  # True (Pessoa Colectiva)
print(is_valid_nuit("123456789"))  # False (checksum inválido)

# Classificação da Entidade perante a Autoridade Tributária
print(get_nuit_entity_type("100000008"))  # "Pessoas Singulares"
print(get_nuit_entity_type("400000001"))  # "Pessoas Colectivas"
print(get_nuit_entity_type("700000000"))  # "Estado / Públicas" (quando checksum válido)

# 2. Bilhete de Identidade (B.I. - 12 dígitos seguidos de 1 letra maiúscula)
print(is_valid_bi("110101234567A"))  # True
print(is_valid_bi("1101012345671"))  # False (terminação deve ser letra)

# 3. DIRE (Documento de Identificação e Residência para Estrangeiros)
print(is_valid_dire("120345678A"))  # True

# 4. Passaporte Moçambicano (2 letras seguidas de 7 dígitos)
print(is_valid_passport("AO1234567"))  # True

# 5. Carta de Condução
print(is_valid_driving_license("MP1234567"))  # True
```

#### ⚙️ O Algoritmo do NUIT Moçambicano
A Autoridade Tributária adota uma equação de **Módulo 11** com a matriz de ponderação fixa `[8, 9, 4, 5, 6, 7, 8, 9]`. Os primeiros 8 dígitos são multiplicados pelos respetivos pesos. O resto da divisão por 11 é mapeado na tabela de substituição `"01234567891"` para determinar o dígito verificador final.

A classificação das entidades é definida pelo primeiro dígito:
- **1, 2, 3**: Pessoas Singulares (cidadãos nacionais, estrangeiros e empresários em nome individual).
- **4, 5**: Pessoas Colectivas (Sociedades por Quotas, S.A., Lda., Associações, Cooperativas).
- **6**: Entidades Equiparadas (Heranças jacentes, condomínios, consórcios).
- **7**: Estado e Instituições Públicas (Ministérios, Direcções Nacionais, Municípios).
- **8**: Outras Entidades.
- **9**: Entidades Estrangeiras e Representações Diplomáticas.

---

### 💰 Moeda Nacional (Metical - MZN)

Formatação e conversão monetária de acordo com as convenções oficiais de Moçambique (espaço como separador de milhares e vírgula como separador decimal).

```python
from moz_utils import format_mzn, parse_mzn

# Formatação monetária (aceita float, int e Decimal)
print(format_mzn(1500))         # "1 500,00 MT"
print(format_mzn(2500000.50))   # "2 500 000,50 MT"
print(format_mzn(75.25, currency="MZN"))  # "75,25 MZN"

# Parsing seguro de strings monetárias para float
print(parse_mzn("1 500,00 MT"))     # 1500.0
print(parse_mzn("2.500.000,50 MZN")) # 2500000.5
```

---

### 🗺️ Divisão Geográfica e Distritos

Base territorial completa e atualizada contendo as 11 províncias e os 161 distritos de Moçambique, com suporte a busca flexível por ID, sigla ou nome por extenso.

```python
from moz_utils import (
    MOZAMBIQUE_PROVINCES,
    get_mozambique_provinces,
    get_districts_by_province,
    get_all_districts,
)

# 1. Iteração pelas províncias oficiais
for prov in MOZAMBIQUE_PROVINCES:
    print(f"{prov['name']} ({prov['sigla']}) - {len(prov['districts'])} distritos")

# 2. Busca flexível de distritos (aceita nome, sigla ou identificador interno)
distritos_maputo = get_districts_by_province("Maputo")
print(distritos_maputo)
# ['Boane', 'Magude', 'Manhiça', 'Marracuene', 'Matola', 'Matutuíne', 'Moamba', 'Namaacha']

# Também aceita siglas ou IDs:
distritos_nampula = get_districts_by_province("NPL")  # ou "npl", ou "Nampula"
print(f"Total de distritos em Nampula: {len(distritos_nampula)}")

# 3. Lista global dos 161 distritos com postos administrativos e bairros
todos_distritos = get_all_districts()
print(f"Total nacional de distritos: {len(todos_distritos)}")
```

---

### 📬 Sistema Postal e Novo CEP Moçambicano

Moçambique implementou o **Novo Código de Endereçamento Postal (CEP)** no formato `XXXX-XX` (6 dígitos alfanuméricos com hífen). O `moz-utils` provê o primeiro motor offline de autocompletar e validação para ambas as gerações de códigos postais.

```python
from moz_utils import (
    is_valid_new_cep,
    suggest_ceps,
    is_valid_postal_code,
    get_postal_code_locality,
    get_postal_code_province,
)

# 1. Novo CEP (XXXX-XX)
print(is_valid_new_cep("0909-09"))  # True (Namutequeliua, Nampula)
print(is_valid_new_cep("1100-01"))  # True (Maputo Central)
print(is_valid_new_cep("9999"))     # False

# Motor de sugestão e autocompletar offline
resultados = suggest_ceps("namutequeliua")
print(resultados[0])
# {
#     'cep': '0909-09',
#     'province': 'Nampula',
#     'district': 'Nampula',
#     'locality': 'Namutequeliua'
# }

# 2. Códigos Postais Legados (4 dígitos)
print(is_valid_postal_code("3100"))  # True
print(get_postal_code_locality("3100"))  # "Nampula"
print(get_postal_code_province("3100"))  # "Nampula"
```

---

### 🧹 Saneamento e Higienização de Dados

Evite registos corrompidos, nomes mal formatados e dados ruidosos em bancos de dados.

```python
from moz_utils import (
    is_valid_name,
    sanitize_name,
    sanitize_document_field,
    sanitize_alphanumeric_field,
)

# Validação de nomes (exige no mínimo 2 caracteres alfabéticos, rejeita ruídos)
print(is_valid_name("João Manuel da Silva"))  # True
print(is_valid_name("---"))                   # False

# Higienização de nomes (Title Case preservando partículas minúsculas da língua portuguesa)
print(sanitize_name("JOÃO MANUEL DA SILVA E COSTA"))
# "João Manuel da Silva e Costa"

# Sanitização de campos de documento e alfanuméricos
print(sanitize_document_field(" 100.000.008 "))  # "100000008"
print(sanitize_alphanumeric_field("110 101 234567a"))  # "110101234567A"
```

---

## 🛠️ Guias Práticos de Integração com Frameworks

### 1. Integração com FastAPI & Pydantic v2

Crie endpoints modernos de alta performance com validação automática nos esquemas de entrada via `@field_validator`:

```python
from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel, Field, field_validator
from moz_utils import (
    is_valid_mozambican_phone,
    format_mozambican_phone,
    get_mobile_operator,
    get_mobile_wallet,
    is_valid_nuit,
    get_nuit_entity_type,
    is_valid_bi,
    is_valid_nib,
    format_nib,
    get_bank_by_nib,
    sanitize_name,
    is_valid_name,
)

app = FastAPI(
    title="API Moçambique",
    description="Serviço REST com validações do moz-utils v0.4.0",
    version="0.4.0"
)

class RegistoClienteSchema(BaseModel):
    nome_completo: str = Field(..., example="Amélia Maria Sitoe")
    telefone: str = Field(..., example="+258 84 123 4567")
    nuit: str = Field(..., example="100000008")
    bi: str = Field(..., example="110101234567A")
    nib: str = Field(..., example="000100001234567890194")

    @field_validator("nome_completo")
    @classmethod
    def validar_e_sanitizar_nome(cls, v: str) -> str:
        if not is_valid_name(v):
            raise ValueError("O nome informado contém caracteres inválidos.")
        return sanitize_name(v)

    @field_validator("telefone")
    @classmethod
    def validar_e_formatar_telefone(cls, v: str) -> str:
        if not is_valid_mozambican_phone(v):
            raise ValueError("Número moçambicano inválido. Deve pertencer à Vodacom, Tmcel ou Movitel.")
        return format_mozambican_phone(v)

    @field_validator("nuit")
    @classmethod
    def validar_nuit_field(cls, v: str) -> str:
        if not is_valid_nuit(v):
            raise ValueError("NUIT inválido perante o algoritmo Módulo 11 da Autoridade Tributária.")
        return v.strip()

    @field_validator("bi")
    @classmethod
    def validar_bi_field(cls, v: str) -> str:
        if not is_valid_bi(v):
            raise ValueError("Bilhete de Identidade (B.I.) inválido. Formato: 12 dígitos seguidos de 1 letra.")
        return v.strip().upper()

    @field_validator("nib")
    @classmethod
    def validar_e_formatar_nib(cls, v: str) -> str:
        if not is_valid_nib(v):
            raise ValueError("NIB moçambicano inválido perante a regra ISO 7064 Módulo 97-10.")
        return format_nib(v)

@app.post("/api/v1/clientes", status_code=status.HTTP_201_CREATED)
def criar_cliente(payload: RegistoClienteSchema):
    operadora = get_mobile_operator(payload.telefone)
    carteira = get_mobile_wallet(payload.telefone)
    entidade = get_nuit_entity_type(payload.nuit)
    banco = get_bank_by_nib(payload.nib)

    return {
        "mensagem": "Cliente validado e registado com sucesso!",
        "cliente": payload.model_dump(),
        "metadados": {
            "telecom": {"operadora": operadora, "carteira_movel": carteira},
            "fiscal": {"tipo_entidade": entidade},
            "bancario": banco,
        }
    }
```

---

### 2. Integração com Django (Forms & Models)

Proteja formulários de administração e portais de clientes no Django com métodos de limpeza `clean_<campo>`:

```python
# forms.py
from django import forms
from django.core.exceptions import ValidationError
from moz_utils import (
    is_valid_nuit,
    is_valid_mozambican_phone,
    format_mozambican_phone,
    is_valid_bi,
    is_valid_nib,
    format_nib,
    sanitize_name,
)

class ClienteForm(forms.Form):
    nome = forms.CharField(max_length=150, label="Nome Completo")
    telefone = forms.CharField(max_length=20, label="Telefone Móvel")
    nuit = forms.CharField(max_length=9, label="NUIT")
    bi = forms.CharField(max_length=13, label="Bilhete de Identidade")
    nib = forms.CharField(max_length=25, label="NIB Bancário")

    def clean_nome(self):
        nome = self.cleaned_data.get("nome", "")
        return sanitize_name(nome)

    def clean_telefone(self):
        tel = self.cleaned_data.get("telefone", "")
        if not is_valid_mozambican_phone(tel):
            raise ValidationError("Número de telefone moçambicano inválido.")
        return format_mozambican_phone(tel)

    def clean_nuit(self):
        nuit = self.cleaned_data.get("nuit", "")
        if not is_valid_nuit(nuit):
            raise ValidationError("O NUIT informado é matematicamente inválido pela AT.")
        return nuit.strip()

    def clean_bi(self):
        bi = self.cleaned_data.get("bi", "")
        if not is_valid_bi(bi):
            raise ValidationError("O B.I. informado não obedece ao padrão moçambicano.")
        return bi.strip().upper()

    def clean_nib(self):
        nib = self.cleaned_data.get("nib", "")
        if not is_valid_nib(nib):
            raise ValidationError("NIB inválido (erro no dígito de controlo ISO 7064).")
        return format_nib(nib)
```

Exemplo com Validador Reutilizável para Models do Django:

```python
# validators.py
from django.core.exceptions import ValidationError
from django.utils.deconstruct import deconstructible
from moz_utils import is_valid_nuit, is_valid_mozambican_phone

@deconstructible
class ValidarNuitMoz:
    def __call__(self, value):
        if not is_valid_nuit(value):
            raise ValidationError(f"O valor '{value}' não é um NUIT moçambicano válido.")

# models.py
from django.db import models
from .validators import ValidarNuitMoz

class Empresa(models.Model):
    razao_social = models.CharField(max_length=200)
    nuit = models.CharField(max_length=9, unique=True, validators=[ValidarNuitMoz()])
```

---

### 3. Engenharia de Dados & Higienização em Lote com Pandas

Processe e audite centenas de milhares de linhas oriundas de planilhas Excel, bancos legados ou relatórios de faturamento com facilidade:

```python
import pandas as pd
from moz_utils import (
    is_valid_nuit,
    get_nuit_entity_type,
    is_valid_mozambican_phone,
    format_mozambican_phone,
    get_mobile_operator,
    get_mobile_wallet,
    is_valid_nib,
    get_bank_by_nib,
    parse_mzn,
    sanitize_name,
)

# 1. Carregamento de dados ruidosos (ERP / CRM / Excel)
dados = {
    "cliente_raw": ["JOÃO DA SILVA E COSTA", "empresa comercial lda", "Maria Mabunda"],
    "nuit_raw": ["100000008", "400000001", "123456789"],
    "telefone_raw": ["841234567", "+258 86 999 8888", "812345678"],
    "nib_raw": ["000100001234567890194", "000801230000123456736", "999900001111222233344"],
    "faturamento_str": ["1.500,00 MT", "250.000,50 MZN", "450,00 MT"],
}
df = pd.DataFrame(dados)

# 2. Saneamento e validação de nomes
df["cliente_sanitizado"] = df["cliente_raw"].apply(sanitize_name)

# 3. Validação fiscal (NUIT)
df["nuit_valido"] = df["nuit_raw"].apply(is_valid_nuit)
df["nuit_entidade"] = df["nuit_raw"].apply(get_nuit_entity_type)

# 4. Enriquecimento de telecomunicações
df["telefone_valido"] = df["telefone_raw"].apply(is_valid_mozambican_phone)
df["telefone_formatado"] = df["telefone_raw"].apply(
    lambda x: format_mozambican_phone(x) if is_valid_mozambican_phone(x) else None
)
df["operadora"] = df["telefone_raw"].apply(get_mobile_operator)
df["carteira_movel"] = df["telefone_raw"].apply(get_mobile_wallet)

# 5. Enriquecimento bancário
df["nib_valido"] = df["nib_raw"].apply(is_valid_nib)
df["banco_nome"] = df["nib_raw"].apply(
    lambda x: get_bank_by_nib(x)["short_name"] if get_bank_by_nib(x) else "Desconhecido"
)

# 6. Conversão monetária segura
df["faturamento_mzn"] = df["faturamento_str"].apply(parse_mzn)

# 7. Exibição dos registos válidos e auditados
relatorio_valido = df[df["nuit_valido"] & df["telefone_valido"] & df["nib_valido"]]
print(relatorio_valido[[
    "cliente_sanitizado", "nuit_raw", "nuit_entidade",
    "telefone_formatado", "operadora", "banco_nome", "faturamento_mzn"
]])
```

---

## 🛠️ Resolução de Problemas (Troubleshooting)

- **O NUIT do cliente falha na validação, mas o cliente insiste que o número está correto.**  
  *Causa:* O NUIT em Moçambique utiliza estritamente o algoritmo Módulo 11 da AT. Se o dígito verificador final não corresponder aos 8 primeiros dígitos multiplicados pelos pesos `[8, 9, 4, 5, 6, 7, 8, 9]`, o número foi emitido com erro ou foi digitado incorretamente. Não ignore este erro para evitar rejeição em faturas eletrónicas e relatórios fiscais.
  
- **`is_valid_name` retorna falso para entradas de utilizador.**  
  *Causa:* A função exige um mínimo de 2 caracteres alfabéticos válidos, rejeitando deliberadamente entradas como `"--"`, `"..."`, `"123"` ou strings puramente pontuais. Sempre invoque `is_valid_name` antes de persistir o dado.

- **Diferença entre Maputo Província e Maputo Cidade.**  
  *Causa:* Na divisão territorial oficial, `"Maputo"` resolve para a Província de Maputo (`mpp`). Caso deseje os distritos urbanos da capital, utilize o identificador `"mpc"`, a sigla `"MC"`, ou a descrição `"Maputo (Cidade)"`.

---

## 📜 Licença

Distribuído sob a licença de código aberto **Apache-2.0**. Consulte o arquivo [LICENSE](https://github.com/iradoweck/moz-utils/blob/main/LICENSE) para mais detalhes.
