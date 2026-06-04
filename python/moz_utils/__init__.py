"""
moz_utils

Utility functions for Mozambique.
Validation of NUIT, BI, documents, and phone formatting.
"""

import re
from typing import Optional, List, Dict, Any, Union
import urllib.parse

def is_valid_mozambican_phone(phone: str) -> bool:
    """
    Validates a Mozambican phone number.
    Valid operators: Vodacom (84/85), Tmcel (82/83), Movitel (86/87/88)
    """
    cleaned = re.sub(r'[\s\-\(\)\+]', '', phone)
    without_country_code = cleaned[3:] if cleaned.startswith('258') else cleaned
    return bool(re.match(r'^8[2-8]\d{7}$', without_country_code))

def format_mozambican_phone(phone: str) -> str:
    """Formats a Mozambican phone number to the international standard."""
    cleaned = re.sub(r'[\s\-\(\)\+]', '', phone)
    without_country_code = cleaned[3:] if cleaned.startswith('258') else cleaned

    if not is_valid_mozambican_phone(without_country_code):
        raise ValueError(f"Invalid phone number: {phone}")

    prefix = without_country_code[0:2]
    part1 = without_country_code[2:5]
    part2 = without_country_code[5:]

    return f"+258 {prefix} {part1} {part2}"

def get_mobile_operator(phone: str) -> Optional[str]:
    """Identifies the operator of a Mozambican phone number."""
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
    if not re.match(r'^[1-9]', cleaned):
        return False

    weights = [8, 9, 4, 5, 6, 7, 8, 9]
    total_sum = sum(int(cleaned[i]) * weights[i] for i in range(8))
    check_idx = total_sum % 11
    check_map = "01234567891"

    return cleaned[8] == check_map[check_idx]

def get_nuit_entity_type(nuit: Union[str, int]) -> Optional[str]:
    """Classifies the entity type based on the first digit of the NUIT."""
    cleaned = re.sub(r'\D', '', str(nuit))
    if not is_valid_nuit(cleaned):
        return None

    first_digit = cleaned[0]
    types = {
        '1': 'Pessoas Singulares',
        '2': 'Pessoas Singulares',
        '3': 'Pessoas Singulares',
        '4': 'Pessoas Colectivas',
        '5': 'Pessoas Colectivas',
        '6': 'Entidades Equiparadas',
        '7': 'Estado / Públicas',
        '8': 'Outras Entidades',
        '9': 'Entidades Estrangeiras'
    }

    return types.get(first_digit)

def is_valid_bi(bi: str) -> bool:
    """Validates the Mozambican National ID (BI)."""
    cleaned = re.sub(r'[\s\-]', '', bi).upper()
    return bool(re.match(r'^\d{12}[A-Z]$', cleaned))

def format_mzn(value: float, currency: str = 'MT') -> str:
    """
    Formats a monetary value in Meticais following the official standard of Mozambique.

    Args:
        value: Valor numérico
        currency: 'MT' (nacional) ou 'MZN' (ISO 4217)

    Returns:
        Formatted value (ex: "1 500,00 MT")
    """
    sign = '-' if value < 0 else ''
    absolute = abs(value)

    # Formatar com 2 casas decimais
    formatted = f"{absolute:,.2f}"

    # Substituir: vírgula dos milhares → espaço, ponto decimal → vírgula
    formatted = formatted.replace(',', ' ').replace('.', ',')

    return f"{sign}{formatted} {currency}"

def parse_mzn(value: str) -> Optional[float]:
    """
    Parses a Mozambican currency string into a raw float number for the database.
    Handles inputs like "1.500,00 MT", "1 500,00MZN", "1,500.00", etc.
    """
    clean = re.sub(r'[^\d.,\-]', '', value)
    if not clean or clean == '-':
        return None

    last_comma = clean.rfind(',')
    last_dot = clean.rfind('.')

    if last_comma > -1 and last_dot > -1:
        if last_comma > last_dot:
            clean = clean.replace('.', '').replace(',', '.')
        else:
            clean = clean.replace(',', '')
    elif last_comma > -1:
        parts = clean.split(',')
        if len(parts) == 2 and len(parts[1]) != 3:
            clean = clean.replace(',', '.')
        else:
            clean = clean.replace(',', '')
    elif last_dot > -1:
        parts = clean.split('.')
        if len(parts) == 2 and len(parts[1]) == 3:
            clean = clean.replace('.', '')
        elif len(parts) > 2:
            clean = clean.replace('.', '')

    try:
        return float(clean)
    except ValueError:
        return None

def build_whatsapp_url(phone: str, message: str = "") -> str:
    """Generates a WhatsApp contact URL with a pre-formatted message."""
    cleaned = re.sub(r'[\s\-\(\)\+]', '', phone)
    international = cleaned if cleaned.startswith('258') else f"258{cleaned}"
    
    encoded_message = f"?text={urllib.parse.quote(message)}" if message else ""
    return f"https://wa.me/{international}{encoded_message}"

def get_mozambique_provinces() -> List[Dict[str, Any]]:
    """Official list of Mozambique Provinces and their districts."""
    return [
        {
            'id': 'cab',
            'name': 'Cabo Delgado',
            'region': 'Norte',
            'sigla': 'CBD',
            'districts': [
                {
                    'name': 'Ancuabe',
                    'administrative_posts': ['Ancuabe', 'Metoro', 'Meza'],
                    'neighborhoods': []
                },
                {
                    'name': 'Balama',
                    'administrative_posts': ['Balama', 'Chapa', 'Kuekue', 'Mavala'],
                    'neighborhoods': []
                },
                {
                    'name': 'Chiúre',
                    'administrative_posts': ['Chiúre', 'Chiúre-Velho', 'Katapua', 'Mazeze', 'Namogelia', 'Manoane'],
                    'neighborhoods': []
                },
                {
                    'name': 'Ibo',
                    'administrative_posts': ['Ibo', 'Quirimba'],
                    'neighborhoods': []
                },
                {
                    'name': 'Macomia',
                    'administrative_posts': ['Macomia', 'Chai', 'Mucojo', 'Quiterajo'],
                    'neighborhoods': []
                },
                {
                    'name': 'Mecúfi',
                    'administrative_posts': ['Mecúfi', 'Murrébuè'],
                    'neighborhoods': []
                },
                {
                    'name': 'Meluco',
                    'administrative_posts': ['Meluco', 'Muaguide'],
                    'neighborhoods': []
                },
                {
                    'name': 'Metuge',
                    'administrative_posts': ['Metuge', 'Mieze'],
                    'neighborhoods': []
                },
                {
                    'name': 'Mocímboa da Praia',
                    'administrative_posts': ['Mocímboa da Praia', 'Diaca', 'Mbau'],
                    'neighborhoods': []
                },
                {
                    'name': 'Montepuez',
                    'administrative_posts': ['Montepuez', 'Mapupulo', 'Namanhumbir', 'Nairoto', 'Napaula'],
                    'neighborhoods': []
                },
                {
                    'name': 'Mueda',
                    'administrative_posts': ['Mueda', 'Chapa', 'Imbuho', 'Negomano', 'N\'gapa'],
                    'neighborhoods': []
                },
                {
                    'name': 'Muidumbe',
                    'administrative_posts': ['Muidumbe', 'Chitunda', 'Miteda'],
                    'neighborhoods': []
                },
                {
                    'name': 'Namuno',
                    'administrative_posts': ['Namuno', 'Machoca', 'Meloco', 'Ncumpe', 'Luli'],
                    'neighborhoods': []
                },
                {
                    'name': 'Nangade',
                    'administrative_posts': ['Nangade', 'Ntamba'],
                    'neighborhoods': []
                },
                {
                    'name': 'Palma',
                    'administrative_posts': ['Palma', 'Olumbe', 'Quionga'],
                    'neighborhoods': []
                },
                {
                    'name': 'Pemba (Cidade)',
                    'administrative_posts': ['Pemba'],
                    'neighborhoods': [
                        'Paquitequete',
                        'Natite',
                        'Cariacó',
                        'Alto Gingone',
                        'Insubria',
                        'Muxara',
                        'Maringanha',
                        'Chibuébue'
                    ]
                },
                {
                    'name': 'Quissanga',
                    'administrative_posts': ['Quissanga', 'Mahate', 'Bilibiza'],
                    'neighborhoods': []
                }
            ]
        },
        {
            'id': 'nia',
            'name': 'Niassa',
            'region': 'Norte',
            'sigla': 'NS',
            'districts': [
                {
                    'name': 'Chimbonila',
                    'administrative_posts': ['Chimbonila', 'Meponda'],
                    'neighborhoods': []
                },
                {
                    'name': 'Cuamba',
                    'administrative_posts': ['Cuamba', 'Lúrio', 'Etatara'],
                    'neighborhoods': ['Ribaue', 'Mutxora', 'Ademo', 'Aeroporto']
                },
                {
                    'name': 'Lago',
                    'administrative_posts': ['Metangula', 'Cobué', 'Luninho', 'Maniamba'],
                    'neighborhoods': []
                },
                {
                    'name': 'Lichinga (Cidade)',
                    'administrative_posts': ['Lichinga'],
                    'neighborhoods': ['Central', 'Popular', 'Chimba', 'Cerâmica', 'Ngaula', 'Sanjala', 'Chiuaula']
                },
                {
                    'name': 'Majune',
                    'administrative_posts': ['Majune', 'Mua', 'Nairrobi'],
                    'neighborhoods': []
                },
                {
                    'name': 'Mandimba',
                    'administrative_posts': ['Mandimba', 'Mitande'],
                    'neighborhoods': []
                },
                {
                    'name': 'Marrupa',
                    'administrative_posts': ['Marrupa', 'Marangira', 'Nungo'],
                    'neighborhoods': []
                },
                {
                    'name': 'Maúa',
                    'administrative_posts': ['Maúa', 'Maiaca'],
                    'neighborhoods': []
                },
                {
                    'name': 'Mavago',
                    'administrative_posts': ['Mavago', 'M\'saize'],
                    'neighborhoods': []
                },
                {
                    'name': 'Mecanhelas',
                    'administrative_posts': ['Mecanhelas', 'Chiuta'],
                    'neighborhoods': []
                },
                {
                    'name': 'Mecula',
                    'administrative_posts': ['Mecula', 'Matondovela'],
                    'neighborhoods': []
                },
                {
                    'name': 'Metarica',
                    'administrative_posts': ['Metarica', 'Nacuanha'],
                    'neighborhoods': []
                },
                {
                    'name': 'Muembe',
                    'administrative_posts': ['Muembe', 'Chiconono'],
                    'neighborhoods': []
                },
                {
                    'name': 'N\'gauma',
                    'administrative_posts': ['Massangulo', 'Itepela'],
                    'neighborhoods': []
                },
                {
                    'name': 'Nipepe',
                    'administrative_posts': ['Nipepe', 'Muatuca'],
                    'neighborhoods': []
                },
                {
                    'name': 'Sanga',
                    'administrative_posts': ['Unango', 'Malamuila', 'Matchedje'],
                    'neighborhoods': []
                }
            ]
        },
        {
            'id': 'npl',
            'name': 'Nampula',
            'region': 'Norte',
            'sigla': 'NPL',
            'districts': [
                {
                    'name': 'Angoche',
                    'administrative_posts': ['Angoche', 'Aube', 'Namaponda'],
                    'neighborhoods': []
                },
                {
                    'name': 'Eráti',
                    'administrative_posts': ['Namapa', 'Alua', 'Nakarari'],
                    'neighborhoods': []
                },
                {
                    'name': 'Ilha de Moçambique',
                    'administrative_posts': ['Ilha de Moçambique', 'Lumbo'],
                    'neighborhoods': ['Museu', 'Litine', 'Areal', 'Marangonha']
                },
                {
                    'name': 'Lalaua',
                    'administrative_posts': ['Lalaua', 'Meti'],
                    'neighborhoods': []
                },
                {
                    'name': 'Larde',
                    'administrative_posts': ['Larde', 'Mucuali'],
                    'neighborhoods': []
                },
                {
                    'name': 'Liúpo',
                    'administrative_posts': ['Liúpo', 'Quinga'],
                    'neighborhoods': []
                },
                {
                    'name': 'Malema',
                    'administrative_posts': ['Malema', 'Chinga', 'Mutuali'],
                    'neighborhoods': []
                },
                {
                    'name': 'Meconta',
                    'administrative_posts': ['Meconta', 'Corrane', 'Namialo'],
                    'neighborhoods': []
                },
                {
                    'name': 'Mecubúri',
                    'administrative_posts': ['Mecubúri', 'Milhana', 'Muite', 'Namina'],
                    'neighborhoods': []
                },
                {
                    'name': 'Memba',
                    'administrative_posts': ['Memba', 'Chipene', 'Mazua', 'Lurio'],
                    'neighborhoods': []
                },
                {
                    'name': 'Mogincual',
                    'administrative_posts': ['Mogincual', 'Quixaxe'],
                    'neighborhoods': []
                },
                {
                    'name': 'Mogovolas',
                    'administrative_posts': ['Nametil', 'Calipo', 'Ilute', 'Muatua'],
                    'neighborhoods': []
                },
                {
                    'name': 'Moma',
                    'administrative_posts': ['Macone', 'Chalai', 'Lunga'],
                    'neighborhoods': []
                },
                {
                    'name': 'Monapo',
                    'administrative_posts': ['Monapo', 'Itoculo', 'Netia'],
                    'neighborhoods': []
                },
                {
                    'name': 'Mossuril',
                    'administrative_posts': ['Mossuril', 'Lunga', 'Matibane'],
                    'neighborhoods': []
                },
                {
                    'name': 'Muecate',
                    'administrative_posts': ['Muecate', 'Imala', 'Muculuone'],
                    'neighborhoods': []
                },
                {
                    'name': 'Murrupula',
                    'administrative_posts': ['Murrupula', 'Chinga', 'Nihessiue'],
                    'neighborhoods': []
                },
                {
                    'name': 'Nacala-a-Velha',
                    'administrative_posts': ['Nacala-a-Velha', 'Covo'],
                    'neighborhoods': []
                },
                {
                    'name': 'Nacala Porto',
                    'administrative_posts': ['Nacala Porto', 'Muanona'],
                    'neighborhoods': ['Mutiva', 'Triângulo', 'Ontupaia', 'Quissanga']
                },
                {
                    'name': 'Nampula (Cidade)',
                    'administrative_posts': ['Urbano Central', 'Muatala', 'Muhala', 'Namikopo', 'Napipine', 'Natikiri'],
                    'neighborhoods': ['Central', 'Muatala', 'Muhala', 'Namikopo', 'Napipine', 'Natikiri', 'Marrere', 'Namutequeliua']
                },
                {
                    'name': 'Nacarôa',
                    'administrative_posts': ['Nacarôa', 'Saua-Saua'],
                    'neighborhoods': []
                },
                {
                    'name': 'Rapale',
                    'administrative_posts': ['Rapale', 'Anchilo', 'Mutivaze'],
                    'neighborhoods': []
                },
                {
                    'name': 'Ribáuè',
                    'administrative_posts': ['Ribáuè', 'Cunle', 'Iapala'],
                    'neighborhoods': []
                }
            ]
        },
        {
            'id': 'zam',
            'name': 'Zambézia',
            'region': 'Centro',
            'sigla': 'ZMB',
            'districts': [
                {
                    'name': 'Alto Molócuè',
                    'administrative_posts': ['Alto Molócuè', 'Nauela'],
                    'neighborhoods': []
                },
                {
                    'name': 'Chinde',
                    'administrative_posts': ['Chinde', 'Micaune'],
                    'neighborhoods': []
                },
                {
                    'name': 'Derre',
                    'administrative_posts': ['Derre', 'Guerissa'],
                    'neighborhoods': []
                },
                {
                    'name': 'Gilé',
                    'administrative_posts': ['Gilé', 'Alto Ligonha'],
                    'neighborhoods': []
                },
                {
                    'name': 'Gurué',
                    'administrative_posts': ['Gurué', 'Lioma', 'Nepuíte'],
                    'neighborhoods': ['Bairro Central', 'Mucuapa', 'Nacuacue']
                },
                {
                    'name': 'Ile',
                    'administrative_posts': ['Ile', 'Socone'],
                    'neighborhoods': []
                },
                {
                    'name': 'Inhassunge',
                    'administrative_posts': ['Mucupia', 'Gonhane'],
                    'neighborhoods': []
                },
                {
                    'name': 'Luabo',
                    'administrative_posts': ['Luabo', 'Chimbazo'],
                    'neighborhoods': []
                },
                {
                    'name': 'Lugela',
                    'administrative_posts': ['Lugela', 'Tacuane', 'Munhamade'],
                    'neighborhoods': []
                },
                {
                    'name': 'Maganja da Costa',
                    'administrative_posts': ['Maganja da Costa', 'Baleia'],
                    'neighborhoods': []
                },
                {
                    'name': 'Milange',
                    'administrative_posts': ['Milange', 'Majaua', 'Mongue'],
                    'neighborhoods': []
                },
                {
                    'name': 'Mocuba',
                    'administrative_posts': ['Mocuba', 'Mualama', 'Namanjavira'],
                    'neighborhoods': ['Central', 'Aeroporto', 'Paraíso']
                },
                {
                    'name': 'Mocubela',
                    'administrative_posts': ['Mocubela', 'Bajone'],
                    'neighborhoods': []
                },
                {
                    'name': 'Molumbo',
                    'administrative_posts': ['Molumbo', 'Corromana'],
                    'neighborhoods': []
                },
                {
                    'name': 'Mopeia',
                    'administrative_posts': ['Mopeia', 'Campo'],
                    'neighborhoods': []
                },
                {
                    'name': 'Morrumbala',
                    'administrative_posts': ['Morrumbala', 'Chire', 'Megaza'],
                    'neighborhoods': []
                },
                {
                    'name': 'Mulevala',
                    'administrative_posts': ['Mulevala', 'Chirimane'],
                    'neighborhoods': []
                },
                {
                    'name': 'Namacurra',
                    'administrative_posts': ['Namacurra', 'Macuse'],
                    'neighborhoods': []
                },
                {
                    'name': 'Namarrói',
                    'administrative_posts': ['Namarrói', 'Regone'],
                    'neighborhoods': []
                },
                {
                    'name': 'Nicoadala',
                    'administrative_posts': ['Nicoadala', 'Maquival'],
                    'neighborhoods': []
                },
                {
                    'name': 'Pebane',
                    'administrative_posts': ['Pebane', 'Mulela', 'Naburi'],
                    'neighborhoods': []
                },
                {
                    'name': 'Quelimane (Cidade)',
                    'administrative_posts': ['Urbano nº 1', 'Urbano nº 2', 'Urbano nº 3', 'Urbano nº 4'],
                    'neighborhoods': ['Central', 'Cementório', 'Inhassunge', 'Icidua', 'Chingo', 'Matacuane']
                }
            ]
        },
        {
            'id': 'tet',
            'name': 'Tete',
            'region': 'Centro',
            'sigla': 'TT',
            'districts': [
                {
                    'name': 'Angónia',
                    'administrative_posts': ['Ulongue', 'Domue'],
                    'neighborhoods': []
                },
                {
                    'name': 'Cahora-Bassa',
                    'administrative_posts': ['Songo', 'Chitima', 'Muxeza'],
                    'neighborhoods': []
                },
                {
                    'name': 'Changara',
                    'administrative_posts': ['Luenha', 'Chioco', 'Mavago'],
                    'neighborhoods': []
                },
                {
                    'name': 'Chifunde',
                    'administrative_posts': ['Chifunde', 'Mualadzi', 'Nsadzu'],
                    'neighborhoods': []
                },
                {
                    'name': 'Chiuta',
                    'administrative_posts': ['Manje', 'Kazula'],
                    'neighborhoods': []
                },
                {
                    'name': 'Dôa',
                    'administrative_posts': ['Dôa', 'Chueza'],
                    'neighborhoods': []
                },
                {
                    'name': 'Macanga',
                    'administrative_posts': ['Furancungo', 'Chinde'],
                    'neighborhoods': []
                },
                {
                    'name': 'Magoé',
                    'administrative_posts': ['Mpende', 'Chinthopo', 'Mukumbura'],
                    'neighborhoods': []
                },
                {
                    'name': 'Marara',
                    'administrative_posts': ['Marara', 'M\'fuba'],
                    'neighborhoods': []
                },
                {
                    'name': 'Marávia',
                    'administrative_posts': ['Fingoé', 'Chiputo', 'Molumbo'],
                    'neighborhoods': []
                },
                {
                    'name': 'Moatize',
                    'administrative_posts': ['Moatize', 'Kambulatsitsi', 'Zóbuè'],
                    'neighborhoods': ['Bairro 25 de Setembro', 'Liberdade', 'Chithatha']
                },
                {
                    'name': 'Mutarara',
                    'administrative_posts': ['Nhamayabué', 'Inhangoma'],
                    'neighborhoods': []
                },
                {
                    'name': 'Tete (Cidade)',
                    'administrative_posts': ['Tete'],
                    'neighborhoods': ['Chingo', 'Degue', 'Matundo', 'Mpadue', 'Josina Machel', 'Francisco Manyanga']
                },
                {
                    'name': 'Tsangano',
                    'administrative_posts': ['Tsangano', 'Ntengo-Wambuzi'],
                    'neighborhoods': []
                },
                {
                    'name': 'Zumbo',
                    'administrative_posts': ['Zumbo', 'Muze', 'Zambue'],
                    'neighborhoods': []
                }
            ]
        },
        {
            'id': 'man',
            'name': 'Manica',
            'region': 'Centro',
            'sigla': 'MN',
            'districts': [
                {
                    'name': 'Bárue',
                    'administrative_posts': ['Catandica', 'Nhampassa', 'Chuala'],
                    'neighborhoods': []
                },
                {
                    'name': 'Chimoio (Cidade)',
                    'administrative_posts': ['Urbano nº 1', 'Urbano nº 2', 'Urbano nº 3'],
                    'neighborhoods': ['Central', '7 de Setembro', 'Soalpo', 'Nandfe', 'Vila Nova', 'Cordor']
                },
                {
                    'name': 'Gondola',
                    'administrative_posts': ['Gondola', 'Cafumpe', 'Amatongas'],
                    'neighborhoods': []
                },
                {
                    'name': 'Guro',
                    'administrative_posts': ['Guro', 'Mandie', 'Nhamassonge'],
                    'neighborhoods': []
                },
                {
                    'name': 'Macate',
                    'administrative_posts': ['Macate', 'Marera'],
                    'neighborhoods': []
                },
                {
                    'name': 'Machaze',
                    'administrative_posts': ['Machaze', 'Save'],
                    'neighborhoods': []
                },
                {
                    'name': 'Macossa',
                    'administrative_posts': ['Macossa', 'Nhamagua'],
                    'neighborhoods': []
                },
                {
                    'name': 'Manica',
                    'administrative_posts': ['Manica', 'Messica', 'Mavonde'],
                    'neighborhoods': []
                },
                {
                    'name': 'Mossurize',
                    'administrative_posts': ['Espungabera', 'Dacata'],
                    'neighborhoods': []
                },
                {
                    'name': 'Sussundenga',
                    'administrative_posts': ['Sussundenga', 'Dombe', 'Muhoa'],
                    'neighborhoods': []
                },
                {
                    'name': 'Tambara',
                    'administrative_posts': ['Nhacolo', 'Buzua'],
                    'neighborhoods': []
                },
                {
                    'name': 'Vanduzi',
                    'administrative_posts': ['Vanduzi', 'Matsinho'],
                    'neighborhoods': []
                }
            ]
        },
        {
            'id': 'sof',
            'name': 'Sofala',
            'region': 'Centro',
            'sigla': 'SF',
            'districts': [
                {
                    'name': 'Beira (Cidade)',
                    'administrative_posts': ['Central', 'Munhava', 'Manga Loot', 'Inhamizua'],
                    'neighborhoods': ['Chaimite', 'Macuti', 'Ponta Gêa', 'Munhava', 'Manga', 'Vaz', 'Esturro', 'Cipangara']
                },
                {
                    'name': 'Búzi',
                    'administrative_posts': ['Búzi', 'Estaquinha', 'Nova Sofala'],
                    'neighborhoods': []
                },
                {
                    'name': 'Caia',
                    'administrative_posts': ['Caia', 'Sena', 'Murraça'],
                    'neighborhoods': []
                },
                {
                    'name': 'Chemba',
                    'administrative_posts': ['Chemba', 'Chiramba', 'Mulima'],
                    'neighborhoods': []
                },
                {
                    'name': 'Cheringoma',
                    'administrative_posts': ['Inhaminga', 'Muanza'],
                    'neighborhoods': []
                },
                {
                    'name': 'Chibabava',
                    'administrative_posts': ['Chibabava', 'Goonda', 'Muxúnguè'],
                    'neighborhoods': []
                },
                {
                    'name': 'Dondo',
                    'administrative_posts': ['Dondo', 'Mafambisse'],
                    'neighborhoods': ['Chibuabuamua', 'Central', 'Planalto']
                },
                {
                    'name': 'Gorongosa',
                    'administrative_posts': ['Gorongosa', 'Nhamadzi', 'Vanduzi'],
                    'neighborhoods': []
                },
                {
                    'name': 'Machanga',
                    'administrative_posts': ['Machanga', 'Divinhe'],
                    'neighborhoods': []
                },
                {
                    'name': 'Maringué',
                    'administrative_posts': ['Maringué', 'Canxixe', 'Subui'],
                    'neighborhoods': []
                },
                {
                    'name': 'Marromeu',
                    'administrative_posts': ['Marromeu', 'Chupanga'],
                    'neighborhoods': []
                },
                {
                    'name': 'Muanza',
                    'administrative_posts': ['Muanza', 'Galinha'],
                    'neighborhoods': []
                },
                {
                    'name': 'Nhamatanda',
                    'administrative_posts': ['Nhamatanda', 'Tica'],
                    'neighborhoods': []
                }
            ]
        },
        {
            'id': 'inh',
            'name': 'Inhambane',
            'region': 'Sul',
            'sigla': 'INH',
            'districts': [
                {
                    'name': 'Funhalouro',
                    'administrative_posts': ['Funhalouro', 'Tome'],
                    'neighborhoods': []
                },
                {
                    'name': 'Govuro',
                    'administrative_posts': ['Nova Mambone', 'Jofane'],
                    'neighborhoods': []
                },
                {
                    'name': 'Homoíne',
                    'administrative_posts': ['Homoíne', 'Pembe'],
                    'neighborhoods': []
                },
                {
                    'name': 'Inhambane (Cidade)',
                    'administrative_posts': ['Inhambane'],
                    'neighborhoods': ['Balane', 'Chamane', 'Josina Machel', 'Muelé', 'Liberdade', 'Aeroporto']
                },
                {
                    'name': 'Inharrime',
                    'administrative_posts': ['Inharrime', 'Chambone'],
                    'neighborhoods': []
                },
                {
                    'name': 'Inhassoro',
                    'administrative_posts': ['Inhassoro', 'Bazaruto'],
                    'neighborhoods': []
                },
                {
                    'name': 'Jangamo',
                    'administrative_posts': ['Jangamo', 'Cumbana'],
                    'neighborhoods': []
                },
                {
                    'name': 'Mabote',
                    'administrative_posts': ['Mabote', 'Zimane'],
                    'neighborhoods': []
                },
                {
                    'name': 'Massinga',
                    'administrative_posts': ['Massinga', 'Chicomo'],
                    'neighborhoods': []
                },
                {
                    'name': 'Maxixe (Cidade)',
                    'administrative_posts': ['Maxixe'],
                    'neighborhoods': ['Bairro Central', 'Chamba', 'Macupula', 'Nalazi']
                },
                {
                    'name': 'Morrumbene',
                    'administrative_posts': ['Morrumbene', 'Mucodoene'],
                    'neighborhoods': []
                },
                {
                    'name': 'Panda',
                    'administrative_posts': ['Panda', 'Muelé'],
                    'neighborhoods': []
                },
                {
                    'name': 'Vilankulo',
                    'administrative_posts': ['Vilankulo', 'Mapinhane'],
                    'neighborhoods': ['Bairro Central', 'Mucoque', 'Alto Macassa']
                },
                {
                    'name': 'Zavala',
                    'administrative_posts': ['Quissico', 'Zandamela'],
                    'neighborhoods': []
                }
            ]
        },
        {
            'id': 'gaz',
            'name': 'Gaza',
            'region': 'Sul',
            'sigla': 'GZ',
            'districts': [
                {
                    'name': 'Bilene',
                    'administrative_posts': ['Macia', 'Bilene Macia', 'Chissano'],
                    'neighborhoods': []
                },
                {
                    'name': 'Chibuto',
                    'administrative_posts': ['Chibuto', 'Chaimite', 'Changanine'],
                    'neighborhoods': []
                },
                {
                    'name': 'Chicualacuala',
                    'administrative_posts': ['Chicualacuala', 'Mapai'],
                    'neighborhoods': []
                },
                {
                    'name': 'Chigubo',
                    'administrative_posts': ['Chigubo', 'Ndindiza'],
                    'neighborhoods': []
                },
                {
                    'name': 'Chókwè',
                    'administrative_posts': ['Chókwè', 'Lionde', 'Macarretane'],
                    'neighborhoods': []
                },
                {
                    'name': 'Chonguene',
                    'administrative_posts': ['Chonguene', 'Chongoene'],
                    'neighborhoods': []
                },
                {
                    'name': 'Guijá',
                    'administrative_posts': ['Canicado', 'Chivonguene'],
                    'neighborhoods': []
                },
                {
                    'name': 'Limpopo',
                    'administrative_posts': ['Chicumbane', 'Zongoene'],
                    'neighborhoods': []
                },
                {
                    'name': 'Mabalane',
                    'administrative_posts': ['Mabalane', 'Combomune'],
                    'neighborhoods': []
                },
                {
                    'name': 'Manjacaze',
                    'administrative_posts': ['Manjacaze', 'Chidenguele'],
                    'neighborhoods': []
                },
                {
                    'name': 'Mapai',
                    'administrative_posts': ['Mapai', 'Machaila'],
                    'neighborhoods': []
                },
                {
                    'name': 'Massangena',
                    'administrative_posts': ['Massangena', 'Mavue'],
                    'neighborhoods': []
                },
                {
                    'name': 'Massingir',
                    'administrative_posts': ['Massingir', 'Zulo'],
                    'neighborhoods': []
                },
                {
                    'name': 'Xai-Xai (Cidade)',
                    'administrative_posts': ['Xai-Xai'],
                    'neighborhoods': ['Central', 'Alto-Gaza', 'Inhamissa', 'Panjane', 'Chicumbane', 'Patrice Lumumba']
                }
            ]
        },
        {
            'id': 'mpp',
            'name': 'Maputo (Província)',
            'region': 'Sul',
            'sigla': 'MPT',
            'districts': [
                {
                    'name': 'Boane',
                    'administrative_posts': ['Boane', 'Matola-Rio'],
                    'neighborhoods': ['Bairro Central', 'Campinho', 'Massaca']
                },
                {
                    'name': 'Magude',
                    'administrative_posts': ['Magude', 'Mapulanguene', 'Motaze'],
                    'neighborhoods': []
                },
                {
                    'name': 'Manhiça',
                    'administrative_posts': ['Manhiça', 'Xinavane', '3 de Fevereiro'],
                    'neighborhoods': []
                },
                {
                    'name': 'Marracuene',
                    'administrative_posts': ['Marracuene', 'Machubo'],
                    'neighborhoods': ['Aliança', 'Cumbe', 'Habel Jafar']
                },
                {
                    'name': 'Matola (Cidade)',
                    'administrative_posts': ['Matola', 'Infulene', 'Machava'],
                    'neighborhoods': ['Matola Sede', 'Fomento', 'Liberdade', 'T3', 'Trevo', 'Machava Socimol', 'Cingatela']
                },
                {
                    'name': 'Matutuíne',
                    'administrative_posts': ['Bela Vista', 'Catembe', 'Zitundo'],
                    'neighborhoods': []
                },
                {
                    'name': 'Moamba',
                    'administrative_posts': ['Moamba', 'Ressano Garcia', 'Pessene'],
                    'neighborhoods': []
                },
                {
                    'name': 'Namaacha',
                    'administrative_posts': ['Namaacha', 'Changalane'],
                    'neighborhoods': []
                }
            ]
        },
        {
            'id': 'mpc',
            'name': 'Maputo (Cidade)',
            'region': 'Sul',
            'sigla': 'MC',
            'districts': [
                {
                    'name': 'KaMpfumo',
                    'administrative_posts': ['KaMpfumo'],
                    'neighborhoods': [
                        'Central A/B',
                        'Alto Maé A/B',
                        'Malhangalene A/B',
                        'Polana Cimento A/B/C',
                        'Coop',
                        'Sommerschield'
                    ]
                },
                {
                    'name': 'Nlhamankulu',
                    'administrative_posts': ['Nlhamankulu'],
                    'neighborhoods': ['Aeroporto A/B', 'Chamanculo A/B/C/D', 'Malanga', 'Xipamanine', 'Munhuana', 'Unidade 7']
                },
                {
                    'name': 'KaMaxaquene',
                    'administrative_posts': ['KaMaxaquene'],
                    'neighborhoods': ['Maxaquene A/B/C/D', 'Polana Caniço A/B', 'Urbanização', 'Mafalala']
                },
                {
                    'name': 'KaMavota',
                    'administrative_posts': ['KaMavota'],
                    'neighborhoods': ['Mavalane A/B', 'FPLM', 'Hulene A/B', 'Ferroviário', 'Costa do Sol', 'Polana Caniço B']
                },
                {
                    'name': 'KaMubukwana',
                    'administrative_posts': ['KaMubukwana'],
                    'neighborhoods': ['Bagamoyo', 'George Dimitrov', 'Inhagoia A/B', 'Magoanine A/B/C', 'Zimpeto']
                },
                {
                    'name': 'KaTembe',
                    'administrative_posts': ['KaTembe'],
                    'neighborhoods': ['Gwaza Muthini', 'Incassane', 'Inguide', 'Chali', 'Chamissava']
                },
                {
                    'name': 'KaNyaka',
                    'administrative_posts': ['KaNyaka'],
                    'neighborhoods': ['Ribzene', 'Nghanyane', 'Chadwane']
                }
            ]
        }
    ]

def get_districts_by_province(province_id: str) -> List[str]:
    """Returns the list of districts belonging to a given province."""
    clean_id = province_id.strip().lower()
    for province in get_mozambique_provinces():
        if province['id'] == clean_id:
            return [d['name'] for d in province['districts']]
    raise ValueError(f"Província inválida: {province_id}")

def get_all_districts() -> List[Dict[str, Any]]:
    """Returns a flat list of all 161 districts and their respective province IDs."""
    flat_list = []
    for province in get_mozambique_provinces():
        p_id = province['id']
        for district in province['districts']:
            flat_list.append({
                'name': district['name'],
                'provinceId': p_id,
                'administrative_posts': district['administrative_posts'],
                'neighborhoods': district['neighborhoods']
            })
    return flat_list


# ─────────────────────────────────────────────────────────────────────────────
# NAME & DOCUMENT FIELD SANITIZATION
# ─────────────────────────────────────────────────────────────────────────────

def is_valid_name(name: str) -> bool:
    """
    Checks whether a string is a valid personal name.
    Accepts letters (including accented), spaces, hyphens, and apostrophes.
    Rejects digits and most special characters.

    Examples:
        is_valid_name('Edmilson Muacigarro')  # True
        is_valid_name('João O\'Brian')         # True
        is_valid_name('Jean-Pierre')           # True
        is_valid_name('ABC123')                # False
    """
    import unicodedata
    stripped = name.strip()
    if not stripped:
        return False
    for char in stripped:
        cat = unicodedata.category(char)
        if not (cat.startswith('L') or char in " '-"):
            return False
    return True


