# 6. Frontend Storefront — Fase 6

**Data:** 2026-03-05  
**Status:** Aceita

## Contexto

Implementação do frontend completo do storefront Realizah com Next.js 15, integrando todas as
features de e-commerce, cursos, produtos digitais e assinaturas construídas nas fases anteriores.

## Decisões Arquiteturais

### 1. App Router com Server Components por padrão

**Decisão:** Usar Next.js 15 App Router com Server Components como padrão, Client Components apenas
quando necessário (interatividade, hooks de estado).

**Motivo:**

- Melhor performance: dados buscados no servidor, menos JS no cliente
- SEO nativo: HTML renderizado no servidor
- Simplicidade: menos necessidade de gerenciamento de estado

### 2. shadcn/ui como Design System

**Decisão:** Usar shadcn/ui (Radix UI + Tailwind CSS) para componentes de interface.

**Motivo:**

- Componentes acessíveis por padrão (Radix UI)
- Customizáveis: código copiado para o projeto, não biblioteca externa
- Type-safe com TypeScript
- Design consistente com CSS variables

### 3. Zustand para Estado Global Mínimo

**Decisão:** Apenas carrinho e sessão de auth no estado global Zustand.

**Motivo:**

- Estado do carrinho precisa persistir entre páginas (localStorage via `persist` middleware)
- Evitar prop drilling para o contador do carrinho no header
- Estado mínimo: tudo mais é buscado no servidor

### 4. Zod + React Hook Form para Formulários

**Decisão:** Zod para validação de schema, React Hook Form para gerenciamento de formulários.

**Motivo:**

- Type-safe: tipos TypeScript gerados automaticamente pelo Zod schema
- Performance: React Hook Form minimiza re-renders
- Integração: `@hookform/resolvers/zod` conecta os dois

### 5. Server Actions para Autenticação

**Decisão:** Server Actions (`'use server'`) para login, registro e logout.

**Motivo:**

- Segurança: credenciais nunca expostas no cliente
- Simplicidade: sem necessidade de criar endpoints de API separados
- Integração nativa com Next.js (redirect após autenticação)

### 6. Middleware para Proteção de Rotas

**Decisão:** `src/middleware.ts` com `NextRequest` para proteger rotas da área de membros.

**Motivo:**

- Intercepta requisições antes de chegar ao React
- Sem flash de conteúdo não autorizado
- Compatível com Edge Runtime (performance)

### 7. Playwright para Testes E2E

**Decisão:** Playwright com Chromium para smoke tests das páginas principais.

**Motivo:**

- Confiável e amplamente adotado
- Suporte nativo a múltiplos browsers
- Integração CI/CD simples
- API moderna e expressiva

## Estrutura de Rotas Implementadas

```
/ (home)
├── /products                    # Catálogo
├── /products/[handle]           # Detalhe
├── /courses                     # Catálogo de cursos
├── /courses/[id]                # Detalhe do curso
├── /cart                        # Carrinho
├── /checkout                    # Checkout (placeholder)
├── /login                       # Autenticação
├── /register                    # Registro
├── /dashboard                   # Área de membros *
├── /my-courses                  # Meus cursos *
├── /my-courses/[id]             # Detalhes da matrícula *
├── /my-courses/[id]/lessons/[id] # Player de aulas *
├── /my-downloads                # Downloads *
├── /subscription                # Assinatura *
└── /profile                     # Perfil *

* = rota protegida (requer autenticação)
```

## Componentes Criados

| Camada         | Componentes                                                                                          |
| -------------- | ---------------------------------------------------------------------------------------------------- |
| UI (shadcn/ui) | Button, Card, Badge, Input, Label, Separator, Skeleton, Progress, Avatar                             |
| Layout         | Header, Footer, MobileNav                                                                            |
| Store          | HeroSection, ProductCard, FeaturedProducts, SubscriptionBanner, CartIcon, CartItems, AddToCartButton |
| Courses        | CourseCard, FeaturedCourses, LessonPlayer                                                            |
| Members        | MembersSidebar, ProfileForm                                                                          |
| Auth           | LoginForm, RegisterForm                                                                              |

## Consequências

### Positivas

- Frontend completo e funcional com todas as rotas implementadas
- Server Components por padrão: melhor performance e SEO
- Design system consistente com shadcn/ui
- Autenticação segura via Server Actions + cookies HttpOnly
- Testes E2E cobrem fluxos principais

### Negativas / Próximos Passos

- Checkout real com Mercado Pago ainda não integrado (placeholder)
- Sidebar da área de membros não é responsiva em mobile (melhoria futura)
- Player de vídeo usa `<video>` nativo — considerar HLS/streaming em produção
- ProfileForm não salva dados reais ainda (TODO integrado)

## Métricas de Sucesso Atingidas

- [x] 15+ páginas implementadas
- [x] Design system com shadcn/ui
- [x] Tema light configurado
- [x] Carrinho persistente (localStorage)
- [x] Autenticação com Medusa
- [x] Rotas protegidas (middleware)
- [x] Formulários com validação (Zod)
- [x] SEO: metadata, sitemap, robots
- [x] Responsivo mobile (MobileNav)
- [x] Playwright E2E smoke tests
- [x] `pnpm --filter storefront build` passa
- [x] TypeScript strict sem erros
