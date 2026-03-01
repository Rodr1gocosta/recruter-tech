#!/bin/bash

echo "🔍 Verificando Status do Recruter Tech"
echo "======================================"
echo ""

# Verificar se containers estão rodando
echo "📦 Status dos Containers:"
docker-compose ps
echo ""

# Verificar saúde do backend
echo "🔧 Testando Backend (http://localhost:3000/health):"
if command -v curl &> /dev/null; then
    curl -s http://localhost:3000/health 2>/dev/null || echo "❌ Backend não está respondendo"
else
    wget -q -O - http://localhost:3000/health 2>/dev/null || echo "❌ Backend não está respondendo"
fi
echo ""
echo ""

# Verificar frontend
echo "📱 Testando Frontend (http://localhost):"
if command -v curl &> /dev/null; then
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost 2>/dev/null)
else
    STATUS=$(wget --spider -S http://localhost 2>&1 | grep "HTTP/" | awk '{print $2}' | tail -1)
fi

if [ "$STATUS" = "200" ]; then
    echo "✅ Frontend está respondendo (HTTP $STATUS)"
else
    echo "❌ Frontend não está respondendo (HTTP $STATUS)"
fi
echo ""

# Últimas linhas de log
echo "📋 Últimas linhas de log:"
echo ""
echo "--- Backend ---"
docker-compose logs backend --tail=5 2>/dev/null | grep -v "^Attaching"
echo ""
echo "--- Frontend ---"
docker-compose logs frontend --tail=5 2>/dev/null | grep -v "^Attaching"
echo ""

echo "======================================"
echo "✅ Verificação concluída!"
echo ""
echo "🌐 URLs:"
echo "   Frontend: http://localhost"
echo "   Backend:  http://localhost:3000"
echo "   Health:   http://localhost:3000/health"
echo ""
echo "📋 Comandos úteis:"
echo "   Ver logs: docker-compose logs -f"
echo "   Parar:    docker-compose down"
echo "   Restart:  docker-compose restart"
