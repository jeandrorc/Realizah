# Plano de implementação — Storefront: dados, adapters e hexagonal leve

> **Para execução task-a-task:** marque os checkboxes (`- [ ]` → `- [x]`) conforme concluir. Cada bloco "Task" pode virar um PR pequeno ou um commit atômico.

**Data:** 2026-05-02  
**Status:** Proposta  
**Escopo:** `apps/storefront` (com toques mínimos em `packages/types` se necessário)

**Goal:** Unificar acesso a produtos Medusa, eliminar duplicação de UI/cartões, validar bordas com Zod onde importa, corrigir hooks órfãos ou APIs Next ausentes, e melhorar SEO da PDP — sem reescrever o monorepo inteiro.

**Architecture:** Uma camada de infraestrutura (`lib/api` ou `infrastructure/medusa`) como única origem de chamadas ao backend; adapters continuam mapeando para props de UI; opcionalmente ports (`interface ProductRepository`) + funções em `application/` para testes sem React; React Query permanece na borda (client).

**Tech Stack:** Next.js 15 App Router, `@medusajs/js-sdk`, TanStack Query v5, Zod 3.25.x, pnpm workspaces, Turborepo.

---

## Contexto (estado atual)

- `lib/api/products.ts` usa o SDK; **mounters** refazem `fetch` manual ao mesmo backend.
- Dois componentes de card: `components/product/product-card.tsx` (adaptado) vs `components/store/product-card.tsx` (`HttpTypes.StoreProduct`).
- `use-products.ts` chama `/api/products`; `use-stock.ts` chama `/api/variants/.../inventory` — **não existem** Route Handlers em `src/app/api` (exceto `storefront-menu`).
- `generateMetadata` na PDP usa só o slug, não os dados do produto.
- Variáveis `NEXT_PUBLIC_MEDUSA_API_URL` vs `NEXT_PUBLIC_MEDUSA_BACKEND_URL` usadas de forma inconsistente.

---

## Convenções deste plano

| Termo | Significado |
|--------|-------------|
| **PR-A** | Primeiro merge possível sem quebrar produção |
| **Done** | `pnpm --filter storefront lint` + `type-check` + smoke manual da home, listagem e PDP |

**Comandos (na raiz do monorepo):**

```bash
pnpm --filter storefront lint
pnpm --filter storefront type-check
pnpm --filter storefront build
pnpm exec playwright test   # se alterar fluxos críticos
```

---

## Fase 0 — Baseline e decisão sobre hooks órfãos

### Task 0.1 — Inventário de env Medusa

**Files:**

- Read/modify: `apps/storefront/.env.example` (criar se não existir)
- Modify: `apps/storefront/src/lib/medusa.ts`
- Modify: `apps/storefront/src/lib/config.ts` (se centralizar base URL)

- [ ] **Step 1:** Listar todos os usos de `NEXT_PUBLIC_MEDUSA_*` no storefront (`rg MEDUSA apps/storefront`).
- [ ] **Step 2:** Escolher **uma** variável canônica para URL pública do backend (recomendado: alinhar ao que `medusa.ts` já usa — `NEXT_PUBLIC_MEDUSA_API_URL`).
- [ ] **Step 3:** Documentar no `.env.example` todas as variáveis obrigatórias para dev e produção.
- [ ] **Step 4:** Substituir fallbacks `MEDUSA_BACKEND_URL` nos mounters por import de helper único, por exemplo `getMedusaStoreBaseUrl()` em `lib/config.ts`.

**Done:** Um só lugar define a base URL usada por SDK e por fetchers legados durante a migração.

---

### Task 0.2 — Hooks `use-products` / `use-stock`: implementar ou remover

**Files:**

- `apps/storefront/src/queries/product/use-products.ts`
- `apps/storefront/src/queries/product/use-stock.ts`
- Create (opção A): `apps/storefront/src/app/api/products/route.ts`
- Create (opção A): `apps/storefront/src/app/api/variants/[variantId]/inventory/route.ts`
- Ou (opção B): remover imports mortos e arquivos se não forem usados

- [ ] **Step 1:** Confirmar com `rg` que nenhum componente importa `useProducts` / `useStock`.
- [ ] **Step 2 — Decisão:**
  - **Opção A (manter):** Implementar Route Handlers que delegam a `lib/api/products.ts` (list) e a função equivalente de inventário no SDK ou fetch server-side seguro; retornar JSON estável.
  - **Opção B (corte):** Deletar os dois hooks e registrar no plano/CHANGELOG que filtros infinitos na listagem client ficam para uma issue futura.
