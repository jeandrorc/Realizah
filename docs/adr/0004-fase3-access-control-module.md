# ADR 004: Fase 3 - Access Control Module

**Status:** Aceito  
**Data:** 2026-03-04  
**Decisores:** Equipe de Desenvolvimento  
**Contexto Técnico:** Implementação do módulo de controle de acesso

---

## Contexto

A Fase 3 do projeto Realizah focou na implementação do **Access Control Module**, um módulo core
responsável por controlar o acesso a features e recursos baseado no tier de assinatura do usuário
(Free/Pro/Premium).

Este módulo é fundamental para monetização da plataforma, permitindo que diferentes níveis de
assinatura tenham acesso a diferentes funcionalidades, além de suportar regras customizadas para
casos especiais (trials, promoções, suspensões).

---

## Decisões Técnicas

### 1. Modelo de Dados

**Decisão:** Três entidades principais: `Feature`, `AccessRule`, `CustomerAccess`

**Justificativa:**

- **Feature**: Representa funcionalidades controláveis
  - ID único para referência em código
  - `requiredTier`: tier mínimo necessário
  - `category`: agrupamento lógico (courses, tools, analytics, support)
  - `isActive`: permite desabilitar features temporariamente

- **AccessRule**: Regras customizadas de acesso
  - Suporta `allow` e `deny` actions
  - `priority`: resolve conflitos (maior = mais prioritário)
  - `expiresAt`: suporta acesso temporário
  - `customerId` e `tier` opcionais: permite regras globais ou específicas

- **CustomerAccess**: Cache de acesso do cliente
  - `currentTier`: tier atual baseado na assinatura
  - `features`: array de IDs de features disponíveis (cache)
  - `lastSyncedAt`: tracking de sincronização
  - Melhora performance evitando recálculos constantes

**Alternativas consideradas:**

- Usar apenas Feature + regras: rejeitado, cache é necessário para performance
- Incluir permissões granulares (CRUD): rejeitado, overkill para MVP

### 2. Hierarquia de Tiers

**Decisão:** Sistema hierárquico: `Premium > Pro > Free`

**Justificativa:**

- Tiers superiores herdam acesso dos inferiores
- Simplifica lógica: `if (currentTier >= requiredTier)`
- Facilita upsell: usuário vê o que ganha ao fazer upgrade

**Implementação:**

```typescript
private tierHierarchy: Record<Tier, number> = {
  free: 0,
  pro: 1,
  premium: 2,
};

private compareTier(tier1: Tier, tier2: Tier): number {
  return this.tierHierarchy[tier1] - this.tierHierarchy[tier2];
}
```

**Alternativas consideradas:**

- Tiers independentes: rejeitado, complica upsell e UX
- Múltiplas dimensões (features + limites): rejeitado, complexidade desnecessária

### 3. Lógica de Verificação de Acesso

**Decisão:** Algoritmo em camadas com prioridade de regras

**Fluxo:**

1. Buscar tier atual do cliente
2. Buscar feature e verificar se está ativa
3. Verificar se tier é suficiente
4. Se tier insuficiente, verificar regras `allow`
5. Se tier suficiente, verificar regras `deny`
6. Aplicar regra com maior prioridade

**Justificativa:**

- Flexibilidade: permite exceções em ambas direções
- Prioridade: resolve conflitos de forma determinística
- Performance: verifica tier antes de buscar regras

**Alternativas consideradas:**

- Apenas tier-based: rejeitado, não suporta casos especiais
- ACL complexo: rejeitado, overkill para casos de uso atuais

### 4. Integração com Subscription Module

**Decisão:** Event-driven via subscribers

**Eventos escutados:**

- `subscription.created` → atualizar tier para tier do plano
- `subscription.canceled` → downgrade para free
- `subscription.renewed` → manter tier
- `subscription.payment_failed` → manter tier temporariamente (grace period)

**Justificativa:**

- Desacoplamento: módulos não dependem diretamente um do outro
- Extensibilidade: fácil adicionar novos listeners
- Consistência: eventos garantem sincronização automática

**Alternativas consideradas:**

- Chamadas diretas entre serviços: rejeitado, cria acoplamento
- Polling: rejeitado, ineficiente e com lag

### 5. Cache de Acesso

**Decisão:** Tabela `customer_access` como cache

**Justificativa:**

- Performance: evita recalcular features a cada request
- Sincronização: atualizado via eventos de subscription
- Queries rápidas: acesso direto por `customerId`

**Estratégia de invalidação:**

- Atualizado quando subscription muda
- Atualizado quando regras são criadas/modificadas
- `lastSyncedAt` permite detectar dessincronia

**Alternativas consideradas:**

- Redis: rejeitado, adiciona dependência externa
- Sem cache: rejeitado, performance inaceitável
- Cache em memória: rejeitado, não persiste entre restarts

### 6. APIs

**Decisão:** Separação Admin vs Store com funcionalidades distintas

**Admin APIs:**

- CRUD completo de features
- CRUD completo de regras
- Visualizar acesso de qualquer cliente
- Grant/revoke access manualmente

**Store APIs:**

- Listar features ativas (sem CRUD)
- Validar acesso a feature específica
- Listar minhas features disponíveis
- Autorização: apenas próprio acesso

**Justificativa:**

- Segurança: clientes não podem manipular features/regras
- Simplicidade: Store APIs focadas em casos de uso do cliente
- Seguir padrão do Medusa v2

