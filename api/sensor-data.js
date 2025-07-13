import { calculateMachineStatus, getAlertLevel, validateSensorReadings } from '../utils/machineStatus.js';

let sensorDataHistory = [];
const MAX_HISTORY_POINTS = 50;

class SensorDataGenerator {
  constructor() {
    this.baseValues = {
      current: 15.5,
      voltage: 220.0,
      temperature: 65.0,
      vibration: 12.0
    };
    
    this.trends = {
      current: 0.1,
      voltage: 0.5,
      temperature: 0.3,
      vibration: 0.2
    };
  }

  generateRealisticValue(baseValue, trend, min, max, volatility = 0.1) {
    baseValue += trend * (Math.random() - 0.5) * 2;
    
    const randomChange = (Math.random() - 0.5) * volatility * baseValue;
    let newValue = baseValue + randomChange;
    
    newValue = Math.max(min, Math.min(max, newValue));
    
    return parseFloat(newValue.toFixed(2));
  }

  generateSensorData() {
    this.baseValues.current = this.generateRealisticValue(
      this.baseValues.current, this.trends.current, 10, 25, 0.05
    );
    
    this.baseValues.voltage = this.generateRealisticValue(
      this.baseValues.voltage, this.trends.voltage, 210, 240, 0.02
    );
    
    this.baseValues.temperature = this.generateRealisticValue(
      this.baseValues.temperature, this.trends.temperature, 40, 95, 0.08
    );
    
    this.baseValues.vibration = this.generateRealisticValue(
      this.baseValues.vibration, this.trends.vibration, 5, 30, 0.1
    );

    if (Math.random() < 0.1) {
      Object.keys(this.trends).forEach(key => {
        this.trends[key] = (Math.random() - 0.5) * 0.4;
      });
    }

    return {
      current: this.baseValues.current,
      voltage: this.baseValues.voltage,
      temperature: this.baseValues.temperature,
      vibration: this.baseValues.vibration,
      timestamp: new Date().toISOString()
    };
  }
}

const sensorGenerator = new SensorDataGenerator();

function addToHistory(data) {
  sensorDataHistory.push({
    timestamp: data.timestamp,
    temperature: data.temperature,
    vibration: data.vibration,
    current: data.current,
    voltage: data.voltage,
    status: data.machineStatus.status
  });
  
  if (sensorDataHistory.length > MAX_HISTORY_POINTS) {
    sensorDataHistory.shift();
  }
}

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const sensorData = sensorGenerator.generateSensorData();
    
    const validation = validateSensorReadings(sensorData.temperature, sensorData.vibration);
    if (!validation.isValid) {
      return res.status(400).json({
        error: 'Invalid sensor data',
        details: validation.errors
      });
    }
    
    const machineStatus = calculateMachineStatus(sensorData.temperature, sensorData.vibration);
    const alertLevel = getAlertLevel(machineStatus.status);
    
    const responseData = {
      ...sensorData,
      machineStatus,
      alertLevel
    };
    
    addToHistory(responseData);
    
    res.status(200).json(responseData);
  } catch (error) {
    console.error('Error generating sensor data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
