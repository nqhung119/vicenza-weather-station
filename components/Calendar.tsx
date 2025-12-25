'use client'

import { useState, useMemo } from 'react'
import { Lunar } from 'lunar-javascript'

type CalendarType = 'solar' | 'lunar'

interface DayInfo {
  date: Date
  day: number
  isCurrentMonth: boolean
  isToday: boolean
  lunarDay?: number
  lunarMonth?: number
  lunarYear?: number
  lunarDayName?: string
  isLunarLeapMonth?: boolean
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [calendarType, setCalendarType] = useState<CalendarType>('solar')

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startingDayOfWeek = firstDay.getDay()

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const days: DayInfo[] = []
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate()
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i)
      try {
        const lunar = Lunar.fromDate(date)
        days.push({
          date,
          day: prevMonthLastDay - i,
          isCurrentMonth: false,
          isToday: date.getTime() === today.getTime(),
          lunarDay: lunar.getDay(),
          lunarMonth: lunar.getMonth(),
          lunarYear: lunar.getYear(),
          lunarDayName: (lunar as any).getDayInChinese?.() || (lunar as any).getDayInGanZhi?.() || '',
          isLunarLeapMonth: (lunar as any).isLeapMonth?.() || (lunar as any).getMonth?.()?.isLeap || false,
        })
      } catch (e) {
        days.push({
          date,
          day: prevMonthLastDay - i,
          isCurrentMonth: false,
          isToday: date.getTime() === today.getTime(),
        })
      }
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const dateOnly = new Date(date)
      dateOnly.setHours(0, 0, 0, 0)
      
      try {
        const lunar = Lunar.fromDate(date)
        days.push({
          date,
          day,
          isCurrentMonth: true,
          isToday: dateOnly.getTime() === today.getTime(),
          lunarDay: lunar.getDay(),
          lunarMonth: lunar.getMonth(),
          lunarYear: lunar.getYear(),
          lunarDayName: (lunar as any).getDayInChinese?.() || (lunar as any).getDayInGanZhi?.() || '',
          isLunarLeapMonth: (lunar as any).isLeapMonth?.() || (lunar as any).getMonth?.()?.isLeap || false,
        })
      } catch (e) {
        days.push({
          date,
          day,
          isCurrentMonth: true,
          isToday: dateOnly.getTime() === today.getTime(),
        })
      }
    }

    // Next month days to fill the grid
    const remainingDays = 42 - days.length // 6 rows × 7 days
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day)
      try {
        const lunar = Lunar.fromDate(date)
        days.push({
          date,
          day,
          isCurrentMonth: false,
          isToday: false,
          lunarDay: lunar.getDay(),
          lunarMonth: lunar.getMonth(),
          lunarYear: lunar.getYear(),
          lunarDayName: (lunar as any).getDayInChinese?.() || (lunar as any).getDayInGanZhi?.() || '',
          isLunarLeapMonth: (lunar as any).isLeapMonth?.() || (lunar as any).getMonth?.()?.isLeap || false,
        })
      } catch (e) {
        days.push({
          date,
          day,
          isCurrentMonth: false,
          isToday: false,
        })
      }
    }

    return days
  }, [year, month, startingDayOfWeek, daysInMonth])

  const monthNames = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ]

  const weekDays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(new Date(year, month + (direction === 'next' ? 1 : -1), 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  return (
    <div className="glass-strong rounded-3xl p-6 md:p-8 border border-white/15 shadow-lg shadow-slate-900/40">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Lịch</h1>
        </div>

        {/* Calendar Type Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCalendarType('solar')}
            className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
              calendarType === 'solar'
                ? 'bg-white/20 text-white border border-white/30'
                : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
            }`}
          >
            Dương lịch
          </button>
          <button
            onClick={() => setCalendarType('lunar')}
            className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
              calendarType === 'lunar'
                ? 'bg-white/20 text-white border border-white/30'
                : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
            }`}
          >
            Âm lịch
          </button>
        </div>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigateMonth('prev')}
          className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-white hover:bg-white/15 transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>

        <div className="flex items-center gap-4">
          <h2 className="text-xl md:text-2xl font-bold text-white">
            {calendarType === 'solar' 
              ? `${monthNames[month]} ${year}`
              : (() => {
                  const currentLunar = calendarDays.find(d => d.isCurrentMonth && d.lunarMonth) || calendarDays.find(d => d.lunarMonth)
                  return currentLunar 
                    ? `Tháng ${currentLunar.lunarMonth} Âm lịch ${currentLunar.lunarYear}`
                    : `${monthNames[month]} ${year}`
                })()
            }
          </h2>
          <button
            onClick={goToToday}
            className="px-4 py-2 rounded-xl bg-white/10 border border-white/15 text-white text-sm font-medium hover:bg-white/15 transition-colors"
          >
            Hôm nay
          </button>
        </div>

        <button
          onClick={() => navigateMonth('next')}
          className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-white hover:bg-white/15 transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          {/* Week Days Header */}
          <div className="grid grid-cols-7 gap-2 mb-3">
            {weekDays.map((day, index) => (
              <div
                key={index}
                className="text-center py-2 text-white/70 text-sm font-semibold"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((dayInfo, index) => {
              const isSelected = dayInfo.isToday
              const displayValue = calendarType === 'solar' 
                ? dayInfo.day 
                : dayInfo.lunarDay

              return (
                <div
                  key={index}
                  className={`
                    relative aspect-square rounded-xl border transition-all duration-200
                    ${dayInfo.isCurrentMonth 
                      ? 'bg-white/5 border-white/10 hover:bg-white/10' 
                      : 'bg-white/0 border-white/5 opacity-40'
                    }
                    ${isSelected 
                      ? 'bg-gradient-to-br from-blue-400/30 to-purple-400/30 border-blue-400/50 shadow-lg shadow-blue-500/20' 
                      : ''
                    }
                    ${!dayInfo.isCurrentMonth ? 'cursor-default' : 'cursor-pointer'}
                  `}
                >
                  <div className="flex flex-col items-center justify-center h-full p-1">
                    <span className={`text-sm font-semibold ${
                      isSelected ? 'text-white' : dayInfo.isCurrentMonth ? 'text-white' : 'text-white/40'
                    }`}>
                      {displayValue}
                    </span>
                    {calendarType === 'solar' && dayInfo.lunarDay && (
                      <span className="text-[10px] text-white/50 mt-0.5">
                        {dayInfo.lunarDay}
                      </span>
                    )}
                    {calendarType === 'lunar' && dayInfo.lunarDayName && (
                      <span className="text-[9px] text-white/60 mt-0.5">
                        {dayInfo.lunarDayName}
                      </span>
                    )}
                    {dayInfo.isLunarLeapMonth && (
                      <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-yellow-400/60"></span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 pt-6 border-t border-white/10 flex flex-wrap items-center gap-4 text-sm text-white/60">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gradient-to-br from-blue-400/30 to-purple-400/30 border border-blue-400/50"></div>
          <span>Hôm nay</span>
        </div>
        {calendarType === 'solar' && (
          <div className="flex items-center gap-2">
            <span className="text-[10px]">Số nhỏ: Ngày âm lịch</span>
          </div>
        )}
        {calendarType === 'lunar' && (
          <div className="flex items-center gap-2">
            <span className="text-[9px]">Chữ: Can chi</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-yellow-400/60"></div>
          <span>Tháng nhuận</span>
        </div>
      </div>
    </div>
  )
}

