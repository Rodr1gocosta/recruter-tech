# 🎯 Recruter Tech - Sistema de Entrevistas Técnicas

Sistema completo para conduzir entrevistas técnicas e gerar relatórios profissionais usando Inteligência Artificial. Disponível como **aplicação web (Docker)** ou **aplicação desktop (Electron)**.

## 📋 Sobre o Projeto

O **Recruter Tech** automatiza e otimiza o processo de entrevistas técnicas, permitindo que recrutadores:

- ✅ Coletem informações estruturadas dos candidatos
- ✅ Processem currículos em PDF automaticamente
- ✅ Conduzam entrevistas divididas em etapas claras
- ✅ Avaliem competências técnicas com pontuação objetiva
- ✅ Gerem relatórios profissionais usando IA (OpenAI, Google Gemini, Anthropic, etc.)
- ✅ Exportem relatórios em PDF de alta qualidade
- ✅ **Persistência de dados** - Sessões salvas automaticamente

## 🚀 Início Rápido

### 🖥️ **Modo Desktop (Recomendado para uso local)**

```bash
# 1. Instalar dependências (primeira vez)
npm install

# 2. Executar aplicação
npm run dev         # Ou use os scripts: desktop.bat (Windows) / ./desktop.sh (Linux)
```

### 🐳 **Modo Docker (Recomendado para servidor)**

```bash
# 1. Configurar variáveis de ambiente
cp .env.example .env
# Edite .env e adicione sua OPENAI_API_KEY

# 2. Iniciar containers
docker-compose up -d

# 3. Acessar
http://localhost
```

## 📁 Estrutura do Projeto

```
recruter-tech/
├── 📄 README.md                    # Documentação principal
├── 📄 CHANGELOG.md                 # Histórico de versões
├── 📄 TROUBLESHOOTING.md           # Solução de problemas
├── 📄 package.json                 # Configuração Electron (raiz)
├── 🔧 desktop.sh / desktop.bat     # Scripts para executar desktop
├── 🔧 start.sh / start.bat         # Scripts para Docker
│
├── 📂 electron/                    # 🖥️ Aplicação Desktop
│   ├── main.js                     # Processo principal Electron (store + IPC)
│   └── preload.js                  # Preload script (CommonJS, acesso via IPC)
│
├── 📂 frontend/                    # 🎨 Interface Vue.js
│   ├── src/
│   │   ├── components/             # Componentes das etapas
│   │   ├── views/                  # InterviewFlow principal
│   │   ├── services/               # API, storage
│   │   └── utils/                  # Utilitários (storage.js)
│   ├── vite.config.js
│   └── package.json
│
├── 📂 backend/                     # ⚙️ API Node.js
│   ├── src/
│   │   ├── controllers/            # Lógica de negócio
│   │   ├── routes/                 # Endpoints REST
│   │   ├── services/               # IA, PDF, sessões
│   │   └── config/                 # Multer, etc
│   ├── data/
│   │   ├── questions.json          # Perguntas técnicas
│   │   └── sessions/               # Sessões salvas (produção)
│   └── package.json
│
└── 📂 build/                       # 🎨 Recursos para build
    └── icons/                      # Ícones da aplicação
```

## 🚀 Tecnologias Utilizadas

### Frontend
- **Vue 3** (Composition API) - Framework progressivo
- **Vite 5** - Build tool ultra rápido
- **Tailwind CSS 3** - Framework CSS utilitário
- **Vue Router 4** - Roteamento
- **Axios** - Cliente HTTP

### Backend
- **Node.js 20+** - Runtime JavaScript
- **Express** - Framework web minimalista
- **OpenAI (GPT-5.4 mini) / Google Gemini 3.0 Flash / Anthropic Claude / Groq** - Geração de relatórios com IA
- **PDFKit** - Geração de PDFs profissionais
- **Multer** - Upload de arquivos
- **pdf-parse** - Extração de texto de PDFs

### Desktop
- **Electron 28** - Framework para aplicações desktop
- **electron-builder** - Empacotamento para Windows e Linux
- **electron-store v11** - Persistência de dados local (processo principal via IPC)

