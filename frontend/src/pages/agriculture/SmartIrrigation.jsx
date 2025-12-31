import React, { useState, useEffect, useCallback } from 'react';
import { Droplets, Zap, TrendingDown, Calendar, Thermometer, Cloud, Shield, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import './SmartIrrigation.css';

const SmartIrrigation = () => {
  const [soilMoisture, setSoilMoisture] = useState(65);
  const [irrigationMode, setIrrigationMode] = useState('auto');
  const [isIrrigating, setIsIrrigating] = useState(false);
  const [waterUsage, setWaterUsage] = useState(450);
  const [mounted, setMounted] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isConnected, setIsConnected] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const [schedule, setSchedule] = useState([
    { day: 'Monday', time: '6:00 AM', duration: 30, status: 'completed' },
    { day: 'Tuesday', time: '6:00 AM', duration: 30, status: 'completed' },
    { day: 'Wednesday', time: '6:00 AM', duration: 30, status: 'scheduled' },
    { day: 'Thursday', time: '6:00 AM', duration: 30, status: 'scheduled' },
    { day: 'Friday', time: '6:00 AM', duration: 30, status: 'scheduled' }
  ]);

  const [weatherData, setWeatherData] = useState({
    temperature: 28,
    humidity: 72,
    rainfall: 0,
    forecast: 'Clear skies for next 3 days'
  });

  // Simulate backend API call
  const fetchDataFromBackend = useCallback(async () => {
    setIsRefreshing(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simulate dynamic data from backend
      const mockBackendData = {
        soilMoisture: Math.floor(Math.random() * 30) + 50, // 50-80%
        weatherData: {
          temperature: Math.floor(Math.random() * 10) + 25, // 25-35°C
          humidity: Math.floor(Math.random() * 20) + 60, // 60-80%
          rainfall: Math.random() > 0.7 ? Math.floor(Math.random() * 5) : 0,
          forecast: Math.random() > 0.5 ? 'Clear skies for next 3 days' : 'Light rain expected tomorrow'
        },
        waterUsage: Math.floor(Math.random() * 100) + 400, // 400-500L
        isIrrigating: Math.random() > 0.8,
        irrigationMode: Math.random() > 0.5 ? 'auto' : 'manual'
      };

      // Update state with backend data
      setSoilMoisture(mockBackendData.soilMoisture);
      setWeatherData(mockBackendData.weatherData);
      setWaterUsage(mockBackendData.waterUsage);
      setIsIrrigating(mockBackendData.isIrrigating);
      setIrrigationMode(mockBackendData.irrigationMode);
      setLastUpdated(new Date());
      setIsConnected(true);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setIsConnected(false);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // Manual refresh
  const handleManualRefresh = () => {
    fetchDataFromBackend();
  };

  // Auto-refresh every 30 seconds
  useEffect(() => {
    setMounted(true);
    fetchDataFromBackend();

    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchDataFromBackend();
      }, 30000); // 30 seconds

      return () => clearInterval(interval);
    }
  }, [autoRefresh, fetchDataFromBackend]);

  const getIrrigationRecommendation = () => {
    const { temperature, humidity, rainfall } = weatherData;

    // eslint-disable-next-line no-unused-vars
    let needsWater = false;
    let reason = '';
    let urgency = 'low';

    if (soilMoisture < 50) {
      needsWater = true;
      urgency = 'high';
      reason = 'Soil moisture critically low';
    } else if (soilMoisture < 60 && temperature > 30) {
      needsWater = true;
      urgency = 'medium';
      reason = 'High temperature increasing evaporation';
    } else if (soilMoisture < 65 && rainfall === 0) {
      needsWater = true;
      urgency = 'low';
      reason = 'Preventive irrigation recommended';
    } else {
      reason = 'Soil moisture optimal';
    }

    return { needsWater, reason, urgency };
  };

  const recommendation = getIrrigationRecommendation();

  const toggleIrrigation = async () => {
    // Simulate sending command to backend
    setIsIrrigating(!isIrrigating);

    if (!isIrrigating) {
      const interval = setInterval(() => {
        setSoilMoisture(prev => {
          if (prev >= 75) {
            clearInterval(interval);
            setIsIrrigating(false);
            return 75;
          }
          return prev + 1;
        });
        setWaterUsage(prev => prev + 5);
      }, 1000);
    }
  };

  const updateIrrigationMode = async (mode) => {
    setIrrigationMode(mode);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="irrigation-container">
      <div className="bg-circle-1"></div>
      <div className="bg-circle-2"></div>
      <div className="irrigation-wrapper">
        {/* Header with Refresh Controls */}
        <div className={`irrigation-card card-hover ${mounted ? 'fade-in-up' : ''}`}>
          <div className="header-flex">
            <div className="header-title-box">
              <div className="water-ripple">
                <Droplets className="icon-hover" style={{ width: '32px', height: '32px', color: '#2563eb' }} />
              </div>
              <div>
                <h1 className="header-title">Smart Irrigation</h1>
                <p className="header-subtitle">AI-optimized water management</p>
              </div>
            </div>

            <div className="controls-box">
              {/* Connection Status */}
              <div className={`indicator-pill ${isConnected ? 'indicator-connected' : 'indicator-disconnected'}`}>
                {isConnected ? (
                  <Wifi style={{ width: '16px', height: '16px' }} />
                ) : (
                  <WifiOff style={{ width: '16px', height: '16px' }} />
                )}
                <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
              </div>

              {/* Auto-refresh Toggle */}
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className="button-hover auto-refresh-btn"
                style={{
                  color: autoRefresh ? '#2563eb' : '#6b7280',
                  border: `2px solid ${autoRefresh ? '#2563eb' : '#d1d5db'}`,
                }}
              >
                <RefreshCw style={{ width: '14px', height: '14px' }} />
                <span>Auto: {autoRefresh ? 'ON' : 'OFF'}</span>
              </button>

              {/* Manual Refresh Button */}
              <button
                onClick={handleManualRefresh}
                disabled={isRefreshing}
                className="button-hover refresh-manual-btn"
              >
                <RefreshCw className={isRefreshing ? 'spin-animation' : ''} style={{ width: '16px', height: '16px' }} />
                <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
              </button>

              {/* Last Updated */}
              <div className="indicator-pill text-gray-500">
                Updated: {formatTime(lastUpdated)}
              </div>

              {/* Water Saved Badge */}
              <div className="glow-effect indicator-pill" style={{ color: '#2563eb', fontWeight: '600', padding: '8px 16px' }}>
                <Shield className="pulse-animation" style={{ width: '20px', height: '20px' }} />
                <span>Water Saved: 30%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="main-content-grid">
          {/* Main Content */}
          <div className="left-panel">
            {/* Metrics Cards */}
            <div className="metrics-grid">
              <div className="irrigation-card card-hover fade-in-up stagger-1">
                <div className="metric-header">
                  <Droplets className={`icon-hover ${isIrrigating ? 'wave-animation' : ''}`} style={{ width: '32px', height: '32px', color: '#2563eb' }} />
                  <span className={`badge ${soilMoisture < 50 ? 'urgency-high' : 'urgency-low'}`} style={{ background: soilMoisture < 50 ? '#fee2e2' : '#dcfce7', color: soilMoisture < 50 ? '#b91c1c' : '#16a34a' }}>
                    {soilMoisture < 50 ? 'Low' : soilMoisture < 65 ? 'Medium' : 'Optimal'}
                  </span>
                </div>
                <h3 className="metric-label">Soil Moisture</h3>
                <p className="metric-value">{soilMoisture}%</p>
                <div className="progress-bar-container">
                  <div className="progress-bar" style={{ width: `${soilMoisture}%` }}></div>
                </div>
              </div>

              <div className="irrigation-card card-hover fade-in-up stagger-2">
                <div className="metric-header">
                  <Thermometer className="icon-hover pulse-animation" style={{ width: '32px', height: '32px', color: '#ea580c' }} />
                  <span className="badge pulse-animation" style={{ background: '#fed7aa', color: '#9a3412' }}>Live</span>
                </div>
                <h3 className="metric-label">Temperature</h3>
                <p className="metric-value">{weatherData.temperature}°C</p>
                <p className="metric-subtext">Humidity: {weatherData.humidity}%</p>
              </div>

              <div className="irrigation-card card-hover fade-in-up stagger-3">
                <div className="metric-header">
                  <TrendingDown className="icon-hover" style={{ width: '32px', height: '32px', color: '#16a34a' }} />
                  <span className="badge" style={{ background: '#dcfce7', color: '#16a34a' }}>This Week</span>
                </div>
                <h3 className="metric-label">Water Used</h3>
                <p className="metric-value">{waterUsage}L</p>
                <p className="metric-subtext metric-positive">↓ 30% vs last week</p>
              </div>
            </div>

            {/* AI Recommendation */}
            <div className={`irrigation-card card-hover fade-in-up stagger-4 urgency-${recommendation.urgency}`}>
              <h3 className="rec-title">
                <Zap className="icon-hover pulse-animation" style={{ width: '20px', height: '20px' }} />
                AI Recommendation
              </h3>
              <p className="rec-text">{recommendation.reason}</p>
              {recommendation.needsWater && (
                <div className="rec-actions">
                  <button
                    onClick={toggleIrrigation}
                    className={`button-hover action-btn-primary ${isIrrigating ? 'action-btn-danger' : ''}`}
                  >
                    {isIrrigating ? 'Stop Irrigation' : 'Start Irrigation'}
                  </button>
                  {!isIrrigating && (
                    <button className="button-hover action-btn-secondary">
                      Schedule for Later
                    </button>
                  )}
                </div>
              )}
              {!recommendation.needsWater && (
                <div className="no-irrigation-msg">
                  ✓ No irrigation needed. Next check scheduled for tomorrow at 6:00 AM
                </div>
              )}
            </div>

            {/* Mode Control */}
            <div className="irrigation-card card-hover fade-in-up stagger-5">
              <h3 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>Irrigation Mode</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <button
                  onClick={() => updateIrrigationMode('auto')}
                  className={`button-hover mode-button ${irrigationMode === 'auto' ? 'active' : ''}`}
                >
                  <Zap className="icon-hover" style={{ width: '24px', height: '24px', color: '#3b82f6', marginBottom: '8px' }} />
                  <div style={{ fontWeight: '600', color: '#1f2937' }}>Automatic</div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>AI-controlled based on conditions</div>
                </button>
                <button
                  onClick={() => updateIrrigationMode('manual')}
                  className={`button-hover mode-button ${irrigationMode === 'manual' ? 'active' : ''}`}
                >
                  <Calendar className="icon-hover" style={{ width: '24px', height: '24px', color: '#6b7280', marginBottom: '8px' }} />
                  <div style={{ fontWeight: '600', color: '#1f2937' }}>Manual</div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>You control when to irrigate</div>
                </button>
              </div>
            </div>

            {/* Schedule */}
            <div className="irrigation-card card-hover fade-in-up">
              <h3 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>Weekly Schedule</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {schedule.map((item, idx) => (
                  <div key={idx} className="schedule-item card-hover">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div className={item.status === 'scheduled' ? 'pulse-animation' : ''} style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: item.status === 'completed' ? '#16a34a' : '#3b82f6'
                      }}></div>
                      <div>
                        <div style={{ fontWeight: '500', color: '#1f2937' }}>{item.day}</div>
                        <div style={{ fontSize: '14px', color: '#6b7280' }}>{item.time} • {item.duration} minutes</div>
                      </div>
                    </div>
                    <span className="badge" style={{
                      background: item.status === 'completed' ? '#dcfce7' : '#dbeafe',
                      color: item.status === 'completed' ? '#16a34a' : '#2563eb'
                    }}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="right-panel">
            {/* Weather */}
            <div className={`irrigation-card card-hover ${mounted ? 'slide-in-right stagger-1' : ''}`}>
              <h3 className="rec-title">
                <Cloud className="icon-hover float-animation" style={{ width: '20px', height: '20px', color: '#2563eb' }} />
                Weather Forecast
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="weather-row">
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>Temperature</span>
                  <span style={{ fontWeight: '600', color: '#1f2937' }}>{weatherData.temperature}°C</span>
                </div>
                <div className="weather-row">
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>Humidity</span>
                  <span style={{ fontWeight: '600', color: '#1f2937' }}>{weatherData.humidity}%</span>
                </div>
                <div className="weather-row">
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>Rainfall</span>
                  <span style={{ fontWeight: '600', color: '#1f2937' }}>{weatherData.rainfall} mm</span>
                </div>
              </div>
              <div className="shimmer-bg weather-forecast-box">
                {weatherData.forecast}
              </div>
            </div>

            {/* Impact */}
            <div className={`impact-card card-hover ${mounted ? 'slide-in-right stagger-2' : ''}`}>
              <h3 style={{ fontWeight: '600', marginBottom: '16px' }}>Monthly Impact</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="button-hover">
                  <p className="impact-value">1,800L</p>
                  <p className="impact-label">Water Saved</p>
                </div>
                <div className="button-hover">
                  <p className="impact-value">₹540</p>
                  <p className="impact-label">Cost Saved</p>
                </div>
                <div className="button-hover">
                  <p className="impact-value">92%</p>
                  <p className="impact-label">Efficiency Score</p>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className={`irrigation-card card-hover ${mounted ? 'slide-in-right stagger-3' : ''}`}>
              <h3 className="rec-title">
                <Shield className="icon-hover" style={{ width: '20px', height: '20px', color: '#16a34a' }} />
                AI Features
              </h3>
              <ul className="feature-list">
                <li className="feature-item button-hover">
                  <span style={{ color: '#16a34a' }}>✓</span>
                  <span>Real-time soil moisture monitoring</span>
                </li>
                <li className="feature-item button-hover">
                  <span style={{ color: '#16a34a' }}>✓</span>
                  <span>Weather-based irrigation scheduling</span>
                </li>
                <li className="feature-item button-hover">
                  <span style={{ color: '#16a34a' }}>✓</span>
                  <span>Crop-specific water requirements</span>
                </li>
                <li className="feature-item button-hover">
                  <span style={{ color: '#16a34a' }}>✓</span>
                  <span>Automated water flow control</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartIrrigation;