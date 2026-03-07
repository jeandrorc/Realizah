# Fase 5 — Integração Mercado Pago Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan
> task-by-task.

---

## ⚠️ Blocker Atual (2026-03-06)

### Progresso da Ordem Recomendada

| Etapa                | Status | Detalhes                                                                         |
| -------------------- | ------ | -------------------------------------------------------------------------------- |
| 1. Corrigir config   | ✅     | Mercado Pago registrado como **provider** do Payment Module (não módulo de topo) |
| 2. Atualizar Medusa  | ✅     | `^2.7.1` → 2.13.3 (framework, medusa, types, utils)                              |
| 3. Migrations        | ✅     | `pnpm --filter medusa db:migrate` — schema atualizado (deleted_at, links)        |
| 4. Mercado Pago path | ✅     | Extraído para `packages/mercadopago-provider`; config usa path.resolve           |
| 5. Medusa dev        | ✅     | Desbloqueado — moduleResolution + exclude \_api_disabled                         |

### Bloqueadores Resolvidos

**A) Mercado Pago Provider** ✅ — Extraído para `packages/mercadopago-provider`, config usa
`path.resolve`

**B) API Routes Loader**

- **Erro:** `Cannot read properties of undefined (reading 'def')` (Zod) ou
  `Cannot find module '@medusajs/framework/http'` (TS)
- **Causa:** (1) Conflito Zod v3 vs v4 em monorepo pnpm; (2) `moduleResolution: "node"` não resolve
  subpath exports
- **Correções aplicadas:**
  - `pnpm.overrides`: `@medusajs/deps>zod` e `medusa>zod` → 3.25.76
  - `packages/tsconfig/medusa.json`: `moduleResolution` → `node16`
  - `apps/medusa/tsconfig.json`: exclude `src/_api_disabled`
- **Status:** ✅ Resolvido — `pnpm --filter medusa dev` sobe com sucesso (Server ready on port 9000)

**C) Dashboard / Draft Order** — Medusa dev sobe com sucesso; draft-order carregado

### Status Atual

- **Módulo Mercado Pago:** `packages/mercadopago-provider` ativo em `medusa-config.js`
- **Rotas customizadas:** Em `_api_disabled/` (admin, store: courses, subscriptions, payments,
  webhooks) — pendente restaurar

### Próximos Passos (Ordem Recomendada)

1. ~~**Desbloquear Medusa dev**~~ ✅
2. ~~**Reativar Mercado Pago**~~ ✅ via `@realizah/mercadopago-provider`
3. **Restaurar rotas** (pendente)
   - Mover de `_api_disabled/` para `api/` quando build config resolver @realizah/types
   - Corrigir erros TS (accessControlService unknown, etc.)

---

**Goal:** Implementar provider de pagamentos Mercado Pago no Medusa v2, cobrindo PIX, cartão de
crédito, boleto e assinaturas recorrentes (preapproval).

**Architecture:** Criar um Medusa Payment Provider customizado (`mercadopago-provider`) dentro de
`apps/medusa/src/modules/mercadopago/`. O provider implementa a interface `AbstractPaymentProvider`
do Medusa, delegando ao SDK oficial `mercadopago@2.x`. Webhooks são recebidos num endpoint dedicado
`/store/webhooks/mercadopago` e processam eventos de pagamento. A integração com o Subscription
Module é feita via eventos Medusa existentes.

**Tech Stack:** `mercadopago@2.x` SDK, Medusa v2 `AbstractPaymentProvider`, TypeScript strict,
Medusa webhooks, pnpm

---

## Estrutura de Arquivos a Criar

```
apps/medusa/src/modules/mercadopago/
├── index.ts                        # Module registration
├── service.ts                      # MercadoPagoProviderService (AbstractPaymentProvider)
├── types.ts                        # Tipos internos do provider
└── utils.ts                        # Helpers (status mapping, etc.)

apps/medusa/src/api/store/webhooks/
└── mercadopago/
    └── route.ts                    # POST /store/webhooks/mercadopago

docs/adr/
└── 0007-fase5-mercado-pago.md      # ADR da fase
```

