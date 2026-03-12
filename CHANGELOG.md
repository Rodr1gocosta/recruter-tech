# Changelog

## [1.2.1] - 2026-03-12

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
