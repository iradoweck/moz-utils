package com.edmilsonmuacigarro.mozutils

import kotlin.test.*

class MozUtilsTest {

    private fun generateValidNUIT(first8: String): String {
        val weights = intArrayOf(8, 9, 4, 5, 6, 7, 8, 9)
        var sum = 0
        for (i in 0 until 8) {
            sum += Character.getNumericValue(first8[i]) * weights[i]
        }
        val remainder = sum % 11
        val expectedDigit = "01234567891"[remainder]
        return first8 + expectedDigit
    }

    private fun generateValidNIB(bankCode: String, branch: String, account: String): String {
        val first19 = bankCode.padStart(4, '0') + branch.padStart(4, '0') + account.padStart(11, '0')
        val bigNum = java.math.BigInteger(first19 + "00")
        val remainder = bigNum.remainder(java.math.BigInteger.valueOf(97)).toInt()
        val check = 98 - remainder
        val checkDigits = if (check < 10) "0$check" else "$check"
        return first19 + checkDigits
    }

    @Test
    fun testNuitValidacao() {
        val nuitSingular = generateValidNUIT("10000000")
        val nuitSingular2 = generateValidNUIT("20000000")
        val nuitSingular3 = generateValidNUIT("30000000")
        val nuitCollective = generateValidNUIT("40000000")
        val nuitCollective2 = generateValidNUIT("50000000")
        val nuitEquiparada = generateValidNUIT("60000000")
        val nuitPublico = generateValidNUIT("70000000")
        val nuitOutras = generateValidNUIT("80000000")
        val nuitEstrangeiras = generateValidNUIT("90000000")

        assertTrue(MozUtils.isValidNUIT(nuitSingular), "Valid Singular NUIT (1)")
        assertTrue(MozUtils.isValidNUIT(nuitSingular2), "Valid Singular NUIT (2)")
        assertTrue(MozUtils.isValidNUIT(nuitSingular3), "Valid Singular NUIT (3)")
        assertTrue(MozUtils.isValidNUIT(nuitCollective), "Valid Collective NUIT (4)")
        assertTrue(MozUtils.isValidNUIT(nuitCollective2), "Valid Collective NUIT (5)")
        assertTrue(MozUtils.isValidNUIT(nuitEquiparada), "Valid Equiparada NUIT (6)")
        assertTrue(MozUtils.isValidNUIT(nuitPublico), "Valid Public NUIT (7)")
        assertTrue(MozUtils.isValidNUIT(nuitOutras), "Valid Outras Entidades NUIT (8)")
        assertTrue(MozUtils.isValidNUIT(nuitEstrangeiras), "Valid Entidades Estrangeiras NUIT (9)")

        assertFalse(MozUtils.isValidNUIT("012345678"), "NUIT that starts with 0 → invalid")
        assertFalse(MozUtils.isValidNUIT("1234"), "NUIT with less than 9 digits → invalid")
        assertFalse(MozUtils.isValidNUIT("1234567890"), "NUIT with more than 9 digits → invalid")
        assertFalse(MozUtils.isValidNUIT("111111111"), "NUIT with repeated digits → invalid")
        assertFalse(MozUtils.isValidNUIT(nuitSingular.substring(0, 8) + "9"), "NUIT with wrong control digit")
    }

    @Test
    fun testNuitClassificacao() {
        val n1 = generateValidNUIT("10000000")
        val n2 = generateValidNUIT("20000000")
        val n3 = generateValidNUIT("30000000")
        val n4 = generateValidNUIT("40000000")
        val n5 = generateValidNUIT("50000000")
        val n6 = generateValidNUIT("60000000")
        val n7 = generateValidNUIT("70000000")
        val n8 = generateValidNUIT("80000000")
        val n9 = generateValidNUIT("90000000")

        assertEquals("Pessoas Singulares", MozUtils.getNUITEntityType(n1))
        assertEquals("Pessoas Singulares", MozUtils.getNUITEntityType(n2))
        assertEquals("Pessoas Singulares", MozUtils.getNUITEntityType(n3))
        assertEquals("Pessoas Colectivas", MozUtils.getNUITEntityType(n4))
        assertEquals("Pessoas Colectivas", MozUtils.getNUITEntityType(n5))
        assertEquals("Entidades Equiparadas", MozUtils.getNUITEntityType(n6))
        assertEquals("Estado / Públicas", MozUtils.getNUITEntityType(n7))
        assertEquals("Outras Entidades", MozUtils.getNUITEntityType(n8))
        assertEquals("Entidades Estrangeiras", MozUtils.getNUITEntityType(n9))
        assertNull(MozUtils.getNUITEntityType("000000000"))
        assertNull(MozUtils.getNUITEntityType("invalido"))
    }

