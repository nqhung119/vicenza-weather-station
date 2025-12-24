'use client'

import { useEffect, useMemo, useState } from 'react'
import CurrentWeather from '@/components/CurrentWeather'
import WindStatus from '@/components/WindStatus'
import SunriseSunset from '@/components/SunriseSunset'
import Forecast from '@/components/Forecast'
import Header from '@/components/Header'
import Navigation from '@/components/Navigation'
import SensorData from '@/components/SensorData'
import type { SensorData as SensorPayload } from '@/lib/mqttService'

interface WeatherData {
  current: {
    temp: number
    condition: string
    description: string
    windSpeed: number
    location: string
    uvIndex: number
    humidity?: number
  }
  wind: {
    speed: number
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

const baseWeather: WeatherData = {
  current: {
    temp: 22,
    condition: 'Dông bão',
    description:
      'Mưa lớn, gió mạnh và sét thỉnh thoảng. Mưa đột ngột có thể dẫn đến ngập lụt cục bộ ở một số khu vực.',
    windSpeed: 7.9,
    location: 'Trạm VICENZA',
    uvIndex: 5,
  },
  wind: {
    speed: 7.9,
    gusts: [8, 9, 7, 10, 8, 9, 11],
    history: [6, 7, 8, 7, 9, 8, 7, 8, 9, 7, 8],
  },
  sun: {
    sunrise: '06:30',
    sunset: '19:45',
    currentTime: new Date().toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false
    }),
  },
  forecast: [
    { day: 'Thứ hai', temp: 26, icon: 'cloud' },
    { day: 'Thứ ba', temp: 28, icon: 'cloud' },
    { day: 'Thứ tư', temp: 24, icon: 'storm' },
    { day: 'Thứ năm', temp: 26, icon: 'cloud' },
    { day: 'Thứ sáu', temp: 23, icon: 'cloud' },
    { day: 'Thứ bảy', temp: 26, icon: 'cloud' },
    { day: 'Chủ nhật', temp: 27, icon: 'sun-cloud' },
  ],
}

export default function Home() {
  const [sensorData, setSensorData] = useState<SensorPayload | null>(null)
  const [weatherData, setWeatherData] = useState<WeatherData>(baseWeather)

  // Fetch weather data from API
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch('/api/weather')
        if (response.ok) {
          const data = await response.json()
          setWeatherData(data)
        }
      } catch (error) {
        console.error('Error fetching weather:', error)
      }
    }

    fetchWeather()
    // Refresh every 10 minutes
    const interval = setInterval(fetchWeather, 600000)
    return () => clearInterval(interval)
  }, [])

  // Fetch sensor data from MQTT
  useEffect(() => {
    const eventSource = new EventSource('/api/sensor-data')

    eventSource.onmessage = (event) => {
      try {
        const data: SensorPayload = JSON.parse(event.data)
        setSensorData(data)
      } catch (error) {
        console.error('SSE parse error:', error)
      }
    }

    eventSource.onerror = (error) => {
      console.error('SSE connection error:', error)
    }

    return () => {
      eventSource.close()
    }
  }, [])

  // Merge sensor data with weather data
  const mergedWeatherData = useMemo<WeatherData>(() => {
    if (!sensorData) return weatherData
    return {
      ...weatherData,
      current: {
        ...weatherData.current,
        temp: sensorData.temp_out,
        humidity: sensorData.hum_room,
        location: 'Trạm VICENZA',
      },
    }
  }, [sensorData, weatherData])

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background with storm effect */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-800 via-slate-700 to-slate-900"></div>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-900 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-slate-800 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-slate-700 rounded-full blur-3xl opacity-40"></div>
        </div>
        {/* Rain effect */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-20 bg-white animate-rain"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${0.5 + Math.random() * 0.5}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 p-6 md:p-8 lg:p-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <Header />

          {/* Navigation */}
          <Navigation />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6 mt-8">
            {/* Left Column - Sensor Data Display */}
            <div className="lg:col-span-2 min-h-[400px]">
              <CurrentWeather data={sensorData} />
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
        </div>
      </div>

      <style jsx>{`
        @keyframes rain {
          0% {
            transform: translateY(-100vh);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh);
            opacity: 0;
          }
        }
        .animate-rain {
          animation: rain linear infinite;
        }
      `}</style>
    </main>
  )
}

