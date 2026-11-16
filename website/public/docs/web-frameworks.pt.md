# Integração com Frameworks Web & Mobile

O `moz-utils` foi desenhado com arquitetura de dependência zero, facilitando a sua integração nos ecossistemas corporativos mais populares para backends, frontends e aplicações mobile.

Abaixo estão exemplos práticos e prontos para produção.

---

## 1. Zod (TypeScript / Next.js / Node.js)

Validação de esquemas e contratos de API com tipagem estrita no Next.js (App Router, Server Actions) ou Express:

```typescript
import { z } from 'zod';
import { 
  isValidNUIT, 
  isValidBI, 
  isValidMozambicanPhone, 
  formatMozambicanPhone,
  isValidNIB,
  parseMZN 
} from 'moz-utils';

export const customerSchema = z.object({
  fullName: z.string().min(3, 'Nome deve conter pelo menos 3 caracteres'),
  
  nuit: z.string().refine(
    (val) => isValidNUIT(val), 
    { message: 'NUIT inválido conforme algoritmo Módulo 11 da AT.' }
  ),

  bi: z.string().refine(
    (val) => isValidBI(val), 
    { message: 'BI inválido (deve ter 12 algarismos e 1 letra maiúscula).' }
  ),

  nib: z.string().refine(
    (val) => isValidNIB(val),
    { message: 'NIB bancário inválido (deve ter 21 dígitos conforme ISO 7064).' }
  ),

  phone: z.string()
    .refine((val) => isValidMozambicanPhone(val), { message: 'Telefone moçambicano inválido.' })
    .transform((val) => formatMozambicanPhone(val)),

  monthlyBudget: z.string().transform((val, ctx) => {
    const parsed = parseMZN(val);
    if (parsed === null) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Valor em Meticais inválido.' });
      return z.NEVER;
    }
    return parsed;
  }),
});
```

---

## 2. Express.js (Node.js REST API)

Middleware e roteamento inteligente de gateways de pagamento móvel (M-Pesa, e-Mola, mKesh):

```typescript
import express, { Request, Response } from 'express';
import { isValidMozambicanPhone, getMobileOperator, getMobileWallet, formatMozambicanPhone } from 'moz-utils';

const app = express();
app.use(express.json());

app.post('/api/payments/c2b', (req: Request, res: Response) => {
  const { phone, amount } = req.body;

  if (!isValidMozambicanPhone(phone)) {
    return res.status(400).json({ 
      error: 'INVALID_PHONE', 
      message: 'O número informado não é um contacto móvel válido em Moçambique.' 
    });
  }

  const wallet = getMobileWallet(phone);     // "M-Pesa" | "e-Mola" | "mKesh"
  const operator = getMobileOperator(phone); // "Vodacom" | "Movitel" | "Tmcel"
  const formatted = formatMozambicanPhone(phone);

  return res.status(200).json({
    success: true,
    phone: formatted,
    routedWallet: wallet,
    operator: operator,
    amount: amount
  });
});
```

---

## 3. NestJS (Custom Pipe & DTO)

Validação declarativa de entrada via Pipes customizados:

```typescript
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { isValidNUIT, sanitizeDocumentField } from 'moz-utils';

@Injectable()
export class NuitValidationPipe implements PipeTransform {
  transform(value: any) {
    if (!value || typeof value !== 'string') {
      throw new BadRequestException('NUIT é obrigatório.');
    }

    const clean = sanitizeDocumentField(value);
    if (!isValidNUIT(clean)) {
      throw new BadRequestException(`O NUIT ${value} é matematicamente inválido pela AT.`);
    }

    return clean;
  }
}
```

---

## 4. React (Dropdown Encadeado Províncias e Distritos)

Formulário de endereço moçambicano com seleção em cascata:

```tsx
import React, { useState } from 'react';
import { mozambiqueProvinces, getDistrictsByProvince } from 'moz-utils';

export function MozambiqueAddressForm() {
  const [selectedProvince, setSelectedProvince] = useState('');
  const [districts, setDistricts] = useState<string[]>([]);

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provinceId = e.target.value;
    setSelectedProvince(provinceId);
    
    if (provinceId) {
      setDistricts(getDistrictsByProvince(provinceId));
    } else {
      setDistricts([]);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <label>
        Província:
        <select value={selectedProvince} onChange={handleProvinceChange}>
          <option value="">Selecione uma província...</option>
          {mozambiqueProvinces.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.sigla})
            </option>
          ))}
        </select>
      </label>

      <label>
        Distrito:
        <select disabled={!selectedProvince}>
          <option value="">Selecione o distrito...</option>
          {districts.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </label>
    </div>
  );
}
```

---

## 5. FastAPI (Python / Pydantic V2)

