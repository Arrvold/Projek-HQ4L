'use client'

import { useState } from 'react'
import { useAuth } from '../lib/AuthContext'

// Tipe Quest sesuai backend candid/declarations
export interface Quest {
  id: bigint
  title: string
  description: string
  coin_reward: bigint
  exp_reward: bigint
  stamina_cost: bigint
  status: { OnProgress: null } | { Completed: null } | { Failed: null }
  deadline: bigint
  accepted_at: bigint
}

// Props
interface QuestListProps {
  userRole: string
  quests: Quest[]
}

export default function QuestList({ userRole, quests }: QuestListProps) {
  const { actor } = useAuth()

  // State UI
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null)
  const [showQuestModal, setShowQuestModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  // State untuk efek tombol
  const [isStartPressed, setIsStartPressed] = useState(false)
  const [pressedFinishQuestId, setPressedFinishQuestId] = useState<bigint | null>(null)

  // Ambil quest harian dari backend
  const handleAcceptQuest = async () => {
    if (!actor) return
    setIsSubmitting(true)
    setError('')
    try {
      const result = await actor.acceptQuest(
        'Misi Harian',
        `Selesaikan tugas harian untuk role ${userRole}.`,
        BigInt(10),
        BigInt(25),
        BigInt(50)
      )
      if (!result.ok) {
        const errKey = Object.keys(result.err)[0]
        setError(`Gagal mengambil quest: ${errKey}`)
      }
    } catch (e) {
      console.error('Accept quest failed:', e)
      setError('Terjadi kesalahan saat mengambil quest.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Selesaikan quest
  const handleCompleteQuest = async (questId: bigint) => {
    if (!actor) return
    setIsSubmitting(true)
    setError('')
    try {
      const result = await actor.completeQuest(questId)
      if (result.ok) {
        setShowQuestModal(false)
      } else {
        setError(result.err || 'Gagal menyelesaikan quest.')
      }
    } catch (e) {
      console.error('Complete quest failed:', e)
      setError('Terjadi kesalahan koneksi.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Filter quest
  const onProgressQuests = quests.filter((q) => 'OnProgress' in q.status)
  const completedQuests = quests.filter((q) => 'Completed' in q.status)

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6 font-minecraft">
        Daftar Quest - {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
      </h2>

      {error && (
        <p className="text-red-500 bg-red-100 p-2 rounded mb-4 font-minecraft">
          {error}
        </p>
      )}

      <div className="space-y-4">
        {/* Tombol Ambil Quest (pakai asset gambar) */}
        <div
          className="cursor-pointer transition-all duration-200 hover:opacity-80 p-5 h-24 flex items-end"
          onClick={handleAcceptQuest}
          onMouseDown={() => setIsStartPressed(true)}
          onMouseUp={() => setIsStartPressed(false)}
          onMouseLeave={() => setIsStartPressed(false)}
        >
          <img
            src={
              onProgressQuests.length === 0
                ? isStartPressed
                  ? '/assets/start_quest_btn_pressed.png'
                  : '/assets/start_quest_btn_normal.png'
                : isStartPressed
                ? '/assets/add_quest_btn_pressed.png'
                : '/assets/add_quest_btn_normal.png'
            }
            alt="Ambil Quest"
            className="w-56 mx-auto"
          />
        </div>

        {/* Label On Progress */}
        <div className="pt-2">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide font-minecraft">
            On Progress
          </h3>
        </div>

        {/* List quest on progress */}
        {onProgressQuests.length === 0 && (
          <div className="p-4 border rounded-lg border-gray-200 bg-white text-gray-500 text-sm font-minecraft">
            Tidak ada quest yang sedang berjalan.
          </div>
        )}

        {onProgressQuests.map((quest) => (
          <div
            key={String(quest.id)}
            className="p-4 border border-orange-500 bg-orange-50 rounded-lg cursor-pointer hover:shadow-md transition-all"
            onClick={() => {
              setSelectedQuest(quest)
              setShowQuestModal(true)
            }}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-orange-700 font-minecraft mb-2">
                  {quest.title}
                  <span className="ml-2 text-sm bg-orange-500 text-white px-2 py-1 rounded-full">
                    Active
                  </span>
                </h3>
                <p className="text-gray-600 text-sm mb-3 font-minecraft truncate">
                  {quest.description}
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-500 font-minecraft">
                  <div className="flex items-center space-x-1">
                    <img src="/assets/koin.png" alt="Coins" className="w-4 h-4" />
                    <span>{String(quest.coin_reward)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>⭐</span>
                    <span>{String(quest.exp_reward)} EXP</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <img
                      src="/assets/Stammina.png"
                      alt="Stamina"
                      className="w-4 h-4"
                    />
                    <span>{String(quest.stamina_cost)}</span>
                  </div>
                </div>
              </div>

              {/* Tombol Finish pakai asset */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleCompleteQuest(quest.id)
                }}
                onMouseDown={() => setPressedFinishQuestId(quest.id)}
                onMouseUp={() => setPressedFinishQuestId(null)}
                onMouseLeave={() => setPressedFinishQuestId(null)}
                className="inline-block"
              >
                <img
                  src={
                    pressedFinishQuestId === quest.id
                      ? '/assets/finish_btn_pressed.png'
                      : '/assets/finish_btn_normal.png'
                  }
                  alt="Tandai Selesai"
                  className="max-h-8 hover:opacity-80 transition-opacity"
                />
              </button>
            </div>
          </div>
        ))}

        {/* Label Completed */}
        <div className="pt-2">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide font-minecraft">
            Selesai
          </h3>
        </div>

        {completedQuests.map((quest) => (
          <div
            key={String(quest.id)}
            className="p-4 border border-green-500 bg-green-50 rounded-lg opacity-70"
          >
            <h3 className="font-semibold text-green-700 font-minecraft line-through">
              {quest.title}
            </h3>
          </div>
        ))}
      </div>

      {/* Modal Detail Quest */}
      {showQuestModal && selectedQuest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => setShowQuestModal(false)}
          ></div>

          <div className="relative bg-white rounded-2xl shadow-2xl mx-4 w-full max-w-2xl p-6">
            <h3 className="text-2xl font-bold mb-4 font-minecraft">
              {selectedQuest.title}
            </h3>
            <p className="text-gray-700 mb-6 leading-relaxed font-minecraft">
              {selectedQuest.description}
            </p>

            {/* Detail reward */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-3 bg-yellow-100 rounded-lg">
                <img
                  src="/assets/koin.png"
                  alt="Coins"
                  className="w-8 h-8 mx-auto mb-1"
                />
                <div className="font-semibold text-gray-900 font-minecraft">
                  {String(selectedQuest.coin_reward)}
                </div>
                <div className="text-sm text-gray-600 font-minecraft">Coins</div>
              </div>
              <div className="text-center p-3 bg-blue-100 rounded-lg">
                <div className="text-2xl mb-1">⭐</div>
                <div className="font-semibold text-gray-900 font-minecraft">
                  {String(selectedQuest.exp_reward)}
                </div>
                <div className="text-sm text-gray-600 font-minecraft">EXP</div>
              </div>
              <div className="text-center p-3 bg-red-100 rounded-lg">
                <img
                  src="/assets/Stammina.png"
                  alt="Stamina"
                  className="w-8 h-8 mx-auto mb-1"
                />
                <div className="font-semibold text-gray-900 font-minecraft">
                  {String(selectedQuest.stamina_cost)}
                </div>
                <div className="text-sm text-gray-600 font-minecraft">Stamina</div>
              </div>
            </div>

            <button
              onClick={() => setShowQuestModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
