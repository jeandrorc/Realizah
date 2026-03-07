# Storefront Design — Bold Commerce

> **Aprovado em:** 2026-03-05 **Estilo:** Bold Commerce (Magalu + Nike fusion) **Público:**
> Generalista / base reutilizável para outros projetos

---

## 1. Design System & Tokens

### Paleta de Cores

```css
/* Primários */
--color-ink: #0a0a0a; /* preto quase puro — estrutura */
--color-paper: #fafafa; /* branco levemente quente */
--color-surface: #f2f2f2; /* fundo de seções alternadas */

/* Accent */
--color-fire: #e5001c; /* vermelho energia — CTAs, badges, danger */
--color-sun: #ffd000; /* amarelo âncora — ofertas, destaque, CTA checkout */

/* Neutros */
--color-zinc-200: #e4e4e7;
--color-zinc-500: #71717a;
--color-zinc-800: #27272a;

/* Semânticos */
--color-success: #16a34a;
--color-warning: #f59e0b;
--color-danger: #e5001c;
```

### Tipografia

- **Display / Headings:** Bebas Neue (Google Fonts via `next/font/google`)
  - H1 hero: 72px
  - H2 seções: 48px
  - H3 cards: 32px
- **Body / UI:** Inter (já configurado)
  - Base: 16px / line-height 1.6
  - Small: 14px
  - Micro: 12px (labels, badges)

### Espaçamento

```
4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96px
```

### Border Radius

```
--radius-sm:   4px    (badges, inputs)
--radius-md:   8px    (cards, botões)
--radius-lg:   16px   (modais, hero, drawers)
--radius-pill: 9999px (chips, tags)
```

### Botões

| Variante  | Fundo                          | Texto     | Hover                        |
| --------- | ------------------------------ | --------- | ---------------------------- |
| primary   | `#0A0A0A`                      | branco    | fundo `#E5001C`              |
| secondary | transparente + borda `#0A0A0A` | `#0A0A0A` | fundo `#0A0A0A` texto branco |
| accent    | `#FFD000`                      | `#0A0A0A` | saturação +10%               |
| danger    | `#E5001C`                      | branco    | opacity 90%                  |
| ghost     | transparente                   | `#0A0A0A` | fundo `#F2F2F2`              |

### Sombras

```
shadow-sm: 0 1px 3px rgba(0,0,0,0.08)    — cards repouso
shadow-md: 0 4px 16px rgba(0,0,0,0.12)   — cards hover
shadow-lg: 0 8px 32px rgba(0,0,0,0.16)   — modais, drawers
```

---

## 2. Arquitetura de Componentes

### Camadas

```
Page (Server Component)
  └── Mounter (Server Component — fetcha dados)
        └── Adapter (função pura — Medusa API → props)
              └── Component (UI pura — recebe props, zero side effects)
```

### Regras por camada

| Camada        | Pode                                | Não pode                      |
| ------------- | ----------------------------------- | ----------------------------- |
| `components/` | JSX, estado UI local                | fetch, API, lógica de negócio |
| `adapters/`   | transformar dados, formatar         | fetch, efeitos, estado        |
| `mounters/`   | fetch, adapters, compor components  | estado UI, `'use client'`     |
| `pages/`      | compor mounters, `generateMetadata` | lógica de negócio direta      |
| `queries/`    | TanStack hooks, mutations           | fetch direto sem cache        |

### Estrutura de pastas

```
src/
├── components/
│   ├── ui/                          # shadcn/ui primitivos
│   ├── layout/                      # Header, Footer, Navbar
│   ├── product/
│   │   ├── product-card.tsx
│   │   ├── product-grid.tsx
│   │   ├── product-gallery.tsx
│   │   └── product-info.tsx
│   ├── category/
│   │   ├── category-banner.tsx
│   │   └── category-nav.tsx
│   ├── brand/
│   │   └── brand-hero.tsx
│   ├── cart/
│   │   ├── cart-item.tsx
│   │   └── cart-summary.tsx
│   ├── checkout/
│   │   ├── checkout-form.tsx
│   │   └── order-summary.tsx
│   ├── course/
│   │   └── course-card.tsx
│   └── home/
│       ├── hero-section.tsx
│       ├── offers-countdown.tsx
│       └── subscription-banner.tsx
│
├── mounters/
│   ├── product/
│   │   ├── featured-products.mounter.tsx
│   │   ├── product-list.mounter.tsx
│   │   └── product-detail.mounter.tsx
│   ├── category/
│   │   └── category-products.mounter.tsx
│   ├── brand/
│   │   └── brand-products.mounter.tsx
│   ├── cart/
│   │   └── cart-items.mounter.tsx
│   └── home/
│       └── offers.mounter.tsx
│
├── adapters/
│   ├── product.adapter.ts
│   ├── category.adapter.ts
│   ├── brand.adapter.ts
│   ├── cart.adapter.ts
│   └── order.adapter.ts
│
└── queries/
    ├── product/
    │   ├── use-products.ts
    │   ├── use-product.ts
    │   └── use-stock.ts
    ├── cart/
    │   ├── use-cart.ts
    │   ├── use-add-to-cart.ts
    │   ├── use-remove-from-cart.ts
    │   └── use-update-quantity.ts
    ├── checkout/
    │   ├── use-apply-coupon.ts
    │   ├── use-shipping.ts
    │   └── use-place-order.ts
    ├── wishlist/
    │   └── use-wishlist.ts
    └── review/
        └── use-product-reviews.ts
```

