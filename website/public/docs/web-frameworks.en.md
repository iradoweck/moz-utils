# Web & Mobile Framework Integrations

`moz-utils` is built with a strict zero-runtime-dependency design, making it seamless to integrate into modern web and mobile stacks across backends, frontends, and native mobile apps.

Here are production-ready integration guides.

---

## 1. Zod (TypeScript / Next.js / Node.js)

Type-safe schema validation for Next.js App Router (Server Actions, Route Handlers) and Express:

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
  fullName: z.string().min(3, 'Name must have at least 3 characters'),
  
  nuit: z.string().refine(
    (val) => isValidNUIT(val), 
    { message: 'Invalid NUIT under the Mozambican Tax Authority Modulo 11 algorithm.' }
  ),

  bi: z.string().refine(
    (val) => isValidBI(val), 
    { message: 'Invalid National ID (must contain 12 digits and 1 uppercase letter).' }
  ),

  nib: z.string().refine(
    (val) => isValidNIB(val),
    { message: 'Invalid Bank NIB (must contain 21 digits under ISO 7064).' }
  ),

  phone: z.string()
    .refine((val) => isValidMozambicanPhone(val), { message: 'Invalid Mozambican phone number.' })
    .transform((val) => formatMozambicanPhone(val)),

  monthlyBudget: z.string().transform((val, ctx) => {
    const parsed = parseMZN(val);
    if (parsed === null) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Invalid Metical currency string.' });
      return z.NEVER;
    }
    return parsed;
  }),
});
```

---

## 2. Express.js (Node.js REST API)

Smart telecom and payment routing middleware (M-Pesa, e-Mola, mKesh):

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
      message: 'The provided number is not a valid Mozambican mobile contact.' 
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

Declarative validation via reusable NestJS Pipes:

```typescript
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { isValidNUIT, sanitizeDocumentField } from 'moz-utils';

@Injectable()
export class NuitValidationPipe implements PipeTransform {
  transform(value: any) {
    if (!value || typeof value !== 'string') {
      throw new BadRequestException('NUIT is required.');
    }

    const clean = sanitizeDocumentField(value);
    if (!isValidNUIT(clean)) {
      throw new BadRequestException(`Taxpayer ID ${value} is mathematically invalid under AT rules.`);
    }

    return clean;
  }
}
```

---

## 4. React (Cascading Province & District Dropdowns)

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
        Province:
        <select value={selectedProvince} onChange={handleProvinceChange}>
          <option value="">Select a province...</option>
          {mozambiqueProvinces.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.sigla})
            </option>
          ))}
        </select>
      </label>

      <label>
        District:
        <select disabled={!selectedProvince}>
          <option value="">Select district...</option>
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

Automatic validation with custom field validators in FastAPI:

```python
from fastapi import FastAPI
from pydantic import BaseModel, field_validator
from moz_utils import is_valid_nuit, is_valid_nib, get_bank_from_nib, sanitize_document_field

app = FastAPI(title="Mozambique Fintech API")

class AccountRegistrationRequest(BaseModel):
    account_name: str
    nuit: str
    nib: str

    @field_validator("nuit")
    @classmethod
    def validate_nuit_field(cls, v: str) -> str:
        clean = sanitize_document_field(v)
        if not is_valid_nuit(clean):
            raise ValueError("Invalid NUIT under Mozambican Tax Authority rules")
        return clean

    @field_validator("nib")
    @classmethod
    def validate_nib_field(cls, v: str) -> str:
        clean = sanitize_document_field(v)
        if not is_valid_nib(clean):
            raise ValueError("Invalid Mozambican NIB under ISO 7064 Modulo 97-10")
        return clean

@app.post("/api/register")
def register_account(data: AccountRegistrationRequest):
    bank = get_bank_from_nib(data.nib)
    return {
        "status": "success",
        "beneficiary": data.account_name,
        "nuit": data.nuit,
        "bank": bank.short_name if bank else "Unknown"
    }
```

---

## 6. Django (Python Forms & Models)

```python
from django import forms
from django.core.exceptions import ValidationError
from moz_utils import is_valid_bi, is_valid_mozambican_phone, format_mozambican_phone

class CustomerForm(forms.Form):
    full_name = forms.CharField(max_length=150, label="Full Name")
    bi_number = forms.CharField(max_length=20, label="National ID (BI)")
    phone = forms.CharField(max_length=20, label="Mobile Phone")

    def clean_bi_number(self):
        bi = self.cleaned_data["bi_number"].strip().upper()
        if not is_valid_bi(bi):
            raise ValidationError("Invalid Mozambican National ID (BI).")
        return bi

    def clean_phone(self):
        raw_phone = self.cleaned_data["phone"]
        if not is_valid_mozambican_phone(raw_phone):
            raise ValidationError("Invalid Mozambican mobile phone (+258).")
        return format_mozambican_phone(raw_phone)
```

---

## 7. Laravel (PHP FormRequest & Rules)

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
                        $fail('The provided NUIT is mathematically invalid.');
                    }
                },
            ],
            'nib' => [
                'required',
                'string',
                function ($attribute, $value, $fail) {
                    if (!MozUtils::isValidNIB($value)) {
                        $fail('The provided NIB fails Bank of Mozambique Modulo 97-10 validation.');
                    }
                },
            ],
        ];
    }
}
```

---

## 8. Flutter / Dart (Mobile Form Validation)

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
          decoration: const InputDecoration(labelText: 'Mobile Phone (+258)'),
          keyboardType: TextInputType.phone,
          validator: (value) {
            if (value == null || !isValidMozambicanPhone(value)) {
              return 'Enter a valid Mozambican mobile number';
            }
            return null;
          },
        ),
        TextFormField(
          decoration: const InputDecoration(labelText: 'Mozambican NIB (21 digits)'),
          keyboardType: TextInputType.number,
          validator: (value) {
            if (value == null || !isValidNIB(value)) {
              return 'Invalid NIB (Modulo 97-10 check failed)';
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
            label = { Text("Taxpayer ID (NUIT)") },
            isError = !isNuitValid && nuitInput.isNotEmpty(),
            supportingText = {
                if (!isNuitValid && nuitInput.isNotEmpty()) {
                    Text("Invalid NUIT check digit", color = MaterialTheme.colorScheme.error)
                }
            }
        )
    }
}
```
