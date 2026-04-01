# 💻 Stack Técnica — FinTrack Premium

| Camada | Tecnologia | Motivo |
|--------|-----------|--------|
| Frontend | React + Vite + TypeScript | Rápido, moderno, tipado |
| Backend | Python 3.12+ + FastAPI | Alta performance, tipagem forte, ecossistema de IA |
| Gráficos | Recharts | Leve, declarativo, feito para React |
| Auth | Passlib (bcrypt) + PyJWT | Seguro e escalável para múltiplos usuários |
| Banco de Dados | **PostgreSQL via SQLModel** | Escolha definitiva para produção e desenvolvimento |
| Mobile (futuro) | Capacitor (PWA → App nativo) | Reutiliza 100% do código React |

> ⚠️ **JSON local foi removido da stack.** Não suporta múltiplos usuários e corrompe dados sob concorrência. Use SQLite apenas em desenvolvimento local. **PostgreSQL é o banco de produção.**

### 🗃️ Por que PostgreSQL?

PostgreSQL é o banco preferido para dados financeiros estruturados em 2025 — e a escolha certa para o FinTrack pelos seguintes motivos:

| Critério | PostgreSQL | SQLite | MongoDB |
|----------|-----------|--------|---------|
| **ACID compliance** | ✅ Total | ✅ Parcial | ⚠️ Eventual |
| **Múltiplos usuários simultâneos** | ✅ Excelente | ❌ Problemático | ✅ Bom |
| **Transações financeiras** | ✅ Nativo | ⚠️ Limitado | ❌ Não ideal |
| **Integridade referencial** | ✅ Foreign keys completas | ✅ Limitada | ❌ Não tem |
| **Escalabilidade** | ✅ Vertical + horizontal | ❌ Arquivo único | ✅ Horizontal |
| **Suporte com SQLModel** | ✅ Primeira classe | ✅ Bom | ✅ N/A |
| **Managed cloud (gratuito/barato)** | ✅ Neon, Supabase, Railway | ❌ N/A | ⚠️ Atlas |

**Serviços recomendados para hospedar o PostgreSQL:**

| Serviço | Plano grátis | Indicado para |
|---------|-------------|---------------|
| **Neon** | Sim (0.5 GB) | Desenvolvimento e MVP |
| **Supabase** | Sim (500 MB) | MVP com painel visual incluído |
| **Railway** | Não (pago desde o início) | Produção simples e barata |
| **Render** | Sim (90 dias, depois pago) | Produção com deploy integrado |

> **Recomendação de caminho:** Neon (dev/MVP gratuito) → Railway ou Render (produção paga)
