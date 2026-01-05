import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle, Activity, TrendingUp, Clock,
  Shield, Zap, Heart, Bell, RefreshCw
} from 'lucide-react';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, Line
} from 'recharts';
import './HealthRisks.css';

const HealthRisks = () => {
  const [riskPredictions, setRiskPredictions] = useState([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');
  const [healthMetrics, setHealthMetrics] = useState({
    overallRiskScore: 0,
    stressLevel: 'None',
    resilienceScore: 0
  });
  const [notifications, setNotifications] = useState([]);

  const fetchData = useCallback(async () => {

    setRiskPredictions([]);
  }, [selectedTimeframe]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addNotification = (title, message) => {
    const id = Date.now();
    setNotifications(prev => [{ id, title, message }, ...prev].slice(0, 3));
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  const riskTrendData = []; // Start with no trend data

  return (
    <div className="emergency-dashboard">
      <AnimatePresence>
        {notifications.map(n => (
          <motion.div key={n.id} className="emergency-notification-item" initial={{ x: 300 }} animate={{ x: 0 }} exit={{ x: 300 }}>
            <Bell size={20} color="#3b82f6" />
            <div style={{ marginLeft: '12px' }}>
              <p style={{ fontWeight: '600', color: '#1e293b' }}>{n.title}</p>
              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>{n.message}</p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="emergency-container">
        <motion.div className="emergency-glass-card emergency-header-card" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <div className="emergency-header-content">
            <div className="emergency-header-left">
              <div className="emergency-icon-3d">
                <Shield style={{ width: '32px', height: '32px', color: 'white' }} />
              </div>
              <div>
                <h1 className="emergency-gradient-text">Personal Health Risk AI</h1>
                <p className="emergency-subtitle">Predictive analytics based on your real-time vitals & environment</p>
              </div>
            </div>
            <div className="emergency-header-right">
              <div className="emergency-timeframe-buttons">
                {['24h', '48h', '7d'].map((t) => (
                  <button key={t} onClick={() => setSelectedTimeframe(t)} className={`emergency-timeframe-btn ${selectedTimeframe === t ? 'active' : ''}`}>{t}</button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="emergency-metrics-grid">
          {[
            { icon: Activity, label: 'Risk Score', value: healthMetrics.overallRiskScore, color: '#10b981', detail: 'Out of 100' },
            { icon: Zap, label: 'Stress Index', value: healthMetrics.stressLevel, color: '#3b82f6', detail: 'Based on HRV' },
            { icon: Heart, label: 'Resilience', value: healthMetrics.resilienceScore, color: '#8b5cf6', detail: 'Recovery rate' },
            { icon: Clock, label: 'Next Insight', value: '45m', color: '#f59e0b', detail: 'Scheduled AI scan' }
          ].map((m, i) => (
            <div key={i} className="emergency-glass-card emergency-metric-card">
              <div className="emergency-metric-icon-box">
                <m.icon style={{ color: m.color }} />
              </div>
              <div className="emergency-metric-content">
                <p className="emergency-metric-label">{m.label}</p>
                <p className="emergency-metric-value" style={{ color: m.color }}>{m.value}</p>
                <p className="emergency-metric-detail">{m.detail}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="emergency-section-title">
          <Zap size={20} color="#f59e0b" style={{ marginRight: '8px' }} />
          <span>AI Risk Forecasts</span>
        </div>

        <div className="emergency-predictions-grid">
          {riskPredictions.length > 0 ? (
            riskPredictions.map((p, i) => (
              <motion.div key={p.id} className={`emergency-glass-card emergency-prediction-card ${p.riskLevel.toLowerCase()}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <div className="emergency-prediction-header">
                  <div>
                    <h3 className="emergency-prediction-title">{p.type}</h3>
                    <div className="emergency-prediction-badges">
                      <span className={`emergency-risk-badge ${p.riskLevel.toLowerCase()}`}>{p.riskLevel} Probability</span>
                      <span className="emergency-risk-badge emergency-confidence-badge">AI Confidence: {p.confidence}%</span>
                    </div>
                  </div>
                  <div className="emergency-probability-display">
                    <span className="emergency-probability-text">{p.probability}%</span>
                  </div>
                </div>
                <div className="emergency-prediction-details">
                  <div className="emergency-detail-item"><Clock size={16} /><p>{p.timeframe}</p></div>
                  <div className="emergency-detail-item"><AlertTriangle size={16} /><p>Impact: {p.impact}</p></div>
                </div>
                <div className="emergency-factors-section">
                  <p className="emergency-factors-label">Contributing Factors</p>
                  <div className="emergency-factors-tags">
                    {p.factors.map((f, j) => <span key={j} className="emergency-factor-tag">{f}</span>)}
                  </div>
                </div>
                <div className="emergency-action-box">
                  <p className="emergency-action-label">AI Recommendation:</p>
                  <p className="emergency-action-text">{p.recommendedAction}</p>
                  <button className="emergency-action-button" onClick={() => addNotification('Guidance Synced', 'Check your HealthAssistant for details.')}>Acknowledge Risk</button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="emergency-empty-state">
              <Shield size={48} className="empty-icon" />
              <p>No health risks detected. You're doing great!</p>
            </div>
          )}
        </div>

        <div className="emergency-glass-card" style={{ marginTop: '24px', padding: '24px' }}>
          <h3 className="emergency-prediction-title">Risk Exposure Trend</h3>
          <div style={{ height: '300px', marginTop: '20px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={riskTrendData}>
                <defs>
                  <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} stroke="#94a3b8" />
                <YAxis axisLine={false} tickLine={false} stroke="#94a3b8" />
                <Tooltip contentStyle={{ background: 'rgba(15, 23, 42, 0.9)', border: 'none', borderRadius: '8px', color: '#fff' }} />
                <Area type="monotone" dataKey="risk" stroke="#ef4444" strokeWidth={3} fill="url(#colorRisk)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthRisks;
