# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [Unreleased]

## [0.4.0] - 2026-03-04

### Added

#### Course Module (LMS Platform)

- **Tipos de Course** (`@realizah/types`)
  - `Course`, `CourseModule`, `Lesson`, `Enrollment`, `LessonProgress`, `CourseReview`
  - Tipos de input: `CreateCourseInput`, `UpdateCourseInput`, `CreateCourseModuleInput`, `UpdateCourseModuleInput`, `CreateLessonInput`, `UpdateLessonInput`, `EnrollInput`, `CompleteLessonInput`, `SubmitQuizInput`, `CreateReviewInput`, `UpdateReviewInput`
  - Tipos de resposta: `SubmitQuizResult` (score, passed, feedback)
  - Enums: `CourseLevel` (beginner/intermediate/advanced), `LessonType` (video/text/quiz/assignment/file), `EnrollmentStatus` (active/completed/dropped), `ProgressStatus` (not_started/in_progress/completed), `QuizQuestionType` (multiple_choice/true_false/short_answer), `VideoProvider` (youtube/vimeo/s3)
  - Tipos de conteúdo: `QuizQuestion`, `LessonContent`

- **Modelos de Dados** (`apps/medusa/src/modules/course/models/`)
  - `Course`: cursos com níveis, tiers, rating e enrollment count
  - `CourseModule`: módulos organizacionais com ordem
  - `Lesson`: aulas com tipos variados e conteúdo JSON
  - `Enrollment`: matrículas com progresso e certificado
  - `LessonProgress`: progresso individual por aula com quiz tracking
  - `CourseReview`: avaliações de 1-5 estrelas

- **Serviços Core** (`apps/medusa/src/modules/course/services/`)
  - `CourseService`: CRUD de cursos, publicação, rating, filtros por categoria/nível/tier
  - `CourseModuleService`: gestão de módulos, reordenação, cálculo de duração
  - `LessonService`: gestão de aulas, validação de conteúdo por tipo
  - `EnrollmentService`: matrículas, verificação de elegibilidade, completion
  - `LessonProgressService`: tracking de progresso, quiz attempts, completion
  - `CourseReviewService`: avaliações, cálculo de rating médio

- **Serviços de Lógica de Negócio** (`apps/medusa/src/modules/course/services/`)
  - `ProgressManagerService`: cálculo automático de progresso, estatísticas de enrollment, overview de curso, auto-completion
  - `QuizManagerService`: submissão de quiz, correção automática, validação de estrutura, tracking de tentativas
  - `CertificateManagerService`: geração de certificados, verificação, metadata, listagem por customer

- **Admin APIs** (`apps/medusa/src/api/admin/courses/`)
  - `GET/POST /admin/courses` - Listar e criar cursos
  - `GET/PATCH/DELETE /admin/courses/:id` - CRUD de curso
  - `POST /admin/courses/:id/publish` - Publicar curso
  - `GET/POST /admin/courses/modules` - Gerenciar módulos
  - `GET/PATCH/DELETE /admin/courses/modules/:id` - CRUD de módulo
  - `GET/POST /admin/courses/modules/lessons` - Gerenciar aulas
  - `GET/PATCH/DELETE /admin/courses/modules/lessons/:id` - CRUD de aula
  - `GET /admin/courses/enrollments` - Listar matrículas
  - `GET /admin/courses/enrollments/:id` - Detalhes de matrícula
  - `GET /admin/courses/reviews` - Listar avaliações
  - `DELETE /admin/courses/reviews/:id` - Deletar avaliação

