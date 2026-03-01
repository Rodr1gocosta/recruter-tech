const { contextBridge, ipcRenderer } = require('electron');

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
  electronVersion: process.versions.electron
});

// Log quando o preload script é carregado
console.log('Preload script carregado com sucesso');
console.log('Plataforma:', process.platform);
console.log('Electron version:', process.versions.electron);
