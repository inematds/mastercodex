---
name: micro-saas-launch
description: Orquestra o lançamento completo de um micro-SaaS em 30 dias. Faz pesquisa de nicho, copy, landing, vídeo Remotion, calendário de posts e plano de tráfego. Use quando o usuário disser "vou lançar um SaaS", "ajuda no lançamento", "preciso de copy + landing + posts".
when_to_use: Usuário tem ideia de SaaS e quer plano completo; quer lançar produto que já existe e precisa go-to-market; precisa de calendário de conteúdo de 30 dias; quer pacote integrado (não pedacinho).
---

# Skill: Micro-SaaS Launch

## Quando usar

- "Vou lançar um micro-SaaS — me ajuda?"
- "Preciso do pacote completo: copy + landing + posts"
- "Plano de lançamento de 30 dias pro [produto]"
- "Como faço o go-to-market de um SaaS pra [nicho]?"

**NÃO usar quando:** o usuário só quer 1 entregável (ex: só a landing, só os posts) — usa skill mais específica. Esta é a orquestradora.

## Como funciona — passo a passo

### Passo 1: Briefing (questionário curto)
Manda **uma mensagem só** com:
1. Nome do produto
2. Em 1 frase: o que ele faz
3. Pra quem (descreva 1 persona)
4. Já tem MVP? Em que estágio?
5. Já tem audiência? (newsletter, IG, LinkedIn)
6. Pricing alvo (R$/mês ou R$ único)
7. Orçamento de tráfego (se houver)
8. Data alvo de lançamento

### Passo 2: Pesquisa de nicho
- Busca 3 concorrentes diretos
- Tabela: nome, pricing, USP, weakness
- Identifica 1 ângulo único pro produto novo
- Lista 5 palavras-chave para SEO/Ads

### Passo 3: Copy core
Produz, em sequência:
- **Headline principal** (3 versões, escolhe 1)
- **Subheadline**
- **Bio em 1 linha** (pra Twitter/IG)
- **Pitch em 30s** (pra falar)
- **Pitch em 280 caracteres** (pra Twitter)
- **5 dores** mapeadas
- **5 benefícios** mapeados
- **3 objeções** + contra-argumento

### Passo 4: Landing
Aciona a skill `landing-page` passando o briefing + a copy. Resultado: pasta `landing-<slug>/`.

### Passo 5: Vídeo de lançamento (Remotion)
Aciona o template Remotion (ver `bonus/remotion/`) passando o nome, headline, subheadline. Resultado: vídeo MP4 de 30s + thumbnails.

### Passo 6: Calendário de 30 dias
Gera planilha:

| Dia | Plataforma | Tipo | Hook | CTA |
|-----|------------|------|------|-----|
| -7 | Twitter | Teaser | "build in public — semana 1" | follow |
| -3 | LinkedIn | Story | "por que larguei meu emprego pra construir X" | comment |
| 0 (LAUNCH) | Todas | Anúncio | "[X] está no ar" | landing |
| +1 | Twitter | Tutorial | "5 minutos pra usar X" | landing |
| ... | ... | ... | ... | ... |

Total: 21 posts em 30 dias (3-4 por semana antes + 5 no dia + 12 após).

### Passo 7: Plano de tráfego (se tiver budget)
- Google Ads: 5 grupos com keywords, R$/dia sugerido
- Meta Ads: 3 públicos, 2 criativos cada, R$/dia sugerido
- LinkedIn Ads: público B2B refinado, formato de doc post
- Métricas-alvo: CPL e CAC esperados pra cada canal

### Passo 8: Empacotar
Gera pasta `launch-<slug>/`:
```
launch-<slug>/
├── README.md              # como usar tudo isso
├── briefing.md
├── copy/
│   ├── headlines.md
│   ├── pitches.md
│   └── objections.md
├── landing/               # delegado pra skill landing-page
├── video/                 # delegado pro Remotion
├── calendar/
│   ├── posts.csv
│   └── posts/
│       ├── day-minus-7.md
│       └── ...
└── ads/
    ├── google.md
    ├── meta.md
    └── linkedin.md
```

## Inputs esperados

| Campo | Obrigatório |
|-------|-------------|
| Nome do produto | Sim |
| O que faz (1 frase) | Sim |
| Persona | Sim |
| Estágio do MVP | Sim |
| Audiência atual | Não |
| Pricing | Sim |
| Budget de ads | Não |
| Data de lançamento | Sim |

## Outputs

- 1 pasta `launch-<slug>/` com tudo organizado
- Planilha `posts.csv` importável no Buffer/Hypefury
- Vídeo MP4 + variações
- Landing rodável local
- Plano de ads detalhado se tiver budget

## Templates

### Tabela de copy (template)

```markdown
## Headlines

**Versão 1 — racional:**
[X] que [benefício mensurável] pra [persona]

**Versão 2 — emocional:**
Pare de [dor] hoje. [X] resolve em [tempo].

**Versão 3 — curiosidade:**
A forma como [persona] está [verbo] [objeto] está mudando. [X] é o motivo.

## 3 Objeções e Respostas

| Objeção | Resposta |
|---------|----------|
| "É caro" | Calcule o custo de NÃO ter: R$ X/mês em [perda]. |
| "Já uso [concorrente]" | [X] resolve [feature que concorrente não tem]. Migração em 5min. |
| "Não tenho tempo pra implementar" | Setup em 10 minutos com nosso onboarding guiado. |
```

### Calendário CSV (template)

```csv
day,platform,type,hook,body_short,cta,asset
-7,twitter,teaser,"semana de lançamento começou","Estou construindo X. Em 7 dias, está no ar.",follow,
-5,linkedin,story,"Por que largei meu CLT","Trabalhei 3 anos em X. Saí pra construir...",comment,foto-perfil.jpg
-3,instagram,reel,"Build in public dia 4","Nesse vídeo mostro o que estamos terminando hoje",save,reel-day3.mp4
0,twitter,launch,"X está no ar","Você pode testar grátis por 14 dias em [link]",click,thumb-launch.png
0,linkedin,launch,"Lançamos hoje","Depois de 6 meses construindo X, hoje libera",react,linkedin-cover.png
1,twitter,tutorial,"Como usar X em 5min","Thread: 1/ Faça login...",bookmark,gif-tutorial.gif
3,linkedin,case,"Primeiro cliente em produção","Cliente Y reportou: A, B, C",comment,
7,twitter,bts,"O que aprendi nessa primeira semana","Thread: 1/ ...",follow,
```

## Exemplos

### Exemplo 1: SaaS B2B novo
**Input:** "Vou lançar o 'AgendaIA' — automatiza agenda de clínica via WhatsApp. Persona: dono de clínica pequena. Pricing R$ 297/mês. Lanço em 30 dias. Tenho 800 seguidores no LinkedIn."

**Output:** Pasta `launch-agendaia/` completa, com calendário focado em LinkedIn (audiência atual), copy enfatizando "sem contratar atendente", plano de Meta Ads pequeno (R$ 50/dia em 3 públicos).

### Exemplo 2: Indie hacker, sem audiência
**Input:** "Lanço o 'PromptBox' (biblioteca de prompts pra dev). Pricing único R$ 97. Sem audiência."

**Output:** Calendário focado em build-in-public no Twitter + Product Hunt no dia do lançamento + posts em comunidades (Indie Hackers, r/SaaS). Copy mais técnica.

## Aprendizados

- Briefing curto resolve 80%. Não peça 30 perguntas — pede 8 e itera.
- Calendário sempre tem buffer (3-4 posts por semana, não 7) — sustentável.
- Vídeo de 30s converte mais que 90s na fase de lançamento.
