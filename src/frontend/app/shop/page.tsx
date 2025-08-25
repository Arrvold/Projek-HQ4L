"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../lib/AuthContext";

type Skin = {
  id: bigint;
  name: string;
  description: string;
  image_url: string;
  price: bigint;
};

type ShopView = {
  available: Skin[];
  owned: Skin[];
};

export default function ShopPage() {
  const router = useRouter();
  const { actor } = useAuth();

  const [shop, setShop] = useState<ShopView | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<Skin | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isOwned, setIsOwned] = useState(false);
  const [coin, setCoin] = useState<number>(0);

  // Fetch shop
  const fetchShop = async () => {
    if (!actor) return;
    try {
      const data = await actor.getShop();
      setShop(data);
    } catch (err) {
      console.error("Failed to load shop:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch coins
  const fetchCoins = async () => {
    if (!actor) return;
    try {
      const result = await actor.getCoins();
      if ("ok" in result) {
        setCoin(Number(result.ok));
      } else {
        console.error("Gagal ambil coins:", result.err);
      }
    } catch (err) {
      console.error("Error fetch coins:", err);
    }
  };

  // Load initial data
  useEffect(() => {
    if (!actor) return;
    fetchShop();
    fetchCoins();
  }, [actor]);

  const openItem = (item: Skin, owned: boolean) => {
    setSelectedItem(item);
    setIsOwned(owned);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
    setIsOwned(false);
  };

  const handleBuy = async () => {
    if (!selectedItem || isOwned) return;
    try {
      const result = await actor.buySkin(selectedItem.id);

      if ("ok" in result) {
        // Refresh coin dari backend
        await fetchCoins();

        // Update shop state tanpa reload
        setShop((prev) =>
          prev
            ? {
                available: prev.available.filter((s) => s.id !== selectedItem.id),
                owned: [...prev.owned, selectedItem],
              }
            : prev
        );

        alert(`Berhasil membeli ${selectedItem.name}!`);
      } else if ("err" in result) {
        switch (result.err) {
          case "NotEnoughCoin":
            alert("Coin kamu tidak cukup untuk membeli skin ini.");
            break;
          case "AlreadyOwned":
            alert("Kamu sudah memiliki skin ini.");
            break;
          case "UserNotFound":
            alert("User tidak ditemukan. Silakan login ulang.");
            break;
          case "SkinNotFound":
            alert("Skin tidak ditemukan.");
            break;
          default:
            alert("Terjadi kesalahan saat membeli skin.");
        }
      }
    } catch (err) {
      console.error("Gagal beli skin:", err);
      alert("Gagal membeli item (error koneksi).");
    } finally {
      closeModal();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur border-b-4 border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-minecraft font-bold border-2 border-gray-600 px-3 py-1 bg-gray-100 hover:bg-gray-200 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.8)] transition-all duration-200"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span>Kembali</span>
          </button>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-gray-100 border-2 border-gray-600 px-3 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)]">
              <img src="/assets/koin.png" alt="Coin" className="w-5 h-5" />
              <span className="font-bold text-gray-800 font-minecraft">
                {coin}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pt-20 pb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 font-minecraft border-b-4 border-gray-800 pb-2 inline-block">
          Shop
        </h1>

        {isLoading && (
          <div className="text-gray-600 font-minecraft">Memuat item...</div>
        )}

        {!isLoading && shop && (
          <>
            {/* Available Skins */}
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-minecraft">
              Available
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {shop.available.map((item) => (
                <button
                  key={item.id.toString()}
                  className="group bg-white border-4 border-gray-800 overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.8)] transition-all duration-200 text-left transform hover:-translate-y-1 hover:-translate-x-1"
                  onClick={() => openItem(item, false)}
                >
                  <div className="aspect-square bg-gray-100 border-b-4 border-gray-800">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          "/assets/button.png";
                      }}
                    />
                  </div>
                  <div className="p-4 bg-white">
                    <div className="font-bold text-gray-900 mb-2 font-minecraft truncate text-sm">
                      {item.name}
                    </div>
                    <div className="flex items-center gap-2 text-gray-700 font-minecraft text-sm">
                      <img
                        src="/assets/koin.png"
                        alt="Coin"
                        className="w-4 h-4"
                      />
                      <span>{Number(item.price)}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Owned Skins */}
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-minecraft">
              Owned
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {shop.owned.map((item) => (
                <button
                  key={item.id.toString()}
                  className="group bg-gray-200 border-4 border-gray-800 overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] text-left cursor-not-allowed"
                  onClick={() => openItem(item, true)}
                >
                  <div className="aspect-square bg-gray-100 border-b-4 border-gray-800">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover opacity-70"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          "/assets/button.png";
                      }}
                    />
                  </div>
                  <div className="p-4 bg-gray-100">
                    <div className="font-bold text-gray-700 mb-2 font-minecraft truncate text-sm">
                      {item.name}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 font-minecraft text-sm">
                      <img
                        src="/assets/koin.png"
                        alt="Coin"
                        className="w-4 h-4 opacity-70"
                      />
                      <span>{Number(item.price)}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Modal */}
      {showModal && selectedItem && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-2">
          <div
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={closeModal}
          ></div>
          <div className="relative bg-white border-4 border-gray-800 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] mx-4 w-full max-w-lg p-6 max-h-[96vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 font-minecraft">
                {selectedItem.name}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="mb-4">
              <div className="aspect-square bg-gray-100 border-4 border-gray-800 overflow-hidden">
                <img
                  src={selectedItem.image_url}
                  alt={selectedItem.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "/assets/button.png";
                  }}
                />
              </div>
            </div>

            <p className="text-gray-700 mb-4 font-minecraft">
              {selectedItem.description}
            </p>

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-gray-900 font-semibold font-minecraft">
                <img src="/assets/koin.png" alt="Coin" className="w-5 h-5" />
                <span>{Number(selectedItem.price)}</span>
              </div>
              {isOwned && (
                <span className="text-xs px-3 py-1 border-2 border-gray-500 bg-gray-200 text-gray-600 font-minecraft font-bold">
                  Owned
                </span>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={closeModal}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-6 border-2 border-gray-600 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.8)] transition-all duration-200 font-minecraft"
              >
                Tutup
              </button>
              <button
                onClick={handleBuy}
                disabled={isOwned}
                className={`flex-1 font-bold py-3 px-6 border-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] transition-all duration-200 font-minecraft ${
                  isOwned
                    ? "bg-gray-300 text-gray-500 border-gray-500 cursor-not-allowed"
                    : "bg-orange-500 hover:bg-orange-600 text-white border-orange-700 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.8)]"
                }`}
              >
                {isOwned ? "Owned" : "Beli"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
