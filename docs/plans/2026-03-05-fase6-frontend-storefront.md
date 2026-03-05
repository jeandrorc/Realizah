# Fase 6 — Frontend Storefront Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan
> task-by-task.

**Goal:** Implementar a interface completa do storefront Next.js 15 com loja, área de membros,
cursos, downloads e assinaturas integrados ao backend Medusa v2.

**Architecture:** Next.js 15 App Router com Server Components por padrão, Client Components apenas
onde necessário (interatividade, estado). SDK do Medusa para chamadas de API, Tailwind CSS +
shadcn/ui para design system. Estado global mínimo (carrinho, sessão) via Zustand.

**Tech Stack:** Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui, Medusa JS SDK,
Zustand, React Hook Form, Zod, Vitest, Playwright (E2E)

---

## Pré-requisitos

- Fases 1–5 concluídas (monorepo, módulos Medusa, Mercado Pago)
- `apps/storefront/` já existe com Next.js 15 base setup (Fase 1)
- Medusa rodando em `http://localhost:9000`
- PostgreSQL com dados seed

---

## Estrutura Final do Storefront

```
apps/storefront/src/
├── app/
│   ├── (store)/               # Grupo de rotas da loja pública
│   │   ├── layout.tsx         # Layout da loja (header, footer)
│   │   ├── page.tsx           # Home
│   │   ├── products/
│   │   │   ├── page.tsx       # Catálogo de produtos
│   │   │   └── [handle]/
│   │   │       └── page.tsx   # Detalhe do produto
│   │   ├── cart/
│   │   │   └── page.tsx       # Carrinho
│   │   ├── checkout/
│   │   │   └── page.tsx       # Checkout
│   │   └── courses/
│   │       ├── page.tsx       # Catálogo de cursos
│   │       └── [id]/
│   │           └── page.tsx   # Detalhe do curso
│   ├── (auth)/                # Grupo de autenticação
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── forgot-password/
│   │       └── page.tsx
│   ├── (members)/             # Área de membros (autenticado)
│   │   ├── layout.tsx         # Layout com sidebar
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── my-courses/
│   │   │   ├── page.tsx
│   │   │   └── [enrollmentId]/
│   │   │       └── lessons/
│   │   │           └── [lessonId]/
│   │   │               └── page.tsx  # Player de aula
│   │   ├── my-downloads/
│   │   │   └── page.tsx
│   │   ├── subscription/
│   │   │   └── page.tsx
│   │   └── profile/
│   │       └── page.tsx
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts
│   ├── layout.tsx             # Root layout
│   └── globals.css
├── components/
│   ├── ui/                    # shadcn/ui primitives
│   ├── layout/                # Header, Footer, Sidebar
│   ├── store/                 # Componentes da loja
│   ├── courses/               # Componentes de cursos
│   ├── members/               # Componentes da área de membros
│   └── shared/                # Componentes reutilizáveis
├── lib/
│   ├── medusa.ts              # Medusa SDK client
│   ├── auth.ts                # Auth helpers
│   └── utils.ts               # Utilitários
├── hooks/                     # Custom hooks
├── store/                     # Zustand stores
│   ├── cart.ts
│   └── auth.ts
└── types/                     # Tipos locais do storefront
```

---

## Task 1: Instalar Dependências e Configurar shadcn/ui

**Files:**

- Modify: `apps/storefront/package.json`
- Modify: `apps/storefront/tailwind.config.ts`
- Create: `apps/storefront/components.json` (shadcn config)

**Step 1: Instalar dependências**

```bash
cd apps/storefront
pnpm add @medusajs/js-sdk zustand react-hook-form @hookform/resolvers zod
pnpm add @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-slot
pnpm add class-variance-authority clsx tailwind-merge lucide-react
pnpm add next-themes
pnpm add --save-dev @playwright/test
```

**Step 2: Inicializar shadcn/ui**

```bash
pnpm dlx shadcn@latest init
```

Responder ao prompt:

- Style: Default
- Base color: Neutral
- CSS variables: Yes

**Step 3: Adicionar componentes shadcn essenciais**

```bash
pnpm dlx shadcn@latest add button card input label badge
pnpm dlx shadcn@latest add dialog sheet toast dropdown-menu
pnpm dlx shadcn@latest add avatar progress separator skeleton
pnpm dlx shadcn@latest add form select textarea
```

**Step 4: Verificar build**

```bash
pnpm --filter storefront type-check
```

Expected: sem erros de tipo.

**Step 5: Commit**

```bash
git add apps/storefront/
git commit -m "chore(storefront): install dependencies and configure shadcn/ui"
```

**Validação:**

- [ ] `pnpm --filter storefront dev` inicia sem erro
- [ ] Componentes shadcn disponíveis em `components/ui/`
- [ ] Tailwind configurado com CSS variables

---

## Task 2: Medusa SDK Client e Layer de API

**Files:**

- Create: `apps/storefront/src/lib/medusa.ts`
- Create: `apps/storefront/src/lib/api/products.ts`
- Create: `apps/storefront/src/lib/api/courses.ts`
- Create: `apps/storefront/src/lib/api/cart.ts`
- Create: `apps/storefront/src/lib/api/auth.ts`
- Create: `apps/storefront/src/lib/api/subscriptions.ts`

**Step 1: Criar cliente Medusa**

```typescript
// apps/storefront/src/lib/medusa.ts
import Medusa from '@medusajs/js-sdk';

export const medusa = new Medusa({
  baseUrl: process.env.NEXT_PUBLIC_MEDUSA_API_URL ?? 'http://localhost:9000',
  debug: process.env.NODE_ENV === 'development',
  auth: {
    type: 'session',
  },
});
```

**Step 2: Criar funções de API — Products**

