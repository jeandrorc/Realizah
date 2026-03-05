# Plano Detalhado: Fase 5 - Digital Delivery Module

**Data**: 2026-03-04  
**Objetivo**: Implementar módulo completo de entrega de produtos digitais com URLs assinadas,
controle de acesso e integração com Medusa  
**Duração Estimada**: 2-3 dias  
**Complexidade**: Alta (integração S3, URLs assinadas, eventos Medusa)

## Visão Geral

O Digital Delivery Module gerencia a entrega segura de produtos digitais (ebooks, templates,
software, etc.) após a compra. Inclui:

- Upload e armazenamento seguro em S3
- Geração de URLs assinadas com expiração
- Controle de limite de downloads
- Log de downloads para auditoria
- Integração com eventos do Medusa (order.payment_captured, order.canceled, etc.)
- Verificação de integridade via checksum
- APIs para admin e store

## Estrutura de Entidades

### 1. DigitalProduct

- Representa produto digital vendável
- Campos: productId (Medusa), name, description, type, files[], downloadLimit, expirationDays,
  fileSize, requiredTier, metadata
- Tipos: ebook, template, software, audio, video, document, other

### 2. DigitalFile

- Arquivo individual de um produto
- Campos: digitalProductId, name, storageKey (S3), fileSize, mimeType, checksum (SHA-256), metadata
- Relacionamento: belongsTo DigitalProduct

### 3. DigitalPurchase

- Compra de produto digital por cliente
- Campos: customerId, digitalProductId, orderId, status, downloadCount, lastDownloadAt, expiresAt,
  metadata
- Status: pending, active, expired, revoked
- Unique constraint: (customerId, digitalProductId, orderId)

### 4. DownloadLog

- Registro de cada download
- Campos: digitalPurchaseId, digitalFileId, customerId, ipAddress, userAgent, downloadedAt, metadata
- Para auditoria e detecção de fraude

## Breakdown de Tarefas

### Fase 5.1 - Fundação (Day 1: 4-6h)

#### Task 5-1: Adicionar tipos ao @realizah/types

- `DigitalProduct`, `DigitalFile`, `DigitalPurchase`, `DownloadLog`
- Enums: `ProductType`, `PurchaseStatus`
- Input types: `CreateDigitalProductInput`, `UpdateDigitalProductInput`, `UploadFileInput`,
  `CreatePurchaseInput`, `GenerateDownloadUrlInput`
- Response types: `DownloadUrlResponse`, `PurchaseWithProduct`, `DownloadStats`
- **Duração**: 30min

#### Task 5-2: Criar estrutura do módulo

- `apps/medusa/src/modules/digital-delivery/`
- Subpastas: `models/`, `services/`, `migrations/`, `subscribers/`, `utils/`
- **Duração**: 10min

#### Task 5-3: Implementar entidades (4 models)

- `digital-product.ts`: model com type enum
- `digital-file.ts`: model com belongsTo DigitalProduct
- `digital-purchase.ts`: model com status enum, belongsTo DigitalProduct
- `download-log.ts`: model com belongsTo DigitalPurchase e DigitalFile
- `index.ts`: exports
- **Duração**: 1h

#### Task 5-4: Criar migrations

- `Migration20260304300000.ts`
- 4 tabelas: digital_product, digital_file, digital_purchase, download_log
- 10 indexes: product_id, digital_product_id, customer_id, order_id, status, expires_at,
  storage_key, purchase_id, downloaded_at
- Foreign keys com ON DELETE CASCADE
- Unique constraints
- **Duração**: 1h

#### Task 5-5: Implementar utils

- `checksum.ts`: calcular SHA-256 de arquivos
- `s3.ts`: wrapper para AWS S3 (upload, getSignedUrl, delete)
- `validation.ts`: validar tipos de arquivo, tamanho máximo
- **Duração**: 1-2h

### Fase 5.2 - Serviços Core (Day 1-2: 4-6h)

#### Task 5-6: DigitalProductService

- CRUD de produtos digitais
- Métodos: createProduct, listProducts, retrieveProduct, updateProduct, deleteProduct
- Filtros: type, requiredTier
- Cálculo de fileSize total
- **Duração**: 1h

#### Task 5-7: DigitalFileService

- Gestão de arquivos
- Métodos: uploadFile (S3), deleteFile (S3), listFiles, retrieveFile, calculateChecksum
- Validação de tipo e tamanho
- **Duração**: 1-2h

#### Task 5-8: DigitalPurchaseService

