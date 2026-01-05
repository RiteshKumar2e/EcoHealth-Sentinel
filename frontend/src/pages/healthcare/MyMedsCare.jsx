import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Pill, AlertTriangle, CheckCircle, Heart, Clock,
  Bell, Activity, Search, Shield, Info, Zap, Database,
  ChevronRight, ArrowRight, RefreshCw, Trash2, Calendar, Stethoscope
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './MyMedsCare.css';

const ICON_MAP = {
  Info: Info,
  Zap: Zap,
  Activity: Activity,
  Bell: Bell,
  Clock: Clock
};

const MyMedsCare = () => {
  // Persistence Helper: Load from LocalStorage
  const loadState = (key, defaultValue) => {
    const saved = localStorage.getItem(`medscare_${key} `);
    try {
      if (!saved) return defaultValue;
      const parsed = JSON.parse(saved);

      // Special handling for careInsights to restore icon components
      if (key === 'careInsights' && Array.isArray(parsed)) {
        return parsed.map(item => ({
          ...item,
          icon: ICON_MAP[item.iconName] || Info
        }));
      }

      return parsed;
    } catch {
      return defaultValue;
    }
  };

  const [symptoms, setSymptoms] = useState(loadState('symptoms', ''));
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasData, setHasData] = useState(loadState('hasData', false));
  const [activeMeds, setActiveMeds] = useState(loadState('activeMeds', []));
  const [careInsights, setCareInsights] = useState(loadState('careInsights', []));
  const [healthJourneys, setHealthJourneys] = useState(loadState('healthJourneys', []));
  const [medsTaken, setMedsTaken] = useState(loadState('medsTaken', {}));
  const [analysisResult, setAnalysisResult] = useState(loadState('analysisResult', null));
  const [reminderSet, setReminderSet] = useState(loadState('reminderSet', false));
  const navigate = useNavigate();

  // Sync with LocalStorage
  useEffect(() => {
    const dataToSave = {
      symptoms,
      hasData,
      activeMeds,
      careInsights: careInsights.map(({ icon, ...rest }) => ({ ...rest, iconName: rest.iconName || 'Info' })),
      healthJourneys,
      medsTaken,
      analysisResult,
      reminderSet
    };
    Object.entries(dataToSave).forEach(([key, value]) => {
      localStorage.setItem(`medscare_${key} `, JSON.stringify(value));
    });
  }, [symptoms, hasData, activeMeds, careInsights, healthJourneys, medsTaken, analysisResult, reminderSet]);

  const stats = [
    {
      label: 'Active Meds',
      value: activeMeds.length,
      color: '#3b82f6',
      icon: Pill
    },
    {
      label: 'Adherence',
      value: activeMeds.length ? `${Math.floor(activeMeds.reduce((acc, m) => acc + m.adherence, 0) / activeMeds.length)}% ` : '--',
      color: '#10b981',
      icon: CheckCircle
    },
    {
      label: 'Health Score',
      value: activeMeds.length ? Math.min(100, 70 + (activeMeds.length * 5)) : '--',
      color: '#8b5cf6',
      icon: Activity
    },
    {
      label: 'Alerts',
      value: careInsights.filter(i => i.priority === 'high').length,
      color: '#ef4444',
      icon: AlertTriangle
    }
  ];

  const handleToggleMed = (id) => {
    setMedsTaken(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDeleteMed = (id) => {
    setActiveMeds(prev => prev.filter(m => m.id !== id));
  };

  const handleDeleteJourney = (id) => {
    setHealthJourneys(prev => prev.filter(j => j.id !== id));
  };

  const handleAnalyzeSymptoms = () => {
    if (!symptoms.trim()) return;
    setIsAnalyzing(true);

    // Simulated AI analysis sequence
    setTimeout(() => {
      setIsAnalyzing(false);
      setHasData(true);

      const input = symptoms.toLowerCase();
      const newMeds = [];
      const newJourneys = [];
      const newInsights = [];

      // Logic to derive "results" based on input keywords
      if (input.includes('pain') || input.includes('headache') || input.includes('ache')) {
        newMeds.push({
          id: Date.now() + 1,
          name: 'Ibuprofen 400mg',
          dosage: '1 cap every 8h',
          purpose: 'Pain Management',
          remaining: '15 caps',
          adherence: 95
        });
        newInsights.push({
          id: Date.now() + 2,
          title: 'Pain Alert',
          message: 'Take medication with food to prevent stomach irritation.',
          priority: 'medium',
          icon: Info,
          iconName: 'Info'
        });
      }

      if (input.includes('fever') || input.includes('temperature') || input.includes('hot')) {
        newMeds.push({
          id: Date.now() + 3,
          name: 'Paracetamol 500mg',
          dosage: '1 tab every 6h',
          purpose: 'Fever Control',
          remaining: '20 tabs',
          adherence: 100
        });
        newJourneys.push({
          id: Date.now() + 4,
          condition: 'Temperature Monitoring',
          progress: 5,
          nextStep: 'Check temp every 4 hours',
          status: 'Started'
        });
      }

      if (input.includes('cold') || input.includes('cough') || input.includes('sneeze')) {
        newMeds.push({
          id: Date.now() + 5,
          name: 'Cough Syrup (Guaifenesin)',
          dosage: '10ml three times daily',
          purpose: 'Chest Congestion',
          remaining: '100ml',
          adherence: 85
        });
        newJourneys.push({
          id: Date.now() + 6,
          condition: 'Viral Recovery Plan',
          progress: 20,
          nextStep: 'Increase fluid intake',
          status: 'Active'
        });
      }

      // Default if no keywords match but text exists
      if (newMeds.length === 0) {
        newInsights.push({
          id: Date.now() + 7,
          title: 'Assessment Inconclusive',
          message: 'Your symptoms are complex. Please book a consultation for a detailed plan.',
          priority: 'high',
          icon: AlertTriangle,
          iconName: 'AlertTriangle'
        });
      } else {
        newInsights.push({
          id: Date.now() + 8,
          title: 'Care Plan Updated',
          message: `Extracted ${newMeds.length} medications and ${newJourneys.length} health tracks from your assessment.`,
          priority: 'low',
          icon: CheckCircle,
          iconName: 'CheckCircle'
        });
      }

      // Update state with newly "analyzed" results
      setActiveMeds(prev => [...prev, ...newMeds]);
      setHealthJourneys(prev => [...prev, ...newJourneys]);
      setCareInsights(prev => [...newInsights, ...prev].slice(0, 5)); // Keep latest 5

      setAnalysisResult({
        diagnosis: newMeds.length > 0 ? "Potential Symptom Cluster Identified" : "General Health Assessment",
        recommendation: newMeds.length > 0 ? "Follow the updated medication regime below." : "Consult a healthcare provider for specific advice.",
        confidence: newMeds.length > 0 ? "88%" : "65%"
      });
    }, 1800);
  };

  return (
    <div className="medicine-container">
      <div className="medicine-max-width">
        {/* Header Section */}
        <header className="medicine-header">
          <div className="medicine-header-content">
            <div>
              <h1 className="medicine-title">Care & Meds Planner</h1>
              <p className="medicine-subtitle">Manage your health plan with local persistence</p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => navigate('/healthcare/symptom-checker')}
                className="btn-header-action"
                style={{ background: '#eff6ff', color: '#3b82f6', border: '1px solid #dbeafe', borderRadius: '10px', padding: '10px 16px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Stethoscope size={16} /> Advanced Diagnostics
              </button>
              <div className={`status - badge ${hasData ? 'active' : 'inactive'} `}
                style={{ background: hasData ? '#f0fdf4' : '#f8fafc', color: hasData ? '#16a34a' : '#94a3b8' }}>
                <Shield size={16} />
                <span>{hasData ? 'Plan Persisted' : 'Ready'}</span>
              </div>
            </div>
          </div>
        </header>

        <section className="card symptom-starter" style={{ position: 'relative', marginBottom: '32px', border: '2px solid #3b82f615', background: 'white', padding: '28px', borderRadius: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div className="section-header" style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <h2 className="medicine-section-title" style={{ margin: 0, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'flex-start', width: '100%' }}>
              <Zap size={24} color="#3b82f6" /> {hasData ? 'Refine Your Symptoms' : 'Begin Your Assessment'}
            </h2>
            <p style={{ color: '#64748b', fontSize: '14px', margin: 0, textAlign: 'left' }}>Describe your symptoms to update or add to your plan.</p>
          </div>

          <button
            className="medicine-submit-btn"
            onClick={handleAnalyzeSymptoms}
            disabled={isAnalyzing || !symptoms.trim()}
            style={{
              position: 'absolute',
              top: '28px',
              right: '28px',
              width: 'auto',
              padding: '12px 32px',
              zIndex: 20,
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.15)'
            }}
          >
            {isAnalyzing ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <RefreshCw className="animate-spin" size={20} /> Updating...
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {hasData ? 'Add to Plan' : 'Generate Plan'} <ArrowRight size={20} />
              </span>
            )}
          </button>

          <div className="medicine-input-wrapper">
            <textarea
              placeholder="E.g., I have a persistent headache and feel slightly feverish since morning..."
              className="medicine-input"
              rows="4"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              style={{ fontSize: '16px', marginBottom: 0 }}
            />
          </div>
        </section>

        {/* Stats Grid */}
        <div className="medicine-stats-grid">
          {stats.map((stat, i) => (
            <div key={i} className="medicine-stat-card">
              <div className="medicine-stat-label">{stat.label}</div>
              <div className="medicine-stat-value" style={{ color: hasData ? stat.color : '#cbd5e1' }}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="medicine-main-grid">
          <div className="medicine-left-column">
            <section className="medicine-form-card">
              <h2 className="medicine-section-title"><Pill size={24} /> Daily Regime</h2>
              <div className="medicine-recommendations-list">
                {activeMeds.length > 0 ? (
                  activeMeds.map((med) => (
                    <div key={med.id} className="medicine-rec-card">
                      <div className="medicine-rec-header">
                        <div>
                          <h4 className="medicine-rec-name">{med.name}</h4>
                          <p className="medicine-rec-condition">{med.purpose}</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div className="rec-stats">
                            <div className="medicine-rec-confidence-label">Adherence</div>
                            <div className="medicine-rec-confidence-value" style={{ color: '#10b981' }}>{med.adherence}%</div>
                          </div>
                          <button
                            className="item-delete-btn"
                            onClick={() => handleDeleteMed(med.id)}
                            title="Remove Medication"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      <div className="medicine-rec-details-grid">
                        <div>
                          <div className="medicine-detail-label">Dosage</div>
                          <div className="medicine-detail-value">{med.dosage}</div>
                        </div>
                        <div>
                          <div className="medicine-detail-label">Inventory</div>
                          <div className="medicine-detail-value">{med.remaining}</div>
                        </div>
                      </div>
                      <button
                        className={`medicine - add - btn ${medsTaken[med.id] ? 'taken' : ''} `}
                        onClick={() => handleToggleMed(med.id)}
                      >
                        {medsTaken[med.id] ? 'Confirmed for Today' : 'Mark as Taken'}
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="empty-state-placeholder">
                    <Database size={48} color="#e2e8f0" />
                    <p>No medications in your regime. Analyze symptoms to start.</p>
                  </div>
                )}
              </div>
            </section>
          </div>

          <div className="medicine-right-column">
            <aside className="medicine-insights-container">
              <div className="medicine-insights-card">
                <h2 className="medicine-section-title"><Activity size={22} /> AI Insights</h2>
                {careInsights.length > 0 ? (
                  careInsights.map((insight) => {
                    const InsightIcon = insight.icon && typeof insight.icon === 'function' ? insight.icon : Info;
                    return (
                      <div key={insight.id} className={`medicine - insight - item priority - ${insight.priority} `}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <InsightIcon size={16} color={insight.priority === 'high' ? '#ef4444' : '#3b82f6'} />
                          <span className="medicine-insight-title">{insight.title}</span>
                        </div>
                        <p className="medicine-insight-message">{insight.message}</p>
                      </div>
                    );
                  })
                ) : (
                  <div className="empty-sidebar-state">
                    <Zap size={32} color="#f1f5f9" />
                    <p>Analysis insights will appear here.</p>
                  </div>
                )}
              </div>

              {hasData && activeMeds.length > 0 && (
                <motion.div
                  className="medicine-reminders-card"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Bell size={24} />
                    <h3 className="medicine-reminder-title">Scheduled Dose</h3>
                  </div>
                  <div className="reminder-med-name">{activeMeds[0].name}</div>
                  <div className="reminder-time">
                    <Clock size={16} /> Next: {activeMeds[0].dosage.includes('6h') ? '3:00 PM' : '9:00 PM'}
                  </div>
                  <button
                    className={`btn - reminder - action ${reminderSet ? 'active' : ''} `}
                    onClick={() => {
                      setReminderSet(!reminderSet);
                      if (!reminderSet) {
                        alert("Auto-reminder set for your next dose!");
                      }
                    }}
                    style={{
                      background: reminderSet ? '#10b981' : 'white',
                      color: reminderSet ? 'white' : '#3b82f6'
                    }}
                  >
                    {reminderSet ? 'Reminder Active ✅' : 'Set Auto-Reminder'}
                  </button>
                </motion.div>
              )}
            </aside>
          </div>
        </div>

        {/* Health Journeys History */}
        <section className="medicine-history-card">
          <h2 className="medicine-section-title"><CheckCircle size={24} /> Care Journeys</h2>
          <div className="medicine-history-grid">
            {healthJourneys.length > 0 ? (
              healthJourneys.map((plan) => (
                <div key={plan.id} className="medicine-history-item">
                  <div className="medicine-history-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Activity size={20} color="#3b82f6" />
                      <span className="medicine-status-badge status-active">{plan.status}</span>
                    </div>
                    <button
                      className="item-delete-btn"
                      onClick={() => handleDeleteJourney(plan.id)}
                      title="Clear Journey"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <h4 className="medicine-history-name">{plan.condition}</h4>
                  <div className="progress-bar-container">
                    <motion.div
                      className="progress-bar-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${plan.progress}% ` }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                  <p className="medicine-history-condition">Status: {plan.nextStep}</p>
                </div>
              ))
            ) : (
              <div className="empty-journey-state">
                <p>No active care journeys recorded.</p>
              </div>
            )}
          </div>
        </section>

        {/* RECENT RECORDS TABLE */}
        <section className="card meds-records-table-section" style={{ marginTop: '32px', padding: '28px', background: 'white', borderRadius: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid var(--meds-border)' }}>
          <div className="section-header" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className="medicine-section-title" style={{ margin: 0 }}>
              <Calendar size={24} color="#3b82f6" /> Patient Medication Records
            </h2>
            <div className="table-actions">
              <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>{activeMeds.length} Active Prescriptions</span>
            </div>
          </div>

          <div className="table-container" style={{ overflowX: 'auto' }}>
            <table className="med-records-table">
              <thead>
                <tr>
                  <th>Medicine Name</th>
                  <th>Purpose</th>
                  <th>Dosage Schedule</th>
                  <th>Inventory</th>
                  <th>Adherence</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {activeMeds.length > 0 ? (
                  activeMeds.map((med) => (
                    <tr key={med.id}>
                      <td className="font-bold">{med.name}</td>
                      <td>{med.purpose}</td>
                      <td>{med.dosage}</td>
                      <td>
                        <span className="inventory-pill">{med.remaining}</span>
                      </td>
                      <td>
                        <div className="adherence-mini-progress">
                          <div className="mini-progress-fill" style={{ width: `${med.adherence}% `, background: med.adherence > 90 ? '#10b981' : '#f59e0b' }} />
                          <span>{med.adherence}%</span>
                        </div>
                      </td>
                      <td>
                        <button className="selective-delete-btn" onClick={() => handleDeleteMed(med.id)}>
                          <Trash2 size={14} /> Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center" style={{ padding: '40px', color: '#94a3b8' }}>
                      No prescription records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MyMedsCare;