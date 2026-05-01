# InboxAI — Arquitetura

Documento técnico explicando as camadas, fluxos críticos e decisões de design do boilerplate.

## Visão de alto nível

```
┌─────────────────────────────────────────────────────────────┐
│                      USUÁRIO FINAL                          │
│                  (cliente do nosso cliente)                 │
└──────────┬───────────────────────────────────┬──────────────┘
           │ WhatsApp                          │
           ▼                                   ▼
   ┌──────────────┐                    ┌──────────────┐
   │ Evolution API│                    │   Web App    │
   │  (Docker/VPS)│                    │  (Next.js)   │
   └──────┬───────┘                    └──────┬───────┘
          │ webhook                            │ useQuery / useMutation
          ▼                                    ▼
       ┌──────────────────────────────────────────┐
       │                CONVEX                    │
       │  ┌─────────┐ ┌─────────┐ ┌────────────┐ │
       │  │ schema  │ │ queries │ │ mutations  │ │
       │  └─────────┘ └─────────┘ └────────────┘ │
       │  ┌──────────────────────────────────┐   │
       │  │    actions (lado externo)        │   │
       │  │  - chamar Anthropic              │   │
       │  │  - mandar msg via Evolution      │   │
       │  │  - integrar Stripe/Clerk webhook │   │
       │  └──────────────────────────────────┘   │
       └────────────┬─────────────────────────────┘
                    │
        ┌───────────┼───────────────┐
        ▼           ▼               ▼
  ┌──────────┐ ┌──────────┐  ┌──────────┐
  │Anthropic │ │  Stripe  │  │  Clerk   │
  │   API    │ │          │  │          │
  └──────────┘ └──────────┘  └──────────┘
```

## Camadas

### 1. Web App (Next.js)
- **Pure UI** — só renderiza estado e dispara mutations.
- Server Components puxam dado direto do Convex (sem API intermediária).
- Client Components só onde precisa interatividade (drag-drop kanban, formulário com validação live).
- Auth via Clerk middleware.

### 2. Convex (núcleo)
Coração do sistema. Convex resolve 3 coisas que normalmente exigem 3 ferramentas separadas:

- **Banco** — tabelas com schema Zod-like, indexes automáticos.
- **Funções** — queries (read), mutations (write atômico), actions (side-effect / chamada externa).
- **Realtime** — toda query é subscription. Front atualiza sozinho quando dado muda.

**Por que Convex e não Postgres + API?** Porque pra esse tipo de produto (CRM com inbox) realtime é essencial e cabling Postgres + Pusher/Ably + API REST custa 3 semanas. Convex faz em 0.

### 3. Evolution API (WhatsApp)
- Container Docker self-hosted.
- Recebe mensagens do WhatsApp e dispara webhook pra `/convex/http/whatsapp-webhook`.
- Envia mensagens via API REST quando Convex action chama.
- **Por que self-host?** Twilio cobra por mensagem (R$ 0.10+ cada). Em escala, Evolution self-host fica em ~R$ 25/mês fixo.

### 4. Anthropic Claude
- Chamada via Convex action (nunca direto do client — chave secreta).
- Modelo: `claude-sonnet-4-7` (default), com fallback pra `claude-haiku-4-5` em prompts simples (classificação).
- Prompt caching habilitado: o "system prompt do agente" tem 4k tokens fixos com instruções da org. Cacheado = 90% de desconto a partir da 2ª mensagem.

## Fluxos críticos

### Fluxo A: Recebimento de mensagem nova

```
1. Cliente final manda "Oi, quero saber sobre o plano" no WhatsApp
2. Evolution API recebe, dispara webhook POST /convex/http/whatsapp-webhook
3. Convex http handler:
   3.1. Valida assinatura HMAC do webhook
   3.2. Resolve qual org dona desse número (lookup em `instance`)
   3.3. Resolve ou cria `contact` (chave: número + org)
   3.4. Cria `message` na tabela
   3.5. Schedula action `processIncomingMessage` (não-bloqueante)
4. Action processIncomingMessage:
   4.1. Busca histórico das últimas 20 msgs da conversa
   4.2. Busca config do agente IA da org
   4.3. Monta prompt: system (cacheado) + histórico + msg nova
   4.4. Chama Anthropic
   4.5. Parser do retorno: { intent, response_text, should_escalate, extracted_data }
   4.6. Se should_escalate: marca conversa como "needs_human", notifica
   4.7. Se não: cria mutation pra criar `message` outbound
5. Outra action: sendOutboundMessage
   5.1. Lê msg outbound recém criada
   5.2. POST pra Evolution API
   5.3. Marca msg como "sent"
6. Front (já com subscription ativa via useQuery) re-renderiza inbox em realtime.
```

**Tempo total típico:** 1.5-3 segundos do recebimento à resposta.

### Fluxo B: Qualificação por agente IA

Acontece em paralelo ao A, sempre na primeira interação:

```
1. Mensagem nova de contato sem qualificação
2. Action classifyContact (rodando junto com o response)
3. Prompt: "Dado [info do negócio] e essa msg, classifique o lead em: hot/warm/cold + budget_estimate + interest_topic"
4. Resposta JSON validada com Zod
5. Mutation atualiza `contact.classification`
6. Se classificação = hot: cria `deal` automaticamente no pipeline com stage = "novo"
7. Notifica humano via push se classificação = hot
```

