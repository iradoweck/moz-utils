# System Requirements

`moz-utils` is a polyglot library rigorously designed to run standalone, exclusively leveraging the standard library of each respective language.

## The Zero-Dependency Promise
A core pillar of `moz-utils` is having **zero external dependencies** in runtime. Installing this package will not drag a cascade of unknown third-party modules into your infrastructure. Our code is minimalist, easy to security-audit, and incredibly lightweight.

## Minimum Supported Versions

To guarantee peak performance and utilize modern strong typing, the following minimum versions are strictly required:

### TypeScript & Node.js
- **Node.js**: `>= 24.0.0`
- **TypeScript**: `>= 6.0` (For development/compilation)
- **Ecosystem**: Fully compatible with Browsers (ESM), Edge Runtimes (Cloudflare Workers, Vercel Edge), and traditional Node.js.

### Python
- **Python**: `>= 3.8`
- **Ecosystem**: Natively tested on Django, FastAPI, Flask, and raw Data Science scripts (Jupyter/Pandas).

### PHP
- **PHP**: `>= 8.3`
- **Ecosystem**: Laravel, Symfony, WordPress, or raw scripts. Takes full advantage of the strict Type Hinting system introduced in PHP 8.3.

### Dart & Flutter
- **Dart SDK**: `>= 3.5.0 < 4.0.0`
- **Ecosystem**: Fully compatible with AOT (Ahead-of-Time) compilers for native compilation on Android, iOS, Windows, macOS, and Linux via Flutter.

### Kotlin & JVM
- **Kotlin**: `>= 2.3.21` (and `2.4.0`)
- **JVM Target**: Preferably tested with Java 17+.
- **Ecosystem**: Spring Boot, Ktor, and Native Android. Full interoperability with legacy Java code.

---
> [!WARNING]
> If your project uses older versions than the ones listed above, we cannot guarantee 100% compatibility, as we rely on modern language features (e.g. Enums in PHP 8, Null-Safety in Dart 3). We highly recommend upgrading your stack for security reasons.
