<template>
  <div>
    <h2 class="text-2xl font-bold text-white mb-6">1️⃣ Informações Iniciais</h2>
    
    <!-- API Key Warning -->
    <div v-if="!hasApiKey" class="bg-red-900/30 border border-red-600/50 rounded-lg p-4 mb-6">
      <div class="flex items-start gap-3">
        <svg class="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <div class="flex-1">
          <h3 class="text-red-400 font-semibold mb-1">⚠️ Chave da API OpenAI não configurada</h3>
          <p class="text-red-300 text-sm mb-3">
            Para gerar relatórios com IA, você precisa configurar sua chave da API OpenAI.
            Clique no botão "Configurações" no canto superior direito da tela.
          </p>
          <p class="text-red-200 text-xs">
            <a href="https://platform.openai.com/api-keys" target="_blank" class="underline hover:text-white">
              Obter chave da API aqui →
            </a>
          </p>
        </div>
      </div>
    </div>
    
    <!-- Form Grid -->
    <!-- Primeira linha: 4 campos -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
          Link da Vaga <span class="text-gray-400 text-xs">(Opcional)</span>
        </label>
        <input 
          v-model="localData.jobLink"
          type="url" 
          class="input-field"
          placeholder="https://..."
        />
      </div>
    </div>

    <!-- Segunda linha: 2 campos -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <!-- Referência Técnica -->
      <div>
        <label class="block text-sm font-medium text-white mb-2">
          Referência Técnica *
        </label>
        <select 
          v-model="selectedTechnical"
          @change="handleTechnicalChange"
          class="input-field"
          required
        >
          <option value="" disabled>Selecione a referência técnica</option>
          <option v-for="(item, index) in technicalReferences" :key="index" :value="item">{{ item }}</option>
          <option value="__other__">Outro (digitar manualmente)</option>
        </select>
        <input 
          v-if="showTechnicalInput"
          v-model="localData.technicalReference"
          type="text" 
          class="input-field mt-2"
          placeholder="Digite o nome do responsável técnico"
          required
        />
      </div>

      <!-- Nome Responsável RH -->
      <div>
        <label class="block text-sm font-medium text-white mb-2">
          Nome Responsável RH *
        </label>
        <select 
          v-model="selectedRecruiter"
          @change="handleRecruiterChange"
          class="input-field"
          required
        >
          <option value="" disabled>Selecione o responsável RH</option>
          <option v-for="(item, index) in recruiters" :key="index" :value="item">{{ item }}</option>
          <option value="__other__">Outro (digitar manualmente)</option>
        </select>
        <input 
          v-if="showRecruiterInput"
          v-model="localData.recruiter"
          type="text" 
          class="input-field mt-2"
          placeholder="Digite o nome do responsável RH"
          required
        />
      </div>
    </div>

    <!-- Terceira linha: 2 campos -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
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

      <!-- Cliente -->
      <div>
        <label class="block text-sm font-medium text-white mb-2">
          Cliente *
        </label>
        <select 
          v-model="selectedClient"
          @change="handleClientChange"
          class="input-field"
          required
        >
          <option value="" disabled>Selecione o cliente</option>
          <option v-for="(item, index) in clients" :key="index" :value="item">{{ item }}</option>
          <option value="__other__">Outro (digitar manualmente)</option>
        </select>
        <input 
          v-if="showClientInput"
          v-model="localData.client"
          type="text" 
          class="input-field mt-2"
          placeholder="Digite o nome do cliente"
          required
        />
      </div>
    </div>

    <!-- Currículo PDF - Full Width -->
    <div class="mt-6">
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
    </div>

    <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mt-6">
      {{ error }}
    </div>

    <div v-if="uploading" class="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded mt-6">
      Processando currículo...
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
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import { interviewAPI } from '../services/api';
import { getStorage } from '../utils/storage.js';

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

// CRUD data
const technicalReferences = ref([]);
const clients = ref([]);
const recruiters = ref([]);

