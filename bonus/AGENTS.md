# AGENTS.md — InboxAI

> Este arquivo é lido automaticamente por Codex, Claude Code, Cursor e qualquer agente de IA que abrir o repositório. **Tudo aqui vira contexto permanente do agente.** Por isso, cada linha é deliberada — frase a mais é token a mais e ruído pro modelo.

<!-- DICA: Cada seção abaixo está comentada. Os comentários HTML (<!-- ... -->) NÃO são lidos pelo agente, eles servem só pra você, autor humano. O agente lê o markdown puro. -->

---

## # Objetivo do projeto

InboxAI é um CRM operado por agentes de IA dentro do WhatsApp. Cliente final manda mensagem; nosso agente qualifica, classifica, responde e atualiza o pipeline de deals automaticamente. Operador humano só entra quando o agente pede ajuda ou quando deal vira "negociação".

<!-- POR QUE essa seção existe: o agente precisa saber o "norte" do projeto. Sem isso, ele toma decisões de arquitetura erradas (ex: sugerir um chat genérico ao invés de focar em vendas). 3-4 linhas é o suficiente. Mais que isso vira ruído. -->

---

## # Stack & dependências

- **Frontend:** Next.js 15 (App Router) + React 19 + TypeScript estrito
- **UI:** Tailwind CSS 4 + shadcn/ui (componentes copiados, não como dependência)
- **Backend:** Convex (banco + funções serverless + realtime)
- **Auth:** Clerk
- **WhatsApp:** Evolution API self-hosted (Docker)
- **IA:** Anthropic Claude Sonnet 4.7 via SDK oficial
- **Deploy:** Vercel (front) + Convex Cloud (back) + VPS Hetzner (Evolution)
- **Pagamento:** Stripe (assinatura)
- **Observabilidade:** Sentry + PostHog

<!-- POR QUE explicitar versões: agente desatualizado tende a usar Next.js 13 (Pages Router). Forçando "Next.js 15 App Router" o agente já sabe que é `app/` e não `pages/`. Isso evita 1h de retrabalho por bug. -->

---

## # Comandos importantes

| Comando | O que faz | Quando usar |
|---------|-----------|-------------|
| `npm run dev` | Sobe Next em :3000 + Convex dev | Desenvolvimento local diário |
| `npm run build` | Build de produção (lint + typecheck rodam dentro) | Antes de PR |
| `npm run lint` | ESLint | Pré-commit |
| `npm run typecheck` | `tsc --noEmit` | Sempre que mexer em tipos |
| `npm run test` | Vitest unit | Pré-PR |
| `npm run test:e2e` | Playwright | Pré-deploy |
| `npm run convex:deploy` | Deploy de funções Convex pra prod | Apenas em CI, nunca manual |
| `docker compose up -d evolution` | Sobe Evolution API local | Setup inicial e debugging WhatsApp |

<!-- POR QUE: agente que não sabe os comandos inventa. Ele tenta `yarn start`, `pnpm dev`, etc. Listando aqui de forma exata, ele copia. Adicione coluna "quando usar" porque o agente também precisa saber em que momento rodar cada um. -->

---

## # Regras de código

### Componentes pequenos
Nenhum componente React deve passar de **150 linhas**. Se passar, quebre. Componente grande indica que ele está fazendo mais de uma coisa.

<!-- POR QUE 150: arbitrário, mas força o limite. Sem número, agente faz componentes de 600 linhas. -->

### Sem lógica em JSX
JSX só renderiza. Cálculo, formatação, condicional complexa: extraia pra função pura acima do `return` ou pra hook.

```tsx
// ERRADO
return <span>{deals.filter(d => d.status === 'won').reduce((s, d) => s + d.value, 0).toLocaleString('pt-BR')}</span>

// CERTO
const totalGanhoBRL = formatBRL(sumWonDeals(deals))
return <span>{totalGanhoBRL}</span>
```

### Server Components por padrão
Use `"use client"` só quando precisar de estado, efeito ou evento. Se está só renderizando dado, é Server Component.

