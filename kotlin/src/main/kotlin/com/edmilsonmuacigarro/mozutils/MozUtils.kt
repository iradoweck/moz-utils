package com.edmilsonmuacigarro.mozutils

import java.net.URLEncoder

data class District(
    val name: String,
    val provinceId: String,
    val administrative_posts: List<String>,
    val neighborhoods: List<String>
)

/**
 * MozUtils
 *
 * Utility functions for Mozambique.
 * Validation of NUIT, BI, documents, and phone formatting.
 */
object MozUtils {

    /**
     * Validates a Mozambican phone number.
     * Valid operators: Vodacom (84/85), Tmcel (82/83), Movitel (86/87/88)
     */
    fun isValidMozambicanPhone(phone: String): Boolean {
        val cleaned = phone.replace(Regex("[\\s\\-\\(\\)\\+]"), "")
        val withoutCountryCode = if (cleaned.startsWith("258")) cleaned.substring(3) else cleaned
        return withoutCountryCode.matches(Regex("^8[2-8]\\d{7}$"))
    }

    /**
     * Formats a Mozambican phone number to the international standard.
     */
    fun formatMozambicanPhone(phone: String): String {
        val cleaned = phone.replace(Regex("[\\s\\-\\(\\)\\+]"), "")
        val withoutCountryCode = if (cleaned.startsWith("258")) cleaned.substring(3) else cleaned

        require(isValidMozambicanPhone(withoutCountryCode)) { "Invalid phone number: $phone" }

        val prefix = withoutCountryCode.substring(0, 2)
        val part1 = withoutCountryCode.substring(2, 5)
        val part2 = withoutCountryCode.substring(5)

        return "+258 $prefix $part1 $part2"
    }

    /**
     * Identifies the operator of a Mozambican phone number.
     */
    fun getMobileOperator(phone: String): String? {
        val cleaned = phone.replace(Regex("[\\s\\-\\(\\)\\+]"), "")
        val withoutCountryCode = if (cleaned.startsWith("258")) cleaned.substring(3) else cleaned

        if (!isValidMozambicanPhone(withoutCountryCode)) return null

        val prefix = withoutCountryCode.substring(0, 2)
        val operators = mapOf(
            "84" to "Vodacom",
            "85" to "Vodacom",
            "82" to "Tmcel",
            "83" to "Tmcel",
            "86" to "Movitel",
            "87" to "Movitel",
            "88" to "Movitel"
        )

        return operators[prefix]
    }

    /**
     * Valida o NUIT (Número Único de Identificação Tributária) de Moçambique.
     * 
     * Regras da AT:
     * - 9 dígitos
     * - Primeiro dígito: 1 a 5
     * - Nono dígito: Módulo 11
     */
    fun isValidNUIT(nuit: Any): Boolean {
        val cleaned = nuit.toString().replace(Regex("\\D"), "")

        if (cleaned.length != 9) return false
        if (cleaned.matches(Regex("^(\\d)\\1{8}$"))) return false
        if (!cleaned.matches(Regex("^[1-5].*"))) return false

        val weights = intArrayOf(8, 9, 4, 5, 6, 7, 8, 9)
        var sum = 0
        for (i in 0 until 8) {
            sum += Character.getNumericValue(cleaned[i]) * weights[i]
        }

        val checkIdx = sum % 11
        val expectedDigit = "01234567891"[checkIdx]

        return cleaned[8] == expectedDigit
    }

    /**
     * Classifies the entity type based on the first digit of the NUIT.
     */
    fun getNUITEntityType(nuit: Any): String? {
        val cleaned = nuit.toString().replace(Regex("\\D"), "")
        if (!isValidNUIT(cleaned)) return null

        val firstDigit = cleaned[0].toString()
        val types = mapOf(
            "1" to "Singular (Cidadãos nacionais/estrangeiros e ENI)",
            "2" to "Singular (Cidadãos nacionais/estrangeiros e ENI)",
            "3" to "Equiparada (Heranças Jacentes, Consórcios)",
            "4" to "Colectiva (Sociedades por Quotas, SA, Lda, Associações)",
            "5" to "Público (Instituições do Estado e Ministérios)"
        )

        return types[firstDigit]
    }

    /**
     * Validates the Mozambican National ID (BI).
     */
    fun isValidBI(bi: String): Boolean {
        val cleaned = bi.replace(Regex("[\\s\\-]"), "").uppercase()
        return cleaned.matches(Regex("^\\d{12}[A-Z]$"))
    }

    /**
     * Formats a monetary value in Meticais following the official standard of Mozambique.
     *
     * Padrão oficial (SI + AT):
     * - Thousands separator: space
     * - Decimal separator: comma
     * - Symbol after the value, separated by a space
     *
     * @param value Valor numérico
     * @param currency "MT" (nacional) ou "MZN" (ISO 4217)
     * @return Formatted value (ex: "1 500,00 MT")
     */
    fun formatMZN(value: Double, currency: String = "MT"): String {
        val sign = if (value < 0) "-" else ""
        val absolute = Math.abs(value)

        // Formatar com 2 casas decimais usando locale US para garantir separador decimal como ponto e milhar como vírgula
        val formatted = String.format(java.util.Locale.US, "%,.2f", absolute)

        // Substituir: vírgula dos milhares → espaço, ponto decimal → vírgula
        val result = formatted.replace(",", " ").replace(".", ",")

        return "$sign$result $currency"
    }

    /**
     * Parses a formatted string value back to a Double.
     *
     * @param value The formatted string (e.g., "1 500,00 MT")
     * @return Double value or null if invalid
     */
    fun parseMZN(value: String): Double? {
        var clean = value.replace(Regex("[^\\d.,\\-]"), "")
        if (clean.isEmpty() || clean == "-") return null
        val lastComma = clean.lastIndexOf(',')
        val lastDot = clean.lastIndexOf('.')
        if (lastComma > -1 && lastDot > -1) {
            if (lastComma > lastDot) clean = clean.replace(".", "").replace(',', '.')
            else clean = clean.replace(",", "")
        } else if (lastComma > -1) {
            val parts = clean.split(',')
            if (parts.size == 2 && parts[1].length != 3) clean = clean.replace(',', '.')
            else clean = clean.replace(",", "")
        } else if (lastDot > -1) {
            val parts = clean.split('.')
            if (parts.size == 2 && parts[1].length == 3) clean = clean.replace(".", "")
            else if (parts.size > 2) clean = clean.replace(".", "")
        }
        return clean.toDoubleOrNull()
    }