### TanStack Query — dados por estratégia

| Dado                 | Estratégia                      | Motivo                          |
| -------------------- | ------------------------------- | ------------------------------- |
| PLP (lista produtos) | Mounter SSR + HydrationBoundary | SEO crítico                     |
| PDP (detalhe)        | Mounter SSR + HydrationBoundary | SEO crítico                     |
| Carrinho             | TanStack Query staleTime: 0     | Interativo, muda frequentemente |
| Favoritos            | TanStack Query                  | User-specific                   |
| Estoque variante     | TanStack Query                  | Real-time                       |
| Cálculo de frete     | TanStack Query (trigger CEP)    | Ação do usuário                 |
| Filtros PLP          | useInfiniteQuery client         | UX fluida sem reload            |
| Avaliações           | TanStack Query lazy             | Below the fold                  |
| Cupom                | useMutation                     | Ação do usuário                 |
| Checkout submit      | useMutation + retry             | Ação crítica                    |

### QueryClient config

```ts
// lib/query-client.ts
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      retry: 2,
      refetchOnWindowFocus: false,
    },
    mutations: { retry: 1 },
  },
});
```

---

## 3. Layout Global

### Header (fixo, `#0A0A0A`)

```
[Logo Bold branco]  [Busca pill expansível]  [Conta] [Favoritos] [Carrinho badge]
```

- Topbar de oferta em `--color-sun` (amarelo), texto preto, fechável
- Mobile: hamburger → drawer lateral full-height
- Mega menu hover: categorias com imagem + links rápidos

### Footer

```
[Logo + tagline]  [Links rápidos]  [Categorias]  [Redes Sociais]
[Selos: Mercado Pago | SSL | Satisfação Garantida]  [Copyright]
```

---

## 4. Home Page

```
┌─────────────────────────────────────────────────────┐
│  HERO — container max-w-7xl, max-h 600px, radius-lg │
│  Título Bebas 72px + subtítulo + CTA                │
│  Imagem/vídeo cover + overlay gradiente escuro      │
├─────────────────────────────────────────────────────┤
│  CATEGORIA RÁPIDA — ícones + label (scroll horiz.)  │
├─────────────────────────────────────────────────────┤
│  OFERTAS DO DIA — countdown timer + cards produto   │
│  badge --color-fire "OFERTA" + preço riscado        │
├─────────────────────────────────────────────────────┤
│  BANNER DUPLO — 2 col: Novidades | Mais Vendidos    │
├─────────────────────────────────────────────────────┤
│  PRODUTOS DESTAQUE — grid 4 cols, 8 produtos        │
├─────────────────────────────────────────────────────┤
│  CURSOS EM DESTAQUE — carrossel horizontal          │
├─────────────────────────────────────────────────────┤
│  BANNER ASSINATURA — fundo #0A0A0A, CTA --color-sun │
└─────────────────────────────────────────────────────┘
```

**SEO:** structured data `WebSite` + `Organization`, OG image

---

## 5. PLP — Product Listing Page

```
┌──────┬───────────────────────────────────────────────┐
│FILTROS│  SORT BAR + contagem                          │
│sticky │  GRID: 4 cols desktop / 2 cols mobile         │
│       │  Product Cards com hover                      │
│Preço  │  PAGINATION / infinite scroll                 │
│Marca  │                                               │
│Rating │                                               │
└──────┴───────────────────────────────────────────────┘
```

**Product Card:** hover zoom, badge "NOVO"/"OFERTA"/"% OFF" em `--color-fire`, botão Adicionar no
hover (desktop) / fixo (mobile)

**SEO:** `ItemList` structured data, canonical, `generateMetadata`

---

## 6. Category Page & Brand Page

Mesma estrutura da PLP + hero banner personalizado:

