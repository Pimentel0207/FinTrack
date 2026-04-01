# 🎯 Ordem de Prioridade — Do Zero ao Projeto Pronto

> Este arquivo define **exatamente** a sequência de desenvolvimento do FinTrack. Cada etapa depende da anterior. Siga essa ordem para evitar retrabalho.

---

## 🗺️ Visão Geral da Sequência

```
BD → Backend → Frontend → Integração → Testes → Deploy
```

> **Por que nessa ordem?** O banco de dados é o alicerce. O backend constrói as paredes em cima dele. O frontend é a fachada que o usuário vê. Não adianta pintar a fachada sem ter as paredes.

---

## Etapa 1 — 🗄️ Banco de Dados (PostgreSQL)
**Prioridade: PRIMEIRA** — Sem banco, nada funciona.

| # | Tarefa | Arquivo de referência |
|---|--------|----------------------|
| 1.1 | Instalar PostgreSQL e criar banco `fintrack` | `banco_de_dados.md` |
| 1.2 | Conectar DBeaver ao banco local | `banco_de_dados.md` |
| 1.3 | Configurar `.env` com `DATABASE_URL` | `backend.md` |
| 1.4 | Configurar Alembic no projeto | `backend.md` |
| 1.5 | Criar migração da tabela `user` | `banco_de_dados.md` |
| 1.6 | Criar migração da tabela `card` | `banco_de_dados.md` |
| 1.7 | Criar migrações: `transaction`, `investment`, `goal`, `subscription`, `envelope` | `banco_de_dados.md` |
| 1.8 | Criar migração da tabela `revoked_token` | `banco_de_dados.md` |
| 1.9 | Rodar `alembic upgrade head` e verificar no DBeaver | `banco_de_dados.md` |

**✅ Resultado:** Todas as 8 tabelas existem no banco, com relacionamentos e índices.

---

## Etapa 2 — ⚙️ Backend Base (FastAPI)
**Prioridade: SEGUNDA** — Criar a estrutura antes das rotas.

| # | Tarefa | Arquivo de referência |
|---|--------|----------------------|
| 2.1 | Criar ambiente virtual Python e instalar dependências | `backend.md` |
| 2.2 | Criar `main.py` com FastAPI + CORS + middleware de erros | `backend.md` |
| 2.3 | Criar `db/session.py` — conexão com PostgreSQL via SQLModel | `backend.md` |
| 2.4 | Criar todos os Models (`models/*.py`) | `backend.md` |
| 2.5 | Criar todos os Schemas (`schemas/*.py`) | `backend.md` |
| 2.6 | Criar `core/config.py` — settings via env vars | `backend.md` |
| 2.7 | Criar `core/security.py` — hash de senha + JWT | `backend.md` |
| 2.8 | Criar `core/dependencies.py` — `get_current_user`, `get_db` | `backend.md` |
| 2.9 | Testar: `uvicorn backend.app.main:app --reload` roda sem erros | — |

**✅ Resultado:** Backend roda na porta 8000, conecta ao banco, mas ainda sem rotas.

---

## Etapa 3 — 🔐 Autenticação (Backend)
**Prioridade: TERCEIRA** — Sem auth, não dá pra proteger nenhuma rota.

| # | Tarefa | Arquivo de referência |
|---|--------|----------------------|
| 3.1 | CRUD de User (`crud/user.py`) | `backend.md` |
| 3.2 | Rota `POST /auth/register` — criar usuário | `backend.md` |
| 3.3 | Rota `POST /auth/login` — autenticar e retornar JWT | `backend.md` |
| 3.4 | Rota `POST /auth/logout` — blacklist do token | `backend.md` |
| 3.5 | Rota `POST /auth/refresh` — renovar token | `backend.md` |
| 3.6 | Testar no Swagger (`/docs`): registrar → login → usar token | — |

**✅ Resultado:** Consegue criar conta, logar e receber um JWT válido.

---

## Etapa 4 — 🔌 CRUD das Entidades (Backend)
**Prioridade: QUARTA** — Construir todas as operações de dados.

| # | Tarefa | Arquivo de referência |
|---|--------|----------------------|
| 4.1 | CRUD completo de Transações (`/transactions`) | `backend.md` |
| 4.2 | CRUD completo de Cartões (`/cards`) | `backend.md` |
| 4.3 | CRUD completo de Investimentos (`/investments`) | `backend.md` |
| 4.4 | CRUD completo de Metas + Deposit/Withdraw (`/goals`) | `backend.md` |
| 4.5 | CRUD completo de Assinaturas (`/subscriptions`) | `backend.md` |
| 4.6 | CRUD completo de Envelopes (`/envelopes`) | `backend.md` |
| 4.7 | Rotas de Perfil — GET, PUT, PATCH (`/profile`) | `backend.md` |
| 4.8 | Rotas de Dashboard — Summary + Chart (`/dashboard`) | `backend.md` |
| 4.9 | Testar TODOS os endpoints no Swagger (`/docs`) | — |

**✅ Resultado:** API 100% funcional — todas as rotas respondem corretamente.

---

## Etapa 5 — 🎨 Frontend Base (React)
**Prioridade: QUINTA** — Agora que o backend funciona, construir a interface.