### Convex em vez de API routes
Não crie `app/api/*`. Toda lógica de servidor vai em `convex/*.ts` como query/mutation/action. Frontend chama com `useQuery` / `useMutation` do `convex/react`.

<!-- POR QUE: agente adora criar /api/. Você acaba com lógica espalhada em 2 lugares (Convex + Next API). Proibir explicitamente economiza horas. -->

### Validação com Zod
Toda entrada externa (form, webhook, query string) passa por Zod schema antes de tocar no banco.

### TypeScript estrito
`strict: true` no `tsconfig.json`. Proibido `any`. Se precisar escapar, use `unknown` e narrow.

---

## # Tratamento de erros

- **Nunca engula erro.** Se você fez `try/catch`, o `catch` precisa logar (Sentry) e retornar erro tipado. `catch {}` vazio é code smell.
- **Erros de domínio** (validação, regra de negócio) viram classes que estendem `DomainError`. Veja `src/lib/errors.ts`.
- **Erros inesperados** sobem pro Error Boundary mais próximo. Não tente "consertar" no caller.
- **Mensagem pro usuário** nunca expõe stack ou detalhe técnico. Use o mapeamento em `src/lib/error-messages.ts`.
- **Erros de webhook do WhatsApp** vão pra fila de retry (3 tentativas, exponential backoff). Falha definitiva: alerta no Slack e marca a mensagem como `failed` no Convex.

<!-- POR QUE essa seção: agente é otimista demais. Ele faz `try { algo() } catch (e) { console.log(e) }`. Em produção isso é silêncio total. Forçando regra explícita, ele segue. -->

---

## # Padrões de naming

| Tipo | Convenção | Exemplo |
|------|-----------|---------|
| Componente | PascalCase, mesmo nome do arquivo | `DealCard.tsx` exporta `DealCard` |
| Hook | camelCase com `use` | `useCurrentOrg.ts` |
| Função utilitária | camelCase verbo + objeto | `formatBRL`, `parseWhatsAppId` |
| Tipo | PascalCase, sufixo conforme uso | `Deal`, `DealStatus`, `DealCreateInput` |
| Constante | UPPER_SNAKE_CASE só pra true constante; senão camelCase | `MAX_RETRIES`, `defaultPipeline` |
| Pasta | kebab-case | `pipeline-board/` |
| Arquivo de rota | minúsculo seguindo App Router | `app/deals/[id]/page.tsx` |
| Tabela Convex | camelCase singular | `deal`, `message`, `contact` |

<!-- POR QUE tabela: agente costuma misturar (DealCard.tsx exportando default sem nome, hook chamado getOrg em vez de useOrg). Convenção explícita evita PR de revisão chato. -->

---

## # O que NÃO fazer

- ❌ **Não criar arquivos sem perguntar.** Se a tarefa pede "ajuste o componente X", não crie 3 arquivos novos. Pergunte primeiro se faz sentido criar.
- ❌ **Não mockar dados.** Use Convex local (`npm run dev` já sobe). Mock só em teste unitário, e mesmo assim com factory tipada (`src/test/factories/`).
- ❌ **Não instalar dependência sem justificar no PR.** Toda nova lib precisa de 1 parágrafo no PR explicando por que ela e não código próprio.
- ❌ **Não usar `useEffect` pra buscar dado.** Use `useQuery` (Convex) ou Server Component. `useEffect` pra fetch é code smell em 2026.
- ❌ **Não commitar `.env`, `.env.local`, chaves do Stripe ou tokens da Evolution.** Tem `.gitignore` e pre-commit hook (`gitleaks`), mas confie em si mesmo também.
- ❌ **Não rodar `convex deploy` manualmente em prod.** Só CI faz. Manual = inconsistência entre branch e prod.
- ❌ **Não fazer refactor "por estética" no meio de feature.** Refactor é PR separado, com label `refactor`. Misturar com feature trava review.
- ❌ **Não adicionar comentário `// TODO` sem issue.** Se tem TODO, abre issue e referencia: `// TODO(#142): tratar caso de mensagem com mídia`.
- ❌ **Não responder a usuário em inglês.** Sistema é PT-BR. Toda string de UI em PT-BR. Use `next-intl` se precisar i18n no futuro, mas por enquanto: hardcoded PT-BR.