    /**
     * Generates a WhatsApp contact URL with a pre-formatted message.
     */
    fun buildWhatsAppUrl(phone: String, message: String = ""): String {
        val cleaned = phone.replace(Regex("[\\s\\-\\(\\)\\+]"), "")
        val international = if (cleaned.startsWith("258")) cleaned else "258$cleaned"

        val encodedMessage = if (message.isNotEmpty()) "?text=${URLEncoder.encode(message, "UTF-8")}" else ""
        return "https://wa.me/$international$encodedMessage"
    }

    /**
     * Official list of Mozambique Provinces and their districts.
     * Fonte: Divisão administrativa oficial da República de Moçambique.
     */
    fun getMozambiqueProvinces(): List<Map<String, Any>> {
        return listOf(
                mapOf(
                    "id" to "cab",
                    "name" to "Cabo Delgado",
                    "region" to "Norte",
                    "sigla" to "CBD",
                    "districts" to listOf(
                        mapOf(
                            "name" to "Ancuabe",
                            "administrative_posts" to listOf("Ancuabe", "Metoro", "Meza"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Balama",
                            "administrative_posts" to listOf("Balama", "Chapa", "Kuekue", "Mavala"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Chiúre",
                            "administrative_posts" to listOf("Chiúre", "Chiúre-Velho", "Katapua", "Mazeze", "Namogelia", "Manoane"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Ibo",
                            "administrative_posts" to listOf("Ibo", "Quirimba"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Macomia",
                            "administrative_posts" to listOf("Macomia", "Chai", "Mucojo", "Quiterajo"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Mecúfi",
                            "administrative_posts" to listOf("Mecúfi", "Murrébuè"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Meluco",
                            "administrative_posts" to listOf("Meluco", "Muaguide"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Metuge",
                            "administrative_posts" to listOf("Metuge", "Mieze"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Mocímboa da Praia",
                            "administrative_posts" to listOf("Mocímboa da Praia", "Diaca", "Mbau"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Montepuez",
                            "administrative_posts" to listOf("Montepuez", "Mapupulo", "Namanhumbir", "Nairoto", "Napaula"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Mueda",
                            "administrative_posts" to listOf("Mueda", "Chapa", "Imbuho", "Negomano", "N'gapa"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Muidumbe",
                            "administrative_posts" to listOf("Muidumbe", "Chitunda", "Miteda"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Namuno",
                            "administrative_posts" to listOf("Namuno", "Machoca", "Meloco", "Ncumpe", "Luli"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Nangade",
                            "administrative_posts" to listOf("Nangade", "Ntamba"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Palma",
                            "administrative_posts" to listOf("Palma", "Olumbe", "Quionga"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Pemba (Cidade)",
                            "administrative_posts" to listOf("Pemba"),
                            "neighborhoods" to listOf(
                                "Paquitequete",
                                "Natite",
                                "Cariacó",
                                "Alto Gingone",
                                "Insubria",
                                "Muxara",
                                "Maringanha",
                                "Chibuébue"
                            )
                        ),
                        mapOf(
                            "name" to "Quissanga",
                            "administrative_posts" to listOf("Quissanga", "Mahate", "Bilibiza"),
                            "neighborhoods" to emptyList<String>()
                        )
                    )
                ),
                mapOf(
                    "id" to "nia",
                    "name" to "Niassa",
                    "region" to "Norte",
                    "sigla" to "NS",
                    "districts" to listOf(
                        mapOf(
                            "name" to "Chimbonila",
                            "administrative_posts" to listOf("Chimbonila", "Meponda"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Cuamba",
                            "administrative_posts" to listOf("Cuamba", "Lúrio", "Etatara"),
                            "neighborhoods" to listOf("Ribaue", "Mutxora", "Ademo", "Aeroporto")
                        ),
                        mapOf(
                            "name" to "Lago",
                            "administrative_posts" to listOf("Metangula", "Cobué", "Luninho", "Maniamba"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Lichinga (Cidade)",
                            "administrative_posts" to listOf("Lichinga"),
                            "neighborhoods" to listOf("Central", "Popular", "Chimba", "Cerâmica", "Ngaula", "Sanjala", "Chiuaula")
                        ),
                        mapOf(
                            "name" to "Majune",
                            "administrative_posts" to listOf("Majune", "Mua", "Nairrobi"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Mandimba",
                            "administrative_posts" to listOf("Mandimba", "Mitande"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Marrupa",
                            "administrative_posts" to listOf("Marrupa", "Marangira", "Nungo"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Maúa",
                            "administrative_posts" to listOf("Maúa", "Maiaca"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Mavago",
                            "administrative_posts" to listOf("Mavago", "M'saize"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Mecanhelas",
                            "administrative_posts" to listOf("Mecanhelas", "Chiuta"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Mecula",
                            "administrative_posts" to listOf("Mecula", "Matondovela"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Metarica",
                            "administrative_posts" to listOf("Metarica", "Nacuanha"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Muembe",
                            "administrative_posts" to listOf("Muembe", "Chiconono"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "N'gauma",
                            "administrative_posts" to listOf("Massangulo", "Itepela"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Nipepe",
                            "administrative_posts" to listOf("Nipepe", "Muatuca"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Sanga",
                            "administrative_posts" to listOf("Unango", "Malamuila", "Matchedje"),
                            "neighborhoods" to emptyList<String>()
                        )
                    )
                ),
                mapOf(
                    "id" to "npl",
                    "name" to "Nampula",
                    "region" to "Norte",
                    "sigla" to "NPL",
                    "districts" to listOf(
                        mapOf(
                            "name" to "Angoche",
                            "administrative_posts" to listOf("Angoche", "Aube", "Namaponda"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Eráti",
                            "administrative_posts" to listOf("Namapa", "Alua", "Nakarari"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Ilha de Moçambique",
                            "administrative_posts" to listOf("Ilha de Moçambique", "Lumbo"),
                            "neighborhoods" to listOf("Museu", "Litine", "Areal", "Marangonha")
                        ),
                        mapOf(
                            "name" to "Lalaua",
                            "administrative_posts" to listOf("Lalaua", "Meti"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Larde",
                            "administrative_posts" to listOf("Larde", "Mucuali"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Liúpo",
                            "administrative_posts" to listOf("Liúpo", "Quinga"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Malema",
                            "administrative_posts" to listOf("Malema", "Chinga", "Mutuali"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Meconta",
                            "administrative_posts" to listOf("Meconta", "Corrane", "Namialo"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Mecubúri",
                            "administrative_posts" to listOf("Mecubúri", "Milhana", "Muite", "Namina"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Memba",
                            "administrative_posts" to listOf("Memba", "Chipene", "Mazua", "Lurio"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Mogincual",
                            "administrative_posts" to listOf("Mogincual", "Quixaxe"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Mogovolas",
                            "administrative_posts" to listOf("Nametil", "Calipo", "Ilute", "Muatua"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Moma",
                            "administrative_posts" to listOf("Macone", "Chalai", "Lunga"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Monapo",
                            "administrative_posts" to listOf("Monapo", "Itoculo", "Netia"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Mossuril",
                            "administrative_posts" to listOf("Mossuril", "Lunga", "Matibane"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Muecate",
                            "administrative_posts" to listOf("Muecate", "Imala", "Muculuone"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Murrupula",
                            "administrative_posts" to listOf("Murrupula", "Chinga", "Nihessiue"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Nacala-a-Velha",
                            "administrative_posts" to listOf("Nacala-a-Velha", "Covo"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Nacala Porto",
                            "administrative_posts" to listOf("Nacala Porto", "Muanona"),
                            "neighborhoods" to listOf("Mutiva", "Triângulo", "Ontupaia", "Quissanga")
                        ),
                        mapOf(
                            "name" to "Nampula (Cidade)",
                            "administrative_posts" to listOf("Urbano Central", "Muatala", "Muhala", "Namikopo", "Napipine", "Natikiri"),
                            "neighborhoods" to listOf("Central", "Muatala", "Muhala", "Namikopo", "Napipine", "Natikiri", "Marrere", "Namutequeliua")
                        ),
                        mapOf(
                            "name" to "Nacarôa",
                            "administrative_posts" to listOf("Nacarôa", "Saua-Saua"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Rapale",
                            "administrative_posts" to listOf("Rapale", "Anchilo", "Mutivaze"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Ribáuè",
                            "administrative_posts" to listOf("Ribáuè", "Cunle", "Iapala"),
                            "neighborhoods" to emptyList<String>()
                        )
                    )
                ),
                mapOf(
                    "id" to "zam",
                    "name" to "Zambézia",
                    "region" to "Centro",
                    "sigla" to "ZMB",
                    "districts" to listOf(
                        mapOf(
                            "name" to "Alto Molócuè",
                            "administrative_posts" to listOf("Alto Molócuè", "Nauela"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Chinde",
                            "administrative_posts" to listOf("Chinde", "Micaune"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Derre",
                            "administrative_posts" to listOf("Derre", "Guerissa"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Gilé",
                            "administrative_posts" to listOf("Gilé", "Alto Ligonha"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Gurué",
                            "administrative_posts" to listOf("Gurué", "Lioma", "Nepuíte"),
                            "neighborhoods" to listOf("Bairro Central", "Mucuapa", "Nacuacue")
                        ),
                        mapOf(
                            "name" to "Ile",
                            "administrative_posts" to listOf("Ile", "Socone"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Inhassunge",
                            "administrative_posts" to listOf("Mucupia", "Gonhane"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Luabo",
                            "administrative_posts" to listOf("Luabo", "Chimbazo"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Lugela",
                            "administrative_posts" to listOf("Lugela", "Tacuane", "Munhamade"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Maganja da Costa",
                            "administrative_posts" to listOf("Maganja da Costa", "Baleia"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Milange",
                            "administrative_posts" to listOf("Milange", "Majaua", "Mongue"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Mocuba",
                            "administrative_posts" to listOf("Mocuba", "Mualama", "Namanjavira"),
                            "neighborhoods" to listOf("Central", "Aeroporto", "Paraíso")
                        ),
                        mapOf(
                            "name" to "Mocubela",
                            "administrative_posts" to listOf("Mocubela", "Bajone"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Molumbo",
                            "administrative_posts" to listOf("Molumbo", "Corromana"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Mopeia",
                            "administrative_posts" to listOf("Mopeia", "Campo"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Morrumbala",
                            "administrative_posts" to listOf("Morrumbala", "Chire", "Megaza"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Mulevala",
                            "administrative_posts" to listOf("Mulevala", "Chirimane"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Namacurra",
                            "administrative_posts" to listOf("Namacurra", "Macuse"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Namarrói",
                            "administrative_posts" to listOf("Namarrói", "Regone"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Nicoadala",
                            "administrative_posts" to listOf("Nicoadala", "Maquival"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Pebane",
                            "administrative_posts" to listOf("Pebane", "Mulela", "Naburi"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Quelimane (Cidade)",
                            "administrative_posts" to listOf("Urbano nº 1", "Urbano nº 2", "Urbano nº 3", "Urbano nº 4"),
                            "neighborhoods" to listOf("Central", "Cementório", "Inhassunge", "Icidua", "Chingo", "Matacuane")
                        )
                    )
                ),
                mapOf(
                    "id" to "tet",
                    "name" to "Tete",
                    "region" to "Centro",
                    "sigla" to "TT",
                    "districts" to listOf(
                        mapOf(
                            "name" to "Angónia",
                            "administrative_posts" to listOf("Ulongue", "Domue"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Cahora-Bassa",
                            "administrative_posts" to listOf("Songo", "Chitima", "Muxeza"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Changara",
                            "administrative_posts" to listOf("Luenha", "Chioco", "Mavago"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Chifunde",
                            "administrative_posts" to listOf("Chifunde", "Mualadzi", "Nsadzu"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Chiuta",
                            "administrative_posts" to listOf("Manje", "Kazula"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Dôa",
                            "administrative_posts" to listOf("Dôa", "Chueza"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Macanga",
                            "administrative_posts" to listOf("Furancungo", "Chinde"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Magoé",
                            "administrative_posts" to listOf("Mpende", "Chinthopo", "Mukumbura"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Marara",
                            "administrative_posts" to listOf("Marara", "M'fuba"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Marávia",
                            "administrative_posts" to listOf("Fingoé", "Chiputo", "Molumbo"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Moatize",
                            "administrative_posts" to listOf("Moatize", "Kambulatsitsi", "Zóbuè"),
                            "neighborhoods" to listOf("Bairro 25 de Setembro", "Liberdade", "Chithatha")
                        ),
                        mapOf(
                            "name" to "Mutarara",
                            "administrative_posts" to listOf("Nhamayabué", "Inhangoma"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Tete (Cidade)",
                            "administrative_posts" to listOf("Tete"),
                            "neighborhoods" to listOf("Chingo", "Degue", "Matundo", "Mpadue", "Josina Machel", "Francisco Manyanga")
                        ),
                        mapOf(
                            "name" to "Tsangano",
                            "administrative_posts" to listOf("Tsangano", "Ntengo-Wambuzi"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Zumbo",
                            "administrative_posts" to listOf("Zumbo", "Muze", "Zambue"),
                            "neighborhoods" to emptyList<String>()
                        )
                    )
                ),
                mapOf(
                    "id" to "man",
                    "name" to "Manica",
                    "region" to "Centro",
                    "sigla" to "MN",
                    "districts" to listOf(
                        mapOf(
                            "name" to "Bárue",
                            "administrative_posts" to listOf("Catandica", "Nhampassa", "Chuala"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Chimoio (Cidade)",
                            "administrative_posts" to listOf("Urbano nº 1", "Urbano nº 2", "Urbano nº 3"),
                            "neighborhoods" to listOf("Central", "7 de Setembro", "Soalpo", "Nandfe", "Vila Nova", "Cordor")
                        ),
                        mapOf(
                            "name" to "Gondola",
                            "administrative_posts" to listOf("Gondola", "Cafumpe", "Amatongas"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Guro",
                            "administrative_posts" to listOf("Guro", "Mandie", "Nhamassonge"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Macate",
                            "administrative_posts" to listOf("Macate", "Marera"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Machaze",
                            "administrative_posts" to listOf("Machaze", "Save"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Macossa",
                            "administrative_posts" to listOf("Macossa", "Nhamagua"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Manica",
                            "administrative_posts" to listOf("Manica", "Messica", "Mavonde"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Mossurize",
                            "administrative_posts" to listOf("Espungabera", "Dacata"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Sussundenga",
                            "administrative_posts" to listOf("Sussundenga", "Dombe", "Muhoa"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Tambara",
                            "administrative_posts" to listOf("Nhacolo", "Buzua"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Vanduzi",
                            "administrative_posts" to listOf("Vanduzi", "Matsinho"),
                            "neighborhoods" to emptyList<String>()
                        )
                    )
                ),
                mapOf(
                    "id" to "sof",
                    "name" to "Sofala",
                    "region" to "Centro",
                    "sigla" to "SF",
                    "districts" to listOf(
                        mapOf(
                            "name" to "Beira (Cidade)",
                            "administrative_posts" to listOf("Central", "Munhava", "Manga Loot", "Inhamizua"),
                            "neighborhoods" to listOf("Chaimite", "Macuti", "Ponta Gêa", "Munhava", "Manga", "Vaz", "Esturro", "Cipangara")
                        ),
                        mapOf(
                            "name" to "Búzi",
                            "administrative_posts" to listOf("Búzi", "Estaquinha", "Nova Sofala"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Caia",
                            "administrative_posts" to listOf("Caia", "Sena", "Murraça"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Chemba",
                            "administrative_posts" to listOf("Chemba", "Chiramba", "Mulima"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Cheringoma",
                            "administrative_posts" to listOf("Inhaminga", "Muanza"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Chibabava",
                            "administrative_posts" to listOf("Chibabava", "Goonda", "Muxúnguè"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Dondo",
                            "administrative_posts" to listOf("Dondo", "Mafambisse"),
                            "neighborhoods" to listOf("Chibuabuamua", "Central", "Planalto")
                        ),
                        mapOf(
                            "name" to "Gorongosa",
                            "administrative_posts" to listOf("Gorongosa", "Nhamadzi", "Vanduzi"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Machanga",
                            "administrative_posts" to listOf("Machanga", "Divinhe"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Maringué",
                            "administrative_posts" to listOf("Maringué", "Canxixe", "Subui"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Marromeu",
                            "administrative_posts" to listOf("Marromeu", "Chupanga"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Muanza",
                            "administrative_posts" to listOf("Muanza", "Galinha"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Nhamatanda",
                            "administrative_posts" to listOf("Nhamatanda", "Tica"),
                            "neighborhoods" to emptyList<String>()
                        )
                    )
                ),
                mapOf(
                    "id" to "inh",
                    "name" to "Inhambane",
                    "region" to "Sul",
                    "sigla" to "INH",
                    "districts" to listOf(
                        mapOf(
                            "name" to "Funhalouro",
                            "administrative_posts" to listOf("Funhalouro", "Tome"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Govuro",
                            "administrative_posts" to listOf("Nova Mambone", "Jofane"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Homoíne",
                            "administrative_posts" to listOf("Homoíne", "Pembe"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Inhambane (Cidade)",
                            "administrative_posts" to listOf("Inhambane"),
                            "neighborhoods" to listOf("Balane", "Chamane", "Josina Machel", "Muelé", "Liberdade", "Aeroporto")
                        ),
                        mapOf(
                            "name" to "Inharrime",
                            "administrative_posts" to listOf("Inharrime", "Chambone"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Inhassoro",
                            "administrative_posts" to listOf("Inhassoro", "Bazaruto"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Jangamo",
                            "administrative_posts" to listOf("Jangamo", "Cumbana"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Mabote",
                            "administrative_posts" to listOf("Mabote", "Zimane"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Massinga",
                            "administrative_posts" to listOf("Massinga", "Chicomo"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Maxixe (Cidade)",
                            "administrative_posts" to listOf("Maxixe"),
                            "neighborhoods" to listOf("Bairro Central", "Chamba", "Macupula", "Nalazi")
                        ),
                        mapOf(
                            "name" to "Morrumbene",
                            "administrative_posts" to listOf("Morrumbene", "Mucodoene"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Panda",
                            "administrative_posts" to listOf("Panda", "Muelé"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Vilankulo",
                            "administrative_posts" to listOf("Vilankulo", "Mapinhane"),
                            "neighborhoods" to listOf("Bairro Central", "Mucoque", "Alto Macassa")
                        ),
                        mapOf(
                            "name" to "Zavala",
                            "administrative_posts" to listOf("Quissico", "Zandamela"),
                            "neighborhoods" to emptyList<String>()
                        )
                    )
                ),
                mapOf(
                    "id" to "gaz",
                    "name" to "Gaza",
                    "region" to "Sul",
                    "sigla" to "GZ",
                    "districts" to listOf(
                        mapOf(
                            "name" to "Bilene",
                            "administrative_posts" to listOf("Macia", "Bilene Macia", "Chissano"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Chibuto",
                            "administrative_posts" to listOf("Chibuto", "Chaimite", "Changanine"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Chicualacuala",
                            "administrative_posts" to listOf("Chicualacuala", "Mapai"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Chigubo",
                            "administrative_posts" to listOf("Chigubo", "Ndindiza"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Chókwè",
                            "administrative_posts" to listOf("Chókwè", "Lionde", "Macarretane"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Chonguene",
                            "administrative_posts" to listOf("Chonguene", "Chongoene"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Guijá",
                            "administrative_posts" to listOf("Canicado", "Chivonguene"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Limpopo",
                            "administrative_posts" to listOf("Chicumbane", "Zongoene"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Mabalane",
                            "administrative_posts" to listOf("Mabalane", "Combomune"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Manjacaze",
                            "administrative_posts" to listOf("Manjacaze", "Chidenguele"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Mapai",
                            "administrative_posts" to listOf("Mapai", "Machaila"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Massangena",
                            "administrative_posts" to listOf("Massangena", "Mavue"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Massingir",
                            "administrative_posts" to listOf("Massingir", "Zulo"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Xai-Xai (Cidade)",
                            "administrative_posts" to listOf("Xai-Xai"),
                            "neighborhoods" to listOf("Central", "Alto-Gaza", "Inhamissa", "Panjane", "Chicumbane", "Patrice Lumumba")
                        )
                    )
                ),
                mapOf(
                    "id" to "mpp",
                    "name" to "Maputo (Província)",
                    "region" to "Sul",
                    "sigla" to "MPT",
                    "districts" to listOf(
                        mapOf(
                            "name" to "Boane",
                            "administrative_posts" to listOf("Boane", "Matola-Rio"),
                            "neighborhoods" to listOf("Bairro Central", "Campinho", "Massaca")
                        ),
                        mapOf(
                            "name" to "Magude",
                            "administrative_posts" to listOf("Magude", "Mapulanguene", "Motaze"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Manhiça",
                            "administrative_posts" to listOf("Manhiça", "Xinavane", "3 de Fevereiro"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Marracuene",
                            "administrative_posts" to listOf("Marracuene", "Machubo"),
                            "neighborhoods" to listOf("Aliança", "Cumbe", "Habel Jafar")
                        ),
                        mapOf(
                            "name" to "Matola (Cidade)",
                            "administrative_posts" to listOf("Matola", "Infulene", "Machava"),
                            "neighborhoods" to listOf("Matola Sede", "Fomento", "Liberdade", "T3", "Trevo", "Machava Socimol", "Cingatela")
                        ),
                        mapOf(
                            "name" to "Matutuíne",
                            "administrative_posts" to listOf("Bela Vista", "Catembe", "Zitundo"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Moamba",
                            "administrative_posts" to listOf("Moamba", "Ressano Garcia", "Pessene"),
                            "neighborhoods" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Namaacha",
                            "administrative_posts" to listOf("Namaacha", "Changalane"),
                            "neighborhoods" to emptyList<String>()
                        )
                    )
                ),
                mapOf(
                    "id" to "mpc",
                    "name" to "Maputo (Cidade)",
                    "region" to "Sul",
                    "sigla" to "MC",
                    "districts" to listOf(
                        mapOf(
                            "name" to "KaMpfumo",
                            "administrative_posts" to listOf("KaMpfumo"),
                            "neighborhoods" to listOf(
                                "Central A/B",
                                "Alto Maé A/B",
                                "Malhangalene A/B",
                                "Polana Cimento A/B/C",
                                "Coop",
                                "Sommerschield"
                            )
                        ),
                        mapOf(
                            "name" to "Nlhamankulu",
                            "administrative_posts" to listOf("Nlhamankulu"),
                            "neighborhoods" to listOf("Aeroporto A/B", "Chamanculo A/B/C/D", "Malanga", "Xipamanine", "Munhuana", "Unidade 7")
                        ),
                        mapOf(
                            "name" to "KaMaxaquene",
                            "administrative_posts" to listOf("KaMaxaquene"),
                            "neighborhoods" to listOf("Maxaquene A/B/C/D", "Polana Caniço A/B", "Urbanização", "Mafalala")
                        ),
                        mapOf(
                            "name" to "KaMavota",
                            "administrative_posts" to listOf("KaMavota"),
                            "neighborhoods" to listOf("Mavalane A/B", "FPLM", "Hulene A/B", "Ferroviário", "Costa do Sol", "Polana Caniço B")
                        ),
                        mapOf(
                            "name" to "KaMubukwana",
                            "administrative_posts" to listOf("KaMubukwana"),
                            "neighborhoods" to listOf("Bagamoyo", "George Dimitrov", "Inhagoia A/B", "Magoanine A/B/C", "Zimpeto")
                        ),
                        mapOf(
                            "name" to "KaTembe",
                            "administrative_posts" to listOf("KaTembe"),
                            "neighborhoods" to listOf("Gwaza Muthini", "Incassane", "Inguide", "Chali", "Chamissava")
                        ),
                        mapOf(
                            "name" to "KaNyaka",
                            "administrative_posts" to listOf("KaNyaka"),
                            "neighborhoods" to listOf("Ribzene", "Nghanyane", "Chadwane")
                        )
                    )
                )
            )
    }

    /**
     * Returns the list of districts belonging to a given province.
     */
    fun getDistrictsByProvince(provinceId: String): List<String> {
        val cleanId = provinceId.trim().lowercase()
        for (province in getMozambiqueProvinces()) {
            if (province["id"] == cleanId) {
                @Suppress("UNCHECKED_CAST")
                val districts = province["districts"] as List<Map<String, Any>>
                return districts.map { it["name"] as String }
            }
        }
        throw IllegalArgumentException("Província inválida: $provinceId")
    }

    /**
     * Returns a flat list of all 161 districts and their respective province IDs.
     */
    fun getAllDistricts(): List<District> {
        val list = mutableListOf<District>()
        for (province in getMozambiqueProvinces()) {
            val pId = province["id"] as String
            @Suppress("UNCHECKED_CAST")
            val districts = province["districts"] as List<Map<String, Any>>
            for (district in districts) {
                @Suppress("UNCHECKED_CAST")
                list.add(
                    District(
                        name = district["name"] as String,
                        provinceId = pId,
                        administrative_posts = district["administrative_posts"] as List<String>,
                        neighborhoods = district["neighborhoods"] as List<String>
                    )
                )
            }
        }
        return list;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // NAME & DOCUMENT FIELD SANITIZATION
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Checks whether a string is a valid personal name.
     * Accepts Unicode letters, spaces, hyphens, and apostrophes.
     *
     * @sample isValidName("Edmilson Muacigarro") // true
     * @sample isValidName("Jean-Pierre")          // true
     * @sample isValidName("ABC123")               // false
     */
    fun isValidName(name: String): Boolean {
        val trimmed = name.trim()
        if (trimmed.isEmpty()) return false
        return trimmed.all { it.isLetter() || it.isWhitespace() || it == '-' || it == '\'' }
    }

    /**
     * Sanitizes a personal name field.
     *
     * By default converts to Title Case. Pass allCaps = true to force UPPERCASE.
     * Strips digits and most special characters.
     *
     * @sample sanitizeName("  edmilson   muacigarro  ")        // "Edmilson Muacigarro"
     * @sample sanitizeName("JOÃO", allCaps = true)             // "JOÃO"
     * @sample sanitizeName("jean-pierre dupont")              // "Jean-Pierre Dupont"
     */
    fun sanitizeName(name: String, allCaps: Boolean = false): String {
        // Keep only letters, spaces, hyphens, apostrophes; collapse whitespace
        val cleaned = name
            .filter { it.isLetter() || it.isWhitespace() || it == '-' || it == '\'' }
            .replace(Regex("\\s+"), " ")
            .trim()

        if (allCaps) return cleaned.uppercase()

        // Title Case: capitalise after start, space, or hyphen
        val sb = StringBuilder()
        var capitaliseNext = true
        for (char in cleaned) {
            when {
                char == ' ' || char == '-' -> { sb.append(char); capitaliseNext = true }
                capitaliseNext -> { sb.append(char.uppercaseChar()); capitaliseNext = false }
                else -> sb.append(char)
            }
        }
        return sb.toString()
    }

    /**
     * Sanitizes a document number field that contains only digits.
     * Strips all non-numeric characters.
     *
     * @sample sanitizeDocumentField("123 456 789")  // "123456789"
     * @sample sanitizeDocumentField("123-456-789")  // "123456789"
     */
    fun sanitizeDocumentField(value: String): String {
        return value.filter { it.isDigit() }
    }

    /**
     * Sanitizes an alphanumeric document field (digits + letters),
     * forcing all letters to UPPERCASE.
     *
     * Useful for BI, passports, and other mixed-format documents.
     *
     * @sample sanitizeAlphanumericField("110 101 234567a")  // "110101234567A"
     * @sample sanitizeAlphanumericField("abc-123-XYZ!")    // "ABC123XYZ"
     */
    fun sanitizeAlphanumericField(value: String): String {
        return value.filter { it.isLetterOrDigit() }.uppercase()
    }

    /**
     * Mapa de Códigos Postais Legados de Moçambique.
     */
    val legacyPostalCodes: Map<String, Map<String, String>> = mapOf(
        // Região Sul
        // Maputo
        "1100" to mapOf("locality" to "Maputo ECP (Sede)", "province" to "Maputo"),
        "1101" to mapOf("locality" to "Polana", "province" to "Maputo"),
        "1102" to mapOf("locality" to "Sommerchild", "province" to "Maputo"),
        "1103" to mapOf("locality" to "Malhangalene", "province" to "Maputo"),
        "1104" to mapOf("locality" to "Alto-Maé", "province" to "Maputo"),
        "1106" to mapOf("locality" to "Bairro Central", "province" to "Maputo"),
        "1107" to mapOf("locality" to "Bairro do Aeroporto", "province" to "Maputo"),
        "1108" to mapOf("locality" to "Bairro do Mavalane", "province" to "Maputo"),
        "1109" to mapOf("locality" to "Bairro do Jardim", "province" to "Maputo"),
        "1110" to mapOf("locality" to "Bairro do Xipamanine", "province" to "Maputo"),
        "1111" to mapOf("locality" to "Bairro George Dimitrov", "province" to "Maputo"),
        "1112" to mapOf("locality" to "Machava", "province" to "Maputo"),
        "1113" to mapOf("locality" to "Fomento", "province" to "Maputo"),
        "1114" to mapOf("locality" to "Matola", "province" to "Maputo"),
        "1115" to mapOf("locality" to "Boane", "province" to "Maputo"),
        "1116" to mapOf("locality" to "Namaacha", "province" to "Maputo"),
        "1117" to mapOf("locality" to "Katembe", "province" to "Maputo"),
        "1118" to mapOf("locality" to "Bela-Vista", "province" to "Maputo"),
        "1119" to mapOf("locality" to "Inhaca", "province" to "Maputo"),
        "1120" to mapOf("locality" to "Marracuene", "province" to "Maputo"),
        "1121" to mapOf("locality" to "Manhiça", "province" to "Maputo"),
        "1122" to mapOf("locality" to "Xinavane", "province" to "Maputo"),
        "1123" to mapOf("locality" to "Magude", "province" to "Maputo"),
        "1124" to mapOf("locality" to "Moamba", "province" to "Maputo"),
        "1125" to mapOf("locality" to "Ressano Garcia", "province" to "Maputo"),
        // Gaza
        "1200" to mapOf("locality" to "Xai-Xai ECP", "province" to "Gaza"),
        "1201" to mapOf("locality" to "Praia de Xai-Xai", "province" to "Gaza"),
        "1202" to mapOf("locality" to "Macia", "province" to "Gaza"),
        "1203" to mapOf("locality" to "Praia de Bilene", "province" to "Gaza"),
        "1204" to mapOf("locality" to "Chokwé", "province" to "Gaza"),
        "1205" to mapOf("locality" to "Chilembene / Magoanine", "province" to "Gaza"),
        "1206" to mapOf("locality" to "Mabalane", "province" to "Gaza"),
        "1207" to mapOf("locality" to "Massingir", "province" to "Gaza"),
        "1208" to mapOf("locality" to "Chibuto", "province" to "Gaza"),
        "1209" to mapOf("locality" to "Manjacaze", "province" to "Gaza"),
        "1210" to mapOf("locality" to "Chidenguele", "province" to "Gaza"),
        "1211" to mapOf("locality" to "Chicualacuala", "province" to "Gaza"),
        // Inhambane
        "1300" to mapOf("locality" to "Inhambane ECP", "province" to "Inhambane"),
        "1301" to mapOf("locality" to "Maxixe", "province" to "Inhambane"),
        "1302" to mapOf("locality" to "Morrumbene", "province" to "Inhambane"),
        "1303" to mapOf("locality" to "Massinga", "province" to "Inhambane"),
        "1304" to mapOf("locality" to "Vilanculos", "province" to "Inhambane"),
        "1305" to mapOf("locality" to "Inhassoro", "province" to "Inhambane"),
        "1306" to mapOf("locality" to "Nova-Mambone", "province" to "Inhambane"),
        "1307" to mapOf("locality" to "Jangamo", "province" to "Inhambane"),
        "1308" to mapOf("locality" to "Cumbane", "province" to "Inhambane"),
        "1309" to mapOf("locality" to "Homoine", "province" to "Inhambane"),
        "1310" to mapOf("locality" to "Panda", "province" to "Inhambane"),
        "1311" to mapOf("locality" to "Inharrime", "province" to "Inhambane"),
        "1312" to mapOf("locality" to "Quissico", "province" to "Inhambane"),
        "1313" to mapOf("locality" to "Funhalouro", "province" to "Inhambane"),
        "1314" to mapOf("locality" to "Mabote", "province" to "Inhambane"),

        // Região Centro
        // Sofala
        "2100" to mapOf("locality" to "Beira ECP", "province" to "Sofala"),
        "2101" to mapOf("locality" to "Macúti", "province" to "Sofala"),
        "2102" to mapOf("locality" to "Beira Aeroporto", "province" to "Sofala"),
        "2103" to mapOf("locality" to "Manga", "province" to "Sofala"),
        "2104" to mapOf("locality" to "Dondo", "province" to "Sofala"),
        "2105" to mapOf("locality" to "Mafambisse", "province" to "Sofala"),
        "2106" to mapOf("locality" to "Nhamatanda", "province" to "Sofala"),
        "2107" to mapOf("locality" to "Buzi", "province" to "Sofala"),
        "2110" to mapOf("locality" to "Gorongoza", "province" to "Sofala"),
        // Manica
        "2200" to mapOf("locality" to "Chimoio ECP", "province" to "Manica"),
        "2201" to mapOf("locality" to "Catandica", "province" to "Manica"),
        "2202" to mapOf("locality" to "Vila de Manica", "province" to "Manica"),
        "2203" to mapOf("locality" to "Gondola", "province" to "Manica"),
        "2204" to mapOf("locality" to "Guro", "province" to "Manica"),
        "2205" to mapOf("locality" to "Machaze", "province" to "Manica"),
        "2206" to mapOf("locality" to "Macossa", "province" to "Manica"),
        "2207" to mapOf("locality" to "Sussundenga", "province" to "Manica"),
        "2208" to mapOf("locality" to "Tambara", "province" to "Manica"),
        // Tete
        "2300" to mapOf("locality" to "Tete ECP", "province" to "Tete"),
        "2301" to mapOf("locality" to "Tete Aeroporto", "province" to "Tete"),
        "2302" to mapOf("locality" to "Moatize", "province" to "Tete"),
        "2304" to mapOf("locality" to "Songo", "province" to "Tete"),
        "2307" to mapOf("locality" to "Mutarara", "province" to "Tete"),
        "2312" to mapOf("locality" to "Zumbo", "province" to "Tete"),
        // Zambézia
        "2400" to mapOf("locality" to "Quelimane ECP", "province" to "Zambézia"),
        "2401" to mapOf("locality" to "Nicoadala", "province" to "Zambézia"),
        "2403" to mapOf("locality" to "Mocuba", "province" to "Zambézia"),
        "2405" to mapOf("locality" to "Pebane", "province" to "Zambézia"),
        "2407" to mapOf("locality" to "Gurué", "province" to "Zambézia"),
        "2412" to mapOf("locality" to "Chinde", "province" to "Zambézia"),

        // Região Norte
        // Nampula
        "3100" to mapOf("locality" to "Nampula ECP", "province" to "Nampula"),
        "3101" to mapOf("locality" to "Angoche", "province" to "Nampula"),
        "3102" to mapOf("locality" to "Monapo", "province" to "Nampula"),
        "3105" to mapOf("locality" to "Ilha de Moçambique", "province" to "Nampula"),
        "3108" to mapOf("locality" to "Moma", "province" to "Nampula"),
        "3112" to mapOf("locality" to "Nacala", "province" to "Nampula"),
        "3115" to mapOf("locality" to "Namapa", "province" to "Nampula"),
        "3119" to mapOf("locality" to "Ribaue", "province" to "Nampula"),
        // Cabo Delgado
        "3200" to mapOf("locality" to "Pemba ECP", "province" to "Cabo Delgado"),
        "3201" to mapOf("locality" to "Pemba-2", "province" to "Cabo Delgado"),
        "3208" to mapOf("locality" to "Montepuez", "province" to "Cabo Delgado"),
        "3216" to mapOf("locality" to "Mueda", "province" to "Cabo Delgado"),
        "3219" to mapOf("locality" to "Palma", "province" to "Cabo Delgado"),
        // Niassa
        "3300" to mapOf("locality" to "Lichinga ECP", "province" to "Niassa"),
        "3301" to mapOf("locality" to "Macanhelas", "province" to "Niassa"),
        "3304" to mapOf("locality" to "Mandimba", "province" to "Niassa"),
        "3305" to mapOf("locality" to "Cuamba", "province" to "Niassa"),
        "3311" to mapOf("locality" to "Muembe", "province" to "Niassa")
    )

    /**
     * Valida se um código postal legado de Moçambique é válido.
     * Deve conter 4 dígitos numéricos pertencentes ao sistema clássico dos Correios de Moçambique.
     */
    fun isValidPostalCode(code: String): Boolean {
        val cleaned = code.filter { it.isDigit() }
        return legacyPostalCodes.containsKey(cleaned)
    }

    /**
     * Retorna a localidade correspondente a um código postal legado de Moçambique.
     */
    fun getPostalCodeLocality(code: String): String? {
        val cleaned = code.filter { it.isDigit() }
        return legacyPostalCodes[cleaned]?.get("locality")
    }

    /**
     * Retorna a província correspondente a um código postal legado de Moçambique.
     */
    fun getPostalCodeProvince(code: String): String? {
        val cleaned = code.filter { it.isDigit() }
        return legacyPostalCodes[cleaned]?.get("province")
    }


    /**
     * Identifica a carteira móvel (Mobile Wallet) associada a um número moçambicano.
     */
    fun getMobileWallet(phone: String): String? {
        val operatorName = getMobileOperator(phone) ?: return null
        val wallets = mapOf(
            "Vodacom" to "M-Pesa",
            "Tmcel" to "mKesh",
            "Movitel" to "e-Mola"
        )
        return wallets[operatorName]
    }

    /**
     * Validates the Mozambican DIRE (Documento de Identificação de Residente Estrangeiro).
     * Supports the modern SENAMI format (9 digits + 1 letter, e.g., 120345678A)
     * as well as legacy formats (e.g., 00008312C or 12C00008312C).
     */
    fun isValidDIRE(dire: String): Boolean {
        val cleaned = dire.replace(Regex("[\\s\\-]"), "").uppercase()
        return Regex("^(?:\\d{8}[A-Z]|\\d{2}[A-Z]\\d{8}[A-Z0-9]|\\d{9}[A-Z])$").matches(cleaned)
    }

    /**
     * Validates the Mozambican Passport.
     * Official format: Exactly 2 letters followed by 7 numeric digits (E.g.: AO1234567).
     */
    fun isValidPassport(passport: String): Boolean {
        val cleaned = passport.replace(Regex("[\\s\\-]"), "").uppercase()
        return Regex("^[A-Z]{2}\\d{7}$").matches(cleaned)
    }

    /**
     * Validates the Mozambican Driving License (Carta de Condução).
     * Supports the modern INATRO biometric format (2 letters + 7 digits, e.g., MP1234567)
     * as well as legacy formats (e.g., M123456).
     */
    fun isValidDrivingLicense(license: String): Boolean {
        val cleaned = license.replace(Regex("[\\s\\-]"), "").uppercase()
        return Regex("^(?:[A-Z]\\d{5,7}|\\d{12}[A-Z]|[A-Z]{2}\\d{7})$").matches(cleaned)
    }

    /**
     * Valida o formato do Novo CEP (Formato: XXXX-XX)
     */
    fun isValidNewCEP(cep: String): Boolean {
        return Regex("^\\d{4}-\\d{2}$").matches(cep.trim())
    }

    /**
     * Sugere Novos Códigos de Endereçamento Postal (CEP) baseados numa entrada.
     */
    fun suggestCEPs(input: String): List<Map<String, String>> {
        val cleaned = input.trim()
        if (cleaned.isEmpty()) return emptyList()

        val isDigits = cleaned.replace("-", "").all { it.isDigit() }
        var searchPrefixes: List<String> = emptyList()

        if (isDigits && cleaned.length == 4 && CepData.legacyToNewCEPPrefix.containsKey(cleaned)) {
            searchPrefixes = CepData.legacyToNewCEPPrefix[cleaned] ?: emptyList()
        }

        val results = mutableListOf<Map<String, String>>()
        val cleanedLower = cleaned.lowercase()

        for (item in CepData.newCEPData) {
            if (searchPrefixes.isNotEmpty()) {
                val cep = item["cep"] ?: ""
                if (searchPrefixes.any { cep.startsWith(it) }) {
                    results.add(item)
                }
            } else {
                val cep = item["cep"]?.lowercase() ?: ""
                val province = item["province"]?.lowercase() ?: ""
                val district = item["district"]?.lowercase() ?: ""
                val locality = item["locality"]?.lowercase() ?: ""
                
                if (cep.contains(cleanedLower) || province.contains(cleanedLower) || 
                    district.contains(cleanedLower) || locality.contains(cleanedLower)) {
                    results.add(item)
                }
            }
        }
        return results
    }
}