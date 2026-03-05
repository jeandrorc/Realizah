# 1. Registrar Decisões Arquiteturais

**Data:** 2026-03-04

**Status:** Aceita

## Contexto

Precisamos de uma forma de documentar decisões arquiteturais importantes do projeto Realizah. À medida que o projeto evolui, é fundamental ter um histórico claro de:

- Por que certas decisões foram tomadas
- Quais alternativas foram consideradas
- Qual era o contexto na época da decisão
- Quais são as consequências esperadas

Sem essa documentação, perdemos contexto valioso e corremos o risco de:

- Repetir discussões já resolvidas
- Desfazer decisões sem entender o motivo original
- Dificultar a integração de novos membros do time
- Perder conhecimento quando pessoas saem do projeto

## Decisão

Decidimos usar Architecture Decision Records (ADRs) para documentar decisões arquiteturais significativas no projeto Realizah.

Cada ADR será:

- Armazenado em `docs/adr/` com numeração sequencial
- Nomeado como `NNNN-titulo-da-decisao.md`
- Escrito seguindo o template em `docs/adr/0000-template.md`
- Imutável após aceito (novas decisões criam novos ADRs)

## Consequências

### Positivas

- Histórico claro de decisões arquiteturais
- Contexto preservado para futuras discussões
- Facilita onboarding de novos membros
- Evita retrabalho e discussões repetidas
- Melhora a comunicação assíncrona

### Negativas

- Overhead adicional ao tomar decisões (tempo para documentar)
- Requer disciplina para manter atualizado
- Pode gerar documentação desatualizada se não mantida

### Neutras

- ADRs são imutáveis; decisões que mudam requerem novos ADRs
- Nem toda decisão técnica precisa de ADR (apenas as significativas)

## Alternativas Consideradas

### Wiki ou Confluence

Ferramentas wiki são flexíveis, mas:

- Documentos podem ser editados sem histórico claro
- Difícil rastrear evolução de decisões
- Menos integrado com o código

### Comentários no código

Comentários são úteis para detalhes de implementação, mas:

- Não capturam o contexto completo
- Difícil de encontrar e navegar
- Não adequado para decisões de alto nível

### Sem documentação formal

Confiar apenas em comunicação oral ou chat:

- Conhecimento se perde com o tempo
- Difícil para novos membros
- Não escalável

## Notas

Este ADR é baseado no formato proposto por Michael Nygard em seu artigo "Documenting Architecture Decisions" (http://thinkrelevance.com/blog/2011/11/15/documenting-architecture-decisions).

ADRs devem ser criados para decisões que:

- Afetam a estrutura do sistema
- São difíceis de reverter
- Têm impacto significativo no projeto
- Geram debate ou têm múltiplas alternativas válidas

Decisões menores ou táticas não precisam de ADR.
