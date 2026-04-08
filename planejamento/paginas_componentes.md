# 🛠️ Páginas & Componentes — FinTrack Premium

### 0. 🔐 Autenticação (Login & Registro)

**Login:**
- Logo centralizada (`FinTrack Premium`)
- Campos com efeito Glassmorphism: Usuário + Senha
- Checkbox "Lembrar-me" (JWT com expiração de 7 dias)
- Botão "Entrar" com estado de loading
- Erro: shake animation + mensagem "Usuário ou senha incorretos"

**Registro:**
- Link "Criar Conta" abaixo do formulário de login
- Campos: Nome, Usuário, Senha, Confirmar Senha
- Validação inline (senhas não coincidem, campo vazio)
- Ao criar conta: redireciona direto para o Dashboard

**Armazenamento:** Senhas em hash bcrypt + token JWT. Em produção usar banco de dados (PostgreSQL), não JSON.

---

### 1. 🏠 Dashboard

*Primeira impressão "Premium" — visão geral e ação rápida.*

**Layout:**
- **Desktop:** Sidebar fixa à esquerda com ícones + labels
- **Mobile:** Bottom Navigation Bar fixa com os mesmos 4 ícones

**Cards de Resumo (topo, 4 cards em grid):**

| Card | Fórmula |
|------|---------|
| **Saldo Real** | Entradas − Gastos Fixos − Gastos Variáveis |
| **Saldo Disponível** | Saldo Real − média de gastos variáveis históricos |
| **Entradas do Mês** | Soma de todas as transações do tipo `entrada` no mês atual |
| **Patrimônio Total** | Soma de todos os investimentos + todos os cofrinhos + todas as reservas SOS |

**Gráfico de Fluxo (Recharts):**
- Tipo: `AreaChart` com duas áreas (Entradas vs Saídas)
- Período: últimos 6 meses
- Eixo Y formatado em BRL

**Ações Rápidas:**
- Botão flutuante `+` (FAB) abre modal de nova transação em 2 cliques
- Painel de Insights: frases automáticas baseadas nos dados do mês

---

### 2. 📑 Transações

*Foco em agilidade no registro e clareza no histórico.*

**Filtros:**
- Busca por texto (nome/descrição)
- Filtro por categoria (dropdown com os 12 ícones)
- Filtro por cartão (apelidos cadastrados)
- Filtro por período (mês atual por padrão)

**Lista de Atividade:**
- Cada linha: emoji da categoria + nome + cartão/método + valor (verde/vermelho) + data
- Swipe para deletar (mobile) | botão de lixeira (desktop)

**Categorias Padrão (12):**
🏠 Moradia | 🚗 Transporte | 🛒 Mercado | 🍔 Alimentação | 💊 Saúde | 🎉 Lazer | 📚 Educação | 👕 Vestuário | 💡 Contas | 🐾 Pets | 🎁 Presentes | 📦 Outros

**Modal de Nova Transação:**
1. Tipo: Entrada ou Saída
2. Valor + Descrição + Categoria
3. Método de pagamento: PIX | Débito | Crédito
4. *Se Débito ou Crédito:* seletor de cartão (apelidos do settings) — **obrigatório**
5. Checkbox "Gasto Fixo?" → provisiona automaticamente nos meses seguintes

---

### 3. 📈 Investimentos & Cofrinho

*Gestão de patrimônio e metas de vida.*

**Seletor de Aba:** "Investimentos" | "Meus Sonhos" | "Reserva SOS"

**Aba Investimentos:**
- Card de Patrimônio Total no topo
- Lista: Nome | Tipo (CDB / Ações / Tesouro / FII / Outros) | Valor Aplicado | Rendimento (%)
- Botão "+ Novo Investimento"

**Aba Metas (Cofrinho):**
- Cards por meta: título + emoji + barra de progresso com glow + valor atual / valor alvo
- Texto dinâmico: *"Faltam R$ X — aprox. Y meses no ritmo atual"*
- Botões: **Depositar** e **Retirar** em cada card
- Animação de moeda ao depositar | Confetes ao completar

**Aba Reserva SOS (Fôlego):**
- Grid de subcategorias: Saúde | Carro | Acidentes | Outros
- Cada subcategoria tem saldo individual
- Card de Sobrevivência: `Reserva Total ÷ Média de Gastos Mensais = X meses`
- Ao retirar: sistema pergunta *"Deseja repor essa reserva com prioridade no próximo mês?"*

---

### ⚙️ Configurações

**👤 Perfil:** Nome, avatar (upload), salário mensal, moeda preferida (BRL por padrão)

**💳 Meus Cartões:** Apelidos apenas (ex: "Nubank", "Inter", "C6") — sem dados reais. Usado para identificar origem dos gastos.

**🔔 Assinaturas Recorrentes:** Nome | Valor | Dia de cobrança | Categoria. Gera alerta automático antes do vencimento.

**✉️ Limites de Envelopes:** Valor máximo por categoria. Alertas em 50%, 80% e 100%.

**📁 Backup:** Exportar todos os dados como `.json` | Importar para restaurar.

**🔒 Segurança:** Alterar senha | Ver sessões ativas | Revogar token
