#!/bin/bash

echo "🚀 Iniciando Recruter Tech Desktop..."
echo ""

# Verifica se node_modules existe
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install
fi

# Verifica se as dependências do frontend existem
if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Instalando dependências do frontend..."
    cd frontend && npm install && cd ..
fi

# Verifica se as dependências do backend existem
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Instalando dependências do backend..."
    cd backend && npm install && cd ..
fi

echo ""
echo "✅ Iniciando aplicação desktop..."
npm run dev
