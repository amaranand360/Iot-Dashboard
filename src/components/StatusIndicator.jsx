function StatusIndicator({ status, message, color, priority = 1 }) {
  const getStatusConfig = (status, color) => {
    const statusMap = {
      'Critical': {
        bgColor: 'bg-red-100 border-red-300',
        textColor: 'text-red-800',
        iconColor: 'text-red-600',
        icon: '🚨',
        badgeColor: 'bg-red-500',
        animation: 'alert-animation'
      },
      'Warning': {
        bgColor: 'bg-yellow-100 border-yellow-300',
        textColor: 'text-yellow-800',
        iconColor: 'text-yellow-600',
        icon: '⚠️',
        badgeColor: 'bg-yellow-500',
        animation: 'status-indicator'
      },
      'Healthy': {
        bgColor: 'bg-green-100 border-green-300',
        textColor: 'text-green-800',
        iconColor: 'text-green-600',
        icon: '✅',
        badgeColor: 'bg-green-500',
        animation: ''
      }
    };

    return statusMap[status] || statusMap['Healthy'];
  };

  const config = getStatusConfig(status, color);
  
  return (
    <div className={`rounded-xl border-2 p-8 ${config.bgColor} ${config.animation} shadow-lg`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-md mr-6">
            <span className={`text-3xl ${config.iconColor}`}>{config.icon}</span>
          </div>

          <div>
            <div className="flex items-center mb-2">
              <h2 className={`text-3xl font-bold ${config.textColor} mr-4`}>
                Machine Status: {status}
              </h2>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold text-white ${config.badgeColor} shadow-sm`}>
                Priority {priority}
              </span>
            </div>
            <p className={`text-xl ${config.textColor} opacity-90`}>{message}</p>
          </div>
        </div>

        {/* Status indicator light */}
        <div className="flex flex-col items-center">
          <div className={`w-8 h-8 rounded-full ${config.badgeColor} ${config.animation} shadow-lg`}></div>
          <span className={`text-sm ${config.textColor} mt-2 font-bold`}>LIVE</span>
        </div>
      </div>

      {/* Additional status details for critical/warning states */}
      {(status === 'Critical' || status === 'Warning') && (
        <div className={`mt-4 p-3 bg-white rounded border-l-4 ${
          status === 'Critical' ? 'border-red-500' : 'border-yellow-500'
        }`}>
          <div className="flex items-center">
            <span className={`text-sm font-medium ${config.textColor}`}>
              Recommended Action:
            </span>
            <span className={`ml-2 text-sm ${config.textColor} opacity-80`}>
              {status === 'Critical' 
                ? 'Immediate maintenance required - Stop machine operation'
                : 'Schedule maintenance check - Monitor closely'
              }
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default StatusIndicator;
