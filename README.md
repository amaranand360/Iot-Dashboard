# MachineWise Dashboard - Industrial IoT Monitoring System

A real-time web dashboard for monitoring industrial machine sensor data, built with React.js. The system displays current, voltage, temperature, and vibration readings with intelligent status monitoring and alert capabilities.

## 🚀 Features

- **Real-time Data Monitoring**: Updates every 2 seconds with live sensor data
- **Intelligent Status Logic**: Automatic machine health assessment based on temperature and vibration thresholds
- **Alert System**: Visual and configurable audio alerts for threshold violations
- **Responsive Design**: Professional industrial-grade UI that works on desktop and mobile
- **Connection Monitoring**: Real-time connection status with retry capabilities
- **Mock Data Generation**: Realistic sensor data simulation with trends and volatility

## 🏗️ Architecture

### Frontend (React.js)
- **Framework**: React 19 with Vite for fast development
- **Styling**: Tailwind CSS for responsive, professional design
- **State Management**: React hooks for local state management
- **Real-time Updates**: Polling-based data fetching every 5 seconds
- **Components**: Modular component architecture for maintainability


## 📊 Machine Status Logic

The system implements intelligent machine health monitoring based on sensor readings:

```javascript
if (temperature > 80°C && vibration > 20 mm/s) {
    status = "Critical"  // Immediate action required
} else if (temperature > 80°C || vibration > 20 mm/s) {
    status = "Warning"   // Schedule maintenance
} else {
    status = "Healthy"   // Normal operation
}
```

### Status Indicators:
- **🟢 Healthy**: All systems operating normally
- **🟡 Warning**: One parameter exceeds threshold - schedule maintenance
- **🔴 Critical**: Multiple parameters critical - immediate action required

## 🛠️ Installation & Setup



### Quick Start

1. **Clone and install dependencies**:
```bash
git clone <repository-url>
cd machineWise-Dashboard
npm install
```

2. **Start the development environment**:
```bash
npm run dev
```

3. **Access the application**:
- Frontend: https://iot-dashboard-murex.vercel.app/



3. **API Endpoints** (after deployment):
- `/api/sensor-data` - Current sensor readings
- `/api/historical-data` - Historical trend data
- `/api/health` - Health check endpoint

