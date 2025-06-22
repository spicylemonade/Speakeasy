const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const axios = require('axios');

class BiometricMonitor {
  constructor() {
    this.port = null;
    this.parser = null;
    this.isConnected = false;
    this.latestData = {
      userId: 1, // Geby's ID
      heartRate: 0,
      temperature: 0,
      humidity: 0,
      timestamp: new Date().toISOString(),
      stressLevel: 'unknown',
      activity: 'unknown'
    };
    this.onDataCallback = null;
    
    // AI analysis thresholds
    this.thresholds = {
      heartRate: {
        resting: { min: 60, max: 100 },
        elevated: { min: 100, max: 140 },
        high: { min: 140, max: 180 }
      },
      temperature: {
        normal: { min: 36.1, max: 37.2 },
        fever: { min: 37.3, max: 38.0 },
        highFever: { min: 38.1, max: 40.0 }
      }
    };
  }

  async connect(portName = 'COM5', baudRate = 115200) {
    try {
      console.log(`[BiometricMonitor] Attempting to connect to ${portName} @ ${baudRate} baud...`);
      
      this.port = new SerialPort({
        path: portName,
        baudRate: baudRate,
      });

      this.parser = this.port.pipe(new ReadlineParser({ delimiter: '\r\n' }));
      
      this.port.on('open', () => {
        console.log(`[BiometricMonitor] ✅ Connected to Geby's monitor on ${portName}`);
        this.isConnected = true;
      });

      this.port.on('error', (err) => {
        console.error(`[BiometricMonitor] ❌ Serial port error: ${err.message}`);
        this.isConnected = false;
      });

      this.port.on('close', () => {
        console.log('[BiometricMonitor] 🔌 Connection closed');
        this.isConnected = false;
      });

      this.parser.on('data', (data) => {
        this.handleIncomingData(data.trim());
      });

      return true;
    } catch (error) {
      console.error(`[BiometricMonitor] Failed to connect: ${error.message}`);
      this.isConnected = false;
      return false;
    }
  }

  handleIncomingData(rawData) {
    try {
      // Parse CSV format: BPM,Temp,Hum
      const parts = rawData.split(',');
      if (parts.length === 3) {
        const heartRate = parseInt(parts[0]);
        const temperature = parseFloat(parts[1]);
        const humidity = parseFloat(parts[2]);

        // Validate data ranges
        if (heartRate > 0 && heartRate < 220 && 
            temperature > 30 && temperature < 45 && 
            humidity >= 0 && humidity <= 100) {
          
          this.latestData = {
            userId: 1, // Geby
            heartRate: heartRate,
            temperature: temperature,
            humidity: humidity,
            timestamp: new Date().toISOString(),
            stressLevel: this.calculateStressLevel(heartRate, temperature),
            activity: this.determineActivity(heartRate)
          };

          console.log(`[BiometricMonitor] 📊 Geby's vitals: ❤️ ${heartRate} BPM | 🌡️ ${temperature}°C | 💧 ${humidity}%`);
          
          // Trigger AI analysis if needed
          this.analyzeVitals(this.latestData);
          
          // Call callback if set
          if (this.onDataCallback) {
            this.onDataCallback(this.latestData);
          }
        } else {
          console.warn(`[BiometricMonitor] ⚠️ Invalid data ranges: ${rawData}`);
        }
      } else {
        console.warn(`[BiometricMonitor] ⚠️ Unparsed data format: ${rawData}`);
      }
    } catch (error) {
      console.error(`[BiometricMonitor] Error parsing data: ${error.message}`);
    }
  }

  calculateStressLevel(heartRate, temperature) {
    // Enhanced stress calculation based on heart rate and temperature
    if (heartRate > this.thresholds.heartRate.high.min || 
        temperature > this.thresholds.temperature.fever.min) {
      return 'high';
    } else if (heartRate > this.thresholds.heartRate.elevated.min || 
               temperature > this.thresholds.temperature.normal.max) {
      return 'medium';
    } else {
      return 'low';
    }
  }

  determineActivity(heartRate) {
    if (heartRate < 70) {
      return 'resting';
    } else if (heartRate < 100) {
      return 'light activity';
    } else if (heartRate < 140) {
      return 'moderate activity';
    } else {
      return 'intense activity';
    }
  }

  async analyzeVitals(vitals) {
    // AI-powered health analysis
    try {
      const alerts = [];
      
      // Heart rate analysis
      if (vitals.heartRate > this.thresholds.heartRate.high.min) {
        alerts.push({
          type: 'warning',
          message: `High heart rate detected: ${vitals.heartRate} BPM. Consider taking a break.`,
          severity: 'high',
          timestamp: vitals.timestamp
        });
      } else if (vitals.heartRate > this.thresholds.heartRate.elevated.min) {
        alerts.push({
          type: 'info',
          message: `Elevated heart rate: ${vitals.heartRate} BPM. Monitor stress levels.`,
          severity: 'medium',
          timestamp: vitals.timestamp
        });
      }

      // Temperature analysis
      if (vitals.temperature > this.thresholds.temperature.fever.min) {
        alerts.push({
          type: 'warning',
          message: `Elevated body temperature: ${vitals.temperature}°C. Stay hydrated.`,
          severity: 'high',
          timestamp: vitals.timestamp
        });
      }

      // Stress pattern detection
      if (vitals.stressLevel === 'high') {
        alerts.push({
          type: 'suggestion',
          message: 'High stress detected. Try some breathing exercises or take a short walk.',
          severity: 'medium',
          timestamp: vitals.timestamp
        });
      }

      // Store alerts for later retrieval
      if (alerts.length > 0) {
        console.log(`[BiometricMonitor] 🚨 Generated ${alerts.length} health alerts for Geby`);
        this.latestData.alerts = alerts;
      }

    } catch (error) {
      console.error(`[BiometricMonitor] AI analysis error: ${error.message}`);
    }
  }

  getLatestData() {
    return this.latestData;
  }

  isActive() {
    return this.isConnected;
  }

  setDataCallback(callback) {
    this.onDataCallback = callback;
  }

  disconnect() {
    if (this.port && this.port.isOpen) {
      this.port.close();
    }
    this.isConnected = false;
    console.log('[BiometricMonitor] Disconnected from GPIO monitor');
  }
}

module.exports = BiometricMonitor; 