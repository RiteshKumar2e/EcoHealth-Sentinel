import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity, Heart, TrendingUp, Zap, BarChart3, Settings,
  Bell, Share2, Info, CheckCircle, Database, ChevronRight
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import './VitalsHub.css';

const VitalsHub = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Real data state (initialized empty)
  const [vitals] = useState({
    heartRate: '--',
    bloodPressure: '--/--',
    temp: '--',
    oxygen: '--',
    steps: 0
  });

  const [historicalData] = useState([]);
  const [insights] = useState([]);
  const [notifications] = useState([]);

  const statsData = [
    { title: 'Heart Rate', value: `${vitals.heartRate} bpm`, icon: Heart, color: '#ef4444' },
    { title: 'Blood Pressure', value: vitals.bloodPressure, icon: Activity, color: '#3b82f6' },
    { title: 'Daily Steps', value: vitals.steps.toLocaleString(), icon: TrendingUp, color: '#10b981' },
    { title: 'Oxygen Level', value: `${vitals.oxygen}%`, icon: Zap, color: '#8b5cf6' }
  ];

  return (
    <div className="rm-page">
      <div className="rm-container">
        {/* Header Section */}
        <header className="rm-header">
          <div className="header-brand">
            <div className="brand-icon-box" style={{ background: '#3b82f6' }}>
              <Activity size={28} color="white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="brand-title">Vitals Hub</h1>
              <p className="brand-subtitle">Connect a wearable device to start tracking</p>
            </div>
          </div>

          <div className="header-actions">
            <div className="status-badge" style={{ background: '#fef2f2', color: '#ef4444' }}>
              <div className="status-dot" style={{ background: '#ef4444' }} />
              <span>No Devices Linked</span>
            </div>

            <div className="action-wrapper">
              <button
                className={`btn-icon ${showNotifications ? 'active' : ''}`}
                onClick={() => { setShowNotifications(!showNotifications); setShowShareModal(false); setShowSettings(false); }}
                title="Notifications"
              >
                <Bell size={20} />
                {notifications.length > 0 && <span className="notif-indicator"></span>}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    className="dropdown-panel notif-dropdown"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                  >
                    <div className="dropdown-header">
                      <h4>Notifications</h4>
                      {notifications.length > 0 && <button className="text-btn">Mark all as read</button>}
                    </div>
                    <div className="dropdown-content">
                      {notifications.length > 0 ? (
                        notifications.map(notif => (
                          <div key={notif.id} className="notif-item">
                            <div className="notif-icon" style={{ background: `${notif.color}15`, color: notif.color }}>
                              <notif.icon size={16} />
                            </div>
                            <div className="notif-info">
                              <p>{notif.text}</p>
                              <span>{notif.time}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="empty-dropdown-state">
                          <Bell size={32} color="#cbd5e1" />
                          <p>No new notifications</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="action-wrapper">
              <button
                className={`btn-icon ${showShareModal ? 'active' : ''}`}
                onClick={() => { setShowShareModal(!showShareModal); setShowNotifications(false); setShowSettings(false); }}
                title="Share Report"
              >
                <Share2 size={20} />
              </button>

              <AnimatePresence>
                {showShareModal && (
                  <motion.div
                    className="dropdown-panel share-dropdown"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                  >
                    <h4>Share Health Report</h4>
                    <p>Connect a device first to share live biometric data</p>
                    <button className="btn-full-settings" style={{ background: '#3b82f6', color: 'white', border: 'none' }}>
                      Link Device
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="action-wrapper">
              <button
                className={`btn-icon ${showSettings ? 'active' : ''}`}
                onClick={() => { setShowSettings(!showSettings); setShowNotifications(false); setShowShareModal(false); }}
                title="Settings"
              >
                <Settings size={20} />
              </button>

              <AnimatePresence>
                {showSettings && (
                  <motion.div
                    className="dropdown-panel settings-dropdown"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                  >
                    <h4>Hub Settings</h4>
                    <div className="setting-toggle-item">
                      <span>Real-time Sync</span>
                      <input type="checkbox" disabled />
                    </div>
                    <div className="setting-toggle-item">
                      <span>Cloud Backup</span>
                      <input type="checkbox" disabled />
                    </div>
                    <button className="btn-full-settings">Device Management</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <section className="stats-grid">
          {statsData.map((stat, i) => (
            <motion.div
              key={i}
              className="stat-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              style={{ '--stat-accent': stat.color }}
            >
              <div className="stat-header">
                <span className="stat-label">{stat.title}</span>
                <div className="stat-icon-wrapper" style={{ background: `${stat.color}15`, color: stat.color }}>
                  <stat.icon size={22} />
                </div>
              </div>
              <h2 className="stat-value">{stat.value}</h2>
            </motion.div>
          ))}
        </section>

        {/* Main Content Grid */}
        <div className="vitals-main-grid">
          <main className="card">
            <div className="section-header">
              <h2 className="section-title"><BarChart3 size={24} /> Biometric Trends</h2>
            </div>

            <div className="chart-container">
              {historicalData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={historicalData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorHR" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.01} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '12px' }} />
                    <Area type="monotone" dataKey="heartRate" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorHR)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="empty-chart-state">
                  <Database size={48} color="#cbd5e1" />
                  <h3>No trend data found</h3>
                  <p>Trends will appear once you link a device and sync your first 24 hours of data.</p>
                  <button className="text-btn" style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Setup Tracking <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>
          </main>

          <aside className="card">
            <h2 className="section-title"><Zap size={24} /> Health Insights</h2>
            <div className="insights-grid">
              {insights.length > 0 ? (
                insights.map((insight) => (
                  <div key={insight.id} className="insight-card">
                    <div className="insight-icon" style={{ background: `${insight.color}15`, color: insight.color }}>
                      <insight.icon size={20} />
                    </div>
                    <div className="insight-content">
                      <p>{insight.text}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-insights-state">
                  <div className="ai-brain-placeholder">
                    <Zap size={32} color="#3b82f6" />
                  </div>
                  <p>AI Insights are currently unavailable. Sync more biometric data to generate personalized tips.</p>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default VitalsHub;