def sanitize_name(name: str, all_caps: bool = False) -> str:
    """
    Sanitizes a personal name field.

    By default converts to Title Case (each word starts with a capital letter).
    Pass all_caps=True to force ALL UPPERCASE.

    Strips digits and most special characters, keeping only letters,
    spaces, hyphens, and apostrophes.

    Args:
        name: The raw name string to sanitize.
        all_caps: If True, returns the name in ALL UPPERCASE.

    Returns:
        Sanitized name string.

    Examples:
        sanitize_name('  edmilson   muacigarro  ')    # 'Edmilson Muacigarro'
        sanitize_name('JOÃO', all_caps=True)          # 'JOÃO'
        sanitize_name('jean-pierre dupont')            # 'Jean-Pierre Dupont'
    """
    import unicodedata
    # Keep only letters, spaces, hyphens, apostrophes
    cleaned_chars = [c for c in name if unicodedata.category(c).startswith('L') or c in " '-"]
    cleaned = ' '.join(''.join(cleaned_chars).split())  # collapse whitespace

    if all_caps:
        return cleaned.upper()

    # Title Case: capitalise first letter after space or hyphen
    result = []
    capitalise_next = True
    for char in cleaned:
        if char in ' -':
            result.append(char)
            capitalise_next = True
        elif capitalise_next:
            result.append(char.upper())
            capitalise_next = False
        else:
            result.append(char)
    return ''.join(result)


