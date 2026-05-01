---
name: qa-visual
description: Roda QA visual automatizado de uma aplicação web. Abre browser headless (Playwright), navega pelos fluxos chave, captura screenshots, compara com baseline e reporta regressões visuais. Use quando o usuário pedir "QA visual", "testa o app", "checa regressão visual", "valida fluxo X".
when_to_use: Usuário acabou de subir build em staging; quer validar fluxo crítico antes do deploy; quer comparar versão atual com baseline; quer screenshots para documentação visual; suspeita que mudança CSS quebrou algo.
---

# Skill: QA Visual

## Quando usar

- "Testa visualmente o app em <url>"
- "Faz QA do fluxo de login"
- "Checa regressão visual antes do deploy"
- "Captura screenshots dos 5 fluxos principais"
- "Compara essa branch com a baseline"

**NÃO usar quando:** o usuário quer testes funcionais profundos (lógica de negócio) — isso é Vitest/Jest e fica fora do escopo.

## Como funciona — passo a passo

### Passo 1: Levantar contexto
Pergunta:
- URL alvo (staging, local, prod)
- Lista de fluxos a testar (ou usa `qa-flows.json` do projeto se existir)
- Credenciais de teste (idealmente em `.env.test`)
- Tem baseline (snapshots antigos)? Onde?
- Viewport: desktop (1440x900), mobile (390x844), ou ambos?

### Passo 2: Plano de execução
Lista os fluxos que vai rodar e pede confirmação. Exemplo:
```
Vou rodar 5 fluxos:
1. Login (sucesso + erro)
2. Listar deals
3. Criar novo deal
4. Mover deal no kanban
5. Logout

Vou capturar 12 screenshots no total. Continuar?
```

### Passo 3: Executar
Roda o script Playwright. Cada step tira screenshot. Compara pixel-a-pixel com baseline (se houver) usando `pixelmatch`.

### Passo 4: Relatório
Gera HTML report em `qa-report/index.html` mostrando:
- Lista de fluxos com status (✅ / ⚠️ / ❌)
- Screenshots lado a lado: baseline vs atual vs diff
- Console logs / network errors
- Tempo de cada fluxo

### Passo 5: Resumir no chat
Resume em 5 linhas: quantos fluxos passaram, quantos quebraram, regressões críticas, sugestão de ação.

## Inputs esperados

| Input | Default |
|-------|---------|
| URL | Pergunta |
| Fluxos | Lê `qa-flows.json` ou pergunta |
| Credenciais | `.env.test` |
| Viewports | `[1440x900]` |
| Baseline | `qa-baseline/` na raiz do projeto |
| Threshold de diff | 0.1% de pixels diferentes |

## Outputs

- Pasta `qa-report-<timestamp>/` com:
  - `index.html` — relatório navegável
  - `screenshots/` — PNGs atuais
  - `diffs/` — PNGs de diferença (apenas onde houve regressão)
  - `console.log` — logs de browser
  - `network.har` — captura HAR para debug
- Resumo no chat
- Exit code 0 (tudo OK) / 1 (regressão detectada) — útil pra CI

## Templates / scripts

### `qa-flows.json` (exemplo)

```json
{
  "baseURL": "https://staging.inboxai.com.br",
  "viewport": { "width": 1440, "height": 900 },
  "flows": [
    {
      "name": "login-success",
      "steps": [
        { "action": "goto", "value": "/login" },
        { "action": "fill", "selector": "[name=email]", "value": "{{TEST_EMAIL}}" },
        { "action": "fill", "selector": "[name=password]", "value": "{{TEST_PASSWORD}}" },
        { "action": "click", "selector": "button[type=submit]" },
        { "action": "waitForURL", "value": "**/dashboard" },
        { "action": "screenshot", "name": "after-login" }
      ]
    },
    {
      "name": "create-deal",
      "steps": [
        { "action": "goto", "value": "/deals" },
        { "action": "click", "selector": "button:has-text('Novo deal')" },
        { "action": "fill", "selector": "[name=title]", "value": "Deal de teste QA" },
        { "action": "fill", "selector": "[name=value]", "value": "5000" },
        { "action": "click", "selector": "button:has-text('Criar')" },
        { "action": "screenshot", "name": "deal-created" }
      ]
    }
  ]
}
```

### Script Playwright (resumo)

```ts
import { chromium } from "@playwright/test"
import pixelmatch from "pixelmatch"
import { PNG } from "pngjs"
import fs from "node:fs/promises"

interface Step {
  action: "goto" | "fill" | "click" | "waitForURL" | "screenshot"
  value?: string
  selector?: string
  name?: string
}

async function runFlow(flowName: string, steps: Step[], baseURL: string) {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  const screenshots: { name: string; path: string }[] = []

  try {
    for (const step of steps) {
      switch (step.action) {
        case "goto":
          await page.goto(`${baseURL}${step.value}`)
          break
        case "fill":
          await page.fill(step.selector!, step.value!)
          break
        case "click":
          await page.click(step.selector!)
          break
        case "waitForURL":
          await page.waitForURL(step.value!)
          break
        case "screenshot": {
          const path = `qa-report/screenshots/${flowName}-${step.name}.png`
          await page.screenshot({ path, fullPage: true })
          screenshots.push({ name: step.name!, path })
          break
        }
      }
    }
  } finally {
    await browser.close()
  }
  return screenshots
}

async function compareWithBaseline(currentPath: string, baselinePath: string) {
  const current = PNG.sync.read(await fs.readFile(currentPath))
  const baseline = PNG.sync.read(await fs.readFile(baselinePath))
  const { width, height } = current
  const diff = new PNG({ width, height })
  const diffPixels = pixelmatch(current.data, baseline.data, diff.data, width, height, {
    threshold: 0.1,
  })
  const totalPixels = width * height
  const diffPercent = (diffPixels / totalPixels) * 100
  return { diffPixels, diffPercent, diffImage: diff }
}
```

### HTML report (skeleton)

```html
<!doctype html>
<html lang="pt-BR">
  <head><meta charset="utf-8"><title>QA Visual Report</title></head>
  <body>
    <h1>QA Visual — {{timestamp}}</h1>
    <p>Total: {{total}} fluxos, {{passed}} passaram, {{failed}} regrediram.</p>
    <ul>
      {{#flows}}
      <li>
        <h2>{{name}} — <span class="status-{{status}}">{{status}}</span></h2>
        <div class="row">
          <figure><figcaption>baseline</figcaption><img src="{{baseline}}"></figure>
          <figure><figcaption>atual</figcaption><img src="{{current}}"></figure>
          <figure><figcaption>diff ({{diffPercent}}%)</figcaption><img src="{{diff}}"></figure>
        </div>
      </li>
      {{/flows}}
    </ul>
  </body>
</html>
```

## Exemplos

### Exemplo 1: Validação pré-deploy
**Input:** "Roda QA visual em https://staging.inboxai.com.br nos 5 fluxos do qa-flows.json"
**Output:** Relatório indica que 4/5 passaram, fluxo "create-deal" tem 3.2% de pixels diferentes na seção do botão CTA — provavelmente mudança de cor sem querer.

### Exemplo 2: Sem baseline
**Input:** "Captura screenshots de 3 fluxos da minha home pra ter baseline"
**Output:** Roda fluxos, salva em `qa-baseline/`, sem comparação. Confirma que próxima rodada já compara.

## Aprendizados

- Resoluções diferentes geram diff falso. Sempre fixe viewport.
- Animações CSS geram diff. Adicione `animation-duration: 0s` em `body *` no setup.
- Web fonts atrasadas geram diff. Aguarde `document.fonts.ready` antes do screenshot.
