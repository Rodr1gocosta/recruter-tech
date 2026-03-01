// Utilitário para detectar ambiente Electron
export const isElectron = () => {
  // Verifica se está rodando no Electron
  if (typeof window !== 'undefined' && window.electronAPI) {
    return true;
  }
  
  // Fallback: verifica user agent
  const userAgent = navigator.userAgent.toLowerCase();
  return userAgent.indexOf(' electron/') > -1;
};

export const getElectronInfo = async () => {
  if (!isElectron() || !window.electronAPI) {
    return null;
  }
  
  try {
    const [version, appPath] = await Promise.all([
      window.electronAPI.getAppVersion(),
      window.electronAPI.getAppPath()
    ]);
    
    return {
      version,
      appPath,
      platform: window.electronAPI.platform,
      electronVersion: window.electronAPI.electronVersion,
      nodeVersion: window.electronAPI.nodeVersion,
      chromeVersion: window.electronAPI.chromeVersion
    };
  } catch (error) {
    console.error('Erro ao obter informações do Electron:', error);
    return null;
  }
};

export default {
  isElectron,
  getElectronInfo
};
