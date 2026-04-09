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
│          │──1:N──│ RefreshToken  │
│          │       └───────────────┘
│          │       ┌───────────────┐
│          │──1:N──│ RevokedToken  │
└──────────┘       └───────────────┘
```

> **Regra:** Todo registro pertence a um `User`. Não existe dado "solto" sem dono.

---

## 📋 Tabelas (8 principais + 2 de segurança)

### 1. `user` — Usuários
| Coluna | Tipo | Restrições | Descrição |
|--------|------|------------|-----------|
| `id` | UUID | PK, default uuid4 | Identificador único |
| `name` | VARCHAR | NOT NULL | Nome completo |
| `email` | VARCHAR | NOT NULL, UNIQUE, INDEX | Email (login alternativo + recuperação de senha) |
| `username` | VARCHAR | NOT NULL, UNIQUE, INDEX | Nome de usuário (login) |
| `password_hash` | VARCHAR | NOT NULL | Senha hasheada (bcrypt) |
| `salary` | NUMERIC(12,2) | DEFAULT 0.00 | Salário mensal |
| `currency` | VARCHAR(3) | DEFAULT 'BRL' | Moeda preferida |
| `avatar_url` | VARCHAR | NULL | URL do avatar |
| `created_at` | TIMESTAMPTZ | DEFAULT now() | Data de criação (com timezone) |
| `updated_at` | TIMESTAMPTZ | DEFAULT now() | Última atualização (com timezone) |

> **`NUMERIC(12,2)`** em vez de `FLOAT` — evita imprecisão de ponto flutuante em valores financeiros.
> **`TIMESTAMPTZ`** em vez de `TIMESTAMP` — armazena timezone, essencial para usuários em fusos diferentes.

---

### 2. `transaction` — Transações Financeiras
| Coluna | Tipo | Restrições | Descrição |
|--------|------|------------|-----------|
| `id` | UUID | PK | Identificador único |
| `user_id` | UUID | FK → user.id, NOT NULL | Dono da transação |
| `type` | VARCHAR | NOT NULL | `income`, `expense` ou `patrimony` |
| `amount` | NUMERIC(12,2) | NOT NULL, > 0 | Valor da transação |
| `description` | VARCHAR(255) | NOT NULL | Descrição |
| `category` | VARCHAR | NOT NULL | Uma das 12 categorias |
| `method` | VARCHAR | NULL | `pix`, `debit` ou `credit` |
| `card_id` | UUID | FK → card.id, NULL | Cartão usado (se débito/crédito) |
| `is_fixed` | BOOLEAN | DEFAULT false | Se é gasto fixo recorrente |
| `reference_month` | VARCHAR(7) | NOT NULL, CHECK ~`^\d{4}-(0[1-9]\|1[0-2])$` | Mês de referência (`YYYY-MM`) |
| `deleted_at` | TIMESTAMPTZ | NULL | Soft delete — NULL = ativo, preenchido = deletado |
| `created_at` | TIMESTAMPTZ | DEFAULT now() | Data de criação |

> **Soft delete:** nunca deletar transações fisicamente — dados financeiros históricos têm valor. `DELETE /transactions/:id` preenche `deleted_at`, não remove o registro. Todas as queries filtram `WHERE deleted_at IS NULL`.

**Índices:**
- `idx_transaction_user_month` → (`user_id`, `reference_month`) — consultas do Dashboard
- `idx_transaction_user_category` → (`user_id`, `category`) — filtros por categoria
- `idx_transaction_deleted` → (`deleted_at`) — filtro de soft delete

---

### 3. `investment` — Investimentos
| Coluna | Tipo | Restrições | Descrição |
|--------|------|------------|-----------|
| `id` | UUID | PK | Identificador único |
| `user_id` | UUID | FK → user.id, NOT NULL | Dono |
| `name` | VARCHAR | NOT NULL | Nome do investimento |
| `type` | VARCHAR | NOT NULL | CDB, Ações, Tesouro, FII, Outros |
| `amount_invested` | NUMERIC(12,2) | NOT NULL, > 0 | Valor total aportado |
| `current_value` | NUMERIC(12,2) | NOT NULL, > 0 | Valor atual (atualizado manualmente pelo usuário) |
| `return_rate` | NUMERIC(8,4) | NOT NULL | Taxa de rendimento (%) |
| `created_at` | TIMESTAMPTZ | DEFAULT now() | Data de criação |
| `updated_at` | TIMESTAMPTZ | DEFAULT now() | Última atualização |

> **`current_value`** separado de `amount_invested` permite rastrear ganhos/perdas reais em ativos variáveis (ações, FIIs). Diferença = `current_value - amount_invested`.

---

### 4. `goal` — Metas (Cofrinho + SOS)
| Coluna | Tipo | Restrições | Descrição |
|--------|------|------------|-----------|
| `id` | UUID | PK | Identificador único |
| `user_id` | UUID | FK → user.id, NOT NULL | Dono |
| `type` | VARCHAR | NOT NULL | `saving` ou `sos` |
| `title` | VARCHAR | NOT NULL | Nome da meta |
| `emoji` | VARCHAR | NULL | Emoji representativo |
| `target_amount` | NUMERIC(12,2) | NOT NULL, > 0 | Valor alvo |
| `current_amount` | NUMERIC(12,2) | DEFAULT 0.00 | Valor acumulado |
| `sos_category` | VARCHAR | NULL | Subcategoria SOS (Saúde, Carro, Acidentes, Outros) |
| `created_at` | TIMESTAMPTZ | DEFAULT now() | Data de criação |
| `updated_at` | TIMESTAMPTZ | DEFAULT now() | Última atualização |

---

### 5. `card` — Cartões (Apelidos)
| Coluna | Tipo | Restrições | Descrição |
|--------|------|------------|-----------|
| `id` | UUID | PK | Identificador único |
| `user_id` | UUID | FK → user.id, NOT NULL | Dono |
| `nickname` | VARCHAR | NOT NULL | Apelido (ex: "Nubank") |
| `created_at` | TIMESTAMPTZ | DEFAULT now() | Data de criação |

---

### 6. `subscription` — Assinaturas Recorrentes
| Coluna | Tipo | Restrições | Descrição |
|--------|------|------------|-----------|
| `id` | UUID | PK | Identificador único |
| `user_id` | UUID | FK → user.id, NOT NULL | Dono |
| `name` | VARCHAR | NOT NULL | Nome (ex: "Netflix") |
| `amount` | NUMERIC(12,2) | NOT NULL, > 0 | Valor mensal |
| `billing_day` | SMALLINT | NOT NULL, CHECK (1 ≤ billing_day ≤ 28) | Dia de cobrança — máx. 28 para validade em todos os meses |
| `category` | VARCHAR | NOT NULL | Categoria da assinatura |
| `created_at` | TIMESTAMPTZ | DEFAULT now() | Data de criação |

> **`billing_day` máximo 28:** dias 29, 30 e 31 não existem em todos os meses. Limitar a 28 garante que o alerta sempre dispare. Na UI, oferecer a opção "último dia do mês" que mapeia para 28.

---

### 7. `envelope` — Limites por Categoria
| Coluna | Tipo | Restrições | Descrição |
|--------|------|------------|-----------|
| `id` | UUID | PK | Identificador único |
| `user_id` | UUID | FK → user.id, NOT NULL | Dono |
| `category` | VARCHAR | NOT NULL | Categoria do envelope |
| `limit_amount` | NUMERIC(12,2) | NOT NULL, > 0 | Valor limite mensal |
| `updated_at` | TIMESTAMPTZ | DEFAULT now() | Última atualização |

**Constraint:** UNIQUE(`user_id`, `category`) — cada usuário só tem 1 envelope por categoria.

---

### 8. `refresh_token` — Tokens de Renovação (Auth)
| Coluna | Tipo | Restrições | Descrição |
|--------|------|------------|-----------|
| `id` | UUID | PK | Identificador único |
| `user_id` | UUID | FK → user.id, NOT NULL | Dono do token |
| `token_hash` | VARCHAR | NOT NULL, UNIQUE | Hash SHA-256 do refresh token |
| `expires_at` | TIMESTAMPTZ | NOT NULL | Expiração (24h sem lembrar-me, 7 dias com) |
| `revoked` | BOOLEAN | DEFAULT false | Invalidado pelo logout |
| `created_at` | TIMESTAMPTZ | DEFAULT now() | Data de criação |

> **Estratégia:** `access_token` expira em 30min (curto, para segurança). `refresh_token` expira em 24h ou 7 dias (dependendo do "Lembrar-me"). No logout, marca `revoked=true`. Job de limpeza deleta registros com `expires_at < now()`.

---

### 9. `revoked_token` — Blacklist de Access Tokens
| Coluna | Tipo | Restrições | Descrição |
|--------|------|------------|-----------|
| `id` | UUID | PK | Identificador único |
| `token_hash` | VARCHAR | NOT NULL, UNIQUE | Hash SHA-256 do access token invalidado |
| `revoked_at` | TIMESTAMPTZ | DEFAULT now() | Data da revogação |
| `expires_at` | TIMESTAMPTZ | NOT NULL | Quando o token expiraria naturalmente |

> **Limpeza automática:** tokens com `expires_at < now()` são inúteis e devem ser deletados periodicamente. Implementar via `APScheduler` no startup do FastAPI ou trigger PostgreSQL.

---

## 🔄 Migrações (Alembic)

| Migração | O que faz |
|----------|-----------|
| `001_create_user` | Cria tabela `user` com campo `email` |
| `002_create_card` | Cria tabela `card` (precisa existir antes de `transaction`) |
| `003_create_transaction` | Cria tabela `transaction` com FK, `deleted_at` e tipo NUMERIC |
| `004_create_investment` | Cria tabela `investment` com `current_value` e NUMERIC |
| `005_create_goal` | Cria tabela `goal` |
| `006_create_subscription` | Cria tabela `subscription` com constraint `billing_day` |
| `007_create_envelope` | Cria tabela `envelope` com constraint UNIQUE |
| `008_create_refresh_token` | Cria tabela `refresh_token` |
| `009_create_revoked_token` | Cria tabela `revoked_token` |
| `010_add_indexes` | Adiciona índices compostos para performance |

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

1. **Nunca deletar dados financeiros fisicamente** — usar soft delete (`deleted_at`) em Transaction
2. **Toda operação financeira em transação atômica** — se uma parte falhar, nada é salvo
3. **Índices compostos** nas queries mais frequentes (`user_id` + `reference_month`)
4. **`NUMERIC(12,2)`** para todos os valores monetários — nunca `FLOAT`
5. **`TIMESTAMPTZ`** para todos os timestamps — armazena timezone
6. **Backup diário** em produção (automático pela plataforma cloud)
7. **`sslmode=require`** sempre na URL de produção
8. **Nunca expor o banco diretamente** — apenas via API do FastAPI
