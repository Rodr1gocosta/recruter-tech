<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto" @click.self="close">
    <div class="flex items-center justify-center min-h-screen px-4">
      <!-- Overlay -->
      <div class="fixed inset-0 bg-black opacity-50" @click="close"></div>
      
      <!-- Modal -->
      <div class="relative rounded-lg shadow-xl max-w-2xl w-full p-6 z-10" style="background-color: rgb(72, 14, 42);">
        <!-- Header -->
        <div class="flex items-center justify-between mb-4">
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

        <!-- Tabs Navigation -->
        <div class="flex border-b border-gray-600 mb-6">
          <button
            @click="activeTab = 'api'"
            :class="[
              'px-4 py-2 font-medium transition-all border-b-2',
              activeTab === 'api'
                ? 'text-primary-400 border-primary-400'
                : 'text-gray-400 border-transparent hover:text-white'
            ]"
          >
            🔑 Chave API
          </button>
          <button
            @click="activeTab = 'themes'"
            :class="[
              'px-4 py-2 font-medium transition-all border-b-2',
              activeTab === 'themes'
                ? 'text-primary-400 border-primary-400'
                : 'text-gray-400 border-transparent hover:text-white'
            ]"
          >
            📚 Temas
          </button>
        </div>

        <!-- Tab Content: API Key -->
        <div v-show="activeTab === 'api'" class="space-y-6">
          <div class="bg-blue-900/20 border border-blue-600/30 rounded-lg p-4">
            <p class="text-sm text-blue-300 mb-2">
              💡 <strong>Sistema de Fallback:</strong> Configure múltiplas chaves de API. Se uma falhar, o sistema tentará automaticamente a próxima na ordem de prioridade.
            </p>
          </div>

          <!-- Lista de Chaves Configuradas -->
          <div v-if="apiKeys.length > 0" class="space-y-3">
            <h3 class="text-lg font-semibold text-white flex items-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              Chaves Configuradas ({{ apiKeys.length }})
            </h3>

            <div class="space-y-2">
              <div 
                v-for="(key, index) in apiKeys" 
                :key="key.id"
                class="bg-gray-700/50 rounded-lg p-4 border border-gray-600"
              >
                <div class="flex items-start justify-between gap-3">
                  <!-- Info da Chave -->
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-2">
                      <span class="bg-primary-600 text-white text-xs font-bold px-2 py-1 rounded">
                        #{{ index + 1 }}
                      </span>
                      <span class="text-white font-semibold">
                        {{ providerLabels[key.provider] }}
                      </span>
                      <span 
                        v-if="!key.enabled"
                        class="bg-gray-500 text-white text-xs px-2 py-1 rounded"
                      >
                        Desativada
                      </span>
                      <span 
                        v-if="index === 0"
                        class="bg-green-600 text-white text-xs px-2 py-1 rounded"
                      >
                        ⭐ Principal
                      </span>
                    </div>
                    <div class="flex items-center gap-2">
                      <input 
                        type="password" 
                        :value="maskKey(key.key)"
                        disabled
                        class="flex-1 bg-gray-800 text-gray-300 px-3 py-1.5 text-sm rounded border border-gray-600 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <!-- Ações -->
                  <div class="flex flex-col gap-2">
                    <!-- Botões de Prioridade -->
                    <div class="flex gap-1">
                      <button
                        @click="moveKeyUp(index)"
                        :disabled="index === 0"
                        :class="[
                          'p-1.5 rounded transition text-xs',
                          index === 0 
                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        ]"
                        title="Mover para cima (aumentar prioridade)"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                        </svg>
                      </button>
                      <button
                        @click="moveKeyDown(index)"
                        :disabled="index === apiKeys.length - 1"
                        :class="[
                          'p-1.5 rounded transition text-xs',
                          index === apiKeys.length - 1
                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        ]"
                        title="Mover para baixo (diminuir prioridade)"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>

                    <!-- Botões de Ação -->
                    <div class="flex gap-1">
                      <button
                        @click="toggleKeyEnabled(index)"
                        :class="[
                          'p-1.5 rounded transition text-xs',
                          key.enabled
                            ? 'bg-orange-600 text-white hover:bg-orange-700'
                            : 'bg-green-600 text-white hover:bg-green-700'
                        ]"
                        :title="key.enabled ? 'Desativar' : 'Ativar'"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path v-if="key.enabled" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button
                        @click="deleteApiKey(index)"
                        class="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded transition text-xs"
                        title="Deletar chave"
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
          </div>

          <!-- Formulário para Adicionar Nova Chave -->
          <div class="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4">
            <h3 class="text-lg font-semibold text-yellow-400 mb-3">
              ➕ Adicionar Nova Chave de API
            </h3>
            
            <div class="space-y-3">
              <!-- Seletor de Provedor -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  Provedor de IA
                </label>
                <select
                  v-model="newKey.provider"
                  class="w-full bg-gray-700 text-white px-4 py-2 rounded border border-gray-600 focus:border-primary-500 focus:outline-none"
                >
                  <option value="openai">OpenAI (GPT-4, GPT-3.5)</option>
                  <option value="gemini">Google AI (Gemini)</option>
                  <option value="anthropic">Anthropic (Claude)</option>
                  <option value="groq">Groq (Llama, Mixtral)</option>
                  <option value="cohere">Cohere</option>
                </select>
              </div>

              <!-- Input da Chave -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  Chave da API
                </label>
                <input 
                  v-model="newKey.key"
                  type="password" 
                  class="w-full bg-gray-700 text-white px-4 py-2 rounded border border-gray-600 focus:border-primary-500 focus:outline-none"
                  :placeholder="keyPlaceholder"
                  @keyup.enter="addNewKey"
                />
                <p class="text-xs text-gray-400 mt-1">
                  <a :href="providerLinks[newKey.provider]" target="_blank" class="text-primary-400 hover:underline">
                    Obter chave aqui →
                  </a>
                </p>
              </div>

              <!-- Botão Adicionar -->
              <button 
                @click="addNewKey"
                :disabled="!newKey.key.trim()"
                class="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded font-medium transition"
              >
                ➕ Adicionar Chave
              </button>
            </div>
          </div>

          <!-- Success/Error Messages -->
          <div v-if="message.text" :class="[
            'px-4 py-3 rounded border',
            message.type === 'success' ? 'bg-green-900/20 border-green-600/30 text-green-400' : 'bg-red-900/20 border-red-600/30 text-red-400'
          ]">
            {{ message.text }}
          </div>

          <!-- Footer Info -->
          <div class="pt-6 border-t border-gray-700">
            <div class="text-xs text-gray-400 space-y-1">
              <p><strong>Total de chaves:</strong> {{ apiKeys.length }}</p>
              <p><strong>Ativas:</strong> {{ activeKeysCount }}/{{ apiKeys.length }}</p>
              <p class="text-blue-300 mt-2">
                💡 As chaves são armazenadas localmente no navegador e tentadas na ordem de prioridade (#1, #2, #3...).
              </p>
            </div>
          </div>
        </div>

        <!-- Tab Content: Themes -->
        <div v-show="activeTab === 'themes'" class="space-y-4">
          <div class="bg-blue-900/20 border border-blue-600/30 rounded-lg p-4">
            <h3 class="text-lg font-semibold text-blue-400 mb-3 flex items-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Gerenciar Temas das Perguntas Técnicas
            </h3>
            <p class="text-sm text-gray-300 mb-4">
              Configure os temas e categorias das perguntas técnicas que serão usadas nas entrevistas.
            </p>
            
            <div class="bg-yellow-900/20 border border-yellow-600/30 rounded p-3">
              <p class="text-sm text-yellow-400">
                💡 Para gerenciar perguntas e temas, use o botão "Perguntas" no topo da tela principal.
              </p>
            </div>
          </div>

          <div class="bg-gray-700/30 rounded-lg p-4">
            <h4 class="text-md font-semibold text-white mb-2">Informações sobre Temas</h4>
            <ul class="text-sm text-gray-300 space-y-2">
              <li>• Os temas são carregados do arquivo de perguntas</li>
              <li>• Você pode adicionar, editar e remover categorias</li>
              <li>• As alterações são salvas localmente</li>
              <li>• Use o modal "Perguntas" para gerenciar os temas</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'update']);

