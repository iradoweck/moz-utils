# Requisitos do Sistema

O `moz-utils` é uma biblioteca poliglota rigorosamente concebida para funcionar de forma autónoma, usando exclusivamente as APIs padrão (*Standard Library*) de cada linguagem.

## A Promessa de Dependência Zero
Um dos pilares dogmáticos do `moz-utils` é ter **zero dependências externas** em ambiente de execução (*runtime*). Instalar este pacote não vai arrastar uma cascata de outros módulos desconhecidos para dentro da sua infraestrutura. O nosso código é minimalista, auditado contra vulnerabilidades de supply-chain e incrivelmente leve.

## Versões e Runtimes Suportados

Para garantir o máximo desempenho, segurança e usufruir da tipagem estrita moderna:

### TypeScript & Node.js
- **Node.js**: `>= 20.0.0` (desenvolvido e testado em Node 24)
- **TypeScript**: `>= 5.0` (Compilado para ESM puro)
- **Ecossistema**: Perfeitamente compatível com Browsers (ESM nativo), Edge Runtimes (Cloudflare Workers, Vercel Edge, Deno, Bun) e Node.js moderno.

### Python
- **Python**: `>= 3.9` (desenvolvido e testado em Python 3.12 e 3.13)
- **Ecossistema**: Testado nativamente em Django, FastAPI, Flask e scripts puros de Data Science (Jupyter/Pandas).

### PHP
- **PHP**: `>= 8.3` (desenvolvido e otimizado no PHP 8.4+, mantendo total compatibilidade retroativa com PHP 8.3)
- **Ecossistema**: Laravel, Symfony, WordPress, Spiral ou scripts PHP puros com tipagem estrita.

### Dart & Flutter
- **Dart SDK**: `>= 3.13.0 < 4.0.0`
- **Ecossistema**: Totalmente compatível com compilação Ahead-of-Time (AOT) e compilação nativa para Android, iOS, Windows, macOS, Linux e Web (WASM).

### Kotlin & JVM
- **Kotlin**: `>= 2.3.0` (otimizado no Kotlin 2.4.21 com Gradle 9.8.2)
- **JVM Target**: Java 17+ (Java 21 LTS recomendado).
- **Ecossistema**: Android Nativo, Spring Boot, Ktor e Quarkus.
