# Changelog — moz-utils

Change history for all versions of the **moz-utils** project.

---

## [0.3.8] - 2026-06-18
- chore(release): Bump to 0.3.8 to surpass registry lock and enforce Base 10 Absolute Parity logic.
- docs: Transition and update to Apache License 2.0 with proper copyrights.

## [0.3.7] - 2026-06-18
- refactor: Implementation of the Enterprise Release Cycle (Stable, LTS, EOL).
- chore: Transition to Apache License 2.0.

## [0.3.4] - 2026-06-18
- fix: Corrected the true NUIT algorithm weights (8, 9, 4, 5, 6, 7, 8, 9).
- feat: Added `parseMZN` function to clean financial strings into floats.
- test: Added Playwright E2E tests for the website and simulators.

## [0.3.3] - 2026-06-03
- fix: Relaxed DIRE and Driving License regex for better compatibility.
- refactor: Standardized validation docstrings to strictly English across all stacks.

## [0.3.2] - 2026-05-28
- feat: Migrated the website to a React SPA with `react-router-dom`.
- feat: Added native i18n support (English/Portuguese) to the website.
- feat: Added official document validators (DIRE, Passports, Driving Licenses).
- feat: Implemented New CEP Engine (`isValidNewCEP`, `suggestCEPs`).
- feat: Added mobile wallet mapper (`getMobileWallet`).

## [0.3.1] - 2026-05-27
- feat: New Community Portal with Q&A and debates on the website.
- feat: New Insights dashboard fetching live data from NPM and PyPI.
- feat: Real-time geographic simulators for Legacy/New Postal Codes.
- feat: Integrated Nampula province coverage (Nampula ECP, Namutequeliua, Anchilo).

## [0.3.0] - 2026-05-27
- refactor: 100% codebase translation to English (variables, docstrings, exceptions).
- feat: Added offline support for the New Postal Addressing Code (6 digits).
- feat: Legacy Postal Mapping with fallback to the new CEP regions.
- feat: Added interactive CLI emulator (`emulator.ts`).
- chore: Implemented GitHub Templates, Code of Conduct, and CI Bots.

## [0.2.0] - 2026-05-26
- feat: Added support for Mozambique's classic 4-digit postal code system.
- feat: Validation functions `isValidPostalCode`, `getPostalCodeLocality`, `getPostalCodeProvince`.
- docs: Updated all READMEs with postal code examples.

## [0.1.3] - 2026-05-23
- docs: Translated metadata and workflows to English.
- chore: Added Quick Installation sections and custom CodeQL workflows.

## [0.1.2] - 2026-05-23
- chore: Synchronized package versions to 0.1.2.
- chore: Removed `@iradoweck/` scope from NPM package to simplify usage as `moz-utils`.

## [0.1.1] - 2026-05-22
- chore: Added `composer.json` for Packagist support.
- test: Added native unit tests for Python, PHP, Dart, and Kotlin.
- chore: Prepared publication metadata across NPM, PyPI, Packagist, Pub.dev, and JitPack.

## [0.1.0] - 2026-05-20
- feat: Initial Release.
- feat: NUIT validation (Modulo 11).
- feat: Mozambican BI validation.
- feat: Mobile operator validation and phone number formatting.
- feat: Currency formatting in Meticais (MZN).
- feat: Complete offline geographic database.
