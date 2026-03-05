# Digital Delivery Module — Especificação Técnica

Módulo responsável pela entrega segura de arquivos digitais (ebooks, templates, etc.) após a compra.

## Visão Geral

O Digital Delivery Module gerencia produtos digitais, controla acesso aos arquivos e garante entrega segura através de URLs assinadas com expiração.

## Entidades

### DigitalProduct

Representa um produto digital vendável.

```typescript
interface DigitalProduct {
  id: string;
  productId: string;             // ID do produto no Medusa
  name: string;
  description?: string;
  type: ProductType;
  files: DigitalFile[];
  downloadLimit?: number;        // Limite de downloads (null = ilimitado)
  expirationDays?: number;       // Dias até expirar acesso (null = permanente)
  fileSize: number;              // Tamanho total em bytes
  requiredTier?: Tier;           // Tier necessário (se aplicável)
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

type ProductType = 
  | 'ebook'
  | 'template'
  | 'software'
  | 'audio'
  | 'video'
  | 'document'
  | 'other';
```

### DigitalFile

Representa um arquivo individual de um produto digital.

```typescript
interface DigitalFile {
  id: string;
  digitalProductId: string;
  name: string;
  description?: string;
  storageKey: string;            // Chave no S3
  fileSize: number;              // Tamanho em bytes
  mimeType: string;              // ex: application/pdf
  checksum: string;              // SHA-256 para verificação de integridade
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}
```

### DigitalPurchase

Representa a compra de um produto digital por um cliente.

```typescript
interface DigitalPurchase {
  id: string;
  customerId: string;
  digitalProductId: string;
  orderId: string;               // ID do pedido no Medusa
  status: PurchaseStatus;
  downloadCount: number;
  lastDownloadAt?: Date;
  expiresAt?: Date;              // Quando o acesso expira
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

type PurchaseStatus = 
  | 'pending'       // Aguardando pagamento
  | 'active'        // Ativo, pode baixar
  | 'expired'       // Acesso expirado
  | 'revoked';      // Acesso revogado
```

### DownloadLog

Registra cada download realizado.

```typescript
interface DownloadLog {
  id: string;
  digitalPurchaseId: string;
  digitalFileId: string;
  customerId: string;
  ipAddress: string;
  userAgent: string;
  downloadedAt: Date;
  metadata?: Record<string, any>;
}
```

## Casos de Uso

### 1. Criar Produto Digital

**Ator**: Admin

**Fluxo**:
1. Admin cria produto no Medusa
2. Admin faz upload de arquivos
3. Sistema armazena arquivos no S3
4. Sistema calcula checksum de cada arquivo
5. Sistema cria `DigitalProduct` e `DigitalFile`s
6. Sistema vincula ao produto do Medusa

**Validações**:
- Arquivos devem ter tamanho máximo (ex: 2GB por arquivo)
- Tipos de arquivo permitidos conforme configuração

### 2. Comprar Produto Digital

**Ator**: Cliente

**Fluxo**:
1. Cliente adiciona produto digital ao carrinho
2. Cliente finaliza compra (via Medusa)
3. Sistema recebe evento `order.placed`
4. Sistema verifica se pedido contém produtos digitais
5. Sistema cria `DigitalPurchase` para cada produto
6. Sistema envia email com link de download
7. Sistema dispara evento `digital_purchase.created`

**Integração com Medusa**:
```typescript
medusaEventBus.on('order.placed', async (order) => {
  const digitalProducts = order.items.filter(item => 
    item.variant.product.metadata?.isDigital === true
  );
  
  for (const item of digitalProducts) {
    await digitalDeliveryService.createPurchase({
      customerId: order.customer_id,
      digitalProductId: item.variant.product.metadata.digitalProductId,
      orderId: order.id,
    });
  }
});
```

### 3. Gerar Link de Download

**Ator**: Cliente

**Fluxo**:
1. Cliente acessa página de downloads
2. Sistema lista produtos digitais comprados
3. Cliente clica em "Download"
4. Sistema verifica status da compra
5. Sistema verifica limite de downloads
6. Sistema gera URL assinada (válida por 1 hora)
7. Sistema registra download em `DownloadLog`
8. Sistema incrementa `downloadCount`
9. Sistema retorna URL assinada

