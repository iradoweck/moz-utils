# Overview

Welcome to the official documentation of **moz-utils**!

`moz-utils` is a polyglot utility library specifically engineered to handle the formatting, sanitization, and validation of Mozambican data structures (Phones, NUIT, BI, CEP, etc.) across multiple languages and ecosystems.

## Why use moz-utils?

When building applications for Mozambique, developers often struggle with repetitive tasks:
- *Is this NUIT valid according to the Tax Authority (AT)?*
- *Is this mobile number from Vodacom, Tmcel, or Movitel?*
- *What is the new 6-digit CEP for Maputo?*

This library solves these problems out of the box, with **zero external dependencies** and strict algorithms.

### 🌐 Polyglot Ecosystem
This library was built from the ground up to support native execution across:
- **TypeScript / Node.js** (Frontend & Backend)
- **Python** (Data Science & Backend)
- **PHP** (Laravel / Symfony)
- **Dart / Flutter** (Mobile Apps)
- **Kotlin / Java** (Android Apps)

### 🔒 Privacy First
All validation algorithms are fully **offline**. You do not need an active internet connection to validate a NUIT or check a District. We don't track your queries or send data to external APIs.
