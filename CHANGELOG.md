# Changelog — moz-utils

Change history for all versions of the **moz-utils** project (TypeScript, Dart, Python, PHP, and Kotlin).
---

## 0.3.3

> **Patch version — Backwards Compatibility and English Enforcement**

### Validations & Geography
- **Regex Relaxed:** Softened regex patterns for DIRE and Driving License across all ecosystems to guarantee perfect backwards compatibility and eliminate false negatives.
- **English Standardization:** Fixed internal validation docstrings across TS, Python, PHP, Dart, and Kotlin to ensure complete adherence to English.

---

## 0.3.2

> **Minor version — The New Community Portal, Official Documents & Interactive Documentation**

### Core Infrastructure & CI/CD
- **Global Polyglot Translation:** The entire mono-repo (TypeScript, Python, PHP, Dart, Kotlin) is now strictly standardized in English (variables, docstrings, exceptions).
- **Automated Insights (Cron Job):** Live metrics from PyPI and Dart pub.dev are reliably extracted via server background to bypass CORS.
- **Hardened CI/CD Pipelines:** Resilient API requests across all actions. `deploy-website.yml` now injects `GITHUB_TOKEN` to prevent rate-limit 403 blocks.
- **Node.js ESM Strictness:** Enforced `"type": "module"` natively to silence runtime warnings.

### Validations & Geography
- **Official Documents:** Complete support for validating DIRE (`isValidDIRE`), Passports (`isValidPassport`), and Driving Licenses (`isValidDrivingLicense`).
- **New CEP Engine & Suggestions:** Added `isValidNewCEP` for geo-referenced postal codes and `suggestCEPs` to instantly translate legacy codes.
- **Financial Ecosystem:** Added `getMobileWallet` to map mobile accounts (M-Pesa, e-Mola, mKesh) by operator.
- **Geographic Coverage:** Inserted comprehensive data for Nampula province (Nampula ECP, Namutequeliua, Anchilo).

### Official Website & Documentation
- **New SPA Architecture:** Migrated to a React Single Page Application (SPA) using `react-router-dom` (HashRouter) to eradicate 404 errors.
- **Internationalisation (i18n):** Native support for English and Portuguese across the entire site and documentation (`react-i18next`).
- **Hyper-Realistic Documentation:** Rewrote all guides with contextual Mozambican examples (e.g., Maputo, Nampula) and multi-language code snippets.
- **Documentation UX:** Docusaurus-style pagination, dynamic Table of Contents (TOC), smooth anchor scrolling, and a distraction-free layout.
- **Interactive Pages:** 
  - *Insights:* Real-time dashboard fetching NPM, Packagist, PyPI, and Pub.dev metrics.
  - *Changelog:* Dedicated on-site version history across all stacks.
  - *Geographic Simulators:* Real-time UI to test Legacy/New Postal Codes and districts.

---

## 0.3.1

> **Minor version — The New Community Portal**

### Official Website & SPA
- **New Architecture:** The official website has been rewritten into a Single Page Application (SPA) using `react-router-dom`.
- **Internationalization:** Added native i18n support for English and Portuguese using `react-i18next`.
- **New Pages:**
  - `Documentation`: Guides on how to use, contribute to, and test the polyglot repository.
  - `Community`: Dedicated space for Issues, Debates, and Maintainer recruitment.
  - `Insights`: Real-time dynamic dashboard. Migrated from mock/cron data to live JS fetches for NPM, Packagist, PyPI, and Pub.dev (bypassing CORS). Stars and Forks automatically hide if < 3. Creators receive a special 'Maintainer' badge. Fully internationalized.
  - `Changelog`: A dedicated on-site page, fully internationalized, for reading global and stack-specific version history easily.
- **New Geographic Simulators:** Created a separate, dedicated interface to test Legacy Postal Codes, convert to the New CEP system, and list districts by province. The official `moz-utils` logic has been deeply integrated into the UI for true real-time validation.
- **Additional Data & Enhanced Logic:** Inserted comprehensive data for Nampula province (including Nampula ECP, Namutequeliua, Anchilo) across all stacks (TypeScript, Python, PHP, Kotlin, Dart). The New CEP converter search engine was also improved to support case-insensitive locality lookups.
- **Donations:** Integrated GitHub Sponsors and PayPal badges directly into the Navbar and footer.

---

## 0.3.0

> **Minor version — Official Documents, New CEP, and Open Source Standards**

### Core Polyglot Translation
- **100% English Codebase:** The entire mono-repo (TypeScript, Python, PHP, Dart, Kotlin) has been structurally translated to strict English. All internal variables (e.g., `administrative_posts`, `neighborhoods`), docstrings, exceptions, and validation messages are now globally standardized.
- **Node.js ESM Strictness:** Enforced `"type": "module"` natively to silence all runtime typeless warnings, with clean native imports.

