# Plans - Design Docs e Planos de Implementação

Esta pasta contém design docs e planos de implementação do projeto Realizah.

## O que são Plans?

Plans são documentos que descrevem:

- Decisões arquiteturais de alto nível
- Planos de implementação de features
- Roadmaps técnicos
- Análises de alternativas

## Formato

### Nomenclatura

`YYYY-MM-DD-nome-descritivo.md`

Exemplo: `2026-03-04-monorepo-architecture-design.md`

### Estrutura Recomendada

```markdown
# Título do Plan

**Data:** YYYY-MM-DD
**Status:** [Proposta | Aprovado | Implementado | Descartado]

---

## Contexto

Descreva o problema ou necessidade que motiva este plan.

## Decisão/Proposta

Descreva a solução proposta.

## Alternativas Consideradas

Liste outras opções avaliadas e por que foram descartadas.

## Consequências

Impactos positivos e negativos da decisão.

## Próximos Passos

- [ ] Ação 1
- [ ] Ação 2
```

## Plans Ativos

| Plan | Status | Descrição |
|------|--------|-----------|
| [2026-03-04-monorepo-architecture-design.md](2026-03-04-monorepo-architecture-design.md) | ✅ Aprovado | Decisão arquitetural: Medusa v2 + Next.js em monorepo |
| [2026-03-04-fase1-setup-monorepo.md](2026-03-04-fase1-setup-monorepo.md) | 🚧 Em Progresso | Plano detalhado de implementação da Fase 1 |
| [QUICK-START-FASE1.md](QUICK-START-FASE1.md) | 📖 Guia | Guia rápido para executar a Fase 1 |

## Roadmap Geral

Para visão completa do projeto, consulte o [Roadmap](../ROADMAP.md).

## Relação com ADRs

Plans são documentos mais amplos e podem gerar múltiplos ADRs. Quando uma decisão arquitetural específica é tomada dentro de um plan, crie um ADR correspondente em [`docs/adr/`](../adr/).

**Diferença:**
- **Plan**: Visão ampla, múltiplas decisões, roadmap
- **ADR**: Decisão específica, imutável, registrada

## Como Criar um Plan

1. **Identifique a necessidade**: feature grande, mudança arquitetural, etc.
2. **Crie o arquivo**: `YYYY-MM-DD-nome-descritivo.md`
3. **Siga o template**: contexto, decisão, alternativas, consequências
4. **Adicione à tabela**: atualize este README
5. **Referencie**: link em outros documentos relevantes

## Planos Futuros

Planos que serão criados conforme o projeto avança:

- [ ] Fase 2: Implementação Subscription Module
- [ ] Fase 3: Implementação Access Control Module
- [ ] Fase 4: Implementação Course Module
- [ ] Fase 5: Implementação Digital Delivery Module
- [ ] Integração Mercado Pago
- [ ] Frontend Storefront Completo
- [ ] CI/CD e Deploy

## Referências

- [Roadmap Completo](../ROADMAP.md)
- [ADRs](../adr/)
- [Especificações](../specs/)
- [Convenções](../conventions/)
