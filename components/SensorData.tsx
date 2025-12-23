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

  return (
    <div className="glass-strong rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📡</span>
          <h3 className="text-white text-lg font-semibold">Sensor data</h3>
        </div>
        <div className="text-white/60 text-xs">
          Cập nhật: {formatTime(data?.timestamp)}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3"
          >
            <div className="text-white/70 text-xs">{item.label}</div>
            <div className="text-white text-xl font-semibold mt-1">
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


