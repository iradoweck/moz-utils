# MozUtils (PHP)

> O Canivete Suíço para programadores em Moçambique — portado para PHP. Ideal para integração com Laravel, Symfony, WordPress e aplicações PHP modernas.

---

## 📦 Instalação

Pode instalar a biblioteca através do Composer localmente (apontando para o repositório local) ou configurando o autoload:

```json
// No seu composer.json do projeto
{
    "repositories": [
        {
            "type": "path",
            "url": "../caminho/para/moz-utils/php"
        }
    ],
    "require": {
        "iradoweck/moz-utils": "*"
    }
}
```

E execute:
```bash
composer update
```

---

## 🚀 Guia de Referência da API

Todas as utilidades são expostas como métodos estáticos na classe `Iradoweck\MozUtils\MozUtils`.

### 1. Validação de Documentos

#### `MozUtils::isValidNUIT(string|int $nuit): bool`
Valida se um NUIT é sintaticamente válido segundo as regras da AT baseadas no Módulo 11.
```php
use Iradoweck\MozUtils\MozUtils;

MozUtils::isValidNUIT('123456789'); // true
MozUtils::isValidNUIT(111111111);   // false
```

#### `MozUtils::getNUITEntityType(string|int $nuit): ?string`
Retorna o tipo de entidade com base no NUIT fornecido. Retorna `null` se for inválido.
```php
use Iradoweck\MozUtils\MozUtils;

MozUtils::getNUITEntityType('100000008'); // "Singular (Cidadãos nacionais/estrangeiros e ENI)"
MozUtils::getNUITEntityType('400000006'); // "Colectiva (Sociedades por Quotas, SA, Lda, Associações)"
```

#### `MozUtils::isValidBI(string $bi): bool`
Valida o Bilhete de Identidade moçambicano (12 dígitos + 1 letra). Ignora espaços e traços.
```php
use Iradoweck\MozUtils\MozUtils;

MozUtils::isValidBI('110101234567A');  // true
MozUtils::isValidBI('110101234567 a');  // true
```

---

### 2. Telecomunicações e WhatsApp

#### `MozUtils::isValidMozambicanPhone(string $phone): bool`
Valida se o número é de Moçambique e pertence a uma das operadoras móveis locais (Vodacom, Tmcel ou Movitel).
```php
use Iradoweck\MozUtils\MozUtils;

MozUtils::isValidMozambicanPhone('841234567');     // true
MozUtils::isValidMozambicanPhone('+258861234567'); // true
```

#### `MozUtils::formatMozambicanPhone(string $phone): string`
Formata o número no padrão de apresentação internacional `+258 XX XXX XXXX`. Lança uma exceção `InvalidArgumentException` se o número for inválido.
```php
use Iradoweck\MozUtils\MozUtils;

MozUtils::formatMozambicanPhone('841234567'); // "+258 84 123 4567"
```

#### `MozUtils::getMobileOperator(string $phone): ?string`
Identifica a operadora móvel (`'Vodacom'`, `'Tmcel'` ou `'Movitel'`).
```php
use Iradoweck\MozUtils\MozUtils;

MozUtils::getMobileOperator('841234567'); // "Vodacom"
```

#### `MozUtils::buildWhatsAppUrl(string $phone, string $message = ''): string`
Gera uma hiperligação para iniciar conversa direta no WhatsApp.
```php
use Iradoweck\MozUtils\MozUtils;

MozUtils::buildWhatsAppUrl('841234567', 'Olá Formiga Antonio, bem-vindo a Nampula!');
// "https://wa.me/258841234567?text=Ol%C3%A1%20Formiga%20Antonio%2C%20bem-vindo%20a%20Nampula%21"
```

---

### 3. Moeda Nacional

#### `MozUtils::formatMZN(float $value, string $currency = 'MT'): string`
Formata valores monetários em Meticais de acordo com o padrão local (ex: `-1 500,00 MT`).
```php
use Iradoweck\MozUtils\MozUtils;

MozUtils::formatMZN(1250.5);          // "1 250,50 MT"
MozUtils::formatMZN(10000000, 'MZN'); // "10 000 000,00 MZN"
```

---

### 4. Base Geográfica

```php
use Iradoweck\MozUtils\MozUtils;

// 1. Obter array de províncias, distritos, postos e bairros
$provinces = MozUtils::getMozambiqueProvinces();

// 2. Obter distritos de uma província (ex: 'npl' para Nampula)
$districts = MozUtils::getDistrictsByProvince('npl'); // ['Angoche', 'Eráti', ...]

// 3. Obter todos os distritos planos do país
$allDistricts = MozUtils::getAllDistricts();
```

## 📄 Licença

Este projeto é licenciado sob a licença **AGPL-3.0-or-later**.

---

<p align="center">
  Desenvolvido por <b>Edmilson Muacigarro</b> e contribuidores.
</p>
