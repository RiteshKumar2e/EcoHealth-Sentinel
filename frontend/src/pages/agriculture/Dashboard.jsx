import React, { useState, useEffect } from 'react';
import { TrendingUp, Droplets, Leaf, AlertCircle, Sun, Cloud, Home, Sprout, Settings, BarChart, Truck, Bug, MessageSquare, Users, Cog, Menu, X } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const [farmData] = useState({
    soilMoisture: 65,
    temperature: 28,
    humidity: 72,
    cropHealth: 88,
    efficiency: 92
  });

  const [predictions, setPredictions] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    setIsLoaded(true);
    runPredictiveModels();
    generateAlerts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const runPredictiveModels = () => {
    const { soilMoisture, temperature, cropHealth } = farmData;

    const yieldFactor = (soilMoisture * 0.4 + cropHealth * 0.5 + (100 - Math.abs(temperature - 25) * 2) * 0.1) / 100;
    const predictedYield = (yieldFactor * 5000).toFixed(0);

    const weatherImpact = temperature > 35 ? 'High heat may reduce yield by 15%' : 'Favorable conditions';
    const waterOptimization = soilMoisture < 60 ? 'Increase irrigation by 10%' : 'Current levels optimal';

    setPredictions([
      { title: 'Yield Prediction', value: `${predictedYield} kg/hectare`, confidence: 87, trend: 'up', details: 'Based on current conditions and historical data' },
      { title: 'Weather Impact', value: weatherImpact, confidence: 92, trend: temperature > 35 ? 'down' : 'neutral', details: '7-day forecast analysis' },
      { title: 'Water Optimization', value: waterOptimization, confidence: 85, trend: 'neutral', details: 'AI-recommended irrigation schedule' }
    ]);
  };

  const generateAlerts = () => {
    const newAlerts = [
      { type: 'info', title: 'Market Price Alert', message: 'Tomato prices up 12% - good time to sell', priority: 'low' },
      { type: 'warning', title: 'Irrigation Reminder', message: 'Schedule next watering in 4 hours', priority: 'medium' }
    ];
    setAlerts(newAlerts);
  };

  const navigate = (path) => {
    window.location.href = path;
  };

  const SidebarItem = ({ path, icon: Icon, label, isActive }) => {
    return (
      <div
        onClick={() => navigate(path)}
        className={`sidebar-item ${isActive ? 'active' : ''}`}
      >
        <Icon size={20} />
        {label}
      </div>
    );
  };

  const MetricCard = ({ icon: Icon, iconColor, badge, badgeType, label, value, info, progress }) => {
    return (
      <div className="metric-card">
        <div className="metric-card-header">
          <Icon size={32} color={iconColor} />
          <span className={`badge ${badgeType === 'live' ? 'badge-live' : 'badge-ai'}`}>
            {badge}
          </span>
        </div>
        <h3 className="metric-label">{label}</h3>
        <p className="metric-value">{value}</p>
        {info && <p className="metric-info">{info}</p>}
        {progress !== undefined && (
          <div className="progress-container">
            <div
              className="progress-bar"
              style={{ width: isLoaded ? `${progress}%` : '0%' }}
            />
          </div>
        )}
      </div>
    );
  };

  const currentPath = window.location.pathname || '/agriculture/dashboard';

  const getAlertClass = (type) => {
    switch (type) {
      case 'alert': return 'alert-type-alert';
      case 'warning': return 'alert-type-warning';
      case 'info': return 'alert-type-info';
      default: return 'alert-type-info';
    }
  };

  return (
    <div className="dashboard-content">
      <div className="page-header">
        <h1 className="page-title">Farm Intelligence Dashboard</h1>
        <p className="page-subtitle">AI-powered insights for smarter farming decisions</p>
      </div>

      <div className="metrics-grid">
        <MetricCard icon={Droplets} iconColor="#2563eb" badge="Live" badgeType="live" label="Soil Moisture" value={`${farmData.soilMoisture}%`} progress={farmData.soilMoisture} />
        <MetricCard icon={Sun} iconColor="#ea580c" badge="Live" badgeType="live" label="Temperature" value={`${farmData.temperature}°C`} info={<><Cloud size={14} /> Humidity: {farmData.humidity}%</>} />
        <MetricCard icon={Leaf} iconColor="#059669" badge="AI" badgeType="ai" label="Crop Health" value={`${farmData.cropHealth}%`} info={<span style={{ color: '#059669', fontWeight: 600 }}>↑ 5% from last week</span>} />
        <MetricCard icon={TrendingUp} iconColor="#7c3aed" badge="AI" badgeType="ai" label="Efficiency Score" value={`${farmData.efficiency}%`} info={<span style={{ color: '#059669', fontWeight: 600 }}>Optimal performance</span>} />
      </div>

      <div className="predictions-grid">
        {predictions.map((pred, idx) => (
          <div key={idx} className="prediction-card">
            <div className="prediction-header">
              <h3 className="prediction-title-text">{pred.title}</h3>
              <div className="confidence-badge">
                <span className="confidence-value">{pred.confidence}%</span>
                <span>confident</span>
              </div>
            </div>
            <p className="prediction-value">{pred.value}</p>
            <p className="prediction-details">{pred.details}</p>
            {pred.trend === 'up' && (
              <div className="trend-badge">
                <TrendingUp size={16} />
                Positive trend
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="alerts-section">
        <h2 className="alerts-header">
          <AlertCircle size={28} color="#ea580c" />
          AI Alerts & Recommendations
        </h2>
        <div className="alerts-list">
          {alerts.map((alert, idx) => (
            <div key={idx} className={`alert-item ${getAlertClass(alert.type)}`}>
              <div className="alert-content-wrapper">
                <h4>{alert.title}</h4>
                <p>{alert.message}</p>
              </div>
              <span className="priority-badge">
                {alert.priority.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="impact-section">
        <h2 className="impact-header">
          <TrendingUp size={28} />
          AI Impact on Your Farm
        </h2>
        <div className="impact-grid">
          {[
            { value: '30%', label: 'Water Saved', width: 30 },
            { value: '25%', label: 'Yield Increase', width: 25 },
            { value: '40%', label: 'Cost Reduction', width: 40 },
            { value: '50%', label: 'Pesticide Reduction', width: 50 }
          ].map((item, idx) => (
            <div key={idx} className="impact-card">
              <p className="impact-value">{item.value}</p>
              <p className="impact-label">{item.label}</p>
              <div className="impact-progress-container">
                <div
                  className="impact-progress-bar"
                  style={{ width: isLoaded ? `${item.width}%` : '0%' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
