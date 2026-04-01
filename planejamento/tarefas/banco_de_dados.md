# 🗄️ Banco de Dados — O Que Vai Ser Feito

> Tudo que vive **no PostgreSQL** — tabelas, relacionamentos, migrações e administração via DBeaver.

---

## 📦 Setup Inicial
- [ ] Instalar PostgreSQL localmente (ou usar Docker)
- [ ] Criar o banco de dados `fintrack`
- [ ] Criar o usuário do banco com permissões restritas
- [ ] Configurar `DATABASE_URL` no `.env`
- [ ] Conectar o DBeaver ao banco local para administração visual
- [ ] Configurar Alembic e rodar primeira migração

---

## 📊 Diagrama de Relacionamentos (ER)

```
┌──────────┐       ┌──────────────┐       ┌──────────┐
│   User   │──1:N──│ Transaction  │──N:1──│   Card   │
│          │       └──────────────┘       └──────────┘
│          │       ┌──────────────┐            ▲
│          │──1:N──│  Investment  │            │
│          │       └──────────────┘         1:N│
│          │       ┌──────────────┐            │
│          │──1:N──│    Goal      │       ┌────┴─────┐
│          │       └──────────────┘       │   User   │
│          │       ┌──────────────┐       └──────────┘
│          │──1:N──│ Subscription │
│          │       └──────────────┘
│          │       ┌──────────────┐
│          │──1:N──│  Envelope    │
│          │       └──────────────┘
│          │       ┌───────────────┐
│          │──1:N──│ RevokedToken  │
└──────────┘       └───────────────┘
```

> **Regra:** Todo registro pertence a um `User`. Não existe dado "solto" sem dono.

---

## 📋 Tabelas (7 principais + 1 de segurança)

### 1. `user` — Usuários
| Coluna | Tipo | Restrições | Descrição |
|--------|------|------------|-----------|
| `id` | UUID | PK, default uuid4 | Identificador único |
| `name` | VARCHAR | NOT NULL | Nome completo |
| `username` | VARCHAR | NOT NULL, UNIQUE, INDEX | Nome de usuário (login) |
| `password_hash` | VARCHAR | NOT NULL | Senha hasheada (bcrypt) |
| `salary` | FLOAT | DEFAULT 0.0 | Salário mensal |
| `currency` | VARCHAR(3) | DEFAULT 'BRL' | Moeda preferida |
| `avatar_url` | VARCHAR | NULL | URL do avatar |
| `created_at` | TIMESTAMP | DEFAULT now() | Data de criação |
| `updated_at` | TIMESTAMP | DEFAULT now() | Última atualização |

---

### 2. `transaction` — Transações Financeiras
| Coluna | Tipo | Restrições | Descrição |
|--------|------|------------|-----------|
| `id` | UUID | PK | Identificador único |
| `user_id` | UUID | FK → user.id, NOT NULL | Dono da transação |
| `type` | VARCHAR | NOT NULL | `income`, `expense` ou `patrimony` |
| `amount` | FLOAT | NOT NULL, > 0 | Valor da transação |
| `description` | VARCHAR(255) | NOT NULL | Descrição |
| `category` | VARCHAR | NOT NULL | Uma das 12 categorias |
| `method` | VARCHAR | NULL | `pix`, `debit` ou `credit` |
| `card_id` | UUID | FK → card.id, NULL | Cartão usado (se débito/crédito) |
| `is_fixed` | BOOLEAN | DEFAULT false | Se é gasto fixo recorrente |
| `reference_month` | VARCHAR(7) | NOT NULL | Mês de referência (`YYYY-MM`) |
| `created_at` | TIMESTAMP | DEFAULT now() | Data de criação |

**Índices:**
- `idx_transaction_user_month` → (`user_id`, `reference_month`) — consultas do Dashboard
- `idx_transaction_user_category` → (`user_id`, `category`) — filtros por categoria

---

### 3. `investment` — Investimentos
| Coluna | Tipo | Restrições | Descrição |
|--------|------|------------|-----------|
| `id` | UUID | PK | Identificador único |
| `user_id` | UUID | FK → user.id, NOT NULL | Dono |
| `name` | VARCHAR | NOT NULL | Nome do investimento |
| `type` | VARCHAR | NOT NULL | CDB, Ações, Tesouro, FII, Outros |
| `amount_invested` | FLOAT | NOT NULL, > 0 | Valor aplicado |
| `return_rate` | FLOAT | NOT NULL | Taxa de rendimento (%) |
| `created_at` | TIMESTAMP | DEFAULT now() | Data de criação |

---

