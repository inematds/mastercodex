---
name: weekly-report
description: Gera relatório semanal pra cliente em 2 formatos (slides + email). Coleta métricas, atividades feitas, próximos passos e bloqueios. Use quando o usuário disser "relatório da semana", "report pro cliente", "fechamento semanal".
when_to_use: Sexta-feira de manhã (ou qualquer dia que o usuário fizer fechamento da semana); cliente cobrou status; usuário precisa atualizar stakeholder; final de sprint.
---

# Skill: Weekly Report

## Quando usar

- "Gera o report da semana pro cliente X"
- "Fechamento semanal"
- "Relatório de status pra mandar amanhã"
- "Update pro stakeholder"
- "Resumo do que fizemos essa semana"

**NÃO usar quando:** o usuário quer relatório mensal/trimestral — esses têm estrutura diferente (executiva, com ROI). Esta é semanal, mais operacional.

## Como funciona — passo a passo

### Passo 1: Coletar fontes
Pergunta (ou puxa automaticamente se tiver acesso):
- Sistema de PM: Linear, Jira, Notion, GitHub Issues — quais issues fecharam essa semana?
- Métricas: planilha, Mixpanel, PostHog, Stripe — quais números importam pro cliente?
- Calendário: reuniões da semana
- Slack/email: bloqueios reportados, decisões tomadas
- Próxima semana: o que está planejado

### Passo 2: Estruturar
5 blocos fixos (ordem importa):
1. **TL;DR** (3 frases — o cliente lê só isso se for ocupado)
2. **Métricas da semana** (tabela: métrica | valor | delta vs sem.passada)
3. **O que entregamos** (lista bullet, foco em outcome, não output)
4. **O que não saiu / bloqueios** (transparência — esconder pioras a confiança)
5. **Próximos 7 dias** (3-5 prioridades)

### Passo 3: Gerar 2 formatos

#### Formato A: Slides (Google Slides ou Keynote)
- 5 slides, 1 pra cada bloco
- Tema visual consistente (logo do cliente, cores)
- Cada slide com headline em uma frase + 3-5 bullets max
- Métricas em destaque: número grande + delta colorido (verde sobe, vermelho cai)

#### Formato B: Email
- Assunto: `[<Projeto>] Status semanal — semana <DD/MM>`
- Corpo enxuto (200 palavras)
- TL;DR em **negrito** no topo
- Métricas em tabela markdown
- Sem anexos pesados — link pros slides se quiser detalhe
- Assinatura padrão do remetente

### Passo 4: Validar
Antes de mandar, mostra os 2 formatos pro usuário e pergunta:
- Algo errado nos números?
- Algo sensível que não posso mencionar?
- Tom OK? (mais formal, mais informal?)

### Passo 5: Entregar
- Salva slides em `reports/<cliente>/<YYYY-MM-DD>.pdf` ou link
- Salva email em `reports/<cliente>/<YYYY-MM-DD>.md`
- Opcional: agenda envio (se tiver integração Gmail) ou copia pro clipboard

## Inputs esperados

| Input | Como obter |
|-------|-----------|
| Cliente | Nome explícito |
| Período | "essa semana" = seg a sex da semana corrente |
| Métricas a destacar | Lista no projeto ou perguntar |
| Issues fechadas | API Linear/GitHub ou colar lista |
| Próximas prioridades | Lista do plano |
| Bloqueios | Lista (ou "nenhum") |

## Outputs

- 1 arquivo `email.md` (corpo do email)
- 1 arquivo `slides.pdf` (5 slides) ou link Google Slides
- 1 resumo no chat com os destaques

## Templates

### Email template

```markdown
**Para:** {{cliente_email}}
**De:** {{seu_email}}
**Assunto:** [{{projeto}}] Status semanal — {{semana}}

Oi {{primeiro_nome}},

**TL;DR:** {{frase_resumo_1}} {{frase_resumo_2}} {{frase_resumo_3}}

### 📊 Métricas

| Métrica | Valor | Δ vs sem.passada |
|---------|------:|-----------------:|
| {{m1}} | {{v1}} | {{d1}} |
| {{m2}} | {{v2}} | {{d2}} |
| {{m3}} | {{v3}} | {{d3}} |

### ✅ Entregamos

- {{entrega_1}}
- {{entrega_2}}
- {{entrega_3}}

### ⚠️ Não saiu / Bloqueios

- {{bloqueio_1}} — *próximo passo: {{acao}}*

### 🎯 Próximos 7 dias

1. {{prioridade_1}}
2. {{prioridade_2}}
3. {{prioridade_3}}

Slides com mais detalhe: {{link_slides}}.

Qualquer dúvida, me chama.

Abraço,
{{seu_nome}}
```

### Slides template (estrutura)

```
Slide 1 — Capa
  Logo do cliente
  "Status semanal — {{semana}}"
  Seu nome + data

Slide 2 — TL;DR
  Headline: "Em 3 frases, a semana foi:"
  3 bullets curtos

Slide 3 — Métricas
  3 KPIs em destaque (número grande + delta)
  Gráfico simples (barra ou linha)

Slide 4 — Entregas + Bloqueios
  Coluna esquerda: ✅ entregamos (5 itens)
  Coluna direita: ⚠️ bloqueios (1-3 itens com ação)

Slide 5 — Próximos 7 dias
  3-5 prioridades
  Datas-chave
  CTA: reunião agendada / decisão pendente
```

### Script Python pra gerar slides via API Google

```python
"""
Gera weekly report como Google Slides via API.
Requer: pip install google-api-python-client google-auth-oauthlib
"""
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials

def create_weekly_slides(creds: Credentials, data: dict) -> str:
    slides_service = build("slides", "v1", credentials=creds)
    presentation = slides_service.presentations().create(
        body={"title": f"Status — {data['cliente']} — {data['semana']}"}
    ).execute()
    presentation_id = presentation["presentationId"]

    requests = []
    requests += build_cover_slide(data)
    requests += build_tldr_slide(data)
    requests += build_metrics_slide(data)
    requests += build_deliveries_slide(data)
    requests += build_next_slide(data)

    slides_service.presentations().batchUpdate(
        presentationId=presentation_id,
        body={"requests": requests}
    ).execute()

    return f"https://docs.google.com/presentation/d/{presentation_id}/edit"
```

## Exemplos

### Exemplo 1: Cliente de SaaS B2B
**Input:** "Report semanal pro cliente Acme. Métricas-chave: MRR, novos signups, churn. Issues fechadas: 7. Bloqueio: API do Stripe deu downtime quarta."

**Output:**
- Email com TL;DR enfatizando que MRR cresceu 3% apesar do downtime
- Slide de bloqueio com plano de mitigation (failover via webhook secundário)
- Próximos passos focados em onboarding novos signups

### Exemplo 2: Cliente sem métricas digitais
**Input:** "Report pro cliente Beta (escritório de advocacia). Não tem métricas web. Foco: casos atendidos, prazos cumpridos."

**Output:**
- Métricas adaptadas: casos abertos, casos fechados, prazos no vermelho
- Tom mais formal (tradicional)
- Slides em PDF (não Google Slides — cliente não usa)

## Aprendizados

- Cliente lê 90% só o TL;DR. Capriche nele, custe o que custar.
- Sextas 14h é horário ótimo de envio (pré-fim-de-semana, calmo).
- Mandar todo dia ou toda quinta? Use mesmo dia/hora sempre. Previsibilidade > timing perfeito.
- Quando há bloqueio, sempre proponha próximo passo. Cliente não quer só problema, quer plano.
