# Realizah — Contexto do Projeto

Plataforma híbrida de e-commerce, produtos digitais e assinaturas construída com Medusa v2 e Next.js 15.

## Stack

- **Monorepo**: Turborepo + pnpm workspaces
- **Backend**: Medusa v2 (Node.js) com módulos customizados
- **Frontend**: Next.js 15 (App Router)
- **Banco**: PostgreSQL
- **Pagamentos**: Mercado Pago
- **Storage**: S3-compatible

## Comandos Principais

```bash
# Instalar dependências
pnpm install

# Desenvolvimento (todos os apps)
pnpm dev

# Desenvolvimento de app específico
pnpm --filter storefront dev
pnpm --filter medusa dev

# Build
pnpm build

# Testes
pnpm test

# Lint
pnpm lint

# Format
pnpm format

# Type check
pnpm type-check
```

## Estrutura do Projeto

```
/
├── apps/
│   ├── storefront/        # Next.js — loja + área de membros
│   └── medusa/            # Medusa v2 — backend + módulos customizados
├── packages/
│   ├── types/             # Tipos TypeScript compartilhados
│   └── utils/             # Utilitários compartilhados
├── docs/                  # Documentação
│   ├── plans/             # Design docs e planos
│   ├── adr/               # Architecture Decision Records
│   ├── specs/             # Especificações técnicas
│   └── conventions/       # Convenções de código e workflow
├── .cursor/
│   └── rules/             # Regras do Cursor
└── .local/                # Contexto local (gitignored)
```

## Módulos Customizados do Medusa

| Módulo | Localização | Responsabilidade |
|--------|-------------|------------------|
| `subscription-module` | `apps/medusa/src/modules/subscription/` | Planos, ciclos de cobrança, status |
| `access-control-module` | `apps/medusa/src/modules/access-control/` | Controle de acesso por tier |
| `course-module` | `apps/medusa/src/modules/course/` | Cursos, módulos, aulas, progresso |
| `digital-delivery-module` | `apps/medusa/src/modules/digital-delivery/` | Entrega segura de arquivos |

## Convenções

### Gerenciador de Pacotes

**Sempre use `pnpm`**, não `npm` ou `yarn`.

```bash
# ✅ BOM
pnpm install
pnpm add react

# ❌ RUIM
npm install
yarn add react
```

### Commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

```bash
feat(subscription): add plan creation endpoint
fix(payment): resolve PIX callback timeout
docs(readme): update installation steps
```

Veja detalhes em [`docs/conventions/git-workflow.md`](docs/conventions/git-workflow.md).

### Código

- **TypeScript strict mode** habilitado
- **ESLint + Prettier** configurados
- **Imports**: use path aliases (`@/` para raiz do app)
- **Nomenclatura**: camelCase para variáveis, PascalCase para componentes

Veja detalhes em [`docs/conventions/code-style.md`](docs/conventions/code-style.md).

### APIs

- **RESTful** com recursos no plural (`/users`, `/subscriptions`)
- **Kebab-case** para URLs (`/subscription-plans`)
- **camelCase** para JSON fields
- **Versionamento**: `/api/v1/`

Veja detalhes em [`docs/conventions/api-naming.md`](docs/conventions/api-naming.md).

## Documentação

| Documento | Descrição |
|-----------|-----------|
| [`docs/plans/2026-03-04-monorepo-architecture-design.md`](docs/plans/2026-03-04-monorepo-architecture-design.md) | Decisão arquitetural principal |
| [`docs/adr/`](docs/adr/) | Architecture Decision Records |
| [`docs/specs/`](docs/specs/) | Especificações técnicas dos módulos |
| [`docs/conventions/`](docs/conventions/) | Padrões de código e workflow |
| [`CONTRIBUTING.md`](CONTRIBUTING.md) | Guia de contribuição |

## Gotchas

### Medusa v2

- Módulos customizados devem seguir a estrutura do Medusa v2
- Use `MedusaModule` para registrar módulos
- Migrations devem estar em `src/modules/<module>/migrations/`

### Next.js 15

- Use App Router, não Pages Router
- Server Components por padrão
- Client Components explícitos com `'use client'`

### Monorepo

- Dependências compartilhadas vão em `packages/`
- Use `workspace:*` para dependências internas
- Turborepo cacheia builds — use `--force` para rebuild completo

### Mercado Pago

- Callbacks podem demorar — configure timeout adequado
- PIX expira em 30 minutos por padrão
- Webhooks devem ser idempotentes

## Workflow de Desenvolvimento

1. **Criar branch**: `feature/<nome>` ou `fix/<nome>`
2. **Desenvolver**: commits atômicos com Conventional Commits
3. **Testar**: `pnpm test` antes de push
4. **Lint**: `pnpm lint` e `pnpm type-check`
5. **PR**: abrir PR com descrição clara
6. **Review**: aguardar aprovação
7. **Merge**: squash ou rebase merge

## Testes

```bash
# Todos os testes
pnpm test

# Watch mode
pnpm test:watch

# Coverage
pnpm test:coverage

# Teste específico
pnpm test src/modules/subscription
```

## Troubleshooting

### Build falha

```bash
# Limpar cache do Turborepo
pnpm clean
rm -rf node_modules
pnpm install
pnpm build --force
```

### Tipos não encontrados

```bash
# Rebuild packages de tipos
pnpm --filter @realizah/types build
```

### Medusa não inicia

```bash
# Verificar migrations
pnpm --filter medusa migration:run

# Verificar env vars
cat apps/medusa/.env
```

## Recursos

- [Medusa v2 Docs](https://docs.medusajs.com/)
- [Next.js 15 Docs](https://nextjs.org/docs)
- [Turborepo Docs](https://turbo.build/repo/docs)
- [Mercado Pago Docs](https://www.mercadopago.com.br/developers)
