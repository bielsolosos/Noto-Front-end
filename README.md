# 🎨 NOTO - Front-end

> **Interface moderna e intuitiva para o sistema de anotações NOTO** - Desenvolvido com Next.js, focado em experiência do usuário, performance e design responsivo.

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)

**Status: ✅ Versão 1.0 Completa e Pronta para Produção**

- 🔗 [Back-end do projeto](https://github.com/bielsolosos/Noto-Back-end)
- 🚀 [Demo ao vivo](https://noto-front-end.vercel.app)

## 🏗️ Arquitetura & Stack Tecnológica

### **Core Technologies**

- **Framework**: Next.js 14 com App Router
- **Linguagem**: TypeScript para type safety
- **Styling**: Tailwind CSS + Shadcn/ui
- **Icons**: Lucide React (vetoriais e modernos)
- **Forms**: React Hook Form + Zod validation
- **State**: React Context API + Custom Hooks

### **Estrutura de Projeto**

```
app/
├── 🏠 (root)/          # Landing page
├── 🔐 login/           # Autenticação
├── 📝 editor/          # Editor principal
├── ⚙️ settings/        # Configurações
└── 👑 admin/           # Painel administrativo

components/
├── 🎨 ui/              # Shadcn components
├── 🧱 layout/          # Layout components
├── 📄 notes/           # Editor & Viewer
├── 📱 pages/           # Page management
└── ⚙️ settings/        # User settings

contexts/
├── 🔐 AuthContext      # Autenticação
├── 📝 NotesContext     # Gerenciamento de notas
├── 🎨 ThemeContext     # Dark/Light mode
└── 📱 SidebarContext   # UI state
```

## 🎯 Funcionalidades V1.0

### **🌟 Landing Page Profissional**

- ✅ **Hero section** com gradientes e CTAs impactantes
- ✅ **Features showcase** destacando funcionalidades core
- ✅ **Demo interativo** com editor/preview em tempo real
- ✅ **Design responsivo** para mobile e desktop
- ✅ **Integração Discord** para contato e suporte

### **🔐 Sistema de Autenticação**

- ✅ **Login seguro** com validação robusta
- ✅ **Gestão de sessão** com tokens JWT
- ✅ **Proteção de rotas** automática
- ✅ **UX otimizada** com loading states
- ✅ **Toggle de senha** com ícones modernos

### **📝 Editor de Markdown Avançado**

- ✅ **Preview em tempo real** lado a lado
- ✅ **Atalhos de teclado** para produtividade:
  - `Ctrl+B` - Negrito
  - `Ctrl+I` - Itálico
  - `Ctrl+1-6` - Headers
  - `Enter` - Continuar listas
- ✅ **Formatação automática** de listas e citações
- ✅ **Preservação de scroll** durante edição
- ✅ **Syntax highlighting** para código

### **🖼️ Sistema de Mídia**

- ✅ **Modal de imagens** com fullscreen
- ✅ **Controles múltiplos** (ESC, click fora, botão X)
- ✅ **Otimização de imagens** automática
- ✅ **Responsividade** em todos os dispositivos

### **🎛️ Interface Inteligente**

- ✅ **Sidebar colapsável** (`Ctrl+B` para toggle)
- ✅ **Transições suaves** (300ms)
- ✅ **Estados de loading** em todas as ações
- ✅ **Feedback visual** para interações
- ✅ **Layout adaptável** (320px ↔ 64px)

### **🎨 Sistema de Temas**

- ✅ **Dark/Light mode** sincronizado
- ✅ **Persistência** entre sessões
- ✅ **Transições suaves** entre temas
- ✅ **CSS custom properties** para cores
- ✅ **Compatibilidade** com preferência do sistema

### **📱 Gestão de Páginas**

- ✅ **CRUD completo** de anotações
- ✅ **Lista organizada** na sidebar
- ✅ **Busca rápida** por título
- ✅ **Timestamps** automáticos
- ✅ **Sincronização** em tempo real

### **� Painel Administrativo**

- ✅ **Gestão de usuários** completa
- ✅ **Promoção/remoção** de privilégios
- ✅ **Interface dedicada** para admins
- ✅ **Proteção por roles** automática

## 🎨 Design System & UX

### **🎭 Identidade Visual**

- 🎨 **Consistência** com [bielsolososdev.space](https://bielsolososdev.space)
- 🌈 **Paleta harmoniosa** com primary/secondary colors
- ✨ **Gradientes sutis** e micro-interações
- 📱 **Mobile-first** design approach
- 🎯 **Acessibilidade** (WCAG guidelines)

### **🧩 Shadcn/ui Components**

- ✅ **Biblioteca completa** de componentes
- ✅ **Customização total** via CSS variables
- ✅ **Consistent styling** em toda aplicação
- ✅ **Performance otimizada** com tree-shaking
- ✅ **Manutenibilidade** alta

### **📱 Responsividade & Performance**

- ⚡ **Core Web Vitals** otimizados
- 📱 **Mobile responsivo** (320px+)
- 🖥️ **Desktop otimizado** (1920px+)
- ⚡ **Lazy loading** de componentes
- 🗜️ **Bundle otimizado** com Next.js

## 🚀 Performance & Otimizações

### **⚡ Core Web Vitals**

- 🟢 **LCP < 2.5s** - Loading otimizado
- 🟢 **FID < 100ms** - Interatividade rápida
- 🟢 **CLS < 0.1** - Layout estável
- 🟢 **FCP < 1.8s** - First paint rápido

### **🛠️ Otimizações Implementadas**

- ✅ **Code splitting** automático
- ✅ **Image optimization** com Next.js
- ✅ **Static generation** para landing page
- ✅ **Dynamic imports** para páginas pesadas
- ✅ **Service worker** para cache

## 🚦 Como Executar

### **Desenvolvimento Local**

```bash
# 1. Clone o repositório
git clone https://github.com/bielsolosos/Noto-Front-end.git

# 2. Instale dependências
npm install

# 3. Configure ambiente
cp .env.example .env.local

# 4. Configure API URL
NEXT_PUBLIC_API_URL=http://localhost:3000

# 5. Inicie desenvolvimento
npm run dev
```

### **Produção**

```bash
# Build para produção
npm run build

# Preview do build
npm run start

# Deploy na Vercel
vercel --prod
```

## 📊 Estado do Projeto

**✅ VERSÃO 1.0 - INTERFACE COMPLETA E POLIDA**

- ✅ Todas as telas implementadas e funcionais
- ✅ UX/UI profissional e intuitiva
- ✅ Performance otimizada para produção
- ✅ Responsividade em todos os dispositivos
- ✅ Acessibilidade implementada

### **🔮 Roadmap V2.0**

- 🔍 **Busca avançada** com filtros
- 📊 **Dashboard analytics** pessoal
- 🎨 **Temas customizáveis** pelo usuário
- 📤 **Export/Import** de anotações
- 🔗 **Compartilhamento** de páginas públicas
- 📱 **PWA** com funcionamento offline

## 🛠️ Tecnologias & Ferramentas

### **Desenvolvimento**

- 📝 **ESLint + Prettier** para qualidade
- 🧪 **Jest + Testing Library** para testes
- 🔍 **TypeScript strict mode** ativado
- 📊 **Bundle analyzer** para otimização
- 🔄 **Husky** para pre-commit hooks

### **Deploy & CI/CD**

- 🚀 **Vercel** para deploy automático
- 🔄 **GitHub Actions** para CI/CD
- 📊 **Vercel Analytics** para métricas
- 🐛 **Error tracking** integrado
- 📈 **Performance monitoring**

### **Dependências Principais**

```json
{
  "next": "^14.0.0",
  "react": "^18.0.0",
  "typescript": "^5.0.0",
  "tailwindcss": "^3.3.0",
  "lucide-react": "^0.400.0",
  "react-hook-form": "^7.45.0",
  "zod": "^3.22.0"
}
```

## 🤝 Contribuições & Contato

O projeto está **maduro e pronto para produção**. Contribuições são bem-vindas em:

- 🎨 **Melhorias de UI/UX** e acessibilidade
- ⚡ **Otimizações de performance**
- 🧪 **Testes automatizados** adicionais
- 🌐 **Internacionalização** (i18n)
- 📱 **Features mobile** específicas

### **Integração com Back-end**

- 🔗 **API REST** totalmente integrada
- 🔐 **Autenticação JWT** sincronizada
- � **CRUD completo** de páginas
- 👥 **Gestão de usuários** implementada
- 🛡️ **Validação** client + server side

---

**🎯 NOTO V1.0 - Interface de Produção Completa**

Criado com ❤️ por **[bielsolosos](https://discord.com/users/bielsolosos)**

📧 **Contato**: Discord para dúvidas e colaborações
