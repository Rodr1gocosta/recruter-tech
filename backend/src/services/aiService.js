import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateInterviewReport(data) {
  const {
    candidateName,
    candidateEmail,
    recruiter,
    interviewDateTime,
    technicalReference,
    jobNumber,
    client,
    jobTitle,
    jobLink,
    experienceNotes,
    technicalAnswers,
    resumeText,
    finalNotes
  } = data;

  const prompt = `
Você é um especialista em recrutamento técnico. Gere um relatório profissional e detalhado de entrevista técnica com base nas seguintes informações:

**INFORMAÇÕES DA ENTREVISTA**
Candidato: ${candidateName}
Email: ${candidateEmail}
Cliente: ${client}
Título da Vaga: ${jobTitle}
${jobNumber ? `Número da Vaga: ${jobNumber}` : ''}
Link da Vaga: ${jobLink}
Data/Hora da Entrevista: ${interviewDateTime}
Referência Técnica: ${technicalReference}
Responsável RH: ${recruiter}

**CURRÍCULO (RESUMO)**
${resumeText || 'Não fornecido'}

**ETAPA 1: EXPERIÊNCIA PROFISSIONAL (15 min)**
${experienceNotes.mainExperiences ? `Experiências Principais: ${experienceNotes.mainExperiences}` : ''}
${experienceNotes.technologies ? `Tecnologias Usadas: ${experienceNotes.technologies}` : ''}
${experienceNotes.challenges ? `Desafios Resolvidos: ${experienceNotes.challenges}` : ''}
${experienceNotes.strengths ? `Pontos Fortes Percebidos: ${experienceNotes.strengths}` : ''}
${experienceNotes.communication ? `Comunicação: ${experienceNotes.communication}` : ''}

**ETAPA 2: AVALIAÇÃO TÉCNICA (15 min)**
${formatTechnicalAnswers(technicalAnswers)}

**NOTAS FINAIS DO RECRUTADOR**
${finalNotes}

Por favor, gere um relatório estruturado contendo:

1. **RESUMO EXECUTIVO**: Uma análise geral do candidato (2-3 parágrafos)
2. **ANÁLISE DE EXPERIÊNCIA**: Avaliação detalhada da experiência profissional
3. **ANÁLISE TÉCNICA**: Avaliação das respostas técnicas com pontuação total
4. **PONTOS FORTES**: Liste os principais pontos fortes identificados
5. **PONTOS DE ATENÇÃO**: Áreas que merecem atenção ou desenvolvimento
6. **RECOMENDAÇÃO FINAL**: Baseado em todas as informações, o candidato é APROVADO, APROVADO COM RESSALVAS ou NÃO APROVADO?

Use um tom profissional e objetivo. Seja específico e forneça exemplos quando possível.
`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'Você é um especialista em recrutamento técnico que gera relatórios detalhados e profissionais de entrevistas.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Erro ao gerar relatório com OpenAI:', error);
    throw new Error('Falha ao gerar relatório com IA');
  }
}

function formatTechnicalAnswers(answers) {
  if (!answers || answers.length === 0) {
    return 'Nenhuma resposta técnica registrada';
  }

  let formatted = '';
  let totalScore = 0;
  let maxTotalScore = 0;

  answers.forEach((answer, index) => {
    formatted += `\nPergunta ${index + 1}: ${answer.question}\n`;
    formatted += `Resposta: ${answer.answer || 'Não respondida'}\n`;
    formatted += `Pontuação: ${answer.score}/${answer.maxScore}\n`;
    
    totalScore += answer.score || 0;
    maxTotalScore += answer.maxScore || 5;
  });

  formatted += `\n**PONTUAÇÃO TOTAL: ${totalScore}/${maxTotalScore} (${((totalScore/maxTotalScore) * 100).toFixed(1)}%)**`;

  return formatted;
}

export default {
  generateInterviewReport
};
