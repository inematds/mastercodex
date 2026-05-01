# MASTER CODEX — Plano Mestre

> **Versão:** 1.0 — 2026-05-01
> **Formato:** Curso HTML (texto + imagens), padrão INEMA.CLUB
> **Preço-alvo:** R$ 5.000
> **Estrutura:** 6 trilhas × 4 módulos = 24 módulos / 144 tópicos

---

## 1. Posicionamento

### Promessa de capa

> **De "vibe coder" curioso a dono de uma fábrica de SaaS de atendimento e vendas com IA — com seu primeiro cliente pagante ainda durante o curso.**

### Público-alvo

Mix com módulo de nivelamento na Trilha 1:

- Empreendedores que querem construir SaaS sem virar dev
- Devs tradicionais migrando para fluxo agentic
- "Vibe coders" que já usam Cursor/Claude e querem subir de nível

### Diferencial defensável

1. **Método autoral** — "Master Codex Full-Stack Agentic Build" com 5 pilares: Planejar → Projetar → Construir → Validar → Lançar
2. **Casos reais brasileiros** distribuídos pelas trilhas
3. **Skills e AGENTS.md prontos** entregues como exemplos práticos nos módulos (não teoria, código pronto pra usar)

---

## 2. Projeto-âncora: InboxAI

**Tagline:** *Plataforma omnichannel de atendimento e vendas com agentes de IA.*

### O que faz

- Centraliza WhatsApp + Instagram DM + Email + Web Chat numa caixa única
- Pipeline de CRM (lead → qualificação → proposta → fechado/perdido)
- Agente IA qualifica lead 24/7 e passa para humano quando necessário
- Agente IA de follow-up (reativa lead frio)
- Agente IA de pós-venda (NPS, upsell)
- Dashboard com analytics (tempo de resposta, conversão, valor do pipeline)

### Stack pedagógica

| Camada | Tecnologia | Justificativa |
|---|---|---|
| Frontend | Next.js + Tailwind | Padrão de mercado, fácil de gerar com Codex |
| Backend / DB | Convex (ou Supabase) | Free tier generoso, sem fricção |
| WhatsApp | Evolution API (auto-hospedada) | Aluno roda em 10 min sem aprovação Meta |
| IA | OpenAI / Anthropic via Codex | Já parte do fluxo agentic |
| Deploy | Vercel + Convex Cloud | Zero-config |

### Trade-off declarado

Evolution API auto-hospedada não é "production-grade enterprise". Para um curso vendido como "construa e venda micro-SaaS", esse trade-off é **certo**: prioriza tempo-até-cliente sobre arquitetura definitiva.

---

## 3. Mapa das 6 Trilhas

### TRILHA 1 — Fundamentos do Desenvolvimento Agentic *(Emerald · Nivelamento)*

**Promessa:** entender em que mundo estamos e ter o ambiente pronto.

| # | Módulo | Foco |
|---|---|---|
| 1.1 | O fim do programador, o início do diretor de agentes | Mindset e estado da arte |
| 1.2 | As 4 faces do Codex (App, CLI, IDE, Cloud) | Quando usar cada uma |
| 1.3 | Setup completo | Conta, GitHub, permissões, sandbox, modelos, custos |
| 1.4 | Seu primeiro fluxo agentic | Do prompt à PR — exercício curto |

### TRILHA 2 — A Linguagem dos Agentes *(Blue)*

**Promessa:** sair de "prompt improvisado" para um agente que entende seu projeto.

| # | Módulo | Foco |
|---|---|---|
| 2.1 | AGENTS.md: o manual operacional do projeto | Template autoral pronto |
| 2.2 | Skills: o que são, instalar, invocar | 3 skills nossas como exemplo |
| 2.3 | Reverse prompting + Definition of Done + Plan Mode | Disciplina de prompt |
| 2.4 | Memória, contexto, sandbox, worktrees | Não deixar o agente bagunçar |

### TRILHA 3 — Design e Frontend com IA *(Purple · início do InboxAI)*

**Promessa:** sair da ideia, ter UI bonita e código frontend funcionando.

