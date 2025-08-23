// components/Header.tsx

"use client";

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/AuthContext'; // Sesuaikan path jika perlu

export default function Header() {
  const router = useRouter();
  // Mengambil semua state dan fungsi yang dibutuhkan dari AuthContext
  const { login, logout, actor, isAuthenticated, userProfile, isLoading, refetchProfile } = useAuth();

  // State lokal hanya untuk mengelola modal registrasi
  const [showModal, setShowModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [username, setUsername] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Fungsi untuk menangani klik tombol login/start
  const handleLogin = async () => {
    try {
      // Memulai proses login yang dikelola oleh AuthContext
      const loginResult = await login();

      // AuthContext akan secara otomatis mengecek profil setelah login.
      // Kita cek hasilnya di sini. Jika userProfile null, berarti pengguna baru.
      if (!loginResult.profile) {
        setShowModal(true);
        setCurrentStep(1);
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      console.error('Login failed:', err);
      alert('Gagal melakukan login. Silakan coba lagi.');
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/'); // Arahkan ke halaman utama setelah logout
  };
  
  // --- Fungsi-fungsi untuk Modal Registrasi ---

  const closeModal = () => {
    setShowModal(false);
    setError('');
    setIsSubmitting(false);
  };

  const handleUsernameSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !actor) return;
    
    setIsSubmitting(true);
    setError('');
    try {
      const result = await actor.registerUser(username);
      if (result.ok) {
        setCurrentStep(2); // Lanjut ke langkah pilih role
      } else {
        // Menangani error spesifik dari backend, misal: UsernameTaken
        const errKey = Object.keys(result.err)[0];
        setError(`Gagal mendaftar: ${errKey}. Silakan coba username lain.`);
      }
    } catch (err) {
      console.error('Register user failed:', err);
      setError('Terjadi kesalahan saat mendaftar. Coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmRole = async () => {
    if (!selectedRole || !actor) return;
    
    setIsSubmitting(true);
    setError('');
    try {
      const roleMap: any = {
        codes: { Codes: null }, sports: { Sports: null }, arts: { Arts: null },
        traveler: { Traveler: null }, literature: { Literature: null },
      };
      
      const result = await actor.chooseRole(roleMap[selectedRole]);
      if (result.ok) {
        await refetchProfile(); // Minta context untuk refresh data profil
        setShowModal(false); // Tutup modal
        router.push('/dashboard'); // Arahkan ke dashboard
      } else {
        const errKey = Object.keys(result.err)[0];
        setError(`Gagal memilih role: ${errKey}.`);
      }
    } catch (err) {
      console.error('Choose role failed:', err);
      setError('Terjadi kesalahan saat memilih role. Coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Data untuk Render ---
  const roles = [
    { id: 'codes', name: 'Codes', description: 'Master of Technology.' },
    { id: 'sports', name: 'Sports', description: 'Champion of Physical Excellence.' },
    { id: 'arts', name: 'Arts', description: 'Creator of Beauty.' },
    { id: 'traveler', name: 'Traveler', description: 'Explorer of New Horizons.' },
    { id: 'literature', name: 'Literature', description: 'Master of Words.' }
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <span className="text-xl font-bold text-gray-900 font-minecraft">Habits Quest 4 Life</span>
            
            <div className="flex items-center space-x-4">
              {isLoading ? (
                <div className="text-gray-500">Loading...</div>
              ) : isAuthenticated && userProfile ? (
                <>
                  <span className="font-semibold">{userProfile.user.username}</span>
                  <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-lg">
                    Logout
                  </button>
                </>
              ) : (
                <button onClick={handleLogin} disabled={isLoading} className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium px-6 py-2 rounded-lg">
                  Start
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Modal Registrasi */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4 font-minecraft">
              {currentStep === 1 ? 'Buat Username' : 'Pilih Role Pertama'}
            </h2>
            {error && <p className="text-red-500 bg-red-100 p-2 rounded mb-4">{error}</p>}
            
            {currentStep === 1 ? (
              <form onSubmit={handleUsernameSubmit}>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username unik..."
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
                <button type="submit" disabled={isSubmitting} className="w-full mt-4 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 rounded-lg">
                  {isSubmitting ? 'Mengecek...' : 'Lanjutkan'}
                </button>
              </form>
            ) : (
              <div>
                <div className="grid grid-cols-2 gap-4">
                  {roles.map(role => (
                    <button
                      key={role.id}
                      onClick={() => setSelectedRole(role.id)}
                      className={`p-4 border rounded-lg text-center ${selectedRole === role.id ? 'ring-2 ring-yellow-500 border-yellow-500' : 'hover:border-gray-400'}`}
                    >
                      <h3 className="font-bold">{role.name}</h3>
                      <p className="text-sm text-gray-600">{role.description}</p>
                    </button>
                  ))}
                </div>
                <button onClick={handleConfirmRole} disabled={isSubmitting || !selectedRole} className="w-full mt-4 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 rounded-lg">
                  {isSubmitting ? 'Menyimpan...' : 'Konfirmasi & Mulai'}
                </button>
              </div>
            )}
             <button onClick={closeModal} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">&times;</button>
          </div>
        </div>
      )}
    </>
  );
}