'use client'

const roles = [
  {
    id: 'codes',
    name: 'Codes',
    badge: '/assets/badge_code.png',
    color: 'bg-blue-500',
    hoverColor: 'hover:bg-blue-600'
  },
  {
    id: 'sports',
    name: 'Sports',
    badge: '/assets/badge_sports.png',
    color: 'bg-green-500',
    hoverColor: 'hover:bg-green-600'
  },
  {
    id: 'arts',
    name: 'Arts',
    badge: '/assets/badge_art.png',
    color: 'bg-purple-500',
    hoverColor: 'hover:bg-purple-600'
  },
  {
    id: 'traveler',
    name: 'Traveler',
    badge: '/assets/badge_explorer.png',
    color: 'bg-orange-500',
    hoverColor: 'hover:bg-orange-600'
  },
  {
    id: 'literature',
    name: 'Literature',
    badge: '/assets/badge_literature.png',
    color: 'bg-red-500',
    hoverColor: 'hover:bg-red-600'
  }
]

interface RoleCardsProps {
  onRoleSelect: (roleId: string) => void;
  selectedRole: string;
}

export default function RoleCards({ onRoleSelect, selectedRole }: RoleCardsProps) {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 font-minecraft">
            Pilih Peranmu
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-minecraft">
            Setiap peran memiliki kekuatan dan kemampuan unik. 
            Pilih yang paling sesuai dengan gaya bermainmu!
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {roles.map((role) => (
            <div 
              key={role.id}
              className={`group cursor-pointer transition-all duration-300 ${
                selectedRole === role.id ? 'scale-105' : ''
              }`}
              onClick={() => onRoleSelect(role.id)}
            >
              <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-4 group-hover:scale-110 ${
                selectedRole === role.id ? 'ring-4 ring-orange-500 ring-offset-4 rounded-xl' : ''
              }`}>
                <img 
                  src={role.badge} 
                  alt={`${role.name} Badge`}
                  className="w-24 h-24 object-contain"
                />
              </div>
              <h3 className={`text-lg font-semibold text-center transition-colors font-minecraft ${
                selectedRole === role.id ? 'text-orange-600 font-bold' : 'text-gray-900 group-hover:text-gray-700'
              }`}>
                {role.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