- **Store APIs** (`apps/medusa/src/api/store/courses/`, `apps/medusa/src/api/store/my-courses/`)
  - `GET /store/courses` - Listar cursos publicados (com filtros)
  - `GET /store/courses/:id` - Detalhes do curso
  - `GET /store/courses/:id/modules` - Módulos e aulas do curso
  - `POST /store/courses/:id/enroll` - Matricular-se no curso
  - `GET /store/my-courses` - Meus cursos matriculados
  - `GET /store/my-courses/:id` - Detalhes da matrícula com estatísticas
  - `GET /store/my-courses/:id/lessons/:lessonId` - Detalhes da aula com progresso
  - `POST /store/my-courses/:id/lessons/:lessonId/complete` - Completar aula
  - `POST /store/my-courses/:id/lessons/:lessonId/quiz` - Submeter quiz
  - `GET /store/my-courses/:id/certificate` - Obter certificado
  - `POST /store/my-courses/:id/certificate` - Gerar certificado
  - `POST /store/reviews` - Criar avaliação de curso

- **Subscribers** (`apps/medusa/src/modules/course/subscribers/`)
  - `enrollment.created`: welcome email, notificar instrutor, analytics
  - `enrollment.completed`: gerar certificado, email de parabéns, recomendar próximo curso
  - `lesson.completed`: atualizar progresso, unlock próxima aula, notificação
  - `quiz.passed`: award badge, notificação de parabéns
  - `review.created`: atualizar rating do curso, notificar instrutor, moderação

- **Middleware** (`apps/medusa/src/api/middlewares/`)
  - `verifyCourseAccess`: verificação de acesso por tier e feature
  - `canEnrollInCourse`: helper para verificar elegibilidade de matrícula

- **Scripts** (`apps/medusa/src/modules/course/scripts/`)
  - `seed-courses.ts`: 5 cursos padrão para onboarding (free, pro, premium)

- **Migrations** (`apps/medusa/src/modules/course/migrations/`)
  - `Migration20260304200000`: 6 tabelas com 18 indexes otimizados
  - Foreign keys com ON DELETE CASCADE
  - Unique constraints: (customerId, courseId), (enrollmentId, lessonId), (courseId, customerId)
  - Check constraint: rating entre 1 e 5

### Technical Details

- **Sistema de Progresso Automático**:
  - Tracking por aula com status (not_started, in_progress, completed)
  - Cálculo automático de % de conclusão baseado em aulas completadas
  - Auto-completion quando progresso atinge 100%
  - Estatísticas: total de aulas, completadas, em progresso, tempo assistido

- **Sistema de Quiz**:
  - Tipos de questões: múltipla escolha, verdadeiro/falso, resposta curta
  - Correção automática com comparação de respostas
  - Suporte a múltiplas respostas corretas
  - Score em percentual (0-100), nota mínima 70% para aprovação
  - Tentativas ilimitadas, melhor score mantido
  - Feedback por questão com explicação opcional

- **Sistema de Certificados**:
  - Geração automática ao completar 100% do curso
  - URL única por enrollment
  - Metadata: curso, customer, data de conclusão, duração, nível
  - Verificação de autenticidade por URL
  - Listagem de certificados por customer
  - **Nota**: Implementação atual gera URL placeholder, integração com PDF pendente

- **Integração com Access Control**:
  - Verificação de tier (free, pro, premium) por curso
  - Verificação de feature opcional para acesso granular
  - Middleware de verificação em enrollment
  - Helper function para elegibilidade completa
  - Bloqueio de matrícula se tier insuficiente

- **Event-Driven Architecture**:
  - 5 subscribers para eventos de curso
  - TODOs para integração com email, push notifications, analytics
  - Extensível para gamificação, recomendações, etc.

- **Performance**:
  - 18 indexes otimizados para queries frequentes
  - Unique constraints para evitar duplicatas
  - Cálculo de progresso eficiente com caching
  - Foreign keys com CASCADE para cleanup automático

### Documentation

- ADR 005: Fase 4 - Course Module (LMS Platform)
- Plano Detalhado da Fase 4 com breakdown de tasks
- Especificação completa do Course Module

### Metrics

- 49 arquivos criados (2329+ linhas de código)
- 6 entidades, 9 services, 23+ REST endpoints
- 6 tabelas, 18 indexes, 5 subscribers
- 100% type-safe com @realizah/types
- 0 erros de ESLint/Prettier

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
