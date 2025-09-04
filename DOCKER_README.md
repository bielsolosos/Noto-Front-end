# Containerização do Projeto Noto

Este documento explica como rodar o projeto Noto usando containers com Podman.

## Pré-requisitos

- Podman instalado
- Podman Compose instalado

## Estrutura

```
Noto/
├── Noto-Back-end/
│   ├── Dockerfile
│   └── docker-compose.yml
└── Noto-Front-end/
    ├── Dockerfile
    └── docker-compose.yml
```

## Rodando com Podman

### 1. Configuração Inicial

```bash
# Instalar Podman (se ainda não tiver)
sudo dnf install podman podman-compose

# Criar uma rede para comunicação entre containers
podman network create noto-network
```

### 2. Backend

1. Entre no diretório do backend:

```bash
cd Noto-Back-end
```

2. Configure as variáveis de ambiente:

```bash
cp .env.docs .env
# Edite o arquivo .env com suas configurações
```

3. Construa e inicie os containers:

```bash
podman-compose up -d
```

4. Execute as migrations:

```bash
podman exec noto-back-end-api-1 npx prisma migrate deploy
```

### 3. Frontend

1. Entre no diretório do frontend:

```bash
cd ../Noto-Front-end
```

2. Configure as variáveis de ambiente:

```bash
cp example.env .env.local
# Edite o arquivo .env.local com suas configurações
```

3. Construa e inicie o container:

```bash
podman-compose up -d
```

## Acessando as Aplicações

- Backend API: http://localhost:3000
- Frontend App: http://localhost:3001
- Banco de dados: localhost:5432

## Variáveis de Ambiente

### Backend (.env)

```env
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/noto?schema=public
JWT_SECRET=your_jwt_secret
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Comandos Úteis

### Visualizar logs

```bash
# Backend
cd Noto-Back-end
podman-compose logs -f

# Frontend
cd Noto-Front-end
podman-compose logs -f
```

### Reiniciar serviços

```bash
podman-compose restart
```

### Parar todos os containers

```bash
podman-compose down
```

### Reconstruir após mudanças

```bash
podman-compose up -d --build
```

### Limpar tudo

```bash
podman-compose down -v
podman system prune -a
```

## Troubleshooting

### Problema com portas em uso

```bash
# Verifique portas em uso
sudo lsof -i :3000
sudo lsof -i :3001
sudo lsof -i :5432

# Mate o processo se necessário
kill -9 <PID>
```

### Problemas com permissões

```bash
# Ajuste as permissões do volume do Postgres
podman unshare chown -R 999:999 ./postgres_data
```

### Container não inicia

```bash
# Verifique os logs
podman logs <container-name>

# Verifique o status
podman ps -a
```

## Boas Práticas

1. Sempre use volumes nomeados para dados persistentes
2. Mantenha as variáveis de ambiente em arquivos .env
3. Use networks para isolamento de serviços
4. Faça backup regular do banco de dados
5. Monitore o uso de recursos dos containers

## Notas de Segurança

1. Nunca commite arquivos .env com credenciais
2. Altere senhas padrão em produção
3. Restrinja portas expostas ao necessário
4. Use secrets para dados sensíveis em produção
5. Mantenha as imagens base atualizadas
