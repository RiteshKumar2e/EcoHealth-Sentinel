import React, { useState, useEffect, useRef } from 'react';
import { Bug, Shield, AlertTriangle, Leaf, Camera, CheckCircle, Send, Bot, X, Upload, Calendar, MapPin, Phone, Mail, Clock, XCircle, Check, Search, Filter, CloudRain, Thermometer, Wind, Activity, TrendingUp } from 'lucide-react';
import './PestControl.css';

const PestControl = () => {
  const [selectedPest, setSelectedPest] = useState(null);
  const [activeTab, setActiveTab] = useState('detection');
  const [searchTerm, setSearchTerm] = useState('');
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { type: 'bot', text: 'Hello! I\'m your AI Pest Control Assistant. Ask me anything about pest management!' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showExpertModal, setShowExpertModal] = useState(false);
  const [notification, setNotification] = useState(null);
  const [detectionResult, setDetectionResult] = useState(null);
  const [showError, setShowError] = useState(false);

  // Backend Data State
  const [pests, setPests] = useState([]);
  const [scheduledTreatments, setScheduledTreatments] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  const [scheduleForm, setScheduleForm] = useState({
    pest: '',
    treatment: '',
    date: '',
    area: '',
    notes: ''
  });
  const chatEndRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsDataLoading(true);
      const [pestsRes, treatmentsRes] = await Promise.all([
        fetch('/api/agriculture/pests'),
        fetch('/api/agriculture/treatments')
      ]);

      if (pestsRes.ok) setPests(await pestsRes.json());
      if (treatmentsRes.ok) setScheduledTreatments(await treatmentsRes.json());

    } catch (error) {
      console.error('Error fetching data:', error);
      showNotification('Failed to connect to server', 'error');
    } finally {
      setIsDataLoading(false);
    }
  };

  const filteredPests = pests.filter(pest =>
    pest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (pest.crops && pest.crops.some(c => c.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = { type: 'user', text: chatInput };
    setChatMessages(prev => [...prev, userMessage]);
    const query = chatInput.toLowerCase();
    setChatInput('');
    setIsLoading(true);

    setTimeout(() => {
      let botResponse = {
        type: 'bot',
        text: ''
      };

      if (query.includes('neem') || query.includes('organic')) {
        botResponse.text = '🌿 Neem oil is excellent! Mix 5ml neem oil + 2ml liquid soap per liter of water. Spray in early morning or evening. Repeat every 7-10 days. Very effective against aphids, whiteflies, and mealybugs!';
      } else if (query.includes('aphid')) {
        botResponse.text = '🐛 For aphids, I recommend: 1) Neem oil spray, 2) Ladybugs (natural predators), 3) Soap water solution. Avoid chemical pesticides unless severe infestation. Want detailed instructions?';
      } else if (query.includes('schedule') || query.includes('treatment')) {
        botResponse.text = '📅 I can help you schedule treatments! Click the "Schedule Treatment" button on any pest card, or go to the Treatment Schedule tab to manage your plans.';
      } else if (query.includes('detect') || query.includes('identify')) {
        botResponse.text = '📸 Upload a clear image of the pest or affected plant in the AI Detection section. Our AI will identify it with 90%+ accuracy and suggest treatments!';
      } else if (query.includes('cost') || query.includes('price')) {
        botResponse.text = '💰 Organic solutions are cost-effective! Neem oil: ₹50-100/liter (treats large area). Ladybugs: ₹200-300/pack. Chemical pesticides cost more and harm the environment.';
      } else {
        botResponse.text = 'I can help you with: 🐛 Pest identification, 🌿 Organic treatments, 📅 Treatment scheduling, 💰 Cost comparison, and 📚 Prevention tips. What would you like to know?';
      }

      setChatMessages(prev => [...prev, botResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileName = file.name.toLowerCase();

      // Detection logic same as CropDiseaseDetection
      const blacklist = ['logo', 'code', 'compute', 'text', 'screenshot', 'banner', 'brand', 'icon', 'graphic', 'social', 'dashboard'];
      const whitelist = ['leaf', 'plant', 'crop', 'field', 'farm', 'rice', 'wheat', 'potato', 'tomato', 'corn', 'nature', 'green', 'garden', 'soil', 'earth', 'ground'];

      const containsBlacklist = blacklist.some(keyword => fileName.includes(keyword));
      const containsWhitelist = whitelist.some(keyword => fileName.includes(keyword));

      // AI Simulated Reject
      if (containsBlacklist || (!containsWhitelist && !/^\d+$/.test(fileName.split('.')[0]))) {
        setShowError(true);
        setUploadedImage(null);
        setDetectionResult(null);
        e.target.value = '';
        return;
      }

      setUploadedImage(URL.createObjectURL(file));
      setIsLoading(true);
      setDetectionResult(null);

      // Simulation - in real app, send FormData to /api/agriculture/crop-disease-detection
      setTimeout(() => {
        if (pests.length > 0) {
          const randomPest = pests[Math.floor(Math.random() * pests.length)];
          const confidence = Math.floor(Math.random() * 10) + 85;

          setDetectionResult({
            pest: randomPest,
            confidence: confidence,
            detectedAt: new Date().toLocaleTimeString()
          });
          setSelectedPest(randomPest);
          setIsLoading(false);
          showNotification(`✅ Pest detected: ${randomPest.name} (${confidence}% confidence)`, 'success');
        } else {
          setIsLoading(false);
          showNotification('No data available for identification', 'error');
        }
      }, 2000);
    }
  };

  const handleScheduleTreatment = () => {
    if (selectedPest) {
      setScheduleForm({
        ...scheduleForm,
        pest: selectedPest.name,
        treatment: selectedPest.organicControl[0] || ''
      });
    }
    setShowScheduleModal(true);
  };

  const handleSubmitSchedule = async (e) => {
    e.preventDefault();

    if (!scheduleForm.pest || !scheduleForm.treatment || !scheduleForm.date || !scheduleForm.area) {
      showNotification('⚠️ Please fill in all required fields', 'error');
      return;
    }

    try {
      const response = await fetch('/api/agriculture/treatments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...scheduleForm,
          status: 'scheduled'
        })
      });

      if (response.ok) {
        const newTreatment = await response.json();
        setScheduledTreatments(prev => [...prev, newTreatment]);
        setShowScheduleModal(false);
        setScheduleForm({ pest: '', treatment: '', date: '', area: '', notes: '' });
        showNotification('✅ Treatment scheduled successfully!', 'success');
        setActiveTab('treatments');
      } else {
        showNotification('Failed to schedule treatment', 'error');
      }
    } catch (error) {
      showNotification('Network error', 'error');
    }
  };

  const handleContactExpert = () => {
    setShowExpertModal(true);
  };

  const handleDeleteTreatment = async (id) => {
    try {
      const response = await fetch(`/api/agriculture/treatments/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setScheduledTreatments(prev => prev.filter(t => t._id !== id));
        showNotification('🗑️ Treatment deleted', 'success');
      }
    } catch (error) {
      showNotification('Failed to delete', 'error');
    }
  };

  const handleCompleteTreatment = async (id) => {
    try {
      const response = await fetch(`/api/agriculture/treatments/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed' })
      });
      if (response.ok) {
        setScheduledTreatments(prev =>
          prev.map(t => t._id === id ? { ...t, status: 'completed' } : t)
        );
        showNotification('✅ Treatment marked as completed!', 'success');
      }
    } catch (error) {
      showNotification('Failed to update status', 'error');
    }
  };

  const getSeverityClass = (severity) => {
    switch (severity) {
      case 'High': return 'severity-high';
      case 'Medium': return 'severity-medium';
      case 'Low': return 'severity-low';
      default: return 'severity-low';
    }
  };

  const handlePestChange = (e) => {
    const pestName = e.target.value;
    const selected = pests.find(p => p.name === pestName);
    setScheduleForm({
      ...scheduleForm,
      pest: pestName,
      treatment: selected ? selected.organicControl[0] : ''
    });
  };

  return (
    <div className="pest-control-container">
      {/* Error Popup */}
      {showError && (
        <div className="error-popup-overlay">
          <div className="error-popup-card">
            <div className="error-popup-icon">
              <AlertTriangle size={40} color="#e11d48" />
            </div>
            <h3 className="error-popup-title">Non-Crop Image Detected</h3>
            <p className="error-popup-message">
              Our AI Vision system has identified this as a <strong>logo, text, or non-agricultural image</strong>.
              <br /><br />
              Please <strong>insert a proper crop or leaf image</strong> to receive an accurate pest analysis.
            </p>
            <button
              className="error-popup-button"
              onClick={() => setShowError(false)}
            >
              Insert Crop Image
            </button>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification && (
        <div className={`notification-toast slide-up ${notification.type === 'success' ? 'notification-success' : 'notification-error'}`}>
          <span className={`notification-text ${notification.type === 'success' ? 'notification-text-success' : 'notification-text-error'}`} style={{ flex: 1 }}>
            {notification.message}
          </span>
          <button
            onClick={() => setNotification(null)}
            className="notification-close-btn"
          >
            <X style={{ width: '18px', height: '18px', color: notification.type === 'success' ? '#065F46' : '#991B1B' }} />
          </button>
        </div>
      )}

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-card fade-in" style={{ padding: '2rem', maxWidth: '500px', width: '90%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
              <h3 style={{ margin: 0, color: '#1e293b' }}>Schedule Treatment</h3>
              <button onClick={() => setShowScheduleModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={24} color="#64748b" />
              </button>
            </div>

            <form onSubmit={handleSubmitSchedule} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', color: '#64748b', marginBottom: '0.3rem' }}>Pest Target</label>
                <select
                  value={scheduleForm.pest}
                  onChange={handlePestChange}
                  className="form-input"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white' }}
                >
                  <option value="">Select a pest...</option>
                  {pests.map(p => (
                    <option key={p._id || p.id} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', color: '#64748b', marginBottom: '0.3rem' }}>Treatment Method</label>
                <input
                  type="text"
                  value={scheduleForm.treatment}
                  onChange={e => setScheduleForm({ ...scheduleForm, treatment: e.target.value })}
                  className="form-input"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', color: '#64748b', marginBottom: '0.3rem' }}>Date</label>
                  <input
                    type="date"
                    value={scheduleForm.date}
                    onChange={e => setScheduleForm({ ...scheduleForm, date: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', color: '#64748b', marginBottom: '0.3rem' }}>Area (Ha)</label>
                  <input
                    type="text"
                    placeholder="e.g. 2 Acre"
                    value={scheduleForm.area}
                    onChange={e => setScheduleForm({ ...scheduleForm, area: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }}>
                Confirm Schedule
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="main-content">
        {/* Header */}
        <header className="header-card">
          <div className="header-flex">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div className="header-icon-box">
                <Bug size={32} color="white" />
              </div>
              <div className="header-title">
                <h1>AI Pest Control</h1>
                <p>Smart detection & eco-friendly solutions</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div className="weather-widget">
                <CloudRain size={16} color="#059669" />
                <span>24°C | 60% Hum</span>
              </div>
              <div className="organic-badge">
                <Shield size={16} />
                Organic First Approach
              </div>
            </div>
          </div>
        </header>

        {/* Quick Stats Dashboard */}
        <div className="stats-dashboard">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#fee2e2', color: '#dc2626' }}>
              <Activity size={20} />
            </div>
            <div>
              <div className="stat-value">2</div>
              <div className="stat-label">Active Threats</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#dbeafe', color: '#2563eb' }}>
              <Calendar size={20} />
            </div>
            <div>
              <div className="stat-value">{scheduledTreatments.filter(t => t.status === 'scheduled').length}</div>
              <div className="stat-label">Treatments Due</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#dcfce7', color: '#16a34a' }}>
              <TrendingUp size={20} />
            </div>
            <div>
              <div className="stat-value">92%</div>
              <div className="stat-label">Crop Health</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs-container">
          <div className="tabs-header">
            {['detection', 'treatments', 'analytics'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`tab-btn ${activeTab === tab ? 'tab-btn-active' : ''}`}
              >
                {tab === 'detection' ? '🔍 Pest Detection' : tab === 'treatments' ? '📅 Treatment Schedule' : '📊 Analytics'}
              </button>
            ))}
          </div>

          {/* Detection Tab */}
          {activeTab === 'detection' && (
            <div>
              <div className="detection-grid">
                {/* Upload Section */}
                <div>
                  <div className="upload-section">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="file-input"
                    />

                    {uploadedImage ? (
                      <div className="fade-in" style={{ width: '100%', pointerEvents: 'none', position: 'relative', zIndex: 30 }}>
                        <img src={uploadedImage} alt="Uploaded" className="uploaded-img" />
                        {isLoading ? (
                          <div style={{ color: '#10B981', fontWeight: '600' }}>Analyzing image...</div>
                        ) : detectionResult && (
                          <div style={{ padding: '12px', background: '#D1FAE5', borderRadius: '8px', border: '1px solid #10B981' }}>
                            <p style={{ color: '#065F46', fontWeight: '700', margin: 0 }}>
                              ✅ Detection Complete!
                            </p>
                            <p style={{ fontSize: '14px', color: '#065F46', margin: '4px 0 0' }}>
                              {detectionResult.pest.name} detected ({detectionResult.confidence}%)
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="upload-content">
                        <div className="upload-icon-circle">
                          <Camera size={40} />
                        </div>
                        <div className="upload-text-group">
                          <h3>AI Image Detection</h3>
                          <p>Upload a photo of your crop to identify pests</p>
                        </div>
                        <div className="upload-btn-style">
                          <Upload size={20} /> Upload Photo
                        </div>
                        <p className="helper-text">
                          Supports JPG, PNG (Max 5MB)
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Pest Database */}
                <div className="pest-database-section">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1e293b', margin: 0 }}>
                      Common Pests Database
                    </h3>
                  </div>

                  {/* Pest Dropdown Selection */}
                  <div style={{ background: 'white', padding: '1rem', borderRadius: '16px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                    <div style={{ marginBottom: '0.75rem', color: '#64748b', fontSize: '0.9rem' }}>
                      Select a pest from the list below to view treatment details and solution.
                    </div>
                    <select
                      onChange={(e) => {
                        const pest = pests.find(p => p.name === e.target.value);
                        setSelectedPest(pest || null);
                      }}
                      style={{
                        width: '100%',
                        padding: '1rem',
                        borderRadius: '12px',
                        border: '1px solid #cbd5e1',
                        fontSize: '1rem',
                        color: '#1e293b',
                        cursor: 'pointer',
                        outline: 'none',
                        backgroundColor: '#f8fafc'
                      }}
                      value={selectedPest ? selectedPest.name : ""}
                    >
                      <option value="">Select a Pest</option>
                      {pests.map((pest) => (
                        <option key={pest._id || pest.id} value={pest.name}>
                          {pest.image || '🐛'} {pest.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedPest && (
                    <div className="fade-in" style={{ marginTop: '0.5rem' }}>
                      <div className="pest-detail-card fade-in">
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <AlertTriangle color="#f59e0b" />
                          Treatment Solutions for {selectedPest.name}
                        </h3>

                        <div className="solutions-grid">
                          {/* Organic Solutions */}
                          <div className="solution-box organic">
                            <h4 style={{ color: '#065F46', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <Leaf size={18} /> Organic (Recommended)
                            </h4>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                              {selectedPest.organicControl.map((method, idx) => (
                                <li key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.95rem', color: '#064e3b' }}>
                                  <CheckCircle size={16} color="#10B981" style={{ marginTop: '2px' }} />
                                  {method}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Chemical Control */}
                          <div className="solution-box chemical">
                            <h4 style={{ color: '#9a3412', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <AlertTriangle size={18} /> Chemical Control
                            </h4>
                            <p style={{ margin: 0, color: '#7c2d12', fontSize: '0.95rem' }}>
                              {selectedPest.chemicalControl}
                            </p>
                            <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#dc2626', background: '#fecaca', padding: '0.5rem', borderRadius: '6px' }}>
                              ⚠️ Use only as last resort.
                            </div>
                          </div>
                        </div>

                        <div className="action-buttons" style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                          <button onClick={handleScheduleTreatment} className="btn btn-primary">
                            <Calendar size={18} /> Schedule Treatment
                          </button>
                          <button onClick={handleContactExpert} className="btn btn-outline">
                            <Phone size={18} /> Contact Agri-Expert
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Treatments Tab */}
          {
            activeTab === 'treatments' && (
              <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ margin: 0, color: '#1e293b' }}>Upcoming Treatments</h3>
                  <button onClick={() => {
                    setScheduleForm({ pest: '', treatment: '', date: '', area: '', notes: '' });
                    setShowScheduleModal(true);
                  }} className="btn btn-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}>
                    <Calendar size={18} /> Add New
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {scheduledTreatments.length === 0 && (
                    <div style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>
                      No treatments scheduled.
                    </div>
                  )}
                  {scheduledTreatments.map((treatment) => (
                    <div key={treatment._id} className="pest-card" style={{ cursor: 'default' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <h4 style={{ margin: 0 }}>{treatment.pest}</h4>
                        <span className={`severity-badge ${treatment.status === 'completed' ? 'severity-low' : 'severity-medium'}`} style={{ background: treatment.status === 'completed' ? '#dcfce7' : '#dbeafe', color: treatment.status === 'completed' ? '#166534' : '#1e40af' }}>
                          {treatment.status}
                        </span>
                      </div>
                      <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{treatment.treatment}</p>
                      <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.5rem', display: 'flex', gap: '1rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={14} /> {new Date(treatment.date).toLocaleDateString()}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14} /> {treatment.area}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        {treatment.status === 'scheduled' && (
                          <button onClick={() => handleCompleteTreatment(treatment._id)} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>Complete</button>
                        )}
                        <button onClick={() => handleDeleteTreatment(treatment._id)} className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', color: '#ef4444', borderColor: '#fee2e2' }}>Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          }

          {/* Analytics Tab (Placeholder for "Featured" look) */}
          {activeTab === 'analytics' && (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <TrendingUp size={48} color="#cbd5e1" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ color: '#1e293b' }}>Detailed Analytics Coming Soon</h3>
              <p style={{ color: '#64748b' }}>Track your pest control history and crop health trends over time.</p>
            </div>
          )}
        </div>

        {/* AI Impact */}
        <div className="impact-card" style={{ marginTop: '2rem' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Shield size={24} /> Smart Pest Management Impact
          </h3>
          <div className="impact-grid">
            {[
              { value: '50%', label: 'Pesticide Reduction', icon: '🌿' },
              { value: '85%', label: 'Early Detection Rate', icon: '🎯' },
              { value: '60%', label: 'Cost Savings', icon: '💰' },
              { value: '100%', label: 'Eco-Friendly Options', icon: '♻️' }
            ].map((metric, idx) => (
              <div key={idx} className="metric-card">
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{metric.icon}</div>
                <div style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.25rem' }}>{metric.value}</div>
                <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PestControl;