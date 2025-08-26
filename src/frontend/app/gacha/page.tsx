"use client";

import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur border-b-4 border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-minecraft font-bold border-2 border-gray-600 px-3 py-1 bg-gray-100 hover:bg-gray-200 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)]"
            >
              ← Kembali
            </button>
            <h1 className="text-2xl font-bold text-gray-900 font-minecraft">
              Gacha
            </h1>
          </div>
        </div>
      </header>

      {/* Konten Coming Soon */}
      <main className="flex items-center justify-center h-screen">
        <h2 className="text-4xl font-minecraft font-bold text-gray-700">
          ⚙️ Coming Soon...
        </h2>
      </main>
    </div>
  );
}