<!-- POR QUE essa seção é a MAIS importante: regras negativas pegam comportamentos que o agente faz por padrão. "Não criar arquivo sem perguntar" sozinha economiza 70% dos PRs ruins. -->

---

## # Critério de pronto (Definition of Done)

Uma tarefa só é considerada **pronta** quando:

1. ✅ Funciona (testado manualmente no fluxo principal + ao menos 1 caso de erro)
2. ✅ `npm run typecheck` passa sem warning
3. ✅ `npm run lint` passa sem warning
4. ✅ `npm run test` passa
5. ✅ Tem teste novo cobrindo o comportamento adicionado (unit ou e2e, conforme camada)
6. ✅ Não quebrou teste existente
7. ✅ Atualizou `AGENTS.md` se mudou regra ou comando
8. ✅ Atualizou `README.md` se mudou setup
9. ✅ Atualizou docstring/comentário se mudou contrato de função pública
10. ✅ Diff <= 400 linhas (se passar, divide em PRs menores)
11. ✅ Mensagem de commit no padrão Conventional Commits (`feat:`, `fix:`, `chore:`, etc.)

<!-- POR QUE checklist numerada: agente adora "concluir" tarefa antes de rodar testes. Forçando 11 itens explícitos, ele para e checa. -->

---

## # Workflow de PR

1. **Branch a partir de `main`.** Nome no padrão `tipo/breve-descricao`. Ex: `feat/agent-classifies-leads`.
2. **Commits pequenos.** 1 commit = 1 unidade lógica. Squash no merge se virar feio.
3. **PR descreve "por quê", não "o quê".** Diff já mostra o quê. Descrição responde: por que essa mudança? que problema resolve? que alternativas considerei?
4. **Anexar screenshot/vídeo se mexeu em UI.** Use Loom ou GIF.
5. **Self-review antes de pedir review.** Lê o próprio diff inteiro. 80% dos comentários você mesmo encontra.
6. **CI verde é pré-requisito.** Não peça review com CI vermelho. Conserta primeiro.
7. **Reviewer responde em até 24h úteis.** Se não conseguir, comenta dizendo quando responde.
8. **Author resolve toda thread.** Reviewer só "resolve conversation" se concordou.
9. **Merge: Squash and merge.** Mantém histórico limpo na `main`.
10. **Após merge, autor confere staging em até 30min.** Se quebrou, reverte.

<!-- POR QUE workflow explícito: agente quando opera em modo "PR" (Codex Cloud, p. ex.) precisa saber as etapas. Sem isso, ele cria branch chamado "patch-1", commit "fixes", PR sem descrição. -->

---

## # Estrutura de pastas relevante (resumo — detalhe em ESTRUTURA.md)

```
src/
├── app/                # Rotas Next.js (App Router)
├── components/         # React components reutilizáveis (PascalCase)
├── features/           # Módulos por feature (deals/, messages/, contacts/)
├── lib/                # Utils puros, errors, formatters
├── hooks/              # Hooks custom (useCurrentOrg, useDealFilters, ...)
└── test/               # Factories e helpers de teste
convex/                 # Schemas, queries, mutations, actions
```

<!-- POR QUE resumo aqui: pra agente saber onde colocar coisa nova sem ler árvore inteira. Detalhe profundo fica em arquivo separado. -->

---

## # Quando estiver em dúvida

1. Pergunte. Sempre. "Devo criar arquivo novo?" "Devo extrair componente?" custa 1 mensagem e economiza 1h de retrabalho.
2. Não invente. Se não sabe se uma lib existe no projeto, leia `package.json`.
3. Não chute API. Se não sabe a assinatura de uma função do Convex, leia `convex/_generated/api.d.ts`.

<!-- POR QUE essa seção fechando: humildade explícita do agente. Ele tende a inventar pra não "parecer" que não sabe. Autorize ele a perguntar. -->

---

**Última revisão:** 2026-04-15 — Nei Maldaner
**Próxima revisão obrigatória:** 2026-07-15 (a cada quarter)
