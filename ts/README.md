<h1 align="center">@iradoweck/moz-utils</h1>

<p align="center">
  <b>TypeScript & JavaScript</b>
</p>

<p align="center">
  <i>O Canivete Suíço para programadores em Moçambique — agora pronto para uso no ecossistema Node.js, navegadores e frameworks modernos.</i>
</p>

---

## 📦 Instalação

Adicione o pacote ao seu projeto utilizando o seu gestor de pacotes favorito:

```bash
# Usando NPM
npm install @iradoweck/moz-utils

# Usando PNPM
pnpm add @iradoweck/moz-utils

# Usando Yarn
yarn add @iradoweck/moz-utils

# Usando Bun
bun add @iradoweck/moz-utils
```

---

## 🚀 Guia de Referência da API

### 1. Validação de Documentos

#### `isValidNUIT(nuit: string | number): boolean`
Valida se um NUIT é sintaticamente válido seguindo as regras do Módulo 11 da Autoridade Tributária.
```typescript
import { isValidNUIT } from '@iradoweck/moz-utils';

isValidNUIT('123456789'); // true
isValidNUIT(111111111);   // false (número repetido)
```

#### `getNUITEntityType(nuit: string | number): string | null`
Retorna a classificação descritiva da entidade associada ao NUIT com base no primeiro dígito. Retorna `null` se o NUIT for inválido.
```typescript
import { getNUITEntityType } from '@iradoweck/moz-utils';

getNUITEntityType('100000008'); // "Singular (Cidadãos nacionais/estrangeiros e ENI)"
getNUITEntityType('400000006'); // "Colectiva (Sociedades por Quotas, SA, Lda, Associações)"
```

#### `isValidBI(bi: string): boolean`
Valida se o formato do Bilhete de Identidade moçambicano está correto (12 dígitos + 1 letra). Ignora espaços e traços, e é insensível a maiúsculas/minúsculas na letra final.
```typescript
import { isValidBI } from '@iradoweck/moz-utils';

isValidBI('110101234567A'); // true
isValidBI('110101234567 a'); // true (ignora espaços e trata minúsculas)
isValidBI('11010123456');    // false
```

---

### 2. Utilitários de Comunicação e Telemóveis

#### `isValidMozambicanPhone(phone: string): boolean`
Valida se o número pertence a uma operadora móvel nacional (Vodacom, Tmcel ou Movitel) e se tem um formato correto (com ou sem o prefixo internacional `+258`).
```typescript
import { isValidMozambicanPhone } from '@iradoweck/moz-utils';

isValidMozambicanPhone('841234567');      // true
isValidMozambicanPhone('+258869876543');  // true
isValidMozambicanPhone('991234567');      // false
```

#### `formatMozambicanPhone(phone: string): string`
Formata um número válido no formato de exibição internacional padrão: `+258 XX XXX XXXX`. Lança um erro se o número for inválido.
```typescript
import { formatMozambicanPhone } from '@iradoweck/moz-utils';

formatMozambicanPhone('841234567'); // "+258 84 123 4567"
```

#### `getMobileOperator(phone: string): 'Vodacom' | 'Tmcel' | 'Movitel' | null`
Identifica e retorna a operadora do telemóvel fornecido. Retorna `null` se o número for inválido ou não corresponder a nenhuma operadora conhecida.
```typescript
import { getMobileOperator } from '@iradoweck/moz-utils';

getMobileOperator('841234567'); // "Vodacom"
getMobileOperator('823214567'); // "Tmcel"
```

#### `buildWhatsAppUrl(phone: string, message?: string): string`
Cria um link direto para abrir uma conversa no WhatsApp para o número indicado, já com o código de país moçambicano (`258`) e mensagem (opcional) codificada.
```typescript
import { buildWhatsAppUrl } from '@iradoweck/moz-utils';

buildWhatsAppUrl('841234567', 'Olá Formiga Antonio, bem-vindo a Nampula!');
// "https://wa.me/258841234567?text=Ol%C3%A1%20Formiga%20Antonio%2C%20bem-vindo%20a%20Nampula%21"
```

---

### 3. Utilitários Monetários

#### `formatMZN(value: number, currency?: 'MT' | 'MZN'): string`
Formata um número decimal/inteiro no padrão de representação de Meticais, com espaços separando milhares e vírgulas para decimais.
```typescript
import { formatMZN } from '@iradoweck/moz-utils';

formatMZN(1250.50);        // "1 250,50 MT"
formatMZN(5000000, 'MZN'); // "5 000 000,00 MZN"
formatMZN(-500);           // "-500,00 MT"
```

---

### 4. Base de Dados Geográfica Integrada

O pacote exporta a constante `mozambiqueProvinces` e duas funções auxiliares para pesquisa administrativa:

```typescript
import { 
  mozambiqueProvinces, 
  getDistrictsByProvince, 
  getAllDistricts,
  District 
} from '@iradoweck/moz-utils';

// 1. Aceder diretamente à lista hierárquica estática
console.log(mozambiqueProvinces[0]);
/*
{
  id: 'cab',
  name: 'Cabo Delgado',
  region: 'Norte',
  sigla: 'CBD',
  districts: [
    { name: 'Ancuabe', postos_administrativos: [...], bairros: [] },
    ...
  ]
}
*/

// 2. Obter distritos de uma província específica pelo ID (ex: 'npl' para Nampula)
const distritosNampula = getDistrictsByProvince('npl');
// ['Angoche', 'Eráti', 'Ilha de Moçambique', 'Lalaua', ..., 'Nampula (Cidade)', ...]

// 3. Obter uma lista plana (flat) de todos os 161 distritos nacionais
const todosDistritos = getAllDistricts(); // Array de District
```

## 📄 Licença

Este projeto é licenciado sob a licença **AGPL-3.0-or-later**.

---

<p align="center">
  Desenvolvido por <b>Edmilson Muacigarro</b> e contribuidores.
</p>
