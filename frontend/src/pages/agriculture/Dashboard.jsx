import React, { useState, useEffect } from 'react';
import { TrendingUp, Droplets, Leaf, AlertCircle, Sun, Cloud, Home, Sprout, Settings, BarChart, Truck, Bug, MessageSquare, Users, Cog, Menu, X } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const [farmData] = useState({
    soilMoisture: 0,
    temperature: 0,
    humidity: 0,
    cropHealth: 0,
    efficiency: 0
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
    setPredictions([
      { title: 'Yield Prediction', value: '0 kg/hectare', confidence: 0, trend: 'neutral', details: 'Waiting for sensor data...' },
      { title: 'Weather Impact', value: 'Monitoring...', confidence: 0, trend: 'neutral', details: 'Analyzing local weather station' },
      { title: 'Water Optimization', value: 'Syncing...', confidence: 0, trend: 'neutral', details: 'Calculating irrigation needs' }
    ]);
  };

  const generateAlerts = () => {
    setAlerts([]); // Clear all demo alerts
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
        <MetricCard icon={Leaf} iconColor="#059669" badge="AI" badgeType="ai" label="Crop Health" value={`${farmData.cropHealth}%`} info={<span style={{ color: '#64748b', fontWeight: 600 }}>Analyzing health...</span>} />
        <MetricCard icon={TrendingUp} iconColor="#7c3aed" badge="AI" badgeType="ai" label="Efficiency Score" value={`${farmData.efficiency}%`} info={<span style={{ color: '#64748b', fontWeight: 600 }}>Calculating...</span>} />
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
          {alerts.length > 0 ? (
            alerts.map((alert, idx) => (
              <div key={idx} className={`alert-item ${getAlertClass(alert.type)}`}>
                <div className="alert-content-wrapper">
                  <h4>{alert.title}</h4>
                  <p>{alert.message}</p>
                </div>
                <span className="priority-badge">
                  {alert.priority.toUpperCase()}
                </span>
              </div>
            ))
          ) : (
            <div className="alert-item alert-type-info">
              <div className="alert-content-wrapper">
                <h4>No Active Alerts</h4>
                <p>All systems are running normally. No critical issues detected.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="impact-section">
        <h2 className="impact-header">
          <TrendingUp size={28} />
          AI Impact on Your Farm
        </h2>
        <div className="impact-grid">
          {[
            { value: '0%', label: 'Water Saved', width: 0 },
            { value: '0%', label: 'Yield Increase', width: 0 },
            { value: '0%', label: 'Cost Reduction', width: 0 },
            { value: '0%', label: 'Pesticide Reduction', width: 0 }
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
