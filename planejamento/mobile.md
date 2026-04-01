# 📱 Estratégia Mobile — FinTrack Premium

### 📌 Decisão: Capacitor (escolha definitiva)

O projeto usará **Capacitor** para transformar o app web em app nativo para iOS e Android.

**Por que Capacitor e não React Native:**

| Critério | Capacitor | React Native |
|----------|-----------|-------------|
| Reaproveitamento de código | ~95% do frontend React existente | ~10% — precisa reescrever tudo com primitivas nativas |
| Curva de aprendizado | Baixa — é o mesmo React + HTML/CSS | Alta — novo paradigma de componentes |
| Performance | Boa para apps de dados/formulários | Excelente para animações pesadas e jogos |
| Acesso a APIs nativas | Via plugins oficiais (câmera, push, biometria) | Direto, mais flexível |
| Velocidade de lançamento | Muito rápida | Lenta (reescrita completa) |
| Adequação ao FinTrack | ✅ App financeiro, não precisa de 60fps em animações | Overkill para este caso de uso |

> **Conclusão:** Para um app financeiro com foco em formulários, listas e gráficos, Capacitor entrega 95% da experiência nativa com 10% do esforço. React Native só valeria se o app fosse muito animation-heavy ou exigisse acesso nativo profundo (ex: integração bancária via SDK).

---

### 📂 Estrutura de Pastas Mobile

```
/mobile/
├── android/                    # Projeto Android nativo (gerado pelo Capacitor)
├── ios/                        # Projeto iOS nativo (gerado pelo Capacitor)
├── capacitor.config.ts         # Configuração do Capacitor (appId, appName, server)
└── package.json                # Dependências mobile (plugins Capacitor)
```

> O código-fonte do app continua em `/frontend/src/`. O Capacitor empacota o build do Vite dentro do app nativo. Não há código duplicado.

**Fluxo de build:**
```
npm run build (frontend) → Capacitor copia o /dist → npx cap sync → Xcode / Android Studio
```

---

### 📐 UX Específica Mobile

#### Layout & Navegação
- **Bottom Navigation Bar** fixa com 4 abas: Dashboard | Transações | Investimentos | Configurações
- **Safe Areas:** respeitar `env(safe-area-inset-*)` para notch do iOS e barra de gestos do Android
- **Teclado virtual:** inputs financeiros (valores) abrem teclado numérico (`inputmode="decimal"`)
- **Scroll:** listas longas usam scroll nativo sem `overflow: hidden` no body
- **Header mobile:** título da página + botão de ação no canto direito (sem sidebar)

#### Gestos
| Gesto | Ação |
|-------|------|
| Swipe left em transação | Revelar botão "Deletar" |
| Pull-to-refresh | Recarregar dados do Dashboard |
| Long press em card de meta | Abrir opções (Editar / Arquivar) |
| Swipe down em modal | Fechar modal (bottom sheet) |

#### Componentes adaptados para mobile
- **Modais** viram **Bottom Sheets** — sobem da parte de baixo, mais natural no mobile
- **Dropdowns** viram **Action Sheets** nativos (via plugin Capacitor)
- **Toasts** aparecem no topo (não no canto inferior direito como no desktop)
- **FAB "+"** muda de posição: `bottom: 80px` para não sobrepor a Bottom Nav Bar

---

### 🔔 Funcionalidades Exclusivas Mobile

#### Push Notifications (via `@capacitor/push-notifications`)
| Gatilho | Mensagem |
|---------|----------|
| Assinatura vence em 3 dias | "Netflix vence em 3 dias — R$ 55,90" |
| Envelope atinge 80% | "Alimentação: 80% do limite atingido" |
| Meta do cofrinho concluída | "🎉 Meta Viagem concluída! Parabéns!" |
| Boleto (V3 IA) detectado | "Boleto de R$ 215 vence em 2 dias" |

#### Biometria no Login (via `@capacitor/biometrics`)
- Face ID (iOS) e impressão digital (Android) como alternativa à senha
- Ativado opcionalmente nas configurações de segurança
- Token JWT armazenado de forma segura no Keychain (iOS) / Keystore (Android)

#### Câmera para OCR (V3 — via `@capacitor/camera`)
- Botão de câmera no modal de nova transação
- Abre câmera nativa para foto de comprovante/boleto
- Envia imagem para o pipeline de IA (`POST /ai/upload`)

#### Modo Offline (V2 Mobile)
- Transações criadas offline ficam em fila local (IndexedDB)
- Sincronização automática ao reconectar
- Indicador visual de "modo offline" no header

---

### 📦 Plugins Capacitor Necessários

| Plugin | Funcionalidade | Versão |
|--------|---------------|--------|
| `@capacitor/app` | Gerenciamento do ciclo de vida do app | Core |
| `@capacitor/push-notifications` | Notificações push | V2 |
| `@capacitor/biometrics` | Face ID / impressão digital | V2 |
| `@capacitor/camera` | Câmera para OCR | V3 |
| `@capacitor/haptics` | Feedback tátil em ações importantes | V1 |
| `@capacitor/status-bar` | Controle da status bar (cor, estilo) | V1 |
| `@capacitor/keyboard` | Evitar que o teclado sobreponha inputs | V1 |
| `@capacitor/network` | Detectar estado da conexão (offline mode) | V2 |

---

### 📱 Especificações Técnicas

| Item | Valor |
|------|-------|
| App ID (iOS/Android) | `com.fintrack.app` |
| Nome do app | `FinTrack` |
| Versão mínima iOS | 14.0 |
| Versão mínima Android | API 26 (Android 8.0) |
| Orientação | Portrait only (bloqueado) |
| Splash Screen | Dark (`#0d1117`) com logo centralizada |
| Ícone | Versões: 1024×1024 (iOS) e 512×512 (Android) |

---

### 🚀 Roadmap Mobile

#### Fase Mobile 1 — Setup & Paridade Web
- [ ] Instalar e configurar Capacitor no projeto
- [ ] Configurar `capacitor.config.ts` com appId e server URL
- [ ] Gerar projetos Android e iOS (`npx cap add android && npx cap add ios`)
- [ ] Ajustar safe areas, Bottom Nav Bar e scroll nativo
- [ ] Adaptar modais para Bottom Sheets
- [ ] Configurar `@capacitor/status-bar` e `@capacitor/keyboard`
- [ ] Testar build completo no emulador Android e iOS
- [ ] Publicar versão beta (TestFlight + Firebase App Distribution)

#### Fase Mobile 2 — Features Nativas
- [ ] Push notifications (assinaturas, envelopes, metas)
- [ ] Login biométrico (Face ID / impressão digital)
- [ ] Modo offline com sincronização automática
- [ ] Feedback tátil (haptics) em ações de depósito, exclusão e conclusão de meta

#### Fase Mobile 3 — IA & Câmera (junto com V3)
- [ ] Integração da câmera nativa para OCR
- [ ] Permissões de câmera no `Info.plist` (iOS) e `AndroidManifest.xml`
- [ ] Fluxo completo: foto → OCR → modal de confirmação da transação

---

### ⚠️ Pontos de Atenção

- **Glassmorphism no mobile:** `backdrop-filter: blur()` tem performance variável em Android. Testar em dispositivos reais e ter fallback com `--bg-card` sólido se necessário.
- **Fontes:** Outfit e Inter precisam ser incluídas no bundle (`/frontend/src/assets/fonts/`) — não depender de CDN no app nativo (funciona offline).
- **App Store / Play Store:** exige política de privacidade e termos de uso publicados antes do review. Planejar com antecedência.
