# InboxAI — Setup

Setup do zero. Da máquina recém-formatada à primeira conversa rodando localmente. Tempo estimado: **45-60 minutos** na primeira vez (depois 10 minutos pra subir de novo).

## Pré-requisitos

| Ferramenta | Versão | Como instalar |
|-----------|--------|---------------|
| Node.js | 20+ | `nvm install 20 && nvm use 20` |
| Docker | recente | https://docs.docker.com/get-docker/ |
| Docker Compose | v2+ | Vem com Docker Desktop / `docker compose version` |
| Git | qualquer | `apt install git` / `brew install git` |

Verifique:
```bash
node --version  # v20.x
docker --version
docker compose version
```

## Passo 1: Clonar o repo

```bash
git clone git@github.com:seu-usuario/inboxai-boilerplate.git meu-cliente-x
cd meu-cliente-x

# limpar histórico antigo
rm -rf .git
git init
git add .
git commit -m "chore: bootstrap inboxai"
```

## Passo 2: Instalar dependências

```bash
npm install
```

Demora ~3 minutos primeira vez (baixa Next, React, Tailwind, shadcn, etc.).

## Passo 3: Criar conta Convex

1. Acesse https://convex.dev → "Sign up" (login com GitHub).
2. Plano free serve até 1M function calls/mês — muito mais que suficiente pra dev.
3. No terminal:
   ```bash
   npx convex dev
   ```
4. Login automaticamente abre browser. Autentica.
5. Pergunta "Create new project? [y/n]" → `y`. Nome: `inboxai-cliente-x-dev`.
6. Convex cria 2 deployments: `dev` (local) e vai criar `prod` quando você fizer deploy.
7. Salva automaticamente as URLs em `.env.local`:
   ```
   CONVEX_DEPLOYMENT=dev:cliente-x-dev
   NEXT_PUBLIC_CONVEX_URL=https://....convex.cloud
   ```

Deixe esse terminal aberto — ele fica sincronizando seu código pra cloud do Convex.

## Passo 4: Criar conta Clerk

1. Acesse https://clerk.com → "Sign up".
2. Cria aplicação → escolhe "Email + Google" como métodos.
3. Em **Configure → Sessions** habilita "Organizations".
4. Em **API Keys** copia:
   - `Publishable key` (começa com `pk_test_`)
   - `Secret key` (começa com `sk_test_`)
5. Adiciona em `.env.local`:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
   ```
6. **Configurar webhook Clerk → Convex:**
   - No Clerk: **Webhooks → Add Endpoint**
   - URL: `https://<seu-deploy>.convex.site/clerk-webhook`
   - Eventos: `user.created`, `user.updated`, `organization.created`, `organizationMembership.created`
   - Copia o **Signing secret** e adiciona como variável no Convex:
     ```bash
     npx convex env set CLERK_WEBHOOK_SECRET whsec_...
     ```

## Passo 5: Subir Evolution API local

Cria `docker-compose.dev.yml` (já vem no boilerplate):

```yaml
services:
  evolution:
    image: atendai/evolution-api:v2.1.0
    container_name: evolution-dev
    restart: unless-stopped
    ports:
      - "8080:8080"
    environment:
      AUTHENTICATION_API_KEY: dev-api-key-mude-em-prod
      DATABASE_PROVIDER: postgresql
      DATABASE_CONNECTION_URI: postgresql://evolution:evolution@postgres:5432/evolution
      WEBHOOK_GLOBAL_URL: https://<seu-convex>.convex.site/whatsapp-webhook
      WEBHOOK_GLOBAL_ENABLED: "true"
    depends_on:
      - postgres

  postgres:
    image: postgres:16-alpine
    container_name: evolution-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: evolution
      POSTGRES_PASSWORD: evolution
      POSTGRES_DB: evolution
    volumes:
      - evolution-postgres-data:/var/lib/postgresql/data

volumes:
  evolution-postgres-data:
```

Subir:
```bash
docker compose -f docker-compose.dev.yml up -d
```

Verifica:
```bash
curl http://localhost:8080
# deve retornar JSON com versão
```

Adiciona em `.env.local`:
```
EVOLUTION_API_URL=http://localhost:8080
EVOLUTION_API_KEY=dev-api-key-mude-em-prod
```

