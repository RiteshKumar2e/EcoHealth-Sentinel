import React, { useState, useEffect, useRef } from 'react';
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ComposedChart
} from 'recharts';
import {
  Trash2, Recycle, TrendingUp, MapPin, AlertCircle, Leaf, Package,
  MessageCircle, Send, X, Loader, RefreshCw, Plus, Eye, Edit, Bell,
  Sparkles, Zap, Calendar, Filter, Search, Download, Share2, Target,
  Activity, DollarSign, Users, Truck, Clock, Award,
  PieChart as PieChartIcon, ArrowUp, ArrowDown, Menu, Maximize2, Minimize2,
  Wifi, WifiOff
} from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './WasteManagement.css';

export default function WasteManagement() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { text: 'Hello! I\'m your AI Waste Management Assistant. How can I help optimize your waste collection today?', sender: 'bot', timestamp: new Date().toISOString() }
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

  const ws = useRef(null);
  const chatEndRef = useRef(null);

  // Placeholder Data (Empty by default as per request structure)
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
    // WebSocket init would go here
    const handleScroll = () => setShowScrollTop(window.pageYOffset > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;
    setChatMessages(prev => [...prev, { text: chatInput, sender: 'user', timestamp: new Date().toISOString() }]);
    setChatInput('');
    setChatLoading(true);
    setTimeout(() => {
      setChatMessages(prev => [...prev, { text: "I can help you monitor waste levels. currently, no live data is connected.", sender: 'bot', timestamp: new Date().toISOString() }]);
      setChatLoading(false);
    }, 1000);
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

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
    const doc = new jsPDF();
    doc.text("Waste Management Report", 10, 10);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 10, 20);
    doc.text("Summary: No live data available for comprehensive reporting.", 10, 30);
    doc.save("waste-report.pdf");
  };

  const optimizeRoute = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("Route optimization started based on available historical data.");
    }, 1500);
  };

  const toggleNotifications = () => {
    if (notifications > 0) {
      setNotifications(0);
    } else {
      alert("No new notifications");
    }
  };

  const EmptyState = ({ message, icon: Icon }) => (
    <div className="flex-center flex-col p-40 border-dashed br-12 bg-slate-50 h-full">
      <div className="p-16 bg-slate-100 br-full mb-16">
        <Icon className="icon-32 text-slate-400" />
      </div>
      <p className="font-600 text-slate-500 mb-4 text-center">No Data Available</p>
      <p className="text-13 text-slate-400 m-0 text-center">{message}</p>
    </div>
  );

  return (
    <>
      <div className="waste-container">
        {/* Top Navigation */}
        <div className="top-navbar">
          <div className="nav-left">
            <div className="flex-center gap-8">
              <div className="p-8 bg-green-100 br-8">
                <Recycle className="icon-20 text-green-600" />
              </div>
              <h2 className="nav-title m-0">Smart Waste Management</h2>
            </div>
          </div>

          <div className="flex-center gap-16">

            <div className="nav-actions">
              <button className="icon-btn" onClick={exportData} title="Export Report">
                <Download className="icon-18 text-slate-600" />
              </button>
              <button className="notification-btn" onClick={toggleNotifications}>
                <Bell className="icon-18 text-slate-600" />
                {notifications > 0 && <span className="notification-badge">{notifications}</span>}
              </button>
              <button className="icon-btn icon-btn-primary" onClick={optimizeRoute} disabled={loading} title="Optimize Routes">
                {loading ? <Loader className="icon-18 spin" /> : <Zap className="icon-18" />}
              </button>
            </div>
          </div>
        </div>

        <div className="container-wrapper">
          {/* Main Content Grid */}
          <div className="charts-grid">

            {/* KPI Section */}
            <div className="col-span-12 mb-24">
              {kpiMetrics.length > 0 ? (
                <div className="kpi-grid">
                  {kpiMetrics.map((kpi, index) => (
                    <div key={index} className="kpi-card" style={{ borderTopColor: kpi.color }}>
                      {/* ... KPI Item Content ... */}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="kpi-grid">
                  <div className="kpi-card flex-center flex-col p-24">
                    <div className="flex-between w-full mb-8">
                      <span className="text-sm text-slate-600">Collection Rate</span>
                      <TrendingUp size={16} className="text-slate-400" />
                    </div>
                    <div className="text-2xl font-bold text-slate-800">--%</div>
                  </div>
                  <div className="kpi-card flex-center flex-col p-24">
                    <div className="flex-between w-full mb-8">
                      <span className="text-sm text-slate-600">Total Waste</span>
                      <Trash2 size={16} className="text-slate-400" />
                    </div>
                    <div className="text-2xl font-bold text-slate-800">-- tons</div>
                  </div>
                  <div className="kpi-card flex-center flex-col p-24">
                    <div className="flex-between w-full mb-8">
                      <span className="text-sm text-slate-600">Efficiency</span>
                      <Activity size={16} className="text-slate-400" />
                    </div>
                    <div className="text-2xl font-bold text-slate-800">--%</div>
                  </div>
                  <div className="kpi-card flex-center flex-col p-24">
                    <div className="flex-between w-full mb-8">
                      <span className="text-sm text-slate-600">Est. Cost</span>
                      <DollarSign size={16} className="text-slate-400" />
                    </div>
                    <div className="text-2xl font-bold text-slate-800">$0</div>
                  </div>
                </div>
              )}
            </div>

            {/* Monthly Trends */}
            <div className="chart-card col-span-8">
              <div className="flex-between mb-16">
                <h3 className="chart-title m-0"><TrendingUp className="icon-20 text-green-500" /> Monthly Trends</h3>
              </div>
              <div className="min-h-300 flex-center">
                {monthlyTrends.length > 0 ? (
                  <ResponsiveContainer width="100%" height={320}>
                    <AreaChart data={monthlyTrends}>
                      {/* ... Chart Config ... */}
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyState icon={TrendingUp} message="No trend data available." />
                )}
              </div>
            </div>

            {/* Performance Radar */}
            <div className="chart-card col-span-4">
              <div className="flex-between mb-16">
                <h3 className="chart-title m-0"><Target className="icon-20 text-blue-500" /> Metrics</h3>
              </div>
              <div className="min-h-300 flex-center">
                {performanceMetrics.length > 0 ? (
                  <ResponsiveContainer width="100%" height={320}>
                    <RadarChart data={performanceMetrics}>
                      {/* ... Chart Config ... */}
                    </RadarChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyState icon={Target} message="No performance metrics." />
                )}
              </div>
            </div>

            {/* Cost vs Revenue */}
            <div className="chart-card col-span-6">
              <div className="flex-between mb-16">
                <h3 className="chart-title m-0"><DollarSign className="icon-20 text-orange-500" /> Financials</h3>
              </div>
              <div className="min-h-300 flex-center">
                {monthlyTrends.length > 0 ? (
                  <ResponsiveContainer hidden />
                ) : (
                  <EmptyState icon={DollarSign} message="No financial data recorded." />
                )}
              </div>
            </div>

            {/* Waste Composition */}
            <div className="chart-card col-span-6">
              <div className="flex-between mb-16">
                <h3 className="chart-title m-0"><PieChartIcon className="icon-20 text-purple-500" /> Composition</h3>
              </div>
              <div className="min-h-300 flex-center">
                {wasteComposition.length > 0 ? (
                  <ResponsiveContainer hidden />
                ) : (
                  <EmptyState icon={PieChartIcon} message="No composition analysis." />
                )}
              </div>
            </div>

            {/* Collection Points Status */}
            <div className="chart-card col-span-12">
              <div className="flex-between mb-16">
                <h3 className="chart-title m-0"><MapPin className="icon-20 text-blue-500" /> Live Collection Points</h3>
                <div className="flex-center gap-8">
                  <span className="badge bg-slate-100 text-slate-500 text-xs">Total: 0</span>
                  <span className="badge bg-green-100 text-green-600 text-xs">Active: 0</span>
                </div>
              </div>
              <div className="min-h-300 flex-center bg-slate-50 br-12 border-dashed">
                <div className="text-center">
                  <MapPin className="icon-48 text-slate-300 mb-12" />
                  <p className="font-600 text-slate-500">No Active Collection Points</p>
                  <p className="text-sm text-slate-400">Map data is currently unavailable</p>
                </div>
              </div>
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

        {/* Chat Panel - Preserved simpler version */}
        {chatOpen && (
          <div className="chat-panel">
            <div className="chat-header">
              <div className="flex-center gap-12">
                <Sparkles className="icon-24 text-green-500" />
                <div>
                  <h3 className="font-bold text-base m-0">Waste Assistant</h3>
                  <span className="text-xs text-green-600 flex-center gap-4"><div className="w-2 h-2 br-full bg-green-500"></div> Online</span>
                </div>
              </div>
              <button onClick={() => setChatOpen(false)} className="icon-btn border-none"><X size={18} /></button>
            </div>
            <div className="chat-messages">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`chat-message ${msg.sender === 'user' ? 'text-right' : ''}`}>
                  <div className={msg.sender === 'user' ? 'message-bubble-user' : 'message-bubble-bot'}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {chatLoading && <div className="text-xs text-slate-400 p-8">Typing...</div>}
              <div ref={chatEndRef}></div>
            </div>
            <div className="chat-input-wrapper">
              <div className="chat-input-container">
                <input
                  className="chat-input"
                  placeholder="Ask me anything..."
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && sendChatMessage()}
                />
                <button className="icon-btn-primary p-12 br-8 border-none cursor-pointer" onClick={sendChatMessage}><Send size={18} /></button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