```typescript
// apps/storefront/src/lib/api/products.ts
import { medusa } from '../medusa';

export async function listProducts(params?: {
  limit?: number;
  offset?: number;
  category_id?: string[];
}) {
  const { products, count, limit, offset } = await medusa.store.product.list(params ?? {});
  return { products, count, limit, offset };
}

export async function getProduct(handle: string) {
  const { products } = await medusa.store.product.list({ handle });
  return products[0] ?? null;
}
```

**Step 3: Criar funções de API — Cart**

```typescript
// apps/storefront/src/lib/api/cart.ts
import { medusa } from '../medusa';

export async function createCart() {
  const { cart } = await medusa.store.cart.create({});
  return cart;
}

export async function getCart(cartId: string) {
  const { cart } = await medusa.store.cart.retrieve(cartId);
  return cart;
}

export async function addToCart(cartId: string, variantId: string, quantity: number) {
  const { cart } = await medusa.store.cart.createLineItem(cartId, {
    variant_id: variantId,
    quantity,
  });
  return cart;
}

export async function removeFromCart(cartId: string, lineItemId: string) {
  const { cart } = await medusa.store.cart.deleteLineItem(cartId, lineItemId);
  return cart;
}
```

**Step 4: Criar funções de API — Auth**

```typescript
// apps/storefront/src/lib/api/auth.ts
import { medusa } from '../medusa';

export async function login(email: string, password: string) {
  const token = await medusa.auth.login('customer', 'emailpass', { email, password });
  return token;
}

export async function register(data: {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}) {
  await medusa.auth.register('customer', 'emailpass', {
    email: data.email,
    password: data.password,
  });
  const token = await medusa.auth.login('customer', 'emailpass', {
    email: data.email,
    password: data.password,
  });
  await medusa.store.customer.create({ ...data });
  return token;
}

export async function logout() {
  await medusa.auth.logout();
}

export async function getCustomer() {
  try {
    const { customer } = await medusa.store.customer.retrieve();
    return customer;
  } catch {
    return null;
  }
}
```

**Step 5: Verificar tipos**

```bash
pnpm --filter storefront type-check
```

Expected: sem erros.

**Step 6: Commit**

```bash
git add apps/storefront/src/lib/
git commit -m "feat(storefront): add Medusa SDK client and API layer"
```

**Validação:**

- [ ] `medusa.ts` exporta cliente configurado
- [ ] Funções de API tipadas corretamente
- [ ] `type-check` passa

---

## Task 3: Zustand Stores (Cart e Auth)

**Files:**

- Create: `apps/storefront/src/store/cart.ts`
- Create: `apps/storefront/src/store/auth.ts`
- Create: `apps/storefront/src/store/index.ts`

**Step 1: Criar cart store**

```typescript
// apps/storefront/src/store/cart.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createCart, getCart, addToCart, removeFromCart } from '@/lib/api/cart';

interface CartState {
  cartId: string | null;
  itemCount: number;
  isOpen: boolean;
  setCartId: (id: string) => void;
  setItemCount: (count: number) => void;
  setIsOpen: (open: boolean) => void;
  initCart: () => Promise<void>;
  addItem: (variantId: string, quantity: number) => Promise<void>;
  removeItem: (lineItemId: string) => Promise<void>;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartId: null,
      itemCount: 0,
      isOpen: false,
      setCartId: (id) => set({ cartId: id }),
      setItemCount: (count) => set({ itemCount: count }),
      setIsOpen: (open) => set({ isOpen: open }),
      initCart: async () => {
        const { cartId } = get();
        if (cartId) {
          try {
            const cart = await getCart(cartId);
            set({ itemCount: cart.items?.length ?? 0 });
            return;
          } catch {
            // Cart expired, create new one
          }
        }
        const cart = await createCart();
        set({ cartId: cart.id, itemCount: 0 });
      },
      addItem: async (variantId, quantity) => {
        const { cartId, initCart } = get();
        if (!cartId) await initCart();
        const currentCartId = get().cartId!;
        const cart = await addToCart(currentCartId, variantId, quantity);
        set({ itemCount: cart.items?.length ?? 0 });
      },
      removeItem: async (lineItemId) => {
        const { cartId } = get();
        if (!cartId) return;
        const cart = await removeFromCart(cartId, lineItemId);
        set({ itemCount: cart.items?.length ?? 0 });
      },
    }),
    { name: 'realizah-cart', partialize: (state) => ({ cartId: state.cartId }) },
  ),
);
```

**Step 2: Criar auth store**

```typescript
// apps/storefront/src/store/auth.ts
import { create } from 'zustand';

interface Customer {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

interface AuthState {
  customer: Customer | null;
  isLoading: boolean;
  setCustomer: (customer: Customer | null) => void;
  setIsLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  customer: null,
  isLoading: true,
  setCustomer: (customer) => set({ customer }),
  setIsLoading: (isLoading) => set({ isLoading }),
}));
```

**Step 3: Commit**

```bash
git add apps/storefront/src/store/
git commit -m "feat(storefront): add Zustand stores for cart and auth"
```

**Validação:**

- [ ] Stores tipados corretamente
- [ ] `type-check` passa

---

## Task 4: Root Layout, Globals e Providers

**Files:**

- Modify: `apps/storefront/src/app/layout.tsx`
- Modify: `apps/storefront/src/app/globals.css`
- Create: `apps/storefront/src/components/providers.tsx`
- Create: `apps/storefront/src/components/layout/header.tsx`
- Create: `apps/storefront/src/components/layout/footer.tsx`

**Step 1: Criar Providers client component**

```typescript
// apps/storefront/src/components/providers.tsx
'use client';

import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      {children}
      <Toaster />
    </ThemeProvider>
  );
}
```

**Step 2: Atualizar Root Layout**