    @Test
    fun testTelefones() {
        assertTrue(MozUtils.isValidMozambicanPhone("841234567"))
        assertTrue(MozUtils.isValidMozambicanPhone("851234567"))
        assertTrue(MozUtils.isValidMozambicanPhone("821234567"))
        assertTrue(MozUtils.isValidMozambicanPhone("831234567"))
        assertTrue(MozUtils.isValidMozambicanPhone("861234567"))
        assertTrue(MozUtils.isValidMozambicanPhone("871234567"))
        assertTrue(MozUtils.isValidMozambicanPhone("881234567"))

        assertFalse(MozUtils.isValidMozambicanPhone("811234567"))
        assertFalse(MozUtils.isValidMozambicanPhone("891234567"))
        assertFalse(MozUtils.isValidMozambicanPhone("801234567"))
        assertFalse(MozUtils.isValidMozambicanPhone("911234567"))

        assertTrue(MozUtils.isValidMozambicanPhone("+258 84 123 4567"))
        assertTrue(MozUtils.isValidMozambicanPhone("+258841234567"))
        assertTrue(MozUtils.isValidMozambicanPhone("84 123 4567"))

        // formatMozambicanPhone
        assertEquals("+258 84 123 4567", MozUtils.formatMozambicanPhone("841234567"))
        assertEquals("+258 84 123 4567", MozUtils.formatMozambicanPhone("+258841234567"))
        assertFailsWith<IllegalArgumentException> {
            MozUtils.formatMozambicanPhone("912345678")
        }

        // buildWhatsAppUrl
        assertEquals("https://wa.me/258841234567", MozUtils.buildWhatsAppUrl("841234567"))
        assertTrue(MozUtils.buildWhatsAppUrl("841234567", "Olá").contains("text="))
    }

    @Test
    fun testOperadorasECarteiras() {
        assertEquals("Vodacom", MozUtils.getMobileOperator("841234567"))
        assertEquals("Vodacom", MozUtils.getMobileOperator("851234567"))
        assertEquals("Tmcel", MozUtils.getMobileOperator("821234567"))
        assertEquals("Tmcel", MozUtils.getMobileOperator("831234567"))
        assertEquals("Movitel", MozUtils.getMobileOperator("861234567"))
        assertEquals("Movitel", MozUtils.getMobileOperator("871234567"))
        assertEquals("Movitel", MozUtils.getMobileOperator("881234567"))
        assertNull(MozUtils.getMobileOperator("911234567"))

        // getMobileWallet
        assertEquals("M-Pesa", MozUtils.getMobileWallet("841234567"))
        assertEquals("M-Pesa", MozUtils.getMobileWallet("851234567"))
        assertEquals("mKesh", MozUtils.getMobileWallet("821234567"))
        assertEquals("mKesh", MozUtils.getMobileWallet("831234567"))
        assertEquals("e-Mola", MozUtils.getMobileWallet("861234567"))
        assertEquals("e-Mola", MozUtils.getMobileWallet("871234567"))
        assertNull(MozUtils.getMobileWallet("911234567"))
    }

    @Test
    fun testBI() {
        assertTrue(MozUtils.isValidBI("110101234567A"))
        assertTrue(MozUtils.isValidBI("110101234567 A"))
        assertTrue(MozUtils.isValidBI("110101234567a"))
        assertFalse(MozUtils.isValidBI("1101012345670"))
        assertFalse(MozUtils.isValidBI("11010123456A"))
    }

    @Test
    fun testPassaporte() {
        assertTrue(MozUtils.isValidPassport("AO1234567"))
        assertTrue(MozUtils.isValidPassport("ao1234567"))
        assertTrue(MozUtils.isValidPassport("AB1234567"))
        assertFalse(MozUtils.isValidPassport("A1234567")) // 1 letra
        assertFalse(MozUtils.isValidPassport("AB123456")) // 6 dígitos
        assertFalse(MozUtils.isValidPassport("AB12345678")) // 8 dígitos
        assertFalse(MozUtils.isValidPassport("123456"))
    }

