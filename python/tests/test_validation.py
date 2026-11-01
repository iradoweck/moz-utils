import pytest
import moz_utils
from moz_utils import (
    is_valid_nuit,
    get_nuit_entity_type,
    is_valid_mozambican_phone,
    format_mozambican_phone,
    get_mobile_operator,
    get_mobile_wallet,
    build_whatsapp_url,
    is_valid_bi,
    format_mzn,
    parse_mzn,
    MOZAMBIQUE_PROVINCES,
    get_mozambique_provinces,
    get_districts_by_province,
    get_all_districts,
    is_valid_name,
    sanitize_name,
    sanitize_document_field,
    sanitize_alphanumeric_field,
    is_valid_postal_code,
    get_postal_code_locality,
    get_postal_code_province,
    is_valid_dire,
    is_valid_passport,
    is_valid_driving_license,
    is_valid_new_cep,
    suggest_ceps,
    MOZAMBIQUE_BANKS,
    is_valid_nib,
    format_nib,
    get_bank_by_nib,
    nib_to_iban,
    is_valid_iban,
)


def generate_valid_nuit(first8: str) -> str:
    weights = [8, 9, 4, 5, 6, 7, 8, 9]
    s = sum(int(first8[i]) * weights[i] for i in range(8))
    remainder = s % 11
    check_map = "01234567891"
    return first8 + check_map[remainder]

@pytest.fixture
def nuits():
    return {
        'singular': generate_valid_nuit('10000000'),
        'singular2': generate_valid_nuit('20000000'),
        'equiparada': generate_valid_nuit('30000000'),
        'colectiva': generate_valid_nuit('40000000'),
        'publico': generate_valid_nuit('50000000')
    }

def test_nuit_validation(nuits):
    assert is_valid_nuit(nuits['singular'])
    assert is_valid_nuit(nuits['singular2'])
    assert is_valid_nuit(nuits['equiparada'])
    assert is_valid_nuit(nuits['colectiva'])
    assert is_valid_nuit(nuits['publico'])
    
    assert not is_valid_nuit('012345678')
    assert not is_valid_nuit('1234')
    assert not is_valid_nuit('1234567890')
    assert not is_valid_nuit('111111111')
    assert not is_valid_nuit(nuits['singular'][:-1] + '9')

def test_nuit_classification(nuits):
    assert get_nuit_entity_type(nuits['singular']) == 'Pessoas Singulares'
    assert get_nuit_entity_type(nuits['singular2']) == 'Pessoas Singulares'
    assert get_nuit_entity_type(nuits['equiparada']) == 'Pessoas Singulares'
    assert get_nuit_entity_type(nuits['colectiva']) == 'Pessoas Colectivas'
    assert get_nuit_entity_type(nuits['publico']) == 'Pessoas Colectivas'
    assert get_nuit_entity_type(generate_valid_nuit('60000000')) == 'Entidades Equiparadas'
    assert get_nuit_entity_type(generate_valid_nuit('70000000')) == 'Estado / Públicas'
    assert get_nuit_entity_type(generate_valid_nuit('80000000')) == 'Outras Entidades'
    assert get_nuit_entity_type(generate_valid_nuit('90000000')) == 'Entidades Estrangeiras'
    assert get_nuit_entity_type('000000000') is None

def test_phone_validation():
    assert is_valid_mozambican_phone('841234567')
    assert is_valid_mozambican_phone('851234567')
    assert is_valid_mozambican_phone('821234567')
    assert is_valid_mozambican_phone('831234567')
    assert is_valid_mozambican_phone('861234567')
    assert is_valid_mozambican_phone('871234567')
    assert is_valid_mozambican_phone('881234567')
    
    assert not is_valid_mozambican_phone('811234567')
    assert not is_valid_mozambican_phone('891234567')
    assert not is_valid_mozambican_phone('801234567')
    assert not is_valid_mozambican_phone('911234567')
    
    assert is_valid_mozambican_phone('+258 84 123 4567')
    assert is_valid_mozambican_phone('+258841234567')
    assert is_valid_mozambican_phone('84 123 4567')

def test_operators():
    assert get_mobile_operator('841234567') == 'Vodacom'
    assert get_mobile_operator('851234567') == 'Vodacom'
    assert get_mobile_operator('821234567') == 'Tmcel'
    assert get_mobile_operator('831234567') == 'Tmcel'
    assert get_mobile_operator('861234567') == 'Movitel'
    assert get_mobile_operator('871234567') == 'Movitel'
    assert get_mobile_operator('881234567') == 'Movitel'
    assert get_mobile_operator('911234567') is None