```typescript
// apps/storefront/src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/providers';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: { template: '%s | Realizah', default: 'Realizah' },
  description: 'Plataforma de e-commerce, cursos e produtos digitais',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

**Step 3: Criar Header**

```typescript
// apps/storefront/src/components/layout/header.tsx
import Link from 'next/link';
import { ShoppingCart, User, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CartIcon } from '@/components/store/cart-icon';

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          Realizah
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/products" className="hover:text-primary transition-colors">
            Loja
          </Link>
          <Link href="/courses" className="hover:text-primary transition-colors">
            Cursos
          </Link>
          <Link href="/subscription" className="hover:text-primary transition-colors">
            Planos
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <CartIcon />
          <Button variant="ghost" size="icon" asChild>
            <Link href="/login">
              <User className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
```

**Step 4: Criar Footer**

```typescript
// apps/storefront/src/components/layout/footer.tsx
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-semibold mb-3">Realizah</h3>
          <p className="text-sm text-muted-foreground">
            Plataforma de e-commerce, cursos e produtos digitais.
          </p>
        </div>
        <div>
          <h3 className="font-semibold mb-3">Loja</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/products" className="hover:text-primary">Produtos</Link></li>
            <li><Link href="/courses" className="hover:text-primary">Cursos</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-3">Conta</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/login" className="hover:text-primary">Entrar</Link></li>
            <li><Link href="/register" className="hover:text-primary">Criar conta</Link></li>
            <li><Link href="/dashboard" className="hover:text-primary">Área de membros</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-3">Planos</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/subscription" className="hover:text-primary">Ver planos</Link></li>
          </ul>
        </div>
      </div>
      <div className="container pb-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Realizah. Todos os direitos reservados.
      </div>
    </footer>
  );
}
```

**Step 5: Verificar build**

```bash
pnpm --filter storefront build
```

Expected: build sem erros.

**Step 6: Commit**

```bash
git add apps/storefront/src/
git commit -m "feat(storefront): add root layout, providers, header and footer"
```

**Validação:**

- [ ] Layout renderiza sem erros
- [ ] Header com navegação e ícones
- [ ] Footer com links
- [ ] Build passa

---

## Task 5: Store Layout e Página Inicial

**Files:**

- Create: `apps/storefront/src/app/(store)/layout.tsx`
- Create: `apps/storefront/src/app/(store)/page.tsx`
- Create: `apps/storefront/src/components/store/hero-section.tsx`
- Create: `apps/storefront/src/components/store/featured-products.tsx`
- Create: `apps/storefront/src/components/store/product-card.tsx`

**Step 1: Store Layout**

```typescript
// apps/storefront/src/app/(store)/layout.tsx
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
```

**Step 2: Hero Section component**

```typescript
// apps/storefront/src/components/store/hero-section.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-background py-24 md:py-32">
      <div className="container text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
          Aprenda. Acesse. <span className="text-primary">Evolua.</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          Cursos, produtos digitais e ferramentas para acelerar seu crescimento.
          Tudo em um só lugar.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/courses">Ver Cursos</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/subscription">Ver Planos</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
```

**Step 3: Product Card component**

```typescript
// apps/storefront/src/components/store/product-card.tsx
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    handle: string;
    thumbnail?: string;
    variants?: Array<{ prices?: Array<{ amount: number; currency_code: string }> }>;
    tags?: Array<{ value: string }>;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const price = product.variants?.[0]?.prices?.[0];

  return (
    <Card className="group overflow-hidden hover:shadow-md transition-shadow">
      <Link href={`/products/${product.handle}`}>
        <div className="aspect-square bg-muted overflow-hidden">
          {product.thumbnail ? (
            <Image
              src={product.thumbnail}
              alt={product.title}
              width={400}
              height={400}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-4xl">
              🛍️
            </div>
          )}
        </div>
      </Link>
      <CardContent className="p-4">
        <Link href={`/products/${product.handle}`}>
          <h3 className="font-semibold line-clamp-2 hover:text-primary transition-colors">
            {product.title}
          </h3>
        </Link>
        {price && (
          <p className="text-lg font-bold mt-1">
            {formatCurrency(price.amount, price.currency_code)}
          </p>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" size="sm">Adicionar ao Carrinho</Button>
      </CardFooter>
    </Card>
  );
}
```

**Step 4: Adicionar formatCurrency ao lib/utils.ts**

```typescript
// apps/storefront/src/lib/utils.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = 'BRL'): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
}
```

**Step 5: Home Page**

```typescript
// apps/storefront/src/app/(store)/page.tsx
import { HeroSection } from '@/components/store/hero-section';
import { FeaturedProducts } from '@/components/store/featured-products';
import { FeaturedCourses } from '@/components/courses/featured-courses';
import { SubscriptionBanner } from '@/components/store/subscription-banner';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedProducts />
      <FeaturedCourses />
      <SubscriptionBanner />
    </>
  );
}
```

**Step 6: Commit**

```bash
git add apps/storefront/src/
git commit -m "feat(storefront): add store layout, home page and product card"
```

**Validação:**

- [ ] Home page renderiza sem erros
- [ ] Hero Section com CTA
- [ ] Product Card com imagem, título e preço

---

## Task 6: Catálogo e Detalhe de Produtos

**Files:**

- Create: `apps/storefront/src/app/(store)/products/page.tsx`
- Create: `apps/storefront/src/app/(store)/products/[handle]/page.tsx`
- Create: `apps/storefront/src/components/store/product-grid.tsx`
- Create: `apps/storefront/src/components/store/add-to-cart-button.tsx`

**Step 1: Products page**

```typescript
// apps/storefront/src/app/(store)/products/page.tsx
import { listProducts } from '@/lib/api/products';
import { ProductGrid } from '@/components/store/product-grid';

export const metadata = { title: 'Produtos' };

