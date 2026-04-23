const { contextBridge, ipcRenderer } = require('electron');

// Expõe APIs seguras para o renderer process via IPC
contextBridge.exposeInMainWorld('electronAPI', {
  // Informações da aplicação
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  getAppPath:    () => ipcRenderer.invoke('get-app-path'),

  // Detecta se está rodando no Electron
  isElectron: true,

  // Informações da plataforma
  platform:        process.platform,
  nodeVersion:     process.versions.node,
  chromeVersion:   process.versions.chrome,
  electronVersion: process.versions.electron,

  // Store API via IPC (electron-store fica no processo principal)
  store: {
    get:         (key, defaultValue) => ipcRenderer.sendSync('store-get', key, defaultValue),
    set:         (key, value)        => ipcRenderer.send('store-set', key, value),
    delete:      (key)               => ipcRenderer.send('store-delete', key),
    clear:       ()                  => ipcRenderer.send('store-clear'),
    has:         (key)               => ipcRenderer.sendSync('store-has', key),
    getAll:      ()                  => ipcRenderer.sendSync('store-get-all'),
    setMultiple: (object)            => ipcRenderer.send('store-set-multiple', object)
  }
});

console.log('🚀 Preload script carregado com sucesso');
console.log('🔍 Plataforma:', process.platform);
console.log('🔍 Electron version:', process.versions.electron);

window.addEventListener('DOMContentLoaded', () => {
  console.log('🔍 DOMContentLoaded - window.electronAPI:', window.electronAPI);
});

