# 🔄 Guia de REPL Loop - Desenvolvimento Iterativo

**REPL:** Read-Eval-Print Loop (Ler-Executar-Imprimir-Repetir)  
**Conceito:** Desenvolvimento contínuo e iterativo com feedback constante  
**Data:** 2026-03-05

---

## 🎯 O que é REPL Loop?

REPL Loop é um ciclo de desenvolvimento onde o agente:

1. **READ** (Ler): Recebe uma instrução ou feedback
2. **EVAL** (Executar): Implementa a mudança
3. **PRINT** (Imprimir): Mostra o resultado
4. **LOOP** (Repetir): Aguarda próxima instrução

```
┌─────────────────────────────────────────┐
│  Você: "Adicione validação de email"   │
│  Agente: [implementa]                   │
│  Agente: "✅ Feito! Próximo?"           │
│  Você: "Adicione também validação CPF" │
│  Agente: [implementa]                   │
│  Agente: "✅ Feito! Próximo?"           │
│  Você: "Perfeito, pode commitar"       │
│  Agente: [commit]                       │
└─────────────────────────────────────────┘
```

---

## ✅ Sim, Posso Trabalhar em REPL Loop!

### Capacidades

✅ **Iteração Contínua:** Implemento → Você revisa → Ajusto → Repito  
✅ **Feedback Rápido:** Mudanças pequenas e incrementais  
✅ **Correções Imediatas:** Erro? Corrijo na hora  
✅ **Refinamento:** Melhoro até você aprovar  
✅ **Commits Incrementais:** Posso commitar a cada iteração ou no final

### Limitações

⚠️ **Contexto:** Mantenho contexto da conversa atual (não entre sessões)  
⚠️ **Complexidade:** Para tarefas muito grandes, melhor quebrar em partes  
⚠️ **Tempo:** Cada iteração consome tempo, planeje bem

---

## 🎯 Como Usar REPL Loop

### Modo 1: Iteração Livre (Recomendado)

```
Você: Vou trabalhar em REPL loop. Implemente o MercadoPagoService.

Agente: ✅ [implementa MercadoPagoService básico]
        Implementei a estrutura básica. O que ajustar?

Você: Adicione método de checkout PIX.

Agente: ✅ [adiciona checkout PIX]
        Adicionei checkout PIX. Próximo?

Você: Adicione validação de valor mínimo.

Agente: ✅ [adiciona validação]
        Validação adicionada. Mais alguma coisa?

Você: Perfeito! Pode commitar.

Agente: ✅ [commit]
        Commitado! Próxima task?
```

---

### Modo 2: Checklist Iterativa

```
Você: Vou trabalhar em REPL loop. Checklist:
      1. Criar MercadoPagoService
      2. Adicionar checkout PIX
      3. Adicionar checkout cartão
      4. Adicionar webhooks

      Faça 1 por vez e aguarde meu OK.

Agente: ✅ [implementa 1]
        ✅ Item 1 completo. Posso prosseguir para item 2?

Você: OK, próximo.

Agente: ✅ [implementa 2]
        ✅ Item 2 completo. Posso prosseguir para item 3?

Você: Ajuste o item 2: adicione timeout de 30s.

Agente: ✅ [ajusta item 2]
        ✅ Ajustado! Agora posso prosseguir para item 3?

Você: Sim.

Agente: ✅ [implementa 3]
        ✅ Item 3 completo. Posso prosseguir para item 4?
```

---

### Modo 3: TDD Loop (Test-Driven)

```
Você: Vou trabalhar em TDD loop:
      1. Escreva teste para checkout PIX
      2. Implemente até passar
      3. Refatore
      Repita para cada feature.

Agente: ✅ [escreve teste]
        Teste escrito. Executar?

Você: Sim.

Agente: ❌ Teste falhou (esperado). Implementar?

Você: Sim.

Agente: ✅ [implementa]
        ✅ Teste passou! Refatorar?

Você: Sim, extraia helper function.

Agente: ✅ [refatora]
        ✅ Refatorado, testes ainda passam. Próxima feature?
```

