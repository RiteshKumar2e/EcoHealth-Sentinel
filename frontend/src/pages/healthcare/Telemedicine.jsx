import React, { useState, useEffect } from 'react';
import {
  Video, Phone, MessageSquare, Calendar, Users, Clock, MapPin,
  FileText, Mic, MicOff, VideoOff, PhoneOff, Share2, Star,
  AlertCircle, CheckCircle2, Info, Settings, Bell, Search,
  ChevronRight, Activity, Heart, TrendingUp, Download,
  Plus, Filter, X, Loader, Grid, Maximize, AlertTriangle,
  BarChart3, Zap, Shield, User
} from 'lucide-react';

const Telemedicine = () => {
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
    <div style={{ padding: '24px', minHeight: '100vh', background: 'transparent' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', margin: '0', color: 'white' }}>My Consultations</h1>
          <p style={{ color: '#94a3b8', margin: '8px 0 0 0' }}>Connect with your healthcare provider anytime, anywhere</p>
        </div>
        <button style={{ padding: '12px 24px', background: '#3b82f6', color: 'white', borderRadius: '12px', border: 'none', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={20} />
          Book New Session
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {stats.map((stat, i) => (
          <div key={i} style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '24px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <stat.icon style={{ color: stat.color }} size={24} />
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Live</span>
            </div>
            <h3 style={{ fontSize: '2rem', margin: '0', color: 'white' }}>{stat.value}</h3>
            <p style={{ margin: '4px 0 0 0', color: '#94a3b8', fontWeight: '500' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
        {['upcoming', 'history', 'doctors'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '10px 24px',
              borderRadius: '12px',
              border: 'none',
              background: activeTab === tab ? '#3b82f6' : 'rgba(255,255,255,0.05)',
              color: 'white',
              fontWeight: '600',
              cursor: 'pointer',
              textTransform: 'capitalize'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {sessions.map(session => (
          <div key={session.id} style={{ background: 'rgba(30, 41, 59, 0.5)', borderRadius: '24px', padding: '24px', border: '1px solid rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden' }}>
            {session.priority === 'High' && <div style={{ position: 'absolute', top: '0', left: '0', height: '4px', width: '100%', background: '#ef4444' }} />}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={32} color="white" />
              </div>
              <div>
                <h3 style={{ margin: '0', color: 'white' }}>{session.doctor}</h3>
                <p style={{ margin: '4px 0 0 0', color: '#94a3b8', fontSize: '0.9rem' }}>{session.specialty}</p>
              </div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '16px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white', marginBottom: '8px' }}>
                <Clock size={16} color="#3b82f6" />
                <span style={{ fontSize: '0.9rem' }}>{session.time}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white' }}>
                <Video size={16} color="#10b981" />
                <span style={{ fontSize: '0.9rem' }}>{session.type}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button style={{ flex: '1', padding: '12px', borderRadius: '12px', border: 'none', background: '#3b82f6', color: 'white', fontWeight: '700', cursor: 'pointer' }}>Join Room</button>
              <button style={{ padding: '12px', borderRadius: '12px', border: 'none', background: 'rgba(255,255,255,0.05)', color: 'white', cursor: 'pointer' }}><MessageSquare size={20} /></button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '40px', background: 'rgba(30, 41, 59, 0.5)', padding: '24px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <div style={{ padding: '12px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px' }}>
            <Zap size={24} color="#3b82f6" />
          </div>
          <h2 style={{ margin: '0', color: 'white' }}>AI Consultation Insight</h2>
        </div>
        <p style={{ color: '#94a3b8', lineHeight: '1.6', margin: '0' }}>Your upcoming session with Dr. Mehta is regarding your recent blood pressure trends. The AI has compiled a 7-day summary of your vitals to help the doctor make a faster assessment.</p>
      </div>
    </div>
  );
};

export default Telemedicine;
