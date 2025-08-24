'use client'

import { Calendar, MapPin, Users, Star } from 'lucide-react'

const events = [
  {
    id: 1,
    title: 'RPG Championship 2024',
    description: 'Kompetisi RPG terbesar tahun ini! Bergabunglah dengan ribuan pemain dari seluruh dunia dalam pertarungan epik untuk gelar Champion. Hadiah total jutaan rupiah menanti para pemenang.',
    date: '15-17 Desember 2024',
    location: 'Jakarta Convention Center',
    participants: '1000+',
    rating: '4.9',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80'
  },
]

export default function Events() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 font-minecraft">
            Events
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-minecraft">
            Ikuti berbagai event seru yang akan menguji kemampuan RPG-mu!
          </p>
        </div>
        
        <div className="space-y-8">
          {events.map((event) => (
            <div key={event.id} className="bg-white shadow-lg overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Gambar Event - Bagian Kiri */}
                <div className="relative h-64 lg:h-full">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full font-semibold text-sm">
                    Featured
                  </div>
                </div>
                
                {/* Keterangan Event - Bagian Kanan dengan Background Image */}
                <div 
                  className="relative p-8 flex flex-col justify-center bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: "url('/assets/event-bg.webp')" }}
                >
                  {/* Overlay untuk memastikan teks tetap terbaca */}
                  <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                  
                  {/* Content dengan z-index */}
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold text-white mb-4 font-minecraft">
                      {event.title}
                    </h3>
                    
                    <p className="text-gray-200 mb-6 leading-relaxed font-minecraft">
                      {event.description}
                    </p>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-gray-200">
                        <Calendar className="w-5 h-5 mr-3 text-yellow-400" />
                        <span className="font-minecraft">{event.date}</span>
                      </div>
                      <div className="flex items-center text-gray-200">
                        <MapPin className="w-5 h-5 mr-3 text-yellow-400" />
                        <span className="font-minecraft">{event.location}</span>
                      </div>
                      <div className="flex items-center text-gray-200">
                        <Users className="w-5 h-5 mr-3 text-yellow-400" />
                        <span className="font-minecraft">{event.participants} Peserta</span>
                      </div>
                      <div className="flex items-center text-gray-200">
                        <Star className="w-5 h-5 mr-3 text-yellow-400 fill-current" />
                        <span className="font-minecraft">Rating: {event.rating}/5.0</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-6 rounded-lg transition-colors font-minecraft">
                        Daftar Sekarang
                      </button>
                      <button className="border-2 border-white hover:bg-white hover:text-gray-900 text-white font-medium py-3 px-6 rounded-lg transition-colors font-minecraft">
                        Detail Event
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <button className="bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 px-8 rounded-lg transition-colors text-lg font-minecraft">
            Lihat Semua Events
          </button>
        </div>
      </div>
    </section>
  )
}
