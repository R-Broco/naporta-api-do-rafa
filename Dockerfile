# Usa uma imagem leve do Node.js
FROM node:20-alpine

# Define o diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# Copia os arquivos de dependência primeiro (otimiza o cache do Docker)
COPY package*.json ./
COPY prisma ./prisma/

# Instala as dependências
RUN npm install

# Gera o client do Prisma
RUN npx prisma generate

# Copia o resto do código da aplicação
COPY . .

# Compila o projeto NestJS
RUN npm run build

# Expõe a porta que a API vai rodar
EXPOSE 3000

# Comando para iniciar a aplicação em modo de produção
CMD [ "npm", "run", "start:prod" ]