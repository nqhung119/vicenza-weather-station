import mqtt from "mqtt";
import { WeatherData } from "@/types/weather";

const MQTT_URL = process.env.MQTT_URL || "mqtt://192.168.221.4:1883";
const TOPIC = "vicenza/weather/data";

class MqttService {
  private client: mqtt.MqttClient | null = null;
  private listeners: ((data: WeatherData) => void)[] = [];

  constructor() {
    if (typeof window === "undefined") {
      this.connect();
    }
  }

  private connect() {
    this.client = mqtt.connect(MQTT_URL, {
      reconnectPeriod: 5000,
      connectTimeout: 30 * 1000,
    });

    this.client.on("connect", () => {
      console.log("Connected to MQTT Broker");
      this.client?.subscribe(TOPIC, (err) => {
        if (err) console.error("Subscription error:", err);
      });
    });

    this.client.on("message", (topic, message) => {
      if (topic === TOPIC) {
        try {
          const data: WeatherData = JSON.parse(message.toString());
          this.notifyListeners(data);
        } catch (error) {
          console.error("Failed to parse MQTT message:", error);
        }
      }
    });

    this.client.on("reconnect", () => {
      console.log("Reconnecting to MQTT Broker...");
    });

    this.client.on("error", (err) => {
      console.error("MQTT Error:", err);
    });
  }

  public subscribe(callback: (data: WeatherData) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  private notifyListeners(data: WeatherData) {
    this.listeners.forEach((listener) => {
      try {
        listener(data);
      } catch (e) {
        console.error("Error in MQTT listener:", e);
      }
    });
  }
}

// Global singleton for Next.js hot-reloading
const globalForMqtt = global as unknown as { mqttService: MqttService };
export const mqttService = globalForMqtt.mqttService || new MqttService();
if (process.env.NODE_ENV !== "production") globalForMqtt.mqttService = mqttService;
