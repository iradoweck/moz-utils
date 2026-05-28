# Changelog: moz-utils (Website & Portal)

All notable changes to the Official Website and Spa will be documented in this file.

## [0.1.3] - 2026-05-28

### Added
- **Insights Page Overhaul & i18n:**
  - Fully internationalized (English and Portuguese) using `react-i18next`.
  - Added real-time download metrics fetching from PyPI and Pub.dev (using a CORS proxy).
  - Implemented dynamic display for GitHub Stars and Forks (auto-hides if the count is less than 3).
  - Enhanced contributors section with a dedicated "Criador / Maintainer" badge for repository creators instead of raw commit counts.
- **Internationalization (i18n):** Native support for Portuguese and English across all pages (Changelog, Insights, Home).
- **New SPA Architecture:** Rebuilt with React and Vite for faster, client-side routing.
- **Unified Simulator:**
  - Modernized layout merging legacy tools into a clean, 3-category UI.
  - Real-time validation connected directly to the `moz-utils` TypeScript library.
- **Community & Documentation Pages:** Dedicated pages for community guidelines, insights, and comprehensive documentation.
- **Monetization integration:** GitHub Sponsors and PayPal badges available globally.
