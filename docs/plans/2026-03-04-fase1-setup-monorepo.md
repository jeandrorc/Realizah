# Plano de Implementação: Fase 1 — Setup do Monorepo

**Data:** 2026-03-04  
**Status:** Pronto para implementação  
**Responsável:** Agente Principal  
**Duração estimada:** 2-3 horas

---

## Objetivo

Estabelecer a fundação completa do monorepo Realizah com:
- Estrutura de pastas (apps/ e packages/)
- Medusa v2 configurado e funcionando
- Next.js 15 configurado e funcionando
- Packages compartilhados (types e utils)
- PostgreSQL e migrations base
- Turborepo configurado para builds otimizados
- Ambiente de desenvolvimento funcional

---

## Pré-requisitos

Antes de começar, verifique que tem instalado:

```bash
# Verificar versões
node --version    # >= 20.0.0
pnpm --version    # >= 8.0.0
psql --version    # >= 15.0
git --version     # >= 2.30.0
```

---

## Estrutura Final

```
Realizah/
├── apps/
│   ├── medusa/                    # Backend Medusa v2
│   │   ├── src/
│   │   │   ├── api/              # API routes
│   │   │   ├── modules/          # Módulos customizados (vazio por enquanto)
│   │   │   ├── subscribers/      # Event subscribers
│   │   │   └── loaders/          # Loaders
│   │   ├── medusa-config.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── storefront/                # Frontend Next.js 15
│       ├── src/
│       │   ├── app/              # App Router
│       │   ├── components/       # Componentes React
│       │   ├── lib/              # Utilitários
│       │   └── styles/           # Estilos
│       ├── next.config.ts
│       ├── package.json
│       └── tsconfig.json
├── packages/
│   ├── types/                     # Tipos compartilhados
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── common.ts
│   │   │   └── medusa.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── utils/                     # Utilitários compartilhados
│       ├── src/
│       │   ├── index.ts
│       │   ├── date.ts
│       │   ├── validation.ts
│       │   └── errors.ts
│       ├── package.json
│       └── tsconfig.json
├── package.json                   # Root package.json (já existe)
├── pnpm-workspace.yaml
├── turbo.json                     # (já existe)
└── .env.example
```

---

## Tarefas Detalhadas

### Task 1: Inicializar Repositório Git

**Objetivo:** Criar repositório Git e fazer commit inicial da documentação.

**Passos:**

```bash
# 1. Inicializar Git
cd /Users/jeandrocouto/Workspace/Realizah
git init

# 2. Configurar usuário (se necessário)
git config user.name "Seu Nome"
git config user.email "seu@email.com"

# 3. Adicionar todos os arquivos de documentação
git add .

# 4. Primeiro commit
git commit -m "docs: initial project documentation and governance

- Add complete documentation structure
- Add ADRs and specifications for all modules
- Add governance (CONTRIBUTING.md, PR templates)
- Add AI structure (CLAUDE.md, Cursor rules)
- Add version control (commitlint, husky)
- Add Turborepo configuration"

# 5. Criar branch main (se necessário)
git branch -M main

# 6. Instalar husky
pnpm install
pnpm prepare
```

**Validação:**
- [ ] `git log` mostra commit inicial
- [ ] `git status` está limpo
- [ ] Husky hooks instalados em `.husky/`

---

### Task 2: Criar Estrutura de Pastas

**Objetivo:** Criar toda a estrutura de diretórios do monorepo.

**Passos:**

```bash
# Criar estrutura apps/
mkdir -p apps/medusa/src/{api,modules,subscribers,loaders}
mkdir -p apps/storefront/src/{app,components,lib,styles}

# Criar estrutura packages/
mkdir -p packages/types/src
mkdir -p packages/utils/src

# Criar pasta para configs compartilhadas
mkdir -p packages/tsconfig
```

**Validação:**
- [ ] Estrutura de pastas criada
- [ ] `tree -L 3 apps/` mostra estrutura correta
- [ ] `tree -L 3 packages/` mostra estrutura correta

---

### Task 3: Configurar pnpm Workspace

**Objetivo:** Configurar pnpm workspaces para gerenciar o monorepo.

**Arquivo:** `pnpm-workspace.yaml`

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

**Validação:**
- [ ] Arquivo `pnpm-workspace.yaml` criado
- [ ] `pnpm list --depth 0` funciona

---

### Task 4: Setup Package @realizah/types

**Objetivo:** Criar package de tipos compartilhados.

