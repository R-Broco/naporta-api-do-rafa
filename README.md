# Desafio Back-End naPorta API

Web API RESTful desenvolvida para o desafio de Back-End da naPorta. O núcleo da aplicação é um sistema de gerenciamento de Pedidos (CRUD) com relacionamentos, filtros dinâmicos e exclusão lógica, protegido por autenticação JWT.

**Autor:** Rafael Broco

## 🚀 Tecnologias Utilizadas
- **Framework:** NestJS (Node.js/TypeScript)
- **Banco de Dados:** PostgreSQL (Hospedado via Neon.tech)
- **ORM:** Prisma
- **Segurança:** Autenticação via JWT (Bearer Token)

## ⚙️ Pré-requisitos
Para rodar este projeto, você precisará ter instalado em sua máquina:
- [Node.js](https://nodejs.org/) (Versão 20+ recomendada)
- [Git](https://git-scm.com/)

## 🛠️ Como Executar o Projeto Localmente

### 1. Clonar o Repositório e Instalar Dependências
Abra o seu terminal e execute:
```bash
git clone <COLOQUE_AQUI_O_LINK_DO_SEU_REPOSITORIO>
cd naporta-api
npm install
```

### 2. Configurar as Variáveis de Ambiente
Na raiz do projeto, crie um arquivo chamado `.env` e adicione a string de conexão do banco de dados PostgreSQL.
```env
DATABASE_URL="postgresql://USUARIO:SENHA@HOST:PORTA/BANCO?sslmode=require"
```

### 3. Estruturar e Popular o Banco de Dados (Seed)
A aplicação possui um script nativo para popular o banco de dados inicialmente com pedidos fictícios para fins de demonstração. Para sincronizar as tabelas e injetar os dados, execute os comandos abaixo em ordem:

```bash
# 1. Gerar os artefatos locais do Prisma Client
npx prisma generate

# 2. Sincronizar as tabelas no banco de dados
npx prisma migrate dev

# 3. Executar o script de Seed para injetar os dados fictícios
npx ts-node --transpile-only prisma/seed.ts
```
*Nota: O script de seed limpará registros antigos e criará 3 pedidos completos com seus respectivos itens.*

### 4. Iniciar o Servidor
Com o banco configurado e populado, inicie a aplicação em modo de desenvolvimento:
```bash
npm run start:dev
```
O servidor estará rodando em `http://localhost:3000`.

## 🔒 Como Testar a API

Todas as rotas de pedidos são protegidas. É necessário gerar um token para realizar as requisições.

1. **Gerar Token (Login Simulado):**
   Faça um `POST` para `http://localhost:3000/auth/login` (não é necessário enviar body). Copie o `access_token` retornado.
2. **Autenticar Requisições:**
   Nas rotas seguintes, adicione no Header da requisição: `Authorization: Bearer <SEU_TOKEN>`.
3. **Rotas Disponíveis:**
   - `POST /pedidos` - Cria um novo pedido.
   - `GET /pedidos` - Lista os pedidos (Aceita Query Params para filtros dinâmicos: `?numero=X`, `?dataInicial=Y`, `?dataFinal=Z`).
   - `GET /pedidos/:id` - Busca um pedido específico.
   - `PATCH /pedidos/:id` - Atualiza dados do pedido.
   - `DELETE /pedidos/:id` - Realiza o Soft Delete do pedido.
