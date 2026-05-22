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
        {
            'id': 'cab',
            'name': 'Cabo Delgado',
            'region': 'Norte',
            'sigla': 'CBD',
            'districts': [
                {
                    'name': 'Ancuabe',
                    'postos_administrativos': ['Ancuabe', 'Metoro', 'Meza'],
                    'bairros': []
                },
                {
                    'name': 'Balama',
                    'postos_administrativos': ['Balama', 'Chapa', 'Kuekue', 'Mavala'],
                    'bairros': []
                },
                {
                    'name': 'Chiúre',
                    'postos_administrativos': ['Chiúre', 'Chiúre-Velho', 'Katapua', 'Mazeze', 'Namogelia', 'Manoane'],
                    'bairros': []
                },
                {
                    'name': 'Ibo',
                    'postos_administrativos': ['Ibo', 'Quirimba'],
                    'bairros': []
                },
                {
                    'name': 'Macomia',
                    'postos_administrativos': ['Macomia', 'Chai', 'Mucojo', 'Quiterajo'],
                    'bairros': []
                },
                {
                    'name': 'Mecúfi',
                    'postos_administrativos': ['Mecúfi', 'Murrébuè'],
                    'bairros': []
                },
                {
                    'name': 'Meluco',
                    'postos_administrativos': ['Meluco', 'Muaguide'],
                    'bairros': []
                },
                {
                    'name': 'Metuge',
                    'postos_administrativos': ['Metuge', 'Mieze'],
                    'bairros': []
                },
                {
                    'name': 'Mocímboa da Praia',
                    'postos_administrativos': ['Mocímboa da Praia', 'Diaca', 'Mbau'],
                    'bairros': []
                },
                {
                    'name': 'Montepuez',
                    'postos_administrativos': ['Montepuez', 'Mapupulo', 'Namanhumbir', 'Nairoto', 'Napaula'],
                    'bairros': []
                },
                {
                    'name': 'Mueda',
                    'postos_administrativos': ['Mueda', 'Chapa', 'Imbuho', 'Negomano', 'N\'gapa'],
                    'bairros': []
                },
                {
                    'name': 'Muidumbe',
                    'postos_administrativos': ['Muidumbe', 'Chitunda', 'Miteda'],
                    'bairros': []
                },
                {
                    'name': 'Namuno',
                    'postos_administrativos': ['Namuno', 'Machoca', 'Meloco', 'Ncumpe', 'Luli'],
                    'bairros': []
                },
                {
                    'name': 'Nangade',
                    'postos_administrativos': ['Nangade', 'Ntamba'],
                    'bairros': []
                },
                {
                    'name': 'Palma',
                    'postos_administrativos': ['Palma', 'Olumbe', 'Quionga'],
                    'bairros': []
                },
                {
                    'name': 'Pemba (Cidade)',
                    'postos_administrativos': ['Pemba'],
                    'bairros': [
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
                    'postos_administrativos': ['Quissanga', 'Mahate', 'Bilibiza'],
                    'bairros': []
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
                    'postos_administrativos': ['Chimbonila', 'Meponda'],
                    'bairros': []
                },
                {
                    'name': 'Cuamba',
                    'postos_administrativos': ['Cuamba', 'Lúrio', 'Etatara'],
                    'bairros': ['Ribaue', 'Mutxora', 'Ademo', 'Aeroporto']
                },
                {
                    'name': 'Lago',
                    'postos_administrativos': ['Metangula', 'Cobué', 'Luninho', 'Maniamba'],
                    'bairros': []
                },
                {
                    'name': 'Lichinga (Cidade)',
                    'postos_administrativos': ['Lichinga'],
                    'bairros': ['Central', 'Popular', 'Chimba', 'Cerâmica', 'Ngaula', 'Sanjala', 'Chiuaula']
                },
                {
                    'name': 'Majune',
                    'postos_administrativos': ['Majune', 'Mua', 'Nairrobi'],
                    'bairros': []
                },
                {
                    'name': 'Mandimba',
                    'postos_administrativos': ['Mandimba', 'Mitande'],
                    'bairros': []
                },
                {
                    'name': 'Marrupa',
                    'postos_administrativos': ['Marrupa', 'Marangira', 'Nungo'],
                    'bairros': []
                },
                {
                    'name': 'Maúa',
                    'postos_administrativos': ['Maúa', 'Maiaca'],
                    'bairros': []
                },
                {
                    'name': 'Mavago',
                    'postos_administrativos': ['Mavago', 'M\'saize'],
                    'bairros': []
                },
                {
                    'name': 'Mecanhelas',
                    'postos_administrativos': ['Mecanhelas', 'Chiuta'],
                    'bairros': []
                },
                {
                    'name': 'Mecula',
                    'postos_administrativos': ['Mecula', 'Matondovela'],
                    'bairros': []
                },
                {
                    'name': 'Metarica',
                    'postos_administrativos': ['Metarica', 'Nacuanha'],
                    'bairros': []
                },
                {
                    'name': 'Muembe',
                    'postos_administrativos': ['Muembe', 'Chiconono'],
                    'bairros': []
                },
                {
                    'name': 'N\'gauma',
                    'postos_administrativos': ['Massangulo', 'Itepela'],
                    'bairros': []
                },
                {
                    'name': 'Nipepe',
                    'postos_administrativos': ['Nipepe', 'Muatuca'],
                    'bairros': []
                },
                {
                    'name': 'Sanga',
                    'postos_administrativos': ['Unango', 'Malamuila', 'Matchedje'],
                    'bairros': []
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
                    'postos_administrativos': ['Angoche', 'Aube', 'Namaponda'],
                    'bairros': []
                },
                {
                    'name': 'Eráti',
                    'postos_administrativos': ['Namapa', 'Alua', 'Nakarari'],
                    'bairros': []
                },
                {
                    'name': 'Ilha de Moçambique',
                    'postos_administrativos': ['Ilha de Moçambique', 'Lumbo'],
                    'bairros': ['Museu', 'Litine', 'Areal', 'Marangonha']
                },
                {
                    'name': 'Lalaua',
                    'postos_administrativos': ['Lalaua', 'Meti'],
                    'bairros': []
                },
                {
                    'name': 'Larde',
                    'postos_administrativos': ['Larde', 'Mucuali'],
                    'bairros': []
                },
                {
                    'name': 'Liúpo',
                    'postos_administrativos': ['Liúpo', 'Quinga'],
                    'bairros': []
                },
                {
                    'name': 'Malema',
                    'postos_administrativos': ['Malema', 'Chinga', 'Mutuali'],
                    'bairros': []
                },
                {
                    'name': 'Meconta',
                    'postos_administrativos': ['Meconta', 'Corrane', 'Namialo'],
                    'bairros': []
                },
                {
                    'name': 'Mecubúri',
                    'postos_administrativos': ['Mecubúri', 'Milhana', 'Muite', 'Namina'],
                    'bairros': []
                },
                {
                    'name': 'Memba',
                    'postos_administrativos': ['Memba', 'Chipene', 'Mazua', 'Lurio'],
                    'bairros': []
                },
                {
                    'name': 'Mogincual',
                    'postos_administrativos': ['Mogincual', 'Quixaxe'],
                    'bairros': []
                },
                {
                    'name': 'Mogovolas',
                    'postos_administrativos': ['Nametil', 'Calipo', 'Ilute', 'Muatua'],
                    'bairros': []
                },
                {
                    'name': 'Moma',
                    'postos_administrativos': ['Macone', 'Chalai', 'Lunga'],
                    'bairros': []
                },
                {
                    'name': 'Monapo',
                    'postos_administrativos': ['Monapo', 'Itoculo', 'Netia'],
                    'bairros': []
                },
                {
                    'name': 'Mossuril',
                    'postos_administrativos': ['Mossuril', 'Lunga', 'Matibane'],
                    'bairros': []
                },
                {
                    'name': 'Muecate',
                    'postos_administrativos': ['Muecate', 'Imala', 'Muculuone'],
                    'bairros': []
                },
                {
                    'name': 'Murrupula',
                    'postos_administrativos': ['Murrupula', 'Chinga', 'Nihessiue'],
                    'bairros': []
                },
                {
                    'name': 'Nacala-a-Velha',
                    'postos_administrativos': ['Nacala-a-Velha', 'Covo'],
                    'bairros': []
                },
                {
                    'name': 'Nacala Porto',
                    'postos_administrativos': ['Nacala Porto', 'Muanona'],
                    'bairros': ['Mutiva', 'Triângulo', 'Ontupaia', 'Quissanga']
                },
                {
                    'name': 'Nampula (Cidade)',
                    'postos_administrativos': ['Urbano Central', 'Muatala', 'Muhala', 'Namikopo', 'Napipine', 'Natikiri'],
                    'bairros': ['Central', 'Muatala', 'Muhala', 'Namikopo', 'Napipine', 'Natikiri', 'Marrere', 'Namutequeliua']
                },
                {
                    'name': 'Nacarôa',
                    'postos_administrativos': ['Nacarôa', 'Saua-Saua'],
                    'bairros': []
                },
                {
                    'name': 'Rapale',
                    'postos_administrativos': ['Rapale', 'Anchilo', 'Mutivaze'],
                    'bairros': []
                },
                {
                    'name': 'Ribáuè',
                    'postos_administrativos': ['Ribáuè', 'Cunle', 'Iapala'],
                    'bairros': []
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
                    'postos_administrativos': ['Alto Molócuè', 'Nauela'],
                    'bairros': []
                },
                {
                    'name': 'Chinde',
                    'postos_administrativos': ['Chinde', 'Micaune'],
                    'bairros': []
                },
                {
                    'name': 'Derre',
                    'postos_administrativos': ['Derre', 'Guerissa'],
                    'bairros': []
                },
                {
                    'name': 'Gilé',
                    'postos_administrativos': ['Gilé', 'Alto Ligonha'],
                    'bairros': []
                },
                {
                    'name': 'Gurué',
                    'postos_administrativos': ['Gurué', 'Lioma', 'Nepuíte'],
                    'bairros': ['Bairro Central', 'Mucuapa', 'Nacuacue']
                },
                {
                    'name': 'Ile',
                    'postos_administrativos': ['Ile', 'Socone'],
                    'bairros': []
                },
                {
                    'name': 'Inhassunge',
                    'postos_administrativos': ['Mucupia', 'Gonhane'],
                    'bairros': []
                },
                {
                    'name': 'Luabo',
                    'postos_administrativos': ['Luabo', 'Chimbazo'],
                    'bairros': []
                },
                {
                    'name': 'Lugela',
                    'postos_administrativos': ['Lugela', 'Tacuane', 'Munhamade'],
                    'bairros': []
                },
                {
                    'name': 'Maganja da Costa',
                    'postos_administrativos': ['Maganja da Costa', 'Baleia'],
                    'bairros': []
                },
                {
                    'name': 'Milange',
                    'postos_administrativos': ['Milange', 'Majaua', 'Mongue'],
                    'bairros': []
                },
                {
                    'name': 'Mocuba',
                    'postos_administrativos': ['Mocuba', 'Mualama', 'Namanjavira'],
                    'bairros': ['Central', 'Aeroporto', 'Paraíso']
                },
                {
                    'name': 'Mocubela',
                    'postos_administrativos': ['Mocubela', 'Bajone'],
                    'bairros': []
                },
                {
                    'name': 'Molumbo',
                    'postos_administrativos': ['Molumbo', 'Corromana'],
                    'bairros': []
                },
                {
                    'name': 'Mopeia',
                    'postos_administrativos': ['Mopeia', 'Campo'],
                    'bairros': []
                },
                {
                    'name': 'Morrumbala',
                    'postos_administrativos': ['Morrumbala', 'Chire', 'Megaza'],
                    'bairros': []
                },
                {
                    'name': 'Mulevala',
                    'postos_administrativos': ['Mulevala', 'Chirimane'],
                    'bairros': []
                },
                {
                    'name': 'Namacurra',
                    'postos_administrativos': ['Namacurra', 'Macuse'],
                    'bairros': []
                },
                {
                    'name': 'Namarrói',
                    'postos_administrativos': ['Namarrói', 'Regone'],
                    'bairros': []
                },
                {
                    'name': 'Nicoadala',
                    'postos_administrativos': ['Nicoadala', 'Maquival'],
                    'bairros': []
                },
                {
                    'name': 'Pebane',
                    'postos_administrativos': ['Pebane', 'Mulela', 'Naburi'],
                    'bairros': []
                },
                {
                    'name': 'Quelimane (Cidade)',
                    'postos_administrativos': ['Urbano nº 1', 'Urbano nº 2', 'Urbano nº 3', 'Urbano nº 4'],
                    'bairros': ['Central', 'Cementório', 'Inhassunge', 'Icidua', 'Chingo', 'Matacuane']
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
                    'postos_administrativos': ['Ulongue', 'Domue'],
                    'bairros': []
                },
                {
                    'name': 'Cahora-Bassa',
                    'postos_administrativos': ['Songo', 'Chitima', 'Muxeza'],
                    'bairros': []
                },
                {
                    'name': 'Changara',
                    'postos_administrativos': ['Luenha', 'Chioco', 'Mavago'],
                    'bairros': []
                },
                {
                    'name': 'Chifunde',
                    'postos_administrativos': ['Chifunde', 'Mualadzi', 'Nsadzu'],
                    'bairros': []
                },
                {
                    'name': 'Chiuta',
                    'postos_administrativos': ['Manje', 'Kazula'],
                    'bairros': []
                },
                {
                    'name': 'Dôa',
                    'postos_administrativos': ['Dôa', 'Chueza'],
                    'bairros': []
                },
                {
                    'name': 'Macanga',
                    'postos_administrativos': ['Furancungo', 'Chinde'],
                    'bairros': []
                },
                {
                    'name': 'Magoé',
                    'postos_administrativos': ['Mpende', 'Chinthopo', 'Mukumbura'],
                    'bairros': []
                },
                {
                    'name': 'Marara',
                    'postos_administrativos': ['Marara', 'M\'fuba'],
                    'bairros': []
                },
                {
                    'name': 'Marávia',
                    'postos_administrativos': ['Fingoé', 'Chiputo', 'Molumbo'],
                    'bairros': []
                },
                {
                    'name': 'Moatize',
                    'postos_administrativos': ['Moatize', 'Kambulatsitsi', 'Zóbuè'],
                    'bairros': ['Bairro 25 de Setembro', 'Liberdade', 'Chithatha']
                },
                {
                    'name': 'Mutarara',
                    'postos_administrativos': ['Nhamayabué', 'Inhangoma'],
                    'bairros': []
                },
                {
                    'name': 'Tete (Cidade)',
                    'postos_administrativos': ['Tete'],
                    'bairros': ['Chingo', 'Degue', 'Matundo', 'Mpadue', 'Josina Machel', 'Francisco Manyanga']
                },
                {
                    'name': 'Tsangano',
                    'postos_administrativos': ['Tsangano', 'Ntengo-Wambuzi'],
                    'bairros': []
                },
                {
                    'name': 'Zumbo',
                    'postos_administrativos': ['Zumbo', 'Muze', 'Zambue'],
                    'bairros': []
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
                    'postos_administrativos': ['Catandica', 'Nhampassa', 'Chuala'],
                    'bairros': []
                },
                {
                    'name': 'Chimoio (Cidade)',
                    'postos_administrativos': ['Urbano nº 1', 'Urbano nº 2', 'Urbano nº 3'],
                    'bairros': ['Central', '7 de Setembro', 'Soalpo', 'Nandfe', 'Vila Nova', 'Cordor']
                },
                {
                    'name': 'Gondola',
                    'postos_administrativos': ['Gondola', 'Cafumpe', 'Amatongas'],
                    'bairros': []
                },
                {
                    'name': 'Guro',
                    'postos_administrativos': ['Guro', 'Mandie', 'Nhamassonge'],
                    'bairros': []
                },
                {
                    'name': 'Macate',
                    'postos_administrativos': ['Macate', 'Marera'],
                    'bairros': []
                },
                {
                    'name': 'Machaze',
                    'postos_administrativos': ['Machaze', 'Save'],
                    'bairros': []
                },
                {
                    'name': 'Macossa',
                    'postos_administrativos': ['Macossa', 'Nhamagua'],
                    'bairros': []
                },
                {
                    'name': 'Manica',
                    'postos_administrativos': ['Manica', 'Messica', 'Mavonde'],
                    'bairros': []
                },
                {
                    'name': 'Mossurize',
                    'postos_administrativos': ['Espungabera', 'Dacata'],
                    'bairros': []
                },
                {
                    'name': 'Sussundenga',
                    'postos_administrativos': ['Sussundenga', 'Dombe', 'Muhoa'],
                    'bairros': []
                },
                {
                    'name': 'Tambara',
                    'postos_administrativos': ['Nhacolo', 'Buzua'],
                    'bairros': []
                },
                {
                    'name': 'Vanduzi',
                    'postos_administrativos': ['Vanduzi', 'Matsinho'],
                    'bairros': []
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
                    'postos_administrativos': ['Central', 'Munhava', 'Manga Loot', 'Inhamizua'],
                    'bairros': ['Chaimite', 'Macuti', 'Ponta Gêa', 'Munhava', 'Manga', 'Vaz', 'Esturro', 'Cipangara']
                },
                {
                    'name': 'Búzi',
                    'postos_administrativos': ['Búzi', 'Estaquinha', 'Nova Sofala'],
                    'bairros': []
                },
                {
                    'name': 'Caia',
                    'postos_administrativos': ['Caia', 'Sena', 'Murraça'],
                    'bairros': []
                },
                {
                    'name': 'Chemba',
                    'postos_administrativos': ['Chemba', 'Chiramba', 'Mulima'],
                    'bairros': []
                },
                {
                    'name': 'Cheringoma',
                    'postos_administrativos': ['Inhaminga', 'Muanza'],
                    'bairros': []
                },
                {
                    'name': 'Chibabava',
                    'postos_administrativos': ['Chibabava', 'Goonda', 'Muxúnguè'],
                    'bairros': []
                },
                {
                    'name': 'Dondo',
                    'postos_administrativos': ['Dondo', 'Mafambisse'],
                    'bairros': ['Chibuabuamua', 'Central', 'Planalto']
                },
                {
                    'name': 'Gorongosa',
                    'postos_administrativos': ['Gorongosa', 'Nhamadzi', 'Vanduzi'],
                    'bairros': []
                },
                {
                    'name': 'Machanga',
                    'postos_administrativos': ['Machanga', 'Divinhe'],
                    'bairros': []
                },
                {
                    'name': 'Maringué',
                    'postos_administrativos': ['Maringué', 'Canxixe', 'Subui'],
                    'bairros': []
                },
                {
                    'name': 'Marromeu',
                    'postos_administrativos': ['Marromeu', 'Chupanga'],
                    'bairros': []
                },
                {
                    'name': 'Muanza',
                    'postos_administrativos': ['Muanza', 'Galinha'],
                    'bairros': []
                },
                {
                    'name': 'Nhamatanda',
                    'postos_administrativos': ['Nhamatanda', 'Tica'],
                    'bairros': []
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
                    'postos_administrativos': ['Funhalouro', 'Tome'],
                    'bairros': []
                },
                {
                    'name': 'Govuro',
                    'postos_administrativos': ['Nova Mambone', 'Jofane'],
                    'bairros': []
                },
                {
                    'name': 'Homoíne',
                    'postos_administrativos': ['Homoíne', 'Pembe'],
                    'bairros': []
                },
                {
                    'name': 'Inhambane (Cidade)',
                    'postos_administrativos': ['Inhambane'],
                    'bairros': ['Balane', 'Chamane', 'Josina Machel', 'Muelé', 'Liberdade', 'Aeroporto']
                },
                {
                    'name': 'Inharrime',
                    'postos_administrativos': ['Inharrime', 'Chambone'],
                    'bairros': []
                },
                {
                    'name': 'Inhassoro',
                    'postos_administrativos': ['Inhassoro', 'Bazaruto'],
                    'bairros': []
                },
                {
                    'name': 'Jangamo',
                    'postos_administrativos': ['Jangamo', 'Cumbana'],
                    'bairros': []
                },
                {
                    'name': 'Mabote',
                    'postos_administrativos': ['Mabote', 'Zimane'],
                    'bairros': []
                },
                {
                    'name': 'Massinga',
                    'postos_administrativos': ['Massinga', 'Chicomo'],
                    'bairros': []
                },
                {
                    'name': 'Maxixe (Cidade)',
                    'postos_administrativos': ['Maxixe'],
                    'bairros': ['Bairro Central', 'Chamba', 'Macupula', 'Nalazi']
                },
                {
                    'name': 'Morrumbene',
                    'postos_administrativos': ['Morrumbene', 'Mucodoene'],
                    'bairros': []
                },
                {
                    'name': 'Panda',
                    'postos_administrativos': ['Panda', 'Muelé'],
                    'bairros': []
                },
                {
                    'name': 'Vilankulo',
                    'postos_administrativos': ['Vilankulo', 'Mapinhane'],
                    'bairros': ['Bairro Central', 'Mucoque', 'Alto Macassa']
                },
                {
                    'name': 'Zavala',
                    'postos_administrativos': ['Quissico', 'Zandamela'],
                    'bairros': []
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
                    'postos_administrativos': ['Macia', 'Bilene Macia', 'Chissano'],
                    'bairros': []
                },
                {
                    'name': 'Chibuto',
                    'postos_administrativos': ['Chibuto', 'Chaimite', 'Changanine'],
                    'bairros': []
                },
                {
                    'name': 'Chicualacuala',
                    'postos_administrativos': ['Chicualacuala', 'Mapai'],
                    'bairros': []
                },
                {
                    'name': 'Chigubo',
                    'postos_administrativos': ['Chigubo', 'Ndindiza'],
                    'bairros': []
                },
                {
                    'name': 'Chókwè',
                    'postos_administrativos': ['Chókwè', 'Lionde', 'Macarretane'],
                    'bairros': []
                },
                {
                    'name': 'Chonguene',
                    'postos_administrativos': ['Chonguene', 'Chongoene'],
                    'bairros': []
                },
                {
                    'name': 'Guijá',
                    'postos_administrativos': ['Canicado', 'Chivonguene'],
                    'bairros': []
                },
                {
                    'name': 'Limpopo',
                    'postos_administrativos': ['Chicumbane', 'Zongoene'],
                    'bairros': []
                },
                {
                    'name': 'Mabalane',
                    'postos_administrativos': ['Mabalane', 'Combomune'],
                    'bairros': []
                },
                {
                    'name': 'Manjacaze',
                    'postos_administrativos': ['Manjacaze', 'Chidenguele'],
                    'bairros': []
                },
                {
                    'name': 'Mapai',
                    'postos_administrativos': ['Mapai', 'Machaila'],
                    'bairros': []
                },
                {
                    'name': 'Massangena',
                    'postos_administrativos': ['Massangena', 'Mavue'],
                    'bairros': []
                },
                {
                    'name': 'Massingir',
                    'postos_administrativos': ['Massingir', 'Zulo'],
                    'bairros': []
                },
                {
                    'name': 'Xai-Xai (Cidade)',
                    'postos_administrativos': ['Xai-Xai'],
                    'bairros': ['Central', 'Alto-Gaza', 'Inhamissa', 'Panjane', 'Chicumbane', 'Patrice Lumumba']
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
                    'postos_administrativos': ['Boane', 'Matola-Rio'],
                    'bairros': ['Bairro Central', 'Campinho', 'Massaca']
                },
                {
                    'name': 'Magude',
                    'postos_administrativos': ['Magude', 'Mapulanguene', 'Motaze'],
                    'bairros': []
                },
                {
                    'name': 'Manhiça',
                    'postos_administrativos': ['Manhiça', 'Xinavane', '3 de Fevereiro'],
                    'bairros': []
                },
                {
                    'name': 'Marracuene',
                    'postos_administrativos': ['Marracuene', 'Machubo'],
                    'bairros': ['Aliança', 'Cumbe', 'Habel Jafar']
                },
                {
                    'name': 'Matola (Cidade)',
                    'postos_administrativos': ['Matola', 'Infulene', 'Machava'],
                    'bairros': ['Matola Sede', 'Fomento', 'Liberdade', 'T3', 'Trevo', 'Machava Socimol', 'Cingatela']
                },
                {
                    'name': 'Matutuíne',
                    'postos_administrativos': ['Bela Vista', 'Catembe', 'Zitundo'],
                    'bairros': []
                },
                {
                    'name': 'Moamba',
                    'postos_administrativos': ['Moamba', 'Ressano Garcia', 'Pessene'],
                    'bairros': []
                },
                {
                    'name': 'Namaacha',
                    'postos_administrativos': ['Namaacha', 'Changalane'],
                    'bairros': []
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
                    'postos_administrativos': ['KaMpfumo'],
                    'bairros': [
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
                    'postos_administrativos': ['Nlhamankulu'],
                    'bairros': ['Aeroporto A/B', 'Chamanculo A/B/C/D', 'Malanga', 'Xipamanine', 'Munhuana', 'Unidade 7']
                },
                {
                    'name': 'KaMaxaquene',
                    'postos_administrativos': ['KaMaxaquene'],
                    'bairros': ['Maxaquene A/B/C/D', 'Polana Caniço A/B', 'Urbanização', 'Mafalala']
                },
                {
                    'name': 'KaMavota',
                    'postos_administrativos': ['KaMavota'],
                    'bairros': ['Mavalane A/B', 'FPLM', 'Hulene A/B', 'Ferroviário', 'Costa do Sol', 'Polana Caniço B']
                },
                {
                    'name': 'KaMubukwana',
                    'postos_administrativos': ['KaMubukwana'],
                    'bairros': ['Bagamoyo', 'George Dimitrov', 'Inhagoia A/B', 'Magoanine A/B/C', 'Zimpeto']
                },
                {
                    'name': 'KaTembe',
                    'postos_administrativos': ['KaTembe'],
                    'bairros': ['Gwaza Muthini', 'Incassane', 'Inguide', 'Chali', 'Chamissava']
                },
                {
                    'name': 'KaNyaka',
                    'postos_administrativos': ['KaNyaka'],
                    'bairros': ['Ribzene', 'Nghanyane', 'Chadwane']
                }
            ]
        }
    ]

def get_districts_by_province(province_id: str) -> List[str]:
    """Retorna a lista de distritos pertencentes a uma determinada província."""
    clean_id = province_id.strip().lower()
    for province in get_mozambique_provinces():
        if province['id'] == clean_id:
            return [d['name'] for d in province['districts']]
    raise ValueError(f"Província inválida: {province_id}")

def get_all_districts() -> List[Dict[str, Any]]:
    """Retorna uma lista plana com todos os 161 distritos e respetivos IDs de província."""
    flat_list = []
    for province in get_mozambique_provinces():
        p_id = province['id']
        for district in province['districts']:
            flat_list.append({
                'name': district['name'],
                'provinceId': p_id,
                'postos_administrativos': district['postos_administrativos'],
                'bairros': district['bairros']
            })
    return flat_list
