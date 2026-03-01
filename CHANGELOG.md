# Changelog

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
- `DESKTOP.md` - Documentação completa da versão desktop
- `DESKTOP_QUICKSTART.md` - Guia rápido de início
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
