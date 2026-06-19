# Changelog — Python Stack

Change history for the **Python** module of the `moz-utils` project.

---

## [0.3.9] - 2026-06-19
- chore: Refactored dummy strings to use `Formiga Antonio`.
- chore: Updated `pyproject.toml` metadata.

## [0.3.8] - 2026-06-18
- chore(release): Bumped to 0.3.8 to match Absolute Parity logic.
- fix: Corrected the NUIT algorithm logic in Python.

## [0.3.3] - 2026-06-03
- fix: Relaxed DIRE and Driving License regex validations.

## [0.3.2] - 2026-05-28
- feat: Added official document validators (DIRE, Passports, Driving Licenses).
- feat: Implemented New CEP Engine for Python (`is_valid_new_cep`, `suggest_ceps`).
- feat: Added `get_mobile_wallet` to map Mozambican numbers to wallets.

## [0.3.0] - 2026-05-27
- refactor: Codebase, variables, and docstrings fully translated to English.
- feat: Added offline geographic database and CEP logic.

## [0.2.0] - 2026-05-26
- feat: Added support for classic 4-digit postal codes (`is_valid_postal_code`).

## [0.1.1] - 2026-05-22
- test: Added native unit tests via pytest.
- chore: Prepared publication metadata for PyPI.

## [0.1.0] - 2026-05-20
- feat: Initial Python release on PyPI.
- feat: NUIT, BI, and mobile validation functions.
