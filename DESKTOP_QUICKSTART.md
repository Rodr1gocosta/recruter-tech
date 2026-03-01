# 🚀 Guia Rápido - Recruter Tech Desktop

## Início Rápido

### Primeira vez

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variável de ambiente
cd backend
cp .env.example .env
# Edite .env e adicione sua OPENAI_API_KEY

# 3. Executar
cd ..
npm run dev
```

### Uso diário

```bash
# Linux
./desktop.sh

# Windows
desktop.bat
```

## Builds

```bash
# Windows (gera instalador .exe)
npm run build:win

# Linux (gera AppImage e .deb)
npm run build:linux

# Ambos
npm run build:all
```

Os arquivos gerados estarão em `dist-electron/`

## Estrutura de Pastas

```
recruter-tech/
├── electron/           # Código Electron
├── frontend/           # Vue.js app
├── backend/            # Node.js API
├── build/              # Ícones
└── dist-electron/      # Builds gerados
```

## Portas

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000

## Troubleshooting

### Porta em uso
```bash
# Linux
sudo lsof -i :3000
sudo lsof -i :5173

# Windows
netstat -ano | findstr :3000
netstat -ano | findstr :5173
```

### Reinstalar dependências
```bash
rm -rf node_modules frontend/node_modules backend/node_modules
npm install
```

### Limpar cache do Electron
```bash
rm -rf dist-electron/
npm run build
```

## Comandos npm

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Modo desenvolvimento |
| `npm run build` | Build frontend e backend |
| `npm run build:win` | Build para Windows |
| `npm run build:linux` | Build para Linux |
| `npm run build:all` | Build multiplataforma |

## Arquivos Importantes

- `electron/main.js` - Processo principal
- `electron/preload.js` - Bridge seguro
- `package.json` - Config raiz
- `backend/.env` - Variáveis de ambiente
- `build/` - Ícones da aplicação

## Dicas

1. ✅ Sempre configure a `OPENAI_API_KEY` antes de usar
2. ✅ Use DevTools (F12) para debug
3. ✅ Em dev, o backend roda em processo separado
4. ✅ Em produção, backend é empacotado junto
5. ✅ Builds devem ser feitos no SO alvo

## Recursos

- [Documentação Completa](DESKTOP.md)
- [README Geral](README.md)
- [Electron Docs](https://electronjs.org)
