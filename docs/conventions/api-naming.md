# Convenções de Nomenclatura de APIs

Padrões para nomenclatura de endpoints, recursos e operações no projeto Realizah.

## Princípios Gerais

- **RESTful**: seguir convenções REST quando possível
- **Consistência**: padrões uniformes em toda a API
- **Clareza**: nomes auto-explicativos
- **Previsibilidade**: desenvolvedores devem conseguir adivinhar endpoints

## Recursos (Resources)

### Nomenclatura

- **Plural**: use plural para coleções — `/users`, `/products`, `/subscriptions`
- **Kebab-case**: use hífen para palavras compostas — `/subscription-plans`, `/course-modules`
- **Substantivos**: recursos são substantivos, não verbos

```
✅ BOM
GET /users
GET /subscription-plans
GET /course-modules

❌ RUIM
GET /getUsers
GET /subscriptionPlans (camelCase)
GET /course_modules (snake_case)
```

### Hierarquia

Use hierarquia para relacionamentos:

```
✅ BOM
GET /users/:userId/subscriptions
GET /courses/:courseId/modules
GET /subscriptions/:subscriptionId/invoices

❌ RUIM
GET /user-subscriptions
GET /course-modules (sem contexto de qual curso)
```

Limite a 2-3 níveis de profundidade:

```
✅ BOM
GET /courses/:courseId/modules/:moduleId/lessons

⚠️ EVITE (muito profundo)
GET /courses/:courseId/modules/:moduleId/lessons/:lessonId/comments/:commentId/replies
```

## Métodos HTTP

| Método | Uso | Exemplo |
|--------|-----|---------|
| `GET` | Buscar recurso(s) | `GET /users` |
| `POST` | Criar recurso | `POST /users` |
| `PUT` | Substituir recurso completo | `PUT /users/:id` |
| `PATCH` | Atualizar parcialmente | `PATCH /users/:id` |
| `DELETE` | Remover recurso | `DELETE /users/:id` |

### Exemplos

```
# Listar todos os usuários
GET /users

# Buscar usuário específico
GET /users/:userId

# Criar novo usuário
POST /users

# Atualizar usuário completo
PUT /users/:userId

# Atualizar email do usuário
PATCH /users/:userId

# Deletar usuário
DELETE /users/:userId
```

## Ações Não-CRUD

Para ações que não se encaixam em CRUD, use verbos como substantivos:

```
✅ BOM
POST /subscriptions/:id/cancel
POST /subscriptions/:id/reactivate
POST /courses/:id/enroll
POST /invoices/:id/send

❌ RUIM
POST /subscriptions/:id/cancellation (substantivo abstrato)
GET /subscriptions/:id/cancel (GET não deve ter efeito colateral)
```

Alternativa com recursos:

```
✅ TAMBÉM BOM
POST /subscriptions/:id/cancellations
DELETE /subscriptions/:id/enrollments
```

## Query Parameters

### Filtros

Use query params para filtrar coleções:

```
GET /users?role=admin
GET /products?category=electronics&status=active
GET /subscriptions?plan=pro&status=active
```

### Paginação

```
GET /users?page=2&limit=20
GET /users?offset=40&limit=20
```

### Ordenação

```
GET /users?sort=createdAt:desc
GET /products?sort=price:asc,name:asc
```

### Busca

```
GET /users?search=john
GET /products?q=laptop
```

### Campos

```
GET /users?fields=id,name,email
GET /users/:id?include=subscriptions,orders
```

## Versionamento

Versione a API no path:

```
✅ BOM
/api/v1/users
/api/v2/users

❌ RUIM
/api/users (sem versão)
/api/users?version=1 (versão em query)
```

## Status Codes

Use status codes HTTP apropriados:

| Code | Uso |
|------|-----|
| `200 OK` | Sucesso (GET, PUT, PATCH) |
| `201 Created` | Recurso criado (POST) |
| `204 No Content` | Sucesso sem conteúdo (DELETE) |
| `400 Bad Request` | Erro de validação |
| `401 Unauthorized` | Não autenticado |
| `403 Forbidden` | Sem permissão |
| `404 Not Found` | Recurso não encontrado |
| `409 Conflict` | Conflito (ex: email duplicado) |
| `422 Unprocessable Entity` | Validação de negócio falhou |
| `500 Internal Server Error` | Erro do servidor |

