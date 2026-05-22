package com.edmilsonmuacigarro.mozutils

import java.net.URLEncoder

data class District(val name: String, val provinceId: String)

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
            mapOf("id" to "cab", "name" to "Cabo Delgado", "region" to "Norte", "sigla" to "CBD", "districts" to listOf("Ancuabe", "Balama", "Chiúre", "Ibo", "Macomia", "Mecúfi", "Meluco", "Metuge", "Mocímboa da Praia", "Montepuez", "Mueda", "Muidumbe", "Namuno", "Nangade", "Palma", "Pemba (Cidade)", "Quissanga")),
            mapOf("id" to "nia", "name" to "Niassa", "region" to "Norte", "sigla" to "NS", "districts" to listOf("Chimbonila", "Cuamba", "Lago", "Lichinga (Cidade)", "Majune", "Mandimba", "Marrupa", "Maúa", "Mavago", "Mecanhelas", "Mecula", "Metarica", "Muembe", "N'gauma", "Nipepe", "Sanga")),
            mapOf("id" to "npl", "name" to "Nampula", "region" to "Norte", "sigla" to "NPL", "districts" to listOf("Angoche", "Eráti", "Ilha de Moçambique", "Lalaua", "Larde", "Liúpo", "Malema", "Meconta", "Mecubúri", "Memba", "Mogincual", "Mogovolas", "Moma", "Monapo", "Mossuril", "Muecate", "Murrupula", "Nacala-a-Velha", "Nacala Porto", "Nampula (Cidade)", "Nacarôa", "Rapale", "Ribáuè")),
            mapOf("id" to "zam", "name" to "Zambézia", "region" to "Centro", "sigla" to "ZMB", "districts" to listOf("Alto Molócuè", "Chinde", "Derre", "Gilé", "Gurué", "Ile", "Inhassunge", "Luabo", "Lugela", "Maganja da Costa", "Milange", "Mocuba", "Mocubela", "Molumbo", "Mopeia", "Morrumbala", "Mulevala", "Namacurra", "Namarrói", "Nicoadala", "Pebane", "Quelimane (Cidade)")),
            mapOf("id" to "tet", "name" to "Tete", "region" to "Centro", "sigla" to "TT", "districts" to listOf("Angónia", "Cahora-Bassa", "Changara", "Chifunde", "Chiuta", "Dôa", "Macanga", "Magoé", "Marara", "Marávia", "Moatize", "Mutarara", "Tete (Cidade)", "Tsangano", "Zumbo")),
            mapOf("id" to "man", "name" to "Manica", "region" to "Centro", "sigla" to "MN", "districts" to listOf("Bárue", "Chimoio (Cidade)", "Gondola", "Guro", "Macate", "Machaze", "Macossa", "Manica", "Mossurize", "Sussundenga", "Tambara", "Vanduzi")),
            mapOf("id" to "sof", "name" to "Sofala", "region" to "Centro", "sigla" to "SF", "districts" to listOf("Beira (Cidade)", "Búzi", "Caia", "Chemba", "Cheringoma", "Chibabava", "Dondo", "Gorongosa", "Machanga", "Maringué", "Marromeu", "Muanza", "Nhamatanda")),
            mapOf("id" to "inh", "name" to "Inhambane", "region" to "Sul", "sigla" to "INH", "districts" to listOf("Funhalouro", "Govuro", "Homoíne", "Inhambane (Cidade)", "Inharrime", "Inhassoro", "Jangamo", "Mabote", "Massinga", "Maxixe (Cidade)", "Morrumbene", "Panda", "Vilankulo", "Zavala")),
            mapOf("id" to "gaz", "name" to "Gaza", "region" to "Sul", "sigla" to "GZ", "districts" to listOf("Bilene", "Chibuto", "Chicualacuala", "Chigubo", "Chókwè", "Chonguene", "Guijá", "Limpopo", "Mabalane", "Manjacaze", "Mapai", "Massangena", "Massingir", "Xai-Xai (Cidade)")),
            mapOf("id" to "mpp", "name" to "Maputo (Província)", "region" to "Sul", "sigla" to "MPT", "districts" to listOf("Boane", "Magude", "Manhiça", "Marracuene", "Matola (Cidade)", "Matutuíne", "Moamba", "Namaacha")),
            mapOf("id" to "mpc", "name" to "Maputo (Cidade)", "region" to "Sul", "sigla" to "MC", "districts" to listOf("KaMpfumo", "Nlhamankulu", "KaMaxaquene", "KaMavota", "KaMubukwana", "KaTembe", "KaNyaka"))
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
                return province["districts"] as List<String>
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
            val districts = province["districts"] as List<String>
            for (district in districts) {
                list.add(District(district, pId))
            }
        }
        return list
    }
}
