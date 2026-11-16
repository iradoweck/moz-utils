# moz-utils (PHP)

A biblioteca definitiva de código aberto para PHP, com zero dependências externas, tipagem estrita (`strict_types=1`) e execução *offline-first*, concebida para sistemas empresariais em **Moçambique**.

[![Packagist](https://img.shields.io/badge/Packagist-v0.4.0-F28D1A?logo=packagist&logoColor=white)](https://packagist.org/packages/iradoweck/moz-utils)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://github.com/iradoweck/moz-utils/blob/main/LICENSE)
[![CI](https://github.com/iradoweck/moz-utils/actions/workflows/ci.yml/badge.svg)](https://github.com/iradoweck/moz-utils/actions/workflows/ci.yml)
[![Website](https://img.shields.io/badge/Docs-Website-blue)](https://iradoweck.github.io/moz-utils/)

> **Autor:** Edmilson Muacigarro (@iradoweck)  
> **Documentação Oficial:** [iradoweck.github.io/moz-utils](https://iradoweck.github.io/moz-utils/)  
> **Repositório GitHub:** [iradoweck/moz-utils](https://github.com/iradoweck/moz-utils)

---

## 🌍 A Visão

Desenvolver software comercial e corporativo para o mercado moçambicano requer lidar constantemente com especificidades locais:
- 🔎 **Validação do NUIT pela Autoridade Tributária (AT)** — O cálculo com algoritmo do Módulo 11 e matriz de ponderação oficial deve ser rigoroso para evitar rejeições no e-Tributação.
- 📱 **Roteamento de Operadoras e Carteiras Móveis** — Identificação em tempo real de linhas Vodacom (M-Pesa), Tmcel (mKesh) e Movitel (e-Mola) segundo as atribuições do INCM.
- 🏦 **Módulo Bancário (NIB & IBAN)** — Validação da norma ISO 7064 Módulo 97-10 para o NIB moçambicano de 21 dígitos e conversão automática para o IBAN oficial (`MZ59`).
- 🗺️ **Divisão Territorial e Novo CEP** — Catálogo offline com as 11 províncias, 161 distritos e a base de dados do novo código postal de 6 dígitos (`XXXX-XX`).
- 🪪 **Validação de Documentos Civis** — Bilhete de Identidade (12 dígitos + 1 letra), DIRE, Passaporte e Carta de Condução.

O `moz-utils` oferece uma solução robusta e unificada, pronta para produção, sem requisições HTTP externas e sem dependências pesadas de terceiros.

---

## 💻 Requisitos do Sistema

- **PHP**: `>= 8.3` (totalmente compatível e otimizado para PHP 8.3 e 8.4+).
- **Tipagem**: Código-fonte desenvolvido com `declare(strict_types=1);` em todas as classes, tirando partido das otimizações de tipagem nativas do PHP moderno.
- **Frameworks**: Pronto para Laravel (10 e 11), Symfony (6 e 7), WordPress, Drupal e microsserviços PHP puros.

---

## 📦 Instalação

Adicione o pacote ao seu projeto via Composer:

```bash
composer require iradoweck/moz-utils
```

---

## 🚀 Guia Completo de Utilização

### 🏦 Sistema Financeiro e Bancário (NIB, IBAN e Catálogo de Bancos)

O módulo bancário implementa a validação matemática oficial do **Número de Identificação Bancária (NIB)** conforme o padrão do Banco de Moçambique e a norma **ISO 7064 Módulo 97-10**, além do suporte completo ao **IBAN Moçambicano** (`MZ59` + 21 dígitos).

Você pode utilizar os métodos através de `Iradoweck\MozUtils\MozUtils` ou diretamente pela classe dedicada `Iradoweck\MozUtils\Bank`.

```php
use Iradoweck\MozUtils\MozUtils;
use Iradoweck\MozUtils\Bank;

// NIB moçambicano de 21 dígitos (BBBB AAAA CCCCCCCCCCC KK)
$nibExemplo = '000100001234567890194';

// 1. Validação matemática oficial (ISO 7064 Módulo 97-10)
var_dump(MozUtils::isValidNIB($nibExemplo)); // bool(true)
var_dump(MozUtils::isValidNIB('000100001234567890100')); // bool(false) - dígito verificador adulterado
var_dump(MozUtils::isValidNIB('999900001234567890100')); // bool(false) - banco inexistente

// 2. Formatação canónica (BBBB.AAAA.CCCCCCCCCCC.KK)
echo MozUtils::formatNIB($nibExemplo); // "0001.0000.12345678901.94"

// 3. Obtenção de dados cadastrais do banco emissor
$banco = Bank::getBankByNIB($nibExemplo);
print_r($banco);
/*
Array
(
    [code] => 0001
    [name] => Banco Internacional de Moçambique
    [short_name] => Millennium BIM
    [shortName] => Millennium BIM
)
*/

// 4. Conversão para o IBAN oficial de Moçambique (MZ59 + 21 dígitos)
$iban = MozUtils::nibToIBAN($nibExemplo);
echo $iban; // "MZ59000100001234567890194"

// 5. Validação de IBAN moçambicano
var_dump(MozUtils::isValidIBAN($iban)); // bool(true)
var_dump(MozUtils::isValidIBAN('MZ59 0001 0000 1234 5678 9019 4')); // bool(true) - tolerante a espaços
var_dump(MozUtils::isValidIBAN('PT50000100001234567890194')); // bool(false) - prefixo internacional inválido

// 6. Catálogo dos 18 bancos comerciais oficiais
echo "Total de bancos catalogados: " . count(MozUtils::BANKS) . PHP_EOL;
echo "Banco 0008: " . MozUtils::BANKS['0008']['short_name'] . PHP_EOL; // BCI
echo "Banco 0003: " . MozUtils::BANKS['0003']['short_name'] . PHP_EOL; // Standard Bank
```

#### ⚙️ Por Dentro da Lógica Bancária: Módulo 97-10
O NIB em Moçambique é estruturado em:
- `BBBB` (4 dígitos): Código de compensação da instituição bancária perante o Banco de Moçambique.
- `AAAA` (4 dígitos): Código do balcão / agência.
- `CCCCCCCCCCC` (11 dígitos): Número da conta bancária com preenchimento de zeros à esquerda.
- `KK` (2 dígitos): Dígitos verificadores de segurança.

A aritmética modular em PHP utiliza cálculo iterativo dígito a dígito para prevenir estouros de precisão de inteiros em plataformas de 64 bits, garantindo cálculo exato sem dependência das extensões `bcmath` ou `gmp`.

---

### 📱 Telefonia, Operadoras e Carteiras Móveis

Validação, normalização e extração de metadados para telecomunicações de Moçambique (Vodacom, Tmcel e Movitel).

```php
use Iradoweck\MozUtils\MozUtils;

// 1. Validação (aceita formatos com ou sem código internacional +258, hífens ou espaços)
var_dump(MozUtils::isValidMozambicanPhone('841234567'));          // bool(true)
var_dump(MozUtils::isValidMozambicanPhone('+258 82 123 4567'));    // bool(true)
var_dump(MozUtils::isValidMozambicanPhone('811234567'));           // bool(false) - prefixo 81 não existe

// 2. Identificação de Operadora Móvel
echo MozUtils::getMobileOperator('841234567'); // "Vodacom"
echo MozUtils::getMobileOperator('821234567'); // "Tmcel"
echo MozUtils::getMobileOperator('861234567'); // "Movitel"

// 3. Identificação de Carteira Móvel (Mobile Money)
echo MozUtils::getMobileWallet('841234567'); // "M-Pesa"
echo MozUtils::getMobileWallet('821234567'); // "mKesh"
echo MozUtils::getMobileWallet('861234567'); // "e-Mola"

// 4. Formatação no padrão internacional legível
echo MozUtils::formatMozambicanPhone('841234567'); // "+258 84 123 4567"

// 5. Geração de Links Directos para WhatsApp com sanitização
$url = MozUtils::buildWhatsAppUrl('841234567', 'Olá! Gostaria de mais informações.');
echo $url; // "https://wa.me/258841234567?text=Ol%C3%A1%21+Gostaria+de+mais+informa%C3%A7%C3%B5es."
```

#### ⚙️ Prefixos Oficiais atribuídos pelo INCM:
- **Vodacom Moçambique**: Prefixos `84` e `85` (Carteira: **M-Pesa**).
- **Tmcel (Moçambique Telecom)**: Prefixos `82` e `83` (Carteira: **mKesh**).
- **Movitel**: Prefixos `86`, `87` e `88` (Carteira: **e-Mola**).

---

### 🪪 Documentos de Identificação Civil e Fiscal

Validação estrutural e algorítmica para cadastro de clientes, colaboradores e fornecedores.

```php
use Iradoweck\MozUtils\MozUtils;

// 1. NUIT (Número Único de Identificação Tributária - 9 dígitos)
var_dump(MozUtils::isValidNUIT('100000008')); // bool(true) - Pessoa Singular
var_dump(MozUtils::isValidNUIT('400000001')); // bool(true) - Pessoa Colectiva
var_dump(MozUtils::isValidNUIT('123456789')); // bool(false) - checksum Módulo 11 inválido

// Classificação da Entidade pela Autoridade Tributária
echo MozUtils::getNUITEntityType('100000008'); // "Pessoas Singulares"
echo MozUtils::getNUITEntityType('400000001'); // "Pessoas Colectivas"

// 2. Bilhete de Identidade (B.I. - 12 dígitos seguidos de 1 letra maiúscula)
var_dump(MozUtils::isValidBI('110101234567A')); // bool(true)
var_dump(MozUtils::isValidBI('1101012345671')); // bool(false) - terminação não alfabética

// 3. DIRE (Documento de Identificação e Residência para Estrangeiros)
var_dump(MozUtils::isValidDIRE('120345678A')); // bool(true)

// 4. Passaporte Moçambicano (2 letras seguidas de 7 dígitos)
var_dump(MozUtils::isValidPassport('AO1234567')); // bool(true)

// 5. Carta de Condução
var_dump(MozUtils::isValidDrivingLicense('MP1234567')); // bool(true)
```

#### ⚙️ O Algoritmo do NUIT Moçambicano
A Autoridade Tributária adota uma equação de **Módulo 11** com a matriz de ponderação fixa `[8, 9, 4, 5, 6, 7, 8, 9]`. Os primeiros 8 dígitos são multiplicados pelos respetivos pesos. O resto da divisão por 11 é mapeado na tabela de substituição `"01234567891"` para determinar o dígito verificador final.

A classificação das entidades é definida pelo primeiro dígito:
- **1, 2, 3**: Pessoas Singulares (cidadãos nacionais, estrangeiros e empresários em nome individual).
- **4, 5**: Pessoas Colectivas (Sociedades por Quotas, S.A., Lda., Associações, Cooperativas).
- **6**: Entidades Equiparadas (Heranças jacentes, condomínios, consórcios).
- **7**: Estado e Instituições Públicas (Ministérios, Direcções Nacionais, Municípios).
- **8**: Outras Entidades.
- **9**: Entidades Estrangeiras e Representações Diplomáticas.

---

### 💰 Moeda Nacional (Metical - MZN)

Formatação e conversão monetária de acordo com as convenções oficiais de Moçambique.

```php
use Iradoweck\MozUtils\MozUtils;

// Formatação (aceita float ou int sob tipagem estrita)
echo MozUtils::formatMZN(1500);          // "1 500,00 MT"
echo MozUtils::formatMZN(2500000.50);    // "2 500 000,50 MT"
echo MozUtils::formatMZN(75.25, 'MZN');   // "75,25 MZN"

// Parsing seguro de strings monetárias para float
var_dump(MozUtils::parseMZN('1 500,00 MT'));      // float(1500)
var_dump(MozUtils::parseMZN('2.500.000,50 MZN'));  // float(2500000.5)
```

---

### 🗺️ Divisão Geográfica e Distritos

Base territorial contendo as 11 províncias e os 161 distritos de Moçambique, com busca tolerante a IDs, siglas e nomes por extenso.

```php
use Iradoweck\MozUtils\MozUtils;

// 1. Busca flexível de distritos (aceita "Maputo", "mpp", "MPT", "Cabo Delgado", etc.)
$distritosMaputo = MozUtils::getDistrictsByProvince('Maputo');
print_r($distritosMaputo);
// Array ( [0] => Boane [1] => Magude [2] => Manhiça [3] => Marracuene ... )

$distritosNampula = MozUtils::getDistrictsByProvince('NPL');
echo "Total de distritos em Nampula: " . count($distritosNampula) . PHP_EOL;

// 2. Lista global de todos os 161 distritos
$todosDistritos = MozUtils::getAllDistricts();
echo "Total nacional de distritos: " . count($todosDistritos) . PHP_EOL;
```

---

### 📬 Sistema Postal e Novo CEP Moçambicano

Suporte completo para a nova geração de Códigos de Endereçamento Postal (`XXXX-XX`) e compatibilidade com os códigos legados de 4 dígitos.

```php
use Iradoweck\MozUtils\MozUtils;

// 1. Novo CEP (XXXX-XX)
var_dump(MozUtils::isValidNewCEP('0909-09')); // bool(true) - Namutequeliua, Nampula
var_dump(MozUtils::isValidNewCEP('1100-01')); // bool(true) - Maputo Central

// Motor de autocompletar e sugestão offline
$resultados = MozUtils::suggestCEPs('namutequeliua');
print_r($resultados[0]);
/*
Array
(
    [cep] => 0909-09
    [province] => Nampula
    [district] => Nampula
    [locality] => Namutequeliua
)
*/

// 2. Códigos Postais Legados (4 dígitos)
var_dump(MozUtils::isValidPostalCode('3100')); // bool(true)
echo MozUtils::getPostalCodeLocality('3100');   // "Nampula"
echo MozUtils::getPostalCodeProvince('3100');   // "Nampula"
```

---

### 🧹 Saneamento e Higienização de Dados

```php
use Iradoweck\MozUtils\MozUtils;

// Validação de nomes pessoais (exige >= 2 caracteres alfabéticos, rejeita caracteres pontuais)
var_dump(MozUtils::isValidName('João da Silva')); // bool(true)
var_dump(MozUtils::isValidName('---'));           // bool(false)

// Sanitização de nomes (Title Case preservando preposições da língua portuguesa)
echo MozUtils::sanitizeName('JOÃO MANUEL DA COSTA E SILVA');
// "João Manuel da Costa e Silva"

// Sanitização de documentos numéricos e alfanuméricos
echo MozUtils::sanitizeDocumentField(' 100.000.008 '); // "100000008"
echo MozUtils::sanitizeAlphanumericField('110 101 234567a'); // "110101234567A"
```

---

## 🛠️ Guias Práticos de Integração com Frameworks

### 1. Integração com Laravel 10 / 11 (Form Request)

Crie um Form Request com validação estrita e sanitização automática dos dados antes de atingir os controllers:

```php
<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Iradoweck\MozUtils\MozUtils;

class StoreCustomerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:150',
                function (string $attribute, mixed $value, \Closure $fail): void {
                    if (!MozUtils::isValidName((string)$value)) {
                        $fail('O nome fornecido contém caracteres inválidos.');
                    }
                },
            ],
            'phone' => [
                'required',
                'string',
                function (string $attribute, mixed $value, \Closure $fail): void {
                    if (!MozUtils::isValidMozambicanPhone((string)$value)) {
                        $fail('Número de telefone inválido para Moçambique (deve ser Vodacom, Tmcel ou Movitel).');
                    }
                },
            ],
            'nuit' => [
                'required',
                'string',
                function (string $attribute, mixed $value, \Closure $fail): void {
                    if (!MozUtils::isValidNUIT((string)$value)) {
                        $fail('O NUIT informado é matematicamente inválido pela Autoridade Tributária.');
                    }
                },
            ],
            'bi' => [
                'required',
                'string',
                function (string $attribute, mixed $value, \Closure $fail): void {
                    if (!MozUtils::isValidBI((string)$value)) {
                        $fail('O B.I. deve possuir 12 dígitos seguidos de 1 letra maiúscula.');
                    }
                },
            ],
            'nib' => [
                'nullable',
                'string',
                function (string $attribute, mixed $value, \Closure $fail): void {
                    if ($value && !MozUtils::isValidNIB((string)$value)) {
                        $fail('O NIB informado é inválido perante as normas do Banco de Moçambique.');
                    }
                },
            ],
        ];
    }

    /**
     * Higieniza e formata os dados após a aprovação das regras de validação.
     */
    protected function passedValidation(): void
    {
        $this->merge([
            'name' => MozUtils::sanitizeName((string)$this->input('name')),
            'phone' => MozUtils::formatMozambicanPhone((string)$this->input('phone')),
            'nuit' => MozUtils::sanitizeDocumentField((string)$this->input('nuit')),
            'bi' => MozUtils::sanitizeAlphanumericField((string)$this->input('bi')),
            'nib' => $this->filled('nib') ? MozUtils::formatNIB((string)$this->input('nib')) : null,
        ]);
    }
}
```

---

### 2. Laravel Invokable Validation Rules

Crie regras reutilizáveis para os seus modelos e formulários no Laravel:

```php
<?php

declare(strict_types=1);

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Iradoweck\MozUtils\MozUtils;

class MozambicanPhoneRule implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (!is_string($value) || !MozUtils::isValidMozambicanPhone($value)) {
            $fail('O campo :attribute deve ser um número móvel válido de Moçambique.');
        }
    }
}
```

Regra para Validação de NIB:

```php
<?php

declare(strict_types=1);

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Iradoweck\MozUtils\MozUtils;

class MozambicanNibRule implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (!is_string($value) || !MozUtils::isValidNIB($value)) {
            $fail('O :attribute não é um Número de Identificação Bancária (NIB) válido.');
        }
    }
}
```

Uso no Controller ou Form Request:

```php
use App\Rules\MozambicanPhoneRule;
use App\Rules\MozambicanNibRule;

$request->validate([
    'telefone' => ['required', new MozambicanPhoneRule()],
    'nib' => ['required', new MozambicanNibRule()],
]);
```

---

### 3. Integração com Symfony (Custom Constraint & Validator)

Validação nativa com anotações e atributos PHP 8 para entidades do Symfony e formulários:

```php
<?php

declare(strict_types=1);

namespace App\Validator;

use Symfony\Component\Validator\Constraint;

#[\Attribute(\Attribute::TARGET_PROPERTY | \Attribute::TARGET_METHOD | \Attribute::IS_REPEATABLE)]
class MozNuit extends Constraint
{
    public string $message = 'O NUIT "{{ string }}" é inválido perante o algoritmo da Autoridade Tributária.';
}
```

Implementação do Validador:

```php
<?php

declare(strict_types=1);

namespace App\Validator;

use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Exception\UnexpectedTypeException;
use Iradoweck\MozUtils\MozUtils;

class MozNuitValidator extends ConstraintValidator
{
    public function validate(mixed $value, Constraint $constraint): void
    {
        if (!$constraint instanceof MozNuit) {
            throw new UnexpectedTypeException($constraint, MozNuit::class);
        }

        if (null === $value || '' === $value) {
            return;
        }

        if (!MozUtils::isValidNUIT((string)$value)) {
            $this->context->buildViolation($constraint->message)
                ->setParameter('{{ string }}', (string)$value)
                ->addViolation();
        }
    }
}
```

Uso na Entidade Doctrine / Symfony:

```php
namespace App\Entity;

use App\Validator\MozNuit;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
class Empresa
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 9, unique: true)]
    #[MozNuit]
    private ?string $nuit = null;

    // Getters e Setters...
}
```

---

## 🛠️ Resolução de Problemas (Troubleshooting)

- **Erro Fatal: Class "MozUtils\MozUtils" not found**  
  *Causa:* O namespace oficial da biblioteca no Composer é `Iradoweck\MozUtils\MozUtils`. Certifique-se de importar `use Iradoweck\MozUtils\MozUtils;` e `use Iradoweck\MozUtils\Bank;`.
  
- **Exceção de argumento inválido ao consultar distritos de "Maputo"**  
  *Causa:* A partir da versão 0.4.0, `MozUtils::getDistrictsByProvince("Maputo")` aceita tanto o nome completo quanto a sigla `"MPT"` ou o identificador `"mpp"`, resolvendo por padrão para Maputo Província. Para Maputo Cidade, utilize `"mpc"`, `"MC"` ou `"Maputo (Cidade)"`.

---

## 📜 Licença

Distribuído sob a licença de código aberto **Apache-2.0**. Consulte o arquivo [LICENSE](https://github.com/iradoweck/moz-utils/blob/main/LICENSE) para mais detalhes.
