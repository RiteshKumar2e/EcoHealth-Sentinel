import React, { useState, useEffect, useCallback } from 'react';
import { Activity, Heart, Zap, Clock, CheckCircle, XCircle, TrendingUp, TrendingDown, FileText, Plus, Bell, RefreshCw, AlertCircle, MessageSquare, Footprints, Moon } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import './HealthOverview.css';

const HealthOverview = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [notifications, setNotifications] = useState([]);
  const [alertsProcessing, setAlertsProcessing] = useState({});

  // Patient Data States
  const [healthTrendData, setHealthTrendData] = useState([]);
  const [activityData, setActivityData] = useState([]);
  const [vitalsDistribution, setVitalsDistribution] = useState([]);
  const [personalStats, setPersonalStats] = useState({
    heartRate: '--',
    bloodPressure: '--/--',
    steps: 0,
    sleep: 0
  });

  // AI Insights State
  const [insights, setInsights] = useState([]);

  const showNotification = useCallback((message, type) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  }, []);

  // Placeholder for fetching real data
  const fetchPatientData = useCallback((days = '7') => {
    setIsLoading(true);
    // TODO: Connect to backend API
    setTimeout(() => {
      setIsLoading(false);
      setLastUpdated(new Date());
    }, 500);
  }, []);

  useEffect(() => {
    fetchPatientData();
  }, [fetchPatientData]);

  const handleAction = (alertId) => {
    setAlertsProcessing(prev => ({ ...prev, [alertId]: true }));
    setTimeout(() => {
      showNotification('Insight acknowledged.', 'success');
      setAlertsProcessing(prev => ({ ...prev, [alertId]: false }));
    }, 1000);
  };

  const StatCard = ({ icon: Icon, title, value, unit, trend, color, detail }) => (
    <div className={`stat-card ${color}`}>
      <div className="stat-card-header">
        <div className="stat-icon-wrapper">
          <Icon className="stat-icon" color="white" size={28} strokeWidth={2.5} />
        </div>
        {/* Trend removed or made conditional on actual data */}
        {trend && value !== '--' && (
          <div className={`stat-trend ${trend === 'up' ? 'trend-up' : 'trend-down'}`}>
            {trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span>{trend === 'up' ? '+0%' : '-0%'}</span>
          </div>
        )}
      </div>
      <h3 className="stat-title">{title}</h3>
      <p className="stat-value">{value}<span style={{ fontSize: '1rem', marginLeft: '4px', opacity: 0.8 }}>{unit}</span></p>
      <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '4px' }}>{detail}</p>
    </div>
  );

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newVital, setNewVital] = useState({ heartRate: '', systolic: '', diastolic: '' });

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleVitalChange = (e) => {
    const { name, value } = e.target;
    setNewVital(prev => ({ ...prev, [name]: value }));
  };

  const submitVital = () => {
    if (!newVital.heartRate || !newVital.systolic || !newVital.diastolic) return;

    // Simulate updating data
    setPersonalStats(prev => ({
      ...prev,
      heartRate: newVital.heartRate,
      bloodPressure: `${newVital.systolic}/${newVital.diastolic}`
    }));

    showNotification('Vitals logged successfully', 'success');
    handleCloseModal();
    setNewVital({ heartRate: '', systolic: '', diastolic: '' });
  };

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

      {/* Modal Overlay */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000
        }}>
          <div style={{ background: 'white', padding: '24px', borderRadius: '16px', width: '320px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '1.25rem', fontWeight: 'bold' }}>Log New Vital</h3>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '4px', color: '#374151' }}>Heart Rate (bpm)</label>
              <input
                type="number" name="heartRate" value={newVital.heartRate} onChange={handleVitalChange}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                placeholder="e.g. 72"
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '4px', color: '#374151' }}>Systolic</label>
                <input
                  type="number" name="systolic" value={newVital.systolic} onChange={handleVitalChange}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                  placeholder="120"
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '4px', color: '#374151' }}>Diastolic</label>
                <input
                  type="number" name="diastolic" value={newVital.diastolic} onChange={handleVitalChange}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                  placeholder="80"
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={handleCloseModal} style={{ padding: '8px 16px', background: '#f3f4f6', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
              <button onClick={submitVital} style={{ padding: '8px 16px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="page-header">
        <div className="header-top">
          <div>
            <h1 className="page-title">Personal Health Dashboard</h1>
            <div className="page-subtitle">
              <span>Welcome back, Anmol. Your health score is <b>Excellent</b></span>
            </div>
          </div>
          <div className="header-actions">
            <button onClick={() => fetchPatientData()} className="refresh-btn">
              <RefreshCw size={20} className={isLoading ? 'loading' : ''} />
            </button>
            <button className="btn-primary" onClick={handleOpenModal}>
              <Plus size={18} />
              <span>Log Vital</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <StatCard icon={Heart} title="Heart Rate" value={personalStats.heartRate} unit="bpm" color="red" detail="No recent data" />
        <StatCard icon={Activity} title="Blood Pressure" value={personalStats.bloodPressure} unit="mmHg" color="blue" detail="No recent data" />
        <StatCard icon={Footprints} title="Daily Steps" value={personalStats.steps} unit="steps" color="orange" detail="Waiting for sync" />
        <StatCard icon={Moon} title="Sleep Quality" value={personalStats.sleep} unit="hrs" color="indigo" detail="No sleep record" />
      </div>

      {/* Main Content Grid */}
      <div className="charts-grid">
        {/* Health Trends */}
        <div className="card">
          <h2 className="card-title">Weekly Vitals Trend</h2>
          {healthTrendData.length > 0 ? (
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
          ) : (
            <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', width: '100%' }}>
              No trend data available
            </div>
          )}
        </div>

        {/* Activity Progress */}
        <div className="card">
          <h2 className="card-title">Activity Progress</h2>
          {activityData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#f3f4f6' }} />
                <Bar dataKey="steps" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', width: '100%' }}>
              No activity data available
            </div>
          )}
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
            {insights.length > 0 ? insights.map((insight) => (
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
            )) : (
              <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                No new insights generated.
              </div>
            )}
          </div>
        </div>

        {/* Vitals Summary Pie */}
        <div className="card" style={{ flex: 1 }}>
          <h2 className="card-title">Monthly Health Status</h2>
          {vitalsDistribution.length > 0 ? (
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
          ) : (
            <div style={{ height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', width: '100%' }}>
              No data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HealthOverview;