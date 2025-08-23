'use client';

import { useState } from 'react';
import { useAuth } from '../lib/AuthContext'; // Sesuaikan path

// Tipe Quest sesuai dengan data dari backend (candid/declarations)
export interface Quest {
  id: bigint;
  title: string;
  description: string;
  coin_reward: bigint;
  exp_reward: bigint;
  stamina_cost: bigint;
  status: { OnProgress: null } | { Completed: null } | { Failed: null };
  deadline: bigint;
  accepted_at: bigint;
}

// Props yang diterima komponen
interface QuestListProps {
  userRole: string; // Digunakan untuk display dan logika UI
  quests: Quest[];  // Data quest langsung dari userProfile
}

export default function QuestList({ userRole, quests }: QuestListProps) {
  const { actor, refetchProfile } = useAuth();

  // State lokal hanya untuk UI (modal, loading, error)
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [showQuestModal, setShowQuestModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleAcceptQuest = async () => {
    if (!actor) return;
    setIsSubmitting(true);
    setError('');
    try {
      // Data untuk quest baru bisa didefinisikan di sini atau dari sumber lain
      const result = await actor.acceptQuest(
        "Misi Harian", // title
        `Selesaikan tugas harian untuk role ${userRole}.`, // description
        BigInt(10), // stamina_cost
        BigInt(25), // coin_reward
        BigInt(50)  // exp_reward
      );

      if (result.ok) {
        await refetchProfile(); // PENTING: Muat ulang data profil
      } else {
        const errKey = Object.keys(result.err)[0];
        setError(`Gagal mengambil quest: ${errKey}`);
      }
    } catch (e) {
      console.error("Accept quest failed:", e);
      setError("Terjadi kesalahan saat mengambil quest.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompleteQuest = async (questId: bigint) => {
    if (!actor) return;
    setIsSubmitting(true);
    setError('');
    try {
      const result = await actor.completeQuest(questId);
      if (result.ok) {
        await refetchProfile(); // PENTING: Muat ulang data profil
        setShowQuestModal(false); // Tutup modal jika terbuka
      } else {
        setError(result.err || "Gagal menyelesaikan quest.");
      }
    } catch (e) {
      console.error("Complete quest failed:", e);
      setError("Terjadi kesalahan koneksi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Memfilter quest dari props berdasarkan statusnya
  const onProgressQuests = quests.filter(q => 'OnProgress' in q.status);
  const completedQuests = quests.filter(q => 'Completed' in q.status);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6 font-minecraft">
        Daftar Quest - {userRole}
      </h2>
      
      {error && <p className="text-red-500 bg-red-100 p-2 rounded mb-4">{error}</p>}

      <div className="space-y-4">
        <button
          onClick={handleAcceptQuest}
          disabled={isSubmitting}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg font-minecraft disabled:bg-gray-400"
        >
          {isSubmitting ? 'Memproses...' : '+ Ambil Misi Harian'}
        </button>

        <div className="pt-2">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide font-minecraft">On Progress</h3>
        </div>

        {onProgressQuests.length === 0 && (
          <div className="p-4 border rounded-lg bg-white text-gray-500 text-sm font-minecraft">
            Tidak ada quest yang sedang berjalan.
          </div>
        )}

        {onProgressQuests.map((quest) => (
          <div 
            key={String(quest.id)}
            className="p-4 border border-orange-500 bg-orange-50 rounded-lg cursor-pointer hover:shadow-md"
            onClick={() => { setSelectedQuest(quest); setShowQuestModal(true); }}
          >
            <h3 className="font-semibold text-orange-700 font-minecraft">{quest.title}</h3>
            <p className="text-gray-600 text-sm my-2 font-minecraft truncate">{quest.description}</p>
          </div>
        ))}
        
        <div className="pt-2">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide font-minecraft">Selesai</h3>
        </div>

        {completedQuests.map((quest) => (
          <div key={String(quest.id)} className="p-4 border border-green-500 bg-green-50 rounded-lg opacity-70">
            <h3 className="font-semibold text-green-700 font-minecraft line-through">{quest.title}</h3>
          </div>
        ))}
      </div>

      {/* Modal Detail Quest */}
      {showQuestModal && selectedQuest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative bg-white rounded-lg p-6 max-w-lg w-full">
            <h3 className="text-2xl font-bold mb-4 font-minecraft">{selectedQuest.title}</h3>
            <p className="text-gray-700 mb-4 font-minecraft">{selectedQuest.description}</p>
            {/* Detail rewards */}
            <div className="grid grid-cols-3 gap-4 mb-6 text-center font-minecraft">
              <div className="p-2 bg-yellow-100 rounded">🪙 {String(selectedQuest.coin_reward)} Coins</div>
              <div className="p-2 bg-blue-100 rounded">⭐ {String(selectedQuest.exp_reward)} EXP</div>
              <div className="p-2 bg-red-100 rounded">⚡ {String(selectedQuest.stamina_cost)} Stamina</div>
            </div>
            {'OnProgress' in selectedQuest.status && (
              <button
                onClick={() => handleCompleteQuest(selectedQuest.id)}
                disabled={isSubmitting}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg font-minecraft"
              >
                {isSubmitting ? "..." : "Tandai Selesai"}
              </button>
            )}
            <button onClick={() => setShowQuestModal(false)} className="absolute top-4 right-4 text-gray-500">&times;</button>
          </div>
        </div>
      )}
    </div>
  );
}