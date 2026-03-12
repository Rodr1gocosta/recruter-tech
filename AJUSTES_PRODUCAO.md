# ✅ Ajustes para Produção - Recruter Tech

## 🎯 Modificações Realizadas

### 1. **Correção de Paths no Backend (Produção)**

#### Arquivos Modificados:
- ✅ [electron/main.js](electron/main.js)
- ✅ [backend/src/controllers/interviewController.js](backend/src/controllers/interviewController.js)
- ✅ [backend/src/services/pdfService.js](backend/src/services/pdfService.js)
- ✅ [backend/src/config/multer.js](backend/src/config/multer.js)

#### O que foi feito:
- Paths agora usam `app.getPath('userData')` quando em produção
- Diretórios são criados automaticamente (`data/`, `uploads/`, `sessions/`)
- `questions.json` é copiado para userData na primeira execução
- Variáveis de ambiente passadas do Electron para o backend:
  - `DATA_PATH` - onde ficam dados persistentes
  - `UPLOADS_PATH` - onde ficam uploads temporários
  - `SESSIONS_PATH` - onde ficam as sessões salvas

**Antes:**
```javascript
const questionsPath = path.join(process.cwd(), 'data', 'questions.json'); // ❌ Não funciona empacotado
```

**Depois:**
```javascript
const DATA_PATH = process.env.DATA_PATH || path.join(process.cwd(), 'data'); // ✅ Funciona em dev e prod
const questionsPath = path.join(DATA_PATH, 'questions.json');
```

---

### 2. **Implementação do electron-store**

#### Arquivos Modificados:
- ✅ [electron/preload.js](electron/preload.js) - Exposição da API do store
- ✅ [frontend/src/utils/storage.js](frontend/src/utils/storage.js) - **NOVO** - Utilitário de storage
- ✅ [frontend/src/components/CrudModal.vue](frontend/src/components/CrudModal.vue)
- ✅ [frontend/src/components/QuestionsModal.vue](frontend/src/components/QuestionsModal.vue)
- ✅ [frontend/src/components/SettingsModal.vue](frontend/src/components/SettingsModal.vue)
- ✅ [frontend/src/components/StepInitial.vue](frontend/src/components/StepInitial.vue)
- ✅ [frontend/src/components/StepTechnical.vue](frontend/src/components/StepTechnical.vue)
- ✅ [frontend/src/services/api.js](frontend/src/services/api.js)

#### O que foi feito:
- Instalado `electron-store` para persistência consistente
- Criado utilitário `storage.js` que:
  - Usa `electron-store` quando disponível (Electron)
  - Faz fallback para `localStorage` (modo web)
  - Migra dados automaticamente do localStorage para electron-store
- Todos os componentes agora usam o novo storage

**Vantagens:**
- ✅ Dados persistem entre dev e produção
- ✅ Local consistente (`AppData\Roaming\recruter-tech`)
- ✅ Migração automática de dados antigos
- ✅ Type-safe e com validação de schema

---

### 3. **Persistência de Sessões em Disco**

#### Arquivos Criados:
- ✅ [backend/src/services/sessionService.js](backend/src/services/sessionService.js) - **NOVO**

#### O que foi feito:
- Sessões agora são salvas em arquivos JSON em `data/sessions/`
- Dados não se perdem ao fechar o aplicativo
- Limpeza automática de sessões antigas (7 dias)
- Funções implementadas:
  - `saveSession()` - Salvar sessão
  - `loadSession()` - Carregar sessão
  - `updateSession()` - Atualizar sessão existente
  - `deleteSession()` - Remover sessão
  - `listSessions()` - Listar todas as sessões
  - `cleanOldSessions()` - Limpar sessões antigas

**Antes:**
```javascript
const sessions = new Map(); // ❌ Perde tudo ao fechar o app
sessions.set(sessionId, data);
```

**Depois:**
```javascript
saveSession(sessionId, data); // ✅ Salva em disco
const session = loadSession(sessionId); // ✅ Recupera de disco
```

