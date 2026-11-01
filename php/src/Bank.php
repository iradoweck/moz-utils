<?php

declare(strict_types=1);

namespace Iradoweck\MozUtils;

/**
 * Módulo Bancário de Moçambique: Catálogo de Bancos, NIB e IBAN.
 */
class Bank
{
    /**
     * Catálogo oficial das principais instituições bancárias comerciais de Moçambique (22 códigos BM e SIMO).
     */
    public const array BANKS = [
        '0001' => ['code' => '0001', 'name' => 'Banco Internacional de Moçambique', 'short_name' => 'Millennium BIM', 'shortName' => 'Millennium BIM'],
        '0003' => ['code' => '0003', 'name' => 'Standard Bank Moçambique', 'short_name' => 'Standard Bank', 'shortName' => 'Standard Bank'],
        '0006' => ['code' => '0006', 'name' => 'Absa Bank Moçambique', 'short_name' => 'Absa', 'shortName' => 'Absa'],
        '0007' => ['code' => '0007', 'name' => 'Nedbank Moçambique', 'short_name' => 'Nedbank', 'shortName' => 'Nedbank'],
        '0008' => ['code' => '0008', 'name' => 'Banco Comercial e de Investimentos', 'short_name' => 'BCI', 'shortName' => 'BCI'],
        '0014' => ['code' => '0014', 'name' => 'First National Bank Moçambique', 'short_name' => 'FNB', 'shortName' => 'FNB'],
        '0016' => ['code' => '0016', 'name' => 'Moza Banco', 'short_name' => 'Moza Banco', 'shortName' => 'Moza Banco'],
        '0021' => ['code' => '0021', 'name' => 'Access Bank Moçambique', 'short_name' => 'Access Bank', 'shortName' => 'Access Bank'],
        '0024' => ['code' => '0024', 'name' => 'Ecobank Moçambique', 'short_name' => 'Ecobank', 'shortName' => 'Ecobank'],
        '0025' => ['code' => '0025', 'name' => 'Banco Nacional de Investimento', 'short_name' => 'BNI', 'shortName' => 'BNI'],
        '0030' => ['code' => '0030', 'name' => 'Société Générale Moçambique', 'short_name' => 'Société Générale', 'shortName' => 'Société Générale'],
        '0034' => ['code' => '0034', 'name' => 'Moza Banco', 'short_name' => 'Moza Banco', 'shortName' => 'Moza Banco'],
        '0038' => ['code' => '0038', 'name' => 'First Capital Bank Moçambique', 'short_name' => 'First Capital Bank', 'shortName' => 'First Capital Bank'],
        '0041' => ['code' => '0041', 'name' => 'Banco Letshego', 'short_name' => 'Letshego', 'shortName' => 'Letshego'],
        '0043' => ['code' => '0043', 'name' => 'First Capital Bank Moçambique', 'short_name' => 'First Capital Bank', 'shortName' => 'First Capital Bank'],
        '0044' => ['code' => '0044', 'name' => 'MyBucks Banking Corporation', 'short_name' => 'MyBucks', 'shortName' => 'MyBucks'],
        '0045' => ['code' => '0045', 'name' => 'Banco de Desenvolvimento de Moçambique', 'short_name' => 'BDM', 'shortName' => 'BDM'],
        '0048' => ['code' => '0048', 'name' => 'Banco Mais', 'short_name' => 'Banco Mais', 'shortName' => 'Banco Mais'],
        '0050' => ['code' => '0050', 'name' => 'Standard Chartered Bank Moçambique', 'short_name' => 'Standard Chartered', 'shortName' => 'Standard Chartered'],
        '0052' => ['code' => '0052', 'name' => 'Banco Big Moçambique', 'short_name' => 'Banco Big', 'shortName' => 'Banco Big'],
        '0056' => ['code' => '0056', 'name' => 'Banco Letshego', 'short_name' => 'Letshego', 'shortName' => 'Letshego'],
        '0057' => ['code' => '0057', 'name' => 'Banco Nacional de Investimento', 'short_name' => 'BNI', 'shortName' => 'BNI'],
    ];

    /**
     * Valida o Número de Identificação Bancária (NIB) de Moçambique (21 dígitos, Módulo 97 ISO 7064).
     */
    public static function isValidNIB(string $nib): bool
    {
        $cleaned = preg_replace('/\D/', '', $nib);
        if (strlen($cleaned) !== 21) {
            return false;
        }

        $bankCode = substr($cleaned, 0, 4);
        if (!isset(self::BANKS[$bankCode])) {
            return false;
        }

        $first19 = substr($cleaned, 0, 19);
        $remainder = 0;
        for ($i = 0; $i < 19; $i++) {
            $remainder = ($remainder * 10 + (int)$first19[$i]) % 97;
        }
        $remainder = ($remainder * 100) % 97;
        $expectedCheck = 98 - $remainder;
        $checkDigits = (int)substr($cleaned, 19, 2);

        return $expectedCheck === $checkDigits;
    }

    /**
     * Formata o NIB moçambicano no padrão BBBB.AAAA.CCCCCCCCCCC.KK.
     *
     * @throws \InvalidArgumentException Se o NIB for inválido.
     */
    public static function formatNIB(string $nib): string
    {
        $cleaned = preg_replace('/\D/', '', $nib);
        if (!self::isValidNIB($cleaned)) {
            throw new \InvalidArgumentException("NIB moçambicano inválido: {$nib}");
        }

        return substr($cleaned, 0, 4) . '.' .
               substr($cleaned, 4, 4) . '.' .
               substr($cleaned, 8, 11) . '.' .
               substr($cleaned, 19, 2);
    }

    /**
     * Retorna os dados do banco associado ao NIB, ou null se não encontrado.
     */
    public static function getBankByNIB(string $nib): ?array
    {
        $cleaned = preg_replace('/\D/', '', $nib);
        if (strlen($cleaned) < 4) {
            return null;
        }

        return self::BANKS[substr($cleaned, 0, 4)] ?? null;
    }

    /**
     * Converte um NIB moçambicano válido em IBAN (MZ59 + 21 dígitos).
     *
     * @throws \InvalidArgumentException Se o NIB for inválido.
     */
    public static function nibToIBAN(string $nib): string
    {
        $cleaned = preg_replace('/\D/', '', $nib);
        if (!self::isValidNIB($cleaned)) {
            throw new \InvalidArgumentException("NIB moçambicano inválido: {$nib}");
        }

        return "MZ59{$cleaned}";
    }

    /**
     * Valida um IBAN de Moçambique (25 caracteres: prefixo MZ59 seguido de NIB válido).
     */
    public static function isValidIBAN(string $iban): bool
    {
        $cleaned = strtoupper((string)preg_replace('/\s+/', '', $iban));
        if (strlen($cleaned) !== 25 || !str_starts_with($cleaned, 'MZ59')) {
            return false;
        }

        return self::isValidNIB(substr($cleaned, 4));
    }
}