### Official Documents & New Validations
- **New Validations:** Complete support for validating DIRE, Passports, and Driving Licenses.
- **Financial Ecosystem:** Explicit mapping of mobile wallets (M-Pesa, e-Mola, mKesh) directly associated with their respective telecom operators.
- **New CEP System:** Full offline support for the New Postal Addressing Code (6 digits).
- **Legacy Postal Mapping:** Intelligent auto-fallback system that converts classic 4-digit Postal Codes into the new 6-digit CEP regions.
- **CLI Emulator:** Added an interactive command-line emulator (`emulator.ts`) to rehearse the library in real-time.

### Governance and CI/CD Automation
- **GitHub Templates:** Added structured templates for Pull Requests and Issues (`bug_report`, `feature_request`).
- **Code of Conduct:** Implemented the Contributor Covenant Code of Conduct.
- **Internal Skills (Bots):** 
  - `add-contributor.yml`: A GitHub Action that automatically credits contributors upon PR merge to the `main` branch.
  - `stack-maintenance.yml`: Scheduled watchdog for deep malware, injection, and vulnerability auditing across npm, pip, pub, and composer packages.
  - `enforce-english.yml`: A strict CI gatekeeper that automatically rejects any Pull Request attempting to introduce non-English variables or code.

---

## 0.2.0

> **Minor version — New feature: Legacy Postal Codes**

### New Features
- Added support for Mozambique's classic (legacy) postal code system, historically managed by **Correios de Moçambique** — a database containing 100 4-digit codes organized by Province and Locality.
- Validation and lookup functions implemented across all 5 languages:
  - `isValidPostalCode` / `is_valid_postal_code` — checks if the code belongs to the official table.
  - `getPostalCodeLocality` / `get_postal_code_locality` — returns the code's locality.
  - `getPostalCodeProvince` / `get_postal_code_province` — returns the code's province.

### Documentation and Examples
- All `README.md` files (root, ts, dart, python, php, kotlin) updated with postal code usage examples.
- Created an official Dart example file (`dart/example/example.dart`) as required by pub.dev.
- Dartdoc documentation added to the `MozUtils` class and the public constructor hidden.
- Installation references updated to `0.2.0` across the entire documentation.

### Security
- Comprehensive security audit — zero vulnerabilities across all stacks.
- PHP, Python, and Kotlin packages confirmed to have no external runtime dependencies.

---

## 0.1.3

> **Patch version — Internationalization and Security**

### Changes
- Internationalization: documentation, metadata, and workflows translated to English.
- Added Quick Installation section to the root `README.md` to facilitate rapid adoption.
- Added a custom CodeQL workflow with explicit Kotlin compilation for code security analysis.

---

## 0.1.2

> **Patch version — Build and Simplification**

### Changes
- Synchronized package version update across all ecosystems (TS, Dart, Python, PHP, Kotlin) to 0.1.2.
- Removed the `@iradoweck/` scope from the NPM package to simplify its usage as `moz-utils`.

---

## 0.1.1

> **Patch version — Publication and CI**

### Changes
- Added `composer.json` at the root for Packagist support.
- Defined minimum read permissions in GitHub Actions workflows (security).
- Prepared publication metadata across official registries: NPM, PyPI, Packagist, Pub.dev, and JitPack.
- Updated security policy (`SECURITY.md`).
- Fixed Gradle compatibility with Kotlin in CI (Gradle 8.7).
- Added native unit tests for Python, PHP, Dart, and Kotlin.
- Updated GitHub Actions CI configuration.

---

## 0.1.0

> **Initial Release**

### Features
- NUIT (Número Único de Identificação Tributária) validation following the Tax Authority's Modulo 11 algorithm.
- Entity classification based on the first digit of the NUIT (Individual, Equivalent, Corporate, Public).
- Mozambican BI (Identity Card) validation — 12 digits + 1 letter.
- Mobile operator validation and identification (Vodacom, Tmcel, Movitel).
- Mobile phone number formatting to the international standard (+258 XX XXX XXXX).
- Generation of WhatsApp chat links with pre-filled messages.
- Official currency formatting in Meticais (MZN) — thousands separated by spaces, decimal separated by a comma.
- Complete, offline geographic database (Provinces, Districts, Administrative Posts, and Neighborhoods).

### Supported Ecosystems
- TypeScript / JavaScript (NPM)
- Dart / Flutter (Pub.dev)
- Python (PyPI)
- PHP (Packagist / Composer)
- Kotlin / Java (JitPack / Gradle)