- [ ] **Step 3:** Se Opção A, garantir que as rotas não exponham secrets; apenas publishable key já usada no cliente.

**Done:** Nenhum código cliente aponta para `/api/*` inexistente.

---

## Fase 1 — Fonte única para produtos (server)

### Task 1.1 — Consolidar fetch de listagem no mounter

**Files:**

- Modify: `apps/storefront/src/mounters/product/product-list.mounter.tsx`
- Modify: `apps/storefront/src/lib/api/products.ts` (estender params se faltar `brand`, `q`, `order`)

- [ ] **Step 1:** Mapear query params do `fetchProductsServer` atual (`limit`, `category_id`, `collection_id`, `region_id`) para os params do SDK em `listProducts`.
- [ ] **Step 2:** Trocar o corpo de `fetchProductsServer` para chamar `listProducts` (ou nova função `listProductsRaw` que devolve `{ products, count }` no formato esperado pelo adapter).
- [ ] **Step 3:** Manter `revalidate`/cache: se o SDK não expõe `next: { revalidate }`, usar **Route Segment Config** na página ou `unstable_cache` no wrapper — preferir mover fetch para util async usado só em Server Components com tags se necessário.
- [ ] **Step 4:** Testar `/products` e página de categoria com backend ligado; mock fallback (`getMockProducts`) deve continuar funcionando quando lista vazia.

**Done:** Listagem não usa mais `fetch` direto duplicado para `/store/products` no mounter.

---

### Task 1.2 — Consolidar fetch de detalhe no mounter

**Files:**

- Modify: `apps/storefront/src/mounters/product/product-detail.mounter.tsx`
- Modify: `apps/storefront/src/lib/api/products.ts` (`getProduct` já existe — reutilizar)

- [ ] **Step 1:** Substituir `fetchProductByHandle` inline por `getProduct(handle)` do `lib/api/products.ts`.
- [ ] **Step 2:** Garantir que região (`NEXT_PUBLIC_MEDUSA_REGION_ID`) e publishable key continuam aplicadas como no SDK.
- [ ] **Step 3:** Preservar fallback `getMockProduct` quando `null`.

**Done:** Detalhe do produto usa a mesma pilha que `FeaturedProducts` / sitemap.

---

### Task 1.3 — Metadata da PDP alinhada aos dados

**Files:**

- Modify: `apps/storefront/src/app/(store)/products/[handle]/page.tsx`

- [ ] **Step 1:** Extrair função async `getProductForMetadata(handle)` reutilizando `getProduct` (import do mesmo módulo que o mounter).
- [ ] **Step 2:** Em `generateMetadata`, preencher `title`, `description` (truncar), e opcionalmente `openGraph` com título e imagem thumbnail.
- [ ] **Step 3:** Fallback quando produto não existe: `notFound()` ou metadata genérica coerente com 404 do mounter.

**Done:** Inspecionar HTML gerado (`curl` ou DevTools) e ver `<title>` com nome real do produto quando a API responde.

---

## Fase 2 — Um modelo de card de produto

### Task 2.1 — Unificar FeaturedProducts no adapter

**Files:**

- Modify: `apps/storefront/src/components/store/featured-products.tsx`
- Modify: `apps/storefront/src/components/store/product-card.tsx`
- Reuse: `apps/storefront/src/adapters/product.adapter.ts` (`adaptProduct`)

- [ ] **Step 1:** Em `featured-products.tsx`, após `listProducts`, mapear cada `StoreProduct` para `adaptProduct` — pode exigir converter tipo SDK para `Record<string, unknown>` mínimo ou estender `adaptProduct` para aceitar `HttpTypes.StoreProduct`.
- [ ] **Step 2:** Remover uso de `components/store/product-card.tsx` que depende de `HttpTypes`, ou reescrevê-lo para aceitar `ProductCardProps` idêntico ao de `components/product/product-card.tsx`.
- [ ] **Step 3:** Eliminar arquivo duplicado se ficar idêntico ao de `components/product/product-card.tsx` (preferir **um** arquivo exportado de `components/product/` e reexport na store se necessário).

