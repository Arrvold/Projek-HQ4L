"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../lib/AuthContext";

interface Equipment {
  id: number;
  name: string;
  type: string;
  rarity: string;
  image: string;
  description: string;
  stats: {
    attack?: number;
    defense?: number;
    health?: number;
    mana?: number;
  };
}

export default function InventoryPage() {
  const router = useRouter();
  const { userProfile, actor, isAuthenticated, isLoading } = useAuth();
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(
    null
  );
  const [showEquipmentModal, setShowEquipmentModal] = useState(false);
  const [inventoryItems, setInventoryItems] = useState<any[]>([]);
  const [isLoadingInventory, setIsLoadingInventory] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/");
    }
  }, [isLoading, isAuthenticated, router]);

  // Load inventory data from backend
  useEffect(() => {
    const loadInventory = async () => {
      if (actor && userProfile) {
        try {
          setIsLoadingInventory(true);
          // Get shop data to map skin information
          const shopData = await actor.getShop();
          const ownedSkins = shopData.owned || [];

          // Map inventory items with skin details
          const mappedItems = userProfile.user.skins.map((item: any) => {
            const skin = ownedSkins.find((s: any) => s.id === item.skin_id);
            return {
              id: item.id,
              name: skin?.name || "Unknown Skin",
              type: "Skin",
              rarity: "Epic", // Default rarity, can be enhanced later
              image: skin?.image_url || "/assets/button.png",
              description: skin?.description || "A mysterious skin",
              stats: {},
              isActive: item.is_active,
            };
          });

          setInventoryItems(mappedItems);
        } catch (error) {
          console.error("Failed to load inventory:", error);
        } finally {
          setIsLoadingInventory(false);
        }
      }
    };

    loadInventory();
  }, [actor, userProfile]);

  const openEquipment = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
    setShowEquipmentModal(true);
  };

  const closeModal = () => {
    setShowEquipmentModal(false);
    setSelectedEquipment(null);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case "common":
        return "bg-gray-200 border-gray-400 text-gray-700";
      case "uncommon":
        return "bg-green-200 border-green-400 text-green-700";
      case "rare":
        return "bg-blue-200 border-blue-400 text-blue-700";
      case "epic":
        return "bg-purple-200 border-purple-400 text-purple-700";
      case "legendary":
        return "bg-yellow-200 border-yellow-400 text-yellow-700";
      default:
        return "bg-gray-200 border-gray-400 text-gray-700";
    }
  };

  // Show loading state
  if (isLoading || !userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-semibold">Loading your inventory...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur border-b-4 border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Left side: Back button and title */}
          <div className="flex items-center gap-4">
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
            <h1 className="text-2xl font-bold text-gray-900 font-minecraft">
              Inventory
            </h1>
          </div>

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
            <div className="flex items-center gap-4 bg-gray-100 border-2 border-gray-600 px-3 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)]">
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
        <div className="grid grid-cols-5 gap-8">
          {/* Right Column - Character Display (40% width) */}
          <div className="col-span-2 bg-white border-4 border-gray-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 font-minecraft text-center">
              Character
            </h2>

            <div className="flex flex-col items-center">
              {/* Character Image */}
              <div className="mb-6">
                {userProfile.active_inventory ? (
                  <img
                    src={userProfile.active_inventory.skin_image_url}
                    alt="Character"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        "/assets/button.png";
                    }}
                  />
                ) : (
                  <img src="/assets/button.png" alt="Default Character" />
                )}
              </div>
            </div>
          </div>

          {/* Left Column - Equipment Cards (60% width) */}
          <div className="col-span-3 bg-white border-4 border-gray-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 font-minecraft text-center">
              Equipment
            </h2>

            {isLoadingInventory ? (
              <div className="text-center py-8">
                <div className="text-gray-600 font-minecraft">
                  Loading inventory...
                </div>
              </div>
            ) : inventoryItems.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-600 font-minecraft">
                  No items in inventory yet!
                </div>
                <button
                  onClick={() => router.push("/shop")}
                  className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors font-minecraft border-2 border-blue-600"
                >
                  Visit Shop
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {inventoryItems.map((item) => (
                  <button
                    key={item.id}
                    className={`group bg-white border-4 overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.8)] transition-all duration-200 text-left transform hover:-translate-y-1 hover:-translate-x-1 ${
                      item.isActive
                        ? "border-green-600 bg-green-50"
                        : "border-gray-800"
                    }`}
                    onClick={() => openEquipment(item)}
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
                    <div className="p-3 bg-white">
                      <div className="font-bold text-gray-900 mb-1 font-minecraft truncate text-sm">
                        {item.name}
                      </div>
                      <div
                        className={`inline-block px-2 py-1 text-xs font-minecraft border-2 rounded ${getRarityColor(
                          item.rarity
                        )}`}
                      >
                        {item.rarity}
                      </div>
                      {item.isActive && (
                        <div className="mt-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded font-minecraft font-bold">
                          EQUIPPED
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Equipment Detail Modal */}
      {showEquipmentModal && selectedEquipment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white border-4 border-gray-800 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b-4 border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 font-minecraft">
                  {selectedEquipment.name}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 font-minecraft"
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

              {/* Equipment Image */}
              <div className="aspect-square bg-gray-100 border-4 border-gray-800 mb-4">
                <img
                  src={selectedEquipment.image}
                  alt={selectedEquipment.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "/assets/button.png";
                  }}
                />
              </div>

              {/* Equipment Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-700 font-minecraft">
                    Type:
                  </span>
                  <span className="text-sm text-gray-600 font-minecraft">
                    {selectedEquipment.type}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-700 font-minecraft">
                    Rarity:
                  </span>
                  <span
                    className={`inline-block px-2 py-1 text-xs font-minecraft border-2 rounded ${getRarityColor(
                      selectedEquipment.rarity
                    )}`}
                  >
                    {selectedEquipment.rarity}
                  </span>
                </div>

                <div>
                  <span className="text-sm font-bold text-gray-700 font-minecraft">
                    Description:
                  </span>
                  <p className="text-sm text-gray-600 font-minecraft mt-1">
                    {selectedEquipment.description}
                  </p>
                </div>

                {/* Stats */}
                {Object.keys(selectedEquipment.stats).length > 0 && (
                  <div>
                    <span className="text-sm font-bold text-gray-700 font-minecraft">
                      Stats:
                    </span>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      {selectedEquipment.stats.attack && (
                        <div className="text-sm text-gray-600 font-minecraft">
                          <span>Attack: </span>
                          <span className="font-bold text-green-600">
                            +{selectedEquipment.stats.attack}
                          </span>
                        </div>
                      )}
                      {selectedEquipment.stats.defense && (
                        <div className="text-sm text-gray-600 font-minecraft">
                          <span>Defense: </span>
                          <span className="font-bold text-blue-600">
                            +{selectedEquipment.stats.defense}
                          </span>
                        </div>
                      )}
                      {selectedEquipment.stats.health && (
                        <div className="text-sm text-gray-600 font-minecraft">
                          <span>Health: </span>
                          <span className="font-bold text-red-600">
                            +{selectedEquipment.stats.health}
                          </span>
                        </div>
                      )}
                      {selectedEquipment.stats.mana && (
                        <div className="text-sm text-gray-600 font-minecraft">
                          <span>Mana: </span>
                          <span className="font-bold text-purple-600">
                            +{selectedEquipment.stats.mana}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t-4 border-gray-800">
              <div className="flex gap-3">
                <button
                  onClick={closeModal}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors font-minecraft border-2 border-gray-600"
                >
                  Tutup
                </button>
                <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors font-minecraft border-2 border-blue-600">
                  Equip
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