**Arquivo:** `packages/types/package.json`

```json
{
  "name": "@realizah/types",
  "version": "0.1.0",
  "private": true,
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "scripts": {
    "build": "tsup src/index.ts --format esm --dts",
    "dev": "tsup src/index.ts --format esm --dts --watch",
    "lint": "eslint src/",
    "type-check": "tsc --noEmit",
    "clean": "rm -rf dist"
  },
  "devDependencies": {
    "@realizah/tsconfig": "workspace:*",
    "tsup": "^8.0.1",
    "typescript": "^5.3.3"
  }
}
```

**Arquivo:** `packages/types/tsconfig.json`

```json
{
  "extends": "@realizah/tsconfig/base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

**Arquivo:** `packages/types/src/index.ts`

```typescript
export * from './common';
export * from './medusa';
```

**Arquivo:** `packages/types/src/common.ts`

```typescript
/**
 * Tipos comuns compartilhados entre apps
 */

export type Tier = 'free' | 'pro' | 'premium';

export type Status = 'active' | 'inactive' | 'pending';

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}
```

**Arquivo:** `packages/types/src/medusa.ts`

```typescript
/**
 * Tipos específicos do Medusa
 */

import type { BaseEntity } from './common';

export interface MedusaCustomer extends BaseEntity {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  hasAccount: boolean;
}

export interface MedusaProduct extends BaseEntity {
  title: string;
  description?: string;
  handle: string;
  thumbnail?: string;
  status: 'draft' | 'published' | 'rejected';
}

// Adicionar mais tipos conforme necessário
```

**Validação:**
- [ ] `pnpm --filter @realizah/types build` funciona
- [ ] Arquivos gerados em `packages/types/dist/`
- [ ] `packages/types/dist/index.d.ts` existe

---

### Task 5: Setup Package @realizah/utils

**Objetivo:** Criar package de utilitários compartilhados.

**Arquivo:** `packages/utils/package.json`

```json
{
  "name": "@realizah/utils",
  "version": "0.1.0",
  "private": true,
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "scripts": {
    "build": "tsup src/index.ts --format esm --dts",
    "dev": "tsup src/index.ts --format esm --dts --watch",
    "test": "vitest",
    "test:watch": "vitest --watch",
    "lint": "eslint src/",
    "type-check": "tsc --noEmit",
    "clean": "rm -rf dist"
  },
  "dependencies": {
    "@realizah/types": "workspace:*"
  },
  "devDependencies": {
    "@realizah/tsconfig": "workspace:*",
    "tsup": "^8.0.1",
    "typescript": "^5.3.3",
    "vitest": "^1.2.0"
  }
}
```

**Arquivo:** `packages/utils/tsconfig.json`

```json
{
  "extends": "@realizah/tsconfig/base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

**Arquivo:** `packages/utils/src/index.ts`

```typescript
export * from './date';
export * from './validation';
export * from './errors';
```

**Arquivo:** `packages/utils/src/date.ts`

```typescript
/**
 * Utilitários para manipulação de datas
 */

export function formatDate(date: Date, format: string = 'yyyy-MM-dd'): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return format
    .replace('yyyy', String(year))
    .replace('MM', month)
    .replace('dd', day);
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

export function isExpired(date: Date): boolean {
  return date < new Date();
}
```

**Arquivo:** `packages/utils/src/validation.ts`

```typescript
/**
 * Utilitários para validação
 */

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function isValidUUID(uuid: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}
```

**Arquivo:** `packages/utils/src/errors.ts`

```typescript
/**
 * Classes de erro customizadas
 */

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: unknown
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 'VALIDATION_ERROR', 400, details);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id?: string) {
    const message = id ? `${resource} with id ${id} not found` : `${resource} not found`;
    super(message, 'NOT_FOUND', 404);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 'UNAUTHORIZED', 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(message, 'FORBIDDEN', 403);
  }
}

export class ConflictError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 'CONFLICT', 409, details);
  }
}
```

**Validação:**
- [ ] `pnpm --filter @realizah/utils build` funciona
- [ ] `pnpm --filter @realizah/utils test` funciona
- [ ] Arquivos gerados em `packages/utils/dist/`

---

### Task 6: Setup TSConfig Compartilhado

**Objetivo:** Criar configurações TypeScript compartilhadas.

**Arquivo:** `packages/tsconfig/package.json`

```json
{
  "name": "@realizah/tsconfig",
  "version": "0.1.0",
  "private": true,
  "files": ["base.json", "nextjs.json", "medusa.json"]
}
```

**Arquivo:** `packages/tsconfig/base.json`

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "incremental": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true
  },
  "exclude": ["node_modules"]
}
```

**Arquivo:** `packages/tsconfig/nextjs.json`

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "./base.json",
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "jsx": "preserve",
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**Arquivo:** `packages/tsconfig/medusa.json`

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "./base.json",
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022"],
    "module": "commonjs",
    "moduleResolution": "node",
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true
  }
}
```

