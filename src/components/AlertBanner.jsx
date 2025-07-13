import { useState, useEffect } from 'react';

function AlertBanner({ status, message, alertLevel }) {
  const [isVisible, setIsVisible] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);

  useEffect(() => {
    if (alertLevel?.shouldAlert) {
      setIsVisible(true);
    }
  }, [alertLevel]);

  useEffect(() => {
    if (alertLevel?.sound && soundEnabled) {
      console.log('🔊 Alert sound would play here');
    }
  }, [alertLevel, soundEnabled]);

  if (!isVisible || !alertLevel?.shouldAlert) {
    return null;
  }

  const getAlertConfig = (status) => {
    const alertConfigs = {
      'Critical': {
        bgColor: 'bg-red-600',
        textColor: 'text-white',
        icon: '🚨',
        borderColor: 'border-red-700',
        buttonColor: 'bg-red-700 hover:bg-red-800'
      },
      'Warning': {
        bgColor: 'bg-yellow-500',
        textColor: 'text-yellow-900',
        icon: '⚠️',
        borderColor: 'border-yellow-600',
        buttonColor: 'bg-yellow-600 hover:bg-yellow-700'
      }
    };

    return alertConfigs[status] || alertConfigs['Warning'];
  };

  const config = getAlertConfig(status);

  return (
    <div className={`${config.bgColor} ${config.textColor} border-b-2 ${config.borderColor} ${
      alertLevel.blink ? 'alert-animation' : ''
    }`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-2xl mr-3">{config.icon}</span>
            <div>
              <span className="font-bold text-lg mr-2">ALERT:</span>
              <span className="text-lg">{message}</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${config.buttonColor} ${config.textColor}`}
              title={soundEnabled ? 'Disable sound alerts' : 'Enable sound alerts'}
            >
              {soundEnabled ? '🔊' : '🔇'}
            </button>

            <button
              onClick={() => setIsVisible(false)}
              className={`px-4 py-1 rounded text-sm font-medium transition-colors ${config.buttonColor} ${config.textColor}`}
            >
              Acknowledge
            </button>

            <button
              onClick={() => setIsVisible(false)}
              className={`text-xl font-bold hover:opacity-75 transition-opacity ${config.textColor}`}
              title="Close alert"
            >
              ×
            </button>
          </div>
        </div>

        {status === 'Critical' && (
          <div className="mt-2 text-sm opacity-90">
            <span className="font-medium">⚡ Immediate action required:</span>
            <span className="ml-1">System parameters have exceeded safe operating limits</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default AlertBanner;
