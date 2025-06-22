import serial
import time

PORT = "COM5"     # ← your working USB-Serial port
BAUD = 115200

def main():
    try:
        ser = serial.Serial(PORT, BAUD, timeout=1)
        print(f"Listening on {PORT} @ {BAUD} baud. Press Ctrl-C to quit.\n")
    except serial.SerialException as e:
        print(f"❌ Could not open {PORT}: {e}")
        return

    try:
        while True:
            line = ser.readline().decode("utf-8", errors="ignore").strip()
            if not line:
                continue
            # Expect CSV: BPM,Temp,Hum
            parts = line.split(",")
            if len(parts) == 3:
                bpm, temp, hum = parts
                print(f"❤️ {bpm} BPM | 🌡️ {temp}°C | 💧 {hum}%")
            else:
                print(f"⚠️  Unparsed: {line}")
    except KeyboardInterrupt:
        print("\nExiting…")
    finally:
        ser.close()

if __name__ == "__main__":
    main()
