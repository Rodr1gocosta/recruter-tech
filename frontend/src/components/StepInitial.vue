<template>
  <div>
    <h2 class="text-2xl font-bold text-white mb-6">1️⃣ Informações Iniciais</h2>
    
    <div class="space-y-4">
      <!-- Data e Hora da Entrevista -->
      <div>
        <label class="block text-sm font-medium text-white mb-2">
          Data e Hora da Entrevista *
        </label>
        <input 
          v-model="localData.interviewDateTime"
          type="datetime-local" 
          class="input-field"
          required
        />
      </div>

      <!-- Referência Técnica -->
      <div>
        <label class="block text-sm font-medium text-white mb-2">
          Referência Técnica *
        </label>
        <input 
          v-model="localData.technicalReference"
          type="text" 
          class="input-field"
          placeholder="Nome do responsável técnico"
          required
        />
      </div>

      <!-- Número da Vaga (Opcional) -->
      <div>
        <label class="block text-sm font-medium text-white mb-2">
          Número da Vaga <span class="text-gray-400 text-xs">(Opcional)</span>
        </label>
        <input 
          v-model="localData.jobNumber"
          type="text" 
          class="input-field"
          placeholder="Ex: REQ-2024-001"
        />
      </div>

      <!-- Cliente -->
      <div>
        <label class="block text-sm font-medium text-white mb-2">
          Cliente *
        </label>
        <select 
          v-model="localData.client"
          class="input-field"
          required
        >
          <option value="" disabled>Selecione o cliente</option>
          <option value="Sicoob">Sicoob</option>
          <option value="Santander">Santander</option>
          <option value="Banco do Brasil">Banco do Brasil</option>
          <option value="Bradesco">Bradesco</option>
          <option value="Itaú">Itaú</option>
          <option value="Caixa Econômica Federal">Caixa Econômica Federal</option>
          <option value="Nubank">Nubank</option>
          <option value="Inter">Inter</option>
          <option value="BTG Pactual">BTG Pactual</option>
          <option value="Outro">Outro</option>
        </select>
      </div>

      <!-- Título da Vaga -->
      <div>
        <label class="block text-sm font-medium text-white mb-2">
          Título da Vaga *
        </label>
        <select 
          v-model="localData.jobTitle"
          class="input-field"
          required
        >
          <option value="" disabled>Selecione o título da vaga</option>
          <optgroup label="Desenvolvedor Java">
            <option value="Desenvolvedor Java Junior">Desenvolvedor Java Junior</option>
            <option value="Desenvolvedor Java Pleno">Desenvolvedor Java Pleno</option>
            <option value="Desenvolvedor Java Senior">Desenvolvedor Java Senior</option>
            <option value="Desenvolvedor Java Especialista">Desenvolvedor Java Especialista</option>
          </optgroup>
          <optgroup label="Desenvolvedor FullStack">
            <option value="Desenvolvedor FullStack Junior">Desenvolvedor FullStack Junior</option>
            <option value="Desenvolvedor FullStack Pleno">Desenvolvedor FullStack Pleno</option>
            <option value="Desenvolvedor FullStack Senior">Desenvolvedor FullStack Senior</option>
          </optgroup>
          <optgroup label="Outras Posições">
            <option value="Arquiteto de Software">Arquiteto de Software</option>
            <option value="Tech Lead">Tech Lead</option>
            <option value="Engenheiro de Software">Engenheiro de Software</option>
            <option value="DevOps Engineer">DevOps Engineer</option>
            <option value="Analista de Sistemas">Analista de Sistemas</option>
          </optgroup>
        </select>
      </div>

      <!-- Link da Vaga -->
      <div>
        <label class="block text-sm font-medium text-white mb-2">
          Link da Vaga *
        </label>
        <input 
          v-model="localData.jobLink"
          type="url" 
          class="input-field"
          placeholder="https://..."
          required
        />
      </div>

      <!-- Nome Completo do Candidato -->
      <div>
        <label class="block text-sm font-medium text-white mb-2">
          Nome Completo do Candidato *
        </label>
        <input 
          v-model="localData.name"
          type="text" 
          class="input-field"
          placeholder="Digite o nome completo"
          required
        />
      </div>

      <!-- Email do Candidato -->
      <div>
        <label class="block text-sm font-medium text-white mb-2">
          Email do Candidato *
        </label>
        <input 
          v-model="localData.email"
          type="email" 
          class="input-field"
          placeholder="email@exemplo.com"
          required
        />
      </div>

      <!-- Nome Responsável RH -->
      <div>
        <label class="block text-sm font-medium text-white mb-2">
          Nome Responsável RH *
        </label>
        <input 
          v-model="localData.recruiter"
          type="text" 
          class="input-field"
          placeholder="Nome do responsável RH"
          required
        />
      </div>

      <!-- Currículo PDF -->
      <div>
        <label class="block text-sm font-medium text-white mb-2">
          Currículo (PDF) *
        </label>
        <div 
          @drop.prevent="handleDrop"
          @dragover.prevent
          class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-500 transition cursor-pointer"
          @click="$refs.fileInput.click()"
        >
          <input 
            ref="fileInput"
            type="file" 
            accept=".pdf"
            class="hidden"
            @change="handleFileSelect"
          />
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p class="mt-2 text-sm text-white" v-if="!selectedFile">
            Clique ou arraste o arquivo PDF aqui
          </p>
          <p class="mt-2 text-sm text-primary-600 font-medium" v-else>
            ✓ {{ selectedFile.name }}
          </p>
        </div>
      </div>

      <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {{ error }}
      </div>

      <div v-if="uploading" class="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded">
        Processando currículo...
      </div>
    </div>

    <div class="flex justify-end mt-8">
      <button 
        @click="handleSubmit"
        :disabled="!isValid || uploading"
        class="btn-primary"
      >
        {{ uploading ? 'Processando...' : 'Próxima Etapa →' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { interviewAPI } from '../services/api';

const props = defineProps(['data']);
const emit = defineEmits(['next', 'update']);

// Função para gerar datetime-local padrão
const getDefaultDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const localData = reactive({
  interviewDateTime: props.data.candidateInfo.interviewDateTime || getDefaultDateTime(),
  technicalReference: props.data.candidateInfo.technicalReference || '',
  jobNumber: props.data.candidateInfo.jobNumber || '',
  client: props.data.candidateInfo.client || '',
  jobTitle: props.data.candidateInfo.jobTitle || '',
  jobLink: props.data.candidateInfo.jobLink || '',
  name: props.data.candidateInfo.name || '',
  email: props.data.candidateInfo.email || '',
  recruiter: props.data.candidateInfo.recruiter || ''
});

const selectedFile = ref(null);
const uploading = ref(false);
const error = ref('');

const isValid = computed(() => {
  return localData.interviewDateTime && 
         localData.technicalReference && 
         localData.client && 
         localData.jobTitle && 
         localData.jobLink && 
         localData.name && 
         localData.email && 
         localData.recruiter &&
         selectedFile.value;
});

const handleFileSelect = (event) => {
  const file = event.target.files[0];
  if (file && file.type === 'application/pdf') {
    selectedFile.value = file;
    error.value = '';
  } else {
    error.value = 'Por favor, selecione um arquivo PDF válido';
  }
};

const handleDrop = (event) => {
  const file = event.dataTransfer.files[0];
  if (file && file.type === 'application/pdf') {
    selectedFile.value = file;
    error.value = '';
  } else {
    error.value = 'Por favor, selecione um arquivo PDF válido';
  }
};

const handleSubmit = async () => {
  if (!isValid.value) return;

  try {
    uploading.value = true;
    error.value = '';

    // Upload do currículo
    const formData = new FormData();
    formData.append('resume', selectedFile.value);

    const response = await interviewAPI.uploadResume(formData);
    
    // Atualizar dados
    emit('update', 'sessionId', response.data.sessionId);
    emit('update', 'candidateInfo.interviewDateTime', localData.interviewDateTime);
    emit('update', 'candidateInfo.technicalReference', localData.technicalReference);
    emit('update', 'candidateInfo.jobNumber', localData.jobNumber);
    emit('update', 'candidateInfo.client', localData.client);
    emit('update', 'candidateInfo.jobTitle', localData.jobTitle);
    emit('update', 'candidateInfo.jobLink', localData.jobLink);
    emit('update', 'candidateInfo.name', localData.name);
    emit('update', 'candidateInfo.email', localData.email);
    emit('update', 'candidateInfo.recruiter', localData.recruiter);

    emit('next');
  } catch (err) {
    error.value = err.response?.data?.error || 'Erro ao processar dados';
  } finally {
    uploading.value = false;
  }
};
</script>
