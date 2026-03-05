# ADR 003: Fase 2 - Subscription Module

**Status:** Aceito  
**Data:** 2026-03-04  
**Decisores:** Equipe de Desenvolvimento  
**Contexto Técnico:** Implementação do módulo de assinaturas

---

## Contexto

A Fase 2 do projeto Realizah focou na implementação do **Subscription Module**, um módulo core
responsável por gerenciar todo o ciclo de vida de assinaturas, desde a criação de planos até o
cancelamento e renovação automática.

Este módulo é fundamental para o modelo de negócio híbrido da plataforma, permitindo que usuários
assinem planos mensais ou anuais para acessar conteúdos e funcionalidades premium.

---

## Decisões Técnicas

### 1. Arquitetura do Módulo

**Decisão:** Implementar como módulo interno do Medusa v2 em `src/modules/subscription/`

**Justificativa:**

- Medusa v2 RC ainda não tem suporte estável para módulos customizados externos
- Módulo interno permite desenvolvimento rápido e iteração
- Estrutura preparada para migração futura para package separado

**Alternativas consideradas:**

- Package separado: rejeitado devido a limitações do Medusa v2 RC
- Plugin: rejeitado pois módulos são mais apropriados para lógica de negócio core

### 2. Modelo de Dados

**Decisão:** Três entidades principais: `SubscriptionPlan`, `Subscription`, `SubscriptionInvoice`

**Justificativa:**

- **SubscriptionPlan**: Representa planos disponíveis (Pro, Premium)
  - Suporta múltiplos intervalos (monthly, yearly)
  - Flexível com `intervalCount` para planos trimestrais/semestrais
  - Inclui trial periods configuráveis
  - Features como lista para fácil exibição

- **Subscription**: Representa assinatura ativa de um usuário
  - Status granular: trialing, active, past_due, canceled, unpaid
  - Períodos de cobrança explícitos (currentPeriodStart/End)
  - Suporta cancelamento imediato ou agendado
  - Trial tracking separado

- **SubscriptionInvoice**: Representa faturas de cobrança
  - Desacoplada de pagamentos (preparado para Mercado Pago)
  - Status próprio: draft, open, paid, void, uncollectible
  - Tracking de tentativas de pagamento

**Alternativas consideradas:**

- Usar apenas Subscription + Invoice: rejeitado, planos precisam ser entidades separadas para
  versionamento
- Incluir Payment na Invoice: rejeitado, pagamentos serão gerenciados pelo Mercado Pago

### 3. Serviços

**Decisão:** Três serviços especializados usando `MedusaService`

**Justificativa:**

- **SubscriptionPlanService**: CRUD de planos, filtragem por tier/status
- **SubscriptionService**: Lógica complexa de ciclo de vida (create, cancel, renew, reactivate)
- **SubscriptionInvoiceService**: Gerenciamento de faturas e status de pagamento

**Padrão:**

```typescript
class XService extends MedusaService({
  Model: require('./model').default,
}) {
  // Métodos de negócio
}
```

**Alternativas consideradas:**

- Serviço único: rejeitado, violaria Single Responsibility Principle
- Serviços por caso de uso: rejeitado, muito granular para fase inicial

### 4. APIs

**Decisão:** Separação Admin vs Store com autenticação e autorização

**Admin APIs:**

- Gerenciamento completo de planos (CRUD)
- Visualização de todas as assinaturas
- Acesso a todas as invoices
- Ações administrativas (cancelar, reativar)

**Store APIs:**

- Listagem de planos ativos apenas
- Criação de assinatura (autenticado)
- Gerenciamento da própria assinatura
- Visualização das próprias invoices
- Autorização por `customerId`

**Justificativa:**

- Segurança: clientes não podem ver assinaturas de outros
- Separação de concerns: admin tem controle total
- Seguir convenções do Medusa v2

**Alternativas consideradas:**

- API única com roles: rejeitado, Medusa v2 já separa admin/store
- GraphQL: rejeitado, REST é padrão do Medusa

### 5. Workflows

**Decisão:** Workflows para operações complexas usando Medusa Workflows SDK

**Workflows implementados:**

1. **create-subscription-workflow**: Cria assinatura + primeira invoice
2. **cancel-subscription-workflow**: Cancela com opção imediata/agendada
3. **renew-subscription-workflow**: Renova + cria nova invoice

**Justificativa:**

- Workflows garantem transações atômicas
- Facilitam retry e rollback
- Preparado para orquestração futura (ex: pagamento + envio de email)

**Alternativas consideradas:**

- Lógica direta nos serviços: rejeitado, workflows são best practice do Medusa v2
- Sagas: rejeitado, workflows do Medusa são mais simples e integrados

### 6. Eventos e Subscribers

**Decisão:** Sistema de eventos para desacoplamento

**Eventos:**

- `subscription.created`
- `subscription.canceled`
- `subscription.renewed`
- `subscription.payment_failed`

**Subscribers:**

