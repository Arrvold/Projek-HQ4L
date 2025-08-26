"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../lib/AuthContext";

import DashboardHeader from "../../components/DashboardHeader";

// (Interface Role, Quest, GeneratedQuest dan const roleDescriptions tidak berubah)
// ... salin dari kode lama Anda ...
// ==== Tipe data sesuai backend ====
interface Role {
  id: bigint;
  role_name: string;
  level: bigint;
  exp: bigint;
  is_active: boolean;
}
interface Quest {
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

// Tipe data untuk quest yang di-generate oleh Gemini
interface GeneratedQuest {
  judul: string;
  deskripsi_quest: string;
  stamina: number;
  exp: number;
  coin: number;
}

// Deskripsi untuk setiap role (untuk prompt Gemini)
const roleDescriptions: { [key: string]: string } = {
  Codes: "Fokus pada kebiasaan terkait pemrograman, belajar algoritma, atau membuat proyek kecil.",
  Sports: "Fokus pada kebiasaan terkait aktivitas fisik, olahraga, nutrisi, atau kesehatan.",
  Arts: "Fokus pada kebiasaan terkait kreativitas, seperti menggambar, musik, menulis, atau kerajinan tangan.",
  Traveler: "Fokus pada kebiasaan terkait eksplorasi, belajar bahasa baru, merencanakan perjalanan, atau mempelajari budaya.",
  Literature: "Fokus pada kebiasaan membaca buku, menulis jurnal, mempelajari sastra, atau memperkaya kosakata.",
};


// =====================================================================
// BARU: Custom Hook untuk Countdown Timer
// =====================================================================
const useCountdown = (deadline: bigint) => {
  const deadlineDate = useMemo(() => new Date(Number(deadline / 1_000_000n)), [deadline]);

  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const difference = deadlineDate.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeLeft("00:00:00");
        clearInterval(interval);
        return;
      }

      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft(
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [deadlineDate]);

  return timeLeft;
};

// =====================================================================
// BARU: Komponen untuk menampilkan setiap Quest "On Progress"
// =====================================================================
const QuestItem = ({ quest, handleComplete, setPressedId }: {
  quest: Quest,
  handleComplete: (id: bigint) => void,
  setPressedId: (id: bigint | null) => void,
}) => {
  const timeLeft = useCountdown(quest.deadline);

  return (
    <div className="p-4 mt-4 mb-4 border border-orange-500 bg-orange-50 rounded-lg">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <h3 className="font-semibold text-orange-700 font-minecraft mb-2 flex items-center">
            {quest.title}
            <span className="ml-2 text-sm bg-orange-500 text-white px-2 py-1 rounded-full">Active</span>
          </h3>
          <p className="text-gray-600 text-sm mb-3 font-minecraft">{quest.description}</p>
          <div className="font-minecraft text-sm text-gray-700 bg-white border border-gray-200 px-2 py-1 rounded inline-block">
            ⏳ Sisa Waktu: <span className="font-bold text-red-600">{timeLeft}</span>
          </div>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); handleComplete(quest.id); }}
          onMouseDown={() => setPressedId(quest.id)}
          onMouseUp={() => setPressedId(null)}
          onMouseLeave={() => setPressedId(null)}
          className="flex-shrink-0"
        >
          <img
            src="/assets/finish_btn_normal.png"
            alt="Tandai Selesai"
            className="max-h-8 hover:opacity-80 transition-opacity"
          />
        </button>
      </div>
    </div>
  );
};


