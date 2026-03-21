import axios from 'axios';
import { getStorage } from '../utils/storage.js';
import { isElectron } from '../utils/electron.js';

// Detectar ambiente e definir baseURL apropriada
const getBaseURL = () => {
  // Se tem variável de ambiente definida, usar ela
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Se está no Electron, usar URL absoluta do backend
  if (isElectron()) {
    return 'http://localhost:3000/api';
  }
  
  // Modo web/Docker: usar URL relativa
  return '/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para adicionar API keys e provedores em todas as requisições
api.interceptors.request.use((config) => {
  // Carregar todas as chaves de API configuradas
  const apiKeys = getStorage('api_keys', []);
  
  if (apiKeys && apiKeys.length > 0) {
    const activeKeys = apiKeys.filter(k => k.enabled);
    
    if (activeKeys.length > 0) {
      // Enviar as chaves como JSON no header, na ordem de prioridade
      config.headers['X-API-Keys'] = JSON.stringify(
        activeKeys.map(k => ({
          provider: k.provider,
          key: k.key
        }))
      );
      
      // Manter compatibilidade: enviar primeira chave ativa como principal
      config.headers['X-OpenAI-Key'] = activeKeys[0].key;
      config.headers['X-AI-Provider'] = activeKeys[0].provider;
    }
  } else {
    // Fallback para o sistema antigo
    const apiKey = getStorage('openai_api_key');
    const provider = getStorage('ai_provider', 'openai');
    
    if (apiKey) {
      config.headers['X-OpenAI-Key'] = apiKey;
      config.headers['X-AI-Provider'] = provider;
    }
  }
  
  return config;
});

export const interviewAPI = {
  uploadResume(formData) {
    return api.post('/interview/upload-resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  saveExperience(sessionId, experienceNotes) {
    return api.post('/interview/experience', {
      sessionId,
      experienceNotes
    });
  },

  saveTechnical(sessionId, technicalAnswers) {
    return api.post('/interview/technical', {
      sessionId,
      technicalAnswers
    });
  },

  generateReport(sessionId, candidateInfo, finalNotes, situation) {
    return api.post('/interview/generate-report', {
      sessionId,
      candidateInfo,
      finalNotes,
      situation
    });
  },

  getQuestions() {
    return api.get('/interview/questions');
  },

  saveQuestions(categories) {
    return api.post('/interview/questions', { categories });
  },

  downloadPDF(fileName) {
    return `${api.defaults.baseURL}/interview/download/${fileName}`;
  }
};

export default api;