## Formato de Resposta

### Sucesso

```json
// GET /users/:id
{
  "id": "usr_123",
  "email": "user@example.com",
  "name": "João Silva",
  "role": "user",
  "createdAt": "2026-03-04T10:00:00Z"
}

// GET /users (coleção)
{
  "data": [
    { "id": "usr_123", "name": "João" },
    { "id": "usr_124", "name": "Maria" }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

### Erro

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": [
      {
        "field": "email",
        "message": "Must be a valid email address"
      }
    ]
  }
}
```

## Nomenclatura de Campos

### Formato

- **camelCase**: use camelCase para campos JSON
- **Consistência**: mesmo nome para mesmo conceito em toda API

```json
✅ BOM
{
  "userId": "usr_123",
  "createdAt": "2026-03-04T10:00:00Z",
  "subscriptionPlan": "pro"
}

❌ RUIM
{
  "user_id": "usr_123",  // snake_case
  "CreatedAt": "...",    // PascalCase
  "subscription-plan": "pro"  // kebab-case
}
```

### IDs

Use prefixos descritivos para IDs:

```
usr_123    # User ID
sub_456    # Subscription ID
prd_789    # Product ID
crs_012    # Course ID
```

### Timestamps

Use ISO 8601:

```json
{
  "createdAt": "2026-03-04T10:00:00Z",
  "updatedAt": "2026-03-04T12:30:00Z"
}
```

### Booleanos

Prefixe com `is`, `has`, `can`:

```json
{
  "isActive": true,
  "hasSubscription": true,
  "canEdit": false
}
```

## Módulos Medusa

### Subscription Module

```
POST   /admin/subscriptions/plans
GET    /admin/subscriptions/plans
GET    /admin/subscriptions/plans/:id
PATCH  /admin/subscriptions/plans/:id
DELETE /admin/subscriptions/plans/:id

POST   /store/subscriptions
GET    /store/subscriptions/:id
POST   /store/subscriptions/:id/cancel
```

### Course Module

```
POST   /admin/courses
GET    /admin/courses
GET    /admin/courses/:id
PATCH  /admin/courses/:id

POST   /admin/courses/:id/modules
GET    /admin/courses/:id/modules
PATCH  /admin/courses/:id/modules/:moduleId

POST   /store/courses/:id/enroll
GET    /store/courses/:id/progress
POST   /store/courses/:id/modules/:moduleId/complete
```

### Access Control Module

```
GET    /store/access/features
GET    /store/access/features/:featureId
POST   /store/access/validate
```

### Digital Delivery Module

```
POST   /admin/digital-products
GET    /admin/digital-products
GET    /admin/digital-products/:id

GET    /store/digital-products/:id/download
```

## Exemplos Completos

### Criar Assinatura

```http
POST /api/v1/store/subscriptions
Content-Type: application/json

{
  "planId": "plan_pro_monthly",
  "paymentMethodId": "pm_123"
}

Response: 201 Created
{
  "id": "sub_456",
  "planId": "plan_pro_monthly",
  "status": "active",
  "currentPeriodStart": "2026-03-04T00:00:00Z",
  "currentPeriodEnd": "2026-04-04T00:00:00Z",
  "createdAt": "2026-03-04T10:00:00Z"
}
```

### Listar Cursos com Filtros

```http
GET /api/v1/store/courses?category=programming&level=beginner&sort=popularity:desc&page=1&limit=10

Response: 200 OK
{
  "data": [
    {
      "id": "crs_123",
      "title": "Introdução ao TypeScript",
      "category": "programming",
      "level": "beginner",
      "enrollmentCount": 1250
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "totalPages": 5
  }
}
```

## Referências

- [REST API Design Best Practices](https://stackoverflow.blog/2020/03/02/best-practices-for-rest-api-design/)
- [Microsoft REST API Guidelines](https://github.com/microsoft/api-guidelines)
- [Google API Design Guide](https://cloud.google.com/apis/design)
