'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface LeaderboardEntry {
  id: number
  rank: number
  name: string
  exp: number
  role: string
  isCurrentUser?: boolean
}

export default function LeaderboardPage() {
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState<string>('codes')

  // Dummy data for leaderboard
  const allLeaderboardData: LeaderboardEntry[] = [
    // Top 10 users
    { id: 1, rank: 1, name: 'DragonSlayer', exp: 15420, role: 'codes' },
    { id: 2, rank: 2, name: 'PixelMaster', exp: 14230, role: 'arts' },
    { id: 3, rank: 3, name: 'QuestHunter', exp: 13890, role: 'traveler' },
    { id: 4, rank: 4, name: 'BookWorm', exp: 12560, role: 'literature' },
    { id: 5, rank: 5, name: 'FitnessGuru', exp: 11870, role: 'sports' },
    { id: 6, rank: 6, name: 'CodeNinja', exp: 11240, role: 'codes' },
    { id: 7, rank: 7, name: 'ArtCreator', exp: 10890, role: 'arts' },
    { id: 8, rank: 8, name: 'AdventureSeeker', exp: 10230, role: 'traveler' },
    { id: 9, rank: 9, name: 'StoryTeller', exp: 9870, role: 'literature' },
    { id: 10, rank: 10, name: 'AthletePro', exp: 9450, role: 'sports' },
    // Current user (rank 0 for special display)
    { id: 999, rank: 0, name: 'You', exp: 5670, role: 'codes', isCurrentUser: true }
  ]

  const roleNames = {
    codes: 'Codes',
    sports: 'Sports', 
    arts: 'Arts',
    traveler: 'Traveler',
    literature: 'Literature'
  }

  const filteredData = allLeaderboardData.filter(entry => entry.role === selectedRole && !entry.isCurrentUser)

  // Sort by EXP desc and assign rank per role
  const rankedData = [...filteredData]
    .sort((a, b) => b.exp - a.exp)
    .map((entry, idx) => ({ ...entry, rank: idx + 1 }))

  const currentUserData = allLeaderboardData.find(entry => entry.isCurrentUser)

  // Compute current user's rank within THEIR role (per-role ranking for user card)
  const userRolePool = allLeaderboardData.filter(e => e.role === (currentUserData?.role || ''))
    .filter(e => !e.isCurrentUser)
    .sort((a, b) => b.exp - a.exp)
  const userRankWithinRole = currentUserData
    ? 1 + userRolePool.findIndex(e => e.exp <= currentUserData.exp)
    : null

  // Podium entries from current selection
  const podium = rankedData.slice(0, 3)

  const getRoleColor = (role: string) => {
    const colors = {
      codes: 'bg-blue-100 border-blue-600',
      sports: 'bg-green-100 border-green-600',
      arts: 'bg-purple-100 border-purple-600',
      traveler: 'bg-yellow-100 border-yellow-600',
      literature: 'bg-red-100 border-red-600'
    }
    return colors[role as keyof typeof colors] || 'bg-gray-100 border-gray-600'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur border-b-4 border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Back button and Title */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-minecraft font-bold border-2 border-gray-600 px-3 py-1 bg-gray-100 hover:bg-gray-200 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.8)] transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Kembali</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-900 font-minecraft">Leaderboard</h1>
          </div>

          {/* Role Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-700 font-minecraft">Role:</span>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="border-2 border-gray-600 px-3 py-1 bg-white font-minecraft font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)]"
            >
              {Object.entries(roleNames).map(([key, name]) => (
                <option key={key} value={key}>{name}</option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* Content padding top to avoid header overlay */}
      <main className="max-w-6xl mx-auto px-4 pt-20 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column - Podium */}
          <div className="bg-white border-4 border-gray-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 font-minecraft text-center">Top 3 Players</h2>
            
            <div className="relative h-80 flex items-end justify-center">
              {/* 3rd Place - Brown podium (left) */}
              <div className="flex flex-col items-center mr-4">
                <div className="relative mb-2">
                  <img 
                    src="/assets/om_ded.png" 
                    alt="3rd Place" 
                    className="w-16 h-16 object-contain"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/assets/button.png' }}
                  />
                  <div className="absolute -top-2 -right-2 bg-orange-300 border-2 border-orange-600 w-6 h-6 flex items-center justify-center text-xs font-bold font-minecraft">3</div>
                </div>
                <div className="bg-orange-200 border-2 border-orange-600 px-3 py-1 text-center min-w-[100px] mb-2">
                  <div className="text-sm font-bold font-minecraft">{podium[2]?.name || '-'}</div>
                  <div className="text-xs font-minecraft">{podium[2]?.exp?.toLocaleString() || 0} EXP</div>
                </div>
                {/* Brown podium - shortest */}
                <div className="w-20 h-16 bg-amber-700 border-2 border-amber-900"></div>
              </div>

              {/* 1st Place - Yellow podium (center) */}
              <div className="flex flex-col items-center mx-4">
                <div className="relative mb-2">
                  <img 
                    src="/assets/om_ded.png" 
                    alt="1st Place" 
                    className="w-16 h-16 object-contain"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/assets/button.png' }}
                  />
                  <div className="absolute -top-2 -right-2 bg-yellow-400 border-2 border-yellow-600 w-7 h-7 flex items-center justify-center text-xs font-bold font-minecraft">1</div>
                </div>
                <div className="bg-yellow-300 border-2 border-yellow-600 px-3 py-1 text-center min-w-[100px] mb-2">
                  <div className="text-sm font-bold font-minecraft">{podium[0]?.name || '-'}</div>
                  <div className="text-xs font-minecraft">{podium[0]?.exp?.toLocaleString() || 0} EXP</div>
                </div>
                {/* Yellow podium - tallest */}
                <div className="w-20 h-24 bg-yellow-500 border-2 border-yellow-700"></div>
              </div>

              {/* 2nd Place - Silver podium (right) */}
              <div className="flex flex-col items-center ml-4">
                <div className="relative mb-2">
                  <img 
                    src="/assets/om_ded.png" 
                    alt="2nd Place" 
                    className="w-16 h-16 object-contain"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/assets/button.png' }}
                  />
                  <div className="absolute -top-2 -right-2 bg-gray-300 border-2 border-gray-600 w-6 h-6 flex items-center justify-center text-xs font-bold font-minecraft">2</div>
                </div>
                <div className="bg-gray-300 border-2 border-gray-600 px-3 py-1 text-center min-w-[100px] mb-2">
                  <div className="text-sm font-bold font-minecraft">{podium[1]?.name || '-'}</div>
                  <div className="text-xs font-minecraft">{podium[1]?.exp?.toLocaleString() || 0} EXP</div>
                </div>
                {/* Silver podium - medium height */}
                <div className="w-20 h-20 bg-gray-400 border-2 border-gray-600"></div>
              </div>
            </div>
          </div>

          {/* Right Column - Leaderboard List */}
          <div className="bg-white border-4 border-gray-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 font-minecraft">Top 10 Players</h2>
            
            {/* Leaderboard Table */}
            <div className="space-y-2 mb-6">
              {rankedData.slice(0, 10).map((entry) => (
                <div 
                  key={entry.id}
                  className="flex items-center justify-between p-3 border-2 border-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-800 text-white flex items-center justify-center text-sm font-bold font-minecraft border-2 border-gray-600">
                      {entry.rank}
                    </div>
                    <div className="flex flex-col">
                      <div className="font-bold text-gray-900 font-minecraft">{entry.name}</div>
                      <div className={`text-xs px-2 py-1 border-2 font-minecraft font-bold ${getRoleColor(entry.role)}`}>
                        {roleNames[entry.role as keyof typeof roleNames]}
                      </div>
                    </div>
                  </div>
                  <div className="font-bold text-gray-900 font-minecraft">
                    {entry.exp.toLocaleString()} EXP
                  </div>
                </div>
              ))}
            </div>

            {/* Current User Ranking - always shows user's rank within their own role */}
            {currentUserData && (
              <div className="border-t-4 border-gray-800 pt-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4 font-minecraft">Your Ranking (Role: {roleNames[currentUserData.role as keyof typeof roleNames]})</h3>
                <div className="flex items-center justify-between p-4 border-4 border-orange-600 bg-orange-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-600 text-white flex items-center justify-center text-sm font-bold font-minecraft border-2 border-orange-800">
                      {userRankWithinRole || 'N/A'}
                    </div>
                    <div className="flex flex-col">
                      <div className="font-bold text-gray-900 font-minecraft">{currentUserData.name}</div>
                      <div className={`text-xs px-2 py-1 border-2 font-minecraft font-bold ${getRoleColor(currentUserData.role)}`}>
                        {roleNames[currentUserData.role as keyof typeof roleNames]}
                      </div>
                    </div>
                  </div>
                  <div className="font-bold text-gray-900 font-minecraft">
                    {currentUserData.exp.toLocaleString()} EXP
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}