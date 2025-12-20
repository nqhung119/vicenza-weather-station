export interface WeatherData {
  temp_room: number;
  hum_room: number;
  temp_out: number;
  lux: number;
  ldr_raw: number;
  timestamp: number;
}

export interface WeatherState extends WeatherData {
  isConnected: boolean;
  lastUpdate: Date;
}
