import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, PieChart, Pie, Cell } from 'recharts';
import { Bird, Trees, Camera, TrendingUp, MapPin, AlertTriangle, Heart, Shield, MessageCircle, Send, X, Loader, RefreshCw, Download, Share2, Bell, Settings, ArrowUp, Zap, Eye, Calendar, Filter, Search, Upload, Database, Wifi, WifiOff, CheckCircle, XCircle, Plus, Edit, Trash2, Award, Users, DollarSign, Leaf, Target, Activity, FileText, Info } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './WildlifeConservation.css';

export default function WildlifeConservation() {
  const [selectedSpecies, setSelectedSpecies] = useState('all');
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { text: 'Hello! I\'m your AI Wildlife Conservation Assistant. I can help you with species tracking, habitat analysis, threat assessment, and conservation strategies. How can I assist you today?', sender: 'bot', timestamp: new Date().toISOString() }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [selectedThreat, setSelectedThreat] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationList, setNotificationList] = useState([
    { id: 1, title: 'Tiger Spotted', message: 'Bengal Tiger spotted in Sector-4 near water hole.', time: '2 mins ago', type: 'info', icon: Bird },
    { id: 2, title: 'Intrusion Alert', message: 'Unidentified movement detected in high-risk zone.', time: '15 mins ago', type: 'danger', icon: AlertTriangle },
    { id: 3, title: 'System Healthy', message: 'All AI sensors and cameras are fully operational.', time: '1 hour ago', type: 'success', icon: CheckCircle }
  ]);

  const ws = useRef(null);
  const chatEndRef = useRef(null);
  const API_BASE_URL = 'http://localhost:5000/api';
  const WS_URL = 'ws://localhost:5000';

  const speciesData = [];
  const populationTrends = [];
  const habitatData = [];
  const conservationProjects = [];
  const threats = [];
  const aiApplications = [];
  const kpiMetrics = [];

  // Initialize
  useEffect(() => {
    initializeWebSocket();

    const handleScroll = () => {
      setShowScrollTop(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (ws.current) ws.current.close();
    };
  }, []);

  const initializeWebSocket = () => {
    try {
      ws.current = new WebSocket(WS_URL);
      ws.current.onopen = () => {
        console.log('✅ WebSocket connected');
        setConnectionStatus('connected');
      };
      ws.current.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === 'chat') {
          setChatMessages(prev => [...prev, {
            text: message.text || message.reply,
            sender: 'bot',
            timestamp: new Date().toISOString()
          }]);
          setChatLoading(false);
        }
      };
      ws.current.onerror = () => setConnectionStatus('error');
      ws.current.onclose = () => setConnectionStatus('disconnected');
    } catch (error) {
      setConnectionStatus('error');
    }
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;
    setChatMessages(prev => [...prev, { text: chatInput, sender: 'user', timestamp: new Date().toISOString() }]);
    const query = chatInput;
    setChatInput('');
    setChatLoading(true);

    setTimeout(() => {
      let botResponse = '';
      const lowerQuery = query.toLowerCase();

      if (lowerQuery.includes('tiger') || lowerQuery.includes('bengal')) {
        botResponse = '🐅 **Bengal Tigers Status:**\n\nPopulation: 42 (+8 from last year)\nHealth Score: 87%\nLast Seen: 2 days ago\nThreats: Habitat Loss, Poaching\n\n✅ Tiger Corridor project at 68% completion\n💡 Recommendation: Increase patrol frequency in Sector-7';
      } else if (lowerQuery.includes('threat') || lowerQuery.includes('danger')) {
        botResponse = '⚠️ **Threat Assessment:**\n\nHigh Priority:\n• Habitat Loss (45 incidents)\n• Climate Change (67 incidents)\n\nMedium Priority:\n• Human Conflict (28 incidents)\n• Poaching (12 incidents - decreasing)\n\n✅ Anti-poaching task force: 100% operational';
      } else if (lowerQuery.includes('project') || lowerQuery.includes('conservation')) {
        botResponse = '🎯 **Active Projects:**\n\n1. Tiger Corridor (68% complete)\n2. Dolphin Sanctuary (82% complete)\n3. Anti-Poaching (100% operational)\n4. Grassland Revival (25% planning)\n5. Elephant Network (55% active)\n\nTotal Budget: ₹14.2 Crore\nTeam: 308 members';
      } else if (lowerQuery.includes('ai') || lowerQuery.includes('technology')) {
        botResponse = '🤖 **AI Conservation Tools:**\n\n📸 Camera Traps: 94% accuracy\n📍 Movement Prediction: 88% accuracy\n🚨 Poaching Detection: 91% accuracy\n🌳 Habitat Monitoring: 96% accuracy\n\n✅ Processed 263,240 data points this month';
      } else {
        botResponse = '👋 I can help you with:\n\n🐅 Species Status & Tracking\n⚠️ Threat Assessment\n🎯 Conservation Projects\n🤖 AI Technology\n📊 Population Analytics\n🌳 Habitat Analysis\n\nWhat would you like to know?';
      }

      setChatMessages(prev => [...prev, { text: botResponse, sender: 'bot', timestamp: new Date().toISOString() }]);
      setChatLoading(false);
    }, 1000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const exportReport = () => {
    try {
      const doc = new jsPDF();
      const timestamp = new Date().toLocaleString();

      // Title
      doc.setFontSize(22);
      doc.setTextColor(16, 185, 129); // Green
      doc.text('Wildlife Conservation Report', 20, 20);

      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generated on: ${timestamp}`, 20, 30);
      doc.text('Confidential - EcoHealth Sentinel AI System', 20, 35);

      // Summary
      doc.setFontSize(16);
      doc.setTextColor(30);
      doc.text('System Overview', 20, 50);

      doc.setFontSize(11);
      doc.text('Status: Active', 20, 60);
      doc.text('Connection: Secure', 20, 65);
      doc.text('AI Accuracy: 94.2%', 20, 70);

      // Footer
      const pageHeight = doc.internal.pageSize.getHeight();
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text('Page 1 of 1 - EcoHealth Sentinel Environmental Suite', 105, pageHeight - 10, { align: 'center' });

      doc.save(`wildlife_report_${Date.now()}.pdf`);
      alert('✅ Professional PDF Exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      alert('❌ Error exporting report. Please check if jspdf is available.');
    }
  };

  const schedulePatrol = (species) => {
    alert(`🚁 Patrol Scheduled for ${species}\n\nTime: Tomorrow 6:00 AM\nTeam: Wildlife Rangers Unit-3\nDuration: 4 hours\nEquipment: Drones + AI Cameras`);
    setNotifications(prev => prev + 1);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'critically endangered': return '#dc2626';
      case 'endangered': return '#f97316';
      case 'vulnerable': return '#eab308';
      default: return '#10b981';
    }
  };

  return (
    <div className="wildlife-container">
      {/* Top Navigation */}
      <div className="top-navbar">
        <h2 className="nav-title">🦁 Wildlife Conservation System</h2>

        <div className={`connection-status ${connectionStatus === 'connected' ? 'status-connected' : 'status-disconnected'}`}>
          {connectionStatus === 'connected' ? <Wifi size={18} /> : <WifiOff size={18} />}
          {connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}
        </div>

        <div className="nav-actions" style={{ position: 'relative' }}>
          <button className="icon-btn" onClick={exportReport} title="Export PDF Report">
            <Download size={22} color="#4b5563" />
          </button>
          <button
            className={`notification-btn ${showNotifications ? 'active' : ''}`}
            onClick={() => {
              setShowNotifications(!showNotifications);
              if (!showNotifications) setNotifications(0);
            }}
          >
            <Bell size={22} color={showNotifications ? '#3b82f6' : '#4b5563'} />
            {notificationList.length > 0 && <span className="notification-badge">{notificationList.length}</span>}
          </button>

          {showNotifications && (
            <div className="notifications-dropdown">
              <div className="notifications-header">
                <h3>System Notifications</h3>
                <button className="close-btn" onClick={() => setShowNotifications(false)}>
                  <X size={16} />
                </button>
              </div>
              <div className="notifications-list">
                {notificationList.map(notif => {
                  const NotifIcon = notif.icon;
                  return (
                    <div key={notif.id} className="notification-item">
                      <div className={`notification-icon-box ${notif.type}`}>
                        <NotifIcon size={18} />
                      </div>
                      <div className="notification-content">
                        <p className="notification-item-title">{notif.title}</p>
                        <p className="notification-item-msg">{notif.message}</p>
                        <span className="notification-item-time">{notif.time}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="notifications-footer">
                <button onClick={() => setNotificationList([])}>Clear All</button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="container-wrapper">

        {/* Header */}
        <div className="header-card">
          <div className="pos-relative z-2">
            <div className="flex-between">
              <div>
                <h1 className="text-4xl font-black header-title-gradient mb-8">
                  Wildlife Conservation
                </h1>
                <p className="text-gray-500 text-base">AI-powered monitoring and protection of endangered species</p>
              </div>
              <Bird className="text-green-500 icon-xl opacity-0-2" />
            </div>
          </div>
        </div>

        {/* KPI Metrics */}
        <div className="kpi-grid">
          {kpiMetrics.map((kpi, index) => {
            const Icon = kpi.icon;
            const isPositive = kpi.change.startsWith('+');
            return (
              <div key={index} className="kpi-card" style={{ borderTopColor: kpi.color }}>
                <div className="flex-between mb-8">
                  <div className="flex-center br-8" style={{ width: '36px', height: '36px', backgroundColor: kpi.color + '20' }}>
                    <Icon className="icon-sm" style={{ color: kpi.color }} />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mb-4">{kpi.label}</p>
                <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                <span className={`text-xs font-semibold p-4 br-8 mt-8 d-inline-block ${isPositive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                  {kpi.change}
                </span>
              </div>
            );
          })}
        </div>

        {/* Species Cards */}
        <div className="species-grid">
          {speciesData.map((species, index) => (
            <div key={index} className="species-card" style={{ backgroundColor: species.bgColor, borderLeftColor: species.color }}>
              <div className="flex-between mb-16">
                <div style={{ fontSize: '3rem' }}>{species.icon}</div>
                <span className="p-8 br-full text-xs font-bold text-white mb-4" style={{ backgroundColor: getStatusBadge(species.status) }}>
                  {species.status.toUpperCase()}
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-12">{species.name}</h3>
              <div className="grid-2 gap-8 text-sm mb-16">
                <div>
                  <p className="text-gray-500">Population</p>
                  <p className="font-semibold">{species.population}</p>
                </div>
                <div>
                  <p className="text-gray-500">Change</p>
                  <p className={`font-semibold ${species.change >= 0 ? 'text-green-500' : 'text-red-600'}`}>
                    {species.change >= 0 ? '+' : ''}{species.change}%
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Health Score</p>
                  <p className="font-semibold">{species.healthScore}%</p>
                </div>
                <div>
                  <p className="text-gray-500">Last Seen</p>
                  <p className="font-semibold">{species.lastSeen}</p>
                </div>
              </div>
              <div className="mb-16">
                <p className="text-xs text-gray-500 mb-4">Habitat</p>
                <p className="text-sm font-semibold">{species.habitat}</p>
              </div>
              <div className="mb-16">
                <p className="text-xs text-gray-500 mb-4">Threats</p>
                <div className="flex-start gap-8 flex-wrap">
                  {species.threats.map((threat, i) => (
                    <span key={i} className="p-4 bg-red-100 text-red-600 br-8 text-xs font-semibold">
                      {threat}
                    </span>
                  ))}
                </div>
              </div>
              <div className={`p-12 text-center font-semibold br-12 text-white mb-4 ${species.trend === 'increasing' ? 'bg-trend-increasing' : species.trend === 'stable' ? 'bg-trend-stable' : 'bg-trend-critical'}`}>
                {species.trend.toUpperCase()}
              </div>
              <button onClick={() => schedulePatrol(species.name)} className="patrol-btn">
                <Camera className="icon-sm" />
                Schedule Patrol
              </button>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="charts-grid">
          <div className="chart-card col-span-8">
            <h3 className="text-xl font-bold text-gray-900 mb-16 flex-center gap-8 justify-start">
              <TrendingUp className="text-green-500 icon-md" />
              Population Trends (2020-2024)
            </h3>
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={populationTrends}>
                <defs>
                  <linearGradient id="colorTigers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="year" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }} />
                <Legend />
                <Area type="monotone" dataKey="tigers" stroke="#f97316" fillOpacity={1} fill="url(#colorTigers)" strokeWidth={2} name="Bengal Tigers" />
                <Area type="monotone" dataKey="elephants" stroke="#6b7280" fillOpacity={0.6} fill="#6b7280" strokeWidth={2} name="Elephants" />
                <Area type="monotone" dataKey="dolphins" stroke="#3b82f6" fillOpacity={0.4} fill="#3b82f6" strokeWidth={2} name="Dolphins" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card col-span-4">
            <h3 className="text-xl font-bold text-gray-900 mb-16 flex-center gap-8 justify-start">
              <Target className="icon-md" style={{ color: '#8b5cf6' }} />
              Habitat Status
            </h3>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={habitatData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ habitat, quality }) => `${habitat}: ${quality}%`}
                  outerRadius={100}
                  dataKey="quality"
                >
                  {habitatData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#10b981', '#3b82f6', '#ef4444', '#06b6d4', '#8b5cf6'][index % 5]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card col-span-12">
            <h3 className="text-xl font-bold text-gray-900 mb-16 flex-center gap-8 justify-start">
              <Trees className="text-green-500 icon-md" />
              Habitat Protection Comparison
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={habitatData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="habitat" stroke="#6b7280" />
                <YAxis stroke="#6b7280" label={{ value: 'km²', angle: -90, position: 'insideLeft' }} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }} />
                <Legend />
                <Bar dataKey="area" fill="#94a3b8" name="Total Area" radius={[8, 8, 0, 0]} />
                <Bar dataKey="protected" fill="#10b981" name="Protected Area" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Conservation Projects */}
        <div className="chart-card mb-24">
          <h3 className="text-2xl font-bold text-gray-900 mb-16 flex-center gap-8 justify-start">
            <Target className="text-green-500 icon-lg" />
            Active Conservation Projects
          </h3>
          <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
            {conservationProjects.map((project, index) => (
              <div key={index} className="project-card">
                <div className="flex-between mb-16">
                  <h4 className="font-bold text-gray-900">{project.name}</h4>
                  <span className={`p-8 br-full text-xs font-bold text-white mb-4`} style={{ backgroundColor: project.status === 'Operational' ? '#10b981' : project.status === 'Active' ? '#3b82f6' : '#f59e0b' }}>
                    {project.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-12">
                  Beneficiary: <span className="font-semibold text-gray-900">{project.beneficiary}</span>
                </p>
                <div className="mb-16">
                  <div className="flex-between text-sm mb-8">
                    <span className="text-gray-500">Progress</span>
                    <span className="font-semibold">{project.completion}%</span>
                  </div>
                  <div className="progress-bar-container">
                    <div className="progress-bar-fill" style={{ width: `${project.completion}%` }} />
                  </div>
                </div>
                <div className="grid-2 gap-12 text-sm mb-16">
                  <div>
                    <p className="text-gray-500">Funding</p>
                    <p className="font-semibold">₹{(project.funding / 100000).toFixed(1)}L</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Team Size</p>
                    <p className="font-semibold">{project.team} members</p>
                  </div>
                </div>
                <div className="p-16 bg-white br-12 border-2 border-green-500">
                  <p className="text-xs text-gray-500 mb-4">Impact:</p>
                  <p className="text-sm font-semibold text-green-500">{project.impact}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Threats */}
        <div className="chart-card mb-24">
          <h3 className="text-2xl font-bold text-gray-900 mb-16 flex-center gap-8 justify-start">
            <AlertTriangle className="text-red-500 icon-lg" />
            Threats & Mitigation Strategies
          </h3>
          <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
            {threats.map((threat, index) => (
              <div key={index} className="threat-card" style={{ background: 'linear-gradient(135deg, #fef2f2 0%, #fff7ed 100%)', borderLeftColor: getSeverityColor(threat.severity) }}>
                <div className="flex-between mb-16">
                  <h4 className="font-bold text-gray-900">{threat.type}</h4>
                  <span className="p-8 br-full text-xs font-bold text-white mb-4" style={{ backgroundColor: getSeverityColor(threat.severity) }}>
                    {threat.severity.toUpperCase()}
                  </span>
                </div>
                <div className="text-sm mb-12">
                  <p className="text-gray-500">Affected Species:</p>
                  <p className="font-semibold text-gray-900">{threat.affected}</p>
                </div>
                <div className="text-sm mb-12">
                  <p className="text-gray-500">Incidents:</p>
                  <p className="font-semibold text-gray-900">{threat.incidents} reported</p>
                </div>
                <div className="text-sm">
                  <p className="text-gray-500 mb-4">Mitigation:</p>
                  <p className="text-gray-700 line-height-1-5">{threat.mitigation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Applications */}
        <div className="chart-card mb-24">
          <h3 className="text-2xl font-bold text-gray-900 mb-16 flex-center gap-8 justify-start">
            <Camera className="text-purple-500 icon-lg" />
            AI-Powered Conservation Tools
          </h3>
          <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
            {aiApplications.map((app, index) => {
              const Icon = app.icon;
              return (
                <div key={index} className="ai-app-card">
                  <div className="flex-start mb-16">
                    <div className="ai-app-icon-container">
                      <Icon className="text-purple-500 icon-lg" />
                    </div>
                    <div className="w-full">
                      <h4 className="font-bold text-gray-900 mb-8">{app.title}</h4>
                      <p className="text-sm text-gray-500 line-height-1-5 mb-12">{app.description}</p>
                      <div className="grid-2 gap-8 text-sm mb-16">
                        <div>
                          <p className="text-gray-500">Accuracy</p>
                          <p className="font-bold text-purple-500">{app.accuracy}%</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Processed</p>
                          <p className="font-bold text-purple-500">{app.processed}</p>
                        </div>
                      </div>
                      <div className="ai-accuracy-bar">
                        <div className="ai-accuracy-fill" style={{ width: `${app.accuracy}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Success Stories */}
        <div className="success-stories-card">
          <div className="flex-start gap-24">
            <Heart className="icon-48 flex-shrink-0" />
            <div>
              <h3 className="text-3xl font-black mb-24">Conservation Success Stories</h3>
              <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
                {[
                  { icon: '🐅', title: 'Tiger Population Recovery', text: 'Bengal tiger numbers increased by 25% over 5 years through habitat protection and AI surveillance.' },
                  { icon: '🐬', title: 'Dolphin Sanctuary Success', text: 'Gangetic dolphin population grew by 35% after establishing protected zones with acoustic AI sensors.' },
                  { icon: '🌳', title: 'Habitat Restoration', text: 'AI-guided reforestation restored 5,000 hectares of critical wildlife corridors.' },
                  { icon: '👥', title: 'Community Engagement', text: '12,000 community members trained as wildlife guardians, reducing conflict by 60%.' }
                ].map((story, i) => (
                  <div key={i} className="success-story-item">
                    <p className="text-3xl mb-12">{story.icon}</p>
                    <h4 className="font-bold mb-8">{story.title}</h4>
                    <p className="text-sm text-white opacity-0-9 line-height-1-6">{story.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Responsible AI */}
        <div className="responsible-ai-card">
          <div className="flex-start gap-16">
            <Shield className="icon-40 flex-shrink-0" color="#3b82f6" />
            <div>
              <h3 className="text-xl font-bold mb-16 text-slate-800">Responsible AI for Wildlife Conservation</h3>
              <p className="text-slate-500 text-sm line-height-1-6 mb-16">
                Our AI systems are designed with ethical considerations and environmental impact at the forefront.
                All wildlife monitoring data is secured with end-to-end encryption, and AI models are regularly audited.
              </p>
              <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                {[
                  { icon: '🔒', title: 'Data Privacy', text: 'Protected location data' },
                  { icon: '🤝', title: 'Community Partnership', text: 'Local involvement' },
                  { icon: '🌍', title: 'Environmental First', text: 'Minimal footprint' }
                ].map((item, i) => (
                  <div key={i} className="responsible-ai-item">
                    <p className="text-2xl mb-8">{item.icon}</p>
                    <p className="font-bold mb-4 text-slate-800">{item.title}</p>
                    <p className="text-slate-600 text-xs font-semibold">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top */}
      {showScrollTop && (
        <button className="scroll-to-top" onClick={scrollToTop}>
          <ArrowUp className="icon-md" />
        </button>
      )}

      {/* Chat FAB */}
      <button onClick={() => setChatOpen(!chatOpen)} className="chat-fab">
        <MessageCircle className="icon-lg" />
      </button>

      {/* Chat Panel */}
      {chatOpen && (
        <div className="chat-panel">
          <div className="chat-header">
            <div className="flex-center gap-12">
              <Bird className="icon-lg" />
              <div>
                <h3 className="font-bold">Wildlife AI Assistant</h3>
                <p className="text-sm opacity-0-9">Conservation Intelligence</p>
              </div>
            </div>
            <button onClick={() => setChatOpen(false)} className="icon-btn" style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>
              <X className="icon-sm" />
            </button>
          </div>

          <div className="chat-messages">
            {chatMessages.map((msg, index) => (
              <div key={index} className={msg.sender === 'user' ? 'message-bubble-user' : 'message-bubble-bot'}>
                <p className="text-sm line-height-1-6 m-0">{msg.text}</p>
                <p className="text-xs opacity-0-9 mt-8 d-inline-block">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            ))}
            {chatLoading && (
              <div className="message-bubble-bot">
                <Loader className="icon-sm spin" />
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="chat-input-container">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
              placeholder="Ask about tigers, threats, projects..."
              className="chat-input"
            />
            <button onClick={sendChatMessage} className="chat-send-btn" disabled={chatLoading}>
              <Send className="icon-sm" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
