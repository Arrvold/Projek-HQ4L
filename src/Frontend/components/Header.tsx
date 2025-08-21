'use client'

import { useState, useEffect } from 'react'

export default function Header() {
  const [showModal, setShowModal] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [username, setUsername] = useState('')
  const [selectedRole, setSelectedRole] = useState('')

  const openModal = () => {
    // Cek apakah user sudah login
    const userExist = localStorage.getItem('userExist')
    
    if (userExist === 'true') {
      // User sudah login, redirect ke dashboard
      window.location.href = '/dashboard'
    } else {
      // User belum login, tampilkan popup register
      setShowModal(true)
      setCurrentStep(1)
    }
  }

  const closeModal = () => {
    setShowModal(false)
    setCurrentStep(1)
    setUsername('')
    setSelectedRole('')
  }

  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (username.trim()) {
      setCurrentStep(2)
    }
  }

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId)
    // Tidak langsung redirect, tunggu konfirmasi
  }

  const handleConfirmRole = () => {
    if (selectedRole) {
      // Simpan data user ke cache dan redirect ke dashboard
      localStorage.setItem('userExist', 'true')
      localStorage.setItem('username', username)
      localStorage.setItem('userRole', selectedRole)
      window.location.href = '/dashboard'
    }
  }

  const goBackToUsername = () => {
    setCurrentStep(1)
  }

  const roles = [
    { id: 'codes', name: 'Codes', badge: '/assets/badge_code.png', color: 'bg-blue-500', hoverColor: 'hover:bg-blue-600', description: 'Master of Technology - Ahli teknologi yang dapat memecahkan masalah kompleks dengan logika dan algoritma.' },
    { id: 'sports', name: 'Sports', badge: '/assets/badge_sports.png', color: 'bg-green-500', hoverColor: 'hover:bg-green-600', description: 'Champion of Physical Excellence - Atlet sejati yang menguasai kekuatan fisik dan ketahanan mental.' },
    { id: 'arts', name: 'Arts', badge: '/assets/badge_art.png', color: 'bg-purple-500', hoverColor: 'hover:bg-purple-600', description: 'Creator of Beauty - Seniman yang memiliki kreativitas tak terbatas dan kemampuan ekspresi visual.' },
    { id: 'traveler', name: 'Traveler', badge: '/assets/badge_explorer.png', color: 'bg-orange-500', hoverColor: 'hover:bg-orange-600', description: 'Explorer of New Horizons - Petualang yang selalu mencari pengalaman baru dan perspektif berbeda.' },
    { id: 'literature', name: 'Literature', badge: '/assets/badge_literature.png', color: 'bg-red-500', hoverColor: 'hover:bg-red-600', description: 'Master of Words - Ahli komunikasi yang dapat menyampaikan ide-ide kompleks dengan cara yang mudah dipahami.' }
  ]

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
             {/* Logo */}
             <div className="flex items-center">
              <img 
                src="/assets/HQ4L_Logo.png" 
                alt="GameWorld Logo" 
                className="w-12 h-12" 
              />
              <span className="ml-3 text-xl font-bold text-gray-900 font-minecraft">Habits Quest 4 Life</span>
            </div>
            
            {/* Start Button */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={openModal}
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium px-6 py-2 rounded-lg transition-colors shadow-md flex items-center gap-2 font-minecraft"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                Start
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Modal Popup Multi-Step */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Background overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={closeModal}></div>
          
          {/* Modal content - Lebih lebar untuk step 2 */}
          <div className={`relative bg-white rounded-2xl shadow-2xl mx-4 ${
            currentStep === 1 ? 'w-full max-w-md p-8' : 'w-full max-w-4xl p-8'
          }`}>
            {/* Header dengan step indicator */}
            <div className="text-center mb-12">
              <div className="flex justify-center items-center mb-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  currentStep >= 1 ? 'bg-yellow-400 text-gray-900' : 'bg-gray-200 text-gray-500'
                }`}>
                  1
                </div>
                <div className={`w-16 h-1 mx-2 ${
                  currentStep >= 2 ? 'bg-yellow-400' : 'bg-gray-200'
                }`}></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  currentStep >= 2 ? 'bg-yellow-400 text-gray-900' : 'bg-gray-200 text-gray-500'
                }`}>
                  2
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2 font-minecraft">
                {currentStep === 1 ? 'Buat Username' : 'Pilih Role'}
              </h2>
              <p className="text-gray-600 font-minecraft">
                {currentStep === 1 
                  ? 'Masukkan username untuk memulai petualangan' 
                  : 'Pilih role yang paling sesuai dengan gaya bermainmu'
                }
              </p>
            </div>

            {/* Step 1: Username Input */}
            {currentStep === 1 && (
              <form onSubmit={handleUsernameSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-minecraft">
                    Username
                  </label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-lg font-minecraft"
                    placeholder="Masukkan Username"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!username.trim()}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-gray-900 font-bold py-3 px-6 rounded-lg transition-colors text-lg font-minecraft"
                >
                  Lanjutkan
                </button>
              </form>
            )}

            {/* Step 2: Role Selection */}
            {currentStep === 2 && (
              <div className="space-y-8 max-h-[67.5vh] overflow-y-auto pr-2">
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

                {/* Role Selection Summary */}
                {selectedRole && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                    <p className="text-gray-700 mb-3 font-minecraft">
                      <span className="font-semibold">Role yang dipilih:</span>
                    </p>
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-16 h-16 rounded-full flex items-center justify-center">
                        <img 
                          src={roles.find(r => r.id === selectedRole)?.badge} 
                          alt={`${roles.find(r => r.id === selectedRole)?.name} Badge`}
                          className="w-16 h-16 object-contain"
                        />
                      </div>
                      <span className="text-lg font-bold text-gray-900 font-minecraft">
                        {roles.find(r => r.id === selectedRole)?.name}
                      </span>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 sticky bottom-0 bg-white pt-6 border-t border-gray-200">
                  <button
                    onClick={goBackToUsername}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors font-minecraft"
                  >
                    Kembali ke Username
                  </button>
                  
                  {selectedRole && (
                    <button
                      onClick={handleConfirmRole}
                      className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-6 rounded-lg transition-colors font-minecraft"
                    >
                      Konfirmasi & Lanjutkan
                    </button>
                  )}
                </div>
              </div>
            )}

            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  )
}
