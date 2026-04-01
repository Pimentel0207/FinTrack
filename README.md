# 🏦 FinTrack Premium — Smart Finance Dashboard

[![React](https://img.shields.io/badge/Frontend-React%2019-blue?logo=react)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-green?logo=fastapi)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue?logo=postgresql)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**FinTrack Premium** é uma aplicação de controle financeiro pessoal de alto nível, projetada com uma estética moderna (Glassmorphism) e tecnologias de ponta. O sistema oferece uma gestão completa de patrimônio, desde o controle de gastos diários até o acompanhamento de investimentos e metas de longo prazo.

---

## 🚀 Funcionalidades Principais

| Módulo | Descrição |
|---|---|
| **📊 Dashboard Dinâmico** | Visão agregada de saldo, entradas, saídas e evolução patrimonial com gráficos interativos. |
| **💳 Gestão de Transações** | Controle rigoroso de movimentações fixas e variáveis, com suporte a múltiplos cartões. |
| **📈 Carteira de Investimentos** | Acompanhamento de aportes, rendimentos e diversificação de ativos. |
| **🛡️ Reserva SOS** | Cálculo automático de sobrevivência financeira e gestão de fundo de emergência. |
| **🎯 Metas (Cofrinhos)** | Gestão de sonhos e objetivos com barra de progresso e estimativas de conclusão. |
| **✉️ Método dos Envelopes** | Limites por categoria de gasto para manter a disciplina orçamentária. |

---

## 🛠️ Stack Técnica

### **Frontend**
- **React 19 + Vite** (TypeScript)
- **Design:** Vanilla CSS / Design Tokens (Glassmorphism)
- **Animações:** Framer Motion / Lottie Files
- **Gráficos:** Recharts

### **Backend**
- **Python + FastAPI**
- **ORM:** SQLModel (SQLAlchemy + Pydantic)
- **Segurança:** Autenticação JWT (OAuth2) + Bcrypt
- **Migrações:** Alembic

### **Infraestrutura/Mobile**
- **Banco de Dados:** PostgreSQL
- **Mobile:** Capacitor (iOS/Android)
- **Iniciação Unificada:** Script `start.py` para rodar Fullstack

---

## 📂 Estrutura do Projeto

```bash
/
├── frontend/        # Aplicação React (Interface Premium)
├── backend/         # API FastAPI (Regras de Negócio)
├── planejamento/    # Documentação Modular (Arquitetura e Requisitos)
├── start.py         # Script de inicialização unificada
├── .env.example     # Modelo de variáveis de ambiente
└── README.md        # Documentação principal (Você está aqui)
```

---

## 📈 Roadmap de Desenvolvimento

O projeto está sendo construído em **7 fases estratégicas**:

1.  **Fase 1: Alicerce** — Setup de ambiente e infraestrutura. 🟢
2.  **Fase 2: Banco de Dados** — Modelagem e persistência. 🟢
3.  **Fase 3: Autenticação** — Sistema de login e segurança. 🔄
4.  **Fase 4: Core Financeiro** — Transações e Cartões. ⏳
5.  **Fase 5: Patrimônio** — Investimentos e Metas. ⏳
6.  **Fase 6: Configurações** — Perfil e Envelopes. ⏳
7.  **Fase 7: Dashboard & Polish** — Visual Premium final e animações. ⏳

---

## ⚙️ Como executar

Certifique-se de ter o **Python 3.10+** e **Node.js 18+** instalados.

1. **Instale as dependências:**
   ```bash
   # Backend
   cd backend && python -m venv venv && source venv/bin/activate
   pip install -r requirements.txt

   # Frontend
   cd ../frontend && npm install
   ```

2. **Inicie o sistema completo:**
   Na raiz do projeto, execute:
   ```bash
   python start.py
   ```
   *O backend subirá na porta 8000 e o frontend na 5173.*

---

## 🎨 Design Visual (Design Tokens)
O **FinTrack** utiliza uma paleta de cores sofisticada e efeitos de transparência (Blur/Glassmorphism) para proporcionar uma experiência de "Private Banking" premium ao usuário final.

- **Tema:** Dark mode nativo com acentos em dourado e cores pastel.
- **Micro-interações:** Feedback táctil visual e transições suaves entre telas.

---
*Documento gerado como parte do planejamento estratégico do FinTrack Premium.*