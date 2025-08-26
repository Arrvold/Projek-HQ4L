"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../lib/AuthContext"; // ambil actor/user dari context

interface Skin {
  id: number;
  name: string;
  description: string;
  image_url: string;
  price: number;
}

interface InventoryItem {
  id: number;
  user_id: string;
  is_active: boolean;
  acquired_at: bigint;
  skin: Skin; // langsung embed skin
}

export default function InventoryPage() {
  const router = useRouter();
  const { actor } = useAuth();

  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!actor) return;
      try {
        const userInventory: any[] = await actor.getInventory();
        console.log('oy' + userInventory)

        // konversi dari string → number/bigint
        const mappedInventory: InventoryItem[] = userInventory.map((item) => ({
          id: Number(item.id),
          user_id: item.user_id.toString(),
          is_active: item.is_active,
          acquired_at: BigInt(item.acquired_at),
          skin: {
            id: Number(item.skin.id),
            name: item.skin.name,
            description: item.skin.description,
            image_url: item.skin.image_url,
            price: Number(item.skin.price),
          },
        }));

        setInventory(mappedInventory);
      } catch (err) {
        console.error("Gagal load inventory:", err);
      }
    };
    fetchData();
  }, [actor]);

  const activeItem = inventory.find((it) => it.is_active);

  return (
    <div className="min-h-screen bg-gray-50">
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
              Inventory
            </h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 pt-20 pb-10">
        <div className="grid grid-cols-5 gap-8">
          {/* Left - Character Display */}
          <div className="col-span-2 bg-white border-4 border-gray-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 font-minecraft text-center">
              Character
            </h2>
            <div className="flex flex-col items-center">
              {activeItem ? (
                <>
                  <img
                    src={activeItem.skin.image_url}
                    alt={activeItem.skin.name}
                    className="w-48 h-48 object-cover border-4 border-gray-800 mb-4"
                  />
                  <h3 className="font-bold font-minecraft text-lg">
                    {activeItem.skin.name}
                  </h3>
                  <p className="text-sm text-gray-600 font-minecraft text-center">
                    {activeItem.skin.description}
                  </p>
                </>
              ) : (
                <>
                  <img
                    src="https://freeweb3.infura-ipfs.io/ipfs/Qmbhu7Yj2osW5BRaYAwCGF8s9aMcAHYTGY1GPS6VnjRKpe"
                    alt="Default Character"
                    className="w-96 h-96 object-cover border-4 border-gray-800 mb-4"
                  />
                  <h3 className="font-bold font-minecraft text-lg">
                    Default Skin
                  </h3>
                  <p className="text-sm text-gray-600 font-minecraft text-center">
                    Default Character
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Right - Skin List */}
          <div className="col-span-3 bg-white border-4 border-gray-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 font-minecraft text-center">
              Koleksi Skin
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {inventory.map((item) => (
                <div
                  key={item.id}
                  className={`p-3 border-4 ${
                    item.is_active ? "border-yellow-500" : "border-gray-800"
                  } shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]`}
                >
                  <img
                    src={item.skin.image_url}
                    alt={item.skin.name}
                    className="w-full h-[300px] object-cover border-2 border-gray-600 mb-2"
                  />
                  <h3 className="font-bold font-minecraft">{item.skin.name}</h3>
                  <p className="text-sm text-gray-600 font-minecraft">
                    {item.skin.description}
                  </p>
                  {item.is_active ? (
                    <button
                     onClick={async () => {
                        await actor.setActiveInventory(item.id);
                        window.location.reload();
                      }}
                      className="mt-2 w-full bg-gray-300 text-gray-700 font-minecraft py-1"
                    >
                      Aktif
                    </button>
                  ) : (
                    <button
                      onClick={async () => {
                        await actor.setActiveInventory(item.id);
                        window.location.reload();
                      }}
                      className="mt-2 w-full bg-blue-500 hover:bg-blue-600 text-white font-minecraft py-1"
                    >
                      Gunakan
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}