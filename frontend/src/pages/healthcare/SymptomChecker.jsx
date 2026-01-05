import React, { useState, useEffect, useRef } from 'react';
import { Brain, Activity, AlertTriangle, CheckCircle, Send, User, ChevronRight, Stethoscope, MessageSquare, History, Trash2 } from 'lucide-react';
import './SymptomChecker.css';

const SymptomChecker = () => {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({
    age: '',
    gender: '',
    symptoms: [],
    duration: '',
    severity: '',
    medicalHistory: [],
  });
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('symptomCheckerHistory');
    return saved ? JSON.parse(saved) : [];
  });
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: "Hi Anmol! I'm your AI Health Assistant. Tell me how you're feeling today, or use the form to select your symptoms." }
  ]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef(null);

  const symptomsList = [
    'Fever', 'Cough', 'Shortness of Breath', 'Fatigue', 'Headache',
    'Sore Throat', 'Nausea', 'Dizziness', 'Muscle Aches', 'Joint Pain', 'Rash',
    'Back Pain', 'Insomnia', 'Anxiety', 'Indigestion'
  ];

  useEffect(() => {
    localStorage.setItem('symptomCheckerHistory', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const deleteRecord = (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      setHistory(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleSymptomToggle = (symptom) => {
    setUserData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom]
    }));
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;
    const userMsg = { role: 'user', content: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');

    // Simulate AI response
    setTimeout(() => {
      setChatMessages(prev => [...prev, { role: 'assistant', content: "I've noted that. Please continue filling out the details on the left so I can give you a precise assessment." }]);
    }, 1000);
  };

  const runAIAnalysis = async () => {
    setIsAnalyzing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));

    const results = {
      condition: 'Common Viral Cold',
      confidence: 92,
      urgency: 'Self-Care',
      summary: 'Your symptoms align with a typical viral upper respiratory infection. Rest and hydration are key.',
      steps: [
        'Stay hydrated with warm fluids',
        'Rest for at least 8 hours tonight',
        'Monitor temperature every 6 hours'
      ],
      warnings: ['Seek help if fever exceeds 102°F', 'Contact doctor if you experience chest pain']
    };

    setAnalysis(results);
    setIsAnalyzing(false);

    // Add to History
    const newRecord = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      symptoms: userData.symptoms,
      condition: results.condition,
      urgency: results.urgency,
      solution: results.steps.join('. ') + '.'
    };
    setHistory(prev => [newRecord, ...prev]);

    setStep(4);
    setChatMessages(prev => [...prev, { role: 'assistant', content: "I've completed the analysis. Based on your inputs, it looks like a common viral cold. Please review the care steps." }]);
  };

  return (
    <div className="diagnosis-container">
      <div className="diagnosis-wrapper">

        {/* Left Column: Assessment Form */}
        <div className="diagnosis-card">
          <div className="card-header">
            <div className="header-icon-box">
              <Stethoscope size={20} />
            </div>
            <div>
              <h2 className="card-title">Symptom Assessment</h2>
              <p className="card-subtitle">Step-by-step clinical evaluation</p>
            </div>
          </div>

          {!isAnalyzing && step < 4 && (
            <div className="step-indicator">
              {[1, 2, 3].map(num => (
                <div key={num} className="step-item">
                  <div className={`step-number ${step >= num ? 'active' : ''}`}>{num}</div>
                  {num < 3 && <div className="step-line" />}
                </div>
              ))}
            </div>
          )}

          {isAnalyzing ? (
            <div className="analysis-container">
              <div className="loading-spinner"></div>
              <h3 className="section-title">Analyzing Symptoms...</h3>
              <p style={{ color: '#64748b', fontSize: '14px' }}>Comparing against medical scenarios...</p>
            </div>
          ) : step === 1 ? (
            <div>
              <h3 className="section-title">What are you experiencing?</h3>
              <div className="grid-3">
                {symptomsList.map((s, i) => (
                  <button key={i} onClick={() => handleSymptomToggle(s)} className={`btn-toggle ${userData.symptoms.includes(s) ? 'active' : ''}`}>
                    {s}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setStep(2)}
                className="btn-primary"
                disabled={userData.symptoms.length === 0}
                style={{ opacity: userData.symptoms.length === 0 ? 0.5 : 1 }}
              >
                Continue to Details <ChevronRight size={16} />
              </button>
            </div>
          ) : step === 2 ? (
            <div>
              <h3 className="section-title">How long and how severe?</h3>
              <div className="grid-2">
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '500', color: '#475569' }}>Duration</label>
                  <select className="input-field" value={userData.duration} onChange={e => setUserData({ ...userData, duration: e.target.value })}>
                    <option value="">Select duration</option>
                    <option value="1d">Less than 24 hours</option>
                    <option value="3d">1-3 Days</option>
                    <option value="1w">More than a week</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '500', color: '#475569' }}>Severity</label>
                  <select className="input-field" value={userData.severity} onChange={e => setUserData({ ...userData, severity: e.target.value })}>
                    <option value="">Select severity</option>
                    <option value="mild">Mild (Manageable)</option>
                    <option value="moderate">Moderate (Affects daily life)</option>
                    <option value="severe">Severe (Unbearable)</option>
                  </select>
                </div>
              </div>
              <div className="diagnosis-actions mt-24" style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => setStep(1)} className="btn-outline" style={{ flex: 1 }}>Back</button>
                <button onClick={() => setStep(3)} className="btn-primary" style={{ flex: 1 }} disabled={!userData.duration || !userData.severity}>Review</button>
              </div>
            </div>
          ) : step === 3 ? (
            <div>
              <h3 className="section-title">Summary Review</h3>
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
                <div style={{ marginBottom: '12px' }}>
                  <span style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600' }}>Symptoms</span>
                  <div style={{ fontSize: '14px', color: '#1e293b', fontWeight: '500' }}>{userData.symptoms.join(', ') || 'None selected'}</div>
                </div>
                <div className="grid-2">
                  <div>
                    <span style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600' }}>Duration</span>
                    <div style={{ fontSize: '14px', color: '#1e293b', fontWeight: '500' }}>{userData.duration}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600' }}>Severity</span>
                    <div style={{ fontSize: '14px', color: '#1e293b', fontWeight: '500' }}>{userData.severity}</div>
                  </div>
                </div>
              </div>
              <button onClick={runAIAnalysis} className="btn-primary">
                <Brain size={18} /> Run AI Analysis
              </button>
            </div>
          ) : (
            <div className="result-card">
              <div className="condition-header">
                <div className="condition-title">{analysis.condition}</div>
                <div className="condition-meta">
                  {analysis.confidence}% Match • {analysis.urgency}
                </div>
              </div>

              <div className="info-section">
                <div className="info-title">Recommended Care</div>
                <ul className="checklist">
                  {analysis.steps.map((s, i) => (
                    <li key={i} className="checklist-item">
                      <CheckCircle size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="warning-box">
                <AlertTriangle className="warning-icon" size={18} />
                <div className="warning-text">
                  <strong>Warning Signs:</strong> {analysis.warnings.join(', ')}
                </div>
              </div>

              <button onClick={() => setStep(1)} className="btn-outline mt-24 w-full">Start New Assessment</button>
            </div>
          )}
        </div>

        {/* Right Column: AI Chat Assistant */}
        <div className="diagnosis-card chat-sidebar-card">
          <div className="card-header">
            <div className="header-icon-box" style={{ background: '#f0f9ff', color: '#0369a1' }}>
              <MessageSquare size={20} />
            </div>
            <div>
              <h2 className="card-title">AI Assistant</h2>
              <p className="card-subtitle">Real-time guidance</p>
            </div>
          </div>

          <div className="chat-messages-container">
            {chatMessages.map((m, i) => (
              <div key={i} className={`chat-row ${m.role}`}>
                <div className={`chat-bubble ${m.role}`}>
                  {m.content}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div className="chat-input-area">
            <input
              className="input-field"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              placeholder="Ask anything..."
              onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
            />
            <button onClick={sendChatMessage} className="btn-primary" style={{ width: 'auto' }}>
              <Send size={18} />
            </button>
          </div>
        </div>

        <div className="records-section">
          <div className="card-header border-0">
            <div className="header-icon-box" style={{ background: '#ecfdf5', color: '#059669' }}>
              <History size={20} />
            </div>
            <div>
              <h2 className="card-title">Previous Assessments</h2>
              <p className="card-subtitle">Your medical analysis history</p>
            </div>
          </div>

          <div className="table-container">
            <table className="records-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Symptoms</th>
                  <th>Conditions</th>
                  <th>Status</th>
                  <th>Suggested Solution</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {history.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                      No assessments found. Run a new analysis to see results here.
                    </td>
                  </tr>
                ) : (
                  history.map(record => (
                    <tr key={record.id}>
                      <td style={{ fontWeight: '500' }}>{record.date}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                          {Array.isArray(record.symptoms) && record.symptoms.map((s, idx) => (
                            <span key={idx} style={{ fontSize: '11px', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>{s}</span>
                          ))}
                        </div>
                      </td>
                      <td style={{ fontWeight: '600', color: '#334155' }}>{record.condition}</td>
                      <td>
                        <span className={`status-badge ${record.urgency === 'Self-Care' ? 'self-care' : 'urgent'}`}>
                          {record.urgency}
                        </span>
                      </td>
                      <td style={{ fontSize: '13px', color: '#475569' }}>{record.solution}</td>
                      <td>
                        <button
                          onClick={() => deleteRecord(record.id)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#ef4444',
                            padding: '6px',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          title="Delete Record"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SymptomChecker;
