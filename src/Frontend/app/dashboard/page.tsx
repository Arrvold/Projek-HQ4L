'use client'
import { useState, useEffect } from 'react'
import DashboardHeader from '../../components/DashboardHeader'
import QuestList from '../../components/QuestList'
import CharacterInfo from '../../components/CharacterInfo'

export default function Dashboard() {
  const [username, setUsername] = useState('')
  const [userRole, setUserRole] = useState('')
  const [stamina, setStamina] = useState(100)
  const [coins, setCoins] = useState(0)
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [selectedRole, setSelectedRole] = useState('')

  useEffect(() => {
    // Check if user exists in localStorage
    const storedUsername = localStorage.getItem('username')
    const storedRole = localStorage.getItem('userRole')
    
    if (storedUsername && storedRole) {
      setUsername(storedUsername)
      setUserRole(storedRole)
      setSelectedRole(storedRole)
    } else {
      // Show register modal if no user data
      setShowRegisterModal(true)
    }
  }, [])

  const handleConfirmRole = () => {
    if (selectedRole) {
      // Save to localStorage
      localStorage.setItem('username', username)
      localStorage.setItem('userRole', selectedRole)
      setUserRole(selectedRole)
      setShowRegisterModal(false)
    }
  }

  const closeRegisterModal = () => {
    setShowRegisterModal(false)
    setSelectedRole(userRole) // Reset ke role yang sedang aktif
  }

  const roles = [
    { id: 'codes', name: 'Codes', badge: '/assets/badge_code.png', color: 'bg-blue-500', hoverColor: 'hover:bg-blue-600', description: 'Master of Technology - Ahli teknologi yang dapat memecahkan masalah kompleks dengan logika dan algoritma.' },
    { id: 'sports', name: 'Sports', badge: '/assets/badge_sports.png', color: 'bg-green-500', hoverColor: 'hover:bg-green-600', description: 'Champion of Physical Excellence - Atlet sejati yang menguasai kekuatan fisik dan ketahanan mental.' },
    { id: 'arts', name: 'Arts', badge: '/assets/badge_art.png', color: 'bg-purple-500', hoverColor: 'hover:bg-purple-600', description: 'Creator of Beauty - Seniman yang memiliki kreativitas tak terbatas dan kemampuan ekspresi visual.' },
    { id: 'traveler', name: 'Traveler', badge: '/assets/badge_explorer.png', color: 'bg-orange-500', hoverColor: 'hover:bg-orange-600', description: 'Explorer of New Horizons - Petualang yang selalu mencari pengalaman baru dan perspektif berbeda.' },
    { id: 'literature', name: 'Literature', badge: '/assets/badge_literature.png', color: 'bg-red-500', hoverColor: 'hover:bg-red-600', description: 'Master of Words - Ahli komunikasi yang dapat menyampaikan ide-ide kompleks dengan cara yang mudah dipahami.' }
  ]

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader 
        username={username}
        stamina={stamina}
        coins={coins}
        userRole={userRole}
      />
      
      <main className="px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quest List - Sebelah Kiri */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <QuestList userRole={userRole} />
          </div>
          
          {/* Character Info - Sebelah Kanan */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <CharacterInfo 
              userRole={userRole} 
              onRoleChange={(roleId) => {
                localStorage.setItem('userRole', roleId);
                setUserRole(roleId);
              }}
            />
          </div>
        </div>
      </main>

      {/* Register Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={closeRegisterModal}></div>
          
          <div className="relative bg-white rounded-2xl shadow-2xl mx-4 w-full max-w-4xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2 font-minecraft">
                Welcome to HQ4L!
              </h2>
              <p className="text-gray-600 font-minecraft">
                Choose your username and role to start your adventure
              </p>
            </div>

            <div className="space-y-8 max-h-[67.5vh] overflow-y-auto pr-2">
              {/* Username Input */}
              <div className="max-w-md mx-auto">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2 font-minecraft">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-minecraft"
                  placeholder="Enter your username"
                />
              </div>

              {/* Role Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 px-4 pt-4 max-w-2xl mx-auto">
                {roles.map((role) => (
                  <div
                    key={role.id}
                    className={`group cursor-pointer transition-all duration-300 hover:scale-105 ${
                      selectedRole === role.id ? 'ring-4 ring-orange-500 ring-offset-4 rounded-xl' : ''
                    }`}
                    onClick={() => handleRoleSelect(role.id)}
                  >
                    <div className="w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-4 group-hover:scale-110">
                      <img 
                        src={role.badge} 
                        alt={`${role.name} Badge`}
                        className="w-24 h-24 object-contain"
                      />
                    </div>
                    <h3 className={`text-lg font-semibold text-center transition-colors mb-3 font-minecraft ${
                      selectedRole === role.id ? 'text-orange-600 font-bold' : 'text-gray-900 group-hover:text-gray-700'
                    }`}>
                      {role.name}
                    </h3>
                    <p className="text-sm text-gray-600 text-center leading-relaxed font-minecraft">
                      {role.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center pt-6 border-t border-gray-200">
                <button
                  onClick={closeRegisterModal}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors font-minecraft"
                >
                  Cancel
                </button>
                
                {username && selectedRole && (
                  <button
                    onClick={handleConfirmRole}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors font-minecraft"
                  >
                    Start Adventure
                  </button>
                )}
              </div>
            </div>

            <button
              onClick={closeRegisterModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
