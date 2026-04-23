import OpenAI from 'openai';
import dotenv from 'dotenv';
import https from 'https';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Anthropic from '@anthropic-ai/sdk';

dotenv.config();

export async function generateInterviewReport(data, apiKey = null, provider = 'openai', apiKeysArray = null) {
  // Se apiKeysArray foi fornecido, tenta múltiplas chaves em ordem
  if (apiKeysArray && Array.isArray(apiKeysArray) && apiKeysArray.length > 0) {
    let lastError = null;
    
    // Tenta cada chave na ordem de prioridade
    for (let i = 0; i < apiKeysArray.length; i++) {
      const keyConfig = apiKeysArray[i];
      console.log(`🔑 Tentando provedor: ${keyConfig.provider} (chave #${i + 1}/${apiKeysArray.length})`);
      
      try {
        const result = await generateWithProvider(data, keyConfig.key, keyConfig.provider);
        console.log(`✅ Sucesso com ${keyConfig.provider} (chave #${i + 1})`);
        return result;
      } catch (error) {
        lastError = error;
        console.error(`❌ Falha com ${keyConfig.provider} (chave #${i + 1}):`, error.message);
        
        // Se não é a última chave, continua tentando
        if (i < apiKeysArray.length - 1) {
          console.log(`⏭️ Tentando próxima chave...`);
          continue;
        }
      }
    }
    
    // Se chegou aqui, todas as chaves falharam
    throw new Error(`Todas as ${apiKeysArray.length} chaves de API falharam. Último erro: ${lastError?.message || 'Desconhecido'}`);
  }
  
  // Fallback para o sistema antigo de chave única
  const key = apiKey || process.env.OPENAI_API_KEY;
  
  if (!key) {
    throw new Error(`API Key não fornecida. Configure a chave nas configurações.`);
  }

  return await generateWithProvider(data, key, provider);
}

async function generateWithProvider(data, apiKey, provider) {
  // Direcionar para o provedor correto
  switch (provider) {
    case 'openai':
      return await generateWithOpenAI(data, apiKey);
    case 'gemini':
      return await generateWithGemini(data, apiKey);
    case 'anthropic':
      return await generateWithAnthropic(data, apiKey);
    case 'groq':
      return await generateWithGroq(data, apiKey);
    case 'cohere':
      return await generateWithCohere(data, apiKey);
    default:
      return await generateWithOpenAI(data, apiKey);
  }
}

async function generateWithOpenAI(data, apiKey) {
  // Criar agente HTTPS que aceita certificados auto-assinados
  // Necessário em ambientes corporativos com proxies/firewalls
  const httpsAgent = new https.Agent({
    rejectUnauthorized: false
  });

  const openai = new OpenAI({
    apiKey: apiKey,
    httpAgent: httpsAgent,
  });

  const prompt = buildPrompt(data);

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-5.4-mini',
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
      max_completion_tokens: 2000
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Erro ao gerar relatório com OpenAI:', error);
    const msg = error?.error?.message || error?.message || 'Erro desconhecido na OpenAI';
    throw new Error(`OpenAI: ${msg}`);
  }
}

async function generateWithGemini(data, apiKey) {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-3.0-flash" });

  const prompt = buildPrompt(data);
  
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Erro ao gerar relatório com Gemini:', error);
    const msg = error?.message || 'Erro desconhecido no Gemini';
    throw new Error(`Gemini: ${msg}`);
  }
}

async function generateWithAnthropic(data, apiKey) {
  const anthropic = new Anthropic({
    apiKey: apiKey,
  });

  const prompt = buildPrompt(data);
  
  try {
    const message = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 2000,
      temperature: 0.5,
      messages: [
        {
          role: "user",
          content: prompt
        }
      ]
    });

    return message.content[0].text;
  } catch (error) {
    console.error('Erro ao gerar relatório com Anthropic:', error);
    const msg = error?.error?.error?.message || error?.message || 'Erro desconhecido no Anthropic';
    throw new Error(`Anthropic: ${msg}`);
  }
}

