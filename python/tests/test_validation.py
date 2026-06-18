import pytest
from moz_utils import (
    is_valid_nuit,
    get_nuit_entity_type,
    is_valid_mozambican_phone,
    get_mobile_operator,
    is_valid_bi,
    format_mzn,
    get_districts_by_province,
    get_all_districts,
    is_valid_postal_code,
    get_postal_code_locality,
    get_postal_code_province,
    is_valid_dire,
    is_valid_driving_license
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
