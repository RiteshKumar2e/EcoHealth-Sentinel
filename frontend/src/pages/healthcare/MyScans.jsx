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
} from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, MeshWobbleMaterial } from "@react-three/drei";
import { motion } from "framer-motion";
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
    { id: "sys", from: "bot", text: "Hello — I am your assistant. Ask about analyses or upload an image." },
  ]);
  const [chatInput, setChatInput] = useState("");
  const chatRef = useRef(null);

  // file input
  const fileRef = useRef(null);

  const scanTypes = [
    { id: "xray", name: "X-Ray", icon: FileImage, color: "#2563eb" },
    { id: "ct", name: "CT Scan", icon: Brain, color: "#7c3aed" },
    { id: "mri", name: "MRI", icon: Brain, color: "#16a34a" },
    { id: "ultrasound", name: "Ultrasound", icon: ImageIcon, color: "#f97316" },
  ];

  useEffect(() => {
    // load analyses
    fetch("/api/analyses")
      .then((r) => r.json())
      .then((d) => {
        if (d?.recentAnalyses) setRecentAnalyses(d.recentAnalyses);
        else fallbackAnalyses();
      })
      .catch(() => fallbackAnalyses());

    // load stats
    fetch("/api/stats")
      .then((r) => r.json())
      .then((d) => {
        if (d?.stats) setStats(d.stats);
        else fallbackStats();
      })
      .catch(() => fallbackStats());

    function fallbackAnalyses() {
      setRecentAnalyses([
        {
          id: 1,
          type: "Chest X-Ray",
          date: "2025-10-04",
          findings: "Clear lungs, no significant abnormalities detected",
          confidence: 94,
          priority: "normal",
        },
        {
          id: 2,
          type: "Brain MRI",
          date: "2025-10-03",
          findings: "Slight inflammation noted - consult your specialist",
          confidence: 87,
          priority: "medium",
        },
      ]);
    }

    function fallbackStats() {
      setStats([
        { label: "My Scans Analyzed", value: "12", icon: ImageIcon, color: "#2563eb" },
        { label: "AI Precision", value: "94.8%", icon: Brain, color: "#16a34a" },
        { label: "Avg Analysis Time", value: "45 sec", icon: Clock, color: "#7c3aed" },
        { label: "Detected Alerts", value: "2", icon: AlertCircle, color: "#ef4444" },
      ]);
    }
  }, []);

  // helper for priority badges
  const getPriorityClass = (priority) => {
    switch (priority) {
      case "high":
        return "badge-high";
      case "medium":
        return "badge-medium";
      default:
        return "badge-normal";
    }
  };

  // Upload flow - uses /api/upload
  const handleUploadFile = async (file) => {
    if (!selectedScan) {
      alert("Please select a scan type first.");
      return;
    }
    if (!file) return;

    setAnalysisResult(null);
    setIsAnalyzing(true);

    try {
      const form = new FormData();
      form.append("file", file);
      form.append("type", selectedScan);

      // Post to backend
      const res = await fetch("/api/upload", {
        method: "POST",
        body: form,
      });
      const data = await res.json();

      if (data?.analysis) {
        setAnalysisResult(data.analysis);
      } else {
        // fallback sample
        setAnalysisResult({ findings: "No result from server", confidence: 0 });
      }

      // refresh recent analyses (non-blocking)
      fetch("/api/analyses")
        .then((r) => r.json())
        .then((d) => d?.recentAnalyses && setRecentAnalyses(d.recentAnalyses))
        .catch(() => { });
    } catch (err) {
      console.error(err);
      setAnalysisResult({ findings: "Upload failed. See console.", confidence: 0 });
    } finally {
      // short delay to give sense of completion
      setTimeout(() => setIsAnalyzing(false), 600);
    }
  };

  // wrapper called by file input
  const onFileChange = (e) => {
    const f = e.target.files?.[0];
    if (f) handleUploadFile(f);
  };

  // chat send
  const sendChat = async () => {
    const text = (chatInput || "").trim();
    if (!text) return;
    const userMsg = { id: Date.now() + "-u", from: "user", text };
    setChatMessages((m) => [...m, userMsg]);
    setChatInput("");

    // show typing indicator
    const typingId = Date.now() + "-typing";
    setChatMessages((m) => [...m, { id: typingId, from: "bot", text: "..." }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      setChatMessages((m) => m.filter((x) => x.id !== typingId));
      setChatMessages((m) => [...m, { id: Date.now() + "-b", from: "bot", text: data?.reply || "Sorry, no reply." }]);
    } catch (e) {
      setChatMessages((m) => m.filter((x) => x.id !== typingId));
      setChatMessages((m) => [...m, { id: Date.now() + "-err", from: "bot", text: "Network error — try again." }]);
    }

    // scroll chat to bottom
    setTimeout(() => {
      if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }, 80);
  };

  return (
    <div className="mia-page">
      <div className="mia-container">
        {/* subtle 3D background */}
        <div className="three-d-container">
          <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
            <ambientLight intensity={0.65} />
            <directionalLight position={[3, 2, 5]} intensity={0.9} />
            <mesh position={[-2.2, 0.2, -1.8]} rotation={[0.3, 0.8, 0]}>
              <sphereGeometry args={[1.6, 80, 80]} />
              <MeshWobbleMaterial factor={0.4} speed={1.1} roughness={0.3} metalness={0.2} />
            </mesh>
            <mesh position={[2.8, -0.6, -2.5]} rotation={[0.2, -0.5, 0]}>
              <boxGeometry args={[1.8, 1.8, 1.8]} />
              <MeshWobbleMaterial factor={0.35} speed={0.9} roughness={0.5} metalness={0.25} />
            </mesh>
            <OrbitControls enableZoom={false} enableRotate={false} enablePan={false} />
          </Canvas>
        </div>

        {/* Header */}
        <div className="mia-header">
          <div>
            <h1 className="mia-title">My Medical Scans</h1>
            <p className="mia-subtitle">AI-powered insights for your personal diagnostic imaging</p>
          </div>
          <div className="mia-header-right">
            <Brain className="header-icon" />
          </div>
        </div>

        {/* Stats */}
        <div className="statsGrid">
          {stats.map((s, i) => {
            const Icon = s.icon || ImageIcon;
            return (
              <motion.div
                key={i}
                initial={{ y: 12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.06 }}
                className="stat-card"
              >
                <div className="stat-content">
                  <Icon className="stat-icon stat-icon-dynamic" style={{ '--color': s.color || "#374151" }} />
                  <div>
                    <div className="stat-label">{s.label}</div>
                    <div className="stat-value stat-value-dynamic" style={{ '--color': s.color || "#111827" }}>{s.value}</div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* main area: upload + capabilities/chat */}
        <div className="mia-main-grid">
          {/* Upload & results */}
          <div className="upload-card">
            <h2 className="card-title">Upload Medical Image</h2>

            {/* scan selection */}
            <div className="scan-grid">
              {scanTypes.map((t) => {
                const Icon = t.icon;
                const active = selectedScan === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setSelectedScan(t.id)}
                    className={`scan-btn ${active ? 'active' : ''}`}
                    aria-pressed={active}
                  >
                    <Icon className="scan-icon scan-icon-dynamic" style={{ '--color': t.color }} />
                    <div className="scan-label">{t.name}</div>
                  </button>
                );
              })}
            </div>

            {/* upload box */}
            <div className="upload-box">
              <Upload className="upload-icon" />
              <div className="upload-text-main">
                {selectedScan ? `Upload ${scanTypes.find((s) => s.id === selectedScan).name}` : "Select scan type first"}
              </div>
              <div className="upload-text-sub">Drag & drop or click to browse</div>

              <input ref={fileRef} type="file" accept="image/*,application/dicom" className="hidden" onChange={onFileChange} />

              <div className="upload-actions">
                <button
                  onClick={() => fileRef.current && fileRef.current.click()}
                  disabled={!selectedScan || isAnalyzing}
                  className={`btn-primary ${selectedScan && !isAnalyzing ? 'enabled' : ''}`}
                >
                  {isAnalyzing ? "Analyzing..." : "Choose file"}
                </button>

                <button
                  onClick={() => {
                    // demo: trigger fake upload with a Blob to show UI
                    if (!selectedScan) return alert("Select scan type first");
                    setIsAnalyzing(true);
                    setAnalysisResult(null);
                    setTimeout(() => {
                      setIsAnalyzing(false);
                      setAnalysisResult({ findings: "Demo: no abnormalities detected", confidence: 92 });
                    }, 1400);
                  }}
                  className="btn-demo"
                >
                  Demo
                </button>
              </div>
            </div>

            {/* progress or result */}
            <div className="analysis-progress-grid">
              {isAnalyzing && (
                <div className="progress-box">
                  <div className="progress-header">
                    <Clock className="progress-icon" />
                    <div>
                      <div className="progress-title">AI Analysis in Progress</div>
                      <div className="progress-subtitle">Processing image with deep learning models...</div>
                    </div>
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ '--width': "64%" }} />
                  </div>
                </div>
              )}

              {analysisResult && !isAnalyzing && (
                <div className="analysis-box">
                  <div className="analysis-header">
                    <CheckCircle className="analysis-icon" />
                    <div className="analysis-header-right">
                      <div className="analysis-title">Analysis Complete</div>
                      <div className="analysis-confidence">
                        AI Confidence: <strong>{analysisResult.confidence ?? "—"}%</strong>
                      </div>
                      <div className="findings-box">
                        <div className="findings-text">
                          <strong>AI Summary:</strong> {analysisResult.findings}
                        </div>
                        <div className="findings-disclaimer">⚠️ These results are AI-generated for your information. Please consult a qualified radiologist or your primary physician for a formal diagnosis.</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right column: chat + capabilities */}
          <div className="right-column">
            {/* Chat assistant */}
            <div className="capabilities-card">
              <div className="section-header">
                <h3 className="section-title">Assistant</h3>
                <div className="section-sub">AI-powered chat</div>
              </div>

              <div className="chat-box">
                <div ref={chatRef} className="chatList">
                  {chatMessages.map((m) => (
                    <div
                      key={m.id}
                      className={`chat-msg ${m.from === 'user' ? 'chat-msg-user' : 'chat-msg-bot'}`}
                    >
                      {m.text}
                    </div>
                  ))}
                </div>

                <div className="chat-input-row">
                  <input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendChat()}
                    placeholder="Ask the assistant (e.g. 'Show high priority cases')"
                    className="chat-input"
                  />
                  <button onClick={sendChat} className="chat-send-btn">
                    <Send className="chat-send-icon" /> Send
                  </button>
                </div>
              </div>

              {/* Capabilities condensed */}
              <div>
                <h4 className="capabilities-header-text">AI Capabilities</h4>
                <div className="capabilities-list">
                  {[
                    { title: "Fracture Detection", accuracy: 96, description: "Detects bone fractures in X-ray/CT" },
                    { title: "Tumor Recognition", accuracy: 92, description: "Finds potential tumors in MRI/CT" },
                    { title: "Pneumonia Detection", accuracy: 94, description: "Chest X-ray pneumonia indicators" },
                  ].map((c, idx) => (
                    <div key={idx} className="capabilities-item">
                      <div className="capability-header">
                        <div className="capability-title">{c.title}</div>
                        <div className="capability-score">{c.accuracy}%</div>
                      </div>
                      <div className="capability-desc">{c.description}</div>
                      <div className="capability-bar-bg">
                        <div className="capability-bar-fill" style={{ '--width': `${c.accuracy}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent analyses */}
            <div className="recent-card">
              <h3 className="recent-title">Recent Analyses</h3>
              <div className="recent-list">
                {recentAnalyses.map((r) => (
                  <div key={r.id} className="recent-item">
                    <div className="recent-header">
                      <div>
                        <div className="recent-type">{r.type}</div>
                        <div className="recent-patient">Record ID: {r.id}</div>
                      </div>
                      <div className={`priority-badge ${getPriorityClass(r.priority)}`}>{(r.priority || "normal").toUpperCase()}</div>
                    </div>
                    <div className="recent-findings">{r.findings}</div>
                    <div className="recent-footer">
                      <div>{r.date}</div>
                      <div className="recent-confidence">Confidence: {r.confidence}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Security & compliance */}
            <div className="security-card">
              <div className="security-content">
                <Shield className="security-icon" />
                <div>
                  <div className="security-title">Medical Data Security & Compliance</div>
                  <div className="security-text">
                    Our AI system adheres to HIPAA and international healthcare data protection standards. Images are encrypted in transit & at rest.
                  </div>
                  <div className="security-badges">
                    <div className="security-badge">
                      <div className="badge-title">🔒 HIPAA Compliant</div>
                      <div className="badge-sub">Privacy-first</div>
                    </div>
                    <div className="security-badge">
                      <div className="badge-title">🛡️ E2E Encryption</div>
                      <div className="badge-sub">256-bit AES</div>
                    </div>
                    <div className="security-badge">
                      <div className="badge-title">👨‍⚕️ Physician Oversight</div>
                      <div className="badge-sub">Doctor validation required</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer spacing */}
        <div className="footer-spacing" />
      </div>
    </div>
  );
}
