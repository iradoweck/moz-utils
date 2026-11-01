# System Requirements

`moz-utils` is a polyglot utility library strictly designed to operate autonomously using exclusively the Standard Library of each supported language.

## The Zero-Dependency Promise
A core dogma of `moz-utils` is having **zero external runtime dependencies**. Installing this package will never drag transitive dependencies or supply-chain security risks into your applications. The code is minimal, easily auditable, and ultra-fast.

## Supported Runtimes & Versions

To ensure high performance, security, and modern type safety:

### TypeScript & Node.js
- **Node.js**: `>= 20.0.0` (developed and tested on Node 24)
- **TypeScript**: `>= 5.0` (compiled to pure ESM)
- **Runtimes**: Modern Browsers (native ESM), Edge Runtimes (Cloudflare Workers, Vercel Edge, Deno, Bun), and Node.js.

### Python
- **Python**: `>= 3.9` (developed and verified on Python 3.12 & 3.13)
- **Ecosystem**: Tested with Django, FastAPI, Flask, and standard data pipelines.

### PHP
- **PHP**: `>= 8.3` (developed on PHP 8.4+, strictly tested with backward compatibility for PHP 8.3)
- **Ecosystem**: Laravel, Symfony, WordPress, Spiral, or vanilla PHP with strict typing.

### Dart & Flutter
- **Dart SDK**: `>= 3.13.0 < 4.0.0`
- **Platforms**: 6/6 platforms supported (Android, iOS, Web/WASM, Windows, macOS, Linux).

### Kotlin & JVM
- **Kotlin**: `>= 2.3.0` (optimized on Kotlin 2.4.21 with Gradle 9.8.2)
- **JVM Target**: Java 17+ (Java 21 LTS recommended).
- **Ecosystem**: Android Native, Spring Boot, Ktor, and Quarkus.