def test_bi_validation():
    assert is_valid_bi('110101234567A')
    assert is_valid_bi('110101234567 A')
    assert is_valid_bi('110101234567a')
    assert not is_valid_bi('1101012345670')
    assert not is_valid_bi('11010123456A')

def test_currency_formatting():
    assert format_mzn(1500) == '1 500,00 MT'
    assert format_mzn(0.5) == '0,50 MT'
    assert format_mzn(1000000) == '1 000 000,00 MT'
    assert format_mzn(99.99) == '99,99 MT'
    assert format_mzn(0) == '0,00 MT'
    assert format_mzn(999) == '999,00 MT'
    assert format_mzn(1000) == '1 000,00 MT'
    assert format_mzn(-500) == '-500,00 MT'
    assert format_mzn(-1500) == '-1 500,00 MT'
    assert format_mzn(1500, 'MZN') == '1 500,00 MZN'
    assert format_mzn(50000, 'MZN') == '50 000,00 MZN'

def test_districts():
    assert len(get_districts_by_province('cab')) == 17
    assert get_districts_by_province('cab')[0] == 'Ancuabe'
    assert len(get_districts_by_province('CaB')) == 17
    assert len(get_districts_by_province('mpc')) == 7
    
    with pytest.raises(ValueError):
        get_districts_by_province('xyz')
        
    all_districts = get_all_districts()
    assert len(all_districts) == 161
    assert all_districts[0]['name'] == 'Ancuabe'
    assert all_districts[0]['provinceId'] == 'cab'
    
    assert all_districts[0]['administrative_posts'] == ['Ancuabe', 'Metoro', 'Meza']
    assert all_districts[0]['neighborhoods'] == []
    
    pemba = next(d for d in all_districts if d['name'] == 'Pemba (Cidade)')
    assert pemba['administrative_posts'] == ['Pemba']
    assert pemba['neighborhoods'] == ['Paquitequete', 'Natite', 'Cariacó', 'Alto Gingone', 'Insubria', 'Muxara', 'Maringanha', 'Chibuébue']
    
    nampula = next(d for d in all_districts if d['name'] == 'Nampula (Cidade)')
    assert 'Namutequeliua' in nampula['neighborhoods']

def test_postal_codes():
    assert is_valid_postal_code('1100')
    assert is_valid_postal_code(' 1101 ')
    assert is_valid_postal_code('11-02')
    assert is_valid_postal_code('1202')
    assert is_valid_postal_code('3311')
    
    assert not is_valid_postal_code('1199')
    assert not is_valid_postal_code('11000')
    assert not is_valid_postal_code('110')
    assert not is_valid_postal_code('ABCD')
    
    assert get_postal_code_locality('1100') == 'Maputo ECP (Sede)'
    assert get_postal_code_locality('1205') == 'Chilembene / Magoanine'
    assert get_postal_code_province('1100') == 'Maputo'
    assert get_postal_code_province('2100') == 'Sofala'
    assert get_postal_code_province('3311') == 'Niassa'
    assert get_postal_code_locality('9999') is None
    assert get_postal_code_province('9999') is None

def test_dire_validation():
    assert is_valid_dire('00008312C')
    assert is_valid_dire('12C00008312C')
    assert is_valid_dire('120345678A')
    assert not is_valid_dire('0000831C')
    assert not is_valid_dire('A0008312C')

def test_driving_license_validation():
    assert is_valid_driving_license('M123456')
    assert is_valid_driving_license('MP1234567')
    assert is_valid_driving_license('m-123456')
    assert is_valid_driving_license('mp-1234567')
    assert not is_valid_driving_license('123456')
    assert not is_valid_driving_license('MMM1234567')


def test_phone_formatting():
    assert format_mozambican_phone('841234567') == '+258 84 123 4567'
    assert format_mozambican_phone('258841234567') == '+258 84 123 4567'
    assert format_mozambican_phone('+258 84 123 4567') == '+258 84 123 4567'
    assert format_mozambican_phone('82-123-4567') == '+258 82 123 4567'

    with pytest.raises(ValueError):
        format_mozambican_phone('911234567')
    with pytest.raises(ValueError):
        format_mozambican_phone('1234')


def test_mobile_wallets():
    assert get_mobile_wallet('841234567') == 'M-Pesa'
    assert get_mobile_wallet('851234567') == 'M-Pesa'
    assert get_mobile_wallet('821234567') == 'mKesh'
    assert get_mobile_wallet('831234567') == 'mKesh'
    assert get_mobile_wallet('861234567') == 'e-Mola'
    assert get_mobile_wallet('871234567') == 'e-Mola'
    assert get_mobile_wallet('881234567') == 'e-Mola'
    assert get_mobile_wallet('911234567') is None


