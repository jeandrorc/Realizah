# Índice Geral da Documentação — Realizah

Índice completo de toda a documentação do projeto.

---

## 📋 Documentos Principais

| Documento | Descrição | Status |
|-----------|-----------|--------|
| [README.md](../README.md) | Visão geral do projeto | ✅ |
| [EXECUTIVE-SUMMARY.md](../EXECUTIVE-SUMMARY.md) | Resumo executivo completo | ✅ |
| [CLAUDE.md](../CLAUDE.md) | Contexto para IA | ✅ |
| [CONTRIBUTING.md](../CONTRIBUTING.md) | Guia de contribuição | ✅ |
| [CHANGELOG.md](../CHANGELOG.md) | Histórico de mudanças | ✅ |

---

## 🗺️ Roadmap e Planejamento

| Documento | Descrição | Status |
|-----------|-----------|--------|
| [ROADMAP.md](ROADMAP.md) | Roadmap completo do projeto | ✅ |
| [plans/2026-03-04-monorepo-architecture-design.md](plans/2026-03-04-monorepo-architecture-design.md) | Decisão arquitetural principal | ✅ |
| [plans/2026-03-04-fase1-setup-monorepo.md](plans/2026-03-04-fase1-setup-monorepo.md) | Plano detalhado Fase 1 (15 tasks) | ✅ |
| [plans/QUICK-START-FASE1.md](plans/QUICK-START-FASE1.md) | Guia rápido Fase 1 | ✅ |
| [plans/README.md](plans/README.md) | Índice de plans | ✅ |

---

## 📐 Architecture Decision Records (ADRs)

| ADR | Título | Status |
|-----|--------|--------|
| [0000-template.md](adr/0000-template.md) | Template de ADR | 📄 Template |
| [0001-record-architecture-decisions.md](adr/0001-record-architecture-decisions.md) | Uso de ADRs | ✅ Aceita |
| [0002-monorepo-setup-decisions.md](adr/0002-monorepo-setup-decisions.md) | Decisões de setup | 🚧 Será criado na Fase 1 |

---

## 📖 Especificações Técnicas

| Módulo | Especificação | Status |
|--------|---------------|--------|
| Subscription | [subscription-module.md](specs/subscription-module.md) | ✅ Completa |
| Access Control | [access-control-module.md](specs/access-control-module.md) | ✅ Completa |
| Course | [course-module.md](specs/course-module.md) | ✅ Completa |
| Digital Delivery | [digital-delivery-module.md](specs/digital-delivery-module.md) | ✅ Completa |

### Conteúdo das Especificações

Cada especificação contém:
- Visão geral do módulo
- Entidades e tipos
- Casos de uso detalhados
- APIs (admin e store)
- Eventos
- Integrações com outros módulos
- Migrations SQL
- Testes
- Próximos passos

---

## 📏 Convenções

| Convenção | Documento | Status |
|-----------|-----------|--------|
| Código | [code-style.md](conventions/code-style.md) | ✅ |
| Git | [git-workflow.md](conventions/git-workflow.md) | ✅ |
| APIs | [api-naming.md](conventions/api-naming.md) | ✅ |

### Conteúdo das Convenções

- **code-style.md**: TypeScript, React, nomenclatura, imports, error handling
- **git-workflow.md**: Branching, commits, versionamento, ferramentas
- **api-naming.md**: RESTful, recursos, métodos HTTP, query params, status codes

---

## 🤖 Estrutura para IA

### CLAUDE.md

[CLAUDE.md](../CLAUDE.md) — Contexto principal para Claude/Cursor

**Conteúdo:**
- Stack tecnológica
- Comandos principais
- Estrutura do projeto
- Convenções
- Gotchas
- Workflow de desenvolvimento

### Cursor Rules

Localização: `.cursor/rules/`

| Rule | Escopo | Descrição |
|------|--------|-----------|
| [realizah-standards.mdc](../.cursor/rules/realizah-standards.mdc) | Sempre | Convenções gerais |
| [typescript-standards.mdc](../.cursor/rules/typescript-standards.mdc) | `**/*.ts` | Padrões TypeScript |
| [react-patterns.mdc](../.cursor/rules/react-patterns.mdc) | `**/*.tsx` | Padrões React/Next.js |
| [medusa-modules.mdc](../.cursor/rules/medusa-modules.mdc) | `apps/medusa/**/*` | Convenções Medusa |

### GitHub Copilot

[.github/copilot_instructions.md](../.github/copilot_instructions.md) — Instruções para GitHub Copilot

### Local

[.local/README.md](../.local/README.md) — Contexto local (gitignored)

---

## 🏛️ Governança

### CONTRIBUTING.md

[CONTRIBUTING.md](../CONTRIBUTING.md) — Guia completo de contribuição

**Conteúdo:**
- Código de conduta
- Como começar
- Workflow de desenvolvimento
- Padrões de código
- Processo de Pull Request
- Code review
- Responsabilidades

### Templates GitHub

Localização: `.github/`

