# InboxAI — Boilerplate

CRM operado por agentes de IA dentro do WhatsApp. Cliente final manda mensagem; nosso agente qualifica, classifica, responde e atualiza o pipeline de deals automaticamente. Operador humano só entra quando o agente pede ajuda ou quando o deal vira "negociação".

Este é o **boilerplate base** que você usa pra abrir projetos pra cliente. Plug-and-play em ~2 dias de setup. Customização específica de nicho (clínica, imobiliária, etc.) está em `bonus/verticais/`.

## Pitch

Pra quem usar:
- **Negócio que vende por WhatsApp** (90% do Brasil): clínica, imobiliária, e-commerce, serviço local.
- Quer **deixar de responder repetição** mas não quer perder venda boa.
- Quer **CRM que não trava o time** com data entry manual.

Resultado típico (cliente real, 3 meses de uso):
- 70% das mensagens respondidas pelo agente sem humano.
- Tempo médio de qualificação: de 4h (humano) → 8s (agente).
- Aumento de 32% em conversão de lead frio em deal aberto.

## Stack

| Camada | Tecnologia | Por quê |
|--------|------------|---------|
| Frontend | Next.js 15 (App Router) + React 19 | Padrão atual, RSC reduz JS no client |
| Estilo | Tailwind 4 + shadcn/ui | DX rápido, sem lib de componentes pesada |
| Backend | Convex | Banco + funções + realtime em 1 só. Tira 80% do trampo de configurar API/DB |
| Auth | Clerk | Multi-tenant out-of-the-box, billing pronto |
| WhatsApp | Evolution API | Self-host, sem custo por mensagem, controle total |
| IA | Anthropic Claude (Sonnet 4.7) | Melhor qualidade pra PT-BR + bom preço |
| Pagamento | Stripe | Padrão SaaS B2B |
| Observabilidade | Sentry + PostHog | Erro + analytics |
| Deploy | Vercel + Convex Cloud + VPS Hetzner | Custo total < R$ 200/mês até 1k usuários |

## Funcionalidades já incluídas

- ✅ Multi-tenant (org → usuários → contatos)
- ✅ Conexão WhatsApp via QR code
- ✅ Inbox unificada com threads de conversa
- ✅ Pipeline kanban de deals (drag-and-drop)
- ✅ Agente IA que classifica intenção, extrai dados, responde
- ✅ Mensagens automáticas (boas-vindas, follow-up, qualificação)
- ✅ Tags + filtros customizados
- ✅ Atribuição de conversa pra agente humano específico
- ✅ Notificações (email + push) quando agente IA escala pra humano
- ✅ Relatórios (volume, tempo de resposta, conversão por funil)
- ✅ Billing por seat com Stripe
- ✅ Webhook de eventos (pra integrar com sistema externo do cliente)

## Como clonar

```bash
# 1. Clonar o repo
git clone git@github.com:seu-usuario/inboxai-boilerplate.git meu-projeto-cliente
cd meu-projeto-cliente

# 2. Limpar histórico antigo (você quer começar do zero pro cliente)
rm -rf .git
git init
git add .
git commit -m "chore: bootstrap from inboxai boilerplate"

# 3. Renomear projeto
# Edite package.json, README.md, AGENTS.md trocando "InboxAI" pelo nome do cliente
```

## Como rodar local

Veja `SETUP.md` pra setup completo. Resumo:

```bash
# Instalar deps
npm install

# Subir Convex em modo dev (cria cloud dev project)
npx convex dev

# Em outra aba, subir Evolution API local via Docker
docker compose up -d evolution

# Em outra aba, subir Next
npm run dev
```

App: http://localhost:3000

## Fluxo end-to-end (sanity check)

1. Acesse `http://localhost:3000`, registre conta no Clerk (modo dev)
2. Crie organização "Teste"
3. Vá em `/settings/whatsapp`, escaneie QR code com seu WhatsApp pessoal
4. Mande uma mensagem do seu WhatsApp pra **outro número de teste**
5. Veja a mensagem aparecer na inbox + o agente IA classificar + entrar no pipeline

Se isso funcionar, o setup está OK. Se quebrar em algum step, ver `SETUP.md` seção "Troubleshooting".

## Deploy

### Frontend (Vercel)
```bash
vercel link
vercel env add # adicionar todas vars do .env.local
vercel --prod
```

### Backend (Convex Cloud)
```bash
npx convex deploy --prod
```

### Evolution API (VPS)
Veja `SETUP.md` seção "Deploy Evolution VPS". Resumo: provisione Hetzner CX22 (€ 4/mês), instale Docker, suba `docker-compose.prod.yml`.

## Custo mensal estimado (até 1k usuários)

| Item | Custo BRL/mês |
|------|---------------|
| Vercel Hobby | 0 (até passar dos limites) |
| Convex Cloud | ~50 |
| Hetzner CX22 (Evolution) | ~25 |
| Anthropic API (~10k mensagens/mês) | ~120 |
| Sentry team | ~100 |
| **Total** | **~295** |

Cobrando R$ 297-997/mês por cliente, margem é saudável.

## Documentação adicional

- `ARCHITECTURE.md` — camadas, fluxos, decisões
- `SETUP.md` — passo a passo do zero
- `ESTRUTURA.md` — explicação de cada pasta de `src/`
- `AGENTS.md` (raiz) — instruções pro agente de IA que vai operar nesse repo

## Licença

Uso comercial autorizado pra alunos do Master Codex. **Você pode revender o produto pro seu cliente.** Não pode revender o boilerplate em si (ex: virar curso concorrente). Termos completos no contrato do curso.