// Selected values
const selectedTechnical = ref('');
const selectedClient = ref('');
const selectedRecruiter = ref('');

// Show manual input
const showTechnicalInput = ref(false);
const showClientInput = ref(false);
const showRecruiterInput = ref(false);

// Load CRUD data
const loadCrudData = () => {
  technicalReferences.value = getStorage('technicalReferences', []);
  clients.value = getStorage('clients', []);
  recruiters.value = getStorage('recruiters', []);
};

// Handle changes
const handleTechnicalChange = () => {
  if (selectedTechnical.value === '__other__') {
    showTechnicalInput.value = true;
    localData.technicalReference = '';
  } else {
    showTechnicalInput.value = false;
    localData.technicalReference = selectedTechnical.value;
  }
};

const handleClientChange = () => {
  if (selectedClient.value === '__other__') {
    showClientInput.value = true;
    localData.client = '';
  } else {
    showClientInput.value = false;
    localData.client = selectedClient.value;
  }
};

const handleRecruiterChange = () => {
  if (selectedRecruiter.value === '__other__') {
    showRecruiterInput.value = true;
    localData.recruiter = '';
  } else {
    showRecruiterInput.value = false;
    localData.recruiter = selectedRecruiter.value;
  }
};

onMounted(() => {
  loadCrudData();
  
  // Listen for CRUD updates
  const handleCrudUpdate = () => {
    loadCrudData();
  };
  window.addEventListener('crud-data-updated', handleCrudUpdate);
  
  // Cleanup
  onUnmounted(() => {
    window.removeEventListener('crud-data-updated', handleCrudUpdate);
  });
  
  // Set initial values if exists
  if (props.data.candidateInfo.technicalReference) {
    if (technicalReferences.value.includes(props.data.candidateInfo.technicalReference)) {
      selectedTechnical.value = props.data.candidateInfo.technicalReference;
    } else {
      selectedTechnical.value = '__other__';
      showTechnicalInput.value = true;
    }
  }
  
  if (props.data.candidateInfo.client) {
    if (clients.value.includes(props.data.candidateInfo.client)) {
      selectedClient.value = props.data.candidateInfo.client;
    } else {
      selectedClient.value = '__other__';
      showClientInput.value = true;
    }
  }
  
  if (props.data.candidateInfo.recruiter) {
    if (recruiters.value.includes(props.data.candidateInfo.recruiter)) {
      selectedRecruiter.value = props.data.candidateInfo.recruiter;
    } else {
      selectedRecruiter.value = '__other__';
      showRecruiterInput.value = true;
    }
  }
});

const localData = reactive({
  interviewDateTime: props.data.candidateInfo.interviewDateTime || getDefaultDateTime(),
  technicalReference: props.data.candidateInfo.technicalReference || '',
  jobNumber: props.data.candidateInfo.jobNumber || '',
  client: props.data.candidateInfo.client || '',
  jobTitle: props.data.candidateInfo.jobTitle || '',
  jobLink: props.data.candidateInfo.jobLink || '',
  name: props.data.candidateInfo.name || '',
  recruiter: props.data.candidateInfo.recruiter || ''
});

const selectedFile = ref(null);
const uploading = ref(false);
const error = ref('');

const hasApiKey = computed(() => {
  const keys = getStorage('api_keys', []);
  const hasActiveKey = keys.some(k => k.enabled && k.key && k.key.trim().length > 0);
  
  if (!hasActiveKey) {
    // Fallback para chave antiga
    const oldKey = getStorage('openai_api_key');
    return oldKey && oldKey.trim().length > 0;
  }
  return true;
});

const isValid = computed(() => {
  return selectedFile.value;
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
    emit('update', 'candidateInfo.recruiter', localData.recruiter);

    emit('next');
  } catch (err) {
    error.value = err.response?.data?.error || 'Erro ao processar dados';
  } finally {
    uploading.value = false;
  }
};
</script>