def sanitize_document_field(value: str) -> str:
    """
    Sanitizes a document number field that contains only digits.
    Strips all non-numeric characters.

    Useful for NUIT, phone numbers before validation, etc.

    Examples:
        sanitize_document_field('123 456 789')  # '123456789'
        sanitize_document_field('123-456-789')  # '123456789'
    """
    return re.sub(r'\D', '', value)


def sanitize_alphanumeric_field(value: str) -> str:
    """
    Sanitizes an alphanumeric document field (digits + letters),
    forcing all letters to UPPERCASE.

    Useful for BI, passports, and other mixed-format documents.

    Examples:
        sanitize_alphanumeric_field('110 101 234567a')  # '110101234567A'
        sanitize_alphanumeric_field('abc-123-XYZ!')     # 'ABC123XYZ'
    """
    return re.sub(r'[^A-Za-z0-9]', '', value).upper()


LEGACY_POSTAL_CODES = {
    # Região Sul
    # Maputo
    '1100': {'locality': 'Maputo ECP (Sede)', 'province': 'Maputo'},
    '1101': {'locality': 'Polana', 'province': 'Maputo'},
    '1102': {'locality': 'Sommerchild', 'province': 'Maputo'},
    '1103': {'locality': 'Malhangalene', 'province': 'Maputo'},
    '1104': {'locality': 'Alto-Maé', 'province': 'Maputo'},
    '1106': {'locality': 'Bairro Central', 'province': 'Maputo'},
    '1107': {'locality': 'Bairro do Aeroporto', 'province': 'Maputo'},
    '1108': {'locality': 'Bairro do Mavalane', 'province': 'Maputo'},
    '1109': {'locality': 'Bairro do Jardim', 'province': 'Maputo'},
    '1110': {'locality': 'Bairro do Xipamanine', 'province': 'Maputo'},
    '1111': {'locality': 'Bairro George Dimitrov', 'province': 'Maputo'},
    '1112': {'locality': 'Machava', 'province': 'Maputo'},
    '1113': {'locality': 'Fomento', 'province': 'Maputo'},
    '1114': {'locality': 'Matola', 'province': 'Maputo'},
    '1115': {'locality': 'Boane', 'province': 'Maputo'},
    '1116': {'locality': 'Namaacha', 'province': 'Maputo'},
    '1117': {'locality': 'Katembe', 'province': 'Maputo'},
    '1118': {'locality': 'Bela-Vista', 'province': 'Maputo'},
    '1119': {'locality': 'Inhaca', 'province': 'Maputo'},
    '1120': {'locality': 'Marracuene', 'province': 'Maputo'},
    '1121': {'locality': 'Manhiça', 'province': 'Maputo'},
    '1122': {'locality': 'Xinavane', 'province': 'Maputo'},
    '1123': {'locality': 'Magude', 'province': 'Maputo'},
    '1124': {'locality': 'Moamba', 'province': 'Maputo'},
    '1125': {'locality': 'Ressano Garcia', 'province': 'Maputo'},
    # Gaza
    '1200': {'locality': 'Xai-Xai ECP', 'province': 'Gaza'},
    '1201': {'locality': 'Praia de Xai-Xai', 'province': 'Gaza'},
    '1202': {'locality': 'Macia', 'province': 'Gaza'},
    '1203': {'locality': 'Praia de Bilene', 'province': 'Gaza'},
    '1204': {'locality': 'Chokwé', 'province': 'Gaza'},
    '1205': {'locality': 'Chilembene / Magoanine', 'province': 'Gaza'},
    '1206': {'locality': 'Mabalane', 'province': 'Gaza'},
    '1207': {'locality': 'Massingir', 'province': 'Gaza'},
    '1208': {'locality': 'Chibuto', 'province': 'Gaza'},
    '1209': {'locality': 'Manjacaze', 'province': 'Gaza'},
    '1210': {'locality': 'Chidenguele', 'province': 'Gaza'},
    '1211': {'locality': 'Chicualacuala', 'province': 'Gaza'},
    # Inhambane
    '1300': {'locality': 'Inhambane ECP', 'province': 'Inhambane'},
    '1301': {'locality': 'Maxixe', 'province': 'Inhambane'},
    '1302': {'locality': 'Morrumbene', 'province': 'Inhambane'},
    '1303': {'locality': 'Massinga', 'province': 'Inhambane'},
    '1304': {'locality': 'Vilanculos', 'province': 'Inhambane'},
    '1305': {'locality': 'Inhassoro', 'province': 'Inhambane'},
    '1306': {'locality': 'Nova-Mambone', 'province': 'Inhambane'},
    '1307': {'locality': 'Jangamo', 'province': 'Inhambane'},
    '1308': {'locality': 'Cumbane', 'province': 'Inhambane'},
    '1309': {'locality': 'Homoine', 'province': 'Inhambane'},
    '1310': {'locality': 'Panda', 'province': 'Inhambane'},
    '1311': {'locality': 'Inharrime', 'province': 'Inhambane'},
    '1312': {'locality': 'Quissico', 'province': 'Inhambane'},
    '1313': {'locality': 'Funhalouro', 'province': 'Inhambane'},
    '1314': {'locality': 'Mabote', 'province': 'Inhambane'},

    # Região Centro
    # Sofala
    '2100': {'locality': 'Beira ECP', 'province': 'Sofala'},
    '2101': {'locality': 'Macúti', 'province': 'Sofala'},
    '2102': {'locality': 'Beira Aeroporto', 'province': 'Sofala'},
    '2103': {'locality': 'Manga', 'province': 'Sofala'},
    '2104': {'locality': 'Dondo', 'province': 'Sofala'},
    '2105': {'locality': 'Mafambisse', 'province': 'Sofala'},
    '2106': {'locality': 'Nhamatanda', 'province': 'Sofala'},
    '2107': {'locality': 'Buzi', 'province': 'Sofala'},
    '2110': {'locality': 'Gorongoza', 'province': 'Sofala'},
    # Manica
    '2200': {'locality': 'Chimoio ECP', 'province': 'Manica'},
    '2201': {'locality': 'Catandica', 'province': 'Manica'},
    '2202': {'locality': 'Vila de Manica', 'province': 'Manica'},
    '2203': {'locality': 'Gondola', 'province': 'Manica'},
    '2204': {'locality': 'Guro', 'province': 'Manica'},
    '2205': {'locality': 'Machaze', 'province': 'Manica'},
    '2206': {'locality': 'Macossa', 'province': 'Manica'},
    '2207': {'locality': 'Sussundenga', 'province': 'Manica'},
    '2208': {'locality': 'Tambara', 'province': 'Manica'},
    # Tete
    '2300': {'locality': 'Tete ECP', 'province': 'Tete'},
    '2301': {'locality': 'Tete Aeroporto', 'province': 'Tete'},
    '2302': {'locality': 'Moatize', 'province': 'Tete'},
    '2304': {'locality': 'Songo', 'province': 'Tete'},
    '2307': {'locality': 'Mutarara', 'province': 'Tete'},
    '2312': {'locality': 'Zumbo', 'province': 'Tete'},
    # Zambézia
    '2400': {'locality': 'Quelimane ECP', 'province': 'Zambézia'},
    '2401': {'locality': 'Nicoadala', 'province': 'Zambézia'},
    '2403': {'locality': 'Mocuba', 'province': 'Zambézia'},
    '2405': {'locality': 'Pebane', 'province': 'Zambézia'},
    '2407': {'locality': 'Gurué', 'province': 'Zambézia'},
    '2412': {'locality': 'Chinde', 'province': 'Zambézia'},

    # Região Norte
    # Nampula
    '3100': {'locality': 'Nampula ECP', 'province': 'Nampula'},
    '3101': {'locality': 'Angoche', 'province': 'Nampula'},
    '3102': {'locality': 'Monapo', 'province': 'Nampula'},
    '3105': {'locality': 'Ilha de Moçambique', 'province': 'Nampula'},
    '3108': {'locality': 'Moma', 'province': 'Nampula'},
    '3112': {'locality': 'Nacala', 'province': 'Nampula'},
    '3115': {'locality': 'Namapa', 'province': 'Nampula'},
    '3119': {'locality': 'Ribaue', 'province': 'Nampula'},
    # Cabo Delgado
    '3200': {'locality': 'Pemba ECP', 'province': 'Cabo Delgado'},
    '3201': {'locality': 'Pemba-2', 'province': 'Cabo Delgado'},
    '3208': {'locality': 'Montepuez', 'province': 'Cabo Delgado'},
    '3216': {'locality': 'Mueda', 'province': 'Cabo Delgado'},
    '3219': {'locality': 'Palma', 'province': 'Cabo Delgado'},
    # Niassa
    '3300': {'locality': 'Lichinga ECP', 'province': 'Niassa'},
    '3301': {'locality': 'Macanhelas', 'province': 'Niassa'},
    '3304': {'locality': 'Mandimba', 'province': 'Niassa'},
    '3305': {'locality': 'Cuamba', 'province': 'Niassa'},
    '3311': {'locality': 'Muembe', 'province': 'Niassa'}
}


