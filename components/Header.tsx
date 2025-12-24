'use client'

export default function Header() {
  const currentDate = new Date()
  const dateStr = currentDate.toLocaleDateString('vi-VN', { 
    day: 'numeric', 
    month: 'short' 
  })
  const timeStr = currentDate.toLocaleTimeString('vi-VN', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false
  })

  const navIcons = [
    {
      name: 'search',
      render: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" stroke="currentColor" strokeWidth="1.8" fill="none">
          <circle cx="11" cy="11" r="6" />
          <line x1="16" y1="16" x2="21" y2="21" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      name: 'map',
      render: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" stroke="currentColor" strokeWidth="1.8" fill="none">
          <path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2V6" />
          <line x1="9" y1="4" x2="9" y2="20" />
          <line x1="15" y1="6" x2="15" y2="22" />
        </svg>
      ),
    },
    {
      name: 'notification',
      render: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" stroke="currentColor" strokeWidth="1.8" fill="none">
           <path d="M6 10a6 6 0 1112 0c0 3 1 4 2 5H4c1-1 2-2 2-5z" strokeLinejoin="round" />
           <path d="M10 19a2 2 0 004 0" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      name: 'settings',
      render: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" stroke="currentColor" strokeWidth="1.8" fill="none">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9c0 .66.39 1.26 1 1.51.17.07.36.11.55.12H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z" />
        </svg>
      ),
    },
  ]

  return (
    <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
      {/* LEFT: Time and Date */}
      <div className="flex items-center gap-3">
        <div className="glass px-4 py-2 rounded-xl border border-white/10 flex items-center gap-3">
             <div className="text-white font-bold text-lg">{timeStr}</div>
             <div className="w-px h-4 bg-white/20"></div>
             <div className="text-white/80 text-sm font-medium uppercase">{dateStr}</div>
        </div>
      </div>

      {/* CENTER: Navigation (Slide Menu) */}
      <div className="glass-strong rounded-full px-4 py-2 flex items-center gap-2 border border-white/10 shadow-lg shadow-black/10">
        {navIcons.map((item) => (
          <button
            key={item.name}
            className="w-10 h-10 rounded-full bg-transparent hover:bg-white/10 flex items-center justify-center text-white/80 hover:text-white transition-all duration-200"
            aria-label={item.name}
          >
            {item.render}
          </button>
        ))}
      </div>
      
      {/* RIGHT: Login / Profile */}
      <div className="flex items-center gap-4">
        <div className="glass rounded-full px-3 py-1.5 pr-5 flex items-center gap-3 hover:bg-white/10 transition-colors cursor-pointer group">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform">
            V
          </div>
          <div className="hidden md:block">
            <div className="text-white text-sm font-semibold">VICENZA</div>
            <div className="text-white/50 text-[10px] font-medium tracking-wider uppercase">Admin</div>
          </div>
          <svg className="w-4 h-4 text-white/50 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  )
}

