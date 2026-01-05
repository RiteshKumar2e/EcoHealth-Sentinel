import React, { useState } from 'react';
import { FileText, Download, TrendingUp, Calendar, BarChart3, Filter, Search, Printer, Share2, Mail, Clock, Shield, Bell, Zap, Activity, Heart } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import './MyHealthReports.css';

const MyHealthReports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Last 30 Days');

  const vitalsTrend = [
    { day: 'Mon', heartRate: 72, steps: 4000 },
    { day: 'Tue', heartRate: 75, steps: 6500 },
    { day: 'Wed', heartRate: 70, steps: 8000 },
    { day: 'Thu', heartRate: 68, steps: 7200 },
    { day: 'Fri', heartRate: 85, steps: 9000 },
    { day: 'Sat', heartRate: 78, steps: 11000 },
    { day: 'Sun', heartRate: 74, steps: 5000 }
  ];

  const reportsList = [
    { id: 1, name: 'Full Health Checkup - Oct 2025', date: '2025-10-01', type: 'Lab Result', size: '2.4 MB' },
    { id: 2, name: 'Cardiology Summary', date: '2025-09-15', type: 'Specialist Report', size: '1.2 MB' },
    { id: 3, name: 'AI Monthly Insight Report', date: '2025-09-30', type: 'Generated', size: '0.8 MB' }
  ];

  return (
    <div className="reports-container">
      <div className="reports-header">
        <div>
          <h1 className="reports-title">My Health Reports</h1>
          <p className="reports-subtitle">Download and analyze your medical history and AI-generated health metrics</p>
        </div>
        <div className="header-actions">
          <button className="btn-header btn-primary">
            <Printer size={20} />
            Print All
          </button>
          <button className="btn-header btn-secondary">
            <Share2 size={20} />
            Share
          </button>
        </div>
      </div>

      <div className="stats-grid">
        {[
          { label: 'Reports Generated', value: '24', icon: FileText, color: '#3b82f6' },
          { label: 'AI Risk Scans', value: '156', icon: Zap, color: '#f59e0b' },
          { label: 'Lab Syncs', value: '12', icon: Activity, color: '#10b981' },
          { label: 'Avg Pulse', value: '72 bpm', icon: Heart, color: '#ef4444' }
        ].map((stat, i) => (
          <div key={i} className="stat-card">
            <stat.icon style={{ color: stat.color, marginBottom: '12px' }} size={24} />
            <h3 style={{ fontSize: '2rem', margin: '0', color: 'white' }}>{stat.value}</h3>
            <p style={{ margin: '4px 0 0 0', color: '#94a3b8' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="reports-main-grid">
        <div className="glass-panel">
          <div className="panel-header">
            <h2 className="panel-title">Heart Rate & Activity Trend</h2>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="select-period"
            >
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={vitalsTrend}>
                <defs>
                  <linearGradient id="colorSteps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="day" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ background: '#1e293b', border: 'none', color: '#fff' }} />
                <Area type="monotone" dataKey="steps" stroke="#10b981" fill="url(#colorSteps)" />
                <Line type="monotone" dataKey="heartRate" stroke="#ef4444" strokeWidth={2} dot={true} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel">
          <h2 className="panel-title" style={{ marginBottom: '20px' }}>Recent Documents</h2>
          <div className="documents-list">
            {reportsList.map(report => (
              <div key={report.id} className="document-item">
                <div className="doc-info">
                  <div className="doc-meta">
                    <div className="doc-icon-box">
                      <FileText size={20} color="#3b82f6" />
                    </div>
                    <div>
                      <p className="doc-name">{report.name}</p>
                      <p className="doc-date">{report.date} • {report.type}</p>
                    </div>
                  </div>
                  <button className="btn-download"><Download size={18} /></button>
                </div>
              </div>
            ))}
          </div>
          <button className="btn-view-all">View All Documents</button>
        </div>
      </div>

      <div className="security-footer">
        <div className="security-icon-box">
          <Shield size={32} color="#8b5cf6" />
        </div>
        <div>
          <h3 style={{ margin: '0', color: 'white' }}>Data Precision Guarantee</h3>
          <p style={{ margin: '8px 0 0 0', color: '#94a3b8', lineHeight: '1.6' }}>All reports are encrypted and HIPAA compliant. AI-generated insights are cross-verified against established medical databases with 94.5% precision.</p>
        </div>
      </div>
    </div>
  );
};


export default MyHealthReports;
