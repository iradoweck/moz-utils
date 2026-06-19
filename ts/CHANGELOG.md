# Changelog — TypeScript Stack

Change history for the **TypeScript/JavaScript** module of the `moz-utils` project.

---

## [0.3.9] - 2026-06-19
- chore: Refactored dummy strings to use `Formiga Antonio`.
- chore: Updated `package.json` registry metadata.

## [0.3.8] - 2026-06-18
- chore(release): Bumped to 0.3.8 to surpass NPM registry lock and enforce Base 10 Parity.
- fix: Corrected the NUIT algorithm logic in TypeScript.

## [0.3.3] - 2026-06-03
- fix: Relaxed DIRE and Driving License regex validations.

## [0.3.2] - 2026-05-28
- feat: Added official document validators (DIRE, Passports, Driving Licenses).
- feat: Implemented New CEP Engine for Node.js (`isValidNewCEP`, `suggestCEPs`).
- feat: Added `getMobileWallet` to map Mozambican numbers to wallets (M-Pesa, e-Mola, mKesh).

## [0.3.0] - 2026-05-27
- refactor: Codebase, variables, and docstrings fully translated to English.
- feat: Added offline geographic database and CEP logic.
- feat: Added interactive CLI emulator in `emulator.ts`.

## [0.2.0] - 2026-05-26
- feat: Added support for classic 4-digit postal codes (`isValidPostalCode`).

## [0.1.2] - 2026-05-23
- chore: Removed `@iradoweck/` scope from NPM. Package is now simply `moz-utils`.

## [0.1.0] - 2026-05-20
- feat: Initial TypeScript release on NPM.
- feat: NUIT, BI, and mobile validation functions.
