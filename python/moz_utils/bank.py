"""
Módulo Bancário de Moçambique: Catálogo de Bancos, NIB e IBAN.
"""

from typing import Optional, TypedDict
import re


class BankInfo(TypedDict, total=False):
    code: str
    name: str
    short_name: str
    shortName: str


MOZAMBIQUE_BANKS: dict[str, BankInfo] = {
    "0001": {
        "code": "0001",
        "name": "Banco Internacional de Moçambique",
        "short_name": "Millennium BIM",
        "shortName": "Millennium BIM",
    },
    "0003": {
        "code": "0003",
        "name": "Standard Bank Moçambique",
        "short_name": "Standard Bank",
        "shortName": "Standard Bank",
    },
    "0006": {
        "code": "0006",
        "name": "Absa Bank Moçambique",
        "short_name": "Absa",
        "shortName": "Absa",
    },
    "0007": {
        "code": "0007",
        "name": "Nedbank Moçambique",
        "short_name": "Nedbank",
        "shortName": "Nedbank",
    },
    "0008": {
        "code": "0008",
        "name": "Banco Comercial e de Investimentos",
        "short_name": "BCI",
        "shortName": "BCI",
    },
    "0014": {
        "code": "0014",
        "name": "First National Bank Moçambique",
        "short_name": "FNB",
        "shortName": "FNB",
    },
    "0016": {
        "code": "0016",
        "name": "Moza Banco",
        "short_name": "Moza Banco",
        "shortName": "Moza Banco",
    },
    "0021": {
        "code": "0021",
        "name": "Access Bank Moçambique",
        "short_name": "Access Bank",
        "shortName": "Access Bank",
    },
    "0024": {
        "code": "0024",
        "name": "Ecobank Moçambique",
        "short_name": "Ecobank",
        "shortName": "Ecobank",
    },
    "0025": {
        "code": "0025",
        "name": "Banco Nacional de Investimento",
        "short_name": "BNI",
        "shortName": "BNI",
    },
    "0030": {
        "code": "0030",
        "name": "Société Générale Moçambique",
        "short_name": "Société Générale",
        "shortName": "Société Générale",
    },
    "0034": {
        "code": "0034",
        "name": "Moza Banco",
        "short_name": "Moza Banco",
        "shortName": "Moza Banco",
    },
    "0038": {
        "code": "0038",
        "name": "First Capital Bank Moçambique",
        "short_name": "First Capital Bank",
        "shortName": "First Capital Bank",
    },
    "0041": {
        "code": "0041",
        "name": "Banco Letshego",
        "short_name": "Letshego",
        "shortName": "Letshego",
    },
    "0043": {
        "code": "0043",
        "name": "First Capital Bank Moçambique",
        "short_name": "First Capital Bank",
        "shortName": "First Capital Bank",
    },
    "0044": {
        "code": "0044",
        "name": "MyBucks Banking Corporation",
        "short_name": "MyBucks",
        "shortName": "MyBucks",
    },
    "0045": {
        "code": "0045",
        "name": "Banco de Desenvolvimento de Moçambique",
        "short_name": "BDM",
        "shortName": "BDM",
    },
    "0048": {
        "code": "0048",
        "name": "Banco Mais",
        "short_name": "Banco Mais",
        "shortName": "Banco Mais",
    },
    "0050": {
        "code": "0050",
        "name": "Standard Chartered Bank Moçambique",
        "short_name": "Standard Chartered",
        "shortName": "Standard Chartered",
    },
    "0052": {
        "code": "0052",
        "name": "Banco Big Moçambique",
        "short_name": "Banco Big",
        "shortName": "Banco Big",
    },
    "0056": {
        "code": "0056",
        "name": "Banco Letshego",
        "short_name": "Letshego",
        "shortName": "Letshego",
    },
    "0057": {
        "code": "0057",
        "name": "Banco Nacional de Investimento",
        "short_name": "BNI",
        "shortName": "BNI",
    },
}


def is_valid_nib(nib: str) -> bool:
    """
    Valida o Número de Identificação Bancária (NIB) de Moçambique.
    
    Regras oficiais:
    - 21 dígitos numéricos
    - Os primeiros 4 dígitos devem pertencer a um banco registado no Banco de Moçambique
    - Algoritmo de controlo ISO 7064 Módulo 97-10
    """
    cleaned = "".join(filter(str.isdigit, str(nib)))
    if len(cleaned) != 21:
        return False

    bank_code = cleaned[:4]
    if bank_code not in MOZAMBIQUE_BANKS:
        return False

    first19 = int(cleaned[:19])
    remainder = (first19 * 100) % 97
    expected_check = 98 - remainder
    check_digits = int(cleaned[19:])

    return expected_check == check_digits


def format_nib(nib: str) -> str:
    """
    Formata o NIB moçambicano no formato padronizado BBBB.AAAA.CCCCCCCCCCC.KK.
    
    Lança ValueError se o NIB for inválido.
    """
    cleaned = "".join(filter(str.isdigit, str(nib)))
    if not is_valid_nib(cleaned):
        raise ValueError(f"NIB moçambicano inválido: {nib}")

    return f"{cleaned[:4]}.{cleaned[4:8]}.{cleaned[8:19]}.{cleaned[19:]}"


def get_bank_by_nib(nib: str) -> Optional[BankInfo]:
    """
    Retorna os dados cadastrais do banco emissor a partir do NIB fornecido.
    Retorna None se o código do banco não for encontrado.
    """
    cleaned = "".join(filter(str.isdigit, str(nib)))
    if len(cleaned) < 4:
        return None

    return MOZAMBIQUE_BANKS.get(cleaned[:4])


def nib_to_iban(nib: str) -> str:
    """
    Converte um NIB moçambicano válido no correspondente IBAN (MZ59 + 21 dígitos).
    
    Lança ValueError se o NIB fornecido for inválido.
    """
    cleaned = "".join(filter(str.isdigit, str(nib)))
    if not is_valid_nib(cleaned):
        raise ValueError(f"NIB moçambicano inválido: {nib}")

    return f"MZ59{cleaned}"


def is_valid_iban(iban: str) -> bool:
    """
    Valida um código IBAN de Moçambique (25 caracteres: prefixo MZ59 seguido de NIB válido).
    """
    cleaned = "".join(str(iban).split()).upper()
    if len(cleaned) != 25 or not cleaned.startswith("MZ59"):
        return False

    return is_valid_nib(cleaned[4:])
