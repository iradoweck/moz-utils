"""
moz_utils

Funções de utilidade para Moçambique.
Validação de NUIT, BI, documentos, e formatação de telefones.
"""

import re
from typing import Optional, List, Dict, Any, Union
import urllib.parse

def is_valid_mozambican_phone(phone: str) -> bool:
    """
    Valida um número de telefone moçambicano.
    Operadoras válidas: Vodacom (84/85), Tmcel (82/83), Movitel (86/87/88)
    """
    cleaned = re.sub(r'[\s\-\(\)\+]', '', phone)
    without_country_code = cleaned[3:] if cleaned.startswith('258') else cleaned
    return bool(re.match(r'^8[2-8]\d{7}$', without_country_code))

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
    """
    Valida o NUIT (Número Único de Identificação Tributária) de Moçambique.
    
    Regras da AT:
    - 9 dígitos
    - Primeiro dígito: 1 a 5
    - Nono dígito: Módulo 11
    """
    cleaned = re.sub(r'\D', '', str(nuit))

    if len(cleaned) != 9:
        return False
    if re.match(r'^(\d)\1{8}$', cleaned):
        return False
    if not re.match(r'^[1-5]', cleaned):
        return False

    total_sum = sum(int(cleaned[i]) * (9 - i) for i in range(8))
    remainder = total_sum % 11
    expected_digit = 0 if remainder <= 1 else 11 - remainder

    return int(cleaned[8]) == expected_digit

def get_nuit_entity_type(nuit: Union[str, int]) -> Optional[str]:
    """Classifica o tipo de entidade com base no primeiro dígito do NUIT."""
    cleaned = re.sub(r'\D', '', str(nuit))
    if not is_valid_nuit(cleaned):
        return None

    first_digit = cleaned[0]
    types = {
        '1': 'Singular (Cidadãos nacionais/estrangeiros e ENI)',
        '2': 'Singular (Cidadãos nacionais/estrangeiros e ENI)',
        '3': 'Equiparada (Heranças Jacentes, Consórcios)',
        '4': 'Colectiva (Sociedades por Quotas, SA, Lda, Associações)',
        '5': 'Público (Instituições do Estado e Ministérios)'
    }

    return types.get(first_digit)

def is_valid_bi(bi: str) -> bool:
    """Valida o Bilhete de Identidade Moçambicano."""
    cleaned = re.sub(r'[\s\-]', '', bi).upper()
    return bool(re.match(r'^\d{12}[A-Z]$', cleaned))

def format_mzn(value: float, currency: str = 'MT') -> str:
    """
    Formata um valor monetário em Meticais seguindo o padrão oficial de Moçambique.

    Padrão oficial (SI + AT):
    - Separador de milhares: espaço
    - Separador decimal: vírgula
    - Símbolo após o valor, separado por espaço

    Args:
        value: Valor numérico
        currency: 'MT' (nacional) ou 'MZN' (ISO 4217)

    Returns:
        Valor formatado (ex: "1 500,00 MT")
    """
    sign = '-' if value < 0 else ''
    absolute = abs(value)

    # Formatar com 2 casas decimais
    formatted = f"{absolute:,.2f}"

    # Substituir: vírgula dos milhares → espaço, ponto decimal → vírgula
    formatted = formatted.replace(',', ' ').replace('.', ',')

    return f"{sign}{formatted} {currency}"

def build_whatsapp_url(phone: str, message: str = "") -> str:
    """Gera um URL de contacto WhatsApp com mensagem pré-formatada."""
    cleaned = re.sub(r'[\s\-\(\)\+]', '', phone)
    international = cleaned if cleaned.startswith('258') else f"258{cleaned}"
    
    encoded_message = f"?text={urllib.parse.quote(message)}" if message else ""
    return f"https://wa.me/{international}{encoded_message}"

