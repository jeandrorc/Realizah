# Mega Menu Customizável — Design

> **Data:** 2026-03-05 **Objetivo:** Mega menu na home customizável pelo painel do Medusa
> (categorias, promoções, links, banners de marketing)

---

## 1. Visão Geral

O mega menu aparece no header ao passar o mouse (desktop) ou ao tocar (mobile) em itens de
navegação. Todo o conteúdo é configurável via painel admin do Medusa:

- **Categorias** — vinculadas às categorias de produto do Medusa ou customizadas
- **Promoções** — links para páginas de oferta, cupons, campanhas
- **Links** — links customizados (ex: Sobre, Contato, FAQ)
- **Banners de marketing** — imagens com link, posicionáveis dentro do dropdown

---

## 2. Modelo de Dados

### Tabela `storefront_menu`

Armazena a estrutura do menu principal (header). Um único registro por loja.

```ts
interface StorefrontMenu {
  id: string;
  name: string; // ex: "header_main"
  items: MenuItem[]; // JSONB — array ordenado de itens
  metadata?: Record<string, unknown>;
  created_at: Date;
  updated_at: Date;
}

interface MenuItem {
  id: string; // uuid
  type: 'category' | 'promotion' | 'link' | 'banner' | 'divider';
  label: string; // texto exibido no trigger
  href?: string; // para link/promotion — URL
  order: number; // ordenação

  // category
  categoryId?: string; // ID da ProductCategory do Medusa (opcional)
  categorySlug?: string; // fallback se não houver categoryId

  // promotion
  badge?: string; // ex: "OFERTA", "-30%"
  badgeColor?: string; // fire | sun | custom hex

  // banner (dentro de um dropdown)
  imageUrl?: string;
  imageAlt?: string;
  position?: 'left' | 'right' | 'bottom'; // onde o banner aparece no dropdown

  // children (subitens — ex: subcategorias, links agrupados)
  children?: MenuItem[];
}
```

### Exemplo de payload

```json
{
  "items": [
    {
      "id": "item_1",
      "type": "category",
      "label": "Produtos",
      "categoryId": "pcat_xxx",
      "order": 0,
      "children": [
        {
          "id": "item_1a",
          "type": "category",
          "label": "Tênis",
          "categorySlug": "tenis-calcados",
          "order": 0
        },
        {
          "id": "item_1b",
          "type": "category",
          "label": "Roupas",
          "categorySlug": "roupas-moda",
          "order": 1
        }
      ]
    },
    {
      "id": "item_2",
      "type": "promotion",
      "label": "Ofertas",
      "href": "/products?sort=discount",
      "badge": "-30%",
      "badgeColor": "fire",
      "order": 1
    },
    {
      "id": "item_3",
      "type": "link",
      "label": "Cursos",
      "href": "/courses",
      "order": 2
    },
    {
      "id": "item_4",
      "type": "link",
      "label": "Assinatura",
      "href": "/subscription",
      "order": 3
    }
  ]
}
```

### Banner dentro do dropdown (ex: Produtos)

```json
{
  "id": "item_1",
  "type": "category",
  "label": "Produtos",
  "order": 0,
  "children": [...],
  "banner": {
    "imageUrl": "https://...",
    "imageAlt": "Frete grátis",
    "href": "/promo/frete-gratis",
    "position": "right"
  }
}
```

---

## 3. Arquitetura Backend (Medusa)

### Opção A — Módulo dedicado `storefront-menu-module` _(recomendado)_

```
apps/medusa/src/modules/storefront-menu/
├── models/
│   └── storefront-menu.ts
├── migrations/
│   └── Migration20260305XXXXXX.ts
├── service.ts
└── index.ts
```

- Modelo `StorefrontMenu` com `items` em JSONB
- Service com `getMenu()`, `updateMenu()`
- Migrations para criar tabela

### Opção B — Usar `metadata` do Sales Channel

Medusa permite `metadata` em Sales Channel. Podemos armazenar o menu em
`sales_channel.metadata.menu`. Menos estruturado, mas sem migration.

**Recomendação:** Opção A — mais explícito, versionável, permite histórico.

---

## 4. APIs

### Admin (CRUD)

| Método | Rota                           | Descrição                              |
| ------ | ------------------------------ | -------------------------------------- |
| GET    | `/admin/storefront-menu`       | Retorna menu atual                     |
| PUT    | `/admin/storefront-menu`       | Atualiza menu (replace completo)       |
| PATCH  | `/admin/storefront-menu/items` | Reordena ou atualiza itens específicos |

