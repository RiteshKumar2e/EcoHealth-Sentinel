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
  const [notifications, setNotifications] = useState(12);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const ws = useRef(null);
  const chatEndRef = useRef(null);

  // Comprehensive Data
  const wasteStats = [
    { type: 'Recyclable', collected: 450, recycled: 380, percentage: 84, icon: Recycle, color: '#10b981', trend: '+12%', cost: '$2,340', revenue: '$3,200' },
    { type: 'Organic', collected: 680, recycled: 610, percentage: 90, icon: Leaf, color: '#059669', trend: '+8%', cost: '$1,890', revenue: '$2,800' },
    { type: 'Hazardous', collected: 85, recycled: 75, percentage: 88, icon: AlertCircle, color: '#ef4444', trend: '+5%', cost: '$4,500', revenue: '$0' },
    { type: 'General', collected: 920, recycled: 280, percentage: 30, icon: Trash2, color: '#6b7280', trend: '-3%', cost: '$5,600', revenue: '$800' },
    { type: 'E-Waste', collected: 125, recycled: 115, percentage: 92, icon: Package, color: '#8b5cf6', trend: '+15%', cost: '$3,200', revenue: '$4,500' },
    { type: 'Metal', collected: 340, recycled: 330, percentage: 97, icon: Shield, color: '#f59e0b', trend: '+10%', cost: '$2,100', revenue: '$5,200' }
  ];

  const monthlyTrends = [
    { month: 'Jan', recyclable: 420, organic: 650, general: 880, hazardous: 78, cost: 12400, revenue: 6200, efficiency: 82 },
    { month: 'Feb', recyclable: 435, organic: 670, general: 900, hazardous: 82, cost: 12800, revenue: 6500, efficiency: 84 },
    { month: 'Mar', recyclable: 440, organic: 680, general: 910, hazardous: 80, cost: 13100, revenue: 6800, efficiency: 85 },
    { month: 'Apr', recyclable: 445, organic: 675, general: 920, hazardous: 83, cost: 13400, revenue: 7100, efficiency: 86 },
    { month: 'May', recyclable: 450, organic: 680, general: 920, hazardous: 85, cost: 13700, revenue: 7400, efficiency: 88 },
    { month: 'Jun', recyclable: 455, organic: 690, general: 915, hazardous: 84, cost: 14000, revenue: 7800, efficiency: 90 }
  ];

  const hourlyData = [
    { hour: '00:00', amount: 45 }, { hour: '02:00', amount: 32 }, { hour: '04:00', amount: 28 },
    { hour: '06:00', amount: 52 }, { hour: '08:00', amount: 89 }, { hour: '10:00', amount: 112 },
    { hour: '12:00', amount: 145 }, { hour: '14:00', amount: 138 }, { hour: '16:00', amount: 156 },
    { hour: '18:00', amount: 132 }, { hour: '20:00', amount: 98 }, { hour: '22:00', amount: 67 }
  ];

  const wasteComposition = [
    { name: 'Plastic', value: 28, color: '#3b82f6' },
    { name: 'Paper', value: 22, color: '#10b981' },
    { name: 'Food Waste', value: 35, color: '#059669' },
    { name: 'Metal', value: 8, color: '#6b7280' },
    { name: 'Glass', value: 7, color: '#06b6d4' }
  ];

  const performanceMetrics = [
    { metric: 'Collection Efficiency', value: 92, fullMark: 100 },
    { metric: 'Recycling Rate', value: 84, fullMark: 100 },
    { metric: 'Route Optimization', value: 88, fullMark: 100 },
    { metric: 'Cost Efficiency', value: 76, fullMark: 100 },
    { metric: 'Customer Satisfaction', value: 94, fullMark: 100 },
    { metric: 'Environmental Impact', value: 89, fullMark: 100 }
  ];

  const collectionPoints = [
    { id: 1, name: 'Central Hub', location: 'Main Market', status: 'operational', capacity: 85, lastCollection: '2 hours ago', types: ['All'], priority: 'high' },
    { id: 2, name: 'Residential A', location: 'North Zone', status: 'operational', capacity: 62, lastCollection: '4 hours ago', types: ['Recyclable', 'Organic'], priority: 'medium' },
    { id: 3, name: 'Industrial Area', location: 'MIDC', status: 'full', capacity: 95, lastCollection: '30 mins ago', types: ['General', 'Hazardous'], priority: 'urgent' },
    { id: 4, name: 'Educational Campus', location: 'University', status: 'operational', capacity: 45, lastCollection: '6 hours ago', types: ['Recyclable'], priority: 'low' },
    { id: 5, name: 'Commercial District', location: 'Business Center', status: 'maintenance', capacity: 0, lastCollection: '12 hours ago', types: ['All'], priority: 'high' },
    { id: 6, name: 'Hospital Complex', location: 'Medical District', status: 'operational', capacity: 78, lastCollection: '1 hour ago', types: ['Hazardous'], priority: 'urgent' },
    { id: 7, name: 'Tech Park', location: 'IT Hub', status: 'operational', capacity: 55, lastCollection: '3 hours ago', types: ['E-Waste', 'Recyclable'], priority: 'medium' },
    { id: 8, name: 'Food Market', location: 'Central Market', status: 'operational', capacity: 82, lastCollection: '1.5 hours ago', types: ['Organic'], priority: 'high' }
  ];

  const kpiMetrics = [
    { label: 'Collection Rate', value: '95.2%', change: '+2.3%', icon: Truck, color: '#10b981' },
    { label: 'Avg Response Time', value: '42 min', change: '-8 min', icon: Clock, color: '#3b82f6' },
    { label: 'Cost per Ton', value: '$124', change: '-$12', icon: DollarSign, color: '#f59e0b' },
    { label: 'Recycling Rate', value: '84%', change: '+6%', icon: Recycle, color: '#059669' },
    { label: 'Customer Satisfaction', value: '4.7/5', change: '+0.3', icon: Award, color: '#8b5cf6' },
    { label: 'Fleet Efficiency', value: '89%', change: '+4%', icon: Activity, color: '#ec4899' },
    { label: 'CO₂ Reduction', value: '1.2T', change: '+0.3T', icon: Leaf, color: '#14b8a6' },
    { label: 'Active Users', value: '12.4K', change: '+840', icon: Users, color: '#6366f1' },
    { label: 'Waste Diverted', value: '2,450T', change: '+180T', icon: TrendingUp, color: '#10b981' },
    { label: 'Revenue Generated', value: '$45K', change: '+$8K', icon: DollarSign, color: '#059669' },
    { label: 'Processing Speed', value: '98%', change: '+3%', icon: Zap, color: '#f59e0b' },
    { label: 'Compliance Score', value: '96%', change: '+2%', icon: CheckCircle, color: '#10b981' }
  ];

  const recyclingPrograms = [
    { name: 'Plastic to Fuel', status: 'Active', processed: 2400, unit: 'kg/month', impact: '1.2 tons CO₂ saved', participants: 340 },
    { name: 'E-Waste Recovery', status: 'Active', processed: 850, unit: 'kg/month', impact: '450 kg metals recovered', participants: 120 },
    { name: 'Organic Composting', status: 'Active', processed: 5200, unit: 'kg/month', impact: '3.5 tons fertilizer produced', participants: 580 },
    { name: 'Paper Recycling', status: 'Active', processed: 1800, unit: 'kg/month', impact: '42 trees saved', participants: 290 },
    { name: 'Glass Recycling', status: 'Active', processed: 1200, unit: 'kg/month', impact: '30% energy saved', participants: 180 },
    { name: 'Metal Recovery', status: 'Active', processed: 3400, unit: 'kg/month', impact: '$12K revenue', participants: 410 }
  ];

  const tips = [
    'Separate waste at source into recyclable, organic, and general categories',
    'Rinse containers before recycling to prevent contamination',
    'Compost organic waste to create nutrient-rich soil',
    'Avoid single-use plastics and opt for reusable alternatives',
    'Donate or sell items instead of throwing them away',
    'Properly dispose of hazardous waste at designated collection points',
    'Use reusable bags when shopping to reduce plastic waste',
    'Buy products with minimal packaging',
    'Participate in local recycling programs and initiatives'
  ];

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
