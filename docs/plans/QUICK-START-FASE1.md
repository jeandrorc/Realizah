# Quick Start: Fase 1 - Setup do Monorepo

Guia rápido para executar a Fase 1. Para detalhes completos, veja [2026-03-04-fase1-setup-monorepo.md](2026-03-04-fase1-setup-monorepo.md).

## ⚡ Execução Rápida

### 1. Inicializar Git e Instalar Husky

```bash
cd /Users/jeandrocouto/Workspace/Realizah
git init
git add .
git commit -m "docs: initial project documentation and governance"
git branch -M main
pnpm install
pnpm prepare
```

### 2. Criar Estrutura de Pastas

```bash
mkdir -p apps/medusa/src/{api,modules,subscribers,loaders}
mkdir -p apps/storefront/src/{app,components,lib,styles}
mkdir -p packages/{types,utils,tsconfig}/src
```

### 3. Criar pnpm-workspace.yaml

```bash
cat > pnpm-workspace.yaml << 'EOF'
packages:
  - "apps/*"
  - "packages/*"
EOF
```

### 4. Setup Packages

Execute os comandos abaixo para criar todos os arquivos dos packages. Consulte o plano detalhado para o conteúdo de cada arquivo.

**Packages a criar:**
- `packages/tsconfig/` (base.json, nextjs.json, medusa.json)
- `packages/types/` (package.json, tsconfig.json, src/index.ts, src/common.ts, src/medusa.ts)
- `packages/utils/` (package.json, tsconfig.json, src/index.ts, src/date.ts, src/validation.ts, src/errors.ts)

### 5. Setup Medusa

Crie os arquivos do Medusa conforme o plano detalhado:
- `apps/medusa/package.json`
- `apps/medusa/tsconfig.json`
- `apps/medusa/medusa-config.ts`
- `apps/medusa/.env.example`
- `apps/medusa/src/api/index.ts`

### 6. Setup PostgreSQL

```bash
# Criar banco
createdb realizah_dev

# Copiar .env
cp apps/medusa/.env.example apps/medusa/.env

# Editar .env com suas credenciais
# Depois rodar migrations
cd apps/medusa
pnpm install
pnpm migration:run
```

### 7. Setup Next.js

Crie os arquivos do Next.js conforme o plano detalhado:
- `apps/storefront/package.json`
- `apps/storefront/tsconfig.json`
- `apps/storefront/next.config.ts`
- `apps/storefront/tailwind.config.ts`
- `apps/storefront/postcss.config.js`
- `apps/storefront/src/app/layout.tsx`
- `apps/storefront/src/app/page.tsx`
- `apps/storefront/src/app/globals.css`

### 8. Instalar e Build

```bash
# Voltar para raiz
cd /Users/jeandrocouto/Workspace/Realizah

# Instalar todas as dependências
pnpm install

# Build de todos os packages
pnpm build

# Type check
pnpm type-check
```

### 9. Testar Desenvolvimento

```bash
# Terminal 1: Medusa
pnpm --filter medusa dev

# Terminal 2: Storefront
pnpm --filter storefront dev

# Terminal 3: Watch packages
pnpm --filter @realizah/types dev &
pnpm --filter @realizah/utils dev &
```

**Verificar:**
- http://localhost:9000/api (Medusa)
- http://localhost:3000 (Storefront)

### 10. Commit Final

```bash
git add .
git commit -m "feat: setup monorepo foundation (Fase 1)

- Initialize pnpm workspace with Turborepo
- Setup @realizah/types, @realizah/utils, @realizah/tsconfig
- Setup Medusa v2 backend
- Setup Next.js 15 storefront
- Configure PostgreSQL database"
```

## ✅ Checklist Rápido

- [ ] Git inicializado e documentação commitada
- [ ] Estrutura de pastas criada
- [ ] pnpm-workspace.yaml criado
- [ ] Packages (types, utils, tsconfig) criados
- [ ] Medusa configurado
- [ ] PostgreSQL criado e migrations rodadas
- [ ] Next.js configurado
- [ ] `pnpm install` completo
- [ ] `pnpm build` funciona
- [ ] Medusa roda em :9000
- [ ] Storefront roda em :3000
- [ ] Commit da Fase 1 feito

## 🚀 Próximo Passo

Após completar a Fase 1, você pode:

1. **Implementar Subscription Module** (Fase 2)
2. **Usar agentes paralelos** para acelerar desenvolvimento

## 📚 Documentação Completa

Para detalhes completos de cada task, consulte:
- [Plano Detalhado da Fase 1](2026-03-04-fase1-setup-monorepo.md)
- [Especificações dos Módulos](../specs/)
- [Convenções](../conventions/)

## ❓ Problemas?

Consulte a seção **Troubleshooting** no plano detalhado.
