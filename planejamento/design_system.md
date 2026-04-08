# 🎨 Design System — FinTrack Premium

### 🏗️ Arquitetura: CSS Monolítico (`index.css`)

Todo o design do FinTrack vive em **um único arquivo CSS**: `frontend/src/styles/index.css`. Isso significa que para alterar qualquer cor, fonte ou espaçamento do app inteiro, você muda **em um lugar só**.

**Por que um único arquivo?**
- **Uma mudança, efeito global:** alterou `--accent` de azul para roxo? Todo botão, link e ícone ativo do app muda automaticamente.
- **Sem caça ao tesouro:** não precisa procurar em 20 arquivos `.css` onde uma cor está definida.
- **CSS Variables (`:root`):** todos os tokens de cor, fonte e espaçamento são variáveis CSS. Os componentes nunca usam valores fixos (`#2563eb`), sempre usam variáveis (`var(--accent)`).
- **Dark/Light mode:** basta trocar as variáveis dentro de `[data-theme="light"]` — zero duplicação de código.

**Regra de ouro:**
> ❌ Nunca usar cor fixa nos componentes: `color: #2563eb`
> ✅ Sempre usar variável: `color: var(--accent)`

---

### Paleta de Cores

> Paleta definida para produto de mercado — público geral (18–45 anos), estilo fintech moderno. Accent azul elétrico transmite confiança e tecnologia sem depender de convenções de banco tradicional. Suporta dark mode (principal) e light mode (opcional).

#### Dark Mode

| Token | Nome | HEX | Uso |
|-------|------|-----|-----|
| `--bg-deep` | Deep Space | `#0d1117` | Fundo principal da página |
| `--bg-surface` | Surface | `#161b26` | Fundo de seções e layouts |
| `--bg-card` | Card | `#1e2535` | Cards e painéis |
| `--bg-elevated` | Elevated | `#252d3d` | Modais, dropdowns, tooltips |
| `--accent` | Azul Elétrico | `#2563eb` | CTAs, botões primários, links ativos |
| `--accent-light` | Azul Claro | `#3b82f6` | Hover states, ícones ativos |
| `--accent-dark` | Azul Escuro | `#1d4ed8` | Pressed states, bordas de foco |
| `--accent-glow` | Blue Glow | `rgba(59,130,246,0.2)` | Sombras e efeitos glow |
| `--success` | Verde | `#22c55e` | Receitas, valores positivos, metas concluídas |
| `--danger` | Coral | `#f87171` | Despesas, erros, alertas críticos |
| `--warning` | Laranja | `#fb923c` | Envelope em 80%, avisos moderados |
| `--info` | Azul Info | `#60a5fa` | Notificações neutras, backups, sessão |
| `--glass-bg` | Glass | `rgba(255,255,255,0.05)` | Fundos translúcidos (glassmorphism) |
| `--glass-border` | Glass Border | `rgba(255,255,255,0.08)` | Bordas de cards glassmorphism |
| `--text-primary` | Branco Suave | `#f1f5f9` | Texto principal |
| `--text-secondary` | Cinza Claro | `#cbd5e1` | Texto secundário, subtítulos |
| `--text-muted` | Cinza | `#64748b` | Labels, placeholders, metadados |

#### Light Mode

| Token | HEX | Uso |
|-------|-----|-----|
| `--bg-deep` | `#f8fafc` | Fundo principal |
| `--bg-surface` | `#f1f5f9` | Fundo de seções |
| `--bg-card` | `#ffffff` | Cards e painéis |
| `--bg-elevated` | `#ffffff` | Modais, dropdowns |
| `--accent` | `#2563eb` | Igual ao dark — mesma cor |
| `--success` | `#16a34a` | Verde mais saturado para fundo claro |
| `--danger` | `#dc2626` | Vermelho mais saturado |
| `--warning` | `#c2410c` | Laranja mais saturado |
| `--info` | `#1d4ed8` | Azul mais saturado |
| `--glass-border` | `#e2e8f0` | Bordas de cards no light mode |
| `--text-primary` | `#0f172a` | Texto principal escuro |
| `--text-secondary` | `#475569` | Texto secundário |
| `--text-muted` | `#94a3b8` | Labels e placeholders |

### Tipografia

- **Headlines:** `Outfit`, peso 700, `letter-spacing: -0.02em`
- **UI / Body:** `Inter`, peso 400 e 600
- **Tamanhos:** H1: `2rem` | H2: `1.5rem` | H3: `1.25rem` | Body: `1rem` | Small: `0.875rem`

### Espaçamentos & Formas

- **Border Radius:** Cards: `24px` | Botões: `12px` | Inputs: `8px`
- **Padding:** Cards: `2rem` | Seções: `1.5rem`
- **Gap:** Grid: `1.5rem` | Listas: `0.75rem`
- **Glassmorphism:** `backdrop-filter: blur(12px)` + `--glass-bg` + borda `--glass-border`

### Micro-interações

| Elemento | Animação |
|----------|----------|
| Cards (hover) | `translateY(-5px)` + sombra expandida com `--accent-glow` |
| Botão "Entrar" (loading) | Spinner + texto "Entrando..." |
| Erro de Login | `shake` animation de 300ms no card |
| Depósito no Cofrinho | Animação de moeda caindo (Lottie) |
| Meta 100% concluída | Confetes via canvas |
| Envelope 80% atingido | Card muda para `--warning` com pulso suave |
