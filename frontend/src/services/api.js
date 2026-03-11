import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para adicionar API key e provedor em todas as requisições
api.interceptors.request.use((config) => {
  const apiKey = localStorage.getItem('openai_api_key');
  const provider = localStorage.getItem('ai_provider') || 'openai';
  
  if (apiKey) {
    config.headers['X-OpenAI-Key'] = apiKey;
  }
  
  config.headers['X-AI-Provider'] = provider;
  
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

  downloadPDF(fileName) {
    return `${api.defaults.baseURL}/interview/download/${fileName}`;
  }
};

export default api;
