# Vertical: Clínicas

Customização do InboxAI pra clínicas (médicas, odontológicas, fisioterapia, estética, psicologia). Foco em **agendamento + lembrete de consulta + retorno**.

## Persona

**Nome:** Dra. Carla, dona de clínica odontológica de 4 cadeiras em bairro nobre.
**Idade:** 38-50.
**Time:** 1 secretária + 2 dentistas associados + ela.

### Dores principais
1. **Secretária sobrecarregada.** Atende WhatsApp, recebe paciente, telefone, emergência. Erra agenda.
2. **Paciente faltoso (no-show).** 15-20% das consultas marcadas o paciente não aparece. Buraco de R$ 200-500 cada.
3. **Falta de retorno (recall).** Paciente que fez limpeza há 6 meses e não voltou. Perde lifetime value.
4. **Lead frio mata.** Mensagem chega de noite ou domingo, secretária só responde segunda 9h, lead já fechou em outro lugar.
5. **Sem rastreio do funil.** "Quantas pessoas pediram orçamento esse mês?" → "Não sei, é tudo no WhatsApp."

### O que ela teme
- Que o paciente sinta que está conversando com robô (clínica é relação humana).
- Que dado de paciente vaze (LGPD da saúde é mais rigorosa).
- Que ela perca controle de quem foi atendido por quem.

### O que ela quer
- Agenda lotada com pacientes que **vêm**.
- Time mais leve, menos estressado.
- Visão clara: "X leads → Y agendamentos → Z consultas realizadas → R$ R faturado".

## Adaptações de UI

### Termos
- "Contato" → **Paciente**
- "Deal" → **Tratamento** ou **Orçamento**
- "Pipeline" → **Funil de pacientes**
- "Conversa" → **Atendimento**

### Campos extras na ficha do paciente
- CPF (obrigatório pra LGPD)
- Data de nascimento
- Convênio (campo livre)
- Histórico de consultas (linkado com a agenda)
- Última visita
- Próxima visita
- Anamnese (link pra prontuário externo se houver)

### Tela nova: "Agenda"
Calendário com slots livres / ocupados, integrado com Google Calendar. Cliente clica em slot → puxa última conversa do paciente → confirma agendamento → manda confirmação automática no WhatsApp.

### Componente: "Avisar atrasado"
Lista pacientes agendados pras próximas 2h. Botão "lembrar" manda mensagem pré-formatada.

## Pipeline customizado

```
1. Lead (mensagem inicial)
2. Qualificação (entendendo a necessidade)
3. Orçamento enviado
4. Aguardando decisão
5. Agendado (consulta marcada)
6. Em tratamento (caso plano de tratamento longo)
7. Concluído (alta)
8. Recall agendado (próxima limpeza/retorno)
```

Estado **9. Perdido** com motivos: preço, distância, não respondeu, marcou em outra clínica, outro motivo.

## Prompt do agente IA (base pra customizar)

```text
Você é o assistente virtual da {{nome_clinica}}, uma clínica odontológica em {{cidade}}.
Sua função é ATENDER pacientes que entram em contato pelo WhatsApp e ENCAMINHAR pra agendamento ou pro time humano.

COMPORTAMENTO:
- Educado, caloroso, mas objetivo. Não use girias.
- Sempre cumprimente pelo nome se já tiver no histórico.
- Se for primeira mensagem, pergunte: nome, motivo da consulta, se tem convênio.
- Se for emergência (dor forte, sangramento, trauma), MARQUE como urgente e escale pra humano IMEDIATAMENTE.
- Se for orçamento, colete: o que precisa, urgência, faixa de orçamento. Encaminhe pra dentista.
- Se for agendamento, confirme dia/hora preferida e ESCALE pra humano confirmar.
- Se for retorno (paciente já é nosso), facilita o reagendamento puxando o histórico.

NUNCA:
- Dê diagnóstico. Sempre fale "vamos confirmar com o dentista".
- Prometa preço sem confirmar. "O orçamento é definido após avaliação."
- Compartilhe dado de outro paciente.
- Use linguagem técnica que confunda (cárie ok; "lesão cariosa proximal" não).

QUANDO ESCALAR PRA HUMANO:
- Emergência clínica
- Reclamação ou insatisfação
- Pedido de remarcação após cancelamento prévio
- Paciente quer falar com a Dra. específica
- Qualquer dúvida que envolva diagnóstico ou plano de tratamento

INFORMAÇÕES DA CLÍNICA:
- Endereço: {{endereco}}
- Horário: {{horario_funcionamento}}
- Convênios aceitos: {{lista_convenios}}
- Especialidades: {{lista_especialidades}}
```

