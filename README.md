# Vicenza Weather Station

A modern, beautiful weather forecast application built with Next.js, featuring a glassmorphism design and dark theme.

## Features

- 🌤️ Current weather display with detailed conditions
- 💨 Wind status with interactive graphs
- 🌅 Sunrise/Sunset widget with visual gauge
- 📅 7-day weather forecast
- 🎨 Modern glassmorphism UI design
- 🌧️ Animated storm background effects
- 📱 Responsive design for all devices

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- MQTT broker reachable (default `192.168.221.4:1883`)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables (MQTT)

Create `./.env.local` (or copy from `env.local.example`):

```
MQTT_HOST=192.168.221.4
MQTT_PORT=1883
MQTT_TOPIC=vicenza/weather/data
# MQTT_USERNAME=
# MQTT_PASSWORD=
```

## MQTT Integration

- Topic subscribed: `vicenza/weather/data`
- Message format:
```json
{
  "temp_room": 26.0,
  "hum_room": 77.0,
  "temp_out": 28.2,
  "lux": 129.6,
  "ldr_raw": 1574,
  "timestamp": 1766479802
}
```
- Backend: MQTT client (singleton) connects and stores latest payload.
- API: `/api/sensor-data` exposes Server-Sent Events (SSE) streaming real-time updates to the frontend.

## Project Structure

```
vicenza-weather-station/
├── app/
│   ├── api/
│   │   └── weather/
│   │       └── route.ts      # Weather API endpoint
│   │   └── sensor-data/
│   │       └── route.ts      # SSE stream for MQTT data
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Main page
├── components/
│   ├── CurrentWeather.tsx    # Current weather display
│   ├── Forecast.tsx          # 7-day forecast
│   ├── Header.tsx            # Top header with user info
│   ├── Navigation.tsx        # Navigation icons
│   ├── SunriseSunset.tsx     # Sunrise/Sunset widget
│   ├── WindStatus.tsx        # Wind status widget
│   └── SensorData.tsx        # Sensor data widget (MQTT)
├── lib/
│   └── mqttService.ts        # MQTT client singleton
└── package.json
```

## Technologies Used

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React** - UI library
 - **MQTT + SSE** - Real-time sensor data stream

## Customization

You can customize the weather data by modifying the API route in `app/api/weather/route.ts`. Currently, it returns mock data, but you can integrate with any weather API service.

## License

MIT