**Validação:**
- [ ] Arquivos JSON criados
- [ ] Sintaxe JSON válida

---

### Task 7: Setup Medusa v2

**Objetivo:** Configurar aplicação Medusa v2 do zero.

**Arquivo:** `apps/medusa/package.json`

```json
{
  "name": "medusa",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "medusa develop",
    "build": "medusa build",
    "start": "medusa start",
    "migration:generate": "medusa migrations generate",
    "migration:run": "medusa migrations run",
    "seed": "medusa seed",
    "lint": "eslint src/",
    "type-check": "tsc --noEmit",
    "clean": "rm -rf dist .medusa"
  },
  "dependencies": {
    "@medusajs/medusa": "^2.0.0",
    "@medusajs/utils": "^2.0.0",
    "@realizah/types": "workspace:*",
    "@realizah/utils": "workspace:*",
    "awilix": "^10.0.2",
    "pg": "^8.11.3"
  },
  "devDependencies": {
    "@medusajs/medusa-cli": "^2.0.0",
    "@realizah/tsconfig": "workspace:*",
    "@types/node": "^20.11.5",
    "typescript": "^5.3.3"
  }
}
```

**Arquivo:** `apps/medusa/tsconfig.json`

```json
{
  "extends": "@realizah/tsconfig/medusa.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist", ".medusa"]
}
```

**Arquivo:** `apps/medusa/medusa-config.ts`

```typescript
import { defineConfig } from '@medusajs/medusa/utils';

export default defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS || 'http://localhost:3000',
      adminCors: process.env.ADMIN_CORS || 'http://localhost:7001',
      authCors: process.env.AUTH_CORS || 'http://localhost:3000,http://localhost:7001',
      jwtSecret: process.env.JWT_SECRET || 'supersecret',
      cookieSecret: process.env.COOKIE_SECRET || 'supersecret',
    },
  },
  modules: {
    // Módulos customizados serão adicionados aqui
  },
});
```

**Arquivo:** `apps/medusa/.env.example`

```bash
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/realizah_dev

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
COOKIE_SECRET=your-super-secret-cookie-key-change-in-production

# CORS
STORE_CORS=http://localhost:3000
ADMIN_CORS=http://localhost:7001
AUTH_CORS=http://localhost:3000,http://localhost:7001

# Mercado Pago (para depois)
MERCADO_PAGO_ACCESS_TOKEN=
MERCADO_PAGO_PUBLIC_KEY=

# S3 (para depois)
S3_BUCKET=
S3_REGION=
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
```

**Arquivo:** `apps/medusa/src/api/index.ts`

```typescript
import type { MedusaRequest, MedusaResponse } from '@medusajs/medusa';

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  res.json({
    message: 'Realizah API - Medusa v2',
    version: '0.1.0',
  });
}
```

**Validação:**
- [ ] Arquivos criados
- [ ] `pnpm --filter medusa install` funciona
- [ ] `pnpm --filter medusa type-check` passa

---

### Task 8: Setup PostgreSQL

**Objetivo:** Criar banco de dados PostgreSQL para desenvolvimento.

**Passos:**

```bash
# 1. Criar banco de dados
createdb realizah_dev

# Ou via psql
psql -U postgres
CREATE DATABASE realizah_dev;
\q

# 2. Copiar .env.example para .env
cp apps/medusa/.env.example apps/medusa/.env

# 3. Editar apps/medusa/.env com suas credenciais
# DATABASE_URL=postgresql://seu_usuario:sua_senha@localhost:5432/realizah_dev

# 4. Testar conexão
psql -d realizah_dev -c "SELECT version();"
```

**Validação:**
- [ ] Banco `realizah_dev` criado
- [ ] Conexão funciona
- [ ] `apps/medusa/.env` configurado

---

### Task 9: Inicializar Medusa

**Objetivo:** Rodar migrations iniciais do Medusa.

**Passos:**

