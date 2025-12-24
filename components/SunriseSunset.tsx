'use client'

interface SunriseSunsetProps {
  data: {
    sunrise: string
    sunset: string
    currentTime: string
  }
}

export default function SunriseSunset({ data }: SunriseSunsetProps) {
  // Convert time strings to minutes for calculation
  const timeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes
  }

  const sunriseMinutes = timeToMinutes(data.sunrise)
  const sunsetMinutes = timeToMinutes(data.sunset)
  const currentMinutes = timeToMinutes(data.currentTime)
  const totalDaylight = sunsetMinutes - sunriseMinutes
  const elapsed = currentMinutes - sunriseMinutes
  const progress = Math.max(0, Math.min(1, elapsed / totalDaylight))
  const angle = progress * 180 // 0 to 180 degrees for semicircle

  const currentX = 20 + 160 * Math.sin((angle * Math.PI) / 180)
  const currentY = 100 - 80 * (1 - Math.cos((angle * Math.PI) / 180))

  return (
    <div className="glass-strong rounded-2xl p-5 md:p-6 border border-white/15 shadow-lg shadow-slate-900/40 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400/20 to-orange-500/20 border border-orange-400/30 flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4 text-orange-300"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M17 18a5 5 0 0 0-10 0" />
              <line x1="12" y1="2" x2="12" y2="9" />
              <line x1="4.22" y1="10.22" x2="5.64" y2="11.64" />
              <line x1="1" y1="18" x2="3" y2="18" />
              <line x1="21" y1="18" x2="23" y2="18" />
              <line x1="18.36" y1="11.64" x2="19.78" y2="10.22" />
              <line x1="23" y1="12" x2="21" y2="12" />
              <line x1="3" y1="12" x2="1" y2="12" />
            </svg>
          </div>
          <span className="text-white text-sm font-medium">Bình minh</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400/20 to-purple-500/20 border border-blue-400/30 flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4 text-blue-300"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
              <line x1="12" y1="3" x2="12" y2="9" />
              <line x1="12" y1="21" x2="12" y2="15" />
            </svg>
          </div>
          <span className="text-white text-sm font-medium">Hoàng hôn</span>
        </div>
      </div>

      {/* Semicircular Gauge với gradient */}
      <div className="relative h-28 md:h-32 flex items-center justify-center flex-1">
        <svg width="220" height="140" className="absolute" viewBox="0 0 220 140">
          <defs>
            <linearGradient id="sunGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(251, 146, 60, 1)" />
              <stop offset="50%" stopColor="rgba(251, 191, 36, 1)" />
              <stop offset="100%" stopColor="rgba(59, 130, 246, 1)" />
            </linearGradient>
            <linearGradient id="sunProgress" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(251, 146, 60, 0.8)" />
              <stop offset="50%" stopColor="rgba(251, 191, 36, 0.8)" />
              <stop offset="100%" stopColor="rgba(59, 130, 246, 0.8)" />
            </linearGradient>
            <filter id="sunGlow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Background arc với gradient */}
          <path
            d="M 20 120 A 90 90 0 0 1 200 120"
            fill="none"
            stroke="rgba(255, 255, 255, 0.15)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          
          {/* Progress arc với gradient */}
          {angle > 0 && (
            <path
              d={`M 20 120 A 90 90 0 ${angle > 90 ? 1 : 0} 1 ${currentX} ${currentY}`}
              fill="none"
              stroke="url(#sunProgress)"
              strokeWidth="4"
              strokeLinecap="round"
              filter="url(#sunGlow)"
            />
          )}
          
          {/* Sunrise marker với glow */}
          <circle cx="20" cy="120" r="6" fill="url(#sunGradient)" className="drop-shadow-lg" />
          <circle cx="20" cy="120" r="3" fill="rgba(251, 146, 60, 1)" />
          
          {/* Sunset marker với glow */}
          <circle cx="200" cy="120" r="6" fill="url(#sunGradient)" className="drop-shadow-lg" />
          <circle cx="200" cy="120" r="3" fill="rgba(59, 130, 246, 1)" />
          
          {/* Current position với animation */}
          {angle > 0 && (
            <g>
              <circle
                cx={currentX}
                cy={currentY}
                r="8"
                fill="rgba(255, 255, 255, 0.3)"
                className="animate-pulse"
              />
              <circle
                cx={currentX}
                cy={currentY}
                r="5"
                fill="white"
                className="drop-shadow-lg"
              />
              {/* Sun rays */}
              <g transform={`translate(${currentX}, ${currentY})`}>
                <line x1="0" y1="-12" x2="0" y2="-8" stroke="rgba(251, 191, 36, 0.8)" strokeWidth="2" strokeLinecap="round" />
                <line x1="0" y1="12" x2="0" y2="8" stroke="rgba(251, 191, 36, 0.8)" strokeWidth="2" strokeLinecap="round" />
                <line x1="-12" y1="0" x2="-8" y2="0" stroke="rgba(251, 191, 36, 0.8)" strokeWidth="2" strokeLinecap="round" />
                <line x1="12" y1="0" x2="8" y2="0" stroke="rgba(251, 191, 36, 0.8)" strokeWidth="2" strokeLinecap="round" />
                <line x1="-8.5" y1="-8.5" x2="-6" y2="-6" stroke="rgba(251, 191, 36, 0.8)" strokeWidth="2" strokeLinecap="round" />
                <line x1="8.5" y1="8.5" x2="6" y2="6" stroke="rgba(251, 191, 36, 0.8)" strokeWidth="2" strokeLinecap="round" />
                <line x1="8.5" y1="-8.5" x2="6" y2="-6" stroke="rgba(251, 191, 36, 0.8)" strokeWidth="2" strokeLinecap="round" />
                <line x1="-8.5" y1="8.5" x2="-6" y2="6" stroke="rgba(251, 191, 36, 0.8)" strokeWidth="2" strokeLinecap="round" />
              </g>
            </g>
          )}
        </svg>
      </div>

      <div className="flex justify-between mt-4">
        <div className="text-center">
          <div className="text-white/90 text-sm font-semibold mb-0.5">{data.sunrise}</div>
          <div className="text-white/50 text-xs">Bình minh</div>
        </div>
        <div className="text-center">
          <div className="text-white/90 text-sm font-semibold mb-0.5">{data.sunset}</div>
          <div className="text-white/50 text-xs">Hoàng hôn</div>
        </div>
      </div>
    </div>
  )
}

