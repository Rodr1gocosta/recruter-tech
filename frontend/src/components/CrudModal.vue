<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto" @click.self="close">
    <div class="flex items-center justify-center min-h-screen px-4">
      <!-- Overlay -->
      <div class="fixed inset-0 bg-black opacity-50" @click="close"></div>
      
      <!-- Modal -->
      <div class="relative rounded-lg shadow-xl max-w-4xl w-full p-6 z-10" style="background-color: #480E2A;">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-white flex items-center">
            📋 Gerenciar Dados
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

        <!-- Tabs -->
        <div class="mb-6">
          <div class="flex border-b border-gray-600">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'px-4 py-2 font-medium text-sm transition',
                activeTab === tab.id
                  ? 'border-b-2 border-primary-500 text-primary-400'
                  : 'text-gray-400 hover:text-white'
              ]"
            >
              {{ tab.label }}
            </button>
          </div>
        </div>

        <!-- Content -->
        <div class="space-y-4">
          <!-- Add New Item -->
          <div class="bg-gray-700 rounded-lg p-4">
            <div class="flex gap-3">
              <input
                v-model="newItem"
                type="text"
                :placeholder="`Adicionar novo ${activeTabLabel}`"
                class="flex-1 bg-gray-600 text-white px-4 py-2 rounded border border-gray-500 focus:border-primary-500 focus:outline-none"
                @keyup.enter="addItem"
              />
              <button
                @click="addItem"
                :disabled="!newItem.trim()"
                class="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-2 rounded font-medium transition"
              >
                ➕ Adicionar
              </button>
            </div>
          </div>

          <!-- Items List -->
          <div class="bg-gray-700 rounded-lg p-4 max-h-96 overflow-y-auto">
            <div v-if="currentItems.length === 0" class="text-center py-8 text-gray-400">
              <svg class="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p>Nenhum item cadastrado</p>
            </div>

            <div v-else class="space-y-2">
              <div
                v-for="(item, index) in currentItems"
                :key="index"
                class="flex items-center justify-between bg-gray-600 px-4 py-3 rounded hover:bg-gray-550 transition group"
              >
                <span v-if="editingIndex !== index" class="text-white flex-1">{{ item }}</span>
                <input
                  v-else
                  v-model="editingValue"
                  type="text"
                  class="flex-1 bg-gray-500 text-white px-3 py-1 rounded border border-gray-400 focus:border-primary-500 focus:outline-none"
                  @keyup.enter="saveEdit(index)"
                  @keyup.esc="cancelEdit"
                />

                <div class="flex gap-2 ml-4">
                  <template v-if="editingIndex === index">
                    <button
                      @click="saveEdit(index)"
                      class="text-green-400 hover:text-green-300 transition"
                      title="Salvar"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                    <button
                      @click="cancelEdit"
                      class="text-gray-400 hover:text-gray-300 transition"
                      title="Cancelar"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </template>
                  <template v-else>
                    <button
                      @click="startEdit(index, item)"
                      class="text-blue-400 hover:text-blue-300 transition opacity-0 group-hover:opacity-100"
                      title="Editar"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      @click="deleteItem(index)"
                      class="text-red-400 hover:text-red-300 transition opacity-0 group-hover:opacity-100"
                      title="Deletar"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </template>
                </div>
              </div>
            </div>
          </div>

          <!-- Success Message -->
          <div v-if="message" class="bg-green-900/20 border border-green-600/30 text-green-400 px-4 py-3 rounded">
            {{ message }}
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

const activeTab = ref('technical');
const newItem = ref('');
const editingIndex = ref(null);
const editingValue = ref('');
const message = ref('');

const tabs = [
  { id: 'technical', label: 'Referência Técnica' },
  { id: 'client', label: 'Cliente' },
  { id: 'recruiter', label: 'Responsável RH' }
];

// Data storage
const technicalReferences = ref([]);
const clients = ref([]);
const recruiters = ref([]);

// Load from localStorage
const loadData = () => {
  technicalReferences.value = JSON.parse(localStorage.getItem('technicalReferences') || '[]');
  clients.value = JSON.parse(localStorage.getItem('clients') || '[]');
  recruiters.value = JSON.parse(localStorage.getItem('recruiters') || '[]');
};

// Save to localStorage
const saveData = () => {
  localStorage.setItem('technicalReferences', JSON.stringify(technicalReferences.value));
  localStorage.setItem('clients', JSON.stringify(clients.value));
  localStorage.setItem('recruiters', JSON.stringify(recruiters.value));
  emit('update');
};

// Computed
const activeTabLabel = computed(() => {
  return tabs.find(t => t.id === activeTab.value)?.label || '';
});

const currentItems = computed(() => {
  switch (activeTab.value) {
    case 'technical':
      return technicalReferences.value;
    case 'client':
      return clients.value;
    case 'recruiter':
      return recruiters.value;
    default:
      return [];
  }
});

// Methods
const addItem = () => {
  if (!newItem.value.trim()) return;

  switch (activeTab.value) {
    case 'technical':
      technicalReferences.value.push(newItem.value.trim());
      break;
    case 'client':
      clients.value.push(newItem.value.trim());
      break;
    case 'recruiter':
      recruiters.value.push(newItem.value.trim());
      break;
  }

  newItem.value = '';
  saveData();
  showMessage('Item adicionado com sucesso!');
};

const startEdit = (index, value) => {
  editingIndex.value = index;
  editingValue.value = value;
};

const saveEdit = (index) => {
  if (!editingValue.value.trim()) return;

  switch (activeTab.value) {
    case 'technical':
      technicalReferences.value[index] = editingValue.value.trim();
      break;
    case 'client':
      clients.value[index] = editingValue.value.trim();
      break;
    case 'recruiter':
      recruiters.value[index] = editingValue.value.trim();
      break;
  }

  editingIndex.value = null;
  editingValue.value = '';
  saveData();
  showMessage('Item atualizado com sucesso!');
};

const cancelEdit = () => {
  editingIndex.value = null;
  editingValue.value = '';
};

const deleteItem = (index) => {
  if (!confirm('Tem certeza que deseja deletar este item?')) return;

  switch (activeTab.value) {
    case 'technical':
      technicalReferences.value.splice(index, 1);
      break;
    case 'client':
      clients.value.splice(index, 1);
      break;
    case 'recruiter':
      recruiters.value.splice(index, 1);
      break;
  }

  saveData();
  showMessage('Item deletado com sucesso!');
};

const showMessage = (text) => {
  message.value = text;
  setTimeout(() => {
    message.value = '';
  }, 2000);
};

const close = () => {
  newItem.value = '';
  cancelEdit();
  emit('close');
};

// Watch for modal opening
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    loadData();
  }
});
</script>