**Geração de URL Assinada**:
```typescript
async function generateDownloadUrl(
  purchaseId: string,
  fileId: string
): Promise<string> {
  const purchase = await getPurchase(purchaseId);
  const file = await getFile(fileId);
  
  // Verificações
  if (purchase.status !== 'active') {
    throw new ForbiddenError('Purchase is not active');
  }
  
  if (purchase.expiresAt && purchase.expiresAt < new Date()) {
    throw new ForbiddenError('Purchase has expired');
  }
  
  if (purchase.downloadLimit && 
      purchase.downloadCount >= purchase.downloadLimit) {
    throw new ForbiddenError('Download limit reached');
  }
  
  // Gerar URL assinada (S3 presigned URL)
  const signedUrl = await s3.getSignedUrl('getObject', {
    Bucket: config.s3Bucket,
    Key: file.storageKey,
    Expires: 3600, // 1 hora
  });
  
  // Registrar download
  await logDownload(purchase.id, file.id);
  
  return signedUrl;
}
```

### 4. Verificar Integridade do Arquivo

**Ator**: Cliente

**Fluxo**:
1. Cliente baixa arquivo
2. Cliente calcula checksum do arquivo baixado
3. Cliente compara com checksum fornecido
4. Se diferente: arquivo corrompido, baixar novamente

**Fornecimento de Checksum**:
```json
{
  "file": {
    "id": "file_123",
    "name": "ebook.pdf",
    "downloadUrl": "https://...",
    "checksum": "sha256:abc123...",
    "checksumAlgorithm": "SHA-256"
  }
}
```

### 5. Revogar Acesso

**Ator**: Admin

**Fluxo**:
1. Admin seleciona compra
2. Admin revoga acesso
3. Sistema atualiza status para `revoked`
4. Sistema envia notificação ao cliente
5. Sistema dispara evento `digital_purchase.revoked`

**Motivos**: violação de termos, chargeback, etc.

### 6. Renovar Acesso Expirado

**Ator**: Admin

**Fluxo**:
1. Admin seleciona compra expirada
2. Admin define nova data de expiração
3. Sistema atualiza `expiresAt`
4. Sistema atualiza status para `active`
5. Sistema envia notificação ao cliente

## APIs

### Admin APIs

```
POST   /admin/digital-products
GET    /admin/digital-products
GET    /admin/digital-products/:id
PATCH  /admin/digital-products/:id
DELETE /admin/digital-products/:id

POST   /admin/digital-products/:id/files
DELETE /admin/digital-products/:id/files/:fileId

GET    /admin/digital-purchases
GET    /admin/digital-purchases/:id
POST   /admin/digital-purchases/:id/revoke
POST   /admin/digital-purchases/:id/renew

GET    /admin/download-logs
```

### Store APIs

```
GET    /store/my-digital-products
GET    /store/my-digital-products/:id
POST   /store/my-digital-products/:id/files/:fileId/download
GET    /store/my-digital-products/:id/downloads
```

## Eventos

| Evento | Quando | Payload |
|--------|--------|---------|
| `digital_purchase.created` | Compra criada | `{ purchase, product }` |
| `digital_purchase.downloaded` | Arquivo baixado | `{ purchase, file, downloadCount }` |
| `digital_purchase.expired` | Acesso expirou | `{ purchase }` |
| `digital_purchase.revoked` | Acesso revogado | `{ purchase, reason }` |
| `digital_purchase.limit_reached` | Limite de downloads atingido | `{ purchase }` |

## Integrações

### Medusa

Escutar eventos de pedidos:

```typescript
// Quando pedido é pago
medusaEventBus.on('order.payment_captured', async (order) => {
  await digitalDeliveryService.activatePurchases(order.id);
});

// Quando pedido é cancelado
medusaEventBus.on('order.canceled', async (order) => {
  await digitalDeliveryService.revokePurchases(order.id);
});

// Quando há chargeback
medusaEventBus.on('order.refunded', async (order) => {
  await digitalDeliveryService.revokePurchases(order.id);
});
```

### S3 (Storage)

```typescript
// Upload de arquivo
async function uploadFile(file: File): Promise<DigitalFile> {
  const key = `digital-products/${uuid()}/${file.name}`;
  
  await s3.upload({
    Bucket: config.s3Bucket,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
    ServerSideEncryption: 'AES256',
  }).promise();
  
  const checksum = calculateChecksum(file.buffer);
  
  return {
    storageKey: key,
    checksum,
    fileSize: file.size,
    mimeType: file.mimetype,
  };
}
```

### Email

Enviar email após compra:

