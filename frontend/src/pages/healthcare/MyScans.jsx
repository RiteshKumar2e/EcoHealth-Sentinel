// MedicalImageAnalysis.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  Upload,
  Image as ImageIcon,
  Brain,
  AlertCircle,
  CheckCircle,
  Clock,
  Shield,
  FileImage,
  Send,
  Activity,
  FileText
} from "lucide-react";
import './MyScans.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export default function MyScans() {
  // UI state
  const [selectedScan, setSelectedScan] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  // dynamic content from backend
  const [recentAnalyses, setRecentAnalyses] = useState([]);
  const [stats, setStats] = useState([]);

  // chat
  const [chatMessages, setChatMessages] = useState([
    { id: "sys", from: "bot", text: "Hello — I am your AI Medical Assistant. Upload a scan to get started or ask me about your history." },
  ]);
  const [chatInput, setChatInput] = useState("");
  const chatRef = useRef(null);

  // file input
  const fileRef = useRef(null);

  const scanTypes = [
    { id: "xray", name: "X-Ray", icon: FileImage },
    { id: "ct", name: "CT Scan", icon: Activity },
    { id: "mri", name: "MRI", icon: Brain },
    { id: "ultrasound", name: "Ultrasound", icon: ImageIcon },
  ];

  useEffect(() => {
    // In a real app, you would fetch this from your API
    // const fetchData = async () => {
    //   const response = await fetch(`${API_BASE_URL}/scans`);
    //   ...
    // };
    setStats([
      { label: "Scans Analyzed", value: "0", icon: FileText },
      { label: "AI Precision", value: "0%", icon: Brain },
      { label: "Avg Analysis Time", value: "0s", icon: Clock },
      { label: "Pending Reviews", value: "0", icon: AlertCircle },
    ]);
  }, []);

  const handleUploadFile = async (file) => {
    if (!selectedScan) {
      alert("Please select a scan type first.");
      return;
    }
    if (!file) return;

    setAnalysisResult(null);
    setIsAnalyzing(true);

    // Simulate API Call
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisResult({
        findings: "No acute fracture identified in the visible cortical bone structures. Soft tissues appear normal.",
        confidence: 96
      });
      setChatMessages(prev => [...prev, { id: Date.now(), from: 'bot', text: `Analysis complete for your ${scanTypes.find(s => s.id === selectedScan).name}. Results appear normal with 96% confidence.` }]);
    }, 2000);
  };

  const onFileChange = (e) => {
    const f = e.target.files?.[0];
    if (f) handleUploadFile(f);
  };

  const sendChat = async () => {
    const text = (chatInput || "").trim();
    if (!text) return;
    const userMsg = { id: Date.now() + "-u", from: "user", text };
    setChatMessages((m) => [...m, userMsg]);
    setChatInput("");

    // Simulate response
    setTimeout(() => {
      setChatMessages((m) => [...m, { id: Date.now() + "-b", from: "bot", text: "I can help explain your scan results. Please consult a doctor for a definitive diagnosis." }]);
    }, 1000);
  };

  return (
    <div className="mia-page">
      <div className="mia-container">

        {/* Header */}
        <div className="mia-header">
          <div>
            <h1 className="mia-title">My Medical Scans</h1>
            <p className="mia-subtitle">AI-powered diagnostic imaging feedback</p>
          </div>
          <div className="header-icon-box">
            <Brain size={24} />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="stat-card">
                <div className="stat-icon">
                  <Icon size={20} />
                </div>
                <div className="stat-info">
                  <div className="stat-value">{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="mia-main-grid">

          {/* Left Column: Upload & Analysis */}
          <div className="main-column">
            <div className="content-card">
              <h2 className="card-title">New Analysis</h2>

              {/* Scan Type Selection */}
              <div className="scan-grid">
                {scanTypes.map((t) => {
                  const Icon = t.icon;
                  return (
                    <div
                      key={t.id}
                      onClick={() => setSelectedScan(t.id)}
                      className={`scan-btn ${selectedScan === t.id ? 'active' : ''}`}
                    >
                      <Icon className="scan-icon" size={24} />
                      <span className="scan-label">{t.name}</span>
                    </div>
                  );
                })}
              </div>

              {/* Upload Box */}
              <div className="upload-box">
                <Upload className="upload-icon-large" size={48} />
                <div className="upload-title">
                  {selectedScan ? `Upload ${scanTypes.find(s => s.id === selectedScan).name} Image` : "Select Scan Type"}
                </div>
                <p className="upload-subtitle">DICOM, JPEG, or PNG supported</p>

                <input ref={fileRef} type="file" accept="image/*,application/dicom" style={{ display: 'none' }} onChange={onFileChange} />

                <div className="upload-actions">
                  <button
                    onClick={() => fileRef.current && fileRef.current.click()}
                    disabled={!selectedScan || isAnalyzing}
                    className="btn-primary"
                    style={{ width: '100%' }}
                  >
                    {isAnalyzing ? "Processing..." : "Select File"}
                  </button>
                </div>
              </div>

              {/* Analysis Result */}
              {(isAnalyzing || analysisResult) && (
                <div className="analysis-box">
                  {isAnalyzing ? (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                      <Clock className="spin" size={24} style={{ color: '#059669', marginBottom: '8px' }} />
                      <p style={{ color: '#047857', fontWeight: '500' }}>Analyzing medical imagery...</p>
                    </div>
                  ) : (
                    <>
                      <div className="analysis-header">
                        <div className="analysis-status">
                          <CheckCircle size={18} /> Analysis Complete
                        </div>
                        <div className="confidence-score">
                          {analysisResult.confidence}% Confidence
                        </div>
                      </div>
                      <div className="findings-text">
                        <strong>AI Summary:</strong> {analysisResult.findings}
                      </div>
                      <div className="disclaimer">
                        *This results is generated by AI and should be reviewed by a certified radiologist.
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Chat & Recent */}
          <div className="side-column">

            {/* AI Chat */}
            <div className="content-card">
              <h2 className="card-title">Assistant</h2>
              <div className="chat-container">
                <div className="chat-messages" ref={chatRef}>
                  {chatMessages.map(m => (
                    <div key={m.id} className={`chat-bubble ${m.from}`}>
                      {m.text}
                    </div>
                  ))}
                </div>
                <div className="chat-input-area">
                  <input
                    className="chat-input"
                    placeholder="Ask about findings..."
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && sendChat()}
                  />
                  <button onClick={sendChat} className="send-btn">
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Scans (Compact) */}
            <div className="content-card">
              <h2 className="card-title">Recent History</h2>
              <div className="recent-list">
                {recentAnalyses.length > 0 ? (
                  recentAnalyses.map(scan => (
                    <div key={scan.id} className="recent-item">
                      <div className="recent-header">
                        <span className="recent-type">{scan.type}</span>
                        <span className="recent-date">{scan.date}</span>
                      </div>
                      <div className="recent-snippet">{scan.findings}</div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">No recent scans found</div>
                )}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

