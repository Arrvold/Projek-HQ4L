'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

interface DashboardHeaderProps {
  username: string
  stamina: number
  coins: number
  userRole: string
}

export default function DashboardHeader({ username, stamina, coins, userRole }: DashboardHeaderProps) {
  const router = useRouter()
  
  const getRoleName = (roleId: string) => {
    const roleNames: { [key: string]: string } = {
      'codes': 'Codes',
      'sports': 'Sports',
      'arts': 'Arts',
      'traveler': 'Traveler',
      'literature': 'Literature'
    }
    return roleNames[roleId] || roleId
  }

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMenuOpen])

  const handleLogout = () => {
    try {
      localStorage.removeItem('username')
      localStorage.removeItem('userRole')
    } catch (e) {
      // noop
    }
    window.location.href = '/'
  }

  const handleShopClick = () => {
    setIsMenuOpen(false)
    router.push('/shop')
  }

  const handleInventoryClick = () => {
    setIsMenuOpen(false)
    router.push('/inventory')
  }

  const handleLeaderboardClick = () => {
    setIsMenuOpen(false)
    router.push('/leaderboard')
  }

  return (
    <header className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Nama User - Pojok Kiri */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900 font-minecraft">
              {username}
            </h1>
          </div>
          
          {/* Stamina, Coins, dan Menu - Sebelah Kanan */}
          <div className="flex items-center space-x-6" ref={menuRef}>
            {/* Stamina */}
            <div className="flex items-center space-x-2">
              <img 
                src="/assets/Stammina.png" 
                alt="Stamina" 
                className="w-6 h-6"
              />
              <span className="text-gray-900 font-minecraft font-medium">
                {stamina}/100
              </span>
            </div>
            
            {/* Coins */}
            <div className="flex items-center space-x-2">
              <img 
                src="/assets/koin.png" 
                alt="Coins" 
                className="w-6 h-6"
              />
              <span className="text-gray-900 font-minecraft font-medium">
                {coins}
              </span>
            </div>
            
            {/* Tombol Menu */}
            <div className="relative">
              <button 
                onClick={() => setIsMenuOpen((prev) => !prev)}
                className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-4 py-2 rounded-lg transition-colors font-minecraft"
                aria-haspopup="true"
                aria-expanded={isMenuOpen}
              >
                Menu
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 p-4">
                  <div className="grid grid-cols-3 gap-4">
                    {/* Shop */}
                    <button className="flex flex-col items-center justify-center gap-2 hover:bg-gray-50 rounded-xl p-3 transition font-minecraft" onClick={handleShopClick}>
                      <img src="/assets/menu_shop.png" alt="Shop" className="w-8 h-8" onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/assets/button.png' }} />
                      <span className="text-xs text-gray-800">Shop</span>
                    </button>
                    {/* Inventory */}
                    <button className="flex flex-col items-center justify-center gap-2 hover:bg-gray-50 rounded-xl p-3 transition font-minecraft" onClick={handleInventoryClick}>
                      <img src="/assets/menu_inventory.png" alt="Inventory" className="w-8 h-8" onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/assets/button.png' }} />
                      <span className="text-xs text-gray-800">Inventory</span>
                    </button>
                    {/* Leaderboard */}
                    <button className="flex flex-col items-center justify-center gap-2 hover:bg-gray-50 rounded-xl p-3 transition font-minecraft" onClick={handleLeaderboardClick}>
                      <img src="/assets/menu_leaderboard.png" alt="Leaderboard" className="w-8 h-8" onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/assets/button.png' }} />
                      <span className="text-xs text-gray-800">Leaderboard</span>
                    </button>
                    {/* Games */}
                    <button className="flex flex-col items-center justify-center gap-2 hover:bg-gray-50 rounded-xl p-3 transition font-minecraft" onClick={() => setIsMenuOpen(false)}>
                      <img src="/assets/gacha_woilah.png" alt="Gacha" className="w-8 h-8" onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/assets/button.png' }} />
                      <span className="text-xs text-gray-800">Gacha</span>
                    </button>
                    {/* Setting */}
                    <button className="flex flex-col items-center justify-center gap-2 hover:bg-gray-50 rounded-xl p-3 transition font-minecraft" onClick={() => setIsMenuOpen(false)}>
                      <img src="/assets/menu_setting.png" alt="Setting" className="w-8 h-8" onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/assets/button.png' }} />
                      <span className="text-xs text-gray-800">Setting</span>
                    </button>
                    {/* Logout */}
                    <button className="flex flex-col items-center justify-center gap-2 hover:bg-gray-50 rounded-xl p-3 transition font-minecraft text-red-600" onClick={handleLogout}>
                      <img src="/assets/menu_logout.png" alt="Logout" className="w-8 h-8" onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/assets/button.png' }} />
                      <span className="text-xs">Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