---

### Modo 4: Debug Loop

```
Você: Vou trabalhar em debug loop. Erro: [descreve erro]

Agente: 🔍 Analisando...
        Encontrei o problema: [explica]
        Posso corrigir?

Você: Sim.

Agente: ✅ [corrige]
        Corrigido! Testar?

Você: Sim.

Agente: ✅ Teste passou! Mais algum erro?

Você: Sim: [descreve outro erro]

Agente: 🔍 Analisando...
        [continua loop até resolver todos]
```

---

## 📋 Comandos de Controle do Loop

### Comandos Básicos

| Comando                  | Ação                           |
| ------------------------ | ------------------------------ |
| `"OK"` ou `"Próximo"`    | Continue para próxima iteração |
| `"Aguarde"` ou `"Pare"`  | Pause o loop                   |
| `"Volte"` ou `"Desfaça"` | Reverta última mudança         |
| `"Ajuste X"`             | Modifique algo específico      |
| `"Commit"`               | Finalize e commite             |
| `"Cancele"`              | Descarte tudo                  |

### Comandos Avançados

| Comando         | Ação                  |
| --------------- | --------------------- |
| `"Mostre diff"` | Exiba mudanças        |
| `"Explique"`    | Explique o que fez    |
| `"Teste"`       | Execute testes        |
| `"Lint"`        | Execute linter        |
| `"Revise"`      | Auto-revise o código  |
| `"Documente"`   | Adicione documentação |

---

## 💡 Exemplos Práticos

### Exemplo 1: Implementação Incremental

```markdown
Você: Vou trabalhar em REPL loop. Implemente o checkout PIX.

Agente: ✅ Implementei estrutura básica do checkout PIX: - Endpoint POST /checkout/pix - Validação
de input - Retorna QR Code (mock)

        O que ajustar?

Você: Integre com SDK real do Mercado Pago.

Agente: ✅ Integrado com SDK: - Instalei mercadopago SDK - Configurei credenciais - Gera QR Code
real

        Testar?

Você: Sim, teste com valor R$ 100.

Agente: ✅ Testado: - QR Code gerado: [exibe] - PIX key: [exibe] - Expira em: 30min

        Mais alguma coisa?

Você: Adicione polling de status.

Agente: ✅ Polling adicionado: - Endpoint GET /checkout/pix/:id/status - Atualiza a cada 5s -
Timeout 10min

        Pronto para commit?

Você: Sim, commite.

Agente: ✅ Commitado! feat(mercado-pago): add pix checkout with polling

        Próxima feature?
```

---

### Exemplo 2: Refinamento Iterativo

```markdown
Você: Vou trabalhar em REPL loop. Melhore a UX do checkout.

Agente: ✅ Melhorias aplicadas: 1. Adicionei loading spinner 2. Mensagens de erro mais claras 3.
Botão de retry

        O que mais?

Você: Adicione animação no loading.

Agente: ✅ Animação adicionada (fade + pulse). Gostou?

Você: Sim, mas mude a cor para azul.

Agente: ✅ Cor alterada para azul (#0066FF). Melhor?

Você: Perfeito! Adicione também toast de sucesso.

Agente: ✅ Toast adicionado (verde, 3s, auto-dismiss). Mais alguma coisa?

Você: Não, pode commitar.

Agente: ✅ Commitado! feat(checkout): improve ux with animations and toasts
```

---

### Exemplo 3: Debug Iterativo

