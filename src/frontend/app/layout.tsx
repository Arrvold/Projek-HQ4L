// app/layout.tsx

import type { Metadata } from 'next';
import { Inter, Press_Start_2P } from 'next/font/google'; // Import font
import './globals.css';
import { Providers } from './providers'; // Import komponen Providers

// Konfigurasi font utama (untuk teks biasa)
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter', // Nama variabel CSS
  display: 'swap',
});

// Konfigurasi font sekunder (untuk judul, tombol, dll.)
const pressStart2P = Press_Start_2P({
  subsets: ['latin'],
  weight: '400', // Font ini hanya punya satu weight
  variable: '--font-press-start', // Nama variabel CSS
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'HQ4L - Quest for Life',
  description: 'Gamified learning platform to build better habits.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* Menggabungkan className dari kedua font.
        Variabel CSS akan tersedia di seluruh aplikasi.
      */}
      <body className={`${inter.variable} ${pressStart2P.variable} antialiased bg-gray-50 text-gray-800`}>
        <Providers> {/* Bungkus children dengan Providers */}
          {children}
        </Providers>
      </body>
    </html>
  );
}