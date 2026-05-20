"""
moz_utils

Funções de utilidade para Moçambique.
Validação de NUIT, BI, documentos, e formatação de telefones.
"""

import re
from typing import Optional, List, Dict, Any, Union
import urllib.parse

def is_valid_mozambican_phone(phone: str) -> bool:
    """Valida um número de telefone moçambicano."""
    cleaned = re.sub(r'[\s\-\(\)\+]', '', phone)
    without_country_code = cleaned[3:] if cleaned.startswith('258') else cleaned
    return bool(re.match(r'^8[1-9]\d{7}$', without_country_code))

def format_mozambican_phone(phone: str) -> str:
    """Formata um número de telefone moçambicano para o padrão internacional."""
    cleaned = re.sub(r'[\s\-\(\)\+]', '', phone)
    without_country_code = cleaned[3:] if cleaned.startswith('258') else cleaned

    if not is_valid_mozambican_phone(without_country_code):
        raise ValueError(f"Número de telefone inválido: {phone}")

    prefix = without_country_code[0:2]
    part1 = without_country_code[2:5]
    part2 = without_country_code[5:]

    return f"+258 {prefix} {part1} {part2}"

def get_mobile_operator(phone: str) -> Optional[str]:
    """Identifica a operadora de um número moçambicano."""
    cleaned = re.sub(r'[\s\-\(\)\+]', '', phone)
    without_country_code = cleaned[3:] if cleaned.startswith('258') else cleaned

    if not is_valid_mozambican_phone(without_country_code):
        return None

    prefix = without_country_code[0:2]
    operators = {
        '84': 'Vodacom',
        '85': 'Vodacom',
        '82': 'Tmcel',
        '83': 'Tmcel',
        '86': 'Movitel',
        '87': 'Movitel',
        '88': 'Movitel',
    }

    return operators.get(prefix)

def is_valid_nuit(nuit: Union[str, int]) -> bool:
    """Valida o NUIT (Número Único de Identificação Tributária) de Moçambique."""
    cleaned = re.sub(r'\D', '', str(nuit))

    if len(cleaned) != 9:
        return False

    if re.match(r'^(\d)\1{8}$', cleaned):
        return False

    return True

def is_valid_bi(bi: str) -> bool:
    """Valida o Bilhete de Identidade Moçambicano."""
    cleaned = re.sub(r'[\s\-]', '', bi).upper()
    return bool(re.match(r'^\d{12}[A-Z]$', cleaned))

def format_mzn(value: float) -> str:
    """Formata um valor monetário em Meticais (MZN)."""
    return f"{value:,.2f}".replace(',', 'X').replace('.', ',').replace('X', '.') + " MT"

def build_whatsapp_url(phone: str, message: str = "") -> str:
    """Gera um URL de contacto WhatsApp com mensagem pré-formatada."""
    cleaned = re.sub(r'[\s\-\(\)\+]', '', phone)
    international = cleaned if cleaned.startswith('258') else f"258{cleaned}"
    
    encoded_message = f"?text={urllib.parse.quote(message)}" if message else ""
    return f"https://wa.me/{international}{encoded_message}"

def get_mozambique_provinces() -> List[Dict[str, Any]]:
    """Lista das Províncias de Moçambique."""
    return [
        {
            'id': 'mpm',
            'name': 'Maputo Cidade',
            'region': 'Sul',
            'districts': ['KaMpfumo', 'Nlhamankulu', 'KaMaxakeni', 'KaMavota', 'KaMubukwana', 'KaTembe', 'KaNyaka']
        },
        {
            'id': 'mpt',
            'name': 'Maputo Província',
            'region': 'Sul',
            'districts': ['Boane', 'Magude', 'Manhiça', 'Marracuene', 'Matola', 'Matutuíne', 'Moamba', 'Namaacha']
        },
        # ... omitting the rest to save space
    ]
