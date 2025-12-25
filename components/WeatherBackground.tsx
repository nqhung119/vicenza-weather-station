'use client'

import { useEffect, useState, memo } from 'react'
import { getTimeOfDay, getTimeTheme, getCombinedBackground } from '@/lib/timeTheme'

interface WeatherBackgroundProps {
  condition: string
  isDay?: boolean // Deprecated - now uses real-time
}

function WeatherBackground({ condition }: WeatherBackgroundProps) {
  const [weatherType, setWeatherType] = useState('clear')
  const [currentTime, setCurrentTime] = useState(new Date())
  const timeTheme = getTimeTheme(getTimeOfDay(currentTime.getHours()))

  // List of conditions to map
  // 'Thunderstorm': 'Dông bão'
  // 'Drizzle': 'Mưa phùn'
  // 'Rain': 'Mưa'
  // 'Snow': 'Tuyết'
  // 'Mist': 'Sương mù'
  // 'Smoke': 'Khói'
  // 'Haze': 'Sương mù nhẹ'
  // 'Dust': 'Bụi'
  // 'Fog': 'Sương mù'
  // 'Sand': 'Cát'
  // 'Ash': 'Tro'
  // 'Squall': 'Giông tố'
  // 'Tornado': 'Lốc xoáy'
  // 'Clear': 'Trời quang'
  // 'Clouds': 'Có mây'

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000) // Update every minute
    
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!condition) return
    const c = condition.toLowerCase()
    
    // Exact mapping for the requested list
    if (c.includes('thunder') || c.includes('storm')) setWeatherType('thunderstorm')
    else if (c.includes('drizzle')) setWeatherType('drizzle')
    else if (c.includes('rain')) setWeatherType('rain')
    else if (c.includes('snow')) setWeatherType('snow')
    else if (c.includes('mist')) setWeatherType('mist')
    else if (c.includes('smoke')) setWeatherType('smoke')
    else if (c.includes('haze')) setWeatherType('haze')
    else if (c.includes('dust')) setWeatherType('dust')
    else if (c.includes('fog')) setWeatherType('fog')
    else if (c.includes('sand')) setWeatherType('sand')
    else if (c.includes('ash')) setWeatherType('ash')
    else if (c.includes('squall')) setWeatherType('squall')
    else if (c.includes('tornado')) setWeatherType('tornado')
    else if (c.includes('clouds')) setWeatherType('clouds')
    else setWeatherType('clear') // Default to clear
  }, [condition])

  // Helper to determine active background classes (now combined with time theme)
  const getGradient = () => {
    return getCombinedBackground(weatherType, timeTheme)
  }

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* 1. Base Gradient Layer - Smoother transition */}
      <div 
        className="absolute inset-0 transition-all duration-1000"
        style={{
          background: `linear-gradient(to bottom right, 
            ${timeTheme.period === 'noon' ? 'rgb(34, 211, 238), rgb(14, 165, 233), rgb(59, 130, 246)' :
            timeTheme.period === 'morning' ? 'rgb(253, 224, 71), rgb(147, 197, 253), rgb(56, 189, 248)' :
            timeTheme.period === 'dawn' ? 'rgb(249, 115, 22), rgb(244, 114, 182), rgb(253, 224, 71)' :
            timeTheme.period === 'afternoon' ? 'rgb(251, 146, 60), rgb(239, 68, 68), rgb(236, 72, 153)' :
            timeTheme.period === 'evening' ? 'rgb(67, 56, 202), rgb(88, 28, 135), rgb(30, 41, 59)' :
            'rgb(15, 23, 42), rgb(30, 27, 75), rgb(0, 0, 0)'})`,
        }}
      />

      {/* 2. Visual Effects Layer */}
      
      {/* --- RAIN / THUNDERSTORM / DRIZZLE / SQUALL --- */}
      {(['rain', 'thunderstorm', 'drizzle', 'squall', 'tornado'].includes(weatherType)) && (
        <>
          {/* Dark Clouds Layer */}
          <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] opacity-40 animate-drift-slow">
            <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800 via-transparent to-transparent"></div>
          </div>
          
          {/* Rain Drops */}
          <div className="absolute inset-0 opacity-40 rain-container">
             {[...Array(weatherType === 'drizzle' ? 30 : 80)].map((_, i) => (
               <div 
                 key={i} 
                 className={`absolute bg-white/40 animate-rain ${weatherType === 'drizzle' ? 'w-[1px] h-4' : 'w-[2px] h-8'}`}
                 style={{
                   left: `${Math.random() * 100}%`,
                   animationDuration: `${(weatherType === 'drizzle' ? 1 : 0.5) + Math.random() * 0.5}s`,
                   animationDelay: `${Math.random() * 2}s`
                 }} 
               />
             ))}
          </div>

          {/* Lightning (Thunderstorm only) */}
          {(weatherType === 'thunderstorm' || weatherType === 'squall') && (
            <div className="absolute inset-0 bg-white opacity-0 animate-lightning z-10"></div>
          )}
        </>
      )}

      {/* --- SNOW --- */}
      {weatherType === 'snow' && (
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full opacity-80 animate-snow"
              style={{
                width: `${Math.random() * 6 + 2}px`,
                height: `${Math.random() * 6 + 2}px`,
                left: `${Math.random() * 100}%`,
                animationDuration: `${3 + Math.random() * 5}s`,
                animationDelay: `${Math.random() * 5}s`
              }}
            />
          ))}
        </div>
      )}

      {/* --- CLOUDS / CLEAR --- */}
      {(weatherType === 'clear' || weatherType === 'clouds') && (
        <>
          {/* Sun / Moon / Light Source - Based on time */}
          {(timeTheme.period === 'night' || timeTheme.period === 'evening') ? (
            // Moon for night/evening - Circular with soft glow
            <div 
              className="absolute rounded-full"
              style={{
                width: '400px',
                height: '400px',
                top: timeTheme.sunMoonPosition.top,
                right: timeTheme.sunMoonPosition.right,
                transform: 'translate(50%, -50%)',
                background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 30%, transparent 70%)',
                filter: 'blur(60px)',
                opacity: timeTheme.sunMoonPosition.opacity,
                animation: 'pulse-slow 8s ease-in-out infinite',
              }}
            />
          ) : (
            // Sun for day - Circular with natural glow
            <div 
              className="absolute rounded-full"
              style={{
                width: timeTheme.period === 'noon' ? '500px' : '450px',
                height: timeTheme.period === 'noon' ? '500px' : '450px',
                top: timeTheme.sunMoonPosition.top,
                right: timeTheme.sunMoonPosition.right,
                transform: 'translate(50%, -50%)',
                background: timeTheme.period === 'dawn' 
                  ? 'radial-gradient(circle at center, rgba(251, 146, 60, 0.4) 0%, rgba(244, 114, 182, 0.25) 25%, rgba(253, 224, 71, 0.15) 50%, transparent 70%)'
                  : timeTheme.period === 'morning'
                  ? 'radial-gradient(circle at center, rgba(254, 240, 138, 0.5) 0%, rgba(254, 249, 195, 0.3) 30%, rgba(254, 240, 138, 0.15) 50%, transparent 70%)'
                  : timeTheme.period === 'noon'
                  ? 'radial-gradient(circle at center, rgba(254, 240, 138, 0.6) 0%, rgba(254, 249, 195, 0.35) 25%, rgba(254, 240, 138, 0.2) 45%, transparent 70%)'
                  : 'radial-gradient(circle at center, rgba(251, 146, 60, 0.5) 0%, rgba(239, 68, 68, 0.3) 30%, rgba(251, 146, 60, 0.15) 50%, transparent 70%)',
                filter: 'blur(50px)',
                opacity: timeTheme.sunMoonPosition.opacity,
                animation: 'pulse-slow 8s ease-in-out infinite',
                boxShadow: timeTheme.period === 'noon' 
                  ? '0 0 200px rgba(254, 240, 138, 0.3), 0 0 300px rgba(254, 240, 138, 0.2)'
                  : '0 0 150px rgba(251, 146, 60, 0.2), 0 0 250px rgba(251, 146, 60, 0.15)',
              }}
            />
          )}
          
          {/* Beautiful Fluffy Clouds (CSS Shapes) - Only show during day */}
          {timeTheme.clouds && [...Array(weatherType === 'clouds' ? 8 : 3)].map((_, i) => (
             <div 
               key={i}
               className={`absolute blur-xl rounded-full animate-drift-cloud ${
                 timeTheme.period === 'night' ? 'bg-white/5' :
                 timeTheme.period === 'evening' ? 'bg-white/10' :
                 'bg-white/20'
               }`}
               style={{
                 width: `${200 + Math.random() * 300}px`,
                 height: `${100 + Math.random() * 100}px`,
                 top: `${Math.random() * 60}%`,
                 left: `${-20}%`, // Start off-screen
                 animationDuration: `${20 + Math.random() * 40}s`,
                 animationDelay: `${i * 5}s`
               }}
             />
          ))}
        </>
      )}

      {/* Stars for night/evening */}
      {timeTheme.stars && (
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className={`absolute bg-white rounded-full ${
                timeTheme.period === 'night' ? 'opacity-80' : 'opacity-40'
              } animate-twinkle`}
              style={{
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDuration: `${2 + Math.random() * 3}s`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
          {/* Some brighter stars */}
          {[...Array(10)].map((_, i) => (
            <div
              key={`bright-${i}`}
              className={`absolute bg-white rounded-full ${
                timeTheme.period === 'night' ? 'opacity-100' : 'opacity-60'
              } animate-twinkle`}
              style={{
                width: `${Math.random() * 2 + 2}px`,
                height: `${Math.random() * 2 + 2}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDuration: `${3 + Math.random() * 2}s`,
                animationDelay: `${Math.random() * 3}s`,
                boxShadow: '0 0 4px white'
              }}
            />
          ))}
        </div>
      )}

      {/* --- FOG / MIST / HAZE / SMOKE / DUST / SAND / ASH --- */}
      {['fog', 'mist', 'haze', 'smoke', 'dust', 'sand', 'ash'].includes(weatherType) && (
        <div className="absolute inset-0 overflow-hidden">
           {/* Drifting Fog Layers */}
           <div className={`absolute inset-0 bg-gradient-to-r ${weatherType === 'dust' || weatherType === 'sand' ? 'from-orange-300/20 to-yellow-300/20' : 'from-white/10 to-transparent'} animate-mist-1`}></div>
           <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent animate-mist-2 mix-blend-overlay"></div>
        </div>
      )}

      <style jsx>{`
        /* Animations */
        @keyframes rain {
          from { transform: translateY(-100px); }
          to { transform: translateY(110vh); }
        }
        .animate-rain { animation: rain linear infinite; }

        @keyframes snow {
          from { transform: translateY(-20px) translateX(-10px); }
          to { transform: translateY(110vh) translateX(20px); }
        }
        .animate-snow { animation: snow linear infinite; }

        @keyframes lightning {
            0%, 90%, 100% { opacity: 0; }
            92% { opacity: 0.3; }
            93% { opacity: 0; }
            94% { opacity: 0.5; }
            96% { opacity: 0; }
        }
        .animate-lightning { animation: lightning 6s infinite; }

        @keyframes drift-cloud {
            from { transform: translateX(-50vw); opacity: 0; }
            10% { opacity: 0.8; }
            90% { opacity: 0.8; }
            to { transform: translateX(120vw); opacity: 0; }
        }
        .animate-drift-cloud { animation-timing-function: linear; animation-iteration-count: infinite; }

        @keyframes pulse-slow {
            0%, 100% { transform: scale(1); opacity: 0.6; }
            50% { transform: scale(1.1); opacity: 0.8; }
        }
        .animate-pulse-slow { animation: pulse-slow 8s ease-in-out infinite; }
        
        @keyframes mist-1 {
            0% { transform: translateX(0); opacity: 0.3; }
            50% { transform: translateX(20px); opacity: 0.5; }
            100% { transform: translateX(0); opacity: 0.3; }
        }
        .animate-mist-1 { animation: mist-1 10s ease-in-out infinite; }

        @keyframes mist-2 {
            0% { transform: translateX(0); opacity: 0.2; }
            50% { transform: translateX(-30px); opacity: 0.4; }
            100% { transform: translateX(0); opacity: 0.2; }
        }
        .animate-mist-2 { animation: mist-2 15s ease-in-out infinite alternate; }

        @keyframes twinkle {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.2); }
        }
        .animate-twinkle { animation: twinkle ease-in-out infinite; }
      `}</style>
    </div>
  )
}

export default memo(WeatherBackground)
