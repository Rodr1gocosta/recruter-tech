# Coloque os ícones da aplicação aqui

## Ícones necessários:

### Windows:
- **icon.ico** - Ícone para Windows (256x256 px ou maior)
  - Formatos recomendados: 16x16, 32x32, 48x48, 256x256

### Linux:
- **icon.png** - Ícone para Linux (512x512 px)
  - Formato: PNG com transparência

## Instalador Windows (NSIS):

### installer.nsh
Script customizado para instalação/desinstalação no Windows que:
- **Durante a desinstalação**: Pergunta ao usuário se deseja remover os dados salvos
- Remove completamente o diretório `AppData\Roaming\recruter-tech` se confirmado
- Remove configurações, chaves API, currículos, sessões e perguntas

## Ferramentas úteis para criar ícones:

- [Icon Generator](https://www.favicon-generator.org/)
- [ICO Converter](https://www.icoconverter.com/)
- [Electron Icon Maker](https://www.npmjs.com/package/electron-icon-maker)

## Gerando ícones automaticamente:

```bash
npm install -g electron-icon-maker
electron-icon-maker --input=logo.png --output=build
```

Isso irá gerar todos os ícones necessários a partir de uma imagem PNG de alta resolução (1024x1024 recomendado).
