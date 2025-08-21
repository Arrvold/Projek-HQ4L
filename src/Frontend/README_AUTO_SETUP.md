# 🚀 Auto-Setup ICP Integration

## Overview
Frontend ini sekarang dapat **otomatis mengambil ABI dan canister ID** dari `.dfx/local` tanpa perlu manual update konfigurasi!

## ✨ Fitur Baru

### 🔄 **Auto-Sync dari .dfx/local**
- **Canister ID** - Otomatis diambil dari `canister_ids.json`
- **ABI Interface** - Otomatis diambil dari `service.did`
- **TypeScript Types** - Otomatis di-generate dari Candid interface
- **Network Detection** - Otomatis detect local vs IC mainnet

### 🎯 **One-Command Setup**
```bash
# Linux/Mac
npm run setup:auto

# Windows
npm run setup:auto:win
```

## 🛠️ Cara Kerja

### 1. **Auto-Setup Script**
Script akan:
1. ✅ Start ICP local network
2. ✅ Deploy canisters
3. ✅ Copy assets ke frontend
4. ✅ Start development server

### 2. **Dynamic Configuration**
- **Canister ID** diambil dari `.dfx/local/canister_ids.json`
- **Network config** auto-detect dari environment
- **Fallback values** jika file tidak tersedia

### 3. **Asset Copying**
Script otomatis copy:
- `canister_ids.json` → `config/`
- `service.did` → `config/`
- `service.did.d.ts` → `config/`

## 📁 Struktur File Baru

```
tes/
├── config/
│   ├── dfx-config.ts          # Dynamic config loader
│   ├── canister_ids.json      # Auto-copied from .dfx/local
│   ├── service.did            # Auto-copied from .dfx/local
│   └── service.did.d.ts       # Auto-copied from .dfx/local
├── utils/
│   └── candid-to-types.ts     # Candid → TypeScript converter
├── lib/
│   └── icService.ts           # Service dengan dynamic config
└── scripts/
    ├── setup-auto.sh          # Auto-setup script
    ├── setup-auto.bat         # Windows auto-setup
    ├── copy-dfx-assets.sh     # Asset copy script
    └── copy-dfx-assets.bat    # Windows asset copy
```

## 🚀 Quick Start

### **Option 1: Full Auto-Setup**
```bash
# Linux/Mac
npm run setup:auto

# Windows
npm run setup:auto:win
```

### **Option 2: Manual Copy Assets**
```bash
# Linux/Mac
npm run copy:dfx

# Windows
npm run copy:dfx:win
```

### **Option 3: Manual Setup**
1. Deploy backend: `cd ../hq4l && dfx deploy`
2. Copy assets: `npm run copy:dfx`
3. Start frontend: `npm run dev`

## 🔧 Konfigurasi

### **Auto-Detection**
```typescript
// Otomatis detect network dan canister ID
const config = getCurrentNetworkConfig();
// Returns: { host, canisterId, identityProvider }
```

### **Manual Override**
```typescript
// Jika perlu override
const config = getNetworkConfig('local'); // atau 'ic'
```

### **Environment Variables**
```bash
# Optional: Force network
NEXT_PUBLIC_DFX_NETWORK=local  # atau 'ic'
```

## 📊 Monitoring

### **Status Indicator**
- 🟢 **Connected** - Berhasil connect ke canister
- 🔴 **Disconnected** - Gagal connect
- 📍 **Network** - Local vs IC mainnet
- 🆔 **Canister ID** - Current canister ID

### **Debug Info**
```bash
# Check canister status
dfx canister status ic_game_backend

# Check canister ID
dfx canister id ic_game_backend

# Check network
dfx ping
```

## 🔄 Update Process

### **Development Mode**
1. Update backend code
2. Run `dfx deploy` (atau gunakan `npm run setup:auto`)
3. Assets otomatis ter-copy
4. Frontend auto-reload dengan config baru

### **Production Mode**
1. Deploy ke IC mainnet: `dfx deploy --network ic`
2. Update environment: `NEXT_PUBLIC_DFX_NETWORK=ic`
3. Build dan deploy frontend

## 🚨 Troubleshooting

### **Common Issues**

1. **Assets tidak ter-copy**
   ```bash
   # Manual copy
   npm run copy:dfx
   ```

2. **Canister ID tidak ditemukan**
   ```bash
   # Check backend
   cd ../hq4l
   dfx canister id ic_game_backend
   ```

3. **Network tidak running**
   ```bash
   # Start network
   cd ../hq4l
   dfx start --clean
   ```

### **Debug Commands**
```bash
# Check file existence
ls -la config/

# Check canister IDs
cat config/canister_ids.json

# Check service interface
cat config/service.did
```

## 🎯 Keuntungan

- ✅ **Zero Configuration** - Tidak perlu manual update
- ✅ **Auto-Sync** - Selalu up-to-date dengan backend
- ✅ **Development Friendly** - Auto-reload saat ada perubahan
- ✅ **Production Ready** - Support IC mainnet
- ✅ **Cross-Platform** - Windows, Linux, Mac support

## 🔮 Future Enhancements

- **Hot Reload** - Auto-reload saat backend berubah
- **Type Generation** - Real-time TypeScript type generation
- **Network Switching** - UI untuk switch network
- **Canister Management** - Multiple canister support

## 📚 References

- [DFINITY Documentation](https://internetcomputer.org/docs)
- [Candid Language](https://internetcomputer.org/docs/current/developer-docs/build/candid/candid-intro)
- [dfx Commands](https://internetcomputer.org/docs/current/references/cli-reference/dfx-parent)