| # | Módulo | Foco |
|---|---|---|
| 3.1 | Image Gen 2: 5 direções de UI antes de codar | Refs: Intercom, Crisp, Drift |
| 3.2 | Construindo o inbox unificado | Lista + thread + painel lateral |
| 3.3 | CRM kanban + dashboard de métricas | Drag-and-drop, charts |
| 3.4 | Browser embutido + iteração visual | Anotações e fixes em tempo real |

### TRILHA 4 — Backend Real, WhatsApp e Agente IA *(Amber)*

**Promessa:** transformar UI demo em produto que funciona com dados reais.

| # | Módulo | Foco |
|---|---|---|
| 4.1 | Stack + modelagem | Contatos, conversas, mensagens, deals |
| 4.2 | Integrando Evolution API | Conectar WhatsApp em 10 min |
| 4.3 | Agente IA dentro do produto | System prompt, contexto, handoff |
| 4.4 | Auth multi-tenant + Deploy | InboxAI ao vivo na web |

### TRILHA 5 — Múltiplos Agentes em Paralelo *(Teal)*

**Promessa:** virar uma equipe de uma pessoa só.

| # | Módulo | Foco |
|---|---|---|
| 5.1 | Arquitetura multiagente | Sem caos: arquiteto, FE, BE, QA, marketing, pesquisa |
| 5.2 | Browser Use + Computer Use | Agentes que usam software por você |
| 5.3 | Remotion: vídeo de lançamento | Motion graphics em uma noite |
| 5.4 | Landing + copy + posts | Agente de marketing entregando o pacote |

### TRILHA 6 — Escala: Cloud, PRs, Skills Próprias e Fábrica de Micro-SaaS *(Rose)*

**Promessa:** transformar o método em máquina repetível.

| # | Módulo | Foco |
|---|---|---|
| 6.1 | Codex Cloud + GitHub | PRs, @codex review, fluxo profissional |
| 6.2 | Automations | Agentes recorrentes (relatórios, triagem) |
| 6.3 | Criando suas próprias skills | 1 skill autoral construída do zero |
| 6.4 | O método: 1 micro-SaaS por semana | InboxAI white-label como serviço |

---

## 4. Bônus que justificam os R$ 5k

| Bônus | Trilha onde aparece | Tipo |
|---|---|---|
| AGENTS.md mestre comentado | T2 | Template |
| 5 skills prontas: `landing-page`, `pr-review`, `qa-visual`, `micro-saas-launch`, `weekly-report` | T2, T5, T6 | Código |
| Definition of Done + checklist de revisão | T2 | Template |
| Pacote Remotion editável | T5 | Asset |
| Boilerplate InboxAI white-label revendável | T4 | Código |
| 4 customizações verticais (clínicas, imobiliárias, e-commerce, advocacia) | T6 | Código |
| Skill autoral `novo-vertical` | T6 | Código |
| Estudos de caso reais brasileiros | Distribuído | Texto |

---

## 5. Sequência pedagógica (sem buracos)

Ao final de cada trilha, o aluno sabe:

- **T1:** o que é Codex, qual interface usar quando, como configurar
- **T2:** comandar agente com disciplina (AGENTS.md, skills, plan mode, DoD)
- **T3:** desenhar UI com IA e construir frontend completo
- **T4:** integrar banco, API externa (WhatsApp), agente IA dentro do produto, fazer deploy
- **T5:** orquestrar múltiplos agentes (dev + QA + marketing) sem caos
- **T6:** escalar com Cloud + automações + skills próprias, virando uma fábrica

---

## 6. Decisões locked

- ✅ Público: mix com nivelamento na T1
- ✅ Escopo: completo (dev + design + marketing + automações + skills)
- ✅ Diferencial: método autoral + casos reais + skills/AGENTS.md prontos
- ✅ Projeto-âncora: **InboxAI** (CRM omnichannel com agentes IA)
- ✅ WhatsApp: Evolution API (auto-hospedada)
- ✅ Formato: HTML INEMA.CLUB (skill `formato-curso`)
- ✅ Estrutura: 6 trilhas × 4 módulos × 6 tópicos = 144 tópicos

---

## 7. Próximos passos

Ver `todo.md` para tracker de implementação das 30 páginas HTML.