from .cep_data import LEGACY_POSTAL_CODES

def is_valid_postal_code(code: str) -> bool:
    """
    Valida se um código postal legado de Moçambique é válido.
    Deve conter 4 dígitos numéricos pertencentes ao sistema clássico dos Correios de Moçambique.
    """
    cleaned = re.sub(r'\D', '', code)
    return cleaned in LEGACY_POSTAL_CODES


def get_postal_code_locality(code: str) -> Optional[str]:
    """Retorna a localidade correspondente a um código postal legado de Moçambique."""
    cleaned = re.sub(r'\D', '', code)
    entry = LEGACY_POSTAL_CODES.get(cleaned)
    return entry['locality'] if entry else None


def get_postal_code_province(code: str) -> Optional[str]:
    """Retorna a província correspondente a um código postal legado de Moçambique."""
    cleaned = re.sub(r'\D', '', code)
    entry = LEGACY_POSTAL_CODES.get(cleaned)
    return entry['province'] if entry else None



def get_mobile_wallet(phone: str) -> Optional[str]:
    """Identifica a carteira móvel (Mobile Wallet) associada a um número moçambicano."""
    operator = get_mobile_operator(phone)
    if not operator:
        return None
    
    wallets = {
        'Vodacom': 'M-Pesa',
        'Tmcel': 'mKesh',
        'Movitel': 'e-Mola'
    }
    return wallets.get(operator)

