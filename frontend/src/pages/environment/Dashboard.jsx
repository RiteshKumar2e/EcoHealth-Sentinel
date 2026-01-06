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

  const [timeRange, setTimeRange] = useState('Day');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // State and District Selection
  // State and District Selection
  const [selectedState, setSelectedState] = useState('Select State');
  const [selectedDistrict, setSelectedDistrict] = useState('Select City');

  const locationData = {
    'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Tirupati', 'Kakinada', 'Rajahmundry'],
    'Arunachal Pradesh': ['Itanagar', 'Naharlagun'],
    'Assam': ['Guwahati', 'Dibrugarh', 'Silchar', 'Jorhat'],
    'Bihar': ['Darbhanga', 'Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia'],
    'Chandigarh': ['Chandigarh'],
    'Chhattisgarh': ['Raipur', 'Bilaspur', 'Durg'],
    'Delhi': ['Delhi'],
    'Goa': ['Panaji', 'Margao'],
    'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar'],
    'Haryana': ['Gurugram', 'Faridabad', 'Panipat', 'Rohtak', 'Hisar'],
    'Himachal Pradesh': ['Shimla', 'Dharamshala'],
    'Jammu & Kashmir': ['Srinagar', 'Jammu'],
    'Jharkhand': ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro Steel City', 'Hazaribagh'],
    'Karnataka': ['Bengaluru', 'Mysuru', 'Mangaluru', 'Hubli', 'Belagavi'],
    'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur'],
    'Ladakh': ['Leh'],
    'Madhya Pradesh': ['Bhopal', 'Indore', 'Gwalior', 'Jabalpur', 'Ujjain'],
    'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Aurangabad', 'Navi Mumbai'],
    'Manipur': ['Imphal'],
    'Meghalaya': ['Shillong'],
    'Mizoram': ['Aizawl'],
    'Nagaland': ['Kohima', 'Dimapur'],
    'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela'],
    'Puducherry': ['Puducherry'],
    'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala'],
    'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer'],
    'Sikkim': ['Gangtok'],
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem'],
    'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad'],
    'Tripura': ['Agartala'],
    'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Ghaziabad', 'Agra', 'Varanasi', 'Meerut', 'Prayagraj'],
    'Uttarakhand': ['Dehradun', 'Haridwar', 'Roorkee', 'Haldwani'],
    'West Bengal': ['Kolkata', 'Howrah', 'Siliguri', 'Durgapur', 'Asansol']
  };

  useEffect(() => {
    // Initial data fetch or setup if needed
  }, []);


  // Placeholder Values for Initial State
  const initialMetrics = [
    { icon: 'Leaf', title: 'Air Quality Index', value: '--', unit: 'AQI', change: 0, status: 'nodata', color: '#94a3b8', bgColor: '#f8fafc', trend: 'flat' },
    { icon: 'Droplets', title: 'Water Quality', value: '--', unit: '/100', change: 0, status: 'nodata', color: '#94a3b8', bgColor: '#f8fafc', trend: 'flat' },
    { icon: 'Wind', title: 'CO2 Levels', value: '--', unit: 'ppm', change: 0, status: 'nodata', color: '#94a3b8', bgColor: '#f8fafc', trend: 'flat' },
    { icon: 'Sun', title: 'Solar Radiation', value: '--', unit: 'kWh/m²', change: 0, status: 'nodata', color: '#94a3b8', bgColor: '#f8fafc', trend: 'flat' }
  ];

  // Backend Data States
  const [environmentalMetrics, setEnvironmentalMetrics] = useState(initialMetrics);
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
    setEnvironmentalMetrics(initialMetrics);
    setWeeklyData([]);
    setEmissionsBySource([]);
    setConservationProgress([]);
    setAlerts([]);
    setRegionalComparison([]);
    setAiInsights([]);
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
    const icons = { Leaf, Droplets, Wind, Sun, AlertCircle, Zap, Shield, MapPin, Activity };
    return icons[iconName] || Activity;
  };

  const navigationItems = [
    { path: '/environment/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/environment/awareness', icon: Leaf, label: 'Awareness Hub' },
    { path: '/environment/carbon', icon: Cloud, label: 'Carbon Calculator' },
    { path: '/environment/climate', icon: Wind, label: 'Climate Predictions' },
    { path: '/environment/disaster', icon: Shield, label: 'Disaster Prediction' },
    { path: '/environment/pollution', icon: MapPin, label: 'Pollution Heatmap' },
    { path: '/environment/renewable', icon: Zap, label: 'Renewable Energy' },
    { path: '/environment/reports', icon: FileText, label: 'Reports' },
    { path: '/environment/waste', icon: Recycle, label: 'Waste Management' },
    { path: '/environment/wildlife', icon: TreePine, label: 'Wildlife Conservation' },
    { path: '/environment/settings', icon: Cog, label: 'Settings' }
  ];


  return (
    <div className="dashboard-container">
      {/* Dashboard Content */}
      <div className="dashboard-content-main">
        <div className="max-w-1400">
          {/* Header Section */}
          <div className="glass-card header-container">
            <div className="header-left">
              <div className="header-icon-box">
                <Leaf size={44} />
              </div>
              <div className="header-info">
                <h1 className="header-title">Environmental Dashboard</h1>
                <p className="header-subtitle">Real-time monitoring and AI insights for {selectedDistrict}, {selectedState}</p>
              </div>
            </div>
            <div className="header-right">
              <div className="location-selectors">
                <div className="select-wrapper">
                  <MapPin size={14} className="select-icon" />
                  <select
                    value={selectedState}
                    onChange={(e) => {
                      setSelectedState(e.target.value);
                      const districts = locationData[e.target.value] || [];
                      setSelectedDistrict(districts.length > 0 ? districts[0] : 'Select City');
                    }}
                    className="location-select"
                  >
                    <option value="Select State">Select State</option>
                    {Object.keys(locationData).map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
                <div className="select-wrapper">
                  <Activity size={14} className="select-icon" />
                  <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="location-select"
                    disabled={selectedState === 'Select State'}
                  >
                    <option value="Select City">Select City</option>
                    {(locationData[selectedState] || []).map(dist => (
                      <option key={dist} value={dist}>{dist}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                className={`refresh-btn ${refreshing ? 'refreshing' : ''}`}
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <RefreshCw size={20} />
                <span>{refreshing ? 'Syncing...' : 'Sync Data'}</span>
              </button>
            </div>
          </div>

          {/* Time Filter */}
          <div className="time-range-container">
            {['Day', 'Week', 'Month', 'Year'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range.toLowerCase())}
                className={`time-range-btn ${timeRange === range.toLowerCase() ? 'active' : ''}`}
              >
                {range}
              </button>
            ))}
          </div>

          {/* Metrics Grid */}
          <div className="metrics-grid">
            {environmentalMetrics.map((metric, index) => {
              const Icon = getIconComponent(metric.icon);
              const isPositive = metric.change >= 0;
              return (
                <div key={index} className="glass-card metric-card">
                  <div className="metric-header">
                    <div className="metric-icon-box" style={{ background: `${metric.color}20`, color: metric.color }}>
                      <Icon size={28} />
                    </div>
                    <span
                      className="metric-status-badge"
                      style={{ background: `${metric.color}15`, color: metric.color }}
                    >
                      {metric.status}
                    </span>
                  </div>

                  <div className="metric-main-content">
                    <h3 className="metric-label">{metric.title}</h3>
                    <div className="metric-value-wrap">
                      <span className="metric-val">{metric.value}</span>
                      <span className="metric-unit-tag">{metric.unit}</span>
                    </div>
                  </div>

                  <div className={`metric-trend ${isPositive ? 'up' : 'down'}`}>
                    {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    <span>{Math.abs(metric.change)}% vs last {timeRange}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Charts Grid */}
          <div className="charts-grid">
            <div className="glass-card chart-card-large">
              <div className="chart-header">
                <h2>Environmental Trends</h2>
                <Activity size={20} color="var(--text-muted)" />
              </div>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend iconType="circle" />
                  <Line
                    type="monotone"
                    dataKey="aqi"
                    stroke="var(--warning)"
                    strokeWidth={4}
                    dot={false}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                    name="AQI Index"
                  />
                  <Line
                    type="monotone"
                    dataKey="water"
                    stroke="var(--primary)"
                    strokeWidth={4}
                    dot={false}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                    name="Water Purity"
                  />
                  <Line
                    type="monotone"
                    dataKey="temp"
                    stroke="var(--danger)"
                    strokeWidth={4}
                    dot={false}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                    name="Temp (°C)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="glass-card chart-card-small">
              <div className="chart-header">
                <h2>Emission Sources</h2>
                <Cloud size={20} color="var(--text-muted)" />
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={emissionsBySource}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {emissionsBySource.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-lg)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ marginTop: '20px' }}>
                {emissionsBySource.map((e, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: e.color }} />
                    <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{e.name}</span>
                    <span style={{ marginLeft: 'auto', fontWeight: '700' }}>{e.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Conservation Section */}
          <div className="conservation-section">
            <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '20px' }}>Conservation Impact</h2>
            <div className="conservation-grid">
              {conservationProgress.map((item, index) => (
                <div key={index} className="conservation-item">
                  <h3 className="conservation-title">{item.category}</h3>
                  <div className="conservation-stats">
                    <span className="current-value">{item.current.toLocaleString()}</span>
                    <span className="target-value">/ {item.target.toLocaleString()} {item.unit}</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-bar" style={{ width: `${item.percentage}%` }} />
                  </div>
                  <p className="progress-percent">{item.percentage}% ACHIEVED</p>
                </div>
              ))}
            </div>
          </div>

          {/* Alerts & Comparison */}
          <div className="bottom-grid">
            <div className="glass-card">
              <div className="chart-header">
                <h2>Security & Safety Alerts</h2>
                <AlertCircle size={20} color="var(--danger)" />
              </div>
              <div className="alerts-list">
                {alerts.length > 0 ? alerts.map((alert, index) => {
                  const AlertIcon = getIconComponent(alert.icon);
                  return (
                    <div
                      key={index}
                      className="alert-card"
                      style={{
                        background: `${alert.color}08`,
                        borderLeftColor: alert.color
                      }}
                    >
                      <div className="alert-icon-box" style={{ background: `${alert.color}15`, color: alert.color }}>
                        <AlertIcon size={20} />
                      </div>
                      <div className="alert-content">
                        <div className="alert-card-header">
                          <span className="alert-title">{alert.title}</span>
                          <span className="alert-time">{alert.time}</span>
                        </div>
                        <p className="alert-msg">{alert.message}</p>
                      </div>
                    </div>
                  );
                }) : (
                  <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    No active alerts in this period.
                  </div>
                )}
              </div>
            </div>

            <div className="glass-card">
              <div className="chart-header">
                <h2>Regional Performance</h2>
                <MapPin size={20} color="var(--primary)" />
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={regionalComparison} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="region"
                    axisLine={false}
                    tickLine={false}
                    width={100}
                    tick={{ fill: '#64748b', fontSize: 13 }}
                  />
                  <Tooltip
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-lg)' }}
                  />
                  <Bar dataKey="score" fill="var(--primary)" radius={[0, 10, 10, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Insights Panel */}
          <div className="ai-panel">
            <div className="ai-icon-large">
              <Zap size={40} />
            </div>
            <div className="ai-content">
              <h2>Sentient Insights</h2>
              <div className="ai-insights-grid">
                {aiInsights.map((insight, index) => (
                  <div key={index} className="ai-card">
                    <h3>{insight.title}</h3>
                    <p>{insight.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {error && (
            <div style={{
              marginTop: '32px',
              padding: '16px',
              borderRadius: '12px',
              background: 'var(--warning-light)',
              color: 'var(--warning)',
              border: '1px solid var(--warning)',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              ⚠️ {error}. Displaying localized simulation data.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
