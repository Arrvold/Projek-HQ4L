'use client'

interface CharacterInfoProps {
  userRole: string
  onRoleChange: (roleId: string) => void
}

interface RoleExp {
  id: string
  name: string
  badge: string
  currentExp: number
  maxExp: number
  level: number
}

export default function CharacterInfo({ userRole, onRoleChange }: CharacterInfoProps) {
  // Data exp untuk setiap role
  const roleExpData: RoleExp[] = [
    {
      id: 'codes',
      name: 'Codes',
      badge: '/assets/badge_code.png',
      currentExp: 250,
      maxExp: 500,
      level: 2
    },
    {
      id: 'sports',
      name: 'Sports',
      badge: '/assets/badge_sports.png',
      currentExp: 150,
      maxExp: 300,
      level: 1
    },
    {
      id: 'arts',
      name: 'Arts',
      badge: '/assets/badge_art.png',
      currentExp: 400,
      maxExp: 500,
      level: 3
    },
    {
      id: 'traveler',
      name: 'Traveler',
      badge: '/assets/badge_explorer.png',
      currentExp: 75,
      maxExp: 200,
      level: 1
    },
    {
      id: 'literature',
      name: 'Literature',
      badge: '/assets/badge_literature.png',
      currentExp: 300,
      maxExp: 400,
      level: 2
    }
  ]

  const handleProfileClick = () => {
    window.location.href = '/profile'
  }

  const handleRoleChange = (roleId: string) => {
    if (roleId !== userRole) {
      onRoleChange(roleId)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6 font-minecraft">
        Karakter Info
      </h2>
      
      {/* Character Icon dan Attribute List - Layout Horizontal */}
      <div className="flex items-start space-x-6 mb-6">
        {/* Character Icon/Avatar - Kiri */}
        <div className="flex-shrink-0">
          <img 
            src="https://freeweb3.infura-ipfs.io/ipfs/Qmbhu7Yj2osW5BRaYAwCGF8s9aMcAHYTGY1GPS6VnjRKpe" 
            alt="Character" 
            className="w-48 h-48 rounded-full"
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/192x192?text=Character'
            }}
          />
        </div>
        
        {/* Attribute List - Kanan */}
        <div className="flex-1 space-y-3">
          {roleExpData.map((role) => {
            const expPercentage = (role.currentExp / role.maxExp) * 100
            const isCurrentRole = role.id === userRole
            
            return (
              <div 
                key={role.id}
                className={`p-3 border rounded-lg ${
                  isCurrentRole 
                    ? 'border-orange-500 bg-orange-50' 
                    : 'border-gray-200 bg-white'
                } cursor-pointer`}
                onClick={() => handleRoleChange(role.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {/* Badge */}
                    <div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 hover:scale-110 transition-transform ${
                        isCurrentRole ? '' : ''
                      }`}
                      title={`Ganti ke role ${role.name}`}
                    >
                      <img 
                        src={role.badge} 
                        alt={`${role.name} Badge`}
                        className="w-6 h-6 object-contain"
                      />
                    </div>
                    
                    {/* Role Name */}
                    <div>
                      <h4 className={`font-semibold text-sm font-minecraft ${
                        isCurrentRole ? 'text-orange-700' : 'text-gray-900'
                      }`}>
                        {role.name}
                        {isCurrentRole && (
                          <span className="ml-2 text-xs bg-orange-500 text-white px-2 py-1 rounded-full">
                            Active
                          </span>
                        )}
                      </h4>
                      <div className="text-xs text-gray-600 font-minecraft py-2">
                        Level {role.level} • {role.currentExp}/{role.maxExp} EXP
                      </div>
                    </div>
                  </div>
                  
                  {/* Exp Bar */}
                  <div className="w-20">
                    <img 
                      src={expPercentage === 0 ? '/assets/bar0.png' : 
                           expPercentage <= 25 ? '/assets/bar25.png' :
                           expPercentage <= 50 ? '/assets/bar50.png' :
                           expPercentage <= 75 ? '/assets/bar75.png' : '/assets/bar100.png'}
                      alt={`${Math.round(expPercentage)}% EXP`}
                      className="w-full h-2 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/80x8?text=EXP+Bar'
                      }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    
    </div>
  )
}
