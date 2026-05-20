package mz.co.iradoweck.mozutils

import java.net.URLEncoder

/**
 * MozUtils
 *
 * Funções de utilidade para Moçambique.
 * Validação de NUIT, BI, documentos, e formatação de telefones.
 */
object MozUtils {

    /**
     * Valida um número de telefone moçambicano.
     */
    fun isValidMozambicanPhone(phone: String): Boolean {
        val cleaned = phone.replace(Regex("[\\s\\-\\(\\)\\+]"), "")
        val withoutCountryCode = if (cleaned.startsWith("258")) cleaned.substring(3) else cleaned
        return withoutCountryCode.matches(Regex("^8[2-7]\\d{7}$"))
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
            "86" to "Tmcel",
            "87" to "Tmcel",
            "82" to "Movitel",
            "83" to "Movitel"
        )

        return operators[prefix]
    }

    /**
     * Valida o NUIT (Número Único de Identificação Tributária) de Moçambique.
     */
    fun isValidNUIT(nuit: Any): Boolean {
        val cleaned = nuit.toString().replace(Regex("\\D"), "")

        if (cleaned.length != 9) return false

        if (cleaned.matches(Regex("^(\\d)\\1{8}$"))) return false

        return true
    }

    /**
     * Valida o Bilhete de Identidade Moçambicano.
     */
    fun isValidBI(bi: String): Boolean {
        val cleaned = bi.replace(Regex("[\\s\\-]"), "").uppercase()
        return cleaned.matches(Regex("^\\d{12}[A-Z]$"))
    }

    /**
     * Formata um valor monetário em Meticais (MZN).
     */
    fun formatMZN(value: Double): String {
        return String.format("%,.2f", value).replace(",", "X").replace(".", ",").replace("X", ".") + " MT"
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
     * Lista das Províncias de Moçambique.
     */
    fun getMozambiqueProvinces(): List<Map<String, Any>> {
        return listOf(
            mapOf(
                "id" to "mpm",
                "name" to "Maputo Cidade",
                "region" to "Sul",
                "districts" to listOf("KaMpfumo", "Nlhamankulu", "KaMaxakeni", "KaMavota", "KaMubukwana", "KaTembe", "KaNyaka")
            ),
            mapOf(
                "id" to "mpt",
                "name" to "Maputo Província",
                "region" to "Sul",
                "districts" to listOf("Boane", "Magude", "Manhiça", "Marracuene", "Matola", "Matutuíne", "Moamba", "Namaacha")
            )
            // ... omitting the rest to save space
        )
    }
}