def test_whatsapp_url():
    url_simple = build_whatsapp_url('841234567')
    assert url_simple == 'https://wa.me/258841234567'

    url_international = build_whatsapp_url('+258 84 123 4567')
    assert url_international == 'https://wa.me/258841234567'

    url_msg = build_whatsapp_url('841234567', 'Olá, tudo bem?')
    assert url_msg == 'https://wa.me/258841234567?text=Ol%C3%A1%2C%20tudo%20bem%3F'


def test_currency_parsing():
    assert parse_mzn('1.500,00 MT') == 1500.0
    assert parse_mzn('1 500,00 MT') == 1500.0
    assert parse_mzn('250.000,50MZN') == 250000.5
    assert parse_mzn('450 MT') == 450.0
    assert parse_mzn('1,500.00') == 1500.0
    assert parse_mzn('-500,00 MT') == -500.0
    assert parse_mzn('0,00 MT') == 0.0
    assert parse_mzn('invalido') is None
    assert parse_mzn('-') is None
    assert parse_mzn('') is None


def test_passport_validation():
    assert is_valid_passport('AO1234567')
    assert is_valid_passport('ao1234567')
    assert is_valid_passport('AO-1234567')
    assert is_valid_passport('AO 1234567')
    assert not is_valid_passport('A1234567')
    assert not is_valid_passport('AOO1234567')
    assert not is_valid_passport('AO123456')
    assert not is_valid_passport('121234567')


def test_new_cep_and_suggestions():
    assert is_valid_new_cep('3100-01')
    assert is_valid_new_cep('0909-09')
    assert not is_valid_new_cep('3100')
    assert not is_valid_new_cep('3100-001')
    assert not is_valid_new_cep('ABCD-EF')

    # Sugestões
    sug_empty = suggest_ceps('')
    assert sug_empty == []

    sug_legacy = suggest_ceps('3100')
    assert len(sug_legacy) > 0
    assert all(item['cep'].startswith('0909') for item in sug_legacy)

    sug_text = suggest_ceps('Namutequeliua')
    assert len(sug_text) > 0
    assert any(item['locality'] == 'Namutequeliua' for item in sug_text)


def test_name_validation_and_sanitization():
    assert is_valid_name('Edmilson Muacigarro')
    assert is_valid_name("João O'Brian")
    assert is_valid_name('Jean-Pierre Dupont')
    assert is_valid_name('Maria da Silva')
    assert not is_valid_name('---')
    assert not is_valid_name('   ')
    assert not is_valid_name('123')
    assert not is_valid_name('A')  # Exige pelo menos 2 caracteres alfabéticos
    assert not is_valid_name('A-')

    # Sanitização preservando partículas em minúsculas
    assert sanitize_name('  edmilson   muacigarro  ') == 'Edmilson Muacigarro'
    assert sanitize_name('maria da silva e santos') == 'Maria da Silva e Santos'
    assert sanitize_name('joão de sousa') == 'João de Sousa'
    assert sanitize_name('jean-pierre dupont') == 'Jean-Pierre Dupont'
    assert sanitize_name('edmilson muacigarro', all_caps=True) == 'EDMILSON MUACIGARRO'
    assert sanitize_name('') == ''


def test_document_and_alphanumeric_sanitization():
    assert sanitize_document_field('123.456.789-0') == '1234567890'
    assert sanitize_document_field(' +258 84 123 4567 ') == '258841234567'

    assert sanitize_alphanumeric_field('110 101 234567a') == '110101234567A'
    assert sanitize_alphanumeric_field('abc-123-xyz!') == 'ABC123XYZ'


def test_provinces_and_flexible_district_search():
    assert len(MOZAMBIQUE_PROVINCES) == 11
    assert len(get_mozambique_provinces()) == 11

    # Busca por ID
    districts_cab = get_districts_by_province('cab')
    assert len(districts_cab) == 17
    assert 'Ancuabe' in districts_cab

    # Busca por Sigla
    districts_cbd = get_districts_by_province('CBD')
    assert districts_cbd == districts_cab

    # Busca por Nome com acento e sem acento
    districts_name = get_districts_by_province('Cabo Delgado')
    assert districts_name == districts_cab

    # Busca Nampula por sigla e nome
    assert get_districts_by_province('NPL') == get_districts_by_province('Nampula')
    assert get_districts_by_province('Zambézia') == get_districts_by_province('Zambezia')

    # Caso especial Maputo
    districts_mpp = get_districts_by_province('mpp')
    districts_mpc = get_districts_by_province('mpc')
    assert get_districts_by_province('Maputo') == districts_mpp
    assert get_districts_by_province('Maputo (Província)') == districts_mpp
    assert get_districts_by_province('Maputo Província') == districts_mpp
    assert get_districts_by_province('Maputo (Cidade)') == districts_mpc
    assert get_districts_by_province('Maputo Cidade') == districts_mpc
    assert get_districts_by_province('MC') == districts_mpc
    assert get_districts_by_province('MPT') == districts_mpp

    with pytest.raises(ValueError, match="Província inválida"):
        get_districts_by_province('Inexistente')


