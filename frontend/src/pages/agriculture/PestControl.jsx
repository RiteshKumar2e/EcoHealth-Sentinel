import React, { useState, useEffect, useRef } from 'react';
import { Bug, Shield, AlertTriangle, Leaf, Camera, CheckCircle, Send, Bot, X, Upload, Calendar, MapPin, Phone, Mail, Clock, XCircle, Check, Search, Filter, CloudRain, Thermometer, Wind, Activity, TrendingUp, Cloud, ShieldCheck, ChevronRight } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
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
  const [showError, setShowError] = useState(false);

  // Simulation Analytics Data
  const trendData = [
    { name: 'Mon', active: 4, treated: 2 },
    { name: 'Tue', active: 3, treated: 3 },
    { name: 'Wed', active: 5, treated: 4 },
    { name: 'Thu', active: 2, treated: 5 },
    { name: 'Fri', active: 6, treated: 4 },
    { name: 'Sat', active: 4, treated: 6 },
    { name: 'Sun', active: 2, treated: 4 },
  ];

  const distributionData = [
    { name: 'Aphids', value: 35, color: '#6366f1' },
    { name: 'Whitefly', value: 25, color: '#8b5cf6' },
    { name: 'Locusts', value: 15, color: '#f59e0b' },
    { name: 'Armyworm', value: 25, color: '#ef4444' },
  ];

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
    setIsDataLoading(true);

    const fallbackPests = [
      { id: 1, name: 'Aphids', severity: 'Medium', crops: ['Tomato', 'Cucumber', 'Peas'], organicControl: ['Neem Oil Spray', 'Ladybugs', 'Soap Water'], chemicalControl: 'Imidacloprid', image: '🐛' },
      { id: 2, name: 'Locusts', severity: 'High', crops: ['Wheat', 'Maize', 'Rice'], organicControl: ['Metarhizium acridum', 'Trenching'], chemicalControl: 'Malathion', image: '🦗' },
      { id: 3, name: 'Whitefly', severity: 'High', crops: ['Cotton', 'Tomato', 'Potato'], organicControl: ['Yellow Sticky Traps', 'Neem Oil'], chemicalControl: 'Acetamiprid', image: '🦋' },
      { id: 4, name: 'Fall Armyworm', severity: 'High', crops: ['Maize', 'Sugarcane', 'Rice'], organicControl: ['Pheromone Traps', 'Bt spray'], chemicalControl: 'Spinosad', image: '🐛' },
      { id: 5, name: 'Spider Mites', severity: 'Medium', crops: ['Beans', 'Strawberry', 'Roses'], organicControl: ['Water Jetting', 'Predatory Mites'], chemicalControl: 'Abamectin', image: '🕷️' },
      { id: 6, name: 'Thrips', severity: 'Medium', crops: ['Onion', 'Chillies', 'Grapes'], organicControl: ['Blue Sticky Traps', 'Neem oil'], chemicalControl: 'Spinetoram', image: '🪲' },
      { id: 7, name: 'Mealybugs', severity: 'Medium', crops: ['Papaya', 'Hibiscus', 'Mango'], organicControl: ['Alcohol rub', 'Cryptolaemus beetles'], chemicalControl: 'Buprofezin', image: '🌫️' },
      { id: 8, name: 'Rice Weevil', severity: 'Low', crops: ['Rice', 'Wheat'], organicControl: ['Drying under sun', 'Neem leaves'], chemicalControl: 'Phosphine fumigation', image: '🪲' },
      { id: 9, name: 'Fruit Borer', severity: 'High', crops: ['Brinjal', 'Tomato', 'Okra'], organicControl: ['Pheromone traps', 'Trichogramma cards'], chemicalControl: 'Chlorantraniliprole', image: '🐛' },
      { id: 10, name: 'Cutworm', severity: 'Medium', crops: ['Potato', 'Tobacco', 'Corn'], organicControl: ['Collars around stems', 'Handpicking'], chemicalControl: 'Cypermethrin', image: '🐛' },
      { id: 11, name: 'Leafhopper', severity: 'Medium', crops: ['Potato', 'Cotton'], organicControl: ['Sticky traps', 'Neem spray'], chemicalControl: 'Fipronil', image: '🦟' },
      { id: 12, name: 'Root Knot Nematode', severity: 'High', crops: ['Carrot', 'Tomato'], organicControl: ['Crop rotation', 'Solarization'], chemicalControl: 'Fluopyram', image: '🪱' },
      { id: 13, name: 'Scale Insects', severity: 'Medium', crops: ['Citrus', 'Apple'], organicControl: ['Horticultural oils', 'Scraping'], chemicalControl: 'Dinotefuran', image: '🐚' },
      { id: 14, name: 'Wireworms', severity: 'High', crops: ['Potato', 'Maize'], organicControl: ['Tilling soil', 'Potato traps'], chemicalControl: 'Bifenthrin', image: '🐛' },
      { id: 15, name: 'Japanese Beetle', severity: 'High', crops: ['Soybean', 'Corn'], organicControl: ['Handpicking', 'Milky spore'], chemicalControl: 'Carbaryl', image: '🪲' },
      { id: 16, name: 'Cabbage Looper', severity: 'Medium', crops: ['Cabbage', 'Broccoli'], organicControl: ['Bt spray', 'Row covers'], chemicalControl: 'Indoxacarb', image: '🐛' },
      { id: 17, name: 'Colorado Potato Beetle', severity: 'High', crops: ['Potato', 'Tomato'], organicControl: ['Crop rotation', 'Mulching'], chemicalControl: 'Abamectin', image: '🪲' },
      { id: 18, name: 'Diamondback Moth', severity: 'High', crops: ['Cabbage', 'Mustard'], organicControl: ['Sticky traps', 'Bt spray'], chemicalControl: 'Chlorantraniliprole', image: '🦋' },
      { id: 19, name: 'Brown Planthopper', severity: 'High', crops: ['Rice'], organicControl: ['Proper spacing', 'Azyadirachtin'], chemicalControl: 'Pymetrozine', image: '🦗' },
      { id: 20, name: 'Pink Bollworm', severity: 'High', crops: ['Cotton'], organicControl: ['Pheromone traps', 'Sanitation'], chemicalControl: 'Emamectin Benzoate', image: '🐛' },
      { id: 21, name: 'Citrus Psylla', severity: 'Medium', crops: ['Orange', 'Lemon'], organicControl: ['Oil sprays', 'Pruning'], chemicalControl: 'Thiamethoxam', image: '🦟' },
      { id: 22, name: 'Stem Borer', severity: 'High', crops: ['Rice', 'Maize'], organicControl: ['Pheromone traps', 'Light traps'], chemicalControl: 'Cartap Hydrochloride', image: '🐛' },
      { id: 23, name: 'Grasshopper', severity: 'Medium', crops: ['Grains', 'Vegetables'], organicControl: ['Birds/Poultry', 'Tilling'], chemicalControl: 'Lambda-cyhalothrin', image: '🦗' },
      { id: 24, name: 'Bollworm', severity: 'High', crops: ['Cotton', 'Pigeon Pea'], organicControl: ['NPV spray', 'Handpicking'], chemicalControl: 'Profenofos', image: '🐛' },
      { id: 25, name: 'Armyworm', severity: 'High', crops: ['Rice', 'Maize'], organicControl: ['Trenches', 'Deep plowing'], chemicalControl: 'Quinalphos', image: '🐛' }
    ];

    try {
      const [pestsRes, treatmentsRes] = await Promise.all([
        fetch('/api/agriculture/pests').catch(() => null),
        fetch('/api/agriculture/treatments').catch(() => null)
      ]);

      if (pestsRes && pestsRes.ok) {
        const data = await pestsRes.json();
        if (Array.isArray(data) && data.length > 0) {
          setPests(data);
        } else {
          setPests(fallbackPests);
        }
      } else {
        setPests(fallbackPests);
      }

      if (treatmentsRes && treatmentsRes.ok) {
        setScheduledTreatments(await treatmentsRes.json());
      }
    } catch (error) {
      console.error('Data fetch failed, using fallbacks:', error);
      setPests(fallbackPests);
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
          <div className="modal-content pest-modal fade-in">
            <div className="modal-header">
              <h3>Schedule Treatment</h3>
              <button onClick={() => setShowScheduleModal(false)} className="modal-close-btn">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmitSchedule} className="modal-form">
              <div className="form-group">
                <label>Pest Target</label>
                <select
                  value={scheduleForm.pest}
                  onChange={handlePestChange}
                  className="pest-select-input"
                >
                  <option value="">Select a pest...</option>
                  {pests.map(p => (
                    <option key={p._id || p.id} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Treatment Method</label>
                <input
                  type="text"
                  value={scheduleForm.treatment}
                  onChange={e => setScheduleForm({ ...scheduleForm, treatment: e.target.value })}
                  placeholder="e.g. Neem Oil Spray"
                  className="pest-text-input"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    value={scheduleForm.date}
                    onChange={e => setScheduleForm({ ...scheduleForm, date: e.target.value })}
                    className="pest-date-input"
                  />
                </div>
                <div className="form-group">
                  <label>Area (Ha)</label>
                  <input
                    type="text"
                    placeholder="e.g. 2 Acre"
                    value={scheduleForm.area}
                    onChange={e => setScheduleForm({ ...scheduleForm, area: e.target.value })}
                    className="pest-text-input"
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary-full">
                Confirm Schedule
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="pest-workspace">
        {/* Header */}
        <header className="header-card">
          <div className="header-flex">
            <div className="header-identity">
              <div className="header-icon-box">
                <Bug size={32} color="white" />
              </div>
              <div className="header-title-group">
                <h1>AI Pest Control</h1>
                <p>Smart detection & eco-friendly solutions</p>
              </div>
            </div>
            <div className="header-widgets">
              <div className="weather-widget">
                <Cloud size={16} />
                <span>24°C | 60% Hum</span>
              </div>
              <div className="organic-badge">
                <ShieldCheck size={16} />
                Organic First Approach
              </div>
            </div>
          </div>
        </header>

        {/* Quick Stats Dashboard */}
        <div className="stats-dashboard">
          <div className="stat-card blue">
            <div className="stat-icon">
              <Activity size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">2</div>
              <div className="stat-label">ACTIVE THREATS</div>
            </div>
          </div>
          <div className="stat-card purple">
            <div className="stat-icon">
              <Calendar size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{scheduledTreatments.filter(t => t.status === 'scheduled').length}</div>
              <div className="stat-label">TREATMENTS DUE</div>
            </div>
          </div>
          <div className="stat-card green">
            <div className="stat-icon">
              <TrendingUp size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">92%</div>
              <div className="stat-label">CROP HEALTH</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs-container">
          <div className="tabs-header">
            <button
              onClick={() => setActiveTab('detection')}
              className={`tab-btn ${activeTab === 'detection' ? 'tab-btn-active' : ''}`}
            >
              <Search size={18} /> Pest Detection
            </button>
            <button
              onClick={() => setActiveTab('treatments')}
              className={`tab-btn ${activeTab === 'treatments' ? 'tab-btn-active' : ''}`}
            >
              <Calendar size={18} /> Treatment Schedule
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`tab-btn ${activeTab === 'analytics' ? 'tab-btn-active' : ''}`}
            >
              <Activity size={18} /> Analytics
            </button>
          </div>

          {/* Detection Tab */}
          {activeTab === 'detection' && (
            <div>
              <div className="detection-grid">
                {/* Upload Section */}
                <div className="pest-upload-column">
                  <div className="upload-section">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="file-input"
                    />

                    {uploadedImage ? (
                      <div className="upload-content fade-in">
                        <img src={uploadedImage} alt="Uploaded" className="uploaded-img" />
                        {isLoading ? (
                          <div className="analysis-status">
                            <Activity className="icon-spin" size={20} />
                            <span>AI Neural Analysis...</span>
                          </div>
                        ) : detectionResult ? (
                          <div className="detection-success-card">
                            <div className="success-header">
                              <CheckCircle size={18} />
                              <span>Detection Complete</span>
                            </div>
                            <p>
                              <strong>{detectionResult.pest.name}</strong> identified ({detectionResult.confidence}%)
                            </p>
                            <button className="btn-change-image" onClick={() => { setUploadedImage(null); setDetectionResult(null); }}>
                              <Upload size={14} /> Change Image
                            </button>
                          </div>
                        ) : (
                          <label className="change-image-label">
                            <Plus size={16} /> Try Different Photo
                          </label>
                        )}
                      </div>
                    ) : (
                      <div className="upload-content">
                        <div className="upload-icon-circle">
                          <Camera size={40} />
                        </div>
                        <div className="upload-text-group">
                          <h3>AI Image Detection</h3>
                          <p>Upload a photo to identify pests</p>
                        </div>
                        <div className="upload-btn-style">
                          <Upload size={20} /> Upload Photo
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Pest Database */}
                <div className="pest-database-column">
                  <div className="database-header-compact">
                    <h3>Common Pests Database</h3>
                  </div>

                  <div className="pest-dropdown-hub">
                    <p>Select a pest to view autonomous treatment protocols.</p>
                    <select
                      onChange={(e) => {
                        const pest = pests.find(p => p.name === e.target.value);
                        setSelectedPest(pest || null);
                      }}
                      className="pest-main-dropdown"
                      value={selectedPest ? selectedPest.name : ""}
                    >
                      <option value="">Select a Pest</option>
                      {pests.map((pest) => (
                        <option key={pest._id || pest.id} value={pest.name}>
                          {pest.image || '🐛'} {pest.name} (Rx: {pest.chemicalControl})
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedPest && (
                    <div className="fade-in" style={{ marginTop: '0.5rem' }}>
                      <div className="pest-protocol-card fade-in">
                        <div className="protocol-title">
                          <AlertTriangle size={18} />
                          <h3>Treatment Protocol: {selectedPest.name}</h3>
                        </div>

                        <div className="solutions-grid">
                          {/* Organic Solutions */}
                          <div className="solution-box organic">
                            <h4 className="organic-label">
                              <Leaf size={16} /> Organic Recommendation
                            </h4>
                            <ul className="protocol-list organic">
                              {selectedPest.organicControl.map((method, idx) => (
                                <li key={idx}>
                                  <CheckCircle size={14} />
                                  <span>{method}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Chemical Control */}
                          <div className="solution-box chemical">
                            <h4 className="chemical-label">
                              <AlertTriangle size={16} /> Chemical Protocol
                            </h4>
                            <div className="chemical-info-block">
                              <span className="chem-label">Recommended Pesticide:</span>
                              <span className="chem-value">{selectedPest.chemicalControl}</span>
                            </div>
                            <div className="protocol-warning">
                              ⚠️ Deploy only if threshold exceeds 20%.
                            </div>
                          </div>
                        </div>

                        <div className="protocol-actions">
                          <button onClick={handleScheduleTreatment} className="btn-protocol-primary">
                            <Calendar size={18} /> Deploy Treatment
                          </button>
                          <button onClick={handleContactExpert} className="btn-protocol-outline">
                            Expert Consultation
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'treatments' && (
            <div className="schedule-workspace fade-in">
              <div className="schedule-grid">
                {/* Main Schedule Column */}
                <div className="schedule-main-column">
                  <div className="schedule-header">
                    <h3>Autonomous Treatment Schedule</h3>
                    <button
                      onClick={() => {
                        setScheduleForm({ pest: '', treatment: '', date: '', area: '', notes: '' });
                        setShowScheduleModal(true);
                      }}
                      className="btn-add-treatment"
                    >
                      <Calendar size={16} /> Add New Plan
                    </button>
                  </div>

                  <div className="treatment-list">
                    {scheduledTreatments.length === 0 ? (
                      <div className="empty-state-box">
                        <Calendar size={48} className="empty-icon" />
                        <p>No treatments currently scheduled in the system.</p>
                      </div>
                    ) : (
                      scheduledTreatments.map((treatment) => (
                        <div key={treatment._id} className="treatment-card">
                          <div className="treatment-card-header">
                            <div className="treatment-info">
                              <h4>{treatment.pest}</h4>
                              <p>{treatment.treatment}</p>
                            </div>
                            <span className={`status-pill ${treatment.status}`}>
                              {treatment.status}
                            </span>
                          </div>

                          <div className="treatment-details">
                            <div className="detail-item">
                              <Calendar size={14} />
                              <span>{new Date(treatment.date).toLocaleDateString()}</span>
                            </div>
                            <div className="detail-item">
                              <MapPin size={14} />
                              <span>{treatment.area}</span>
                            </div>
                          </div>

                          <div className="treatment-actions">
                            {treatment.status === 'scheduled' && (
                              <button onClick={() => handleCompleteTreatment(treatment._id)} className="btn-complete">
                                <CheckCircle size={16} /> Complete
                              </button>
                            )}
                            <button onClick={() => handleDeleteTreatment(treatment._id)} className="btn-delete">
                              <XCircle size={16} /> Remove
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Right Side Summary Column */}
                <div className="schedule-side-column">
                  <div className="side-panel-card">
                    <h4>Management Summary</h4>
                    <div className="side-metric-row">
                      <span>Active Plans</span>
                      <span className="count blue">{scheduledTreatments.filter(t => t.status !== 'completed').length}</span>
                    </div>
                    <div className="side-metric-row">
                      <span>Completed</span>
                      <span className="count green">{scheduledTreatments.filter(t => t.status === 'completed').length}</span>
                    </div>
                  </div>

                  <div className="side-info-card">
                    <div className="info-title">
                      <ShieldCheck size={18} />
                      <h5>Organic Protocol</h5>
                    </div>
                    <p>Always verify the local moisture thresholds before deploying neem-based solutions.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="analytics-workspace fade-in">
              <div className="analytics-layout-grid">
                {/* Main Large Charts Column */}
                <div className="analytics-main-column">
                  {/* Trend Chart */}
                  <div className="analytics-card full-width">
                    <div className="analytics-card-header">
                      <h4>Infestation vs Treatment Trend</h4>
                      <p>7 Day Activity overview</p>
                    </div>
                    <div className="chart-container">
                      <ResponsiveContainer width="100%" height={380}>
                        <LineChart data={trendData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                          <Tooltip
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                          />
                          <Line type="monotone" dataKey="active" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                          <Line type="monotone" dataKey="treated" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="chart-legend-custom">
                      <div className="legend-item"><span className="dot red"></span> Active Threats</div>
                      <div className="legend-item"><span className="dot green"></span> Successfully Treated</div>
                    </div>
                  </div>

                  <div className="analytics-sub-grid">
                    {/* Efficiency Stats */}
                    <div className="analytics-card">
                      <div className="analytics-card-header">
                        <h4>Resource Efficiency</h4>
                        <p>Autonomous vs Manual</p>
                      </div>
                      <div className="efficiency-box">
                        <div className="efficiency-metric">
                          <div className="metric-header">
                            <span>Response Time</span>
                            <span className="positive">-4.2 Hours</span>
                          </div>
                          <div className="progress-bg"><div className="progress-fill" style={{ width: '85%' }}></div></div>
                        </div>
                        <div className="efficiency-metric">
                          <div className="metric-header">
                            <span>Pesticide Save</span>
                            <span className="positive">120 Liters</span>
                          </div>
                          <div className="progress-bg"><div className="progress-fill purple" style={{ width: '68%' }}></div></div>
                        </div>
                      </div>
                    </div>

                    <div className="analytics-card">
                      <div className="analytics-card-header">
                        <h4>Intelligence Status</h4>
                        <p>Neural Network Health</p>
                      </div>
                      <div className="id-status-box">
                        <div className="id-check"><Check size={14} /> Satellite Link: Stable</div>
                        <div className="id-check"><Check size={14} /> AI Nodes: Active</div>
                        <div className="id-check"><Check size={14} /> Local Sensors: Syncing</div>
                      </div>
                      <button className="btn-full-report">
                        View Neural Report <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Side Mini Column */}
                <div className="analytics-side-column">
                  <div className="analytics-card side-db">
                    <div className="analytics-card-header">
                      <h4>Species Mix</h4>
                      <p>Detection Bias</p>
                    </div>
                    <div className="chart-container-flex">
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie
                            data={distributionData}
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {distributionData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="pie-legend vertical">
                        {distributionData.map((item, i) => (
                          <div key={i} className="pie-legend-item compact">
                            <span className="pie-dot" style={{ background: item.color }}></span>
                            <span className="pie-label">{item.name}</span>
                            <span className="pie-value">{item.value}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* AI Impact */}
        <div className="impact-hub-bottom">
          <div className="impact-header-box">
            <ShieldCheck size={24} className="impact-shield-icon" />
            <h3>Eco-Protection Summary</h3>
          </div>
          <div className="impact-grid-cards">
            {[
              { value: '50%', label: 'Pesticide Reduction', icon: '🌿' },
              { value: '85%', label: 'Detection Accuracy', icon: '🎯' },
              { value: '60%', label: 'Asset Savings', icon: '💰' },
              { value: '100%', label: 'Organic First', icon: '♻️' }
            ].map((metric, idx) => (
              <div key={idx} className="impact-metric-card">
                <div className="impact-metric-icon">{metric.icon}</div>
                <div className="impact-metric-data">
                  <span className="impact-metric-value">{metric.value}</span>
                  <span className="impact-metric-label">{metric.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PestControl;