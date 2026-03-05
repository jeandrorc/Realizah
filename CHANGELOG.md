# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [Unreleased]

## [0.3.0] - 2026-03-04

### Added

#### Access Control Module

- **Tipos de Access Control** (`@realizah/types`)
  - `Feature`, `AccessRule`, `CustomerAccess`
  - Tipos de input: `CreateFeatureInput`, `UpdateFeatureInput`, `CreateAccessRuleInput`, `UpdateAccessRuleInput`
  - Tipos de validação: `ValidateAccessInput`, `GrantAccessInput`, `RevokeAccessInput`
  - Tipo de resposta: `FeatureAccess` (feature + hasAccess + reason)
  - Enums: `AccessAction` (allow/deny)

- **Modelos de Dados** (`apps/medusa/src/modules/access-control/models/`)
  - `Feature`: funcionalidades controláveis por tier
  - `AccessRule`: regras customizadas com prioridade e expiração
  - `CustomerAccess`: cache de acesso do cliente

- **Serviços** (`apps/medusa/src/modules/access-control/services/`)
  - `FeatureService`: CRUD de features, filtragem por categoria/tier
  - `AccessRuleService`: CRUD de regras, cleanup de regras expiradas
  - `AccessControlService`: lógica principal de verificação de acesso

- **Admin APIs** (`apps/medusa/src/api/admin/access/`)
  - `GET/POST /admin/access/features` - Gerenciar features
  - `GET/PATCH/DELETE /admin/access/features/:id` - CRUD de feature
  - `GET/POST /admin/access/rules` - Gerenciar regras
  - `GET/PATCH/DELETE /admin/access/rules/:id` - CRUD de regra
  - `GET /admin/access/customers/:customerId` - Ver acesso do cliente
  - `POST /admin/access/customers/:customerId/grant` - Conceder acesso
  - `POST /admin/access/customers/:customerId/revoke` - Revogar acesso

- **Store APIs** (`apps/medusa/src/api/store/access/`)
  - `GET /store/access/features` - Listar features ativas
  - `GET /store/access/features/:id` - Detalhes de feature
  - `POST /store/access/validate` - Validar acesso a feature
  - `GET /store/access/my-features` - Listar minhas features disponíveis

- **Subscribers** (`apps/medusa/src/modules/access-control/subscribers/`)
  - `subscription.created`: atualizar tier do cliente
  - `subscription.canceled`: downgrade para free
  - `subscription.renewed`: manter tier
  - `subscription.payment_failed`: manter tier temporariamente (grace period)

- **Seed Script** (`apps/medusa/src/modules/access-control/scripts/`)
  - 16 features padrão distribuídas por tier
  - Free (3): cursos gratuitos, ferramentas básicas, suporte email
  - Pro (5): todos cursos, ferramentas avançadas, analytics, certificados
  - Premium (8): cursos exclusivos, ferramentas premium, consultoria, API access

- **Migrations** (`apps/medusa/src/modules/access-control/migrations/`)
  - Tabelas: `feature`, `access_rule`, `customer_access`
  - 9 índices otimizados

#### Funcionalidades

- ✅ Hierarquia de tiers (free < pro < premium)
- ✅ Verificação de acesso por tier
- ✅ Regras customizadas com prioridade
- ✅ Suporte a acesso temporário (expiração)
- ✅ Grant/revoke access manual
- ✅ Cache de acesso por cliente para performance
- ✅ Integração automática com Subscription Module via eventos
- ✅ Sincronização de tier ao criar/cancelar assinatura

### Technical

- **Arquitetura**: Event-driven com subscribers
- **Performance**: Cache de acesso, 9 índices otimizados
- **Flexibilidade**: Regras customizadas, features dinâmicas
- **Type Safety**: Tipos compartilhados em `@realizah/types`
- **Integração**: Desacoplada via eventos do Subscription Module

### Documentation

- ADR 004: Decisões técnicas da Fase 3
- Especificação completa em `docs/specs/access-control-module.md`
- Seed script como exemplo de features

### Known Limitations

- ⚠️ Sem middleware de verificação (verificação manual nas APIs)
- ⚠️ Sem audit log de grant/revoke
- ⚠️ Sem rate limiting por tier
- ⚠️ Cache pode dessincronizar se eventos falharem

## [0.2.0] - 2026-03-04

### Added

#### Subscription Module