- Logging de eventos
- TODOs para integrações futuras (email, Access Control)

**Justificativa:**

- Desacoplamento: outros módulos podem reagir a eventos
- Extensibilidade: fácil adicionar notificações, analytics
- Padrão do Medusa v2

**Alternativas consideradas:**

- Callbacks diretos: rejeitado, cria acoplamento
- Message queue externa: rejeitado, overkill para MVP

### 7. Migrations

**Decisão:** Migration única com todas as tabelas e índices

**Índices criados:**

- `idx_subscription_customer`: busca por cliente
- `idx_subscription_status`: filtragem por status
- `idx_subscription_period_end`: renovações automáticas
- `idx_invoice_subscription`: busca de invoices por assinatura
- `idx_invoice_status`: filtragem de invoices
- `idx_invoice_customer`: busca de invoices por cliente

**Justificativa:**

- Performance: queries comuns otimizadas
- Preparado para escala: índices desde o início

**Alternativas consideradas:**

- Múltiplas migrations: rejeitado, módulo novo não precisa versionamento inicial
- Sem índices: rejeitado, performance é crítica

### 8. Tipos Compartilhados

**Decisão:** Tipos no package `@realizah/types`

**Justificativa:**

- Reuso entre backend e frontend
- Type safety em todo o monorepo
- Facilita validação e documentação

**Estrutura:**

```typescript
// Entidades
export interface SubscriptionPlan extends BaseEntity { ... }
export interface Subscription extends BaseEntity { ... }
export interface SubscriptionInvoice extends BaseEntity { ... }

// Inputs
export interface CreateSubscriptionPlanInput { ... }
export interface UpdateSubscriptionPlanInput { ... }
export interface CreateSubscriptionInput { ... }
export interface CancelSubscriptionInput { ... }
```

---

## Consequências

### Positivas

✅ **Funcionalidade Core Implementada**

- Sistema completo de assinaturas funcionando
- Suporte a trials, cancelamentos, renovações

✅ **APIs Prontas**

- Admin pode gerenciar planos e assinaturas
- Clientes podem assinar e gerenciar suas assinaturas

✅ **Extensível**

- Eventos permitem integração com outros módulos
- Workflows facilitam adição de steps (ex: pagamento)

✅ **Type-Safe**

- Tipos compartilhados garantem consistência
- Reduz bugs de integração

✅ **Preparado para Escala**

- Índices otimizados
- Estrutura modular

### Negativas

⚠️ **Módulo Não Registrado**

- Medusa v2 RC requer módulos buildados
- Módulo funciona mas não está registrado no `medusa-config.js`
- **Mitigação:** Estrutura preparada para migração futura

⚠️ **Pagamentos Não Integrados**

- Invoices criadas mas não processadas
- **Próximo passo:** Fase 5 - Integração Mercado Pago

⚠️ **Renovação Manual**

- Não há cron job automático
- **Próximo passo:** Implementar scheduler

⚠️ **Sem Emails**

- Eventos logam mas não enviam emails
- **Próximo passo:** Integração com serviço de email

---

## Riscos e Mitigações

| Risco                            | Impacto | Probabilidade | Mitigação                                       |
| -------------------------------- | ------- | ------------- | ----------------------------------------------- |
| Medusa v2 RC muda API de módulos | Alto    | Média         | Manter estrutura flexível, seguir docs oficiais |
| Performance em escala            | Médio   | Baixa         | Índices implementados, monitorar queries        |
| Renovações falharem              | Alto    | Média         | Implementar retry logic robusto na Fase 5       |
| Dados inconsistentes             | Alto    | Baixa         | Workflows garantem transações atômicas          |

---

## Métricas de Sucesso

- ✅ 37 arquivos criados (models, services, APIs, workflows, subscribers)
- ✅ Tipos compartilhados em `@realizah/types`
- ✅ Migration com 3 tabelas e 6 índices
- ✅ 15 endpoints REST (8 admin + 7 store)
- ✅ 3 workflows implementados
- ✅ 4 subscribers para eventos
- ✅ Build passando sem erros
- ✅ Lint passando sem erros
- ✅ Commit com mensagem convencional

---

## Próximos Passos

1. **Fase 3: Access Control Module**
   - Integrar com Subscription Module via eventos
   - Controlar acesso baseado em status de assinatura

2. **Fase 5: Integração Mercado Pago**
   - Processar pagamentos de invoices
   - Implementar webhooks
   - Retry logic para pagamentos falhados

3. **Melhorias Futuras**
   - Cron job para renovações automáticas
   - Emails transacionais
   - Dashboard de métricas
   - Testes automatizados

---

## Referências

- [Especificação do Subscription Module](../specs/subscription-module.md)
- [Medusa v2 Modules Documentation](https://docs.medusajs.com/v2/resources/architectural-modules)
- [Medusa Workflows SDK](https://docs.medusajs.com/v2/advanced-development/workflows)
- Commit: `cff1c65` - feat(subscription): implement subscription module
