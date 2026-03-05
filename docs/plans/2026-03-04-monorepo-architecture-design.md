# Design: Monorepo MedusaJS + Next.js — Plataforma Híbrida com Assinaturas

**Data:** 2026-03-04
**Status:** Decisão registrada — documentação completa

---

## Contexto

Novo produto construído do zero com foco em ser completo desde o início. Plataforma híbrida que combina:

- **E-commerce físico** — produtos com checkout, pedidos, estoque
- **Produtos digitais** — arquivos para download (ebooks, templates, etc.)
- **Assinaturas de cursos** — tiers de acesso com conteúdo bloqueado por plano
- **Assinaturas de ferramentas** — funcionalidades desbloqueadas por tier (Free / Pro / Premium)

---

## Decisão Arquitetural: Abordagem C — Medusa com Módulos Customizados

### Premissa

Medusa v2 como núcleo do backend com módulos customizados bem delimitados. Next.js como storefront e área de membros. Monorepo com Turborepo + pnpm workspaces.

### Módulos Customizados no Medusa

| Módulo | Responsabilidade |
|---|---|
| `subscription-module` | Planos, ciclos de cobrança, status de assinatura |
| `access-control-module` | Controle de acesso por tier (Free/Pro/Premium) |
| `course-module` | Cursos, módulos, aulas, progresso do aluno |
| `digital-delivery-module` | Entrega segura de arquivos digitais pós-compra |

### Stack

| Camada | Tecnologia |
|---|---|
| Monorepo | Turborepo + pnpm workspaces |
| Backend / API | Medusa v2 (Node.js) com módulos customizados |
| Storefront / Área de membros | Next.js 15 (App Router) |
| Pagamentos | Mercado Pago (PIX, boleto, cartão, recorrência) |
| Banco de dados | PostgreSQL (via Medusa) |
| Armazenamento | S3-compatible (produtos digitais) |

### Estrutura do Monorepo (prevista)

```
/
├── apps/
│   ├── storefront/        # Next.js — loja + área de membros
│   └── medusa/            # Medusa v2 — backend principal
├── packages/
│   ├── types/             # Tipos TypeScript compartilhados
│   └── utils/             # Utilitários compartilhados
└── docs/
    └── plans/             # Design docs e planos de implementação
```

---

## Alternativas Consideradas

### A — Medusa Monolítico Estendido
Tudo dentro do Medusa sem separação de módulos. Descartado por tornar o backend monolítico e dificultar manutenção à medida que o LMS cresce.

### B — Medusa + Serviço LMS Separado
Medusa para commerce + NestJS separado para cursos. Descartado por complexidade operacional prematura para um novo produto.

---

## Documentação Relacionada

A documentação completa do projeto foi estabelecida e está organizada em:

### Documentação Base

- **[README.md](../../README.md)** — visão geral do projeto e quick start
- **[CLAUDE.md](../../CLAUDE.md)** — contexto para IA, comandos e gotchas
- **[CONTRIBUTING.md](../../CONTRIBUTING.md)** — guia de contribuição e workflow

### Convenções

- **[Code Style](../conventions/code-style.md)** — padrões TypeScript/React
- **[Git Workflow](../conventions/git-workflow.md)** — branching e commits
- **[API Naming](../conventions/api-naming.md)** — nomenclatura de APIs

### Especificações dos Módulos

Cada módulo customizado possui especificação técnica detalhada:

- **[Subscription Module](../specs/subscription-module.md)** — planos, ciclos de cobrança, renovação
- **[Access Control Module](../specs/access-control-module.md)** — controle de acesso por tier
- **[Course Module](../specs/course-module.md)** — cursos, aulas, progresso, LMS
- **[Digital Delivery Module](../specs/digital-delivery-module.md)** — entrega segura de arquivos

### Governança

- **[ADR 0001](../adr/0001-record-architecture-decisions.md)** — uso de Architecture Decision Records
- **Templates** — PR e issue templates em `.github/`
- **Cursor Rules** — regras de IA em `.cursor/rules/`

### Controle de Versão

- **Conventional Commits** — formato padronizado de commits
- **Commitlint + Husky** — validação automática
- **CHANGELOG.md** — histórico de mudanças

## Próximos Passos

- [x] Definir estrutura detalhada do monorepo
- [x] Mapear módulos do Medusa com entidades e relacionamentos
- [x] Definir fluxos de acesso por tier
- [x] Criar documentação e governança completa
- [ ] Inicializar monorepo (pnpm workspace + Turborepo)
- [ ] Implementar apps/medusa com Medusa v2
- [ ] Implementar apps/storefront com Next.js 15
- [ ] Implementar módulos customizados (subscription, access-control, course, digital-delivery)
- [ ] Integrar com Mercado Pago
- [ ] Configurar CI/CD
- [ ] Deploy inicial
