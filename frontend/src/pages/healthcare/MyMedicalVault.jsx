import React, { useState, useEffect, useCallback } from 'react';
import { User, Heart, Activity, FileText, Calendar, AlertCircle, Search, Lock, Eye, Download, Edit, Plus, RefreshCw, TrendingUp, Clock, CheckCircle, XCircle, ShieldCheck, Microscope } from 'lucide-react';
import VaultLogo from '../../components/VaultLogo';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
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

  const [userProfile, setUserProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('userProfile');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          name: parsed.name || 'Guest User',
          id: 'UHID-2024-8842', // Mock ID as it's not in profile
          age: parseInt(parsed.age) || '--',
          bloodGroup: parsed.bloodGroup || '--',
          status: 'Verified'
        };
      }
    } catch (e) {
      console.error("Error loading profile", e);
    }
    return {
      name: 'Guest User',
      id: 'UHID-XXXX-XXXX',
      age: '--',
      bloodGroup: '--',
      status: 'Unverified'
    };
  });

  const handleDownload = () => {
    const doc = new jsPDF();
    const primaryColor = [59, 130, 246]; // Blue-500

    // Header
    doc.setFontSize(24);
    doc.setTextColor(...primaryColor);
    doc.text("My Medical Vault", 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 26);
    doc.line(14, 30, 196, 30); // Divider

    // Patient Profile Section
    doc.setFontSize(14);
    doc.setTextColor(30);
    doc.text("Patient Profile", 14, 40);

    autoTable(doc, {
      startY: 45,
      head: [['Field', 'Value']],
      body: [
        ['Name', userProfile.name],
        ['Patient ID', userProfile.id],
        ['Age', userProfile.age],
        ['Blood Group', userProfile.bloodGroup],
        ['Status', userProfile.status]
      ],
      theme: 'grid',
      headStyles: { fillColor: primaryColor, textColor: 255, fontStyle: 'bold' },
      styles: { fontSize: 10, cellPadding: 6 },
      columnStyles: { 0: { fontStyle: 'bold', cellWidth: 50 } }
    });

    let finalY = doc.lastAutoTable.finalY + 15;

    // Vitals Section
    doc.setFontSize(14);
    doc.setTextColor(30);
    doc.text("Latest Vitals", 14, finalY);

    const vitalsData = Object.entries(vitalSigns).map(([key, v]) => [
      key.replace(/([A-Z])/g, ' $1').trim().replace(/^\w/, c => c.toUpperCase()),
      v.value,
      v.status,
      v.timestamp
    ]);

    if (vitalsData.length > 0) {
      autoTable(doc, {
        startY: finalY + 5,
        head: [['Vital Sign', 'Value', 'Status', 'Recorded At']],
        body: vitalsData,
        theme: 'striped',
        headStyles: { fillColor: [71, 85, 105] }, // Slate-700
      });
      finalY = doc.lastAutoTable.finalY + 15;
    } else {
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text("No vital signs recorded.", 14, finalY + 8);
      finalY += 15;
    }

    // Medical History Section
    doc.setFontSize(14);
    doc.setTextColor(30);
    doc.text("Medical History", 14, finalY);

    const historyData = medicalHistory.map(h => [h.date, h.type, h.diagnosis, h.notes]);

    if (historyData.length > 0) {
      autoTable(doc, {
        startY: finalY + 5,
        head: [['Date', 'Type', 'Diagnosis', 'Notes']],
        body: historyData,
        theme: 'striped',
        headStyles: { fillColor: [71, 85, 105] },
      });
      finalY = doc.lastAutoTable.finalY + 15;
    } else {
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text("No medical history records available.", 14, finalY + 8);
      finalY += 15;
    }

    // Prescriptions Section
    doc.setFontSize(14);
    doc.setTextColor(30);
    doc.text("Active Medications", 14, finalY);

    const medsData = prescriptions.map(p => [p.medicine, p.dosage, p.duration]);

    if (medsData.length > 0) {
      autoTable(doc, {
        startY: finalY + 5,
        head: [['Medicine', 'Dosage', 'Duration']],
        body: medsData,
        theme: 'striped',
        headStyles: { fillColor: [71, 85, 105] },
      });
    } else {
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text("No active prescriptions.", 14, finalY + 8);
    }

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text('EcoHealth Sentinel - Sensitive Medical Data', 105, 290, { align: 'center' });
    }

    doc.save(`Medical_Vault_${userProfile.name.replace(/\s+/g, '_')}.pdf`);
  };

  // const handleAddRecord removed

  const showNotification = useCallback((message, type) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  }, []);

  const generateData = useCallback(() => {
    setStats([]);
    setRecords([]);
    setMedicalHistory([]);
    setVitalSigns({});
    setPrescriptions([]);
    setAiInsights([]);
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
          <div className="header-content" style={{ justifyContent: 'flex-start', gap: '24px' }}>
            <VaultLogo size={56} />
            <div>
              <h1 className="header-title">My Medical Vault</h1>
              <div className="header-subtitle">
                <span>Access your digital healthcare identity and medical history</span>
              </div>
            </div>
          </div>
        </div>

        <div className="stats-grid">
          {stats.map((stat, i) => (
            <div key={i} className="medical-vault-stat-card">
              <div className="medical-vault-icon-wrapper"><stat.icon size={24} /></div>
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
              {filteredRecords.length > 0 ? (
                filteredRecords.map(rec => (
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
                        <span className="risk-badge">{rec.status}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <FileText size={32} className="empty-icon" />
                  <p>No records found</p>
                </div>
              )}
            </div>
          </div>

          <div className="patient-details">
            <div className="details-card">
              <div className="patient-overview-header">
                <div className="patient-avatar-section">
                  <div className="patient-avatar"><User size={40} /></div>
                  <div className="patient-name-section">
                    <h2>{userProfile.name}</h2>
                    <p>{userProfile.id} • {userProfile.age}Y • {userProfile.bloodGroup}</p>
                  </div>
                </div>
                <div className="action-buttons">
                  <button className="action-btn btn-blue" onClick={handleDownload}><Download size={20} /></button>
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
                      <div className="vital-value">{v.value}</div>
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
                      <div className="info-value">{px.dosage}</div>
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
            <Lock size={40} className="security-icon" />
            <div className="security-text-content">
              <h3 className="security-title">Your Records are Secure</h3>
              <p className="security-description">Encoded with AES-256 bits encryption. Only you and authorized doctors can access these records via private keys.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}