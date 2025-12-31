import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity, TrendingUp, TrendingDown, AlertCircle, Leaf, Droplets, Wind, Sun, Home, Settings, Recycle, Cloud, FileText, Cog, MessageSquare, MapPin, Zap, Shield, TreePine, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import './Dashboard.css';

// Sidebar Item Component
const SidebarItem = ({ path, icon: Icon, label, isActive, onClick, collapsed }) => {
  return (
    <div
      onClick={() => onClick(path)}
      className={`sidebar-item ${isActive ? 'active' : ''} ${collapsed ? 'collapsed' : ''}`}
      title={collapsed ? label : ''}
    >
      <Icon size={20} className="sidebar-icon" />
      {!collapsed && <span className="sidebar-label">{label}</span>}
    </div>
  );
};

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [timeRange, setTimeRange] = useState('week');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Backend Data States
  const [environmentalMetrics, setEnvironmentalMetrics] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [emissionsBySource, setEmissionsBySource] = useState([]);
  const [conservationProgress, setConservationProgress] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [regionalComparison, setRegionalComparison] = useState([]);
  const [aiInsights, setAiInsights] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE_URL = 'http://localhost:5000/api';

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch all dashboard data on mount and when timeRange changes
  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  // Fetch all dashboard data from backend
  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      const authToken = localStorage.getItem('authToken');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      };

      // Parallel API calls
      const [
        metricsRes,
        trendsRes,
        emissionsRes,
        progressRes,
        alertsRes,
        regionalRes,
        insightsRes
      ] = await Promise.all([
        fetch(`${API_BASE_URL}/environment/metrics?timeRange=${timeRange}`, { headers }),
        fetch(`${API_BASE_URL}/environment/trends?timeRange=${timeRange}`, { headers }),
        fetch(`${API_BASE_URL}/environment/emissions?timeRange=${timeRange}`, { headers }),
        fetch(`${API_BASE_URL}/environment/conservation-progress`, { headers }),
        fetch(`${API_BASE_URL}/environment/alerts`, { headers }),
        fetch(`${API_BASE_URL}/environment/regional-comparison`, { headers }),
        fetch(`${API_BASE_URL}/environment/ai-insights`, { headers })
      ]);

      if (!metricsRes.ok || !trendsRes.ok || !emissionsRes.ok || !progressRes.ok ||
        !alertsRes.ok || !regionalRes.ok || !insightsRes.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const metricsData = await metricsRes.json();
      const trendsData = await trendsRes.json();
      const emissionsData = await emissionsRes.json();
      const progressData = await progressRes.json();
      const alertsData = await alertsRes.json();
      const regionalData = await regionalRes.json();
      const insightsData = await insightsRes.json();

      setEnvironmentalMetrics(metricsData.data || metricsData || []);
      setWeeklyData(trendsData.data || trendsData || []);
      setEmissionsBySource(emissionsData.data || emissionsData || []);
      setConservationProgress(progressData.data || progressData || []);
      setAlerts(alertsData.data || alertsData || []);
      setRegionalComparison(regionalData.data || regionalData || []);
      setAiInsights(insightsData.data || insightsData || []);

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
      loadDummyData();
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadDummyData = () => {
    setEnvironmentalMetrics([
      { icon: 'Leaf', title: 'Air Quality Index', value: 156, unit: 'AQI', change: -12, status: 'moderate', color: '#f59e0b', bgColor: '#fef3c7', trend: 'down' },
      { icon: 'Droplets', title: 'Water Quality', value: 78, unit: '/100', change: 5, status: 'good', color: '#3b82f6', bgColor: '#dbeafe', trend: 'up' },
      { icon: 'Wind', title: 'CO2 Levels', value: 421, unit: 'ppm', change: 2.3, status: 'warning', color: '#ef4444', bgColor: '#fee2e2', trend: 'up' },
      { icon: 'Sun', title: 'Solar Radiation', value: 5.2, unit: 'kWh/m²', change: 0.8, status: 'excellent', color: '#f97316', bgColor: '#ffedd5', trend: 'up' }
    ]);

    setWeeklyData([
      { day: 'Mon', aqi: 145, water: 75, co2: 418, temp: 28 },
      { day: 'Tue', aqi: 152, water: 76, co2: 419, temp: 29 },
      { day: 'Wed', aqi: 168, water: 74, co2: 420, temp: 30 },
      { day: 'Thu', aqi: 155, water: 77, co2: 421, temp: 29 },
      { day: 'Fri', aqi: 149, water: 78, co2: 422, temp: 28 },
      { day: 'Sat', aqi: 142, water: 79, co2: 420, temp: 27 },
      { day: 'Sun', aqi: 156, water: 78, co2: 421, temp: 28 }
    ]);

    setEmissionsBySource([
      { name: 'Transportation', value: 35, color: '#ef4444' },
      { name: 'Industry', value: 28, color: '#f59e0b' },
      { name: 'Agriculture', value: 18, color: '#10b981' },
      { name: 'Residential', value: 12, color: '#3b82f6' },
      { name: 'Commercial', value: 7, color: '#8b5cf6' }
    ]);

    setConservationProgress([
      { category: 'Energy Saved', current: 2340, target: 3000, unit: 'kWh', percentage: 78 },
      { category: 'Water Conserved', current: 18500, target: 25000, unit: 'L', percentage: 74 },
      { category: 'Waste Recycled', current: 450, target: 600, unit: 'kg', percentage: 75 },
      { category: 'Trees Planted', current: 1250, target: 1500, unit: 'trees', percentage: 83 }
    ]);

    setAlerts([
      { severity: 'high', title: 'Air Quality Alert', message: 'AQI levels above safe threshold in industrial zones', time: '2 hours ago', icon: 'AlertCircle', color: '#ef4444' },
      { severity: 'medium', title: 'Water Usage Spike', message: 'Unusual increase in water consumption detected', time: '5 hours ago', icon: 'Droplets', color: '#f59e0b' },
      { severity: 'low', title: 'Renewable Energy Goal', message: 'Solar panel efficiency up by 12%', time: '1 day ago', icon: 'Sun', color: '#10b981' }
    ]);

    setRegionalComparison([
      { region: 'Darbhanga', score: 68, trend: 'stable' },
      { region: 'Bihar Avg', score: 62, trend: 'up' },
      { region: 'National Avg', score: 58, trend: 'down' },
      { region: 'Target', score: 80, trend: 'neutral' }
    ]);

    setAiInsights([
      { title: '⚡ Immediate Action Required', message: 'Air quality in industrial zones requires intervention. Recommend increasing green cover and implementing emission controls.' },
      { title: '📈 Positive Trend Detected', message: 'Water conservation efforts showing results. 18% improvement over last month with community participation.' },
      { title: '🎯 Goal Achievement', message: 'Tree plantation campaign on track to exceed targets by 15%. Continue momentum through winter season.' },
      { title: '⚠️ Risk Prediction', message: 'Model predicts increased heat stress next week. Prepare public health advisories and cooling centers.' }
    ]);
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setSidebarCollapsed(true);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const getIconComponent = (iconName) => {
    const icons = { Leaf, Droplets, Wind, Sun, AlertCircle };
    return icons[iconName] || Activity;
  };

  const navigationItems = [
    { path: '/environment/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/environment/awareness', icon: Leaf, label: 'Awareness Hub' },
    { path: '/environment/carbon', icon: Cloud, label: 'Carbon Calculator' },
    { path: '/environment/chatbot', icon: MessageSquare, label: 'Chatbot' },
    { path: '/environment/climate', icon: Wind, label: 'Climate Predictions' },
    { path: '/environment/disaster', icon: Shield, label: 'Disaster Prediction' },
    { path: '/environment/pollution', icon: MapPin, label: 'Pollution Heatmap' },
    { path: '/environment/renewable', icon: Zap, label: 'Renewable Energy' },
    { path: '/environment/reports', icon: FileText, label: 'Reports' },
    { path: '/environment/waste', icon: Recycle, label: 'Waste Management' },
    { path: '/environment/wildlife', icon: TreePine, label: 'Wildlife Conservation' },
    { path: '/environment/settings', icon: Cog, label: 'Settings' }
  ];

  if (loading) {
    return (
      <div className="loading-container">
        <div>
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-logo">
          <Activity size={32} className="sidebar-logo-icon" />
          <h2>EcoMonitor</h2>
        </div>
        <nav className="sidebar-nav">
          {navigationItems.map((item) => (
            <SidebarItem
              key={item.path}
              path={item.path}
              icon={item.icon}
              label={item.label}
              isActive={location.pathname === item.path}
              onClick={handleNavigation}
              collapsed={sidebarCollapsed}
            />
          ))}
        </nav>
        <button className="toggle-btn" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
          {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          <span className="toggle-btn-text">{sidebarCollapsed ? 'Expand' : 'Collapse'}</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className={`main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
        <div className="max-w-1400 m-auto">
          {/* Header */}
          <div className="glass-card header-container" style={{ padding: '32px', marginBottom: '24px' }}>
            <div className="header-left">
              <div className="header-icon-box">
                <Activity className="metric-icon" size={48} style={{ color: '#3b82f6' }} />
              </div>
              <div>
                <h1 className="header-title">Environmental Dashboard</h1>
                <p className="header-subtitle">Real-time monitoring and AI-powered insights for Darbhanga, Bihar</p>
              </div>
            </div>
            <button className={`refresh-btn ${refreshing ? 'refreshing' : ''}`} onClick={handleRefresh} disabled={refreshing}>
              <RefreshCw size={18} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>

          {/* Time Range Selector */}
          <div className="glass-card" style={{ padding: '16px', marginBottom: '24px' }}>
            <div className="time-range-selector">
              {['day', 'week', 'month', 'year'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`time-range-btn ${timeRange === range ? 'time-range-btn-active' : ''}`}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '10px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Key Metrics Cards */}
          <div className="metrics-grid">
            {environmentalMetrics.map((metric, index) => {
              const Icon = getIconComponent(metric.icon);
              const TrendIcon = metric.trend === 'up' ? TrendingUp : TrendingDown;
              return (
                <div key={index} className="metric-card glass-card" style={{ padding: '24px', borderLeft: `4px solid ${metric.color}` }}>
                  <div className="metric-card-header">
                    <div className="metric-icon-box" style={{ background: metric.bgColor }}>
                      <Icon className="metric-icon" size={24} style={{ color: metric.color }} />
                    </div>
                    <span className="metric-status-badge" style={{ background: metric.bgColor, color: metric.color }}>
                      {metric.status.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="metric-title-text">{metric.title}</h3>
                  <div className="metric-value-container">
                    <p className="metric-value-text">{metric.value}</p>
                    <span className="metric-unit-text">{metric.unit}</span>
                  </div>
                  <div className="metric-change-box" style={{ background: metric.change > 0 ? '#fee2e2' : '#d1fae5' }}>
                    <TrendIcon size={16} style={{ marginRight: '6px', color: metric.change > 0 ? '#ef4444' : '#10b981' }} />
                    <span className="metric-change-text" style={{ color: metric.change > 0 ? '#ef4444' : '#10b981' }}>
                      {Math.abs(metric.change)}% vs last {timeRange}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="charts-layout-grid">
            {/* Weekly Trends Chart */}
            <div className="glass-card chart-container" style={{ padding: '24px', gridColumn: window.innerWidth > 1024 ? 'span 2' : 'span 1' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', marginBottom: '16px' }}>Weekly Environmental Trends</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="day" stroke="#64748b" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="aqi" stroke="#f59e0b" strokeWidth={3} name="AQI" dot={{ fill: '#f59e0b', r: 4 }} />
                  <Line type="monotone" dataKey="water" stroke="#3b82f6" strokeWidth={3} name="Water Quality" dot={{ fill: '#3b82f6', r: 4 }} />
                  <Line type="monotone" dataKey="temp" stroke="#ef4444" strokeWidth={3} name="Temperature (°C)" dot={{ fill: '#ef4444', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Emissions by Source */}
            <div className="glass-card chart-container" style={{ padding: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', marginBottom: '16px' }}>Emissions by Source</h2>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={emissionsBySource}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {emissionsBySource.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Conservation Progress */}
          <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', marginBottom: '24px' }}>Conservation Progress</h2>
            <div className="conservation-grid">
              {conservationProgress.map((item, index) => (
                <div key={index} className="conservation-card">
                  <h3 className="conservation-label">{item.category}</h3>
                  <div className="conservation-value-container">
                    <span className="conservation-value-text">{item.current.toLocaleString()}</span>
                    <span className="conservation-target-text">/ {item.target.toLocaleString()} {item.unit}</span>
                  </div>
                  <div className="progress-bar" style={{ width: '100%', height: '10px', borderRadius: '12px', marginBottom: '8px' }}>
                    <div className="progress-fill" style={{ width: `${item.percentage}%`, background: 'linear-gradient(90deg, #10b981 0%, #3b82f6 100%)' }}></div>
                  </div>
                  <p className="conservation-percentage-text">{item.percentage}% Complete</p>
                </div>
              ))}
            </div>
          </div>

          <div className="charts-layout-grid">
            {/* Alerts Section */}
            <div className="glass-card" style={{ padding: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', marginBottom: '16px' }}>Recent Alerts</h2>
              <div className="alerts-list">
                {alerts.map((alert, index) => {
                  const Icon = getIconComponent(alert.icon);
                  const bgColor = alert.severity === 'high' ? '#fef2f2' : alert.severity === 'medium' ? '#fefce8' : '#f0fdf4';
                  const iconBg = alert.severity === 'high' ? '#fee2e2' : alert.severity === 'medium' ? '#fef3c7' : '#d1fae5';
                  return (
                    <div key={index} className="alert-item" style={{ background: bgColor, borderRadius: '12px', padding: '16px', borderLeft: `4px solid ${alert.color}` }}>
                      <div style={{ display: 'flex', alignItems: 'start' }}>
                        <div className="alert-icon-box" style={{ background: iconBg }}>
                          <Icon size={20} style={{ color: alert.color }} />
                        </div>
                        <div className="alert-content">
                          <div className="alert-header">
                            <h3 className="alert-title-text">{alert.title}</h3>
                            <span className="alert-time-text">{alert.time}</span>
                          </div>
                          <p className="alert-message-text">{alert.message}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Regional Comparison */}
            <div className="glass-card chart-container" style={{ padding: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', marginBottom: '16px' }}>Regional Comparison</h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={regionalComparison} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" domain={[0, 100]} stroke="#64748b" style={{ fontSize: '12px' }} />
                  <YAxis type="category" dataKey="region" stroke="#64748b" width={100} style={{ fontSize: '12px' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px' }} />
                  <Bar dataKey="score" fill="#3b82f6" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Insights Panel */}
          <div className="ai-insights-panel" style={{ marginBottom: '24px' }}>
            <div className="ai-insights-layout">
              <div className="ai-insights-icon-box">
                <Activity size={32} />
              </div>
              <div className="ai-insights-content">
                <h2 className="ai-insights-title">AI-Powered Insights</h2>
                <div className="ai-insights-grid">
                  {aiInsights.map((insight, index) => (
                    <div key={index} className="ai-insight-card">
                      <h3 className="ai-insight-title-text">{insight.title}</h3>
                      <p className="ai-insight-message-text">{insight.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="error-notice">
              <strong>⚠️ Note:</strong> {error}. Displaying sample data for demonstration.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
