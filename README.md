# 🎯 Recruter Tech - Sistema de Entrevistas Técnicas

Sistema completo e stateless para conduzir entrevistas técnicas e gerar relatórios profissionais usando Inteligência Artificial.

## 📋 Sobre o Projeto

O **Recruter Tech** é uma aplicação web moderna que automatiza e otimiza o processo de entrevistas técnicas, permitindo que recrutadores:

- ✅ Coletem informações estruturadas dos candidatos
- ✅ Processem currículos em PDF automaticamente
- ✅ Conduzam entrevistas divididas em etapas claras
- ✅ Avaliem competências técnicas com pontuação objetiva
- ✅ Gerem relatórios profissionais usando IA (OpenAI GPT-4)
- ✅ Exportem relatórios em PDF de alta qualidade

## 🏗️ Arquitetura

```
recruter-tech/
├── frontend/              # Vue 3 + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/   # Componentes das etapas
│   │   ├── views/        # View principal
│   │   ├── services/     # Serviços API
│   │   └── main.js
│   └── Dockerfile
├── backend/              # Node.js + Express
│   ├── src/
│   │   ├── controllers/  # Lógica de negócio
│   │   ├── routes/       # Endpoints da API
│   │   └── services/     # Serviços (IA, PDF, etc)
│   ├── data/
│   │   └── questions.json # Perguntas técnicas
│   └── Dockerfile
└── docker-compose.yml    # Orquestração dos containers
```

## 🚀 Tecnologias Utilizadas

### Frontend
- **Vue 3** (Composition API) - Framework progressivo
- **Vite 5** - Build tool super rápido
- **Tailwind CSS 3** - Framework CSS utilitário
- **Vue Router 4** - Roteamento
- **Axios** - Cliente HTTP

### Backend
- **Node.js 20+** - Runtime JavaScript
- **Express** - Framework web
- **OpenAI API** - Geração de relatórios com IA
- **PDFKit** - Geração de PDFs
- **Multer** - Upload de arquivos
- **pdf-parse** - Extração de texto de PDFs

### DevOps
- **Docker** - Containerização
- **Docker Compose** - Orquestração
- **Nginx** - Servidor web para o frontend

### Desktop
- **Electron 28** - Framework para apps desktop
- **electron-builder** - Empacotamento para Windows e Linux

## 🖥️ Versão Desktop

Este projeto também pode ser executado como **aplicação desktop** para Windows e Linux!

### Executar Desktop

```bash
# Linux
chmod +x desktop.sh
./desktop.sh

# Windows
desktop.bat
```

### Build Desktop

```bash
# Build para Windows
npm run build:win

# Build para Linux
npm run build:linux

# Build para ambos
npm run build:all
```

📖 **Documentação completa**: Veja [DESKTOP.md](DESKTOP.md) para instruções detalhadas.

## 📦 Pré-requisitos

- Docker 20.10+
- Docker Compose 2.0+
- Chave de API da OpenAI ([Obter aqui](https://platform.openai.com/api-keys))

## ⚙️ Instalação e Configuração

### 1. Clone o repositório

```bash
git clone <seu-repositorio>
cd recruter-tech
```

### 2. Configure as variáveis de ambiente

Copie o arquivo de exemplo e adicione sua chave da OpenAI:

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

### Desenvolvimento Local (sem Docker)

**Backend:**
```bash
cd backend
npm install
cp .env.example .env  # Configure a API key
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### Docker

```bash
# Iniciar containers
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar containers
docker-compose down

# Rebuild após mudanças
docker-compose up -d --build

# Ver status
docker-compose ps
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

## 🔒 Segurança

- ✅ Validação de tipos de arquivo (apenas PDF)
- ✅ Limite de tamanho de arquivo (5MB)
- ✅ CORS configurado
- ✅ Variáveis de ambiente para credenciais
- ✅ Cleanup automático de arquivos temporários

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

## 🐛 Troubleshooting

### Erro: "Falha ao gerar relatório com IA"
- Verifique se a `OPENAI_API_KEY` está configurada corretamente
- Confirme que você tem créditos na sua conta OpenAI
- Verifique os logs: `docker-compose logs backend`

### Erro ao fazer upload de PDF
- Certifique-se que o arquivo é um PDF válido
- Verifique se o tamanho é menor que 5MB

### Frontend não conecta ao backend
- Verifique se ambos os containers estão rodando: `docker-compose ps`
- Confira os logs: `docker-compose logs`

## 📈 Melhorias Futuras

- [ ] Autenticação de usuários
- [ ] Banco de dados para persistência
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
