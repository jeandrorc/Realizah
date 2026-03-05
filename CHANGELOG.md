# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [Unreleased]

### Adicionado

- Estrutura inicial do monorepo com Turborepo + pnpm workspaces
- Documentação base do projeto
- Architecture Decision Records (ADRs)
- Convenções de código e workflow
- Estrutura para IA (CLAUDE.md e Cursor rules)
- Templates de governança (CONTRIBUTING.md, PR e issue templates)
- Configuração de controle de versão (commitlint + husky)
- Especificações dos módulos Medusa customizados

### Estrutura

```
/
├── apps/
│   ├── storefront/        # Next.js (a ser implementado)
│   └── medusa/            # Medusa v2 (a ser implementado)
├── packages/
│   ├── types/             # Tipos compartilhados (a ser implementado)
│   └── utils/             # Utilitários (a ser implementado)
├── docs/                  # Documentação completa
├── .cursor/rules/         # Regras do Cursor
├── .github/               # Templates e workflows
└── .husky/                # Git hooks
```

### Decisões Arquiteturais

- ADR 0001: Uso de Architecture Decision Records
- Design: Monorepo MedusaJS + Next.js com módulos customizados

---

## Como Gerar o Changelog

Este arquivo pode ser atualizado automaticamente usando:

```bash
pnpm changelog
```

Ou manualmente seguindo o formato acima.

### Categorias

- **Adicionado** — novas funcionalidades
- **Modificado** — mudanças em funcionalidades existentes
- **Depreciado** — funcionalidades que serão removidas
- **Removido** — funcionalidades removidas
- **Corrigido** — correções de bugs
- **Segurança** — correções de vulnerabilidades

### Formato de Entrada

```markdown
## [Versão] - YYYY-MM-DD

### Adicionado
- Descrição da mudança (#PR)

### Corrigido
- Descrição da correção (#PR)
```

[Unreleased]: https://github.com/realizah/realizah/compare/v0.1.0...HEAD