const activeTab = ref('api');
const message = ref({ text: '', type: '' });
const apiKeys = ref([]);
const newKey = ref({
  provider: 'openai',
  key: ''
});

const providerLabels = {
  openai: 'OpenAI',
  gemini: 'Google AI',
  anthropic: 'Anthropic',
  groq: 'Groq',
  cohere: 'Cohere'
};

const providerLinks = {
  openai: 'https://platform.openai.com/api-keys',
  gemini: 'https://makersuite.google.com/app/apikey',
  anthropic: 'https://console.anthropic.com/settings/keys',
  groq: 'https://console.groq.com/keys',
  cohere: 'https://dashboard.cohere.com/api-keys'
};

const providerPrefixes = {
  openai: ['sk-'],
  gemini: ['AI'],
  anthropic: ['sk-ant-'],
  groq: ['gsk_'],
  cohere: []
};

// Load API keys from localStorage
const loadApiKeys = () => {
  const stored = localStorage.getItem('api_keys');
  if (stored) {
    apiKeys.value = JSON.parse(stored);
  } else {
    // Migrar chave antiga se existir
    const oldKey = localStorage.getItem('openai_api_key');
    const oldProvider = localStorage.getItem('ai_provider') || 'openai';
    if (oldKey) {
      apiKeys.value = [{
        id: Date.now(),
        provider: oldProvider,
        key: oldKey,
        enabled: true
      }];
      saveApiKeys();
      localStorage.removeItem('openai_api_key');
    }
  }
};

