import { generateInterviewReport } from '../services/aiService.js';
import { generatePDF } from '../services/pdfService.js';
import { extractTextFromPDF } from '../services/resumeService.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Armazém em memória (stateless - pode usar Redis em produção)
const sessions = new Map();

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    const sessionId = Date.now().toString();
    const resumeText = await extractTextFromPDF(req.file.path);

    sessions.set(sessionId, {
      sessionId,
      resumePath: req.file.path,
      resumeText,
      createdAt: new Date()
    });

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

    if (!sessionId || !sessions.has(sessionId)) {
      return res.status(400).json({ error: 'Sessão inválida' });
    }

    const session = sessions.get(sessionId);
    session.experienceNotes = experienceNotes;
    sessions.set(sessionId, session);

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

    if (!sessionId || !sessions.has(sessionId)) {
      return res.status(400).json({ error: 'Sessão inválida' });
    }

    const session = sessions.get(sessionId);
    session.technicalAnswers = technicalAnswers;
    sessions.set(sessionId, session);

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
    const { sessionId, finalNotes, candidateInfo } = req.body;

    if (!sessionId || !sessions.has(sessionId)) {
      return res.status(400).json({ error: 'Sessão inválida' });
    }

    const session = sessions.get(sessionId);

    const reportData = {
      candidateName: candidateInfo.name,
      candidateEmail: candidateInfo.email,
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
      finalNotes: finalNotes
    };

    // Gerar relatório com IA
    const reportText = await generateInterviewReport(reportData);

    // Gerar PDF
    const pdfResult = await generatePDF(reportData, reportText);

    // Limpar sessão
    if (session.resumePath && fs.existsSync(session.resumePath)) {
      fs.unlinkSync(session.resumePath);
    }
    sessions.delete(sessionId);

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
    const filePath = path.join(process.cwd(), 'uploads', fileName);

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

export const getQuestions = async (req, res) => {
  try {
    const questionsPath = path.join(process.cwd(), 'data', 'questions.json');
    const questionsData = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));
    res.json(questionsData);
  } catch (error) {
    console.error('Erro ao carregar perguntas:', error);
    res.status(500).json({ error: error.message });
  }
};