**Done:** Nenhum componente em `components/store/` importa `@medusajs/types` para vitrine de produto.

---

## Fase 3 — Zod nas bordas e tipagem do carrinho

### Task 3.1 — Schema Zod para payload de produto usado no adapter

**Files:**

- Create: `apps/storefront/src/adapters/schemas/product.schema.ts` (ou `lib/schemas/product.ts`)
- Modify: `apps/storefront/src/adapters/product.adapter.ts`

- [ ] **Step 1:** Definir `ProductRawSchema` com `.passthrough()` apenas para campos lidos hoje (`id`, `title`, `handle`, `variants`, `images`, `metadata`, etc.).
- [ ] **Step 2:** Em `adaptProduct` / `adaptProductDetail`, fazer `ProductRawSchema.safeParse(raw)`; em falha, log em dev e retornar objeto seguro ou lançar conforme política do time.
- [ ] **Step 3:** Tipar retorno inferido onde possível (`z.infer`).

**Done:** Resposta malformada da API não gera página silenciosa com `undefined` em cascata.

---

### Task 3.2 — Cart adapter sem `any`

**Files:**

- Modify: `apps/storefront/src/adapters/cart.adapter.ts`
- Reference: tipos em `@medusajs/types` para carrinho store se disponíveis

- [ ] **Step 1:** Substituir `raw: any` por tipo estreito ou schema Zod para line items.
- [ ] **Step 2:** Rodar `pnpm --filter storefront type-check`.

**Done:** ESLint/TS sem `any` explícito no adapter de carrinho.

---

## Fase 4 — Hexagonal leve (opcional, após Fase 1–2 estável)

### Task 4.1 — Port `ProductRepository`

**Files:**

- Create: `apps/storefront/src/application/ports/product.repository.ts`
- Create: `apps/storefront/src/infrastructure/medusa/medusa-product.repository.ts`
- Modify: `apps/storefront/src/lib/api/products.ts` para implementar o port ou ser chamado pelo repository

- [ ] **Step 1:** Definir interface com `list(filters)` e `getByHandle(handle)` retornando tipos de domínio mínimos ou DTOs já usados pelos adapters.
- [ ] **Step 2:** Implementação delega ao SDK existente.
- [ ] **Step 3:** Mounters importam apenas o port (instância singleton) ou funções factory para testes.

**Done:** Teste unitário com mock do port que não precisa de rede.

---

### Task 4.2 — Funções de caso de uso finas

**Files:**

- Create: `apps/storefront/src/application/use-cases/get-product-detail.ts`
- Create: `apps/storefront/src/application/use-cases/list-products-for-grid.ts`

- [ ] **Step 1:** Cada arquivo exporta uma função async pura que recebe repository + input.
- [ ] **Step 2:** Mounters chamam só essas funções.

**Done:** Casos de uso testáveis com mocks de port.

---

## Ordem de PRs sugerida

| Ordem | Conteúdo | Risco |
|-------|----------|--------|
| PR1 | Fase 0 (env + hooks órfãos) | Baixo |
| PR2 | Task 1.1 + 1.2 (mounters → lib/api) | Médio — testar listagem e PDP |
| PR3 | Task 1.3 (metadata) | Baixo |
| PR4 | Fase 2 (card único) | Médio — revisão visual |
| PR5 | Fase 3 (Zod + cart types) | Baixo |
| PR6 | Fase 4 (ports/use cases) | Baixo acoplamento se PR2 estável |

---

## Critérios de aceite globais

- [ ] Uma implementação canônica de leitura de produtos no storefront (SDK via módulo único).
- [ ] PDP com metadata derivada do produto quando encontrado.
- [ ] Sem rotas `/api/*` referenciadas sem implementação.
- [ ] Componentes de vitrine sem dependência direta de `HttpTypes.StoreProduct` onde o adapter já existe.
- [ ] CI local (`lint` + `type-check` + `build`) verde para `storefront`.

---

## Pós-implementação

- [ ] ADR curto em `docs/adr/` se introduzir ports/`application/` de forma definitiva.
- [ ] Atualizar `docs/plans/README.md` status deste plano para **Implementado** quando mergeado.

---

## Referências internas

- [Monorepo architecture design](./2026-03-04-monorepo-architecture-design.md)
- Storefront design histórico: [2026-03-05-fase6-frontend-storefront.md](./2026-03-05-fase6-frontend-storefront.md)
