# 📁 Estrutura do Projeto

```
recruter-tech/
│
├── 📄 README.md                    # Documentação completa
├── 📄 GUIA_RAPIDO.md              # Guia de início rápido
├── 📄 DESKTOP.md                  # Documentação versão desktop
├── 📄 DESKTOP_QUICKSTART.md       # Guia rápido desktop
├── 📄 TROUBLESHOOTING.md          # Solução de problemas
├── 📄 COMMANDS.md                 # Comandos úteis
├── 📄 CHANGELOG.md                # Histórico de mudanças
├── 📄 docker-compose.yml          # Orquestração dos containers
├── 📄 package.json                # Config Electron (raiz)
├── 📄 .env.example                # Exemplo de variáveis de ambiente
├── 📄 .gitignore                  # Arquivos ignorados pelo git
├── 🔧 start.sh                    # Script Docker (Linux/Mac)
├── 🔧 start.bat                   # Script Docker (Windows)
├── 🔧 desktop.sh                  # Script Desktop (Linux)
├── 🔧 desktop.bat                 # Script Desktop (Windows)
├── 🔧 build-desktop.sh            # Build interativo (Linux)
├── 🔧 build-desktop.bat           # Build interativo (Windows)
├── 🔧 generate-icons.sh           # Gerador de ícones
│
├── 📂 electron/                   # 🖥️ Aplicação Desktop (Electron)
│   ├── 📄 main.js                # Processo principal
│   └── 📄 preload.js             # Script de preload (segurança)
│
├── 📂 build/                      # 🎨 Assets para build
│   ├── 📄 icon.svg               # Ícone fonte (SVG)
│   ├── 📄 icon.png               # Ícone Linux (512x512)
│   ├── 📄 icon.ico               # Ícone Windows
│   └── 📄 README.md              # Instruções de ícones
│
├── 📂 backend/                    # ✨ Servidor Node.js + Express
│   ├── 📄 package.json           # Dependências do backend
│   ├── 📄 Dockerfile             # Container do backend
│   ├── 📄 .env.example           # Variáveis de ambiente
│   ├── 📄 .gitignore            
│   │
│   ├── 📂 src/                   # Código fonte
│   │   ├── 📄 server.js         # Servidor principal
│   │   │
│   │   ├── 📂 routes/           # 🛣️ Rotas da API
│   │   │   └── 📄 interview.js  # Rotas de entrevista
│   │   │
│   │   ├── 📂 controllers/      # 🎮 Lógica de negócio
│   │   │   └── 📄 interviewController.js
│   │   │
│   │   └── 📂 services/         # ⚙️ Serviços
│   │       ├── 📄 aiService.js      # Integração OpenAI
│   │       ├── 📄 pdfService.js     # Geração de PDF
│   │       └── 📄 resumeService.js  # Extração de texto
│   │
│   └── 📂 data/                  # 📋 Dados estáticos
│       └── 📄 questions.json     # Perguntas técnicas
│
└── 📂 frontend/                   # 🎨 Interface Vue.js
    ├── 📄 package.json           # Dependências do frontend
    ├── 📄 Dockerfile             # Container do frontend
    ├── 📄 vite.config.js         # Configuração Vite
    ├── 📄 tailwind.config.js     # Configuração Tailwind
    ├── 📄 postcss.config.js      # PostCSS
    ├── 📄 nginx.conf             # Configuração Nginx
    ├── 📄 index.html             # HTML principal
    ├── 📄 .gitignore
    │
    └── 📂 src/                    # Código fonte
        ├── 📄 main.js            # Ponto de entrada
        ├── 📄 App.vue            # Componente raiz
        ├── 📄 style.css          # Estilos globais
        │
        ├── 📂 views/             # 📱 Views/Páginas
        │   └── 📄 InterviewFlow.vue  # Fluxo principal
        │
        ├── 📂 components/        # 🧩 Componentes
        │   ├── 📄 StepInitial.vue     # Etapa 1: Dados iniciais
        │   ├── 📄 StepExperience.vue  # Etapa 2: Experiência
        │   ├── 📄 StepTechnical.vue   # Etapa 3: Avaliação técnica
        │   └── 📄 StepReport.vue      # Etapa 4: Relatório
        │
        ├── 📂 services/          # 🔌 Serviços
        │   └── 📄 api.js         # Cliente API
        │
        └── 📂 utils/             # 🛠️ Utilitários
            └── 📄 electron.js    # Detecção Electron
```

