<template>
  <div id="app" class="min-h-screen bg-gray-300">
    <header class="bg-primary-600 text-white shadow-lg">
      <div class="container mx-auto px-4 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold">Recruter Tech</h1>
            <p class="text-primary-100 mt-1">Sistema de Entrevistas Técnicas</p>
          </div>
          <div v-if="isElectronApp" class="text-right">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-500 text-white">
              🖥️ Desktop App
            </span>
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { isElectron, getElectronInfo } from './utils/electron';

const isElectronApp = ref(false);
const electronInfo = ref(null);

onMounted(async () => {
  isElectronApp.value = isElectron();
  
  if (isElectronApp.value) {
    electronInfo.value = await getElectronInfo();
    console.log('Rodando no Electron:', electronInfo.value);
  }
});
</script>
