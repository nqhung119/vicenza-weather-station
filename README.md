# Vicenza Weather Station

A modern, beautiful weather forecast application built with Next.js, featuring a glassmorphism design and dark theme.

## Features

- Current weather display with detailed conditions
- Wind status with interactive graphs
- Sunrise/Sunset widget with visual gauge
- 7-day weather forecast
- Modern glassmorphism UI design
- Animated storm background effects
- Responsive design for all devices

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

## Architecture & Data Flow

### Local Development
- **Local MQTT Broker** (192.168.221.4) → **Next.js Backend** → **Frontend**
- Backend trực tiếp subscribe từ local MQTT broker

### Production (Vercel)
- **Local MQTT Broker** (192.168.221.4) → **Docker Bridge Service** → **HiveMQ** → **Vercel Backend** → **Frontend**
- Docker bridge service chạy độc lập, đẩy dữ liệu lên HiveMQ mỗi 5 phút
- Vercel backend subscribe từ HiveMQ để lấy dữ liệu cảm biến

## Environment Variables

Create `./.env.local` (or copy from `env.local.example`):

### Local MQTT Configuration (for local development)
```
LOCAL_MQTT_HOST=192.168.221.4
LOCAL_MQTT_PORT=1883
LOCAL_MQTT_TOPIC=vicenza/weather/data
# LOCAL_MQTT_USERNAME=
# LOCAL_MQTT_PASSWORD=
```

### HiveMQ Configuration (for Vercel deployment)
```
HIVEMQ_HOST=your-hivemq-broker.hivemq.cloud
HIVEMQ_PORT=8883
HIVEMQ_TOPIC=vicenza/weather/data
HIVEMQ_USERNAME=your-username
HIVEMQ_PASSWORD=your-password
HIVEMQ_CLIENT_ID=vicenza-client
```

## MQTT Bridge Service (Docker)

Service độc lập chạy trong Docker để bridge dữ liệu từ local MQTT broker lên HiveMQ.

### Chạy với Docker Compose

```bash
docker-compose up mqtt-bridge
```

Hoặc chạy tất cả services:

```bash
docker-compose up
```

### Cấu hình Environment Variables

Tạo file `.env` hoặc set environment variables cho Docker:

```bash
LOCAL_MQTT_HOST=192.168.221.4
LOCAL_MQTT_PORT=1883
LOCAL_MQTT_TOPIC=vicenza/weather/data
HIVEMQ_HOST=your-hivemq-broker.hivemq.cloud
HIVEMQ_PORT=8883
HIVEMQ_TOPIC=vicenza/weather/data
HIVEMQ_USERNAME=your-username
HIVEMQ_PASSWORD=your-password
HIVEMQ_CLIENT_ID=vicenza-bridge
```

### Chức năng

Service sẽ:
- Subscribe dữ liệu từ local MQTT broker (192.168.221.4)
- Publish dữ liệu lên HiveMQ mỗi 5 phút
- Tự động reconnect khi mất kết nối
- Chạy độc lập với network_mode: host để truy cập local MQTT broker

## MQTT Integration

- **Topic**: `vicenza/weather/data`
- **Message format**:
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

- **Backend**: 
  - Local: MQTT client subscribe từ local broker
  - Vercel: MQTT client subscribe từ HiveMQ (nếu `HIVEMQ_HOST` được set)
- **API**: `/api/sensor-data` exposes Server-Sent Events (SSE) streaming real-time updates to the frontend.

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
│   └── mqttService.ts        # MQTT client singleton (supports both local MQTT and HiveMQ)
├── mqtt-bridge/
│   ├── Dockerfile            # Dockerfile cho bridge service
│   ├── index.js              # Bridge service code
│   └── package.json          # Dependencies cho bridge service
├── docker-compose.yml        # Docker Compose configuration
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

