function SensorCard({
  title,
  value,
  unit,
  icon,
  color = 'blue',
  critical = false,
  warning = false,
  trend = 'stable',
  percentage = null,
  normalRange = null,
  threshold = null
}) {
  const getColorClasses = (color, critical, warning) => {
    if (critical) {
      return {
        bg: 'bg-red-50 border-red-200',
        text: 'text-red-800',
        accent: 'text-red-600',
        icon: 'text-red-500'
      };
    }
    
    if (warning) {
      return {
        bg: 'bg-yellow-50 border-yellow-200',
        text: 'text-yellow-800',
        accent: 'text-yellow-600',
        icon: 'text-yellow-500'
      };
    }

    const colorMap = {
      blue: {
        bg: 'bg-blue-50 border-blue-200',
        text: 'text-blue-800',
        accent: 'text-blue-600',
        icon: 'text-blue-500'
      },
      green: {
        bg: 'bg-green-50 border-green-200',
        text: 'text-green-800',
        accent: 'text-green-600',
        icon: 'text-green-500'
      },
      yellow: {
        bg: 'bg-yellow-50 border-yellow-200',
        text: 'text-yellow-800',
        accent: 'text-yellow-600',
        icon: 'text-yellow-500'
      },
      red: {
        bg: 'bg-red-50 border-red-200',
        text: 'text-red-800',
        accent: 'text-red-600',
        icon: 'text-red-500'
      }
    };

    return colorMap[color] || colorMap.blue;
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return '↗️';
      case 'down':
        return '↘️';
      case 'stable':
      default:
        return '➡️';
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up':
        return 'text-red-500';
      case 'down':
        return 'text-green-500';
      case 'stable':
      default:
        return 'text-gray-500';
    }
  };

  const colors = getColorClasses(color, critical, warning);
  const cardClasses = `sensor-card bg-white rounded-lg shadow-md p-6 border-2 ${colors.bg} ${
    critical ? 'alert-animation' : ''
  }`;

  return (
    <div className={cardClasses}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-semibold ${colors.text}`}>{title}</h3>
        <span className={`text-2xl ${colors.icon}`}>{icon}</span>
      </div>
      
      <div className="mb-3">
        <div className="flex items-baseline">
          <span className={`text-3xl font-bold ${colors.accent}`}>
            {typeof value === 'number' ? value.toFixed(1) : value}
          </span>
          <span className={`text-lg ml-1 ${colors.text}`}>{unit}</span>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm mb-2">
        <div className="flex items-center">
          <span className={getTrendColor(trend)}>{getTrendIcon(trend)}</span>
          <span className={`ml-1 ${colors.text}`}>
            {trend === 'up' ? 'Rising' : trend === 'down' ? 'Falling' : 'Stable'}
          </span>
        </div>

        {percentage !== null && (
          <div className={`text-xs ${colors.text}`}>
            {percentage.toFixed(0)}% of limit
          </div>
        )}
      </div>

      {normalRange && (
        <div className="text-xs text-gray-500 mb-2">
          <span className="font-medium">Normal: </span>{normalRange}
        </div>
      )}

      {threshold && (
        <div className="text-xs text-gray-500">
          <span className="font-medium">Threshold: </span>{threshold}
        </div>
      )}

      {percentage !== null && (
        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                percentage > 100 
                  ? 'bg-red-500' 
                  : percentage > 80 
                    ? 'bg-yellow-500' 
                    : 'bg-blue-500'
              }`}
              style={{ width: `${Math.min(100, percentage)}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Status indicators */}
      {critical && (
        <div className="mt-3 flex items-center text-red-600 text-xs font-medium">
          <span className="w-2 h-2 bg-red-500 rounded-full mr-2 status-indicator"></span>
          CRITICAL
        </div>
      )}
      
      {warning && !critical && (
        <div className="mt-3 flex items-center text-yellow-600 text-xs font-medium">
          <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2 status-indicator"></span>
          WARNING
        </div>
      )}
    </div>
  );
}

export default SensorCard;
