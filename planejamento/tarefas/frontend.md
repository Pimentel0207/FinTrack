# 🎨 Frontend — O Que Vai Ser Feito

> Tudo que roda **no navegador do usuário** — React + Vite + TypeScript.

---

## 📦 Setup Inicial
- [ ] Inicializar projeto com Vite + React + TypeScript (`npm create vite@latest`)
- [ ] Instalar dependências: `react-router-dom`, `axios`, `recharts`
- [ ] Configurar Google Fonts: `Outfit` (headlines) + `Inter` (body)
- [ ] Criar `index.css` com todos os Design Tokens (cores, espaçamentos, glassmorphism)

---

## 🧩 Componentes Reutilizáveis
| Componente | Descrição |
|------------|-----------|
| `<Card>` | Container glassmorphism com hover animation |
| `<Button>` | Primário, secundário, danger — com loading state |
| `<Modal>` | Overlay com animação de entrada — vira Bottom Sheet no mobile |
| `<Input>` | Campo com label flutuante, validação inline e estado de erro |
| `<Badge>` | Etiqueta colorida para categorias e status |
| `<Sidebar>` | Navegação lateral fixa (desktop) |
| `<BottomNav>` | Barra inferior fixa (mobile) |
| `<FAB>` | Botão flutuante "+" para ação rápida |
| `<Toast>` | Notificação temporária de sucesso/erro |
| `<ProgressBar>` | Barra de progresso com glow para metas |
| `<Chart>` | Wrapper do Recharts para AreaChart de fluxo |

---

## 📄 Páginas

### 🔐 Login & Registro
- Formulário glassmorphism centralizado
- Shake animation no erro
- Spinner no botão "Entrar"
- Validação inline no registro (senhas não coincidem, campos vazios)
- Redirecionamento automático após login/registro

### 🏠 Dashboard
- 4 cards de resumo no topo (Saldo Real, Disponível, Entradas, Patrimônio)
- Gráfico AreaChart (Recharts) — Entradas vs Saídas (6 meses)
- Botão FAB "+" para nova transação rápida

### 📑 Transações
- Lista com emoji + nome + método + valor + data
- Filtros: busca por texto, categoria, cartão, período
- Modal de nova transação com seleção condicional de cartão
- Swipe-to-delete no mobile

### 📈 Investimentos & Cofrinho
- 3 abas: Investimentos | Meus Sonhos | Reserva SOS
- Cards com barra de progresso e projeção de tempo
- Botões Depositar/Retirar com animação de moeda
- Confetes ao completar meta (canvas)

### ⚙️ Configurações
- Perfil (nome, avatar, salário, moeda)
- Cartões (apelidos)
- Assinaturas recorrentes
- Limites de envelopes
- Backup (exportar/importar JSON)
- Segurança (alterar senha, sessões ativas)

---

## 🔗 Comunicação com o Backend (Services)
| Arquivo | Responsabilidade |
|---------|-----------------|
| `api.ts` | Instância Axios com base URL e interceptor de token |
| `authService.ts` | Login, registro, logout, refresh token |
| `transactionService.ts` | CRUD de transações |
| `investmentService.ts` | CRUD de investimentos |
| `goalService.ts` | CRUD de metas + depósito/retirada |
| `cardService.ts` | CRUD de cartões |
| `subscriptionService.ts` | CRUD de assinaturas |
| `envelopeService.ts` | CRUD de envelopes |
| `profileService.ts` | GET/PUT/PATCH do perfil |
| `dashboardService.ts` | Summary + Chart |

---

## 🧠 Estado Global (Contexts)
| Context | Dados gerenciados |
|---------|------------------|
| `AuthContext` | Usuário logado, token JWT, login/logout |
| `ThemeContext` | Dark mode / Light mode |

---

## 📱 Responsividade
- **Desktop (>1024px):** Sidebar fixa + grid de cards
- **Tablet (768–1024px):** Sidebar colapsada + grid ajustado
- **Mobile (<768px):** Bottom Nav + modais viram Bottom Sheets + FAB reposicionado
- Safe areas para iOS (notch) e Android (barra de gestos)
