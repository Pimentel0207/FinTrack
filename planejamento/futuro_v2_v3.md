# 🚀 V2 & V3 — Futuro do FinTrack Premium

## 🚀 V2 — Features Premium

*Implementar após a conclusão e estabilização da V1.*

### 💰 Saldos Inteligentes
- **Saldo Total:** soma de todas as entradas históricas
- **Saldo Disponível:** Saldo Total − gastos fixos do mês
- **Saldo Seguro:** Saldo Disponível − média de gastos variáveis
> 🎯 Objetivo: eliminar a falsa sensação de "tenho dinheiro disponível"

### 💳 Sistema de Cartões Completo
- Campos adicionais por cartão: Limite total | Valor utilizado | Data de fechamento | Data de vencimento
- Compras no crédito vão para fatura futura (próxima ou atual, baseado na data de fechamento)
- Cálculo automático: Fatura atual + Próxima fatura

### 📦 Envelopes Inteligentes
- Alertas progressivos: 50% → leve | 80% → visual | 100% → crítico
- Previsão: *"Você vai estourar essa categoria em X dias"* (baseado na média diária de gastos)

### 🐷 Cofrinho Gamificado
- Metas com imagem personalizada (upload)
- Sistema de streaks (dias consecutivos economizando)
- Histórico de aportes por meta

### 📊 Dashboard com Insights
- Comparação automática com o mês anterior
- Maior categoria de gasto do mês
- Exemplos de frases: *"Você gastou 20% a mais que mês passado"* | *"Seu maior gasto foi Alimentação (R$ X)"*

### 🚨 Modo Crise
Ativado manualmente ou quando Saldo Real for negativo:
- Destaque visual em vermelho nos gastos não essenciais
- Exibe "Tempo de Sobrevivência" em dias
- Sugestões automáticas de cortes baseadas no histórico

### 🧬 Hábitos Financeiros
- Usuário cria metas comportamentais (ex: *"Não gastar com delivery esta semana"*)
- Streak + progresso visual + badge ao completar

### 🏗️ Evolução de Arquitetura
- ORM: SQLModel em todas as etapas (já usando PostgreSQL desde a V1)
- Cache leve com Redis + `fastapi-limiter` (substitui o `slowapi` in-memory da V1)
- Rate limiting por usuário (Redis compartilhado entre workers)
- Preparação para deploy em cloud (Railway, Render ou VPS)

---

## 🧠 V3 — IA Financeira

*Implementar após estabilização da V2. Requer integração com APIs externas.*

### 🎯 Objetivo
Transformar fotos de comprovantes e boletos em dados estruturados, insights automáticos e decisões inteligentes.

### 🔍 Pipeline
```
Imagem → OCR (Google Vision) → Texto → Classificação (GPT) → Parser → Banco de Dados → Insights
```

### 🧾 Tipos de Documento Suportados
| Tipo | Dados extraídos |
|------|----------------|
| `cupom_fiscal` | Estabelecimento, itens, preços, total, data |
| `nota_fiscal` | CNPJ, itens detalhados, impostos |
| `boleto` | Beneficiário, valor, vencimento, código de barras |
| `fatura_cartao` | Banco, total, data de fechamento e vencimento |
| `recibo` | Valor, descrição, data |
| `comprovante_digital` | Tipo de pagamento, valor, destinatário |

### 📊 Modelo de Dados — Produto (Pydantic)

```python
class Product(BaseModel):
    id: uuid.UUID
    name: str  # Nome normalizado pela IA (ex: "Arroz Integral 1kg")
    brand: Optional[str] = None
    category: str
    avg_price: float
    last_price: float
    unit: str  # Unidade de medida (kg, un, L)
    history: List[dict]
```

### 📤 Formato de Resposta da API (Cupom Fiscal)

```json
{
  "success": true,
  "data": {
    "documentType": "cupom_fiscal",
    "confidence": 0.98,
    "extractedData": {
      "establishment": "Supermercado Komprão",
      "date": "2024-03-25",
      "total": 157.50,
      "currency": "BRL",
      "items": [
        { "name": "Arroz 5kg", "price": 25.90, "qty": 1 },
        { "name": "Feijão Preto", "price": 8.50, "qty": 2 }
      ]
    },
    "suggestedCategory": "Mercado",
    "aiInsights": "Seu gasto com arroz subiu 10% em relação ao mês passado."
  }
}
```

### ⚠️ Tabela de Erros

| Código | Mensagem | Causa | Ação no Frontend |
|--------|----------|-------|-----------------|
| `ERR_LOW_CONFIDENCE` | Não conseguimos ler claramente. | Imagem embaçada ou escura | Solicitar nova foto |
| `ERR_INVALID_TYPE` | Documento não suportado. | Foto de algo não financeiro | Exibir alerta informativo |
| `ERR_OCR_FAILURE` | Falha no processamento de texto. | Erro na Google Vision API | Botão "Tentar novamente" |
| `ERR_LIMIT_EXCEEDED` | Limite de processamento atingido. | Cota de IA esgotada | Sugerir upgrade Premium |

### 🏆 Features de IA

- **Memória de Preços:** histórico por produto para rastrear variações
- **Comparação de Mercados:** ranking automático por preço médio de produtos recorrentes
- **Leitura de Boletos:** cria conta a pagar automaticamente com alerta de vencimento
- **Detecção de Anomalias:** *"Esse gasto está 3x acima da sua média"*
- **Insights comportamentais:** análise de padrões de consumo ao longo do tempo

### 🟢 Níveis de Evolução da IA

| Nível | Funcionalidades |
|-------|----------------|
| 🟢 MVP | Identificar tipo de documento, extrair total, sugerir categoria |
| 🟡 Intermediário | Extrair itens, histórico de preços, alertas de boleto |
| 🔴 Avançado | Comparação de preços entre mercados, ranking, detecção de fraude |
