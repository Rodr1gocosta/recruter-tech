@echo off
echo 🏗️ Build Script - Recruter Tech Desktop
echo ========================================
echo.

echo Escolha o tipo de build:
echo 1) Build para Windows
echo 2) Build para Linux
echo 3) Build para ambas plataformas
echo 4) Apenas compilar frontend e backend
echo 5) Limpar builds anteriores
echo.

set /p option="Opção [1-5]: "

if "%option%"=="1" (
    echo.
    echo 🪟 Iniciando build para Windows...
    call npm run build:win
) else if "%option%"=="2" (
    echo.
    echo 🐧 Iniciando build para Linux...
    call npm run build:linux
) else if "%option%"=="3" (
    echo.
    echo 🌍 Iniciando build multiplataforma...
    call npm run build:all
) else if "%option%"=="4" (
    echo.
    echo 📦 Compilando frontend e backend...
    call npm run build
) else if "%option%"=="5" (
    echo.
    echo 🧹 Limpando builds anteriores...
    rmdir /s /q dist-electron 2>nul
    rmdir /s /q frontend\dist 2>nul
    echo ✅ Limpeza concluída!
) else (
    echo Opção inválida!
    exit /b 1
)

echo.
echo ✅ Processo concluído!

if %option% LEQ 3 (
    echo.
    echo 📁 Arquivos gerados em: dist-electron\
    echo.
    dir dist-electron 2>nul
)

pause