def is_valid_dire(dire: str) -> bool:
    """
    Validates the Mozambican DIRE (Documento de Identificação de Residente Estrangeiro).
    Supports the modern SENAMI format (9 digits + 1 letter, e.g., 120345678A)
    as well as legacy formats (e.g., 00008312C or 12C00008312C).
    """
    cleaned = re.sub(r'[\s\-]', '', dire).upper()
    return bool(re.match(r'^(?:\d{8}[A-Z]|\d{2}[A-Z]\d{8}[A-Z0-9]|\d{9}[A-Z])$', cleaned))

def is_valid_passport(passport: str) -> bool:
    """
    Validates the Mozambican Passport.
    Official format: Exactly 2 letters followed by 7 numeric digits (E.g.: AO1234567).
    """
    cleaned = re.sub(r'[\s\-]', '', passport).upper()
    return bool(re.match(r'^[A-Z]{2}\d{7}$', cleaned))

def is_valid_driving_license(license_str: str) -> bool:
    """
    Validates the Mozambican Driving License (Carta de Condução).
    Supports the modern INATRO biometric format (2 letters + 7 digits, e.g., MP1234567)
    as well as legacy formats (e.g., M123456).
    """
    cleaned = re.sub(r'[\s\-]', '', license_str).upper()
    return bool(re.match(r'^(?:[A-Z]\d{5,7}|\d{12}[A-Z]|[A-Z]{2}\d{7})$', cleaned))

