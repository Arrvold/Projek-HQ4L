'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface ShopItem {
  id: number
  name: string
  description: string
  image: string
  price: number
  rarity: string
  isLimited?: boolean
}

export default function ShopPage() {
  const router = useRouter()
  const [items, setItems] = useState<ShopItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null)
  const [showModal, setShowModal] = useState(false)

  // Mock data for shop items
  const mockItems: ShopItem[] = [
    {
      id: 1,
      name: 'Master Coder',
      description: 'Skin Master Coder untuk tampil seperti developer pro.',
      image: 'https://freeweb3.infura-ipfs.io/ipfs/QmbyWrWKjzwwCh9fDG7cwFszFQjCz7yKgMfpqhV8ASntDo',
      price: 1200,
      rarity: 'Legendary',
      isLimited: true
    },
    {
      id: 2,
      name: 'Backpacker Man',
      description: 'Skin Backpacker Man untuk vibe traveler sejati.',
      image: 'https://freeweb3.infura-ipfs.io/ipfs/QmfAYpyzzGAJp9tzBSsBZ7mkMzbAKbbeFbCAjhx13VXcGx',
      price: 800,
      rarity: 'Epic',
      isLimited: false
    },
    {
      id: 3,
      name: 'Sporty Man',
      description: 'Skin Sporty Man untuk tampil atletis dan energik.',
      image: 'https://freeweb3.infura-ipfs.io/ipfs/QmdaEWf4Vzp4J6En2UC1gDyW1FqAiQJC8xaoZ57veB4yVG',
      price: 700,
      rarity: 'Rare',
      isLimited: false
    },
    {
      id: 4,
      name: 'Stylish Man',
      description: 'Skin Stylish Man untuk gaya modern yang elegan.',
      image: 'https://freeweb3.infura-ipfs.io/ipfs/QmRN8Qf3T6MBd4ocMmykPPq9xUUN4KNoC3ksjpei49AEHM',
      price: 900,
      rarity: 'Epic',
      isLimited: false
    }
  ]

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setItems(mockItems)
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const openItem = (item: ShopItem) => {
    setSelectedItem(item)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedItem(null)
  }

  const handleBuy = () => {
    if (!selectedItem) return
    alert(`Berhasil membeli ${selectedItem.name}!`)
    closeModal()
  }

  // Mock user data
  const coin = 1500
  const stamina = 85

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur border-b-4 border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Back button */}
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-minecraft font-bold border-2 border-gray-600 px-3 py-1 bg-gray-100 hover:bg-gray-200 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.8)] transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Kembali</span>
          </button>

          {/* Right side: Energy and Coin */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-gray-100 border-2 border-gray-600 px-3 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)]">
              <img src="/assets/Stammina.png" alt="Energy" className="w-5 h-5" />
              <span className="font-bold text-gray-800 font-minecraft">{stamina}</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-100 border-2 border-gray-600 px-3 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)]">
              <img src="/assets/koin.png" alt="Coin" className="w-5 h-5" />
              <span className="font-bold text-gray-800 font-minecraft">{coin}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Content padding top to avoid header overlay */}
      <main className="max-w-6xl mx-auto px-4 pt-20 pb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 font-minecraft border-b-4 border-gray-800 pb-2 inline-block">Shop</h1>

        {isLoading && (
          <div className="text-gray-600 font-minecraft">Memuat item...</div>
        )}

        {!isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <button
                key={item.id}
                className="group bg-white border-4 border-gray-800 overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.8)] transition-all duration-200 text-left transform hover:-translate-y-1 hover:-translate-x-1"
                onClick={() => openItem(item)}
              >
                <div className="aspect-square bg-gray-100 border-b-4 border-gray-800">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/assets/button.png' }}
                  />
                </div>
                <div className="p-4 bg-white">
                  <div className="font-bold text-gray-900 mb-2 font-minecraft truncate text-sm">{item.name}</div>
                  <div className="flex items-center gap-2 text-gray-700 font-minecraft text-sm">
                    <img src="/assets/koin.png" alt="Coin" className="w-4 h-4" />
                    <span>{item.price}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>

      {/* Item Detail Modal */}
      {showModal && selectedItem && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-2">
          <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="relative bg-white border-4 border-gray-800 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] mx-4 w-full max-w-lg p-6 max-h-[96vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 font-minecraft">{selectedItem.name}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-4">
              <div className="aspect-square bg-gray-100 border-4 border-gray-800 overflow-hidden">
                <img
                  src={selectedItem.image}
                  alt={selectedItem.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/assets/button.png' }}
                />
              </div>
            </div>

            <p className="text-gray-700 mb-4 font-minecraft">{selectedItem.description}</p>

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-gray-900 font-semibold font-minecraft">
                <img src="/assets/koin.png" alt="Coin" className="w-5 h-5" />
                <span>{selectedItem.price}</span>
              </div>
              {selectedItem.isLimited && (
                <span className="text-xs px-3 py-1 border-2 border-yellow-600 bg-yellow-100 text-yellow-800 font-minecraft font-bold">Limited</span>
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
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 border-2 border-orange-700 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.8)] transition-all duration-200 font-minecraft"
              >
                Beli
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
