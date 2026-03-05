# Guia de Contribuição

Obrigado por contribuir com o Realizah! Este guia ajudará você a entender nosso processo de desenvolvimento.

## Índice

- [Código de Conduta](#código-de-conduta)
- [Como Começar](#como-começar)
- [Workflow de Desenvolvimento](#workflow-de-desenvolvimento)
- [Padrões de Código](#padrões-de-código)
- [Processo de Pull Request](#processo-de-pull-request)
- [Code Review](#code-review)
- [Responsabilidades](#responsabilidades)

## Código de Conduta

- Seja respeitoso e profissional
- Aceite críticas construtivas
- Foque no que é melhor para o projeto
- Mostre empatia com outros contribuidores

## Como Começar

### 1. Setup do Ambiente

```bash
# Clone o repositório
git clone <repo-url>
cd Realizah

# Instale dependências (use pnpm!)
pnpm install

# Configure variáveis de ambiente
cp .env.example .env
# Edite .env com suas configurações locais

# Rode migrations
pnpm --filter medusa migration:run

# Inicie o desenvolvimento
pnpm dev
```

### 2. Estrutura do Projeto

Familiarize-se com:

- [`README.md`](README.md) — visão geral do projeto
- [`CLAUDE.md`](CLAUDE.md) — contexto e comandos principais
- [`docs/`](docs/) — documentação completa
- [`docs/conventions/`](docs/conventions/) — padrões de código e workflow

### 3. Ferramentas Necessárias

- **Node.js**: v20+
- **pnpm**: v8+
- **PostgreSQL**: v15+
- **Git**: v2.30+

## Workflow de Desenvolvimento

### 1. Escolher uma Issue

- Procure issues com label `good first issue` para começar
- Comente na issue que você vai trabalhar nela
- Aguarde confirmação de um maintainer

### 2. Criar Branch

```bash
# Atualizar main
git checkout main
git pull origin main

# Criar branch
git checkout -b feature/nome-descritivo
# ou
git checkout -b fix/nome-do-bug
```

### 3. Desenvolver

- Faça commits atômicos e frequentes
- Siga [Conventional Commits](https://www.conventionalcommits.org/)
- Escreva testes para novas features
- Atualize documentação se necessário

```bash
# Exemplo de commits
git add src/modules/subscription/
git commit -m "feat(subscription): add plan creation endpoint"

git add src/modules/subscription/__tests__/
git commit -m "test(subscription): add plan creation tests"
```

### 4. Testar

```bash
# Rodar testes
pnpm test

# Lint
pnpm lint

# Type check
pnpm type-check

# Build (para garantir que não quebrou nada)
pnpm build
```

### 5. Atualizar com Main

Antes de abrir PR, atualize sua branch:

```bash
git checkout main
git pull origin main
git checkout feature/nome-descritivo
git rebase main

# Resolver conflitos se houver
git rebase --continue
```

### 6. Push e PR

```bash
# Push da branch
git push origin feature/nome-descritivo

# Abrir PR no GitHub
# Use o template de PR
```

## Padrões de Código

### TypeScript

- **Strict mode** habilitado
- Tipos explícitos em funções públicas
- Evite `any`, use `unknown` quando necessário
- Prefira `interface` para objetos, `type` para unions

### React/Next.js

- Use functional components
- Hooks no topo do componente
- Server Components por padrão (Next.js 15)
- `'use client'` explícito quando necessário

### Commits

Formato: `type(scope): description`

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `ci`

**Scopes**: `storefront`, `medusa`, `subscription`, `course`, `access-control`, `digital-delivery`, `types`, `utils`

Veja detalhes em [`docs/conventions/git-workflow.md`](docs/conventions/git-workflow.md).

### Nomenclatura

- **Arquivos**: `PascalCase.tsx` para componentes, `camelCase.ts` para utilitários
- **Variáveis**: `camelCase`
- **Componentes/Classes**: `PascalCase`
- **Constantes**: `UPPER_SNAKE_CASE`
- **Booleanos**: prefixo `is`, `has`, `should`, `can`

Veja detalhes em [`docs/conventions/code-style.md`](docs/conventions/code-style.md).

## Processo de Pull Request

### Template de PR

Ao abrir um PR, preencha o template com:

1. **Descrição**: o que o PR faz
2. **Motivação**: por que essa mudança é necessária
3. **Mudanças**: lista de alterações principais
4. **Testes**: como testar as mudanças
5. **Checklist**: itens obrigatórios

### Checklist do PR

Antes de marcar PR como pronto:

- [ ] Código segue os padrões do projeto
- [ ] Testes adicionados/atualizados
- [ ] Todos os testes passam (`pnpm test`)
- [ ] Lint passa (`pnpm lint`)
- [ ] Type check passa (`pnpm type-check`)
- [ ] Build passa (`pnpm build`)
- [ ] Documentação atualizada (se necessário)
- [ ] Commits seguem Conventional Commits
- [ ] Branch atualizada com `main`

### Tamanho do PR

- **Ideal**: < 400 linhas de código
- **Máximo**: < 1000 linhas
- Se maior, considere dividir em múltiplos PRs

### Descrição

Seja claro e completo:

```markdown
## Descrição
Adiciona endpoint para criação de planos de assinatura.

## Motivação
Necessário para permitir que admins criem planos customizados.

## Mudanças
- Adiciona `POST /admin/subscriptions/plans`
- Adiciona validação de dados do plano
- Adiciona testes unitários e de integração
- Atualiza documentação da API

## Como Testar
1. Inicie o servidor: `pnpm --filter medusa dev`
2. Faça POST para `/admin/subscriptions/plans` com:
   ```json
   {
     "name": "Pro",
     "price": 9900,
     "interval": "monthly"
   }
   ```
3. Verifique que o plano foi criado

## Screenshots (se aplicável)
[imagens]

## Issues Relacionadas
Closes #123
```

## Code Review

### Para Revisores

**O que revisar:**

- [ ] Código segue os padrões do projeto
- [ ] Lógica está correta e eficiente
- [ ] Testes cobrem casos principais e edge cases
- [ ] Documentação está clara e atualizada
- [ ] Não há código duplicado
- [ ] Não há vulnerabilidades de segurança
- [ ] Performance é adequada
- [ ] Nomenclatura é clara

**Como revisar:**

- Seja construtivo e respeitoso
- Explique o "por quê" das sugestões
- Aponte aspectos positivos também
- Sugira alternativas quando aplicável
- Use "nit:" para comentários menores
- Aprove quando estiver satisfeito

**SLA de Review:**

- Primeira revisão: **1 dia útil**
- Revisões subsequentes: **4 horas**

### Para Autores

**Respondendo a comentários:**

- Responda todos os comentários
- Faça mudanças solicitadas ou explique por que não
- Marque conversas como resolvidas quando apropriado
- Peça esclarecimentos se não entender
- Seja receptivo a feedback

**Após aprovação:**

- Faça squash de commits se necessário
- Merge usando a estratégia definida (squash ou rebase)
- Delete a branch após merge

## Responsabilidades

### Maintainers

Pessoas com permissão de merge:

- Revisar PRs em tempo hábil
- Garantir qualidade do código
- Tomar decisões arquiteturais (via ADR)
- Manter documentação atualizada
- Ajudar novos contribuidores

### Contributors

Todos que contribuem:

- Seguir os padrões do projeto
- Escrever código de qualidade
- Testar suas mudanças
- Ser receptivo a feedback
- Ajudar outros contribuidores

### Escalação

**Dúvidas técnicas:**
1. Consulte a documentação em `docs/`
2. Pergunte na issue ou PR
3. Mencione um maintainer

**Decisões arquiteturais:**
1. Abra uma issue para discussão
2. Proponha alternativas
3. Crie um ADR após decisão

**Conflitos:**
1. Tente resolver diretamente
2. Envolva um maintainer
3. Escale para liderança técnica se necessário

## Tipos de Contribuição

### Código

- Novas features
- Correções de bugs
- Refatorações
- Melhorias de performance

### Documentação

- Correções de typos
- Melhorias de clareza
- Novos guias e tutoriais
- Exemplos de código

### Testes

- Novos testes
- Melhoria de cobertura
- Testes de integração
- Testes E2E

### Revisão

- Code review de PRs
- Teste de features
- Validação de bugs

## Recursos

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [Git Workflow](docs/conventions/git-workflow.md)
- [Code Style](docs/conventions/code-style.md)
- [API Naming](docs/conventions/api-naming.md)

## Dúvidas?

- Abra uma issue com label `question`
- Mencione um maintainer
- Consulte a documentação em `docs/`

Obrigado por contribuir! 🚀