```bash
# 1. Rodar migrations do Medusa
cd apps/medusa
pnpm migration:run

# 2. (Opcional) Seed com dados de exemplo
pnpm seed

# 3. Testar servidor
pnpm dev
```

**Validação:**
- [ ] Migrations rodaram sem erro
- [ ] Tabelas criadas no PostgreSQL
- [ ] Servidor Medusa inicia em http://localhost:9000
- [ ] `curl http://localhost:9000/api` retorna JSON

---

### Task 10: Setup Next.js 15

**Objetivo:** Configurar aplicação Next.js 15 com App Router.

**Arquivo:** `apps/storefront/package.json`

```json
{
  "name": "storefront",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "clean": "rm -rf .next"
  },
  "dependencies": {
    "@realizah/types": "workspace:*",
    "@realizah/utils": "workspace:*",
    "next": "^15.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@realizah/tsconfig": "workspace:*",
    "@types/node": "^20.11.5",
    "@types/react": "^18.2.48",
    "@types/react-dom": "^18.2.18",
    "autoprefixer": "^10.4.17",
    "eslint": "^8.56.0",
    "eslint-config-next": "^15.0.0",
    "postcss": "^8.4.33",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.3.3"
  }
}
```

**Arquivo:** `apps/storefront/tsconfig.json`

```json
{
  "extends": "@realizah/tsconfig/nextjs.json",
  "compilerOptions": {
    "outDir": ".next",
    "rootDir": "."
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**Arquivo:** `apps/storefront/next.config.ts`

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@realizah/types', '@realizah/utils'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
```

**Arquivo:** `apps/storefront/src/app/layout.tsx`

```typescript
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Realizah',
  description: 'Plataforma híbrida de e-commerce, produtos digitais e assinaturas',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
```

**Arquivo:** `apps/storefront/src/app/page.tsx`

```typescript
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Realizah</h1>
        <p className="text-xl text-gray-600">
          Plataforma híbrida de e-commerce, produtos digitais e assinaturas
        </p>
        <div className="mt-8 space-x-4">
          <a
            href="/store"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Loja
          </a>
          <a
            href="/courses"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
          >
            Cursos
          </a>
        </div>
      </div>
    </main>
  );
}
```

**Arquivo:** `apps/storefront/src/app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --foreground-rgb: 0, 0, 0;
  --background-rgb: 255, 255, 255;
}

body {
  color: rgb(var(--foreground-rgb));
  background: rgb(var(--background-rgb));
}
```

**Arquivo:** `apps/storefront/tailwind.config.ts`

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
```

**Arquivo:** `apps/storefront/postcss.config.js`

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

**Arquivo:** `apps/storefront/.env.local.example`

```bash
# Medusa API
NEXT_PUBLIC_MEDUSA_API_URL=http://localhost:9000

# Mercado Pago (para depois)
NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY=
```

**Validação:**
- [ ] Arquivos criados
- [ ] `pnpm --filter storefront install` funciona
- [ ] `pnpm --filter storefront dev` inicia servidor
- [ ] http://localhost:3000 mostra página inicial

---

### Task 11: Configurar Variáveis de Ambiente

**Objetivo:** Criar arquivo `.env.example` na raiz com todas as variáveis.

**Arquivo:** `.env.example`

```bash
# ==========================================
# Realizah - Environment Variables
# ==========================================

# ------------------------------------------
# Database
# ------------------------------------------
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/realizah_dev

# ------------------------------------------
# Medusa Backend
# ------------------------------------------
JWT_SECRET=your-super-secret-jwt-key-change-in-production
COOKIE_SECRET=your-super-secret-cookie-key-change-in-production

# CORS
STORE_CORS=http://localhost:3000
ADMIN_CORS=http://localhost:7001
AUTH_CORS=http://localhost:3000,http://localhost:7001

# ------------------------------------------
# Next.js Storefront
# ------------------------------------------
NEXT_PUBLIC_MEDUSA_API_URL=http://localhost:9000

# ------------------------------------------
# Mercado Pago (configurar depois)
# ------------------------------------------
MERCADO_PAGO_ACCESS_TOKEN=
MERCADO_PAGO_PUBLIC_KEY=
NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY=

# ------------------------------------------
# S3 Storage (configurar depois)
# ------------------------------------------
S3_BUCKET=
S3_REGION=us-east-1
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
S3_ENDPOINT=

# ------------------------------------------
# Email (configurar depois)
# ------------------------------------------
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM=noreply@realizah.com

