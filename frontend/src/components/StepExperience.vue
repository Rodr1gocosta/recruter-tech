<template>
  <div>
    <h2 class="text-2xl font-bold text-white mb-2">2️⃣ Etapa Experiência (15 min)</h2>
    <p class="text-white mb-6">Anote as informações principais enquanto o candidato fala sobre suas experiências.</p>
    
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Formulário -->
      <div class="lg:col-span-2 order-1 lg:order-1 space-y-4">
      <div>
        <label class="block text-sm font-medium text-white mb-2">
          Experiências Principais
        </label>
        <textarea 
          v-model="localData.mainExperiences"
          class="input-field"
          rows="3"
          placeholder="Descreva as principais experiências profissionais mencionadas..."
        ></textarea>
      </div>

      <div>
        <label class="block text-sm font-medium text-white mb-2">
          Tecnologias Usadas
        </label>
        <textarea 
          v-model="localData.technologies"
          class="input-field"
          rows="3"
          placeholder="Liste as tecnologias e ferramentas que o candidato tem experiência..."
        ></textarea>
      </div>

      <div>
        <label class="block text-sm font-medium text-white mb-2">
          Desafios Resolvidos
        </label>
        <textarea 
          v-model="localData.challenges"
          class="input-field"
          rows="3"
          placeholder="Descreva os principais desafios que o candidato enfrentou e como resolveu..."
        ></textarea>
      </div>

      <div>
        <label class="block text-sm font-medium text-white mb-2">
          Pontos Fortes Percebidos
        </label>
        <textarea 
          v-model="localData.strengths"
          class="input-field"
          rows="3"
          placeholder="Anote os pontos fortes que você identificou durante a conversa..."
        ></textarea>
      </div>

      <div>
        <label class="block text-sm font-medium text-white mb-2">
          Comunicação
        </label>
        <div class="space-y-2">
          <label class="flex items-center space-x-2">
            <input type="radio" v-model="localData.communication" value="Excelente" class="text-primary-600" />
            <span class="text-white">Excelente - Comunicação clara, objetiva e articulada</span>
          </label>
          <label class="flex items-center space-x-2">
            <input type="radio" v-model="localData.communication" value="Boa" class="text-primary-600" />
            <span class="text-white">Boa - Comunicação adequada com pequenos pontos de melhoria</span>
          </label>
          <label class="flex items-center space-x-2">
            <input type="radio" v-model="localData.communication" value="Regular" class="text-primary-600" />
            <span class="text-white">Regular - Comunicação aceitável mas pode melhorar</span>
          </label>
          <label class="flex items-center space-x-2">
            <input type="radio" v-model="localData.communication" value="Fraca" class="text-primary-600" />
            <span class="text-white">Fraca - Dificuldade em se expressar ou organizar ideias</span>
          </label>
        </div>
      </div>

      <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {{ error }}
      </div>

      <div v-if="saving" class="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded">
        Salvando dados...
      </div>
      </div>

      <!-- Guia de Experiência -->
      <div class="lg:col-span-1 order-2 lg:order-2">
        <div class="sticky top-4 bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h3 class="font-bold text-blue-900 mb-3 flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            Guia de Experiência Validada
          </h3>
          <div class="space-y-3 text-sm max-h-[600px] overflow-y-auto pr-2">
            <div v-for="(category, index) in experienceGuide" :key="index" class="bg-white rounded p-2 border border-gray-200">
              <label class="flex items-start cursor-pointer hover:bg-gray-50 p-1 rounded">
                <input 
                  type="checkbox" 
                  v-model="category.checked"
                  class="mt-1 mr-2 text-blue-600 focus:ring-blue-500"
                />
                <div class="flex-1">
                  <div class="font-semibold text-black">{{ category.name }}</div>
                  <div class="text-xs text-gray-500 mt-1">{{ category.example }}</div>
                </div>
              </label>
            </div>
            <div class="pt-2 border-t border-blue-200">
              <div class="text-xs text-blue-700 font-medium">
                ✓ {{ checkedCount }}/{{ experienceGuide.length }} tópicos abordados
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-between mt-8">
      <button @click="emit('back')" class="btn-secondary">
        ← Voltar
      </button>
      <button 
        @click="handleNext"
        :disabled="saving"
        class="btn-primary"
      >
        {{ saving ? 'Salvando...' : 'Próxima Etapa →' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue';
import { interviewAPI } from '../services/api';

const props = defineProps(['data']);
const emit = defineEmits(['next', 'back', 'update']);

const localData = reactive({
  mainExperiences: props.data.experienceNotes.mainExperiences,
  technologies: props.data.experienceNotes.technologies,
  challenges: props.data.experienceNotes.challenges,
  strengths: props.data.experienceNotes.strengths,
  communication: props.data.experienceNotes.communication
});

const saving = ref(false);
const error = ref('');

// Guia de Experiência Validada
const experienceGuide = reactive([
  { name: 'Java (versões)', example: 'Exemplo: 8, 11, 17', checked: false },
  { name: 'JavaEE/JakartaEE', example: 'Exemplo: JSP, JSF, EJB', checked: false },
  { name: 'Frameworks', example: 'Exemplo: Spring Boot, Spring Data, Quarkus', checked: false },
  { name: 'Arquitetura', example: 'Exemplo: Microsserviços, Hexagonal', checked: false },
  { name: 'Persistência', example: 'Exemplo: JPA, Hibernate', checked: false },
  { name: 'Banco de Dados', example: 'Exemplo: Oracle, PostgreSQL, MongoDB', checked: false },
  { name: 'Mensageria', example: 'Exemplo: Kafka, RabbitMQ', checked: false },
  { name: 'CI/CD', example: 'Exemplo: Jenkins, GitHub Actions', checked: false },
  { name: 'Nuvem', example: 'Exemplo: AWS S3, Lambda', checked: false },
  { name: 'Observabilidade', example: 'Exemplo: Grafana, Datadog', checked: false },
  { name: 'Boas práticas', example: 'Exemplo: SOLID, Clean Code, Design Patterns', checked: false },
  { name: 'Testes', example: 'Exemplo: JUnit, Mockito, TDD, SonarQube', checked: false },
  { name: 'Front-end (quando aplicável)', example: 'Exemplo: Angular, React', checked: false },
  { name: 'Metodologias', example: 'Exemplo: Scrum, Kanban, Jira', checked: false },
  { name: 'Outras observações', example: 'Trechos do currículo ou exemplos trazidos', checked: false }
]);

const checkedCount = computed(() => {
  return experienceGuide.filter(item => item.checked).length;
});

const handleNext = async () => {
  try {
    saving.value = true;
    error.value = '';

    await interviewAPI.saveExperience(props.data.sessionId, localData);

    // Atualizar dados
    emit('update', 'experienceNotes', localData);
    emit('next');
  } catch (err) {
    error.value = err.response?.data?.error || 'Erro ao salvar dados';
  } finally {
    saving.value = false;
  }
};
</script>
