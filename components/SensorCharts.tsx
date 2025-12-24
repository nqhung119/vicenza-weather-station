'use client'

import { useEffect, useState, useRef } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'
import type { SensorData } from '@/lib/mqttService'

interface SensorChartsProps {
  data: SensorData | null
}

interface ChartDataPoint {
  time: string
  temp_room: number
  temp_out: number
  hum_room: number
  timestamp: number
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-strong p-3 rounded-xl border border-white/10 shadow-xl">
        <p className="text-white/70 text-xs mb-2 font-medium">{label}</p>
        <div className="space-y-1">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-white/90 font-semibold">
                {entry.name}: {entry.value.toFixed(1)} {entry.unit}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }
  return null
}

export default function SensorCharts({ data }: SensorChartsProps) {
  const [history, setHistory] = useState<ChartDataPoint[]>([])
  const maxPoints = 30 // Keep last 30 data points

  useEffect(() => {
    if (!data) return

    setHistory(prev => {
      const now = new Date()
      // Create new point
      const newPoint: ChartDataPoint = {
        time: now.toLocaleTimeString('vi-VN', { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
        }),
        timestamp: now.getTime(),
        temp_room: data.temp_room || 0,
        temp_out: data.temp_out || 0,
        hum_room: data.hum_room || 0
      }
      
      // Prevent duplicate timestamps (simple throttle)
      const lastPoint = prev[prev.length - 1]
      if (lastPoint && (newPoint.timestamp - lastPoint.timestamp) < 2000) {
        return prev
      }

      const newHistory = [...prev, newPoint]
      if (newHistory.length > maxPoints) {
        return newHistory.slice(newHistory.length - maxPoints)
      }
      return newHistory
    })
  }, [data])

  // Initial empty state or loading state could be handled here
  if (history.length < 2) {
    return (
      <div className="glass-strong rounded-2xl p-6 border border-white/15 min-h-[300px] flex items-center justify-center">
        <div className="text-white/50 animate-pulse">Đang thu thập dữ liệu biểu đồ...</div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Temperature Chart */}
      <div className="glass-strong rounded-2xl p-6 border border-white/15 shadow-lg shadow-slate-900/40">
        <div className="flex items-center justify-between mb-6">
            <h3 className="text-white font-semibold flex items-center gap-2">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/>
                </svg>
                Biểu đồ Nhiệt độ
            </h3>
        </div>
        <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={history}>
                <defs>
                <linearGradient id="colorTempRoom" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f87171" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f87171" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorTempOut" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#facc15" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#facc15" stopOpacity={0}/>
                </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis 
                    dataKey="time" 
                    stroke="rgba(255,255,255,0.4)" 
                    tick={{ fontSize: 10 }} 
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis 
                    stroke="rgba(255,255,255,0.4)" 
                    tick={{ fontSize: 10 }} 
                    tickLine={false}
                    axisLine={false}
                    domain={[0, 100]}
                    unit="°C"
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px' }}/>
                <Area 
                    type="monotone" 
                    dataKey="temp_room" 
                    name="Trong phòng" 
                    stroke="#f87171" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorTempRoom)" 
                    unit="°C"
                    isAnimationActive={false}
                />
                <Area 
                    type="monotone" 
                    dataKey="temp_out" 
                    name="Ngoài trời" 
                    stroke="#facc15" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorTempOut)" 
                    unit="°C"
                    isAnimationActive={false}
                />
            </AreaChart>
            </ResponsiveContainer>
        </div>
      </div>

      {/* Humidity Chart */}
      <div className="glass-strong rounded-2xl p-6 border border-white/15 shadow-lg shadow-slate-900/40">
        <div className="flex items-center justify-between mb-6">
            <h3 className="text-white font-semibold flex items-center gap-2">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
                </svg>
                Biểu đồ Độ ẩm
            </h3>
        </div>
        <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={history}>
                <defs>
                <linearGradient id="colorHum" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#60a5fa" stopOpacity={0}/>
                </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis 
                    dataKey="time" 
                    stroke="rgba(255,255,255,0.4)" 
                    tick={{ fontSize: 10 }} 
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis 
                    stroke="rgba(255,255,255,0.4)" 
                    tick={{ fontSize: 10 }} 
                    tickLine={false}
                    axisLine={false}
                    domain={[0, 100]}
                    unit="%"
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px' }}/>
                <Area 
                    type="monotone" 
                    dataKey="hum_room" 
                    name="Độ ẩm phòng" 
                    stroke="#60a5fa" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorHum)" 
                    unit="%"
                    isAnimationActive={false}
                />
            </AreaChart>
            </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
