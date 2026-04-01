# 📜 Regras de Negócio — FinTrack Premium

### 💰 Cálculo de Saldos

```python
Saldo Real        = Entradas do mês − Gastos Fixos − Gastos Variáveis do mês
Saldo Disponível  = Saldo Real − Média de Gastos Variáveis (últimos 3 meses)
Patrimônio Total  = Σ Investimentos + Σ Cofrinhos + Σ Reservas SOS
Sobrevivência     = Reserva SOS Total ÷ Média de Gastos Mensais (em meses)
```

> **Regra de Ouro:** Gastos Fixos são "reservados virtualmente" no primeiro dia do mês, reduzindo o Saldo Real disponível imediatamente, mesmo antes de serem pagos.

### 💳 Transações

- Toda saída **deve** ser classificada como PIX, Débito ou Crédito.
- Se Débito ou Crédito: selecionar o cartão é **obrigatório**.
- Transações para Cofrinho ou Investimentos são classificadas como **Movimentação de Patrimônio** — não entram no cálculo de "Saídas" do Dashboard.
- Gastos Fixos marcados em um mês são **provisionados automaticamente** nos meses seguintes (podem ser editados ou removidos).

### 📊 Método dos Envelopes

| Percentual atingido | Comportamento |
|--------------------|---------------|
| < 50% | Normal (verde) |
| 50–79% | Aviso leve (amarelo claro) |
| 80–99% | Alerta visual — card pulsa (âmbar) |
| 100%+ | Alerta crítico — card fica vermelho |

### 🐷 Metas (Cofrinho)

- Projeção de tempo recalculada a cada depósito: `(Valor Alvo − Valor Atual) ÷ Média Mensal de Aportes`
- Retirada reduz o valor atual e ajusta a projeção automaticamente
- Ao atingir 100%: dispara animação de confetes e notificação
- Se retirar: sistema valida `goal.current_amount < amount` e dispara `HTTP 400` se insuficiente.
