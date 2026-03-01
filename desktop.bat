@echo off
echo 🚀 Iniciando Recruter Tech Desktop...
echo.

REM Verifica se node_modules existe
if not exist "node_modules\" (
    echo 📦 Instalando dependências...
    call npm install
)

REM Verifica se as dependências do frontend existem
if not exist "frontend\node_modules\" (
    echo 📦 Instalando dependências do frontend...
    cd frontend
    call npm install
    cd ..
)

REM Verifica se as dependências do backend existem
if not exist "backend\node_modules\" (
    echo 📦 Instalando dependências do backend...
    cd backend
    call npm install
    cd ..
)

echo.
echo ✅ Iniciando aplicação desktop...
npm run dev
