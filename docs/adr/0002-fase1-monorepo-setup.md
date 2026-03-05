# ADR 0002: Fase 1 - Setup do Monorepo

**Status:** Implementado  
**Data:** 2026-03-04  
**Decisor:** Equipe de Arquitetura  
**Contexto:** [ADR 0001 - Monorepo Architecture](./0001-record-architecture-decisions.md)

---

## Contexto

Após a decisão de usar uma arquitetura monorepo (documentada em
`docs/plans/2026-03-04-monorepo-architecture-design.md`), precisávamos implementar a infraestrutura
base do projeto antes de desenvolver os módulos customizados. Esta fase estabelece a fundação
técnica sobre a qual todo o resto do projeto será construído.

## Decisão

Implementamos a **Fase 1: Setup do Monorepo** com as seguintes escolhas técnicas:

### 1. Gerenciamento de Workspace

- **pnpm workspaces**: Escolhido por performance superior e gerenciamento eficiente de dependências
- **Turborepo**: Pipeline de build com cache inteligente para otimizar builds incrementais
- Estrutura: `apps/` para aplicações, `packages/` para bibliotecas compartilhadas

### 2. Packages Compartilhados

Criamos três packages base:

- **@realizah/tsconfig**: Configurações TypeScript compartilhadas (base, nextjs, medusa)
- **@realizah/types**: Tipos TypeScript comuns (entidades, responses, pagination)
- **@realizah/utils**: Utilitários compartilhados (date, validation, errors)

### 3. Backend (Medusa v2)

- **Versão**: RC (Release Candidate) - v2.0.0-rc-20241022183311
- **Configuração**: medusa-config.js (CommonJS, não TypeScript)
- **Database**: PostgreSQL 14 com migrations automáticas
- **Awilix**: v8.0.1 (downgrade de v10 para compatibilidade com Medusa RC)
- **Estrutura**: `src/api`, `src/modules`, `src/subscribers`, `src/loaders`

### 4. Frontend (Next.js 15)

- **App Router**: Arquitetura moderna com Server/Client Components
- **Styling**: Tailwind CSS v3.4
- **TypeScript**: Strict mode com configurações compartilhadas
- **Build**: Otimizado para produção com transpilePackages

### 5. Ferramentas de Qualidade

- **ESLint**: Configurado para TypeScript em todos os packages
- **Prettier**: Formatação automática consistente
- **Husky + lint-staged**: Pre-commit hooks para qualidade de código
- **commitlint**: Validação de Conventional Commits

### 6. Ambiente de Desenvolvimento

- **PostgreSQL**: Rodando localmente via Homebrew
- **Secrets**: JWT e Cookie secrets gerados com crypto.randomBytes(32)
- **CORS**: Configurado para desenvolvimento local (localhost:3000, localhost:7001)

## Consequências

### Positivas

- ✅ Infraestrutura base completa e funcional
- ✅ Ambos servidores (Medusa + Next.js) rodando e testados
- ✅ 1634 dependências instaladas e buildadas com sucesso
- ✅ Qualidade de código garantida por hooks e linters
- ✅ Workspace configurado para desenvolvimento paralelo
- ✅ Fundação sólida para implementar os 4 módulos customizados

### Negativas

- ⚠️ Medusa v2 ainda em RC (não stable) - pode ter breaking changes
- ⚠️ Awilix downgrade necessário (v8 vs v10) - dependência do Medusa RC
- ⚠️ Husky mostrando avisos de deprecação (v9 → v10)
- ⚠️ Redis não configurado (usando fake in-memory) - suficiente para dev, mas não para produção

### Riscos Mitigados

- 🛡️ TypeScript strict mode previne erros comuns
- 🛡️ ESLint + Prettier garantem consistência
- 🛡️ Git hooks previnem commits com erros
- 🛡️ Conventional Commits facilitam changelogs automáticos

## Alternativas Consideradas

### 1. Medusa v1 vs v2

- **Rejeitado**: v1 (stable) seria mais seguro, mas v2 tem arquitetura modular superior
- **Escolhido**: v2 RC - aceitar risco de breaking changes em troca de arquitetura moderna

### 2. Yarn vs pnpm

- **Rejeitado**: Yarn (mais comum) - performance inferior
- **Escolhido**: pnpm - 2-3x mais rápido, economia de disco, workspaces nativos

### 3. Lerna vs Turborepo

- **Rejeitado**: Lerna (mais maduro) - menos otimizado para builds
- **Escolhido**: Turborepo - cache inteligente, pipelines paralelos, melhor DX

## Validação

Todos os testes de validação passaram:

```bash
✅ pnpm install          # 1634 packages instalados
✅ pnpm build            # Todos packages buildados
✅ curl localhost:9000/health  # Medusa respondendo "OK"
✅ curl localhost:3000   # Next.js renderizando homepage
✅ git commit            # Hooks rodando corretamente
```

## Próximos Passos

Com a Fase 1 completa, estamos prontos para:

1. **Fase 2**: Implementar `subscription-module`
2. **Fase 3**: Implementar `access-control-module`
3. **Fase 4**: Implementar `course-module`
4. **Fase 5**: Implementar `digital-delivery-module`
5. **Fase 6**: Integração Mercado Pago
6. **Fase 7**: Deploy e CI/CD

## Referências

- [Plano Detalhado da Fase 1](../plans/2026-03-04-fase1-setup-monorepo.md)
- [Quick Start Fase 1](../plans/QUICK-START-FASE1.md)
- [Roadmap Completo](../ROADMAP.md)
- [Medusa v2 Documentation](https://docs.medusajs.com/v2)
- [Next.js 15 Documentation](https://nextjs.org/docs)
