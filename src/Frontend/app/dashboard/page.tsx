// app/dashboard/page.tsx

"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/AuthContext'; // Sesuaikan path jika perlu

// Impor komponen-komponen anak Anda
import DashboardHeader from '../../components/DashboardHeader';
import QuestList from '../../components/QuestList';
import CharacterInfo from '../../components/CharacterInfo';

export default function Dashboard() {
  const router = useRouter();
  const { userProfile, isAuthenticated, isLoading } = useAuth();

  // Efek untuk melindungi halaman (protected route)
  useEffect(() => {
    // Jika proses loading selesai dan ternyata pengguna tidak login,
    // kembalikan mereka ke halaman utama.
    if (!isLoading && !isAuthenticated) {
      router.replace('/');
    }
  }, [isLoading, isAuthenticated, router]);

  // Tampilan saat data sedang dimuat
  if (isLoading || !userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-semibold">Loading your adventure...</div>
        {/* Anda bisa menggantinya dengan komponen skeleton yang lebih bagus */}
      </div>
    );
  }

  // Jika data sudah ada, tampilkan dashboard utama
  const activeRole = userProfile.roles.find((r: any) => r.is_active);

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader 
        username={userProfile.user.username}
        stamina={Number(userProfile.user.stamina)}
        coins={Number(userProfile.user.coin)}
      />
      
      <main className="px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Kolom Kiri: Daftar Quest */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <QuestList 
              userRole={activeRole ? activeRole.role_name : ""} 
              quests={userProfile.user.quests}
            />
          </div>
          
          {/* Kolom Kanan: Info Karakter & Lainnya */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <CharacterInfo 
              roles={userProfile.roles}
              activeInventory={userProfile.active_inventory}
            />
          </div>
        </div>
      </main>
    </div>
  );
}