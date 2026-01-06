import React, { useState, useEffect, useRef } from 'react';
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ComposedChart, RadialBarChart, RadialBar
} from 'recharts';
import {
  Trash2, Recycle, TrendingUp, MapPin, AlertCircle, Leaf, Package,
  MessageCircle, Send, X, Loader, RefreshCw, Plus, Eye, Edit, Bell,
  Sparkles, Zap, Calendar, Filter, Search, Download, Share2, Target,
  Activity, DollarSign, Users, Truck, Clock, Award, TrendingDown,
  BarChart3, PieChart as PieChartIcon, Map, Shield, ArrowUp, Settings,
  FileText, Upload, Database, Wifi, WifiOff, CheckCircle, XCircle,
  AlertTriangle, Info, ChevronUp, Menu, Maximize2, Minimize2
} from 'lucide-react';
import './WasteManagement.css';

export default function WasteManagement() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('overview');
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { text: 'Hello! I\'m your AI Waste Management Assistant with real-time analytics, predictive insights, and optimization capabilities. How can I help you today?', sender: 'bot', timestamp: new Date().toISOString() }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const ws = useRef(null);
  const chatEndRef = useRef(null);

  // Comprehensive Data
  const wasteStats = [];
  const monthlyTrends = [];
  const hourlyData = [];
  const wasteComposition = [];
  const performanceMetrics = [];
  const collectionPoints = [];
  const kpiMetrics = [];

  const recyclingPrograms = [];
  const tips = [];

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

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        setLastUpdated(new Date());
        // Simulate data refresh
        console.log('Auto-refreshing data...');
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const initializeWebSocket = () => {
    const WS_URL = 'ws://localhost:5000';
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

      if (lowerQuery.includes('kpi') || lowerQuery.includes('metric')) {
        botResponse = '📊 **Key Performance Indicators:**\n\n✅ Collection Rate: 95.2% (+2.3%)\n⏱️ Response Time: 42 min (-8 min)\n💰 Cost per Ton: $124 (-$12)\n♻️ Recycling: 84% (+6%)\n⭐ Satisfaction: 4.7/5\n\nAll metrics trending positively!';
      } else if (lowerQuery.includes('predict')) {
        botResponse = '🔮 **AI Predictions:**\n\nExpected peak: Saturday 1,150kg\nOptimal collection: Friday 3 PM\nResource allocation: +2 trucks needed\nConfidence: 94%';
      } else if (lowerQuery.includes('optimize') || lowerQuery.includes('route')) {
        botResponse = '🚛 **Route Optimization Complete!**\n\nFuel savings: 28%\nTime saved: 52 minutes\nCO₂ reduced: 45kg\nOptimized path visits 8 points efficiently';
      } else {
        botResponse = '👋 I can help with:\n\n📊 KPI Analysis\n🔮 Predictions\n🚛 Route Optimization\n♻️ Recycling Stats\n💰 Cost Analysis\n🗺️ Zone Performance\n\nWhat would you like to explore?';
      }

      setChatMessages(prev => [...prev, { text: botResponse, sender: 'bot', timestamp: new Date().toISOString() }]);
      setChatLoading(false);
    }, 1000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const exportData = () => {
    alert('📊 Exporting comprehensive report...\n\nFormat: PDF + Excel\nSize: 4.2 MB\nIncludes: All charts, KPIs, and analytics');
  };

  const scheduleCollection = (pointId) => {
    alert(`✅ Collection scheduled for ${collectionPoints.find(p => p.id === pointId)?.name}\n\nScheduled: Tomorrow 9:00 AM\nVehicle: Truck-03\nEstimated duration: 45 min`);
    setNotifications(prev => prev + 1);
  };

  const optimizeRoute = () => {
    setLoading(true);
    setTimeout(() => {
      alert('🚛 AI Route Optimization Complete!\n\n✅ Fuel savings: 28%\n✅ Time saved: 52 minutes\n✅ CO₂ reduced: 45kg\n✅ Efficiency: +12%\n\nNew route applied to all vehicles!');
      setLoading(false);
      setNotifications(prev => prev + 1);
    }, 2000);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  return (
    <>
      <div className="waste-container">
        {/* Top Navigation */}
        <div className="top-navbar">
          <div className="nav-left">
            <button className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu className="icon-20" />
            </button>
            <h2 className="nav-title">🌍 Smart Waste Management</h2>
          </div>

          <div className={`connection-status ${connectionStatus === 'connected' ? 'status-connected' : 'status-disconnected'}`}>
            {connectionStatus === 'connected' ? <Wifi className="icon-16" /> : <WifiOff className="icon-16" />}
            {connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}
          </div>

          <div className="nav-actions">
            <button className="icon-btn" onClick={() => setAutoRefresh(!autoRefresh)} title={autoRefresh ? 'Disable Auto-refresh' : 'Enable Auto-refresh'}>
              <RefreshCw className={`icon-18 ${autoRefresh ? 'animate-spin-2s' : ''}`} />
            </button>
            <button className="icon-btn" onClick={toggleFullscreen}>
              {isFullscreen ? <Minimize2 className="icon-18" /> : <Maximize2 className="icon-18" />}
            </button>
            <button className="icon-btn" onClick={exportData}>
              <Download className="icon-18" />
            </button>
            <button className="notification-btn" onClick={() => setNotifications(0)}>
              <Bell className="icon-18 text-white" />
              {notifications > 0 && <span className="notification-badge">{notifications}</span>}
            </button>
            <button className="icon-btn icon-btn-primary" onClick={optimizeRoute} disabled={loading}>
              {loading ? <Loader className="spinner icon-18" /> : <Zap className="icon-18" />}
            </button>
          </div>
        </div>

        <div className="container-wrapper">

          {/* KPI Metrics */}
          <div className="kpi-grid">
            {kpiMetrics.map((kpi, index) => {
              const Icon = kpi.icon;
              const isPositive = kpi.change.startsWith('+') || (kpi.change.startsWith('-') && (kpi.label.includes('Time') || kpi.label.includes('Cost')));
              return (
                <div key={index} className="kpi-card" style={{ borderTopColor: kpi.color }}>
                  <div className="kpi-header">
                    <div className="kpi-icon-container" style={{ backgroundColor: kpi.color + '20' }}>
                      <Icon className="icon-20" style={{ color: kpi.color }} />
                    </div>
                  </div>
                  <p className="kpi-label">{kpi.label}</p>
                  <p className="kpi-value">{kpi.value}</p>
                  <span className={`kpi-change ${isPositive ? 'positive' : 'negative'}`}>
                    {kpi.change}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Main Charts */}
          <div className="charts-grid">
            <div className="chart-card col-span-8">
              <h3 className="chart-title"><TrendingUp className="icon-24 text-green-500" />Monthly Collection Trends</h3>
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={monthlyTrends}>
                  <defs>
                    <linearGradient id="colorRecyclable" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }} />
                  <Legend />
                  <Area type="monotone" dataKey="recyclable" stroke="#10b981" fillOpacity={1} fill="url(#colorRecyclable)" strokeWidth={2} />
                  <Area type="monotone" dataKey="organic" stroke="#059669" fillOpacity={0.6} fill="#059669" strokeWidth={2} />
                  <Area type="monotone" dataKey="general" stroke="#6b7280" fillOpacity={0.4} fill="#6b7280" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card col-span-4">
              <h3 className="chart-title"><Target className="icon-24 text-blue-500" />Performance Metrics</h3>
              <ResponsiveContainer width="100%" height={320}>
                <RadarChart data={performanceMetrics}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar name="Score" dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.6} strokeWidth={2} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card col-span-6">
              <h3 className="chart-title"><DollarSign className="icon-24 text-orange-500" />Cost vs Revenue</h3>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="cost" fill="#ef4444" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="revenue" fill="#10b981" radius={[8, 8, 0, 0]} />
                  <Line type="monotone" dataKey="efficiency" stroke="#3b82f6" strokeWidth={3} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card col-span-6">
              <h3 className="chart-title"><PieChartIcon className="icon-24 text-purple-500" />Waste Composition</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={wasteComposition}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name} ${value}%`}
                    outerRadius={100}
                    dataKey="value"
                  >
                    {wasteComposition.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card col-span-12">
              <h3 className="chart-title"><Clock className="icon-24 text-pink-500" />Hourly Collection Pattern</h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={hourlyData}>
                  <defs>
                    <linearGradient id="hourlyGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#ec4899" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="amount" stroke="#ec4899" strokeWidth={3} fillOpacity={1} fill="url(#hourlyGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Waste Stats */}
          <div className="stats-grid">
            {wasteStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="stat-card" style={{ borderLeftColor: stat.color }}>
                  <div className="flex-between mb-16">
                    <div className="stat-icon-container" style={{ backgroundColor: stat.color + '20' }}>
                      <Icon className="icon-32" style={{ color: stat.color }} />
                    </div>
                    <span className="badge badge-white" style={{ backgroundColor: stat.color }}>
                      {stat.percentage}%
                    </span>
                  </div>
                  <h3 className="text-lg font-bold mb-12">{stat.type} Waste</h3>
                  <div className="grid-2 gap-8 text-sm mb-16">
                    <div>
                      <p className="text-gray-500">Collected</p>
                      <p className="font-semibold">{stat.collected} kg</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Processed</p>
                      <p className="font-semibold">{stat.recycled} kg</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Cost</p>
                      <p className="font-semibold">{stat.cost}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Revenue</p>
                      <p className="font-semibold text-green-500">{stat.revenue}</p>
                    </div>
                  </div>
                  <div className="progress-container">
                    <div className="progress-fill" style={{ width: `${stat.percentage}%`, backgroundColor: stat.color }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Collection Points */}
          <div className="chart-card">
            <h3 className="chart-title"><MapPin className="icon-24 text-blue-500" />Collection Points Status</h3>
            <div className="collection-grid">
              {collectionPoints.map((point) => (
                <div key={point.id} className={`collection-card priority-${point.priority}`}>
                  <div className="flex-between mb-16">
                    <MapPin className="icon-24 text-blue-500" />
                    <span className="badge badge-white" style={{ backgroundColor: point.status === 'operational' ? '#10b981' : point.status === 'full' ? '#ef4444' : '#f59e0b' }}>
                      {point.status.toUpperCase()}
                    </span>
                  </div>
                  <h4 className="font-bold mb-4">{point.name}</h4>
                  <p className="text-sm text-gray-500 mb-16">{point.location}</p>
                  <div className="mb-12">
                    <div className="flex-between text-xs mb-8">
                      <span className="text-gray-500">Capacity</span>
                      <span className="font-semibold">{point.capacity}%</span>
                    </div>
                    <div className="progress-container">
                      <div className="progress-fill" style={{
                        width: `${point.capacity}%`,
                        backgroundColor: point.capacity > 80 ? '#ef4444' : point.capacity > 60 ? '#f59e0b' : '#10b981'
                      }} />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mb-8">Last: {point.lastCollection}</p>
                  <button className="schedule-btn" onClick={() => scheduleCollection(point.id)}>
                    <Calendar className="icon-16" />
                    Schedule Collection
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Recycling Programs */}
          <div className="chart-card mb-24">
            <h3 className="chart-title"><Recycle className="icon-24 text-green-500" />Recycling Programs</h3>
            <div className="collection-grid">
              {recyclingPrograms.map((program, index) => (
                <div key={index} className="program-card">
                  <div className="flex-between mb-16">
                    <h4 className="font-bold">{program.name}</h4>
                    <span className="badge badge-white" style={{ backgroundColor: program.status === 'Active' ? '#10b981' : '#f59e0b' }}>
                      {program.status}
                    </span>
                  </div>
                  <div className="grid-2 gap-16 text-sm mb-16">
                    <div>
                      <p className="text-gray-500">Processed</p>
                      <p className="font-semibold">{program.processed.toLocaleString()} {program.unit}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Participants</p>
                      <p className="font-semibold">{program.participants}</p>
                    </div>
                  </div>
                  <div className="p-16 bg-white br-8 border-2 border-green-500">
                    <p className="text-xs text-gray-500">Impact:</p>
                    <p className="text-sm font-semibold text-green-500">{program.impact}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="chart-card">
            <h3 className="chart-title"><Info className="icon-24 text-indigo-500" />Waste Reduction Tips</h3>
            <div className="collection-grid">
              {tips.map((tip, index) => (
                <div key={index} className="tip-card">
                  <span className="tip-number">
                    {index + 1}
                  </span>
                  <p className="text-sm text-gray-700 line-height-1-5">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll to Top */}
        {showScrollTop && (
          <button className="scroll-to-top" onClick={scrollToTop}>
            <ArrowUp className="icon-24" />
          </button>
        )}

        {/* Chat FAB */}
        <button onClick={() => setChatOpen(!chatOpen)} className="chat-fab">
          <MessageCircle className="icon-28" />
        </button>

        {/* Chat Panel */}
        {chatOpen && (
          <div className="chat-panel">
            <div className="chat-header">
              <div className="flex-center gap-12">
                <Sparkles className="icon-28" />
                <div>
                  <h3 className="font-bold">Waste AI Assistant</h3>
                  <p className="text-sm opacity-0-9">Online • Analytics</p>
                </div>
              </div>
              <button onClick={() => setChatOpen(false)} className="p-8 bg-trans-white-2 border-none br-8 text-white cursor-pointer">
                <X className="icon-20" />
              </button>
            </div>

            <div className="chat-messages">
              {chatMessages.map((msg, index) => (
                <div key={index} className="chat-message">
                  <div className={msg.sender === 'user' ? 'message-bubble-user' : 'message-bubble-bot'}>
                    <p className="text-sm line-height-1-6">{msg.text}</p>
                    <p className="text-xs opacity-0-7 mt-8">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="chat-message">
                  <div className="message-bubble-bot">
                    <div className="flex-center gap-8">
                      <div className="typing-dot" style={{ animationDelay: '0s' }} />
                      <div className="typing-dot" style={{ animationDelay: '0.2s' }} />
                      <div className="typing-dot" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="chat-input-wrapper">
              <div className="chat-input-container">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                  placeholder="Ask about KPIs, predictions, costs..."
                  className="chat-input"
                />
                <button onClick={sendChatMessage} disabled={chatLoading} className="p-16 br-12 border-none cursor-pointer text-white" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                  <Send className="icon-20" />
                </button>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="loading-overlay">
            <Loader className="spinner icon-64 text-green-500" />
          </div>
        )}
      </div>
    </>
  );
}
