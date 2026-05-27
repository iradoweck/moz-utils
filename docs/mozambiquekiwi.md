# Mozambique Kiwi Documentation

This document contains deep-dive architectural references, validation flowcharts, and administrative structure tables used by `moz-utils` validations.

## 1. Official Documents Validation

### BI (National Identity Card) Number Validation
- **Structure**: Exactly 12 numeric digits followed by 1 uppercase letter.
- **Example**: `110101234567A`.
- **Validation**:
  - Automatically cleans white spaces and hyphens.
  - Automatically converts letters to uppercase.
  - Returns `true` if the pattern matches `/^\d{12}[A-Z]$/`.

### NUIT (Unique Tax Identification Number) Modulo 11 Flow

The validation strictly follows the rules defined by the Tax Authority of Mozambique:

```mermaid
graph TD
    A[Start: nuit] --> B{Has 9 digits?}
    B -- No --> C[Invalid]
    B -- Yes --> D{All digits identical?<br/>e.g., 111111111}
    D -- Yes --> C
    D -- No --> E{First digit<br/>between 1 and 5?}
    E -- No --> C
    E -- Yes --> F["Weighted sum of the first 8 digits:<br/>sum += digit[i] * (9 - i)"]
    F --> G[Calculate remainder = sum % 11]
    G --> H{remainder <= 1?}
    H -- Yes --> I[Expected Digit = 0]
    H -- No --> J[Expected Digit = 11 - remainder]
    I --> K{Digit 9 == Expected Digit?}
    J --> K
    K -- Yes --> L[Valid]
    K -- No --> C
```

## 2. Geographical Data Hierarchy

A robust offline static database structured with official administrative divisions of the country:

```mermaid
graph TD
    Moz[Mozambique] --> N["Northern Region"]
    Moz --> C["Central Region"]
    Moz --> S["Southern Region"]

    N --> CD["Cabo Delgado"]
    N --> NS["Niassa"]
    N --> NPL["Nampula"]

    C --> ZMB["Zambézia"]
    C --> TT["Tete"]
    C --> MN["Manica"]
    C --> SF["Sofala"]

    S --> INH["Inhambane"]
    S --> GZ["Gaza"]
    S --> MPT["Maputo Province"]
    S --> MC["Maputo City"]

    CD --> D["Districts <br/>e.g., Nampula, Pemba (City)..."]
    NPL --> D
    D --> PA["Administrative Posts <br/>e.g., Muhala..."]
    PA --> B["Main Neighborhoods <br/>e.g., Namutequeliua..."]
```

### Table of Provinces & Districts

| Region | Province | Capital | Key Districts |
| :--- | :--- | :--- | :--- |
| **South** | Maputo City | Maputo | KaMpfumo, KaMaxaquene, KaMubukwana... |
| **South** | Maputo Province | Matola | Matola, Boane, Marracuene, Manhiça... |
| **South** | Gaza | Xai-Xai | Xai-Xai, Chókwè, Macia, Bilene... |
| **South** | Inhambane | Inhambane | Inhambane, Maxixe, Vilankulo... |
| **Central** | Sofala | Beira | Beira, Dondo, Búzi, Gorongosa... |
| **Central** | Manica | Chimoio | Chimoio, Manica, Gondola... |
| **Central** | Tete | Tete | Tete, Moatize, Angónia, Cahora Bassa... |
| **Central** | Zambézia | Quelimane | Quelimane, Mocuba, Gurúè... |
| **North** | Nampula | Nampula | Nampula, Nacala, Angoche, Ilha de Moçambique... |
| **North** | Cabo Delgado | Pemba | Pemba, Montepuez, Mocímboa da Praia... |
| **North** | Niassa | Lichinga | Lichinga, Cuamba, Lago... |

> **Note:** The `moz-utils` package uses these administrative divisions to resolve legacy Postal Codes into the new 6-digit CEP system.
