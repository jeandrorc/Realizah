# Subscription Module — Especificação Técnica

Módulo responsável pela gestão de planos de assinatura, ciclos de cobrança e status de assinaturas.

## Visão Geral

O Subscription Module gerencia todo o ciclo de vida de assinaturas, desde a criação de planos até o cancelamento e renovação automática.

## Entidades

### SubscriptionPlan

Representa um plano de assinatura disponível para compra.

```typescript
interface SubscriptionPlan {
  id: string;                    // Identificador único (ex: plan_pro_monthly)
  name: string;                  // Nome do plano (ex: "Pro")
  description?: string;          // Descrição do plano
  price: number;                 // Preço em centavos (ex: 9900 = R$ 99,00)
  currency: string;              // Moeda (ex: "BRL")
  interval: 'monthly' | 'yearly'; // Intervalo de cobrança
  intervalCount: number;         // Quantidade de intervalos (ex: 1 = mensal, 3 = trimestral)
  trialDays?: number;            // Dias de trial gratuito
  features: string[];            // Lista de features incluídas
  tier: 'free' | 'pro' | 'premium'; // Tier do plano
  isActive: boolean;             // Se o plano está disponível para compra
  metadata?: Record<string, any>; // Metadados adicionais
  createdAt: Date;
  updatedAt: Date;
}
```

### Subscription

Representa uma assinatura ativa de um usuário.

```typescript
interface Subscription {
  id: string;                    // Identificador único
  customerId: string;            // ID do cliente (Medusa customer)
  planId: string;                // ID do plano
  status: SubscriptionStatus;    // Status da assinatura
  currentPeriodStart: Date;      // Início do período atual
  currentPeriodEnd: Date;        // Fim do período atual
  cancelAt?: Date;               // Data de cancelamento agendado
  canceledAt?: Date;             // Data de cancelamento efetivo
  trialStart?: Date;             // Início do trial
  trialEnd?: Date;               // Fim do trial
  paymentMethodId?: string;      // Método de pagamento padrão
  metadata?: Record<string, any>; // Metadados adicionais
  createdAt: Date;
  updatedAt: Date;
}

type SubscriptionStatus = 
  | 'trialing'      // Em período de trial
  | 'active'        // Ativa e paga
  | 'past_due'      // Pagamento atrasado
  | 'canceled'      // Cancelada
  | 'unpaid';       // Não paga (após tentativas falhadas)
```

### SubscriptionInvoice

Representa uma fatura de assinatura.

```typescript
interface SubscriptionInvoice {
  id: string;
  subscriptionId: string;
  customerId: string;
  amount: number;                // Valor em centavos
  currency: string;
  status: InvoiceStatus;
  periodStart: Date;
  periodEnd: Date;
  dueDate: Date;
  paidAt?: Date;
  paymentIntentId?: string;      // ID do pagamento no Mercado Pago
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

type InvoiceStatus = 
  | 'draft'         // Rascunho
  | 'open'          // Aberta, aguardando pagamento
  | 'paid'          // Paga
  | 'void'          // Cancelada
  | 'uncollectible'; // Não cobrável
```

## Casos de Uso

### 1. Criar Plano de Assinatura

**Ator**: Admin

**Fluxo**:
1. Admin acessa painel administrativo
2. Preenche dados do plano (nome, preço, intervalo, features)
3. Sistema valida dados
4. Sistema cria plano no banco
5. Plano fica disponível para compra

**Validações**:
- Nome é obrigatório e único
- Preço deve ser > 0
- Intervalo deve ser 'monthly' ou 'yearly'
- Tier deve ser 'free', 'pro' ou 'premium'

### 2. Assinar um Plano

**Ator**: Cliente

**Fluxo**:
1. Cliente seleciona plano
2. Cliente fornece método de pagamento
3. Sistema cria assinatura com status 'trialing' (se houver trial) ou 'active'
4. Sistema cria primeira invoice
5. Sistema processa pagamento via Mercado Pago
6. Sistema confirma assinatura
7. Sistema dispara evento `subscription.created`

**Validações**:
- Cliente deve estar autenticado
- Plano deve estar ativo
- Método de pagamento deve ser válido

### 3. Renovar Assinatura

**Ator**: Sistema (cron job)

**Fluxo**:
1. Sistema identifica assinaturas próximas do fim do período
2. Sistema cria nova invoice para o próximo período
3. Sistema tenta cobrar método de pagamento padrão
4. Se sucesso: atualiza `currentPeriodStart` e `currentPeriodEnd`
5. Se falha: marca como `past_due` e agenda retry
6. Sistema dispara evento `subscription.renewed` ou `subscription.payment_failed`

**Retry Logic**:
- 1ª tentativa: imediatamente
- 2ª tentativa: após 3 dias
- 3ª tentativa: após 7 dias
- Após 3 falhas: marca como `unpaid` e suspende acesso

### 4. Cancelar Assinatura

**Ator**: Cliente ou Admin

**Fluxo**:
1. Cliente/Admin solicita cancelamento
2. Sistema oferece opções:
   - Cancelar imediatamente
   - Cancelar no fim do período atual
3. Sistema atualiza `cancelAt` ou `canceledAt`
4. Sistema mantém acesso até o fim do período (se cancelamento no fim)
5. Sistema dispara evento `subscription.canceled`

**Regras**:
- Cancelamento imediato: sem reembolso
- Cancelamento no fim: acesso mantido até `currentPeriodEnd`