### DevOps
- **Docker** - Containerização
- **Docker Compose** - Orquestração de containers
- **Nginx** - Servidor web para frontend

---

## 🖥️ Instalação e Uso - Modo Desktop

### Primeira Instalação

```bash
# 1. Instalar todas as dependências
npm install

# Isso instala dependências da raiz, frontend e backend automaticamente
```

### Executar em Desenvolvimento

**Linux/Mac:**
```bash
chmod +x desktop.sh
./desktop.sh
```

**Windows:**
```bash
desktop.bat
```

**Ou diretamente:**
```bash
npm run dev
```

Isso irá:
1. ✅ Iniciar o backend (porta 3000)
2. ✅ Iniciar o frontend (porta 5173)
3. ✅ Abrir aplicação Electron automaticamente

### Build para Produção

```bash
# Windows (gera instalador .exe)
npm run build:win

# Linux (gera AppImage e .deb)
npm run build:linux

# Ambos
npm run build:all
```

**Executáveis gerados em:** `dist-electron/`

### 📁 Onde os Dados Ficam (Desktop)

**Em Desenvolvimento:**
- Dados: `./backend/data/`
- Uploads: `./backend/uploads/`
- Sessões: `./backend/data/sessions/`

**Em Produção (Executável):**
```
C:\Users\{seu_usuario}\AppData\Roaming\recruter-tech\
├── config.json              # Configurações (electron-store)
│   ├── technicalReferences  # Referências Técnicas *
│   ├── clients              # Clientes *
│   ├── recruiters           # Nome Responsável RH *
│   ├── technicalQuestions   # Perguntas técnicas customizadas
│   └── api_keys             # Chaves de API (OpenAI, Gemini, etc)
├── data/
│   ├── questions.json       # Perguntas técnicas (arquivo JSON)
│   └── sessions/            # Sessões de entrevista
└── uploads/                 # Arquivos temporários
```

**Nota:** Os dados marcados com * (Referências Técnicas, Clientes e Responsáveis RH) são salvos no **electron-store** (`config.json`) e ficam persistidos localmente no computador do usuário.

---

## 🐳 Instalação e Uso - Modo Docker