def get_mozambique_provinces() -> List[Dict[str, Any]]:
    """Lista oficial das Províncias de Moçambique com os seus distritos."""
    return [
        {'id': 'cab', 'name': 'Cabo Delgado', 'region': 'Norte', 'sigla': 'CBD', 'districts': ['Ancuabe', 'Balama', 'Chiúre', 'Ibo', 'Macomia', 'Mecúfi', 'Meluco', 'Metuge', 'Mocímboa da Praia', 'Montepuez', 'Mueda', 'Muidumbe', 'Namuno', 'Nangade', 'Palma', 'Pemba (Cidade)', 'Quissanga']},
        {'id': 'nia', 'name': 'Niassa', 'region': 'Norte', 'sigla': 'NS', 'districts': ['Chimbonila', 'Cuamba', 'Lago', 'Lichinga (Cidade)', 'Majune', 'Mandimba', 'Marrupa', 'Maúa', 'Mavago', 'Mecanhelas', 'Mecula', 'Metarica', 'Muembe', "N'gauma", 'Nipepe', 'Sanga']},
        {'id': 'npl', 'name': 'Nampula', 'region': 'Norte', 'sigla': 'NPL', 'districts': ['Angoche', 'Eráti', 'Ilha de Moçambique', 'Lalaua', 'Larde', 'Liúpo', 'Malema', 'Meconta', 'Mecubúri', 'Memba', 'Mogincual', 'Mogovolas', 'Moma', 'Monapo', 'Mossuril', 'Muecate', 'Murrupula', 'Nacala-a-Velha', 'Nacala Porto', 'Nampula (Cidade)', 'Nacarôa', 'Rapale', 'Ribáuè']},
        {'id': 'zam', 'name': 'Zambézia', 'region': 'Centro', 'sigla': 'ZMB', 'districts': ['Alto Molócuè', 'Chinde', 'Derre', 'Gilé', 'Gurué', 'Ile', 'Inhassunge', 'Luabo', 'Lugela', 'Maganja da Costa', 'Milange', 'Mocuba', 'Mocubela', 'Molumbo', 'Mopeia', 'Morrumbala', 'Mulevala', 'Namacurra', 'Namarrói', 'Nicoadala', 'Pebane', 'Quelimane (Cidade)']},
        {'id': 'tet', 'name': 'Tete', 'region': 'Centro', 'sigla': 'TT', 'districts': ['Angónia', 'Cahora-Bassa', 'Changara', 'Chifunde', 'Chiuta', 'Dôa', 'Macanga', 'Magoé', 'Marara', 'Marávia', 'Moatize', 'Mutarara', 'Tete (Cidade)', 'Tsangano', 'Zumbo']},
        {'id': 'man', 'name': 'Manica', 'region': 'Centro', 'sigla': 'MN', 'districts': ['Bárue', 'Chimoio (Cidade)', 'Gondola', 'Guro', 'Macate', 'Machaze', 'Macossa', 'Manica', 'Mossurize', 'Sussundenga', 'Tambara', 'Vanduzi']},
        {'id': 'sof', 'name': 'Sofala', 'region': 'Centro', 'sigla': 'SF', 'districts': ['Beira (Cidade)', 'Búzi', 'Caia', 'Chemba', 'Cheringoma', 'Chibabava', 'Dondo', 'Gorongosa', 'Machanga', 'Maringué', 'Marromeu', 'Muanza', 'Nhamatanda']},
        {'id': 'inh', 'name': 'Inhambane', 'region': 'Sul', 'sigla': 'INH', 'districts': ['Funhalouro', 'Govuro', 'Homoíne', 'Inhambane (Cidade)', 'Inharrime', 'Inhassoro', 'Jangamo', 'Mabote', 'Massinga', 'Maxixe (Cidade)', 'Morrumbene', 'Panda', 'Vilankulo', 'Zavala']},
        {'id': 'gaz', 'name': 'Gaza', 'region': 'Sul', 'sigla': 'GZ', 'districts': ['Bilene', 'Chibuto', 'Chicualacuala', 'Chigubo', 'Chókwè', 'Chonguene', 'Guijá', 'Limpopo', 'Mabalane', 'Manjacaze', 'Mapai', 'Massangena', 'Massingir', 'Xai-Xai (Cidade)']},
        {'id': 'mpp', 'name': 'Maputo (Província)', 'region': 'Sul', 'sigla': 'MPT', 'districts': ['Boane', 'Magude', 'Manhiça', 'Marracuene', 'Matola (Cidade)', 'Matutuíne', 'Moamba', 'Namaacha']},
        {'id': 'mpc', 'name': 'Maputo (Cidade)', 'region': 'Sul', 'sigla': 'MC', 'districts': ['KaMpfumo', 'Nlhamankulu', 'KaMaxaquene', 'KaMavota', 'KaMubukwana', 'KaTembe', 'KaNyaka']}
    ]

def get_districts_by_province(province_id: str) -> List[str]:
    """Retorna a lista de distritos pertencentes a uma determinada província."""
    clean_id = province_id.strip().lower()
    for province in get_mozambique_provinces():
        if province['id'] == clean_id:
            return province['districts']
    raise ValueError(f"Província inválida: {province_id}")

def get_all_districts() -> List[Dict[str, str]]:
    """Retorna uma lista plana com todos os 161 distritos e respetivos IDs de província."""
    flat_list = []
    for province in get_mozambique_provinces():
        p_id = province['id']
        for district in province['districts']:
            flat_list.append({
                'name': district,
                'provinceId': p_id
            })
    return flat_list

