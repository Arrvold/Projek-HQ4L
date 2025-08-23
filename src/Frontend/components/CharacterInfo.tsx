'use client';

import { useState } from 'react';
import { useAuth } from '../lib/AuthContext'; // Sesuaikan path

// Tipe data sesuai backend
export interface Role {
  id: bigint;
  role_name: string;
  level: bigint;
  exp: bigint;
  is_active: boolean;
}

export interface ActiveInventory {
  id: bigint;
  skin_name: string;
  skin_image_url: string;
  // tambahkan properti lain jika ada
}

// Props yang diterima komponen
interface CharacterInfoProps {
  roles: Role[];
  activeInventory: ActiveInventory | null;
}

export default function CharacterInfo({ roles, activeInventory }: CharacterInfoProps) {
  const { actor, refetchProfile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper untuk memetakan nama role ke tipe variant Motoko
  const roleNameToVariant = (name: string) => {
    const map: { [key: string]: any } = {
      Codes: { Codes: null }, Sports: { Sports: null }, Arts: { Arts: null },
      Traveler: { Traveler: null }, Literature: { Literature: null },
    };
    return map[name];
  };

  // Fungsi untuk mengubah role aktif
  const handleRoleChange = async (role: Role) => {
    if (!actor || role.is_active || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const roleVariant = roleNameToVariant(role.role_name);
      if (roleVariant) {
        await actor.chooseRole(roleVariant);
        await refetchProfile(); // PENTING: Muat ulang data profil
      }
    } catch (e) {
      console.error("Gagal mengganti role:", e);
      // Anda bisa menambahkan state error di sini
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Fungsi untuk menghitung EXP dan ambang batas level berikutnya
  const getExpDetails = (level: bigint, exp: bigint) => {
    const lvl = Number(level);
    const currentExp = Number(exp);
    
    // Logika ini harus cocok dengan backend `calcLevel`
    const expThresholds: { [key: number]: number } = {
      1: 200, 2: 500, 3: 1500, 4: 5000, 5: Infinity,
    };
    const prevExpThreshold = lvl > 1 ? expThresholds[lvl - 1] : 0;
    const nextLevelExp = expThresholds[lvl];
    
    const expInCurrentLevel = currentExp - prevExpThreshold;
    const expForNextLevel = nextLevelExp - prevExpThreshold;

    const percentage = expForNextLevel > 0 ? (expInCurrentLevel / expForNextLevel) * 100 : 100;
    
    return { percentage, expInCurrentLevel, expForNextLevel };
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6 font-minecraft">
        Karakter Info
      </h2>
      
      {isSubmitting && <p className="text-center text-gray-500">Mengganti role...</p>}

      <div className="flex items-start space-x-6 mb-6">
        <div className="flex-shrink-0 text-center">
          <img 
            src={activeInventory ? activeInventory.skin_image_url : "https://freeweb3.infura-ipfs.io/ipfs/Qmbhu7Yj2osW5BRaYAwCGF8s9aMcAHYTGY1GPS6VnjRKpe"} 
            alt="Character" 
            className="w-48 h-48 rounded-full border-4 border-gray-200"
          />
          {activeInventory && (
            <span className="mt-2 inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full font-minecraft">
              {activeInventory.skin_name}
            </span>
          )}
        </div>
        
        <div className="flex-1 space-y-3">
          {roles.map((role) => {
            const { percentage, expInCurrentLevel, expForNextLevel } = getExpDetails(role.level, role.exp);
            
            return (
              <div 
                key={String(role.id)}
                className={`p-3 border rounded-lg transition-all ${role.is_active ? 'border-orange-500 bg-orange-50 shadow-md' : 'border-gray-200 bg-white hover:border-gray-400'} ${isSubmitting || role.is_active ? 'cursor-default' : 'cursor-pointer'}`}
                onClick={() => handleRoleChange(role)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className={`font-semibold font-minecraft ${role.is_active ? 'text-orange-700' : 'text-gray-900'}`}>
                      {role.role_name} {role.is_active && <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded-full ml-2">Active</span>}
                    </h4>
                    <p className="text-xs text-gray-600 font-minecraft py-1">
                      Level {String(role.level)}
                    </p>
                  </div>
                  <p className="text-xs font-semibold text-gray-700 font-minecraft">
                    {expInCurrentLevel} / {expForNextLevel} EXP
                  </p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div 
                    className="bg-green-500 h-2.5 rounded-full" 
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}