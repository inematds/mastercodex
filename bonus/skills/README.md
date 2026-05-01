# Skills do Master Codex

5 skills empacotadas pro Claude Code (também funcionam, com adaptação, em Codex e Cursor). Cada skill é um conjunto de instruções + templates que o agente carrega quando o gatilho certo aparece.

## Como instalar

```bash
# Pasta global de skills do Claude Code
mkdir -p ~/.claude/skills

# Copia as 5 skills do bônus pra lá
cp -r ./skills/landing-page ~/.claude/skills/
cp -r ./skills/pr-review ~/.claude/skills/
cp -r ./skills/qa-visual ~/.claude/skills/
cp -r ./skills/micro-saas-launch ~/.claude/skills/
cp -r ./skills/weekly-report ~/.claude/skills/
```

Reinicie o Claude Code e ele lista as 5 skills no prompt.

## Como invocar

Você pode chamar a skill de 3 formas:

1. **Explicitamente:** "use a skill `landing-page` pra construir uma landing pra X"
2. **Slash command:** `/landing-page` (se a skill tiver registrado o comando — todas as 5 abaixo registram)
3. **Implicitamente:** descreve o que precisa e o Claude detecta o gatilho. Ex: "preciso de uma landing high-converting" dispara `landing-page` automaticamente.

## Tabela: quando usar cada uma

| Skill | Gatilho típico | Output |
|-------|----------------|--------|
| **landing-page** | "preciso de uma landing pra X", "monta uma página de captura", "página de vendas" | Pasta com Next.js + Tailwind + shadcn, 5 seções (hero, dor, solução, prova, CTA) |
| **pr-review** | "revisa esse PR", "olha esse diff", "code review" | Comentário estruturado: secrets, scope, lógica, testes, performance |
| **qa-visual** | "testa visualmente", "QA do app", "checa regressão", "valida fluxo" | Screenshots + relatório de regressões + comparação com baseline |
| **micro-saas-launch** | "vou lançar um SaaS", "ajuda no lançamento", "preciso de copy + landing + posts" | Plano de 30 dias: nicho, copy, landing, vídeo Remotion, calendário de posts |
| **weekly-report** | "relatório da semana", "report pro cliente", "fechamento semanal" | Slides + email com métricas, atividades, próximos passos |

## Princípios das 5 skills

Todas seguem 4 princípios:

1. **Frontmatter YAML claro.** O `description` e `when_to_use` são o que o agente lê pra decidir se aciona. Quanto melhor escrito, melhor o roteamento.
2. **Inputs/Outputs explícitos.** A skill lista o que precisa (input) e o que entrega (output). Sem ambiguidade.
3. **Templates incluídos.** Não é só "instrução" — tem código real que o agente copia e adapta.
4. **Idempotente.** Rodar a skill 2x não quebra nada. Se já existe arquivo, pergunta antes de sobrescrever.

## Customizando

Toda skill é só um arquivo `SKILL.md`. Abre, edita, salva. Versiona no Git se quiser.

Sugestão: depois de usar a skill por 30 dias, abre o `SKILL.md` e adiciona uma seção `## Aprendizados` com o que você notou que ela faz mal. Próxima rodada, o agente já corrige.

## Próximos passos

Depois que dominar essas 5, crie as suas. Use a skill `skill-creator` (built-in do Claude) com o prompt: "cria uma skill que faz X quando Y". Você vai criar 1 skill nova por mês — em 1 ano tem 17 skills, e isso é vantagem competitiva real.
