<template>
  <div>
    <h2 class="text-2xl font-bold text-white mb-2">4️⃣ Geração do Relatório Final</h2>
    <p class="text-white mb-6">Adicione suas notas finais e gere o relatório completo da entrevista.</p>

    <div v-if="!report" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-white mb-2">
          Situação *
        </label>
        <select 
          v-model="situation"
          class="input-field"
          required
        >
          <option value="" disabled>Selecione a situação do candidato</option>
          <option value="Aprovado">Aprovado</option>
          <option value="Reprovado">Reprovado</option>
          <option value="Banco de Talentos">Banco de Talentos</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-white mb-2">
          Notas Finais / Recomendação
        </label>
        <textarea 
          v-model="finalNotes"
          class="input-field"
          rows="5"
          placeholder="Adicione suas observações finais sobre o candidato e se você o recomenda ou não para a vaga..."
        ></textarea>
      </div>

      <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {{ error }}
      </div>

      <div v-if="generating" class="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded flex items-center">
        <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-700 mr-3"></div>
        Gerando relatório com IA... Isso pode levar alguns segundos.
      </div>

      <div class="flex justify-between mt-8">
        <button @click="emit('back')" :disabled="generating" class="btn-secondary">
          ← Voltar
        </button>
        <button 
          @click="handleGenerateReport"
          :disabled="generating || !finalNotes.trim() || !situation"
          class="btn-primary"
        >
          {{ generating ? 'Gerando...' : '✨ Gerar Relatório com IA' }}
        </button>
      </div>
    </div>

    <!-- Relatório Gerado -->
    <div v-else class="space-y-6">
      <div class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded flex items-center">
        <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
        </svg>
        Relatório gerado com sucesso!
      </div>

      <!-- Informações do Candidato -->
      <div class="bg-gray-50 p-4 rounded-lg">
        <h3 class="font-semibold text-white mb-3">Informações da Entrevista</h3>
        <div class="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span class="text-white">Candidato:</span>
            <span class="ml-2 font-medium">{{ props.data.candidateInfo.name }}</span>
          </div>
          <div>
            <span class="text-white">Email:</span>
            <span class="ml-2 font-medium">{{ props.data.candidateInfo.email }}</span>
          </div>
          <div>
            <span class="text-white">Cliente:</span>
            <span class="ml-2 font-medium">{{ props.data.candidateInfo.client }}</span>
          </div>
          <div>
            <span class="text-white">Título da Vaga:</span>
            <span class="ml-2 font-medium">{{ props.data.candidateInfo.jobTitle }}</span>
          </div>
          <div>
            <span class="text-white">Ref. Técnica:</span>
            <span class="ml-2 font-medium">{{ props.data.candidateInfo.technicalReference }}</span>
          </div>
          <div>
            <span class="text-white">Responsável RH:</span>
            <span class="ml-2 font-medium">{{ props.data.candidateInfo.recruiter }}</span>
          </div>
          <div>
            <span class="text-white">Data/Hora:</span>
            <span class="ml-2 font-medium">{{ formatDateTime(props.data.candidateInfo.interviewDateTime) }}</span>
          </div>
          <div v-if="props.data.candidateInfo.jobNumber">
            <span class="text-white">Nº Vaga:</span>
            <span class="ml-2 font-medium">{{ props.data.candidateInfo.jobNumber }}</span>
          </div>
          <div>
            <span class="text-white">Situação:</span>
            <span class="ml-2 font-medium" :class="{
              'text-green-700 font-bold': situation === 'Aprovado',
              'text-red-700 font-bold': situation === 'Reprovado',
              'text-blue-700 font-bold': situation === 'Banco de Talentos'
            }">{{ situation }}</span>
          </div>
        </div>
      </div>

      <!-- Relatório -->
      <div class="bg-white border border-gray-200 rounded-lg p-6">
        <div class="prose max-w-none" v-html="formattedReport"></div>
      </div>

      <!-- Ações -->
      <div class="flex justify-between items-center">
        <button @click="handleReset" class="btn-secondary">
          🔄 Nova Entrevista
        </button>
        <a 
          :href="downloadUrl" 
          target="_blank"
          class="btn-primary inline-flex items-center"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          Download PDF
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { interviewAPI } from '../services/api';

const props = defineProps(['data']);
const emit = defineEmits(['back', 'update']);

const situation = ref(props.data.situation || '');
const finalNotes = ref(props.data.finalNotes || '');
const generating = ref(false);
const error = ref('');
const report = ref(props.data.report || null);
const pdfFileName = ref(props.data.pdfFileName || null);

const downloadUrl = computed(() => {
  if (!pdfFileName.value) return '#';
  return interviewAPI.downloadPDF(pdfFileName.value);
});

const formattedReport = computed(() => {
  if (!report.value) return '';
  
  // Converter markdown básico para HTML
  let html = report.value
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^\d+\.\s(.+)$/gm, '<h3 class="text-lg font-bold text-white mt-4 mb-2">$1</h3>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/\n\n/g, '</p><p class="mb-3">')
    .replace(/^(.+)$/gm, '<p class="mb-3">$1</p>');
  
  return html;
});

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('pt-BR');
};

const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return '';
  const date = new Date(dateTimeString);
  return date.toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short'
  });
};

const handleGenerateReport = async () => {
  try {
    generating.value = true;
    error.value = '';

    const response = await interviewAPI.generateReport(
      props.data.sessionId,
      props.data.candidateInfo,
      finalNotes.value
    );

    report.value = response.data.report;
    pdfFileName.value = response.data.pdfFileName;

    emit('update', 'report', report.value);
    emit('update', 'pdfFileName', pdfFileName.value);
    emit('update', 'finalNotes', finalNotes.value);
    emit('update', 'situation', situation.value);

  } catch (err) {
    error.value = err.response?.data?.error || 'Erro ao gerar relatório. Verifique se a API Key do OpenAI está configurada corretamente.';
  } finally {
    generating.value = false;
  }
};

const handleReset = () => {
  if (confirm('Deseja iniciar uma nova entrevista? Os dados atuais serão perdidos.')) {
    window.location.reload();
  }
};
</script>
