---
name: landing-page
description: Gera uma landing page high-converting com 5 seções padrão (hero, dor, solução, prova social, CTA) usando Next.js 15 + Tailwind + shadcn/ui. Use quando o usuário pedir "landing", "página de vendas", "página de captura" ou "lançamento".
when_to_use: Usuário pede uma landing nova; precisa de página de captura para campanha; quer transformar copy em página renderizada; quer adaptar uma landing existente para uma nova oferta.
---

# Skill: Landing Page

## Quando usar

- "Preciso de uma landing pra [produto/serviço]"
- "Monta uma página de captura"
- "Página de vendas pra meu curso/SaaS"
- "Quero testar uma oferta com landing"
- "Adapta essa copy em landing"

**NÃO usar quando:** o usuário pede um site institucional inteiro (várias páginas, blog, etc.) — isso é outra skill.

## Como funciona — passo a passo

### Passo 1: Coletar contexto (se não veio no prompt)
Pergunte ao usuário, em uma única mensagem:
- Produto/serviço (1 frase)
- Público-alvo (1 frase)
- Promessa principal (1 frase)
- 3 dores que ele resolve
- 3 benefícios concretos
- Prova social disponível (depoimentos, números, logos)
- CTA (cadastro, compra, agendamento?)
- Tom de voz (formal, descontraído, técnico?)

### Passo 2: Estruturar as 5 seções
Sempre nessa ordem:

1. **Hero** — headline + subheadline + CTA primário + imagem/vídeo
2. **Dor** — empatia: "se você está cansado de X, Y, Z..."
3. **Solução** — apresenta o produto + 3 benefícios + screenshot/mockup
4. **Prova social** — depoimentos, logos de clientes, números
5. **CTA final** — repete a oferta + reforça escassez/urgência se aplicável

### Passo 3: Gerar arquivos
Crie a estrutura:
```
landing-<slug>/
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
└── components/
    ├── Hero.tsx
    ├── Pain.tsx
    ├── Solution.tsx
    ├── SocialProof.tsx
    ├── FinalCTA.tsx
    └── ui/
        ├── button.tsx
        └── card.tsx
```

### Passo 4: Confirmar antes de prosseguir
Antes de gerar, mostra o esqueleto e pergunta: "vou gerar com essa estrutura, ok?"

### Passo 5: Gerar e instruir
Após gerar, mostra o comando final:
```bash
cd landing-<slug>
npm install
npm run dev
```

## Inputs esperados

| Campo | Obrigatório | Default se omitido |
|-------|-------------|--------------------|
| Produto | Sim | — |
| Público | Sim | — |
| Promessa | Sim | — |
| Dores (3) | Não | Pede |
| Benefícios (3) | Não | Pede |
| Prova social | Não | Placeholder com TODO |
| CTA | Não | "Comece agora" |
| Tom | Não | Direto e prático |
| Cor primária | Não | `slate` |

## Outputs

- Pasta completa com Next.js 15 rodável
- `npm run dev` funciona out-of-the-box
- 5 componentes React separados, cada um < 80 linhas
- Tailwind configurado, shadcn/ui copiado (não dependência)
- Acessibilidade: heading hierarchy correta, alt em imagens, contraste OK
- Responsivo mobile-first
- Sem JS desnecessário (só Server Components, exceto onde precisa interatividade)

## Templates

### Hero.tsx (base — adapte)

```tsx
import { Button } from "@/components/ui/button"

interface HeroProps {
  headline: string
  subheadline: string
  ctaText: string
  ctaHref: string
}

export function Hero({ headline, subheadline, ctaText, ctaHref }: HeroProps) {
  return (
    <section className="px-6 py-24 md:py-32 max-w-5xl mx-auto text-center">
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
        {headline}
      </h1>
      <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
        {subheadline}
      </p>
      <Button asChild size="lg">
        <a href={ctaHref}>{ctaText}</a>
      </Button>
    </section>
  )
}
```

### Pain.tsx

```tsx
interface PainProps {
  title: string
  pains: string[]
}

export function Pain({ title, pains }: PainProps) {
  return (
    <section className="px-6 py-24 bg-slate-50">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center">{title}</h2>
        <ul className="space-y-4">
          {pains.map((pain) => (
            <li key={pain} className="flex gap-3 items-start">
              <span aria-hidden className="text-red-500 text-2xl leading-none mt-1">•</span>
              <span className="text-lg">{pain}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
```

### Comando para shadcn/ui

```bash
npx shadcn@latest init
npx shadcn@latest add button card
```

## Exemplos

### Exemplo 1: Landing pra curso de IA

**Input:** "Cria uma landing pro meu curso 'Master Codex' — ensina dev a usar agentes de IA pra entregar 5x mais rápido. Público: dev sênior cansado de tarefa repetitiva. Dores: revisar PR de júnior, escrever boilerplate, debugar erro bobo. CTA: comprar (R$ 5k)."

**Output esperado:**
- Pasta `landing-master-codex/`
- Hero: "Entregue 5x mais código com agentes de IA"
- Subheadline focada em dev sênior
- Pain section com as 3 dores ditadas
- CTA: "Garantir vaga por R$ 5.000"

### Exemplo 2: Landing pra serviço B2B

**Input:** "Landing pra consultoria que automatiza atendimento via WhatsApp pra clínicas. Público: dono de clínica. Promessa: agendar mais consultas sem contratar atendente."

**Output esperado:**
- Tom mais formal (B2B saúde)
- Hero com mockup de WhatsApp
- Pain section: "atendente cara/fim de semana sem cobertura/agenda mal preenchida"
- CTA: "Agendar diagnóstico gratuito" (lead gen, não venda direta)

## Aprendizados (atualize com o uso)

- (espaço pra você anotar o que a skill faz mal e ir corrigindo)
