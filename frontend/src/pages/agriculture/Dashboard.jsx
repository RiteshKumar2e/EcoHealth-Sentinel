import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Droplets, Leaf, AlertCircle, Sun, Cloud, Home, Sprout, Settings, BarChart, Truck, Bug, MessageSquare, Users, Cog, Menu, X, ChevronLeft, Bell, Activity } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const [farmData, setFarmData] = useState({
    soilMoisture: 0,
    temperature: 0,
    humidity: 0,
    cropHealth: 0,
    efficiency: 0
  });
  const [predictions, setPredictions] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoaded(true);
    runPredictiveModels();
    generateAlerts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const runPredictiveModels = () => {
    setPredictions([
      { title: 'Yield Prediction', value: '--', confidence: 0, trend: 'neutral', details: 'Awaiting data...' },
      { title: 'Weather Impact', value: '--', confidence: 0, trend: 'neutral', details: 'Awaiting data...' },
      { title: 'Water Optimization', value: '--', confidence: 0, trend: 'neutral', details: 'Awaiting data...' }
    ]);
  };

  const generateAlerts = () => {
    // Currently set to empty to comply with "No Demo Data" rule
    setAlerts([]);
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

  const MetricCard = ({ icon: Icon, iconColor, badge, badgeType, label, value, info, progress, onClick }) => {
    return (
      <div className="metric-card" onClick={onClick}>
        <div className="metric-top">
          <div className="metric-icon-group">
            <div className="metric-icon-box" style={{ background: `${iconColor}15` }}>
              <Icon size={26} color={iconColor} />
            </div>
            <h3 className="metric-label">{label}</h3>
          </div>
          <span className={`badge ${badgeType === 'live' ? 'badge-live' : 'badge-ai'}`}>
            {badge === 'Live' ? <div className="pulse-dot" /> : null}
            {badge}
          </span>
        </div>

        <div className="metric-middle">
          <p className="metric-value">{value}</p>
        </div>

        <div className="metric-bottom">
          {info && <div className="metric-info">{info}</div>}
          {progress !== undefined && (
            <div className="progress-container">
              <div
                className="progress-bar"
                style={{
                  width: isLoaded ? `${Math.max(progress, 2)}%` : '0%',
                  background: iconColor
                }}
              />
            </div>
          )}
        </div>
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
        <button className="back-portal-btn" onClick={() => navigate('/auth/dashboard')}>
          <ChevronLeft size={20} />
          Back to Domain Portal
        </button>
        <h1 className="page-title">Farm Intelligence Dashboard</h1>
        <p className="page-subtitle">AI-powered insights for smarter farming decisions</p>
      </div>

      <div className="metrics-grid">
        <MetricCard
          icon={Droplets}
          iconColor="#2563eb"
          badge="Live"
          badgeType="live"
          label="Soil Moisture"
          value={`${farmData.soilMoisture}%`}
          progress={farmData.soilMoisture}
          onClick={() => navigate('/agriculture/irrigation')}
        />
        <MetricCard
          icon={Sun}
          iconColor="#ea580c"
          badge="Live"
          badgeType="live"
          label="Temperature"
          value={`${farmData.temperature}°C`}
          info={<><Cloud size={14} /> Humidity: {farmData.humidity}%</>}
          onClick={() => navigate('/agriculture/weather')}
        />
        <MetricCard
          icon={Leaf}
          iconColor="#059669"
          badge="AI"
          badgeType="ai"
          label="Crop Health"
          value={`${farmData.cropHealth}%`}
          info={<span style={{ color: '#64748b', fontWeight: 600 }}>Analyzing health...</span>}
          onClick={() => navigate('/agriculture/crop-disease')}
        />
        <MetricCard
          icon={TrendingUp}
          iconColor="#7c3aed"
          badge="AI"
          badgeType="ai"
          label="Efficiency Score"
          value={`${farmData.efficiency}%`}
          info={<span style={{ color: '#64748b', fontWeight: 600 }}>Calculating...</span>}
          onClick={() => navigate('/agriculture/reports')}
        />
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
          <Bell size={24} className="icon-pulse" />
          AI Monitor & Alerts
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
          <Activity size={24} />
          Operational Efficiency Gains
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
