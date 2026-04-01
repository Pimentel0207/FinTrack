# 🗄️ Modelos de Dados — FinTrack Premium

Definição das tabelas SQLModel e Schemas de validação Pydantic. Todos os IDs são UUID v4.

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
    updated_at: datetime = Field(default_factory=datetime.utcnow)
```

### 💳 Card (SQLModel)
```python
class Card(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="user.id")
    nickname: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
```

### 🔔 Subscription (SQLModel)
```python
class Subscription(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="user.id")
    name: str
    amount: float
    billing_day: int  # 1-31
    category: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
```

### ✉️ Envelope (SQLModel)
```python
class Envelope(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="user.id")
    category: str
    limit_amount: float
    updated_at: datetime = Field(default_factory=datetime.utcnow)
```
