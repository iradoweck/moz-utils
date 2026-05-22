package com.edmilsonmuacigarro.mozutils

import java.net.URLEncoder

data class District(
    val name: String,
    val provinceId: String,
    val postos_administrativos: List<String>,
    val bairros: List<String>
)

/**
 * MozUtils
 *
 * Funções de utilidade para Moçambique.
 * Validação de NUIT, BI, documentos, e formatação de telefones.
 */
object MozUtils {

    /**
     * Valida um número de telefone moçambicano.
     * Operadoras válidas: Vodacom (84/85), Tmcel (82/83), Movitel (86/87/88)
     */
    fun isValidMozambicanPhone(phone: String): Boolean {
        val cleaned = phone.replace(Regex("[\\s\\-\\(\\)\\+]"), "")
        val withoutCountryCode = if (cleaned.startsWith("258")) cleaned.substring(3) else cleaned
        return withoutCountryCode.matches(Regex("^8[2-8]\\d{7}$"))
    }

    /**
     * Formata um número de telefone moçambicano para o padrão internacional.
     */
    fun formatMozambicanPhone(phone: String): String {
        val cleaned = phone.replace(Regex("[\\s\\-\\(\\)\\+]"), "")
        val withoutCountryCode = if (cleaned.startsWith("258")) cleaned.substring(3) else cleaned

        require(isValidMozambicanPhone(withoutCountryCode)) { "Número de telefone inválido: $phone" }

        val prefix = withoutCountryCode.substring(0, 2)
        val part1 = withoutCountryCode.substring(2, 5)
        val part2 = withoutCountryCode.substring(5)

        return "+258 $prefix $part1 $part2"
    }

    /**
     * Identifica a operadora de um número moçambicano.
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

        var sum = 0
        for (i in 0 until 8) {
            sum += Character.getNumericValue(cleaned[i]) * (9 - i)
        }

        val remainder = sum % 11
        val expectedDigit = if (remainder <= 1) 0 else 11 - remainder

        return Character.getNumericValue(cleaned[8]) == expectedDigit
    }

    /**
     * Classifica o tipo de entidade com base no primeiro dígito do NUIT.
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
     * Valida o Bilhete de Identidade Moçambicano.
     */
    fun isValidBI(bi: String): Boolean {
        val cleaned = bi.replace(Regex("[\\s\\-]"), "").uppercase()
        return cleaned.matches(Regex("^\\d{12}[A-Z]$"))
    }

    /**
     * Formata um valor monetário em Meticais seguindo o padrão oficial de Moçambique.
     *
     * Padrão oficial (SI + AT):
     * - Separador de milhares: espaço
     * - Separador decimal: vírgula
     * - Símbolo após o valor, separado por espaço
     *
     * @param value Valor numérico
     * @param currency "MT" (nacional) ou "MZN" (ISO 4217)
     * @return Valor formatado (ex: "1 500,00 MT")
     */
    fun formatMZN(value: Double, currency: String = "MT"): String {
        val sign = if (value < 0) "-" else ""
        val absolute = Math.abs(value)

        // Formatar com 2 casas decimais
        val formatted = String.format("%,.2f", absolute)

        // Substituir: vírgula dos milhares → espaço, ponto decimal → vírgula
        val result = formatted.replace(",", " ").replace(".", ",")

        return "$sign$result $currency"
    }

    /**
     * Gera um URL de contacto WhatsApp com mensagem pré-formatada.
     */
    fun buildWhatsAppUrl(phone: String, message: String = ""): String {
        val cleaned = phone.replace(Regex("[\\s\\-\\(\\)\\+]"), "")
        val international = if (cleaned.startsWith("258")) cleaned else "258$cleaned"

        val encodedMessage = if (message.isNotEmpty()) "?text=${URLEncoder.encode(message, "UTF-8")}" else ""
        return "https://wa.me/$international$encodedMessage"
    }

