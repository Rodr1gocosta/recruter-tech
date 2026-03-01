import OpenAI from 'openai';
import dotenv from 'dotenv';
import https from 'https';

dotenv.config();

export async function generateInterviewReport(data, apiKey = null) {
  // Usar a chave fornecida ou fallback para a variável de ambiente
  const key = apiKey || process.env.OPENAI_API_KEY;
  
  if (!key) {
    throw new Error('API Key da OpenAI não fornecida. Configure a chave nas configurações.');
  }

  // Criar agente HTTPS que aceita certificados auto-assinados
  // Necessário em ambientes corporativos com proxies/firewalls
  const httpsAgent = new https.Agent({
    rejectUnauthorized: false
  });

  const openai = new OpenAI({
    apiKey: key,
    httpAgent: httpsAgent,
  });
  const {
    candidateName,
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
    finalNotes,
    situation
  } = data;

  const prompt = `
Gere um relatório técnico de entrevista no padrão estabelecido abaixo. Use como base:
1. A validação técnica feita durante a entrevista (informações coletadas pelo entrevistador)
2. O currículo do candidato

**INFORMAÇÕES DA ENTREVISTA**
Candidato: ${candidateName}
Cliente: ${client}
Título da Vaga: ${jobTitle}
${jobNumber ? `Número da Vaga: ${jobNumber}` : ''}
Link da Vaga: ${jobLink}
Data/Hora da Entrevista: ${interviewDateTime}
Referência Técnica: ${technicalReference}
Responsável RH: ${recruiter}

**CURRÍCULO DO CANDIDATO**
${resumeText || 'Não fornecido'}

**EXPERIÊNCIA PROFISSIONAL VALIDADA NA ENTREVISTA**
${experienceNotes.mainExperiences ? `Experiências Principais: ${experienceNotes.mainExperiences}` : ''}
${experienceNotes.technologies ? `Tecnologias Usadas: ${experienceNotes.technologies}` : ''}
${experienceNotes.challenges ? `Desafios Resolvidos: ${experienceNotes.challenges}` : ''}
${experienceNotes.strengths ? `Pontos Fortes Percebidos: ${experienceNotes.strengths}` : ''}
${experienceNotes.communication ? `Comunicação: ${experienceNotes.communication}` : ''}

**AVALIAÇÃO TÉCNICA**
${formatTechnicalAnswers(technicalAnswers)}

**AVALIAÇÃO FINAL DO ENTREVISTADOR**
Situação: ${situation || 'Não informada'}
Notas Finais: ${finalNotes}

---

**FORMATO DO RELATÓRIO** (siga rigorosamente este padrão):

Candidato: ${candidateName}
Perfil: [Júnior / Pleno / Sênior / Especialista]

Experiência Validada:
- Java (versões):
- JavaEE/JakartaEE:
- Frameworks:
- Arquitetura:
- Persistência:
- Banco de Dados:
- Mensageria:
- CI/CD:
- Nuvem:
- Observabilidade:
- Boas práticas:
- Testes:
- Front-end:
- Metodologias:
- Outras observações relevantes:

Análise Final:
[Escreva uma síntese crítica OBJETIVA e CONCISA em NO MÁXIMO 5 LINHAS considerando: currículo, experiências validadas na entrevista, desempenho técnico (pontuações e observações), situação (${situation || 'não informada'}) e notas do entrevistador. Seja direto e conclusivo.]

---

INSTRUÇÕES:
- Preencha cada item de "Experiência Validada" com base nas informações fornecidas do currículo e da validação técnica
- Se alguma informação não estiver disponível, indique "Não validado" ou "Não informado"
- Na Análise Final, seja CONCISO (MÁXIMO 5 LINHAS) e baseie-se em:
  * Currículo do candidato
  * Avaliação Técnica - considere a pontuação total (${formatTechnicalAnswers(technicalAnswers).includes('PONTUAÇÃO TOTAL') ? 'incluída acima' : ''}) e as observações das respostas
  * Experiência Profissional validada durante a entrevista (principalmente: experiências principais, tecnologias, desafios resolvidos e pontos fortes)
  * Situação final (${situation || 'não informada'}) e Notas Finais do entrevistador
- A Análise Final deve ser uma síntese crítica direta que justifique a recomendação
- NÃO repita informações da seção "Experiência Validada"
- Seja objetivo e conclusivo
`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'Você é um especialista técnico em recrutamento que gera relatórios objetivos e estruturados de entrevistas técnicas. Siga rigorosamente o formato solicitado e baseie-se apenas nas informações fornecidas.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.5,
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