### Store (público)

| Método | Rota                     | Descrição                                    |
| ------ | ------------------------ | -------------------------------------------- |
| GET    | `/store/storefront-menu` | Retorna menu para o storefront (cache 5 min) |

---

## 5. Admin UI (Medusa Dashboard)

O painel do Medusa v2 suporta **UI Routes** e **Widgets**. Para editar o menu:

1. **Nova rota no admin:** `/settings/storefront-menu` ou `/content/menu`
2. **Componente React** com:
   - Lista de itens arrastáveis (drag-and-drop)
   - Form para cada item (tipo, label, href, categoryId, badge, imagem)
   - Preview do mega menu
   - Botão "Vincular categoria" que abre selector de ProductCategory do Medusa

**Alternativa inicial:** API admin apenas (sem UI custom). Edição via API/Postman até ter tempo para
construir a tela no admin.

---

## 6. Storefront — Componente MegaMenu

### Estrutura visual (desktop)

```
┌─────────────────────────────────────────────────────────────────────────┐
│ [Produtos ▼]  [Ofertas -30%]  [Cursos]  [Assinatura]                     │
└─────────────────────────────────────────────────────────────────────────┘
        │
        ▼ (hover)
┌─────────────────────────────────────────────────────────────────────────┐
│  Tênis          Roupas         Acessórios    │  ┌─────────────────────┐ │
│  Eletrônicos    Fitness        Bags          │  │  BANNER MKT         │ │
│  Casa           Cursos                     │  │  [imagem + link]     │ │
│                                              │  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

### Fluxo de dados

1. **Mounter** `MegaMenuMounter` (Server Component) chama `GET /store/storefront-menu`
2. Se API falhar ou retornar vazio → usa **mock/fallback** (nav atual hardcoded)
3. **MegaMenu** (Client Component) recebe `items` e renderiza dropdown com hover/touch

### Responsivo

- **Desktop:** hover no item → dropdown
- **Mobile:** tap no item → expande accordion ou abre sheet lateral com o conteúdo do dropdown

---

## 7. Integração com Product Categories (Medusa)

Medusa v2 tem `ProductCategory`. O admin pode:

- **Vincular** um item de menu a uma `ProductCategory` existente → slug e subcategorias vêm do
  Medusa
- **Ou** usar `categorySlug` manual (para quando não há categoria no backend)

O storefront resolve:

- Se `categoryId` → busca categoria no Medusa para pegar slug, nome, imagem
- Se só `categorySlug` → usa slug direto para `/categories/[slug]`

---

## 8. Status da Implementação

**Storefront:** ✅ Implementado — MegaMenu com mock, fallback automático quando Medusa não responde.

**Medusa:** ✅ Código criado (módulo, migration, APIs) — ⚠️ pendente: habilitar o módulo no
`medusa-config.js`. O módulo `storefront-menu` está comentado no config pois o carregamento de
módulos locais pode falhar com `Cannot find module`. Para habilitar:

1. Descomente em `medusa-config.js`: `{ resolve: './src/modules/storefront-menu' }`
2. Rode `pnpm --filter medusa db:migrate` para criar a tabela e seed
3. Rode `pnpm --filter medusa dev` e teste `GET /store/storefront-menu`

---

## 9. Próximos Passos (Implementação)

1. **Fase 1 — Backend**
   - Criar módulo `storefront-menu` com model + migration
   - Implementar Admin API (GET/PUT)
   - Implementar Store API (GET)
   - Seed com menu padrão (Produtos, Cursos, Assinatura, Ofertas)

2. **Fase 2 — Storefront**
   - Criar `MegaMenuMounter` + `MegaMenu` component
   - Integrar no Header (substituir `navLinks` estáticos)
   - Fallback para mock quando API vazia

3. **Fase 3 — Admin UI**
   - Adicionar rota no Medusa Admin para editar menu
   - Drag-and-drop, forms, preview

---

## 9. Mock / Fallback

Enquanto o backend não estiver pronto, o storefront usa:

```ts
// lib/mock/menu.ts
export const MOCK_MENU_ITEMS = [
  { type: 'category', label: 'Produtos', href: '/products', children: [...] },
  { type: 'promotion', label: 'Ofertas', href: '/products?sort=discount', badge: '-30%' },
  { type: 'link', label: 'Cursos', href: '/courses' },
  { type: 'link', label: 'Assinatura', href: '/subscription' },
];
```

O `MegaMenuMounter` tenta a API primeiro; se falhar, usa `MOCK_MENU_ITEMS`.
