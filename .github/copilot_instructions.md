# GitHub Copilot Instructions — Realizah

Instruções para o GitHub Copilot ao trabalhar no projeto Realizah.

## Contexto do Projeto

Plataforma híbrida de e-commerce, produtos digitais e assinaturas construída com:

- **Backend**: Medusa v2 com módulos customizados
- **Frontend**: Next.js 15 (App Router)
- **Monorepo**: Turborepo + pnpm workspaces
- **Linguagem**: TypeScript (strict mode)

## Comandos

**SEMPRE use `pnpm`**, nunca `npm` ou `yarn`:

```bash
pnpm install
pnpm dev
pnpm test
pnpm lint
```

## Padrões de Código

### TypeScript

- Strict mode habilitado
- Tipos explícitos em funções públicas
- Evite `any`, use `unknown` quando necessário
- Prefira `interface` para objetos, `type` para unions

### React/Next.js

- Functional components
- Hooks no topo
- Server Components por padrão
- `'use client'` explícito quando necessário

### Nomenclatura

- Componentes: `PascalCase.tsx`
- Utilitários: `camelCase.ts`
- Variáveis: `camelCase`
- Constantes: `UPPER_SNAKE_CASE`
- Booleanos: `isActive`, `hasPermission`, `canEdit`

### Imports

Use path aliases:

```typescript
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/utils/date';
```

### Commits

Conventional Commits:

```
feat(subscription): add plan creation endpoint
fix(payment): resolve PIX callback timeout
docs(readme): update installation steps
```

## Estrutura

```
apps/
  storefront/        # Next.js
  medusa/            # Medusa v2 + módulos customizados
packages/
  types/             # Tipos compartilhados
  utils/             # Utilitários compartilhados
```

## Módulos Medusa

Estrutura de módulo customizado:

```
apps/medusa/src/modules/<module-name>/
├── index.ts         # Export do módulo
├── service.ts       # Lógica de negócio
├── models/          # Entidades
├── migrations/      # Migrations
└── __tests__/       # Testes
```

## APIs

- RESTful com recursos no plural: `/users`, `/subscriptions`
- Kebab-case para URLs: `/subscription-plans`
- camelCase para JSON: `{ "userId": "123" }`
- Versionamento: `/api/v1/`

## Error Handling

```typescript
try {
  await operation();
} catch (error) {
  logger.error('Operation failed', { error });
  throw new CustomError('Message', { cause: error });
}
```

## Testes

```typescript
describe('Service', () => {
  describe('method', () => {
    it('should do something with valid input', async () => {
      // arrange
      const input = { /* ... */ };
      
      // act
      const result = await service.method(input);
      
      // assert
      expect(result).toBe(expected);
    });
  });
});
```

## Documentação

Consulte:

- `docs/conventions/code-style.md` — padrões de código
- `docs/conventions/git-workflow.md` — workflow Git
- `docs/conventions/api-naming.md` — nomenclatura de APIs
- `CLAUDE.md` — contexto e comandos principais

## Prioridades

1. **Clareza** sobre brevidade
2. **Consistência** com padrões existentes
3. **Simplicidade** — evite abstrações prematuras
4. **Testabilidade** — código deve ser fácil de testar
5. **Documentação** — comente o "por quê", não o "o quê"
