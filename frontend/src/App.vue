<template>
  <div id="app" class="min-h-screen bg-gray-300 flex">
    <!-- Sidebar Expansível -->
    <aside 
      class="group bg-gradient-to-b from-gray-900 to-gray-800 shadow-2xl flex flex-col py-6 transition-all duration-300 ease-in-out hover:w-64 w-20 relative overflow-hidden"
    >
      <!-- Logo/Brand -->
      <div class="px-4 mb-8">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center font-bold text-xl text-white shadow-lg flex-shrink-0">
            RT
          </div>
          <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            <h2 class="text-white font-bold text-lg">Recruter Tech</h2>
            <p class="text-gray-400 text-xs">Gerenciamento</p>
          </div>
        </div>
      </div>

      <!-- Divider -->
      <div class="mx-4 mb-6 border-t border-gray-700"></div>

      <!-- Menu Items -->
      <nav class="flex-1 px-3 space-y-2">
        <!-- Gerenciar Dados -->
        <button 
          @click="openCrudModal"
          class="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-green-600 hover:to-green-500 transition-all duration-200 group/item"
          title="Gerenciar Dados"
        >
          <svg class="w-6 h-6 text-gray-400 group-hover/item:text-white transition flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            <span class="text-white font-medium text-sm">Gerenciar Dados</span>
            <p class="text-gray-300 text-xs">Candidatos e clientes</p>
          </div>
        </button>

        <!-- Perguntas -->
        <button 
          @click="openQuestionsModal"
          class="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-500 transition-all duration-200 group/item"
          title="Gerenciar Perguntas"
        >
          <svg class="w-6 h-6 text-gray-400 group-hover/item:text-white transition flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            <span class="text-white font-medium text-sm">Perguntas Técnicas</span>
            <p class="text-gray-300 text-xs">Temas e questões</p>
          </div>
        </button>

        <!-- Configurações -->
        <button 
          @click="openSettings"
          class="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-purple-600 hover:to-purple-500 transition-all duration-200 group/item"
          title="Configurações"
        >
          <svg class="w-6 h-6 text-gray-400 group-hover/item:text-white transition flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            <span class="text-white font-medium text-sm">Configurações</span>
            <p class="text-gray-300 text-xs">API OpenAI</p>
          </div>
        </button>
      </nav>

      <!-- Footer Info -->
      <div class="px-4 mt-6">
        <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div class="bg-gray-700/50 rounded-lg p-3 backdrop-blur-sm">
            <p class="text-gray-300 text-xs">💡 Passe o mouse para expandir</p>
          </div>
        </div>
      </div>

      <!-- Expand Indicator -->
      <div class="absolute right-0 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div class="w-1 h-12 bg-gradient-to-b from-primary-500 to-primary-700 rounded-l-full"></div>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- Header -->
      <header class="bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-xl">
        <div class="px-6 py-6">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold">Recruter Tech</h1>
              <p class="text-primary-100 mt-1">Sistema de Entrevistas Técnicas</p>
            </div>
            <div v-if="isElectronApp">
              <span class="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/20 text-white backdrop-blur-sm">
                🖥️ Desktop App
                <span v-if="electronInfo?.version" class="ml-2 opacity-75">v{{ electronInfo.version }}</span>
              </span>
            </div>
          </div>
        </div>
      </header>
      
      <!-- Main -->
      <main class="flex-1 px-6 py-8 overflow-y-auto">
        <div class="max-w-7xl mx-auto">
          <router-view />
        </div>
      </main>
      
      <!-- Footer -->
      <footer class="bg-gray-800 text-white border-t border-gray-700">
        <div class="px-6 py-6 text-center">
          <p class="text-sm text-gray-400">© 2026 Recruter Tech - Todos os direitos reservados</p>
          <p v-if="isElectronApp && electronInfo" class="text-xs text-gray-500 mt-1">
            Versão Desktop {{ electronInfo.version }} • Electron {{ electronInfo.electronVersion }}
          </p>
        </div>
      </footer>
    </div>

    <!-- Settings Modal -->
    <SettingsModal 
      :isOpen="isSettingsOpen" 
      @close="closeSettings"
      @update="handleSettingsUpdate"
    />

    <!-- CRUD Modal -->
    <CrudModal 
      :isOpen="isCrudModalOpen" 
      @close="closeCrudModal"
      @update="handleCrudUpdate"
    />

    <!-- Questions Modal -->
    <QuestionsModal 
      :isOpen="isQuestionsModalOpen" 
      @close="closeQuestionsModal"
      @update="handleQuestionsUpdate"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { isElectron, getElectronInfo } from './utils/electron';
import SettingsModal from './components/SettingsModal.vue';
import CrudModal from './components/CrudModal.vue';
import QuestionsModal from './components/QuestionsModal.vue';

const isElectronApp = ref(false);
const electronInfo = ref(null);
const isSettingsOpen = ref(false);
const isCrudModalOpen = ref(false);
const isQuestionsModalOpen = ref(false);

const openSettings = () => {
  isSettingsOpen.value = true;
};

const closeSettings = () => {
  isSettingsOpen.value = false;
};

const handleSettingsUpdate = () => {
  // Pode adicionar lógica adicional quando as configurações forem atualizadas
  console.log('Configurações atualizadas');
};

const openCrudModal = () => {
  isCrudModalOpen.value = true;
};

const closeCrudModal = () => {
  isCrudModalOpen.value = false;
};

const handleCrudUpdate = () => {
  console.log('Dados do CRUD atualizados');
  // Dispara evento para que StepInitial recarregue os dados
  window.dispatchEvent(new CustomEvent('crud-data-updated'));
};

const openQuestionsModal = () => {
  isQuestionsModalOpen.value = true;
};

const closeQuestionsModal = () => {
  isQuestionsModalOpen.value = false;
};

const handleQuestionsUpdate = () => {
  console.log('Perguntas técnicas atualizadas');
  // Dispara evento para que StepTechnical recarregue os dados
  window.dispatchEvent(new CustomEvent('questions-updated'));
};

onMounted(async () => {
  isElectronApp.value = isElectron();
  
  if (isElectronApp.value) {
    electronInfo.value = await getElectronInfo();
    console.log('Rodando no Electron:', electronInfo.value);
  }
});
</script>
