import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Wind, Droplets, Factory, AlertCircle, TrendingUp, Filter, Download, RefreshCw, Share2, Maximize2, Minimize2, Satellite, MessageSquare, Eye, Bell, Activity, Zap, CloudRain, Sun, Send, X, Mic, History, Settings, BookOpen, Camera, FileText, BarChart2, Calendar, Users } from 'lucide-react';
import jsPDF from 'jspdf';
import './PollutionHeatmap.css';

export default function PollutionHeatmap() {
  const [selectedPollutant, setSelectedPollutant] = useState('pm25');
  const [timeframe, setTimeframe] = useState('current');
  const [viewMode, setViewMode] = useState('heatmap');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [monitoringStations, setMonitoringStations] = useState([]);
  const [pollutionSources, setPollutionSources] = useState([]);
  const [healthRecommendations, setHealthRecommendations] = useState([]);
  const [timeSeriesData, setTimeSeriesData] = useState([]);
  const [realTimeData, setRealTimeData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showForecast, setShowForecast] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedStations, setSelectedStations] = useState([]);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [chatHistory, setChatHistory] = useState([]);
  const [downloadFormat, setDownloadFormat] = useState('pdf');

  const mapRef = useRef(null);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  const API_BASE_URL = 'http://localhost:5000/api';

  const pollutants = [
    { id: 'pm25', name: 'PM2.5', unit: 'µg/m³', icon: Wind, color: '#ef4444' },
    { id: 'pm10', name: 'PM10', unit: 'µg/m³', icon: Wind, color: '#f97316' },
    { id: 'no2', name: 'NO₂', unit: 'ppb', icon: Factory, color: '#f59e0b' },
    { id: 'so2', name: 'SO₂', unit: 'ppb', icon: Factory, color: '#8b5cf6' },
    { id: 'co', name: 'CO', unit: 'ppm', icon: Factory, color: '#3b82f6' },
    { id: 'o3', name: 'O₃', unit: 'ppb', icon: Wind, color: '#10b981' }
  ];

  const aqiLevels = [
    { range: '0-50', category: 'Good', color: '#10b981', description: 'Air quality is satisfactory' },
    { range: '51-100', category: 'Moderate', color: '#f59e0b', description: 'Acceptable for most people' },
    { range: '101-150', category: 'Unhealthy for Sensitive', color: '#f97316', description: 'Sensitive groups may experience effects' },
    { range: '151-200', category: 'Unhealthy', color: '#ef4444', description: 'Everyone may experience effects' },
    { range: '201-300', category: 'Very Unhealthy', color: '#8b5cf6', description: 'Health alert for everyone' },
    { range: '301+', category: 'Hazardous', color: '#7c3aed', description: 'Emergency conditions' }
  ];

  useEffect(() => {
    loadFallbackData();
    if (autoRefresh) {
      const interval = setInterval(fetchAllData, 300000);
      return () => clearInterval(interval);
    }
  }, [selectedPollutant, timeframe, autoRefresh]);

  useEffect(() => {
    scrollChatToBottom();
  }, [chatMessages]);

  useEffect(() => {
    if (showChatbot && chatMessages.length === 0) {
      const greeting = "👋 Hello! I'm your AI Air Quality Assistant. Ask me about pollution levels, health impacts, and recommendations!";
      setChatMessages([{
        id: 1,
        type: 'bot',
        text: greeting,
        timestamp: new Date(),
        suggestions: ['Current AQI', 'PM2.5 Info', 'Health Tips', 'Station Data']
      }]);
    }
  }, [showChatbot]);

  const scrollChatToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchMonitoringData(),
        fetchPollutionSources(),
        fetchHealthRecommendations(),
        fetchTimeSeriesData(),
        fetchRealTimeData()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
      loadFallbackData();
    } finally {
      setLoading(false);
    }
  };

  const fetchMonitoringData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/environment/air-quality-stations`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setMonitoringStations(data.stations || []);
      } else {
        loadFallbackData();
      }
    } catch (error) {
      loadFallbackData();
    }
  };

  const fetchPollutionSources = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/environment/pollution-sources`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setPollutionSources(data.sources || []);
      }
    } catch (error) {
      loadFallbackData();
    }
  };

  const fetchHealthRecommendations = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/environment/health-recommendations`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setHealthRecommendations(data.recommendations || []);
      }
    } catch (error) {
      loadFallbackData();
    }
  };

  const fetchTimeSeriesData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/environment/aqi-timeseries?timeframe=${timeframe}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setTimeSeriesData(data.timeseries || []);
      }
    } catch (error) {
      console.log('Timeseries data unavailable');
    }
  };

  const fetchRealTimeData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/environment/real-time-aqi`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setRealTimeData(data);
        checkForAlerts(data);
      }
    } catch (error) {
      console.log('Real-time data unavailable');
    }
  };

  const checkForAlerts = (data) => {
    if (data && data.aqi > 150) {
      const alert = {
        id: Date.now(),
        message: `High AQI Alert: ${data.aqi}. Take precautions!`,
        severity: 'high',
        timestamp: new Date()
      };
      setNotifications(prev => [alert, ...prev.slice(0, 4)]);

      if (Notification.permission === 'granted') {
        new Notification('⚠️ Air Quality Alert', {
          body: alert.message
        });
      }
    }
  };

  const loadFallbackData = () => {
    setMonitoringStations([
      { id: 1, name: 'City Center', location: 'Darbhanga Municipal Area', coordinates: { lat: 26.1542, lng: 85.8974 }, aqi: 168, pm25: 78, pm10: 145, no2: 45, so2: 12, co: 1.2, o3: 58, status: 'unhealthy', color: '#ef4444' },
      { id: 2, name: 'Industrial Zone', location: 'MIDC Area', coordinates: { lat: 26.1687, lng: 85.9123 }, aqi: 195, pm25: 92, pm10: 178, no2: 58, so2: 18, co: 1.8, o3: 42, status: 'very-unhealthy', color: '#8b5cf6' },
      { id: 3, name: 'Residential North', location: 'North Darbhanga', coordinates: { lat: 26.1789, lng: 85.8856 }, aqi: 142, pm25: 65, pm10: 128, no2: 38, so2: 10, co: 0.9, o3: 52, status: 'unhealthy-sensitive', color: '#f97316' },
      { id: 4, name: 'Green Belt', location: 'Park Area', coordinates: { lat: 26.1423, lng: 85.8745 }, aqi: 95, pm25: 42, pm10: 87, no2: 25, so2: 6, co: 0.5, o3: 62, status: 'moderate', color: '#f59e0b' },
      { id: 5, name: 'Rural Station', location: 'Outskirts', coordinates: { lat: 26.1234, lng: 85.8567 }, aqi: 68, pm25: 28, pm10: 54, no2: 18, so2: 4, co: 0.3, o3: 48, status: 'good', color: '#10b981' }
    ]);

    setPollutionSources([
      { type: 'Vehicular Emissions', contribution: 35, trend: 'increasing', color: '#ef4444', icon: '🚗' },
      { type: 'Industrial Activities', contribution: 28, trend: 'stable', color: '#f97316', icon: '🏭' },
      { type: 'Construction Dust', contribution: 18, trend: 'increasing', color: '#f59e0b', icon: '🏗️' },
      { type: 'Biomass Burning', contribution: 12, trend: 'seasonal', color: '#8b5cf6', icon: '🔥' },
      { type: 'Other Sources', contribution: 7, trend: 'stable', color: '#64748b', icon: '📊' }
    ]);

    setHealthRecommendations([
      { category: 'General Population', advice: 'Limit outdoor activities. Wear N95 masks outdoors. Keep windows closed.', icon: AlertCircle, severity: 'high' },
      { category: 'Sensitive Groups', advice: 'Avoid outdoor activities. Stay indoors with air purifiers. Consult physician if symptoms worsen.', icon: AlertCircle, severity: 'critical' },
      { category: 'Children & Elderly', advice: 'Remain indoors. Use prescribed medications. Monitor health closely.', icon: AlertCircle, severity: 'critical' }
    ]);

    setRealTimeData({ aqi: 168, pm25: 78, pm10: 145, location: 'Darbhanga', timestamp: new Date() });
  };

  const handleChatSend = () => {
    if (!chatInput.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: chatInput,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    const currentInput = chatInput.toLowerCase();
    setChatInput('');
    setIsTyping(true);

    setTimeout(() => {
      let botResponse = '';
      let suggestions = [];
      const avgAQI = Math.round(monitoringStations.reduce((acc, s) => acc + s.aqi, 0) / monitoringStations.length);

      if (currentInput.includes('aqi') || currentInput.includes('air quality') || currentInput.includes('current')) {
        botResponse = `Current Average AQI is ${avgAQI} - This is "${getAQICategory(avgAQI).category}" level.\n\nStations:\n${monitoringStations.slice(0, 3).map(s => `• ${s.name}: ${s.aqi}`).join('\n')}\n\nLimit outdoor activities and use N95 masks.`;
        suggestions = ['PM2.5 Info', 'Health Tips', 'Station Data'];
      } else if (currentInput.includes('pm2.5') || currentInput.includes('pm 2.5')) {
        botResponse = `PM2.5 particles are <2.5 micrometers - can penetrate deep into lungs.\n\nCurrent level: ${realTimeData?.pm25 || 78} µg/m³\nWHO limit: 15 µg/m³\n\nMain sources:\n🚗 Vehicles: 35%\n🏭 Industry: 28%\n🏗️ Construction: 18%`;
        suggestions = ['Health Effects', 'Safety Tips', 'Sources'];
      } else if (currentInput.includes('health') || currentInput.includes('safety') || currentInput.includes('tip')) {
        botResponse = `🏥 Health Recommendations:\n\n• Wear N95 masks outdoors\n• Limit outdoor activities\n• Keep windows closed\n• Use air purifiers indoors\n• Stay hydrated\n• Monitor symptoms\n\nSensitive groups should avoid outdoor activities when AQI > 100.`;
        suggestions = ['Indoor Air', 'Mask Types', 'Exercise Guidelines'];
      } else if (currentInput.includes('source') || currentInput.includes('cause')) {
        botResponse = `Pollution Sources:\n\n🚗 Vehicular: 35%\n🏭 Industrial: 28%\n🏗️ Construction: 18%\n🔥 Biomass: 12%\n📊 Others: 7%`;
        suggestions = ['Reduce Pollution', 'Traffic Data', 'Seasonal Patterns'];
      } else if (currentInput.includes('station') || currentInput.includes('location')) {
        botResponse = `${monitoringStations.length} Active Monitoring Stations:\n\n${monitoringStations.map(s => `📍 ${s.name}\nAQI: ${s.aqi} | Status: ${getAQICategory(s.aqi).category}`).join('\n\n')}`;
        suggestions = ['Nearest Station', 'Compare Stations', 'Map View'];
      } else {
        botResponse = `I can help you with AQI levels, health tips, and pollution sources. What would you like to know?`;
        suggestions = ['Current AQI', 'PM2.5 Info', 'Health Tips'];
      }

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: botResponse,
        timestamp: new Date(),
        suggestions
      };
      setChatMessages(prev => [...prev, botMessage]);
      setIsTyping(false);

      if (voiceEnabled && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(botResponse.replace(/[🌍💨💊📊📍📅💡✅⚠️🟠🔴🟣⚫🚗🏭🏗️🔥]/g, ''));
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
      }
    }, 1000);

    setChatHistory(prev => [{ query: chatInput, timestamp: new Date() }, ...prev.slice(0, 19)]);
  };

  const handleSuggestionClick = (suggestion) => {
    setChatInput(suggestion);
    inputRef.current?.focus();
  };

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setChatInput(transcript);
      };
      recognition.start();
      showToast('Listening...');
    } else {
      showToast('Voice input not supported');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAllData();
    setRefreshing(false);
    showToast('Data refreshed!');
  };

  const downloadReportPDF = async () => {
    showToast('Generating PDF...');
    const pdf = new jsPDF('p', 'mm', 'a4');
    pdf.setFontSize(24);
    pdf.setTextColor(59, 130, 246);
    pdf.text('Air Quality Report', 105, 20, { align: 'center' });
    pdf.save(`air_quality_report_${Date.now()}.pdf`);
    showToast('PDF Downloaded!');
  };

  const downloadReport = () => {
    if (downloadFormat === 'pdf') {
      downloadReportPDF();
    } else {
      const report = { timestamp: new Date().toISOString(), monitoringStations };
      const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pollution_report_${Date.now()}.json`;
      a.click();
      showToast('JSON Downloaded!');
    }
  };

  const shareData = async (station) => {
    const text = `Air Quality Update: ${station.name} | AQI: ${station.aqi}`;
    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch (e) {
        navigator.clipboard.writeText(text);
        showToast('Copied to clipboard!');
      }
    } else {
      navigator.clipboard.writeText(text);
      showToast('Copied to clipboard!');
    }
  };

  const getAQICategory = (aqi) => {
    if (aqi <= 50) return { category: 'Good', color: '#10b981' };
    if (aqi <= 100) return { category: 'Moderate', color: '#f59e0b' };
    if (aqi <= 150) return { category: 'Unhealthy for Sensitive', color: '#f97316' };
    if (aqi <= 200) return { category: 'Unhealthy', color: '#ef4444' };
    if (aqi <= 300) return { category: 'Very Unhealthy', color: '#8b5cf6' };
    return { category: 'Hazardous', color: '#7c3aed' };
  };

  const showToast = (msg) => {
    const toast = document.createElement('div');
    toast.textContent = msg;
    toast.className = 'heatmap-toast';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  const averageAQI = monitoringStations.length > 0
    ? Math.round(monitoringStations.reduce((acc, s) => acc + s.aqi, 0) / monitoringStations.length)
    : 0;

  return (
    <div className={`heatmap-container ${isFullscreen ? 'fullscreen' : ''}`}>
      <div className={`heatmap-wrapper ${isFullscreen ? 'fullscreen' : ''}`}>
        {/* Header */}
        <div className="heatmap-card">
          <div className="flex-between flex-wrap gap-16 pos-relative z-1">
            <div className="flex-center gap-16">
              <div className="icon-glow-container br-16 bg-gradient-blue-purple flex-center" style={{ width: '64px', height: '64px' }}>
                <Wind size={32} className="white-text floating-icon" />
              </div>
              <div>
                <h1 className="text-36 font-800 text-slate-700 m-0 mb-8">Air Quality Heatmap</h1>
                <p className="text-slate-500 m-0 flex-center gap-8 justify-start">
                  <Satellite size={16} className="text-blue-500" />
                  Real-time • AI chatbot • reports
                </p>
              </div>
            </div>
            <div className="flex-wrap gap-12" style={{ display: 'flex' }}>
              <button className={`heatmap-btn ${showChatbot ? 'btn-green' : 'btn-purple'}`} onClick={() => setShowChatbot(!showChatbot)}>
                <MessageSquare size={18} />
                {showChatbot ? 'Hide' : 'AI Chat'}
              </button>
              <button className={`heatmap-btn ${showHistory ? 'btn-green' : 'btn-gray'}`} onClick={() => setShowHistory(!showHistory)}>
                <History size={18} />
                History
              </button>
              <button className={`heatmap-btn ${compareMode ? 'btn-green' : 'btn-amber'}`} onClick={() => setCompareMode(!compareMode)}>
                <BarChart2 size={18} />
                Compare
              </button>
              <select value={downloadFormat} onChange={(e) => setDownloadFormat(e.target.value)} className="heatmap-input-field w-auto text-14" style={{ padding: '8px 12px' }}>
                <option value="pdf">PDF</option>
                <option value="json">JSON</option>
              </select>
              <button className="heatmap-btn" onClick={downloadReport}>
                <Download size={18} />
                {downloadFormat.toUpperCase()}
              </button>
              <button className="heatmap-btn" onClick={handleRefresh} disabled={refreshing}>
                <RefreshCw size={18} className={refreshing ? 'spinner' : ''} />
              </button>
              <button className="heatmap-btn" onClick={() => setIsFullscreen(!isFullscreen)}>
                {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Real-time Stats */}
        <div className="heatmap-card stats-card">
          <div className="stats-grid">
            <div className="text-center">
              <Activity size={32} className="m-0-auto-mb8 floating-icon" />
              <p className="stats-value">{averageAQI}</p>
              <p className="stats-label">Average AQI</p>
            </div>
            <div className="text-center">
              <Zap size={32} className="m-0-auto-mb8 floating-icon" />
              <p className="stats-value">{monitoringStations.length}</p>
              <p className="stats-label">Active Stations</p>
            </div>
            <div className="text-center">
              <Bell size={32} className="m-0-auto-mb8 floating-icon" />
              <p className="stats-value">{notifications.length}</p>
              <p className="stats-label">Active Alerts</p>
            </div>
            <div className="text-center">
              <Sun size={32} className="m-0-auto-mb8 floating-icon" />
              <p className="stats-value">{realTimeData?.pm25 || 78}</p>
              <p className="stats-label">PM2.5 µg/m³</p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="heatmap-card">
          <div className="pos-relative z-1 grid-cols-auto gap-16">
            <div>
              <label className="d-block text-14 font-700 text-slate-500 mb-8">
                <Filter size={14} className="d-inline mr-6" />
                Pollutant Type
              </label>
              <select value={selectedPollutant} onChange={(e) => setSelectedPollutant(e.target.value)} className="heatmap-input-field">
                {pollutants.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.unit})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="d-block text-14 font-700 text-slate-500 mb-8">
                <Activity size={14} className="d-inline mr-6" />
                Timeframe
              </label>
              <select value={timeframe} onChange={(e) => setTimeframe(e.target.value)} className="heatmap-input-field">
                <option value="current">Current</option>
                <option value="hourly">Last 24 Hours</option>
                <option value="daily">Last 7 Days</option>
              </select>
            </div>
            <div>
              <label className="d-block text-14 font-700 text-slate-500 mb-8">
                <Eye size={14} className="d-inline mr-6" />
                View Mode
              </label>
              <select value={viewMode} onChange={(e) => setViewMode(e.target.value)} className="heatmap-input-field">
                <option value="heatmap">Heatmap</option>
                <option value="stations">Stations</option>
              </select>
            </div>
            <div className="flex-end">
              <label className="flex-center gap-8 cursor-pointer p-12 bg-slate-100 br-12 w-100">
                <input type="checkbox" checked={autoRefresh} onChange={(e) => setAutoRefresh(e.target.checked)} />
                <span className="text-14 font-600">Auto Refresh</span>
              </label>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '24px', marginBottom: '24px' }}>
          {/* Interactive Heatmap */}
          <div className={`heatmap-card ${window.innerWidth > 1024 ? 'grid-span-2' : ''}`}>
            <div className="pos-relative z-1">
              <h2 className="text-24 font-800 text-slate-700 mb-16 flex-center gap-12 justify-start">
                <MapPin size={28} className="text-blue-500" />
                Pollution Map
              </h2>
              <div ref={mapRef} className="map-container">
                <div className="map-grid-overlay"></div>
                {monitoringStations.map((station) => (
                  <div key={station.id} className="station-marker"
                    style={{
                      left: `${((station.coordinates.lng - 85.85) / 0.1) * 100}%`,
                      top: `${100 - ((station.coordinates.lat - 26.12) / 0.08) * 100}%`
                    }}>
                    <div className="station-pulse" style={{ background: `${station.color}30` }}></div>
                    <div className="station-icon-container" style={{ background: station.color }}>
                      <MapPin size={24} className="white-text" />
                    </div>
                    <div className="station-tooltip">
                      <div className="tooltip-content">
                        <p className="font-700 text-16 m-0 mb-8">{station.name}</p>
                        <p className="text-slate-400 m-0 mb-12">AQI: <span style={{ color: station.color }}>{station.aqi}</span></p>
                        <button onClick={() => shareData(station)} className="w-100 p-8 br-8 border-none white-text font-600 text-12 cursor-pointer" style={{ background: station.color }}>
                          Share
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="aqi-scale-box">
                  <p className="text-13 font-700 text-slate-700 m-0 mb-12">Scale</p>
                  <div className="flex-col gap-4">
                    {aqiLevels.map((level, i) => (
                      <div key={i} className="flex-center text-12 justify-start">
                        <div className="scale-color-box br-6" style={{ background: level.color, width: '12px', height: '12px', marginRight: '8px' }}></div>
                        <span className="font-600">{level.range}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pollution Sources */}
          <div className="heatmap-card">
            <div className="pos-relative z-1">
              <h2 className="text-20 font-800 text-slate-700 mb-16">Sources</h2>
              <div className="flex-col gap-12">
                {pollutionSources.map((source, index) => (
                  <div key={index} className="source-item" style={{ background: `${source.color}10`, borderLeftColor: source.color }}>
                    <div className="flex-between mb-8">
                      <div className="flex-center gap-8">
                        <span className="text-24">{source.icon}</span>
                        <h3 className="font-700 text-15 text-slate-700 m-0">{source.type}</h3>
                      </div>
                      <span className="source-percentage-badge" style={{ background: source.color }}>{source.contribution}%</span>
                    </div>
                    <div className="source-progress-bg">
                      <div className="source-progress-fill" style={{ width: `${source.contribution}%`, background: source.color }}></div>
                    </div>
                    <p className="text-12 text-slate-500 m-0">Trend: <span className="font-700" style={{ color: source.trend === 'increasing' ? '#ef4444' : '#10b981' }}>{source.trend}</span></p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Monitoring Stations Grid */}
        <div className="heatmap-card">
          <div className="pos-relative z-1">
            <h2 className="text-24 font-800 text-slate-700 mb-16">Stations</h2>
            <div className="grid-cols-auto-stations gap-16">
              {monitoringStations.map((station) => {
                const category = getAQICategory(station.aqi);
                return (
                  <div key={station.id} className="station-data-card" style={{ background: `${category.color}10`, borderLeftColor: category.color }}>
                    <div className="flex-between mb-12">
                      <MapPin size={28} style={{ color: category.color }} />
                      <span className="aqi-badge-val" style={{ background: category.color }}>{station.aqi}</span>
                    </div>
                    <h3 className="font-700 text-18 text-slate-700 m-0 mb-4">{station.name}</h3>
                    <div className="grid-2-col gap-8 text-13 mb-12">
                      <div>PM2.5: <span className="font-700">{station.pm25}</span></div>
                      <div>PM10: <span className="font-700">{station.pm10}</span></div>
                    </div>
                    <div className="category-status-label" style={{ background: category.color }}>{category.category}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Health Recommendations */}
        <div className="heatmap-card">
          <div className="pos-relative z-1">
            <h2 className="text-24 font-800 text-slate-700 mb-16">Health Tips</h2>
            <div className="grid-cols-auto-rec gap-16">
              {healthRecommendations.map((rec, index) => {
                const Icon = rec.icon;
                return (
                  <div key={index} className={`rec-card ${rec.severity === 'critical' ? 'rec-critical' : 'rec-high'}`}>
                    <div className="flex-center mb-12 justify-start">
                      <Icon size={24} className={`mr-12 ${rec.severity === 'critical' ? 'text-red-500' : 'text-amber-500'}`} />
                      <h3 className="font-700 text-16 text-slate-700 m-0">{rec.category}</h3>
                    </div>
                    <p className="text-14 text-slate-500 line-height-1-6 m-0">{rec.advice}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Reference */}
        <div className="heatmap-card stats-card">
          <div className="pos-relative z-1">
            <h2 className="text-24 font-800 mb-16">AQI Reference</h2>
            <div className="grid-cols-auto-ref gap-16 mb-24">
              {aqiLevels.map((level, index) => (
                <div key={index} className="ref-level-card">
                  <div className="ref-level-bar" style={{ background: level.color }}></div>
                  <p className="font-800 text-16 m-0 mb-4 text-slate-700">{level.range}</p>
                  <p className="text-14 font-700 m-0 mb-8 text-slate-500">{level.category}</p>
                  <p className="text-12 line-height-1-5 m-0 text-slate-400">{level.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Chatbot */}
      {showChatbot && (
        <div className="chatbot-panel">
          <div className="chatbot-header">
            <div className="flex-center gap-12">
              <MessageSquare size={24} />
              <div>
                <p className="font-700 text-16 m-0">AI Assistant</p>
                <p className="text-12 opacity-0-9 m-0">Online</p>
              </div>
            </div>
            <div className="flex-center gap-8">
              <button onClick={() => setVoiceEnabled(!voiceEnabled)} className={`p-8 border-none br-8 cursor-pointer transition-all ${voiceEnabled ? 'bg-green-500' : 'bg-trans-white-2'}`}>
                <Mic size={18} className="white-text" />
              </button>
              <button onClick={() => setShowChatbot(false)} className="p-8 bg-trans-white-2 border-none br-8 cursor-pointer transition-all">
                <X size={18} className="white-text" />
              </button>
            </div>
          </div>
          <div className="chatbot-messages">
            {chatMessages.map((msg) => (
              <div key={msg.id} className={`chat-bubble ${msg.type}`}>
                {msg.text}
                {msg.suggestions && (
                  <div className="chat-suggestions">
                    {msg.suggestions.map((s, i) => (
                      <button key={i} onClick={() => handleSuggestionClick(s)} className="suggestion-btn">{s}</button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <div className="chatbot-input-area">
            <input ref={inputRef} type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleChatSend()} placeholder="Ask about air quality..." className="heatmap-input-field" />
            <button onClick={handleVoiceInput} className="heatmap-btn p-12 btn-purple"><Mic size={18} /></button>
            <button onClick={handleChatSend} className="heatmap-btn p-12 btn-green"><Send size={18} /></button>
          </div>
        </div>
      )}
    </div>
  );
}