// Save API keys to localStorage
const saveApiKeys = () => {
  localStorage.setItem('api_keys', JSON.stringify(apiKeys.value));
  // Mantém compatibilidade com código antigo - usa a primeira chave ativa
  const firstActiveKey = apiKeys.value.find(k => k.enabled);
  if (firstActiveKey) {
    localStorage.setItem('openai_api_key', firstActiveKey.key);
    localStorage.setItem('ai_provider', firstActiveKey.provider);
  }
  emit('update');
};

// Computed
const activeKeysCount = computed(() => {
  return apiKeys.value.filter(k => k.enabled).length;
});

const keyPlaceholder = computed(() => {
  const examples = {
    openai: 'sk-...',
    gemini: 'AIza...',
    anthropic: 'sk-ant-...',
    groq: 'gsk_...',
    cohere: 'cole aqui sua chave'
  };
  return examples[newKey.value.provider] || 'Cole sua chave da API';
});

// Methods
const maskKey = (key) => {
  if (!key || key.length < 8) return '••••••••';
  return key.substring(0, 4) + '••••••••••••••••' + key.substring(key.length - 4);
};

const addNewKey = () => {
  if (!newKey.value.key.trim()) {
    showMessage('Por favor, insira uma chave válida', 'error');
    return;
  }

  // Validate key format based on provider
  const prefixes = providerPrefixes[newKey.value.provider];
  if (prefixes.length > 0) {
    const hasValidPrefix = prefixes.some(prefix => newKey.value.key.startsWith(prefix));
    if (!hasValidPrefix) {
      showMessage(`Chave inválida. Deve começar com: ${prefixes.join(' ou ')}`, 'error');
      return;
    }
  }

  // Adicionar nova chave
  apiKeys.value.push({
    id: Date.now(),
    provider: newKey.value.provider,
    key: newKey.value.key.trim(),
    enabled: true
  });

  saveApiKeys();
  
  // Limpar formulário
  newKey.value = {
    provider: 'openai',
    key: ''
  };

  showMessage('Chave adicionada com sucesso!', 'success');
};

const deleteApiKey = (index) => {
  if (confirm('Tem certeza que deseja deletar esta chave?')) {
    apiKeys.value.splice(index, 1);
    saveApiKeys();
    showMessage('Chave deletada com sucesso', 'success');
  }
};

const toggleKeyEnabled = (index) => {
  apiKeys.value[index].enabled = !apiKeys.value[index].enabled;
  saveApiKeys();
  showMessage(
    apiKeys.value[index].enabled ? 'Chave ativada' : 'Chave desativada',
    'success'
  );
};

const moveKeyUp = (index) => {
  if (index > 0) {
    const temp = apiKeys.value[index];
    apiKeys.value[index] = apiKeys.value[index - 1];
    apiKeys.value[index - 1] = temp;
    saveApiKeys();
    showMessage('Prioridade alterada', 'success');
  }
};

const moveKeyDown = (index) => {
  if (index < apiKeys.value.length - 1) {
    const temp = apiKeys.value[index];
    apiKeys.value[index] = apiKeys.value[index + 1];
    apiKeys.value[index + 1] = temp;
    saveApiKeys();
    showMessage('Prioridade alterada', 'success');
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
  activeTab.value = 'api';
  newKey.value = {
    provider: 'openai',
    key: ''
  };
  clearMessage();
  emit('close');
};

// Watch for modal opening
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    activeTab.value = 'api';
    loadApiKeys();
  }
  clearMessage();
});

onMounted(() => {
  loadApiKeys();
});
</script>