```
┌─────────────────────────────────────────────────────┐
│  BANNER — imagem cover, 340px, gradiente bottom     │
│  Logo/nome da categoria ou marca                    │
└─────────────────────────────────────────────────────┘
[PLP abaixo]
```

Brand page adiciona: descrição + produtos em destaque da marca.

**SEO:** structured data `Brand` / `BreadcrumbList`

---

## 7. PDP — Product Detail Page

```
┌──────────────────────┬──────────────────────────────┐
│  GALERIA             │  Nome (Bebas 32px)            │
│  Imagem principal    │  SKU | Marca | Avaliações ⭐  │
│  thumbs + zoom       │  Preço bold 40px             │
│                      │  Parcelamento                 │
│                      │  VARIANTES (cor/tamanho)      │
│                      │  QTD selector                 │
│                      │  [COMPRAR AGORA] primary      │
│                      │  [ADICIONAR] secondary        │
│                      │  Frete: CEP → cálculo         │
│                      │  Selos segurança              │
├──────────────────────┴──────────────────────────────┤
│  TABS: Descrição | Especificações | Avaliações      │
├─────────────────────────────────────────────────────┤
│  PRODUTOS RELACIONADOS — carrossel                  │
└─────────────────────────────────────────────────────┘
```

**SEO:** structured data `Product`, `AggregateRating`, `Offer`, OG image com imagem do produto

---

## 8. Cart

```
┌──────────────────────────┬──────────────────────────┐
│  ITEMS                   │  RESUMO                  │
│  img + nome + variante   │  Subtotal                │
│  preço + QTD [−][+] [🗑] │  Frete (CEP)             │
│                          │  Desconto                │
│  + CUPOM                 │  TOTAL + parcelas        │
│  [campo + aplicar]       │  [FINALIZAR COMPRA] →    │
│  ← Continuar comprando   │                          │
└──────────────────────────┴──────────────────────────┘
```

---

## 9. Checkout One-Page

```
┌─────────────────────────────────────────────────────┐
│  LOGO + "Compra 100% segura 🔒"  (header limpo)    │
├──────────────────────────┬──────────────────────────┤
│  1. IDENTIFICAÇÃO        │  RESUMO sticky           │
│  Email (verifica conta)  │  (colapsável no mobile)  │
│  ──────────────────────  │                          │
│  2. ENDEREÇO             │  Items + qtd             │
│  CEP → autocomplete      │  Subtotal / Frete        │
│  ──────────────────────  │  Cupom / Total           │
│  3. PAGAMENTO            │                          │
│  [PIX] [Cartão] [Boleto] │                          │
│  form dinâmico MP SDK    │                          │
│  ──────────────────────  │                          │
│  [CONFIRMAR PEDIDO]      │                          │
│  CTA --color-sun + 🔒   │                          │
└──────────────────────────┴──────────────────────────┘
```

Sem nav de loja no checkout (zero distração). Mobile: resumo colapsado no topo.

---

## 10. SEO — Estratégia Global

| Página   | Title pattern                             | Structured data                       |
| -------- | ----------------------------------------- | ------------------------------------- |
| Home     | `Realizah — [tagline]`                    | `WebSite`, `Organization`             |
| PLP      | `[Cat] — Compre online \| Realizah`       | `ItemList`                            |
| PDP      | `[Produto] — R$ [Preço] \| Realizah`      | `Product`, `Offer`, `AggregateRating` |
| Brand    | `[Marca] — Produtos oficiais \| Realizah` | `Brand`                               |
| Category | `[Categoria] — Ver todos \| Realizah`     | `BreadcrumbList`                      |

- `generateMetadata` em todas as páginas
- `app/sitemap.ts` dinâmico
- `app/robots.ts`
- `app/opengraph-image.tsx` via `next/og`
- `next/image` em todas as imagens
- Skeleton states em todos os componentes assíncronos

---

## Domínios dos Agentes

| Agente                      | Escopo                          | Arquivos principais                                 |
| --------------------------- | ------------------------------- | --------------------------------------------------- |
| A — Design System           | tokens, tailwind, fonts         | `globals.css`, `tailwind.config.ts`                 |
| B — Layout Global           | header, footer, providers       | `layout/`, `app/layout.tsx`, `query-client.ts`      |
| C — Home + Category + Brand | páginas + mounters + adapters   | `home/`, `category/`, `brand/`, rotas               |
| D — PLP + PDP               | produtos + queries              | `product/`, `mounters/product/`, `queries/product/` |
| E — Cart + Checkout + SEO   | carrinho + checkout + infra SEO | `cart/`, `checkout/`, `queries/cart/`, `sitemap.ts` |
