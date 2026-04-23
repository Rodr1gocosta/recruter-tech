# Changelog

## [1.4.0] - 2026-04-23

### ✨ Novo
- **Validação de chave de API** - Ao adicionar uma chave nas Configurações, o sistema agora faz uma chamada real ao provedor para confirmar que a integração funciona antes de salvar
- **Feedback visual** - Botão "Adicionar Chave" exibe spinner e mensagem "Verificando integração..." durante a validação
- **Erros reais da IA** - Mensagens de erro agora exibem o motivo exato retornado pela API (ex: chave inválida, modelo não disponível, cota excedida)
- **Backend auto-start** - Electron verifica se o backend já está rodando antes de subir uma nova instância (evita conflito de portas)
- **Endpoint de validação** - `POST /api/interview/validate-key` para testar chaves de forma barata por provedor

### 🔧 Corrigido
- **Preload CJS** - `preload.js` reescrito para CommonJS puro (`require`), resolvendo erro `Cannot use import statement outside a module`
- **electron-store via IPC** - Store movido para o processo principal (`main.js`); preload usa IPC para acessar dados (resolve `module not found: electron-store`)
  - OpenAI: `gpt-4-turbo-preview` → `gpt-5.4-mini`
  - Gemini: `gemini-pro` → `gemini-3.0-flash`
  - Anthropic: `claude-3-sonnet-20240229` → `claude-3-haiku-20240307`
  - Groq: `llama3-70b-8192` → `llama-3.3-70b-versatile`
- **Parâmetro OpenAI** - `max_tokens` substituído por `max_completion_tokens` (exigido nos modelos GPT-5+)
- **Backend dev sem nodemon** - Substituído `nodemon` (não instalado globalmente) por `node --watch` (nativo Node 18+)
- **Frontend ESM** - Adicionado `"type": "module"` no `frontend/package.json` (elimina aviso de performance do Vite)
- **Race condition de inicialização** - Script `dev` agora aguarda `localhost:3000/health` além de `localhost:5173` antes de abrir o Electron

### 🔐 Segurança
- **Content-Security-Policy** - Headers CSP injetados via `session.webRequest.onHeadersReceived`:
  - Desenvolvimento: inclui `unsafe-eval` e `unsafe-inline` (necessário para Vite HMR)
  - Produção: política restrita sem `unsafe-eval`

---

## [1.3.0] - 2026-03-21

### ✨ Novo
- **Perguntas Técnicas** - Agora são salvas em arquivo `questions.json` (AppData) ao invés de localStorage
- **API Backend** - Endpoint `POST /api/interview/questions` para salvar perguntas
- **API Backend** - Endpoint `GET /api/interview/questions` para carregar perguntas
- **Desinstalador** - Opção de remover dados do usuário ao desinstalar (`installer.nsh`)
- **Produção Limpa** - Instalações novas começam sem dados de desenvolvimento

### 🔧 Corrigido
- **Backend em Produção** - Incluídas todas as dependências (`node_modules`) no instalador
- **Dados de Desenvolvimento** - Excluídos `.env`, `Dockerfile`, `data/sessions/` e `uploads/` do build
- **Perguntas Técnicas** - Carregadas do backend (arquivo) ao invés de localStorage
- **Inicialização** - Criação de `questions.json` vazio na primeira execução

### 🗑️ Limpeza de Build
- **Excluído do instalador:**
  - `backend/data/sessions/` (sessões de dev)
  - `backend/uploads/` (currículos de dev)
  - `backend/.env` (chaves locais)
  - `backend/Dockerfile`
  - `backend/docker-compose.yml`
  - `backend/.gitignore`

### 🔐 Segurança
- **Desinstalação** - Pergunta ao usuário se deseja remover dados pessoais
- **AppData** - Dados salvos em `AppData\Roaming\recruter-tech`
- **Instalação** - Binários em `AppData\Local\Programs\Recruter Tech`

### 📁 Estrutura de Dados em Produção
```
AppData\Roaming\recruter-tech\
├── config.json          (electron-store)
├── data\
│   ├── questions.json   (perguntas técnicas)
│   └── sessions\        (entrevistas)
└── uploads\             (currículos PDF)
```

---

## [1.2.1] - 2026-03-12

### 🔧 Corrigido
- **Bug crítico** - Upload de currículo falhando no Electron (URL relativa `file:///C:/api`)
- **Solução** - Detectar ambiente Electron e usar URL absoluta `http://localhost:3000/api`
- **Footer** - Corrigido `electronInfo.value` → `electronInfo.version`
- **Versão no badge** - Corrigido: importa diretamente do package.json (não depende mais da API do Electron)

### ✨ Melhorado
- **Interface** - Versão da aplicação agora aparece no badge "🖥️ Desktop App v1.2.1" (header)
- **Confiabilidade** - Versão sempre sincronizada com package.json
- **Versão** - Sincronizada versão do package.json (1.2.1) com CHANGELOG

### 🎨 Geração de Ícones e Instalador Windows
- **Adicionado** geração automática de ícones a partir do SVG
- **Criado** `build/icon.ico` (Windows) e `build/icon.png` (Linux)
- **Gerados** todos os tamanhos de ícones (16x16 até 1024x1024)
- **Configurado** electron-builder para builds sem assinatura de código
- **Adicionado** `CSC_IDENTITY_AUTO_DISCOVERY=false` nos scripts de build
- **Instalador Windows** criado com sucesso (~79 MB)

