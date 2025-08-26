"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../lib/AuthContext";

interface Skin {
  id: number;
  name: string;
  description: string;
  image_url: string;
  price: number;
}

interface LeaderboardEntry {
  id: number;
  rank: number;
  name: string;
  exp: number;
  role: string;
  skin: Skin;
  isCurrentUser?: boolean;
}

export default function LeaderboardPage() {
  const router = useRouter();
  const { actor, isAuthenticated, isLoading } = useAuth();
  const [selectedRole, setSelectedRole] = useState<string>("codes");
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(
    []
  );
  const [myLeaderboard, setMyLeaderboard] = useState<LeaderboardEntry | null>(
    null
  );
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(true);

  const DEFAULT_SKIN: Skin = {
    id: 0,
    name: "Default Character",
    description: "Default Skin",
    image_url:
      "https://freeweb3.infura-ipfs.io/ipfs/Qmbhu7Yj2osW5BRaYAwCGF8s9aMcAHYTGY1GPS6VnjRKpe",
    price: 0,
  };

  const roleNames = {
    codes: "Codes",
    sports: "Sports",
    arts: "Arts",
    traveler: "Traveler",
    literature: "Literature",
  };

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    const loadLeaderboard = async () => {
      if (actor) {
        try {
          setIsLoadingLeaderboard(true);

          const roleId = getRoleId(selectedRole);
          const result = await actor.getLeaderboardAllUserByRole(roleId);
          console.log("Leaderboard result:", result);

          // Top leaderboard
          if (result?.topLeaderboard) {
            const topEntries = result.topLeaderboard.map((entry: any) => {
              const skinArr = entry.skin ?? [];
              const skin = skinArr.length > 0 ? skinArr[0] : DEFAULT_SKIN;

              return {
                id: Number(entry.user_id),
                rank: Number(entry.rank),
                name: entry.username,
                exp: Number(entry.exp),
                role: selectedRole,
                skin,
              } as LeaderboardEntry;
            });
            setLeaderboardData(topEntries);
          }

          // My leaderboard
          if (result?.myLeaderboard) {
            const meArr = Array.isArray(result.myLeaderboard)
              ? result.myLeaderboard
              : [result.myLeaderboard];

            if (meArr.length > 0) {
              const me = meArr[0];
              const skinArr = me.skin ?? [];
              const skin = skinArr.length > 0 ? skinArr[0] : DEFAULT_SKIN;

              setMyLeaderboard({
                id: Number(me.user_id),
                rank: Number(me.rank),
                name: me.username,
                exp: Number(me.exp),
                role: selectedRole,
                skin,
                isCurrentUser: true,
              });
            }
          }
        } catch (error) {
          console.error("Failed to load leaderboard:", error);
        } finally {
          setIsLoadingLeaderboard(false);
        }
      }
    };

    loadLeaderboard();
  }, [actor, selectedRole]);

  const getRoleId = (roleName: string): number => {
    const roleMap: { [key: string]: number } = {
      codes: 0,
      sports: 1,
      arts: 2,
      traveler: 3,
      literature: 4,
    };
    return roleMap[roleName] || 0;
  };

  const getRoleColor = (role: string) => {
    const colors = {
      codes: "bg-blue-100 border-blue-600",
      sports: "bg-green-100 border-green-600",
      arts: "bg-purple-100 border-purple-600",
      traveler: "bg-yellow-100 border-yellow-600",
      literature: "bg-red-100 border-red-600",
    };
    return colors[role as keyof typeof colors] || "bg-gray-100 border-gray-600";
  };
  const podium = leaderboardData.slice(0, 3);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-semibold">Loading leaderboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur border-b-4 border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Back button and Title */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-minecraft font-bold border-2 border-gray-600 px-3 py-1 bg-gray-100 hover:bg-gray-200 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.8)] transition-all duration-200"
            >
              ← Kembali
            </button>
            <h1 className="text-2xl font-bold text-gray-900 font-minecraft">
              Leaderboard
            </h1>
          </div>

          {/* Role Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-700 font-minecraft">
              Role:
            </span>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="border-2 border-gray-600 px-3 py-1 bg-white font-minecraft font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)]"
            >
              {Object.entries(roleNames).map(([key, name]) => (
                <option key={key} value={key}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 pt-20 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Podium */}
          <div className="bg-white border-4 border-gray-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 font-minecraft text-center">
              Top 3 Players
            </h2>

            <div className="relative h-80 flex items-end justify-center">
              {/* 3rd Place - Brown podium (left) */}
              <div className="flex flex-col items-center mr-4">
                <div className="relative mb-2">
                  <img
                    src={podium[2]?.skin?.image_url || DEFAULT_SKIN.image_url}
                    alt={podium[2]?.skin?.name || "3rd Place"}
                    className="w-16 h-16 object-contain"
                    onError={(e) =>
                      ((e.currentTarget as HTMLImageElement).src =
                        DEFAULT_SKIN.image_url)
                    }
                  />
                  <div className="absolute -top-2 -right-2 bg-orange-300 border-2 border-orange-600 w-6 h-6 flex items-center justify-center text-xs font-bold font-minecraft">
                    3
                  </div>
                </div>
                <div className="bg-orange-200 border-2 border-orange-600 px-3 py-1 text-center min-w-[100px] mb-2">
                  <div className="text-sm font-bold font-minecraft">
                    {podium[2]?.name || "-"}
                  </div>
                  <div className="text-xs font-minecraft">
                    {podium[2]?.exp?.toLocaleString() || 0} EXP
                  </div>
                </div>
                <div className="w-20 h-16 bg-amber-700 border-2 border-amber-900"></div>
              </div>

              {/* 1st Place - Yellow podium (center) */}
              <div className="flex flex-col items-center mx-4">
                <div className="relative mb-2">
                  <img
                    src={podium[0]?.skin?.image_url || DEFAULT_SKIN.image_url}
                    alt={podium[0]?.skin?.name || "1st Place"}
                    className="w-16 h-16 object-contain"
                    onError={(e) =>
                      ((e.currentTarget as HTMLImageElement).src =
                        DEFAULT_SKIN.image_url)
                    }
                  />
                  <div className="absolute -top-2 -right-2 bg-yellow-400 border-2 border-yellow-600 w-7 h-7 flex items-center justify-center text-xs font-bold font-minecraft">
                    1
                  </div>
                </div>
                <div className="bg-yellow-300 border-2 border-yellow-600 px-3 py-1 text-center min-w-[100px] mb-2">
                  <div className="text-sm font-bold font-minecraft">
                    {podium[0]?.name || "-"}
                  </div>
                  <div className="text-xs font-minecraft">
                    {podium[0]?.exp?.toLocaleString() || 0} EXP
                  </div>
                </div>
                <div className="w-20 h-24 bg-yellow-500 border-2 border-yellow-700"></div>
              </div>

              {/* 2nd Place - Silver podium (right) */}
              <div className="flex flex-col items-center ml-4">
                <div className="relative mb-2">
                  <img
                    src={podium[1]?.skin?.image_url || DEFAULT_SKIN.image_url}
                    alt={podium[1]?.skin?.name || "2nd Place"}
                    className="w-16 h-16 object-contain"
                    onError={(e) =>
                      ((e.currentTarget as HTMLImageElement).src =
                        DEFAULT_SKIN.image_url)
                    }
                  />
                  <div className="absolute -top-2 -right-2 bg-gray-300 border-2 border-gray-600 w-6 h-6 flex items-center justify-center text-xs font-bold font-minecraft">
                    2
                  </div>
                </div>
                <div className="bg-gray-300 border-2 border-gray-600 px-3 py-1 text-center min-w-[100px] mb-2">
                  <div className="text-sm font-bold font-minecraft">
                    {podium[1]?.name || "-"}
                  </div>
                  <div className="text-xs font-minecraft">
                    {podium[1]?.exp?.toLocaleString() || 0} EXP
                  </div>
                </div>
                <div className="w-20 h-20 bg-gray-400 border-2 border-gray-600"></div>
              </div>
            </div>
          </div>

          {/* Right Column - Top 10 List */}
          <div className="bg-white border-4 border-gray-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 font-minecraft">
              Top 10 Players
            </h2>
            <div className="space-y-2 mb-6">
              {leaderboardData.slice(0, 10).map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-3 border-2 border-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-800 text-white flex items-center justify-center text-sm font-bold font-minecraft border-2 border-gray-600">
                      {entry.rank}
                    </div>
                    <img
                      src={entry.skin.image_url}
                      alt={entry.skin.name}
                      className="w-8 h-8 border-2 border-gray-600 bg-white"
                      onError={(e) =>
                        ((e.currentTarget as HTMLImageElement).src =
                          DEFAULT_SKIN.image_url)
                      }
                    />
                    <div className="flex flex-col">
                      <div className="font-bold text-gray-900 font-minecraft">
                        {entry.name}
                      </div>
                    </div>
                  </div>
                  <div className="font-bold text-gray-900 font-minecraft">
                    {entry.exp.toLocaleString()} EXP
                  </div>
                </div>
              ))}
            </div>

            {/* Current User */}
            {myLeaderboard && (
              <div className="border-t-4 border-gray-800 pt-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4 font-minecraft">
                  Your Ranking
                </h3>
                <div className="flex items-center justify-between p-4 border-4 border-orange-600 bg-orange-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-600 text-white flex items-center justify-center text-sm font-bold font-minecraft border-2 border-orange-800">
                      {myLeaderboard.rank}
                    </div>
                    <img
                      src={myLeaderboard.skin.image_url}
                      alt={myLeaderboard.skin.name}
                      className="w-10 h-10 border-2 border-orange-600 bg-white"
                      onError={(e) =>
                        ((e.currentTarget as HTMLImageElement).src =
                          DEFAULT_SKIN.image_url)
                      }
                    />
                    <div className="flex flex-col">
                      <div className="font-bold text-gray-900 font-minecraft">
                        {myLeaderboard.name}
                      </div>
                    </div>
                  </div>
                  <div className="font-bold text-gray-900 font-minecraft">
                    {myLeaderboard.exp.toLocaleString()} EXP
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
