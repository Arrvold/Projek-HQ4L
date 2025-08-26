// app/providers.tsx

"use client";

import { AuthProvider } from '../lib/AuthContext'; // Sesuaikan path jika perlu
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}