export default async function ProductsPage() {
  const { products } = await listProducts({ limit: 20 });

  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Produtos</h1>
        <p className="text-muted-foreground mt-2">
          {products.length} produto{products.length !== 1 ? 's' : ''} disponível{products.length !== 1 ? 'is' : ''}
        </p>
      </div>
      <ProductGrid products={products} />
    </div>
  );
}
```

**Step 2: Product detail page**

```typescript
// apps/storefront/src/app/(store)/products/[handle]/page.tsx
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getProduct } from '@/lib/api/products';
import { AddToCartButton } from '@/components/store/add-to-cart-button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';

interface ProductPageProps {
  params: Promise<{ handle: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { handle } = await params;
  const product = await getProduct(handle);

  if (!product) notFound();

  const price = product.variants?.[0]?.prices?.[0];

  return (
    <div className="container py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="aspect-square bg-muted rounded-lg overflow-hidden">
          {product.thumbnail ? (
            <Image
              src={product.thumbnail}
              alt={product.title}
              width={600}
              height={600}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">🛍️</div>
          )}
        </div>
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold">{product.title}</h1>
            {price && (
              <p className="text-2xl font-bold text-primary mt-2">
                {formatCurrency(price.amount, price.currency_code)}
              </p>
            )}
          </div>
          {product.description && (
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          )}
          {product.variants?.[0] && (
            <AddToCartButton variantId={product.variants[0].id} />
          )}
        </div>
      </div>
    </div>
  );
}
```

**Step 3: AddToCartButton (client component)**

```typescript
// apps/storefront/src/components/store/add-to-cart-button.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cart';
import { ShoppingCart, Loader2 } from 'lucide-react';

interface AddToCartButtonProps {
  variantId: string;
  quantity?: number;
}

export function AddToCartButton({ variantId, quantity = 1 }: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const handleAdd = async () => {
    setIsLoading(true);
    try {
      await addItem(variantId, quantity);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button size="lg" onClick={handleAdd} disabled={isLoading} className="w-full">
      {isLoading ? (
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
      ) : (
        <ShoppingCart className="h-5 w-5 mr-2" />
      )}
      {isLoading ? 'Adicionando...' : 'Adicionar ao Carrinho'}
    </Button>
  );
}
```

**Step 4: Commit**

```bash
git add apps/storefront/src/
git commit -m "feat(storefront): add product catalog and detail pages"
```

**Validação:**

- [ ] `/products` lista produtos do Medusa
- [ ] `/products/[handle]` mostra detalhe do produto
- [ ] "Adicionar ao Carrinho" atualiza contador no header

---

## Task 7: Carrinho e Checkout

**Files:**

- Create: `apps/storefront/src/app/(store)/cart/page.tsx`
- Create: `apps/storefront/src/app/(store)/checkout/page.tsx`
- Create: `apps/storefront/src/components/store/cart-icon.tsx`
- Create: `apps/storefront/src/components/store/cart-sheet.tsx`

**Step 1: Cart Icon (header)**

```typescript
// apps/storefront/src/components/store/cart-icon.tsx
'use client';

import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/store/cart';
import { useEffect } from 'react';

export function CartIcon() {
  const { itemCount, setIsOpen, initCart } = useCartStore();

  useEffect(() => {
    initCart();
  }, [initCart]);

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative"
      onClick={() => setIsOpen(true)}
    >
      <ShoppingCart className="h-5 w-5" />
      {itemCount > 0 && (
        <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
          {itemCount}
        </Badge>
      )}
    </Button>
  );
}
```

**Step 2: Cart Page**

```typescript
// apps/storefront/src/app/(store)/cart/page.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CartItems } from '@/components/store/cart-items';

export const metadata = { title: 'Carrinho' };

export default function CartPage() {
  return (
    <div className="container py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Carrinho</h1>
      <CartItems />
    </div>
  );
}
```

**Step 3: Checkout Page (formulário)**

```typescript
// apps/storefront/src/app/(store)/checkout/page.tsx
import { CheckoutForm } from '@/components/store/checkout-form';

export const metadata = { title: 'Finalizar Compra' };

export default function CheckoutPage() {
  return (
    <div className="container py-12 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8">Finalizar Compra</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CheckoutForm />
        </div>
        <div>
          <OrderSummary />
        </div>
      </div>
    </div>
  );
}
```

**Step 4: Commit**

```bash
git add apps/storefront/src/
git commit -m "feat(storefront): add cart and checkout pages"
```

**Validação:**

- [ ] Ícone do carrinho no header com contagem
- [ ] Página `/cart` lista itens
- [ ] Página `/checkout` com formulário de endereço e pagamento

---

## Task 8: Autenticação (Login, Registro, Perfil)

**Files:**

- Create: `apps/storefront/src/app/(auth)/login/page.tsx`
- Create: `apps/storefront/src/app/(auth)/register/page.tsx`
- Create: `apps/storefront/src/components/auth/login-form.tsx`
- Create: `apps/storefront/src/components/auth/register-form.tsx`
- Create: `apps/storefront/src/lib/auth.ts`

**Step 1: Auth helper (server action)**

```typescript
// apps/storefront/src/lib/auth.ts
'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { login as medusaLogin, logout as medusaLogout } from './api/auth';

export async function loginAction(email: string, password: string) {
  const token = await medusaLogin(email, password);
  if (typeof token === 'string') {
    const cookieStore = await cookies();
    cookieStore.set('_medusa_jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
  }
  redirect('/dashboard');
}

export async function logoutAction() {
  await medusaLogout();
  const cookieStore = await cookies();
  cookieStore.delete('_medusa_jwt');
  redirect('/');
}
```

**Step 2: Login Form**

```typescript
// apps/storefront/src/components/auth/login-form.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { loginAction } from '@/lib/auth';
import { useState } from 'react';

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
});