### Pré-requisitos
- Docker 20.10+
- Docker Compose 2.0+
- Chave de API OpenAI ([Obter aqui](https://platform.openai.com/api-keys))

### 1. Clone o repositório

```bash
git clone <seu-repositorio>
cd recruter-tech
```

### 2. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

Edite o arquivo `.env` e adicione sua chave:

```env
OPENAI_API_KEY=sk-your-actual-openai-api-key-here
```

### 3. Inicie os containers

```bash
docker-compose up -d
```

Isso irá:
- Buildar as imagens do frontend e backend
- Iniciar os containers
- Configurar a rede entre eles

### 4. Acesse a aplicação

Abra seu navegador e acesse:

```
http://localhost
```

O backend estará rodando em `http://localhost:3000`

## 🔄 Fluxo de Uso

### 1️⃣ **Etapa Inicial** - Preenchimento de Dados
- Nome do candidato
- Email
- Recrutadora responsável
- Vaga
- Data da entrevista
- Upload do currículo (PDF)

### 2️⃣ **Etapa Experiência** (15 min)
Durante a conversa com o candidato, preencha:
- **Guia lateral interativo** com 15 categorias de validação:
  - ✅ Java (versões), Frameworks (Spring Boot, Quarkus)
  - ✅ Arquitetura, Persistência, Bancos de Dados
  - ✅ Mensageria, CI/CD, Cloud, Observabilidade
  - ✅ Boas práticas, Testes, Front-end, Metodologias
  - Marque cada tópico conforme aborda com o candidato
- Experiências principais
- Tecnologias usadas
- Desafios resolvidos
- Pontos fortes percebidos
- Avaliação de comunicação

**💡 Dica:** Use o guia como checklist para garantir que cobriu todos os pontos importantes!

### 3️⃣ **Etapa Técnica** (15 min)
- Perguntas pré-definidas por categoria
- Avaliação de 0 a 5 pontos para cada resposta
- Observações sobre as respostas
- Cálculo automático da pontuação total

### 4️⃣ **Geração do Relatório**
- Adicione suas notas finais
- Gere o relatório com IA (GPT-4)
- Baixe o PDF profissional

## 📝 Personalizando as Perguntas Técnicas

Edite o arquivo `backend/data/questions.json` para customizar as perguntas:

```json
{
  "categories": [
    {
      "id": "frontend",
      "name": "Frontend",
      "questions": [
        {
          "id": 1,
          "question": "Sua pergunta aqui?",
          "maxScore": 5
        }
      ]
    }
  ]
}
```

## 🛠️ Comandos Úteis

### Desktop - Desenvolvimento

```bash
# Iniciar aplicação completa
npm run dev

# Ou usar scripts auxiliares
./desktop.sh          # Linux/Mac
desktop.bat           # Windows

# Iniciar apenas backend
npm run dev:backend

# Iniciar apenas frontend  
npm run dev:frontend

# Iniciar apenas Electron (requer backend e frontend rodando)
npm run dev:electron
```

### Desktop - Build e Distribuição

```bash
# Build frontend + backend
npm run build

# Build do frontend
npm run build:frontend

# Empacotar para Windows (instalador .exe)
npm run build:win
build.bat             # Ou use o script interativo (Windows)

# Empacotar para Linux (AppImage + .deb)
npm run build:linux
./build.sh            # Ou use o script interativo (Linux/Mac)

# Empacotar para ambos
npm run build:all
```

### Scripts Utilitários

```bash
# Verificar status do Docker (Linux/Mac)
./scripts/check-docker.sh

# Gerar ícones automaticamente (requer ImageMagick)
./scripts/generate-icons.sh
```

### Docker - Gerenciamento

```bash
# Iniciar containers
docker-compose up -d

# Ver logs em tempo real
docker-compose logs -f

# Ver logs de um serviço específico
docker-compose logs -f backend
docker-compose logs -f frontend

# Parar containers
docker-compose down

# Rebuild após mudanças no código
docker-compose up -d --build

# Ver status dos containers
docker-compose ps

# Entrar no container
docker-compose exec backend sh
docker-compose exec frontend sh
```

## 📊 API Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/interview/upload-resume` | Upload do currículo PDF |
| POST | `/api/interview/experience` | Salvar dados de experiência |
| POST | `/api/interview/technical` | Salvar avaliação técnica |
| POST | `/api/interview/generate-report` | Gerar relatório com IA |
| GET | `/api/interview/questions` | Obter perguntas técnicas |
| GET | `/api/interview/download/:fileName` | Download do PDF |

## 🔒 Segurança e Dados

### Segurança
- ✅ Validação de tipos de arquivo (apenas PDF)
- ✅ Limite de tamanho de arquivo (5MB)
- ✅ CORS configurado adequadamente
- ✅ Variáveis de ambiente para credenciais
- ✅ Context isolation no Electron
- ✅ Preload script para segurança

### Persistência de Dados

**Frontend (electron-store - `config.json`):**
- Chaves de API (OpenAI, Gemini, Anthropic, etc.)
- **Clientes** * - Salvos localmente no computador
- **Recrutadores** * - Salvos localmente no computador
- **Referências Técnicas** * - Salvos localmente no computador
- Perguntas técnicas customizadas
- Configurações do usuário

**Backend (Arquivos JSON):**
- **Perguntas Técnicas** - Salvas em `questions.json` (arquivo no disco)
- Sessões de entrevista em andamento (salvas automaticamente)
- Histórico de sessões (até deletar manualmente)

**Arquivos Temporários:**
- Currículos (deletados após gerar relatório)
- PDFs de relatórios (deletados 5 segundos após download)
- Cleanup automático

**Nota:** Dados marcados com * ficam persistidos em `AppData\Roaming\recruter-tech\config.json` e sobrevivem após fechar o aplicativo.

## 🎨 Customização

### Cores e Estilo

Edite `frontend/tailwind.config.js` para mudar a paleta de cores:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Suas cores personalizadas
      }
    }
  }
}
```

### Modelo de Relatório

Edite `backend/src/services/aiService.js` para customizar o prompt da IA.

## � Configuração de Chaves de API

O sistema suporta múltiplos provedores de IA com fallback automático:

### Provedores Suportados
- **OpenAI** (GPT-4, GPT-3.5)
- **Google Gemini** (Gemini Pro)
- **Anthropic** (Claude)
- **Groq** (Llama, Mixtral)
- **Cohere**

### Como Configurar

**No Desktop:**
1. Clique em **⚙️ Configurações** no canto superior direito
2. Adicione suas chaves de API
3. Ative/desative chaves conforme necessário
4. O sistema tenta em ordem de prioridade com fallback automático

**No Docker:**
Use o arquivo `.env`:
```env
OPENAI_API_KEY=sk-...
```

### Obter Chaves de API
- OpenAI: https://platform.openai.com/api-keys
- Google AI: https://makersuite.google.com/app/apikey
- Anthropic: https://console.anthropic.com/settings/keys
- Groq: https://console.groq.com/keys
- Cohere: https://dashboard.cohere.com/api-keys

---

## 📝 Personalização

### Customizar Perguntas Técnicas

**Na Aplicação:**
Clique em **❓ Perguntas** no menu lateral para:
- Criar novos temas
- Adicionar/editar perguntas
- Definir pontuação máxima
- Adicionar dicas para cada pergunta

**Manualmente:**
Edite `backend/data/questions.json`:

```json
{
  "categories": [
    {
      "id": "frontend",
      "name": "Frontend",
      "questions": [
        {
          "id": 1,
          "question": "Sua pergunta aqui?",
          "hint": "Dica opcional para o avaliador",
          "maxScore": 5
        }
      ]
    }
  ]
}
```

### Customizar Cores e Estilo

Edite `frontend/tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        50: '#e6f0f2',
        // ... suas cores personalizadas
      }
    }
  }
}
```

### Customizar Modelo de Relatório

Edite `backend/src/services/aiService.js` para ajustar o prompt enviado à IA.

---

## 🐛 Solução de Problemas

Para problemas comuns e soluções detalhadas, veja [TROUBLESHOOTING.md](TROUBLESHOOTING.md).

**Problemas mais comuns:**

### Desktop: Formulário não aparece
- Verifique o console do DevTools (F12)
- Certifique-se que todos os imports estão corretos
- Rode `npm install` novamente na raiz

### Erro: "Falha ao gerar relatório com IA"
- Verifique se a chave de API está configurada corretamente
- Confirme que você tem créditos disponíveis
- Tente usar outro provedor (fallback automático)
- Verifique os logs do backend

### Erro ao fazer upload de PDF
- Certifique-se que o arquivo é um PDF válido
- Verifique se o tamanho é menor que 5MB
- Confirme que o backend está rodando

### Docker: Frontend não conecta ao backend
- Verifique se ambos os containers estão rodando: `docker-compose ps`
- Confira os logs: `docker-compose logs`
- Tente rebuild: `docker-compose up -d --build`

---

## 📈 Roadmap e Melhorias Futuras

- [ ] Autenticação de usuários
- [ ] Banco de dados (PostgreSQL)
- [ ] Histórico de entrevistas com busca
- [ ] Dashboard com estatísticas
- [ ] Exportar/importar dados
- [ ] Suporte a templates de relatório customizáveis
- [ ] Integração com sistemas de ATS
- [ ] Modo offline (PWA)
- [ ] Temas claro/escuro
- [ ] Internacionalização (i18n)
- [ ] Múltiplos idiomas
- [ ] Temas claro/escuro
- [ ] Exportação para Word
- [ ] Dashboard de estatísticas
- [ ] Integração com calendário
- [ ] Notificações por email

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 👥 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## 📧 Suporte

Para questões e suporte, abra uma issue no repositório.

---

**Desenvolvido com ❤️ usando Vue.js, Node.js e OpenAI**