def is_valid_new_cep(cep: str) -> bool:
    """Valida o formato do Novo CEP (Formato: XXXX-XX)"""
    return bool(re.match(r'^\d{4}-\d{2}$', cep.strip()))

def suggest_ceps(cep_input: str) -> List[Dict[str, Any]]:
    """
    Sugere Novos Códigos de Endereçamento Postal (CEP) baseados numa entrada.
    A entrada pode ser um CEP antigo (ex: '3100'), parcial do novo CEP, província, ou distrito.
    """
    from .cep_data import NEW_CEP_DATA, LEGACY_TO_NEW_CEP_PREFIX
    cleaned = cep_input.strip()
    if not cleaned:
        return []
    
    # Se for código legado, usar prefixo
    is_digits = cleaned.replace('-', '').isdigit()
    search_prefixes = []
    
    if is_digits and len(cleaned) == 4 and cleaned in LEGACY_TO_NEW_CEP_PREFIX:
        search_prefixes = LEGACY_TO_NEW_CEP_PREFIX[cleaned]
    
    results = []
    cleaned_lower = cleaned.lower()
    
    for item in NEW_CEP_DATA:
        if search_prefixes:
            # Filtro por prefixo legado
            if any(item['cep'].startswith(prefix) for prefix in search_prefixes):
                results.append(item)
        else:
            # Filtro genérico (CEP, província, distrito, localidade)
            if (cleaned_lower in item['cep'].lower() or
                cleaned_lower in item['province'].lower() or
                cleaned_lower in item['district'].lower() or
                cleaned_lower in item['locality'].lower()):
                results.append(item)
                
    return results

