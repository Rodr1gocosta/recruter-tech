# 🖥️ Recruter Tech - Versão Desktop

## 📦 Electron 28

Este projeto agora suporta execução como aplicação desktop para **Windows** e **Linux** usando Electron 28.

## 🚀 Desenvolvimento

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn

### Instalação

```bash
# Instalar todas as dependências (raiz, frontend e backend)
npm install
```

### Executar em modo desenvolvimento

#### Linux:
```bash
chmod +x desktop.sh
./desktop.sh
```

#### Windows:
```bash
desktop.bat
```

#### Ou manualmente:
```bash
npm run dev
```

Isso irá:
1. Iniciar o backend Node.js na porta 3000
2. Iniciar o Vite dev server na porta 5173
3. Abrir a aplicação Electron com DevTools

## 📦 Build para Produção

### Build para Windows

```bash
npm run build:win
```

Gera um instalador NSIS em `dist-electron/`

### Build para Linux

```bash
npm run build:linux
```

Gera AppImage e pacote .deb em `dist-electron/`

### Build para ambas plataformas

```bash
npm run build:all
```

## 🏗️ Estrutura Electron

```
recruter-tech/
├── electron/
│   ├── main.js          # Processo principal do Electron
│   └── preload.js       # Script de preload (segurança)
├── build/
│   ├── icon.ico         # Ícone Windows
│   ├── icon.png         # Ícone Linux
│   └── README.md        # Instruções para ícones
├── package.json         # Dependências e scripts Electron
├── desktop.sh           # Script de início (Linux)
└── desktop.bat          # Script de início (Windows)
```

## ⚙️ Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` no diretório `backend/`:

```env
# OpenAI API Key (obrigatório para gerar relatórios)
OPENAI_API_KEY=sua_chave_aqui

# Porta do backend (padrão: 3000)
PORT=3000
```

### Personalizando Ícones

1. Prepare uma imagem PNG de alta resolução (1024x1024)
2. Instale o gerador de ícones:
```bash
npm install -g electron-icon-maker
```
3. Gere os ícones:
```bash
electron-icon-maker --input=seu-logo.png --output=build
```

## 🔧 Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia em modo desenvolvimento |
| `npm run dev:backend` | Apenas backend |
| `npm run dev:frontend` | Apenas frontend |
| `npm run dev:electron` | Apenas Electron |
| `npm run build` | Build completo |
| `npm run build:win` | Build para Windows |
| `npm run build:linux` | Build para Linux |
| `npm run build:all` | Build para Windows e Linux |

## 📋 Requisitos do Sistema

### Desenvolvimento
- **RAM**: 4 GB mínimo (8 GB recomendado)
- **Disco**: 2 GB para dependências
- **SO**: Windows 10+, Ubuntu 18.04+, ou outras distros Linux

### Aplicação Final
- **RAM**: 2 GB mínimo
- **Disco**: 200 MB
- **SO**: 
  - Windows: Windows 7+
  - Linux: Kernel 4.0+

## 🐛 Troubleshooting

### Problema: Erro ao iniciar o Electron
**Solução**: Certifique-se de que as portas 3000 e 5173 estão livres.

### Problema: Backend não inicia
**Solução**: Verifique se todas as dependências foram instaladas:
```bash
cd backend && npm install
```

### Problema: Frontend não carrega
**Solução**: Reconstrua o frontend:
```bash
cd frontend && npm install && npm run build
```

### Problema: Erro ao fazer build
**Solução**: Limpe e reinstale:
```bash
rm -rf node_modules frontend/node_modules backend/node_modules
npm install
```

## 🔐 Segurança

O Electron está configurado com as melhores práticas de segurança:

- ✅ **Context Isolation** ativado
- ✅ **Node Integration** desativado
- ✅ **Remote Module** desativado
- ✅ **Preload Script** para comunicação segura

## 📝 Notas Importantes

1. **Produção**: Em produção, o backend é empacotado junto com o Electron
2. **Desenvolvimento**: Em dev, backend e frontend rodam separadamente
3. **API Key**: Necessária para funcionalidade completa (geração de relatórios)
4. **Cross-platform**: Os builds devem ser feitos no SO correspondente (Windows para .exe, Linux para AppImage/deb)

## 🆘 Suporte

Em caso de problemas, verifique:
1. Versão do Node.js (deve ser 18+)
2. Logs do console do Electron (DevTools)
3. Logs do backend (terminal)
4. Arquivo `.env` configurado corretamente

## 📚 Recursos

- [Documentação Electron](https://www.electronjs.org/docs)
- [Electron Builder](https://www.electron.build/)
- [Vite](https://vitejs.dev/)
- [Vue 3](https://vuejs.org/)

import isDev from 'electron-is-dev';
