# 🏗️ Fases & Tarefas — V1 (MVP)

> Cada fase agrupa tarefas que podem ser feitas juntas. Dentro de cada fase, as tarefas estão na **ordem correta** — de cima para baixo, sem pular.
>
> **Legenda:** 🗄️ = Banco | ⚙️ = Backend | 🎨 = Frontend | 🔗 = Integração

---

## FASE 1 — Alicerce (Setup do Ambiente)
> **Objetivo:** Ter tudo instalado e configurado para começar a codar.
> **Depende de:** Nada — é o ponto zero.

| # | Camada | Tarefa | Detalhe |
|---|--------|--------|---------|
| 1.1 | 🗄️ | Instalar PostgreSQL | Instalar localmente ou via Docker |
| 1.2 | 🗄️ | Criar banco `fintrack` | `CREATE DATABASE fintrack;` |
| 1.3 | 🗄️ | Criar usuário do banco | Com permissões restritas (não usar `postgres` root) |
| 1.4 | 🗄️ | Conectar DBeaver | Verificar conexão visualmente |
| 1.5 | ⚙️ | Criar pasta `backend/` | Estrutura: `app/`, `alembic/`, `requirements.txt` |
| 1.6 | ⚙️ | Criar ambiente virtual Python | `python -m venv venv` + ativar |
| 1.7 | ⚙️ | Instalar dependências | `pip install -r requirements.txt` |
| 1.8 | ⚙️ | Criar `.env` na raiz | `DATABASE_URL`, `SECRET_KEY`, `CORS_ORIGIN` |
| 1.9 | 🎨 | Inicializar frontend React | `npm create vite@latest ./frontend` (React + TypeScript) |
| 1.10 | 🎨 | Instalar dependências frontend | `react-router-dom`, `axios`, `recharts` |
| 1.11 | 🔗 | Criar `start.py` na raiz | Script que inicia backend + frontend juntos |

**✅ Fase 1 concluída quando:** `python start.py` abre o backend na :8000 e o frontend na :5173 sem erros.

---

## FASE 2 — Banco de Dados (Tabelas & Migrações)
> **Objetivo:** Criar todas as 8 tabelas no PostgreSQL.
> **Depende de:** Fase 1 concluída.

| # | Camada | Tarefa | Detalhe |
|---|--------|--------|---------|
| 2.1 | ⚙️ | Criar `db/session.py` | Engine + SessionLocal do SQLModel |
| 2.2 | ⚙️ | Criar `core/config.py` | Carregar variáveis do `.env` |
| 2.3 | ⚙️ | Criar Model `user.py` | Tabela `user` com todos os campos |
| 2.4 | ⚙️ | Criar Model `card.py` | Tabela `card` (precisa existir antes de `transaction`) |
| 2.5 | ⚙️ | Criar Model `transaction.py` | Tabela `transaction` com FK para `user` e `card` |
| 2.6 | ⚙️ | Criar Model `investment.py` | Tabela `investment` |
| 2.7 | ⚙️ | Criar Model `goal.py` | Tabela `goal` (cofrinho + SOS) |
| 2.8 | ⚙️ | Criar Model `subscription.py` | Tabela `subscription` |
| 2.9 | ⚙️ | Criar Model `envelope.py` | Tabela `envelope` com UNIQUE(user_id, category) |
| 2.10 | ⚙️ | Criar Model `revoked_token.py` | Tabela `revoked_token` (segurança) |
| 2.11 | ⚙️ | Configurar Alembic | `alembic init alembic` + ajustar `env.py` |
| 2.12 | ⚙️ | Gerar migrações | `alembic revision --autogenerate` |
| 2.13 | 🗄️ | Executar migrações | `alembic upgrade head` |
| 2.14 | 🗄️ | Verificar no DBeaver | Conferir se as 8 tabelas existem com colunas corretas |

**✅ Fase 2 concluída quando:** DBeaver mostra as 8 tabelas com relacionamentos FK corretos.

---

## FASE 3 — Autenticação (Backend + Frontend)
> **Objetivo:** Usuário consegue criar conta, logar e ser autenticado.
> **Depende de:** Fase 2 concluída (tabela `user` e `revoked_token` existem).

