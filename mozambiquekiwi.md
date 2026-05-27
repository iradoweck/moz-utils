# Mozambique Kiwi (MozUtils Documentation Core)

This document centralizes the business rules, structural tables, geographical distribution maps, and technical specifications of the Mozambican IT ecosystem.

---

## 1. Official Validators (Algorithm Documentation)

### 1.1 NUIT (Unique Tax Identification Number)
The NUIT is managed by the Mozambican Tax Authority (AT) and is validated using **Modulo 11** mathematics.
- **Length:** Exactly 9 numeric digits.
- **Structure:** The 1st digit identifies the entity classification, the following are sequential, and the 9th digit is the control digit (checksum).

| First Digit | Entity Classification (AT) |
| :--- | :--- |
| `1` to `3` | Singular (National/Foreign Citizens and ENI) |
| `4` | Collective (Quotas Companies, SA, Lda, Associations) |
| `5` | Governmental / State Entities |

**Modulo 11 Algorithm (Control Digit Calculation):**
1. Multiply each of the first 8 digits by its corresponding weight, starting from weight 9 down to weight 2 (from left to right).
2. Sum the result of the multiplications.
3. Divide the sum by 11 to find the remainder of the integer division.
4. The control digit is the difference between 11 and the remainder (or 0 if the difference is 10 or 11).

### 1.2 National ID (BI)
The Mozambican National Identity Card follows a static structure in its recent versions (post-independence):
- **Length:** 13 characters in total.
- **Format:** 12 numeric digits followed by 1 uppercase letter.
- Example: `110101234567A`.

### 1.3 DIRE (Foreign Resident Identification Document)
- **Length:** 9 characters.
- **Format:** Exactly 8 numeric digits followed by 1 uppercase letter at the end.

### 1.4 Other Documents (Passport and Driving License)
- **Passport:** 2 letters (e.g., AO, AB) followed by 7 digits.
- **Driving License:** 1 letter (location indicator) followed by 5 to 7 digits.

---

## 2. Mozambique Distribution Maps and Tables

Mozambique is administratively divided into Provinces, Districts, Administrative Posts, Localities, and Neighborhoods.

### 2.1 Province Map and System Codes (IDs)

| Province | Internal Code (ID) | Capital |
| :--- | :--- | :--- |
| **Maputo (City)** | `mpc` | Maputo |
| **Maputo (Province)**| `mpp` | Matola |
| **Gaza** | `gaz` | Xai-Xai |
| **Inhambane** | `inh` | Inhambane |
| **Sofala** | `sof` | Beira |
| **Manica** | `man` | Chimoio |
| **Tete** | `tet` | Tete |
| **Zambézia** | `zam` | Quelimane |
| **Nampula** | `npl` | Nampula |
| **Cabo Delgado** | `cbd` | Pemba |
| **Niassa** | `nia` | Lichinga |

*(Note: Complete arrays containing all exact partitions (Districts, Neighborhoods, and Administrative Posts) are injected into the geographic data constants across all repositories, exposed via `getDistrictsByProvince()` / `getMozambiqueProvinces()`).*

### 2.2 New CEP System (Geo-referenced)
Mozambique is adopting the New CEP (Postal Addressing Code), leaving behind the old post office boxes (with 4 digits e.g., `1100`).

- **New Format:** 6 Digits (`XXXX-XX`).
- **Where:** The first four digits represent the aggregating locality, and the last two digits represent the precise partition (neighborhood or major avenue).
- **How the Library Helps:** `moz-utils` translates the 4-digit code into lists of the New CEP using its `suggestCEPs(legacyCode)` function.

---

> [!NOTE]
> Dense maps (JSONs with all +2000 geographical records of the country) are not exposed in the Markdown documentation to avoid slowness. You can consume them fully via API invocation from our library in any stack.
