#!/bin/bash

echo "========================================"
echo "Installing Frontend Dependencies"
echo "========================================"

echo ""
echo "Installing npm dependencies..."
npm install

echo ""
echo "Installing DFX dependencies..."
npm install @dfinity/agent @dfinity/auth-client @dfinity/identity @dfinity/principal

echo ""
echo "========================================"
echo "Dependencies installation completed!"
echo "========================================"
echo ""
echo "Next steps:"
echo "1. Make sure DFX is running: dfx start"
echo "2. Deploy canisters: dfx deploy"
echo "3. Start frontend: npm run dev"
echo ""
