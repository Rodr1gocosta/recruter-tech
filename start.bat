@echo off
echo 🚀 Iniciando Recruter Tech...

REM Verificar se o .env existe
if not exist .env (
    echo ⚠️  Arquivo .env nao encontrado!
    echo 📝 Copiando .env.example para .env...
    copy .env.example .env
    echo ⚠️  IMPORTANTE: Edite o arquivo .env e adicione sua chave da OpenAI!
    echo    OPENAI_API_KEY=sk-your-actual-key
    echo.
    pause
)

echo 🐳 Parando containers antigos...
docker-compose down --remove-orphans

echo 🧹 Limpando redes antigas...
docker network rm recruter-tech_recruter-network 2>nul

echo 🔨 Buildando containers...
docker-compose build

echo ▶️  Iniciando containers...
docker-compose up -d

echo.
echo ✅ Aplicacao iniciada com sucesso!
echo.
echo 📱 Frontend: http://localhost
echo 🔧 Backend:  http://localhost:3000
echo.
echo 📋 Para ver os logs:
echo    docker-compose logs -f
echo.
echo 🛑 Para parar:
echo    docker-compose down
echo.
pause
