'use client'

import type { SensorData } from '@/lib/mqttService'

interface CurrentWeatherProps {
  data: SensorData | null
  weather: any // Using specific type from usage would be better but 'any' allows flexibility with the new fields
}

export default function CurrentWeather({ data, weather }: CurrentWeatherProps) {
  // Prefer Sensor Data if available for Temp/Hum, otherwise API
  const displayTemp = data ? data.temp_out : weather.temp
  const displayHum = data ? data.hum_room : weather.humidity
  const displayLux = data ? data.lux : null

  const getStatusText = (t: number) => {
    if (t >= 35) return { label: 'Rất nóng', color: 'text-red-400' }
    if (t >= 30) return { label: 'Nắng nóng', color: 'text-orange-400' }
    if (t >= 25) return { label: 'Ấm áp', color: 'text-yellow-400' }
    if (t >= 18) return { label: 'Mát mẻ', color: 'text-green-400' }
    if (t >= 15) return { label: 'Se lạnh', color: 'text-teal-400' }
    return { label: 'Lạnh', color: 'text-blue-400' }
  }

  const status = getStatusText(displayTemp)

  const details = [
    { 
      label: 'Cảm giác như', 
      value: `${weather.feels_like || displayTemp}°`, 
      icon: (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      )
    },
    { 
      label: 'Độ ẩm', 
      value: `${displayHum}%`, 
      icon: (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
        </svg>
      )
    },
    { 
      label: 'Áp suất', 
      value: `${weather.pressure} hPa`, 
      icon: (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
           <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      label: 'Tầm nhìn', 
      value: `${(weather.visibility / 1000).toFixed(1)} km`, 
      icon: (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    { 
      label: 'UV Index', 
      value: weather.uvIndex, 
      icon: (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636" />
        </svg>
      )
    },
    { 
      label: 'Mây', 
      value: `${weather.clouds}%`, 
      icon: (
         <svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
           <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
         </svg>
      )
    }
  ]

  // Add sensor specific light if available
  if (displayLux !== null && displayLux !== undefined) {
    details.push({
      label: 'Ánh sáng',
      value: `${displayLux.toFixed(0)} lux`,
      icon: (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636" />
        </svg>
      )
    })
  } else {
     details.push({
      label: 'Gió',
      value: `${weather.windSpeed} m/s`,
      icon: (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
           <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
        </svg>
      )
    })
  }

  return (
    <div className="glass-strong rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl h-full flex flex-col justify-between relative overflow-hidden">
      {/* Abstract Background Decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

      {/* Top Section: Temp & Condition */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <span className={`text-sm font-bold px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm ${status.color}`}>
                {status.label}
             </span>
             <span className="text-white/60 text-sm">{weather.location}</span>
          </div>
          <div className="flex items-baseline text-white">
            <span className="text-7xl md:text-8xl font-black tracking-tighter">
              {displayTemp.toFixed(0)}°
            </span>
            <div className="ml-4 flex flex-col">
              <span className="text-xl md:text-2xl font-medium opacity-90">{weather.condition}</span>
              <span className="text-sm opacity-60 max-w-[200px] leading-tight mt-1">{weather.description}</span>
            </div>
          </div>
        </div>

        {/* High/Low Temp Badge */}
        <div className="flex flex-col items-end gap-1">
           <div className="flex items-center gap-4 text-white/90 font-medium bg-white/5 px-4 py-2 rounded-2xl border border-white/5">
             <div className="flex flex-col items-center">
                <span className="text-xs opacity-50">Thấp nhất</span>
                <span>{weather.temp_min}°</span>
             </div>
             <div className="w-px h-6 bg-white/10"></div>
             <div className="flex flex-col items-center">
                <span className="text-xs opacity-50">Cao nhất</span>
                <span>{weather.temp_max}°</span>
             </div>
           </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-white/10 w-full my-6"></div>

      {/* Bottom Section: Grid Details */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 z-10">
        {details.map((item, idx) => (
          <div key={idx} className="flex flex-col p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-2 text-white/50 mb-2">
              {item.icon}
              <span className="text-xs font-medium uppercase tracking-wider">{item.label}</span>
            </div>
            <span className="text-xl md:text-2xl font-semibold text-white">
              {item.value}
            </span>
          </div>
        ))}
      </div>
      
    </div>
  )
}

