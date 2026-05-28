Este Pull Request materializa o maior salto evolutivo da infraestrutura do portal oficial e solidifica o padrão de versionamento entre as várias linguagens do projeto. A página legada foi completamente convertida numa poderosa _Single Page Application_ (SPA) em React/Vite com automação extrema de deploy.

#### ✨ Funcionalidades e Melhorias (Website)
- **Migração para React SPA**: Reescrita total da interface legada para React (via Vite) implementando `react-router-dom` para navegação instantânea.
- **Internacionalização Nativa (i18n)**: Integração profunda do `react-i18next` permitindo tradução instantânea da interface entre Português e Inglês, suportado nativamente pelo estado local do browser.
- **Insights em Tempo Real (CORS Bypass)**: O dashboard abandonou os *mocks* e *cron jobs*. Agora, a aplicação acede às APIs oficiais do NPM, Packagist, GitHub, PyPI e Pub.dev em tempo real via JS. Implementado túnel (`corsproxy.io`) para contornar bloqueios das APIs de Python e Dart.
- **Lógica de Interface Dinâmica (Insights)**: Estrelas e Forks do GitHub só são exibidos na interface caso atinjam um mínimo de `3` (focando-se na estética do projeto). Os criadores (`iradoweck`, `zedeckmuacy`) ganharam um badge automático de "Criador / Maintainer" em vez da mera contagem de commits.
- **Automatação CI/CD (GitHub Pages)**: Criada a pipeline oficial (`.github/workflows/deploy-website.yml`) com GitHub Actions v4, configurada para instalar as dependências e publicar o site de forma atómica a cada merge na branch `main`.

#### 📦 Versionamento e Manifestos
Implementada e documentada a "Lei Dogmática de Versionamento Decimal" para gerir as temporalidades modulares:
- **Stacks Nativas** (TS, PHP, Kotlin, Dart, Python) sincronizadas na versão `0.3.2`.
- **Global** elevada à versão `0.3.1`.
- **Website** estabilizado na versão `0.1.3`.
- Manifestos como `composer.json`, `pubspec.yaml`, `package.json` (NPM e Web), e `pyproject.toml` ajustados em conformidade.
- Ficheiros `CHANGELOG.md` globais e do website refletem exaustivamente todo o histórico destas atualizações.

#### 🛠 Como testar (Revisores)
1. Para testar o site localmente, entre no diretório `/website` e execute `npm run dev`.
2. Aceda à aba de "Insights" para garantir a injeção em tempo real de estatísticas do NPM e Packagist, e PyPI e Pub.dev.
3. No próprio repositório no GitHub, certifique-se de que altera o método de _deployment_ nas definições (`Settings` > `Pages`) para **GitHub Actions**.

---
*Este PR abrange dezenas de contribuições arquiteturais e de acessibilidade que prepararão a biblioteca `moz-utils` para receber tráfego global.*
