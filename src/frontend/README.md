# HQ4L Frontend - Internet Identity & Backend Integration

## Overview

Frontend aplikasi Habits Quest 4 Life (HQ4L) yang terintegrasi sepenuhnya dengan Internet Identity (II) dan backend canister. Aplikasi ini menggunakan sistem autentikasi yang aman dan terdesentralisasi tanpa penggunaan localStorage.

## 🚀 Fitur Utama

### Authentication & Security

- **Internet Identity Integration**: Autentikasi pengguna menggunakan Internet Identity
- **Secure Session Management**: Manajemen sesi yang aman tanpa localStorage
- **Protected Routes**: Halaman yang dilindungi dengan autentikasi
- **Principal-based Security**: Keamanan berbasis principal dari Internet Computer

### Backend Integration

- **Real-time Data**: Semua data diambil langsung dari backend canister
- **Actor Pattern**: Menggunakan DFX Actor untuk komunikasi backend
- **Error Handling**: Penanganan error yang komprehensif
- **State Synchronization**: Sinkronisasi state antara frontend dan backend

### User Experience

- **Responsive Design**: UI yang responsif untuk berbagai ukuran layar
- **Loading States**: Indikator loading yang informatif
- **Error Feedback**: Pesan error yang jelas dan membantu
- **Success Notifications**: Notifikasi sukses untuk user feedback

## 🏗️ Struktur Aplikasi

```
src/Frontend/
├── app/                    # Next.js App Router
│   ├── dashboard/         # Dashboard utama (protected)
│   ├── inventory/         # Halaman inventory (protected)
│   ├── shop/             # Halaman shop (protected)
│   ├── leaderboard/      # Halaman leaderboard (protected)
│   └── page.tsx          # Halaman utama
├── components/            # Komponen React
│   ├── Header.tsx        # Header dengan auth
│   ├── Hero.tsx          # Hero section
│   ├── DashboardHeader.tsx # Header dashboard
│   ├── QuestList.tsx     # Daftar quest
│   ├── CharacterInfo.tsx # Info karakter
│   └── ...               # Komponen lainnya
├── lib/                   # Utilities dan konfigurasi
│   ├── AuthContext.tsx   # Context autentikasi
│   └── config.ts         # Konfigurasi aplikasi
└── types/                 # TypeScript type definitions
```

## 🛠️ Teknologi yang Digunakan

- **Frontend Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Internet Identity (DFX)
- **Backend Communication**: DFX Actor
- **State Management**: React Context + Hooks
- **Build Tool**: Next.js built-in bundler

## 📋 Prerequisites

Sebelum menjalankan aplikasi, pastikan:

1. **Node.js** (versi 18 atau lebih baru)
2. **npm** atau **yarn**
3. **DFX** (Internet Computer SDK)
4. **Internet Identity** canister yang sudah di-deploy

## 🚀 Quick Start

### 1. Install Dependencies

**Windows:**

```bash
scripts/setup-dependencies.bat
```

**Linux/Mac:**

```bash
chmod +x scripts/setup-dependencies.sh
./scripts/setup-dependencies.sh
```

**Manual:**

```bash
npm install
npm install @dfinity/agent @dfinity/auth-client @dfinity/identity @dfinity/principal
```

### 2. Start DFX Local Network

```bash
dfx start --background
```

### 3. Deploy Canisters

```bash
dfx deploy
```

