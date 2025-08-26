# Frontend Integration with Internet Identity & Backend Canister

## Overview

Frontend aplikasi HQ4L telah diintegrasikan sepenuhnya dengan Internet Identity (II) dan backend canister, menghapus semua penggunaan localStorage dan menggantinya dengan sistem autentikasi yang aman dan terdesentralisasi.

## Fitur Integrasi

### 1. Internet Identity Authentication

- **Login**: Menggunakan Internet Identity untuk autentikasi pengguna
- **Logout**: Logout yang aman dengan pembersihan state
- **Session Management**: Manajemen sesi otomatis dengan II
- **Identity Persistence**: Identitas pengguna tersimpan dengan aman di II

### 2. Backend Canister Integration

- **Actor Pattern**: Menggunakan DFX Actor untuk komunikasi dengan backend
- **Real-time Data**: Semua data diambil langsung dari backend canister
- **Error Handling**: Penanganan error yang komprehensif dari backend
- **State Synchronization**: Sinkronisasi state antara frontend dan backend

### 3. Halaman yang Terintegrasi

#### Dashboard (`/dashboard`)

- Menampilkan profil pengguna dari backend
- Quest list real-time
- Info karakter dengan data dari backend
- Protected route dengan autentikasi

#### Inventory (`/inventory`)

- Data inventory dari backend canister
- Skin management dengan backend
- Character display dengan skin aktif
- Real-time coin dan stamina

#### Shop (`/shop`)

- Item shop dari backend
- Purchase system terintegrasi
- Inventory sync otomatis
- Balance checking real-time

#### Leaderboard (`/leaderboard`)

- Data leaderboard dari backend
- Role-based filtering
- User ranking real-time
- Current user position

### 4. Komponen yang Diperbarui

#### AuthContext (`lib/AuthContext.tsx`)

- Internet Identity integration
- Backend actor management
- User profile management
- Session persistence

#### Header Component

- Login/logout functionality
- User registration flow
- Role selection integration
- Backend communication

#### Hero Component

- Authentication-aware UI
- No localStorage usage
- Integrated with auth system

## Struktur Data

### User Profile

```typescript
interface UserProfile {
  user: {
    id: number;
    username: string;
    coin: number;
    stamina: number;
    skins: InventoryItem[];
    quests: Quest[];
  };
  roles: CurrentRole[];
  active_inventory: ActiveInventory | null;
}
```

### Authentication State

```typescript
interface AuthContextType {
  actor: any | null;
  isAuthenticated: boolean;
  login: () => Promise<{ profile: any | null }>;
  logout: () => Promise<void>;
  identity: Identity | null;
  userProfile: any | null;
  isLoading: boolean;
  refetchProfile: () => Promise<void>;
}
```

## Konfigurasi

### Environment Variables

```typescript
// config.ts
export const FRONTEND_CANISTER_ID = "u6s2n-gx777-77774-qaaba-cai";
export const BACKEND_CANISTER_ID = "uxrrr-q7777-77774-qaaaq-cai";
export const II_CANISTER_ID = "uzt4z-lp777-77774-qaabq-cai";
export const II_URL = `http://${II_CANISTER_ID}.localhost:4943`;
export const IS_LOCAL = true;
```

### Internet Identity Setup

- Canister ID dikonfigurasi untuk development dan production
- URL otomatis disesuaikan dengan environment
- Root key fetching untuk local development

## Alur Autentikasi

### 1. Login Flow

```
User clicks "Start" → II Authentication → Backend Profile Check → Dashboard/Registration
```

### 2. Registration Flow

```
New User → Username Input → Role Selection → Backend Registration → Dashboard
```

### 3. Session Management

```
II Session Check → Actor Creation → Profile Fetch → State Update
```

## Error Handling

### Backend Errors

- Username taken
- Insufficient balance
- Role selection errors
- Quest management errors

### Network Errors

- Connection failures
- Timeout handling
- Retry mechanisms

### User Feedback

- Loading states
- Error messages
- Success notifications

## Security Features

### 1. No Local Storage

- Semua data sensitif disimpan di backend
- Session management melalui II
- No client-side data persistence

### 2. Identity Verification

- Principal-based authentication
- Backend validation
- Secure actor communication

### 3. Protected Routes

- Authentication guards
- Route protection
- Automatic redirects

## Performance Optimizations

### 1. Lazy Loading

- Component-based code splitting
- Dynamic imports
- Route-based loading

### 2. State Management

- Efficient re-renders
- Optimistic updates
- Background sync

### 3. Caching Strategy

- Backend data caching
- Minimal re-fetching
- Smart state updates

## Development Guidelines

### 1. Adding New Backend Calls

```typescript
// Example: Adding new quest functionality
const handleNewQuest = async () => {
  if (!actor) return;

  try {
    const result = await actor.createQuest(questData);
    if (result.ok) {
      await refetchProfile();
    }
  } catch (error) {
    console.error("Quest creation failed:", error);
  }
};
```

### 2. Error Handling Pattern

```typescript
try {
  const result = await actor.someFunction();
  if (result.ok) {
    // Handle success
  } else {
    // Handle backend error
    const errKey = Object.keys(result.err)[0];
    setError(`Operation failed: ${errKey}`);
  }
} catch (error) {
  // Handle network/connection error
  setError("Connection failed. Please try again.");
}
```

### 3. Loading States

```typescript
const [isLoading, setIsLoading] = useState(false);

const handleOperation = async () => {
  setIsLoading(true);
  try {
    // Operation logic
  } finally {
    setIsLoading(false);
  }
};
```

## Testing

### 1. Authentication Testing

- II login/logout flows
- Session persistence
- Protected route access

### 2. Backend Integration Testing

- API calls
- Data synchronization
- Error scenarios

### 3. UI State Testing

- Loading states
- Error displays
- Success feedback

## Deployment

### 1. Production Build

```bash
npm run build
npm run start
```

### 2. Environment Configuration

- Update canister IDs for production
- Set IS_LOCAL to false
- Configure II production URL

### 3. Canister Deployment

```bash
dfx deploy --network ic
```

## Troubleshooting

### Common Issues

#### 1. Authentication Failures

- Check II canister ID
- Verify network configuration
- Check browser console for errors

#### 2. Backend Connection Issues

- Verify backend canister ID
- Check network connectivity
- Validate actor creation

#### 3. Data Sync Problems

- Check authentication state
- Verify user profile loading
- Review error handling

### Debug Tools

- Browser developer tools
- DFX logs
- Canister status checks

## Future Enhancements

### 1. Advanced Features

- Real-time notifications
- Offline support
- Advanced caching

### 2. Performance Improvements

- Virtual scrolling
- Image optimization
- Bundle optimization

### 3. User Experience

- Progressive web app
- Mobile optimization
- Accessibility improvements

## Support

Untuk bantuan teknis atau pertanyaan tentang integrasi:

1. Periksa console browser untuk error messages
2. Verifikasi konfigurasi canister
3. Periksa network connectivity
4. Review backend logs

---

**Note**: Dokumentasi ini akan diperbarui sesuai dengan perkembangan fitur dan perubahan sistem.
