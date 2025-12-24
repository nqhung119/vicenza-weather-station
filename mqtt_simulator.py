#!/usr/bin/env python3
"""
MQTT Simulator cho Vicenza Weather Station
Gửi dữ liệu sensor giả lập lên MQTT broker tại localhost
"""

import json
import time
import random
import paho.mqtt.client as mqtt
from datetime import datetime
import signal
import sys

# Cấu hình MQTT
MQTT_BROKER = "127.0.0.1"
MQTT_PORT = 1883
MQTT_TOPIC = "vicenza/weather/data"
MQTT_USERNAME = None  # Thay đổi nếu broker yêu cầu authentication
MQTT_PASSWORD = None  # Thay đổi nếu broker yêu cầu authentication

# Cấu hình simulator
PUBLISH_INTERVAL = 5  # Gửi dữ liệu mỗi 5 giây
RUNNING = True

# Giá trị khởi tạo (sẽ thay đổi một cách tự nhiên)
class SensorValues:
    def __init__(self):
        self.temp_room = 25.0
        self.hum_room = 60.0
        self.temp_out = 28.0
        self.lux = 500.0
        self.ldr_raw = 1000

sensor = SensorValues()


def on_connect(client, userdata, flags, rc):
    """Callback khi kết nối MQTT"""
    if rc == 0:
        print(f"[✓] Đã kết nối tới MQTT broker: {MQTT_BROKER}:{MQTT_PORT}")
        print(f"[✓] Topic: {MQTT_TOPIC}")
        print(f"[✓] Gửi dữ liệu mỗi {PUBLISH_INTERVAL} giây\n")
    else:
        print(f"[✗] Không thể kết nối. Mã lỗi: {rc}")


def on_disconnect(client, userdata, rc):
    """Callback khi ngắt kết nối"""
    if rc != 0:
        print("[!] Mất kết nối với broker. Đang thử kết nối lại...")


def on_publish(client, userdata, mid):
    """Callback khi publish thành công"""
    pass  # Có thể log nếu cần


def generate_sensor_data():
    """Tạo dữ liệu sensor giả lập với biến đổi tự nhiên"""
    # Nhiệt độ phòng: dao động từ 22-28 độ C
    sensor.temp_room += random.uniform(-0.5, 0.5)
    sensor.temp_room = max(22.0, min(28.0, sensor.temp_room))
    
    # Độ ẩm phòng: dao động từ 40-80%
    sensor.hum_room += random.uniform(-2.0, 2.0)
    sensor.hum_room = max(40.0, min(80.0, sensor.hum_room))
    
    # Nhiệt độ ngoài: dao động từ 25-35 độ C
    sensor.temp_out += random.uniform(-1.0, 1.0)
    sensor.temp_out = max(25.0, min(35.0, sensor.temp_out))
    
    # Ánh sáng (lux): dao động từ 0-2000, có chu kỳ ngày/đêm
    hour = datetime.now().hour
    if 6 <= hour <= 18:  # Ban ngày
        sensor.lux += random.uniform(-50, 100)
        sensor.lux = max(100.0, min(2000.0, sensor.lux))
    else:  # Ban đêm
        sensor.lux = max(0.0, sensor.lux - random.uniform(0, 20))
        sensor.lux = min(50.0, sensor.lux)
    
    # LDR raw: tương quan với lux
    sensor.ldr_raw = int(sensor.lux * 2 + random.uniform(-100, 100))
    sensor.ldr_raw = max(0, min(4000, sensor.ldr_raw))
    
    # Timestamp hiện tại
    timestamp = int(time.time())
    
    return {
        "temp_room": round(sensor.temp_room, 1),
        "hum_room": round(sensor.hum_room, 1),
        "temp_out": round(sensor.temp_out, 1),
        "lux": round(sensor.lux, 1),
        "ldr_raw": sensor.ldr_raw,
        "timestamp": timestamp
    }


def signal_handler(sig, frame):
    """Xử lý tín hiệu Ctrl+C để dừng chương trình"""
    global RUNNING
    print("\n[!] Đang dừng simulator...")
    RUNNING = False
    sys.exit(0)


def main():
    """Hàm chính"""
    # Đăng ký signal handler
    signal.signal(signal.SIGINT, signal_handler)
    
    # Tạo MQTT client
    client = mqtt.Client()
    client.on_connect = on_connect
    client.on_disconnect = on_disconnect
    client.on_publish = on_publish
    
    # Kết nối với authentication nếu có
    if MQTT_USERNAME and MQTT_PASSWORD:
        client.username_pw_set(MQTT_USERNAME, MQTT_PASSWORD)
    
    try:
        # Kết nối tới broker
        print(f"[*] Đang kết nối tới MQTT broker: {MQTT_BROKER}:{MQTT_PORT}...")
        client.connect(MQTT_BROKER, MQTT_PORT, 60)
        client.loop_start()
        
        # Đợi kết nối
        time.sleep(1)
        
        # Vòng lặp gửi dữ liệu
        message_count = 0
        while RUNNING:
            if client.is_connected():
                # Tạo dữ liệu sensor
                data = generate_sensor_data()
                
                # Convert sang JSON
                payload = json.dumps(data)
                
                # Publish lên topic
                result = client.publish(MQTT_TOPIC, payload, qos=1)
                
                if result.rc == mqtt.MQTT_ERR_SUCCESS:
                    message_count += 1
                    timestamp_str = datetime.now().strftime("%H:%M:%S")
                    print(f"[{timestamp_str}] #{message_count} - Gửi dữ liệu:")
                    print(f"    Nhiệt độ phòng: {data['temp_room']}°C")
                    print(f"    Độ ẩm phòng: {data['hum_room']}%")
                    print(f"    Nhiệt độ ngoài: {data['temp_out']}°C")
                    print(f"    Ánh sáng: {data['lux']} lux")
                    print(f"    LDR raw: {data['ldr_raw']}")
                else:
                    print(f"[✗] Lỗi khi gửi dữ liệu. Mã lỗi: {result.rc}")
            else:
                print("[!] Chưa kết nối tới broker. Đang chờ...")
                time.sleep(2)
                continue
            
            # Đợi trước khi gửi lần tiếp theo
            time.sleep(PUBLISH_INTERVAL)
            
    except KeyboardInterrupt:
        print("\n[!] Đang dừng simulator...")
    except Exception as e:
        print(f"[✗] Lỗi: {e}")
    finally:
        # Ngắt kết nối
        client.loop_stop()
        client.disconnect()
        print("[✓] Đã ngắt kết nối MQTT")


if __name__ == "__main__":
    print("=" * 60)
    print("MQTT Simulator - Vicenza Weather Station")
    print("=" * 60)
    main()

