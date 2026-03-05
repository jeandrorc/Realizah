# 🤖 Exemplo Prático: Paralelização Mercado Pago

**Cenário:** Implementar integração completa do Mercado Pago  
**Estratégia:** Backend + Frontend em paralelo  
**Duração:** 3 dias (vs 5 dias sequencial)  
**Ganho:** 40% mais rápido

---

## 📋 Solicitação ao Cursor/Claude

### Opção 1: Comando Direto

```markdown
Preciso implementar o Mercado Pago em paralelo com 2 agentes:

**Agente Backend (você):** Implementar o backend completo do Mercado Pago:

- Branch: feature/mercado-pago-backend
- Criar módulo: apps/medusa/src/modules/mercado-pago/
- Implementar MercadoPagoService (PIX, cartão, boleto)
- Criar APIs: POST /checkout/pix, /checkout/card, /checkout/boleto
- Implementar webhooks: POST /webhooks/mercadopago
- Integrar com SubscriptionModule e DigitalDeliveryModule
- Testes com sandbox
- Duração: 3 dias

**Agente Frontend (novo agente):** Implementar o frontend completo do checkout:

- Branch: feature/mercado-pago-frontend
- Criar páginas: /checkout, /checkout/success, /checkout/error
- Implementar seleção de método de pagamento
- Criar formulário de cartão (com validação)
- Implementar QR Code PIX (com polling)
- Adicionar loading states e error handling
- Integração com APIs do backend (usar mock enquanto backend não está pronto)
- Duração: 3 dias

**Sincronização:**

- Dia 1 EOD: Status de ambos
- Dia 2 EOD: Status de ambos
- Dia 3 EOD: Ambos fazem commit e push
- Dia 4: Merge backend → develop
- Dia 4: Merge frontend → develop
- Dia 4: Testes de integração completos

Pode começar com o backend agora?
```

---

### Opção 2: Template Estruturado