## Integrações específicas

### Google Calendar (essencial)
- OAuth da Dra. ou da clínica.
- Sincronização bidirecional: agendamento criado no app vai pro Calendar; bloqueio criado no Calendar é refletido como "indisponível" no app.
- Lembrete automático 24h antes via WhatsApp ("Olá, é amanhã às 14h sua consulta na...").
- Lembrete 1h antes ("Você tem consulta em 1h, está vindo?").

### Iclinic / Doctoralia / Dental Office (opcional, depende do que a clínica usa)
Webhook pra criar paciente no sistema deles quando vira agendamento confirmado. Reduz double entry.

### Asaas / Cobre Fácil (cobrança)
Após orçamento aceito, gera cobrança Pix/cartão automática. Vincula no app o status (pago/pendente/atrasado).

## Pricing sugerido

| Plano | R$/mês | Inclui |
|-------|--------|--------|
| **Essencial** | 297 | 1 instância WhatsApp, agente IA básico, agenda Google, até 500 conversas/mês |
| **Pro** | 597 | 2 instâncias, agente customizado, integração Iclinic, até 2k conversas, relatórios |
| **Premium** | 997 | Multi-unidade, white-label, integração customizada, ilimitado |

**Setup:** R$ 2.000-3.500 single (configuração + treinamento + customização do agente).

**Argumento de valor:** "Se reduzir 1 no-show por semana, paga sozinho. R$ 200-500 por consulta perdida × 4 semanas = R$ 800-2.000 economizados/mês."

## 3 objeções comuns + resposta

### Objeção 1: "Meu paciente não gosta de robô."
**Resposta:** "Concordo, e é por isso que o agente avisa quem ele é desde a primeira mensagem ('aqui é a Sofia, atendente virtual da Dra. Carla'). Toda mensagem complexa ou emocional é encaminhada pra sua secretária na hora. O paciente percebe humanidade — e ainda é atendido às 22h de domingo, quando a secretária está em casa."

### Objeção 2: "E LGPD? Os dados ficam onde?"
**Resposta:** "Os dados ficam em servidor brasileiro (Convex Cloud com região São Paulo). Temos contrato de DPA assinado, política de retenção de 12 meses configurável, e pseudonimização das mensagens em logs. Posso te enviar o termo de processamento de dados — ele é mais rigoroso que o que você assina hoje com WhatsApp Business."

### Objeção 3: "Já uso planilha + secretária, está OK."
**Resposta:** "Entendo. Posso te perguntar uma coisa? Quantas mensagens entram fora do horário comercial — sábado à tarde, domingo, depois das 19h? [pausa]. Cada uma dessas é um paciente que provavelmente vai marcar em outro lugar até segunda. O sistema responde **na hora**, qualifica, e quando sua secretária chegar segunda 9h, já tem 12 pacientes pré-agendados pra ela só confirmar. É menos trabalho, não mais."

## Setup técnico (resumo do que muda do boilerplate base)

1. Trocar terminologia em `src/lib/i18n.ts` (criar arquivo de mapping)
2. Adicionar campos do paciente em `convex/schema.ts` na tabela `contact`
3. Criar tabela `appointment` em `convex/schema.ts`
4. Criar action `convex/actions/googleCalendarSync.ts`
5. Criar página `/agenda` em `src/app/(app)/agenda/page.tsx`
6. Substituir prompt em `convex/lib/prompts.ts` pelo prompt clínica
7. Criar cron job em `convex/crons.ts` pra lembrete 24h e 1h
8. Adicionar OAuth Google Calendar no setup wizard

Tempo estimado: **2-3 dias** depois do boilerplate base estar rodando.
