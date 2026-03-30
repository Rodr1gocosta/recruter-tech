import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import isDev from 'electron-is-dev';
import { spawn } from 'child_process';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;
let backendProcess;

// Configuração do backend
const BACKEND_PORT = 3000;
const FRONTEND_PORT = 5173;

// Definir paths de dados para produção
const DATA_PATHS = {
  userData: app.getPath('userData'),
  data: isDev 
    ? path.join(process.cwd(), 'backend', 'data')
    : path.join(app.getPath('userData'), 'data'),
  uploads: isDev
    ? path.join(process.cwd(), 'backend', 'uploads')
    : path.join(app.getPath('userData'), 'uploads'),
  sessions: isDev
    ? path.join(process.cwd(), 'backend', 'data', 'sessions')
    : path.join(app.getPath('userData'), 'data', 'sessions')
};

// Criar diretórios necessários
function ensureDirectories() {
  Object.entries(DATA_PATHS).forEach(([key, dir]) => {
    if (key !== 'userData' && !fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`✅ Diretório criado: ${dir}`);
    }
  });
  
  // Criar questions.json vazio se não existir em produção
  if (!isDev) {
    const questionsDest = path.join(DATA_PATHS.data, 'questions.json');
    
    if (!fs.existsSync(questionsDest)) {
      const emptyQuestions = {
        categories: []
      };
      fs.writeFileSync(questionsDest, JSON.stringify(emptyQuestions, null, 2));
      console.log('✅ questions.json vazio criado - usuário deve preencher via interface');
    }
  }
}

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

  // Logs para debug
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load:', errorCode, errorDescription);
  });

  mainWindow.webContents.on('did-finish-load', () => {
    console.log('Page loaded successfully');
  });

  // Carrega a aplicação
  if (isDev) {
    // Em desenvolvimento, usa o servidor Vite
    mainWindow.loadURL(`http://localhost:${FRONTEND_PORT}`);
    mainWindow.webContents.openDevTools();
  } else {
    // Em produção, carrega os arquivos buildados
    // __dirname em produção aponta para app.asar/electron
    // Precisamos ir para app.asar/frontend/dist/index.html
    const indexPath = path.join(__dirname, '..', 'frontend', 'dist', 'index.html');
    console.log('Loading index from:', indexPath);
    mainWindow.loadFile(indexPath).catch(err => {
      console.error('Error loading file:', err);
    });
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
  
  backendProcess = spawn(process.execPath, [backendPath], {
    env: {
      ...process.env,
      ELECTRON_RUN_AS_NODE: '1',
      PORT: BACKEND_PORT,
      NODE_ENV: 'production',
      DATA_PATH: DATA_PATHS.data,
      UPLOADS_PATH: DATA_PATHS.uploads,
      SESSIONS_PATH: DATA_PATHS.sessions
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
  // Criar diretórios necessários antes de iniciar
  ensureDirectories();
  
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
