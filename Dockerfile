FROM node:20-alpine AS base

# Instalar pnpm
RUN npm install -g pnpm

# Configurar workdir
WORKDIR /app

# Copiar arquivos de dependência
COPY package*.json pnpm-lock.yaml ./

# Instalar dependências
RUN pnpm install --frozen-lockfile

# Copiar arquivos do projeto
COPY . .

# Build do projeto
RUN pnpm run build

# Expor porta
EXPOSE 3000

# Comando para produção (usando start)
CMD ["pnpm", "start"]
