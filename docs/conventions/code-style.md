# Convenções de Código

Padrões de código para o projeto Realizah.

## Princípios Gerais

- **Clareza sobre brevidade** — código legível é mais importante que código curto
- **Consistência** — siga os padrões do projeto, mesmo que prefira outro estilo
- **Simplicidade** — evite abstrações prematuras (YAGNI)
- **DRY** — não repita código, mas não force abstrações artificiais

## TypeScript

### Configuração

- Modo strict habilitado
- ESM modules
- Paths aliases configurados no `tsconfig.json`

### Tipos

```typescript
// ✅ BOM - tipos explícitos em parâmetros e retornos públicos
export function createUser(data: CreateUserInput): Promise<User> {
  // implementação
}

// ✅ BOM - inferência em variáveis locais
const userId = user.id; // tipo inferido como string

// ❌ RUIM - any
function processData(data: any) { }

// ✅ BOM - unknown quando tipo não é conhecido
function processData(data: unknown) {
  if (typeof data === 'string') {
    // type narrowing
  }
}
```

### Interfaces vs Types

Use `interface` para objetos que podem ser estendidos:

```typescript
// ✅ BOM - interface para entidades
interface User {
  id: string;
  email: string;
  name: string;
}

// ✅ BOM - type para unions e utilitários
type UserRole = 'admin' | 'user' | 'guest';
type PartialUser = Partial<User>;
```

### Enums

Prefira union types a enums quando possível:

```typescript
// ✅ BOM - union type
type Status = 'active' | 'inactive' | 'pending';

// ⚠️ OK - enum quando precisa de valores específicos
enum HttpStatus {
  OK = 200,
  NotFound = 404,
  ServerError = 500,
}
```

## Nomenclatura

### Arquivos

- **Componentes React**: `PascalCase.tsx` — `UserProfile.tsx`
- **Utilitários**: `camelCase.ts` — `formatDate.ts`
- **Tipos**: `PascalCase.types.ts` — `User.types.ts`
- **Testes**: `*.test.ts` ou `*.spec.ts`

### Variáveis e Funções

```typescript
// ✅ BOM - camelCase para variáveis e funções
const userName = 'João';
function getUserById(id: string) { }

// ✅ BOM - PascalCase para classes e componentes
class UserService { }
function UserProfile() { }

// ✅ BOM - UPPER_SNAKE_CASE para constantes
const MAX_RETRY_ATTEMPTS = 3;
const API_BASE_URL = process.env.API_URL;
```

### Booleanos

Prefixe com `is`, `has`, `should`, `can`:

```typescript
// ✅ BOM
const isActive = true;
const hasPermission = user.role === 'admin';
const shouldRetry = attempts < MAX_RETRY_ATTEMPTS;
const canEdit = isOwner || isAdmin;

// ❌ RUIM
const active = true;
const permission = user.role === 'admin';
```

## Funções

### Tamanho

- Funções devem ter uma única responsabilidade
- Idealmente < 50 linhas
- Se maior, considere extrair subfunções

### Parâmetros

```typescript
// ✅ BOM - objeto para múltiplos parâmetros
function createUser({ email, name, role }: CreateUserParams) { }

// ❌ RUIM - muitos parâmetros posicionais
function createUser(email: string, name: string, role: string, active: boolean) { }

// ✅ BOM - parâmetros opcionais no final
function formatDate(date: Date, format?: string) { }
```

### Async/Await

```typescript
// ✅ BOM - async/await para clareza
async function fetchUser(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}

// ❌ RUIM - promise chains desnecessárias
function fetchUser(id: string): Promise<User> {
  return fetch(`/api/users/${id}`)
    .then(response => response.json());
}
```

## Error Handling

```typescript
// ✅ BOM - erros tipados
class UserNotFoundError extends Error {
  constructor(userId: string) {
    super(`User ${userId} not found`);
    this.name = 'UserNotFoundError';
  }
}

// ✅ BOM - try/catch com log
try {
  await createUser(data);
} catch (error) {
  logger.error('Failed to create user', { error, data });
  throw new UserCreationError('Unable to create user', { cause: error });
}

// ❌ RUIM - catch vazio
try {
  await createUser(data);
} catch (error) {
  // silenciosamente ignora erro
}
```

## Imports

```typescript
// ✅ BOM - imports organizados
// 1. Externos
import { useState, useEffect } from 'react';
import { z } from 'zod';

// 2. Internos (aliases)
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/utils/date';

// 3. Relativos
import { UserCard } from './UserCard';
import type { UserProps } from './types';

// ❌ RUIM - imports relativos profundos
import { Button } from '../../../components/ui/Button';
```

## React/Next.js

### Componentes

```typescript
// ✅ BOM - functional components com tipos
interface UserProfileProps {
  userId: string;
  showEmail?: boolean;
}

export function UserProfile({ userId, showEmail = false }: UserProfileProps) {
  // implementação
}

// ✅ BOM - hooks no topo
export function UserProfile({ userId }: UserProfileProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // efeito
  }, [userId]);

  // render
}
```

### Hooks Customizados

```typescript
// ✅ BOM - prefixo 'use'
export function useUser(userId: string) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // lógica

  return { user, loading };
}
```

## Comentários

```typescript
// ✅ BOM - comentários explicam "por quê", não "o quê"
// Retry 3x porque a API externa é instável
const MAX_RETRY_ATTEMPTS = 3;

// ✅ BOM - JSDoc para funções públicas
/**
 * Cria um novo usuário no sistema.
 * @param data - Dados do usuário
 * @returns Promise com o usuário criado
 * @throws {UserCreationError} Se a criação falhar
 */
export async function createUser(data: CreateUserInput): Promise<User> { }

// ❌ RUIM - comentários óbvios
// Incrementa o contador
counter++;

// Retorna o usuário
return user;
```

## Formatação

- **Indentação**: 2 espaços
- **Aspas**: simples `'` para strings
- **Ponto e vírgula**: obrigatório
- **Trailing comma**: sempre em objetos/arrays multi-linha
- **Prettier**: configurado para formatar automaticamente

## Linting

- **ESLint**: configurado com regras do projeto
- **TypeScript**: strict mode habilitado
- Todos os warnings devem ser resolvidos antes do commit

## Testes

```typescript
// ✅ BOM - testes descritivos
describe('UserService', () => {
  describe('createUser', () => {
    it('should create user with valid data', async () => {
      // arrange
      const data = { email: 'test@example.com', name: 'Test' };

      // act
      const user = await createUser(data);

      // assert
      expect(user.email).toBe(data.email);
    });

    it('should throw error when email is invalid', async () => {
      const data = { email: 'invalid', name: 'Test' };

      await expect(createUser(data)).rejects.toThrow(ValidationError);
    });
  });
});
```

## Referências

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Next.js Documentation](https://nextjs.org/docs)
