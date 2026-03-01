<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto" @click.self="close">
    <div class="flex items-center justify-center min-h-screen px-4 py-8">
      <!-- Overlay -->
      <div class="fixed inset-0 bg-black opacity-50" @click="close"></div>
      
      <!-- Modal -->
      <div class="relative rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto p-6 z-10" style="background-color: #480E2A;">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6 sticky top-0 pb-4 border-b border-gray-700" style="background-color: #480E2A;">
          <h2 class="text-2xl font-bold text-white flex items-center">
            📝 Gerenciar Temas e Perguntas Técnicas
          </h2>
          <button 
            @click="close"
            class="text-gray-400 hover:text-white transition"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Two Column Layout -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Left: Temas -->
          <div class="bg-gray-700 rounded-lg p-4">
            <h3 class="text-lg font-semibold text-white mb-4">🏷️ Temas</h3>
            
            <!-- Add New Theme -->
            <div class="mb-4">
              <div class="flex gap-2">
                <input
                  v-model="newTheme.name"
                  type="text"
                  placeholder="Nome do tema (ex: Java, Spring...)"
                  class="flex-1 px-3 py-2 bg-gray-600 text-white rounded-lg border border-gray-500 focus:border-primary-500 focus:outline-none"
                  @keyup.enter="addTheme"
                />
                <button
                  @click="addTheme"
                  class="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition"
                >
                  ➕ Adicionar
                </button>
              </div>
            </div>

            <!-- Themes List -->
            <div class="space-y-2 max-h-96 overflow-y-auto">
              <div
                v-for="(theme, index) in categories"
                :key="theme.id"
                :class="[
                  'p-3 rounded-lg cursor-pointer transition border-2',
                  selectedTheme?.id === theme.id
                    ? 'bg-primary-600 border-primary-400'
                    : 'bg-gray-600 border-transparent hover:bg-gray-550'
                ]"
                @click="selectTheme(theme)"
              >
                <div class="flex items-center justify-between">
                  <div class="flex-1">
                    <p class="font-medium text-white">{{ theme.name }}</p>
                    <p class="text-xs text-gray-300">{{ theme.questions.length }} perguntas</p>
                  </div>
                  <div class="flex gap-2">
                    <button
                      @click.stop="startEditTheme(theme)"
                      class="p-1 text-blue-400 hover:text-blue-300 transition"
                      title="Editar tema"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      @click.stop="deleteTheme(theme.id, index)"
                      class="p-1 text-red-400 hover:text-red-300 transition"
                      title="Excluir tema"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right: Perguntas do Tema Selecionado -->
          <div class="bg-gray-700 rounded-lg p-4">
            <h3 class="text-lg font-semibold text-white mb-4">
              ❓ Perguntas
              <span v-if="selectedTheme" class="text-primary-400">- {{ selectedTheme.name }}</span>
            </h3>

            <div v-if="!selectedTheme" class="text-center py-12 text-gray-400">
              <svg class="w-16 h-16 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
              </svg>
              <p>Selecione um tema para gerenciar suas perguntas</p>
            </div>

            <div v-else>
              <!-- Add New Question -->
              <div class="mb-4 space-y-2">
                <input
                  v-model="newQuestion.question"
                  type="text"
                  placeholder="Digite a pergunta"
                  class="w-full px-3 py-2 bg-gray-600 text-white rounded-lg border border-gray-500 focus:border-primary-500 focus:outline-none"
                />
                <textarea
                  v-model="newQuestion.hint"
                  placeholder="Resposta esperada / Dica"
                  rows="2"
                  class="w-full px-3 py-2 bg-gray-600 text-white rounded-lg border border-gray-500 focus:border-primary-500 focus:outline-none resize-none"
                ></textarea>
                <button
                  @click="addQuestion"
                  class="w-full px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition"
                >
                  ➕ Adicionar Pergunta (5 pontos)
                </button>
              </div>

              <!-- Questions List -->
              <div class="space-y-3 max-h-96 overflow-y-auto">
                <div
                  v-for="(question, qIndex) in selectedTheme.questions"
                  :key="question.id"
                  class="p-3 bg-gray-600 rounded-lg"
                >
                  <div v-if="editingQuestion?.id === question.id">
                    <!-- Edit Mode -->
                    <input
                      v-model="editingQuestion.question"
                      class="w-full px-3 py-2 mb-2 bg-gray-500 text-white rounded border border-gray-400 focus:border-primary-500 focus:outline-none"
                    />
                    <textarea
                      v-model="editingQuestion.hint"
                      rows="2"
                      class="w-full px-3 py-2 mb-2 bg-gray-500 text-white rounded border border-gray-400 focus:border-primary-500 focus:outline-none resize-none"
                    ></textarea>
                    <div class="flex gap-2">
                      <button
                        @click="saveEditQuestion"
                        class="flex-1 px-3 py-1 bg-green-600 hover:bg-green-500 text-white text-sm rounded transition"
                      >
                        ✓ Salvar
                      </button>
                      <button
                        @click="cancelEditQuestion"
                        class="flex-1 px-3 py-1 bg-gray-500 hover:bg-gray-400 text-white text-sm rounded transition"
                      >
                        ✗ Cancelar
                      </button>
                    </div>
                  </div>
                  <div v-else>
                    <!-- View Mode -->
                    <div class="flex items-start justify-between mb-2">
                      <p class="flex-1 font-medium text-white">{{ question.question }}</p>
                      <span class="ml-2 px-2 py-1 bg-primary-600 text-white text-xs rounded">{{ question.maxScore }}pts</span>
                    </div>
                    <p v-if="question.hint" class="text-sm text-gray-300 mb-2 italic">💡 {{ question.hint }}</p>
                    <div class="flex gap-2">
                      <button
                        @click="startEditQuestion(question)"
                        class="text-blue-400 hover:text-blue-300 text-xs transition"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        @click="deleteQuestion(qIndex)"
                        class="text-red-400 hover:text-red-300 text-xs transition"
                      >
                        🗑️ Excluir
                      </button>
                    </div>
                  </div>
                </div>

                <div v-if="selectedTheme.questions.length === 0" class="text-center py-8 text-gray-400">
                  <p class="text-sm">Nenhuma pergunta cadastrada neste tema</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Success Message -->
        <div v-if="successMessage" class="mt-4 p-3 bg-green-900/50 border border-green-600 text-green-300 rounded-lg">
          {{ successMessage }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const props = defineProps({
  isOpen: Boolean
});

const emit = defineEmits(['close', 'update']);

const categories = ref([]);
const selectedTheme = ref(null);
const editingTheme = ref(null);
const editingQuestion = ref(null);
const successMessage = ref('');

const newTheme = ref({
  name: ''
});

const newQuestion = ref({
  question: '',
  hint: '',
  maxScore: 5
});

// Generate unique ID
const generateId = () => {
  return Date.now() + Math.random().toString(36).substring(2, 9);
};

// Load data from localStorage
const loadData = () => {
  const stored = localStorage.getItem('technicalQuestions');
  if (stored) {
    categories.value = JSON.parse(stored);
  } else {
    // Initialize with empty array
    categories.value = [];
  }
};

// Save data to localStorage
const saveData = () => {
  localStorage.setItem('technicalQuestions', JSON.stringify(categories.value));
  emit('update');
  showSuccess('Dados salvos com sucesso!');
};

// Show success message
const showSuccess = (message) => {
  successMessage.value = message;
  setTimeout(() => {
    successMessage.value = '';
  }, 3000);
};

// Theme operations
const addTheme = () => {
  if (!newTheme.value.name.trim()) return;
  
  const theme = {
    id: generateId(),
    name: newTheme.value.name.trim(),
    questions: []
  };
  
  categories.value.push(theme);
  saveData();
  newTheme.value.name = '';
};

const selectTheme = (theme) => {
  selectedTheme.value = theme;
  editingQuestion.value = null;
};

const startEditTheme = (theme) => {
  const newName = prompt('Editar nome do tema:', theme.name);
  if (newName && newName.trim() && newName !== theme.name) {
    theme.name = newName.trim();
    saveData();
  }
};

const deleteTheme = (themeId, index) => {
  const theme = categories.value[index];
  if (confirm(`Excluir o tema "${theme.name}" e todas suas ${theme.questions.length} perguntas?`)) {
    categories.value.splice(index, 1);
    if (selectedTheme.value?.id === themeId) {
      selectedTheme.value = null;
    }
    saveData();
  }
};

// Question operations
const addQuestion = () => {
  if (!selectedTheme.value) return;
  if (!newQuestion.value.question.trim()) return;
  
  const question = {
    id: generateId(),
    question: newQuestion.value.question.trim(),
    hint: newQuestion.value.hint.trim(),
    maxScore: 5
  };
  
  selectedTheme.value.questions.push(question);
  saveData();
  
  // Reset form
  newQuestion.value = {
    question: '',
    hint: '',
    maxScore: 5
  };
};

const startEditQuestion = (question) => {
  editingQuestion.value = { ...question };
};

const saveEditQuestion = () => {
  if (!editingQuestion.value) return;
  
  const index = selectedTheme.value.questions.findIndex(q => q.id === editingQuestion.value.id);
  if (index !== -1) {
    // Garantir que maxScore seja sempre 5
    editingQuestion.value.maxScore = 5;
    selectedTheme.value.questions[index] = { ...editingQuestion.value };
    saveData();
    editingQuestion.value = null;
  }
};

const cancelEditQuestion = () => {
  editingQuestion.value = null;
};

const deleteQuestion = (index) => {
  if (confirm('Excluir esta pergunta?')) {
    selectedTheme.value.questions.splice(index, 1);
    saveData();
  }
};

const close = () => {
  emit('close');
};

onMounted(() => {
  loadData();
});
</script>
