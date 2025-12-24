'use client'

import { useMemo } from 'react'
import type { SensorData } from '@/lib/mqttService'

interface SensorDataProps {
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

export default function SensorData({ data }: SensorDataProps) {
  const items = useMemo(
    () => [
      { label: 'Nhiệt độ phòng', value: data?.temp_room, unit: '°C' },
      { label: 'Độ ẩm phòng', value: data?.hum_room, unit: '%' },
      { label: 'Nhiệt độ ngoài', value: data?.temp_out, unit: '°C' },
      { label: 'Ánh sáng (lux)', value: data?.lux, unit: 'lux' },
      { label: 'LDR raw', value: data?.ldr_raw, unit: '' },
    ],
    [data]
  )

  const getIcon = (label: string) => {
    if (label.includes('Nhiệt độ')) {
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-red-300" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/>
        </svg>
      )
    }
    if (label.includes('Độ ẩm')) {
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-blue-300" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
        </svg>
      )
    }
    if (label.includes('Ánh sáng')) {
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-yellow-300" fill="none" stroke="currentColor" strokeWidth="2">
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
      )
    }
    return (
      <svg viewBox="0 0 24 24" className="w-5 h-5 text-purple-300" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    )
  }

  return (
    <div className="glass-strong rounded-2xl p-5 md:p-6 border border-white/15 shadow-lg shadow-slate-900/40">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 shadow-md shadow-black/20 flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              className="w-4.5 h-4.5 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
              <circle cx="12" cy="12" r="5"/>
            </svg>
          </div>
          <h3 className="text-white text-base font-semibold">Dữ liệu cảm biến</h3>
        </div>
        <div className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10">
          <div className="text-white/60 text-xs">
            Cập nhật: <span className="text-white/80 font-medium">{formatTime(data?.timestamp)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
        {items.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-white/10 bg-white/5 px-3.5 py-3 hover:bg-white/10 hover:border-white/20 transition-all duration-200 group"
          >
            <div className="flex items-center gap-2 mb-1.5">
              {getIcon(item.label)}
              <div className="text-white/70 text-xs font-medium">{item.label}</div>
            </div>
            <div className="text-white text-xl font-bold mt-1.5 bg-gradient-to-b from-white to-white/80 bg-clip-text text-transparent">
              {item.value !== undefined && item.value !== null
                ? `${item.value.toFixed(1)}${item.unit ? ` ${item.unit}` : ''}`
                : '—'}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


