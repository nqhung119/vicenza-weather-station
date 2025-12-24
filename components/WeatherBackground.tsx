'use client'

import { useEffect, useState } from 'react'

interface WeatherBackgroundProps {
  condition: string
  isDay?: boolean
}

export default function WeatherBackground({ condition, isDay = true }: WeatherBackgroundProps) {
  const [weatherType, setWeatherType] = useState('clear')

  useEffect(() => {
    // Map API condition to internal types
    if (!condition) return
    const c = condition.toLowerCase()
    
    if (c.includes('rain') || c.includes('drizzle')) setWeatherType('rain')
    else if (c.includes('storm') || c.includes('thunder')) setWeatherType('storm')
    else if (c.includes('snow') || c.includes('sleet')) setWeatherType('snow')
    else if (c.includes('cloud')) setWeatherType('clouds')
    else if (c.includes('fog') || c.includes('mist') || c.includes('haze')) setWeatherType('fog')
    else if (c.includes('clear')) setWeatherType('clear')
    else setWeatherType('clear')
  }, [condition])

  return (
    <div className="fixed inset-0 z-0 transition-opacity duration-1000 ease-in-out">
      {/* Base Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-b transition-colors duration-1000
        ${weatherType === 'storm' ? 'from-slate-900 via-slate-800 to-indigo-950' : ''}
        ${weatherType === 'rain' ? 'from-slate-800 via-slate-700 to-blue-900' : ''}
        ${weatherType === 'clouds' ? 'from-slate-700 via-slate-600 to-slate-800' : ''}
        ${weatherType === 'clear' ? 'from-blue-500 via-blue-400 to-blue-600' : ''}
        ${weatherType === 'fog' ? 'from-stone-600 via-stone-500 to-stone-700' : ''}
        ${weatherType === 'snow' ? 'from-slate-200 via-slate-300 to-blue-200' : ''}
      `} />

      {/* Overlay Effects */}
      
      {/* 1. Storm / Rain Clouds base */}
      {(weatherType === 'storm' || weatherType === 'rain') && (
        <div className="absolute inset-0 opacity-40">
           <div className="absolute top-[-20%] left-[-10%] w-[120%] h-[60%] bg-slate-950 rounded-full blur-[100px] opacity-60"></div>
        </div>
      )}

      {/* 2. Clear Sky Sun/Glow */}
      {weatherType === 'clear' && (
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-radial from-yellow-300/30 to-transparent blur-3xl opacity-60 transform translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute top-20 right-20 w-32 h-32 bg-yellow-100 rounded-full blur-2xl opacity-80"></div>
        </div>
      )}

      {/* 3. Rain Animation */}
      {(weatherType === 'rain' || weatherType === 'storm') && (
        <div className="absolute inset-0 opacity-30 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
               className="absolute w-[2px] h-20 bg-blue-200/50 animate-rain"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-100px`,
                animationDuration: `${0.5 + Math.random() * 0.5}s`,
                animationDelay: `${Math.random() * 2}s`
              }}
            ></div>
          ))}
        </div>
      )}

      {/* 4. Clouds Animation (Moving fog/clouds) */}
      {(weatherType === 'clouds' || weatherType === 'fog' || weatherType === 'rain' || weatherType === 'storm') && (
        <div className="absolute inset-0 opacity-50 overflow-hidden">
           <div className="absolute top-1/2 left-0 w-full h-full bg-slate-400/10 blur-[80px] rounded-full transform -translate-y-1/2 animate-drift-slow"></div>
           <div className="absolute bottom-0 right-0 w-[150%] h-full bg-slate-300/5 blur-[100px] rounded-full transform translate-y-1/2 animate-drift-reverse"></div>
        </div>
      )}
      
      {/* 5. Thunder/Lightning (Flash) */}
      {weatherType === 'storm' && (
        <div className="absolute inset-0 bg-white opacity-0 animate-lightning"></div>
      )}

      <style jsx>{`
        @keyframes rain {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        .animate-rain {
          animation: rain linear infinite;
        }
        @keyframes drift {
          0% { transform: translate(-10%, -50%); }
          50% { transform: translate(10%, -50%); }
          100% { transform: translate(-10%, -50%); }
        }
        .animate-drift-slow {
          animation: drift 20s ease-in-out infinite;
        }
        @keyframes drift-reverse {
          0% { transform: translate(10%, 50%); }
          50% { transform: translate(-10%, 50%); }
          100% { transform: translate(10%, 50%); }
        }
        .animate-drift-reverse {
          animation: drift-reverse 25s ease-in-out infinite;
        }
        @keyframes lightning {
          0%, 90%, 100% { opacity: 0; }
          92% { opacity: 0.1; }
          93% { opacity: 0; }
          94% { opacity: 0.2; }
          96% { opacity: 0; }
        }
        .animate-lightning {
          animation: lightning 5s infinite;
        }
      `}</style>
    </div>
  )
}
