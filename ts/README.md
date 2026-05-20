# @iradoweck/moz-utils

> Funções de utilidade para Moçambique — validação de NUIT, BI, documentos, e formatação de telefones.

## Instalação

```bash
pnpm add @iradoweck/moz-utils
```

## Funções Disponíveis

```typescript
import {
  isValidMozambicanPhone,
  formatMozambicanPhone,
  getMobileOperator,
  isValidNUIT,
  isValidBI,
  formatMZN,
  buildWhatsAppUrl,
  mozambiqueProvinces
} from '@iradoweck/moz-utils'

// Validar NUIT e BI
isValidNUIT('123456789')                 // true
isValidBI('110101234567A')               // true

// Validar número de telefone
isValidMozambicanPhone('841234567')      // true
isValidMozambicanPhone('911234567')      // false

// Formatar para internacional
formatMozambicanPhone('841234567')       // "+258 84 123 4567"

// Identificar operadora
getMobileOperator('841234567')           // "Vodacom"

// Formatar Meticais
formatMZN(1500)                          // "1.500,00 MT"

// Gerar link WhatsApp
buildWhatsAppUrl('841234567', 'Olá!')    // "https://wa.me/258841234567?text=Ol%C3%A1!"

// Aceder a dados geográficos
console.log(mozambiqueProvinces[0].name) // "Maputo Cidade"
```

## Licença

AGPL-3.0-or-later — Consulte o ficheiro [LICENSE](./LICENSE) para mais detalhes.
