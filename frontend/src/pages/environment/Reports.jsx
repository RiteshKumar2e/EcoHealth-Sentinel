import React, { useState, useEffect, useRef } from 'react';
import { FileText, Download, Calendar, TrendingUp, BarChart3, FileBarChart, Search, RefreshCw, Eye, Share2, Sparkles, MessageCircle, Send, X, Loader, Trash2, Bell, Upload } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './Reports.css';

export default function Reports() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [dateRange, setDateRange] = useState('month');
  const [searchQuery, setSearchQuery] = useState('');
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { text: 'Hello! I can help you with reports, analytics, and data insights. What would you like to know?', sender: 'bot', timestamp: new Date().toISOString() }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [notifications, setNotifications] = useState(3);

  const ws = useRef(null);
  const chatEndRef = useRef(null);

  const API_BASE_URL = 'http://localhost:5000/api';
  const WS_URL = 'ws://localhost:5000';

  const mockReports = [];

  const reportCategories = [
    { id: 'all', name: 'All Reports', count: mockReports.length },
    { id: 'environmental', name: 'Environmental', count: mockReports.filter(r => r.category === 'environmental').length },
    { id: 'energy', name: 'Energy', count: mockReports.filter(r => r.category === 'energy').length },
    { id: 'waste', name: 'Waste', count: mockReports.filter(r => r.category === 'waste').length },
    { id: 'conservation', name: 'Conservation', count: mockReports.filter(r => r.category === 'conservation').length }
  ];

  const quickStats = [
    { label: 'Total Reports', value: mockReports.length.toString(), trend: '+3', icon: FileText, color: 'blue' },
    { label: 'This Month', value: '8', trend: '+2', icon: Calendar, color: 'emerald' },
    { label: 'Downloads', value: '156', trend: '+24', icon: Download, color: 'violet' },
    { label: 'Avg. Size', value: '2.3 MB', trend: '-0.2', icon: BarChart3, color: 'amber' }
  ];

  useEffect(() => {
    setReports(mockReports);
    fetchReports();
    initializeWebSocket();

    return () => {
      if (ws.current) ws.current.close();
    };
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/reports?category=${selectedCategory}&dateRange=${dateRange}`);
      if (response.ok) {
        const data = await response.json();
        setReports(data.length > 0 ? data : mockReports);
      } else {
        setReports(mockReports);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      setReports(mockReports);
    } finally {
      setLoading(false);
    }
  };

  const initializeWebSocket = () => {
    try {
      ws.current = new WebSocket(WS_URL);

      ws.current.onopen = () => {
        console.log('✅ WebSocket connected');
      };

      ws.current.onmessage = (event) => {
        const message = JSON.parse(event.data);
        setChatMessages(prev => [...prev, {
          text: message.text || message.reply || message.message,
          sender: 'bot',
          timestamp: new Date().toISOString()
        }]);
        setChatLoading(false);
      };

      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.current.onclose = () => {
        console.log('WebSocket disconnected');
      };
    } catch (error) {
      console.error('WebSocket initialization error:', error);
    }
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = {
      text: chatInput,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setChatMessages(prev => [...prev, userMessage]);
    const query = chatInput;
    setChatInput('');
    setChatLoading(true);

    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        message: query,
        type: 'report_query',
        user: 'user'
      }));
    } else {
      setTimeout(() => {
        let botResponse = '';
        const lowerQuery = query.toLowerCase();

        if (lowerQuery.includes('download') || lowerQuery.includes('report')) {
          botResponse = `I found ${reports.length} reports. You can download any report by clicking the "Download PDF" button. Would you like me to help you find a specific report?`;
        } else if (lowerQuery.includes('category') || lowerQuery.includes('filter')) {
          botResponse = `You can filter reports by: Environmental, Energy, Waste Management, and Conservation. Currently showing: ${selectedCategory}. Would you like to change the filter?`;
        } else if (lowerQuery.includes('stats') || lowerQuery.includes('statistics')) {
          botResponse = `Here are the quick stats: ${quickStats.map(s => `${s.label}: ${s.value}`).join(', ')}. What would you like to know more about?`;
        } else {
          botResponse = `I can help you with downloading reports, filtering by category, or viewing statistics. What would you like to do?`;
        }

        setChatMessages(prev => [...prev, {
          text: botResponse,
          sender: 'bot',
          timestamp: new Date().toISOString()
        }]);
        setChatLoading(false);
      }, 1000);
    }
  };

  const handleDownloadPDF = (report) => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, pageWidth, 40, 'F');

    doc.setFontSize(24);
    doc.setTextColor(255, 255, 255);
    doc.text(report.title, 20, 20);

    doc.setFontSize(10);
    doc.setTextColor(200, 200, 255);
    doc.text('Environmental Impact Report', 20, 30);

    let yPos = 50;
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Date: ${new Date(report.date).toLocaleDateString()}`, 20, yPos);
    doc.text(`Type: ${report.type}`, 100, yPos);
    doc.text(`Size: ${report.size}`, 150, yPos);

    yPos += 20;
    doc.setFontSize(14);
    doc.setTextColor(37, 99, 235);
    doc.text('Overview', 20, yPos);
    yPos += 10;
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    const splitOverview = doc.splitTextToSize(report.data?.overview || report.description, pageWidth - 40);
    doc.text(splitOverview, 20, yPos);

    if (report.data?.metrics) {
      yPos += 20;
      doc.autoTable({
        startY: yPos,
        head: [['Metric', 'Value', 'Unit', 'Status']],
        body: report.data.metrics.map(metric => [metric.name, metric.value, metric.unit || '-', metric.status]),
        theme: 'grid'
      });
    }

    doc.save(`${report.title.replace(/[^a-z0-9]/gi, '_')}.pdf`);
  };

  const handleGenerateReport = () => {
    alert('Generating custom report based on current filters...');
    setNotifications(prev => prev + 1);
  };

  const handleDeleteReport = (reportId) => {
    if (!window.confirm('Are you sure you want to delete this report?')) return;
    setReports(prev => prev.filter(r => r.id !== reportId));
  };

  const handleShareReport = (reportTitle) => {
    navigator.clipboard.writeText(`${window.location.href} (Shared: ${reportTitle})`);
    alert('Share link copied to clipboard!');
  };

  const handleViewReport = (report) => {
    setChatMessages(prev => [...prev, {
      text: `📊 Viewing "${report.title}":\n\n${report.description}`,
      sender: 'bot',
      timestamp: new Date().toISOString()
    }]);
    setChatOpen(true);
  };

  const filteredReports = reports.filter(report => {
    const matchesCategory = selectedCategory === 'all' || report.category === selectedCategory;
    const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getColorStyles = (color) => {
    const colors = {
      emerald: { bg: '#ecfdf5', text: '#059669', border: '#10b981', btnBg: '#059669', iconBg: '#d1fae5' },
      amber: { bg: '#fffbeb', text: '#d97706', border: '#f59e0b', btnBg: '#d97706', iconBg: '#fef3c7' },
      sky: { bg: '#f0f9ff', text: '#0284c7', border: '#0ea5e9', btnBg: '#0284c7', iconBg: '#e0f2fe' },
      violet: { bg: '#f5f3ff', text: '#7c3aed', border: '#8b5cf6', btnBg: '#7c3aed', iconBg: '#ede9fe' },
      rose: { bg: '#fff1f2', text: '#e11d48', border: '#f43f5e', btnBg: '#e11d48', iconBg: '#ffe4e6' }
    };
    return colors[color] || colors.emerald;
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  return (
    <div className="reports-container">
      <div className="container-wrapper">
        {/* Header */}
        <div className="header-card">
          <div className="header-content">
            <div className="header-left">
              <div className="header-icon-wrapper">
                <FileBarChart size={32} />
              </div>
              <div>
                <h1 className="gradient-title m-0">EcoReports & Analytics</h1>
                <p className="header-subtitle m-0">Generate, view, and analyze environmental impact data</p>
              </div>
            </div>
            <div className="flex-center gap-8">
              <button className="action-button" style={{ background: '#3b82f6', color: 'white', padding: '0.75rem 1.5rem' }} onClick={handleGenerateReport}>
                <Sparkles size={18} />
                Generate Report
              </button>
              <button className="notification-btn" onClick={() => setNotifications(0)}>
                <Bell size={20} color="white" />
                {notifications > 0 && <span className="notification-badge">{notifications}</span>}
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          {quickStats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="stat-card">
                <div>
                  <p className="stat-label m-0">{stat.label}</p>
                  <p className="stat-value m-0">{stat.value}</p>
                  <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>{stat.trend} this week</span>
                </div>
                <div className="stat-icon" style={{ background: '#f1f5f9' }}>
                  <Icon size={24} color="#3b82f6" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="filter-card">
          <div className="filter-grid">
            <div className="search-wrapper">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                className="search-input"
                placeholder="Search reports by title or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="category-tabs">
              {reportCategories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`category-tab ${selectedCategory === cat.id ? 'category-tab-active' : 'category-tab-inactive'}`}
                >
                  {cat.name} ({cat.count})
                </button>
              ))}
            </div>
            <select
              className="search-input"
              style={{ width: 'auto', minWidth: '150px' }}
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="report-grid">
          {filteredReports.map((report) => {
            const styles = getColorStyles(report.color);
            const Icon = report.icon;
            return (
              <div key={report.id} className="report-card" style={{ color: styles.border }}>
                <div className="report-header">
                  <div className="report-icon-container" style={{ background: styles.iconBg }}>
                    <Icon size={24} color={styles.text} />
                  </div>
                  <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem', borderRadius: '999px', background: styles.bg, color: styles.text, fontWeight: 700 }}>
                    {report.status.toUpperCase()}
                  </span>
                </div>
                <h3 className="report-title">{report.title}</h3>
                <p className="report-desc">{report.description}</p>
                <div className="report-meta">
                  <div className="meta-item"><Calendar size={14} /> {report.date}</div>
                  <div className="meta-item"><FileText size={14} /> {report.type}</div>
                  <div className="meta-item"><TrendingUp size={14} /> {report.size}</div>
                </div>
                <div className="report-actions">
                  <button className="action-button" style={{ background: styles.bg, color: styles.text }} onClick={() => handleViewReport(report)}>
                    <Eye size={16} /> View
                  </button>
                  <button className="action-button" style={{ background: '#3b82f6', color: 'white' }} onClick={() => handleDownloadPDF(report)}>
                    <Download size={16} /> Download
                  </button>
                  <button className="action-button" style={{ background: '#f3f4f6', color: '#6b7280' }} onClick={() => handleShareReport(report.title)}>
                    <Share2 size={16} />
                  </button>
                  <button className="action-button" style={{ background: '#fee2e2', color: '#ef4444' }} onClick={() => handleDeleteReport(report.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Chat Bot */}
      <button className="chat-trigger" onClick={() => setChatOpen(!chatOpen)}>
        {chatOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {chatOpen && (
        <div className="chat-window">
          <div className="chat-header-bar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div className="rounded-full flex-center" style={{ width: '2.5rem', height: '2.5rem', background: 'rgba(255,255,255,0.2)' }}>
                <Sparkles size={20} />
              </div>
              <div>
                <p className="m-0" style={{ fontWeight: 700, fontSize: '0.875rem' }}>EcoBot Assistant</p>
                <p className="m-0" style={{ fontSize: '0.75rem', opacity: 0.8 }}>Online • Ready to help</p>
              </div>
            </div>
            <button style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }} onClick={() => setChatOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <div className="chat-messages">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`message ${msg.sender === 'bot' ? 'bot-message' : 'user-message'}`}>
                {msg.text}
              </div>
            ))}
            {chatLoading && (
              <div className="message bot-message flex-center" style={{ width: '3rem' }}>
                <Loader className="animate-spin" size={16} />
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="chat-input-area">
            <input
              type="text"
              className="chat-input"
              placeholder="Ask about your reports..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
            />
            <button className="chat-send-btn" onClick={sendChatMessage}>
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
