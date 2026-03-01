# 🔧 Troubleshooting - Recruter Tech Desktop

## Problemas Comuns e Soluções

### ❌ Erro: "electron not found" ou "command not found"

**Causa**: Dependências não instaladas

**Solução**:
```bash
# Instalar dependências na raiz
npm install

# Se o problema persistir, instalar globalmente
npm install -g electron
```

---

### ❌ Erro: "Port 3000 already in use" / "EADDRINUSE"

**Causa**: Porta já está sendo usada por outro processo

**Solução Linux**:
```bash
# Encontrar processo usando a porta
lsof -i :3000

# Matar processo (substitua PID pelo número mostrado)
kill -9 PID

# Ou matar todos os processos node
pkill node
```

**Solução Windows**:
```bash
# Encontrar processo
netstat -ano | findstr :3000

# Matar processo (substitua PID)
taskkill /PID <PID> /F

# Ou usar PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
```

---

### ❌ Erro: "OPENAI_API_KEY is not defined"

**Causa**: Variável de ambiente não configurada

**Solução**:
```bash
# Criar arquivo .env no backend
cd backend
cp .env.example .env

# Editar .env e adicionar:
OPENAI_API_KEY=sk-sua-chave-aqui
```

---

### ❌ Janela do Electron abre em branco

**Causa**: Frontend não buildado ou não está rodando

**Solução em Desenvolvimento**:
```bash
# Verificar se frontend está rodando
# Deve estar acessível em http://localhost:5173

cd frontend
npm run dev
```

**Solução em Produção**:
```bash
# Rebuild do frontend
cd frontend
npm run build
```

---

### ❌ Erro ao fazer build: "Icon not found"

**Causa**: Ícones não foram criados

**Solução**:
```bash
# Opção 1: Usar placeholder SVG incluído
# Converter SVG para PNG e ICO usando ferramenta online:
# https://convertio.co/svg-png/
# https://convertio.co/png-ico/

# Opção 2: Gerar automaticamente
npm install -g electron-icon-maker
electron-icon-maker --input=build/icon.svg --output=build

# Opção 3: Temporariamente, comentar a linha "icon" no package.json
```

---

### ❌ Erro: "Cannot find module" ao executar

**Causa**: node_modules corrompido ou incompleto

**Solução**:
```bash
# Limpar e reinstalar tudo
rm -rf node_modules frontend/node_modules backend/node_modules
rm package-lock.json frontend/package-lock.json backend/package-lock.json

npm install
cd frontend && npm install && cd ..
cd backend && npm install && cd ..
```

---

### ❌ Build demora muito ou trava

**Causa**: Recursos insuficientes ou muitos arquivos

**Solução**:
```bash
# Limpar builds anteriores
rm -rf dist-electron/
rm -rf frontend/dist/

# Verificar se .gitignore está correto
# Não deve incluir node_modules no build

# Aumentar memória do Node.js
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build:win
```

---

### ❌ Backend não inicia em produção

**Causa**: Caminho do backend incorreto ou dependências faltando

**Solução**:
```bash
# Verificar estrutura do build
ls -la dist-electron/

# Reinstalar dependências do backend
cd backend
npm install --production
```

---

### ❌ DevTools não abre em desenvolvimento

**Causa**: Configuração do main.js

**Solução**:
Editar `electron/main.js` e verificar se tem:
```javascript
if (isDev) {
  mainWindow.webContents.openDevTools();
}
```

---

### ❌ Erro de CORS ao chamar API

**Causa**: Proxy não configurado ou backend não acessível

**Solução em Desenvolvimento**:
```bash
# Verificar vite.config.js
# Deve ter proxy configurado para /api

# Verificar se backend está rodando
curl http://localhost:3000/api/health
```

**Solução em Produção**:
```bash
# API deve usar localhost, não IP externo
# Verificar electron/main.js
```

---

### ❌ Instalador não funciona no Windows

**Causa**: Falta de permissões ou antivírus

**Solução**:
1. Executar como Administrador
2. Desabilitar temporariamente antivírus
3. Assinar digitalmente o executável (para distribuição)

---

### ❌ AppImage não executa no Linux

**Causa**: Falta permissão de execução

**Solução**:
```bash
# Dar permissão de execução
chmod +x dist-electron/*.AppImage

# Executar
./dist-electron/Recruter-Tech-1.0.0.AppImage

# Se ainda não funcionar, extrair e executar
./dist-electron/*.AppImage --appimage-extract
./squashfs-root/AppRun
```

---

### ❌ Erro: "GPU process isn't usable"

**Causa**: Problemas com aceleração de hardware

**Solução**:
Adicionar ao `electron/main.js` antes de `app.whenReady()`:
```javascript
app.disableHardwareAcceleration();
```

---

### 🔍 Debug Geral

#### Habilitar logs verbosos:
```bash
# Linux/Mac
DEBUG=* npm run dev

# Windows
set DEBUG=* && npm run dev
```

#### Ver logs do Electron:
```bash
# No código (electron/main.js), adicionar:
console.log('Backend stdout:', data.toString());
console.error('Backend stderr:', data.toString());
```

#### Verificar versões:
```bash
node --version    # Deve ser 18+
npm --version
npx electron --version
```

---

## 📞 Ainda com problemas?

1. Verifique os logs no console
2. Abra as DevTools (F12) e veja o console
3. Verifique se todos os requisitos estão instalados
4. Tente em modo desenvolvimento primeiro
5. Consulte a documentação do Electron: https://electronjs.org/docs

---

## 🧹 Reset Completo

Se nada funcionar, reset completo:

```bash
# 1. Limpar tudo
rm -rf node_modules frontend/node_modules backend/node_modules
rm -rf dist-electron frontend/dist
rm -rf package-lock.json frontend/package-lock.json backend/package-lock.json

# 2. Reinstalar
npm install

# 3. Configurar .env
cd backend
cp .env.example .env
# Editar e adicionar OPENAI_API_KEY
cd ..

# 4. Testar
npm run dev
```
