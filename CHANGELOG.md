# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [Unreleased]

## [0.1.0] - 2026-03-04

### Added - Fase 1: Setup do Monorepo

#### Infraestrutura Base
- Monorepo com pnpm workspaces (`apps/`, `packages/`)
- Turborepo para builds otimizados e cache
- Git repository inicializado com branch `main`

#### Packages Compartilhados
- `@realizah/tsconfig` - Configurações TypeScript compartilhadas
  - `base.json` - Config base com strict mode
  - `nextjs.json` - Config para Next.js 15
  - `medusa.json` - Config para Medusa v2
- `@realizah/types` - Tipos TypeScript comuns
  - Tipos base (BaseEntity, Tier, Status)
  - Tipos de paginação (PaginationParams, PaginatedResponse)
  - Tipos de erro (ErrorResponse)
  - Tipos Medusa (MedusaCustomer, MedusaProduct)
- `@realizah/utils` - Utilitários compartilhados
  - Manipulação de datas (formatDate, addDays, addMonths, isExpired)
  - Validação (isValidEmail, isValidUrl, isValidUUID)
  - Classes de erro customizadas (AppError, ValidationError, NotFoundError, etc.)

#### Backend (Medusa v2)
- Medusa v2 RC instalado e configurado
- PostgreSQL 14 configurado e rodando
- Migrations do Medusa executadas com sucesso
- Estrutura de diretórios: `src/api`, `src/modules`, `src/subscribers`, `src/loaders`
- API endpoint básico (`/api`) funcionando
- Admin URL: http://localhost:9000/app
- Health endpoint: http://localhost:9000/health

#### Frontend (Next.js 15)
- Next.js 15 com App Router
- Tailwind CSS v3.4 configurado
- Homepage funcional com navegação
- Build otimizado para produção
- Server rodando em http://localhost:3000

#### Qualidade de Código
- ESLint configurado para todos os packages
- Prettier para formatação automática
- Husky + lint-staged para pre-commit hooks
- commitlint para validação de Conventional Commits

#### Documentação
- Estrutura inicial de documentação completa
  - README.md principal com overview do projeto
  - EXECUTIVE-SUMMARY.md com visão executiva
  - START-HERE.md para novos desenvolvedores
  - CONTRIBUTING.md com guia de contribuição
  - CLAUDE.md para contexto de IA
  - Cursor Rules (`.cursor/rules/`) para padrões de código
  - GitHub Copilot instructions
  - `.local/README.md` para contexto local
- Documentação técnica
  - ADR 0001: Record Architecture Decisions
  - ADR 0002: Fase 1 - Setup do Monorepo
  - Especificações dos 4 módulos customizados
  - Convenções de código, Git e API
- Governança do projeto
  - Templates de Pull Request
  - Templates de Issues (bug, feature, question)
  - Processo de code review
  - Definição de responsabilidades
- Planejamento
  - Plano detalhado da Fase 1
  - Quick Start da Fase 1
  - Roadmap completo do projeto (7 fases)
  - Índice completo de documentação

#### Ambiente de Desenvolvimento
- Variáveis de ambiente configuradas (.env files)
- PostgreSQL database `realizah_dev` criado
- JWT e Cookie secrets gerados
- CORS configurado para desenvolvimento local
- 1634 dependências instaladas
- Todos os packages buildados com sucesso

### Technical Details
- **Node.js**: >=20.0.0
- **pnpm**: 8.15.0
- **Medusa**: 2.0.0-rc-20241022183311
- **Next.js**: 15.5.12
- **PostgreSQL**: 14.19
- **TypeScript**: 5.3.3
- **Awilix**: 8.0.1 (compatibilidade com Medusa RC)

---

## Como Gerar o Changelog

Este arquivo pode ser atualizado automaticamente usando:

```bash
pnpm changelog
```

Ou manualmente seguindo o formato acima.

### Categorias

- **Added** — novas funcionalidades
- **Changed** — mudanças em funcionalidades existentes
- **Deprecated** — funcionalidades que serão removidas
- **Removed** — funcionalidades removidas
- **Fixed** — correções de bugs
- **Security** — correções de vulnerabilidades

[Unreleased]: https://github.com/realizah/realizah/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/realizah/realizah/releases/tag/v0.1.0
