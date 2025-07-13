import { useState, useEffect } from 'react';
import SensorCard from './SensorCard';
import StatusIndicator from './StatusIndicator';
import AlertBanner from './AlertBanner';
import TrendChart from './TrendChart';

// Configuration from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

let mockBaseValues = {
  current: 15.5,
  voltage: 220.0,
  temperature: 65.0,
  vibration: 12.0
};

function generateMockSensorData() {
  mockBaseValues.current += (Math.random() - 0.5) * 2;
  mockBaseValues.voltage += (Math.random() - 0.5) * 5;
  mockBaseValues.temperature += (Math.random() - 0.5) * 3;
  mockBaseValues.vibration += (Math.random() - 0.5) * 2;

  mockBaseValues.current = Math.max(10, Math.min(25, mockBaseValues.current));
  mockBaseValues.voltage = Math.max(210, Math.min(240, mockBaseValues.voltage));
  mockBaseValues.temperature = Math.max(40, Math.min(95, mockBaseValues.temperature));
  mockBaseValues.vibration = Math.max(5, Math.min(30, mockBaseValues.vibration));

  const temperature = parseFloat(mockBaseValues.temperature.toFixed(2));
  const vibration = parseFloat(mockBaseValues.vibration.toFixed(2));

  let status = 'Healthy';
  let message = 'All systems operating normally';
  let color = 'green';
  let priority = 1;

  if (temperature > 80 && vibration > 20) {
    status = 'Critical';
    message = `Critical: High temperature (${temperature}°C) and vibration (${vibration} mm/s) detected`;
    color = 'red';
    priority = 3;
  } else if (temperature > 80 || vibration > 20) {
    status = 'Warning';
    message = temperature > 80 ? `Warning: High temperature detected (${temperature}°C)` : `Warning: High vibration detected (${vibration} mm/s)`;
    color = 'yellow';
    priority = 2;
  }

  return {
    current: parseFloat(mockBaseValues.current.toFixed(2)),
    voltage: parseFloat(mockBaseValues.voltage.toFixed(2)),
    temperature,
    vibration,
    timestamp: new Date().toISOString(),
    machineStatus: {
      status,
      message,
      color,
      priority,
      thresholds: { temperature: 80, vibration: 20 },
      readings: {
        temperature: {
          value: temperature,
          unit: '°C',
          critical: temperature > 80,
          percentage: Math.min(100, (temperature / 80) * 100)
        },
        vibration: {
          value: vibration,
          unit: 'mm/s',
          critical: vibration > 20,
          percentage: Math.min(100, (vibration / 20) * 100)
        }
      }
    },
    alertLevel: {
      level: status === 'Critical' ? 'critical' : status === 'Warning' ? 'warning' : 'normal',
      shouldAlert: status !== 'Healthy',
      sound: status === 'Critical',
      blink: status !== 'Healthy'
    }
  };
}

