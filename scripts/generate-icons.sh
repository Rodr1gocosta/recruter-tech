#!/bin/bash

echo "🎨 Gerador de Ícones - Recruter Tech"
echo "===================================="
echo ""

# Verifica se ImageMagick está instalado
if ! command -v convert &> /dev/null; then
    echo "⚠️  ImageMagick não encontrado!"
    echo ""
    echo "Para gerar ícones automaticamente, instale o ImageMagick:"
    echo ""
    echo "Ubuntu/Debian:"
    echo "  sudo apt-get install imagemagick"
    echo ""
    echo "macOS:"
    echo "  brew install imagemagick"
    echo ""
    echo "Ou use ferramentas online:"
    echo "  - https://convertio.co/svg-png/"
    echo "  - https://cloudconvert.com/svg-to-ico"
    echo "  - https://www.icoconverter.com/"
    echo ""
    exit 1
fi

# Diretório de trabalho
ICON_DIR="build"
SVG_FILE="$ICON_DIR/icon.svg"

# Verifica se SVG existe
if [ ! -f "$SVG_FILE" ]; then
    echo "❌ Arquivo $SVG_FILE não encontrado!"
    exit 1
fi

echo "📝 Gerando ícones a partir de $SVG_FILE..."
echo ""

# Gerar PNG 512x512 para Linux
echo "🐧 Gerando ícone PNG para Linux (512x512)..."
convert -background none -resize 512x512 "$SVG_FILE" "$ICON_DIR/icon.png"

# Gerar ICO multi-resolução para Windows
echo "🪟 Gerando ícone ICO para Windows..."
convert -background none "$SVG_FILE" \
    \( -clone 0 -resize 16x16 \) \
    \( -clone 0 -resize 32x32 \) \
    \( -clone 0 -resize 48x48 \) \
    \( -clone 0 -resize 64x64 \) \
    \( -clone 0 -resize 128x128 \) \
    \( -clone 0 -resize 256x256 \) \
    -delete 0 "$ICON_DIR/icon.ico"

# Gerar ICNS para macOS (opcional)
if command -v png2icns &> /dev/null; then
    echo "🍎 Gerando ícone ICNS para macOS..."
    png2icns "$ICON_DIR/icon.icns" "$ICON_DIR/icon.png"
else
    echo "ℹ️  png2icns não encontrado, pulando ícone macOS"
fi

echo ""
echo "✅ Ícones gerados com sucesso!"
echo ""
echo "Arquivos criados:"
ls -lh $ICON_DIR/icon.* | grep -v svg
echo ""
echo "Você pode agora fazer build da aplicação:"
echo "  npm run build:win"
echo "  npm run build:linux"
