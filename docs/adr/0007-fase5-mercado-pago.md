# ADR 0007 — Integração Mercado Pago como Payment Provider

**Data:** 2026-03-05  
**Status:** Aceito  
**Autores:** Agente Realizah

---

## Contexto

O Realizah precisa processar pagamentos brasileiros (PIX, cartão de crédito, boleto) e assinaturas
recorrentes para monetizar a plataforma. O MVP não pode ser lançado sem integração de pagamentos.

## Decisão

Implementar o **Mercado Pago** como Medusa v2 Payment Provider customizado, usando o SDK oficial
`mercadopago@2.x`.

## Justificativa

- **Líder no Brasil:** Mercado Pago domina o mercado de pagamentos digitais brasileiro
- **PIX nativo:** Suporte completo ao PIX, método de pagamento preferido no Brasil
- **SDK TypeScript oficial:** SDK bem mantido e documentado
- **Sandbox robusto:** Ambiente de testes completo sem custo
- **Webhooks confiáveis:** Sistema de notificações para captura assíncrona (PIX, boleto)
- **Assinaturas:** PreApproval API para cobranças recorrentes

## Arquitetura Implementada

### Estrutura de Arquivos

```
apps/medusa/src/modules/mercadopago/
├── index.ts           # ModuleProvider(Modules.PAYMENT, ...)
├── service.ts         # MercadoPagoProviderService extends AbstractPaymentProvider
├── types.ts           # Tipos: MercadoPagoPaymentData, MercadoPagoWebhookPayload
└── utils.ts           # mapMercadoPagoStatusToMedusa, parsePriceToMercadoPago

apps/medusa/src/api/store/
├── webhooks/mercadopago/route.ts    # POST — recebe notificações do MP
├── payments/pix/route.ts           # POST — cria pagamento PIX com QR code
└── subscriptions/payment/route.ts  # POST — cria PreApproval recorrente
```

### Fluxo de Pagamento

#### PIX

```
Frontend → POST /store/payments/pix
         ← { qrCode, qrCodeBase64, paymentId, expiresAt }
         → usuário escaneia QR code no app bancário
         → Mercado Pago → POST /store/webhooks/mercadopago (payment.updated: approved)
         → MercadoPagoProviderService.getWebhookActionAndData → action: "captured"
         → Medusa captura o payment automaticamente
```

#### Cartão de Crédito / Boleto

```
Frontend → cria payment session via Medusa Checkout API
         ← { initPoint, sandboxInitPoint } (Preference)
         → usuário finaliza no checkout do Mercado Pago
         → Mercado Pago → POST /store/webhooks/mercadopago
         → Medusa captura ou autoriza o payment
```

#### Assinatura Recorrente

```
Frontend → POST /store/subscriptions/payment
         ← { checkoutUrl } (PreApproval)
         → usuário aprova assinatura no Mercado Pago
         → Cobranças automáticas mensais/anuais pelo MP
         → Webhooks notificam status da cobrança
```

### Mapeamento de Status

| Mercado Pago   | Medusa          |
| -------------- | --------------- |
| `approved`     | `captured`      |
| `authorized`   | `authorized`    |
| `in_process`   | `pending`       |
| `in_mediation` | `requires_more` |
| `rejected`     | `error`         |
| `cancelled`    | `canceled`      |
| `pending`      | `pending`       |

## Variáveis de Ambiente

```env
MERCADOPAGO_ACCESS_TOKEN=TEST-xxxx   # Credencial principal
MERCADOPAGO_PUBLIC_KEY=TEST-xxxx     # Para uso no frontend
MERCADOPAGO_WEBHOOK_SECRET=xxxx      # Para validação de webhooks
MERCADOPAGO_SANDBOX=true             # false em produção
MERCADOPAGO_WEBHOOK_URL=https://...  # URL pública para webhooks
```

## APIs Adicionadas

| Método | Endpoint                       | Descrição                                  |
| ------ | ------------------------------ | ------------------------------------------ |
| POST   | `/store/webhooks/mercadopago`  | Recebe notificações do Mercado Pago        |
| POST   | `/store/payments/pix`          | Cria pagamento PIX com QR code             |
| POST   | `/store/subscriptions/payment` | Inicia assinatura recorrente (PreApproval) |

## Consequências

### Positivas

- Pagamentos PIX, cartão e boleto funcionando
- Assinaturas recorrentes automatizadas
- Integração nativa com o Payment Module do Medusa
- Refunds suportados via `refundPayment`

### Negativas / Trade-offs

- Assinaturas recorrentes gerenciadas pelo Mercado Pago (não sincronizadas em tempo real com o
  SubscriptionModule)
- PIX expira em 30 minutos — requer lógica de retry no frontend
- Webhook URL precisa ser pública (ngrok para desenvolvimento)

### Débito Técnico

- Validação de assinatura do webhook via `MERCADOPAGO_WEBHOOK_SECRET` não implementada (recomendado
  para produção)
- Sincronização bidirecional entre PreApproval status e SubscriptionModule status a implementar em
  fase futura

## Referências

- [Medusa v2 Payment Provider Docs](https://docs.medusajs.com/resources/commerce-modules/payment/payment-provider)
- [Mercado Pago SDK Node.js](https://github.com/mercadopago/sdk-nodejs)
- [Mercado Pago PIX](https://www.mercadopago.com.br/developers/pt/docs/checkout-api/payment-methods/other-payment-methods/brazil/pix)
- [Mercado Pago PreApproval](https://www.mercadopago.com.br/developers/pt/docs/subscriptions/landing)