**Alternativas consideradas:**

- API única com roles: rejeitado, Medusa separa admin/store
- GraphQL: rejeitado, REST é padrão do Medusa

### 7. Features Padrão

**Decisão:** 16 features pré-definidas via seed script

**Distribuição:**

- **Free (3 features)**: cursos gratuitos, ferramentas básicas, suporte email
- **Pro (5 features)**: todos cursos, ferramentas avançadas, analytics básico, suporte prioritário,
  certificados
- **Premium (8 features)**: cursos exclusivos, ferramentas premium, analytics avançado, consultoria
  1-on-1, suporte 24/7, API access, white label

**Justificativa:**

- Demonstração: seed permite testar imediatamente
- Documentação: serve como exemplo de features
- Flexível: admin pode criar novas features dinamicamente

**Alternativas consideradas:**

- Hardcoded: rejeitado, inflexível
- Apenas via admin: rejeitado, dificulta onboarding

### 8. Regras Customizadas

**Decisão:** Suporte a regras com prioridade e expiração

**Casos de uso:**

- **Grant access temporário**: trial de feature premium para usuário free
- **Revoke access**: suspender acesso por violação de termos
- **Promoções**: liberar feature específica para grupo de usuários

**Prioridade:**

- Regras de deny: prioridade 200 (default)
- Regras de allow: prioridade 100 (default)
- Admin pode customizar prioridade

**Justificativa:**

- Flexibilidade: suporta casos de negócio diversos
- Controle: admin tem controle fino sobre acesso
- Temporalidade: suporta trials e promoções limitadas

**Alternativas consideradas:**

- Apenas tier-based: rejeitado, não suporta casos especiais
- Regras complexas (AND/OR): rejeitado, overkill para MVP

---

## Consequências

### Positivas

✅ **Controle de Acesso Funcional**

- Sistema completo de verificação de acesso
- Suporta hierarquia de tiers
- Regras customizadas para casos especiais

✅ **Integração com Subscriptions**

- Sincronização automática via eventos
- Tier atualizado quando subscription muda
- Downgrade automático ao cancelar

✅ **Performance**

- Cache de acesso por cliente
- Índices otimizados
- Queries eficientes

✅ **Flexibilidade**

- Admin pode criar features dinamicamente
- Regras customizadas com prioridade
- Suporta acesso temporário

✅ **APIs Prontas**

- Admin pode gerenciar features e regras
- Clientes podem validar acesso
- Integração fácil com frontend

### Negativas

⚠️ **Sem Middleware de Verificação**

- Verificação deve ser feita manualmente nas APIs
- **Mitigação:** Documentar padrão de uso, criar helpers

⚠️ **Cache Pode Dessincronizar**

- Se eventos falharem, cache fica desatualizado
- **Mitigação:** `lastSyncedAt` permite detectar, implementar job de sincronização

⚠️ **Sem Rate Limiting por Tier**

- Não há limites de uso (ex: 100 requests/dia)
- **Mitigação:** Implementar em fase futura se necessário

⚠️ **Sem Audit Log**

- Não há log de quem concedeu/revogou acesso
- **Mitigação:** Implementar em fase futura

---

## Riscos e Mitigações

| Risco                     | Impacto | Probabilidade | Mitigação                                      |
| ------------------------- | ------- | ------------- | ---------------------------------------------- |
| Cache dessincronizado     | Médio   | Baixa         | Implementar job de sincronização periódica     |
| Performance em escala     | Médio   | Baixa         | Índices implementados, considerar Redis futuro |
| Regras conflitantes       | Baixo   | Baixa         | Sistema de prioridade resolve conflitos        |
| Features mal configuradas | Médio   | Média         | Validação na criação, seed como exemplo        |

---

## Métricas de Sucesso

- ✅ 27 arquivos criados (models, services, APIs, subscribers, seed)
- ✅ Tipos compartilhados em `@realizah/types`
- ✅ Migration com 3 tabelas e 9 índices
- ✅ 11 endpoints REST (7 admin + 4 store)
- ✅ 4 subscribers para eventos de subscription
- ✅ Seed script com 16 features padrão
- ✅ Hierarquia de tiers implementada
- ✅ Sistema de regras com prioridade
- ✅ Cache de acesso por cliente
- ✅ Build passando sem erros
- ✅ Lint passando sem erros
- ✅ Commit com mensagem convencional

---

## Próximos Passos

1. **Middleware de Verificação**
   - Criar helper `requireFeature(featureId)`
   - Documentar padrão de uso em APIs

2. **Job de Sincronização**
   - Cron job para sincronizar cache periodicamente
   - Detectar e corrigir dessincronia

3. **Audit Log**
   - Registrar grant/revoke de acesso
   - Tracking de quem fez a ação

4. **Rate Limiting**
   - Limites de uso por tier (se necessário)
   - Tracking de consumo

5. **Fase 4: Course Module**
   - Integrar com Access Control
   - Verificar acesso antes de liberar conteúdo

---

## Referências

- [Especificação do Access Control Module](../specs/access-control-module.md)
- [ADR 003: Subscription Module](./0003-fase2-subscription-module.md)
- [Medusa v2 Events Documentation](https://docs.medusajs.com/v2/advanced-development/events)
- Commit: `d45ca41` - feat(access-control): implement access control module
