"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../lib/AuthContext";

import DashboardHeader from "../../components/DashboardHeader";

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

export default function Dashboard() {
  const router = useRouter();
  const { actor, isAuthenticated, isLoading } = useAuth();
  const [userProfile, setUserProfile] = useState<any>(null);

  // State untuk CharacterInfo
  const [isSubmittingRole, setIsSubmittingRole] = useState(false);
  const [localRoles, setLocalRoles] = useState<Role[]>([]);

  // State untuk QuestList
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [showQuestModal, setShowQuestModal] = useState(false);
  const [isSubmittingQuest, setIsSubmittingQuest] = useState(false);
  const [errorQuest, setErrorQuest] = useState("");
  const [isStartPressed, setIsStartPressed] = useState(false);
  const [pressedFinishQuestId, setPressedFinishQuestId] = useState<bigint | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (actor) {
        try {
          const profile = await actor.getProfileUser();
          if (Array.isArray(profile) && profile.length > 0) {
            setUserProfile(profile[0]);
            setLocalRoles(profile[0].roles || []);
          } else {
            setUserProfile(null);
          }
        } catch (err) {
          console.error("Gagal fetch profile:", err);
        }
      }
    };
    fetchProfile();
  }, [actor]);

  if (isLoading || !userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-semibold">Loading your adventure...</div>
      </div>
    );
  }

  // Struktur JSON
  const { user, active_inventory, roles: rawRoles } = userProfile || {};
  const { username, stamina, coin, quests: rawQuests } = user || {};
  const roles: Role[] = Array.isArray(rawRoles) ? rawRoles : [];
  const quests: Quest[] = Array.isArray(rawQuests) ? rawQuests : [];

  // ==================== CharacterInfo Logic ====================
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
        alert(`Gagal memilih role: ${result.err}`);
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
      1: 200,
      2: 500,
      3: 1500,
      4: 5000,
      5: Infinity,
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

  // ==================== QuestList Logic ====================
  // Role aktif harus selalu ambil dari localRoles, bukan dari userProfile lama
  const activeRole = localRoles.find((r) => r.is_active);

  const handleAcceptQuest = async () => {
    if (!actor || !activeRole) return;
    setIsSubmittingQuest(true);
    setErrorQuest("");
    try {
      const result = await actor.acceptQuest(
        "Misi Harian",
        `Selesaikan tugas harian untuk role ${activeRole.role_name}.`, // ✅ pakai role aktif terkini
        BigInt(10),
        BigInt(25),
        BigInt(50)
      );
      if ("ok" in result) {
        console.log("Quest accepted:", result.ok);
        window.location.reload(); // ✅ reload langsung kalau berhasil
      } else if ("err" in result) {
        const errKey = Object.keys(result.err)[0];
        const errMessage = `Gagal mengambil quest: ${errKey}`;
        setErrorQuest(errMessage);
        alert(errMessage); // ✅ munculkan pop up dulu
        window.location.reload(); // ✅ reload setelah user lihat pesan
      } else {
        const errMessage = "Format response tidak dikenali.";
        setErrorQuest(errMessage);
        alert(errMessage);
        window.location.reload();
      }
    } catch (e) {
      console.error("Accept quest failed:", e);
      const errMessage = "Terjadi kesalahan saat mengambil quest.";
      setErrorQuest(errMessage);
      alert(errMessage); // ✅ kasih alert dulu
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
        window.location.reload(); // ✅ reload langsung kalau berhasil
      } else if ("err" in result) {
        const errKey = Object.keys(result.err)[0];
        const errMessage = `Gagal mengmenyelesaikan quest: ${errKey}`;
        setErrorQuest(errMessage);
        alert(errMessage); // ✅ munculkan pop up dulu
        window.location.reload(); // ✅ reload setelah user lihat pesan
      } else {
        const errMessage = "Format response tidak dikenali.";
        setErrorQuest(errMessage);
        alert(errMessage);
        window.location.reload();
      }
    } catch (e) {
      console.error("Finish quest failed:", e);
      const errMessage = "Terjadi kesalahan saat mengambil quest.";
      setErrorQuest(errMessage);
      alert(errMessage); // ✅ kasih alert dulu
      window.location.reload();
    } finally {
      setIsSubmittingQuest(false);
    }
  };

  // Quest tetap bisa difilter dari userProfile.user.quests
  const onProgressQuests = quests.filter((q) => "OnProgress" in q.status);
  const completedQuests = quests.filter((q) => "Completed" in q.status);


  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader username={username} stamina={Number(stamina)} coins={Number(coin)} />

      <main className="px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* QuestList langsung di sini */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 font-minecraft">
              Daftar Quest - {activeRole?.role_name || "Unknown"}
            </h2>

            {errorQuest && (
              <p className="text-red-500 bg-red-100 p-2 rounded mb-4 font-minecraft">
                {errorQuest}
              </p>
            )}

            {/* Tombol ambil quest */}
            <div
              className="cursor-pointer transition-all duration-200 hover:opacity-80 p-5 h-24 flex items-end"
              onClick={
                handleAcceptQuest
              }

              onMouseDown={() => setIsStartPressed(true)}
              onMouseUp={() => setIsStartPressed(false)}
              onMouseLeave={() => setIsStartPressed(false)}
            >
              <img
                src={
                  onProgressQuests.length === 0
                    ? isStartPressed
                      ? "/assets/start_quest_btn_pressed.png"
                      : "/assets/start_quest_btn_normal.png"
                    : isStartPressed
                      ? "/assets/add_quest_btn_pressed.png"
                      : "/assets/add_quest_btn_normal.png"
                }
                alt="Ambil Quest"
                className="w-56 mx-auto"
              />
            </div>

            {/* On Progress */}
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide font-minecraft pt-2">
              On Progress
            </h3>
            {onProgressQuests.length === 0 && (
              <div className="p-4 border rounded-lg border-gray-200 bg-white text-gray-500 text-sm font-minecraft">
                Tidak ada quest yang sedang berjalan.
              </div>
            )}
            {onProgressQuests.map((quest) => (
              <div
                key={String(quest.id)}
                className="p-4 mt-4 mb-4 border border-orange-500 bg-orange-50 rounded-lg cursor-pointer hover:shadow-md transition-all"
                onClick={() => {
                  setSelectedQuest(quest);
                  setShowQuestModal(true);
                }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-orange-700 font-minecraft mb-2">
                      {quest.title}
                      <span className="ml-2 text-sm bg-orange-500 text-white px-2 py-1 rounded-full">
                        Active
                      </span>
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 font-minecraft truncate">
                      {quest.description}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCompleteQuest(quest.id);
                    }}
                    onMouseDown={() => setPressedFinishQuestId(quest.id)}
                    onMouseUp={() => setPressedFinishQuestId(null)}
                    onMouseLeave={() => setPressedFinishQuestId(null)}
                  >
                    <img
                      src={
                        pressedFinishQuestId === quest.id
                          ? "/assets/finish_btn_pressed.png"
                          : "/assets/finish_btn_normal.png"
                      }
                      alt="Tandai Selesai"
                      className="max-h-8 hover:opacity-80 transition-opacity"
                    />
                  </button>
                </div>
              </div>
            ))}

            {/* Completed */}
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide font-minecraft pt-2">
              Selesai
            </h3>
            {completedQuests.map((quest) => (
              <div
                key={String(quest.id)}
                className="p-4 border border-green-500 bg-green-50 rounded-lg opacity-70"
              >
                <h3 className="font-semibold text-green-700 font-minecraft line-through">
                  {quest.title}
                </h3>
              </div>
            ))}
          </div>

          {/* CharacterInfo langsung di sini */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 font-minecraft">
              Karakter Info
            </h2>
            {isSubmittingRole && <p className="text-center text-gray-500">Mengganti role...</p>}

            <div className="flex items-start space-x-6 mb-6">
              <div className="flex-shrink-0 text-center">
                <img
                  src={
                    actItem?.skin.image_url ||
                    "https://freeweb3.infura-ipfs.io/ipfs/Qmbhu7Yj2osW5BRaYAwCGF8s9aMcAHYTGY1GPS6VnjRKpe"
                  }
                  alt={actItem?.skin.name || "Default Character"}
                  className="w-48 h-48 rounded-full border-4 border-gray-200 object-cover"
                />
                <span className="mt-2 inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full font-minecraft">
                  {actItem?.skin.name || "Default Skin"}
                </span>
              </div>

              <div className="flex-1 space-y-3">
                {orderedRoles.map((role) => {
                  const { percentage, expInCurrentLevel, expForNextLevel } = getExpDetails(
                    role.level,
                    role.exp
                  );
                  return (
                    <div
                      key={String(role.id)}
                      className={`p-3 border rounded-lg transition-all ${role.is_active
                        ? "border-orange-500 bg-orange-50 shadow-md"
                        : "border-gray-200 bg-white hover:border-gray-400"
                        } ${isSubmittingRole || role.is_active ? "cursor-default" : "cursor-pointer"}`}
                      onClick={() => handleRoleChange(role)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4
                            className={`font-semibold font-minecraft ${role.is_active ? "text-orange-700" : "text-gray-900"
                              }`}
                          >
                            {role.role_name}
                            {role.is_active && (
                              <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded-full ml-2">
                                Active
                              </span>
                            )}
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
        </div>
      </main>

      {/* Modal Quest */}
      {showQuestModal && selectedQuest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => setShowQuestModal(false)}
          ></div>
          <div className="relative bg-white rounded-2xl shadow-2xl mx-4 w-full max-w-2xl p-6">
            <h3 className="text-2xl font-bold mb-4 font-minecraft">{selectedQuest.title}</h3>
            <p className="text-gray-700 mb-6 leading-relaxed font-minecraft">
              {selectedQuest.description}
            </p>
            <button
              onClick={() => setShowQuestModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