### 4. Start Frontend

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000`

## ⚙️ Konfigurasi

### Environment Variables

File `lib/config.ts` berisi semua konfigurasi yang diperlukan:

```typescript
export const FRONTEND_CANISTER_ID = "your-frontend-canister-id";
export const BACKEND_CANISTER_ID = "your-backend-canister-id";
export const II_CANISTER_ID = "your-ii-canister-id";
export const IS_LOCAL = true; // Set to false for production
```

### Canister IDs

Setelah deploy, update canister IDs di `lib/config.ts`:

```bash
dfx canister id frontend
dfx canister id backend
dfx canister id internet_identity
```

## 🔐 Authentication Flow

### 1. Login Process

```
User clicks "Start" → II Authentication → Backend Profile Check → Dashboard/Registration
```

### 2. Registration Process

```
New User → Username Input → Role Selection → Backend Registration → Dashboard
```

### 3. Session Management

```
II Session Check → Actor Creation → Profile Fetch → State Update
```

## 📱 Halaman yang Tersedia

### Public Pages

- **Home** (`/`): Landing page dengan hero section
- **Login**: Autentikasi menggunakan Internet Identity

### Protected Pages

- **Dashboard** (`/dashboard`): Halaman utama setelah login
- **Inventory** (`/inventory`): Manajemen inventory dan skin
- **Shop** (`/shop`): Pembelian item dan skin
- **Leaderboard** (`/leaderboard`): Peringkat pengguna berdasarkan role

## 🎮 Fitur Game

### Quest System

- Accept quests
- Complete quests
- Quest progress tracking
- Reward system

### Character Management

- Role selection (Codes, Sports, Arts, Traveler, Literature)
- Experience and leveling
- Skin customization
- Inventory management

### Economy System

- Coin currency
- Stamina system
- Shop purchases
- Item ownership

## 🔧 Development

### Project Structure

```
src/Frontend/
├── app/           # Next.js App Router pages
├── components/    # Reusable React components
├── lib/          # Utilities, contexts, configs
├── types/        # TypeScript type definitions
├── public/       # Static assets
└── scripts/      # Setup and utility scripts
```

### Adding New Features

#### 1. New Backend Call

```typescript
const handleNewFeature = async () => {
  if (!actor) return;

  try {
    const result = await actor.newFunction(data);
    if (result.ok) {
      await refetchProfile();
    }
  } catch (error) {
    console.error("Operation failed:", error);
  }
};
```

#### 2. New Protected Route

```typescript
// app/new-feature/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../lib/AuthContext";

export default function NewFeature() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/");
    }
  }, [isLoading, isAuthenticated, router]);

  // Component content
}
```

### Code Style

- **TypeScript**: Gunakan type definitions yang jelas
- **Error Handling**: Implement proper error handling untuk semua async operations
- **Loading States**: Selalu tampilkan loading state untuk operasi async
- **User Feedback**: Berikan feedback yang jelas untuk semua user actions

## 🧪 Testing

### Manual Testing

1. **Authentication Flow**: Test login/logout dengan II
2. **Protected Routes**: Pastikan halaman protected tidak bisa diakses tanpa auth
3. **Backend Integration**: Test semua fitur yang menggunakan backend
4. **Error Scenarios**: Test berbagai skenario error

### Automated Testing

```bash
# Run linting
npm run lint

# Type checking
npx tsc --noEmit

# Build check
npm run build
```

## 🚀 Deployment

### Production Build

```bash
npm run build
npm run start
```

### Environment Configuration

1. Set `IS_LOCAL = false` di `lib/config.ts`
2. Update canister IDs untuk production
3. Deploy canisters ke mainnet:
   ```bash
   dfx deploy --network ic
   ```

### Production Considerations

- **Security**: Pastikan semua security headers aktif
- **Performance**: Optimize bundle size dan loading
- **Monitoring**: Implement error tracking dan analytics
- **Backup**: Backup canister data secara regular

## 🐛 Troubleshooting

### Common Issues

#### 1. Authentication Failures

- Check II canister ID di config
- Verify network configuration
- Check browser console untuk errors

#### 2. Backend Connection Issues

- Verify backend canister ID
- Check DFX network status
- Validate actor creation

#### 3. Build Errors

- Check TypeScript compilation
- Verify all dependencies installed
- Check Next.js configuration

### Debug Tools

- **Browser DevTools**: Console, Network, Application tabs
- **DFX Logs**: `dfx logs` untuk canister logs
- **Canister Status**: `dfx canister status` untuk health check

## 📚 Documentation

- **Integration Guide**: [README_INTEGRATION.md](./README_INTEGRATION.md)
- **API Reference**: Backend canister interface
- **Component Library**: Komponen React yang tersedia
- **Configuration**: Environment dan canister setup

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Implement changes
4. Add tests jika diperlukan
5. Submit pull request

## 📄 License

Project ini menggunakan license yang sama dengan repository utama.

## 🆘 Support

Untuk bantuan teknis:

1. Check documentation
2. Review troubleshooting guide
3. Check GitHub issues
4. Contact development team

---

**Note**: Dokumentasi ini akan diperbarui sesuai dengan perkembangan fitur dan perubahan sistem.