- **Tipos de Subscription** (`@realizah/types`)
  - `SubscriptionPlan`, `Subscription`, `SubscriptionInvoice`
  - Tipos de input: `CreateSubscriptionPlanInput`, `UpdateSubscriptionPlanInput`, `CreateSubscriptionInput`, `CancelSubscriptionInput`
  - Enums: `SubscriptionStatus`, `InvoiceStatus`, `SubscriptionInterval`, `Tier`

- **Modelos de Dados** (`apps/medusa/src/modules/subscription/models/`)
  - `SubscriptionPlan`: planos de assinatura com preço, intervalo, trial, features
  - `Subscription`: assinaturas ativas com status, períodos, cancelamento
  - `SubscriptionInvoice`: faturas de cobrança com status de pagamento

- **Serviços** (`apps/medusa/src/modules/subscription/services/`)
  - `SubscriptionPlanService`: CRUD de planos, filtragem por tier/status
  - `SubscriptionService`: criar, cancelar, renovar, reativar assinaturas
  - `SubscriptionInvoiceService`: gerenciar faturas e pagamentos

- **Admin APIs** (`apps/medusa/src/api/admin/subscriptions/`)
  - `GET/POST /admin/subscriptions/plans` - Gerenciar planos
  - `GET/PATCH/DELETE /admin/subscriptions/plans/:id` - CRUD de plano específico
  - `GET /admin/subscriptions` - Listar todas as assinaturas
  - `GET /admin/subscriptions/:id` - Detalhes de assinatura
  - `POST /admin/subscriptions/:id/cancel` - Cancelar assinatura
  - `POST /admin/subscriptions/:id/reactivate` - Reativar assinatura
  - `GET /admin/subscriptions/invoices` - Listar todas as invoices
  - `GET /admin/subscriptions/invoices/:id` - Detalhes de invoice

- **Store APIs** (`apps/medusa/src/api/store/subscriptions/`)
  - `GET /store/subscriptions/plans` - Listar planos ativos
  - `GET /store/subscriptions/plans/:id` - Detalhes de plano
  - `POST /store/subscriptions` - Criar assinatura (autenticado)
  - `GET /store/subscriptions` - Listar assinaturas do cliente
  - `GET /store/subscriptions/:id` - Detalhes da assinatura
  - `POST /store/subscriptions/:id/cancel` - Cancelar própria assinatura
  - `POST /store/subscriptions/:id/reactivate` - Reativar própria assinatura
  - `GET /store/subscriptions/:id/invoices` - Listar invoices da assinatura

- **Workflows** (`apps/medusa/src/modules/subscription/workflows/`)
  - `create-subscription-workflow`: criar assinatura + primeira invoice
  - `cancel-subscription-workflow`: cancelar com opção imediata/agendada
  - `renew-subscription-workflow`: renovar + criar nova invoice

- **Subscribers** (`apps/medusa/src/modules/subscription/subscribers/`)
  - `subscription.created`: log de criação de assinatura
  - `subscription.canceled`: log de cancelamento
  - `subscription.renewed`: log de renovação
  - `subscription.payment_failed`: log de falha de pagamento + atualização de status

- **Migrations** (`apps/medusa/src/modules/subscription/migrations/`)
  - Tabelas: `subscription_plan`, `subscription`, `subscription_invoice`
  - Índices: customer, status, period_end, subscription_id

#### Funcionalidades

- ✅ Suporte a trial periods configuráveis
- ✅ Cancelamento imediato ou agendado (fim do período)
- ✅ Reativação de assinaturas canceladas
- ✅ Renovação automática (lógica implementada)
- ✅ Múltiplos intervalos: monthly, yearly (+ suporte a trimestral/semestral via `intervalCount`)
- ✅ Tiers: free, pro, premium
- ✅ Metadata flexível em todas as entidades

### Technical

- **Arquitetura**: Módulo interno do Medusa v2 (preparado para migração futura)
- **Type Safety**: Tipos compartilhados em `@realizah/types`
- **Workflows**: Transações atômicas usando Medusa Workflows SDK
- **Eventos**: Sistema de eventos para desacoplamento
- **Performance**: 6 índices otimizados para queries comuns
- **Autorização**: Separação Admin/Store com validação de `customerId`

### Documentation

- ADR 003: Decisões técnicas da Fase 2
- Especificação completa em `docs/specs/subscription-module.md`

### Known Limitations

- ⚠️ Módulo não registrado em `medusa-config.js` (limitação do Medusa v2 RC)
- ⚠️ Pagamentos não integrados (aguarda Fase 5: Mercado Pago)
- ⚠️ Renovação manual (aguarda implementação de scheduler)
- ⚠️ Emails não enviados (aguarda integração com serviço de email)

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