    @Test
    fun testFormatMZN() {
        assertEquals("1 500,00 MT", MozUtils.formatMZN(1500.0))
        assertEquals("0,50 MT", MozUtils.formatMZN(0.5))
        assertEquals("1 000 000,00 MT", MozUtils.formatMZN(1000000.0))
        assertEquals("99,99 MT", MozUtils.formatMZN(99.99))
        assertEquals("0,00 MT", MozUtils.formatMZN(0.0))
        assertEquals("999,00 MT", MozUtils.formatMZN(999.0))
        assertEquals("1 000,00 MT", MozUtils.formatMZN(1000.0))
        assertEquals("-500,00 MT", MozUtils.formatMZN(-500.0))
        assertEquals("-1 500,00 MT", MozUtils.formatMZN(-1500.0))
        assertEquals("1 500,00 MZN", MozUtils.formatMZN(1500.0, "MZN"))
        assertEquals("50 000,00 MZN", MozUtils.formatMZN(50000.0, "MZN"))

        // parseMZN
        assertEquals(1500.0, MozUtils.parseMZN("1 500,00 MT"))
        assertEquals(1500.0, MozUtils.parseMZN("1500"))
        assertEquals(0.5, MozUtils.parseMZN("0,50"))
        assertNull(MozUtils.parseMZN(""))
        assertNull(MozUtils.parseMZN("-"))
    }

    @Test
    fun testDistritosEFlexibilizacao() {
        // ID
        assertEquals(17, MozUtils.getDistrictsByProvince("cab").size)
        assertEquals("Ancuabe", MozUtils.getDistrictsByProvince("cab")[0])
        assertEquals(17, MozUtils.getDistrictsByProvince("CaB").size)
        assertEquals(7, MozUtils.getDistrictsByProvince("mpc").size)

        // Sigla
        assertEquals(17, MozUtils.getDistrictsByProvince("CBD").size)
        assertEquals(7, MozUtils.getDistrictsByProvince("MC").size)
        assertEquals(8, MozUtils.getDistrictsByProvince("MPT").size)

        // Nome por extenso
        assertEquals(17, MozUtils.getDistrictsByProvince("Cabo Delgado").size)
        assertEquals(17, MozUtils.getDistrictsByProvince("cabo delgado").size)
        assertEquals(23, MozUtils.getDistrictsByProvince("Nampula").size)
        assertEquals(8, MozUtils.getDistrictsByProvince("Maputo").size)
        assertEquals(8, MozUtils.getDistrictsByProvince("Maputo Província").size)
        assertEquals(7, MozUtils.getDistrictsByProvince("Maputo Cidade").size)

        assertFailsWith<IllegalArgumentException> {
            MozUtils.getDistrictsByProvince("xyz")
        }

        val all = MozUtils.getAllDistricts()
        assertEquals(161, all.size)
        assertEquals("Ancuabe", all[0].name)
        assertEquals("cab", all[0].provinceId)

        val provinces = MozUtils.getMozambiqueProvinces()
        assertEquals(11, provinces.size)
    }

    @Test
    fun testPostalCodesECEP() {
        assertTrue(MozUtils.isValidPostalCode("1100"))
        assertTrue(MozUtils.isValidPostalCode(" 1101 "))
        assertTrue(MozUtils.isValidPostalCode("11-02"))
        assertTrue(MozUtils.isValidPostalCode("1202"))
        assertTrue(MozUtils.isValidPostalCode("3311"))

        assertFalse(MozUtils.isValidPostalCode("1199"))
        assertFalse(MozUtils.isValidPostalCode("11000"))
        assertFalse(MozUtils.isValidPostalCode("110"))
        assertFalse(MozUtils.isValidPostalCode("ABCD"))

        assertEquals("Maputo ECP (Sede)", MozUtils.getPostalCodeLocality("1100"))
        assertEquals("Chilembene / Magoanine", MozUtils.getPostalCodeLocality("1205"))
        assertEquals("Maputo", MozUtils.getPostalCodeProvince("1100"))
        assertEquals("Sofala", MozUtils.getPostalCodeProvince("2100"))
        assertEquals("Niassa", MozUtils.getPostalCodeProvince("3311"))
        assertNull(MozUtils.getPostalCodeLocality("9999"))
        assertNull(MozUtils.getPostalCodeProvince("9999"))

        // Novo CEP
        assertTrue(MozUtils.isValidNewCEP("1101-01"))
        assertTrue(MozUtils.isValidNewCEP("0909-01"))
        assertFalse(MozUtils.isValidNewCEP("110101"))
        assertFalse(MozUtils.isValidNewCEP("110-01"))

        // suggestCEPs
        val resultsLegacy = MozUtils.suggestCEPs("1100")
        assertTrue(resultsLegacy.isNotEmpty(), "Suggest from legacy 1100 should return new CEPs")
        val resultsDirect = MozUtils.suggestCEPs("1101-01")
        assertTrue(resultsDirect.isNotEmpty(), "Suggest from direct CEP")
        val resultsLocality = MozUtils.suggestCEPs("Namutequeliua")
        assertTrue(resultsLocality.isNotEmpty(), "Suggest from locality name")
        assertTrue(MozUtils.suggestCEPs("").isEmpty())
    }

