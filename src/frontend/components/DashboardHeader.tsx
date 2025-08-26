'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/AuthContext'; // Sesuaikan path jika perlu

// Interface untuk mendefinisikan props yang diterima komponen
interface DashboardHeaderProps {
  username: string;
  stamina: number;
  coins: number;
}

export default function DashboardHeader({ username, stamina, coins }: DashboardHeaderProps) {
  const router = useRouter();
  const { logout } = useAuth(); // Mengambil fungsi logout dari context

  // State dan Ref untuk mengelola visibilitas menu dropdown
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Hook untuk menutup menu saat pengguna mengklik di luar area menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Membersihkan event listener saat komponen dibongkar atau menu ditutup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Fungsi logout yang memanggil fungsi dari context
  const handleLogout = async () => {
    setIsMenuOpen(false); // Tutup menu terlebih dahulu
    await logout();
    router.push('/'); // Arahkan ke halaman utama setelah logout
  };

  // Kumpulan fungsi untuk navigasi yang menggunakan Next.js Router
  const handleNavigation = (path: string) => {
    setIsMenuOpen(false);
    router.push(path);
  };

  return (
    <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Nama Pengguna - Pojok Kiri */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900 font-minecraft">
              {username}
            </h1>
          </div>
          
          {/* Stamina, Coins, dan Menu - Sebelah Kanan */}
          <div className="flex items-center space-x-6" ref={menuRef}>
            {/* Stamina */}
            <div className="flex items-center space-x-2">
              <img 
                src="/assets/Stammina.png" 
                alt="Stamina" 
                className="w-6 h-6"
              />
              <span className="text-gray-900 font-minecraft font-medium">
                {stamina}/30
              </span>
            </div>
            
            {/* Coins */}
            <div className="flex items-center space-x-2">
              <img 
                src="/assets/koin.png" 
                alt="Coins" 
                className="w-6 h-6"
              />
              <span className="text-gray-900 font-minecraft font-medium">
                {coins}
              </span>
            </div>
            
            {/* Tombol Menu */}
            <div className="relative">
              <button 
                onClick={() => setIsMenuOpen((prev) => !prev)}
                className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-4 py-2 rounded-lg transition-colors font-minecraft"
                aria-haspopup="true"
                aria-expanded={isMenuOpen}
              >
                Menu
              </button>

              {/* Konten Dropdown Menu */}
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 p-4">
                  <div className="grid grid-cols-3 gap-4">
                    {/* Tombol Shop */}
                    <button onClick={() => handleNavigation('/shop')} className="flex flex-col items-center justify-center gap-2 hover:bg-gray-50 rounded-xl p-3 transition font-minecraft">
                      <img src="/assets/menu_shop.png" alt="Shop" className="w-8 h-8" />
                      <span className="text-xs text-gray-800">Shop</span>
                    </button>
                    {/* Tombol Inventory */}
                    <button onClick={() => handleNavigation('/inventory')} className="flex flex-col items-center justify-center gap-2 hover:bg-gray-50 rounded-xl p-3 transition font-minecraft">
                      <img src="/assets/menu_inventory.png" alt="Inventory" className="w-8 h-8" />
                      <span className="text-xs text-gray-800">Inventory</span>
                    </button>
                    {/* Tombol Leaderboard */}
                    <button onClick={() => handleNavigation('/leaderboard')} className="flex flex-col items-center justify-center gap-2 hover:bg-gray-50 rounded-xl p-3 transition font-minecraft">
                      <img src="/assets/menu_leaderboard.png" alt="Leaderboard" className="w-8 h-8" />
                      <span className="text-xs text-gray-800">Leaderboard</span>
                    </button>
                    {/* Tombol Gacha (Contoh) */}
                    <button onClick={() => handleNavigation('/gacha')} className="flex flex-col items-center justify-center gap-2 hover:bg-gray-50 rounded-xl p-3 transition font-minecraft">
                      <img src="/assets/gacha_woilah.png" alt="Gacha" className="w-8 h-8" />
                      <span className="text-xs text-gray-800">Gacha</span>
                    </button>
                    {/* Tombol Setting (Contoh) */}
                    <button onClick={() => handleNavigation('/settings')} className="flex flex-col items-center justify-center gap-2 hover:bg-gray-50 rounded-xl p-3 transition font-minecraft">
                      <img src="/assets/menu_setting.png" alt="Setting" className="w-8 h-8" />
                      <span className="text-xs text-gray-800">Setting</span>
                    </button>
                    {/* Tombol Logout */}
                    <button onClick={handleLogout} className="flex flex-col items-center justify-center gap-2 hover:bg-red-50 rounded-xl p-3 transition font-minecraft text-red-600">
                      <img src="/assets/menu_logout.png" alt="Logout" className="w-8 h-8" />
                      <span className="text-xs">Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}