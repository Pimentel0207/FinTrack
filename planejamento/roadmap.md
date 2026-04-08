# 📈 Roadmap de Implementação — FinTrack Premium

> Legenda: `[ ]` pendente | `[x]` concluído | `[-]` em andamento

### Fase 1 — Fundação & Setup
- [ ] Criação da estrutura de pastas (`frontend`, `backend`, `mobile`)
- [ ] Setup do Backend: Python 3.12 + FastAPI + SQLModel
- [ ] Backend: configuração inicial do Banco PostgreSQL (Alembic)
- [ ] Frontend: React + Vite + TypeScript inicializado

### Fase 2 — Design System & Layout
- [ ] Design Tokens implementados no CSS (`index.css`)
- [ ] Glassmorphism, fontes (Outfit + Inter) e animações base
- [ ] Layout Global: Sidebar Desktop + Bottom Nav Mobile
- [ ] Componentes base: Card, Button, Modal, Input, Badge

### Fase 3 — Autenticação & Perfil
- [ ] Tela de Login (shake error, lembrar-me, loading state)
- [ ] Tela de Registro (validação inline)
- [ ] JWT middleware no backend
- [ ] Página de Configurações completa (Perfil, Cartões, Assinaturas, Envelopes, Backup, Segurança)

### Fase 4 — Transações & Fluxo de Caixa
- [ ] CRUD completo de Transações
- [ ] Seletor de método (PIX / Débito / Crédito) com lógica condicional de cartão
- [ ] Checkbox "Gasto Fixo" com provisionamento automático
- [ ] Filtros inteligentes (nome, categoria, cartão, período)
- [ ] 12 categorias com emojis e cores

### Fase 5 — Investimentos, Cofrinho & SOS
- [ ] CRUD de Investimentos
- [ ] CRUD de Metas (Cofrinho) com barra de progresso e projeção
- [ ] Botões Depositar/Retirar com animações
- [ ] Área de Reserva SOS com cálculo de sobrevivência

### Fase 6 — Dashboard & Features Premium
- [ ] Cards de Resumo com fórmulas corretas
- [ ] Gráfico de Fluxo com Recharts (6 meses)
- [ ] Botão flutuante "+" para transação rápida
- [ ] Alertas visuais do método dos envelopes
- [ ] Alertas de assinaturas recorrentes próximas do vencimento
- [ ] Exportar/Importar backup JSON
- [ ] Animação de confetes ao completar meta

### Fase 7 — QA & Entrega
- [ ] Testes unitários: cálculos de Fôlego, Envelopes e Projeções
- [ ] Testes de integração: Frontend ↔ Backend ↔ PostgreSQL
- [ ] QA Visual: responsividade mobile, micro-animações, glassmorphism
- [ ] Revisão detalhada da documentação modular