async function generateWithGroq(data, apiKey) {
  // Groq usa a API compatível com OpenAI
  const httpsAgent = new https.Agent({
    rejectUnauthorized: false
  });

  const groq = new OpenAI({
    apiKey: apiKey,
    baseURL: 'https://api.groq.com/openai/v1',
    httpAgent: httpsAgent,
  });

  const prompt = buildPrompt(data);
  
  try {
    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
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
    console.error('Erro ao gerar relatório com Groq:', error);
    const msg = error?.error?.message || error?.message || 'Erro desconhecido no Groq';
    throw new Error(`Groq: ${msg}`);
  }
}

async function generateWithCohere(data, apiKey) {
  const prompt = buildPrompt(data);
  
  try {
    const response = await fetch('https://api.cohere.ai/v1/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'command',
        prompt: `Você é um especialista técnico em recrutamento que gera relatórios objetivos e estruturados de entrevistas técnicas. Siga rigorosamente o formato solicitado e baseie-se apenas nas informações fornecidas.\n\n${prompt}`,
        max_tokens: 2000,
        temperature: 0.5,
      })
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Erro na API Cohere');
    }
    
    return result.generations[0].text;
  } catch (error) {
    console.error('Erro ao gerar relatório com Cohere:', error);
    const msg = error?.message || 'Erro desconhecido no Cohere';
    throw new Error(`Cohere: ${msg}`);
  }
}

function buildPrompt(data) {
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

  return `
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

// ── Validação de chave ─────────────────────────────────────────────────────

export async function validateApiKey(apiKey, provider) {
  switch (provider) {
    case 'openai':
      return await validateOpenAI(apiKey);
    case 'gemini':
      return await validateGemini(apiKey);
    case 'anthropic':
      return await validateAnthropic(apiKey);
    case 'groq':
      return await validateGroq(apiKey);
    case 'cohere':
      return await validateCohere(apiKey);
    default:
      throw new Error(`Provedor desconhecido: ${provider}`);
  }
}

async function validateOpenAI(apiKey) {
  const httpsAgent = new https.Agent({ rejectUnauthorized: false });
  const openai = new OpenAI({ apiKey, httpAgent: httpsAgent });
  try {
    await openai.models.list();
  } catch (error) {
    const msg = error?.error?.message || error?.message || 'Chave inválida';
    throw new Error(`OpenAI: ${msg}`);
  }
}

async function validateGemini(apiKey) {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-3.0-flash' });
  try {
    await model.generateContent({ contents: [{ role: 'user', parts: [{ text: 'ok' }] }], generationConfig: { maxOutputTokens: 1 } });
  } catch (error) {
    const msg = error?.message || 'Chave inválida';
    throw new Error(`Gemini: ${msg}`);
  }
}

async function validateAnthropic(apiKey) {
  const anthropic = new Anthropic({ apiKey });
  try {
    await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1,
      messages: [{ role: 'user', content: 'ok' }]
    });
  } catch (error) {
    const msg = error?.error?.error?.message || error?.message || 'Chave inválida';
    throw new Error(`Anthropic: ${msg}`);
  }
}

async function validateGroq(apiKey) {
  const httpsAgent = new https.Agent({ rejectUnauthorized: false });
  const groq = new OpenAI({ apiKey, baseURL: 'https://api.groq.com/openai/v1', httpAgent: httpsAgent });
  try {
    await groq.models.list();
  } catch (error) {
    const msg = error?.error?.message || error?.message || 'Chave inválida';
    throw new Error(`Groq: ${msg}`);
  }
}

async function validateCohere(apiKey) {
  try {
    const response = await fetch('https://api.cohere.ai/v1/tokenize', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: 'ok', model: 'command' })
    });
    if (!response.ok) {
      const result = await response.json().catch(() => ({}));
      throw new Error(result.message || `HTTP ${response.status}`);
    }
  } catch (error) {
    const msg = error?.message || 'Chave inválida';
    throw new Error(`Cohere: ${msg}`);
  }
}

export default {
  generateInterviewReport,
  validateApiKey
};