E como var Convex (action precisa pra mandar msg):
```bash
npx convex env set EVOLUTION_API_URL http://localhost:8080
npx convex env set EVOLUTION_API_KEY dev-api-key-mude-em-prod
```

**Importante sobre webhook em dev:** localhost não é acessível pela cloud do Convex pra receber webhook reverso. Use ngrok ou cloudflared:

```bash
# instala ngrok
brew install ngrok # ou https://ngrok.com/download

# expõe Evolution
ngrok http 8080
# pega URL https://abc123.ngrok-free.app
```

Configura webhook do Convex pra apontar pra essa URL via dashboard Convex (Functions → HTTP). Em produção isso não é problema (tudo é pública).

## Passo 6: Configurar Anthropic

1. https://console.anthropic.com → "Get API key".
2. Plano dev: $5 grátis. Suficiente pra centenas de testes.
3. Copia chave (começa com `sk-ant-...`).
4. Adiciona como var Convex:
   ```bash
   npx convex env set ANTHROPIC_API_KEY sk-ant-...
   ```

## Passo 7: Configurar Stripe (opcional em dev)

Pra testar billing localmente:

1. https://dashboard.stripe.com → cria conta.
2. **Developers → API keys** → copia `Publishable` e `Secret` (modo test).
3. **Products** → cria produto "InboxAI Pro" → preço R$ 297/mês recorrente.
4. Adiciona em `.env.local`:
   ```
   STRIPE_PUBLIC_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_PRICE_PRO=price_...
   ```
5. Stripe CLI pra webhook local:
   ```bash
   stripe login
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   # copia o webhook signing secret e adiciona em .env.local
   ```

Em **dev**, você pode pular Stripe e setar `BILLING_DISABLED=true`. App pula a cobrança.

## Passo 8: Subir o app Next.js

```bash
npm run dev
```

Abre http://localhost:3000.

## Passo 9: Smoke test

1. **Sign-up** com email no Clerk → cai em `/onboarding`.
2. **Cria organização** "Teste Cliente X".
3. **Vai em `/settings/whatsapp`** → click "Conectar instância".
4. **Aparece QR code** (vem do Evolution local).
5. **Escaneia com WhatsApp** do seu celular pessoal.
6. **Pega outro celular ou amigo** e manda msg pro seu número conectado.
7. **Confere:**
   - Mensagem aparece em `/inbox` em ~2s.
   - Agente IA gera resposta em ~3s.
   - Contato aparece em `/contacts` com classificação.
   - Deal entra no pipeline em `/deals` se classificação = hot.

Se tudo isso funcionar: **setup OK**. Próximo passo é customização (logo, copy, prompts do agente).

## Troubleshooting

### "Convex schema mismatch"
Rodou `npx convex dev` e mudou schema. Solução:
```bash
# limpa e recria
npx convex dev --once
```

### Evolution não recebe webhook do WhatsApp
- Confere se docker tá up: `docker ps`
- Confere logs: `docker logs evolution-dev`
- Confere se ngrok tá apontando certo
- Reinicia ngrok (URL muda toda vez no plano free)

### Anthropic 401
Chave errada ou expirada. Re-set:
```bash
npx convex env set ANTHROPIC_API_KEY <nova>
```

### Clerk webhook não dispara
- Verifica em **Webhooks → Logs** no Clerk se a chamada saiu.
- Se sim, verifica logs Convex: `npx convex logs`.
- Causa comum: `CLERK_WEBHOOK_SECRET` errado.

### Mensagem outbound não chega no WhatsApp
- Confere logs Evolution: `docker logs evolution-dev -f`
- Confere se número destino está no formato E.164 (`5511999998888`).
- Confere se instância está com status "open" no Evolution.

### "Origin not allowed" em produção
Adiciona domínio do front nas allowed origins do Clerk + variável `NEXT_PUBLIC_APP_URL`.

## Próximos passos

- Lê `ESTRUTURA.md` pra entender onde fica cada coisa.
- Lê `ARCHITECTURE.md` pra entender os fluxos.
- Lê `AGENTS.md` (raiz do projeto) — vai trabalhar com agente de IA, esse é o briefing dele.
- Customiza pro nicho do cliente: ver `bonus/verticais/`.
