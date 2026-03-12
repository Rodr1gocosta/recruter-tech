import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

// Path configurável via variável de ambiente
const UPLOADS_PATH = process.env.UPLOADS_PATH || path.join(process.cwd(), 'uploads');

export async function generatePDF(reportData, reportText) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50
      });

      const fileName = `relatorio-${reportData.candidateName.replace(/\s+/g, '-')}-${Date.now()}.pdf`;
      const filePath = path.join(UPLOADS_PATH, fileName);

      // Garantir que o diretório existe
      if (!fs.existsSync(UPLOADS_PATH)) {
        fs.mkdirSync(UPLOADS_PATH, { recursive: true });
      }

      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // Cabeçalho
      doc.fontSize(20)
         .fillColor('#2563eb')
         .text('RELATÓRIO DE ENTREVISTA TÉCNICA', { align: 'center' })
         .moveDown();

      doc.fontSize(10)
         .fillColor('#666666')
         .text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, { align: 'center' })
         .moveDown(2);

      // Linha separadora
      doc.moveTo(50, doc.y)
         .lineTo(550, doc.y)
         .strokeColor('#cccccc')
         .stroke()
         .moveDown();

      // Informações do Candidato
      doc.fontSize(14)
         .fillColor('#1f2937')
         .text('INFORMAÇÕES DA ENTREVISTA', { underline: true })
         .moveDown(0.5);

      // Formatar data
      const formatDate = (dateTimeString) => {
        if (!dateTimeString) return '';
        const date = new Date(dateTimeString);
        return date.toLocaleString('pt-BR', {
          dateStyle: 'short',
          timeStyle: 'short'
        });
      };

      doc.fontSize(11)
         .fillColor('#374151')
         .text(`Candidato: ${reportData.candidateName}`)
         .text(`Cliente: ${reportData.client}`)
         .text(`Título da Vaga: ${reportData.jobTitle}`)
         .text(`${reportData.jobNumber ? `Número da Vaga: ${reportData.jobNumber}` : ''}`)
         .text(`Data/Hora da Entrevista: ${formatDate(reportData.interviewDateTime)}`)
         .text(`Referência Técnica: ${reportData.technicalReference}`)
         .text(`Responsável RH: ${reportData.recruiter}`)
         .moveDown(1.5);

      // Linha separadora
      doc.moveTo(50, doc.y)
         .lineTo(550, doc.y)
         .strokeColor('#cccccc')
         .stroke()
         .moveDown();

      // Relatório gerado pela IA
      doc.fontSize(14)
         .fillColor('#1f2937')
         .text('RELATÓRIO DE AVALIAÇÃO', { underline: true })
         .moveDown(0.5);

      // Processar o texto do relatório
      const lines = reportText.split('\n');
      
      lines.forEach(line => {
        // Títulos em negrito (linhas que terminam com :)
        if (line.match(/^\*\*.*\*\*$/)) {
          doc.fontSize(12)
             .fillColor('#1f2937')
             .font('Helvetica-Bold')
             .text(line.replace(/\*\*/g, ''))
             .moveDown(0.3);
        } else if (line.match(/^\d+\.\s\*\*/)) {
          // Seções numeradas
          doc.fontSize(12)
             .fillColor('#2563eb')
             .font('Helvetica-Bold')
             .text(line.replace(/\*\*/g, ''))
             .moveDown(0.3);
        } else if (line.trim()) {
          // Texto normal
          doc.fontSize(10)
             .fillColor('#374151')
             .font('Helvetica')
             .text(line, { align: 'justify' })
             .moveDown(0.2);
        } else {
          doc.moveDown(0.5);
        }

        // Adicionar nova página se necessário
        if (doc.y > 700) {
          doc.addPage();
        }
      });

      // Rodapé
      doc.fontSize(8)
         .fillColor('#999999')
         .text(
           `Documento confidencial - Recruter Tech © ${new Date().getFullYear()}`,
           50,
           doc.page.height - 50,
           { align: 'center' }
         );

      doc.end();

      stream.on('finish', () => {
        resolve({ fileName, filePath });
      });

      stream.on('error', (error) => {
        reject(error);
      });

    } catch (error) {
      reject(error);
    }
  });
}

export default {
  generatePDF
};
