# 🚀 Deploy Automático - Frontend

Este repositório possui deploy automático via GitHub Actions.

## 📋 Configuração dos Secrets

Configure os seguintes secrets no GitHub:

1. Vá para `Settings` > `Secrets and variables` > `Actions`
2. Adicione os secrets:

| Secret | Valor | Descrição |
|--------|-------|-----------|
| `VPS_HOST` | IP da sua VPS | Ex: `123.456.789.10` |
| `VPS_USERNAME` | Usuário SSH | Ex: `root` ou `fedora` |
| `VPS_PASSWORD` | Senha SSH | Sua senha de acesso |
| `VPS_PORT` | Porta SSH | `22` (padrão) |
| `PROJECT_PATH` | Caminho base | Ex: `/home/usuario` |

## 🔄 Como funciona

- **Trigger**: Push para `main`, `master` ou `developer`
- **Processo**:
  1. Conecta na VPS via SSH
  2. Navega para `{PROJECT_PATH}/Noto-Front-end`
  3. Faz `git pull` da branch atual
  4. Instala dependências (`npm install`)
  5. Build do projeto (`npm run build`)
  6. Para e remove processo PM2 existente
  7. Inicia novo processo PM2
  8. Verifica se está online

## 🛠️ Estrutura esperada na VPS

```
{PROJECT_PATH}/
├── Noto-Back-end/          # Repositório do backend
└── Noto-Front-end/         # Este repositório
```

## 📊 Verificar deploy

- Vá para `Actions` no GitHub para ver logs
- Na VPS: `pm2 status` para verificar processos
- Logs: `pm2 logs noto-frontend`

## 🔧 Comandos úteis na VPS

```bash
pm2 status                   # Ver todos os processos
pm2 logs noto-frontend      # Ver logs do frontend
pm2 restart noto-frontend   # Reiniciar frontend
pm2 stop noto-frontend      # Parar frontend
```

## 📱 Configuração de ambiente

Certifique-se de que o arquivo `.env.local` está configurado:

```env
NEXT_PUBLIC_API_URL="http://SEU_IP:3001"
```
