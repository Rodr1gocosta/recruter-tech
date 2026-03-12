<template>
  <div>
    <h2 class="text-2xl font-bold text-white mb-2">3️⃣ Etapa Técnica (15 min)</h2>
    <p class="text-white mb-4">Selecione os temas relevantes e avalie as respostas de 0 a 5 pontos.</p>

    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      <p class="mt-2 text-white">Carregando perguntas...</p>
    </div>

    <div v-else class="space-y-6">
      <!-- Seletor de Categorias -->
      <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
        <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center">
          <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
          </svg>
          Selecione os Temas da Entrevista ({{ selectedCategories.length }} selecionados)
        </h3>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="category in allCategories"
            :key="category.id"
            @click="toggleCategory(category.id)"
            :class="[
              'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
              selectedCategories.includes(category.id)
                ? 'bg-primary-600 text-white shadow-md hover:bg-primary-700'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-primary-400 hover:bg-primary-50'
            ]"
          >
            <span v-if="selectedCategories.includes(category.id)">✓</span>
            {{ category.name }}
            <span class="ml-1 text-xs opacity-75">({{ category.questions.length }})</span>
          </button>
        </div>
        <p class="text-xs text-white mt-3">
          💡 Dica: Selecione apenas os temas relevantes para a vaga e experiência do candidato
        </p>
      </div>

      <!-- Perguntas das Categorias Selecionadas -->
      <div v-if="selectedCategories.length === 0" class="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <svg class="w-16 h-16 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
        </svg>
        <p class="text-gray-500 text-lg font-medium">Nenhum tema selecionado</p>
        <p class="text-gray-400 text-sm mt-1">Selecione os temas acima para começar a avaliar</p>
      </div>

      <div v-else class="space-y-6">
        <div v-for="category in filteredCategories" :key="category.id" class="border-l-4 border-primary-500 pl-4 bg-white rounded-r-lg shadow-sm p-4 md:p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-black">{{ category.name }}</h3>
            <span class="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
              {{ category.questions.length }} perguntas
            </span>
          </div>
          
          <div v-for="(question, index) in category.questions" :key="question.id" :class="[
            'mb-5 p-4 md:p-5 rounded-lg border transition-all duration-200',
            answers[question.id]?.skipped 
              ? 'bg-orange-50 border-orange-300 opacity-75' 
              : 'bg-gray-50 border-gray-200'
          ]">
            <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
              <!-- Pergunta e Conteúdo (9 colunas em desktop) -->
              <div class="md:col-span-9">
                <div class="flex items-start mb-3">
                  <span :class="[
                    'flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3',
                    answers[question.id]?.skipped ? 'bg-orange-400 text-white' : 'bg-primary-600 text-white'
                  ]">
                    {{ index + 1 }}
                  </span>
                  <div class="flex-1">
                    <p class="font-medium text-black">{{ question.question }}</p>
                    <span v-if="answers[question.id]?.skipped" class="inline-block mt-1 text-xs bg-orange-500 text-white px-2 py-1 rounded-full">
                      ⚠️ Não conta pontos
                    </span>
                  </div>
                </div>

                <!-- Hint/Resposta Esperada -->
                <div v-if="question.hint" class="mb-3 bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
                  <p class="text-xs font-semibold text-blue-900 mb-1">💡 Resposta Esperada:</p>
                  <p class="text-sm text-blue-800">{{ question.hint }}</p>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Resposta do Candidato / Observações:
                  </label>
                  <textarea 
                    v-model="answers[question.id].answer"
                    :disabled="answers[question.id].skipped"
                    :class="[
                      'input-field',
                      answers[question.id].skipped ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''
                    ]"
                    rows="2"
                    placeholder="Anote a resposta e suas observações..."
                  ></textarea>
                </div>
              </div>

              <!-- Pontuação Dropdown (3 colunas em desktop) -->
              <div class="md:col-span-3 flex flex-col justify-center">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Pontuação:
                </label>
                <select 
                  v-model.number="answers[question.id].score"
                  :disabled="answers[question.id].skipped"
                  :class="[
                    'input-field text-center font-bold text-lg',
                    answers[question.id].skipped ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''
                  ]"
                >
                  <option :value="0">0 - Insuficiente</option>
                  <option :value="1">1 - Muito Fraco</option>
                  <option :value="2">2 - Fraco</option>
                  <option :value="3">3 - Adequado</option>
                  <option :value="4">4 - Bom</option>
                  <option :value="5">5 - Excelente</option>
                </select>
                
                <!-- Botão Não Contar Ponto -->
                <button
                  @click="toggleSkipQuestion(question.id)"
                  :class="[
                    'mt-2 px-3 py-2 rounded-md text-xs font-medium transition-all duration-200 flex items-center justify-center',
                    answers[question.id].skipped
                      ? 'bg-orange-500 text-white hover:bg-orange-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  ]"
                >
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                  {{ answers[question.id].skipped ? 'Não Contando' : 'Não Contar Ponto' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Resumo da Pontuação -->
      <div v-if="selectedCategories.length > 0" class="bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-200 rounded-lg p-5 shadow-md">
        <h3 class="font-semibold text-primary-900 mb-4 flex items-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
          </svg>
          Resumo da Avaliação Técnica
        </h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-white p-3 rounded-lg">
            <p class="text-xs text-gray-600 mb-1">Temas Avaliados:</p>
            <p class="text-2xl font-bold text-gray-900">{{ selectedCategories.length }}</p>
          </div>
          <div class="bg-white p-3 rounded-lg">
            <p class="text-xs text-gray-600 mb-1">Perguntas:</p>
            <p class="text-2xl font-bold text-gray-900">{{ totalQuestions - skippedCount }}<span class="text-sm text-gray-500">/{{ totalQuestions }}</span></p>
            <p v-if="skippedCount > 0" class="text-xs text-orange-600 mt-1">{{ skippedCount }} não contada(s)</p>
          </div>
          <div class="bg-white p-3 rounded-lg">
            <p class="text-xs text-gray-600 mb-1">Pontuação Total:</p>
            <p class="text-2xl font-bold text-primary-900">{{ totalScore }}/{{ maxScore }}</p>
          </div>
          <div class="bg-white p-3 rounded-lg">
            <p class="text-xs text-gray-600 mb-1">Percentual:</p>
            <p class="text-2xl font-bold text-green-600">{{ scorePercentage }}%</p>
          </div>
        </div>
      </div>

      <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {{ error }}
      </div>

      <div v-if="saving" class="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded flex items-center">
        <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-700 mr-3"></div>
        Salvando avaliação técnica...
      </div>
    </div>

    <div class="flex justify-between mt-8">
      <button @click="emit('back')" class="btn-secondary">
        ← Voltar
      </button>
      <button 
        @click="handleNext"
        :disabled="saving || loading || selectedCategories.length === 0"
        class="btn-primary"
      >
        {{ saving ? 'Salvando...' : 'Próxima Etapa →' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { interviewAPI } from '../services/api';
import { getStorage, setStorage } from '../utils/storage.js';

const props = defineProps(['data']);
const emit = defineEmits(['next', 'back', 'update']);

const allCategories = ref([]);
const selectedCategories = ref([]);
const answers = ref({});
const loading = ref(true);
const saving = ref(false);
const error = ref('');

// Load questions from storage
const loadQuestionsFromLocalStorage = () => {
  const stored = getStorage('technicalQuestions');
  if (stored && Array.isArray(stored)) {
    return { categories: stored };
  }
  return null;
};

// Migrate initial data from backend to storage
const migrateDataToLocalStorage = async () => {
  try {
    const response = await interviewAPI.getQuestions();
    setStorage('technicalQuestions', response.data.categories);
    return response.data;
  } catch (err) {
    console.error('Erro ao migrar dados:', err);
    return { categories: [] };
  }
};

// Categorias filtradas com base na seleção
const filteredCategories = computed(() => {
  return allCategories.value.filter(cat => selectedCategories.value.includes(cat.id));
});

// Pontuação total apenas das perguntas das categorias selecionadas (excluindo as puladas)
const totalScore = computed(() => {
  let total = 0;
  filteredCategories.value.forEach(category => {
    category.questions.forEach(question => {
      const answer = answers.value[question.id];
      if (answer && !answer.skipped) {
        total += answer.score || 0;
      }
    });
  });
  return total;
});

// Pontuação máxima apenas das perguntas das categorias selecionadas (excluindo as puladas)
const maxScore = computed(() => {
  let max = 0;
  filteredCategories.value.forEach(category => {
    category.questions.forEach(question => {
      const answer = answers.value[question.id];
      if (answer && !answer.skipped) {
        max += question.maxScore;
      }
    });
  });
  return max;
});

const scorePercentage = computed(() => {
  if (maxScore.value === 0) return 0;
  return ((totalScore.value / maxScore.value) * 100).toFixed(1);
});

// Contar perguntas puladas
const skippedCount = computed(() => {
  let count = 0;
  filteredCategories.value.forEach(category => {
    category.questions.forEach(question => {
      if (answers.value[question.id]?.skipped) {
        count++;
      }
    });
  });
  return count;
});

// Total de perguntas selecionadas
const totalQuestions = computed(() => {
  let count = 0;
  filteredCategories.value.forEach(category => {
    count += category.questions.length;
  });
  return count;
});

// Alternar seleção de categoria
const toggleCategory = (categoryId) => {
  const index = selectedCategories.value.indexOf(categoryId);
  if (index > -1) {
    selectedCategories.value.splice(index, 1);
  } else {
    selectedCategories.value.push(categoryId);
  }
};

// Alternar se a pergunta deve ser pulada (não contar pontos)
const toggleSkipQuestion = (questionId) => {
  if (answers.value[questionId]) {
    answers.value[questionId].skipped = !answers.value[questionId].skipped;
    // Se marcar como pulada, zerar a pontuação
    if (answers.value[questionId].skipped) {
      answers.value[questionId].score = 0;
    }
  }
};

// Load questions data
const loadQuestions = async () => {
  loading.value = true;
  try {
    // Try to load from localStorage first
    let data = loadQuestionsFromLocalStorage();
    
    // If no data in localStorage, migrate from backend
    if (!data || data.categories.length === 0) {
      data = await migrateDataToLocalStorage();
    }
    
    allCategories.value = data.categories;
    
    // Inicializar respostas para TODAS as perguntas (mesmo que não exibidas)
    allCategories.value.forEach(category => {
      category.questions.forEach(question => {
        answers.value[question.id] = {
          id: question.id,
          question: question.question,
          answer: '',
          score: 0,
          maxScore: question.maxScore,
          skipped: false // Campo para marcar se a pergunta não deve contar pontos
        };
      });
    });

    // Restaurar respostas salvas se existirem
    if (props.data.technicalAnswers && props.data.technicalAnswers.length > 0) {
      props.data.technicalAnswers.forEach(saved => {
        if (answers.value[saved.id]) {
          answers.value[saved.id] = saved;
        }
      });
    }

    // Restaurar categorias selecionadas se existirem
    if (props.data.selectedCategories && props.data.selectedCategories.length > 0) {
      selectedCategories.value = props.data.selectedCategories;
    }
  } catch (err) {
    error.value = 'Erro ao carregar perguntas';
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await loadQuestions();
  
  // Listen for questions updates
  const handleQuestionsUpdate = () => {
    loadQuestions();
  };
  window.addEventListener('questions-updated', handleQuestionsUpdate);
  
  // Cleanup
  onUnmounted(() => {
    window.removeEventListener('questions-updated', handleQuestionsUpdate);
  });
});

const handleNext = async () => {
  try {
    saving.value = true;
    error.value = '';

    // Enviar apenas as respostas das categorias selecionadas
    const selectedAnswers = [];
    filteredCategories.value.forEach(category => {
      category.questions.forEach(question => {
        selectedAnswers.push(answers.value[question.id]);
      });
    });

    await interviewAPI.saveTechnical(props.data.sessionId, selectedAnswers);

    emit('update', 'technicalAnswers', selectedAnswers);
    emit('update', 'selectedCategories', selectedCategories.value);
    emit('next');
  } catch (err) {
    error.value = err.response?.data?.error || 'Erro ao salvar avaliação técnica';
  } finally {
    saving.value = false;
  }
};
</script>
