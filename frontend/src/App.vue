<template>
  <div id="app" class="min-h-screen bg-gray-300">
    <header class="bg-primary-600 text-white shadow-lg">
      <div class="container mx-auto px-4 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold">Recruter Tech</h1>
            <p class="text-primary-100 mt-1">Sistema de Entrevistas Técnicas</p>
          </div>
          <div class="flex items-center gap-4">
            <!-- CRUD Data Button -->
            <button 
              @click="openCrudModal"
              class="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg transition font-medium"
              title="Gerenciar Dados"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span class="hidden sm:inline">Gerenciar Dados</span>
            </button>

            <!-- Settings Button -->
            <button 
              @click="openSettings"
              class="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-400 rounded-lg transition font-medium"
              title="Configurações"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span class="hidden sm:inline">Configurações</span>
            </button>
            <div v-if="isElectronApp" class="text-right">
              <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-500 text-white">
                🖥️ Desktop App
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
    
    <main class="container mx-auto px-4 py-8">
      <router-view />
    </main>
    
    <footer class="bg-gray-800 text-white mt-16">
      <div class="container mx-auto px-4 py-6 text-center">
        <p class="text-sm text-gray-400">© 2026 Recruter Tech - Todos os direitos reservados</p>
        <p v-if="isElectronApp && electronInfo" class="text-xs text-gray-500 mt-1">
          Versão Desktop {{ electronInfo.version }} • Electron {{ electronInfo.electronVersion }}
        </p>
      </div>
    </footer>

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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { isElectron, getElectronInfo } from './utils/electron';
import SettingsModal from './components/SettingsModal.vue';
import CrudModal from './components/CrudModal.vue';

const isElectronApp = ref(false);
const electronInfo = ref(null);
const isSettingsOpen = ref(false);
const isCrudModalOpen = ref(false);

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

onMounted(async () => {
  isElectronApp.value = isElectron();
  
  if (isElectronApp.value) {
    electronInfo.value = await getElectronInfo();
    console.log('Rodando no Electron:', electronInfo.value);
  }
});
</script>
