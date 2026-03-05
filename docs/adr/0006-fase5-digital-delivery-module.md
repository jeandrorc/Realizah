# ADR 0006: Fase 5 - Digital Delivery Module

**Status:** Accepted  
**Date:** 2026-03-05  
**Deciders:** Realizah Team  
**Technical Story:** Implementação do módulo de entrega de produtos digitais com URLs assinadas e
controle de acesso

## Context

A plataforma Realizah precisa de um sistema robusto para vender e entregar produtos digitais
(ebooks, templates, software, áudio, documentos) com:

- **Segurança**: URLs assinadas com expiração, checksums para integridade
- **Controle de acesso**: Integração com tiers (free/pro/premium), limites de download
- **Auditoria**: Log completo de downloads, detecção de atividade suspeita
- **Integração com Medusa**: Sincronização automática com eventos de pedidos
- **Escalabilidade**: Suporte para S3, múltiplos tipos de arquivo, grandes volumes

## Decision

### 1. Entidades

#### DigitalProduct

- `id`, `productId` (Medusa), `name`, `description`, `type` (ebook/template/software/audio/document)
- `fileSize` (calculado), `downloadLimit`, `expirationDays`
- `requiredTier` (free/pro/premium), `featureId` (Access Control)
- **Decisão**: Separar produto digital do produto Medusa para flexibilidade

#### DigitalFile

- `id`, `digitalProductId`, `name`, `description`, `storageKey` (S3)
- `fileSize`, `mimeType`, `checksum` (SHA-256)
- **Decisão**: Múltiplos arquivos por produto (ex: PDF + EPUB + MOBI)

#### DigitalPurchase

- `id`, `customerId`, `digitalProductId`, `orderId`
- `status` (pending/active/expired/revoked), `downloadCount`
- `expiresAt`, `lastDownloadAt`
- **Decisão**: Separar compra de pedido para suportar renovações e revogações

#### DownloadLog

- `id`, `digitalPurchaseId`, `digitalFileId`, `customerId`
- `ipAddress`, `userAgent`, `downloadedAt`
- **Decisão**: Log completo para auditoria e detecção de fraude

### 2. Services

#### Core Services

- **DigitalProductService**: CRUD de produtos, cálculo de fileSize
- **DigitalFileService**: Upload S3, checksum, validação (tamanho, MIME type)
- **DigitalPurchaseService**: CRUD de compras, ativação, revogação, renovação
- **DownloadLogService**: Logging, estatísticas, detecção de atividade suspeita

#### Business Logic Services

- **DownloadManagerService**: Geração de URLs assinadas (1h), verificação de acesso
- **PurchaseManagerService**: Integração com Medusa (order events), batch operations

**Decisão**: Separar core CRUD de business logic para reusabilidade

### 3. APIs

#### Admin APIs (14 endpoints)

- **Products**: POST/GET/PATCH/DELETE `/admin/digital-products`
- **Files**: POST/GET/DELETE `/admin/digital-products/:id/files`
- **Purchases**: GET/POST `/admin/digital-purchases`, revoke, renew
- **Logs**: GET `/admin/download-logs`, stats

#### Store APIs (4 endpoints)

- **My Products**: GET `/store/my-digital-products`
- **Download**: POST `/store/my-digital-products/:id/files/:fileId/download`
- **History**: GET `/store/my-digital-products/:id/downloads`

**Decisão**: Admin tem controle total, Store tem acesso limitado aos próprios produtos

### 4. Integração com Medusa

#### Event-Driven Architecture

- `order.placed` → criar purchases (status: pending)
- `order.payment_captured` → ativar purchases (status: active)
- `order.canceled` → revogar purchases (status: revoked)
- `order.refunded` → revogar purchases (status: revoked)

**Decisão**: Event-driven para desacoplamento e confiabilidade

### 5. Segurança

#### Checksums SHA-256

- Calculado no upload
- Armazenado no banco
- Retornado no download para verificação client-side

#### URLs Assinadas (Presigned URLs)

- Válidas por 1 hora
- Geradas sob demanda
- Não armazenadas (stateless)

#### Validação de Arquivos

- Whitelist de MIME types
- Limite de tamanho: 500MB
- Verificação no upload

**Decisão**: Múltiplas camadas de segurança (checksums + presigned URLs + validação)

### 6. Controle de Acesso

#### Integração com Access Control Module

- Middleware `verifyDigitalProductAccess`
- Helper `canAccessDigitalProduct`
- Verificação de tier antes de gerar URL

#### Limites de Download

- Configurável por produto
- Verificado antes de gerar URL
- Incrementado após download

#### Expiração

- Configurável por produto (dias)
- Calculada na criação da compra
- Verificada antes de gerar URL

**Decisão**: Flexibilidade máxima (tier + limite + expiração)

### 7. Auditoria e Detecção de Fraude

#### Download Logs

- IP, User-Agent, timestamp
- Associado a purchase e file

#### Detecção de Atividade Suspeita