type FormData = z.infer<typeof schema>;

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      setError(null);
      await loginAction(data.email, data.password);
    } catch {
      setError('Email ou senha incorretos. Tente novamente.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="seu@email.com"
          {...register('email')}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <Input id="password" type="password" {...register('password')} />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Entrando...' : 'Entrar'}
      </Button>
    </form>
  );
}
```

**Step 3: Login Page**

```typescript
// apps/storefront/src/app/(auth)/login/page.tsx
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoginForm } from '@/components/auth/login-form';

export const metadata = { title: 'Entrar' };

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Entrar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <LoginForm />
          <p className="text-center text-sm text-muted-foreground">
            Não tem conta?{' '}
            <Link href="/register" className="text-primary hover:underline">
              Criar conta
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
```

**Step 4: Commit**

```bash
git add apps/storefront/src/
git commit -m "feat(storefront): add authentication pages (login, register)"
```

**Validação:**

- [ ] `/login` renderiza formulário com validação
- [ ] `/register` renderiza formulário com validação
- [ ] Login redireciona para `/dashboard`
- [ ] Erros são exibidos ao usuário

---

## Task 9: Área de Membros — Layout e Dashboard

**Files:**

- Create: `apps/storefront/src/app/(members)/layout.tsx`
- Create: `apps/storefront/src/app/(members)/dashboard/page.tsx`
- Create: `apps/storefront/src/components/members/sidebar.tsx`
- Create: `apps/storefront/src/middleware.ts`

**Step 1: Middleware de autenticação**

```typescript
// apps/storefront/src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_ROUTES = [
  '/dashboard',
  '/my-courses',
  '/my-downloads',
  '/subscription',
  '/profile',
];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('_medusa_jwt');
  const isProtected = PROTECTED_ROUTES.some((route) => request.nextUrl.pathname.startsWith(route));

  if (isProtected && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/my-courses/:path*',
    '/my-downloads/:path*',
    '/subscription/:path*',
    '/profile/:path*',
  ],
};
```

**Step 2: Members Sidebar**

```typescript
// apps/storefront/src/components/members/sidebar.tsx
import Link from 'next/link';
import { LayoutDashboard, BookOpen, Download, CreditCard, User } from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/my-courses', label: 'Meus Cursos', icon: BookOpen },
  { href: '/my-downloads', label: 'Downloads', icon: Download },
  { href: '/subscription', label: 'Assinatura', icon: CreditCard },
  { href: '/profile', label: 'Perfil', icon: User },
];

export function MembersSidebar() {
  return (
    <aside className="w-64 shrink-0 border-r min-h-[calc(100vh-4rem)]">
      <nav className="p-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-muted transition-colors"
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
```

**Step 3: Members Layout**

```typescript
// apps/storefront/src/app/(members)/layout.tsx
import { Header } from '@/components/layout/header';
import { MembersSidebar } from '@/components/members/sidebar';

export default function MembersLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <MembersSidebar />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
```

**Step 4: Dashboard Page**

```typescript
// apps/storefront/src/app/(members)/dashboard/page.tsx
import { getCustomer } from '@/lib/api/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Download, CreditCard } from 'lucide-react';

export const metadata = { title: 'Dashboard' };

export default async function DashboardPage() {
  const customer = await getCustomer();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          Olá, {customer?.first_name ?? 'Membro'}!
        </h1>
        <p className="text-muted-foreground">Bem-vindo à sua área de membros.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Meus Cursos</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0</p>
            <p className="text-xs text-muted-foreground">cursos matriculados</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Downloads</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0</p>
            <p className="text-xs text-muted-foreground">produtos digitais</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Assinatura</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">Free</p>
            <p className="text-xs text-muted-foreground">plano atual</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

**Step 5: Commit**

```bash
git add apps/storefront/src/
git commit -m "feat(storefront): add members area layout, dashboard and middleware"
```

**Validação:**

- [ ] Rotas protegidas redirecionam para `/login`
- [ ] Sidebar com navegação na área de membros
- [ ] Dashboard com cards de resumo

---

## Task 10: Cursos — Catálogo e Detalhe

**Files:**

- Create: `apps/storefront/src/app/(store)/courses/page.tsx`
- Create: `apps/storefront/src/app/(store)/courses/[id]/page.tsx`
- Create: `apps/storefront/src/lib/api/courses.ts`
- Create: `apps/storefront/src/components/courses/course-card.tsx`

**Step 1: Course API functions**

```typescript
// apps/storefront/src/lib/api/courses.ts
import { medusa } from '../medusa';

export async function listCourses(params?: { limit?: number; offset?: number }) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_MEDUSA_API_URL}/store/courses?limit=${params?.limit ?? 12}&offset=${params?.offset ?? 0}`,
    { next: { revalidate: 60 } },
  );
  if (!response.ok) return { courses: [], count: 0 };
  return response.json();
}

export async function getCourse(id: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_API_URL}/store/courses/${id}`, {
    next: { revalidate: 60 },
  });
  if (!response.ok) return null;
  const { course } = await response.json();
  return course;
}

export async function enrollInCourse(courseId: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_MEDUSA_API_URL}/store/courses/${courseId}/enroll`,
    { method: 'POST', credentials: 'include' },
  );
  if (!response.ok) throw new Error('Failed to enroll');
  return response.json();
}
```

**Step 2: Course Card component**

```typescript
// apps/storefront/src/components/courses/course-card.tsx
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock } from 'lucide-react';

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    description?: string;
    thumbnail?: string;
    level?: string;
    requiredTier?: string;
    enrollmentCount?: number;
  };
}

