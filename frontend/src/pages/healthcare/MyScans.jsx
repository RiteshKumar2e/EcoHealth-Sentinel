import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

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
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/healthcare/stats`);
        const data = await res.json();
        if (data.success) {
          // Map backend colors and icons if needed, or just set stats
          setStats(data.stats.map(s => ({
            ...s,
            icon: s.icon === 'ImageIcon' ? ImageIcon : s.icon === 'Brain' ? Brain : s.icon === 'Clock' ? Clock : AlertCircle
          })));
        }

        const resAnalyses = await fetch(`${API_BASE_URL}/healthcare/analyses`);
        const dataAnalyses = await resAnalyses.json();
        if (dataAnalyses.success) setRecentAnalyses(dataAnalyses.recentAnalyses);
      } catch (err) {
        console.error("Fetch stats error:", err);
      }
    };
    fetchStats();
  }, []);

  const handleUploadFile = async (file) => {
    if (!selectedScan) {
      alert("Please select a scan type first.");
      return;
    }
    if (!file) return;

    setAnalysisResult(null);
    setIsAnalyzing(true);

    try {
      const response = await fetch(`${API_BASE_URL}/healthcare/upload-scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: selectedScan })
      });
      const data = await response.json();

      if (data.success) {
        setAnalysisResult(data.analysis);
        setChatMessages(prev => [...prev, {
          id: Date.now(),
          from: 'bot',
          text: `Analysis complete for your ${scanTypes.find(s => s.id === selectedScan).name}. ${data.analysis.findings}`
        }]);
      }
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsAnalyzing(false);
    }
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

    try {
      const response = await fetch(`${API_BASE_URL}/healthcare/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      const data = await response.json();
      if (data.success) {
        setChatMessages((m) => [...m, { id: Date.now() + "-b", from: "bot", text: data.reply }]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setChatMessages((m) => [...m, { id: Date.now() + "-b", from: "bot", text: "I'm having trouble connecting right now." }]);
    }
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
                <div className="stat-icon" style={{ background: s.color || 'var(--primary)' }}>
                  <Icon size={20} color="white" />
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
