@echo off
setlocal
cd /d "%~dp0"

echo Iniciando Marketplace...
echo.

start "Marketplace - Backend" /D "%~dp0backend" cmd /k npm run start:dev
start "Marketplace - Frontend" /D "%~dp0frontend" cmd /k npm run dev

echo Backend:  http://localhost:3000
echo Frontend: http://localhost:5173
echo.
echo Se abrieron dos ventanas. Puedes cerrar esta.
endlocal
