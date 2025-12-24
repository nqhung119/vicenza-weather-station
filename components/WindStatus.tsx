'use client'

interface WindStatusProps {
  data: {
    speed: number
    gusts: number[]
    history: number[]
  }
}

export default function WindStatus({ data }: WindStatusProps) {
  const maxHistory = Math.max(...data.history, 1)
  const maxGusts = Math.max(...data.gusts, 1)

  // Tạo điểm cho biểu đồ với gradient fill
  const linePoints = data.history.map((value, index) => {
    const x = (index / (data.history.length - 1)) * 200
    const y = 80 - (value / maxHistory) * 60
    return `${x},${y}`
  }).join(' ')

  const areaPoints = `${linePoints} L 200,80 L 0,80 Z`

  return (
    <div className="glass-strong rounded-2xl p-5 md:p-6 border border-white/15 shadow-lg shadow-slate-900/40 flex flex-col h-full">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 shadow-md shadow-black/20 flex items-center justify-center">
          <svg
            viewBox="0 0 24 24"
            className="w-4.5 h-4.5 text-white"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          >
            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
          </svg>
        </div>
        <h3 className="text-white text-base font-semibold">Tình trạng gió</h3>
      </div>
      
      <div className="mb-4">
        <div className="text-3xl font-bold text-white mb-1 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
          {data.speed.toFixed(2)} <span className="text-lg font-medium text-white/70">km/h</span>
        </div>
      </div>

      {/* Line Graph với gradient fill */}
      <div className="mb-4 relative flex-1 min-h-[80px]">
        <div className="h-full relative bg-white/5 rounded-lg p-2 border border-white/10">
          <svg className="w-full h-full" viewBox="0 0 200 80" preserveAspectRatio="none">
            {/* Gradient definition */}
            <defs>
              <linearGradient id="windGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(59, 130, 246, 0.4)" />
                <stop offset="100%" stopColor="rgba(59, 130, 246, 0.05)" />
              </linearGradient>
              <linearGradient id="windLine" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(147, 197, 253, 1)" />
                <stop offset="50%" stopColor="rgba(96, 165, 250, 1)" />
                <stop offset="100%" stopColor="rgba(59, 130, 246, 1)" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* Area fill */}
            <path
              d={areaPoints}
              fill="url(#windGradient)"
              opacity="0.6"
            />
            
            {/* Line với glow effect */}
            <polyline
              points={linePoints}
              fill="none"
              stroke="url(#windLine)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#glow)"
            />
            
            {/* Data points */}
            {data.history.map((value, index) => {
              const x = (index / (data.history.length - 1)) * 200
              const y = 80 - (value / maxHistory) * 60
              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="2.5"
                  fill="rgba(147, 197, 253, 1)"
                  className="drop-shadow-lg"
                />
              )
            })}
          </svg>
        </div>
      </div>

      {/* Bar Chart với gradient và glow - thiết kế mới */}
      <div className="relative mt-auto">
        <div className="flex items-end gap-2 h-20 relative">
          {data.gusts.map((value, index) => {
            const height = Math.max((value / maxGusts) * 100, 5) // Tối thiểu 5% để hiển thị
            const isHighest = value === maxGusts
            
            return (
              <div
                key={index}
                className="flex-1 relative group"
                style={{ height: '100%' }}
              >
                {/* Bar với animation và glow effect */}
                <div
                  className="w-full rounded-t-xl relative overflow-hidden transition-all duration-500 ease-out hover:scale-105"
                  style={{ 
                    height: `${height}%`,
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  {/* Main gradient bar */}
                  <div
                    className={`absolute inset-0 rounded-t-xl ${
                      isHighest 
                        ? 'bg-gradient-to-t from-cyan-500 via-blue-400 to-blue-300 shadow-lg shadow-cyan-500/40' 
                        : 'bg-gradient-to-t from-blue-600 via-blue-500 to-blue-400 shadow-md shadow-blue-500/30'
                    } border-t border-l border-r border-blue-300/40`}
                    style={{
                      boxShadow: isHighest 
                        ? '0 -4px 12px rgba(59, 130, 246, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2)' 
                        : '0 -2px 8px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
                    }}
                  >
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-white/20 rounded-t-xl"></div>
                    
                    {/* Animated shimmer */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-t-xl animate-shimmer"></div>
                  </div>
                  
                  {/* Value label on bar */}
                  {height > 20 && (
                    <div className="absolute top-1 left-1/2 transform -translate-x-1/2 text-white text-[10px] font-bold opacity-80">
                      {value.toFixed(1)}
                    </div>
                  )}
                </div>
                
                {/* Tooltip on hover */}
                <div className="absolute -top-9 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-10">
                  <div className="bg-white/25 backdrop-blur-md text-white text-xs px-2.5 py-1.5 rounded-lg border border-white/30 shadow-lg whitespace-nowrap">
                    <div className="font-semibold">{value.toFixed(2)} km/h</div>
                    <div className="text-[10px] text-white/70 mt-0.5">Gust #{index + 1}</div>
                    {/* Arrow */}
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                      <div className="w-2 h-2 bg-white/25 border-r border-b border-white/30 transform rotate-45"></div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        
        {/* X-axis labels */}
        <div className="flex justify-between mt-2 px-1">
          {data.gusts.map((_, index) => (
            <div key={index} className="text-white/40 text-[10px] font-medium">
              {index + 1}
            </div>
          ))}
        </div>
      </div>
      
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
      `}</style>
    </div>
  )
}