### 5. Reativar Assinatura

**Ator**: Cliente

**Fluxo**:
1. Cliente solicita reativação de assinatura cancelada
2. Sistema verifica se assinatura pode ser reativada
3. Sistema remove `cancelAt`
4. Sistema atualiza status para `active`
5. Sistema dispara evento `subscription.reactivated`

**Validações**:
- Assinatura deve estar com `cancelAt` definido
- Período atual ainda não deve ter expirado

## APIs

### Admin APIs

```
POST   /admin/subscriptions/plans
GET    /admin/subscriptions/plans
GET    /admin/subscriptions/plans/:id
PATCH  /admin/subscriptions/plans/:id
DELETE /admin/subscriptions/plans/:id

GET    /admin/subscriptions
GET    /admin/subscriptions/:id
PATCH  /admin/subscriptions/:id
POST   /admin/subscriptions/:id/cancel
POST   /admin/subscriptions/:id/reactivate

GET    /admin/subscriptions/invoices
GET    /admin/subscriptions/invoices/:id
```

### Store APIs

```
GET    /store/subscriptions/plans
GET    /store/subscriptions/plans/:id

POST   /store/subscriptions
GET    /store/subscriptions
GET    /store/subscriptions/:id
POST   /store/subscriptions/:id/cancel
POST   /store/subscriptions/:id/reactivate

GET    /store/subscriptions/:id/invoices
GET    /store/subscriptions/invoices/:invoiceId
```

## Eventos

| Evento | Quando | Payload |
|--------|--------|---------|
| `subscription.created` | Assinatura criada | `{ subscription }` |
| `subscription.updated` | Assinatura atualizada | `{ subscription }` |
| `subscription.renewed` | Assinatura renovada | `{ subscription, invoice }` |
| `subscription.canceled` | Assinatura cancelada | `{ subscription }` |
| `subscription.reactivated` | Assinatura reativada | `{ subscription }` |
| `subscription.payment_failed` | Pagamento falhou | `{ subscription, invoice, error }` |
| `subscription.trial_ending` | Trial terminando (3 dias antes) | `{ subscription }` |

## Integrações

### Mercado Pago

- **Pagamentos recorrentes**: usar API de assinaturas do Mercado Pago
- **Webhooks**: receber notificações de pagamento
- **Retry automático**: configurar no Mercado Pago

### Access Control Module

- Subscription Module dispara eventos que Access Control Module escuta
- Access Control Module verifica status da assinatura para liberar acesso

## Migrations

```sql
-- Criar tabelas
CREATE TABLE subscription_plan (
  id VARCHAR PRIMARY KEY,
  name VARCHAR NOT NULL UNIQUE,
  description TEXT,
  price INTEGER NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'BRL',
  interval VARCHAR(20) NOT NULL,
  interval_count INTEGER NOT NULL DEFAULT 1,
  trial_days INTEGER,
  features JSONB NOT NULL DEFAULT '[]',
  tier VARCHAR(20) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  metadata JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE subscription (
  id VARCHAR PRIMARY KEY,
  customer_id VARCHAR NOT NULL,
  plan_id VARCHAR NOT NULL REFERENCES subscription_plan(id),
  status VARCHAR(20) NOT NULL,
  current_period_start TIMESTAMP NOT NULL,
  current_period_end TIMESTAMP NOT NULL,
  cancel_at TIMESTAMP,
  canceled_at TIMESTAMP,
  trial_start TIMESTAMP,
  trial_end TIMESTAMP,
  payment_method_id VARCHAR,
  metadata JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE subscription_invoice (
  id VARCHAR PRIMARY KEY,
  subscription_id VARCHAR NOT NULL REFERENCES subscription(id),
  customer_id VARCHAR NOT NULL,
  amount INTEGER NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'BRL',
  status VARCHAR(20) NOT NULL,
  period_start TIMESTAMP NOT NULL,
  period_end TIMESTAMP NOT NULL,
  due_date TIMESTAMP NOT NULL,
  paid_at TIMESTAMP,
  payment_intent_id VARCHAR,
  metadata JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_subscription_customer ON subscription(customer_id);
CREATE INDEX idx_subscription_status ON subscription(status);
CREATE INDEX idx_subscription_period_end ON subscription(current_period_end);
CREATE INDEX idx_invoice_subscription ON subscription_invoice(subscription_id);
CREATE INDEX idx_invoice_status ON subscription_invoice(status);
```

## Testes

### Casos de Teste

1. **Criar plano**: deve criar plano com dados válidos
2. **Validar plano**: deve rejeitar plano com preço negativo
3. **Assinar plano**: deve criar assinatura e invoice
4. **Renovar assinatura**: deve criar nova invoice e atualizar período
5. **Cancelar assinatura**: deve agendar cancelamento
6. **Reativar assinatura**: deve remover agendamento de cancelamento
7. **Pagamento falho**: deve marcar como past_due e agendar retry
8. **Trial**: deve criar assinatura com status trialing

## Próximos Passos

- [ ] Implementar entidades e migrations
- [ ] Implementar SubscriptionService
- [ ] Implementar APIs admin e store
- [ ] Integrar com Mercado Pago
- [ ] Implementar cron job de renovação
- [ ] Implementar webhooks
- [ ] Escrever testes
- [ ] Documentar APIs (OpenAPI/Swagger)