| # | Tarefa | Arquivo de referência |
|---|--------|----------------------|
| 5.1 | Inicializar projeto React + Vite + TypeScript | `frontend.md` |
| 5.2 | Criar `index.css` com Design Tokens (cores, fontes, glassmorphism) | `frontend.md` |
| 5.3 | Configurar React Router (rotas: `/login`, `/`, `/transactions`, `/investments`, `/settings`) | `frontend.md` |
| 5.4 | Criar componentes base: Card, Button, Modal, Input, Badge, Toast | `frontend.md` |
| 5.5 | Criar layout global: Sidebar (desktop) + Bottom Nav (mobile) | `frontend.md` |
| 5.6 | Criar `AuthContext` — estado de login, token, logout | `frontend.md` |
| 5.7 | Criar `api.ts` — instância Axios com base URL e interceptor de token | `frontend.md` |

**✅ Resultado:** App React rodando com layout, navegação e sistema de tema.

---

## Etapa 6 — 🔐 Telas de Auth (Frontend ↔ Backend)
**Prioridade: SEXTA** — Primeira integração real.

| # | Tarefa | Arquivo de referência |
|---|--------|----------------------|
| 6.1 | Tela de Login (glassmorphism, shake no erro, loading) | `frontend.md` |
| 6.2 | Tela de Registro (validação inline) | `frontend.md` |
| 6.3 | `authService.ts` — conectar com `POST /auth/login` e `/register` | `frontend.md` |
| 6.4 | Proteção de rotas (redirecionar para login se não autenticado) | `frontend.md` |
| 6.5 | Testar fluxo completo: registrar → logar → ver Dashboard vazio | — |

**✅ Resultado:** Usuário consegue criar conta e acessar o app.

---

## Etapa 7 — 📑 Telas de CRUD (Frontend ↔ Backend)
**Prioridade: SÉTIMA** — O coração do app.

| # | Tarefa | Arquivo de referência |
|---|--------|----------------------|
| 7.1 | Página de Transações + modal de criação | `frontend.md` |
| 7.2 | `transactionService.ts` — conectar com API | `frontend.md` |
| 7.3 | Filtros (categoria, cartão, período, busca) | `frontend.md` |
| 7.4 | Página de Investimentos | `frontend.md` |
| 7.5 | Página de Metas (Cofrinho) com barra de progresso | `frontend.md` |
| 7.6 | Página de Reserva SOS | `frontend.md` |
| 7.7 | Página de Configurações (Perfil, Cartões, Assinaturas, Envelopes) | `frontend.md` |
| 7.8 | Conectar todos os services com a API | `frontend.md` |

**✅ Resultado:** Todas as telas funcionam e salvam dados no banco via API.

---

## Etapa 8 — 🏠 Dashboard & Polish
**Prioridade: OITAVA** — Experiência premium.

| # | Tarefa | Arquivo de referência |
|---|--------|----------------------|
| 8.1 | Cards de Resumo do Dashboard com dados reais | `frontend.md` |
| 8.2 | Gráfico de Fluxo (Recharts AreaChart) | `frontend.md` |
| 8.3 | Botão FAB "+" com modal de transação rápida | `frontend.md` |
| 8.4 | Alertas visuais dos envelopes (50%, 80%, 100%) | `frontend.md` |
| 8.5 | Animação de confetes ao completar meta | `frontend.md` |
| 8.6 | Animação de moeda ao depositar no cofrinho | `frontend.md` |
| 8.7 | Exportar/Importar backup JSON | `frontend.md` |
| 8.8 | Responsividade final (mobile, tablet, desktop) | `frontend.md` |

**✅ Resultado:** App com visual premium, animações e UX polida.

---

## Etapa 9 — 🧪 Testes & QA
**Prioridade: NONA** — Garantir que tudo funciona.

| # | Tarefa | Tipo |
|---|--------|------|
| 9.1 | Testes unitários: cálculos de saldo, envelopes, projeções | Backend |
| 9.2 | Testes de integração: API ↔ Banco | Backend |
| 9.3 | Testes de fluxo: registro → login → criar transação → ver dashboard | Frontend |
| 9.4 | QA visual: responsividade, animações, glassmorphism | Frontend |
| 9.5 | Testes de segurança: acesso cruzado entre usuários, rate limiting | Backend |
| 9.6 | Revisão da documentação modular | Docs |

**✅ Resultado:** Projeto testado e estável.

---

## Etapa 10 — 🚀 Deploy
**Prioridade: ÚLTIMA** — Colocar no ar.

| # | Tarefa | Tipo |
|---|--------|------|
| 10.1 | Escolher plataforma (Railway / Render) | Infra |
| 10.2 | Configurar PostgreSQL em produção (Neon / Supabase) | BD |
| 10.3 | Configurar variáveis de ambiente na plataforma | Infra |
| 10.4 | Deploy do Backend (FastAPI + Uvicorn) | Backend |
| 10.5 | Deploy do Frontend (Vite build → static hosting) | Frontend |
| 10.6 | Configurar HTTPS e domínio | Infra |
| 10.7 | Testar em produção | QA |

**✅ Resultado:** FinTrack Premium no ar, acessível pela internet.

---

## 📊 Resumo Visual

```
Etapa 1  ████████████  BD: Criar tabelas
Etapa 2  ████████████  Backend: Setup base
Etapa 3  ████████████  Backend: Auth
Etapa 4  ████████████  Backend: CRUD completo
Etapa 5  ████████████  Frontend: Setup base
Etapa 6  ████████████  Frontend: Auth
Etapa 7  ████████████  Frontend: CRUD telas
Etapa 8  ████████████  Frontend: Dashboard & Polish
Etapa 9  ████████████  Testes & QA
Etapa 10 ████████████  Deploy
```

> **Tempo estimado:** ~4–6 semanas para 1 desenvolvedor focado, ou ~2–3 semanas em dupla.
