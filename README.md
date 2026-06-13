# Desafio Back-End naPorta API

Web API RESTful desenvolvida para o desafio de Back-End da naPorta. O núcleo da aplicação é um sistema de gerenciamento de Pedidos (CRUD) com relacionamentos, filtros dinâmicos e exclusão lógica, protegido por autenticação JWT.

**Autor:** Rafael Broco

## 🚀 Tecnologias Utilizadas
- **Framework:** NestJS (Node.js/TypeScript)
- **Banco de Dados:** PostgreSQL (Hospedado via Neon.tech)
- **ORM:** Prisma
- **Segurança:** Autenticação via JWT (Bearer Token)

## 🧠 Decisões Arquiteturais e de Infraestrutura
- **PostgreSQL Serverless (Neon.tech em São Paulo - AWS `sa-east-1`):** Visando mitigar limitações severas de hardware local (travamentos constantes ao tentar rodar instâncias pesadas de banco de dados ou contêineres Docker no notebook de desenvolvimento), adotei a infraestrutura em nuvem serverless da Neon.tech na região de São Paulo. Essa arquitetura garantiu latência mínima nas consultas e zero sobrecarga na máquina local. Como já trabalhei na EQUINIX, entendo bem essa dinâmica de Data Centers.
- **Segurança e Identidade (CurrentUser):** A estratégia de validação do JWT foi implementada após mentoria técnica com um amigo meu, chamado José Vitor (desenvolvedor .NET). Para evitar vulnerabilidades, a API não recebe o ID do usuário pelo *body*; ela extrai a identidade do usuário atual (`CurrentUser`) de forma segura, diretamente do token validado. Quem quer chegar longe não pode ir sozinho!❤️
- **Validação Ágil via PowerShell:** Para manter o ambiente de desenvolvimento leve e performático (meu notebook chorando), o ciclo de testes de integração e o consumo das rotas HTTP protegidas por JWT foram validados nativamente através de scripts no console do **PowerShell** utilizando o comando `Invoke-RestMethod`.
- **Soft Delete Nativo:** A remoção de pedidos foi implementada via exclusão lógica. Em vez de apagar o registro fisicamente, a coluna `deletedAt` recebe o *timestamp* da operação. Isso garante integridade de auditoria e oculta o dado das listagens e buscas por ID automaticamente.
- **Precisão Decimal:** Em conformidade com as regras do banco de dados, os valores monetários dos itens foram configurados como `Decimal(10,2)`, blindando o sistema contra anomalias de arredondamento comuns no ponto flutuante do JavaScript.

## ⚙️ Pré-requisitos
Para rodar este projeto, você precisará ter instalado em sua máquina:
- [Node.js](https://nodejs.org) (Versão 20+ recomendada)
- [Git](https://git-scm.com)

## 🛠️ Como Executar o Projeto Localmente

### 1. Clonar o Repositório e Instalar Dependências
Abra o seu terminal e execute:

```bash
git clone https://github.com/R-Broco/naporta-api-do-rafa.git
cd naporta-api-do-rafa
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
   - `GET /pedidos` - Lista os pedidos (Aceita Query Params para filtros dinâmicos: `?numero=X`, `?dataInicial=Y`, `?dataFinal=Z`, `?excluidos=true`).
   - `GET /pedidos/:id` - Busca um pedido específico.
   - `PATCH /pedidos/:id` - Atualiza dados do pedido.
   - `DELETE /pedidos/:id` - Realiza o Soft Delete do pedido.

### ⚡ Teste Automatizado via PowerShell
Você pode utilizar o script utilitário contido na raiz do projeto para simular todas as requisições HTTP da API sequencialmente. Abra o PowerShell e utilize as instruções contidas em:
```powershell
./test-api.ps1
```

## 🎁 Itens Bônus Implementados

O projeto foi desenvolvido seguindo padrões rigorosos de qualidade exigidos pelo mercado, cobrindo os seguintes pontos adicionais:

* **Testes Automatizados (Unitários):** Cobertura expandida com **Jest** no escopo dos serviços (`PedidosService`), cobrindo cenários de Listagem, Criação e Busca por ID com simulação completa (**Mocks**) do Prisma Client para não afetar o banco produtivo.
* **Ambiente de Containerização (Docker):** Arquivo `Dockerfile` otimizado utilizando a imagem leve `node:20-alpine`, pronto para empacotar e distribuir a API para produção.
* **Análise Estática (Linter):** Projeto 100% aderente às regras estritas do **ESLint** e **TypeScript**, rodando de forma limpa, sem variáveis inativas e com tipagem estática segura (Clean Code).

### 🛠️ Como rodar os validadores de qualidade:

* Para rodar a análise estática (Linter): `npm run lint`
* Para rodar os testes unitários: `npm run test`
