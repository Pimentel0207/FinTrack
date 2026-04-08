# 🧠 Fases & Tarefas — V3 (IA Financeira)

> Implementar após V2 estável. Requer contas em APIs externas (Google Vision, OpenAI).
>
> **Legenda:** 🗄️ = Banco | ⚙️ = Backend | 🎨 = Frontend | 🔗 = Integração

---

## FASE 14 — 🔧 Infraestrutura de IA
> **Objetivo:** Preparar o backend para receber e processar imagens.
> **Depende de:** V2 concluída.

| # | Camada | Tarefa | Detalhe |
|---|--------|--------|---------|
| 14.1 | ⚙️ | Instalar dependências de IA | `openai`, `google-cloud-vision`, `Pillow` |
| 14.2 | ⚙️ | Configurar API keys no `.env` | `OPENAI_API_KEY`, `GOOGLE_VISION_API_KEY` |
| 14.3 | ⚙️ | Criar pasta `backend/app/ai/` | `ocr.py`, `classifier.py`, `parser.py`, `insights.py` |
| 14.4 | ⚙️ | Criar `ai/ocr.py` | Integração com Google Vision API (texto da imagem) |
| 14.5 | ⚙️ | Criar `ai/classifier.py` | Integração com OpenAI GPT (classificar tipo de documento) |
| 14.6 | ⚙️ | Criar `ai/parser.py` | Extrair dados estruturados do texto classificado |
| 14.7 | ⚙️ | Rota `POST /ai/upload` | Receber imagem → OCR → classificar → parsear → retornar JSON |
| 14.8 | ⚙️ | Tratamento de erros de IA | `ERR_LOW_CONFIDENCE`, `ERR_OCR_FAILURE`, `ERR_LIMIT_EXCEEDED` |
| 14.9 | ⚙️ | Testar no Swagger | Upload de foto de cupom fiscal → verificar dados extraídos |

**✅ Fase 14 concluída quando:** API recebe foto e retorna dados financeiros estruturados.

---

## FASE 15 — 🧾 OCR de Documentos (MVP da IA)
> **Objetivo:** Ler cupons fiscais e criar transações automaticamente.
> **Depende de:** Fase 14 concluída.

| # | Camada | Tarefa | Detalhe |
|---|--------|--------|---------|
| 15.1 | ⚙️ | Parser de cupom fiscal | Extrair: estabelecimento, itens, preços, total, data |
| 15.2 | ⚙️ | Parser de boleto | Extrair: beneficiário, valor, vencimento |
| 15.3 | ⚙️ | Parser de fatura de cartão | Extrair: banco, total, fechamento, vencimento |
| 15.4 | ⚙️ | Auto-criar transação a partir de cupom | Sugere categoria → usuário confirma → salva |
| 15.5 | ⚙️ | Auto-criar lembrete a partir de boleto | Cria alerta de vencimento |
| 15.6 | 🎨 | Botão de câmera no modal de transação | Ícone de câmera que abre upload |
| 15.7 | 🎨 | Tela de confirmação pós-OCR | Exibe dados extraídos → usuário edita → confirma |
| 15.8 | 🎨 | Feedback de confiança | "98% de certeza" com barra visual |
| 15.9 | 🔗 | Testar fluxo completo | Foto de cupom → dados extraídos → confirmar → transação criada |

**✅ Fase 15 concluída quando:** Usuário tira foto de cupom e transação é criada automaticamente.

---

## FASE 16 — 📊 Memória de Preços & Comparação
> **Objetivo:** Rastrear preços de produtos e comparar mercados.
> **Depende de:** Fase 15 concluída.

| # | Camada | Tarefa | Detalhe |
|---|--------|--------|---------|
| 16.1 | 🗄️ | Nova tabela `product` | `id`, `name`, `brand`, `category`, `avg_price`, `last_price`, `unit` |
| 16.2 | 🗄️ | Nova tabela `price_history` | `id`, `product_id`, `price`, `store`, `date`, `user_id` |
| 16.3 | ⚙️ | Models e Schemas de Product | Criar arquivos |
| 16.4 | ⚙️ | Rotas `GET /ai/products` e `GET /ai/products/:id` | Listar produtos e histórico |
| 16.5 | ⚙️ | Normalização de nomes pela IA | "Arroz Tio João 5kg" → "Arroz Integral 5kg" (GPT) |
| 16.6 | ⚙️ | Cálculo de preço médio | Atualizar `avg_price` a cada novo registro |
| 16.7 | ⚙️ | Ranking de mercados | Qual mercado tem preço médio menor por produto |
| 16.8 | 🎨 | Página de Produtos | Lista com nome, preço médio, última compra, variação |
| 16.9 | 🎨 | Gráfico de histórico de preço | Linha do tempo por produto |
| 16.10 | 🎨 | Ranking de mercados | "Mercado X é 15% mais barato para seus produtos" |
| 16.11 | 🔗 | Testar fluxo | Vários cupons → produtos acumulados → comparação visível |

**✅ Fase 16 concluída quando:** App rastreia preços e compara mercados automaticamente.

---

## FASE 17 — 🧠 Insights Inteligentes & Anomalias
> **Objetivo:** IA que avisa quando algo está fora do normal.
> **Depende de:** Fases 15 e 16 concluídas.

| # | Camada | Tarefa | Detalhe |
|---|--------|--------|---------|
| 17.1 | ⚙️ | Criar `ai/insights.py` | Motor de análise de padrões |
| 17.2 | ⚙️ | Detecção de anomalias | "Esse gasto está 3x acima da sua média" |
| 17.3 | ⚙️ | Análise de tendência | "Seus gastos com delivery subiram 40% em 3 meses" |
| 17.4 | ⚙️ | Rota `GET /ai/insights` | Retorna lista de insights ordenados por relevância |
| 17.5 | 🎨 | Cards de Insights no Dashboard | Ícone + frase + ação sugerida |
| 17.6 | 🎨 | Notificação de anomalia | Toast ou push quando detecta gasto anormal |
| 17.7 | 🔗 | Testar com dados reais | 3+ meses de dados → verificar insights gerados |

**✅ Fase 17 concluída quando:** IA detecta anomalias e gera insights comportamentais.

---

## FASE 18 — 📱 IA no Mobile (Câmera Nativa)
> **Objetivo:** Integrar câmera do celular para OCR direto no app.
> **Depende de:** Fase 15 + Mobile V1 (Capacitor configurado).

| # | Camada | Tarefa | Detalhe |
|---|--------|--------|---------|
| 18.1 | 📱 | Instalar `@capacitor/camera` | Plugin de câmera nativa |
| 18.2 | 📱 | Permissões iOS e Android | `Info.plist` e `AndroidManifest.xml` |
| 18.3 | 🎨 | Botão de câmera no modal | Abre câmera nativa para foto |
| 18.4 | 🔗 | Foto → upload → OCR → confirmação | Fluxo completo no mobile |
| 18.5 | 🔗 | Testar em dispositivo real | iPhone e Android com cupom físico |

**✅ Fase 18 concluída quando:** Usuário aponta câmera do celular para cupom e transação é criada.

---

## 📊 Mapa de Dependências (V3)

```
V2 Concluída
  └── FASE 14 (Infraestrutura de IA)
       └── FASE 15 (OCR de Documentos)
            ├── FASE 16 (Memória de Preços)
            │    └── FASE 17 (Insights & Anomalias)
            └── FASE 18 (IA no Mobile)
```
