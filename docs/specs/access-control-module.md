# Access Control Module — Especificação Técnica

Módulo responsável pelo controle de acesso por tier (Free/Pro/Premium) e gestão de permissões baseadas em assinatura.

## Visão Geral

O Access Control Module determina quais recursos e funcionalidades um usuário pode acessar baseado no seu tier de assinatura.

## Entidades

### Feature

Representa uma funcionalidade ou recurso que pode ser controlado por tier.

```typescript
interface Feature {
  id: string;                    // Identificador único (ex: feat_advanced_analytics)
  name: string;                  // Nome da feature (ex: "Advanced Analytics")
  description?: string;          // Descrição da feature
  category: string;              // Categoria (ex: "analytics", "courses", "tools")
  requiredTier: Tier;            // Tier mínimo necessário
  isActive: boolean;             // Se a feature está ativa
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

type Tier = 'free' | 'pro' | 'premium';
```

### AccessRule

Representa uma regra de acesso customizada.

```typescript
interface AccessRule {
  id: string;
  featureId: string;
  customerId?: string;           // Se null, aplica a todos
  tier?: Tier;                   // Se null, aplica a todos tiers
  action: 'allow' | 'deny';      // Permitir ou negar
  priority: number;              // Prioridade (maior = mais prioritário)
  expiresAt?: Date;              // Data de expiração da regra
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}
```

### CustomerAccess

Cache do nível de acesso atual de um cliente.

```typescript
interface CustomerAccess {
  customerId: string;
  currentTier: Tier;
  subscriptionId?: string;
  subscriptionStatus?: string;
  features: string[];            // IDs das features disponíveis
  lastSyncedAt: Date;
  expiresAt?: Date;              // Quando o acesso expira
}
```

## Hierarquia de Tiers

```
Premium > Pro > Free
```

- **Free**: acesso básico
- **Pro**: todas as features do Free + features Pro
- **Premium**: todas as features do Pro + features Premium

## Casos de Uso

### 1. Verificar Acesso a Feature

**Ator**: Sistema

**Fluxo**:
1. Sistema recebe requisição de acesso a feature
2. Sistema busca tier atual do cliente
3. Sistema busca feature e seu `requiredTier`
4. Sistema verifica se `currentTier >= requiredTier`
5. Sistema verifica regras customizadas (se houver)
6. Sistema retorna `allowed: boolean`

**Lógica de Decisão**:
```typescript
function hasAccess(customerId: string, featureId: string): boolean {
  // 1. Buscar tier do cliente
  const customerTier = getCustomerTier(customerId);
  
  // 2. Buscar feature
  const feature = getFeature(featureId);
  
  // 3. Verificar tier
  if (compareTier(customerTier, feature.requiredTier) < 0) {
    return false; // Tier insuficiente
  }
  
  // 4. Verificar regras customizadas (por prioridade)
  const rules = getAccessRules(customerId, featureId);
  for (const rule of rules.sort((a, b) => b.priority - a.priority)) {
    if (rule.action === 'deny') return false;
    if (rule.action === 'allow') return true;
  }
  
  // 5. Permitir se tier suficiente
  return true;
}
```

### 2. Atualizar Acesso após Mudança de Assinatura

**Ator**: Sistema (via evento)

**Fluxo**:
1. Sistema escuta evento `subscription.created` ou `subscription.updated`
2. Sistema busca tier do plano da assinatura
3. Sistema atualiza `CustomerAccess` com novo tier
4. Sistema recalcula features disponíveis
5. Sistema atualiza cache
6. Sistema dispara evento `access.updated`

**Eventos Escutados**:
- `subscription.created` → atualizar tier
- `subscription.canceled` → downgrade para free
- `subscription.renewed` → manter tier
- `subscription.payment_failed` → manter tier temporariamente

### 3. Conceder Acesso Temporário

**Ator**: Admin

**Fluxo**:
1. Admin seleciona cliente e feature
2. Admin define duração do acesso
3. Sistema cria `AccessRule` com `action: 'allow'` e `expiresAt`
4. Sistema atualiza cache de acesso do cliente
5. Sistema dispara evento `access.granted`

**Uso**: trials, promoções, acesso beta

### 4. Revogar Acesso

**Ator**: Admin

**Fluxo**:
1. Admin seleciona cliente e feature
2. Sistema cria `AccessRule` com `action: 'deny'` e prioridade alta
3. Sistema atualiza cache de acesso do cliente
4. Sistema dispara evento `access.revoked`

**Uso**: suspensões, violações de termos

### 5. Listar Features Disponíveis

**Ator**: Cliente

**Fluxo**:
1. Cliente solicita lista de features
2. Sistema busca tier do cliente
3. Sistema filtra features por tier
4. Sistema aplica regras customizadas
5. Sistema retorna lista de features com status de acesso

**Resposta**:
```typescript
interface FeatureAccess {
  feature: Feature;
  hasAccess: boolean;
  reason?: string; // "tier_insufficient" | "custom_rule" | "subscription_expired"
}
```

## APIs

### Admin APIs

