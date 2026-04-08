# ⚙️ Backend — O Que Vai Ser Feito

> Tudo que roda **no servidor** — Python 3.12 + FastAPI + SQLModel.

---

## 📦 Setup Inicial
- [ ] Criar ambiente virtual Python (`python -m venv venv`)
- [ ] Instalar dependências do `requirements.txt`
- [ ] Criar `backend/app/main.py` — ponto de entrada do FastAPI
- [ ] Configurar variáveis de ambiente (`.env` + `python-dotenv`)
- [ ] Configurar CORS middleware (apenas `localhost:5173` em dev)
- [ ] Configurar Alembic para migrações do banco
- [ ] Criar primeira migração e rodar (`alembic upgrade head`)

---

## 📁 Estrutura de Arquivos do Backend

```
backend/
├── app/
│   ├── main.py                 # App FastAPI, middlewares, rotas
│   ├── api/
│   │   └── v1/
│   │       ├── auth.py         # POST login, register, logout, refresh
│   │       ├── dashboard.py    # GET summary, chart
│   │       ├── transactions.py # CRUD completo
│   │       ├── investments.py  # CRUD completo
│   │       ├── goals.py        # CRUD + deposit/withdraw
│   │       ├── cards.py        # CRUD completo
│   │       ├── subscriptions.py # CRUD completo
│   │       ├── envelopes.py    # CRUD completo
│   │       └── profile.py      # GET, PUT, PATCH
│   ├── core/
│   │   ├── config.py           # Settings (env vars)
│   │   ├── security.py         # Hash de senha, criação/validação JWT
│   │   ├── dependencies.py     # get_current_user, get_db
│   │   └── exceptions.py       # HTTPExceptions padronizadas
│   ├── crud/
│   │   ├── user.py             # Operações de banco do User
│   │   ├── transaction.py      # Operações de banco de Transaction
│   │   ├── investment.py       # Operações de banco de Investment
│   │   ├── goal.py             # Operações de banco de Goal
│   │   ├── card.py             # Operações de banco de Card
│   │   ├── subscription.py     # Operações de banco de Subscription
│   │   └── envelope.py         # Operações de banco de Envelope
│   ├── db/
│   │   └── session.py          # Engine + SessionLocal do SQLModel
│   ├── models/
│   │   ├── user.py             # SQLModel User (tabela)
│   │   ├── transaction.py      # SQLModel Transaction (tabela)
│   │   ├── investment.py       # SQLModel Investment (tabela)
│   │   ├── goal.py             # SQLModel Goal (tabela)
│   │   ├── card.py             # SQLModel Card (tabela)
│   │   ├── subscription.py     # SQLModel Subscription (tabela)
│   │   └── envelope.py         # SQLModel Envelope (tabela)
│   └── schemas/
│       ├── user.py             # Pydantic: UserCreate, UserResponse
│       ├── transaction.py      # Pydantic: TransactionCreate, TransactionUpdate, TransactionResponse
│       ├── investment.py       # Pydantic: InvestmentCreate, InvestmentUpdate, InvestmentResponse
│       ├── goal.py             # Pydantic: GoalCreate, GoalUpdate, GoalResponse, DepositRequest
│       ├── card.py             # Pydantic: CardCreate, CardUpdate, CardResponse
│       ├── subscription.py     # Pydantic: SubscriptionCreate, SubscriptionUpdate, SubscriptionResponse
│       ├── envelope.py         # Pydantic: EnvelopeCreate, EnvelopeUpdate, EnvelopeResponse
│       └── common.py           # Pydantic: PaginationResponse, ErrorResponse
├── alembic/
│   ├── versions/               # Arquivos de migração gerados
│   └── env.py                  # Config do Alembic
├── requirements.txt
└── alembic.ini
```

---

## 🔐 Autenticação & Segurança

| Arquivo | O que faz |
|---------|-----------|
| `core/security.py` | Hashear senha com Passlib (bcrypt, rounds=12) |
| `core/security.py` | Criar token JWT com PyJWT (HS256, expira em 24h) |
| `core/security.py` | Validar e decodificar token JWT |
| `core/dependencies.py` | `get_current_user()` — extrai user_id do token |
| `core/dependencies.py` | `get_db()` — fornece sessão do banco para cada request |
| `api/v1/auth.py` | Rate limiting: 5 tentativas por IP em 15 min |
| `models/revoked_token.py` | Tabela para blacklist de tokens no logout |

---

## 🔌 Rotas da API (por arquivo)

### `auth.py`
| Endpoint | Lógica |
|----------|--------|
| `POST /auth/register` | Validar username único → hashear senha → salvar User → retornar JWT |
| `POST /auth/login` | Buscar user → verificar senha → gerar JWT → retornar token |
| `POST /auth/logout` | Adicionar token à blacklist (`revoked_tokens`) |
| `POST /auth/refresh` | Validar token atual → gerar novo token → retornar |

### `transactions.py`
| Endpoint | Lógica |
|----------|--------|
| `GET /transactions` | Filtrar por user_id + query params (category, card, period, type) + paginação |
| `GET /transactions/:id` | Buscar por ID + verificar ownership (user_id do JWT) |
| `POST /transactions` | Validar schema → se crédito/débito exigir card_id → salvar |
| `PUT /transactions/:id` | Verificar ownership → substituir todos os campos |
| `PATCH /transactions/:id` | Verificar ownership → atualizar apenas campos enviados |
| `DELETE /transactions/:id` | Verificar ownership → se gasto fixo, limpar provisionamentos → deletar |

### `goals.py`
| Endpoint | Lógica |
|----------|--------|
| `POST /goals/:id/deposit` | Verificar ownership → somar amount ao current_amount → salvar |
| `POST /goals/:id/withdraw` | Verificar ownership → validar saldo suficiente → subtrair → salvar |

### `dashboard.py`
| Endpoint | Lógica |
|----------|--------|
| `GET /dashboard/summary` | Calcular Saldo Real, Disponível, Entradas, Patrimônio do mês atual |
| `GET /dashboard/chart` | Agregar entradas vs saídas dos últimos 6 meses |

---

## 📏 Regras de Negócio no Backend

> **Toda regra financeira é validada no backend — nunca apenas no frontend.**

| Regra | Onde é aplicada |
|-------|-----------------|
| Retirada do cofrinho ≤ saldo atual | `crud/goal.py` → valida `current_amount >= amount` |
| Crédito/Débito exige cartão | `schemas/transaction.py` → validador Pydantic |
| Gasto fixo provisiona meses futuros | `crud/transaction.py` → cria registros para próximos meses |
| Deletar gasto fixo limpa provisionamentos | `crud/transaction.py` → deleta em transação atômica |
| Envelope acima do limite → alerta | `crud/envelope.py` → calcula % e retorna status |
| Username único no registro | `crud/user.py` → verifica antes de inserir, retorna 409 se duplicado |

---

## 📋 Dependências (requirements.txt)

```text
fastapi[all]          # Framework web + uvicorn
sqlmodel              # ORM (SQLAlchemy + Pydantic)
alembic               # Migrações de banco
psycopg2-binary       # Driver PostgreSQL
passlib[bcrypt]       # Hash de senhas
python-jose[cryptography]  # JWT
python-dotenv         # Variáveis de ambiente
slowapi               # Rate limiting
```
