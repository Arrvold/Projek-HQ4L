#!/bin/bash

echo "🔄 Copying DFX assets to frontend..."

# Paths
DFX_PATH="../hq4l/.dfx/local"
FRONTEND_PATH="."

# Copy canister IDs
if [ -f "$DFX_PATH/canister_ids.json" ]; then
  cp "$DFX_PATH/canister_ids.json" "$FRONTEND_PATH/config/"
  echo "✅ Copied canister_ids.json"
else
  echo "❌ canister_ids.json not found"
fi

# Copy service.did (Candid interface)
if [ -f "$DFX_PATH/canisters/ic_game_backend/service.did" ]; then
  cp "$DFX_PATH/canisters/ic_game_backend/service.did" "$FRONTEND_PATH/config/"
  echo "✅ Copied service.did"
else
  echo "❌ service.did not found"
fi

# Copy TypeScript declarations
if [ -f "$DFX_PATH/canisters/ic_game_backend/service.did.d.ts" ]; then
  cp "$DFX_PATH/canisters/ic_game_backend/service.did.d.ts" "$FRONTEND_PATH/config/"
  echo "✅ Copied service.did.d.ts"
else
  echo "❌ service.did.d.ts not found"
fi

echo "🎯 DFX assets copied successfully!"
echo "📝 Update your config if needed"
