'use client'

import type { SensorData } from '@/lib/mqttService'

interface CurrentWeatherProps {
  data: SensorData | null
}

const formatTime = (timestamp?: number) => {
  if (!timestamp) return '—'
  const date = new Date(timestamp * 1000)
  return date.toLocaleString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

export default function CurrentWeather({ data }: CurrentWeatherProps) {
  const getStatusText = () => {
    if (!data) return { title: 'Đang kết nối...', subtitle: 'Chờ dữ liệu từ cảm biến' }
    
    const temp = data.temp_out
    if (temp >= 30) return { title: 'Nắng nóng', subtitle: 'Nhiệt độ cao, cần bảo vệ sức khỏe' }
    if (temp >= 25) return { title: 'Ấm áp', subtitle: 'Thời tiết dễ chịu, phù hợp hoạt động ngoài trời' }
    if (temp >= 20) return { title: 'Mát mẻ', subtitle: 'Nhiệt độ vừa phải, thoải mái' }
    if (temp >= 15) return { title: 'Lạnh nhẹ', subtitle: 'Nhiệt độ thấp, nên mặc thêm áo ấm' }
    return { title: 'Lạnh', subtitle: 'Nhiệt độ rất thấp, cần giữ ấm cơ thể' }
  }

  const status = getStatusText()

  return (
    <div className="glass-strong rounded-2xl p-6 md:p-8 border border-white/15 shadow-lg shadow-slate-900/40 h-full flex flex-col">
      <div className="mb-4 md:mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 shadow-md shadow-black/20 flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
              <circle cx="12" cy="12" r="5"/>
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent">
            {status.title}
          </h1>
        </div>
        <p className="text-white/70 text-xs md:text-sm mb-3 font-medium">
          Dữ liệu cảm biến thời gian thực
        </p>
        <p className="text-white/80 text-sm md:text-base leading-relaxed">
          {status.subtitle}
        </p>
      </div>
      
      <div className="flex items-end gap-6 mt-auto">
        <div>
          <div className="text-6xl md:text-7xl font-bold text-white leading-none bg-gradient-to-b from-white to-white/90 bg-clip-text text-transparent">
            {data ? `${data.temp_out.toFixed(1)}°` : '—'}
          </div>
          <div className="text-white/60 text-xs mt-1">Nhiệt độ ngoài</div>
        </div>
        <div className="mb-2 flex-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-5 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                className="w-3.5 h-3.5 text-white/80"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <div className="text-white text-lg md:text-xl font-medium">
              Trạm VICENZA
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10">
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4 text-red-300"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/>
              </svg>
              <div className="flex flex-col">
                <span className="text-white/60 text-xs">Phòng</span>
                <span className="text-white text-sm font-semibold">
                  {data ? `${data.temp_room.toFixed(1)}°C` : '—'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10">
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4 text-blue-300"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
              </svg>
              <div className="flex flex-col">
                <span className="text-white/60 text-xs">Độ ẩm</span>
                <span className="text-white text-sm font-semibold">
                  {data ? `${data.hum_room.toFixed(0)}%` : '—'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10">
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4 text-yellow-300"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
              <div className="flex flex-col">
                <span className="text-white/60 text-xs">Ánh sáng</span>
                <span className="text-white text-sm font-semibold">
                  {data ? `${data.lux.toFixed(0)} lux` : '—'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10">
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4 text-purple-300"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <div className="flex flex-col">
                <span className="text-white/60 text-xs">Cập nhật</span>
                <span className="text-white text-sm font-semibold">
                  {formatTime(data?.timestamp)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

