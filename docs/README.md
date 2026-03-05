# Documentação Realizah

Índice geral da documentação do projeto.

## Estrutura

### [Plans](plans/)
Design docs e planos de implementação. Documentos que descrevem decisões arquiteturais de alto nível e roadmap de implementação.

### [ADR - Architecture Decision Records](adr/)
Registro de decisões arquiteturais significativas. Cada ADR documenta o contexto, a decisão tomada e as consequências.

### [Specs - Especificações Técnicas](specs/)
Especificações detalhadas de módulos, APIs e funcionalidades. Documentação técnica para implementação.

### [Conventions - Convenções](conventions/)
Padrões de código, workflow Git, nomenclatura de APIs e outras convenções do projeto.

## Navegação Rápida

| Documento | Descrição |
|-----------|-----------|
| [Monorepo Architecture Design](plans/2026-03-04-monorepo-architecture-design.md) | Decisão arquitetural principal do projeto |
| [Code Style](conventions/code-style.md) | Padrões de código TypeScript/React |
| [Git Workflow](conventions/git-workflow.md) | Estratégia de branching e commits |
| [API Naming](conventions/api-naming.md) | Convenções para nomenclatura de APIs |

## Contribuindo com a Documentação

- Mantenha documentos concisos e acionáveis
- Use exemplos concretos sempre que possível
- Atualize o índice ao adicionar novos documentos
- Siga o formato Markdown padrão
- Inclua diagramas Mermaid quando apropriado

## Convenções de Nomenclatura

- **Plans**: `YYYY-MM-DD-nome-descritivo.md`
- **ADRs**: `NNNN-titulo-da-decisao.md` (numeração sequencial)
- **Specs**: `nome-do-modulo.md` ou `nome-da-feature.md`
- **Conventions**: `nome-da-convencao.md`
