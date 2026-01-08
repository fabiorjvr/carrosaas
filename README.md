# 🚗 CarroClaude SaaS - Plataforma Premium de Gestão Automotiva

> **Repositório Oficial:** [github.com/fabiorjvr/carrosaas](https://github.com/fabiorjvr/carrosaas)  
> **Desenvolvedor:** Fabio (fabiorjvr@gmail.com)

![Status](https://img.shields.io/badge/Status-Em_Desenvolvimento-yellow)
![Tech](https://img.shields.io/badge/Stack-Next.js_14_|_Supabase_|_TypeScript-blue)
![Security](https://img.shields.io/badge/Security-Enterprise_Grade-green)

O **CarroClaude** não é apenas um sistema de cadastro; é um **Ecossistema SaaS (Software as a Service)** completo projetado para revolucionar a gestão de oficinas mecânicas no Brasil. Combinamos design de alta fidelidade ("Dark Premium Automotive"), inteligência artificial e automação para entregar uma experiência de uso superior.

---

## 🎯 Objetivos do Projeto

1.  **Profissionalização do Setor:** Substituir o "caderninho" e planilhas complexas por uma interface intuitiva e visualmente impactante.
2.  **Centralização:** Unificar gestão de clientes, ordens de serviço, financeiro e comunicação (WhatsApp) em uma única tela.
3.  **Escalabilidade:** Permitir que o gestor do SaaS (Admin) gerencie milhares de oficinas (Tenants) com facilidade.
4.  **Segurança e Auditoria:** Garantir que os dados de cada oficina sejam isolados e seguros, com logs detalhados de todas as ações.

---

## 💎 Diferenciais Competitivos

*   **🎨 Design "Dark Premium":** Interface inspirada em cockpits de carros de luxo, utilizando Glassmorphism, Framer Motion e modelos 3D interativos. Foge do padrão "sistema administrativo cinza e chato".
*   **👁️ "God Mode" (Painel Admin):** O dono do SaaS possui superpoderes. Ele pode ver métricas globais em tempo real, monitorar o banco de dados via terminal simulado e **"impersonar" (logar como)** qualquer cliente para prestar suporte imediato.
*   **🔐 Segurança Híbrida:** Utiliza autenticação robusta com JWT e proteção a nível de banco de dados (RLS - Row Level Security) do Supabase.
*   **📱 Automação de WhatsApp (Roadmap):** O sistema não apenas guarda dados, ele *age* sobre eles, enviando lembretes de revisão automaticamente.

---

## 🏗️ Arquitetura e Tecnologias

O projeto foi construído sobre uma stack moderna e performática:

*   **Frontend:** [Next.js 14](https://nextjs.org/) (App Router) + [React](https://react.dev/)
*   **Linguagem:** [TypeScript](https://www.typescriptlang.org/) (Tipagem estrita para segurança de código)
*   **Estilização:** [Tailwind CSS](https://tailwindcss.com/) + Framer Motion (Animações fluidas)
*   **Backend & Database:** [Supabase](https://supabase.com/) (PostgreSQL + Auth + Realtime)
*   **3D Rendering:** React Three Fiber (Showroom virtual na Landing Page)
*   **Ícones:** Lucide React

### 🛡️ Segurança Implementada

1.  **Autenticação JWT:** Tokens seguros armazenados em Cookies HTTP-only.
2.  **Bcrypt Hashing:** As senhas nunca são salvas em texto puro. Utilizamos `bcryptjs` com salt rounds configurados.
3.  **Redirecionamento Inteligente:** O sistema detecta o tipo de usuário (Admin vs Oficina) no login e direciona para o ambiente correto, bloqueando acesso cruzado.
4.  **Isolamento de Dados:** Cada consulta ao banco de dados no Dashboard da Oficina filtra estritamente pelo `oficina_id`, impedindo que a Oficina A veja dados da Oficina B.

---

## 📂 Estrutura do Projeto

A organização de pastas segue as melhores práticas do Next.js App Router:

```bash
carroclaude/
├── app/                        # Rotas e Páginas da Aplicação
│   ├── admin/                  # Área Restrita do Dono do SaaS
│   │   └── dashboard/          # "God Mode" (Logs, Métricas Globais, Impersonate)
│   ├── api/                    # Backend Serverless (Next.js API Routes)
│   │   ├── admin/              # Endpoints administrativos (Stats, Logs, Impersonate)
│   │   └── auth/               # Endpoints de Autenticação (Login, Register)
│   ├── dashboard/              # Área Operacional da Oficina (Cliente Final)
│   ├── login/                  # Página de Login Unificada
│   ├── register/               # Página de Cadastro de Novas Oficinas
│   ├── layout.tsx              # Layout Global (Fontes, Metadata)
│   └── page.tsx                # Landing Page 3D (Venda do Produto)
├── components/                 # Componentes Reutilizáveis
│   ├── AdminSidebar.tsx        # Navegação do Painel Admin
│   ├── Hero3D.tsx              # Cena 3D da Landing Page
│   └── Navbar.tsx              # Barra de navegação responsiva
├── lib/                        # Utilitários e Configurações
│   ├── supabase.ts             # Cliente Supabase (Singleton)
│   ├── jwt.ts                  # Manipulação de Tokens
│   └── ia.ts                   # Módulo de Inteligência Artificial (Mock)
├── scripts/                    # Scripts de Manutenção e Setup
│   ├── seed-database.ts        # Popula o banco com dados fictícios de alta qualidade
│   └── fix-passwords.ts        # Utilitário para correção/reset de senhas em massa
├── store/                      # Gerenciamento de Estado Global
│   └── authStore.ts            # Zustand Store para Sessão do Usuário
└── public/                     # Assets Estáticos (Modelos 3D, Imagens)
```

---

## 🚀 Como Funciona (Fluxos Principais)

### 1. Onboarding (Entrada de Cliente)
1.  A oficina acessa `www.carrosaas.com` (Landing Page).
2.  Clica em "Começar Grátis" e preenche o cadastro (`/register`).
3.  O sistema cria a `oficina` no Supabase e gera um token.
4.  Redirecionamento imediato para o Dashboard Operacional.

### 2. Operação Diária (A Oficina trabalhando)
1.  O mecânico acessa o Dashboard.
2.  Clica em **"Nova Ordem de Serviço"**.
3.  Preenche: Cliente (WhatsApp), Carro (Modelo/Placa), Serviço e Valor.
4.  **Mágica:** O cliente é salvo no banco, o serviço é registrado e o faturamento do dia atualiza instantaneamente.

### 3. Gestão do SaaS (Você trabalhando)
1.  Acesse `/login` com credenciais de Admin.
2.  O sistema reconhece e joga para `/admin/dashboard`.
3.  **Terminal de Logs:** Você vê quem logou, quem cadastrou serviço e erros do sistema em tempo real.
4.  **Suporte:** Um cliente reclama de erro? Você busca a oficina dele, clica em **"Acessar Painel"** e vê exatamente o que ele vê, sem precisar pedir a senha dele.

---

## 🛠️ Instalação e Configuração

```bash
# 1. Clone o repositório
git clone https://github.com/fabiorjvr/carrosaas.git

# 2. Instale as dependências
npm install

# 3. Configure as Variáveis de Ambiente (.env)
NEXT_PUBLIC_SUPABASE_URL=sua_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_aqui
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role_aqui

# 4. Popule o Banco de Dados (Opcional)
npx ts-node scripts/seed-database.ts

# 5. Inicie o Servidor de Desenvolvimento
npm run dev
```

---

## 🚧 Roadmap (O que falta fazer)

Apesar de funcional, o sistema tem um caminho ambicioso pela frente:

*   [ ] **Integração Real com WhatsApp:** Conectar a API do WPPConnect ou Twilio para envio real das mensagens que hoje são apenas simuladas no banco.
*   [ ] **Gateway de Pagamento:** Implementar Stripe ou Mercado Pago para cobrar a assinatura das oficinas automaticamente.
*   [ ] **Módulo de IA Real:** Substituir os "mocks" de IA por chamadas reais à OpenAI para analisar o histórico dos carros e sugerir manutenções preventivas.
*   [ ] **Configurações da Oficina:** Página para a oficina alterar logo, endereço e preço da hora/homem.
*   [ ] **App Mobile:** Versão React Native para o mecânico lançar serviços direto do pátio.

---

## 📞 Contato e Suporte

Este projeto é mantido por **Fabio**.
Para dúvidas comerciais, técnicas ou parcerias:

*   📧 **Email:** fabiorjvr@gmail.com
*   🐙 **GitHub:** [@fabiorjvr](https://github.com/fabiorjvr)

---
*CarroClaude SaaS © 2024 - Acelerando o futuro das oficinas.*
