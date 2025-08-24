#!/bin/bash

echo "🚀 Auto Setup ICP Integration for HQ4L Frontend"
echo "================================================"

# Check if dfx is installed
if ! command -v dfx &> /dev/null; then
    echo "❌ dfx is not installed. Please install DFINITY Canister SDK first."
    echo "Visit: https://internetcomputer.org/docs/current/developer-docs/setup/install/"
    exit 1
fi

echo "✅ dfx is installed"

# Navigate to backend directory
cd ../hq4l

echo "📁 Starting ICP local network..."
dfx start --clean --background

echo "⏳ Waiting for network to be ready..."
sleep 10

echo "🔧 Deploying canisters..."
dfx deploy

echo "📋 Getting canister IDs..."
CANISTER_ID=$(dfx canister id ic_game_backend)
II_ID=$(dfx canister id __Candid_UI)

echo "✅ Canister deployed successfully!"
echo "📊 Backend Canister ID: $CANISTER_ID"
echo "🆔 Internet Identity ID: $II_ID"

# Navigate back to frontend
cd ../tes

echo "🔄 Copying DFX assets to frontend..."
bash scripts/copy-dfx-assets.sh

echo ""
echo "🎯 Setup completed!"
echo "📝 Canister ID: $CANISTER_ID"
echo "🆔 Internet Identity ID: $II_ID"
echo ""
echo "🚀 Starting frontend..."
npm run dev