## Arquivos a Modificar

```
apps/medusa/medusa-config.ts        # Registrar payment provider
apps/medusa/.env.example            # Adicionar vars Mercado Pago
apps/medusa/package.json            # Adicionar dependência mercadopago
docs/ROADMAP.md                     # Atualizar status fase 5
docs/STATUS_REPORT.md               # Atualizar status
CHANGELOG.md                        # Adicionar entry v0.6.0
```

---

## Referências

- [Medusa v2 Payment Provider](https://docs.medusajs.com/resources/commerce-modules/payment/payment-provider)
- [Mercado Pago SDK v2](https://github.com/mercadopago/sdk-nodejs)
- [Mercado Pago Webhooks](https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/webhooks)
- `apps/medusa/src/modules/subscription/` — padrão de módulo existente

---

## Task 1: Setup — Branch e Dependência

**Files:**

- Modify: `apps/medusa/package.json`
- Modify: `apps/medusa/.env.example` (criar se não existir)

**Step 1: Verificar branch**

```bash
git branch
# esperado: * feature/fase5-mercado-pago
```

**Step 2: Instalar dependência**

```bash
pnpm --filter medusa add mercadopago
```

Esperado: `mercadopago@2.12.0` adicionado ao `package.json` do medusa.

**Step 3: Criar/atualizar `.env.example`**

Adicionar ao final de `apps/medusa/.env.example`:

```env
# Mercado Pago
MERCADOPAGO_ACCESS_TOKEN=TEST-xxxxxxxxxxxx
MERCADOPAGO_PUBLIC_KEY=TEST-xxxxxxxxxxxx
MERCADOPAGO_WEBHOOK_SECRET=your-webhook-secret
MERCADOPAGO_SANDBOX=true
```

**Step 4: Commit**

```bash
git add apps/medusa/package.json apps/medusa/.env.example
git commit -m "chore(payment): add mercadopago SDK dependency"
```

---

## Task 2: Tipos e Utilitários do Provider

**Files:**

- Create: `apps/medusa/src/modules/mercadopago/types.ts`
- Create: `apps/medusa/src/modules/mercadopago/utils.ts`

**Step 1: Criar `types.ts`**

```typescript
// apps/medusa/src/modules/mercadopago/types.ts

export type MercadoPagoPaymentMethodType = 'pix' | 'credit_card' | 'boleto';

export interface MercadoPagoProviderOptions {
  accessToken: string;
  webhookSecret?: string;
  sandbox?: boolean;
}

export interface MercadoPagoPaymentData {
  mpPaymentId?: string;
  mpPreferenceId?: string;
  paymentMethodType?: MercadoPagoPaymentMethodType;
  pixQrCode?: string;
  pixQrCodeBase64?: string;
  boletoUrl?: string;
  boletoBarcode?: string;
  externalReference?: string;
  status?: string;
}

export interface MercadoPagoWebhookPayload {
  id: string;
  live_mode: boolean;
  type: string;
  date_created: string;
  application_id: string;
  user_id: string;
  version: number;
  api_version: string;
  action: string;
  data: {
    id: string;
  };
}
```

**Step 2: Criar `utils.ts`**

```typescript
// apps/medusa/src/modules/mercadopago/utils.ts

export function mapMercadoPagoStatusToMedusa(
  mpStatus: string,
): 'authorized' | 'captured' | 'pending' | 'requires_more' | 'error' | 'canceled' {
  const statusMap: Record<
    string,
    'authorized' | 'captured' | 'pending' | 'requires_more' | 'error' | 'canceled'
  > = {
    approved: 'captured',
    authorized: 'authorized',
    in_process: 'pending',
    in_mediation: 'requires_more',
    rejected: 'error',
    cancelled: 'canceled',
    refunded: 'canceled',
    charged_back: 'canceled',
    pending: 'pending',
  };
  return statusMap[mpStatus] ?? 'error';
}

export function generateExternalReference(cartId: string): string {
  return `realizah_${cartId}_${Date.now()}`;
}

export function parsePriceToMercadoPago(amountInCents: number): number {
  return amountInCents / 100;
}
```

**Step 3: Commit**

```bash
git add apps/medusa/src/modules/mercadopago/
git commit -m "feat(payment): add mercadopago types and utils"
```

---

## Task 3: MercadoPagoProviderService

**Files:**

- Create: `apps/medusa/src/modules/mercadopago/service.ts`

Este é o coração da integração. Implementa `AbstractPaymentProvider`.

**Step 1: Criar `service.ts`**

```typescript
// apps/medusa/src/modules/mercadopago/service.ts
import {
  AbstractPaymentProvider,
  PaymentProviderError,
  PaymentProviderSessionResponse,
} from '@medusajs/framework/utils';
import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';
import type {
  CreatePaymentProviderSession,
  UpdatePaymentProviderSession,
  ProviderWebhookPayload,
  WebhookActionResult,
  PaymentSessionStatus,
} from '@medusajs/framework/types';
import {
  MercadoPagoProviderOptions,
  MercadoPagoPaymentData,
  MercadoPagoWebhookPayload,
} from './types';
import {
  mapMercadoPagoStatusToMedusa,
  generateExternalReference,
  parsePriceToMercadoPago,
} from './utils';

export default class MercadoPagoProviderService extends AbstractPaymentProvider<MercadoPagoProviderOptions> {
  static identifier = 'mercadopago';

  private mpConfig: MercadoPagoConfig;
  private webhookSecret: string;

  constructor(container: Record<string, unknown>, options: MercadoPagoProviderOptions) {
    super(container, options);

    this.mpConfig = new MercadoPagoConfig({
      accessToken: options.accessToken,
      options: { timeout: 5000 },
    });

    this.webhookSecret = options.webhookSecret ?? '';
  }

  async initiatePayment(
    input: CreatePaymentProviderSession,
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse> {
    const { amount, currency_code, context } = input;
    const { payment_description, session_id } = context ?? {};
    const paymentMethodType = (context?.payment_method_type as string) ?? 'pix';

    try {
      const preference = new Preference(this.mpConfig);
      const externalReference = generateExternalReference(session_id ?? 'unknown');

      const preferenceData = await preference.create({
        body: {
          items: [
            {
              id: session_id ?? 'item',
              title: (payment_description as string) ?? 'Realizah - Pagamento',
              quantity: 1,
              unit_price: parsePriceToMercadoPago(amount),
              currency_id: currency_code?.toUpperCase() ?? 'BRL',
            },
          ],
          external_reference: externalReference,
          payment_methods: this.getPaymentMethodsConfig(paymentMethodType),
          notification_url: process.env.MERCADOPAGO_WEBHOOK_URL,
        },
      });

      return {
        id: preferenceData.id ?? session_id ?? '',
        data: {
          mpPreferenceId: preferenceData.id,
          externalReference,
          paymentMethodType,
          status: 'pending',
        } as MercadoPagoPaymentData,
      };
    } catch (error) {
      return {
        error: 'Failed to initiate Mercado Pago payment',
        code: 'MP_INITIATE_ERROR',
        detail: error,
      };
    }
  }

  async authorizePayment(
    paymentSessionData: Record<string, unknown>,
  ): Promise<
    PaymentProviderError | { status: PaymentSessionStatus; data: Record<string, unknown> }
  > {
    const data = paymentSessionData as MercadoPagoPaymentData;

    if (!data.mpPaymentId) {
      return { status: 'pending', data: paymentSessionData };
    }

    try {
      const payment = new Payment(this.mpConfig);
      const mpPayment = await payment.get({ id: data.mpPaymentId });
      const status = mapMercadoPagoStatusToMedusa(mpPayment.status ?? 'pending');

      return {
        status,
        data: {
          ...data,
          status: mpPayment.status,
        },
      };
    } catch (error) {
      return {
        error: 'Failed to authorize Mercado Pago payment',
        code: 'MP_AUTHORIZE_ERROR',
        detail: error,
      };
    }
  }

  async capturePayment(
    paymentSessionData: Record<string, unknown>,
  ): Promise<PaymentProviderError | Record<string, unknown>> {
    const data = paymentSessionData as MercadoPagoPaymentData;

    if (!data.mpPaymentId) {
      return { ...data, captured: false };
    }

    try {
      const payment = new Payment(this.mpConfig);
      const mpPayment = await payment.get({ id: data.mpPaymentId });

      if (mpPayment.status === 'approved') {
        return { ...data, captured: true };
      }

      return { ...data, captured: false, status: mpPayment.status };
    } catch (error) {
      return {
        error: 'Failed to capture Mercado Pago payment',
        code: 'MP_CAPTURE_ERROR',
        detail: error,
      };
    }
  }

  async cancelPayment(
    paymentSessionData: Record<string, unknown>,
  ): Promise<PaymentProviderError | Record<string, unknown>> {
    const data = paymentSessionData as MercadoPagoPaymentData;

    if (!data.mpPaymentId) {
      return data;
    }

    try {
      const payment = new Payment(this.mpConfig);
      await payment.cancel({ id: data.mpPaymentId });
      return { ...data, status: 'cancelled' };
    } catch (error) {
      return {
        error: 'Failed to cancel Mercado Pago payment',
        code: 'MP_CANCEL_ERROR',
        detail: error,
      };
    }
  }

  async refundPayment(
    paymentSessionData: Record<string, unknown>,
    refundAmount?: number,
  ): Promise<PaymentProviderError | Record<string, unknown>> {
    const data = paymentSessionData as MercadoPagoPaymentData;

    if (!data.mpPaymentId) {
      return {
        error: 'No payment ID found for refund',
        code: 'MP_NO_PAYMENT_ID',
        detail: 'mpPaymentId is required for refund',
      };
    }

    try {
      const payment = new Payment(this.mpConfig);
      await payment.refund({
        payment_id: data.mpPaymentId,
        body: refundAmount ? { amount: parsePriceToMercadoPago(refundAmount) } : undefined,
      });
      return { ...data, refunded: true };
    } catch (error) {
      return {
        error: 'Failed to refund Mercado Pago payment',
        code: 'MP_REFUND_ERROR',
        detail: error,
      };
    }
  }

  async retrievePayment(
    paymentSessionData: Record<string, unknown>,
  ): Promise<PaymentProviderError | Record<string, unknown>> {
    const data = paymentSessionData as MercadoPagoPaymentData;

    if (!data.mpPaymentId) {
      return data;
    }

    try {
      const payment = new Payment(this.mpConfig);
      const mpPayment = await payment.get({ id: data.mpPaymentId });
      return {
        ...data,
        status: mpPayment.status,
        mpPayment,
      };
    } catch (error) {
      return {
        error: 'Failed to retrieve Mercado Pago payment',
        code: 'MP_RETRIEVE_ERROR',
        detail: error,
      };
    }
  }

  async updatePayment(
    input: UpdatePaymentProviderSession,
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse> {
    return this.initiatePayment(input);
  }

  async getPaymentStatus(
    paymentSessionData: Record<string, unknown>,
  ): Promise<PaymentSessionStatus> {
    const data = paymentSessionData as MercadoPagoPaymentData;

    if (!data.mpPaymentId) {
      return 'pending';
    }

    try {
      const payment = new Payment(this.mpConfig);
      const mpPayment = await payment.get({ id: data.mpPaymentId });
      return mapMercadoPagoStatusToMedusa(mpPayment.status ?? 'pending');
    } catch {
      return 'error';
    }
  }

  async getWebhookActionAndData(webhookData: ProviderWebhookPayload): Promise<WebhookActionResult> {
    const payload = webhookData.data as MercadoPagoWebhookPayload;

    if (payload.type !== 'payment') {
      return { action: 'not_supported' };
    }

    try {
      const payment = new Payment(this.mpConfig);
      const mpPayment = await payment.get({ id: payload.data.id });
      const status = mapMercadoPagoStatusToMedusa(mpPayment.status ?? 'pending');

      if (status === 'captured') {
        return {
          action: 'captured',
          data: {
            session_id: mpPayment.external_reference ?? '',
            amount: Math.round((mpPayment.transaction_amount ?? 0) * 100),
          },
        };
      }

      if (status === 'canceled' || status === 'error') {
        return {
          action: 'failed',
          data: {
            session_id: mpPayment.external_reference ?? '',
            amount: Math.round((mpPayment.transaction_amount ?? 0) * 100),
          },
        };
      }

      return { action: 'not_supported' };
    } catch {
      return { action: 'failed', data: { session_id: '', amount: 0 } };
    }
  }

  private getPaymentMethodsConfig(paymentMethodType: string) {
    if (paymentMethodType === 'pix') {
      return {
        excluded_payment_methods: [],
        excluded_payment_types: [{ id: 'credit_card' }, { id: 'debit_card' }, { id: 'ticket' }],
        installments: 1,
      };
    }

    if (paymentMethodType === 'boleto') {
      return {
        excluded_payment_methods: [],
        excluded_payment_types: [{ id: 'credit_card' }, { id: 'debit_card' }],
        installments: 1,
      };
    }

    return {
      excluded_payment_types: [{ id: 'ticket' }],
      installments: 12,
    };
  }
}
```

**Step 2: Commit**

```bash
git add apps/medusa/src/modules/mercadopago/service.ts
git commit -m "feat(payment): implement MercadoPagoProviderService"
```

---

## Task 4: Module Index (Registro do Provider)

**Files:**

- Create: `apps/medusa/src/modules/mercadopago/index.ts`

**Step 1: Criar `index.ts`**

```typescript
// apps/medusa/src/modules/mercadopago/index.ts
import MercadoPagoProviderService from './service';
import { ModuleProvider, Modules } from '@medusajs/framework/utils';

export default ModuleProvider(Modules.PAYMENT, {
  services: [MercadoPagoProviderService],
});
```

**Step 2: Registrar no `medusa-config.ts`**

```typescript
// apps/medusa/medusa-config.ts
import { defineConfig, loadEnv, Modules } from '@medusajs/framework/utils';

loadEnv(process.env.NODE_ENV || 'development', process.cwd());

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS || 'http://localhost:3000',
      adminCors: process.env.ADMIN_CORS || 'http://localhost:7001',
      authCors: process.env.AUTH_CORS || 'http://localhost:3000,http://localhost:7001',
      jwtSecret: process.env.JWT_SECRET || 'supersecret',
      cookieSecret: process.env.COOKIE_SECRET || 'supersecret',
    },
  },
  modules: [
    {
      resolve: './src/modules/mercadopago',
      options: {
        providers: [
          {
            resolve: './src/modules/mercadopago',
            id: 'mercadopago',
            options: {
              accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
              webhookSecret: process.env.MERCADOPAGO_WEBHOOK_SECRET,
              sandbox: process.env.MERCADOPAGO_SANDBOX === 'true',
            },
          },
        ],
      },
    },
  ],
});
```

**Step 3: Commit**

```bash
git add apps/medusa/src/modules/mercadopago/index.ts apps/medusa/medusa-config.ts
git commit -m "feat(payment): register mercadopago payment provider"
```

---

## Task 5: Webhook Endpoint

**Files:**

- Create: `apps/medusa/src/api/store/webhooks/mercadopago/route.ts`

**Step 1: Criar o endpoint de webhook**

```typescript
// apps/medusa/src/api/store/webhooks/mercadopago/route.ts
import { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import { Modules } from '@medusajs/framework/utils';
import { IPaymentModuleService } from '@medusajs/framework/types';
import type { MercadoPagoWebhookPayload } from '../../../../modules/mercadopago/types';

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const paymentService: IPaymentModuleService = req.scope.resolve(Modules.PAYMENT);

  const webhookPayload = req.body as MercadoPagoWebhookPayload;

  req.scope
    .resolve('logger')
    .info(
      `[MercadoPago Webhook] Received: type=${webhookPayload.type} action=${webhookPayload.action} id=${webhookPayload.data?.id}`,
    );

  try {
    await paymentService.processEvent({
      provider: 'mercadopago',
      payload: {
        data: webhookPayload,
        rawData: req.body as string,
        headers: req.headers as Record<string, string>,
      },
    });

    res.status(200).json({ received: true });
  } catch (error) {
    req.scope.resolve('logger').error('[MercadoPago Webhook] Processing failed', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}
```

**Step 2: Commit**

```bash
git add apps/medusa/src/api/store/webhooks/
git commit -m "feat(payment): add mercadopago webhook endpoint"
```

---

## Task 6: PIX — Endpoint Dedicado para QR Code

**Files:**

- Create: `apps/medusa/src/api/store/payments/pix/route.ts`

O checkout PIX requer criar um pagamento direto (não só preference) para obter o QR Code.

**Step 1: Criar endpoint PIX**

```typescript
// apps/medusa/src/api/store/payments/pix/route.ts
import { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import { MercadoPagoConfig, Payment } from 'mercadopago';

interface PixPaymentRequest {
  amount: number;
  email: string;
  firstName: string;
  lastName: string;
  cpf: string;
  externalReference: string;
  description?: string;
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const logger = req.scope.resolve('logger');
  const body = req.body as PixPaymentRequest;

  const mpConfig = new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN ?? '',
  });

  try {
    const payment = new Payment(mpConfig);

    const pixPayment = await payment.create({
      body: {
        transaction_amount: body.amount / 100,
        description: body.description ?? 'Realizah - Pagamento PIX',
        payment_method_id: 'pix',
        payer: {
          email: body.email,
          first_name: body.firstName,
          last_name: body.lastName,
          identification: {
            type: 'CPF',
            number: body.cpf,
          },
        },
        external_reference: body.externalReference,
        notification_url: process.env.MERCADOPAGO_WEBHOOK_URL,
      },
    });

    res.status(200).json({
      paymentId: pixPayment.id,
      status: pixPayment.status,
      qrCode: pixPayment.point_of_interaction?.transaction_data?.qr_code,
      qrCodeBase64: pixPayment.point_of_interaction?.transaction_data?.qr_code_base64,
      ticketUrl: pixPayment.point_of_interaction?.transaction_data?.ticket_url,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    });
  } catch (error) {
    logger.error('[PIX] Failed to create payment', error);
    res.status(500).json({ error: 'Failed to create PIX payment' });
  }
}
```

**Step 2: Commit**

```bash
git add apps/medusa/src/api/store/payments/
git commit -m "feat(payment): add PIX payment endpoint with QR code"
```

---

## Task 7: Assinaturas Recorrentes (Preapproval)

**Files:**

- Create: `apps/medusa/src/api/store/subscriptions/payment/route.ts`

Mercado Pago usa o sistema de "Preapproval" para cobranças recorrentes.

**Step 1: Criar endpoint de subscription recorrente**

```typescript
// apps/medusa/src/api/store/subscriptions/payment/route.ts
import { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import { MercadoPagoConfig, PreApproval } from 'mercadopago';

interface SubscriptionPaymentRequest {
  planId: string;
  customerId: string;
  customerEmail: string;
  backUrl: string;
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const logger = req.scope.resolve('logger');
  const body = req.body as SubscriptionPaymentRequest;

  const mpConfig = new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN ?? '',
  });

  try {
    const subscriptionService = req.scope.resolve('subscriptionService');
    const plan = await subscriptionService.retrieveSubscriptionPlan(body.planId);

    const preApproval = new PreApproval(mpConfig);

    const preApprovalData = await preApproval.create({
      body: {
        reason: `Realizah - ${plan.name}`,
        payer_email: body.customerEmail,
        auto_recurring: {
          frequency: plan.intervalCount ?? 1,
          frequency_type: plan.interval === 'yearly' ? 'years' : 'months',
          transaction_amount: plan.price / 100,
          currency_id: plan.currency?.toUpperCase() ?? 'BRL',
        },
        back_url: body.backUrl,
        external_reference: `sub_${body.customerId}_${body.planId}_${Date.now()}`,
        notification_url: process.env.MERCADOPAGO_WEBHOOK_URL,
      },
    });

    res.status(200).json({
      preApprovalId: preApprovalData.id,
      checkoutUrl: preApprovalData.init_point,
      sandboxUrl: preApprovalData.sandbox_init_point,
      status: preApprovalData.status,
    });
  } catch (error) {
    logger.error('[Subscription Payment] Failed to create preapproval', error);
    res.status(500).json({ error: 'Failed to create subscription payment' });
  }
}
```

**Step 2: Commit**

```bash
git add apps/medusa/src/api/store/subscriptions/payment/
git commit -m "feat(payment): add recurring subscription preapproval endpoint"
```

---

## Task 8: ADR e Documentação

**Files:**

- Create: `docs/adr/0007-fase5-mercado-pago.md`
- Modify: `docs/ROADMAP.md` (marcar Fase 5 como completa)
- Modify: `docs/STATUS_REPORT.md` (atualizar status)
- Modify: `CHANGELOG.md` (adicionar v0.6.0)

**Step 1: Criar ADR**

```markdown
# 0007 — Integração Mercado Pago como Payment Provider

**Data:** 2026-03-05  
**Status:** Aceito

## Contexto

O Realizah precisa processar pagamentos brasileiros (PIX, cartão, boleto) e assinaturas recorrentes.

## Decisão

Implementar Mercado Pago como Medusa Payment Provider customizado usando o SDK oficial
`mercadopago@2.x`.

## Justificativa

- Suporte nativo a PIX, cartão, boleto e assinaturas
- SDK oficial TypeScript mantido pelo Mercado Pago
- Sandbox robusto para testes
- Webhook confiável para captura assíncrona

## Consequências

- Checkout PIX tem QR code gerado via endpoint dedicado
- Assinaturas usam PreApproval do Mercado Pago
- Webhooks recebidos em `/store/webhooks/mercadopago`
```

**Step 2: Atualizar ROADMAP.md** — Fase 5 de 🚧 para ✅

**Step 3: Commit final da fase**

```bash
git add docs/
git commit -m "docs(payment): add ADR 0007 and update roadmap for fase 5"
```

---

## Task 9: Verificação e Type-Check

**Step 1: Verificar tipos**

```bash
pnpm --filter medusa type-check
```

Esperado: 0 erros

**Step 2: Verificar lint**

```bash
pnpm --filter medusa lint
```

Esperado: 0 erros

**Step 3: Build de verificação**

```bash
pnpm --filter medusa build
```

Esperado: build sem erros

**Step 4: Commit final se necessário**

```bash
git add -A
git commit -m "fix(payment): resolve type-check and lint issues"
```

---

## Variáveis de Ambiente Necessárias

Para testar em sandbox, criar `apps/medusa/.env` com:

```env
MERCADOPAGO_ACCESS_TOKEN=TEST-<seu-access-token-sandbox>
MERCADOPAGO_PUBLIC_KEY=TEST-<seu-public-key-sandbox>
MERCADOPAGO_WEBHOOK_SECRET=<seu-webhook-secret>
MERCADOPAGO_SANDBOX=true
MERCADOPAGO_WEBHOOK_URL=https://<seu-ngrok-ou-dominio>/store/webhooks/mercadopago
```

Obter credenciais em:
https://www.mercadopago.com.br/developers/pt/docs/checkout-api/additional-content/your-integrations/credentials

---

## Checklist de Conclusão

- [ ] `mercadopago` SDK instalado
- [ ] `MercadoPagoProviderService` implementado
- [ ] Provider registrado no `medusa-config.ts`
- [ ] Endpoint webhook `/store/webhooks/mercadopago`
- [ ] Endpoint PIX com QR code
- [ ] Endpoint assinatura recorrente (PreApproval)
- [ ] Type-check sem erros
- [ ] Lint sem erros
- [ ] ADR 0007 criado
- [ ] ROADMAP e STATUS atualizado
