@echo off
echo 🔄 Copying DFX assets to frontend...

REM Paths
set DFX_PATH=..\hq4l\.dfx\local
set FRONTEND_PATH=.

REM Copy canister IDs
if exist "%DFX_PATH%\canister_ids.json" (
  copy "%DFX_PATH%\canister_ids.json" "%FRONTEND_PATH%\config\" >nul
  echo ✅ Copied canister_ids.json
) else (
  echo ❌ canister_ids.json not found
)

REM Copy service.did (Candid interface)
if exist "%DFX_PATH%\canisters\ic_game_backend\service.did" (
  copy "%DFX_PATH%\canisters\ic_game_backend\service.did" "%FRONTEND_PATH%\config\" >nul
  echo ✅ Copied service.did
) else (
  echo ❌ service.did not found
)

REM Copy TypeScript declarations
if exist "%DFX_PATH%\canisters\ic_game_backend\service.did.d.ts" (
  copy "%DFX_PATH%\canisters\ic_game_backend\service.did.d.ts" "%FRONTEND_PATH%\config\" >nul
  echo ✅ Copied service.did.d.ts
) else (
  echo ❌ service.did.d.ts not found
)

echo 🎯 DFX assets copied successfully!
echo 📝 Update your config if needed
pause