Validação automática de requisições JSON no FastAPI com modelos Pydantic:

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, field_validator
from moz_utils import is_valid_nuit, is_valid_nib, get_bank_from_nib, sanitize_document_field

app = FastAPI(title="Fintech Moçambique API")

class AccountRegistrationRequest(BaseModel):
    account_name: str
    nuit: str
    nib: str

    @field_validator("nuit")
    @classmethod
    def validate_nuit_field(cls, v: str) -> str:
        clean = sanitize_document_field(v)
        if not is_valid_nuit(clean):
            raise ValueError("NUIT inválido conforme Autoridade Tributária")
        return clean

    @field_validator("nib")
    @classmethod
    def validate_nib_field(cls, v: str) -> str:
        clean = sanitize_document_field(v)
        if not is_valid_nib(clean):
            raise ValueError("NIB moçambicano inválido pela norma ISO 7064")
        return clean

@app.post("/api/register")
def register_account(data: AccountRegistrationRequest):
    bank = get_bank_from_nib(data.nib)
    return {
        "status": "success",
        "beneficiary": data.account_name,
        "nuit": data.nuit,
        "bank": bank.short_name if bank else "Desconhecido"
    }
```

---

## 6. Django (Python Forms & Models)

Validação nativa em formulários Django:

```python
from django import forms
from django.core.exceptions import ValidationError
from moz_utils import is_valid_bi, is_valid_mozambican_phone, format_mozambican_phone

class CustomerForm(forms.Form):
    full_name = forms.CharField(max_length=150, label="Nome Completo")
    bi_number = forms.CharField(max_length=20, label="Bilhete de Identidade")
    phone = forms.CharField(max_length=20, label="Telefone Móvel")

    def clean_bi_number(self):
        bi = self.cleaned_data["bi_number"].strip().upper()
        if not is_valid_bi(bi):
            raise ValidationError("Bilhete de Identidade inválido.")
        return bi

    def clean_phone(self):
        raw_phone = self.cleaned_data["phone"]
        if not is_valid_mozambican_phone(raw_phone):
            raise ValidationError("Número móvel moçambicano inválido (+258).")
        return format_mozambican_phone(raw_phone)
```

---

## 7. Laravel (PHP Custom Rule & FormRequest)

Validação corporativa em aplicações PHP Laravel:

```php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Iradoweck\MozUtils\MozUtils;

class StoreSupplierRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'nuit' => [
                'required',
                'string',
                function ($attribute, $value, $fail) {
                    if (!MozUtils::isValidNUIT($value)) {
                        $fail('O NUIT informado é matematicamente inválido pela AT.');
                    }
                },
            ],
            'nib' => [
                'required',
                'string',
                function ($attribute, $value, $fail) {
                    if (!MozUtils::isValidNIB($value)) {
                        $fail('O NIB informado não cumpre o Módulo 97 do Banco de Moçambique.');
                    }
                },
            ],
        ];
    }
}
```

---

## 8. Flutter / Dart (Mobile Form Validation)

Validação em tempo real em formulários Flutter com `TextFormField`:

```dart
import 'package:flutter/material.dart';
import 'package:moz_utils/moz_utils.dart';

class PaymentForm extends StatelessWidget {
  const PaymentForm({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        TextFormField(
          decoration: const InputDecoration(labelText: 'Contacto Telefónico (+258)'),
          keyboardType: TextInputType.phone,
          validator: (value) {
            if (value == null || !isValidMozambicanPhone(value)) {
              return 'Insira um telemóvel moçambicano válido';
            }
            return null;
          },
        ),
        TextFormField(
          decoration: const InputDecoration(labelText: 'NIB Moçambicano (21 dígitos)'),
          keyboardType: TextInputType.number,
          validator: (value) {
            if (value == null || !isValidNIB(value)) {
              return 'NIB inválido (Módulo 97-10)';
            }
            return null;
          },
        ),
      ],
    );
  }
}
```

---

## 9. Jetpack Compose (Kotlin / Android)

Validação de estado reativo em interfaces Android modernas com Jetpack Compose:

```kotlin
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.edmilsonmuacigarro.mozutils.MozUtils

@Composable
fun RegistrationScreen() {
    var nuitInput by remember { mutableStateOf("") }
    val isNuitValid = remember(nuitInput) {
        if (nuitInput.isEmpty()) true else MozUtils.isValidNUIT(nuitInput)
    }

    Column(modifier = Modifier.padding(16.dp)) {
        OutlinedTextField(
            value = nuitInput,
            onValueChange = { nuitInput = it },
            label = { Text("NUIT do Contribuinte") },
            isError = !isNuitValid && nuitInput.isNotEmpty(),
            supportingText = {
                if (!isNuitValid && nuitInput.isNotEmpty()) {
                    Text("NUIT inválido pela Autoridade Tributária", color = MaterialTheme.colorScheme.error)
                }
            }
        )
    }
}
```
