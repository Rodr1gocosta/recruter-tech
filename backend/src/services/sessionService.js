import fs from 'fs';
import path from 'path';

// Paths configuráveis via variáveis de ambiente
const SESSIONS_DIR = process.env.SESSIONS_PATH || path.join(process.cwd(), 'data', 'sessions');

/**
 * Garantir que o diretório de sessões existe
 */
export const ensureSessionsDir = () => {
  if (!fs.existsSync(SESSIONS_DIR)) {
    fs.mkdirSync(SESSIONS_DIR, { recursive: true });
    console.log(`✅ Diretório de sessões criado: ${SESSIONS_DIR}`);
  }
};

/**
 * Salvar sessão em disco
 */
export const saveSession = (sessionId, sessionData) => {
  try {
    ensureSessionsDir();
    const filePath = path.join(SESSIONS_DIR, `${sessionId}.json`);
    fs.writeFileSync(filePath, JSON.stringify(sessionData, null, 2));
    console.log(`💾 Sessão salva: ${sessionId}`);
    return true;
  } catch (error) {
    console.error(`❌ Erro ao salvar sessão ${sessionId}:`, error);
    return false;
  }
};

/**
 * Carregar sessão do disco
 */
export const loadSession = (sessionId) => {
  try {
    const filePath = path.join(SESSIONS_DIR, `${sessionId}.json`);
    if (!fs.existsSync(filePath)) {
      return null;
    }
    const data = fs.readFileSync(filePath, 'utf8');
    console.log(`📂 Sessão carregada: ${sessionId}`);
    return JSON.parse(data);
  } catch (error) {
    console.error(`❌ Erro ao carregar sessão ${sessionId}:`, error);
    return null;
  }
};

/**
 * Atualizar dados de uma sessão existente
 */
export const updateSession = (sessionId, updates) => {
  try {
    const session = loadSession(sessionId);
    if (!session) {
      console.error(`❌ Sessão não encontrada: ${sessionId}`);
      return false;
    }
    
    const updatedSession = { ...session, ...updates, updatedAt: new Date() };
    return saveSession(sessionId, updatedSession);
  } catch (error) {
    console.error(`❌ Erro ao atualizar sessão ${sessionId}:`, error);
    return false;
  }
};

/**
 * Deletar sessão do disco
 */
export const deleteSession = (sessionId) => {
  try {
    const filePath = path.join(SESSIONS_DIR, `${sessionId}.json`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`🗑️ Sessão deletada: ${sessionId}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`❌ Erro ao deletar sessão ${sessionId}:`, error);
    return false;
  }
};

/**
 * Listar todas as sessões
 */
export const listSessions = () => {
  try {
    ensureSessionsDir();
    const files = fs.readdirSync(SESSIONS_DIR);
    return files
      .filter(f => f.endsWith('.json'))
      .map(f => {
        const sessionId = f.replace('.json', '');
        const filePath = path.join(SESSIONS_DIR, f);
        const stats = fs.statSync(filePath);
        return {
          sessionId,
          createdAt: stats.birthtime,
          modifiedAt: stats.mtime
        };
      })
      .sort((a, b) => b.modifiedAt - a.modifiedAt); // Mais recentes primeiro
  } catch (error) {
    console.error('❌ Erro ao listar sessões:', error);
    return [];
  }
};

/**
 * Limpar sessões antigas (mais de 7 dias)
 */
export const cleanOldSessions = (daysOld = 7) => {
  try {
    ensureSessionsDir();
    const now = Date.now();
    const maxAge = daysOld * 24 * 60 * 60 * 1000; // dias em ms
    
    const files = fs.readdirSync(SESSIONS_DIR);
    let cleaned = 0;
    
    files.forEach(file => {
      const filePath = path.join(SESSIONS_DIR, file);
      const stats = fs.statSync(filePath);
      const age = now - stats.mtime.getTime();
      
      if (age > maxAge) {
        fs.unlinkSync(filePath);
        cleaned++;
      }
    });
    
    if (cleaned > 0) {
      console.log(`🧹 ${cleaned} sessões antigas limpas`);
    }
    
    return cleaned;
  } catch (error) {
    console.error('❌ Erro ao limpar sessões antigas:', error);
    return 0;
  }
};

// Inicializar: garantir que o diretório existe e limpar sessões antigas
ensureSessionsDir();
cleanOldSessions(7);
