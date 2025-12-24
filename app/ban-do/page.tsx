'use client'

import Header from '@/components/Header'
import WeatherBackground from '@/components/WeatherBackground'
import dynamic from 'next/dynamic'

// Dynamically import Map to avoid SSR issues with Leaflet
const Map = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-white/5 rounded-2xl animate-pulse">
      <p className="text-white/50">Đang tải bản đồ...</p>
    </div>
  ),
})

export default function MapPage() {
  // Hardcoded for now, ideal to share state
  const condition = 'Clouds' 

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <WeatherBackground condition={condition} />

      <div className="relative z-10 p-6 md:p-8 lg:p-12 h-screen flex flex-col">
        <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col">
          <Header />
          
          <div className="flex-1 mt-8 glass-strong rounded-3xl p-1 overflow-hidden border border-white/20 shadow-2xl shadow-black/20">
             <div className="w-full h-full rounded-[20px] overflow-hidden relative">
                <Map />
             </div>
          </div>
        </div>
      </div>
    </main>
  )
}
