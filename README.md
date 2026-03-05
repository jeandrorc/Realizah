# Realizah

Plataforma híbrida de e-commerce, produtos digitais e assinaturas construída com Medusa v2 e Next.js 15.

> 🚀 **Novo aqui?** Comece por [START-HERE.md](START-HERE.md) para um guia rápido de navegação!

## Visão Geral

Realizah combina múltiplos modelos de negócio em uma única plataforma:

- **E-commerce físico** — produtos com checkout, pedidos e gestão de estoque
- **Produtos digitais** — entrega segura de arquivos (ebooks, templates, etc.)
- **Assinaturas de cursos** — plataforma LMS com controle de acesso por tier
- **Assinaturas de ferramentas** — funcionalidades desbloqueadas por plano (Free/Pro/Premium)

## Stack Tecnológica

| Camada | Tecnologia |
|--------|-----------|
| Monorepo | Turborepo + pnpm workspaces |
| Backend / API | Medusa v2 (Node.js) com módulos customizados |
| Storefront / Área de membros | Next.js 15 (App Router) |
| Pagamentos | Mercado Pago (PIX, boleto, cartão, recorrência) |
| Banco de dados | PostgreSQL |
| Armazenamento | S3-compatible |

## Status do Projeto

🚧 **Em Desenvolvimento - Fase 1**

O projeto está atualmente na **Fase 1: Setup do Monorepo**. A documentação completa está pronta e a implementação está em andamento.

### Fases do Projeto

- **Fase 1** (atual): Setup do Monorepo - [Plano Detalhado](docs/plans/2026-03-04-fase1-setup-monorepo.md)
- **Fase 2**: Subscription Module
- **Fase 3**: Access Control Module  
- **Fase 4**: Course Module + Digital Delivery Module

## Quick Start

⚠️ **Nota**: O projeto ainda não está totalmente configurado. Siga o [guia de setup da Fase 1](docs/plans/QUICK-START-FASE1.md).

Após a Fase 1 estar completa, os comandos serão:

```bash
# Instalar dependências
pnpm install

# Desenvolvimento
pnpm dev

# Build
pnpm build

# Testes
pnpm test

# Lint
pnpm lint
```

## Estrutura do Projeto

```
/
├── apps/
│   ├── storefront/        # Next.js — loja + área de membros
│   └── medusa/            # Medusa v2 — backend principal
├── packages/
│   ├── types/             # Tipos TypeScript compartilhados
│   └── utils/             # Utilitários compartilhados
└── docs/                  # Documentação do projeto
```

## Documentação

A documentação completa está organizada em [`docs/`](docs/):

- **[Roadmap](docs/ROADMAP.md)** — roadmap completo do projeto com todas as fases
- **[Design Docs](docs/plans/)** — decisões arquiteturais e planos de implementação
- **[ADRs](docs/adr/)** — Architecture Decision Records
- **[Especificações](docs/specs/)** — detalhes técnicos dos módulos
- **[Convenções](docs/conventions/)** — padrões de código e workflow

### Guias de Implementação

- **[Fase 1: Setup do Monorepo](docs/plans/2026-03-04-fase1-setup-monorepo.md)** — plano detalhado (atual)
- **[Quick Start Fase 1](docs/plans/QUICK-START-FASE1.md)** — guia rápido de execução

## Contribuindo

Leia o guia [CONTRIBUTING.md](CONTRIBUTING.md) para entender como contribuir com o projeto.

## Módulos Customizados

O backend Medusa é estendido com módulos customizados:

- **subscription-module** — gestão de planos e ciclos de cobrança
- **access-control-module** — controle de acesso por tier
- **course-module** — cursos, módulos, aulas e progresso
- **digital-delivery-module** — entrega segura de arquivos digitais

## Licença

Proprietário - Todos os direitos reservados
