'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import WeatherBackground from '@/components/WeatherBackground'
import Calendar from '@/components/Calendar'

export default function LichPage() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Dynamic Background */}
      <WeatherBackground condition="Clear" />

      {/* Content */}
      <div className="relative z-10 p-6 md:p-8 lg:p-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <Header />

          {/* Calendar Component */}
          <div className="mt-8">
            <Calendar />
          </div>
        </div>
      </div>
    </main>
  )
}

