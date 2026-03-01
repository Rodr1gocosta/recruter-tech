import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
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

  generateReport(sessionId, candidateInfo, finalNotes) {
    return api.post('/interview/generate-report', {
      sessionId,
      candidateInfo,
      finalNotes
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