- Gestão de compras
- Métodos: createPurchase, listPurchases, retrievePurchase, activatePurchase, revokePurchase,
  renewPurchase
- Verificação de status, expiração, limite
- **Duração**: 1h

#### Task 5-9: DownloadLogService

- Registro de downloads
- Métodos: logDownload, listLogs, getDownloadStats
- Agregação de estatísticas
- **Duração**: 30min

### Fase 5.3 - Lógica de Negócio (Day 2: 3-4h)

#### Task 5-10: DownloadManagerService

- Geração de URLs assinadas
- Métodos: generateDownloadUrl, verifyAccess, incrementDownloadCount
- Validações: status, expiração, limite de downloads
- Integração com S3 presigned URLs
- **Duração**: 2h

#### Task 5-11: PurchaseManagerService

- Gestão de compras por pedido
- Métodos: createPurchasesFromOrder, activatePurchases, revokePurchases, checkExpirations
- Integração com Medusa Order
- **Duração**: 1-2h

### Fase 5.4 - Admin APIs (Day 2: 2-3h)

#### Task 5-12: Admin APIs - Digital Products

- `POST /admin/digital-products` - criar produto
- `GET /admin/digital-products` - listar produtos
- `GET /admin/digital-products/:id` - detalhes
- `PATCH /admin/digital-products/:id` - atualizar
- `DELETE /admin/digital-products/:id` - deletar
- `POST /admin/digital-products/:id/files` - upload arquivo
- `DELETE /admin/digital-products/:id/files/:fileId` - deletar arquivo
- **Duração**: 1-2h

#### Task 5-13: Admin APIs - Digital Purchases

- `GET /admin/digital-purchases` - listar compras
- `GET /admin/digital-purchases/:id` - detalhes
- `POST /admin/digital-purchases/:id/revoke` - revogar acesso
- `POST /admin/digital-purchases/:id/renew` - renovar acesso
- **Duração**: 30min

#### Task 5-14: Admin APIs - Download Logs

- `GET /admin/download-logs` - listar logs
- `GET /admin/download-logs/stats` - estatísticas
- **Duração**: 30min

### Fase 5.5 - Store APIs (Day 2-3: 2h)

#### Task 5-15: Store APIs - My Digital Products

- `GET /store/my-digital-products` - meus produtos
- `GET /store/my-digital-products/:id` - detalhes da compra
- `POST /store/my-digital-products/:id/files/:fileId/download` - gerar URL de download
- `GET /store/my-digital-products/:id/downloads` - histórico de downloads
- Autenticação: verificar customerId
- **Duração**: 1-2h

### Fase 5.6 - Eventos & Integração (Day 3: 3-4h)

#### Task 5-16: Subscribers - Medusa Events

- `order.payment_captured`: criar/ativar purchases
- `order.canceled`: revogar purchases
- `order.refunded`: revogar purchases
- Filtrar apenas produtos digitais (metadata.isDigital)
- **Duração**: 1-2h

#### Task 5-17: Subscribers - Digital Delivery Events

- `digital_purchase.created`: enviar email de download
- `digital_purchase.downloaded`: atualizar stats, alertar se suspeito
- `digital_purchase.expired`: notificar cliente
- `digital_purchase.revoked`: notificar cliente
- `digital_purchase.limit_reached`: notificar cliente
- **Duração**: 1h

#### Task 5-18: Integração com Access Control

- Verificar requiredTier antes de gerar download
- Middleware de verificação de acesso
- **Duração**: 30min

### Fase 5.7 - Finalização (Day 3: 2-3h)

#### Task 5-19: Seed de produtos digitais

- 3-5 produtos exemplo (ebook, template, software)
- Arquivos placeholder
- **Duração**: 30min

#### Task 5-20: Testes de integração

- Testar upload para S3
- Testar geração de URL assinada
- Testar limite de downloads
- Testar expiração
- Testar revogação
- **Duração**: 1h

#### Task 5-21: Commit da Fase 5

- Commit com mensagem detalhada
- **Duração**: 10min

#### Task 5-22: Criar ADR da Fase 5

- Documentar decisões técnicas
- Consequências, riscos, métricas
- **Duração**: 1h

## Funcionalidades-Chave

### 1. Upload Seguro para S3

- Armazenamento com ServerSideEncryption (AES256)
- Chaves únicas: `digital-products/{uuid}/{filename}`
- Cálculo de checksum (SHA-256) para integridade
- Validação de tipo e tamanho

