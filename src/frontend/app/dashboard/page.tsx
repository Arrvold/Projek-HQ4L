"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../lib/AuthContext";

import DashboardHeader from "../../components/DashboardHeader";
import QuestList from "../../components/QuestList";
import CharacterInfo from "../../components/CharacterInfo";

export default function Dashboard() {
  const router = useRouter();
  const { actor, isAuthenticated, isLoading } = useAuth();
  const [userProfile, setUserProfile] = useState<any>(null);

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

  // Sesuai struktur JSON
  const {
    user,
    active_inventory,
    roles: rawRoles,
  } = userProfile || {};

  const {
    username,
    stamina,
    coin,
    quests: rawQuests,
  } = user || {};

  const roles = Array.isArray(rawRoles) ? rawRoles : [];
  const quests = Array.isArray(rawQuests) ? rawQuests : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader
        username={username}
        stamina={Number(stamina)}
        coins={Number(coin)}
      />

      <main className="px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Kolom Kiri: Daftar Quest */}
          <QuestList
            userRole={roles.find((r: any) => r.is_active)?.role_name || "Unknown"}
            quests={quests}
          />

          {/* Kolom Kanan: Info Karakter */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <CharacterInfo roles={roles} activeInventory={active_inventory} />
          </div>
        </div>
      </main>
    </div>
  );
}
