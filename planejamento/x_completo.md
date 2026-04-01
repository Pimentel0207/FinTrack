# 🏦 FinTrack Premium — Documento de Referência do Projeto

> **Produto voltado ao mercado.** FinTrack é um aplicativo financeiro pessoal para o público geral (18–45 anos), com foco em modernidade e tecnologia no estilo fintech. Suporta dark mode e light mode. Toda decisão de arquitetura, regra de negócio e especificação técnica vive aqui — consulte e atualize sempre que houver mudanças significativas.

---

## 📌 Sumário

1. [💻 Stack Técnica](#-stack-técnica)
2. [📂 Estrutura de Pastas](#-estrutura-de-pastas)
3. [🎨 Design System](#-design-system)
4. [🛠️ Páginas & Componentes](#-páginas--componentes)
5. [📜 Regras de Negócio](#-regras-de-negócio)
6. [🔌 Camada de API](#-camada-de-api)
7. [🗄️ Modelos de Dados](#-modelos-de-dados)
8. [🔐 Segurança — OWASP Top 10:2025](#-segurança--owasp-top-102025)
9. [📱 Estratégia Mobile](#-estratégia-mobile)
10. [📈 Roadmap de Implementação](#-roadmap-de-implementação)
11. [🚀 V2 — Features Premium](#-v2--features-premium)
12. [🧠 V3 — IA Financeira](#-v3--ia-financeira)

---

## 💻 Stack Técnica

| Camada | Tecnologia | Motivo |
|--------|-----------|--------|
| Frontend | React + Vite + TypeScript | Rápido, moderno, tipado |
| Backend | Python 3.12+ + FastAPI | Alta performance, tipagem forte, ecossistema de IA |
| Gráficos | Recharts | Leve, declarativo, feito para React |
| Auth | Passlib (bcrypt) + PyJWT | Seguro e escalável para múltiplos usuários |
| Banco de Dados | **PostgreSQL via SQLModel** | Escolha definitiva para produção e desenvolvimento |
| Mobile (futuro) | Capacitor (PWA → App nativo) | Reutiliza 100% do código React |

> ⚠️ **JSON local foi removido da stack.** Não suporta múltiplos usuários e corrompe dados sob concorrência. Use SQLite apenas em desenvolvimento local. **PostgreSQL é o banco de produção.**

### 🗃️ Por que PostgreSQL?

PostgreSQL é o banco preferido para dados financeiros estruturados em 2025 — e a escolha certa para o FinTrack pelos seguintes motivos:

| Critério | PostgreSQL | SQLite | MongoDB |
|----------|-----------|--------|---------|
| **ACID compliance** | ✅ Total | ✅ Parcial | ⚠️ Eventual |
| **Múltiplos usuários simultâneos** | ✅ Excelente | ❌ Problemático | ✅ Bom |
| **Transações financeiras** | ✅ Nativo | ⚠️ Limitado | ❌ Não ideal |
| **Integridade referencial** | ✅ Foreign keys completas | ✅ Limitada | ❌ Não tem |
| **Escalabilidade** | ✅ Vertical + horizontal | ❌ Arquivo único | ✅ Horizontal |
| **Suporte com SQLModel** | ✅ Primeira classe | ✅ Bom | ✅ N/A |
| **Managed cloud (gratuito/barato)** | ✅ Neon, Supabase, Railway | ❌ N/A | ⚠️ Atlas |

**Serviços recomendados para hospedar o PostgreSQL:**

| Serviço | Plano grátis | Indicado para |
|---------|-------------|---------------|
| **Neon** | Sim (0.5 GB) | Desenvolvimento e MVP |
| **Supabase** | Sim (500 MB) | MVP com painel visual incluído |
| **Railway** | Não (pago desde o início) | Produção simples e barata |
| **Render** | Sim (90 dias, depois pago) | Produção com deploy integrado |

> **Recomendação de caminho:** Neon (dev/MVP gratuito) → Railway ou Render (produção paga)

---

## 📂 Estrutura de Pastas

```
/
├── frontend/                   # React + Vite + TypeScript
│   ├── src/
│   │   ├── assets/             # Imagens, fontes e animações (Lottie)
│   │   ├── components/         # UI reutilizável (Card, Sidebar, Modal, Button)
│   │   ├── contexts/           # Estado global (AuthContext, FinanceContext)
│   │   ├── hooks/              # Lógica extraída (useTransactions, useGoals, useEnvelopes)
│   │   ├── pages/              # Dashboard, Transações, Investimentos, Configurações
│   │   ├── services/           # Comunicação com a API (Axios)
│   │   └── styles/             # index.css com Design Tokens e Glassmorphism
│   └── package.json
│
├── backend/                    # Python + FastAPI
│   ├── app/
│   │   ├── api/                # Rotas (v1)
│   │   ├── core/               # Segurança (JWT), configurações, exceções
│   │   ├── crud/               # Lógica de banco de dados (Create, Read, Update, Delete)
│   │   ├── db/                 # Sessão do banco e conexão
│   │   ├── models/             # Modelos SQLModel (Tabelas do banco)
│   │   ├── schemas/            # Pydantic Schemas (Validação de entrada/saída)
│   │   └── main.py             # Ponto de entrada da aplicação
│   ├── alembic/                # Migrações de banco de dados
│   ├── requirements.txt        # Dependências do projeto
│   └── alembic.ini             # Configuração das migrações
│
├── mobile/                     # Capacitor — iOS e Android
├── package.json                # Raiz: scripts utilitários
└── claude.md                   # Este arquivo
```

**Comandos globais:**
- `uvicorn backend.app.main:app --reload` → Inicia o Backend (:8000)
- `npm run dev` → Inicia o Frontend (:5173)

---

## 🎨 Design System

### Paleta de Cores

> Paleta definida para produto de mercado — público geral (18–45 anos), estilo fintech moderno. Accent azul elétrico transmite confiança e tecnologia sem depender de convenções de banco tradicional. Suporta dark mode (principal) e light mode (opcional).

#### Dark Mode

| Token | Nome | HEX | Uso |
|-------|------|-----|-----|
| `--bg-deep` | Deep Space | `#0d1117` | Fundo principal da página |
| `--bg-surface` | Surface | `#161b26` | Fundo de seções e layouts |
| `--bg-card` | Card | `#1e2535` | Cards e painéis |
| `--bg-elevated` | Elevated | `#252d3d` | Modais, dropdowns, tooltips |
| `--accent` | Azul Elétrico | `#2563eb` | CTAs, botões primários, links ativos |
| `--accent-light` | Azul Claro | `#3b82f6` | Hover states, ícones ativos |
| `--accent-dark` | Azul Escuro | `#1d4ed8` | Pressed states, bordas de foco |
| `--accent-glow` | Blue Glow | `rgba(59,130,246,0.2)` | Sombras e efeitos glow |
| `--success` | Verde | `#22c55e` | Receitas, valores positivos, metas concluídas |
| `--danger` | Coral | `#f87171` | Despesas, erros, alertas críticos |
| `--warning` | Laranja | `#fb923c` | Envelope em 80%, avisos moderados |
| `--info` | Azul Info | `#60a5fa` | Notificações neutras, backups, sessão |
| `--glass-bg` | Glass | `rgba(255,255,255,0.05)` | Fundos translúcidos (glassmorphism) |
| `--glass-border` | Glass Border | `rgba(255,255,255,0.08)` | Bordas de cards glassmorphism |
| `--text-primary` | Branco Suave | `#f1f5f9` | Texto principal |
| `--text-secondary` | Cinza Claro | `#cbd5e1` | Texto secundário, subtítulos |
| `--text-muted` | Cinza | `#64748b` | Labels, placeholders, metadados |

#### Light Mode

| Token | HEX | Uso |
|-------|-----|-----|
| `--bg-deep` | `#f8fafc` | Fundo principal |
| `--bg-surface` | `#f1f5f9` | Fundo de seções |
| `--bg-card` | `#ffffff` | Cards e painéis |
| `--bg-elevated` | `#ffffff` | Modais, dropdowns |
| `--accent` | `#2563eb` | Igual ao dark — mesma cor |
| `--success` | `#16a34a` | Verde mais saturado para fundo claro |
| `--danger` | `#dc2626` | Vermelho mais saturado |
| `--warning` | `#c2410c` | Laranja mais saturado |
| `--info` | `#1d4ed8` | Azul mais saturado |
| `--glass-border` | `#e2e8f0` | Bordas de cards no light mode |
| `--text-primary` | `#0f172a` | Texto principal escuro |
| `--text-secondary` | `#475569` | Texto secundário |
| `--text-muted` | `#94a3b8` | Labels e placeholders |

### Tipografia

- **Headlines:** `Outfit`, peso 700, `letter-spacing: -0.02em`
- **UI / Body:** `Inter`, peso 400 e 600
- **Tamanhos:** H1: `2rem` | H2: `1.5rem` | H3: `1.25rem` | Body: `1rem` | Small: `0.875rem`

### Espaçamentos & Formas

- **Border Radius:** Cards: `24px` | Botões: `12px` | Inputs: `8px`
- **Padding:** Cards: `2rem` | Seções: `1.5rem`
- **Gap:** Grid: `1.5rem` | Listas: `0.75rem`
- **Glassmorphism:** `backdrop-filter: blur(12px)` + `--glass-bg` + borda `--glass-border`

### Micro-interações

| Elemento | Animação |
|----------|----------|
| Cards (hover) | `translateY(-5px)` + sombra expandida com `--accent-glow` |
| Botão "Entrar" (loading) | Spinner + texto "Entrando..." |
| Erro de Login | `shake` animation de 300ms no card |
| Depósito no Cofrinho | Animação de moeda caindo (Lottie) |
| Meta 100% concluída | Confetes via canvas |
| Envelope 80% atingido | Card muda para `--warning` com pulso suave |

---

## 🛠️ Páginas & Componentes

### 0. 🔐 Autenticação (Login & Registro)

**Login:**
- Logo centralizada (`FinTrack Premium`)
- Campos com efeito Glassmorphism: Usuário + Senha
- Checkbox "Lembrar-me" (JWT com expiração de 7 dias)
- Botão "Entrar" com estado de loading
- Erro: shake animation + mensagem "Usuário ou senha incorretos"

**Registro:**
- Link "Criar Conta" abaixo do formulário de login
- Campos: Nome, Usuário, Senha, Confirmar Senha
- Validação inline (senhas não coincidem, campo vazio)
- Ao criar conta: redireciona direto para o Dashboard

**Armazenamento:** Senhas em hash bcrypt + token JWT. Em produção usar banco de dados (PostgreSQL), não JSON.

---

### 1. 🏠 Dashboard

*Primeira impressão "Premium" — visão geral e ação rápida.*

**Layout:**
- **Desktop:** Sidebar fixa à esquerda com ícones + labels
- **Mobile:** Bottom Navigation Bar fixa com os mesmos 4 ícones

**Cards de Resumo (topo, 4 cards em grid):**

| Card | Fórmula |
|------|---------|
| **Saldo Real** | Entradas − Gastos Fixos − Gastos Variáveis |
| **Saldo Disponível** | Saldo Real − média de gastos variáveis históricos |
| **Entradas do Mês** | Soma de todas as transações do tipo `entrada` no mês atual |
| **Patrimônio Total** | Soma de todos os investimentos + todos os cofrinhos + todas as reservas SOS |

**Gráfico de Fluxo (Recharts):**
- Tipo: `AreaChart` com duas áreas (Entradas vs Saídas)
- Período: últimos 6 meses
- Eixo Y formatado em BRL

**Ações Rápidas:**
- Botão flutuante `+` (FAB) abre modal de nova transação em 2 cliques
- Painel de Insights: frases automáticas baseadas nos dados do mês (ver V2)

---

### 2. 📑 Transações

*Foco em agilidade no registro e clareza no histórico.*

**Filtros:**
- Busca por texto (nome/descrição)
- Filtro por categoria (dropdown com os 12 ícones)
- Filtro por cartão (apelidos cadastrados)
- Filtro por período (mês atual por padrão)

**Lista de Atividade:**
- Cada linha: emoji da categoria + nome + cartão/método + valor (verde/vermelho) + data
- Swipe para deletar (mobile) | botão de lixeira (desktop)

**Categorias Padrão (12):**
🏠 Moradia | 🚗 Transporte | 🛒 Mercado | 🍔 Alimentação | 💊 Saúde | 🎉 Lazer | 📚 Educação | 👕 Vestuário | 💡 Contas | 🐾 Pets | 🎁 Presentes | 📦 Outros

**Modal de Nova Transação:**
1. Tipo: Entrada ou Saída
2. Valor + Descrição + Categoria
3. Método de pagamento: PIX | Débito | Crédito
4. *Se Débito ou Crédito:* seletor de cartão (apelidos do settings) — **obrigatório**
5. Checkbox "Gasto Fixo?" → provisiona automaticamente nos meses seguintes

---

### 3. 📈 Investimentos & Cofrinho

*Gestão de patrimônio e metas de vida.*

**Seletor de Aba:** "Investimentos" | "Meus Sonhos" | "Reserva SOS"

**Aba Investimentos:**
- Card de Patrimônio Total no topo
- Lista: Nome | Tipo (CDB / Ações / Tesouro / FII / Outros) | Valor Aplicado | Rendimento (%)
- Botão "+ Novo Investimento"

**Aba Metas (Cofrinho):**
- Cards por meta: título + emoji + barra de progresso com glow + valor atual / valor alvo
- Texto dinâmico: *"Faltam R$ X — aprox. Y meses no ritmo atual"*
- Botões: **Depositar** e **Retirar** em cada card
- Animação de moeda ao depositar | Confetes ao completar

**Aba Reserva SOS (Fôlego):**
- Grid de subcategorias: Saúde | Carro | Acidentes | Outros
- Cada subcategoria tem saldo individual
- Card de Sobrevivência: `Reserva Total ÷ Média de Gastos Mensais = X meses`
- Ao retirar: sistema pergunta *"Deseja repor essa reserva com prioridade no próximo mês?"*

---

### ⚙️ Configurações

**👤 Perfil:** Nome, avatar (upload), salário mensal, moeda preferida (BRL por padrão)

**💳 Meus Cartões:** Apelidos apenas (ex: "Nubank", "Inter", "C6") — sem dados reais. Usado para identificar origem dos gastos.

**🔔 Assinaturas Recorrentes:** Nome | Valor | Dia de cobrança | Categoria. Gera alerta automático antes do vencimento.

**✉️ Limites de Envelopes:** Valor máximo por categoria. Alertas em 50%, 80% e 100%.

**📁 Backup:** Exportar todos os dados como `.json` | Importar para restaurar.

**🔒 Segurança:** Alterar senha | Ver sessões ativas | Revogar token

---

## 📜 Regras de Negócio

### 💰 Cálculo de Saldos

```
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

---

## 🔌 Camada de API

**Base URL:** `/api/v1` | Local: `http://localhost:8000/api/v1`

Todas as rotas marcadas com 🔒 requerem header `Authorization: Bearer <token>`.

> **Padrão REST adotado:** Todo recurso segue o CRUD completo com verbos HTTP padronizados:
> - `GET /recurso` → Listar todos
> - `GET /recurso/:id` → Buscar por ID
> - `POST /recurso` → Criar novo
> - `PUT /recurso/:id` → Atualizar completo (substituir)
> - `PATCH /recurso/:id` → Atualizar parcial (campos específicos)
> - `DELETE /recurso/:id` → Remover

---

### 🔐 Auth (`/auth`)
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/auth/register` | Registro de novo usuário |
| POST | `/auth/login` | Login — retorna JWT |
| POST | `/auth/logout` | Invalida sessão (blacklist do token) |
| POST | `/auth/refresh` | Renovar token JWT expirado |

---

### 🏠 Dashboard (`/dashboard`) 🔒
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/dashboard/summary` | Saldo Real, Entradas, Saídas, Patrimônio |
| GET | `/dashboard/chart` | Dados do gráfico Entradas vs Saídas (6 meses) |

> Dashboard é somente leitura — agrega dados de outros recursos.

---

### 📑 Transações (`/transactions`) 🔒
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/transactions` | Listar com filtros (`?category=&card=&period=&type=&page=&limit=`) |
| GET | `/transactions/:id` | Buscar transação por ID |
| POST | `/transactions` | Criar nova transação |
| PUT | `/transactions/:id` | Atualizar transação completa |
| PATCH | `/transactions/:id` | Atualizar parcial (ex: só a categoria) |
| DELETE | `/transactions/:id` | Remover transação |

---

### 📈 Investimentos (`/investments`) 🔒
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/investments` | Listar todos os investimentos |
| GET | `/investments/:id` | Buscar investimento por ID |
| POST | `/investments` | Criar novo investimento |
| PUT | `/investments/:id` | Atualizar investimento completo |
| PATCH | `/investments/:id` | Atualizar parcial (ex: só o rendimento) |
| DELETE | `/investments/:id` | Remover investimento |

---

### 🐷 Metas / Cofrinho (`/goals`) 🔒
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/goals` | Listar todas as metas (cofrinhos + SOS) |
| GET | `/goals/:id` | Buscar meta por ID |
| POST | `/goals` | Criar nova meta |
| PUT | `/goals/:id` | Atualizar meta completa |
| PATCH | `/goals/:id` | Atualizar parcial (ex: só o emoji) |
| DELETE | `/goals/:id` | Remover meta |
| POST | `/goals/:id/deposit` | Depositar valor na meta |
| POST | `/goals/:id/withdraw` | Retirar valor da meta |

> Depósito e retirada são **ações**, por isso usam POST em sub-rotas.

---

### 💳 Cartões (`/cards`) 🔒
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/cards` | Listar todos os cartões |
| GET | `/cards/:id` | Buscar cartão por ID |
| POST | `/cards` | Adicionar novo cartão (apelido) |
| PUT | `/cards/:id` | Atualizar cartão completo |
| PATCH | `/cards/:id` | Atualizar parcial (ex: só o apelido) |
| DELETE | `/cards/:id` | Remover cartão |

---

### 🔔 Assinaturas (`/subscriptions`) 🔒
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/subscriptions` | Listar todas as assinaturas |
| GET | `/subscriptions/:id` | Buscar assinatura por ID |
| POST | `/subscriptions` | Adicionar nova assinatura |
| PUT | `/subscriptions/:id` | Atualizar assinatura completa |
| PATCH | `/subscriptions/:id` | Atualizar parcial (ex: só o valor) |
| DELETE | `/subscriptions/:id` | Remover assinatura |

---

### ✉️ Envelopes (`/envelopes`) 🔒
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/envelopes` | Listar todos os limites por categoria |
| GET | `/envelopes/:id` | Buscar envelope por ID |
| POST | `/envelopes` | Criar novo limite de envelope |
| PUT | `/envelopes/:id` | Atualizar limite completo |
| PATCH | `/envelopes/:id` | Atualizar parcial (ex: só o valor limite) |
| DELETE | `/envelopes/:id` | Remover envelope |

---

### 👤 Perfil (`/profile`) 🔒
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/profile` | Dados do perfil do usuário logado |
| PUT | `/profile` | Atualizar perfil completo |
| PATCH | `/profile` | Atualizar parcial (ex: só o salário) |

> Perfil é recurso único por usuário — não tem POST, DELETE ou `:id`.

---

### 🤖 IA (`/ai`) — V3 futuro
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/ai/upload` | Upload de comprovante/boleto para OCR |
| GET | `/ai/insights` | Análise e previsões inteligentes |
| GET | `/ai/products` | Listar produtos identificados pela IA |
| GET | `/ai/products/:id` | Buscar histórico de preço de um produto |

---

### 📐 Padrões de Resposta da API

#### ✅ Sucesso — Item Único
```json
{
  "success": true,
  "data": { ... }
}
```

#### ✅ Sucesso — Lista com Paginação
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

#### ❌ Erro
```json
{
  "success": false,
  "error": {
    "code": "ERR_UNAUTHORIZED",
    "message": "Token inválido ou expirado.",
    "details": null
  }
}
```

### 📐 Tabela de Códigos de Erro

| HTTP | Código | Causa | Ação no Frontend |
|------|--------|-------|-----------------|
| 400 | `ERR_VALIDATION` | Body inválido (campo faltando, tipo errado) | Exibir mensagem inline no campo |
| 401 | `ERR_UNAUTHORIZED` | Token ausente, inválido ou expirado | Redirecionar para login |
| 403 | `ERR_FORBIDDEN` | Usuário tentando acessar recurso de outro usuário | Exibir toast de erro |
| 404 | `ERR_NOT_FOUND` | Recurso não encontrado pelo ID | Exibir toast "Item não encontrado" |
| 409 | `ERR_CONFLICT` | Usuário já existe (registro duplicado) | Exibir mensagem inline |
| 422 | `ERR_UNPROCESSABLE` | Dados válidos mas violam regra de negócio (ex: saldo insuficiente) | Exibir toast com mensagem |
| 429 | `ERR_RATE_LIMIT` | Muitas requisições (brute force no login) | Exibir "Tente novamente em X segundos" |
| 500 | `ERR_INTERNAL` | Erro inesperado no servidor | Exibir toast "Erro inesperado. Tente novamente." |

> O campo `details` só é populado em `DEBUG=True`. Em produção sempre retorna `None`.

---

Definição dos tabelas e objetos de validação. Todos os IDs são UUID v4.

### 👤 User (SQLModel)
```python
class User(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str
    username: str = Field(unique=True, index=True)
    password_hash: str
    salary: float = 0.0
    currency: str = "BRL"
    avatar_url: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
```

### 💸 Transaction (SQLModel)
```python
class Transaction(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="user.id")
    type: str  # "income", "expense", "patrimony"
    amount: float
    description: str
    category: str
    method: Optional[str] = None  # "pix", "debit", "credit"
    card_id: Optional[uuid.UUID] = Field(default=None, foreign_key="card.id")
    is_fixed: bool = False
    reference_month: str  # "YYYY-MM"
    created_at: datetime = Field(default_factory=datetime.utcnow)
```

### 📈 Investment (SQLModel)
```python
class Investment(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="user.id")
    name: str
    type: str  # "CDB", "Ações", etc.
    amount_invested: float
    return_rate: float
    created_at: datetime = Field(default_factory=datetime.utcnow)
```

### 🐷 Goal (SQLModel)
```python
class Goal(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="user.id")
    type: str  # "saving", "sos"
    title: str
    emoji: Optional[str] = None
    target_amount: float
    current_amount: float = 0.0
    sos_category: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
```

---

## 🔐 Segurança — OWASP Top 10:2025

> Esta seção é baseada no **OWASP Top 10:2025**, a referência global para segurança em aplicações web. Cada item tem uma contramedida concreta mapeada para o FinTrack.

### Mapeamento do FinTrack

| # | Risco OWASP | Nível no FinTrack | Status |
|---|-------------|------------------|--------|
| A01 | Broken Access Control | 🔴 Alto | Ver abaixo |
| A02 | Security Misconfiguration | 🔴 Alto | Ver abaixo |
| A03 | Software Supply Chain Failures | 🟡 Médio | Ver abaixo |
| A04 | Cryptographic Failures | 🔴 Alto | Ver abaixo |
| A05 | Injection | 🔴 Alto | Ver abaixo |
| A06 | Insecure Design | 🟡 Médio | Ver abaixo |
| A07 | Authentication Failures | 🔴 Alto | Ver abaixo |
| A08 | Software or Data Integrity Failures | 🟡 Médio | Ver abaixo |
| A09 | Security Logging & Alerting Failures | 🟡 Médio | Ver abaixo |
| A10 | Mishandling of Exceptional Conditions | 🟡 Médio | Ver abaixo |

---

### A01 — Broken Access Control (inclui SSRF)

**Risco:** Usuário A acessa ou modifica dados do usuário B — transações, metas, investimentos alheios.

**Contramedidas:**
- Toda query filtra por `userId` **extraído do JWT** — nunca do body da requisição
- Middleware de autorização verifica ownership antes de qualquer `UPDATE` ou `DELETE`
- Validar e bloquear URLs externas recebidas como input (prevenção de SSRF)

// ✅ CORRETO
user_id = token_data.user_id  # extraído do JWT no middleware
transaction = session.exec(
    select(Transaction).where(Transaction.id == transaction_id, Transaction.user_id == user_id)
).first()

# ❌ ERRADO
user_id = body.user_id

---

### A02 — Security Misconfiguration

**Risco:** CORS aberto, debug em produção, secrets hardcoded, headers HTTP expostos.

**Contramedidas:**
- `FastAPI-middleware` para headers de segurança
- `CORS_ORIGIN` via variável de ambiente — nunca `allow_origins=["*"]`
- `DEBUG=False` em produção
- PostgreSQL nunca exposto diretamente — apenas via `DATABASE_URL`

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("CORS_ORIGIN")],
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

### A03 — Software Supply Chain Failures

**Risco:** Dependências Python comprometidas (casos reais: pacotes typosquatted no PyPI).

**Contramedidas:**
- `pip audit` ou `safety` — corrigir críticos e altos antes do deploy
- `requirements.txt` com versões fixas ou `poetry.lock`
- **Dependabot** habilitado no GitHub para alertas automáticos

```bash
pip audit
pip install -r requirements.txt
```

---

### A04 — Cryptographic Failures

**Risco:** Senhas em texto puro, JWT fraco, banco sem SSL.

**Contramedidas:**
- Passlib com algoritmo `bcrypt` e *rounds* `12`
- JWT secret mínimo 256 bits: `openssl rand -base64 32`
- HTTPS obrigatório em produção
- PostgreSQL sempre com `sslmode=require` na URL

```python
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
hashed_password = pwd_context.hash(password)
token = jwt.encode({"sub": str(user_id), "exp": expire}, SECRET_KEY, algorithm="HS256")
```

---

### A05 — Injection (SQL, XSS)

**Risco:** Inputs maliciosos em descrições de transações ou nomes manipulando queries.

**Contramedidas:**
- **SQLModel (SQLAlchemy):** queries parametrizadas por padrão
- **Pydantic:** validação de schema automática em todos os endpoints do FastAPI
- **React:** escapa HTML por padrão — nunca usar `dangerouslySetInnerHTML`

```python
class TransactionCreate(BaseModel):
    amount: float = Field(gt=0, le=1000000)
    description: str = Field(min_length=1, max_length=255)
    category: str
    method: str
```

---

### A06 — Insecure Design

**Risco:** Fluxos que permitem bypass de regras financeiras (sacar mais do que o saldo, deletar gasto fixo sem limpar provisionamentos).

**Contramedidas:**
- Toda regra de negócio financeira validada **no backend** — nunca só no frontend
- Retirada do cofrinho verifica `currentAmount >= amount` antes de executar
- Deletar gasto fixo limpa provisionamentos futuros em transação atômica

```python
if goal.current_amount < amount:
    raise HTTPException(status_code=400, detail="ERR_INSUFFICIENT_BALANCE")
```

---

### A07 — Authentication Failures

**Risco:** Brute force no login, tokens sem invalidação, mensagens que revelam usuário/senha separadamente.

**Contramedidas:**
- Rate limiting: `5 tentativas` por IP em `15 min` no login
- Rate limiting geral: `100 req/min` por usuário autenticado
- JWT blacklist no logout (tabela `revoked_tokens` no banco)
- Mensagem de erro genérica: sempre "Usuário ou senha incorretos" — nunca revelar qual está errado

```python
# FastAPI-limiter (Redis) ou slowapi (In-memory)
@app.post("/api/v1/auth/login")
@limiter.limit("5/15minutes")
async def login(request: Request):
    ...
```

---

### A08 — Software or Data Integrity Failures

**Risco:** Backup importado com dados maliciosos ou corrompidos sendo salvo sem validação.

**Contramedidas:**
- Importação de backup valida schema completo com Pydantic antes de qualquer escrita
- `pip install -r requirements.txt` no CI/CD
- `requirements.txt` sempre versionado
- **CI/CD:** usar `pip install -r requirements.txt`

---

### A09 — Security Logging & Alerting Failures

**Risco:** Ataques acontecem sem detecção por falta de logs ou alertas.

**O que logar:**
- ✅ Tentativas de login (sucesso e falha) com IP e timestamp
- ✅ Erros 401 e 403
- ✅ Rate limit atingido
- ✅ Erros 500 com stack trace (somente nos logs, nunca na resposta)
- ❌ Nunca logar: senhas, tokens JWT, valores financeiros, dados pessoais

```python
import logging
logger = logging.getLogger("fintrack")
logger.warning(f"Access denied for IP: {request.client.host}")
```

---

### A10 — Mishandling of Exceptional Conditions *(NOVO em 2025)*

**Risco:** Erros não tratados expõem stack traces ou deixam transações financeiras em estado inconsistente.

**Contramedidas:**
- Exception Handler global no FastAPI captura erros e retorna JSON padronizado
- Operações financeiras usam context managers para sessões do banco
- Logs estruturados para facilitar depuração sem expor dados

```python
# Exemplo de transação atômica em Python
with Session(engine) as session:
    with session.begin():
        session.add(transaction)
        session.add(goal_update)
    # commit automático no fim do bloco 'with session.begin()'
```

---

### Variáveis de Ambiente (`.env.example`)

```env
# Servidor
DEBUG=True
PORT=8000
CORS_ORIGIN=http://localhost:5173

# Autenticação
SECRET_KEY=gerar_com_openssl_rand_base64_32
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Banco de dados
DATABASE_URL="postgresql://user:password@localhost:5432/fintrack"

# IA (V3)
OPENAI_API_KEY=
GOOGLE_VISION_API_KEY=
```

### Dependências Obrigatórias (requirements.txt)

```text
fastapi[all]
sqlmodel
alembic
psycopg2-binary
passlib[bcrypt]
python-jose[cryptography]
python-dotenv
```

### Deploy em Produção

- **HTTPS:** obrigatório — certificado fornecido pela plataforma (Railway/Render)
- **Capacitor:** atualizar `server.url` no `capacitor.config.ts` para a URL de produção antes do build
- **Variáveis de ambiente:** configurar pelo painel da plataforma — nunca commitar `.env`
- **PostgreSQL:** `DATABASE_URL` sempre com `?sslmode=require`
- **CI/CD:** usar `pip install -r requirements.txt`

---

## 📱 Estratégia Mobile

### 📌 Decisão: Capacitor (escolha definitiva)

O projeto usará **Capacitor** para transformar o app web em app nativo para iOS e Android.

**Por que Capacitor e não React Native:**

| Critério | Capacitor | React Native |
|----------|-----------|-------------|
| Reaproveitamento de código | ~95% do frontend React existente | ~10% — precisa reescrever tudo com primitivas nativas |
| Curva de aprendizado | Baixa — é o mesmo React + HTML/CSS | Alta — novo paradigma de componentes |
| Performance | Boa para apps de dados/formulários | Excelente para animações pesadas e jogos |
| Acesso a APIs nativas | Via plugins oficiais (câmera, push, biometria) | Direto, mais flexível |
| Velocidade de lançamento | Muito rápida | Lenta (reescrita completa) |
| Adequação ao FinTrack | ✅ App financeiro, não precisa de 60fps em animações | Overkill para este caso de uso |

---

### 📂 Estrutura de Pastas Mobile

```
/mobile/
├── android/                    # Projeto Android nativo (gerado pelo Capacitor)
├── ios/                        # Projeto iOS nativo (gerado pelo Capacitor)
├── capacitor.config.ts         # Configuração do Capacitor (appId, appName, server)
└── package.json                # Dependências mobile (plugins Capacitor)
```

> O código-fonte do app continua em `/frontend/src/`. O Capacitor empacota o build do Vite dentro do app nativo. Não há código duplicado.

**Fluxo de build:**
```
npm run build (frontend) → Capacitor copia o /dist → npx cap sync → Xcode / Android Studio
```

---

### 📐 UX Específica Mobile

#### Layout & Navegação
- **Bottom Navigation Bar** fixa com 4 abas: Dashboard | Transações | Investimentos | Configurações
- **Safe Areas:** respeitar `env(safe-area-inset-*)` para notch do iOS e barra de gestos do Android
- **Teclado virtual:** inputs financeiros (valores) abrem teclado numérico (`inputmode="decimal"`)
- **Scroll:** listas longas usam scroll nativo sem `overflow: hidden` no body
- **Header mobile:** título da página + botão de ação no canto direito (sem sidebar)

#### Gestos
| Gesto | Ação |
|-------|------|
| Swipe left em transação | Revelar botão "Deletar" |
| Pull-to-refresh | Recarregar dados do Dashboard |
| Long press em card de meta | Abrir opções (Editar / Arquivar) |
| Swipe down em modal | Fechar modal (bottom sheet) |

#### Componentes adaptados para mobile
- **Modais** viram **Bottom Sheets** — sobem da parte de baixo, mais natural no mobile
- **Dropdowns** viram **Action Sheets** nativos (via plugin Capacitor)
- **Toasts** aparecem no topo (não no canto inferior direito como no desktop)
- **FAB "+"** muda de posição: `bottom: 80px` para não sobrepor a Bottom Nav Bar

---

### 🔔 Funcionalidades Exclusivas Mobile

#### Push Notifications (via `@capacitor/push-notifications`)
| Gatilho | Mensagem |
|---------|----------|
| Assinatura vence em 3 dias | "Netflix vence em 3 dias — R$ 55,90" |
| Envelope atinge 80% | "Alimentação: 80% do limite atingido" |
| Meta do cofrinho concluída | "🎉 Meta Viagem concluída! Parabéns!" |
| Boleto (V3 IA) detectado | "Boleto de R$ 215 vence em 2 dias" |

#### Biometria no Login (via `@capacitor/biometrics`)
- Face ID (iOS) e impressão digital (Android) como alternativa à senha
- Ativado opcionalmente nas configurações de segurança
- Token JWT armazenado de forma segura no Keychain (iOS) / Keystore (Android)

#### Câmera para OCR (V3 — via `@capacitor/camera`)
- Botão de câmera no modal de nova transação
- Abre câmera nativa para foto de comprovante/boleto
- Envia imagem para o pipeline de IA (`POST /ai/upload`)

#### Modo Offline (V2 Mobile)
- Transações criadas offline ficam em fila local (IndexedDB)
- Sincronização automática ao reconectar
- Indicador visual de "modo offline" no header

---

### 📦 Plugins Capacitor Necessários

| Plugin | Funcionalidade | Versão |
|--------|---------------|--------|
| `@capacitor/app` | Gerenciamento do ciclo de vida do app | Core |
| `@capacitor/push-notifications` | Notificações push | V2 |
| `@capacitor/biometrics` | Face ID / impressão digital | V2 |
| `@capacitor/camera` | Câmera para OCR | V3 |
| `@capacitor/haptics` | Feedback tátil em ações importantes | V1 |
| `@capacitor/status-bar` | Controle da status bar (cor, estilo) | V1 |
| `@capacitor/keyboard` | Evitar que o teclado sobreponha inputs | V1 |
| `@capacitor/network` | Detectar estado da conexão (offline mode) | V2 |

---

### 📱 Especificações Técnicas

| Item | Valor |
|------|-------|
| App ID (iOS/Android) | `com.fintrack.app` |
| Nome do app | `FinTrack` |
| Versão mínima iOS | 14.0 |
| Versão mínima Android | API 26 (Android 8.0) |
| Orientação | Portrait only (bloqueado) |
| Splash Screen | Dark (`#0d1117`) com logo centralizada |
| Ícone | Versões: 1024×1024 (iOS) e 512×512 (Android) |

---

### 🚀 Roadmap Mobile

#### Fase Mobile 1 — Setup & Paridade Web
- [ ] Instalar e configurar Capacitor no projeto
- [ ] Configurar `capacitor.config.ts` com appId e server URL
- [ ] Gerar projetos Android e iOS (`npx cap add android && npx cap add ios`)
- [ ] Ajustar safe areas, Bottom Nav Bar e scroll nativo
- [ ] Adaptar modais para Bottom Sheets
- [ ] Configurar `@capacitor/status-bar` e `@capacitor/keyboard`
- [ ] Testar build completo no emulador Android e iOS
- [ ] Publicar versão beta (TestFlight + Firebase App Distribution)

#### Fase Mobile 2 — Features Nativas
- [ ] Push notifications (assinaturas, envelopes, metas)
- [ ] Login biométrico (Face ID / impressão digital)
- [ ] Modo offline com sincronização automática
- [ ] Feedback tátil (haptics) em ações de depósito, exclusão e conclusão de meta

#### Fase Mobile 3 — IA & Câmera (junto com V3)
- [ ] Integração da câmera nativa para OCR
- [ ] Permissões de câmera no `Info.plist` (iOS) e `AndroidManifest.xml`
- [ ] Fluxo completo: foto → OCR → modal de confirmação da transação

---

### ⚠️ Pontos de Atenção

- **Glassmorphism no mobile:** `backdrop-filter: blur()` tem performance variável em Android. Testar em dispositivos reais e ter fallback com `--bg-card` sólido se necessário.
- **Fontes:** Outfit e Inter precisam ser incluídas no bundle (`/frontend/src/assets/fonts/`) — não depender de CDN no app nativo (funciona offline).
- **App Store / Play Store:** exige política de privacidade e termos de uso publicados antes do review. Planejar com antecedência.

---

## 📈 Roadmap de Implementação

> Legenda: `[ ]` pendente | `[x]` concluído | `[-]` em andamento

### Fase 1 — Fundação & Setup
- [ ] Criação da estrutura de pastas (`frontend`, `backend`, `mobile`)
- [ ] Setup do Backend: Python 3.12 + FastAPI + SQLModel
- [ ] Backend: configuração inicial do Banco PostgreSQL (Alembic)
- [ ] Frontend: React + Vite + TypeScript inicializado

### Fase 2 — Design System & Layout
- [ ] Design Tokens implementados no CSS (`index.css`)
- [ ] Glassmorphism, fontes (Outfit + Inter) e animações base
- [ ] Layout Global: Sidebar Desktop + Bottom Nav Mobile
- [ ] Componentes base: Card, Button, Modal, Input, Badge

### Fase 3 — Autenticação & Perfil
- [ ] Tela de Login (shake error, lembrar-me, loading state)
- [ ] Tela de Registro (validação inline)
- [ ] JWT middleware no backend
- [ ] Página de Configurações completa (Perfil, Cartões, Assinaturas, Envelopes, Backup, Segurança)

### Fase 4 — Transações & Fluxo de Caixa
- [ ] CRUD completo de Transações
- [ ] Seletor de método (PIX / Débito / Crédito) com lógica condicional de cartão
- [ ] Checkbox "Gasto Fixo" com provisionamento automático
- [ ] Filtros inteligentes (nome, categoria, cartão, período)
- [ ] 12 categorias com emojis e cores

### Fase 5 — Investimentos, Cofrinho & SOS
- [ ] CRUD de Investimentos
- [ ] CRUD de Metas (Cofrinho) com barra de progresso e projeção
- [ ] Botões Depositar/Retirar com animações
- [ ] Área de Reserva SOS com cálculo de sobrevivência

### Fase 6 — Dashboard & Features Premium
- [ ] Cards de Resumo com fórmulas corretas
- [ ] Gráfico de Fluxo com Recharts (6 meses)
- [ ] Botão flutuante "+" para transação rápida
- [ ] Alertas visuais do método dos envelopes
- [ ] Alertas de assinaturas recorrentes próximas do vencimento
- [ ] Exportar/Importar backup JSON
- [ ] Animação de confetes ao completar meta

### Fase 7 — QA & Entrega
- [ ] Testes unitários: cálculos de Fôlego, Envelopes e Projeções
- [ ] Testes de integração: Frontend ↔ Backend ↔ JSON
- [ ] QA Visual: responsividade mobile, micro-animações, glassmorphism
- [ ] Revisão detalhada da documentação modular

---

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
- Migração de SQLite → PostgreSQL (escala)
- ORM: SQLModel em todas as etapas
- Cache leve com Redis ou FastAPI-Cache
- Rate limiting por usuário para proteger a API em produção
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
- **Leitura de Boletos:** cria conta a pagar automaticamente con alerta de vencimento
- **Detecção de Anomalias:** *"Esse gasto está 3x acima da sua média"*
- **Insights comportamentais:** análise de padrões de consumo ao longo do tempo

### 🟢 Níveis de Evolução da IA

| Nível | Funcionalidades |
|-------|----------------|
| 🟢 MVP | Identificar tipo de documento, extrair total, sugerir categoria |
| 🟡 Intermediário | Extrair itens, histórico de preços, alertas de boleto |
| 🔴 Avançado | Comparação de preços entre mercados, ranking, detecção de fraude |

---

*Última atualização: v1.5 — Modularização da documentação iniciada.*