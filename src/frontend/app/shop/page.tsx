"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../lib/AuthContext";

interface ShopItem {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  rarity: string;
  isLimited?: boolean;
  isOwned?: boolean;
}

export default function ShopPage() {
  const router = useRouter();
  const { userProfile, actor, isAuthenticated, isLoading } = useAuth();
  const [items, setItems] = useState<ShopItem[]>([]);
  const [isLoadingShop, setIsLoadingShop] = useState(true);
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isBuying, setIsBuying] = useState(false);

  // Load shop data from backend
  useEffect(() => {
    const loadShop = async () => {
      if (actor && userProfile) {
        try {
          setIsLoadingShop(true);
          const shopData = await actor.getShop();

          // Map available skins to shop items
          const availableItems =
            shopData.available?.map((skin: any) => ({
              id: skin.id,
              name: skin.name,
              description: skin.description,
              image: skin.image_url,
              price: skin.price,
              rarity: "Epic", // Default rarity, can be enhanced later
              isLimited: false,
              isOwned: false,
            })) || [];

          // Mark owned items
          const ownedSkins = shopData.owned || [];
          const itemsWithOwnership = availableItems.map((item: ShopItem) => ({
            ...item,
            isOwned: ownedSkins.some((owned: any) => owned.id === item.id),
          }));

          setItems(itemsWithOwnership);
        } catch (error) {
          console.error("Failed to load shop:", error);
        } finally {
          setIsLoadingShop(false);
        }
      }
    };

    loadShop();
  }, [actor, userProfile]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/");
    }
  }, [isLoading, isAuthenticated, router]);

  const openItem = (item: ShopItem) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
  };

  const handleBuy = async () => {
    if (!selectedItem || !actor) return;

    setIsBuying(true);
    try {
      // Call backend to purchase item
      const result = await actor.buySkin(selectedItem.id);
      if (result.ok) {
        alert(`Berhasil membeli ${selectedItem.name}!`);
        // Refresh shop data
        const shopData = await actor.getShop();
        const availableItems =
          shopData.available?.map((skin: any) => ({
            id: skin.id,
            name: skin.name,
            description: skin.description,
            image: skin.image_url,
            price: skin.price,
            rarity: "Epic",
            isLimited: false,
            isOwned: false,
          })) || [];

        const ownedSkins = shopData.owned || [];
        const itemsWithOwnership = availableItems.map((item: ShopItem) => ({
          ...item,
          isOwned: ownedSkins.some((owned: any) => owned.id === item.id),
        }));

        setItems(itemsWithOwnership);
        closeModal();
      } else {
        const errKey = Object.keys(result.err)[0];
        alert(`Gagal membeli: ${errKey}`);
      }
    } catch (error) {
      console.error("Purchase failed:", error);
      alert("Terjadi kesalahan saat membeli item");
    } finally {
      setIsBuying(false);
    }
  };

  // Show loading state
  if (isLoading || !userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-semibold">Loading shop...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur border-b-4 border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Back button */}
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

          {/* Right side: Energy and Coin */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-gray-100 border-2 border-gray-600 px-3 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)]">
              <img
                src="/assets/Stammina.png"
                alt="Energy"
                className="w-5 h-5"
              />
              <span className="font-bold text-gray-800 font-minecraft">
                {userProfile.user.stamina}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-gray-100 border-2 border-gray-600 px-3 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)]">
              <img src="/assets/koin.png" alt="Coin" className="w-5 h-5" />
              <span className="font-bold text-gray-800 font-minecraft">
                {userProfile.user.coin}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Content padding top to avoid header overlay */}
      <main className="max-w-6xl mx-auto px-4 pt-20 pb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 font-minecraft border-b-4 border-gray-800 pb-2 inline-block">
          Shop
        </h1>

        {isLoadingShop && (
          <div className="text-gray-600 font-minecraft">Memuat item...</div>
        )}

        {!isLoadingShop && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <button
                key={item.id}
                className={`group bg-white border-4 overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.8)] transition-all duration-200 text-left transform hover:-translate-y-1 hover:-translate-x-1 ${
                  item.isOwned
                    ? "border-green-600 bg-green-50"
                    : "border-gray-800"
                }`}
                onClick={() => openItem(item)}
                disabled={item.isOwned}
              >
                <div className="aspect-square bg-gray-100 border-b-4 border-gray-800">
                  <img
                    src={item.image}
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
                    <span>{item.price}</span>
                  </div>
                  {item.isOwned && (
                    <div className="mt-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded font-minecraft font-bold">
                      OWNED
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </main>

      {/* Item Detail Modal */}
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
                  src={selectedItem.image}
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
                <span>{selectedItem.price}</span>
              </div>
              {selectedItem.isLimited && (
                <span className="text-xs px-3 py-1 border-2 border-yellow-600 bg-yellow-100 text-yellow-800 font-minecraft font-bold">
                  Limited
                </span>
              )}
              {selectedItem.isOwned && (
                <span className="text-xs px-3 py-1 border-2 border-green-600 bg-green-100 text-green-800 font-minecraft font-bold">
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
              {!selectedItem.isOwned && (
                <button
                  onClick={handleBuy}
                  disabled={
                    isBuying || userProfile.user.coin < selectedItem.price
                  }
                  className={`flex-1 font-bold py-3 px-6 border-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.8)] transition-all duration-200 font-minecraft ${
                    userProfile.user.coin < selectedItem.price
                      ? "bg-gray-400 text-gray-600 border-gray-500 cursor-not-allowed"
                      : "bg-orange-500 hover:bg-orange-600 text-white border-orange-700"
                  }`}
                >
                  {isBuying ? "Membeli..." : "Beli"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