### 4. `goal` — Metas (Cofrinho + SOS)
| Coluna | Tipo | Restrições | Descrição |
|--------|------|------------|-----------|
| `id` | UUID | PK | Identificador único |
| `user_id` | UUID | FK → user.id, NOT NULL | Dono |
| `type` | VARCHAR | NOT NULL | `saving` ou `sos` |
| `title` | VARCHAR | NOT NULL | Nome da meta |
| `emoji` | VARCHAR | NULL | Emoji representativo |
| `target_amount` | FLOAT | NOT NULL, > 0 | Valor alvo |
| `current_amount` | FLOAT | DEFAULT 0.0 | Valor acumulado |
| `sos_category` | VARCHAR | NULL | Subcategoria SOS (Saúde, Carro, etc.) |
| `created_at` | TIMESTAMP | DEFAULT now() | Data de criação |
| `updated_at` | TIMESTAMP | DEFAULT now() | Última atualização |

---

### 5. `card` — Cartões (Apelidos)
| Coluna | Tipo | Restrições | Descrição |
|--------|------|------------|-----------|
| `id` | UUID | PK | Identificador único |
| `user_id` | UUID | FK → user.id, NOT NULL | Dono |
| `nickname` | VARCHAR | NOT NULL | Apelido (ex: "Nubank") |
| `created_at` | TIMESTAMP | DEFAULT now() | Data de criação |

---

### 6. `subscription` — Assinaturas Recorrentes
| Coluna | Tipo | Restrições | Descrição |
|--------|------|------------|-----------|
| `id` | UUID | PK | Identificador único |
| `user_id` | UUID | FK → user.id, NOT NULL | Dono |
| `name` | VARCHAR | NOT NULL | Nome (ex: "Netflix") |
| `amount` | FLOAT | NOT NULL, > 0 | Valor mensal |
| `billing_day` | INT | NOT NULL, 1–31 | Dia de cobrança |
| `category` | VARCHAR | NOT NULL | Categoria da assinatura |
| `created_at` | TIMESTAMP | DEFAULT now() | Data de criação |

---

### 7. `envelope` — Limites por Categoria
| Coluna | Tipo | Restrições | Descrição |
|--------|------|------------|-----------|
| `id` | UUID | PK | Identificador único |
| `user_id` | UUID | FK → user.id, NOT NULL | Dono |
| `category` | VARCHAR | NOT NULL | Categoria do envelope |
| `limit_amount` | FLOAT | NOT NULL, > 0 | Valor limite mensal |
| `updated_at` | TIMESTAMP | DEFAULT now() | Última atualização |

**Constraint:** UNIQUE(`user_id`, `category`) — cada usuário só tem 1 envelope por categoria.

---

### 8. `revoked_token` — Blacklist de JWT (Segurança)
| Coluna | Tipo | Restrições | Descrição |
|--------|------|------------|-----------|
| `id` | UUID | PK | Identificador único |
| `token` | TEXT | NOT NULL, UNIQUE | Token JWT invalidado |
| `revoked_at` | TIMESTAMP | DEFAULT now() | Data da revogação |
| `expires_at` | TIMESTAMP | NOT NULL | Quando o token expiraria naturalmente |

> Tokens expirados podem ser limpos periodicamente com um job de limpeza.

---

## 🔄 Migrações (Alembic)

| Migração | O que faz |
|----------|-----------|
| `001_create_user` | Cria tabela `user` |
| `002_create_card` | Cria tabela `card` (precisa existir antes de `transaction`) |
| `003_create_transaction` | Cria tabela `transaction` com FK para `user` e `card` |
| `004_create_investment` | Cria tabela `investment` |
| `005_create_goal` | Cria tabela `goal` |
| `006_create_subscription` | Cria tabela `subscription` |
| `007_create_envelope` | Cria tabela `envelope` com constraint UNIQUE |
| `008_create_revoked_token` | Cria tabela `revoked_token` |
| `009_add_indexes` | Adiciona índices compostos para performance |

**Comandos:**
```bash
alembic revision --autogenerate -m "create_user"   # Gerar migração
alembic upgrade head                                # Aplicar todas
alembic downgrade -1                                # Reverter última
alembic history                                     # Ver histórico
```

---

## 🛠️ DBeaver — Administração

O **DBeaver** é a ferramenta oficial para administrar o PostgreSQL do FinTrack.

**Usos principais:**
- Visualizar e editar dados diretamente nas tabelas
- Verificar se as migrações criaram as tabelas corretamente
- Testar queries SQL manualmente antes de colocar no código
- Exportar/importar dados para testes
- Monitorar índices e performance

**Configuração de conexão:**
| Campo | Valor |
|-------|-------|
| Host | `localhost` |
| Port | `5432` |
| Database | `fintrack` |
| Username | *(definido no setup)* |
| Password | *(definido no setup)* |

---

## 🔒 Boas Práticas do Banco

1. **Nunca deletar dados financeiros fisicamente** — usar soft delete (`deleted_at`) se necessário no futuro
2. **Toda operação financeira em transação atômica** — se uma parte falhar, nada é salvo
3. **Índices compostos** nas queries mais frequentes (user_id + month)
4. **Backup diário** em produção (automático pela plataforma cloud)
5. **`sslmode=require`** sempre na URL de produção
6. **Nunca expor o banco diretamente** — apenas via API do FastAPI
