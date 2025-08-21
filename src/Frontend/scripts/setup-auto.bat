@echo off
echo 🚀 Auto Setup ICP Integration for HQ4L Frontend
echo ================================================

REM Check if dfx is installed
dfx --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ dfx is not installed. Please install DFINITY Canister SDK first.
    echo Visit: https://internetcomputer.org/docs/current/developer-docs/setup/install/
    pause
    exit /b 1
)

echo ✅ dfx is installed

REM Navigate to backend directory
cd ..\hq4l

echo 📁 Starting ICP local network...
start /B dfx start --clean

echo ⏳ Waiting for network to be ready...
timeout /t 10 /nobreak >nul

echo 🔧 Deploying canisters...
dfx deploy

echo 📋 Getting canister IDs...
for /f "tokens=*" %%i in ('dfx canister id ic_game_backend') do set CANISTER_ID=%%i
for /f "tokens=*" %%i in ('dfx canister id __Candid_UI') do set II_ID=%%i

echo ✅ Canister deployed successfully!
echo 📊 Backend Canister ID: %CANISTER_ID%
echo 🆔 Internet Identity ID: %II_ID%

REM Navigate back to frontend
cd ..\tes

echo 🔄 Copying DFX assets to frontend...
scripts\copy-dfx-assets.bat

echo.
echo 🎯 Setup completed!
echo 📝 Canister ID: %CANISTER_ID%
echo 🆔 Internet Identity ID: %II_ID%
echo.
echo 🚀 Starting frontend...
npm run dev
