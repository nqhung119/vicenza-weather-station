'use client'

export default function Navigation() {
  const icons = [
    {
      name: 'search',
      render: (
        <svg
          viewBox="0 0 24 24"
          className="w-6 h-6"
          stroke="currentColor"
          strokeWidth="1.8"
          fill="none"
        >
          <circle cx="11" cy="11" r="6" />
          <line x1="16" y1="16" x2="21" y2="21" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      name: 'map',
      render: (
        <svg
          viewBox="0 0 24 24"
          className="w-6 h-6"
          stroke="currentColor"
          strokeWidth="1.8"
          fill="none"
        >
          <path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2V6" />
          <line x1="9" y1="4" x2="9" y2="20" />
          <line x1="15" y1="6" x2="15" y2="22" />
        </svg>
      ),
    },
    {
      name: 'notification',
      render: (
        <svg
          viewBox="0 0 24 24"
          className="w-6 h-6"
          stroke="currentColor"
          strokeWidth="1.8"
          fill="none"
        >
          <path
            d="M6 10a6 6 0 1112 0c0 3 1 4 2 5H4c1-1 2-2 2-5z"
            strokeLinejoin="round"
          />
          <path d="M10 19a2 2 0 004 0" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      name: 'settings',
      render: (
        <svg
          viewBox="0 0 24 24"
          className="w-6 h-6"
          stroke="currentColor"
          strokeWidth="1.8"
          fill="none"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9c0 .66.39 1.26 1 1.51.17.07.36.11.55.12H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z" />
        </svg>
      ),
    },
  ]

  return (
    <div className="flex justify-center mb-8">
      <div className="glass-strong rounded-full px-6 py-3 flex items-center gap-4 border border-white/15 shadow-lg shadow-slate-900/40">
        {icons.map((item) => (
          <button
            key={item.name}
            className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 shadow-md shadow-black/20 flex items-center justify-center text-white hover:bg-white/15 hover:-translate-y-0.5 transition duration-200"
            aria-label={item.name}
          >
            {item.render}
          </button>
        ))}
      </div>
    </div>
  )
}