| # | Camada | Tarefa | Detalhe |
|---|--------|--------|---------|
| 3.1 | ⚙️ | Criar `core/security.py` | Hash bcrypt + criar/validar JWT |
| 3.2 | ⚙️ | Criar `core/dependencies.py` | `get_current_user()`, `get_db()` |
| 3.3 | ⚙️ | Criar `core/exceptions.py` | Exceções padronizadas (401, 403, 404, 409) |
| 3.4 | ⚙️ | Criar `crud/user.py` | Criar user, buscar por username, verificar senha |
| 3.5 | ⚙️ | Criar `schemas/user.py` | `UserCreate`, `UserLogin`, `UserResponse`, `TokenResponse` |
| 3.6 | ⚙️ | Criar `api/v1/auth.py` | Rotas: register, login, logout, refresh |
| 3.7 | ⚙️ | Registrar rotas no `main.py` | Incluir router de auth |
| 3.8 | ⚙️ | Testar no Swagger `/docs` | Registrar → login → copiar token → usar em rota protegida |
| 3.9 | 🎨 | Criar `index.css` | Design Tokens (cores, fontes, glassmorphism, animações) |
| 3.10 | 🎨 | Criar componentes base | `<Button>`, `<Input>`, `<Card>`, `<Toast>` |
| 3.11 | 🎨 | Criar `AuthContext` | Estado global: user, token, isAuthenticated, login(), logout() |
| 3.12 | 🎨 | Criar `api.ts` (Axios) | Base URL + interceptor que injeta token no header |
| 3.13 | 🎨 | Criar `authService.ts` | Funções: login(), register(), logout() |
| 3.14 | 🎨 | Criar Tela de Login | Glassmorphism, shake no erro, spinner no botão |
| 3.15 | 🎨 | Criar Tela de Registro | Validação inline, redirecionamento após criar conta |
| 3.16 | 🎨 | Proteção de rotas | Redirecionar para `/login` se não autenticado |
| 3.17 | 🔗 | Testar fluxo completo | Registro → Login → Acesso ao Dashboard (vazio) |

**✅ Fase 3 concluída quando:** Usuário registra, loga e vê o Dashboard vazio. Token JWT funciona.

---

## FASE 4 — Core Financeiro (Transações + Cartões)
> **Objetivo:** Registrar entradas e saídas com cartões.
> **Depende de:** Fase 3 concluída (auth funciona).

| # | Camada | Tarefa | Detalhe |
|---|--------|--------|---------|
| 4.1 | ⚙️ | CRUD `crud/card.py` | Criar, listar, atualizar, deletar cartões |
| 4.2 | ⚙️ | Schemas `schemas/card.py` | `CardCreate`, `CardUpdate`, `CardResponse` |
| 4.3 | ⚙️ | Rotas `api/v1/cards.py` | GET, GET/:id, POST, PUT, PATCH, DELETE |
| 4.4 | ⚙️ | CRUD `crud/transaction.py` | Criar, listar (com filtros), atualizar, deletar |
| 4.5 | ⚙️ | Schemas `schemas/transaction.py` | `TransactionCreate`, `TransactionUpdate`, `TransactionResponse` |
| 4.6 | ⚙️ | Rotas `api/v1/transactions.py` | CRUD completo + filtros por query params |
| 4.7 | ⚙️ | Regra: crédito/débito exige card_id | Validação no schema Pydantic |
| 4.8 | ⚙️ | Regra: gasto fixo provisiona meses | Criar registros para meses seguintes |
| 4.9 | ⚙️ | Testar no Swagger | Criar cartão → criar transação com cartão → filtrar |
| 4.10 | 🎨 | Criar `cardService.ts` | Conectar com API de cartões |
| 4.11 | 🎨 | Criar `transactionService.ts` | Conectar com API de transações |
| 4.12 | 🎨 | Página de Transações | Lista com emoji + filtros + modal de criação |
| 4.13 | 🎨 | Modal de Nova Transação | Tipo → Valor → Categoria → Método → Cartão (condicional) |
| 4.14 | 🎨 | Seção de Cartões (Config) | Listar e adicionar apelidos de cartões |
| 4.15 | 🔗 | Testar fluxo completo | Criar cartão → criar transação → ver na lista → filtrar |

**✅ Fase 4 concluída quando:** App registra transações com cartões, filtra e lista corretamente.

---

## FASE 5 — Patrimônio (Investimentos + Metas + SOS)
> **Objetivo:** Gestão de investimentos, cofrinhos e reserva SOS.
> **Depende de:** Fase 4 concluída (transações funcionam).

| # | Camada | Tarefa | Detalhe |
|---|--------|--------|---------|
| 5.1 | ⚙️ | CRUD + Rotas de Investimentos | `/investments` completo |
| 5.2 | ⚙️ | CRUD + Rotas de Metas | `/goals` completo + `/goals/:id/deposit` e `/withdraw` |
| 5.3 | ⚙️ | Regra: retirada ≤ saldo atual | Validação com HTTP 422 se insuficiente |
| 5.4 | ⚙️ | Testar no Swagger | Criar meta → depositar → retirar → verificar saldo |
| 5.5 | 🎨 | Criar services | `investmentService.ts`, `goalService.ts` |
| 5.6 | 🎨 | Página de Investimentos | Lista com tipo, valor e rendimento |
| 5.7 | 🎨 | Página de Metas (Cofrinho) | Cards com barra de progresso + projeção de tempo |
| 5.8 | 🎨 | Botões Depositar/Retirar | Com validação de saldo no frontend também |
| 5.9 | 🎨 | Página de Reserva SOS | Grid de subcategorias + cálculo de sobrevivência |
| 5.10 | 🎨 | Seletor de abas | "Investimentos" | "Meus Sonhos" | "Reserva SOS" |
| 5.11 | 🔗 | Testar fluxo completo | Criar investimento → criar meta → depositar → ver progresso |

