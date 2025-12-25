'use client'

interface WindStatusProps {
  data: {
    speed: number
    direction?: number
    gusts: number[]
    history: number[]
  }
}

export default function WindStatus({ data }: WindStatusProps) {
  // Handle empty arrays properly
  const maxHistory = data.history.length > 0 ? Math.max(...data.history, 5) : 5
  const maxGusts = data.gusts.length > 0 ? Math.max(...data.gusts, 5) : 5

  // Smooth curve for line chart
  const getPath = (points: number[], width: number, height: number, max: number) => {
    if (points.length === 0 || max <= 0) {
      // Return a valid path for empty data - horizontal line at bottom
      return `M 0 ${height} L ${width} ${height}`
    }
    
    // Ensure max is valid
    if (!isFinite(max) || isNaN(max)) {
      return `M 0 ${height} L ${width} ${height}`
    }
    
    if (points.length === 1) {
      // Single point - draw horizontal line
      const y = height - (points[0] / max) * height
      return `M 0 ${y} L ${width} ${y}`
    }
    
    const stepX = width / (points.length - 1)
    
    // Start point
    const firstY = height - (points[0] / max) * height
    let d = `M 0 ${firstY}`

    // Bezier curves
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i]
      const p1 = points[i + 1]
      const x0 = i * stepX
      const x1 = (i + 1) * stepX
      const y0 = height - (p0 / max) * height
      const y1 = height - (p1 / max) * height
      
      // Ensure coordinates are valid
      if (!isFinite(x0) || !isFinite(y0) || !isFinite(x1) || !isFinite(y1)) {
        continue
      }
      
      const cpX1 = x0 + stepX / 2
      const cpY1 = y0
      const cpX2 = x0 + stepX / 2
      const cpY2 = y1

      d += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${x1} ${y1}`
    }
    return d
  }

  const linePath = getPath(data.history, 200, 50, maxHistory)
  // Only create area path if linePath is valid and not empty
  const areaPath = linePath && linePath.trim() !== '' 
    ? `${linePath} L 200 50 L 0 50 Z`
    : `M 0 50 L 200 50 L 200 50 L 0 50 Z`

  return (
    <div className="glass-strong rounded-3xl p-6 border border-white/10 shadow-xl h-full flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
             <svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5 text-blue-300">
               <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
             </svg>
          </div>
          <div>
            <h3 className="text-white font-semibold">Tốc độ gió</h3>
            <div className="text-white/50 text-xs text-nowrap">Đang cập nhật</div>
          </div>
        </div>
        
        {/* Wind Direction Compass */}
        {data.direction !== undefined && (
          <div className="relative w-12 h-12 rounded-full border border-white/10 flex items-center justify-center bg-white/5">
            <span className="text-[8px] absolute top-1 font-bold text-white/50">N</span>
            <div 
              style={{ transform: `rotate(${data.direction}deg)` }}
              className="w-full h-full flex items-center justify-center transition-transform duration-1000"
            >
               <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-white transform rotate-180">
                  <path d="M12 2L9 9H15L12 2Z" />
               </svg>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-end gap-2 mb-6">
        <span className="text-5xl font-bold text-white tracking-tighter">{data.speed.toFixed(1)}</span>
        <span className="text-lg text-white/60 mb-2 font-medium">km/h</span>
      </div>

      {/* Charts Container */}
      <div className="flex-1 flex flex-col gap-4">
        
        {/* Line Chart (Trend) */}
        <div className="h-14 relative w-full overflow-hidden">
          <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 200 50">
             <defs>
              <linearGradient id="windGradientFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(147, 197, 253, 0.3)" />
                <stop offset="100%" stopColor="rgba(147, 197, 253, 0)" />
              </linearGradient>
             </defs>
             <path d={areaPath} fill="url(#windGradientFill)" />
             <path d={linePath} fill="none" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>

        {/* Bar Chart (Gusts) */}
        <div className="flex items-end justify-between h-24 gap-1.5 pt-4 border-t border-white/5">
           {data.gusts.length > 0 ? (
             data.gusts.map((g, i) => {
               const heightPercent = maxGusts > 0 && isFinite(maxGusts) && isFinite(g)
                 ? Math.max(0, Math.min(100, (g / maxGusts) * 100))
                 : 0
               return (
                 <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                   <div 
                      className="w-full bg-blue-500/30 rounded-t-sm group-hover:bg-blue-400/50 transition-all relative"
                      style={{ height: `${heightPercent}%` }}
                   >
                     {/* Tooltip */}
                     <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-20">
                        {isFinite(g) ? g.toFixed(1) : '0'}
                     </div>
                   </div>
                   <span className="text-[10px] text-white/30">{i + 1}</span>
                 </div>
               )
             })
           ) : (
             <div className="w-full text-center text-white/30 text-sm py-4">
               Chưa có dữ liệu gió giật
             </div>
           )}
        </div>
      
      </div>
    </div>
  )
}

