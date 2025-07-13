
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
    const now = new Date();
    const historicalData = [];
    
    for (let i = 49; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 2000).toISOString(); 
      
      const baseTemp = 65 + Math.sin(i * 0.1) * 15 + (Math.random() - 0.5) * 10;
      const baseVibration = 12 + Math.cos(i * 0.15) * 8 + (Math.random() - 0.5) * 5;
      const baseCurrent = 15.5 + Math.sin(i * 0.08) * 3 + (Math.random() - 0.5) * 2;
      const baseVoltage = 220 + Math.cos(i * 0.12) * 10 + (Math.random() - 0.5) * 5;
      
      const temperature = Math.max(40, Math.min(95, baseTemp));
      const vibration = Math.max(5, Math.min(30, baseVibration));
      const current = Math.max(10, Math.min(25, baseCurrent));
      const voltage = Math.max(210, Math.min(240, baseVoltage));
      
      let status = 'Healthy';
      if (temperature > 80 && vibration > 20) {
        status = 'Critical';
      } else if (temperature > 80 || vibration > 20) {
        status = 'Warning';
      }
      
      historicalData.push({
        timestamp,
        temperature: parseFloat(temperature.toFixed(2)),
        vibration: parseFloat(vibration.toFixed(2)),
        current: parseFloat(current.toFixed(2)),
        voltage: parseFloat(voltage.toFixed(2)),
        status
      });
    }
    
    res.status(200).json({
      data: historicalData,
      count: historicalData.length,
      maxPoints: 50
    });
  } catch (error) {
    console.error('Error generating historical data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
