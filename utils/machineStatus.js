
const THRESHOLDS = {
  TEMPERATURE: {
    CRITICAL: 80, // °C
    WARNING: 75   // °C (optional warning before critical)
  },
  VIBRATION: {
    CRITICAL: 20, // mm/s
    WARNING: 18   // mm/s (optional warning before critical)
  }
};

const STATUS_TYPES = {
  HEALTHY: 'Healthy',
  WARNING: 'Warning',
  CRITICAL: 'Critical'
};

const STATUS_COLORS = {
  HEALTHY: 'green',
  WARNING: 'yellow',
  CRITICAL: 'red'
};


export function calculateMachineStatus(temperature, vibration) {
  const tempCritical = temperature > THRESHOLDS.TEMPERATURE.CRITICAL;
  const vibrationCritical = vibration > THRESHOLDS.VIBRATION.CRITICAL;
  
  let status, message, priority;
  
  if (tempCritical && vibrationCritical) {
    status = STATUS_TYPES.CRITICAL;
    message = `Critical: High temperature (${temperature}°C) and vibration (${vibration} mm/s) detected`;
    priority = 3;
  } else if (tempCritical) {
    status = STATUS_TYPES.WARNING;
    message = `Warning: High temperature detected (${temperature}°C)`;
    priority = 2;
  } else if (vibrationCritical) {
    status = STATUS_TYPES.WARNING;
    message = `Warning: High vibration detected (${vibration} mm/s)`;
    priority = 2;
  } else {
    status = STATUS_TYPES.HEALTHY;
    message = 'All systems operating normally';
    priority = 1;
  }
  
  return {
    status,
    message,
    color: STATUS_COLORS[status.toUpperCase()],
    priority,
    thresholds: {
      temperature: THRESHOLDS.TEMPERATURE.CRITICAL,
      vibration: THRESHOLDS.VIBRATION.CRITICAL
    },
    readings: {
      temperature: {
        value: temperature,
        unit: '°C',
        critical: tempCritical,
        percentage: Math.min(100, (temperature / THRESHOLDS.TEMPERATURE.CRITICAL) * 100)
      },
      vibration: {
        value: vibration,
        unit: 'mm/s',
        critical: vibrationCritical,
        percentage: Math.min(100, (vibration / THRESHOLDS.VIBRATION.CRITICAL) * 100)
      }
    },
    timestamp: new Date().toISOString()
  };
}


export function getAlertLevel(status) {
  const alertLevels = {
    [STATUS_TYPES.CRITICAL]: {
      level: 'critical',
      shouldAlert: true,
      sound: true,
      blink: true
    },
    [STATUS_TYPES.WARNING]: {
      level: 'warning',
      shouldAlert: true,
      sound: false,
      blink: true
    },
    [STATUS_TYPES.HEALTHY]: {
      level: 'normal',
      shouldAlert: false,
      sound: false,
      blink: false
    }
  };
  
  return alertLevels[status] || alertLevels[STATUS_TYPES.HEALTHY];
}


export function validateSensorReadings(temperature, vibration) {
  const errors = [];
  
  if (typeof temperature !== 'number' || isNaN(temperature)) {
    errors.push('Temperature must be a valid number');
  } else if (temperature < -50 || temperature > 150) {
    errors.push('Temperature reading out of realistic range (-50°C to 150°C)');
  }
  
  if (typeof vibration !== 'number' || isNaN(vibration)) {
    errors.push('Vibration must be a valid number');
  } else if (vibration < 0 || vibration > 100) {
    errors.push('Vibration reading out of realistic range (0 to 100 mm/s)');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export {
  THRESHOLDS,
  STATUS_TYPES,
  STATUS_COLORS
};
