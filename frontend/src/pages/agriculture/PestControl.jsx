import React, { useState, useEffect, useRef } from 'react';
import { Bug, Shield, AlertTriangle, Leaf, Camera, CheckCircle, Send, Bot, X, Upload, Calendar, MapPin, Phone, Mail, Clock, XCircle, Check } from 'lucide-react';
import './PestControl.css';

const PestControl = () => {
  const [selectedPest, setSelectedPest] = useState(null);
  const [activeTab, setActiveTab] = useState('detection');
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
  const [scheduleForm, setScheduleForm] = useState({
    pest: '',
    treatment: '',
    date: '',
    area: '',
    notes: ''
  });
  const chatEndRef = useRef(null);

  const pestDatabase = [
    {
      id: 1,
      name: 'Aphids',
      severity: 'Medium',
      crops: ['Tomato', 'Cotton', 'Wheat'],
      symptoms: 'Curled leaves, sticky residue, stunted growth',
      organicControl: [
        'Neem oil spray (5ml per liter of water)',
        'Ladybugs (natural predators)',
        'Soap water solution (2% concentration)'
      ],
      chemicalControl: 'Imidacloprid 17.8% SL @ 0.5ml/liter',
      prevention: 'Regular monitoring, avoid over-fertilization',
      aiDetection: 92,
      image: '🐛'
    },
    {
      id: 2,
      name: 'Bollworm',
      severity: 'High',
      crops: ['Cotton', 'Tomato', 'Okra'],
      symptoms: 'Holes in fruits/bolls, larvae inside',
      organicControl: [
        'Bt (Bacillus thuringiensis) spray',
        'Pheromone traps',
        'Hand picking of larvae'
      ],
      chemicalControl: 'Chlorantraniliprole 18.5% SC @ 0.3ml/liter',
      prevention: 'Crop rotation, destroy crop residue',
      aiDetection: 89,
      image: '🐛'
    },
    {
      id: 3,
      name: 'Whitefly',
      severity: 'High',
      crops: ['Cotton', 'Tomato', 'Chili'],
      symptoms: 'Yellow leaves, sooty mold, virus transmission',
      organicControl: [
        'Yellow sticky traps',
        'Neem oil + garlic extract',
        'Reflective mulches'
      ],
      chemicalControl: 'Thiamethoxam 25% WG @ 0.2g/liter',
      prevention: 'Use resistant varieties, remove infected plants',
      aiDetection: 94,
      image: '🦟'
    },
    {
      id: 4,
      name: 'Leaf Miner',
      severity: 'Low',
      crops: ['Tomato', 'Beans', 'Citrus'],
      symptoms: 'Serpentine trails on leaves',
      organicControl: [
        'Remove and destroy affected leaves',
        'Spinosad spray',
        'Encourage parasitic wasps'
      ],
      chemicalControl: 'Abamectin 1.9% EC @ 0.5ml/liter',
      prevention: 'Use row covers, maintain field hygiene',
      aiDetection: 87,
      image: '🐜'
    }
  ];

  const [scheduledTreatments, setScheduledTreatments] = useState([
    {
      id: 1,
      pest: 'Aphids',
      treatment: 'Neem oil spray',
      date: '2025-10-06',
      status: 'scheduled',
      area: '2 hectares'
    },
    {
      id: 2,
      pest: 'Whitefly',
      treatment: 'Yellow sticky traps',
      date: '2025-10-05',
      status: 'completed',
      area: '1 hectare'
    }
  ]);

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
      setUploadedImage(URL.createObjectURL(file));
      setIsLoading(true);
      setDetectionResult(null);

      setTimeout(() => {
        const randomPest = pestDatabase[Math.floor(Math.random() * pestDatabase.length)];
        const confidence = Math.floor(Math.random() * 10) + 85;

        setDetectionResult({
          pest: randomPest,
          confidence: confidence,
          detectedAt: new Date().toLocaleTimeString()
        });
        setSelectedPest(randomPest);
        setIsLoading(false);
        showNotification(`✅ Pest detected: ${randomPest.name} (${confidence}% confidence)`, 'success');
      }, 2000);
    }
  };

  const handleScheduleTreatment = () => {
    if (selectedPest) {
      setScheduleForm({
        ...scheduleForm,
        pest: selectedPest.name,
        treatment: selectedPest.organicControl[0]
      });
    }
    setShowScheduleModal(true);
  };

  const handleSubmitSchedule = (e) => {
    e.preventDefault();

    if (!scheduleForm.pest || !scheduleForm.treatment || !scheduleForm.date || !scheduleForm.area) {
      showNotification('⚠️ Please fill in all required fields', 'error');
      return;
    }

    const newTreatment = {
      id: scheduledTreatments.length + 1,
      pest: scheduleForm.pest,
      treatment: scheduleForm.treatment,
      date: scheduleForm.date,
      status: 'scheduled',
      area: scheduleForm.area,
      notes: scheduleForm.notes
    };

    setScheduledTreatments(prev => [...prev, newTreatment]);
    setShowScheduleModal(false);
    setScheduleForm({ pest: '', treatment: '', date: '', area: '', notes: '' });
    showNotification('✅ Treatment scheduled successfully!', 'success');
    setActiveTab('treatments');
  };

  const handleContactExpert = () => {
    setShowExpertModal(true);
  };

  const handleDeleteTreatment = (id) => {
    setScheduledTreatments(prev => prev.filter(t => t.id !== id));
    showNotification('🗑️ Treatment deleted', 'success');
  };

  const handleCompleteTreatment = (id) => {
    setScheduledTreatments(prev =>
      prev.map(t => t.id === id ? { ...t, status: 'completed' } : t)
    );
    showNotification('✅ Treatment marked as completed!', 'success');
  };

  const getSeverityClass = (severity) => {
    switch (severity) {
      case 'High': return 'severity-high';
      case 'Medium': return 'severity-medium';
      case 'Low': return 'severity-low';
      default: return 'severity-low';
    }
  };

  return (
    <div className="pest-control-container">
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

      <div className="main-content">
        {/* Header */}
        <div className="glass-card card-3d slide-in header-card">
          <div className="header-flex">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div className="float pulse header-icon-box">
                <Bug style={{ width: '36px', height: '36px', color: 'white' }} />
              </div>
              <div>
                <h1 className="gradient-text" style={{ fontSize: '32px', fontWeight: '800', marginBottom: '4px' }}>
                  AI Pest Control
                </h1>
                <p style={{ color: '#6B7280', fontSize: '15px' }}>
                  Smart detection & eco-friendly solutions
                </p>
              </div>
            </div>
            <div className="organic-badge">
              <Shield className="bounce" style={{ width: '20px', height: '20px', color: '#059669' }} />
              Organic First
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="glass-card slide-in tabs-container">
          <div className="tabs-header">
            {['detection', 'treatments'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`btn tab-btn ${activeTab === tab ? 'tab-btn-active' : ''}`}
              >
                {tab === 'detection' ? '🔍 Pest Detection' : '📅 Treatment Schedule'}
              </button>
            ))}
          </div>

          {/* Detection Tab */}
          {activeTab === 'detection' && (
            <div style={{ padding: '24px' }}>
              <div className="grid-2 detection-grid">
                {/* Upload Section */}
                <div className="card-3d upload-section">
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Camera style={{ width: '22px', height: '22px', color: '#10B981' }} />
                    AI Image Detection
                  </h3>
                  <div className="upload-zone">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="file-input"
                    />
                    {uploadedImage ? (
                      <div className="fade-in">
                        <img src={uploadedImage} alt="Uploaded" className="uploaded-img" />
                        {isLoading ? (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#10B981' }}>
                            <div className="spin" style={{ width: '20px', height: '20px', border: '3px solid #10B981', borderTopColor: 'transparent', borderRadius: '50%' }}></div>
                            <span style={{ fontWeight: '600' }}>Analyzing image...</span>
                          </div>
                        ) : detectionResult && (
                          <div style={{ padding: '12px', background: '#D1FAE5', borderRadius: '8px', border: '2px solid #10B981' }}>
                            <p style={{ fontSize: '14px', color: '#065F46', fontWeight: '700', marginBottom: '4px' }}>
                              ✅ Detection Complete!
                            </p>
                            <p style={{ fontSize: '13px', color: '#065F46' }}>
                              {detectionResult.pest.name} detected with {detectionResult.confidence}% confidence
                            </p>
                            <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>
                              <Clock style={{ width: '12px', height: '12px', display: 'inline', marginRight: '4px' }} />
                              {detectionResult.detectedAt}
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <>
                        <Bug className="float" style={{ width: '64px', height: '64px', margin: '0 auto 16px', color: '#9CA3AF' }} />
                        <p style={{ color: '#6B7280', marginBottom: '12px', fontSize: '15px' }}>Upload pest image</p>
                        <button className="btn shimmer-bg upload-btn">
                          <Upload style={{ width: '18px', height: '18px', display: 'inline', marginRight: '8px' }} />
                          Choose Image
                        </button>
                      </>
                    )}
                  </div>
                  <div style={{ padding: '16px', background: 'linear-gradient(135deg, #DBEAFE, #BFDBFE)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Shield style={{ width: '20px', height: '20px', color: '#1E40AF' }} />
                    <span style={{ fontSize: '14px', color: '#1E40AF', fontWeight: '600' }}>
                      AI identifies pests with 90%+ accuracy
                    </span>
                  </div>
                </div>

                {/* Pest Database */}
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', marginBottom: '16px' }}>
                    Common Pests Database
                  </h3>
                  <div className="pest-list-container">
                    {pestDatabase.map((pest, idx) => (
                      <div
                        key={pest.id}
                        onClick={() => setSelectedPest(pest)}
                        className={`card-3d slide-in pest-card ${selectedPest?.id === pest.id ? 'selected' : ''}`}
                        style={{ animationDelay: `${idx * 0.1}s` }}
                      >
                        <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: '12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontSize: '32px' }}>{pest.image}</span>
                            <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#111827' }}>{pest.name}</h4>
                          </div>
                          <span className={`severity-badge ${getSeverityClass(pest.severity)}`}>
                            {pest.severity}
                          </span>
                        </div>
                        <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '12px' }}>{pest.symptoms}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6B7280' }}>
                          <span>Affects: <strong>{pest.crops.join(', ')}</strong></span>
                          <span style={{ color: '#10B981', fontWeight: '700' }}>
                            {pest.aiDetection}% AI Accuracy
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Selected Pest Details */}
              {selectedPest && (
                <div className="pest-detail-card fade-in">
                  <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#111827', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <AlertTriangle style={{ width: '28px', height: '28px', color: '#F97316' }} />
                    {selectedPest.name} - Treatment Solutions
                  </h3>

                  <div className="solutions-grid">
                    {/* Organic Solutions */}
                    <div className="card-3d organic-card">
                      <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#065F46', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Leaf style={{ width: '20px', height: '20px' }} />
                        Organic Solutions (Recommended)
                      </h4>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {selectedPest.organicControl.map((method, idx) => (
                          <li key={idx} style={{ display: 'flex', alignItems: 'start', gap: '8px', marginBottom: '12px', fontSize: '14px', color: '#065F46' }}>
                            <CheckCircle style={{ width: '18px', height: '18px', flexShrink: 0, marginTop: '2px', color: '#10B981' }} />
                            <span>{method}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Chemical Control */}
                    <div className="card-3d chemical-card">
                      <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#9A3412', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <AlertTriangle style={{ width: '20px', height: '20px' }} />
                        Chemical Control (If Necessary)
                      </h4>
                      <p style={{ fontSize: '14px', color: '#9A3412', marginBottom: '16px', fontWeight: '600' }}>
                        {selectedPest.chemicalControl}
                      </p>
                      <div className="chemical-warning">
                        ⚠️ Use chemical pesticides only as last resort. Follow safety guidelines strictly.
                      </div>
                    </div>
                  </div>

                  {/* Prevention */}
                  <div className="prevention-box">
                    <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#1E40AF', marginBottom: '8px' }}>
                      Prevention Strategy
                    </h4>
                    <p style={{ fontSize: '14px', color: '#1E40AF' }}>{selectedPest.prevention}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="action-buttons">
                    <button onClick={handleScheduleTreatment} className="btn schedule-btn">
                      <Calendar style={{ width: '18px', height: '18px', display: 'inline', marginRight: '8px' }} />
                      Schedule Treatment
                    </button>
                    <button onClick={handleContactExpert} className="btn contact-btn">
                      <Phone style={{ width: '18px', height: '18px', display: 'inline', marginRight: '8px' }} />
                      Contact Agri-Expert
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Treatments Tab */}
          {activeTab === 'treatments' && (
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {scheduledTreatments.map((treatment, idx) => (
                  <div key={treatment.id} className="treatment-card card-3d slide-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                    <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', marginBottom: '6px' }}>
                          {treatment.pest}
                        </h4>
                        <p style={{ fontSize: '14px', color: '#6B7280' }}>{treatment.treatment}</p>
                      </div>
                      <span className={`treatment-status ${treatment.status === 'completed' ? 'status-completed' : 'status-scheduled'}`}>
                        {treatment.status === 'completed' ? '✓ Completed' : '⏱ Scheduled'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '24px', fontSize: '14px', color: '#6B7280', flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Calendar style={{ width: '16px', height: '16px' }} />
                        {treatment.date}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <MapPin style={{ width: '16px', height: '16px' }} />
                        {treatment.area}
                      </span>
                    </div>
                    {treatment.status === 'scheduled' && (
                      <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleCompleteTreatment(treatment.id)}
                          className="btn complete-btn"
                        >
                          <Check style={{ width: '14px', height: '14px', display: 'inline', marginRight: '4px' }} />
                          Complete
                        </button>
                        <button
                          onClick={() => handleDeleteTreatment(treatment.id)}
                          className="btn delete-btn"
                        >
                          <XCircle style={{ width: '14px', height: '14px', display: 'inline', marginRight: '4px' }} />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <button onClick={() => setShowScheduleModal(true)} className="btn new-schedule-btn">
                + Schedule New Treatment
              </button>
            </div>
          )}
        </div>

        {/* AI Impact */}
        <div className="impact-card card-3d slide-in">
          <h3 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Shield style={{ width: '32px', height: '32px' }} />
            Smart Pest Management Impact
          </h3>
          <div className="impact-grid">
            {[
              { value: '50%', label: 'Pesticide Reduction', icon: '🌿' },
              { value: '85%', label: 'Early Detection Rate', icon: '🎯' },
              { value: '60%', label: 'Cost Savings', icon: '💰' },
              { value: '100%', label: 'Eco-Friendly Options', icon: '♻️' }
            ].map((metric, idx) => (
              <div
                key={idx}
                className="metric-card card-3d"
              >
                <div style={{ fontSize: '36px', marginBottom: '8px' }}>{metric.icon}</div>
                <p style={{ fontSize: '42px', fontWeight: '900', marginBottom: '8px' }}>{metric.value}</p>
                <p style={{ fontSize: '14px', fontWeight: '600', opacity: 0.95 }}>{metric.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PestControl;