```markdown
Você: Vou trabalhar em debug loop. Erro: "Payment failed"

Agente: 🔍 Analisando logs... Encontrei: Timeout na API do Mercado Pago. Causa provável: Timeout
muito curto (5s).

        Aumentar para 30s?

Você: Sim.

Agente: ✅ Timeout aumentado para 30s. Testar novamente?

Você: Sim.

Agente: ✅ Teste passou! Mas encontrei outro problema: Webhook não está sendo recebido.

        Investigar?

Você: Sim.

Agente: 🔍 Analisando... Problema: URL do webhook está incorreta. Deveria ser:
https://api.realizah.com/webhooks/mercadopago Está: http://api.realizah.com/webhooks/mercadopago

        Corrigir?

Você: Sim.

Agente: ✅ Corrigido! Webhook agora funciona. Mais algum erro?

Você: Não, tudo funcionando!

Agente: ✅ Ótimo! Commitar as correções?

Você: Sim.

Agente: ✅ Commitado! fix(mercado-pago): increase timeout and fix webhook url
```

---

## 🎯 Estratégias de REPL Loop

### 1. Baby Steps (Passos Pequenos)

```
Iteração 1: Estrutura básica
Iteração 2: Validação de input
Iteração 3: Integração com API
Iteração 4: Error handling
Iteração 5: Testes
Iteração 6: Documentação
Iteração 7: Commit
```

**Vantagem:** Controle total, fácil reverter  
**Desvantagem:** Mais iterações

---

### 2. Feature Complete (Feature Completa)

```
Iteração 1: Implementa feature completa
Iteração 2: Ajustes baseados em feedback
Iteração 3: Refinamentos finais
Iteração 4: Commit
```

**Vantagem:** Mais rápido  
**Desvantagem:** Menos controle

---

### 3. TDD Loop (Test-Driven)

```
Iteração 1: Escreve teste
Iteração 2: Implementa (red → green)
Iteração 3: Refatora
Iteração 4: Repete para próximo teste
Iteração N: Commit quando todos passam
```

**Vantagem:** Alta qualidade, testes garantidos  
**Desvantagem:** Mais lento

---

### 4. Spike and Stabilize (Exploração e Estabilização)

```
Fase 1 - Spike (rápido e sujo):
  Iteração 1: Implementação rápida
  Iteração 2: Teste manual
  Iteração 3: Validação de conceito

Fase 2 - Stabilize (limpar e polir):
  Iteração 4: Refatoração
  Iteração 5: Adicionar testes
  Iteração 6: Documentação
  Iteração 7: Commit
```

**Vantagem:** Valida ideias rapidamente  
**Desvantagem:** Requer refatoração

---

## 📊 Métricas de REPL Loop

### KPIs

| Métrica               | Meta   | Como Medir                    |
| --------------------- | ------ | ----------------------------- |
| Iterações por Feature | 3-5    | Contar iterações              |
| Tempo por Iteração    | < 5min | Cronometrar                   |
| Taxa de Aprovação     | > 80%  | Aprovadas / Total             |
| Retrabalho            | < 20%  | Iterações de correção / Total |

---

## ✅ Boas Práticas

### 1. Comunicação Clara

```
✅ BOM: "Adicione validação de email"
❌ RUIM: "Melhore a validação"

✅ BOM: "Mude cor do botão para azul (#0066FF)"
❌ RUIM: "Mude a cor"

✅ BOM: "Aumente timeout para 30s"
❌ RUIM: "Ajuste o timeout"
```

---

### 2. Feedback Específico

```
✅ BOM: "O loading está muito lento, reduza para 2s"
❌ RUIM: "Não gostei do loading"

✅ BOM: "Erro na linha 42: variável não definida"
❌ RUIM: "Tem um erro aí"
```

---

### 3. Commits Incrementais

```
Opção A - Commit por Feature:
  Iteração 1-5: Implementa feature
  Iteração 6: Commit

Opção B - Commit por Iteração:
  Iteração 1: Implementa → Commit
  Iteração 2: Ajusta → Commit
  Iteração 3: Refina → Commit

Opção C - Commit no Final:
  Iteração 1-10: Implementa tudo
  Iteração 11: Commit único
```

