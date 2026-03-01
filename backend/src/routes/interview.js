import express from 'express';
import { upload } from '../config/multer.js';
import {
  uploadResume,
  saveExperienceData,
  saveTechnicalData,
  generateReport,
  downloadPDF,
  getQuestions
} from '../controllers/interviewController.js';

const router = express.Router();

// Rotas
router.post('/upload-resume', upload.single('resume'), uploadResume);
router.post('/experience', saveExperienceData);
router.post('/technical', saveTechnicalData);
router.post('/generate-report', generateReport);
router.get('/download/:fileName', downloadPDF);
router.get('/questions', getQuestions);

export default router;