**Dependências:**
- `electron-icon-builder` (devDependencies) - para regenerar ícones se necessário

### 📂 Reorganização de Scripts
- **Renomeado** `build-desktop.bat` → `build.bat` (nome mais simples)
- **Renomeado** `build-desktop.sh` → `build.sh`
- **Criada** pasta `scripts/` para utilitários
- **Movido** `check.sh` → `scripts/check-docker.sh`
- **Movido** `generate-icons.sh` → `scripts/generate-icons.sh`
- **Removido** `dev.sh` (funcionalidade redundante com `desktop.sh`)

**Estrutura final:**
- Scripts principais na raiz: `start.bat/sh`, `desktop.bat/sh`, `build.bat/sh`
- Scripts utilitários organizados em `scripts/`
- Estrutura mais limpa e intuitiva para o usuário

---

## [1.2.0] - 2026-03-12

### 🚀 Adicionado
- **electron-store** - Persistência consistente de dados entre dev e produção
- **Persistência de sessões** - Sessões agora salvas em disco (`data/sessions/`)
- **Múltiplos provedores de IA** - Suporte a OpenAI, Google Gemini, Anthropic, Groq, Cohere
- **Fallback automático** - Sistema tenta múltiplas chaves de API automaticamente
- **Limpeza automática** - Sessões antigas (>7 dias) são removidas automaticamente
- **Migração automática** - Dados do localStorage migrados para electron-store

### 🔧 Corrigido
- **Paths em produção** - Dados agora salvos corretamente em `AppData/Roaming/recruter-tech`
- **questions.json** - Copiado automaticamente para userData na primeira execução
- **Vue Router** - Mudado de `createWebHistory` para `createWebHashHistory` (fix Electron)
- **Formulário Step 1** - Adicionado import faltante de `getStorage`
- **Build Vite** - Otimizações para Electron (`cssCodeSplit: false`)

### 📝 Modificado
- **Documentação consolidada** - Removidos arquivos .md redundantes (7 arquivos)
- **README.md** - Completamente reescrito com todas as informações centralizadas
- **sessionService.js** - Novo serviço para gerenciar sessões em disco
- **storage.js** - Novo utilitário com fallback localStorage → electron-store

### 🗑️ Removido
- `FIX_ELECTRON_DESKTOP.md` - Correções já aplicadas, obsoleto
- `AJUSTES_PRODUCAO.md` - Mudanças já aplicadas, obsoleto
- `GUIA_RAPIDO.md` - Consolidado no README
- `DESKTOP_QUICKSTART.md` - Consolidado no README
- `DESKTOP.md` - Consolidado no README
- `COMMANDS.md` - Consolidado no README
- `ESTRUTURA.md` - Consolidado no README

### 📁 Estrutura de Dados em Produção
```
C:\Users\{user}\AppData\Roaming\recruter-tech\
├── config.json              # electron-store (configurações)
├── data/
│   ├── questions.json       # Perguntas técnicas
│   └── sessions/            # Sessões salvas
└── uploads/                 # Arquivos temporários
```

---

## [1.1.0] - 2026-02-28

### 🆕 Adicionado
- **Electron 28** - Suporte completo para aplicação desktop
- Empacotamento para Windows (instalador NSIS)
- Empacotamento para Linux (AppImage e .deb)
- Scripts de build multiplataforma
- Detecção automática de ambiente Electron no frontend
- Indicador visual quando rodando como desktop app
- Scripts de início rápido (`desktop.sh` e `desktop.bat`)
- Documentação completa para versão desktop
- Configuração de segurança do Electron (context isolation, preload script)
- Integração automática do backend com Electron em produção

### 📝 Arquivos Criados
- `package.json` (raiz) - Configuração principal do Electron
- `electron/main.js` - Processo principal do Electron
- `electron/preload.js` - Script de preload para segurança
- `desktop.sh` e `desktop.bat` - Scripts de inicialização
- `build/README.md` - Instruções para ícones
- `frontend/src/utils/electron.js` - Utilitários para detecção do Electron

### 🔧 Modificado
- `frontend/vite.config.js` - Ajustado para Electron (base path relativo)
- `frontend/src/App.vue` - Adicionado indicador de desktop app
- `README.md` - Adicionada seção sobre versão desktop

### 📦 Dependências Adicionadas
- `electron@^28.2.0` - Framework desktop
- `electron-builder@^24.9.1` - Empacotamento
- `electron-is-dev@^3.0.1` - Detecção de ambiente
- `concurrently@^8.2.2` - Execução paralela de processos
- `wait-on@^7.2.0` - Aguardar serviços

### 🎯 Características da Versão Desktop
- ✅ Janela nativa 1280x800 (redimensionável)
- ✅ Backend integrado (sem necessidade de Docker)
- ✅ DevTools disponível em desenvolvimento
- ✅ Builds otimizados para produção
- ✅ Instaladores nativos por plataforma
- ✅ Segurança com context isolation
- ✅ Comunicação segura via IPC

## [1.0.0] - Versão Inicial

### Funcionalidades Principais
- Sistema completo de entrevistas técnicas
- Frontend Vue 3 + Vite + Tailwind CSS
- Backend Node.js + Express
- Integração com OpenAI GPT-4
- Geração de relatórios em PDF
- Upload e parsing de currículos
- Sistema de pontuação técnica
- Deploy via Docker Compose
