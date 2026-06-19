# Changelog — moz-utils

Change history for all versions of the **moz-utils** project.

---

## [0.3.2] - 2026-06-19
> **Patch version — Elite Web Presence Phase 2**

### Features
- Upgraded the website's Landing Page to an Elite design featuring a dynamic world map (`WorldMapNodes`) symbolizing Nampula's global reach.
- Added a `PolyglotShowcase` to the homepage, demonstrating simple usage across TS, Python, PHP, Dart, and Kotlin with interactive tabs.
- Integrated GitHub API directly into the new `CommunityCTA` to display live project contributors.
- Enhanced the Insights dashboard with a real-time simulated `WorldDownloadsMap`.
- Refined theme handling for dark/light mode switches, ensuring textual contrast across the documentation renderer.

---

## [0.3.1] - 2026-06-19
> **Patch version — Elite Web Presence & Abstract Emulator**

### Features
- Redesigned the website Landing Page with elite UI features, modern gradients, glassmorphism, and dark/light modes.
- Created a dynamic Changelogs page showing global vs stack-specific changelogs inline.
- Refactored `emulator.ts` into an abstract Universal Test Center, detached from stack specifics to test raw mathematical logic (Regex & Modulo 11).

### Documentation
- Updated documentation across the Web and all Stacks to explicitly state that **Movitel** supports prefixes `86`, `87`, and `88`.
- Fixed internationalization bug in Insights dashboard translations.

---

## [0.3.0] - 2026-06-18
> **Minor version — Enterprise Release, SPA Migration & Core Fixes**

### Core Polyglot Features
- Corrected the true NUIT algorithm weights to (8, 9, 4, 5, 6, 7, 8, 9).
- Added `parseMZN` function to clean financial strings into floats.
- Relaxed DIRE and Driving License regex for better compatibility.
- Implemented the Enterprise Release Cycle (Stable, LTS, EOL).
- Transitioned project license to Apache License 2.0.

### Web & Ecosystem
- Migrated the website to a React SPA with `react-router-dom`.
- Added native i18n support (English/Portuguese).
- Added new Insight dashboard fetching live NPM and PyPI data.
- Added Playwright E2E tests for the website and simulators.

---

## [0.2.0] - 2026-05-26

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

## [0.1.3] - 2026-05-23

> **Patch version — Internationalization and Security**

### Changes
- Internationalization: documentation, metadata, and workflows translated to English.
- Added Quick Installation section to the root `README.md` to facilitate rapid adoption.
- Added a custom CodeQL workflow with explicit Kotlin compilation for code security analysis.

---

## [0.1.2] - 2026-05-23

> **Patch version — Build and Simplification**

### Changes
- Synchronized package version update across all ecosystems (TS, Dart, Python, PHP, Kotlin) to 0.1.2.
- Removed the `@iradoweck/` scope from the NPM package to simplify its usage as `moz-utils`.

---

## [0.1.1] - 2026-05-22

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

## [0.1.0] - 2026-05-20

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
