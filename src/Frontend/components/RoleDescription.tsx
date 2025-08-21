'use client'

interface RoleDescriptionProps {
  selectedRole: string;
}

const roleDescriptions = {
  codes: {
    title: 'Codes - Master of Technology',
    description: 'Peran Codes adalah ahli teknologi yang dapat memecahkan masalah kompleks dengan logika dan algoritma. Mereka memiliki kemampuan untuk membuat tools, mengotomatisasi proses, dan memberikan solusi teknis yang inovatif. Dalam tim, Codes adalah backbone yang memastikan semua sistem berjalan dengan lancar.',
    abilities: ['Programming', 'Problem Solving', 'System Design', 'Automation', 'Debugging']
  },
  sports: {
    title: 'Sports - Champion of Physical Excellence',
    description: 'Peran Sports adalah atlet sejati yang menguasai kekuatan fisik dan ketahanan mental. Mereka memiliki stamina luar biasa, refleks cepat, dan semangat kompetitif yang tinggi. Sports membawa energi positif dan motivasi tinggi ke dalam tim, menginspirasi semua orang untuk mencapai performa terbaik.',
    abilities: ['Physical Strength', 'Endurance', 'Team Leadership', 'Strategic Thinking', 'Motivation']
  },
  arts: {
    title: 'Arts - Creator of Beauty',
    description: 'Peran Arts adalah seniman yang memiliki kreativitas tak terbatas dan kemampuan untuk mengekspresikan ide-ide kompleks melalui media visual. Mereka membawa perspektif unik dan inovasi desain yang dapat mengubah cara tim melihat dan menyelesaikan masalah.',
    abilities: ['Creativity', 'Visual Design', 'Innovation', 'Aesthetic Sense', 'Storytelling']
  },
  traveler: {
    title: 'Traveler - Explorer of New Horizons',
    description: 'Peran Traveler adalah petualang yang selalu mencari pengalaman baru dan perspektif berbeda. Mereka memiliki kemampuan adaptasi yang tinggi, pengetahuan budaya yang luas, dan semangat untuk menjelajahi hal-hal yang belum diketahui. Traveler membawa wawasan global dan fleksibilitas ke dalam tim.',
    abilities: ['Adaptability', 'Cultural Knowledge', 'Exploration', 'Flexibility', 'Global Perspective']
  },
  literature: {
    title: 'Literature - Master of Words',
    description: 'Peran Literature adalah ahli komunikasi yang dapat menyampaikan ide-ide kompleks dengan cara yang mudah dipahami. Mereka memiliki kemampuan analisis mendalam, pemikiran kritis, dan talenta untuk menulis dan berbicara yang memukau. Literature adalah jembatan yang menghubungkan semua peran dalam tim.',
    abilities: ['Communication', 'Critical Thinking', 'Writing', 'Analysis', 'Storytelling']
  }
}

export default function RoleDescription({ selectedRole }: RoleDescriptionProps) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-100 p-8 rounded-2xl shadow-lg">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-minecraft">
              {roleDescriptions[selectedRole as keyof typeof roleDescriptions].title}
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed font-minecraft">
              {roleDescriptions[selectedRole as keyof typeof roleDescriptions].description}
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center font-minecraft">
              Kemampuan Utama
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {roleDescriptions[selectedRole as keyof typeof roleDescriptions].abilities.map((ability, index) => (
                <div key={index} className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg text-center font-medium font-minecraft">
                  {ability}
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm font-minecraft">
              Klik pada role di atas untuk melihat deskripsi yang berbeda
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