    /**
     * Lista oficial das Províncias de Moçambique com os seus distritos.
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
                            "postos_administrativos" to listOf("Ancuabe", "Metoro", "Meza"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Balama",
                            "postos_administrativos" to listOf("Balama", "Chapa", "Kuekue", "Mavala"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Chiúre",
                            "postos_administrativos" to listOf("Chiúre", "Chiúre-Velho", "Katapua", "Mazeze", "Namogelia", "Manoane"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Ibo",
                            "postos_administrativos" to listOf("Ibo", "Quirimba"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Macomia",
                            "postos_administrativos" to listOf("Macomia", "Chai", "Mucojo", "Quiterajo"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Mecúfi",
                            "postos_administrativos" to listOf("Mecúfi", "Murrébuè"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Meluco",
                            "postos_administrativos" to listOf("Meluco", "Muaguide"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Metuge",
                            "postos_administrativos" to listOf("Metuge", "Mieze"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Mocímboa da Praia",
                            "postos_administrativos" to listOf("Mocímboa da Praia", "Diaca", "Mbau"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Montepuez",
                            "postos_administrativos" to listOf("Montepuez", "Mapupulo", "Namanhumbir", "Nairoto", "Napaula"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Mueda",
                            "postos_administrativos" to listOf("Mueda", "Chapa", "Imbuho", "Negomano", "N'gapa"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Muidumbe",
                            "postos_administrativos" to listOf("Muidumbe", "Chitunda", "Miteda"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Namuno",
                            "postos_administrativos" to listOf("Namuno", "Machoca", "Meloco", "Ncumpe", "Luli"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Nangade",
                            "postos_administrativos" to listOf("Nangade", "Ntamba"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Palma",
                            "postos_administrativos" to listOf("Palma", "Olumbe", "Quionga"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Pemba (Cidade)",
                            "postos_administrativos" to listOf("Pemba"),
                            "bairros" to listOf(
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
                            "postos_administrativos" to listOf("Quissanga", "Mahate", "Bilibiza"),
                            "bairros" to emptyList<String>()
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
                            "postos_administrativos" to listOf("Chimbonila", "Meponda"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Cuamba",
                            "postos_administrativos" to listOf("Cuamba", "Lúrio", "Etatara"),
                            "bairros" to listOf("Ribaue", "Mutxora", "Ademo", "Aeroporto")
                        ),
                        mapOf(
                            "name" to "Lago",
                            "postos_administrativos" to listOf("Metangula", "Cobué", "Luninho", "Maniamba"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Lichinga (Cidade)",
                            "postos_administrativos" to listOf("Lichinga"),
                            "bairros" to listOf("Central", "Popular", "Chimba", "Cerâmica", "Ngaula", "Sanjala", "Chiuaula")
                        ),
                        mapOf(
                            "name" to "Majune",
                            "postos_administrativos" to listOf("Majune", "Mua", "Nairrobi"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Mandimba",
                            "postos_administrativos" to listOf("Mandimba", "Mitande"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Marrupa",
                            "postos_administrativos" to listOf("Marrupa", "Marangira", "Nungo"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Maúa",
                            "postos_administrativos" to listOf("Maúa", "Maiaca"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Mavago",
                            "postos_administrativos" to listOf("Mavago", "M'saize"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Mecanhelas",
                            "postos_administrativos" to listOf("Mecanhelas", "Chiuta"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Mecula",
                            "postos_administrativos" to listOf("Mecula", "Matondovela"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Metarica",
                            "postos_administrativos" to listOf("Metarica", "Nacuanha"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Muembe",
                            "postos_administrativos" to listOf("Muembe", "Chiconono"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "N'gauma",
                            "postos_administrativos" to listOf("Massangulo", "Itepela"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Nipepe",
                            "postos_administrativos" to listOf("Nipepe", "Muatuca"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Sanga",
                            "postos_administrativos" to listOf("Unango", "Malamuila", "Matchedje"),
                            "bairros" to emptyList<String>()
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
                            "postos_administrativos" to listOf("Angoche", "Aube", "Namaponda"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Eráti",
                            "postos_administrativos" to listOf("Namapa", "Alua", "Nakarari"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Ilha de Moçambique",
                            "postos_administrativos" to listOf("Ilha de Moçambique", "Lumbo"),
                            "bairros" to listOf("Museu", "Litine", "Areal", "Marangonha")
                        ),
                        mapOf(
                            "name" to "Lalaua",
                            "postos_administrativos" to listOf("Lalaua", "Meti"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Larde",
                            "postos_administrativos" to listOf("Larde", "Mucuali"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Liúpo",
                            "postos_administrativos" to listOf("Liúpo", "Quinga"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Malema",
                            "postos_administrativos" to listOf("Malema", "Chinga", "Mutuali"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Meconta",
                            "postos_administrativos" to listOf("Meconta", "Corrane", "Namialo"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Mecubúri",
                            "postos_administrativos" to listOf("Mecubúri", "Milhana", "Muite", "Namina"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Memba",
                            "postos_administrativos" to listOf("Memba", "Chipene", "Mazua", "Lurio"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Mogincual",
                            "postos_administrativos" to listOf("Mogincual", "Quixaxe"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Mogovolas",
                            "postos_administrativos" to listOf("Nametil", "Calipo", "Ilute", "Muatua"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Moma",
                            "postos_administrativos" to listOf("Macone", "Chalai", "Lunga"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Monapo",
                            "postos_administrativos" to listOf("Monapo", "Itoculo", "Netia"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Mossuril",
                            "postos_administrativos" to listOf("Mossuril", "Lunga", "Matibane"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Muecate",
                            "postos_administrativos" to listOf("Muecate", "Imala", "Muculuone"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Murrupula",
                            "postos_administrativos" to listOf("Murrupula", "Chinga", "Nihessiue"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Nacala-a-Velha",
                            "postos_administrativos" to listOf("Nacala-a-Velha", "Covo"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Nacala Porto",
                            "postos_administrativos" to listOf("Nacala Porto", "Muanona"),
                            "bairros" to listOf("Mutiva", "Triângulo", "Ontupaia", "Quissanga")
                        ),
                        mapOf(
                            "name" to "Nampula (Cidade)",
                            "postos_administrativos" to listOf("Urbano Central", "Muatala", "Muhala", "Namikopo", "Napipine", "Natikiri"),
                            "bairros" to listOf("Central", "Muatala", "Muhala", "Namikopo", "Napipine", "Natikiri", "Marrere", "Namutequeliua")
                        ),
                        mapOf(
                            "name" to "Nacarôa",
                            "postos_administrativos" to listOf("Nacarôa", "Saua-Saua"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Rapale",
                            "postos_administrativos" to listOf("Rapale", "Anchilo", "Mutivaze"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Ribáuè",
                            "postos_administrativos" to listOf("Ribáuè", "Cunle", "Iapala"),
                            "bairros" to emptyList<String>()
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
                            "postos_administrativos" to listOf("Alto Molócuè", "Nauela"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Chinde",
                            "postos_administrativos" to listOf("Chinde", "Micaune"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Derre",
                            "postos_administrativos" to listOf("Derre", "Guerissa"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Gilé",
                            "postos_administrativos" to listOf("Gilé", "Alto Ligonha"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Gurué",
                            "postos_administrativos" to listOf("Gurué", "Lioma", "Nepuíte"),
                            "bairros" to listOf("Bairro Central", "Mucuapa", "Nacuacue")
                        ),
                        mapOf(
                            "name" to "Ile",
                            "postos_administrativos" to listOf("Ile", "Socone"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Inhassunge",
                            "postos_administrativos" to listOf("Mucupia", "Gonhane"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Luabo",
                            "postos_administrativos" to listOf("Luabo", "Chimbazo"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Lugela",
                            "postos_administrativos" to listOf("Lugela", "Tacuane", "Munhamade"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Maganja da Costa",
                            "postos_administrativos" to listOf("Maganja da Costa", "Baleia"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Milange",
                            "postos_administrativos" to listOf("Milange", "Majaua", "Mongue"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Mocuba",
                            "postos_administrativos" to listOf("Mocuba", "Mualama", "Namanjavira"),
                            "bairros" to listOf("Central", "Aeroporto", "Paraíso")
                        ),
                        mapOf(
                            "name" to "Mocubela",
                            "postos_administrativos" to listOf("Mocubela", "Bajone"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Molumbo",
                            "postos_administrativos" to listOf("Molumbo", "Corromana"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Mopeia",
                            "postos_administrativos" to listOf("Mopeia", "Campo"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Morrumbala",
                            "postos_administrativos" to listOf("Morrumbala", "Chire", "Megaza"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Mulevala",
                            "postos_administrativos" to listOf("Mulevala", "Chirimane"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Namacurra",
                            "postos_administrativos" to listOf("Namacurra", "Macuse"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Namarrói",
                            "postos_administrativos" to listOf("Namarrói", "Regone"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Nicoadala",
                            "postos_administrativos" to listOf("Nicoadala", "Maquival"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Pebane",
                            "postos_administrativos" to listOf("Pebane", "Mulela", "Naburi"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Quelimane (Cidade)",
                            "postos_administrativos" to listOf("Urbano nº 1", "Urbano nº 2", "Urbano nº 3", "Urbano nº 4"),
                            "bairros" to listOf("Central", "Cementório", "Inhassunge", "Icidua", "Chingo", "Matacuane")
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
                            "postos_administrativos" to listOf("Ulongue", "Domue"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Cahora-Bassa",
                            "postos_administrativos" to listOf("Songo", "Chitima", "Muxeza"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Changara",
                            "postos_administrativos" to listOf("Luenha", "Chioco", "Mavago"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Chifunde",
                            "postos_administrativos" to listOf("Chifunde", "Mualadzi", "Nsadzu"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Chiuta",
                            "postos_administrativos" to listOf("Manje", "Kazula"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Dôa",
                            "postos_administrativos" to listOf("Dôa", "Chueza"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Macanga",
                            "postos_administrativos" to listOf("Furancungo", "Chinde"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Magoé",
                            "postos_administrativos" to listOf("Mpende", "Chinthopo", "Mukumbura"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Marara",
                            "postos_administrativos" to listOf("Marara", "M'fuba"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Marávia",
                            "postos_administrativos" to listOf("Fingoé", "Chiputo", "Molumbo"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Moatize",
                            "postos_administrativos" to listOf("Moatize", "Kambulatsitsi", "Zóbuè"),
                            "bairros" to listOf("Bairro 25 de Setembro", "Liberdade", "Chithatha")
                        ),
                        mapOf(
                            "name" to "Mutarara",
                            "postos_administrativos" to listOf("Nhamayabué", "Inhangoma"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Tete (Cidade)",
                            "postos_administrativos" to listOf("Tete"),
                            "bairros" to listOf("Chingo", "Degue", "Matundo", "Mpadue", "Josina Machel", "Francisco Manyanga")
                        ),
                        mapOf(
                            "name" to "Tsangano",
                            "postos_administrativos" to listOf("Tsangano", "Ntengo-Wambuzi"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Zumbo",
                            "postos_administrativos" to listOf("Zumbo", "Muze", "Zambue"),
                            "bairros" to emptyList<String>()
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
                            "postos_administrativos" to listOf("Catandica", "Nhampassa", "Chuala"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Chimoio (Cidade)",
                            "postos_administrativos" to listOf("Urbano nº 1", "Urbano nº 2", "Urbano nº 3"),
                            "bairros" to listOf("Central", "7 de Setembro", "Soalpo", "Nandfe", "Vila Nova", "Cordor")
                        ),
                        mapOf(
                            "name" to "Gondola",
                            "postos_administrativos" to listOf("Gondola", "Cafumpe", "Amatongas"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Guro",
                            "postos_administrativos" to listOf("Guro", "Mandie", "Nhamassonge"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Macate",
                            "postos_administrativos" to listOf("Macate", "Marera"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Machaze",
                            "postos_administrativos" to listOf("Machaze", "Save"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Macossa",
                            "postos_administrativos" to listOf("Macossa", "Nhamagua"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Manica",
                            "postos_administrativos" to listOf("Manica", "Messica", "Mavonde"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Mossurize",
                            "postos_administrativos" to listOf("Espungabera", "Dacata"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Sussundenga",
                            "postos_administrativos" to listOf("Sussundenga", "Dombe", "Muhoa"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Tambara",
                            "postos_administrativos" to listOf("Nhacolo", "Buzua"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Vanduzi",
                            "postos_administrativos" to listOf("Vanduzi", "Matsinho"),
                            "bairros" to emptyList<String>()
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
                            "postos_administrativos" to listOf("Central", "Munhava", "Manga Loot", "Inhamizua"),
                            "bairros" to listOf("Chaimite", "Macuti", "Ponta Gêa", "Munhava", "Manga", "Vaz", "Esturro", "Cipangara")
                        ),
                        mapOf(
                            "name" to "Búzi",
                            "postos_administrativos" to listOf("Búzi", "Estaquinha", "Nova Sofala"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Caia",
                            "postos_administrativos" to listOf("Caia", "Sena", "Murraça"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Chemba",
                            "postos_administrativos" to listOf("Chemba", "Chiramba", "Mulima"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Cheringoma",
                            "postos_administrativos" to listOf("Inhaminga", "Muanza"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Chibabava",
                            "postos_administrativos" to listOf("Chibabava", "Goonda", "Muxúnguè"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Dondo",
                            "postos_administrativos" to listOf("Dondo", "Mafambisse"),
                            "bairros" to listOf("Chibuabuamua", "Central", "Planalto")
                        ),
                        mapOf(
                            "name" to "Gorongosa",
                            "postos_administrativos" to listOf("Gorongosa", "Nhamadzi", "Vanduzi"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Machanga",
                            "postos_administrativos" to listOf("Machanga", "Divinhe"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Maringué",
                            "postos_administrativos" to listOf("Maringué", "Canxixe", "Subui"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Marromeu",
                            "postos_administrativos" to listOf("Marromeu", "Chupanga"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Muanza",
                            "postos_administrativos" to listOf("Muanza", "Galinha"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Nhamatanda",
                            "postos_administrativos" to listOf("Nhamatanda", "Tica"),
                            "bairros" to emptyList<String>()
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
                            "postos_administrativos" to listOf("Funhalouro", "Tome"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Govuro",
                            "postos_administrativos" to listOf("Nova Mambone", "Jofane"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Homoíne",
                            "postos_administrativos" to listOf("Homoíne", "Pembe"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Inhambane (Cidade)",
                            "postos_administrativos" to listOf("Inhambane"),
                            "bairros" to listOf("Balane", "Chamane", "Josina Machel", "Muelé", "Liberdade", "Aeroporto")
                        ),
                        mapOf(
                            "name" to "Inharrime",
                            "postos_administrativos" to listOf("Inharrime", "Chambone"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Inhassoro",
                            "postos_administrativos" to listOf("Inhassoro", "Bazaruto"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Jangamo",
                            "postos_administrativos" to listOf("Jangamo", "Cumbana"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Mabote",
                            "postos_administrativos" to listOf("Mabote", "Zimane"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Massinga",
                            "postos_administrativos" to listOf("Massinga", "Chicomo"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Maxixe (Cidade)",
                            "postos_administrativos" to listOf("Maxixe"),
                            "bairros" to listOf("Bairro Central", "Chamba", "Macupula", "Nalazi")
                        ),
                        mapOf(
                            "name" to "Morrumbene",
                            "postos_administrativos" to listOf("Morrumbene", "Mucodoene"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Panda",
                            "postos_administrativos" to listOf("Panda", "Muelé"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Vilankulo",
                            "postos_administrativos" to listOf("Vilankulo", "Mapinhane"),
                            "bairros" to listOf("Bairro Central", "Mucoque", "Alto Macassa")
                        ),
                        mapOf(
                            "name" to "Zavala",
                            "postos_administrativos" to listOf("Quissico", "Zandamela"),
                            "bairros" to emptyList<String>()
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
                            "postos_administrativos" to listOf("Macia", "Bilene Macia", "Chissano"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Chibuto",
                            "postos_administrativos" to listOf("Chibuto", "Chaimite", "Changanine"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Chicualacuala",
                            "postos_administrativos" to listOf("Chicualacuala", "Mapai"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Chigubo",
                            "postos_administrativos" to listOf("Chigubo", "Ndindiza"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Chókwè",
                            "postos_administrativos" to listOf("Chókwè", "Lionde", "Macarretane"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Chonguene",
                            "postos_administrativos" to listOf("Chonguene", "Chongoene"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Guijá",
                            "postos_administrativos" to listOf("Canicado", "Chivonguene"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Limpopo",
                            "postos_administrativos" to listOf("Chicumbane", "Zongoene"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Mabalane",
                            "postos_administrativos" to listOf("Mabalane", "Combomune"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Manjacaze",
                            "postos_administrativos" to listOf("Manjacaze", "Chidenguele"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Mapai",
                            "postos_administrativos" to listOf("Mapai", "Machaila"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Massangena",
                            "postos_administrativos" to listOf("Massangena", "Mavue"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Massingir",
                            "postos_administrativos" to listOf("Massingir", "Zulo"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Xai-Xai (Cidade)",
                            "postos_administrativos" to listOf("Xai-Xai"),
                            "bairros" to listOf("Central", "Alto-Gaza", "Inhamissa", "Panjane", "Chicumbane", "Patrice Lumumba")
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
                            "postos_administrativos" to listOf("Boane", "Matola-Rio"),
                            "bairros" to listOf("Bairro Central", "Campinho", "Massaca")
                        ),
                        mapOf(
                            "name" to "Magude",
                            "postos_administrativos" to listOf("Magude", "Mapulanguene", "Motaze"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Manhiça",
                            "postos_administrativos" to listOf("Manhiça", "Xinavane", "3 de Fevereiro"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Marracuene",
                            "postos_administrativos" to listOf("Marracuene", "Machubo"),
                            "bairros" to listOf("Aliança", "Cumbe", "Habel Jafar")
                        ),
                        mapOf(
                            "name" to "Matola (Cidade)",
                            "postos_administrativos" to listOf("Matola", "Infulene", "Machava"),
                            "bairros" to listOf("Matola Sede", "Fomento", "Liberdade", "T3", "Trevo", "Machava Socimol", "Cingatela")
                        ),
                        mapOf(
                            "name" to "Matutuíne",
                            "postos_administrativos" to listOf("Bela Vista", "Catembe", "Zitundo"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Moamba",
                            "postos_administrativos" to listOf("Moamba", "Ressano Garcia", "Pessene"),
                            "bairros" to emptyList<String>()
                        ),
                        mapOf(
                            "name" to "Namaacha",
                            "postos_administrativos" to listOf("Namaacha", "Changalane"),
                            "bairros" to emptyList<String>()
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
                            "postos_administrativos" to listOf("KaMpfumo"),
                            "bairros" to listOf(
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
                            "postos_administrativos" to listOf("Nlhamankulu"),
                            "bairros" to listOf("Aeroporto A/B", "Chamanculo A/B/C/D", "Malanga", "Xipamanine", "Munhuana", "Unidade 7")
                        ),
                        mapOf(
                            "name" to "KaMaxaquene",
                            "postos_administrativos" to listOf("KaMaxaquene"),
                            "bairros" to listOf("Maxaquene A/B/C/D", "Polana Caniço A/B", "Urbanização", "Mafalala")
                        ),
                        mapOf(
                            "name" to "KaMavota",
                            "postos_administrativos" to listOf("KaMavota"),
                            "bairros" to listOf("Mavalane A/B", "FPLM", "Hulene A/B", "Ferroviário", "Costa do Sol", "Polana Caniço B")
                        ),
                        mapOf(
                            "name" to "KaMubukwana",
                            "postos_administrativos" to listOf("KaMubukwana"),
                            "bairros" to listOf("Bagamoyo", "George Dimitrov", "Inhagoia A/B", "Magoanine A/B/C", "Zimpeto")
                        ),
                        mapOf(
                            "name" to "KaTembe",
                            "postos_administrativos" to listOf("KaTembe"),
                            "bairros" to listOf("Gwaza Muthini", "Incassane", "Inguide", "Chali", "Chamissava")
                        ),
                        mapOf(
                            "name" to "KaNyaka",
                            "postos_administrativos" to listOf("KaNyaka"),
                            "bairros" to listOf("Ribzene", "Nghanyane", "Chadwane")
                        )
                    )
                )
            )
    }

    /**
     * Retorna a lista de distritos pertencentes a uma determinada província.
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
     * Retorna uma lista plana com todos os 161 distritos e respetivos IDs de província.
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
                        postos_administrativos = district["postos_administrativos"] as List<String>,
                        bairros = district["bairros"] as List<String>
                    )
                )
            }
        }
        return list;
    }
}
