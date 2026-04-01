# 📂 Estrutura de Pastas — FinTrack Premium

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
│   │   └── styles/             # index.css — CSS monolítico com Design Tokens
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
├── start.py                    # ⭐ Script que inicia Backend + Frontend ao mesmo tempo
├── .env                        # Variáveis de ambiente (não commitar)
├── package.json                # Raiz: scripts utilitários
└── planejamento/               # Documentação modular do projeto
```

---

### ⭐ Inicialização Unificada (`start.py`)

Na raiz do projeto existe o arquivo `start.py` que **inicia o backend e o frontend com um único comando**, sem precisar abrir dois terminais.

**Como usar:**
```bash
python start.py
```

**O que ele faz por baixo:**
1. Inicia `uvicorn backend.app.main:app --reload` (Backend na porta 8000)
2. Inicia `npm run dev --prefix frontend` (Frontend na porta 5173)
3. Exibe os logs dos dois processos no mesmo terminal
4. `Ctrl+C` encerra ambos de uma vez

**Comandos individuais (caso precise rodar separado):**
- `uvicorn backend.app.main:app --reload` → Só o Backend (:8000)
- `npm run dev --prefix frontend` → Só o Frontend (:5173)