```typescript
async function sendDownloadEmail(purchaseId: string) {
  const purchase = await getPurchase(purchaseId);
  const product = await getProduct(purchase.digitalProductId);
  const customer = await getCustomer(purchase.customerId);
  
  await emailService.send({
    to: customer.email,
    template: 'digital-product-purchased',
    data: {
      customerName: customer.name,
      productName: product.name,
      downloadUrl: `${config.storeUrl}/my-digital-products/${purchase.id}`,
      expiresAt: purchase.expiresAt,
    },
  });
}
```

## Migrations

```sql
-- Criar tabelas
CREATE TABLE digital_product (
  id VARCHAR PRIMARY KEY,
  product_id VARCHAR NOT NULL UNIQUE,
  name VARCHAR NOT NULL,
  description TEXT,
  type VARCHAR(20) NOT NULL,
  download_limit INTEGER,
  expiration_days INTEGER,
  file_size BIGINT NOT NULL DEFAULT 0,
  required_tier VARCHAR(20),
  metadata JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE digital_file (
  id VARCHAR PRIMARY KEY,
  digital_product_id VARCHAR NOT NULL REFERENCES digital_product(id) ON DELETE CASCADE,
  name VARCHAR NOT NULL,
  description TEXT,
  storage_key VARCHAR NOT NULL UNIQUE,
  file_size BIGINT NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  checksum VARCHAR(64) NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE digital_purchase (
  id VARCHAR PRIMARY KEY,
  customer_id VARCHAR NOT NULL,
  digital_product_id VARCHAR NOT NULL REFERENCES digital_product(id),
  order_id VARCHAR NOT NULL,
  status VARCHAR(20) NOT NULL,
  download_count INTEGER NOT NULL DEFAULT 0,
  last_download_at TIMESTAMP,
  expires_at TIMESTAMP,
  metadata JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE download_log (
  id VARCHAR PRIMARY KEY,
  digital_purchase_id VARCHAR NOT NULL REFERENCES digital_purchase(id),
  digital_file_id VARCHAR NOT NULL REFERENCES digital_file(id),
  customer_id VARCHAR NOT NULL,
  ip_address VARCHAR(45) NOT NULL,
  user_agent TEXT,
  downloaded_at TIMESTAMP NOT NULL DEFAULT NOW(),
  metadata JSONB
);

-- Índices
CREATE INDEX idx_digital_product_product ON digital_product(product_id);
CREATE INDEX idx_digital_file_product ON digital_file(digital_product_id);
CREATE INDEX idx_purchase_customer ON digital_purchase(customer_id);
CREATE INDEX idx_purchase_product ON digital_purchase(digital_product_id);
CREATE INDEX idx_purchase_order ON digital_purchase(order_id);
CREATE INDEX idx_purchase_status ON digital_purchase(status);
CREATE INDEX idx_purchase_expires ON digital_purchase(expires_at);
CREATE INDEX idx_log_purchase ON download_log(digital_purchase_id);
CREATE INDEX idx_log_customer ON download_log(customer_id);
CREATE INDEX idx_log_downloaded ON download_log(downloaded_at);
```

## Segurança

### URLs Assinadas

- Válidas por tempo limitado (1 hora)
- Não reutilizáveis após expiração
- Vinculadas ao IP do cliente (opcional)

### Proteção contra Pirataria

- Limite de downloads por compra
- Watermark em PDFs (opcional)
- DRM para vídeos/áudio (futuro)
- Monitoramento de compartilhamento

### Auditoria

- Log de todos os downloads
- Alertas para padrões suspeitos (muitos downloads, IPs diferentes)
- Relatórios de uso

## Testes

### Casos de Teste

1. **Upload**: deve fazer upload e calcular checksum
2. **Compra**: deve criar purchase após pagamento
3. **Download**: deve gerar URL assinada válida
4. **Limite**: deve rejeitar download após limite
5. **Expiração**: deve rejeitar download após expiração
6. **Revogação**: deve rejeitar download após revogação
7. **Integridade**: checksum deve corresponder ao arquivo
8. **Log**: deve registrar todos os downloads

## Próximos Passos

- [ ] Implementar entidades e migrations
- [ ] Implementar DigitalDeliveryService
- [ ] Implementar upload para S3
- [ ] Implementar geração de URLs assinadas
- [ ] Implementar APIs admin e store
- [ ] Integrar com eventos do Medusa
- [ ] Implementar email de download
- [ ] Implementar monitoramento de uso
- [ ] Escrever testes
- [ ] Documentar APIs
