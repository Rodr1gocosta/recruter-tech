import { generateInterviewReport } from '../services/aiService.js';
import { generatePDF } from '../services/pdfService.js';
import { extractTextFromPDF } from '../services/resumeService.js';
import { saveSession, loadSession, updateSession, deleteSession } from '../services/sessionService.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths configuráveis via variáveis de ambiente
const DATA_PATH = process.env.DATA_PATH || path.join(process.cwd(), 'data');
const UPLOADS_PATH = process.env.UPLOADS_PATH || path.join(process.cwd(), 'uploads');

// Log para debug em produção
console.log('📁 InterviewController - DATA_PATH:', DATA_PATH);
console.log('📁 InterviewController - UPLOADS_PATH:', UPLOADS_PATH);
console.log('📁 InterviewController - process.cwd():', process.cwd());

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    const sessionId = Date.now().toString();
    const resumeText = await extractTextFromPDF(req.file.path);

    const sessionData = {
      sessionId,
      resumePath: req.file.path,
      resumeText,
      createdAt: new Date()
    };

    // Salvar em disco
    saveSession(sessionId, sessionData);

    res.json({
      success: true,
      sessionId,
      message: 'Currículo processado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao fazer upload:', error);
    res.status(500).json({ error: error.message });
  }
};

export const saveExperienceData = async (req, res) => {
  try {
    const { sessionId, experienceNotes } = req.body;

    const session = loadSession(sessionId);
    if (!sessionId || !session) {
      return res.status(400).json({ error: 'Sessão inválida' });
    }

    // Atualizar sessão com dados de experiência
    updateSession(sessionId, { experienceNotes });

    res.json({
      success: true,
      message: 'Dados de experiência salvos com sucesso'
    });
  } catch (error) {
    console.error('Erro ao salvar experiência:', error);
    res.status(500).json({ error: error.message });
  }
};

export const saveTechnicalData = async (req, res) => {
  try {
    const { sessionId, technicalAnswers } = req.body;

    const session = loadSession(sessionId);
    if (!sessionId || !session) {
      return res.status(400).json({ error: 'Sessão inválida' });
    }

    // Atualizar sessão com dados técnicos
    updateSession(sessionId, { technicalAnswers });

    res.json({
      success: true,
      message: 'Dados técnicos salvos com sucesso'
    });
  } catch (error) {
    console.error('Erro ao salvar dados técnicos:', error);
    res.status(500).json({ error: error.message });
  }
};

export const generateReport = async (req, res) => {
  try {
    const { sessionId, finalNotes, candidateInfo, situation } = req.body;
    const apiKey = req.headers['x-openai-key']; // Obter a chave do header (compatibilidade)
    const provider = req.headers['x-ai-provider'] || 'openai'; // Obter o provedor do header
    const apiKeysHeader = req.headers['x-api-keys']; // Obter array de chaves

    const session = loadSession(sessionId);
    if (!sessionId || !session) {
      return res.status(400).json({ error: 'Sessão inválida' });
    }

    const reportData = {
      candidateName: candidateInfo.name,
      recruiter: candidateInfo.recruiter,
      interviewDateTime: candidateInfo.interviewDateTime,
      technicalReference: candidateInfo.technicalReference,
      jobNumber: candidateInfo.jobNumber,
      client: candidateInfo.client,
      jobTitle: candidateInfo.jobTitle,
      jobLink: candidateInfo.jobLink,
      experienceNotes: session.experienceNotes || {},
      technicalAnswers: session.technicalAnswers || [],
      resumeText: session.resumeText,
      finalNotes: finalNotes,
      situation: situation
    };

    // Parse do array de chaves se fornecido
    let apiKeysArray = null;
    if (apiKeysHeader) {
      try {
        apiKeysArray = JSON.parse(apiKeysHeader);
        console.log(`📋 Recebidas ${apiKeysArray.length} chaves de API para fallback`);
      } catch (e) {
        console.error('Erro ao parsear chaves de API:', e);
      }
    }

    // Gerar relatório com IA (passar a API key, provedor e array de chaves)
    const reportText = await generateInterviewReport(reportData, apiKey, provider, apiKeysArray);

    // Gerar PDF
    const pdfResult = await generatePDF(reportData, reportText);

    // Limpar sessão e arquivos
    if (session.resumePath && fs.existsSync(session.resumePath)) {
      fs.unlinkSync(session.resumePath);
    }
    deleteSession(sessionId);

    res.json({
      success: true,
      report: reportText,
      pdfFileName: pdfResult.fileName,
      message: 'Relatório gerado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    res.status(500).json({ error: error.message });
  }
};

export const downloadPDF = async (req, res) => {
  try {
    const { fileName } = req.params;
    const filePath = path.join(UPLOADS_PATH, fileName);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Arquivo não encontrado' });
    }

    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error('Erro ao fazer download:', err);
      }
      // Deletar arquivo após download
      setTimeout(() => {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }, 5000);
    });
  } catch (error) {
    console.error('Erro ao baixar PDF:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getResume = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = loadSession(sessionId);
    if (!sessionId || !session) {
      return res.status(404).json({ error: 'Sessão não encontrada' });
    }
    
    if (!session.resumePath || !fs.existsSync(session.resumePath)) {
      return res.status(404).json({ error: 'Currículo não encontrado' });
    }

    res.sendFile(path.resolve(session.resumePath));
  } catch (error) {
    console.error('Erro ao buscar currículo:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getQuestions = async (req, res) => {
  try {
    const questionsPath = path.join(DATA_PATH, 'questions.json');
    const questionsData = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));
    res.json(questionsData);
  } catch (error) {
    console.error('Erro ao carregar perguntas:', error);
    res.status(500).json({ error: error.message });
  }
};
