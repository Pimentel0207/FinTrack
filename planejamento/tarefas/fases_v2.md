# 🚀 Fases & Tarefas — V2 (Features Premium)

> Implementar após a V1 estar estável e em produção. Foco em inteligência financeira e gamificação.
>
> **Legenda:** 🗄️ = Banco | ⚙️ = Backend | 🎨 = Frontend | 🔗 = Integração

---

## FASE 9 — 💳 Sistema de Cartões Completo
> **Objetivo:** Transformar apelidos simples em gestão real de faturas.
> **Depende de:** V1 concluída (Fase 8).

| # | Camada | Tarefa | Detalhe |
|---|--------|--------|---------|
| 9.1 | 🗄️ | Migração: adicionar colunas na tabela `card` | `credit_limit`, `used_amount`, `closing_day`, `due_day` |
| 9.2 | ⚙️ | Atualizar Model e Schemas de Card | Novos campos opcionais |
| 9.3 | ⚙️ | Lógica de fatura | Compras no crédito → fatura futura baseada no `closing_day` |
| 9.4 | ⚙️ | Rota `GET /cards/:id/invoice` | Retorna fatura atual e próxima fatura |
| 9.5 | 🎨 | Card de Fatura na UI | Exibir: limite, usado, disponível, data de vencimento |
| 9.6 | 🎨 | Barra de progresso do limite | Visual: verde → amarelo → vermelho |
| 9.7 | 🔗 | Testar fluxo | Criar cartão completo → compra no crédito → ver fatura |

**✅ Fase 9 concluída quando:** Cartões mostram limite, fatura atual e próxima fatura.

---

## FASE 10 — 💰 Saldos Inteligentes & Envelopes V2
> **Objetivo:** Suldos mais precisos e previsões de envelope.
> **Depende de:** Fase 9 concluída.

| # | Camada | Tarefa | Detalhe |
|---|--------|--------|---------|
| 10.1 | ⚙️ | Novo cálculo: Saldo Seguro | `Saldo Disponível − média de gastos variáveis (3 meses)` |
| 10.2 | ⚙️ | Atualizar `GET /dashboard/summary` | Incluir Saldo Total, Disponível e Seguro |
| 10.3 | ⚙️ | Previsão de estouro de envelope | Média diária de gastos → "vai estourar em X dias" |
| 10.4 | 🎨 | 3 cards de saldo no Dashboard | Total, Disponível e Seguro com cores distintas |
| 10.5 | 🎨 | Previsão no card de envelope | Texto: "Você vai estourar Alimentação em 5 dias" |
| 10.6 | 🔗 | Testar fluxo | Verificar que os saldos batem com a lógica documentada |

**✅ Fase 10 concluída quando:** Dashboard mostra 3 tipos de saldo e envelopes com previsão.

---

## FASE 11 — 📊 Insights & Comparações
> **Objetivo:** Dashboard que fala com o usuário.
> **Depende de:** Fase 10 concluída.

| # | Camada | Tarefa | Detalhe |
|---|--------|--------|---------|
| 11.1 | ⚙️ | Rota `GET /dashboard/insights` | Retorna frases baseadas nos dados |
| 11.2 | ⚙️ | Comparação mensal | "Você gastou 20% a mais que mês passado" |
| 11.3 | ⚙️ | Maior categoria | "Seu maior gasto foi Alimentação (R$ X)" |
| 11.4 | ⚙️ | Tendência | "Nos últimos 3 meses seus gastos estão subindo" |
| 11.5 | 🎨 | Painel de Insights no Dashboard | Cards com ícones e frases dinâmicas |
| 11.6 | 🔗 | Testar com dados reais | Inserir 3+ meses de dados e verificar insights |

**✅ Fase 11 concluída quando:** Dashboard gera insights automaticamente baseados no histórico.

---

## FASE 12 — 🐷 Cofrinho Gamificado & Hábitos
> **Objetivo:** Motivar o usuário a economizar com gamificação.
> **Depende de:** V1 Fase 5 concluída.

| # | Camada | Tarefa | Detalhe |
|---|--------|--------|---------|
| 12.1 | 🗄️ | Migração: adicionar colunas na tabela `goal` | `image_url`, `streak_count`, `last_deposit_date` |
| 12.2 | 🗄️ | Nova tabela `habit` | `id`, `user_id`, `title`, `streak`, `target_days`, `created_at` |
| 12.3 | 🗄️ | Nova tabela `deposit_history` | `id`, `goal_id`, `amount`, `created_at` (histórico de aportes) |
| 12.4 | ⚙️ | Models e Schemas para `habit` e `deposit_history` | Criar arquivos |
| 12.5 | ⚙️ | CRUD + Rotas `/habits` | GET, POST, PATCH, DELETE + `POST /habits/:id/checkin` |
| 12.6 | ⚙️ | Lógica de streak no cofrinho | Incrementa se depositou dia consecutivo |
| 12.7 | ⚙️ | Rota `GET /goals/:id/history` | Histórico de depósitos/retiradas |
| 12.8 | 🎨 | Upload de imagem na meta | Imagem personalizada no card |
| 12.9 | 🎨 | Badge de streak | "🔥 5 dias seguidos economizando!" |
| 12.10 | 🎨 | Página de Hábitos | Lista de metas comportamentais com progresso |
| 12.11 | 🔗 | Testar fluxo | Criar hábito → check-in diário → ver streak → badge |

**✅ Fase 12 concluída quando:** Cofrinhos têm streaks, histórico e imagens. Hábitos funcionam.

---

## FASE 13 — 🚨 Modo Crise & Cache
> **Objetivo:** Alertas de emergência financeira e performance.
> **Depende de:** Fase 10 concluída (saldos inteligentes).

| # | Camada | Tarefa | Detalhe |
|---|--------|--------|---------|
| 13.1 | ⚙️ | Lógica de Modo Crise | Ativar quando Saldo Real < 0 ou manualmente |
| 13.2 | ⚙️ | Rota `GET /dashboard/crisis` | Tempo de sobrevivência em dias + sugestões de corte |
| 13.3 | ⚙️ | Instalar Redis ou FastAPI-Cache | Cache para cálculos do Dashboard |
| 13.4 | ⚙️ | Cachear `GET /dashboard/summary` | TTL de 5 min (invalidar ao criar transação) |
| 13.5 | 🎨 | Visual Modo Crise | Fundo vermelho, destaque em gastos não essenciais |
| 13.6 | 🎨 | Card de Sobrevivência | "Você tem dinheiro para X dias" |
| 13.7 | 🎨 | Sugestões de corte | "Cortar Lazer economizaria R$ X/mês" |
| 13.8 | 🔗 | Testar fluxo | Simular saldo negativo → verificar modo crise ativo |

**✅ Fase 13 concluída quando:** App detecta crise financeira e sugere cortes. Dashboard com cache.

---

## 📊 Mapa de Dependências (V2)

```
FASE 8 (V1 Pronta)
  ├── FASE 9  (Cartões Completo)
  │    └── FASE 10 (Saldos Inteligentes)
  │         ├── FASE 11 (Insights & Comparações)
  │         └── FASE 13 (Modo Crise & Cache)
  └── FASE 12 (Cofrinho Gamificado & Hábitos)
```
