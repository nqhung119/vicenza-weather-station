'use client'

import { useMemo } from 'react'
import CurrentWeather from '@/components/CurrentWeather'
import WindStatus from '@/components/WindStatus'
import SunriseSunset from '@/components/SunriseSunset'
import Forecast from '@/components/Forecast'
import Header from '@/components/Header'
import SensorData from '@/components/SensorData'
import WeatherBackground from '@/components/WeatherBackground'
import { useApp } from '@/contexts/AppContext'

import SensorCharts from '@/components/SensorCharts'
import AdvancedSensorDashboard from '@/components/AdvancedSensorDashboard'
import SensorDataTable from '@/components/SensorDataTable'
import SensorStatistics from '@/components/SensorStatistics'

interface WeatherData {
  current: {
    temp: number
    feels_like?: number
    temp_min?: number
    temp_max?: number
    pressure?: number
    condition: string
    weatherMain?: string // For background logic
    description: string
    windSpeed: number
    windDirection?: number
    clouds?: number
    visibility?: number
    location: string
    uvIndex: number
    humidity?: number
  }
  wind: {
    speed: number
    direction?: number
    gusts: number[]
    history: number[]
  }
  sun: {
    sunrise: string
    sunset: string
    currentTime: string
  }
  forecast: Array<{
    day: string
    temp: number
    icon: string
  }>
}

const emptyWeather: WeatherData = {
  current: {
    temp: 0,
    feels_like: 0,
    temp_min: 0,
    temp_max: 0,
    pressure: 0,
    condition: '--',
    weatherMain: 'Clear',
    description: '--',
    windSpeed: 0,
    windDirection: 0,
    clouds: 0,
    visibility: 0,
    location: 'Trạm VICENZA',
    uvIndex: 0,
  },
  wind: {
    speed: 0,
    direction: 0,
    gusts: [],
    history: [],
  },
  sun: {
    sunrise: '--:--',
    sunset: '--:--',
    currentTime: new Date().toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false
    }),
  },
  forecast: [],
}

export default function Home() {
  // Use shared context instead of local state
  const { sensorData, weatherData, historyData, isLoadingHistory } = useApp()

  // Merge sensor data with weather data
  const mergedWeatherData = useMemo<WeatherData>(() => {
    const base = weatherData || emptyWeather
    if (!sensorData) return base
    return {
      ...base,
      current: {
        ...base.current,
        temp: sensorData.temp_out,
        humidity: sensorData.hum_room,
        location: 'Trạm VICENZA',
      },
    }
  }, [sensorData, weatherData])

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Dynamic Background - Now time-aware */}
      <WeatherBackground condition={mergedWeatherData.current.weatherMain || 'Clear'} />

      {/* Content */}
      <div className="relative z-10 p-6 md:p-8 lg:p-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <Header />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6 mt-8">
            {/* Left Column - Sensor Data Display */}
            <div className="lg:col-span-2 min-h-[400px]">
              <CurrentWeather data={sensorData} weather={mergedWeatherData.current} />
            </div>

            {/* Right Column - Widgets */}
            <div className="space-y-5 md:space-y-6 flex flex-col">
              <div className="flex-1 min-h-[190px]">
                <WindStatus data={mergedWeatherData.wind} />
              </div>
              <div className="flex-1 min-h-[190px]">
                <SunriseSunset data={mergedWeatherData.sun} />
              </div>
            </div>
          </div>

          {/* Forecast */}
          <div className="mt-12">
            <Forecast data={mergedWeatherData.forecast} />
          </div>

          {/* Sensor Data */}
          <div className="mt-8">
            <SensorData data={sensorData} />
          </div>

          {/* Real-time Charts */}
          <div className="mt-8">
            <SensorCharts data={sensorData} />
          </div>

          {/* Advanced Dashboard with Multiple Charts */}
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-8 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full"></div>
              <h2 className="text-2xl font-bold text-white">Dashboard Nâng cao</h2>
            </div>
            <AdvancedSensorDashboard data={sensorData} />
          </div>

          {/* Statistics */}
          <div className="mt-8">
            <SensorStatistics 
              history={
                historyData.length > 0
                  ? historyData.map(item => ({
                      temp_room: item.temp_room,
                      hum_room: item.hum_room,
                      temp_out: item.temp_out,
                      lux: item.lux,
                      ldr_raw: item.ldr_raw,
                      timestamp: item.timestamp,
                    }))
                  : sensorData
                    ? [{
                        temp_room: sensorData.temp_room,
                        hum_room: sensorData.hum_room,
                        temp_out: sensorData.temp_out,
                        lux: sensorData.lux,
                        ldr_raw: sensorData.ldr_raw,
                        timestamp: sensorData.timestamp,
                      }]
                    : []
              } 
            />
          </div>

          {/* Data Table */}
          <div className="mt-8">
            <SensorDataTable data={historyData} isLoading={isLoadingHistory} />
          </div>

        </div>
      </div>
    </main>
  )
}

