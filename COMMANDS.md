# 📋 Comandos Úteis - Recruter Tech Desktop

## 🚀 Desenvolvimento

```bash
# Iniciar aplicação desktop completa
npm run dev

# Ou usar scripts helpers
./desktop.sh          # Linux
desktop.bat           # Windows

# Iniciar apenas backend
npm run dev:backend

# Iniciar apenas frontend  
npm run dev:frontend

# Iniciar apenas Electron (requer backend e frontend rodando)
npm run dev:electron
```

## 📦 Build

```bash
# Build completo (frontend + backend)
npm run build

# Build e empacotar para Windows
npm run build:win

# Build e empacotar para Linux
npm run build:linux

# Build para todas plataformas
npm run build:all

# Usar script interativo
./build-desktop.sh    # Linux
build-desktop.bat     # Windows
```

## 🎨 Ícones

```bash
# Gerar ícones a partir do SVG (requer ImageMagick)
./generate-icons.sh

# Ou usar ferramenta npm
npm install -g electron-icon-maker
electron-icon-maker --input=build/icon.svg --output=build
```

## 🧹 Limpeza

```bash
# Limpar builds
rm -rf dist-electron/
rm -rf frontend/dist/

# Limpar node_modules
rm -rf node_modules frontend/node_modules backend/node_modules

# Limpar tudo e reinstalar
rm -rf node_modules frontend/node_modules backend/node_modules
rm -rf package-lock.json frontend/package-lock.json backend/package-lock.json
npm install
```

## 🐛 Debug

```bash
# Ver logs detalhados
DEBUG=* npm run dev

# Verificar portas em uso (Linux)
lsof -i :3000
lsof -i :5173

# Verificar portas em uso (Windows)
netstat -ano | findstr :3000
netstat -ano | findstr :5173

# Matar processos Node (Linux)
pkill node

# Ver versões
node --version
npm --version
npx electron --version
```

## 🧪 Testes

```bash
# Testar se backend está respondendo
curl http://localhost:3000/api/health

# Testar se frontend está acessível
curl http://localhost:5173

# Verificar variáveis de ambiente
cd backend
cat .env
```

## 📊 Análise

```bash
# Ver tamanho dos builds
du -sh dist-electron/*

# Ver estrutura do build
tree dist-electron/ -L 2

# Ver dependências do projeto
npm list --depth=0

# Ver dependências desatualizadas
npm outdated
```

## 🔄 Atualizações

```bash
# Atualizar dependências (cuidado!)
npm update

# Atualizar Electron
npm install electron@latest --save-dev

# Verificar vulnerabilidades
npm audit
npm audit fix
```

## 🌐 Docker (modo web)

```bash
# Iniciar com Docker (modo web, não desktop)
docker-compose up -d

# Ver logs
docker-compose logs -f

# Rebuild containers
docker-compose up -d --build

# Parar containers
docker-compose down
```

## 📝 Configuração

```bash
# Configurar backend
cd backend
cp .env.example .env
nano .env  # ou vim, code, etc.

# Configurar Git
git config user.name "Seu Nome"
git config user.email "seu@email.com"

# Ignorar arquivos locais
echo ".env" >> .gitignore
echo "dist-electron/" >> .gitignore
```

## 🎯 Atalhos de Desenvolvimento

```bash
# Alias úteis (adicione ao ~/.bashrc ou ~/.zshrc)
alias rt-dev='cd /path/to/recruter-tech && npm run dev'
alias rt-build='cd /path/to/recruter-tech && npm run build:win'
alias rt-clean='cd /path/to/recruter-tech && rm -rf dist-electron/ frontend/dist/'

# Recarregar shell
source ~/.bashrc  # ou source ~/.zshrc
```

## 🔐 Segurança

```bash
# Verificar .env não está no Git
git status --ignored

# Gerar nova API key OpenAI se comprometida
# https://platform.openai.com/api-keys

# Verificar permissões de arquivos (Linux)
chmod 600 backend/.env
chmod +x *.sh
```

## 📱 Integração Contínua

```bash
# Preparar para CI/CD
npm ci  # Instala exatamente do package-lock.json

# Build sem cache
npm run build -- --clean

# Testes (quando implementados)
npm test
```

## 🎓 Produtividade

```bash
# Watch mode para desenvolvimento
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend  
cd frontend && npm run dev

# Terminal 3: Electron
npm run dev:electron

# Ou usar tmux/screen para múltiplos terminais
```

## 📦 Distribuição

```bash
# Criar release
npm version patch  # ou minor, major
git push --tags

# Upload para distribuição
# GitHub Releases, S3, etc.

# Gerar checksums
cd dist-electron
sha256sum * > checksums.txt
```

## 🆘 Ajuda

```bash
# Ver este arquivo
cat COMMANDS.md

# Ver troubleshooting
cat TROUBLESHOOTING.md

# Ver documentação desktop
cat DESKTOP.md

# Ver guia rápido
cat DESKTOP_QUICKSTART.md
```

---

**Dica**: Salve este arquivo nos favoritos do seu terminal para referência rápida!
