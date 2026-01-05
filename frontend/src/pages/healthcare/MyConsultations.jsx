import React, { useState, useEffect } from 'react';
import {
  Video, Phone, MessageSquare, Calendar, Users, Clock, MapPin,
  FileText, Mic, MicOff, VideoOff, PhoneOff, Share2, Star,
  AlertCircle, CheckCircle2, Info, Settings, Bell, Search,
  ChevronRight, Activity, Heart, TrendingUp, Download,
  Plus, Filter, X, Loader, Grid, Maximize, AlertTriangle,
  BarChart3, Zap, Shield, User
} from 'lucide-react';

import './MyConsultations.css';

const MyConsultations = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [stats, setStats] = useState([
    { label: 'Upcoming', value: '2', icon: Calendar, color: '#3b82f6' },
    { label: 'Completed', value: '18', icon: CheckCircle2, color: '#10b981' },
    { label: 'Care Points', value: '450', icon: Star, color: '#f59e0b' },
    { label: 'Messages', value: '5', icon: MessageSquare, color: '#8b5cf6' }
  ]);

  const sessions = [
    {
      id: 1,
      doctor: 'Dr. Mehta',
      specialty: 'General Physician',
      type: 'Video Call',
      time: 'Today, 4:30 PM',
      status: 'Confirmed',
      priority: 'High'
    },
    {
      id: 2,
      doctor: 'Dr. Sarah',
      specialty: 'Nutritionist',
      type: 'Audio Call',
      time: 'Tomorrow, 11:00 AM',
      status: 'Scheduled',
      priority: 'Medium'
    }
  ];

  return (
    <div className="consultations-container">
      <div className="consultations-header">
        <div>
          <h1 className="consultations-title">My Consultations</h1>
          <p className="consultations-subtitle">Connect with your healthcare provider anytime, anywhere</p>
        </div>
        <button className="btn-book">
          <Plus size={20} />
          Book New Session
        </button>
      </div>

      <div className="stats-grid">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <stat.icon style={{ color: stat.color }} size={24} />
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Live</span>
            </div>
            <h3 style={{ fontSize: '2rem', margin: '0', color: 'white' }}>{stat.value}</h3>
            <p style={{ margin: '4px 0 0 0', color: '#94a3b8', fontWeight: '500' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="tabs-container">
        {['upcoming', 'history', 'doctors'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="sessions-grid">
        {sessions.map(session => (
          <div key={session.id} className="session-card">
            {session.priority === 'High' && <div className="priority-high" />}
            <div className="session-header">
              <div className="doctor-avatar">
                <User size={32} color="white" />
              </div>
              <div>
                <h3 style={{ margin: '0', color: 'white' }}>{session.doctor}</h3>
                <p style={{ margin: '4px 0 0 0', color: '#94a3b8', fontSize: '0.9rem' }}>{session.specialty}</p>
              </div>
            </div>
            <div className="session-details-box">
              <div className="detail-row">
                <Clock size={16} color="#3b82f6" />
                <span style={{ fontSize: '0.9rem' }}>{session.time}</span>
              </div>
              <div className="detail-row">
                <Video size={16} color="#10b981" />
                <span style={{ fontSize: '0.9rem' }}>{session.type}</span>
              </div>
            </div>
            <div className="session-actions">
              <button className="btn-join">Join Room</button>
              <button className="btn-chat"><MessageSquare size={20} /></button>
            </div>
          </div>
        ))}
      </div>

      <div className="ai-insight-card">
        <div className="insight-header">
          <div className="insight-icon-box">
            <Zap size={24} color="#3b82f6" />
          </div>
          <h2 style={{ margin: '0', color: 'white' }}>AI Consultation Insight</h2>
        </div>
        <p style={{ color: '#94a3b8', lineHeight: '1.6', margin: '0' }}>Your upcoming session with Dr. Mehta is regarding your recent blood pressure trends. The AI has compiled a 7-day summary of your vitals to help the doctor make a faster assessment.</p>
      </div>
    </div>
  );
};


export default MyConsultations;