def generate_valid_nib(bank_code: str = '0001', branch: str = '0000', account: str = '12345678901') -> str:
    first19 = f"{bank_code}{branch}{account}"
    r = (int(first19) * 100) % 97
    k = 98 - r
    return f"{first19}{k:02d}"


def test_banking_module():
    assert len(MOZAMBIQUE_BANKS) == 22
    assert '0001' in MOZAMBIQUE_BANKS
    assert MOZAMBIQUE_BANKS['0001']['short_name'] == 'Millennium BIM'
    assert '0008' in MOZAMBIQUE_BANKS
    assert MOZAMBIQUE_BANKS['0008']['short_name'] == 'BCI'
    assert '0003' in MOZAMBIQUE_BANKS
    assert MOZAMBIQUE_BANKS['0003']['short_name'] == 'Standard Bank'

    # Geração e validação de NIB válido para múltiplos bancos
    valid_bim_nib = generate_valid_nib('0001', '0000', '12345678901')
    valid_bci_nib = generate_valid_nib('0008', '0123', '00001234567')
    valid_sb_nib = generate_valid_nib('0003', '9999', '11112222333')

    assert is_valid_nib(valid_bim_nib)
    assert is_valid_nib(valid_bci_nib)
    assert is_valid_nib(valid_sb_nib)
    assert is_valid_nib(f" {valid_bim_nib[:4]} {valid_bim_nib[4:8]} {valid_bim_nib[8:19]} {valid_bim_nib[19:]} ")

    # NIB com tamanho errado
    assert not is_valid_nib('0001000012345678901')  # 20 dígitos
    assert not is_valid_nib('0001000012345678901940')  # 22 dígitos
    assert not is_valid_nib('letras_e_digitos_12345')

    # NIB com banco inexistente
    fake_bank_nib = generate_valid_nib('9999', '0000', '12345678901')
    assert not is_valid_nib(fake_bank_nib)

    # NIB com dígito verificador adulterado
    tampered_k = '00' if valid_bim_nib[19:] != '00' else '01'
    assert not is_valid_nib(valid_bim_nib[:19] + tampered_k)

    # Formatação do NIB
    formatted = format_nib(valid_bim_nib)
    expected_formatted = f"{valid_bim_nib[:4]}.{valid_bim_nib[4:8]}.{valid_bim_nib[8:19]}.{valid_bim_nib[19:]}"
    assert formatted == expected_formatted

    with pytest.raises(ValueError, match="NIB moçambicano inválido"):
        format_nib('000100001234')

    # Obter dados do banco
    bank_info = get_bank_by_nib(valid_bim_nib)
    assert bank_info is not None
    assert bank_info['code'] == '0001'
    assert bank_info['short_name'] == 'Millennium BIM'
    assert get_bank_by_nib('999900001234567890100') is None
    assert get_bank_by_nib('12') is None

    # Conversão para IBAN e validação
    iban = nib_to_iban(valid_bim_nib)
    assert iban == f"MZ59{valid_bim_nib}"
    assert is_valid_iban(iban)
    assert is_valid_iban(f"  {iban}  ")
    assert is_valid_iban(f"MZ59 {valid_bim_nib[:4]} {valid_bim_nib[4:8]} {valid_bim_nib[8:19]} {valid_bim_nib[19:]}")

    # IBANs inválidos
    assert not is_valid_iban('PT50' + valid_bim_nib)
    assert not is_valid_iban('MZ59' + valid_bim_nib[:19] + tampered_k)
    assert not is_valid_iban('MZ58' + valid_bim_nib)
    assert not is_valid_iban('MZ591234')

    with pytest.raises(ValueError, match="NIB moçambicano inválido"):
        nib_to_iban('00011234')


def test_all_exports():
    assert hasattr(moz_utils, '__all__')
    for symbol in moz_utils.__all__:
        assert hasattr(moz_utils, symbol), f"Símbolo exportado em __all__ ausente: {symbol}"

