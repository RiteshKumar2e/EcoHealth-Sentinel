import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity, Heart, Thermometer, Droplets, AlertTriangle, CheckCircle,
  Clock, TrendingUp, User, Phone, Video, MessageSquare, FileText,
  Bell, Settings, Download, Calendar, Zap, Eye, XCircle, Send,
  Shield, Users, BarChart3, Stethoscope, Pill, ClipboardList,
  UserCheck, AlertCircle, MapPin, Mail, PhoneCall
} from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts';
import './RemoteMonitoring.css';

const VitalsHub = () => {
  const [activeDevice, setActiveDevice] = useState('Smart Watch');
  const [vitals, setVitals] = useState({
    heartRate: 72,
    bloodPressure: '118/76',
    temp: 98.4,
    oxygen: 99,
    steps: 8420
  });

  const historicalData = [
    { time: '08:00', heartRate: 65, steps: 200 },
    { time: '12:00', heartRate: 85, steps: 3500 },
    { time: '16:00', heartRate: 92, steps: 6000 },
    { time: '20:00', heartRate: 75, steps: 8420 }
  ];

  return (
    <div className="rm-page">
      <div className="rm-container">
        <motion.div className="card rm-header" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <div className="header-brand">
            <div className="brand-icon-box flex-center" style={{ background: '#3b82f6' }}>
              <Activity size={24} color="white" />
            </div>
            <div>
              <h1 className="brand-title">My Vitals Hub</h1>
              <p className="brand-subtitle">Real-time sync from your wearable devices</p>
            </div>
          </div>
          <div className="header-actions">
            <div className="status-badge" style={{ background: '#F0FDF4', color: '#059669' }}>
              <div className="status-dot pulse-ring" style={{ background: '#10B981' }} />
              <span>Devices Synced</span>
            </div>
            <button className="btn-icon"><Settings size={20} /></button>
          </div>
        </motion.div>

        <div className="stats-grid">
          {[
            { title: 'Heart Rate', value: `${vitals.heartRate} bpm`, icon: Heart, color: '#ef4444', bg: '#fef2f2' },
            { title: 'Blood Pressure', value: vitals.bloodPressure, icon: Activity, color: '#3b82f6', bg: '#eff6ff' },
            { title: 'Daily Steps', value: vitals.steps, icon: TrendingUp, color: '#10b981', bg: '#f0fdf4' },
            { title: 'Oxygen Level', value: `${vitals.oxygen}%`, icon: Zap, color: '#8b5cf6', bg: '#f3e8ff' }
          ].map((stat, i) => (
            <div key={i} className="stat-card">
              <div className="stat-header">
                <p className="stat-label">{stat.title}</p>
                <stat.icon color={stat.color} />
              </div>
              <h3 className="stat-value" style={{ color: 'white' }}>{stat.value}</h3>
            </div>
          ))}
        </div>

        <div className="card" style={{ marginTop: '24px', padding: '24px' }}>
          <h2 className="section-title"><BarChart3 size={24} /> Activity & Heart Trends</h2>
          <div style={{ height: '350px', marginTop: '20px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historicalData}>
                <defs>
                  <linearGradient id="colorHR" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="time" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Area type="monotone" dataKey="heartRate" stroke="#3b82f6" fill="url(#colorHR)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="insights-section" style={{ marginTop: '24px' }}>
          <div className="card">
            <h2 className="section-title"><Zap size={24} color="#f59e0b" /> Optimization Tips</h2>
            <div className="insights-grid">
              <div className="insight-card" style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid #3b82f6' }}>
                <p style={{ color: 'white' }}>Your heart rate was slightly elevated during your 12 PM walk. Consider a slower pace tomorrow.</p>
              </div>
              <div className="insight-card" style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981' }}>
                <p style={{ color: 'white' }}>You've reached 84% of your daily step goal. Just 1,580 more steps to go!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VitalsHub;
