"""
Testes unitários do módulo bancário de Moçambique (NIB & IBAN) em Python.
"""

import pytest
from moz_utils.bank import (
    MOZAMBIQUE_BANKS,
    is_valid_nib,
    format_nib,
    get_bank_by_nib,
    nib_to_iban,
    is_valid_iban,
)


def create_valid_nib(bank_code: str, branch: str = "0000", account: str = "00000000000") -> str:
    """Gera um NIB matematicamente válido conforme ISO 7064 Módulo 97-10."""
    first19 = f"{bank_code.zfill(4)}{branch.zfill(4)}{account.zfill(11)}"
    num19 = int(first19)
    remainder = (num19 * 100) % 97
    check = 98 - remainder
    return f"{first19}{str(check).zfill(2)}"


class TestMozambiqueBanking:
    """Suíte de testes para catálogo de bancos, NIB e IBAN."""

    def test_mozambique_banks_catalog_size_and_keys(self):
        """Verifica se o catálogo unificado contém 22 instituições oficiais."""
        assert len(MOZAMBIQUE_BANKS) == 22
        assert "0001" in MOZAMBIQUE_BANKS
        assert "0006" in MOZAMBIQUE_BANKS
        assert "0008" in MOZAMBIQUE_BANKS
        assert "0016" in MOZAMBIQUE_BANKS
        assert "0034" in MOZAMBIQUE_BANKS
        assert "0041" in MOZAMBIQUE_BANKS
        assert "0043" in MOZAMBIQUE_BANKS
        assert "0056" in MOZAMBIQUE_BANKS
        assert "0057" in MOZAMBIQUE_BANKS

    def test_bank_names_and_short_names(self):
        """Valida que tanto short_name quanto shortName estão presentes e corretos."""
        bim = MOZAMBIQUE_BANKS["0001"]
        assert bim["short_name"] == "Millennium BIM"
        assert bim["shortName"] == "Millennium BIM"

        absa = MOZAMBIQUE_BANKS["0006"]
        assert absa["short_name"] == "Absa"
        assert absa["name"] == "Absa Bank Moçambique"

        bci = MOZAMBIQUE_BANKS["0008"]
        assert bci["short_name"] == "BCI"

    def test_valid_nib_iso7064_modulo_97_10(self):
        """Testa validação de NIBs legítimos calculados por Módulo 97-10."""
        nib_bim = create_valid_nib("0001", "0000", "00123456789")
        nib_bci = create_valid_nib("0008", "0100", "00987654321")
        assert is_valid_nib(nib_bim) is True
        assert is_valid_nib(nib_bci) is True

    def test_parity_bm_and_simo_codes(self):
        """Garante suporte e aceitação de códigos de registro BM e compensação SIMO."""
        # Moza Banco: BM (0016) e SIMO (0034)
        nib_moza_bm = create_valid_nib("0016", "0002", "00555666777")
        nib_moza_simo = create_valid_nib("0034", "0002", "00555666777")
        assert is_valid_nib(nib_moza_bm) is True
        assert is_valid_nib(nib_moza_simo) is True

        bank_moza_bm = get_bank_by_nib(nib_moza_bm)
        bank_moza_simo = get_bank_by_nib(nib_moza_simo)
        assert bank_moza_bm is not None and bank_moza_bm["short_name"] == "Moza Banco"
        assert bank_moza_simo is not None and bank_moza_simo["short_name"] == "Moza Banco"

        # Absa (0006)
        nib_absa = create_valid_nib("0006", "0005", "00999888777")
        assert is_valid_nib(nib_absa) is True
        bank_absa = get_bank_by_nib(nib_absa)
        assert bank_absa is not None and bank_absa["short_name"] == "Absa"

        # Letshego: BM (0041) e SIMO (0056)
        nib_letshego_bm = create_valid_nib("0041", "0001", "00123456789")
        nib_letshego_simo = create_valid_nib("0056", "0001", "00123456789")
        assert is_valid_nib(nib_letshego_bm) is True
        assert is_valid_nib(nib_letshego_simo) is True

        # First Capital Bank: BM (0038) e SIMO (0043)
        nib_fcb_bm = create_valid_nib("0038", "0001", "00123456789")
        nib_fcb_simo = create_valid_nib("0043", "0001", "00123456789")
        assert is_valid_nib(nib_fcb_bm) is True
        assert is_valid_nib(nib_fcb_simo) is True

        # BNI: BM (0025) e SIMO (0057)
        nib_bni_bm = create_valid_nib("0025", "0001", "00123456789")
        nib_bni_simo = create_valid_nib("0057", "0001", "00123456789")
        assert is_valid_nib(nib_bni_bm) is True
        assert is_valid_nib(nib_bni_simo) is True

    def test_invalid_nibs(self):
        """Valida que NIBs com erros, códigos desconhecidos ou checksums adulterados falham."""
        nib_bim = create_valid_nib("0001", "0000", "00123456789")

        # Checksum adulterado
        last2 = nib_bim[-2:]
        corrupt_last2 = "01" if last2 != "01" else "02"
        corrupt_nib = nib_bim[:-2] + corrupt_last2
        assert is_valid_nib(corrupt_nib) is False

        # Banco inexistente
        fake_nib = create_valid_nib("9999", "0000", "00123456789")
        assert is_valid_nib(fake_nib) is False

        # Comprimento inválido
        assert is_valid_nib("00010000123456789") is False
        assert is_valid_nib("00010000123456789012345") is False
        assert is_valid_nib("abc") is False

    def test_format_nib(self):
        """Testa formatação pontuada do NIB BBBB.AAAA.CCCCCCCCCCC.KK."""
        nib_bim = create_valid_nib("0001", "0000", "00123456789")
        formatted = format_nib(nib_bim)
        assert formatted.startswith("0001.0000.")
        assert len(formatted.split(".")) == 4

        with pytest.raises(ValueError):
            format_nib("000000000000000000000")

    def test_get_bank_by_nib_invalid(self):
        """Testa retorno None para bancos desconhecidos ou NIBs curtos."""
        assert get_bank_by_nib("999900001234567890123") is None
        assert get_bank_by_nib("12") is None

    def test_nib_to_iban_and_is_valid_iban(self):
        """Testa conversão para IBAN moçambicano e validação."""
        nib_bim = create_valid_nib("0001", "0000", "00123456789")
        iban = nib_to_iban(nib_bim)
        assert iban == f"MZ59{nib_bim}"
        assert len(iban) == 25
        assert is_valid_iban(iban) is True
        assert is_valid_iban(f"  {iban}  ") is True
        assert is_valid_iban(iban.lower()) is True

        # Inválidos
        assert is_valid_iban(f"PT50{nib_bim}") is False
        assert is_valid_iban(f"MZ58{nib_bim}") is False
        assert is_valid_iban("MZ590001000012345") is False

        with pytest.raises(ValueError):
            nib_to_iban("000000000000000000000")
