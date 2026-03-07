# Testes E2E (Playwright)

## Visão Geral

Os testes E2E cobrem fluxos ponta a ponta do storefront usando Playwright.

## Estrutura

```
apps/storefront/e2e/
├── home.spec.ts        # Home, navegação
├── auth.spec.ts        # Login, registro, rotas protegidas
├── products.spec.ts    # Listagem de produtos e cursos
├── product-detail.spec.ts  # Página de produto
├── cart.spec.ts        # Carrinho
├── checkout.spec.ts    # Checkout
├── subscription.spec.ts   # Planos de assinatura
└── courses.spec.ts     # Cursos
```

## Executando

**Pré-requisito:** Porta 3000 livre (ou defina `PLAYWRIGHT_BASE_URL`).

### Storefront apenas (mock/fallback)

```bash
pnpm e2e
# ou
pnpm --filter storefront e2e
```

Inicia só o Next.js na porta 3000. Produtos usam mock quando Medusa está offline. O Playwright
inicia o servidor automaticamente (timeout 180s).

### Com Medusa (fluxo completo)

```bash
E2E_WITH_MEDUSA=1 pnpm e2e
```

Inicia storefront (3000) e Medusa (9000). Requer:

- PostgreSQL rodando
- `apps/medusa/.env` configurado
- `apps/storefront/.env` com `NEXT_PUBLIC_MEDUSA_*` apontando para localhost:9000

### Modo UI (debug)

```bash
pnpm --filter storefront e2e:ui
```

### Modo headed (ver o browser)

```bash
pnpm --filter storefront e2e:headed
```

## Variáveis de Ambiente para E2E

No `apps/storefront/.env` (ou `.env.local`):

```env
NEXT_PUBLIC_MEDUSA_API_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=<sua-publishable-key>
NEXT_PUBLIC_MEDUSA_REGION_ID=<region-id>
```

Para obter a publishable key e region_id: rodar seed do Medusa e consultar o admin.

## Fluxos Cobertos

| Fluxo              | Spec                   | Requer Medusa |
| ------------------ | ---------------------- | ------------- |
| Home, navegação    | home.spec.ts           | Não           |
| Login, registro    | auth.spec.ts           | Não           |
| Produtos, cursos   | products.spec.ts       | Não (mock)    |
| Detalhe do produto | product-detail.spec.ts | Não (mock)    |
| Carrinho vazio     | cart.spec.ts           | Não           |
| Checkout           | checkout.spec.ts       | Não           |
| Planos             | subscription.spec.ts   | Parcial       |
| Cursos             | courses.spec.ts        | Parcial       |

## CI

Para rodar em CI, configure o `webServer` no `playwright.config.ts` ou inicie os servidores antes:

```bash
pnpm dev &
sleep 90
E2E_WITH_MEDUSA=1 pnpm e2e
```