    @Test
    fun testDIRE() {
        assertTrue(MozUtils.isValidDIRE("00008312C"))
        assertTrue(MozUtils.isValidDIRE("12C00008312C"))
        assertTrue(MozUtils.isValidDIRE("120345678A"))
        assertFalse(MozUtils.isValidDIRE("0000831C"))
        assertFalse(MozUtils.isValidDIRE("A0008312C"))
    }

    @Test
    fun testDrivingLicense() {
        assertTrue(MozUtils.isValidDrivingLicense("M123456"))
        assertTrue(MozUtils.isValidDrivingLicense("MP1234567"))
        assertTrue(MozUtils.isValidDrivingLicense("m-123456"))
        assertTrue(MozUtils.isValidDrivingLicense("mp-1234567"))
        assertFalse(MozUtils.isValidDrivingLicense("123456"))
        assertFalse(MozUtils.isValidDrivingLicense("MMM1234567"))
    }

    @Test
    fun testSanitizacao() {
        assertTrue(MozUtils.isValidName("Edmilson Muacigarro"))
        assertTrue(MozUtils.isValidName("João O'Brian"))
        assertTrue(MozUtils.isValidName("Jean-Pierre"))
        assertFalse(MozUtils.isValidName("ABC123"))

        assertEquals("Maria Manuela da Silva e Costa", MozUtils.sanitizeName("MARIA MANUELA DA SILVA E COSTA"))
        assertEquals("Maria da Silva e Sousa", MozUtils.sanitizeName("maria da silva e sousa"))
        assertEquals("Jean-Pierre Dupont", MozUtils.sanitizeName("jean-pierre dupont"))
        assertEquals("Edmilson Muacigarro", MozUtils.sanitizeName("  edmilson   muacigarro  "))
        assertEquals("EDMILSON MUACIGARRO", MozUtils.sanitizeName("edmilson muacigarro", allCaps = true))
        assertEquals("", MozUtils.sanitizeName(""))

        assertEquals("123456789", MozUtils.sanitizeDocumentField("123 456-789"))
        assertEquals("110101234567A", MozUtils.sanitizeAlphanumericField("110 101 234567a"))
    }