**Recomendação:** Opção A (commit por feature completa)

---

## 🚀 Template de Solicitação

### Template Básico

```markdown
Vou trabalhar em REPL loop.

Task: [Descreva a task]

Instruções:

- Faça pequenas iterações
- Aguarde meu feedback a cada iteração
- Não commite até eu pedir

Pode começar?
```

---

### Template com Checklist

```markdown
Vou trabalhar em REPL loop com checklist:

1. [ ] [Item 1]
2. [ ] [Item 2]
3. [ ] [Item 3]

Faça 1 por vez, aguarde meu OK antes de prosseguir.

Pode começar com item 1?
```

---

### Template TDD

```markdown
Vou trabalhar em TDD loop:

Feature: [Nome da feature]

Para cada sub-feature:

1. Escreva teste
2. Implemente (red → green)
3. Refatore
4. Aguarde meu OK

Pode começar?
```

---

## 💡 Exemplo Completo: Mercado Pago em REPL Loop

```markdown
Você: Vou trabalhar em REPL loop. Implemente checkout PIX.

Agente: ✅ Estrutura básica criada: - Endpoint POST /checkout/pix - Validação de input (amount,
customerId) - Retorna mock { qrCode, pixKey }

        Próximo passo?

Você: Integre com SDK real.

Agente: ✅ SDK integrado: - Instalado mercadopago@2.0.0 - Configurado credenciais - Gera QR Code
real

        Testar?

Você: Sim, teste com R$ 100.

Agente: ✅ Teste realizado: QR Code: [base64 string] PIX Key: 00020126... Expira: 2026-03-05
12:30:00

        Funcionou! Próximo?

Você: Adicione polling de status.

Agente: ✅ Polling implementado: - GET /checkout/pix/:id/status - Intervalo: 5s - Timeout: 10min -
Retorna: { status: 'pending' | 'paid' | 'expired' }

        Testar polling?

Você: Sim.

Agente: ✅ Polling testado: - Status inicial: pending - Após 30s: paid (simulado) - Funciona
corretamente

        Adicionar mais alguma coisa?

Você: Adicione webhook para atualizar status.

Agente: ✅ Webhook implementado: - POST /webhooks/mercadopago - Valida assinatura - Atualiza status
no banco - Emite evento payment.updated

        Testar webhook?

Você: Sim, simule pagamento.

Agente: ✅ Webhook testado: - Pagamento simulado - Status atualizado: paid - Evento emitido -
Funciona!

        Pronto para commit?

Você: Sim, commite.

Agente: ✅ Commitado!

        feat(mercado-pago): add pix checkout with polling and webhooks

        - Implement PIX checkout endpoint
        - Integrate with Mercado Pago SDK
        - Add status polling (5s interval, 10min timeout)
        - Add webhook handler with signature validation
        - Emit payment.updated event

        Próxima feature?

Você: Agora implemente checkout cartão.

Agente: ✅ Iniciando checkout cartão... [continua o loop]
```

---

## 📞 Resumo

**Sim, posso trabalhar em REPL loop!**

**Como usar:**

1. Diga: "Vou trabalhar em REPL loop"
2. Dê a primeira instrução
3. Eu implemento e aguardo feedback
4. Você revisa e dá próxima instrução
5. Repete até finalizar
6. Você pede commit

**Vantagens:**

- ✅ Controle total
- ✅ Feedback constante
- ✅ Ajustes imediatos
- ✅ Qualidade alta

**Quando usar:**

- ✅ Features complexas que precisam refinamento
- ✅ Quando você quer acompanhar cada passo
- ✅ Debug iterativo
- ✅ Aprendizado (você vê o processo)

---

**Pronto para começar?** Basta dizer:

```
"Vou trabalhar em REPL loop. [Descreva a task]"
```

E eu inicio o ciclo! 🔄

---

**Última atualização:** 2026-03-05  
**Versão:** 1.0
