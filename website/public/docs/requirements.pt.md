# Requisitos do Sistema

O `moz-utils` é uma biblioteca poliglota rigorosamente concebida para funcionar de forma autónoma, usando exclusivamente as APIs padrão ("Standard Library") de cada linguagem.

## A Promessa de Dependência Zero
Um dos pilares do `moz-utils` é ter **zero dependências externas** em ambiente de execução (*runtime*). Instalar este pacote não vai arrastar uma cascata de outros módulos desconhecidos para dentro da sua infraestrutura. O nosso código é minimalista, fácil de auditar em questões de cibersegurança e incrivelmente leve.

## Versões Mínimas Suportadas

Para garantir o máximo desempenho e usufruir da tipagem forte moderna, as seguintes versões são estritamente requeridas:

### TypeScript & Node.js
- **Node.js**: `>= 24.0.0`
- **TypeScript**: `>= 6.0` (Para desenvolvimento/compilação)
- **Ecossistema**: Perfeitamente compatível com Browsers (ESM), Edge Runtimes (Cloudflare Workers, Vercel Edge) e Node.js tradicional.

### Python
- **Python**: `>= 3.8`
- **Ecossistema**: Testado nativamente em Django, FastAPI, Flask e scripts puros de Data Science (Jupyter/Pandas).

### PHP
- **PHP**: `>= 8.3`
- **Ecossistema**: Laravel, Symfony, WordPress ou scripts puros. Tira partido absoluto do sistema rigoroso de *Type Hinting* do PHP 8.3.

### Dart & Flutter
- **Dart SDK**: `>= 3.5.0 < 4.0.0`
- **Ecossistema**: Totalmente compatível com compiladores AOT (Ahead-of-Time) para compilação nativa em Android, iOS, Windows, macOS e Linux através do Flutter.

### Kotlin & JVM
- **Kotlin**: `>= 2.3.21` (e `2.4.0`)
- **JVM Target**: Testado preferencialmente com Java 17+.
- **Ecossistema**: Spring Boot, Ktor, e Android Nativo. Total interoperabilidade com código legado em Java.

---
> [!WARNING]
> Se o seu projeto estiver a utilizar versões inferiores às listadas, não garantimos a compatibilidade a 100%, uma vez que utilizamos funcionalidades modernas das linguagens (ex: Enums no PHP 8, Null-Safety no Dart 3). Recomendamos a atualização da sua stack por motivos de segurança.
