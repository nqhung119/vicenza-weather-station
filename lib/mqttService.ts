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

  connect() {
    if (this.client || this.connecting) return
    this.connecting = true

    const url = `mqtt://${MQTT_HOST}:${MQTT_PORT}`

    this.client = mqtt.connect(url, {
      username: MQTT_USERNAME,
      password: MQTT_PASSWORD,
      reconnectPeriod: 2000,
      connectTimeout: 10_000,
      keepalive: 30,
    })

    this.client.on('connect', () => {
      this.client?.subscribe(MQTT_TOPIC, (err) => {
        if (err) console.error('MQTT subscribe error:', err)
      })
    })

    this.client.on('message', (_, payload) => {
      try {
        const parsed = JSON.parse(payload.toString())
        const data: SensorData = {
          temp_room: Number(parsed.temp_room) ?? 0,
          hum_room: Number(parsed.hum_room) ?? 0,
          temp_out: Number(parsed.temp_out) ?? 0,
          lux: Number(parsed.lux) ?? 0,
          ldr_raw: Number(parsed.ldr_raw) ?? 0,
          timestamp: Number(parsed.timestamp) ?? Date.now() / 1000,
        }
        this.latestData = data
        this.notify(data)
      } catch (error) {
        console.error('MQTT message parse error:', error)
      }
    })

    this.client.on('error', (err) => {
      console.error('MQTT error:', err)
    })

    this.client.on('close', () => {
      this.client = null
      this.connecting = false
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