---

## 📁 Estrutura de Dados em Produção

```
C:\Users\{user}\AppData\Roaming\recruter-tech\
├── config.json                     # electron-store (configurações e dados do frontend)
│   ├── technicalReferences: []
│   ├── clients: []
│   ├── recruiters: []
│   ├── apiKeys: []
│   └── questions: []
│
├── data/
│   ├── questions.json              # Perguntas técnicas (copiado na primeira execução)
│   └── sessions/                   # Sessões de entrevista
│       ├── 1710252000000.json      # Sessão 1
│       └── 1710252100000.json      # Sessão 2
│
└── uploads/                        # Arquivos temporários
    ├── curriculo-123.pdf
    └── relatorio-joao-silva.pdf
```

---

## 🧪 Como Testar

### **Passo 1: Rebuild Completo**

```powershell
# Limpar builds anteriores
Remove-Item -Recurse -Force .\frontend\dist -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .\dist-electron -ErrorAction SilentlyContinue

# Rebuild do frontend
cd frontend
npm run build
cd ..

# Rebuild do desktop
npm run build:win
```

### **Passo 2: Testar em Desenvolvimento**

```powershell
# Iniciar em modo dev (testa migração do localStorage)
npm run dev
```

**Verificar:**
- ✅ Dados antigos do localStorage foram migrados
- ✅ Console mostra mensagem de migração
- ✅ Storage agora usa electron-store

### **Passo 3: Testar Executável**

```powershell
# Executar versão não empacotada (mais rápido)
.\dist-electron\win-unpacked\recruter-tech.exe
```

**Verificar:**
1. ✅ Progress Bar aparece corretamente
2. ✅ Step Content aparece corretamente
3. ✅ Dados salvos permanecem após fechar e abrir
4. ✅ Perguntas técnicas carregam corretamente
5. ✅ Upload de currículo funciona
6. ✅ Geração de relatório funciona
7. ✅ Chaves de API são salvas corretamente

### **Passo 4: Verificar Paths em Produção**