**✅ Fase 5 concluída quando:** Toda a gestão de patrimônio funciona com dados persistidos.

---

## FASE 6 — Configurações (Perfil + Assinaturas + Envelopes)
> **Objetivo:** Tela de configurações completa.
> **Depende de:** Fase 4 concluída (cartões já existem).

| # | Camada | Tarefa | Detalhe |
|---|--------|--------|---------|
| 6.1 | ⚙️ | Rotas de Perfil | GET, PUT, PATCH `/profile` |
| 6.2 | ⚙️ | CRUD + Rotas de Assinaturas | `/subscriptions` completo |
| 6.3 | ⚙️ | CRUD + Rotas de Envelopes | `/envelopes` completo |
| 6.4 | 🎨 | Criar services | `profileService.ts`, `subscriptionService.ts`, `envelopeService.ts` |
| 6.5 | 🎨 | Seção Perfil | Nome, avatar, salário, moeda |
| 6.6 | 🎨 | Seção Assinaturas | Lista + adicionar/remover |
| 6.7 | 🎨 | Seção Envelopes | Limites por categoria + indicador visual |
| 6.8 | 🎨 | Seção Segurança | Alterar senha, ver sessões |
| 6.9 | 🎨 | Backup | Exportar/importar JSON |
| 6.10 | 🔗 | Testar fluxo completo | Alterar perfil → adicionar assinatura → definir envelopes |

**✅ Fase 6 concluída quando:** Configurações completas, todas salvando no banco.

---

## FASE 7 — Dashboard & Visual Premium
> **Objetivo:** Tela principal com dados agregados e animações.
> **Depende de:** Fases 4, 5 e 6 concluídas (precisa de dados de tudo).

| # | Camada | Tarefa | Detalhe |
|---|--------|--------|---------|
| 7.1 | ⚙️ | Rota `GET /dashboard/summary` | Calcular: Saldo Real, Disponível, Entradas, Patrimônio |
| 7.2 | ⚙️ | Rota `GET /dashboard/chart` | Agregar entradas vs saídas (últimos 6 meses) |
| 7.3 | 🎨 | Criar `dashboardService.ts` | Conectar com API |
| 7.4 | 🎨 | 4 Cards de Resumo | Com dados reais do backend |
| 7.5 | 🎨 | Gráfico AreaChart (Recharts) | Entradas vs Saídas (6 meses) |
| 7.6 | 🎨 | Botão FAB "+" | Abre modal de transação rápida |
| 7.7 | 🎨 | Alertas de envelopes | Visual: verde → amarelo → laranja → vermelho |
| 7.8 | 🎨 | Alertas de assinaturas | "Netflix vence em 3 dias" |
| 7.9 | 🎨 | Animação de confetes | Canvas ao completar meta 100% |
| 7.10 | 🎨 | Animação de moeda | Lottie ao depositar no cofrinho |
| 7.11 | 🎨 | Responsividade final | Mobile (Bottom Nav) + Tablet + Desktop (Sidebar) |
| 7.12 | 🎨 | Dark/Light mode toggle | Trocar variáveis CSS via `data-theme` |

**✅ Fase 7 concluída quando:** Dashboard mostra todos os dados com visual premium e animações.

---

## FASE 8 — Testes, QA & Deploy
> **Objetivo:** Garantir qualidade e colocar no ar.
> **Depende de:** Todas as fases anteriores.

| # | Camada | Tarefa | Detalhe |
|---|--------|--------|---------|
| 8.1 | ⚙️ | Testes unitários backend | Cálculos de saldo, regras de negócio |
| 8.2 | ⚙️ | Testes de integração | API ↔ Banco de dados |
| 8.3 | ⚙️ | Testes de segurança | Acesso cruzado entre usuários, rate limiting |
| 8.4 | 🎨 | QA visual | Responsividade, animações, glassmorphism |
| 8.5 | 🔗 | Teste de fluxo completo | Registro → Login → Transação → Dashboard → Meta → Cofrinho |
| 8.6 | 🗄️ | Configurar PostgreSQL produção | Neon ou Supabase |
| 8.7 | ⚙️ | Deploy backend | Railway ou Render (FastAPI + Uvicorn) |
| 8.8 | 🎨 | Deploy frontend | Build Vite → Static hosting |
| 8.9 | 🔗 | Configurar HTTPS + domínio | Certificado SSL |
| 8.10 | 🔗 | Teste em produção | Fluxo completo no ambiente de produção |

**✅ Fase 8 concluída quando:** FinTrack Premium no ar, testado e funcionando.

---

## 📊 Mapa de Dependências (V1)

```
FASE 1 (Setup)
  └── FASE 2 (Banco de Dados)
       └── FASE 3 (Autenticação)
            ├── FASE 4 (Transações + Cartões)
            │    ├── FASE 5 (Patrimônio)
            │    └── FASE 6 (Configurações)
            │         └── FASE 7 (Dashboard & Polish)
            │              └── FASE 8 (Testes & Deploy)
```