function Dashboard() {
  const [sensorData, setSensorData] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [retryCount, setRetryCount] = useState(0);

  const fetchSensorData = async () => {
    console.log('Fetching sensor data...');
    try {
      setConnectionStatus('connecting');

     

      const response = await fetch(`${API_BASE_URL}/sensor-data`);
      console.log('Response:', response);
      console.log('Response OK:', API_BASE_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSensorData(data);
      setLastUpdate(new Date());
      setError(null);
      setConnectionStatus('connected');
      setRetryCount(0);
    } catch (err) {
      console.error('Error fetching sensor data:', err);
      setError(err.message);
      setConnectionStatus('error');
      setRetryCount(prev => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistoricalData = async () => {
    try {
    

      const response = await fetch(`${API_BASE_URL}/historical-data`);
      if (response.ok) {
        const data = await response.json();
        setHistoricalData(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching historical data:', err);
    }
  };

  const generateMockHistoricalData = () => {
    const now = new Date();
    const data = [];

    for (let i = 49; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 2000).toISOString();
      const baseTemp = 65 + Math.sin(i * 0.1) * 15 + (Math.random() - 0.5) * 10;
      const baseVibration = 12 + Math.cos(i * 0.15) * 8 + (Math.random() - 0.5) * 5;

      const temperature = Math.max(40, Math.min(95, baseTemp));
      const vibration = Math.max(5, Math.min(30, baseVibration));

      data.push({
        timestamp,
        temperature: parseFloat(temperature.toFixed(2)),
        vibration: parseFloat(vibration.toFixed(2)),
        current: parseFloat((15.5 + (Math.random() - 0.5) * 4).toFixed(2)),
        voltage: parseFloat((220 + (Math.random() - 0.5) * 10).toFixed(2)),
        status: temperature > 80 && vibration > 20 ? 'Critical' :
                temperature > 80 || vibration > 20 ? 'Warning' : 'Healthy'
      });
    }

    return data;
  };

  useEffect(() => {
    fetchSensorData();
    fetchHistoricalData();

    const interval = setInterval(() => {
      fetchSensorData();
      fetchHistoricalData();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl text-gray-600">Loading Dashboard...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl text-gray-800 mb-2">Connection Error</h2>
          <p className="text-gray-600 mb-4">Unable to connect to the sensor data server.</p>
          <p className="text-sm text-gray-500 mb-4">Error: {error}</p>
          <button
            onClick={fetchSensorData}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-6 shadow-xl">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white">MachineWise Dashboard</h1>
              <p className="text-slate-300 text-lg mt-1">Industrial IoT Monitoring System</p>
              {lastUpdate && (
                <p className="text-slate-400 text-sm mt-2 flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                  Last updated: {lastUpdate.toLocaleTimeString()}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-3 bg-slate-700 px-4 py-2 rounded-lg">
              <div className={`w-3 h-3 rounded-full ${
                connectionStatus === 'connected' ? 'bg-green-400 connection-pulse' :
                connectionStatus === 'connecting' ? 'bg-yellow-400 animate-pulse' :
                'bg-red-400'
              }`}></div>
              <span className="text-sm font-medium">
                {connectionStatus === 'connected' ? 'Connected' :
                 connectionStatus === 'connecting' ? 'Connecting...' :
                 `Connection Error ${retryCount > 0 ? `(${retryCount})` : ''}`}
              </span>
            </div>
          </div>
        </div>
      </header>

      {sensorData && (
        <>
          {sensorData.alertLevel?.shouldAlert && (
            <AlertBanner
              status={sensorData.machineStatus.status}
              message={sensorData.machineStatus.message}
              alertLevel={sensorData.alertLevel}
            />
          )}

          <main className="container mx-auto p-6">
            <div className="mb-8">
              <StatusIndicator
                status={sensorData.machineStatus.status}
                message={sensorData.machineStatus.message}
                color={sensorData.machineStatus.color}
                priority={sensorData.machineStatus.priority}
              />
            </div>

            {(sensorData.machineStatus.status === 'Critical' || sensorData.machineStatus.status === 'Warning') && (
              <div className="mb-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center mb-4">
                    <span className="text-yellow-500 text-xl mr-2">⚠️</span>
                    <h3 className="text-lg font-semibold text-gray-800">Active Alerts:</h3>
                  </div>
                  <ul className="space-y-2">
                    {sensorData.temperature > 80 && (
                      <li className="flex items-center text-red-600">
                        <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                        High temperature detected: {sensorData.temperature.toFixed(1)}°C
                      </li>
                    )}
                    {sensorData.vibration > 20 && (
                      <li className="flex items-center text-red-600">
                        <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                        High vibration detected: {sensorData.vibration.toFixed(1)} mm/s
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <SensorCard
                title="Current"
                value={sensorData.current}
                unit="A"
                icon="⚡"
                color="blue"
                trend={sensorData.current > 20 ? 'up' : sensorData.current < 12 ? 'down' : 'stable'}
                normalRange="15-25A"
              />

              <SensorCard
                title="Voltage"
                value={sensorData.voltage}
                unit="V"
                icon="🔌"
                color="green"
                trend={sensorData.voltage > 230 ? 'up' : sensorData.voltage < 210 ? 'down' : 'stable'}
                normalRange="200-250V"
              />

              <SensorCard
                title="Temperature"
                value={sensorData.temperature}
                unit="°C"
                icon="🌡️"
                color={sensorData.temperature > 80 ? 'red' : sensorData.temperature > 70 ? 'yellow' : 'blue'}
                critical={sensorData.temperature > 80}
                warning={sensorData.temperature > 70}
                trend={sensorData.temperature > 75 ? 'up' : sensorData.temperature < 60 ? 'down' : 'stable'}
                percentage={sensorData.machineStatus.readings?.temperature?.percentage}
                normalRange="<80°C"
                threshold="<80°C"
              />

              <SensorCard
                title="Vibration"
                value={sensorData.vibration}
                unit="mm/s"
                icon="📳"
                color={sensorData.vibration > 20 ? 'red' : sensorData.vibration > 15 ? 'yellow' : 'blue'}
                critical={sensorData.vibration > 20}
                warning={sensorData.vibration > 15}
                trend={sensorData.vibration > 18 ? 'up' : sensorData.vibration < 10 ? 'down' : 'stable'}
                percentage={sensorData.machineStatus.readings?.vibration?.percentage}
                normalRange="<20 mm/s"
                threshold="<20 mm/s"
              />
            </div>

            {historicalData.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Sensor Trends</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <TrendChart
                    title="Temperature"
                    data={historicalData}
                    dataKey="temperature"
                    color="#EF4444"
                    unit="°C"
                    threshold={80}
                    thresholdLabel="Critical Limit"
                  />
                  <TrendChart
                    title="Vibration"
                    data={historicalData}
                    dataKey="vibration"
                    color="#10B981"
                    unit=" mm/s"
                    threshold={20}
                    thresholdLabel="Critical Limit"
                  />
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">System Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Data Timestamp:</span>
                  <p className="font-mono">{new Date(sensorData.timestamp).toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-gray-600">Temperature Threshold:</span>
                  <p className="font-mono">{sensorData.machineStatus.thresholds?.temperature}°C</p>
                </div>
                <div>
                  <span className="text-gray-600">Vibration Threshold:</span>
                  <p className="font-mono">{sensorData.machineStatus.thresholds?.vibration} mm/s</p>
                </div>
              </div>
            </div>
          </main>
        </>
      )}
    </div>
  );
}

export default Dashboard;
