# Changelog: moz-utils (Python)

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.4] - 2026-06-03

### Changed
- **NUIT Algorithm Correction:** Discovered and implemented the true Mozambican NUIT algorithm (weights `8, 9, 4, 5, 6, 7, 8, 9` instead of standard Modulo 11). Fixed across all 5 languages. Validates real-world corporate and individual NUITs perfectly.
- **Financial Parser:** Added the `parseMZN` function to clean and parse "dirty" string inputs (e.g., `"1.500,00 MT"`, `"1 500,00MZN"`, `"1,500.00"`) directly into raw database floats across all ecosystems.
- **Tests (Dart & Python):** Fixed test suites to use the new NUIT algorithm and fixed the mock generator. 
- **Website (Simulators):** The interactive money simulator now processes values through `parseMZN`. NUIT Simulator is fully functional with the new mathematical weights.
- **E2E Testing:** Added Playwright E2E tests for the simulators.
- **CodeQL Security:** Excluded node_modules from scans to resolve false positive alerts.

## [0.3.3] - 2026-05-31

### Changed
- **Regex Relaxed:** Softened regex patterns for DIRE and Driving License to prevent false negatives and guarantee perfect backwards compatibility.
- **English Standardization:** Fixed all internal validation docstrings across the polyglot stacks to strictly follow English documentation requirements.

## [0.3.2] - 2026-05-28

### Added
- **New CEP Engine & Intelligent Suggestions:**
  - `is_valid_new_cep`: Full support for the geo-referenced system (e.g., `0101-01`).
  - `suggest_ceps`: Transactional engine that translates legacy postal codes to the new format instantly.
- **Financial Ecosystem:**
  - `get_mobile_wallet`: Mapping of mobile accounts (M-Pesa, e-Mola, mKesh) by operator.
- **New National Validations:**
  - `is_valid_dire`: For Foreign Resident Identification Document (DIRE).
  - `is_valid_passport`: For passports.
  - `is_valid_driving_license`: For Mozambican driving licenses.

### Global Security (OS Governance)
- Active implementation of GitHub Actions for static analysis and malware prevention via CodeQL.
- Dependabot globally configured for updates.

## [0.2.0] - Previous Release
- Foundational logic (NUIT, BI, Phones, Legacy Postal Codes).
