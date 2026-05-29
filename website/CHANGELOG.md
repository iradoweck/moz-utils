# Website Changelog — moz-utils

Histórico de alterações e novidades específicas para o portal oficial do `moz-utils`.

---

## 0.1.4

> **Patch version — Insights & SEO Overhaul, CI/CD Hardening**

### Insights
- **Estatísticas ao Vivo Melhoradas:** A página de Insights passou a consumir e consolidar métricas híbridas (estáticas via `stats.json` e dinâmicas via GitHub Search API).
- **Cartões Inteligentes:** Issues Abertas/Fechadas e PRs Abertos/Merged agora são apresentados no mesmo cartão, ocultando-se se não houver dados.
- **Resiliência Local:** Implementado um *fallback* seguro para desenvolvimento local (descarrega o `stats.json` de produção se falhar localmente).

### SEO & Internacionalização
- Implementação massiva de SEO (`react-helmet-async`, `sitemap.xml`, `robots.txt`, tags Open Graph).
- Adicionadas chaves de tradução PT/EN em falta no ecrã de Insights para suportar a internacionalização.

### CI/CD e Segurança
- O `deploy-website.yml` foi fortificado com injeção de `GITHUB_TOKEN` nas chamadas à API (evitando bloqueios de limites de requisição).
- Scripts baseados em `jq` agora possuem tratamento robusto para não falharem se o PyPI ou outras fontes não retornarem os dados no formato esperado.
- Corrigido o `React Error #31` derivado da desserialização do objeto `author` do GitHub.
- Removido alerta do `CodeQL` por importação não utilizada (`BarChart3`).

---

## 0.1.3

> **Patch version — Novo Website SPA Multilingue**

- Migração de HTML estático para um portal moderno em React (`vite` + `react-router-dom`).
- Lançamento do Simulador Interativo, testando a biblioteca nativa compilada no browser.
- Implementação de HashRouter para suporte a GitHub Pages.
- Internacionalização PT e EN.
