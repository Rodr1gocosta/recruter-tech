import pdf from 'pdf-parse';
import fs from 'fs';

export async function extractTextFromPDF(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
  } catch (error) {
    console.error('Erro ao extrair texto do PDF:', error);
    throw new Error('Falha ao processar o currículo PDF');
  }
}

export default {
  extractTextFromPDF
};