```markdown
## 🤖 Solicitação de Agentes Paralelos - Mercado Pago

### Contexto

Precisamos implementar a integração completa do Mercado Pago (PIX, cartão, boleto) com assinaturas
recorrentes. O backend e frontend podem ser desenvolvidos em paralelo pois são áreas completamente
separadas do código.

---

### Agente 1: Backend (MercadoJS)

**Branch:** `feature/mercado-pago-backend`

**Arquivos que serão modificados:**

- `apps/medusa/src/modules/mercado-pago/*` (novo)
- `packages/types/src/mercado-pago.ts` (novo)
- `apps/medusa/package.json` (adicionar SDK)

**Tarefas:**

1. **Dia 1: Setup e Estrutura**
   - [ ] Criar branch feature/mercado-pago-backend
   - [ ] Instalar SDK: `pnpm add mercadopago`
   - [ ] Criar estrutura: models/, services/, api/, webhooks/
   - [ ] Criar tipos em @realizah/types
   - [ ] Configurar credenciais sandbox

2. **Dia 2: Checkout PIX e Cartão**
   - [ ] Implementar MercadoPagoService
   - [ ] Criar endpoint POST /checkout/pix
   - [ ] Criar endpoint POST /checkout/card
   - [ ] Implementar tokenização de cartão
   - [ ] Testes com sandbox

3. **Dia 3: Boleto, Assinaturas e Webhooks**
   - [ ] Criar endpoint POST /checkout/boleto
   - [ ] Implementar assinaturas recorrentes
   - [ ] Criar webhook POST /webhooks/mercadopago
   - [ ] Integrar com SubscriptionModule
   - [ ] Integrar com DigitalDeliveryModule
   - [ ] Testes finais
   - [ ] Commit e push

**Entregas:**

- ✅ MercadoPagoService completo
- ✅ 3 endpoints de checkout funcionando
- ✅ Webhooks processando eventos
- ✅ Integração com módulos existentes
- ✅ Testes com sandbox passando

**Duração:** 3 dias

---

### Agente 2: Frontend (Next.js)

**Branch:** `feature/mercado-pago-frontend`

**Arquivos que serão modificados:**

- `apps/storefront/src/app/(checkout)/*` (novo)
- `apps/storefront/src/components/checkout/*` (novo)
- `apps/storefront/src/lib/api/mercado-pago.ts` (novo)

**Tarefas:**

1. **Dia 1: Setup e Layout**
   - [ ] Criar branch feature/mercado-pago-frontend
   - [ ] Criar páginas: /checkout, /checkout/success, /checkout/error
   - [ ] Criar layout de checkout
   - [ ] Criar componente de seleção de método
   - [ ] Criar mocks das APIs (enquanto backend não está pronto)

2. **Dia 2: Formulários PIX e Cartão**
   - [ ] Implementar formulário de cartão
   - [ ] Adicionar validação de cartão (Luhn algorithm)
   - [ ] Implementar QR Code PIX
   - [ ] Adicionar polling de status PIX
   - [ ] Loading states

3. **Dia 3: Boleto e Finalização**
   - [ ] Implementar geração de boleto
   - [ ] Adicionar error handling
   - [ ] Integrar com APIs reais (backend pronto)
   - [ ] Testes E2E
   - [ ] Commit e push

**Entregas:**

- ✅ Páginas de checkout completas
- ✅ Formulários funcionando
- ✅ QR Code PIX com polling
- ✅ Error handling robusto
- ✅ Testes E2E passando

**Duração:** 3 dias

---

### Dependências entre Agentes

**Dia 1-2:** Frontend usa **mocks** das APIs  
**Dia 3:** Frontend integra com APIs **reais** do backend

**Comunicação:**

- Backend documenta APIs em README.md
- Frontend consulta documentação para integração

---

### Critérios de Sucesso

**Backend:**

- [ ] Checkout PIX funcionando no sandbox
- [ ] Checkout cartão funcionando no sandbox
- [ ] Checkout boleto funcionando no sandbox
- [ ] Webhooks recebendo e processando eventos
- [ ] Assinaturas sendo renovadas automaticamente

**Frontend:**

- [ ] Usuário consegue selecionar método de pagamento
- [ ] Formulário de cartão valida corretamente
- [ ] QR Code PIX é exibido e atualiza status
- [ ] Boleto é gerado e exibido
- [ ] Erros são tratados e exibidos ao usuário

**Integração:**

- [ ] Frontend + Backend funcionam juntos
- [ ] Fluxo completo de checkout funciona
- [ ] Webhooks atualizam status no frontend

---

### Plano de Merge

**Dia 4 - Manhã:**

1. Merge backend → develop
2. Resolver conflitos (se houver)
3. Rodar testes backend

**Dia 4 - Tarde:**

1. Merge frontend → develop
2. Resolver conflitos (se houver)
3. Rodar testes E2E

**Dia 4 - Noite:**

1. Testes de integração completos
2. Smoke tests em staging

---

Por favor, inicie com o Agente 1 (Backend).
```

---

## 📞 Como Solicitar no Chat

### Exemplo 1: Início Imediato

```
Você: Vou paralelizar o Mercado Pago. Você faz o backend,
      vou criar outro agente para o frontend. Pode começar?

Agente: ✅ Entendido! Vou implementar o backend do Mercado Pago.
        Branch: feature/mercado-pago-backend
        Não vou tocar em: apps/storefront/*
        Iniciando...
```

---

### Exemplo 2: Com Validação

```
Você: Quero paralelizar o Mercado Pago (backend + frontend).
      Faz sentido ou há dependências que impedem?

Agente: ✅ Faz sentido! Backend e frontend são independentes.

        Recomendação:
        - Backend primeiro (você)
        - Frontend depois (outro agente) usando mocks inicialmente
        - Sincronização no Dia 3

        Posso começar com o backend?

Você: Sim, pode começar!
```

---

### Exemplo 3: Com Múltiplos Agentes

```
Você: Preciso de 3 agentes paralelos:
      1. Backend Mercado Pago
      2. Frontend Checkout
      3. Testes E2E

      Pode ser o Agente 1 (Backend)?

Agente 1: ✅ Sou o Agente Backend. Iniciando...

[Você abre nova conversa]

Você: Você é o Agente 2 (Frontend). O Agente 1 está fazendo
      o backend. Você faz o frontend usando mocks inicialmente.
      Pode começar?

Agente 2: ✅ Sou o Agente Frontend. Iniciando...

[Você abre nova conversa]

Você: Você é o Agente 3 (Testes). Os Agentes 1 e 2 estão
      implementando. Você cria os testes E2E. Pode começar?

Agente 3: ✅ Sou o Agente Tester. Iniciando...
```

---

## ✅ Checklist de Validação

Antes de solicitar paralelização, valide:

```markdown
- [x] Backend e Frontend são independentes? SIM
- [x] Arquivos diferentes? SIM (apps/medusa vs apps/storefront)
- [x] Contexto suficiente? SIM (specs, ADRs, exemplos)
- [x] Plano de sincronização? SIM (Dia 3 merge)
- [x] Orquestrador definido? SIM (você)
- [x] Ganho de tempo justifica? SIM (40% mais rápido)

✅ PODE PARALELIZAR
```

---

## 📊 Comparação: Sequencial vs Paralelo

### Sequencial (Atual)

```
Dia 1-3: Backend
Dia 4-6: Frontend
Dia 7:   Testes integração
Total:   7 dias
```

### Paralelo (Proposto)

```
Dia 1-3: Backend + Frontend (simultâneo)
Dia 4:   Merge + Testes integração
Total:   4 dias

Ganho: 3 dias (43% mais rápido)
```

---

## 🎯 Resultado Esperado

**Após 4 dias:**

- ✅ Backend completo (PIX, cartão, boleto, webhooks)
- ✅ Frontend completo (checkout, formulários, QR Code)
- ✅ Integração funcionando
- ✅ Testes passando
- ✅ Pronto para produção

**vs Sequencial (7 dias):**

- 🟢 Economia de 3 dias
- 🟢 Mesma qualidade
- 🟢 Menor time-to-market

---

## 📝 Template de Solicitação Rápida

```markdown
Paralelizar Mercado Pago:

Agente Backend (você):

- Backend completo (3 dias)
- Branch: feature/mercado-pago-backend

Agente Frontend (novo):

- Frontend completo (3 dias)
- Branch: feature/mercado-pago-frontend

Sincronização: Dia 4

Pode começar com backend?
```

---

**Última atualização:** 2026-03-05  
**Status:** Template pronto para uso
