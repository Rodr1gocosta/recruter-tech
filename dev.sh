#!/bin/bash

echo "🚀 Modo Desenvolvimento - Recruter Tech"
echo ""
echo "Este script permite desenvolvimento local sem Docker"
echo "Útil para iterações rápidas no código"
echo ""

# Verificar se está na raiz do projeto
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Execute este script da raiz do projeto"
    exit 1
fi

# Menu de opções
echo "Escolha uma opção:"
echo "1) Iniciar Backend (porta 3000)"
echo "2) Iniciar Frontend (porta 5173)"
echo "3) Iniciar AMBOS"
echo "4) Voltar para Docker"
read -p "Opção: " option

case $option in
    1)
        echo "📦 Instalando dependências do backend..."
        cd backend
        npm install
        echo "🚀 Iniciando backend em modo dev..."
        npm run dev
        ;;
    2)
        echo "📦 Instalando dependências do frontend..."
        cd frontend
        npm install
        echo "🚀 Iniciando frontend em modo dev..."
        echo "⚠️  Certifique-se que o backend está rodando (Docker ou local)"
        npm run dev
        ;;
    3)
        echo "📦 Instalando dependências..."
        cd backend && npm install && cd ..
        cd frontend && npm install && cd ..
        
        echo "🚀 Iniciando backend e frontend..."
        echo "⚠️  Pressione Ctrl+C para parar ambos"
        
        # Iniciar backend em background
        cd backend
        npm run dev &
        BACKEND_PID=$!
        cd ..
        
        # Aguardar backend iniciar
        sleep 3
        
        # Iniciar frontend
        cd frontend
        npm run dev &
        FRONTEND_PID=$!
        cd ..
        
        echo ""
        echo "✅ Rodando:"
        echo "   Backend: http://localhost:3000 (PID: $BACKEND_PID)"
        echo "   Frontend: http://localhost:5173 (PID: $FRONTEND_PID)"
        echo ""
        
        # Aguardar Ctrl+C
        trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
        wait
        ;;
    4)
        echo "🐳 Parando modo dev e iniciando Docker..."
        ./start.sh
        ;;
    *)
        echo "❌ Opção inválida"
        exit 1
        ;;
esac