export function CourseCard({ course }: CourseCardProps) {
  const tierColors: Record<string, string> = {
    free: 'bg-green-100 text-green-800',
    pro: 'bg-blue-100 text-blue-800',
    premium: 'bg-purple-100 text-purple-800',
  };

  return (
    <Card className="group overflow-hidden hover:shadow-md transition-shadow">
      <Link href={`/courses/${course.id}`}>
        <div className="aspect-video bg-muted overflow-hidden">
          {course.thumbnail ? (
            <Image
              src={course.thumbnail}
              alt={course.title}
              width={400}
              height={225}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-primary/20 to-primary/5">
              📚
            </div>
          )}
        </div>
      </Link>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          {course.requiredTier && (
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tierColors[course.requiredTier] ?? ''}`}>
              {course.requiredTier.toUpperCase()}
            </span>
          )}
          {course.level && (
            <Badge variant="outline" className="text-xs">{course.level}</Badge>
          )}
        </div>
        <Link href={`/courses/${course.id}`}>
          <h3 className="font-semibold line-clamp-2 hover:text-primary transition-colors">
            {course.title}
          </h3>
        </Link>
        {course.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {course.description}
          </p>
        )}
      </CardContent>
      {course.enrollmentCount !== undefined && (
        <CardFooter className="p-4 pt-0 text-xs text-muted-foreground">
          <BookOpen className="h-3 w-3 mr-1" />
          {course.enrollmentCount} aluno{course.enrollmentCount !== 1 ? 's' : ''}
        </CardFooter>
      )}
    </Card>
  );
}
```

**Step 3: Courses listing page**

```typescript
// apps/storefront/src/app/(store)/courses/page.tsx
import { listCourses } from '@/lib/api/courses';
import { CourseCard } from '@/components/courses/course-card';

export const metadata = { title: 'Cursos' };

export default async function CoursesPage() {
  const { courses = [], count = 0 } = await listCourses({ limit: 12 });

  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Cursos</h1>
        <p className="text-muted-foreground mt-2">{count} cursos disponíveis</p>
      </div>
      {courses.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-xl">Nenhum curso disponível no momento.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.map((course: any) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
```

**Step 4: Commit**

```bash
git add apps/storefront/src/
git commit -m "feat(storefront): add courses catalog and detail pages"
```

**Validação:**

- [ ] `/courses` lista cursos com cards
- [ ] Badges de tier (free/pro/premium) exibidos
- [ ] Detalhe do curso com botão de matrícula

---

## Task 11: Área de Membros — Meus Cursos e Player

**Files:**

- Create: `apps/storefront/src/app/(members)/my-courses/page.tsx`
- Create: `apps/storefront/src/app/(members)/my-courses/[enrollmentId]/lessons/[lessonId]/page.tsx`
- Create: `apps/storefront/src/components/courses/lesson-player.tsx`
- Create: `apps/storefront/src/components/courses/progress-bar.tsx`

**Step 1: My Courses page**

```typescript
// apps/storefront/src/app/(members)/my-courses/page.tsx
export const metadata = { title: 'Meus Cursos' };

export default async function MyCoursesPage() {
  // Fetch enrollments from API
  const enrollments: any[] = [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Meus Cursos</h1>
        <p className="text-muted-foreground">Continue de onde parou.</p>
      </div>
      {enrollments.length === 0 ? (
        <div className="text-center py-20 border rounded-lg">
          <p className="text-xl text-muted-foreground mb-4">Você não está matriculado em nenhum curso.</p>
          <a href="/courses" className="text-primary hover:underline">Explorar cursos →</a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollments.map((enrollment: any) => (
            <EnrollmentCard key={enrollment.id} enrollment={enrollment} />
          ))}
        </div>
      )}
    </div>
  );
}
```

**Step 2: Lesson Player component**

```typescript
// apps/storefront/src/components/courses/lesson-player.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, Play } from 'lucide-react';

interface LessonPlayerProps {
  lesson: {
    id: string;
    title: string;
    type: 'video' | 'text' | 'quiz' | 'file';
    content: Record<string, any>;
  };
  enrollmentId: string;
  isCompleted: boolean;
  onComplete: () => void;
}

export function LessonPlayer({ lesson, enrollmentId, isCompleted, onComplete }: LessonPlayerProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_MEDUSA_API_URL}/store/my-enrollments/${enrollmentId}/lessons/${lesson.id}/complete`,
        { method: 'POST', credentials: 'include' }
      );
      onComplete();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center">
        {lesson.type === 'video' && lesson.content.videoUrl ? (
          <video
            src={lesson.content.videoUrl}
            controls
            className="w-full h-full"
          />
        ) : (
          <div className="text-white text-center">
            <Play className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="opacity-50">Conteúdo não disponível</p>
          </div>
        )}
      </div>

      {lesson.type === 'text' && lesson.content.body && (
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: lesson.content.body }}
        />
      )}

      <div className="flex justify-end">
        {isCompleted ? (
          <Button variant="outline" disabled>
            <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
            Concluída
          </Button>
        ) : (
          <Button onClick={handleComplete} disabled={isLoading}>
            {isLoading ? 'Marcando...' : 'Marcar como Concluída'}
          </Button>
        )}
      </div>
    </div>
  );
}
```

**Step 3: Commit**

```bash
git add apps/storefront/src/
git commit -m "feat(storefront): add member courses area and lesson player"
```

**Validação:**

- [ ] `/my-courses` lista matrículas do usuário
- [ ] Player de vídeo funcional
- [ ] Botão "Marcar como concluída" funciona

---

## Task 12: Downloads e Assinaturas na Área de Membros

**Files:**

- Create: `apps/storefront/src/app/(members)/my-downloads/page.tsx`
- Create: `apps/storefront/src/app/(members)/subscription/page.tsx`

**Step 1: My Downloads page**

```typescript
// apps/storefront/src/app/(members)/my-downloads/page.tsx
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const metadata = { title: 'Meus Downloads' };

