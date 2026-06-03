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
        val checkMap = "01234567891"
        return first8 + checkMap[remainder]
    }


    @Test
    fun testNuitValidacao() {
        val nuitSingular = generateValidNUIT("10000000")
        val nuitSingular2 = generateValidNUIT("20000000")
        val nuitEquivalent = generateValidNUIT("30000000")
        val nuitCollective = generateValidNUIT("40000000")
        val nuitPublico = generateValidNUIT("50000000")

        assertTrue(MozUtils.isValidNUIT(nuitSingular), "Valid Singular NUIT")
        assertTrue(MozUtils.isValidNUIT(nuitSingular2), "Valid Singular2 NUIT")
        assertTrue(MozUtils.isValidNUIT(nuitEquivalent), "Valid Equivalent NUIT")
        assertTrue(MozUtils.isValidNUIT(nuitCollective), "Valid Collective NUIT")
        assertTrue(MozUtils.isValidNUIT(nuitPublico), "Valid Public NUIT")

        assertFalse(MozUtils.isValidNUIT("012345678"), "NUIT that starts with 0 → invalid")
        assertFalse(MozUtils.isValidNUIT("612345678"), "NUIT that starts with 6 → invalid")
        assertFalse(MozUtils.isValidNUIT("912345678"), "NUIT that starts with 9 → invalid")
        assertFalse(MozUtils.isValidNUIT("1234"), "NUIT with less than 9 digits → invalid")
        assertFalse(MozUtils.isValidNUIT("1234567890"), "NUIT with more than 9 digits → invalid")
        assertFalse(MozUtils.isValidNUIT("111111111"), "NUIT with repeated digits → invalid")
        assertFalse(MozUtils.isValidNUIT(nuitSingular.substring(0, 8) + "9"), "NUIT with wrong control digit")
    }

    @Test
    fun testNuitClassificacao() {
        val nuitSingular = generateValidNUIT("10000000")
        val nuitSingular2 = generateValidNUIT("20000000")
        val nuitEquivalent = generateValidNUIT("30000000")
        val nuitCollective = generateValidNUIT("40000000")
        val nuitPublico = generateValidNUIT("50000000")

        assertEquals("Singular (Cidadãos nacionais/estrangeiros e ENI)", MozUtils.getNUITEntityType(nuitSingular))
        assertEquals("Singular (Cidadãos nacionais/estrangeiros e ENI)", MozUtils.getNUITEntityType(nuitSingular2))
        assertEquals("Equiparada (Heranças Jacentes, Consórcios)", MozUtils.getNUITEntityType(nuitEquivalent))
        assertEquals("Colectiva (Sociedades por Quotas, SA, Lda, Associações)", MozUtils.getNUITEntityType(nuitCollective))
        assertEquals("Público (Instituições do Estado e Ministérios)", MozUtils.getNUITEntityType(nuitPublico))
        assertNull(MozUtils.getNUITEntityType("000000000"))
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
    }

    @Test
    fun testOperadoras() {
        assertEquals("Vodacom", MozUtils.getMobileOperator("841234567"))
        assertEquals("Vodacom", MozUtils.getMobileOperator("851234567"))
        assertEquals("Tmcel", MozUtils.getMobileOperator("821234567"))
        assertEquals("Tmcel", MozUtils.getMobileOperator("831234567"))
        assertEquals("Movitel", MozUtils.getMobileOperator("861234567"))
        assertEquals("Movitel", MozUtils.getMobileOperator("871234567"))
        assertEquals("Movitel", MozUtils.getMobileOperator("881234567"))
        assertNull(MozUtils.getMobileOperator("911234567"))
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
    }

    @Test
    fun testDistritos() {
        assertEquals(17, MozUtils.getDistrictsByProvince("cab").size)
        assertEquals("Ancuabe", MozUtils.getDistrictsByProvince("cab")[0])
        assertEquals(17, MozUtils.getDistrictsByProvince("CaB").size)
        assertEquals(7, MozUtils.getDistrictsByProvince("mpc").size)

        assertFailsWith<IllegalArgumentException> {
            MozUtils.getDistrictsByProvince("xyz")
        }

        val all = MozUtils.getAllDistricts()
        assertEquals(161, all.size)
        assertEquals("Ancuabe", all[0].name)
        assertEquals("cab", all[0].provinceId)

        assertEquals(listOf("Ancuabe", "Metoro", "Meza"), all[0].administrative_posts)
        assertEquals(emptyList(), all[0].neighborhoods)

        val pemba = all.first { d -> d.name == "Pemba (Cidade)" }
        assertEquals(listOf("Pemba"), pemba.administrative_posts)
        assertEquals(
            listOf("Paquitequete", "Natite", "Cariacó", "Alto Gingone", "Insubria", "Muxara", "Maringanha", "Chibuébue"),
            pemba.neighborhoods
        )

        val majune = all.first { d -> d.name == "Majune" }
        assertEquals(listOf("Majune", "Mua", "Nairrobi"), majune.administrative_posts)

        val maxixe = all.first { d -> d.name == "Maxixe (Cidade)" }
        assertEquals(listOf("Bairro Central", "Chamba", "Macupula", "Nalazi"), maxixe.neighborhoods)

        val nampula = all.first { d -> d.name == "Nampula (Cidade)" }
        assertTrue(nampula.neighborhoods.contains("Namutequeliua"))
    }

    @Test
    fun testPostalCodes() {
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
}