    @Test
    fun testModuloBancario() {
        // Catálogo de Bancos (22 instituições BM e SIMO)
        assertEquals(22, MozUtils.BANKS.size)
        assertTrue(MozUtils.BANKS.any { it["code"] == "0001" && it["shortName"] == "Millennium BIM" })
        assertTrue(MozUtils.BANKS.any { it["code"] == "0006" && it["shortName"] == "Absa" })
        assertTrue(MozUtils.BANKS.any { it["code"] == "0008" && it["shortName"] == "BCI" })
        assertTrue(MozUtils.BANKS.any { it["code"] == "0003" && it["shortName"] == "Standard Bank" })
        assertTrue(MozUtils.BANKS.any { it["code"] == "0016" && it["shortName"] == "Moza Banco" })
        assertTrue(MozUtils.BANKS.any { it["code"] == "0034" && it["shortName"] == "Moza Banco" })
        assertTrue(MozUtils.BANKS.any { it["code"] == "0041" && it["shortName"] == "Letshego" })
        assertTrue(MozUtils.BANKS.any { it["code"] == "0056" && it["shortName"] == "Letshego" })

        // Geração e validação de NIB genuíno
        val nibBim = generateValidNIB("0001", "0000", "00123456789")
        assertEquals(21, nibBim.length)
        assertTrue(MozUtils.isValidNIB(nibBim), "Valid NIB for Millennium BIM")

        val nibBci = generateValidNIB("0008", "0001", "00987654321")
        assertEquals(21, nibBci.length)
        assertTrue(MozUtils.isValidNIB(nibBci), "Valid NIB for BCI")

        // Validação de paridade BM e SIMO (Moza 0016 e 0034, Absa 0006 e Letshego 0041/0056)
        val nibMozaBM = generateValidNIB("0016", "0002", "00555666777")
        val nibMozaSIMO = generateValidNIB("0034", "0002", "00555666777")
        assertTrue(MozUtils.isValidNIB(nibMozaBM), "Valid NIB for Moza Banco (BM 0016)")
        assertTrue(MozUtils.isValidNIB(nibMozaSIMO), "Valid NIB for Moza Banco (SIMO 0034)")

        val nibAbsaBM = generateValidNIB("0006", "0005", "00999888777")
        val nibLetshegoBM = generateValidNIB("0041", "0001", "00123456789")
        val nibLetshegoSIMO = generateValidNIB("0056", "0001", "00123456789")
        assertTrue(MozUtils.isValidNIB(nibAbsaBM), "Valid NIB for Absa (BM 0006)")
        assertTrue(MozUtils.isValidNIB(nibLetshegoBM), "Valid NIB for Letshego (BM 0041)")
        assertTrue(MozUtils.isValidNIB(nibLetshegoSIMO), "Valid NIB for Letshego (SIMO 0056)")

        // Validação de paridade: First Capital Bank (0038 e 0043), BNI (0025 e 0057)
        val nibFcbBM = generateValidNIB("0038", "0001", "00123456789")
        val nibFcbSIMO = generateValidNIB("0043", "0001", "00123456789")
        val nibBniBM = generateValidNIB("0025", "0001", "00123456789")
        val nibBniSIMO = generateValidNIB("0057", "0001", "00123456789")
        assertTrue(MozUtils.isValidNIB(nibFcbBM), "Valid NIB for FCB (BM 0038)")
        assertTrue(MozUtils.isValidNIB(nibFcbSIMO), "Valid NIB for FCB (SIMO 0043)")
        assertTrue(MozUtils.isValidNIB(nibBniBM), "Valid NIB for BNI (BM 0025)")
        assertTrue(MozUtils.isValidNIB(nibBniSIMO), "Valid NIB for BNI (SIMO 0057)")

        // NIB inválido: banco inexistente (ex: 9999)
        val nibInexistente = generateValidNIB("9999", "0000", "00123456789")
        assertFalse(MozUtils.isValidNIB(nibInexistente), "Invalid NIB with unknown bank code")

        // NIB inválido: dígito de controlo corrompido
        val nibCorrompido = nibBim.substring(0, 20) + (if (nibBim.last() == '0') '1' else '0')
        assertFalse(MozUtils.isValidNIB(nibCorrompido), "NIB with corrupted check digit")
        assertFalse(MozUtils.isValidNIB("1234"), "NIB too short")

        // Formatação de NIB
        val formatted = MozUtils.formatNIB(nibBim)
        assertEquals(4, formatted.split(" ").size)
        assertEquals("0001", formatted.split(" ")[0])
        assertFailsWith<IllegalArgumentException> {
            MozUtils.formatNIB("000000000000000000000")
        }

        // getBankByNIB
        val bankInfo = MozUtils.getBankByNIB(nibBim)
        assertNotNull(bankInfo)
        assertEquals("0001", bankInfo["code"])
        assertEquals("Millennium BIM", bankInfo["shortName"])
        assertNull(MozUtils.getBankByNIB("999900000000000000000"))
        assertNull(MozUtils.getBankByNIB("12"))

        // nibToIBAN e isValidIBAN
        val ibanBim = MozUtils.nibToIBAN(nibBim)
        assertEquals("MZ59$nibBim", ibanBim)
        assertEquals(25, ibanBim.length)
        assertTrue(MozUtils.isValidIBAN(ibanBim), "Valid IBAN")
        assertTrue(MozUtils.isValidIBAN("MZ59 $nibBim"), "Valid IBAN with spaces")

        assertFalse(MozUtils.isValidIBAN("PT50$nibBim"), "IBAN with wrong country prefix")
        assertFalse(MozUtils.isValidIBAN("MZ591234"), "IBAN too short")
        assertFailsWith<IllegalArgumentException> {
            MozUtils.nibToIBAN("000000000000000000000")
        }
    }
}
