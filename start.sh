#!/bin/bash

echo "🚀 Iniciando Recruter Tech..."

# Verificar se o .env existe
if [ ! -f .env ]; then
    echo "⚠️  Arquivo .env não encontrado!"
    echo "📝 Copiando .env.example para .env..."
    cp .env.example .env
    echo "⚠️  IMPORTANTE: Edite o arquivo .env e adicione sua chave da OpenAI!"
    echo "   OPENAI_API_KEY=sk-your-actual-key"
    echo ""
    read -p "Pressione ENTER depois de configurar o .env..."
fi

# Verificar se Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker não está rodando. Por favor, inicie o Docker."
    exit 1
fi

echo "🐳 Parando containers antigos..."
docker-compose down --remove-orphans

echo "🧹 Limpando redes antigas..."
docker network rm recruter-tech_recruter-network 2>/dev/null || true

echo "🔨 Buildando containers..."
docker-compose build

echo "▶️  Iniciando containers..."
docker-compose up -d

echo ""
echo "✅ Aplicação iniciada com sucesso!"
echo ""
echo "📱 Frontend: http://localhost"
echo "🔧 Backend:  http://localhost:3000"
echo ""
echo "📋 Para ver os logs:"
echo "   docker-compose logs -f"
echo ""
echo "🛑 Para parar:"
echo "   docker-compose down"
echo ""
