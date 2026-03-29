# Freelance / OS 🛠️

> Sistema robusto de gestão de tempo e faturamento para freelancers (MEI). A aplicação permite o rastreamento de horas em tempo real, gestão de projetos e análise financeira automatizada com precisão decimal.

---

## 📋 Funcionalidades Principais

- **Tracker de Atividade:** Cronômetro integrado para registro preciso de tarefas.
- **Gestão de Projetos:** Cadastro de clientes com valores de hora personalizados.
- **CRUD de Tarefas:** Fluxo completo de criação, edição e exclusão de registros de tempo.
- **Dashboard Financeiro:** Visualização instantânea do faturamento total e horas trabalhadas.
- **Filtros Inteligentes:** Histórico filtrável por projeto, mês e ano.
- **Interface Brutalista:** Design minimalista focado em UX, sem ruídos visuais.

---

## 🚀 Tech Stack

**Front-end:**
- [Next.js 14+](https://nextjs.org/) (App Router)
- [Styled Components](https://styled-components.com/) (Estilização baseada em componentes)
- [Lucide React](https://lucide.dev/) (Pacote de ícones)
- [Axios](https://axios-http.com/) (Consumo de API)

**Back-end:**
- [Node.js](https://nodejs.org/) com [Express](https://expressjs.com/)
- [Knex.js](https://knexjs.org/) (Query Builder)
- [SQLite](https://www.sqlite.org/) (Banco de dados relacional leve)
- [Cors](https://github.com/expressjs/cors) (Segurança e integração)

---

## ⚙️ Instalação e Configuração

### 1. Clonando o Repositório

```bash
git clone https://github.com/seu-usuario/freelance-manager.git
cd freelance-manager
```

### 2. Configurando o Back-end

```bash
cd api
npm install
# Execute as migrations para criar o banco SQLite
npx knex migrate:latest
# Inicie o servidor
npm run dev
```

### 3. Configurando o Front-end

```bash
cd web
npm install
# Inicie a aplicação Next.js
npm run dev
```

---

## 🏗️ Arquitetura de Dados

A aplicação utiliza um modelo relacional focado em integridade financeira.

- **Projetos:** Armazena o `hourly_rate` (valor/hora) como base para cálculos.
- **Tarefas (Tasks):** Registra a duração em minutos e calcula o ganho em tempo real no banco de dados através de divisões decimais (`60.0`), garantindo que nenhum centavo seja perdido em arredondamentos inteiros.

---

## 🛠️ Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto `/web` para configurar a conexão com a API:

```env
NEXT_PUBLIC_API_URL=http://localhost:3333
```

---

## Licença

Este projeto está sob a licença [MIT](LICENSE).

Desenvolvido por **Patric Augusto**.