- Múltiplos IPs (> 3)
- Downloads rápidos (< 1 min entre downloads)
- Alertas para admin

**Decisão**: Auditoria completa para compliance e segurança

### 8. Storage (S3)

#### Mock Implementation

- `uploadToS3`: simula upload, retorna storageKey
- `getSignedDownloadUrl`: simula presigned URL
- `deleteFromS3`: simula delete

#### Production Integration (TODO)

- AWS SDK v3
- Bucket configurável
- Encryption at rest (AES-256)
- Lifecycle policies

**Decisão**: Mock para desenvolvimento, AWS SDK para produção

### 9. Migrations

#### 4 Tabelas

- `digital_product`, `digital_file`, `digital_purchase`, `download_log`

#### 14 Indexes

- `idx_digital_product_product_id` (Medusa integration)
- `idx_digital_product_type` (filtering)
- `idx_digital_product_required_tier` (access control)
- `idx_digital_file_digital_product_id` (relationships)
- `idx_digital_file_storage_key` (S3 lookups)
- `idx_digital_purchase_customer_id` (customer queries)
- `idx_digital_purchase_order_id` (Medusa integration)
- `idx_digital_purchase_status` (filtering)
- `idx_digital_purchase_expires_at` (expiration checks)
- `idx_download_log_digital_purchase_id` (audit queries)
- `idx_download_log_customer_id` (customer history)
- `idx_download_log_downloaded_at` (time-based queries)
- `idx_download_log_ip_address` (fraud detection)
- `uniq_digital_purchase_customer_product_order` (prevent duplicates)

**Decisão**: Indexes otimizados para queries frequentes

### 10. Subscribers

#### Medusa Events (4)

- `order.placed`, `order.payment_captured`, `order.canceled`, `order.refunded`

#### Digital Delivery Events (5)

- `digital_purchase.created`, `downloaded`, `expired`, `revoked`, `limit_reached`

**Decisão**: Event-driven para notificações e integrações futuras

## Consequences

### Positive

1. **Segurança robusta**: Checksums + presigned URLs + validação
2. **Flexibilidade**: Tier + limite + expiração configuráveis
3. **Auditoria completa**: Logs detalhados, detecção de fraude
4. **Integração nativa**: Event-driven com Medusa
5. **Escalabilidade**: S3, indexes otimizados
6. **Múltiplos arquivos**: Suporte para bundles (PDF + EPUB + MOBI)
7. **Renovação**: Suporte para renovar acesso expirado
8. **Revogação**: Suporte para revogar acesso (refunds, violações)

### Negative

1. **Complexidade**: 6 services, 18 APIs, 9 subscribers
2. **S3 Mock**: Requer integração AWS SDK para produção
3. **Email**: Notificações são TODOs
4. **File Upload**: Admin API usa base64, requer multipart para produção
5. **DRM**: Sem proteção para vídeo/áudio
6. **Watermarking**: Sem watermarking para PDFs

### Risks

1. **S3 Costs**: Grandes volumes podem gerar custos altos
2. **Fraud**: Detecção básica, pode requerer ML
3. **Expiration Checker**: Requer cron job para verificar expirações
4. **Client-side Checksum**: Não implementado, usuário não pode verificar

## Metrics of Success

1. **Performance**: URLs geradas em < 100ms
2. **Security**: 0 downloads não autorizados
3. **Reliability**: 99.9% uptime para downloads
4. **Fraud Detection**: < 1% falsos positivos
5. **Customer Satisfaction**: > 95% downloads bem-sucedidos
6. **Audit**: 100% downloads logados

## Implementation Summary

- **46 arquivos criados**: 4 models, 6 services, 18 APIs, 9 subscribers, 3 utils, 1 migration
- **4436 linhas de código**
- **4 tabelas**: digital_product, digital_file, digital_purchase, download_log
- **14 indexes**: otimizados para queries frequentes
- **9 event handlers**: Medusa + Digital Delivery
- **3 utils**: checksum, S3, validation
- **1 seed**: 5 produtos digitais padrão
- **1 middleware**: Access Control integration
- **1 test doc**: INTEGRATION_TESTS.md com 8 cenários

## Related ADRs

- [ADR 0002: Fase 2 - Subscription Module](./0002-fase2-subscription-module.md)
- [ADR 0003: Fase 3 - Access Control Module](./0003-fase3-access-control-module.md)
- [ADR 0005: Fase 4 - Course Module](./0005-fase4-course-module.md)

## References

- [Digital Delivery Module Spec](../specs/digital-delivery-module.md)
- [Fase 5 Plan](../plans/2026-03-04-fase5-digital-delivery-module.md)
- [Integration Tests](../../apps/medusa/src/modules/digital-delivery/INTEGRATION_TESTS.md)
- [AWS S3 Presigned URLs](https://docs.aws.amazon.com/AmazonS3/latest/userguide/PresignedUrlUploadObject.html)
- [SHA-256 Checksums](https://en.wikipedia.org/wiki/SHA-2)
