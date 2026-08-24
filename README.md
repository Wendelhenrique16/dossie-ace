# 📁 Dossiê ACE — Gerador e Gestor de Fichas (MVP)

> *"O público acredita que monstros são histórias. Nosso trabalho é garantir que continuem acreditando."*  
> — **Documento interno da ACE**

![ACE RPG Shield](https://img.shields.io/badge/ACE--RPG-Dossi%C3%AA%20Confidencial-red)
![React](https://img.shields.io/badge/React-18-blue)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38bdf8)
![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ecf8e)
![Vite](https://img.shields.io/badge/Vite-Build-646cff)

O **Dossiê ACE** é uma aplicação web intuitiva e imersiva para a criação, preenchimento, gerenciamento e automação de fichas do sistema de RPG de mesa **ACE-RPG**. O sistema simula um terminal governamental interno da *Agência de Contenção de Entidades*, permitindo a gestão completa de agentes/civis e a exportação da ficha em formato PDF estilizado.

---

## 🏛️ Sobre o Universo ACE-RPG

A **ACE (Agência de Contenção de Entidades)** é uma organização secreta governamental responsável por manter a paz pública, contendo, investigando e eliminando **Entidades** — criaturas físicas ou espirituais moldadas pelo medo e energia espiritual coletiva da humanidade.

O sistema foca em **realismo tático, horror de sobrevivência e investigação**. Personagens não são invencíveis: cada escolha de antecedente, idade e ocupação carrega pesadas consequências biológicas, mentais e mecânicas.

---

## 🚀 Funcionalidades Principais (MVP)

- 🔐 **Autenticação de Agentes:** Cadastro e Login via e-mail e senha integrados ao Supabase Auth.
- 📜 **Criação Guiada de Personagens:** Passo a passo completo cobrindo as 5 etapas da criação:
  1. **Fase da Vida:** Escolha entre *Jovem*, *Adulto* e *Maduro*, definindo Sorte Inicial, Pacotes de Antecedentes e penalidades/aspectos etários.
  2. **Gestão de Antecedentes & Sanidade:** Distribuição de pontos em modais dedicados. Compra de Pacotes Extras com rolagem automática do custo em Sanidade (`1d6+6`).
  3. **Traumas, Vícios & Limite 12:** Aplicação automática do marcador *"À Beira da Loucura"* (Sanidade Máxima travada em 1 e resistência a dor) ao ultrapassar os limites do sistema.
  4. **Cálculo de Status Derivados:** Automação em tempo real de Vigor, Sorte, Sanidade, Defesas, DTs, Reações (Prontidão) e conversão de Perícias em dados de teste (`d4` até `d20`).
  5. **Ocupações e Aspectos:** Seleção de Categoria Primária (+5) e Secundária (+3) com consolidação de bônus e controle da economia de Sorte.
- 🏢 **Interface Burocrática Imersiva:** Modal de carregamento estético simulando requisições lentas de instâncias estatais/governamentais (*"Consultando arquivos do DOPS...", "Autenticando selo confidencial..."*).
- 📄 **Exportação em PDF:** Geração de ficha completa e estilizada pronta para impressão e download.

---

## 🛠️ Stack Tecnológica

* **Frontend:** [React](https://react.dev/) + [Vite](https://vitejs.dev/)
* **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
* **Backend & Banco de Dados:** [Supabase](https://supabase.com/) (PostgreSQL & Authentication)
* **Deploy & Hospedagem:** [Vercel](https://vercel.com/)

---

## 📂 Estrutura do Projeto

```text
dossie-ace/
├── src/
│   ├── assets/               # Recursos estáticos e imagens
│   ├── components/           # Componentes modulares
│   │   ├── character/        # Passos e sub-módulos da ficha (ex: AspectsStep.jsx)
│   │   ├── modals/           # Modais de interações (ex: BackgroundModal.jsx)
│   │   ├── AceOSBoot.jsx     # Tela de boot e simulação de terminal
│   │   ├── AppHeader.jsx     # Cabeçalho da aplicação
│   │   ├── BureaucraticLoader.jsx # Modal de carregamento burocrático imersivo
│   │   └── ThemeToggle.jsx   # Alternador de temas
│   ├── data/                 # Tabelas de dados fixos (Aspectos, Antecedentes, Classes, etc)
│   ├── hooks/                # Custom React Hooks
│   ├── lib/                  # Inicializadores de serviços (Supabase Client)
│   ├── logic/                # Regras de negócio e cálculos mecânicos em JS puro
│   │   ├── characterCalculations.js
│   │   ├── backgroundDistribution.js
│   │   └── ...
│   ├── pages/                # Telas da aplicação (Login, Dashboard, Criação, Ficha)
│   ├── styles/               # Folhas de estilo globais e configurações
│   ├── App.jsx               # Roteamento e estrutura principal
│   └── main.jsx              # Ponto de entrada do React
├── .env.local                # Variáveis de ambiente (ignorado no Git)
└── package.json