Abra o DevTools (se necessário, modifique temporariamente [electron/main.js](electron/main.js#L52) para abrir o DevTools em produção):

```javascript
// Adicionar temporariamente para debug
mainWindow.webContents.openDevTools();
```

**Console deve mostrar:**
```
✅ Diretório criado: C:\Users\...\AppData\Roaming\recruter-tech\data
✅ Diretório criado: C:\Users\...\AppData\Roaming\recruter-tech\uploads
✅ Diretório criado: C:\Users\...\AppData\Roaming\recruter-tech\data\sessions
✅ questions.json copiado para userData
```

### **Passo 5: Testar Persistência de Sessões**

1. Inicie uma entrevista
2. Preencha alguns dados (experiência, respostas técnicas)
3. **Feche o aplicativo SEM gerar o relatório**
4. Abra novamente
5. ✅ Os dados devem ainda estar lá

**Verificar arquivos:**
```powershell
# Listar sessões salvas
Get-ChildItem "$env:APPDATA\recruter-tech\data\sessions"
```

---

## 🔍 Verificação de Dados

### **Ver configuração do electron-store:**
```powershell
Get-Content "$env:APPDATA\recruter-tech\config.json" | ConvertFrom-Json
```

### **Ver sessões salvas:**
```powershell
Get-ChildItem "$env:APPDATA\recruter-tech\data\sessions" | ForEach-Object {
    Write-Host "Sessão: $($_.BaseName)"
    Get-Content $_.FullName | ConvertFrom-Json
}
```

### **Ver questions.json:**
```powershell
Get-Content "$env:APPDATA\recruter-tech\data\questions.json" | ConvertFrom-Json
```

---

## 📊 Comparação Dev vs Produção

| Aspecto | Desenvolvimento | Produção |
|---------|----------------|----------|
| **Paths de dados** | `./backend/data` | `AppData\Roaming\recruter-tech\data` |
| **Uploads** | `./backend/uploads` | `AppData\Roaming\recruter-tech\uploads` |
| **Storage** | localStorage | electron-store |
| **Sessões** | Arquivos JSON | Arquivos JSON |
| **questions.json** | Lido do projeto | Copiado para userData |

---

## ⚠️ Problemas Conhecidos e Soluções

### **1. Dados não aparecem após rebuild**

**Causa:** electron-store usa um arquivo diferente para cada versão  
**Solução:** Os dados são migrados automaticamente na primeira execução

### **2. questions.json não encontrado**

**Causa:** Arquivo não foi copiado corretamente  
**Solução:** Verificar console do Electron para ver se houve erro na cópia

### **3. Sessões antigas ocupando espaço**

**Causa:** Sessões não finalizadas acumulam  
**Solução:** Limpeza automática de sessões > 7 dias já implementada

### **4. localStorage ainda sendo usado**

**Causa:** Componente não foi atualizado para usar `storage.js`  
**Solução:** Buscar por `localStorage` no código e substituir

---

## 🔄 Migração de Dados (Automática)

Quando o app é aberto pela primeira vez após a atualização:

1. ✅ `storage.js` detecta dados no localStorage
2. ✅ Copia todos os dados para electron-store
3. ✅ Marca como migrado (não migra novamente)
4. ✅ Mantém localStorage intacto (para compatibilidade)

**Dados migrados:**
- `technicalReferences`
- `clients`
- `recruiters`
- `technicalQuestions`
- `api_keys`
- `openai_api_key` (legado)
- `ai_provider` (legado)

---

## 📝 Notas Importantes

### **A fazer pelo usuário:**

1. ✅ Testar upload de currículo
2. ✅ Testar geração de relatório
3. ✅ Verificar se dados persistem
4. ✅ Confirmar que questions.json carrega corretamente

### **Não precisa fazer:**

- ❌ Migrar dados manualmente (é automático)
- ❌ Configurar paths (já configurados)
- ❌ Criar diretórios (criados automaticamente)

---

## 🚀 Próximos Passos Sugeridos

### **Opcional - Futuro:**

1. **Backup automático**
   - Exportar dados periodicamente
   - Botão "Exportar Backup" nas configurações

2. **Recuperação de sessões**
   - Listar sessões anteriores
   - Permitir continuar entrevista não finalizada

3. **Sincronização de dados**
   - Compartilhar dados entre máquinas
   - Importar/Exportar configurações

4. **Limpeza manual**
   - Botão para limpar sessões antigas
   - Gerenciar espaço em disco

---

## ✅ Checklist Final

Antes de distribuir o executável:

- [ ] Build completo executado sem erros
- [ ] Executável abre corretamente
- [ ] Progress Bar e Step Content aparecem
- [ ] Dados persistem após fechar e abrir
- [ ] Upload de currículo funciona
- [ ] Geração de relatório funciona
- [ ] Perguntas técnicas carregam
- [ ] Chaves de API são salvas
- [ ] Logs do console não mostram erros críticos

---

## 🆘 Suporte

Se encontrar problemas:

1. **Verificar console do Electron** (abrir DevTools)
2. **Verificar logs do backend** (aparecem no terminal)
3. **Verificar arquivos em** `AppData\Roaming\recruter-tech`
4. **Tentar limpar e rebuildar** tudo

**Comandos de limpeza:**
```powershell
# Limpar completamente
Remove-Item -Recurse -Force .\node_modules
Remove-Item -Recurse -Force .\frontend\node_modules
Remove-Item -Recurse -Force .\backend\node_modules
Remove-Item -Recurse -Force .\frontend\dist
Remove-Item -Recurse -Force .\dist-electron

# Reinstalar
npm install
cd frontend; npm install; cd ..
cd backend; npm install; cd ..

# Rebuild
npm run build:win
```

---

**Criado em:** 12/03/2026  
**Versão:** 1.0.0  
**Status:** ✅ Pronto para testes
