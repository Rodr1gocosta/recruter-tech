import { contextBridge, ipcRenderer } from 'electron';
import Store from 'electron-store';

// Criar instância do store com schema
const store = new Store({
  schema: {
    technicalReferences: {
      type: 'array',
      default: []
    },
    clients: {
      type: 'array',
      default: []
    },
    recruiters: {
      type: 'array',
      default: []
    },
    technicalQuestions: {
      type: 'array',
      default: []
    },
    api_keys: {
      type: 'array',
      default: []
    }
  }
});

// Expõe APIs seguras para o renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // Informações da aplicação
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  getAppPath: () => ipcRenderer.invoke('get-app-path'),
  
  // Detecta se está rodando no Electron
  isElectron: true,
  
  // Informações da plataforma
  platform: process.platform,
  
  // Versão do Node
  nodeVersion: process.versions.node,
  
  // Versão do Chrome
  chromeVersion: process.versions.chrome,
  
  // Versão do Electron
  electronVersion: process.versions.electron,
  
  // Store API
  store: {
    get: (key, defaultValue) => store.get(key, defaultValue),
    set: (key, value) => store.set(key, value),
    delete: (key) => store.delete(key),
    clear: () => store.clear(),
    has: (key) => store.has(key),
    // Obter todo o store
    getAll: () => store.store,
    // Definir múltiplos valores de uma vez
    setMultiple: (object) => {
      Object.entries(object).forEach(([key, value]) => {
        store.set(key, value);
      });
    }
  }
});

// Log quando o preload script é carregado
console.log('🚀 Preload script carregado com sucesso');
console.log('🔍 Plataforma:', process.platform);
console.log('🔍 Electron version:', process.versions.electron);
console.log('🔍 Store criado:', !!store);

// Verificar se o contextBridge funcionou
window.addEventListener('DOMContentLoaded', () => {
  console.log('🔍 DOMContentLoaded - window.electronAPI:', window.electronAPI);
});