### 2. URLs Assinadas

- Válidas por 1 hora
- Geradas via S3 presigned URLs
- Não reutilizáveis após expiração
- Vinculadas ao IP (opcional)

### 3. Controle de Acesso

- Status: pending → active → expired/revoked
- Limite de downloads configurável
- Expiração configurável (dias)
- Verificação de tier (Access Control)

### 4. Auditoria Completa

- Log de todos os downloads
- IP, User-Agent, timestamp
- Estatísticas: total downloads, último download, padrões suspeitos
- Alertas para compartilhamento

### 5. Integração com Medusa

- Escuta eventos de pedidos
- Cria purchases automaticamente
- Ativa após pagamento
- Revoga em cancelamento/refund

## Integrações

### AWS S3

- **Upload**: `s3.upload()` com encryption
- **Download**: `s3.getSignedUrl()` com expiração
- **Delete**: `s3.deleteObject()`
- **Configuração**: bucket, region, credentials

### Medusa Events

- **order.payment_captured**: ativar purchases
- **order.canceled**: revogar purchases
- **order.refunded**: revogar purchases
- **Filtro**: `item.variant.product.metadata.isDigital === true`

### Access Control Module

- Verificar `requiredTier` antes de download
- Integrar com `AccessControlService.verifyAccess()`

### Email Service

- Email de boas-vindas com link de download
- Email de expiração próxima
- Email de revogação

## Desafios Identificados

### 1. Configuração do S3

- **Desafio**: Requer AWS credentials e bucket configurado
- **Solução**: Usar variáveis de ambiente, documentar setup
- **Fallback**: Mock para desenvolvimento local

### 2. Geração de Checksum

- **Desafio**: Calcular SHA-256 de arquivos grandes pode ser lento
- **Solução**: Calcular durante upload, armazenar no banco
- **Otimização**: Stream processing para arquivos grandes

### 3. Detecção de Fraude

- **Desafio**: Identificar compartilhamento de links
- **Solução**: Log de IP, alertas para múltiplos IPs, limite de downloads
- **Futuro**: Watermarking, DRM

### 4. Sincronização com Medusa

- **Desafio**: Garantir que purchases sejam criadas após pagamento
- **Solução**: Subscriber robusto com retry logic
- **Validação**: Verificar se produto tem metadata.isDigital

### 5. Performance de URLs Assinadas

- **Desafio**: Gerar URL pode ser lento
- **Solução**: Cache de URLs por 50min (antes de expirar)
- **Otimização**: Gerar em background

## Métricas de Sucesso

1. **Upload**: 100% dos arquivos armazenados com checksum
2. **Download**: URLs assinadas válidas por 1 hora
3. **Limite**: Rejeitar downloads após limite atingido
4. **Expiração**: Rejeitar downloads após expiração
5. **Revogação**: Rejeitar downloads após revogação
6. **Integridade**: Checksum corresponde ao arquivo
7. **Log**: 100% dos downloads registrados
8. **Integração**: Purchases criadas automaticamente após pagamento
9. **APIs**: 11+ endpoints funcionais
10. **Code Quality**: 0 erros de ESLint/Prettier

## Referências

- [Especificação do Digital Delivery Module](../specs/digital-delivery-module.md)
- [AWS S3 Presigned URLs](https://docs.aws.amazon.com/AmazonS3/latest/userguide/PresignedUrlUploadObject.html)
- [MedusaJS Events](https://docs.medusajs.com/v2/resources/commerce-modules/order/events)
- [SHA-256 Checksum](https://nodejs.org/api/crypto.html#crypto_crypto_createhash_algorithm_options)
- [ADR 004: Access Control Module](../adr/0004-fase3-access-control-module.md)

## Notas

- **S3 Local**: Para desenvolvimento, usar LocalStack ou MinIO
- **Checksum**: Calcular no upload, não no download
- **URLs**: Expiração de 1h é padrão, configurável
- **Limite**: Padrão ilimitado, configurável por produto
- **Expiração**: Padrão permanente, configurável por produto
- **Tipos de Arquivo**: Validar contra whitelist configurável
- **Tamanho Máximo**: 2GB por arquivo (configurável)

## Próximos Passos Após Fase 5

- **Fase 6**: Payment Integration (Mercado Pago)
- **Fase 7**: Notification Module (Email, Push, SMS)
- **Fase 8**: Analytics & Reporting
- **Fase 9**: Frontend (Next.js)
- **Fase 10**: Deploy & Infrastructure
