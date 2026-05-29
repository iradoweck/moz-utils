# Changelog — moz-utils

Change history for all versions of the **moz-utils** project (TypeScript, Dart, Python, PHP, and Kotlin).
---

## 0.3.4

> **Patch version — Documentation Realism, UX Polish & Internationalisation**

### Documentation Portal
- **Hyper-Realistic Markdown Docs:** Rewrote all documentation pages (`phones.md`, `documents.md`, `currency.md`, `geography.md`, `postal.md`) with real-world, contextual examples deeply rooted in Mozambican geography — cities like **Nampula**, **Beira**, **Maputo**, and neighbourhoods like **Namutequeliua** are now first-class citizens in every code example.
- **Multi-Language Code Alignment:** All code snippets were audited against the live source (`index.ts`, `MozUtils.php`, `moz_utils.dart`, `moz_utils.py`, Kotlin) and now faithfully reflect the exact API signature across all 5 supported languages (TypeScript, Python, PHP, Dart, Kotlin).

### Documentation UX
- **Docusaurus-Style Pagination:** Added `Previous` / `Next` navigation cards at the bottom of each documentation section, allowing readers to navigate sequentially through the full guide without interruption.
- **Table of Contents (TOC) — Icon Upgrade:** Section headings (`##`) now display a `ChevronRight` icon, while sub-headings (`###`) display an em-dash (`—`), both colour-coded reactively as the reader scrolls.
- **Smooth Anchor Scrolling:** TOC links now calculate the element offset minus the navbar height (100px) before calling `window.scrollTo`, ensuring headings are never hidden behind the sticky navbar.
- **Docs Page — Footer-Free Layout:** The global site footer is now conditionally hidden on the `/docs` route, creating a distraction-free, immersive reading environment.
- **Responsive Sidebar/TOC Breakpoints:** Recalibrated breakpoints — left sidebar hides below `700px`, right TOC hides below `900px` — making the docs fully usable on tablets and wide-mobile viewports.

### Footer Redesign
- **Zedeck's IT Logo:** Integrated the official Zedeck's IT icon inline within the footer's attribution line — displayed at 24px height alongside the sponsorship and authorship text.
- **Simplified Layout:** The footer text is now a single centred line: `Sponsored and supported by [Logo] and Developed by Edmilson Muacigaro & Community`, with the AGPL-3.0 notice immediately below in the project's signature neon green.
- **Donation Buttons Preserved:** The GitHub Sponsors and PayPal buttons remain intact below the attribution line.

### Internationalisation
- **New i18n Keys — Both Locales (EN/PT):**
  - `footer.sponsoredBy` — "Sponsored and supported by" / "Patrocinado e suportado por"
  - `footer.developedByShort` — authorship short-form
  - `footer.openSource` — AGPL-3.0 notice
  - `docs_page.on_this_page` — TOC section title
  - `docs_page.pagination.previous` — Prev button label
  - `docs_page.pagination.next` — Next button label
- All previously hardcoded UI strings in `Documentation.jsx` and `Footer.jsx` are now driven by `react-i18next`.

### UX & Global Styles
- **Invisible Scrollbar:** Applied `::-webkit-scrollbar { display: none }`, `-ms-overflow-style: none`, and `scrollbar-width: none` globally via `index.css`, hiding the scrollbar across all browsers while fully preserving scroll functionality.
- **Smooth Scrolling:** Added `html { scroll-behavior: smooth }` globally.

### Security
- **Prototype Injection Fix:** Replaced direct bracket-index access `DOCS_PAGES[activeIndex - 1]` in `Documentation.jsx` with a safe `.find((_, i) => i === ...)` pattern, eliminating the ESLint/Semgrep warning about potential prototype pollution via computed property access.

---

## 0.3.3

> **Patch version — SEO Overhaul, CI/CD Hardening & Documentation Preps**

### Official Website
- **SEO & Discoverability:** Massive SEO improvement with dynamic `react-helmet-async`, dynamic canonical URLs, automated Open Graph generation, and localized JSON-LD schemas.
- **Insights Enhancements:** Insights now render Issues (Open/Closed) and PRs (Open/Merged) intelligently via live GitHub API fetches with a robust local fallback mechanism. Fixed all React state warnings.
- **Documentation Prep:** Prepared infrastructure to launch a fully redesigned interactive documentation portal with live playgrounds.

### Core Infrastructure & CI/CD
- **Hardened CI/CD Pipelines:** Resilient API requests across all actions. The `deploy-website.yml` now injects `GITHUB_TOKEN` specifically to prevent rate-limit 403 blocks during dependency analysis, and uses strict `jq` fallbacks for unavailable upstream data (e.g., PyPI delays).

---

## 0.3.2

> **Patch version — Stable SPA Routing and Automated Insights Pipeline**

### Core Infrastructure & CI/CD
- **Automated Insights (Cron Job):** Resurrected the `fetch-insights.yml` workflow. Live metrics from PyPI and Dart pub.dev are now reliably extracted via the server background (bypassing CORS restrictions) and injected into `stats.json`.
- **Pipeline Optimization:** Streamlined the GitHub Pages lifecycle by removing duplicate workflows and solidifying the `deploy-website.yml` action to guarantee atomic deployments on the `main` branch.

### Official Website
- **Robust Routing:** Migrated the portal to HashRouter to completely eradicate `404 Not Found` responses natively generated by GitHub Pages.
- **Asynchronous Data Shield:** Re-architected the Insights fetching engine with progressive asynchronous state loading and strict HTTP timeouts (`AbortController`), ensuring zero UI blockages during unstable network conditions.

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