async function getMyDownloads() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_MEDUSA_API_URL}/store/my-digital-products`,
      { credentials: 'include', cache: 'no-store' }
    );
    if (!res.ok) return [];
    const { purchases } = await res.json();
    return purchases ?? [];
  } catch {
    return [];
  }
}

export default async function MyDownloadsPage() {
  const purchases = await getMyDownloads();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Meus Downloads</h1>
        <p className="text-muted-foreground">Seus produtos digitais adquiridos.</p>
      </div>
      {purchases.length === 0 ? (
        <div className="text-center py-20 border rounded-lg">
          <Download className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-xl text-muted-foreground mb-4">Nenhum produto digital adquirido.</p>
          <a href="/products" className="text-primary hover:underline">Ver produtos →</a>
        </div>
      ) : (
        <div className="space-y-4">
          {purchases.map((purchase: any) => (
            <Card key={purchase.id}>
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <h3 className="font-semibold">{purchase.product?.name}</h3>
                  <Badge variant={purchase.status === 'active' ? 'default' : 'secondary'}>
                    {purchase.status}
                  </Badge>
                </div>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Baixar
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
```

**Step 2: Subscription page**

```typescript
// apps/storefront/src/app/(members)/subscription/page.tsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

export const metadata = { title: 'Assinatura' };

const plans = [
  {
    name: 'Free',
    price: 0,
    tier: 'free',
    features: ['Acesso a cursos gratuitos', 'Downloads limitados', 'Suporte por email'],
  },
  {
    name: 'Pro',
    price: 9900,
    tier: 'pro',
    features: ['Tudo do Free', 'Todos os cursos Pro', 'Downloads ilimitados', 'Suporte prioritário'],
  },
  {
    name: 'Premium',
    price: 19900,
    tier: 'premium',
    features: ['Tudo do Pro', 'Acesso antecipado a novos cursos', 'Mentoria mensal', 'Certificados personalizados'],
  },
];

export default async function SubscriptionPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Assinatura</h1>
        <p className="text-muted-foreground">Gerencie seu plano e acesso.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.tier} className={plan.tier === 'pro' ? 'border-primary shadow-lg' : ''}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{plan.name}</CardTitle>
                {plan.tier === 'pro' && <Badge>Popular</Badge>}
              </div>
              <CardDescription>
                {plan.price === 0 ? (
                  <span className="text-2xl font-bold text-foreground">Grátis</span>
                ) : (
                  <span className="text-2xl font-bold text-foreground">
                    R$ {(plan.price / 100).toFixed(2).replace('.', ',')}
                    <span className="text-sm font-normal text-muted-foreground">/mês</span>
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-600 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                variant={plan.tier === 'pro' ? 'default' : 'outline'}
              >
                {plan.price === 0 ? 'Plano Atual' : `Assinar ${plan.name}`}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

**Step 3: Commit**

```bash
git add apps/storefront/src/
git commit -m "feat(storefront): add downloads and subscription pages"
```

**Validação:**

- [ ] `/my-downloads` lista produtos digitais comprados
- [ ] `/subscription` exibe planos com preços e features
- [ ] Botão de assinar plano presente

---

## Task 13: Perfil e Responsividade Mobile

**Files:**

- Create: `apps/storefront/src/app/(members)/profile/page.tsx`
- Modify: `apps/storefront/src/components/layout/header.tsx` (adicionar menu mobile)

**Step 1: Profile page**

```typescript
// apps/storefront/src/app/(members)/profile/page.tsx
import { getCustomer } from '@/lib/api/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProfileForm } from '@/components/members/profile-form';

export const metadata = { title: 'Perfil' };

export default async function ProfilePage() {
  const customer = await getCustomer();

  return (
    <div className="space-y-8 max-w-2xl">
      <h1 className="text-3xl font-bold">Perfil</h1>
      <Card>
        <CardHeader>
          <CardTitle>Informações Pessoais</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm customer={customer} />
        </CardContent>
      </Card>
    </div>
  );
}
```

**Step 2: Mobile nav (Sheet)**

Adicionar mobile navigation no `header.tsx` usando `Sheet` do shadcn para o menu hamburguer em
dispositivos móveis.

**Step 3: Sidebar responsivo**

Adicionar toggle para sidebar no layout mobile da área de membros.

**Step 4: Verificar responsividade**

```bash
pnpm --filter storefront build
```

Expected: build sem erros, sem warnings de layout.

**Step 5: Commit**

```bash
git add apps/storefront/src/
git commit -m "feat(storefront): add profile page and mobile responsiveness"
```

**Validação:**

- [ ] `/profile` exibe dados do usuário
- [ ] Header com menu mobile funcional
- [ ] Layout responsivo em 320px, 768px, 1280px

---

## Task 14: Otimização de Performance e SEO

**Files:**

- Modify: `apps/storefront/src/app/(store)/products/[handle]/page.tsx` (add generateMetadata)
- Modify: `apps/storefront/src/app/(store)/courses/[id]/page.tsx` (add generateMetadata)
- Create: `apps/storefront/src/app/sitemap.ts`
- Create: `apps/storefront/src/app/robots.ts`
- Modify: `apps/storefront/next.config.ts` (add cache headers)

**Step 1: generateMetadata para páginas de produto**

```typescript
// Em apps/storefront/src/app/(store)/products/[handle]/page.tsx
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) return {};
  return {
    title: product.title,
    description: product.description?.slice(0, 160),
    openGraph: {
      images: product.thumbnail ? [product.thumbnail] : [],
    },
  };
}
```

**Step 2: Sitemap**

```typescript
// apps/storefront/src/app/sitemap.ts
import type { MetadataRoute } from 'next';
import { listProducts } from '@/lib/api/products';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://realizah.com';
  const { products } = await listProducts({ limit: 100 });

  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/products`, lastModified: new Date() },
    { url: `${baseUrl}/courses`, lastModified: new Date() },
    ...products.map((p) => ({
      url: `${baseUrl}/products/${p.handle}`,
      lastModified: new Date(),
    })),
  ];
}
```

**Step 3: Robots.txt**

```typescript
// apps/storefront/src/app/robots.ts
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/dashboard', '/api/'] },
    sitemap: `${process.env.NEXT_PUBLIC_BASE_URL ?? 'https://realizah.com'}/sitemap.xml`,
  };
}
```