## 🔄 Fluxo de Dados

### Modo Web (Docker)
```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       │ HTTP Request
       ▼
┌─────────────────────┐
│  Frontend (Vue.js)  │
│   Port: 80 (Nginx)  │
└──────┬──────────────┘
       │
       │ Proxy /api
       ▼
┌─────────────────────┐
│  Backend (Node.js)  │
│   Port: 3000        │
└──────┬──────────────┘
       │
       ├─────────────────┐
       │                 │
       ▼                 ▼
┌────────────┐    ┌──────────────┐
│  OpenAI    │    │  File System │
│  API (IA)  │    │   (uploads/) │
└────────────┘    └──────────────┘
```

### Modo Desktop (Electron)
```
┌─────────────────────┐
│  Electron Window    │
│  (Chromium)         │
└──────┬──────────────┘
       │
       │ Renderiza
       ▼
┌─────────────────────┐
│  Frontend (Vue.js)  │
│  Vite Dev / Build   │
└──────┬──────────────┘
       │
       │ HTTP/API
       ▼
┌─────────────────────┐
│  Backend (Node.js)  │
│  Processo Filho     │
│  Port: 3000         │
└──────┬──────────────┘
       │
       ├─────────────────┐
       │                 │
       ▼                 ▼
┌────────────┐    ┌──────────────┐
│  OpenAI    │    │  File System │
│  API (IA)  │    │   (uploads/) │
└────────────┘    └──────────────┘
```

## 🔌 API Endpoints

```
POST   /api/interview/upload-resume
       ↳ Upload de currículo PDF
       ↳ Retorna: sessionId

POST   /api/interview/experience
       ↳ Salva dados de experiência
       ↳ Body: { sessionId, experienceNotes }

POST   /api/interview/technical
       ↳ Salva avaliação técnica
       ↳ Body: { sessionId, technicalAnswers }

POST   /api/interview/generate-report
       ↳ Gera relatório com IA
       ↳ Body: { sessionId, candidateInfo, finalNotes }
       ↳ Retorna: { report, pdfFileName }

GET    /api/interview/questions
       ↳ Retorna perguntas técnicas do JSON

GET    /api/interview/download/:fileName
       ↳ Download do PDF gerado
```

## 🎨 Componentes Vue

```
App.vue
  └── InterviewFlow.vue (View Principal)
       │
       ├── Progress Bar (4 etapas)
       │
       └── Dynamic Component
            │
            ├── StepInitial.vue
            │    ├── Form de dados
            │    └── Upload PDF
            │
            ├── StepExperience.vue
            │    └── TextAreas para notas
            │
            ├── StepTechnical.vue
            │    ├── Lista de perguntas
            │    └── Sliders de pontuação
            │
            └── StepReport.vue
                 ├── TextArea para notas finais
                 ├── Botão gerar IA
                 └── Preview + Download PDF
```

## 🐳 Docker Architecture

```
┌──────────────────────────────────────────┐
│         Docker Compose Network           │
│          (recruter-network)              │
│                                          │
│  ┌────────────┐      ┌────────────┐    │
│  │  Frontend  │◀────▶│  Backend   │    │
│  │  Container │      │  Container │    │
│  │            │      │            │    │
│  │  Nginx     │      │  Node.js   │    │
│  │  Port: 80  │      │  Port:3000 │    │
│  └────────────┘      └────┬───────┘    │
│                           │             │
│                           ▼             │
│                    ┌────────────┐       │
│                    │  Volume    │       │
│                    │  uploads/  │       │
│                    └────────────┘       │
└──────────────────────────────────────────┘
```

## 📦 Dependências Principais

### Backend
```json
{
  "express": "Framework web",
  "cors": "CORS middleware",
  "multer": "Upload de arquivos",
  "pdf-parse": "Ler PDFs",
  "pdfkit": "Gerar PDFs",
  "openai": "API da OpenAI",
  "dotenv": "Variáveis de ambiente"
}
```

### Frontend
```json
{
  "vue": "Framework UI",
  "vue-router": "Roteamento",
  "vite": "Build tool",
  "tailwindcss": "CSS framework",
  "axios": "HTTP client"
}
```
