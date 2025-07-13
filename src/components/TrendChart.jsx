import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

function TrendChart({ 
  title, 
  data, 
  dataKey, 
  color = '#3B82F6', 
  unit = '', 
  threshold = null,
  thresholdLabel = 'Threshold'
}) {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-lg">
          <p className="text-gray-600 text-sm mb-1">
            {formatTime(label)}
          </p>
          <p className="font-semibold" style={{ color: data.color }}>
            {`${title}: ${data.value}${unit}`}
          </p>
          {threshold && (
            <p className="text-gray-500 text-xs mt-1">
              {thresholdLabel}: {threshold}{unit}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const getLineColor = () => {
    if (!threshold || !data.length) return color;
    
    const latestValue = data[data.length - 1]?.[dataKey];
    if (latestValue > threshold) {
      return '#EF4444';
    } else if (latestValue > threshold * 0.9) {
      return '#F59E0B';
    }
    return color;
  };

  const lineColor = getLineColor();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title} Trend</h3>
        <div className="flex items-center space-x-2">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: lineColor }}
          ></div>
          <span className="text-sm text-gray-600">Live Data</span>
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey="timestamp"
              tickFormatter={formatTime}
              stroke="#6B7280"
              fontSize={12}
              tick={{ fill: '#6B7280' }}
            />
            <YAxis 
              stroke="#6B7280"
              fontSize={12}
              tick={{ fill: '#6B7280' }}
              label={{ 
                value: unit, 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle', fill: '#6B7280' }
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {threshold && (
              <ReferenceLine 
                y={threshold} 
                stroke="#EF4444" 
                strokeDasharray="5 5"
                strokeWidth={2}
                label={{ 
                  value: `${thresholdLabel}: ${threshold}${unit}`, 
                  position: 'topRight',
                  fill: '#EF4444',
                  fontSize: 12
                }}
              />
            )}
            
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={lineColor}
              strokeWidth={2}
              dot={{ fill: lineColor, strokeWidth: 2, r: 3 }}
              activeDot={{ r: 5, stroke: lineColor, strokeWidth: 2 }}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
        <span>Last {data.length} readings</span>
        {data.length > 0 && (
          <span>
            Current: {data[data.length - 1]?.[dataKey]?.toFixed(1)}{unit}
          </span>
        )}
      </div>
    </div>
  );
}

export default TrendChart;
