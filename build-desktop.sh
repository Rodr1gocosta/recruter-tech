#!/bin/bash

echo "🏗️ Build Script - Recruter Tech Desktop"
echo "========================================"
echo ""

# Detecta o sistema operacional
OS="$(uname -s)"
case "${OS}" in
    Linux*)     PLATFORM=linux;;
    Darwin*)    PLATFORM=mac;;
    MINGW*)     PLATFORM=windows;;
    MSYS*)      PLATFORM=windows;;
    *)          PLATFORM="UNKNOWN:${OS}"
esac

echo "Sistema detectado: $PLATFORM"
echo ""

# Menu de opções
echo "Escolha o tipo de build:"
echo "1) Build para Windows"
echo "2) Build para Linux"
echo "3) Build para ambas plataformas"
echo "4) Apenas compilar frontend e backend"
echo "5) Limpar builds anteriores"
echo ""
read -p "Opção [1-5]: " option

case $option in
    1)
        echo ""
        echo "🪟 Iniciando build para Windows..."
        npm run build:win
        ;;
    2)
        echo ""
        echo "🐧 Iniciando build para Linux..."
        npm run build:linux
        ;;
    3)
        echo ""
        echo "🌍 Iniciando build multiplataforma..."
        npm run build:all
        ;;
    4)
        echo ""
        echo "📦 Compilando frontend e backend..."
        npm run build
        ;;
    5)
        echo ""
        echo "🧹 Limpando builds anteriores..."
        rm -rf dist-electron/
        rm -rf frontend/dist/
        echo "✅ Limpeza concluída!"
        ;;
    *)
        echo "Opção inválida!"
        exit 1
        ;;
esac

echo ""
echo "✅ Processo concluído!"

if [ "$option" -le 3 ]; then
    echo ""
    echo "📁 Arquivos gerados em: dist-electron/"
    echo ""
    ls -lh dist-electron/ 2>/dev/null || echo "Nenhum arquivo gerado ainda."
fi