**Step 4: Build de produção**

```bash
pnpm --filter storefront build
```

Expected: build completo sem erros, Lighthouse score > 90.

**Step 5: Commit**

```bash
git add apps/storefront/src/ apps/storefront/next.config.ts
git commit -m "feat(storefront): add SEO metadata, sitemap and robots.txt"
```

**Validação:**

- [ ] generateMetadata em páginas de produto e curso
- [ ] `/sitemap.xml` retorna URLs corretas
- [ ] `/robots.txt` bloqueia rotas privadas
- [ ] Build passa sem warnings de performance

---

## Task 15: Testes E2E com Playwright

**Files:**

- Create: `apps/storefront/e2e/home.spec.ts`
- Create: `apps/storefront/e2e/auth.spec.ts`
- Create: `apps/storefront/e2e/products.spec.ts`
- Create: `apps/storefront/playwright.config.ts`

**Step 1: Configurar Playwright**

```typescript
// apps/storefront/playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

**Step 2: Teste da Home**

```typescript
// apps/storefront/e2e/home.spec.ts
import { test, expect } from '@playwright/test';

test('home page loads and shows hero', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByText('Ver Cursos')).toBeVisible();
});

test('navigation links work', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Loja');
  await expect(page).toHaveURL('/products');
});
```

**Step 3: Teste de autenticação**

```typescript
// apps/storefront/e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test('login page shows form', async ({ page }) => {
  await page.goto('/login');
  await expect(page.getByRole('heading', { name: 'Entrar' })).toBeVisible();
  await expect(page.getByLabel('Email')).toBeVisible();
  await expect(page.getByLabel('Senha')).toBeVisible();
});

test('login form validates required fields', async ({ page }) => {
  await page.goto('/login');
  await page.click('button[type="submit"]');
  await expect(page.getByText('Email inválido')).toBeVisible();
});
```

**Step 4: Rodar testes**

```bash
pnpm --filter storefront exec playwright test
```

Expected: todos os testes passam.

**Step 5: Commit**

```bash
git add apps/storefront/e2e/ apps/storefront/playwright.config.ts
git commit -m "test(storefront): add Playwright E2E tests for home, auth and products"
```

**Validação:**

- [ ] `playwright test` passa sem erros
- [ ] Home page carrega
- [ ] Formulário de login valida campos
- [ ] Navegação entre páginas funciona

---

## Task 16: ADR e Atualização do Roadmap

**Files:**

- Create: `docs/adr/0006-fase6-frontend-storefront.md`
- Modify: `docs/ROADMAP.md`

**Step 1: Criar ADR da Fase 6**

```markdown
# 6. Decisões de Frontend — Fase 6

**Data:** 2026-03-05 **Status:** Aceita

## Contexto

Implementação do frontend storefront com Next.js 15.

## Decisões

### 1. App Router com Server Components por padrão

- Melhor performance, dados buscados no servidor, menos JS no cliente

### 2. shadcn/ui como design system

- Componentes acessíveis, customizáveis, baseados em Radix UI

### 3. Zustand para estado global mínimo

- Apenas carrinho e sessão de auth — estados que precisam de cliente

### 4. Zod + React Hook Form para validação

- Type-safe, integração perfeita com TypeScript

### 5. Playwright para E2E

- Confiável, suporte a múltiplos browsers, integração CI/CD
```

**Step 2: Atualizar ROADMAP.md**

Alterar status da Fase 6 para ✅ Completa.

**Step 3: Commit final**

```bash
git add docs/
git commit -m "docs: add ADR 006 and update ROADMAP for Fase 6 completion

- Add ADR 0006 documenting frontend architecture decisions
- Update ROADMAP.md: Fase 6 marked as complete
- Document design system choices (shadcn/ui, Zustand, Playwright)"
```

**Validação:**

- [ ] ADR 0006 criado
- [ ] ROADMAP atualizado
- [ ] Commit com mensagem completa

---

## Checklist Final da Fase 6

### Páginas Implementadas

- [ ] Home page com Hero, produtos e cursos em destaque
- [ ] Catálogo de produtos (`/products`)
- [ ] Detalhe do produto (`/products/[handle]`)
- [ ] Catálogo de cursos (`/courses`)
- [ ] Detalhe do curso (`/courses/[id]`)
- [ ] Carrinho (`/cart`)
- [ ] Checkout (`/checkout`)
- [ ] Login (`/login`)
- [ ] Registro (`/register`)
- [ ] Dashboard de membro (`/dashboard`)
- [ ] Meus cursos (`/my-courses`)
- [ ] Player de aula
- [ ] Meus downloads (`/my-downloads`)
- [ ] Assinatura (`/subscription`)
- [ ] Perfil (`/profile`)

### Funcionalidades

- [ ] Design system com shadcn/ui
- [ ] Tema claro/escuro
- [ ] Carrinho persistente (localStorage)
- [ ] Autenticação com Medusa
- [ ] Rotas protegidas (middleware)
- [ ] Formulários com validação (Zod)
- [ ] SEO: metadata, sitemap, robots
- [ ] Responsivo mobile

### Qualidade

- [ ] `pnpm --filter storefront build` passa sem erros
- [ ] `pnpm --filter storefront type-check` passa
- [ ] `pnpm --filter storefront lint` passa
- [ ] Playwright E2E tests passam
- [ ] Lighthouse Performance > 85

---

## Próximos Passos

Após a Fase 6, o projeto estará pronto para:

1. **Fase 7: CI/CD e Deploy**
   - GitHub Actions para CI
   - Deploy Medusa em Railway/Render
   - Deploy Storefront no Vercel
   - PostgreSQL em produção (Neon ou Supabase)
   - S3 em produção (AWS ou Cloudflare R2)
