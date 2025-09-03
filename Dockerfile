FROM node:20-alpine AS base

WORKDIR /app

# Copiar arquivos de dependência
COPY package.json yarn.lock ./

# Instalar dependências
RUN yarn install --frozen-lockfile

# Copiar arquivos do projeto
COPY . .

# Build do projeto
RUN yarn build

# Expor porta
EXPOSE 3000

# Comando para produção
CMD ["yarn", "start"]
