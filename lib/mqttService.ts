import mqtt, { MqttClient } from 'mqtt'

export interface SensorData {
  temp_room: number
  hum_room: number
  temp_out: number
  lux: number
  ldr_raw: number
  timestamp: number
}

type Subscriber = (data: SensorData) => void

const MQTT_HOST = process.env.MQTT_HOST || '192.168.221.4'
const MQTT_PORT = Number(process.env.MQTT_PORT || 1883)
const MQTT_USERNAME = process.env.MQTT_USERNAME
const MQTT_PASSWORD = process.env.MQTT_PASSWORD
const MQTT_TOPIC = process.env.MQTT_TOPIC || 'vicenza/weather/data'

class MqttService {
  private client: MqttClient | null = null
  private latestData: SensorData | null = null
  private subscribers: Set<Subscriber> = new Set()
  private connecting = false
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private lastErrorTime = 0
  private errorThrottleMs = 10000 // Chỉ log lỗi mỗi 10 giây

  connect() {
    if (this.client || this.connecting) return
    this.connecting = true

    const url = `mqtt://${MQTT_HOST}:${MQTT_PORT}`

    this.client = mqtt.connect(url, {
      username: MQTT_USERNAME,
      password: MQTT_PASSWORD,
      reconnectPeriod: 5000, // Tăng thời gian retry lên 5 giây
      connectTimeout: 10_000,
      keepalive: 30,
      will: {
        topic: 'vicenza/weather/status',
        payload: 'offline',
        qos: 1,
        retain: false,
      },
    })

    this.client.on('connect', () => {
      this.connecting = false
      this.reconnectAttempts = 0
      console.log(`[MQTT] Connected to ${MQTT_HOST}:${MQTT_PORT}`)
      
      this.client?.subscribe(MQTT_TOPIC, (err) => {
        if (err) {
          console.error('[MQTT] Subscribe error:', err)
        } else {
          console.log(`[MQTT] Subscribed to topic: ${MQTT_TOPIC}`)
        }
      })
    })

    this.client.on('message', (topic, payload) => {
      try {
        const parsed = JSON.parse(payload.toString())
        const data: SensorData = {
          temp_room: Number(parsed.temp_room) || 0,
          hum_room: Number(parsed.hum_room) || 0,
          temp_out: Number(parsed.temp_out) || 0,
          lux: Number(parsed.lux) || 0,
          ldr_raw: Number(parsed.ldr_raw) || 0,
          timestamp: Number(parsed.timestamp) || Math.floor(Date.now() / 1000),
        }
        // Validate data
        if (isNaN(data.temp_room)) data.temp_room = 0
        if (isNaN(data.hum_room)) data.hum_room = 0
        if (isNaN(data.temp_out)) data.temp_out = 0
        if (isNaN(data.lux)) data.lux = 0
        if (isNaN(data.ldr_raw)) data.ldr_raw = 0
        if (isNaN(data.timestamp)) data.timestamp = Math.floor(Date.now() / 1000)
        
        this.latestData = data
        this.notify(data)
      } catch (error) {
        console.error('[MQTT] Message parse error:', error)
      }
    })

    this.client.on('error', (err) => {
      const now = Date.now()
      // Chỉ log lỗi nếu đã qua thời gian throttle
      if (now - this.lastErrorTime > this.errorThrottleMs) {
        console.error(`[MQTT] Connection error (${err.message}):`, {
          host: MQTT_HOST,
          port: MQTT_PORT,
          code: (err as any).code,
        })
        this.lastErrorTime = now
      }
      
      // Reset connecting flag để có thể thử lại
      this.connecting = false
      this.reconnectAttempts++
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.warn(`[MQTT] Max reconnect attempts (${this.maxReconnectAttempts}) reached. Stopping automatic reconnection.`)
        if (this.client) {
          this.client.end()
          this.client = null
        }
      }
    })

    this.client.on('close', () => {
      console.log('[MQTT] Connection closed')
      this.client = null
      this.connecting = false
    })

    this.client.on('offline', () => {
      console.log('[MQTT] Client offline')
      this.connecting = false
    })

    this.client.on('reconnect', () => {
      this.reconnectAttempts++
      console.log(`[MQTT] Reconnecting... (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
    })
  }

  getLatestData() {
    return this.latestData
  }

  subscribe(callback: Subscriber) {
    this.subscribers.add(callback)
    if (this.latestData) callback(this.latestData)
    return () => this.subscribers.delete(callback)
  }

  isConnected(): boolean {
    return this.client?.connected ?? false
  }

  disconnect() {
    if (this.client) {
      this.client.end()
      this.client = null
      this.connecting = false
    }
  }

  private notify(data: SensorData) {
    for (const subscriber of this.subscribers) {
      try {
        subscriber(data)
      } catch (err) {
        console.error('MQTT subscriber error:', err)
      }
    }
  }
}

const globalForMqtt = global as unknown as { mqttService?: MqttService }

export const mqttService = globalForMqtt.mqttService ?? new MqttService()
if (!globalForMqtt.mqttService) {
  globalForMqtt.mqttService = mqttService
}

export function ensureMqttConnected() {
  mqttService.connect()
}


