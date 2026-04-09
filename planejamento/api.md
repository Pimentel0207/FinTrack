# 🔌 Camada de API — FinTrack Premium

### 🏗️ Arquitetura: API Monolítica

O FinTrack utiliza uma **API monolítica** — um único servidor FastAPI que gerencia todas as rotas, regras de negócio e acesso ao banco de dados.

**Por que monolítica e não microserviços:**
- **Transações atômicas:** operações financeiras (ex: depositar no cofrinho) precisam debitar e creditar na mesma transação de banco — impossível de garantir entre serviços separados sem complexidade extrema.
- **Simplicidade:** 1 servidor, 1 banco, 1 deploy — ideal para projeto com 1 desenvolvedor.
- **Custo:** hospedagem de 1 serviço é muito mais barata que múltiplos.
- **Organização interna:** a separação por pastas (`api/`, `crud/`, `models/`, `schemas/`) já garante organização de código sem precisar de serviços separados.

> **Evolução futura:** Se o FinTrack escalar para milhares de usuários, o módulo de IA (V3) pode ser extraído para um microserviço próprio — mas o core financeiro permanece monolítico.

---

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

> Dashboard é somente leitura — não tem POST/PUT/DELETE pois agrega dados de outros recursos.

---

### 📑 Transações (`/transactions`) 🔒
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/transactions` | Listar com filtros (`?category=&card=&period=&type=&page=&limit=`) |
| GET | `/transactions/:id` | Buscar transação por ID |
| POST | `/transactions` | Criar nova transação |
| PUT | `/transactions/:id` | Atualizar transação completa (substitui todos os campos) |
| PATCH | `/transactions/:id` | Atualizar parcial (ex: só a categoria ou descrição) |
| DELETE | `/transactions/:id` | Soft delete — preenche `deleted_at`, não remove fisicamente |

---

### 📈 Investimentos (`/investments`) 🔒
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/investments` | Listar todos os investimentos do usuário |
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
| PUT | `/goals/:id` | Atualizar meta completa (título, emoji, valor alvo) |
| PATCH | `/goals/:id` | Atualizar parcial (ex: só o emoji) |
| DELETE | `/goals/:id` | Remover meta |
| POST | `/goals/:id/deposit` | Depositar valor na meta |
| POST | `/goals/:id/withdraw` | Retirar valor da meta |

> Depósito e retirada são **ações** (não atualizações de campo), por isso usam POST em sub-rotas.

---

### 💳 Cartões (`/cards`) 🔒
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/cards` | Listar todos os cartões do usuário |
| GET | `/cards/:id` | Buscar cartão por ID |
| POST | `/cards` | Adicionar novo cartão (apelido) |
| PUT | `/cards/:id` | Atualizar cartão completo |
| PATCH | `/cards/:id` | Atualizar parcial (ex: só o apelido) |
| DELETE | `/cards/:id` | Remover cartão |

---

### 🔔 Assinaturas (`/subscriptions`) 🔒
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/subscriptions` | Listar todas as assinaturas recorrentes |
| GET | `/subscriptions/:id` | Buscar assinatura por ID |
| POST | `/subscriptions` | Adicionar nova assinatura |
| PUT | `/subscriptions/:id` | Atualizar assinatura completa |
| PATCH | `/subscriptions/:id` | Atualizar parcial (ex: só o valor ou dia de cobrança) |
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
| PUT | `/profile` | Atualizar perfil completo (nome, salário, moeda, avatar) |
| PATCH | `/profile` | Atualizar parcial (ex: só o salário) |

> Perfil é recurso único por usuário — não tem POST, DELETE ou `:id` (sempre usa o `user_id` do JWT).

---

### 🤖 IA (`/ai`) — V3 futuro
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/ai/upload` | Upload de comprovante/boleto para OCR |
| GET | `/ai/insights` | Análise e previsões inteligentes |
| GET | `/ai/products` | Listar produtos identificados pela IA |
| GET | `/ai/products/:id` | Buscar histórico de preço de um produto |

---

## 📐 Padrões de Resposta da API

### ✅ Sucesso — Item Único
```json
{
  "success": true,
  "data": { ... }
}
```

### ✅ Sucesso — Lista com Paginação
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

### ❌ Erro
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

---

## 📐 Tabela de Códigos de Erro

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
