# 🔐 Segurança — FinTrack Premium

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

**Risco:** Usuário A acessa ou modifica dados do usuário B.

**Contramedidas:**
- Toda query filtra por `userId` **extraído do JWT** — nunca do body da requisição.
- Middleware de autorização verifica ownership antes de qualquer `UPDATE` ou `DELETE`.

```python
# ✅ CORRETO
user_id = token_data.user_id  # extraído do JWT no middleware
transaction = session.exec(
    select(Transaction).where(Transaction.id == transaction_id, Transaction.user_id == user_id)
).first()

# ❌ ERRADO
user_id = body.user_id
```

---

### A02 — Security Misconfiguration

**Contramedidas:**
- `FastAPI-middleware` para headers de segurança.
- `CORS_ORIGIN` via variável de ambiente — nunca `allow_origins=["*"]`.
- `DEBUG=False` em produção.

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

**Contramedidas:**
- `pip audit` ou `safety` — corrigir críticos e altos antes do deploy.
- `requirements.txt` com versões fixas.
- **Dependabot** habilitado no GitHub.

---

### A04 — Cryptographic Failures

**Contramedidas:**
- Passlib com algoritmo `bcrypt` e *rounds* `12`.
- JWT secret mínimo 256 bits: `openssl rand -base64 32`.
- HTTPS obrigatório em produção.
- PostgreSQL sempre com `sslmode=require` na URL.

```python
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
hashed_password = pwd_context.hash(password)
token = jwt.encode({"sub": str(user_id), "exp": expire}, SECRET_KEY, algorithm="HS256")
```

---

### A05 — Injection (SQL, XSS)

**Contramedidas:**
- **SQLModel (SQLAlchemy):** queries parametrizadas por padrão.
- **Pydantic:** validação de schema automática em todos os endpoints.

```python
class TransactionCreate(BaseModel):
    amount: float = Field(gt=0, le=1000000)
    description: str = Field(min_length=1, max_length=255)
    category: str
    method: str
```

---

### A07 — Authentication Failures

**Contramedidas:**
- Rate limiting: `5 tentativas` por IP em `15 min` no login.
- Mensagem de erro genérica: sempre "Usuário ou senha incorretos".

```python
# FastAPI-limiter (Redis) ou slowapi (In-memory)
@app.post("/api/v1/auth/login")
@limiter.limit("5/15minutes")
async def login(request: Request):
    ...
```

---

### A10 — Mishandling of Exceptional Conditions

**Contramedidas:**
- Exception Handler global no FastAPI.
- Transações atômicas via `with Session(engine) as session: with session.begin():`.

```python
import logging
logger = logging.getLogger("fintrack")
logger.warning(f"Access denied for IP: {request.client.host}")
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
