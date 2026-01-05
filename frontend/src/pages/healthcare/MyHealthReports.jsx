import React, { useState } from 'react';
import { FileText, Download, TrendingUp, Calendar, BarChart3, Filter, Search, Printer, Share2, Mail, Clock, Shield, Bell, Zap, Activity, Heart } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
    <div style={{ padding: '24px', minHeight: '100vh', background: 'transparent' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', margin: '0', color: 'white' }}>My Health Reports</h1>
          <p style={{ color: '#94a3b8', margin: '8px 0 0 0' }}>Download and analyze your medical history and AI-generated health metrics</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{ padding: '12px 24px', background: '#3b82f6', color: 'white', borderRadius: '12px', border: 'none', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Printer size={20} />
            Print All
          </button>
          <button style={{ padding: '12px 24px', background: 'rgba(255,255,255,0.05)', color: 'white', borderRadius: '12px', border: 'none', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Share2 size={20} />
            Share
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {[
          { label: 'Reports Generated', value: '24', icon: FileText, color: '#3b82f6' },
          { label: 'AI Risk Scans', value: '156', icon: Zap, color: '#f59e0b' },
          { label: 'Lab Syncs', value: '12', icon: Activity, color: '#10b981' },
          { label: 'Avg Pulse', value: '72 bpm', icon: Heart, color: '#ef4444' }
        ].map((stat, i) => (
          <div key={i} style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '24px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <stat.icon style={{ color: stat.color, marginBottom: '12px' }} size={24} />
            <h3 style={{ fontSize: '2rem', margin: '0', color: 'white' }}>{stat.value}</h3>
            <p style={{ margin: '4px 0 0 0', color: '#94a3b8' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div style={{ background: 'rgba(30, 41, 59, 0.5)', borderRadius: '24px', padding: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ margin: '0', color: 'white', fontSize: '1.25rem' }}>Heart Rate & Activity Trend</h2>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: '8px' }}
            >
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div style={{ height: '350px' }}>
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

        <div style={{ background: 'rgba(30, 41, 59, 0.5)', borderRadius: '24px', padding: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h2 style={{ margin: '0 0 20px 0', color: 'white', fontSize: '1.25rem' }}>Recent Documents</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {reportsList.map(report => (
              <div key={report.id} style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ padding: '10px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '10px' }}>
                      <FileText size={20} color="#3b82f6" />
                    </div>
                    <div>
                      <p style={{ margin: '0', color: 'white', fontWeight: '600', fontSize: '0.9rem' }}>{report.name}</p>
                      <p style={{ margin: '4px 0 0 0', color: '#94a3b8', fontSize: '0.75rem' }}>{report.date} • {report.type}</p>
                    </div>
                  </div>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}><Download size={18} /></button>
                </div>
              </div>
            ))}
          </div>
          <button style={{ width: '100%', marginTop: '20px', padding: '12px', borderRadius: '12px', border: '2px solid rgba(37, 99, 235, 0.5)', background: 'transparent', color: '#3b82f6', fontWeight: '700', cursor: 'pointer' }}>View All Documents</button>
        </div>
      </div>

      <div style={{ marginTop: '32px', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(37, 99, 235, 0.1))', padding: '24px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '20px', alignItems: 'center' }}>
        <div style={{ padding: '16px', background: 'rgba(255,255,255,0.1)', borderRadius: '16px' }}>
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
