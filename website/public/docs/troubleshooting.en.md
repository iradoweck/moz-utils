# Troubleshooting

This guide covers the most common technical and business logic issues developers face when integrating `moz-utils`.

## My NUIT fails validation, but the user swears it's real!
**Problem:** `isValidNUIT()` returns `false` for a NUIT the user claims is theirs.
**Mathematical Cause:** The Mozambican NUIT is not just a random 9-digit sequence; the last digit is a **Check Digit** generated through a Modulo 11 algorithm (applied with specific weights defined by the Tax Authority). If one digit is mistyped, the equation fails.
**Solution:** Ask the user to double-check their physical card. `moz-utils` does not make exceptions to the mathematical algorithm (as per Decree n. 28/2012). If your system accepts mathematically invalid NUITs, your company might face integration issues with the government's e-Tributação systems.

## TypeScript Module Conflicts (ESM)
**Problem:** `Error: require() of ES Module moz-utils is not supported.` or `Cannot find module 'moz-utils'`.
**Cause:** The TypeScript library is modernly compiled strictly as **ES Modules (`import`)** and does not support legacy CommonJS (`require`).
**Solution:** 
1. Use `import { isValidBI } from 'moz-utils';`
2. Add `"type": "module"` to your `package.json`.
3. Ensure your `tsconfig.json` uses `"moduleResolution": "Node16"` or `"Bundler"`.

## Names Returning Empty to the Database (Sanitize)
**Problem:** `sanitizeName("12345")` is returning an empty string.
**Cause:** The `sanitizeName()` function aggressively strips mathematical characters and numbers because a human name does not contain digits. If the input consists purely of numbers, the cleaned result will be empty.
**Solution:** Always run `isValidName()` **before** sanitizing and saving to the database to ensure the string contains actual alphabetical characters.

## Postal Code (CEP) Not Found
**Problem:** I'm trying to search the locality for CEP `1100` and it returns null, or I try to validate `0101-01` and it fails.
**Cause:** Mozambique is in a transition period for Postal Codes. The legacy format (4 digits, e.g., 1100 - Maputo) is covered by the `isValidPostalCode()` function. The new geo-referenced 6-digit model (e.g., 0101-01) is validated by the `isValidNewCEP()` function.
**Solution:** Ensure you are invoking the correct function depending on whether your UI form asks for "Postal Code" (legacy) or "New CEP".