```
POST   /admin/access/features
GET    /admin/access/features
GET    /admin/access/features/:id
PATCH  /admin/access/features/:id
DELETE /admin/access/features/:id

POST   /admin/access/rules
GET    /admin/access/rules
GET    /admin/access/rules/:id
PATCH  /admin/access/rules/:id
DELETE /admin/access/rules/:id

GET    /admin/access/customers/:customerId
POST   /admin/access/customers/:customerId/grant
POST   /admin/access/customers/:customerId/revoke
```

### Store APIs

```
GET    /store/access/features
GET    /store/access/features/:id
POST   /store/access/validate
GET    /store/access/my-features
```

## Eventos

| Evento | Quando | Payload |
|--------|--------|---------|
| `access.updated` | Acesso do cliente atualizado | `{ customerId, tier, features }` |
| `access.granted` | Acesso concedido manualmente | `{ customerId, featureId, expiresAt }` |
| `access.revoked` | Acesso revogado | `{ customerId, featureId, reason }` |
| `access.expired` | Acesso temporário expirou | `{ customerId, featureId }` |

## Integrações

### Subscription Module

Access Control Module escuta eventos do Subscription Module:

```typescript
// Quando assinatura é criada/atualizada
subscriptionService.on('subscription.created', async (subscription) => {
  const plan = await getPlan(subscription.planId);
  await accessControlService.updateCustomerTier(
    subscription.customerId,
    plan.tier
  );
});

// Quando assinatura é cancelada
subscriptionService.on('subscription.canceled', async (subscription) => {
  await accessControlService.updateCustomerTier(
    subscription.customerId,
    'free'
  );
});
```

### Course Module

Course Module verifica acesso antes de liberar conteúdo:

```typescript
async function accessLesson(customerId: string, lessonId: string) {
  const lesson = await getLesson(lessonId);
  const hasAccess = await accessControlService.hasAccess(
    customerId,
    lesson.featureId
  );
  
  if (!hasAccess) {
    throw new ForbiddenError('Upgrade to Pro to access this lesson');
  }
  
  return lesson;
}
```

## Migrations

```sql
-- Criar tabelas
CREATE TABLE feature (
  id VARCHAR PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL,
  required_tier VARCHAR(20) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  metadata JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE access_rule (
  id VARCHAR PRIMARY KEY,
  feature_id VARCHAR NOT NULL REFERENCES feature(id),
  customer_id VARCHAR,
  tier VARCHAR(20),
  action VARCHAR(10) NOT NULL CHECK (action IN ('allow', 'deny')),
  priority INTEGER NOT NULL DEFAULT 0,
  expires_at TIMESTAMP,
  metadata JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE customer_access (
  customer_id VARCHAR PRIMARY KEY,
  current_tier VARCHAR(20) NOT NULL,
  subscription_id VARCHAR,
  subscription_status VARCHAR(20),
  features JSONB NOT NULL DEFAULT '[]',
  last_synced_at TIMESTAMP NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMP
);

-- Índices
CREATE INDEX idx_feature_tier ON feature(required_tier);
CREATE INDEX idx_feature_category ON feature(category);
CREATE INDEX idx_rule_feature ON access_rule(feature_id);
CREATE INDEX idx_rule_customer ON access_rule(customer_id);
CREATE INDEX idx_rule_priority ON access_rule(priority DESC);
CREATE INDEX idx_customer_access_tier ON customer_access(current_tier);
```

## Features Padrão

### Free Tier

- Acesso a cursos gratuitos
- Limite de 3 cursos simultâneos
- Ferramentas básicas
- Suporte via email

### Pro Tier

- Todos os cursos
- Cursos ilimitados
- Ferramentas avançadas
- Analytics básico
- Suporte prioritário

### Premium Tier

- Tudo do Pro
- Cursos exclusivos
- Ferramentas premium
- Analytics avançado
- Consultoria 1-on-1
- Suporte 24/7

## Middleware de Verificação

```typescript
// Middleware Express/Next.js
function requireFeature(featureId: string) {
  return async (req, res, next) => {
    const customerId = req.user.id;
    const hasAccess = await accessControlService.hasAccess(
      customerId,
      featureId
    );
    
    if (!hasAccess) {
      return res.status(403).json({
        error: 'FORBIDDEN',
        message: 'Upgrade your plan to access this feature',
        featureId,
      });
    }
    
    next();
  };
}

// Uso
app.get('/api/analytics/advanced', 
  requireFeature('feat_advanced_analytics'),
  analyticsController.getAdvanced
);
```

## Testes

### Casos de Teste

1. **Verificar acesso**: deve permitir acesso se tier suficiente
2. **Verificar acesso**: deve negar acesso se tier insuficiente
3. **Regra customizada**: deve permitir acesso mesmo com tier insuficiente
4. **Regra customizada**: deve negar acesso mesmo com tier suficiente
5. **Prioridade**: regra com maior prioridade deve prevalecer
6. **Expiração**: regra expirada não deve ser aplicada
7. **Atualização**: deve atualizar tier quando assinatura muda
8. **Downgrade**: deve remover features ao cancelar assinatura

## Próximos Passos

- [ ] Implementar entidades e migrations
- [ ] Implementar AccessControlService
- [ ] Implementar APIs admin e store
- [ ] Implementar listeners de eventos de assinatura
- [ ] Implementar middleware de verificação
- [ ] Criar features padrão (seed)
- [ ] Implementar cache (Redis)
- [ ] Escrever testes
- [ ] Documentar APIs
