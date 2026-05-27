# Changelog: moz-utils (Python)

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - 2026-05-27

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
