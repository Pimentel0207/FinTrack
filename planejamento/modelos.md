# 🗄️ Modelos de Dados — FinTrack Premium

Definição das tabelas SQLModel e Schemas de validação Pydantic. Todos os IDs são UUID v4.

> **Tipos financeiros:** Todos os valores monetários usam `Decimal` (não `float`) para evitar imprecisão de ponto flutuante. Ex: `0.1 + 0.2` em float resulta em `0.30000000000000004`. No banco, mapeiam para `NUMERIC(12, 2)`.

> **Timestamps:** Usar sempre `datetime.now(timezone.utc)` — `datetime.utcnow()` está depreciado desde Python 3.12.

---

### Imports base (todos os models)
```python
from decimal import Decimal
from datetime import datetime, timezone
from typing import Optional
import uuid
from sqlmodel import SQLModel, Field
```

---

### 👤 User (SQLModel)
```python
class User(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str
    email: str = Field(unique=True, index=True)           # obrigatório — recuperação de senha
    username: str = Field(unique=True, index=True)
    password_hash: str
    salary: Decimal = Field(default=Decimal("0.00"))      # Decimal, não float
    currency: str = "BRL"
    avatar_url: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
```

---

### 💸 Transaction (SQLModel)
```python
class Transaction(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="user.id")
    type: str                                              # "income", "expense", "patrimony"
    amount: Decimal = Field(gt=Decimal("0"), decimal_places=2)   # Decimal, não float
    description: str
    category: str
    method: Optional[str] = None                          # "pix", "debit", "credit"
    card_id: Optional[uuid.UUID] = Field(default=None, foreign_key="card.id")
    is_fixed: bool = False
    reference_month: str = Field(..., regex=r"^\d{4}-(0[1-9]|1[0-2])$")  # "YYYY-MM" validado
    deleted_at: Optional[datetime] = None                 # soft delete — nunca deletar fisicamente
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
```

> **Soft delete:** usar `deleted_at` em vez de `DELETE` físico. Toda query deve filtrar `where deleted_at is None`.

---

### 📈 Investment (SQLModel)
```python
class Investment(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="user.id")
    name: str
    type: str                                              # "CDB", "Ações", "Tesouro", "FII", "Outros"
    amount_invested: Decimal = Field(gt=Decimal("0"), decimal_places=2)   # valor aportado
    current_value: Decimal = Field(gt=Decimal("0"), decimal_places=2)     # valor atual (atualizado manualmente)
    return_rate: Decimal = Field(decimal_places=4)        # taxa de rendimento (%) — Decimal, não float
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
```

> **`current_value`:** separado de `amount_invested` para rastrear ganhos/perdas reais em ativos variáveis (ações, FIIs).

---

### 🐷 Goal (SQLModel)
```python
class Goal(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="user.id")
    type: str                                              # "saving" ou "sos"
    title: str
    emoji: Optional[str] = None
    target_amount: Decimal = Field(gt=Decimal("0"), decimal_places=2)
    current_amount: Decimal = Field(default=Decimal("0.00"), decimal_places=2)
    sos_category: Optional[str] = None                    # só para type="sos": "Saúde", "Carro", etc.
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
```

---

### 💳 Card (SQLModel)
```python
class Card(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="user.id")
    nickname: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
```

---

### 🔔 Subscription (SQLModel)
```python
class Subscription(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="user.id")
    name: str
    amount: Decimal = Field(gt=Decimal("0"), decimal_places=2)
    billing_day: int = Field(ge=1, le=28)                 # máximo 28 — garante validade em todos os meses
    category: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
```

> **`billing_day` máximo 28:** dias 29, 30 e 31 não existem em todos os meses. Limite em 28 garante que a cobrança sempre ocorre. Exibir "último dia do mês" na UI para billing_day=28 como opção alternativa.

---

### ✉️ Envelope (SQLModel)
```python
class Envelope(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="user.id")
    category: str
    limit_amount: Decimal = Field(gt=Decimal("0"), decimal_places=2)
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
```

---

### 🔑 RefreshToken (SQLModel)
```python
class RefreshToken(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="user.id")
    token_hash: str = Field(unique=True)                  # hash do refresh token (nunca o token em texto claro)
    expires_at: datetime                                   # quando expira (7 dias com lembrar-me, 24h sem)
    revoked: bool = False                                  # invalidado pelo logout
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
```

> **Estratégia de refresh:** O `access_token` expira em 30min. O `refresh_token` (persistido aqui) permite renovar o access sem novo login. No logout, marca `revoked=True`. Job de limpeza deleta tokens com `expires_at < now()`.

---

### 🚫 RevokedToken (SQLModel)
```python
class RevokedToken(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    token_hash: str = Field(unique=True)                  # hash SHA-256 do access token
    revoked_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    expires_at: datetime                                   # quando o token expiraria naturalmente
```

> **Limpeza automática:** Tokens com `expires_at < now()` são inúteis na blacklist e podem ser deletados. Implementar via job agendado (APScheduler ou tarefa periódica no startup do FastAPI).
