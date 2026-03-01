const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const { spawn } = require('child_process');

let mainWindow;
let backendProcess;

// Configuração do backend
const BACKEND_PORT = 3000;
const FRONTEND_PORT = 5173;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      enableRemoteModule: false
    },
    icon: path.join(__dirname, '../build/icon.png'),
    title: 'Recruter Tech',
    show: false
  });

  // Aguarda a janela estar pronta antes de mostrar
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Carrega a aplicação
  if (isDev) {
    // Em desenvolvimento, usa o servidor Vite
    mainWindow.loadURL(`http://localhost:${FRONTEND_PORT}`);
    mainWindow.webContents.openDevTools();
  } else {
    // Em produção, carrega os arquivos buildados
    mainWindow.loadFile(path.join(__dirname, '../frontend/dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function startBackend() {
  if (isDev) {
    // Em desenvolvimento, assume que o backend já está rodando via npm run dev
    console.log('Modo desenvolvimento: backend deve estar rodando separadamente');
    return;
  }

  // Em produção, inicia o backend junto com o Electron
  const backendPath = path.join(process.resourcesPath, 'backend/src/server.js');
  
  backendProcess = spawn('node', [backendPath], {
    env: {
      ...process.env,
      PORT: BACKEND_PORT,
      NODE_ENV: 'production'
    }
  });

  backendProcess.stdout.on('data', (data) => {
    console.log(`Backend: ${data}`);
  });

  backendProcess.stderr.on('data', (data) => {
    console.error(`Backend Error: ${data}`);
  });

  backendProcess.on('close', (code) => {
    console.log(`Backend process exited with code ${code}`);
  });
}

function stopBackend() {
  if (backendProcess) {
    backendProcess.kill();
    backendProcess = null;
  }
}

// Evento quando o Electron está pronto
app.whenReady().then(() => {
  startBackend();
  
  // Aguarda um pouco para o backend iniciar
  setTimeout(() => {
    createWindow();
  }, isDev ? 1000 : 2000);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Fecha a aplicação quando todas as janelas forem fechadas (exceto no macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    stopBackend();
    app.quit();
  }
});

// Garante que o backend seja fechado ao sair
app.on('before-quit', () => {
  stopBackend();
});

// IPC para comunicação com o renderer process (se necessário)
ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

ipcMain.handle('get-app-path', () => {
  return app.getAppPath();
});
