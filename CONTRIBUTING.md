# 🤝 Contribution Guide - Moz-Utils

Thank you for your interest in contributing to `moz-utils`! This project was created to support the software development community in Mozambique, and your help is key to expanding it and keeping it up to date.

---

## 📐 Design and Portability Guidelines

The core principle of `moz-utils` is **consistency**. This means that regardless of whether a developer is using TypeScript, Python, PHP, Dart, or Kotlin, the functions must behave in exactly the same way and produce the same outputs for the same inputs.

### General Rules:
1. **Function Naming:** Follow the idiomatic conventions of the respective language while maintaining semantics:
   * E.g., `isValidNUIT` (TypeScript) ➔ `is_valid_nuit` (Python) ➔ `isValidNUIT` (Dart/Kotlin/PHP).
2. **No Placeholders:** All functions must be fully implemented and accompanied by corresponding validation tests.
3. **No External Dependencies:** Keep packages as lightweight as possible by using only native language features (e.g., native regular expressions and string manipulation).

---

## 🧮 Official Validation Rules

### 1. NUIT Algorithm (Modulo 11)
To implement NUIT validation in a new language, use the following mathematical logic:

1. **Input Cleaning:** Remove any characters that are not numeric digits. The NUIT must have exactly **9 digits**.
2. **Repetitive Digits:** If the string contains 9 identical digits (e.g., `111111111`, `999999999`), it must be considered **invalid**.
3. **First Digit (Entity Type):** Must start with a digit between **1 and 5** inclusive.
4. **Weighted Sum Calculation ($S$):**
   Multiply each of the first 8 digits by a decreasing weight from **9 to 2** and sum the results:
   
   $$S = \sum_{i=1}^{8} D_i \times (10 - i)$$
   
   Which means:
   $$S = (D_1 \times 9) + (D_2 \times 8) + (D_3 \times 7) + (D_4 \times 6) + (D_5 \times 5) + (D_6 \times 4) + (D_7 \times 3) + (D_8 \times 2)$$

5. **Remainder Calculation ($R$):**
   $$R = S \pmod{11}$$

6. **Determining the Expected Check Digit ($DV$):**
   * If $R \le 1$, then $DV = 0$.
   * If $R > 1$, then $DV = 11 - R$.

7. **Final Validation:** The NUIT is valid if and only if the 9th digit matches the calculated $DV$.

---

### 2. Mobile Phone Number Validation and Prefixes
Mozambican mobile numbers have 9 digits. The country calling code is `258`.
If the number starts with `258` (or `+258`), discard this prefix for internal digit validation purposes.
Only the following operators and prefixes (first 2 digits after the country code) are valid:

| Operator | Accepted Prefixes |
| :--- | :--- |
| **Vodacom** | `84`, `85` |
| **Tmcel** | `82`, `83` |
| **Movitel** | `86`, `87`, `88` |

---

### 3. Currency Formatting Standards (Meticais)
* The absolute value must be formatted with **2 decimal places**, using a comma (`,`) as the decimal separator.
* Thousands must be separated by a **single blank space** (` `).
* If the value is negative, the minus sign (`-`) must precede the numerical value.
* The currency symbol (`MT` by default, or `MZN` if specified) is appended to the end of the formatted value, separated by a single space.
* *Example:* `-1500` ➔ `-1 500,00 MT`.

---

## 🧪 How to Run Global Tests

To verify that your changes or a new port do not break the TypeScript/JavaScript ecosystem, execute the tests using Node.js:

1. Navigate to the project root.
2. Ensure that the TypeScript code in the `/ts` directory is compiled (run the build first).
3. Run the following command:
   ```bash
   node test-validation.js
   ```

If all validations pass, you will see the message:
`🎉 TODOS OS TESTES PASSARAM!`

---

## 🚀 How to Submit Your Changes

1. Fork the repository.
2. Create a branch for your feature/bugfix (e.g., `git checkout -b feature/new-port-rust`).
3. Add your code in accordance with the formatting standards and conventions.
4. If you have added support for a new language, remember to:
   * Create the corresponding folder (e.g., `/rust`).
   * Add a `README.md` file in that folder explaining basic installation and usage in that language.
   * Add the corresponding row in the ecosystem table of the main `README.md` in the root.
5. Create a detailed Pull Request targeting the `devlab` branch (development and integration branch) describing your changes. Avoid submitting Pull Requests directly to the `main` branch (production and stable code branch).
