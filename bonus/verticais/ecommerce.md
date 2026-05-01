# Vertical: E-commerce

Customização do InboxAI pra lojas online. Foco em **pós-venda + recuperação de carrinho + atendimento durante a navegação**.

## Persona

**Nome:** Juliana, dona de loja Shopify de moda feminina, 4 anos no ar, ~R$ 80-200k de faturamento/mês.
**Idade:** 28-40.
**Time:** Ela + 1 estagiária + 1 freelancer de mídia paga.

### Dores principais
1. **Carrinho abandonado.** 70% dos clientes adicionam produto e não finalizam. Email de recuperação é ignorado, WhatsApp converte 3-5x mais — mas mandar manual é impossível.
2. **Pré-venda no DM toma o dia.** "Esse vestido tem tamanho M?" "Cor X tá disponível?" "Quanto frete pra meu CEP?". Repete 50x por dia.
3. **Pós-venda ansioso.** "Saiu da agência?" "Vai chegar quando?" "Não saiu da preparação..." — cliente cobrando rastreio.
4. **Devolução / troca.** Processo manual, perde dia inteiro pra resolver 3 trocas.
5. **Cliente recorrente esquecido.** Comprou 1x, nunca mais. Sem campanha de winback.

### O que ela teme
- Que IA fale errado e gere ressentimento (cliente moda é exigente).
- Que o frete cobrado pelo bot seja diferente do site (gera reclamação).
- Que comentários negativos virem reviews ruins.

### O que ela quer
- Carrinho recuperado **automático**, com cupom contextual.
- Pré-venda atendida 24/7 sem ela.
- Status de pedido respondido sozinho.
- Campanha de recompra pro cliente que comprou 60+ dias atrás.

## Adaptações de UI

### Termos
- "Contato" → **Cliente**
- "Deal" → **Pedido**
- "Pipeline" → **Jornada do pedido** (não venda — venda já aconteceu no Shopify)

### Campos extras na ficha do cliente
- ID do cliente Shopify/Loja Integrada/Tray
- LTV (lifetime value) total gasto
- Última compra (data)
- Frequência de compra
- Tamanho preferido (P/M/G/etc)
- Categoria favorita (calculado)
- CEP

### Tela nova: "Carrinhos abandonados"
Lista de carrinhos abertos há mais de 1h não convertidos. Status: aguardando 1ª msg / 1ª msg enviada / respondeu / converteu / perdido. Botão "recuperar agora" ou regra automática.

### Tela nova: "Pedidos"
Sincronizada com Shopify. Cada pedido linkado ao cliente (que tem conversa WhatsApp).

## Pipeline customizado (jornada do cliente)

```
1. Visitante (engajou no chat sem pedir)
2. Carrinho aberto
3. Checkout iniciado
4. Compra confirmada
5. Pedido em preparação
6. Enviado
7. Entregue
8. Pós-venda (avaliação + recompra)
```

E pipeline paralelo de **suporte**:
```
1. Dúvida pré-venda
2. Pedido de troca/devolução
3. Reclamação
4. Resolvido
```

## Prompt do agente IA

```text
Você é a {{nome_atendente}}, assistente virtual da {{nome_loja}}, loja online de {{categoria}}.
Sua função: TIRAR DÚVIDAS de pré-venda, RECUPERAR carrinhos abandonados e RESPONDER status de pedidos.

COMPORTAMENTO:
- Tom: descontraído, empática, sem ser informal demais. Imagine vendedora de loja de bairro de bom gosto.
- Use 1 emoji por mensagem max. Não exagera.
- Sempre que possível, sugira uma alternativa quando o cliente perguntar por produto esgotado.
- Para frete, SEMPRE consulte API da loja (não invente valor).
- Para status de pedido, consulte ID do pedido (cliente passa, ou puxa do telefone cadastrado).
- Para recuperar carrinho:
  * Mensagem 1 (1h após abandono): "Oi {{nome}}, vi que você gostou do {{item}}. Tem alguma dúvida?"
  * Mensagem 2 (24h após, se não converteu): "Reservei o {{item}} no seu tamanho {{tamanho}}. Quer fechar com 10% off? Cupom VOLTA10."
  * Mensagem 3 (72h após, se nada): "Última chance — o cupom VOLTA10 expira hoje."

NUNCA:
- Invente prazo de entrega. Use sempre o que a transportadora informa.
- Prometa desconto sem cupom criado no sistema.
- Discuta política de troca antes de confirmar com o time (regras mudam).
- Reclame de cliente difícil. Sempre escale com cordialidade.

QUANDO ESCALAR PRA HUMANO:
- Reclamação grave (produto chegou errado, demorou demais, quer reembolso)
- Cliente VIP (LTV > R$ X) com qualquer dúvida
- Pedido custom / personalização
- Pedido B2B (compra em volume)

INFORMAÇÕES DA LOJA:
- CNPJ: {{cnpj}}
- Política de troca: 7 dias após recebimento
- Frete: cálculo via {{plataforma_frete}}
- Pagamento: {{formas_pagamento}}
```

