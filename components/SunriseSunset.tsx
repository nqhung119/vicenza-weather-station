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
    if (!time || time.includes('--')) return 0
    const parts = time.split(':')
    if (parts.length < 2) return 0
    const hours = Number(parts[0])
    const minutes = Number(parts[1])
    if (isNaN(hours) || isNaN(minutes)) return 0
    return hours * 60 + minutes
  }

  const sunriseMinutes = timeToMinutes(data.sunrise)
  const sunsetMinutes = timeToMinutes(data.sunset)
  const currentMinutes = timeToMinutes(data.currentTime)
  
  const totalDaylight = sunsetMinutes - sunriseMinutes
  const elapsed = currentMinutes - sunriseMinutes
  const progress = totalDaylight > 0 ? Math.max(0, Math.min(1, elapsed / totalDaylight)) : 0.5
  
  // Math Configuration
  const CX = 110
  const CY = 100 // Visual bottom of the arc
  const R = 80
  
  // Current position
  const currentAngle = Math.PI - (progress * Math.PI) // Goes from PI to 0
  
  const currentX = CX + R * Math.cos(currentAngle)
  const currentY = CY - R * Math.sin(currentAngle) // Subtract because SVG Y is down
  
  // Ensure coordinates are valid numbers
  const validX = isFinite(currentX) && !isNaN(currentX) ? currentX : CX
  const validY = isFinite(currentY) && !isNaN(currentY) ? currentY : CY - R
  // Wait, standard sin(PI) is 0, sin(PI/2) is 1.
  // We want top arc.
  // Angle PI: cos=-1 (x=CX-R), sin=0 (y=CY).
  // Angle PI/2: cos=0 (x=CX), sin=1 (y=CY-R).
  // Angle 0: cos=1 (x=CX+R), sin=0 (y=CY).
  
  // Fix the arc path description
  // M (CX-R) CY A R R 0 0 1 (CX+R) CY
  
  return (
    <div className="glass-strong rounded-3xl p-6 border border-white/10 shadow-xl h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
            <svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5 text-orange-300">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
            </svg>
        </div>
        <h3 className="text-white font-semibold">Mặt trời</h3>
      </div>

      {/* Semicirle Chart */}
      <div className="flex-1 relative flex items-center justify-center -mt-4">
        <svg width="220" height="120" viewBox="0 0 220 120" className="overflow-visible">
           <defs>
             <linearGradient id="sunGradientStroke" x1="0" y1="0" x2="1" y2="0">
               <stop offset="0%" stopColor="#f59e0b" /> {/* Orange */}
               <stop offset="50%" stopColor="#fde047" /> {/* Yellow */}
               <stop offset="100%" stopColor="#ef4444" /> {/* Red */}
             </linearGradient>
           </defs>
           
           {/* Background Arc (Dashed) */}
           <path 
             d={`M ${CX-R} ${CY} A ${R} ${R} 0 0 1 ${CX+R} ${CY}`}
             fill="none" 
             stroke="rgba(255,255,255,0.1)" 
             strokeWidth="2" 
             strokeDasharray="4 4"
           />
           
           {/* Horizon Line */}
           <line x1="10" y1={CY} x2="210" y2={CY} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

           {/* Animated Sun Marker */}
           <g transform={`translate(${validX}, ${validY})`}>
              <circle r="8" fill="#fde047" className="shadow-[0_0_20px_rgba(253,224,71,0.6)]" />
              <circle r="12" fill="none" stroke="#fde047" strokeWidth="1" opacity="0.5" className="animate-ping" />
           </g>
           
           {/* Sun Icon in center bottom */}
           <text x={CX} y={CY - 20} textAnchor="middle" fill="white" fontSize="12" opacity="0.5">
             {totalDaylight > 0 && elapsed > 0 && elapsed < totalDaylight ? 'Ban ngày' : 'Ban đêm'}
           </text>
        </svg>
      </div>

      <div className="flex justify-between items-end mt-2">
        <div className="flex flex-col">
          <span className="text-white/50 text-xs font-medium uppercase tracking-wider">Bình minh</span>
          <span className="text-white font-semibold text-lg">{data.sunrise}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-white/50 text-xs font-medium uppercase tracking-wider">Hoàng hôn</span>
          <span className="text-white font-semibold text-lg">{data.sunset}</span>
        </div>
      </div>
    </div>
  )
}

