---
name: pr-review
description: Revisa Pull Request procurando vazamento de secret, scope creep, lógica errada, falta de teste e problema de performance. Produz comentário estruturado pronto pra colar no GitHub. Use quando o usuário pedir "revisa esse PR", "code review", "olha esse diff".
when_to_use: Usuário cola URL de PR, link do diff, ou pede revisão de código; usuário acabou de fazer commit e quer review antes de pedir review humano; usuário quer auditar PR antes de mergear.
---

# Skill: PR Review

## Quando usar

- "Revisa esse PR: <url>"
- "Olha esse diff antes de eu pedir review"
- "Code review desse commit"
- "Audita esse PR antes do merge"
- "Tem alguma coisa errada nessas mudanças?"

**NÃO usar quando:** o usuário quer só uma "opinião geral" sobre estilo de código — isso é outra coisa, conversa aberta. Esta skill é estruturada e produz output formato relatório.

## Como funciona — passo a passo

### Passo 1: Carregar o diff
- Se URL do GitHub: `gh pr view <num> --json files,additions,deletions,title,body` + `gh pr diff <num>`
- Se URL de commit: `gh api /repos/<owner>/<repo>/commits/<sha>`
- Se diff colado: usa o diff direto

### Passo 2: Análise em 5 dimensões
Em ordem de prioridade:

#### 2.1 Secrets vazados (CRÍTICO)
Procura nos arquivos modificados:
- Tokens (`sk-`, `ghp_`, `xoxb-`, `AKIA...`)
- URLs com credencial embutida (`postgres://user:pass@`)
- Chaves privadas (`-----BEGIN PRIVATE KEY-----`)
- `.env`, `.env.local`, `*.pem`, `*.key` adicionados

Se encontrar: **bloqueia** o review com aviso vermelho. Manda o usuário rotacionar a chave imediatamente.

#### 2.2 Scope creep
- O título/descrição do PR menciona apenas tarefa X?
- O diff toca em arquivos não relacionados a X?
- Tem refactor "de brinde" misturado?

Se sim: lista os arquivos fora de escopo e sugere split em 2 PRs.

#### 2.3 Lógica errada
Procura:
- Off-by-one em loops/slices
- Comparação com `==` que devia ser `===` (ou vice-versa em linguagens permissivas)
- Promise sem `await`
- Estado React mutado diretamente (`array.push`)
- Condicional que cobre só o caso feliz
- `if (user.permission === "admin") { ... }` quando deveria ser `roles.includes("admin")`
- Uso de variável fora do escopo de closure (típico em `for` com setTimeout)

#### 2.4 Testes faltando
- Função pública nova sem teste? Marca.
- Bug fix sem teste de regressão? Marca.
- Mudou comportamento mas teste não mudou? Suspeita.
- Test snapshot atualizado sem revisar diff do snapshot? Suspeita.

#### 2.5 Performance
- N+1 query óbvio (loop fazendo SELECT)
- Render de React com array sem `key` ou com `key={index}`
- Operação O(n²) em lista que pode crescer
- `useEffect` com array de dependência mutado a cada render
- Bundle: import de lib inteira quando só precisa de 1 função (`import _ from 'lodash'`)

### Passo 3: Produzir comentário estruturado

Formato:

```markdown
## Code Review

**Status:** APPROVE / REQUEST_CHANGES / COMMENT

### Bloqueadores (precisam ser resolvidos antes do merge)
- [ ] ...

### Sugestões fortes
- [ ] ...

### Nits (opcional, fica a critério)
- [ ] ...

### Pontos positivos
- ...

### Resumo executivo
1-2 frases: qual a saúde geral do PR.
```

## Inputs esperados

| Input | Aceita |
|-------|--------|
| URL de PR | `https://github.com/<owner>/<repo>/pull/<n>` |
| URL de commit | `https://github.com/<owner>/<repo>/commit/<sha>` |
| Diff colado | Texto unified diff |
| Pasta local | "revisa o que tá staged" → roda `git diff --cached` |

## Outputs

- Markdown estruturado com 4 seções (Bloqueadores, Sugestões, Nits, Positivos)
- Cada item tem: arquivo:linha + descrição + sugestão concreta de fix
- Resumo executivo final
- (Opcional) Sugestão de commit message se o original for ruim

## Templates / scripts

### Script: detectar secrets simples (regex pre-check)

```bash
#!/usr/bin/env bash
# Roda antes do review pra dar early flag
DIFF="$1"
PATTERNS=(
  "sk-[a-zA-Z0-9]{20,}"
  "ghp_[a-zA-Z0-9]{36}"
  "xox[baprs]-[a-zA-Z0-9-]+"
  "AKIA[0-9A-Z]{16}"
  "-----BEGIN [A-Z ]*PRIVATE KEY-----"
)
for p in "${PATTERNS[@]}"; do
  if echo "$DIFF" | grep -qE "$p"; then
    echo "ALERT: pattern '$p' found"
    exit 1
  fi
done
echo "OK"
```

### Template do output (preencha)

```markdown
## Code Review — PR #<numero>: <titulo>

**Status sugerido:** REQUEST_CHANGES

### 🔴 Bloqueadores
- [ ] `src/lib/api.ts:42` — Token Stripe está em string literal. Mover pra `process.env.STRIPE_SECRET`.
- [ ] `src/auth/login.ts:18` — Comparação `if (password == storedHash)` permite type juggling. Use `===` e idealmente `bcrypt.compare`.

### 🟡 Sugestões fortes
- [ ] `src/components/DealCard.tsx:55` — Componente está com 220 linhas. AGENTS.md diz limite de 150. Considere extrair `<DealActions />`.
- [ ] `convex/deals.ts:90` — Loop fazendo `db.get()` por iteração. Substitui por `db.query("contacts").filter(...).collect()`.

### 🔵 Nits
- [ ] `package.json` — Dependência `lodash` adicionada mas só usa `_.debounce`. Considere `lodash.debounce` ou implementação inline.

### ✅ Pontos positivos
- Boa cobertura de teste no caso de erro de webhook (`tests/webhook.test.ts`).
- Migration está reversível (tem `down`).

### Resumo
PR resolve a issue #142, mas tem 2 bloqueadores de segurança. Não merge até resolver. Após resolução, é um bom PR.
```

## Exemplos

### Exemplo 1: PR pequeno bom
**Input:** PR de 3 arquivos, 40 linhas, fix de bug, com teste de regressão.
**Output esperado:** Status APPROVE, sem bloqueadores, talvez 1-2 nits, resumo positivo.

### Exemplo 2: PR com secret
**Input:** Diff que adiciona `const STRIPE_KEY = "sk_live_..."`.
**Output esperado:** Status REQUEST_CHANGES, bloqueador #1 detalhado, instrução pra rotacionar chave imediatamente, sugestão de adicionar `gitleaks` ao pre-commit.

## Aprendizados

- (espaço pra atualizar com falsos positivos/negativos que você for encontrando)