## Integrações específicas

### Shopify / Loja Integrada / Tray / Nuvemshop
- Sync de produtos, estoque, pedidos via webhook.
- Detecção de carrinho abandonado (Shopify dispara webhook em `cart/update` com produtos pendentes >1h).
- Status do pedido em tempo real.

### Melhor Envio / Frenet (frete)
API pra cálculo de frete por CEP em tempo real. Cliente passa CEP → bot devolve valor + prazo na hora.

### Correios SRO
Tracking automático: a cada update de status, dispara mensagem pro cliente ("seu pedido saiu pra entrega hoje").

### Cupons (próprio Shopify ou Cupomzeiro)
Cria cupom dinâmico (VOLTA10, ALERTA15) pra recuperação. Cupom expira em 72h.

### Stripe / Pagar.me / Mercado Pago
Pra cliente que prefere pagar via link direto no WhatsApp (sem voltar pro site).

## Pricing sugerido

| Plano | R$/mês | Inclui |
|-------|--------|--------|
| **Loja Pequena** | 197 | 1 instância, agente, integração 1 plataforma, até 1k conversas |
| **Loja Crescendo** | 497 | 2 instâncias, recuperação automática, integração frete, até 5k conversas |
| **Loja Estabelecida** | 997 | Ilimitado, multi-canal, white-label, integração customizada |

**Setup:** R$ 1.500-3.000 (mais barato porque integração com Shopify é padrão).

**Argumento de valor:** "Recuperar 5% dos carrinhos abandonados que hoje você perde. Loja com R$ 100k/mês de faturamento, 70% abandona = R$ 233k em carrinhos perdidos. Recuperar 5% = +R$ 11k/mês. Sistema custa R$ 497. ROI absurdo."

## 3 objeções comuns + resposta

### Objeção 1: "Já tenho email de recuperação no Shopify."
**Resposta:** "Sim, e converte ~2% do que recupera. WhatsApp converte 8-15% — porque o cliente abre na hora, vê produto na tela, decide. O email entra no spam ou é ignorado. Não precisa trocar — você roda os dois em paralelo. O nosso só entra em contato quem deu opt-in (LGPD ok). Posso te mostrar a métrica de loja parecida com a sua."

### Objeção 2: "Cliente vai sentir invadido se eu mandar WhatsApp depois de só visitar o site."
**Resposta:** "Concordo, e por isso o sistema só inicia contato pra quem **adicionou produto ao carrinho** (= demonstrou intenção forte) **e** deixou WhatsApp no checkout (= consentiu). Quem só passou no site sem cadastrar nada, nunca recebe mensagem. É o oposto de spam — é lembrete pra quem já mostrou interesse."

### Objeção 3: "Eu mesma respondo bem rápido, não preciso."
**Resposta:** "Pergunto: você responde rápido no domingo às 19h? E na segunda, ao mesmo tempo que está postando no IG, gravando reel e processando pedido? O sistema **complementa** você. Em hora pico ele resolve as dúvidas básicas (frete, tamanho, prazo) e te deixa livre pra atender os clientes especiais."

## Setup técnico (resumo)

1. Integração Shopify (OAuth + webhooks principais: `orders/create`, `orders/updated`, `checkouts/update`)
2. Tabela `order` em Convex sincronizada
3. Cron `recoverAbandonedCarts` em `convex/crons.ts` (roda a cada 30min)
4. Action `sendRecoveryMessage` com lógica de 3 tentativas escalonadas
5. Action `getShippingQuote` com Melhor Envio
6. Webhook Correios SRO pra tracking
7. Substituir prompt do agente
8. Criar tela `/orders` e `/abandoned-carts`

Tempo estimado: **2-3 dias** depois do base.
