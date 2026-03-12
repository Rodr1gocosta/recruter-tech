/**
 * Utilitário para persistência de dados
 * Usa electron-store quando disponível, fallback para localStorage
 */

const isElectron = window.electronAPI?.isElectron || false;

/**
 * Migra dados do localStorage para electron-store
 * Executado apenas uma vez na primeira inicialização
 */
export const migrateFromLocalStorage = () => {
  if (!isElectron || !window.electronAPI?.store) {
    console.log('⚠️ Não está rodando no Electron, pulando migração');
    return;
  }

  // Verificar se já migrou
  if (window.electronAPI.store.get('_migrated')) {
    console.log('✅ Dados já migrados anteriormente');
    return;
  }

  console.log('🔄 Iniciando migração de dados do localStorage para electron-store...');

  const keys = [
    'technicalReferences',
    'clients', 
    'recruiters',
    'technicalQuestions',
    'api_keys',
    'openai_api_key',
    'ai_provider'
  ];

  let migratedCount = 0;

  keys.forEach(key => {
    const oldData = localStorage.getItem(key);
    if (oldData) {
      try {
        // Tentar parsear como JSON
        let parsed;
        try {
          parsed = JSON.parse(oldData);
        } catch {
          // Se não for JSON, usar o valor direto
          parsed = oldData;
        }
        
        window.electronAPI.store.set(key, parsed);
        console.log(`✅ Migrado: ${key}`);
        migratedCount++;
      } catch (e) {
        console.error(`❌ Erro ao migrar ${key}:`, e);
      }
    }
  });

  // Marcar como migrado
  window.electronAPI.store.set('_migrated', true);
  
  console.log(`🎉 Migração concluída! ${migratedCount} itens migrados.`);
  console.log('💡 Os dados antigos do localStorage foram preservados.');
};

/**
 * Obter valor do storage
 */
export const getStorage = (key, defaultValue = null) => {
  if (isElectron && window.electronAPI?.store) {
    return window.electronAPI.store.get(key, defaultValue);
  }
  
  // Fallback para localStorage
  const value = localStorage.getItem(key);
  if (value === null) return defaultValue;
  
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

/**
 * Definir valor no storage
 */
export const setStorage = (key, value) => {
  if (isElectron && window.electronAPI?.store) {
    window.electronAPI.store.set(key, value);
  } else {
    // Fallback para localStorage
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(key, stringValue);
  }
};

/**
 * Remover valor do storage
 */
export const removeStorage = (key) => {
  if (isElectron && window.electronAPI?.store) {
    window.electronAPI.store.delete(key);
  } else {
    localStorage.removeItem(key);
  }
};

/**
 * Verificar se existe uma chave
 */
export const hasStorage = (key) => {
  if (isElectron && window.electronAPI?.store) {
    return window.electronAPI.store.has(key);
  }
  return localStorage.getItem(key) !== null;
};

/**
 * Limpar todo o storage
 */
export const clearStorage = () => {
  if (isElectron && window.electronAPI?.store) {
    window.electronAPI.store.clear();
  } else {
    localStorage.clear();
  }
};

/**
 * Exportar todos os dados (para backup)
 */
export const exportAllData = () => {
  if (isElectron && window.electronAPI?.store) {
    return window.electronAPI.store.getAll();
  }
  
  // Fallback para localStorage
  const data = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const value = localStorage.getItem(key);
    try {
      data[key] = JSON.parse(value);
    } catch {
      data[key] = value;
    }
  }
  return data;
};

/**
 * Importar dados (de backup)
 */
export const importAllData = (data) => {
  if (isElectron && window.electronAPI?.store) {
    window.electronAPI.store.setMultiple(data);
  } else {
    Object.entries(data).forEach(([key, value]) => {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, stringValue);
    });
  }
};

// Executar migração automaticamente quando o módulo for importado
if (isElectron) {
  migrateFromLocalStorage();
}
