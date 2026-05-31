# Changelog: moz-utils (TypeScript)

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.3] - 2026-05-31

### Changed
- **Regex Relaxed:** Softened regex patterns for DIRE and Driving License to prevent false negatives and guarantee perfect backwards compatibility.
- **English Standardization:** Fixed all internal validation docstrings across the polyglot stacks to strictly follow English documentation requirements.

## [0.3.2] - 2026-05-28

### Added
- **New CEP Engine & Intelligent Suggestions:**
  - `isValidNewCEP`: Full support for the geo-referenced system (e.g., `0101-01`).
  - `suggestCEPs`: Transactional engine that translates legacy postal codes to the new format instantly.
- **Financial Ecosystem:**
  - `getMobileWallet`: Mapping of mobile accounts (M-Pesa, e-Mola, mKesh) by operator.
- **New National Validations:**
  - `isValidDIRE`: For Foreign Resident Identification Document (DIRE).
  - `isValidPassport`: For passports.
  - `isValidDrivingLicense`: For Mozambican driving licenses.

### Global Security (OS Governance)
- Active implementation of GitHub Actions for static analysis and malware prevention via CodeQL.
- Dependabot globally configured for updates.

## [0.2.0] - Previous Release
- Foundational logic (NUIT, BI, Phones, Legacy Postal Codes).
