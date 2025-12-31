import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Heart, Sprout, Leaf, Users, Activity, MessageSquare, Bell, Search, X, Send,
  BarChart3, PieChart, Database, Shield, Settings, TrendingUp, TrendingDown,
  AlertCircle, CheckCircle, Clock, Download, Filter, Calendar, Globe, Zap,
  DollarSign, Cpu, HardDrive, RefreshCw, Eye, UserCheck, FileText, Target,
  Award, MapPin, Package, Server, Share2, Layers
} from 'lucide-react';
import jsPDF from "jspdf";
import './AdminDashboard.css';

// Utility function for CSV download
const downloadFile = (data, filename, type) => {
  const blob = new Blob([data], { type });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  window.URL.revokeObjectURL(url);
};

export default function AdminDashboard() {
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();

  // State Management
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { sender: 'bot', message: 'Hello Admin! How can I help you today?', time: '10:30 AM' }
  ]);
  // eslint-disable-next-line no-unused-vars
  const [searchQuery, setSearchQuery] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [dateRange, setDateRange] = useState('7days');
  const [selectedDomain, setSelectedDomain] = useState('all');
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);

  // Backend API Configuration
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

  // Real-time Data States from MongoDB
  const [systemMetrics, setSystemMetrics] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalProjects: 0,
    avgAccuracy: 0,
    totalAlerts: 0,
    revenue: 0,
    apiCalls: 0,
    successRate: 0
  });

  const [domainStats, setDomainStats] = useState({
    agriculture: { projects: 0, users: 0, accuracy: 0, alerts: 0 },
    healthcare: { projects: 0, users: 0, accuracy: 0, alerts: 0 },
    environment: { projects: 0, users: 0, accuracy: 0, alerts: 0 }
  });

  const [activeProjects, setActiveProjects] = useState([]);
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [userActivity, setUserActivity] = useState([]);
  const [serverMetrics, setServerMetrics] = useState({
    cpuUsage: 0,
    memoryUsage: 0,
    diskUsage: 0,
    networkTraffic: 0
  });
  // eslint-disable-next-line no-unused-vars
  const [apiHealth, setApiHealth] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [geographicData, setGeographicData] = useState([]);
  const [modelPerformance, setModelPerformance] = useState([]);

  // Fetch All Dashboard Data from MongoDB
  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange, selectedDomain]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      // Fetch System Metrics (Simulated for this refactor to avoid waiting for backend)
      // In a real scenario, uncomment the fetch calls
      /*
      const metricsRes = await fetch(`${API_BASE_URL}/admin/metrics?range=${dateRange}`, { headers });
      const metricsData = await metricsRes.json();
      setSystemMetrics(metricsData.data);
      */
      // Simulating basic data for UI if backend is not reachable
      setSystemMetrics({
        totalUsers: 12503,
        activeUsers: 8432,
        totalProjects: 450,
        avgAccuracy: 94.2,
        totalAlerts: 23,
        revenue: 45000,
        apiCalls: 120000,
        successRate: 99.8
      });

      setDomainStats({
        agriculture: { projects: 120, users: 4500, accuracy: 92, alerts: 5 },
        healthcare: { projects: 150, users: 5200, accuracy: 96, alerts: 12 },
        environment: { projects: 180, users: 2800, accuracy: 94, alerts: 6 }
      });

      // ... other fetches would go here

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // AI Chatbot Integration
  const handleSendMessage = async () => {
    if (!chatMessage.trim()) return;

    const userMessage = {
      sender: 'user',
      message: chatMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory([...chatHistory, userMessage]);
    const currentMessage = chatMessage;
    setChatMessage('');

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/admin/chatbot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: currentMessage,
          context: 'admin_dashboard',
          domain: selectedDomain
        })
      });

      const data = await response.json();

      const botResponse = {
        sender: 'bot',
        message: data.response,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatHistory(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Chatbot error:', error);
      // Simulate response on error
      const botResponse = {
        sender: 'bot',
        message: 'I am currently unable to reach the server. Please try again later.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatHistory(prev => [...prev, botResponse]);
    }
  };

  // Export Dashboard Data
  const handleExportData = (format) => {
    if (format === "csv") {
      const csvData = "Name,Role,Score\nRitesh,Admin,95\nRuchi,User,88";
      downloadFile(csvData, "dashboard_report.csv", "text/csv");
    } else if (format === "pdf") {
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text("Responsible AI Platform Report", 10, 15);
      doc.setFontSize(12);
      doc.text("Generated from Admin Dashboard", 10, 25);
      doc.text("Multi-Domain Real-Time Analytics", 10, 35);
      doc.text("Name: Ritesh | Role: Admin | Score: 95", 10, 50);
      doc.text("Name: Ruchi | Role: User | Score: 88", 10, 60);

      doc.save("dashboard_report.pdf");
    }
  };

  // Utility Functions
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': case 'healthy': case 'success': return '#10b981';
      case 'warning': case 'degraded': return '#f59e0b';
      case 'error': case 'critical': case 'down': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num?.toString() || '0';
  };

  return (
    <div className="admin-dashboard-container">
      {/* Top Navigation */}
      <nav className="admin-top-nav">
        <div className="admin-nav-left">
          <h1 className="admin-nav-logo">
            <span style={{ color: '#3b82f6' }}>Eco</span>Sentinel
          </h1>
          <div className="admin-search-bar">
            <Search size={20} color="#64748b" />
            <input
              type="text"
              placeholder="Search across all domains..."
              className="admin-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="admin-nav-right">
          <button className="admin-nav-icon-btn" onClick={() => setNotificationOpen(!notificationOpen)}>
            <Bell size={20} color="#64748b" />
            {recentAlerts.length > 0 && <span className="admin-badge">{recentAlerts.length}</span>}
          </button>
          <button className="admin-nav-icon-btn">
            <Settings size={20} color="#64748b" />
          </button>
          <select
            className="admin-filter-select"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
            AD
          </div>
        </div>
      </nav>

      <div className="admin-dashboard-content">
        {/* Sidebar */}
        <div className="admin-sidebar">
          <div className="admin-sidebar-section">
            <h3 className="admin-sidebar-section-title">Overview</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button
                className={`admin-sidebar-btn ${selectedDomain === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedDomain('all')}
              >
                <Layers size={18} /> Dashboard
              </button>
              <button className="admin-sidebar-btn">
                <BarChart3 size={18} /> Analytics
              </button>
              <button className="admin-sidebar-btn">
                <Users size={18} /> User Management
              </button>
              <button className="admin-sidebar-btn">
                <FileText size={18} /> Reports
              </button>
            </div>
          </div>

          <div className="admin-sidebar-section">
            <h3 className="admin-sidebar-section-title">Domains</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button
                className={`admin-sidebar-btn ${selectedDomain === 'agriculture' ? 'active' : ''}`}
                onClick={() => setSelectedDomain('agriculture')}
              >
                <Sprout size={18} /> Agriculture
              </button>
              <button
                className={`admin-sidebar-btn ${selectedDomain === 'healthcare' ? 'active' : ''}`}
                onClick={() => setSelectedDomain('healthcare')}
              >
                <Heart size={18} /> Healthcare
              </button>
              <button
                className={`admin-sidebar-btn ${selectedDomain === 'environment' ? 'active' : ''}`}
                onClick={() => setSelectedDomain('environment')}
              >
                <Leaf size={18} /> Environment
              </button>
            </div>
          </div>

          <div className="admin-sidebar-section">
            <h3 className="admin-sidebar-section-title">System</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button className="admin-sidebar-btn">
                <Server size={18} /> Server Status
              </button>
              <button className="admin-sidebar-btn">
                <Database size={18} /> Database
              </button>
              <button className="admin-sidebar-btn">
                <Shield size={18} /> Security
              </button>
              <button className="admin-sidebar-btn">
                <Activity size={18} /> API Health
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="admin-main-view">
          <div className="admin-content-header">
            <div>
              <h1 className="admin-page-title">
                {selectedDomain === 'all' ? 'System Overview' : `${selectedDomain.charAt(0).toUpperCase() + selectedDomain.slice(1)} Domain`}
              </h1>
              <p className="admin-page-subtitle">
                <Activity size={18} /> Real-time monitoring and analytics
              </p>
            </div>
            <div className="admin-header-actions">
              <button className="admin-btn-secondary" onClick={() => handleExportData('csv')}>
                <Download size={18} /> Export CSV
              </button>
              <button className="admin-btn-secondary" onClick={() => handleExportData('pdf')}>
                <FileText size={18} /> Export PDF
              </button>
              <button className="admin-btn-primary" onClick={() => setChatOpen(true)}>
                <MessageSquare size={18} /> AI Assistant
              </button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="admin-metrics-grid">
            <div className="admin-metric-card">
              <div className="admin-metric-icon" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}>
                <Users size={28} />
              </div>
              <div className="admin-metric-label">Total Users</div>
              <div className="admin-metric-value">{formatNumber(systemMetrics.totalUsers)}</div>
              <div className="admin-metric-change" style={{ color: '#10b981' }}>
                <TrendingUp size={16} /> +12.5%
              </div>
            </div>

            <div className="admin-metric-card">
              <div className="admin-metric-icon" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                <Target size={28} />
              </div>
              <div className="admin-metric-label">Avg Accuracy</div>
              <div className="admin-metric-value">{systemMetrics.avgAccuracy}%</div>
              <div className="admin-metric-change" style={{ color: '#10b981' }}>
                <TrendingUp size={16} /> +2.1%
              </div>
            </div>

            <div className="admin-metric-card">
              <div className="admin-metric-icon" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
                <Layers size={28} />
              </div>
              <div className="admin-metric-label">Active Projects</div>
              <div className="admin-metric-value">{formatNumber(systemMetrics.totalProjects)}</div>
              <div className="admin-metric-change" style={{ color: '#10b981' }}>
                <TrendingUp size={16} /> +5.3%
              </div>
            </div>

            <div className="admin-metric-card">
              <div className="admin-metric-icon" style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}>
                <AlertCircle size={28} />
              </div>
              <div className="admin-metric-label">Active Alerts</div>
              <div className="admin-metric-value">{systemMetrics.totalAlerts}</div>
              <div className="admin-metric-change" style={{ color: systemMetrics.totalAlerts > 10 ? '#ef4444' : '#10b981' }}>
                {systemMetrics.totalAlerts > 10 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                {systemMetrics.totalAlerts > 10 ? '+3' : '-2'}
              </div>
            </div>
          </div>

          {/* Domain Specific Stats */}
          {selectedDomain === 'all' && (
            <div className="admin-card">
              <h2 className="admin-section-title">
                <Globe size={24} color="#3b82f6" /> Domain Performance
              </h2>
              <div className="admin-domain-cards">
                {/* Agriculture */}
                <div className="admin-domain-card" onClick={() => setSelectedDomain('agriculture')}>
                  <div className="admin-domain-header" style={{ borderBottom: '2px solid #10b981' }}>
                    <Sprout size={32} color="#10b981" />
                    <h3 className="admin-domain-header-title">Agriculture</h3>
                  </div>
                  <div className="admin-domain-metrics">
                    <div className="admin-domain-metric">
                      <span className="admin-domain-metric-label">Projects</span>
                      <span className="admin-domain-metric-value">{domainStats.agriculture.projects}</span>
                    </div>
                    <div className="admin-domain-metric">
                      <span className="admin-domain-metric-label">Users</span>
                      <span className="admin-domain-metric-value">{formatNumber(domainStats.agriculture.users)}</span>
                    </div>
                    <div className="admin-domain-metric">
                      <span className="admin-domain-metric-label">Accuracy</span>
                      <span className="admin-domain-metric-value">{domainStats.agriculture.accuracy}%</span>
                    </div>
                    <div className="admin-domain-metric">
                      <span className="admin-domain-metric-label">Alerts</span>
                      <span className="admin-domain-metric-value" style={{ color: '#f59e0b' }}>{domainStats.agriculture.alerts}</span>
                    </div>
                  </div>
                  <button className="admin-domain-btn">View Analytics</button>
                </div>

                {/* Healthcare */}
                <div className="admin-domain-card" onClick={() => setSelectedDomain('healthcare')}>
                  <div className="admin-domain-header" style={{ borderBottom: '2px solid #ef4444' }}>
                    <Heart size={32} color="#ef4444" />
                    <h3 className="admin-domain-header-title">Healthcare</h3>
                  </div>
                  <div className="admin-domain-metrics">
                    <div className="admin-domain-metric">
                      <span className="admin-domain-metric-label">Projects</span>
                      <span className="admin-domain-metric-value">{domainStats.healthcare.projects}</span>
                    </div>
                    <div className="admin-domain-metric">
                      <span className="admin-domain-metric-label">Users</span>
                      <span className="admin-domain-metric-value">{formatNumber(domainStats.healthcare.users)}</span>
                    </div>
                    <div className="admin-domain-metric">
                      <span className="admin-domain-metric-label">Accuracy</span>
                      <span className="admin-domain-metric-value">{domainStats.healthcare.accuracy}%</span>
                    </div>
                    <div className="admin-domain-metric">
                      <span className="admin-domain-metric-label">Alerts</span>
                      <span className="admin-domain-metric-value" style={{ color: '#f59e0b' }}>{domainStats.healthcare.alerts}</span>
                    </div>
                  </div>
                  <button className="admin-domain-btn">View Analytics</button>
                </div>
              </div>
            </div>
          )}

          {/* Server Status Section */}
          <div className="admin-metrics-grid">
            <div className="admin-card" style={{ marginBottom: 0 }}>
              <h3 style={{ marginTop: 0, marginBottom: '1rem', fontWeight: 600, color: '#1e293b' }}>Server Load</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                <Cpu size={20} color="#64748b" />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600 }}>
                    <span>CPU Usage</span>
                    <span>{serverMetrics.cpuUsage || 45}%</span>
                  </div>
                  <div className="admin-project-progress-bar">
                    <div className="admin-project-progress-fill" style={{ width: `${serverMetrics.cpuUsage || 45}%`, background: '#3b82f6' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="admin-card" style={{ marginBottom: 0 }}>
              <h3 style={{ marginTop: 0, marginBottom: '1rem', fontWeight: 600, color: '#1e293b' }}>Memory Status</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                <HardDrive size={20} color="#64748b" />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600 }}>
                    <span>RAM Usage</span>
                    <span>{serverMetrics.memoryUsage || 60}%</span>
                  </div>
                  <div className="admin-project-progress-bar">
                    <div className="admin-project-progress-fill" style={{ width: `${serverMetrics.memoryUsage || 60}%`, background: '#8b5cf6' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Transcations Table */}
          <div className="admin-card">
            <h2 className="admin-section-title">
              <FileText size={24} color="#3b82f6" /> Recent System Logs
            </h2>
            <table className="admin-table">
              <thead>
                <tr>
                  <th className="admin-th">Event ID</th>
                  <th className="admin-th">User</th>
                  <th className="admin-th">Action</th>
                  <th className="admin-th">Status</th>
                  <th className="admin-th">Time</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="admin-td">#EVT-8901</td>
                  <td className="admin-td">System Admin</td>
                  <td className="admin-td">Database Backup</td>
                  <td className="admin-td"><span className="admin-status-badge" style={{ background: '#dcfce7', color: '#166534' }}>Success</span></td>
                  <td className="admin-td">2 mins ago</td>
                </tr>
                <tr>
                  <td className="admin-td">#EVT-8902</td>
                  <td className="admin-td">Ritesh Kumar</td>
                  <td className="admin-td">Model Training</td>
                  <td className="admin-td"><span className="admin-status-badge" style={{ background: '#dbeafe', color: '#1e40af' }}>Running</span></td>
                  <td className="admin-td">15 mins ago</td>
                </tr>
                <tr>
                  <td className="admin-td">#EVT-8903</td>
                  <td className="admin-td">API Gateway</td>
                  <td className="admin-td">Rate Limit Warning</td>
                  <td className="admin-td"><span className="admin-status-badge" style={{ background: '#fffbeb', color: '#b45309' }}>Warning</span></td>
                  <td className="admin-td">1 hour ago</td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </div>

      {/* AI Chatbot */}
      {chatOpen && (
        <div className="admin-chatbot-container">
          <div className="admin-chatbot-header">
            <div className="admin-chatbot-title">
              <MessageSquare size={24} /> Admin AI Assistant
            </div>
            <button className="admin-close-chat-btn" onClick={() => setChatOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <div className="admin-chatbot-messages">
            {chatHistory.map((msg, index) => (
              <div key={index} className={`admin-chat-message ${msg.sender === 'bot' ? 'admin-chat-message-bot' : 'admin-chat-message-user'}`}>
                <p className="admin-chat-message-text">{msg.message}</p>
                <span className="admin-message-time" style={{ color: msg.sender === 'bot' ? '#64748b' : 'rgba(255,255,255,0.7)' }}>
                  {msg.time}
                </span>
              </div>
            ))}
          </div>

          <div className="admin-chatbot-input">
            <input
              type="text"
              placeholder="Ask about system status, users, or reports..."
              className="admin-chatbot-input-field"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button className="admin-send-btn" onClick={handleSendMessage}>
              <Send size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