// =====================================================================
// MODIFIKASI: Komponen Utama Dashboard
// =====================================================================
export default function Dashboard() {
  const router = useRouter();
  const { actor, isAuthenticated, isLoading } = useAuth();
  const [userProfile, setUserProfile] = useState<any>(null);

  // BARU: State untuk menyimpan semua riwayat quest
  const [questHistory, setQuestHistory] = useState<{
    onProgress: Quest[],
    completed: Quest[],
    failed: Quest[],
  }>({ onProgress: [], completed: [], failed: [] });

  const [isSubmittingRole, setIsSubmittingRole] = useState(false);
  const [localRoles, setLocalRoles] = useState<Role[]>([]);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [showQuestModal, setShowQuestModal] = useState(false);
  const [isSubmittingQuest, setIsSubmittingQuest] = useState(false);
  const [errorQuest, setErrorQuest] = useState("");
  const [isStartPressed, setIsStartPressed] = useState(false);
  const [pressedFinishQuestId, setPressedFinishQuestId] = useState<bigint | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuests, setGeneratedQuests] = useState<GeneratedQuest[]>([]);
  const [showGeneratedQuestsModal, setShowGeneratedQuestsModal] = useState(false);
  const [isFetchingQuests, setIsFetchingQuests] = useState(true); // Loading state for quests

  // MODIFIKASI: Menggabungkan logic fetch data
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/");
    }

    const fetchData = async () => {
      if (actor) {
        try {
          setIsFetchingQuests(true);
          // 1. Tandai quest yang sudah lewat deadline sebagai Failed di backend
          await actor.failExpiredQuests();

          // 2. Ambil profile user dan riwayat quest secara bersamaan
          const [profile, history] = await Promise.all([
            actor.getProfileUser(),
            actor.historyQuest()
          ]);

          if (Array.isArray(profile) && profile.length > 0) {
            setUserProfile(profile[0]);
            setLocalRoles(profile[0].roles || []);
          } else {
            setUserProfile(null);
          }
          setQuestHistory(history);

        } catch (err) {
          console.error("Gagal fetch data:", err);
        } finally {
          setIsFetchingQuests(false);
        }
      }
    };

    fetchData();
  }, [actor, isAuthenticated, isLoading, router]);

  // (Fungsi-fungsi lain seperti handleRoleChange, getExpDetails, dll. tidak berubah)
  // ... salin dari kode lama Anda ...
  const { user, active_inventory, roles: rawRoles } = userProfile || {};
  const { username, stamina, coin } = user || {};
  const roles: Role[] = Array.isArray(rawRoles) ? rawRoles : [];

  const actItem = Array.isArray(active_inventory) ? active_inventory[0] : active_inventory;

  const roleNameToVariant = (name: string) => {
    const map: { [key: string]: any } = {
      Codes: { Codes: null },
      Sports: { Sports: null },
      Arts: { Arts: null },
      Traveler: { Traveler: null },
      Literature: { Literature: null },
    };
    return map[name];
  };

  const handleRoleChange = async (role: Role) => {
    if (!actor || role.is_active || isSubmittingRole) return;
    setIsSubmittingRole(true);
    try {
      const roleVariant = roleNameToVariant(role.role_name);
      const result = await actor.chooseRole(roleVariant);
      if ("ok" in result) {
        setLocalRoles((prev) =>
          prev.map((r) =>
            r.id === role.id ? { ...r, is_active: true } : { ...r, is_active: false }
          )
        );
      } else if ("err" in result) {
        alert(`Gagal memilih role: ${Object.keys(result.err)[0]}`);
      }
    } catch (e) {
      console.error("Gagal mengganti role:", e);
      alert("Terjadi kesalahan saat mengganti role.");
    } finally {
      setIsSubmittingRole(false);
    }
  };

  const getExpDetails = (level: bigint, exp: bigint) => {
    const lvl = Number(level);
    const currentExp = Number(exp);
    const expThresholds: { [key: number]: number } = {
      1: 200, 2: 500, 3: 1500, 4: 5000, 5: Infinity,
    };
    const prevExpThreshold = lvl > 1 ? expThresholds[lvl - 1] : 0;
    const nextLevelExp = expThresholds[lvl];
    const expInCurrentLevel = currentExp - prevExpThreshold;
    const expForNextLevel = nextLevelExp - prevExpThreshold;
    const percentage =
      expForNextLevel > 0 ? (expInCurrentLevel / expForNextLevel) * 100 : 100;
    return { percentage, expInCurrentLevel, expForNextLevel };
  };

  const orderedRoles = [...localRoles].sort((a, b) => {
    const order = ["Codes", "Sports", "Arts", "Traveler", "Literature"];
    return order.indexOf(a.role_name) - order.indexOf(b.role_name);
  });

  const activeRole = localRoles.find((r) => r.is_active);

  const handleGenerateQuests = async () => {
    if (!activeRole || isGenerating) return;
    setIsGenerating(true);
    setErrorQuest("");
    try {
      const payload = {
        role: activeRole.role_name,
        level: Number(activeRole.level),
        desc: roleDescriptions[activeRole.role_name] || "Fokus pada pengembangan diri secara umum."
      };
      const response = await fetch("http://127.0.0.1:8000/quest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Gagal menghubungi AI Quest Master.");
      }

      const data = await response.json();
      if (data.success && Array.isArray(data.quests)) {
        setGeneratedQuests(data.quests);
        setShowGeneratedQuestsModal(true);
      } else {
        throw new Error("Format response dari AI tidak valid.");
      }

    } catch (e: any) {
      console.error("Gagal generate quest:", e);
      setErrorQuest(e.message || "Terjadi kesalahan saat generate quest.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAcceptGeneratedQuest = async (quest: GeneratedQuest) => {
    if (!actor) return;
    setIsSubmittingQuest(true);
    setShowGeneratedQuestsModal(false);
    setErrorQuest("");
    try {
      const result = await actor.acceptQuest(
        quest.judul,
        quest.deskripsi_quest,
        BigInt(quest.stamina),
        BigInt(quest.coin),
        BigInt(quest.exp)
      );
      if ("ok" in result) {
        console.log("Quest accepted:", result.ok);
        window.location.reload();
      } else if ("err" in result) {
        const errKey = Object.keys(result.err)[0];
        const errMessage = `Gagal mengambil quest: ${errKey}`;
        setErrorQuest(errMessage);
        alert(errMessage);
        window.location.reload();
      } else {
        throw new Error("Format response tidak dikenali.");
      }
    } catch (e: any) {
      console.error("Accept quest failed:", e);
      const errMessage = e.message || "Terjadi kesalahan saat mengambil quest.";
      setErrorQuest(errMessage);
      alert(errMessage);
      window.location.reload();
    } finally {
      setIsSubmittingQuest(false);
    }
  };

  const handleCompleteQuest = async (questId: bigint) => {
    if (!actor) return;
    setIsSubmittingQuest(true);
    setErrorQuest("");
    try {
      const result = await actor.completeQuest(questId);
      if ("ok" in result) {
        console.log("Quest completed:", result.ok);
        window.location.reload();
      } else if ("err" in result) {
        const errKey = Object.keys(result.err)[0];
        const errMessage = `Gagal menyelesaikan quest: ${errKey}`;
        setErrorQuest(errMessage);
        alert(errMessage);
        window.location.reload();
      }
    } catch (e) {
      console.error("Finish quest failed:", e);
      const errMessage = "Terjadi kesalahan saat menyelesaikan quest.";
      setErrorQuest(errMessage);
      alert(errMessage);
      window.location.reload();
    } finally {
      setIsSubmittingQuest(false);
    }
  };

  if (isLoading || !userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-semibold">Loading your adventure...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader username={username} stamina={Number(stamina)} coins={Number(coin)} />

      <main className="px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ======================= QuestList ======================= */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 font-minecraft">
              Daftar Quest - {activeRole?.role_name || "Pilih Role"}
            </h2>

            {errorQuest && (
              <p className="text-red-500 bg-red-100 p-2 rounded mb-4 font-minecraft">{errorQuest}</p>
            )}

            <div
              className={`transition-all duration-200 p-5 h-24 flex items-end ${!activeRole || isGenerating || isSubmittingQuest ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:opacity-80"}`}
              onClick={!activeRole || isGenerating ? () => { } : handleGenerateQuests}
              onMouseDown={() => setIsStartPressed(true)}
              onMouseUp={() => setIsStartPressed(false)}
              onMouseLeave={() => setIsStartPressed(false)}
            >
              <img src={isStartPressed ? "/assets/add_quest_btn_pressed.png" : "/assets/add_quest_btn_normal.png"} alt="Ambil Quest" className="w-56 mx-auto" />
            </div>

            {isGenerating && (<p className="text-center text-gray-600 font-minecraft animate-pulse">Menghubungi AI Quest Master...</p>)}

            {isFetchingQuests ? (
              <p className="text-center text-gray-500 mt-4">Memuat quest...</p>
            ) : (
              <>
                {/* On Progress */}
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide font-minecraft pt-4">On Progress</h3>
                {questHistory.onProgress.length === 0 ? (
                  <div className="p-4 border rounded-lg border-gray-200 bg-white text-gray-500 text-sm font-minecraft">Tidak ada quest yang sedang berjalan.</div>
                ) : (
                  questHistory.onProgress.map((quest) => (
                    <QuestItem
                      key={String(quest.id)}
                      quest={quest}
                      handleComplete={handleCompleteQuest}
                      setPressedId={setPressedFinishQuestId}
                    />
                  ))
                )}

                {/* Completed */}
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide font-minecraft pt-6">Selesai</h3>
                {questHistory.completed.length === 0 ? (
                  <div className="p-4 border rounded-lg border-gray-200 bg-white text-gray-500 text-sm font-minecraft">
                    Belum ada quest yang selesai.
                  </div>
                ) : (
                  questHistory.completed.map((quest) => (
                    <div
                      key={String(quest.id)}
                      onClick={() => { setSelectedQuest(quest); setShowQuestModal(true); }}
                      className="p-4 mt-2 border border-green-500 bg-green-50 rounded-lg opacity-80 cursor-pointer hover:bg-green-100 transition-colors"
                    >
                      <h4 className="font-semibold text-green-800 font-minecraft flex justify-between items-center">
                        {quest.title}
                        <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">Completed</span>
                      </h4>
                    </div>
                  ))
                )}

                {/* Failed */}
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide font-minecraft pt-6">Gagal</h3>
                {questHistory.failed.length === 0 ? (
                  <div className="p-4 border rounded-lg border-gray-200 bg-white text-gray-500 text-sm font-minecraft">
                    Tidak ada quest yang gagal.
                  </div>
                ) : (
                  questHistory.failed.map((quest) => (
                    <div
                      key={String(quest.id)}
                      onClick={() => { setSelectedQuest(quest); setShowQuestModal(true); }}
                      className="p-4 mt-2 border border-red-500 bg-red-50 rounded-lg opacity-80 cursor-pointer hover:bg-red-100 transition-colors"
                    >
                      <h4 className="font-semibold text-red-800 font-minecraft line-through flex justify-between items-center">
                        {quest.title}
                        <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded-full">Failed</span>
                      </h4>
                    </div>
                  ))
                )}

              </>
            )}
          </div>

          {/* ===================== CharacterInfo ===================== */}
          {/* (Komponen CharacterInfo tidak berubah) */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            {/* ... salin dari kode lama Anda ... */}
            <h2 className="text-2xl font-bold text-gray-900 mb-6 font-minecraft">Karakter Info</h2>
            {isSubmittingRole && <p className="text-center text-gray-500">Mengganti role...</p>}
            <div className="flex items-start space-x-6 mb-6">
              <div className="flex-shrink-0 text-center">
                <img
                  src={actItem?.skin.image_url || "https://freeweb3.infura-ipfs.io/ipfs/Qmbhu7Yj2osW5BRaYAwCGF8s9aMcAHYTGY1GPS6VnjRKpe"}
                  alt={actItem?.skin.name || "Default Character"}
                  className="w-48 h-48 rounded-full border-4 border-gray-200 object-cover"
                />
                <span className="mt-2 inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full font-minecraft">
                  {actItem?.skin.name || "Default Skin"}
                </span>
              </div>
              <div className="flex-1 space-y-3">
                {orderedRoles.map((role) => {
                  const { percentage, expInCurrentLevel, expForNextLevel } = getExpDetails(role.level, role.exp);
                  return (
                    <div
                      key={String(role.id)}
                      className={`p-3 border rounded-lg transition-all ${role.is_active ? "border-orange-500 bg-orange-50 shadow-md" : "border-gray-200 bg-white hover:border-gray-400"} ${isSubmittingRole || role.is_active ? "cursor-default" : "cursor-pointer"}`}
                      onClick={() => handleRoleChange(role)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className={`font-semibold font-minecraft ${role.is_active ? "text-orange-700" : "text-gray-900"}`}>
                            {role.role_name}
                            {role.is_active && (<span className="text-xs bg-orange-500 text-white px-2 py-1 rounded-full ml-2">Active</span>)}
                          </h4>
                          <p className="text-xs text-gray-600 font-minecraft py-1">Level {String(role.level)}</p>
                        </div>
                        <p className="text-xs font-semibold text-gray-700 font-minecraft">{expInCurrentLevel} / {expForNextLevel} EXP</p>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                        <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* (Modal tidak berubah) */}
      {/* ... salin dari kode lama Anda ... */}
      {showQuestModal && selectedQuest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => setShowQuestModal(false)}
          ></div>
          <div className="relative bg-white rounded-2xl shadow-2xl mx-4 w-full max-w-2xl p-6">
            <h3 className="text-2xl font-bold mb-4 font-minecraft">{selectedQuest.title}</h3>
            <p className="text-gray-700 mb-6 leading-relaxed font-minecraft">{selectedQuest.description}</p>

            <div className="flex justify-between text-sm font-minecraft bg-gray-50 border rounded-lg p-3 mb-4">
              <span className="text-yellow-600">💰 Coin: +{String(selectedQuest.coin_reward)}</span>
              <span className="text-green-600">⭐ EXP: +{String(selectedQuest.exp_reward)}</span>
              <span className="text-red-600">⚡ Stamina: -{String(selectedQuest.stamina_cost)}</span>
            </div>

            <button
              onClick={() => setShowQuestModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {showGeneratedQuestsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => !isSubmittingQuest && setShowGeneratedQuestsModal(false)}
          ></div>
          <div className="relative bg-white rounded-2xl shadow-2xl mx-4 w-full max-w-3xl p-6">
            <h3 className="text-2xl font-bold mb-4 font-minecraft">Pilih Misi Harian Anda!</h3>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              {generatedQuests.map((q, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <h4 className="font-bold text-lg font-minecraft text-gray-800">{q.judul}</h4>
                  <p className="text-gray-600 my-2 font-minecraft">{q.deskripsi_quest}</p>
                  <div className="flex items-center justify-between mt-3 text-sm font-minecraft">
                    <div className="flex space-x-4">
                      <span className="text-red-500">Stamina: -{q.stamina}</span>
                      <span className="text-green-500">EXP: +{q.exp}</span>
                      <span className="text-yellow-500">Coin: +{q.coin}</span>
                    </div>
                    <button
                      onClick={() => handleAcceptGeneratedQuest(q)}
                      disabled={isSubmittingQuest}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 disabled:bg-gray-400"
                    >
                      {isSubmittingQuest ? "Memilih..." : "Pilih Quest"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => !isSubmittingQuest && setShowGeneratedQuestsModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            > ✕ </button>
          </div>
        </div>
      )}
    </div>
  );
}