| Template | Arquivo | Descrição |
|----------|---------|-----------|
| Pull Request | [PULL_REQUEST_TEMPLATE.md](../.github/PULL_REQUEST_TEMPLATE.md) | Template de PR |
| Bug Report | [ISSUE_TEMPLATE/bug_report.md](../.github/ISSUE_TEMPLATE/bug_report.md) | Template de bug |
| Feature Request | [ISSUE_TEMPLATE/feature_request.md](../.github/ISSUE_TEMPLATE/feature_request.md) | Template de feature |
| Question | [ISSUE_TEMPLATE/question.md](../.github/ISSUE_TEMPLATE/question.md) | Template de pergunta |

---

## 🔧 Controle de Versão

### Configurações

| Arquivo | Descrição |
|---------|-----------|
| [commitlint.config.js](../commitlint.config.js) | Validação de commits |
| [.lintstagedrc.js](../.lintstagedrc.js) | Lint em arquivos staged |
| [.prettierrc.js](../.prettierrc.js) | Formatação de código |
| [.prettierignore](../.prettierignore) | Arquivos ignorados pelo Prettier |
| [.gitignore](../.gitignore) | Arquivos ignorados pelo Git |

### Git Hooks

Localização: `.husky/`

| Hook | Arquivo | Ação |
|------|---------|------|
| pre-commit | [.husky/pre-commit](../.husky/pre-commit) | Lint staged files |
| commit-msg | [.husky/commit-msg](../.husky/commit-msg) | Validate commit message |
| pre-push | [.husky/pre-push](../.husky/pre-push) | Run tests and type-check |

### Conventional Commits

Formato: `type(scope): description`

**Types:** feat, fix, docs, style, refactor, test, chore, ci  
**Scopes:** storefront, medusa, subscription, course, access-control, digital-delivery, types, utils

---

## 📦 Configuração do Monorepo

| Arquivo | Descrição |
|---------|-----------|
| [package.json](../package.json) | Root package.json |
| [pnpm-workspace.yaml](../pnpm-workspace.yaml) | pnpm workspaces (será criado na Fase 1) |
| [turbo.json](../turbo.json) | Turborepo config |

---

## 🎨 Editor

### VSCode

| Arquivo | Descrição |
|---------|-----------|
| [.vscode/settings.json](../.vscode/settings.json) | Configurações do editor |
| [.vscode/extensions.json](../.vscode/extensions.json) | Extensões recomendadas |

---

## 📊 Status da Documentação

### Completo ✅

- [x] README.md e documentação base
- [x] CLAUDE.md e estrutura para IA
- [x] CONTRIBUTING.md e governança
- [x] Especificações de todos os 4 módulos
- [x] ADRs iniciais
- [x] Convenções (código, git, APIs)
- [x] Controle de versão (commitlint, husky)
- [x] Plano detalhado da Fase 1
- [x] Roadmap completo

### Em Progresso 🚧

- [ ] Implementação da Fase 1 (Setup do Monorepo)

### Futuro ⏳

- [ ] ADR 0002 (decisões de setup)
- [ ] Planos de implementação das Fases 2-7
- [ ] Documentação de APIs (OpenAPI/Swagger)
- [ ] Guias de deploy

---

## 🔍 Como Navegar

### Por Tipo de Documento

- **Visão Geral**: [README.md](../README.md), [EXECUTIVE-SUMMARY.md](../EXECUTIVE-SUMMARY.md)
- **Planejamento**: [ROADMAP.md](ROADMAP.md), [plans/](plans/)
- **Arquitetura**: [adr/](adr/), [plans/2026-03-04-monorepo-architecture-design.md](plans/2026-03-04-monorepo-architecture-design.md)
- **Implementação**: [specs/](specs/), [plans/2026-03-04-fase1-setup-monorepo.md](plans/2026-03-04-fase1-setup-monorepo.md)
- **Padrões**: [conventions/](conventions/), [.cursor/rules/](../.cursor/rules/)
- **Contribuição**: [CONTRIBUTING.md](../CONTRIBUTING.md), [.github/](../.github/)

### Por Fase do Projeto

#### Fase 0: Documentação (Completa)
- Todos os documentos listados acima

#### Fase 1: Setup (Atual)
- [Plano Detalhado](plans/2026-03-04-fase1-setup-monorepo.md)
- [Quick Start](plans/QUICK-START-FASE1.md)
- [Roadmap](ROADMAP.md)

#### Fases 2-7: Implementação (Futuro)
- [Especificações dos Módulos](specs/)
- [Roadmap](ROADMAP.md)

---

## 📚 Recursos Externos

### Tecnologias

- [Medusa v2 Documentation](https://docs.medusajs.com/)
- [Next.js 15 Documentation](https://nextjs.org/docs)
- [Turborepo Documentation](https://turbo.build/repo/docs)
- [pnpm Workspaces](https://pnpm.io/workspaces)

### Padrões

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [Architecture Decision Records](https://adr.github.io/)

---

**Última atualização:** 2026-03-04  
**Total de documentos:** 40+  
**Status:** ✅ Documentação completa