# ------------------------------------------
# Monitoring (configurar depois)
# ------------------------------------------
SENTRY_DSN=
```

**Validação:**
- [ ] Arquivo `.env.example` criado na raiz
- [ ] Documentado em README.md

---

### Task 12: Instalar Dependências e Build

**Objetivo:** Instalar todas as dependências e fazer primeiro build.

**Passos:**

```bash
# 1. Instalar todas as dependências do monorepo
pnpm install

# 2. Build de todos os packages
pnpm build

# 3. Verificar que tudo compila
pnpm type-check
```

**Validação:**
- [ ] `pnpm install` completa sem erros
- [ ] `pnpm build` completa sem erros
- [ ] `pnpm type-check` passa em todos os packages
- [ ] Arquivos em `packages/*/dist/` gerados

---

### Task 13: Testar Desenvolvimento Local

**Objetivo:** Garantir que todo o ambiente de desenvolvimento funciona.

**Passos:**

```bash
# Terminal 1: Medusa
cd apps/medusa
pnpm dev

# Terminal 2: Storefront
cd apps/storefront
pnpm dev

# Terminal 3: Build watch dos packages
pnpm --filter @realizah/types dev
pnpm --filter @realizah/utils dev
```

**Testes:**

1. **Medusa API:**
   - Acessar http://localhost:9000/api
   - Deve retornar JSON com mensagem

2. **Storefront:**
   - Acessar http://localhost:3000
   - Deve mostrar página inicial
   - Deve carregar sem erros no console

3. **Hot Reload:**
   - Editar `packages/utils/src/date.ts`
   - Verificar que rebuild automático acontece
   - Verificar que apps detectam mudança

**Validação:**
- [ ] Medusa rodando em http://localhost:9000
- [ ] Storefront rodando em http://localhost:3000
- [ ] Hot reload funcionando
- [ ] Sem erros no console

---

### Task 14: Commit da Fase 1

**Objetivo:** Fazer commit estruturado da fundação do monorepo.

**Passos:**

```bash
# 1. Adicionar todos os arquivos
git add .

# 2. Commit seguindo Conventional Commits
git commit -m "feat: setup monorepo foundation (Fase 1)

- Initialize pnpm workspace with Turborepo
- Setup @realizah/types package with common types
- Setup @realizah/utils package with utilities
- Setup @realizah/tsconfig with shared configs
- Setup Medusa v2 backend application
- Setup Next.js 15 storefront with App Router
- Configure PostgreSQL database
- Add environment variables examples
- Configure Tailwind CSS for storefront

Apps:
- apps/medusa: Medusa v2 backend
- apps/storefront: Next.js 15 storefront

Packages:
- packages/types: Shared TypeScript types
- packages/utils: Shared utilities
- packages/tsconfig: Shared TypeScript configs

All apps and packages build and run successfully."

# 3. Verificar commit
git log -1 --stat
```

**Validação:**
- [ ] Commit criado com mensagem estruturada
- [ ] Todos os arquivos incluídos
- [ ] `git status` limpo

---

### Task 15: Criar ADR da Fase 1

**Objetivo:** Documentar decisões tomadas durante setup.

**Arquivo:** `docs/adr/0002-monorepo-setup-decisions.md`

```markdown
# 2. Decisões de Setup do Monorepo

**Data:** 2026-03-04

**Status:** Aceita

## Contexto

Durante o setup inicial do monorepo Realizah, várias decisões técnicas foram tomadas sobre estrutura, ferramentas e configurações.

## Decisões

### 1. pnpm Workspaces + Turborepo

**Decisão**: Usar pnpm workspaces para gerenciamento de dependências e Turborepo para builds.

**Motivo**:
- pnpm é mais eficiente que npm/yarn (economia de espaço em disco)
- Turborepo oferece cache inteligente de builds
- Combinação ideal para monorepos TypeScript

### 2. Estrutura apps/ e packages/

**Decisão**: Separar aplicações (`apps/`) de packages compartilhados (`packages/`).

**Motivo**:
- Clareza: apps são deployáveis, packages são bibliotecas
- Facilita adição de novos apps no futuro
- Padrão comum em monorepos

### 3. Packages Compartilhados

**Decisão**: Criar `@realizah/types` e `@realizah/utils` desde o início.

**Motivo**:
- Evitar duplicação de tipos entre Medusa e Next.js
- Centralizar utilitários comuns
- Facilitar manutenção

### 4. TypeScript Strict Mode

**Decisão**: Habilitar strict mode em todos os projetos.

**Motivo**:
- Maior segurança de tipos
- Detectar erros em tempo de compilação
- Melhor DX com autocomplete

### 5. Medusa v2

**Decisão**: Usar Medusa v2 (não v1.x).

**Motivo**:
- Arquitetura modular mais flexível
- Melhor suporte para customizações
- Versão atual e com suporte de longo prazo

### 6. Next.js 15 App Router

**Decisão**: Usar App Router (não Pages Router).

**Motivo**:
- Padrão atual do Next.js
- Server Components por padrão
- Melhor performance
- Futuro do Next.js

### 7. Tailwind CSS

**Decisão**: Usar Tailwind CSS para estilização.

**Motivo**:
- Produtividade (utility-first)
- Consistência de design
- Tree-shaking automático
- Amplamente adotado

### 8. PostgreSQL

**Decisão**: Usar PostgreSQL como banco de dados.

**Motivo**:
- Requerido pelo Medusa
- Robusto e confiável
- Suporte a JSON para flexibilidade
- Excelente para produção

## Consequências

### Positivas

- Monorepo bem estruturado e escalável
- Compartilhamento de código eficiente
- Builds rápidos com cache do Turborepo
- Type safety em todo o projeto

### Negativas

- Curva de aprendizado para desenvolvedores novos em monorepos
- Configuração inicial mais complexa
- Necessidade de manter packages sincronizados

## Notas

Todas as decisões foram tomadas considerando:
- Escalabilidade do projeto
- Produtividade do time
- Melhores práticas da comunidade
- Suporte de longo prazo
```

**Validação:**
- [ ] ADR criado em `docs/adr/0002-monorepo-setup-decisions.md`
- [ ] Referenciado em `docs/adr/README.md` (criar se não existir)

---

## Checklist Final da Fase 1

Antes de considerar a Fase 1 completa, verifique:

### Estrutura
- [ ] Estrutura de pastas criada corretamente
- [ ] pnpm-workspace.yaml configurado
- [ ] Turborepo configurado

### Packages
- [ ] @realizah/types compila e exporta tipos
- [ ] @realizah/utils compila e exporta utilitários
- [ ] @realizah/tsconfig configurado

### Apps
- [ ] Medusa v2 instalado e rodando
- [ ] Next.js 15 instalado e rodando
- [ ] PostgreSQL configurado e conectado

### Desenvolvimento
- [ ] `pnpm dev` funciona em ambos os apps
- [ ] Hot reload funcionando
- [ ] Builds funcionando (`pnpm build`)
- [ ] Type check passando (`pnpm type-check`)
- [ ] Lint passando (`pnpm lint`)

### Documentação
- [ ] .env.example criado
- [ ] README.md atualizado com instruções
- [ ] ADR da Fase 1 criado

### Git
- [ ] Commit inicial da documentação
- [ ] Commit da Fase 1
- [ ] Repositório limpo (`git status`)

---

## Próximos Passos

Após completar a Fase 1, o projeto estará pronto para:

1. **Fase 2**: Implementar Subscription Module
2. **Fase 3**: Implementar Access Control Module
3. **Fase 4**: Implementar Course Module e Digital Delivery Module em paralelo

---

## Troubleshooting

### Erro: "Cannot find module '@realizah/types'"

```bash
# Rebuild packages
pnpm --filter @realizah/types build
pnpm --filter @realizah/utils build
```

### Erro: Medusa não conecta ao PostgreSQL

```bash
# Verificar se PostgreSQL está rodando
pg_isready

# Verificar credenciais em apps/medusa/.env
cat apps/medusa/.env | grep DATABASE_URL

# Testar conexão manualmente
psql -d realizah_dev -c "SELECT 1;"
```

### Erro: Next.js não encontra módulos

```bash
# Limpar cache
rm -rf apps/storefront/.next
rm -rf node_modules/.cache

# Reinstalar
pnpm install
```

### Erro: Turborepo cache corrompido

```bash
# Limpar cache do Turborepo
rm -rf .turbo
pnpm build --force
```

---

## Recursos

- [Medusa v2 Documentation](https://docs.medusajs.com/)
- [Next.js 15 Documentation](https://nextjs.org/docs)
- [Turborepo Documentation](https://turbo.build/repo/docs)
- [pnpm Workspaces](https://pnpm.io/workspaces)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
