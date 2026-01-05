import React, { useState, useEffect, useCallback } from 'react';
import { Activity, Heart, Zap, Clock, CheckCircle, XCircle, TrendingUp, TrendingDown, FileText, Plus, Bell, RefreshCw, AlertCircle, MessageSquare } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import './Dashboard.css';

const HealthDashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [notifications, setNotifications] = useState([]);
  const [alertsProcessing, setAlertsProcessing] = useState({});

  // Patient Data States
  const [healthTrendData, setHealthTrendData] = useState([]);
  const [activityData, setActivityData] = useState([]);
  const [vitalsDistribution, setVitalsDistribution] = useState([]);
  const [personalStats, setPersonalStats] = useState({
    heartRate: 72,
    bloodPressure: '118/76',
    steps: 8432,
    sleep: 7.5
  });

  const showNotification = useCallback((message, type) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  }, []);

  const generatePatientData = useCallback(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    setHealthTrendData(days.map(day => ({
      day,
      heartRate: 65 + Math.floor(Math.random() * 20),
      bpSystolic: 110 + Math.floor(Math.random() * 20),
      sleep: 6 + Math.floor(Math.random() * 3)
    })));

    setActivityData(days.map(day => ({
      name: day,
      steps: 4000 + Math.floor(Math.random() * 8000),
      calories: 1800 + Math.floor(Math.random() * 1000)
    })));

    setVitalsDistribution([
      { name: 'Healthy', value: 70, color: '#10b981' },
      { name: 'Warning', value: 20, color: '#f59e0b' },
      { name: 'Critical', value: 10, color: '#ef4444' }
    ]);

    setLastUpdated(new Date());
  }, []);

  useEffect(() => {
    generatePatientData();
    const interval = setInterval(generatePatientData, 60000);
    return () => clearInterval(interval);
  }, [generatePatientData]);

  const handleAction = (alertId) => {
    setAlertsProcessing(prev => ({ ...prev, [alertId]: true }));
    setTimeout(() => {
      showNotification('Insight acknowledged. Data synced with your records.', 'success');
      setAlertsProcessing(prev => ({ ...prev, [alertId]: false }));
    }, 1200);
  };

  const StatCard = ({ icon: Icon, title, value, unit, trend, color, detail }) => (
    <div className={`stat-card ${color}`}>
      <div className="stat-card-header">
        <div className="stat-icon-wrapper">
          <Icon className="stat-icon" />
        </div>
        {trend && (
          <div className={`stat-trend ${trend === 'up' ? 'trend-up' : 'trend-down'}`}>
            {trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span>{trend === 'up' ? '+8%' : '-3%'}</span>
          </div>
        )}
      </div>
      <h3 className="stat-title">{title}</h3>
      <p className="stat-value">{value}<span style={{ fontSize: '1rem', marginLeft: '4px', opacity: 0.8 }}>{unit}</span></p>
      <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '4px' }}>{detail}</p>
    </div>
  );

  return (
    <div className="patient-dashboard-wrapper">
      {/* Notifications */}
      <div className="notification-container">
        {notifications.map(notification => (
          <div key={notification.id} className={`notification ${notification.type}`}>
            {notification.type === 'success' && <CheckCircle size={18} />}
            {notification.type === 'error' && <XCircle size={18} />}
            {notification.type === 'info' && <Activity size={18} />}
            <span>{notification.message}</span>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="page-header">
        <div className="header-top">
          <div>
            <h1 className="page-title">Personal Health Dashboard</h1>
            <div className="page-subtitle">
              <span>Welcome back, Anmol. Your health score is <b>Excellent</b></span>
              <span className="last-updated">
                <Clock size={14} /> Updated: {lastUpdated.toLocaleTimeString()}
              </span>
            </div>
          </div>
          <div className="header-actions">
            <button onClick={() => generatePatientData()} className="refresh-btn">
              <RefreshCw size={20} />
            </button>
            <button className="btn-primary">
              <Plus size={18} />
              <span>Log Vital</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <StatCard icon={Heart} title="Heart Rate" value={personalStats.heartRate} unit="bpm" trend="up" color="blue" detail="Steady rhythm" />
        <StatCard icon={Activity} title="Blood Pressure" value={personalStats.bloodPressure} unit="mmHg" trend="down" color="green" detail="Perfect range" />
        <StatCard icon={Zap} title="Daily Steps" value={personalStats.steps.toLocaleString()} unit="steps" trend="up" color="purple" detail="84% of goal" />
        <StatCard icon={Clock} title="Sleep Quality" value={personalStats.sleep} unit="hrs" trend="up" color="indigo" detail="75% Deep sleep" />
      </div>

      {/* Main Content Grid */}
      <div className="charts-grid">
        {/* Health Trends */}
        <div className="card">
          <h2 className="card-title">Weekly Vitals Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={healthTrendData}>
              <defs>
                <linearGradient id="colorHR" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="heartRate" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorHR)" />
              <Line type="monotone" dataKey="bpSystolic" stroke="#10b981" strokeWidth={3} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Activity Progress */}
        <div className="card">
          <h2 className="card-title">Activity Progress</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: '#f3f4f6' }} />
              <Bar dataKey="steps" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="charts-grid" style={{ marginTop: '24px' }}>
        {/* Insights Section */}
        <div className="card" style={{ flex: 2 }}>
          <div className="card-header">
            <AlertCircle size={20} color="#f59e0b" />
            <h2 className="card-title">Personal AI Health Insights</h2>
          </div>
          <div className="alerts-container">
            {[
              { id: 1, title: 'High Heart Rate Detected', time: '10 min ago', priority: 'high', desc: 'Heart rate was 110bpm while resting. Take a 5-min deep breathing break.' },
              { id: 2, title: 'Upcoming Tele-consult', time: 'Tomorrow, 10:00 AM', priority: 'medium', desc: 'Routine follow-up with Dr. Sarah scheduled.' },
              { id: 3, title: 'Consistent Sleep Pattern', time: 'Today', priority: 'low', desc: 'You maintained an 8-hour sleep schedule for 5 days. Keep it up!' }
            ].map((insight) => (
              <div key={insight.id} className={`alert-card ${insight.priority}`}>
                <div className="alert-content">
                  <div className="alert-info">
                    <h4 className="alert-message">{insight.title} <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>({insight.time})</span></h4>
                    <p className="alert-action-text">{insight.desc}</p>
                  </div>
                  <button
                    className="action-btn"
                    onClick={() => handleAction(insight.id)}
                    disabled={alertsProcessing[insight.id]}
                  >
                    {alertsProcessing[insight.id] ? 'Syncing...' : 'Acknowledge'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vitals Summary Pie */}
        <div className="card" style={{ flex: 1 }}>
          <h2 className="card-title">Monthly Health Status</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={vitalsDistribution}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {vitalsDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default HealthDashboard;