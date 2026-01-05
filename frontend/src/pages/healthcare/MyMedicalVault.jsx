import React, { useState, useEffect, useCallback } from 'react';
import { User, Heart, Activity, FileText, Calendar, AlertCircle, Search, Lock, Eye, Download, Edit, Plus, RefreshCw, TrendingUp, Clock, CheckCircle, XCircle, ShieldCheck, Microscope } from 'lucide-react';
import './MyMedicalVault.css';

export default function MyMedicalVault() {
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [records, setRecords] = useState([]);
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [vitalSigns, setVitalSigns] = useState({});
  const [prescriptions, setPrescriptions] = useState([]);
  const [aiInsights, setAiInsights] = useState([]);
  const [stats, setStats] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const userProfile = {
    name: 'Anmol Sharma',
    id: 'UHID-9842-2024',
    age: 26,
    bloodGroup: 'O+ Positive',
    status: 'Verified'
  };

  const showNotification = useCallback((message, type) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  }, []);

  const generateData = useCallback(() => {
    setStats([
      { label: 'Total Reports', value: '42', icon: FileText, color: 'blue', trend: '+2 this month' },
      { label: 'Active Meds', value: '3', icon: Activity, color: 'green', trend: 'Consistency 95%' },
      { label: 'Care Points', value: '1,250', icon: ShieldCheck, color: 'purple', trend: 'Top 5% User' },
      { label: 'Health Risk', value: 'Low', icon: AlertCircle, color: 'green', trend: 'Improving' }
    ]);

    setRecords([
      { id: 'REC-001', title: 'Complete Blood Count', date: '2025-10-01', category: 'Lab Report', provider: 'City Diagnostics', status: 'normal' },
      { id: 'REC-002', title: 'Chest X-Ray Digital', date: '2025-09-15', category: 'Radiology', provider: 'General Hospital', status: 'stable' },
      { id: 'REC-003', title: 'Cardiology Consultation', date: '2025-08-20', category: 'Consultation', provider: 'Dr. Mehta', status: 'follow-up' },
      { id: 'REC-004', title: 'Annual Health Check', date: '2025-07-10', category: 'General', provider: 'Health Clinic', status: 'completed' },
      { id: 'REC-005', title: 'Lipid Profile', date: '2025-06-05', category: 'Lab Report', provider: 'City Diagnostics', status: 'normal' }
    ]);

    setMedicalHistory([
      { date: '2025-10-01', type: 'Consultation', doctor: 'Dr. Mehta', diagnosis: 'Mild Hypertension', notes: 'Advised low salt diet and regular monitoring.' },
      { date: '2025-09-15', type: 'Imaging', doctor: 'Dr. Sarah', diagnosis: 'Normal X-Ray', notes: 'Clear lungs, heart size normal.' }
    ]);

    setVitalSigns({
      bloodPressure: { value: '118/76', status: 'normal', timestamp: 'Today, 8:00 AM' },
      heartRate: { value: '72 bpm', status: 'normal', timestamp: 'Today, 8:00 AM' },
      oxygenLevel: { value: '98%', status: 'normal', timestamp: 'Today, 8:00 AM' },
      bodyTemp: { value: '98.4°F', status: 'normal', timestamp: 'Today, 8:00 AM' }
    });

    setPrescriptions([
      { medicine: 'Multivitamin Gold', dosage: 'Once daily after breakfast', duration: '3 months', status: 'active' },
      { medicine: 'Cal-D Supplement', dosage: 'Twice a week', duration: 'Ongoing', status: 'active' }
    ]);

    setAiInsights([
      { type: 'positive', title: 'Vitals Stable', message: 'Your BP and Heart Rate have been within optimal range for 30 days.' },
      { type: 'schedule', title: 'Flu Vaccine Due', message: 'It has been 12 months since your last shot. Recommended now.' }
    ]);

    setLastUpdated(new Date());
  }, []);

  useEffect(() => {
    generateData();
  }, [generateData]);

  const filteredRecords = records.filter(rec =>
    rec.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rec.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="patient-records-container">
      <div className="notification-container">
        {notifications.map(n => (
          <div key={n.id} className={`notification ${n.type}`}>
            {n.type === 'success' ? <CheckCircle size={20} /> : <Activity size={20} />}
            <span>{n.message}</span>
          </div>
        ))}
      </div>

      <div className="content-wrapper">
        <div className="header-card">
          <div className="header-content">
            <div>
              <h1 className="header-title">My Medical Vault</h1>
              <div className="header-subtitle">
                <span>Access your digital healthcare identity and medical history</span>
                <span className="last-updated"><Clock size={14} /> Updated: {lastUpdated.toLocaleTimeString()}</span>
              </div>
            </div>
            <ShieldCheck size={64} className="header-icon" opacity={0.2} />
          </div>
        </div>

        <div className="stats-grid">
          {stats.map((stat, i) => (
            <div key={i} className="stat-card" style={{ '--stat-color-from': '#3b82f6', '--stat-color-to': '#2563eb' }}>
              <div className="stat-icon-wrapper"><stat.icon size={28} color="white" /></div>
              <div className="stat-label">{stat.label}</div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-trend">{stat.trend}</div>
            </div>
          ))}
        </div>

        <div className="main-grid">
          <div className="patient-list-card">
            <div className="search-wrapper">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder="Search reports or categories..."
                className="search-input"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="patient-list">
              {filteredRecords.map(rec => (
                <div
                  key={rec.id}
                  className={`patient-item ${selectedRecord?.id === rec.id ? 'active' : ''}`}
                  onClick={() => setSelectedRecord(rec)}
                >
                  <div className="patient-item-content">
                    <div className="patient-header">
                      <div>
                        <div className="patient-name">{rec.title}</div>
                        <div className="patient-id">{rec.category}</div>
                      </div>
                    </div>
                    <div className="patient-meta">
                      <span>{rec.date}</span>
                      <span className="risk-badge" style={{ fontSize: '0.7rem' }}>{rec.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="patient-details">
            <div className="details-card">
              <div className="patient-overview-header">
                <div className="patient-avatar-section">
                  <div className="patient-avatar"><User size={40} color="white" /></div>
                  <div className="patient-name-section">
                    <h2>{userProfile.name}</h2>
                    <p>{userProfile.id} • {userProfile.age}Y • {userProfile.bloodGroup}</p>
                  </div>
                </div>
                <div className="action-buttons">
                  <button className="action-btn btn-blue"><Download size={20} /></button>
                  <button className="action-btn btn-purple"><Plus size={20} /></button>
                </div>
              </div>
            </div>

            <div className="view-tabs">
              {['overview', 'vitals', 'history', 'prescriptions'].map(mode => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`tab-btn ${viewMode === mode ? 'active' : ''}`}
                >
                  {mode}
                </button>
              ))}
            </div>

            {viewMode === 'overview' && (
              <div className="details-card">
                <h3 className="card-title section-title-lg">AI Health Analysis</h3>
                <div className="insights-container">
                  {aiInsights.map((ins, i) => (
                    <div key={i} className={`insight-card ${ins.type}`}>
                      <h4 className="insight-title">{ins.title}</h4>
                      <p className="insight-message">{ins.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {viewMode === 'vitals' && (
              <div className="details-card">
                <h3 className="card-title section-title-lg">Latest Vitals</h3>
                <div className="vitals-grid">
                  {Object.entries(vitalSigns).map(([key, v]) => (
                    <div key={key} className="vital-card">
                      <div className="vital-label">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                      <div className="vital-value" style={{ color: '#3b82f6' }}>{v.value}</div>
                      <div className="vital-timestamp">{v.timestamp}</div>
                      <span className={`vital-status-badge ${v.status}`}>{v.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {viewMode === 'history' && (
              <div className="details-card">
                <h3 className="card-title section-title-lg">Medical History</h3>
                <div className="history-container">
                  {medicalHistory.map((h, i) => (
                    <div key={i} className="history-card">
                      <div className="history-header">
                        <div><div className="history-type">{h.type}</div></div>
                        <div className="history-date"><Calendar size={14} /> {h.date}</div>
                      </div>
                      <div className="history-diagnosis">{h.diagnosis}</div>
                      <div className="history-notes">{h.notes}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {viewMode === 'prescriptions' && (
              <div className="details-card">
                <h3 className="card-title section-title-lg">Active Medications</h3>
                <div className="prescriptions-container">
                  {prescriptions.map((px, i) => (
                    <div key={i} className="prescription-card">
                      <div className="prescription-name">{px.medicine}</div>
                      <div className="info-value" style={{ fontSize: '0.9rem' }}>{px.dosage}</div>
                      <div className="prescription-start-date">Duration: {px.duration}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="security-notice">
          <div className="security-content">
            <Lock size={40} color="white" />
            <div style={{ marginLeft: '20px' }}>
              <h3 className="security-title">Your Records are Secure</h3>
              <p className="security-description">Encoded with AES-256 bits encryption. Only you and authorized doctors can access these records via private keys.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}