### Fluxo C: Pipeline de deal (drag-and-drop)

```
1. Humano arrasta card de "Qualificado" pra "Proposta"
2. dnd-kit dispara onDragEnd com (dealId, newStage)
3. useMutation chama mutation `moveDealStage` no Convex
4. Mutation:
   4.1. Valida permissão (role da org)
   4.2. Atualiza deal.stage
   4.3. Insere registro em `deal_history` (auditoria)
   4.4. Schedula action de side-effect (ex: webhook pra cliente externo, msg automática se config)
5. Subscription re-renderiza pra todos os usuários da org (em tempo real)
```

## Decisões de arquitetura

### Decisão 1: Convex em vez de Supabase + Postgres
**Contexto:** Precisava de banco + realtime + funções serverless.
**Alternativas:** Supabase, Postgres + Hasura, Postgres + tRPC + Pusher.
**Decisão:** Convex.
**Motivo:** Realtime é first-class (subscription automática em queries), funções com transação, schema tipado fim-a-fim. Trade-off: vendor lock-in (Convex Cloud), mas o ROI em produtividade > custo de eventual migração.
**Quando reverter:** Se o cliente precisar de Postgres por compliance regulatório (LGPD muito específica, exigência de cliente bancário). Aí Supabase faz sentido.

### Decisão 2: Evolution API self-host em vez de Twilio
**Contexto:** Mandar/receber WhatsApp.
**Alternativas:** Twilio WhatsApp, Z-API, Wati, Meta Cloud API.
**Decisão:** Evolution API self-host.
**Motivo:** Custo previsível (R$ 25/mês fixo até 1 instância). Twilio em volume sai caro (R$ 0.10/msg outbound). Meta Cloud API tem fila de aprovação chata pra template messages.
**Trade-off:** Você é responsável por uptime do VPS. Mitigação: docker-compose com healthcheck + auto-restart, alerta UptimeRobot grátis.

### Decisão 3: Multi-tenant no schema (org_id em toda tabela)
**Contexto:** SaaS B2B com várias orgs.
**Alternativas:** DB por tenant, schema por tenant, row-level multi-tenant.
**Decisão:** Row-level (campo `orgId` em toda tabela + index).
**Motivo:** Convex não tem schemas por DB. Row-level é simples, escala até 10k orgs sem problema. Toda query começa com `.withIndex("by_org", q => q.eq("orgId", org))`.
**Trade-off:** Bug em query pode vazar dado entre orgs. Mitigação: helper `requireOrg(ctx)` em todas queries + teste e2e que tenta acessar dado de outra org.

### Decisão 4: Server Components por padrão, Client só quando precisa
**Contexto:** Next.js 15 App Router.
**Decisão:** RSC por padrão.
**Motivo:** Reduz JS no client. Pra inbox/pipeline (dashboards) com muito dado, isso impacta TTI em segundos.
**Trade-off:** Realtime exige client (`useQuery` do Convex). Solução: pages são RSC, mas componentes "vivos" (lista de mensagens, kanban) são client.

### Decisão 5: Clerk em vez de auth próprio
**Contexto:** Auth + multi-tenant + billing.
**Alternativas:** NextAuth, Clerk, Auth.js + Stripe próprio.
**Decisão:** Clerk + Stripe.
**Motivo:** Clerk Organizations já resolve multi-tenant + invites + roles + 2FA. Implementar isso do zero leva 2-3 sprints. Clerk custa US$ 25/mês após 10k MAU — ainda barato.
**Trade-off:** Vendor lock-in. Aceitável.

## Pontos de atenção pra produção

1. **Rate limit Anthropic** — Tier 1 dá 50 RPM. Em pico pode estourar. Implementar fila com `pscheduler` (Convex tem helper). Ou mover pra Tier 2 (~US$ 100 spend mínimo).
2. **Evolution API uptime** — usa docker-compose com `restart: always` + healthcheck. Configurar UptimeRobot pra alertar se cair.
3. **LGPD** — mensagens contêm dados pessoais. Adicione TTL nas msgs (ex: deletar após 12 meses). Tem `convex/scheduledTasks.ts` com cron pra isso.
4. **Backup Convex** — Convex faz snapshot automático, mas exporte semanalmente pra S3 do cliente como prova adicional de backup.
5. **Custo Anthropic em escala** — monitora `tokenUsage` por org. Se 1 org passa de 1M tokens/mês, alerta + revisa prompt (provável que esteja vazando contexto).

## Métricas que importam (instrumentadas via PostHog)

- **TTR (time to response)** — tempo do recebimento à resposta. Meta: <3s.
- **Auto-resolve rate** — % de conversas resolvidas só pelo agente. Meta: >65%.
- **Escalation rate** — % de conversas escaladas pra humano. Meta: <30%.
- **Lead-to-deal conversion** — % de contatos novos que viram deal. Meta: depende do nicho.
- **Custo por mensagem (Anthropic)** — meta: <R$ 0.05 por msg processada.

## Diagrama de dados (resumo)

```
org (1) ──< (N) user
org (1) ──< (N) contact
contact (1) ──< (N) message
contact (1) ──< (N) deal
deal (1) ──< (N) deal_history
org (1) ──< (N) instance (whatsapp)
org (1) ──< (1) agent_config
```

Ver schema completo em `convex/schema.ts`.
