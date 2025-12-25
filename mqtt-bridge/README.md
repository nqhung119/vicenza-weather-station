# MQTT Bridge Service

Service độc lập chạy trong Docker để bridge dữ liệu từ local MQTT broker lên HiveMQ.

## Chức năng

- Subscribe dữ liệu từ local MQTT broker (192.168.221.4)
- Publish dữ liệu lên HiveMQ mỗi 5 phút
- Tự động reconnect khi mất kết nối
- Chạy độc lập với network_mode: host để truy cập local MQTT broker

## Cấu hình

Set các environment variables sau:

- `LOCAL_MQTT_HOST`: Địa chỉ local MQTT broker (mặc định: 192.168.221.4)
- `LOCAL_MQTT_PORT`: Port local MQTT broker (mặc định: 1883)
- `LOCAL_MQTT_TOPIC`: Topic để subscribe (mặc định: vicenza/weather/data)
- `LOCAL_MQTT_USERNAME`: Username cho local MQTT (optional)
- `LOCAL_MQTT_PASSWORD`: Password cho local MQTT (optional)
- `HIVEMQ_HOST`: Địa chỉ HiveMQ broker (required)
- `HIVEMQ_PORT`: Port HiveMQ broker (mặc định: 8883)
- `HIVEMQ_TOPIC`: Topic để publish lên HiveMQ (mặc định: vicenza/weather/data)
- `HIVEMQ_USERNAME`: Username cho HiveMQ (required)
- `HIVEMQ_PASSWORD`: Password cho HiveMQ (required)
- `HIVEMQ_CLIENT_ID`: Client ID cho HiveMQ (mặc định: vicenza-bridge)

## Chạy với Docker

### Build image

```bash
docker build -t mqtt-bridge ./mqtt-bridge
```

### Chạy container

```bash
docker run -d \
  --name mqtt-bridge \
  --network host \
  -e LOCAL_MQTT_HOST=192.168.221.4 \
  -e HIVEMQ_HOST=your-hivemq-broker.hivemq.cloud \
  -e HIVEMQ_USERNAME=your-username \
  -e HIVEMQ_PASSWORD=your-password \
  mqtt-bridge
```

### Hoặc dùng Docker Compose

Xem file `docker-compose.yml` ở thư mục root.

## Logs

Xem logs của service:

```bash
docker logs -f mqtt-bridge
```

## Format dữ liệu

Service expect và publish dữ liệu theo format:

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

