<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto" @click.self="close">
    <div class="flex items-center justify-center min-h-screen px-4">
      <!-- Overlay -->
      <div class="fixed inset-0 bg-black opacity-50" @click="close"></div>
      
      <!-- Modal -->
      <div class="relative rounded-lg shadow-xl max-w-md w-full p-6 z-10" style="background-color: rgb(72, 14, 42);">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-white flex items-center">
            ⚙️ Configurações
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

        <!-- Content -->
        <div class="space-y-6">
          <!-- OpenAI API Key Section -->
          <div class="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4">
            <label class="block text-sm font-medium text-yellow-400 mb-3">
              🔑 Chave da API OpenAI *
            </label>
            
            <!-- Display Mode (quando a chave está salva) -->
            <div v-if="!isEditing && hasApiKey" class="space-y-3">
              <div class="flex items-center gap-2">
                <input 
                  type="password" 
                  :value="maskedKey"
                  disabled
                  class="flex-1 bg-gray-700 text-gray-300 px-4 py-2 rounded border border-gray-600 cursor-not-allowed"
                />
              </div>
              <div class="flex gap-2">
                <button 
                  @click="startEditing"
                  class="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium transition"
                >
                  ✏️ Editar
                </button>
                <button 
                  @click="deleteKey"
                  class="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-medium transition"
                >
                  🗑️ Deletar
                </button>
              </div>
            </div>

            <!-- Edit Mode -->
            <div v-else class="space-y-3">
              <input 
                v-model="apiKeyInput"
                type="password" 
                class="w-full bg-gray-700 text-white px-4 py-2 rounded border border-gray-600 focus:border-primary-500 focus:outline-none"
                placeholder="sk-..."
                @keyup.enter="saveKey"
              />
              <div class="flex gap-2">
                <button 
                  @click="saveKey"
                  :disabled="!apiKeyInput.trim()"
                  class="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded font-medium transition"
                >
                  💾 Salvar Chave
                </button>
                <button 
                  v-if="hasApiKey"
                  @click="cancelEditing"
                  class="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded font-medium transition"
                >
                  ✖️ Cancelar
                </button>
              </div>
            </div>

            <p class="text-xs text-gray-400 mt-3">
              Sua chave é armazenada apenas localmente no navegador.
              <a href="https://platform.openai.com/api-keys" target="_blank" class="text-primary-400 hover:underline">
                Obter chave aqui
              </a>
            </p>
          </div>

          <!-- Success/Error Messages -->
          <div v-if="message.text" :class="[
            'px-4 py-3 rounded border',
            message.type === 'success' ? 'bg-green-900/20 border-green-600/30 text-green-400' : 'bg-red-900/20 border-red-600/30 text-red-400'
          ]">
            {{ message.text }}
          </div>
        </div>

        <!-- Footer Info -->
        <div class="mt-6 pt-6 border-t border-gray-700">
          <div class="text-xs text-gray-400 space-y-1">
            <p><strong>Status:</strong> {{ hasApiKey ? '✅ Chave configurada' : '❌ Chave não configurada' }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'update']);

const apiKeyInput = ref('');
const isEditing = ref(false);
const message = ref({ text: '', type: '' });

// Computed
const hasApiKey = computed(() => {
  const key = localStorage.getItem('openai_api_key');
  return key && key.trim().length > 0;
});

const maskedKey = computed(() => {
  const key = localStorage.getItem('openai_api_key');
  if (!key) return '';
  return 'sk-••••••••••••••••••••';
});

// Methods
const startEditing = () => {
  isEditing.value = true;
  apiKeyInput.value = localStorage.getItem('openai_api_key') || '';
};

const cancelEditing = () => {
  isEditing.value = false;
  apiKeyInput.value = '';
  clearMessage();
};

const saveKey = () => {
  if (!apiKeyInput.value.trim()) {
    showMessage('Por favor, insira uma chave válida', 'error');
    return;
  }

  if (!apiKeyInput.value.startsWith('sk-')) {
    showMessage('Chave inválida. Deve começar com "sk-"', 'error');
    return;
  }

  localStorage.setItem('openai_api_key', apiKeyInput.value.trim());
  isEditing.value = false;
  apiKeyInput.value = '';
  showMessage('Chave salva com sucesso!', 'success');
  emit('update');
};

const deleteKey = () => {
  if (confirm('Tem certeza que deseja deletar a chave da API?')) {
    localStorage.removeItem('openai_api_key');
    isEditing.value = false;
    apiKeyInput.value = '';
    showMessage('Chave deletada com sucesso', 'success');
    emit('update');
  }
};

const showMessage = (text, type) => {
  message.value = { text, type };
  setTimeout(() => {
    clearMessage();
  }, 3000);
};

const clearMessage = () => {
  message.value = { text: '', type: '' };
};

const close = () => {
  cancelEditing();
  emit('close');
};

// Watch for modal opening
watch(() => props.isOpen, (newValue) => {
  if (newValue && !hasApiKey.value) {
    isEditing.value = true;
  } else {
    isEditing.value = false;
    apiKeyInput.value = '';
  }
  clearMessage();
});
</script>
