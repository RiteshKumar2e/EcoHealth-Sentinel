import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle, Activity, TrendingUp, Users, Clock,
  MapPin, Zap, Shield, MessageSquare, Send, X, Download,
  RefreshCw, Filter, Bell, ChevronDown
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell, RadarChart,
  Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ScatterChart, Scatter, ComposedChart
} from 'recharts';
import './EmergencyPrediction.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:5000';

const EmergencyPrediction = () => {
  const [predictions, setPredictions] = useState([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');
  const [emergencyMetrics, setEmergencyMetrics] = useState({});
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [wsConnected, setWsConnected] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(5000);
  const [filterRisk, setFilterRisk] = useState('all');
  const [notifications, setNotifications] = useState([]);
  const [selectedPrediction, setSelectedPrediction] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [mainChartType, setMainChartType] = useState('area');
  const [showChartDropdown, setShowChartDropdown] = useState(false);
  const wsRef = useRef(null);
  const chatEndRef = useRef(null);
  const dropdownRef = useRef(null);

  // Chart Colors
  const COLORS = ['#1976D2', '#D32F2F', '#388E3C', '#F57C00', '#7B1FA2', '#00897B', '#C62828'];

  // Chart type options
  const chartTypes = [
    { value: 'area', label: 'Area Chart', icon: '📊' },
    { value: 'line', label: 'Line Chart', icon: '📈' },
    { value: 'bar', label: 'Bar Chart', icon: '📊' },
    { value: 'composed', label: 'Composed Chart', icon: '📉' },
    { value: 'scatter', label: 'Scatter Chart', icon: '⚫' },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowChartDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Actual API Fetch Function with Fallback to Simulation
  const fetchData = useCallback(async (endpoint, options = {}) => {
    try {
      const response = await fetch(`${API_BASE_URL}/emergency${endpoint}`, {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        body: options.body ? JSON.stringify(options.body) : null
      });

      if (response.ok) {
        const result = await response.json();
        return { ok: true, data: result.data || result };
      }
    } catch (error) {
      console.warn(`API call to ${endpoint} failed, using simulated data:`, error);
    }
    return { ok: false };
  }, []);

  // WebSocket Connection
  useEffect(() => {
    const connectWS = () => {
      try {
        const ws = new WebSocket(WS_URL);
        wsRef.current = ws;

        ws.onopen = () => {
          console.log('Emergency system connected to WebSocket');
          setWsConnected(true);
          addNotification('System Online', 'Connected to real-time emergency feed', 'success');
        };

        ws.onmessage = (event) => {
          const message = JSON.parse(event.data);
          if (message.type === 'metrics_update') {
            setEmergencyMetrics(message.data);
          } else if (message.type === 'new_prediction') {
            setPredictions(prev => [message.data, ...prev].slice(0, 10));
            addNotification('New AI Prediction', message.data.type, 'warning');
          }
        };

        ws.onclose = () => {
          console.log('Emergency system disconnected');
          setWsConnected(false);
          // Reconnect after 5 seconds
          setTimeout(connectWS, 5000);
        };

        ws.onerror = () => {
          setWsConnected(false);
        };
      } catch (error) {
        console.error('WebSocket connection error:', error);
      }
    };

    connectWS();
    return () => wsRef.current?.close();
  }, []);

  // Real-time data updates
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        if (!wsConnected) updateEmergencyData();
      }, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval, wsConnected]);

  const updateEmergencyData = async () => {
    const result = await fetchData('/metrics');
    if (result.ok && result.data) {
      setEmergencyMetrics(result.data);
    } else {
      // Simulation fallback
      setEmergencyMetrics(prev => ({
        currentLoad: Math.max(10, Math.min(50, (prev.currentLoad || 23) + Math.floor(Math.random() * 7) - 3)),
        predictedPeak: Math.max(30, Math.min(60, (prev.predictedPeak || 45) + Math.floor(Math.random() * 5) - 2)),
        avgResponseTime: Math.max(5, Math.min(15, parseFloat(((prev.avgResponseTime || 8.5) + (Math.random() * 2 - 1)).toFixed(1)))),
        bedAvailability: Math.max(50, Math.min(95, (prev.bedAvailability || 76) + Math.floor(Math.random() * 5) - 2))
      }));
    }
  };

  const initializeHistoricalData = async () => {
    const result = await fetchData('/historical');
    if (result.ok && result.data) {
      setHistoricalData(result.data);
    } else {
      const data = [];
      for (let i = 0; i < 24; i++) {
        data.push({
          hour: `${i.toString().padStart(2, '0')}:00`,
          actual: Math.floor(Math.random() * 30) + 10,
          predicted: Math.floor(Math.random() * 30) + 12,
          capacity: 50,
          x: i,
          y: Math.floor(Math.random() * 30) + 10,
        });
      }
      setHistoricalData(data);
    }
  };

  const runEmergencyPredictions = async () => {
    const result = await fetchData('/predictions');
    if (result.ok && result.data) {
      setPredictions(result.data);
    } else {
      const aiPredictions = [
        {
          id: 1,
          type: 'Cardiac Emergency',
          riskLevel: 'High',
          probability: Math.floor(Math.random() * 20) + 70,
          timeframe: '4-6 hours',
          factors: ['Chest pain pattern', 'Age demographics', 'Historical data', 'Weather conditions'],
          recommendedAction: 'Increase cardiology staff by 2, prepare cath lab',
          confidence: 92,
          affectedArea: 'Downtown District',
          estimatedCases: '8-12 patients'
        },
        {
          id: 2,
          type: 'Respiratory Distress',
          riskLevel: 'Medium',
          probability: Math.floor(Math.random() * 20) + 55,
          timeframe: '6-12 hours',
          factors: ['Air quality index', 'Seasonal patterns', 'COVID-19 trends'],
          recommendedAction: 'Stock respiratory supplies, alert pulmonology team',
          confidence: 87,
          affectedArea: 'Industrial Zone',
          estimatedCases: '12-18 patients'
        },
        {
          id: 3,
          type: 'Trauma Cases',
          riskLevel: 'Medium',
          probability: Math.floor(Math.random() * 20) + 50,
          timeframe: '12-24 hours',
          factors: ['Traffic patterns', 'Weekend activity', 'Sports events'],
          recommendedAction: 'Ensure trauma bay readiness, orthopedic on-call',
          confidence: 84,
          affectedArea: 'Highway Corridor',
          estimatedCases: '5-8 patients'
        },
        {
          id: 4,
          type: 'Stroke Cases',
          riskLevel: 'Low',
          probability: Math.floor(Math.random() * 20) + 35,
          timeframe: '24-48 hours',
          factors: ['Temperature changes', 'Senior population distribution'],
          recommendedAction: 'Maintain standard stroke protocol readiness',
          confidence: 79,
          affectedArea: 'Residential Areas',
          estimatedCases: '3-5 patients'
        }
      ];

      setPredictions(aiPredictions);
    }

    if (!emergencyMetrics.currentLoad) {
      setEmergencyMetrics({
        currentLoad: 23,
        predictedPeak: 45,
        avgResponseTime: 8.5,
        bedAvailability: 76
      });
    }
  };

  const addNotification = (title, message, priority) => {
    const newNotification = {
      id: Date.now(),
      title,
      message,
      priority,
      timestamp: new Date()
    };
    setNotifications(prev => [newNotification, ...prev].slice(0, 5));
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const responses = [
        `Based on current data, ${emergencyMetrics.currentLoad} patients are in ED with ${emergencyMetrics.bedAvailability}% bed availability.`,
        `The AI model predicts peak load of ${emergencyMetrics.predictedPeak} patients in the next 12 hours.`,
        `Average response time is currently ${emergencyMetrics.avgResponseTime} minutes, which is ${emergencyMetrics.avgResponseTime < 10 ? 'within' : 'above'} target range.`,
        `High-risk cardiac emergencies are predicted with ${predictions[0]?.probability}% probability. Recommend increasing cardiology staff.`,
        `All resource utilization metrics are being monitored. Current system performance is optimal.`
      ];

      const botMessage = {
        id: Date.now(),
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: 'bot',
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleExportData = () => {
    const data = {
      predictions,
      metrics: emergencyMetrics,
      timestamp: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `emergency-predictions-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    addNotification('Export Complete', 'Data exported successfully', 'info');
  };

  const handleRefresh = () => {
    runEmergencyPredictions();
    updateEmergencyData();
    addNotification('Data Refreshed', 'All predictions and metrics updated', 'info');
  };

  const filteredPredictions = predictions.filter(p =>
    filterRisk === 'all' || p.riskLevel.toLowerCase() === filterRisk
  );

  const getRiskClass = (level) => {
    switch (level) {
      case 'High': return 'high';
      case 'Medium': return 'medium';
      case 'Low': return 'low';
      default: return '';
    }
  };

  const getPerformanceStatClass = (index) => {
    const classes = ['green', 'blue', 'purple', 'orange'];
    return classes[index % 4];
  };

  const emergencyTrendData = historicalData.length > 0 ? historicalData : [
    { hour: '00:00', actual: 12, predicted: 11, capacity: 50, x: 0, y: 12 },
    { hour: '03:00', actual: 8, predicted: 9, capacity: 50, x: 3, y: 8 },
    { hour: '06:00', actual: 15, predicted: 14, capacity: 50, x: 6, y: 15 },
    { hour: '09:00', actual: 25, predicted: 27, capacity: 50, x: 9, y: 25 },
    { hour: '12:00', actual: 32, predicted: 30, capacity: 50, x: 12, y: 32 },
    { hour: '15:00', actual: 28, predicted: 29, capacity: 50, x: 15, y: 28 },
    { hour: '18:00', actual: 35, predicted: 38, capacity: 50, x: 18, y: 35 },
    { hour: '21:00', actual: 22, predicted: 23, capacity: 50, x: 21, y: 22 },
  ];

  const categoryData = [
    { category: 'Cardiac', current: 8, predicted: 12 },
    { category: 'Trauma', current: 6, predicted: 8 },
    { category: 'Respiratory', current: 5, predicted: 9 },
    { category: 'Neurological', current: 3, predicted: 5 },
    { category: 'Other', current: 4, predicted: 6 }
  ];

  const pieChartData = [
    { name: 'Cardiac', value: 8 },
    { name: 'Trauma', value: 6 },
    { name: 'Respiratory', value: 5 },
    { name: 'Neurological', value: 3 },
    { name: 'Other', value: 4 }
  ];

  const radarData = [
    { subject: 'Cardiac', A: 92, B: 78, fullMark: 100 },
    { subject: 'Respiratory', A: 87, B: 65, fullMark: 100 },
    { subject: 'Trauma', A: 84, B: 58, fullMark: 100 },
    { subject: 'Neurological', A: 79, B: 42, fullMark: 100 },
    { subject: 'Other', A: 85, B: 55, fullMark: 100 },
  ];

  const resourceData = [
    { resource: 'ER Beds', current: 65, predicted: 82, capacity: 100 },
    { resource: 'ICU Beds', current: 78, predicted: 88, capacity: 100 },
    { resource: 'Ventilators', current: 45, predicted: 62, capacity: 100 },
    { resource: 'Physicians', current: 70, predicted: 85, capacity: 100 },
    { resource: 'Nurses', current: 72, predicted: 90, capacity: 100 }
  ];

  // Render chart based on selected type
  const renderMainChart = () => {
    const commonProps = {
      data: emergencyTrendData,
    };

    switch (mainChartType) {
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="colorCapacity" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9E9E9E" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#9E9E9E" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1976D2" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#1976D2" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D32F2F" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#D32F2F" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
            <XAxis dataKey="hour" stroke="#757575" />
            <YAxis stroke="#757575" />
            <Tooltip contentStyle={{ background: 'white', border: '1px solid #E0E0E0', borderRadius: '8px' }} />
            <Legend />
            <Area type="monotone" dataKey="capacity" stroke="#9E9E9E" fill="url(#colorCapacity)" name="Capacity" />
            <Area type="monotone" dataKey="actual" stroke="#1976D2" fill="url(#colorActual)" name="Actual" />
            <Area type="monotone" dataKey="predicted" stroke="#D32F2F" fill="url(#colorPredicted)" strokeDasharray="5 5" name="AI Predicted" />
          </AreaChart>
        );

      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
            <XAxis dataKey="hour" stroke="#757575" />
            <YAxis stroke="#757575" />
            <Tooltip contentStyle={{ background: 'white', border: '1px solid #E0E0E0', borderRadius: '8px' }} />
            <Legend />
            <Line type="monotone" dataKey="capacity" stroke="#9E9E9E" strokeWidth={2} name="Capacity" />
            <Line type="monotone" dataKey="actual" stroke="#1976D2" strokeWidth={3} name="Actual" />
            <Line type="monotone" dataKey="predicted" stroke="#D32F2F" strokeWidth={3} strokeDasharray="5 5" name="AI Predicted" />
          </LineChart>
        );

      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
            <XAxis dataKey="hour" stroke="#757575" />
            <YAxis stroke="#757575" />
            <Tooltip contentStyle={{ background: 'white', border: '1px solid #E0E0E0', borderRadius: '8px' }} />
            <Legend />
            <Bar dataKey="capacity" fill="#9E9E9E" name="Capacity" radius={[8, 8, 0, 0]} />
            <Bar dataKey="actual" fill="#1976D2" name="Actual" radius={[8, 8, 0, 0]} />
            <Bar dataKey="predicted" fill="#D32F2F" name="AI Predicted" radius={[8, 8, 0, 0]} />
          </BarChart>
        );

      case 'composed':
        return (
          <ComposedChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
            <XAxis dataKey="hour" stroke="#757575" />
            <YAxis stroke="#757575" />
            <Tooltip contentStyle={{ background: 'white', border: '1px solid #E0E0E0', borderRadius: '8px' }} />
            <Legend />
            <Area type="monotone" dataKey="capacity" fill="#F5F5F5" stroke="#9E9E9E" name="Capacity" />
            <Bar dataKey="actual" fill="#1976D2" name="Actual" radius={[8, 8, 0, 0]} />
            <Line type="monotone" dataKey="predicted" stroke="#D32F2F" strokeWidth={3} name="AI Predicted" />
          </ComposedChart>
        );

      case 'scatter':
        return (
          <ScatterChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
            <XAxis type="number" dataKey="x" name="Hour" stroke="#757575" />
            <YAxis type="number" dataKey="y" name="Patients" stroke="#757575" />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ background: 'white', border: '1px solid #E0E0E0', borderRadius: '8px' }} />
            <Legend />
            <Scatter name="Actual Load" data={emergencyTrendData} fill="#1976D2" />
            <Scatter name="Predicted Load" data={emergencyTrendData.map(d => ({ ...d, y: d.predicted }))} fill="#D32F2F" />
          </ScatterChart>
        );

      default:
        return null;
    }
  };

  return (
    <div className="emergency-dashboard">
      {/* Notifications Panel */}
      <AnimatePresence>
        {notifications.length > 0 && (
          <motion.div
            className="emergency-notification-panel"
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
          >
            {notifications.map(notif => (
              <motion.div
                key={notif.id}
                className="emergency-notification-item"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <Bell style={{ width: '20px', height: '20px', color: '#1976D2', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: '600', color: '#212121', marginBottom: '0.25rem' }}>
                      {notif.title}
                    </p>
                    <p style={{ fontSize: '0.85rem', color: '#757575' }}>
                      {notif.message}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: '#9E9E9E', marginTop: '0.5rem' }}>
                      {notif.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                  <motion.button
                    onClick={() => setNotifications(prev => prev.filter(n => n.id !== notif.id))}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#757575' }}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X style={{ width: '16px', height: '16px' }} />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="emergency-container">
        {/* Header */}
        <motion.div
          className="emergency-glass-card emergency-header-card"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="emergency-header-content">
            <div className="emergency-header-left">
              <motion.div
                className="emergency-icon-3d"
                animate={{
                  rotateY: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <AlertTriangle style={{ width: '32px', height: '32px', color: 'white' }} />
              </motion.div>
              <div>
                <h1 className="emergency-gradient-text">Emergency Prediction System</h1>
                <p className="emergency-subtitle">AI-powered forecasting for emergency department optimization</p>
              </div>
            </div>
            <div className="emergency-header-right">
              <div className="emergency-connection-status">
                <motion.div
                  className="emergency-status-dot"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span>Live</span>
              </div>

              <motion.button
                onClick={handleRefresh}
                className="emergency-toolbar-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Refresh Data"
              >
                <RefreshCw style={{ width: '20px', height: '20px', color: '#424242' }} />
              </motion.button>

              <motion.button
                onClick={handleExportData}
                className="emergency-toolbar-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Export Data"
              >
                <Download style={{ width: '20px', height: '20px', color: '#424242' }} />
              </motion.button>

              <div className="emergency-timeframe-buttons">
                {['24h', '48h', '7d'].map((timeframe) => (
                  <motion.button
                    key={timeframe}
                    onClick={() => setSelectedTimeframe(timeframe)}
                    className={`emergency-timeframe-btn ${selectedTimeframe === timeframe ? 'active' : ''}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {timeframe}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          <div className="emergency-feature-badges">
            {['Real-Time Forecasting', 'Resource Optimization', 'Risk Assessment', 'Pattern Recognition'].map((feature, index) => (
              <motion.span
                key={feature}
                className="emergency-badge"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                ✓ {feature}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Filter Section */}
        <motion.div
          className="emergency-filter-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Filter style={{ width: '20px', height: '20px', color: '#757575' }} />
          <span style={{ fontWeight: '600', color: '#424242' }}>Filter by Risk:</span>
          {['all', 'high', 'medium', 'low'].map((risk) => (
            <motion.button
              key={risk}
              onClick={() => setFilterRisk(risk)}
              className={`emergency-filter-button ${filterRisk === risk ? 'active' : ''}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {risk.charAt(0).toUpperCase() + risk.slice(1)}
            </motion.button>
          ))}
        </motion.div>

        {/* Metrics Cards */}
        <div className="emergency-metrics-grid">
          {[
            { icon: Users, label: 'Current Load', value: emergencyMetrics.currentLoad, unit: '', color: '#1976D2', detail: 'Patients in ED', trend: 'up' },
            { icon: TrendingUp, label: 'Predicted Peak', value: emergencyMetrics.predictedPeak, unit: '', color: '#D32F2F', detail: 'Next 12 hours', trend: 'up' },
            { icon: Clock, label: 'Avg Response', value: emergencyMetrics.avgResponseTime, unit: 'm', color: '#388E3C', detail: 'Response time', trend: 'down' },
            { icon: Activity, label: 'Bed Availability', value: emergencyMetrics.bedAvailability, unit: '%', color: '#7B1FA2', detail: 'Current capacity', trend: 'down' }
          ].map((metric, index) => (
            <motion.div
              key={metric.label}
              className="emergency-glass-card emergency-metric-card"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                className={`emergency-metric-trend ${metric.trend === 'up' ? 'emergency-trend-up' : 'emergency-trend-down'}`}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {metric.trend === 'up' ? '↑' : '↓'}
              </motion.div>
              <div>
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 1
                  }}
                >
                  <metric.icon className="emergency-metric-icon" style={{ color: metric.color }} />
                </motion.div>
              </div>
              <div className="emergency-metric-content">
                <p className="emergency-metric-label">{metric.label}</p>
                <motion.p
                  className="emergency-metric-value"
                  style={{ color: metric.color }}
                  key={metric.value}
                  initial={{ scale: 1.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  {metric.value}{metric.unit}
                </motion.p>
                <p className="emergency-metric-detail">{metric.detail}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* AI Predictions */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <div className="emergency-section-title">
            <div className="emergency-section-title-left">
              <Zap className="emergency-section-icon" style={{ color: '#F57C00' }} />
              <span>AI Emergency Predictions</span>
            </div>
            <div className="emergency-section-actions">
              <motion.button
                onClick={handleRefresh}
                className="emergency-icon-button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <RefreshCw style={{ width: '18px', height: '18px', color: '#424242' }} />
              </motion.button>
            </div>
          </div>
          <div className="emergency-predictions-grid">
            {filteredPredictions.map((prediction, index) => (
              <motion.div
                key={prediction.id}
                className={`emergency-glass-card emergency-prediction-card ${getRiskClass(prediction.riskLevel)} ${selectedPrediction === prediction.id ? 'selected' : ''}`}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedPrediction(selectedPrediction === prediction.id ? null : prediction.id)}
              >
                <div className="emergency-prediction-header">
                  <div>
                    <h3 className="emergency-prediction-title">{prediction.type}</h3>
                    <div className="emergency-prediction-badges">
                      <span className={`emergency-risk-badge ${getRiskClass(prediction.riskLevel)}`}>
                        {prediction.riskLevel} Risk
                      </span>
                      <span className="emergency-risk-badge emergency-confidence-badge">
                        Confidence: {prediction.confidence}%
                      </span>
                    </div>
                  </div>
                  <div className="emergency-probability-display">
                    <motion.div
                      className="emergency-probability-circle"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.15 + 0.3, type: 'spring' }}
                    >
                      <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
                        <circle cx="50" cy="50" r="45" fill="none" stroke="#E0E0E0" strokeWidth="8" />
                        <motion.circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke={prediction.riskLevel === 'High' ? '#D32F2F' : prediction.riskLevel === 'Medium' ? '#F57C00' : '#388E3C'}
                          strokeWidth="8"
                          strokeDasharray={`${prediction.probability * 2.83} 283`}
                          strokeLinecap="round"
                          initial={{ strokeDasharray: '0 283' }}
                          animate={{ strokeDasharray: `${prediction.probability * 2.83} 283` }}
                          transition={{ duration: 1.5, delay: index * 0.15 + 0.5 }}
                          transform="rotate(-90 50 50)"
                        />
                      </svg>
                      <span className="emergency-probability-text">{prediction.probability}%</span>
                    </motion.div>
                  </div>
                </div>

                <div className="emergency-prediction-details">
                  <div className="emergency-detail-item">
                    <Clock className="emergency-detail-icon" />
                    <div>
                      <p className="emergency-detail-label">Timeframe</p>
                      <p className="emergency-detail-value">{prediction.timeframe}</p>
                    </div>
                  </div>
                  <div className="emergency-detail-item">
                    <MapPin className="emergency-detail-icon" />
                    <div>
                      <p className="emergency-detail-label">Affected Area</p>
                      <p className="emergency-detail-value">{prediction.affectedArea}</p>
                    </div>
                  </div>
                  <div className="emergency-detail-item">
                    <Users className="emergency-detail-icon" />
                    <div>
                      <p className="emergency-detail-label">Estimated Cases</p>
                      <p className="emergency-detail-value">{prediction.estimatedCases}</p>
                    </div>
                  </div>
                </div>

                <div className="emergency-factors-section">
                  <p className="emergency-factors-label">Key Factors</p>
                  <div className="emergency-factors-tags">
                    {prediction.factors.map((factor, idx) => (
                      <motion.span
                        key={idx}
                        className="emergency-factor-tag"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.15 + 0.1 * idx }}
                      >
                        {factor}
                      </motion.span>
                    ))}
                  </div>
                </div>

                <div className="emergency-action-box">
                  <p className="emergency-action-label">Recommended Action:</p>
                  <p className="emergency-action-text">{prediction.recommendedAction}</p>
                  <div className="emergency-action-buttons">
                    <motion.button
                      className="emergency-action-button"
                      whileHover={{ background: '#1976D2', color: 'white' }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        addNotification('Action Initiated', `Protocol activated for ${prediction.type}`, 'info');
                      }}
                    >
                      Execute
                    </motion.button>
                    <motion.button
                      className="emergency-action-button"
                      whileHover={{ background: '#1976D2', color: 'white' }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        addNotification('Alert Sent', `Team notified about ${prediction.type}`, 'info');
                      }}
                    >
                      Notify Team
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Main Chart with Dropdown */}
        <motion.div
          className="emergency-glass-card emergency-chart-card"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="emergency-section-title">
            <div className="emergency-section-title-left">
              <span>Emergency Department Load Forecast</span>
            </div>
            <div className="emergency-section-actions" ref={dropdownRef}>
              <div className="emergency-dropdown-container">
                <motion.button
                  onClick={() => setShowChartDropdown(!showChartDropdown)}
                  className="emergency-dropdown-button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>{chartTypes.find(ct => ct.value === mainChartType)?.icon}</span>
                  <span>{chartTypes.find(ct => ct.value === mainChartType)?.label}</span>
                  <ChevronDown style={{ width: '16px', height: '16px' }} />
                </motion.button>

                <AnimatePresence>
                  {showChartDropdown && (
                    <motion.div
                      className="emergency-dropdown-menu"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {chartTypes.map((type) => (
                        <motion.div
                          key={type.value}
                          className={`emergency-dropdown-item ${mainChartType === type.value ? 'active' : ''}`}
                          onClick={() => {
                            setMainChartType(type.value);
                            setShowChartDropdown(false);
                          }}
                          whileHover={{ background: '#F5F5F5' }}
                        >
                          <span style={{ marginRight: '0.5rem' }}>{type.icon}</span>
                          {type.label}
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            {renderMainChart()}
          </ResponsiveContainer>
          <div className="emergency-alert-box">
            <AlertTriangle className="emergency-alert-icon" />
            <span><strong>Peak Alert:</strong> AI predicts capacity threshold (90%) will be reached at 18:00. Recommend staff augmentation.</span>
          </div>
        </motion.div>

        {/* Additional Charts Grid */}
        <div className="emergency-charts-grid">
          {/* Pie Chart */}
          <motion.div
            className="emergency-glass-card emergency-chart-card"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <h2 className="emergency-section-title-left" style={{ marginBottom: '1.5rem' }}>
              Emergency Distribution (Pie Chart)
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Radar Chart */}
          <motion.div
            className="emergency-glass-card emergency-chart-card"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <h2 className="emergency-section-title-left" style={{ marginBottom: '1.5rem' }}>
              Risk Assessment (Radar Chart)
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#E0E0E0" />
                <PolarAngleAxis dataKey="subject" stroke="#757575" />
                <PolarRadiusAxis stroke="#757575" />
                <Radar name="Confidence %" dataKey="A" stroke="#1976D2" fill="#1976D2" fillOpacity={0.6} />
                <Radar name="Probability %" dataKey="B" stroke="#D32F2F" fill="#D32F2F" fillOpacity={0.6} />
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Bar Chart */}
          <motion.div
            className="emergency-glass-card emergency-chart-card"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            <h2 className="emergency-section-title-left" style={{ marginBottom: '1.5rem' }}>
              Category Distribution (Bar Chart)
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                <XAxis dataKey="category" stroke="#757575" />
                <YAxis stroke="#757575" />
                <Tooltip contentStyle={{ background: 'white', border: '1px solid #E0E0E0', borderRadius: '8px' }} />
                <Legend />
                <Bar dataKey="current" fill="#1976D2" name="Current" radius={[8, 8, 0, 0]} />
                <Bar dataKey="predicted" fill="#D32F2F" name="Predicted" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Resource Utilization */}
          <motion.div
            className="emergency-glass-card emergency-chart-card"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            <h2 className="emergency-section-title-left" style={{ marginBottom: '1.5rem' }}>
              Resource Utilization Forecast
            </h2>
            <div className="emergency-resource-list">
              {resourceData.map((resource, index) => (
                <motion.div
                  key={index}
                  className="emergency-resource-item"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                >
                  <div className="emergency-resource-header">
                    <span className="emergency-resource-name">{resource.resource}</span>
                    <div className="emergency-resource-values">
                      <span className="emergency-current-value">Now: {resource.current}%</span>
                      <span className="emergency-predicted-value">Predicted: {resource.predicted}%</span>
                    </div>
                  </div>
                  <div className="emergency-resource-bar">
                    <motion.div
                      className="emergency-bar-current"
                      style={{ width: `${resource.current}%` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${resource.current}%` }}
                      transition={{ duration: 1, delay: 0.8 + index * 0.1 }}
                    />
                    <motion.div
                      className="emergency-bar-predicted"
                      style={{ width: `${resource.predicted}%` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${resource.predicted}%` }}
                      transition={{ duration: 1, delay: 1 + index * 0.1 }}
                    />
                    {resource.predicted > 85 && (
                      <motion.div
                        className="emergency-alert-indicator"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1.5 + index * 0.1 }}
                      >
                        <AlertTriangle className="emergency-alert-icon-small" />
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="emergency-alert-box warning">
              <p>⚠️ <strong>Resource Alert:</strong> ICU beds and nursing staff predicted to exceed 85% utilization.</p>
            </div>
          </motion.div>
        </div>

        {/* Performance */}
        <motion.div
          className="emergency-glass-card emergency-performance-card"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <Shield className="emergency-section-icon" style={{ color: '#388E3C' }} />
            <h2 style={{ fontSize: '2rem', fontWeight: '700', color: '#212121' }}>
              AI Model Performance & Accuracy
            </h2>
          </div>
          <div className="emergency-performance-grid">
            {[
              { label: 'Overall Accuracy', value: '91.3%', detail: 'Last 30 days' },
              { label: 'Peak Prediction', value: '88.7%', detail: '±15 min accuracy' },
              { label: 'Volume Forecast', value: '93.2%', detail: '±2 patients' },
              { label: 'False Positives', value: '4.2%', detail: 'Alert rate' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className={`emergency-performance-stat ${getPerformanceStatClass(index)}`}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + index * 0.1, type: 'spring' }}
                whileHover={{ scale: 1.05 }}
              >
                <p className="emergency-stat-label">{stat.label}</p>
                <motion.p
                  className="emergency-stat-value"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1 + index * 0.1 }}
                >
                  {stat.value}
                </motion.p>
                <p className="emergency-stat-detail">{stat.detail}</p>
              </motion.div>
            ))}
          </div>
          <div className="emergency-model-info">
            <p><strong>Model Training:</strong> Continuously learning from 500K+ historical emergency cases, weather patterns, traffic data, demographic trends, and seasonal variations. Last updated: 2 hours ago.</p>
          </div>
        </motion.div>
      </div>

      {/* Chatbot */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            className="emergency-chatbot-container"
            initial={{ opacity: 0, scale: 0.8, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 100 }}
            transition={{ type: 'spring', damping: 25 }}
          >
            <div className="emergency-chatbot-header">
              <div className="emergency-chatbot-title">
                <MessageSquare className="emergency-chatbot-icon" />
                <span>AI Emergency Assistant</span>
              </div>
              <motion.button
                className="emergency-chatbot-close"
                onClick={() => setChatOpen(false)}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X />
              </motion.button>
            </div>

            <div className="emergency-chatbot-messages">
              {chatMessages.length === 0 && (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#757575' }}>
                  <MessageSquare style={{ width: '48px', height: '48px', margin: '0 auto 1rem', color: '#BDBDBD' }} />
                  <p>Ask me about emergency predictions or resources!</p>
                </div>
              )}
              <AnimatePresence>
                {chatMessages.map((message) => (
                  <motion.div
                    key={message.id}
                    className={message.sender === 'user' ? "emergency-message-user" : "emergency-message-bot"}
                    initial={{ opacity: 0, x: message.sender === 'user' ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <p style={{ margin: 0, lineHeight: 1.5 }}>{message.text}</p>
                    <span className="emergency-message-time">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isTyping && (
                <motion.div
                  className="emergency-typing-dc"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <span className="emergency-typing-dot"></span>
                  <span className="emergency-typing-dot" style={{ animationDelay: '0.2s' }}></span>
                  <span className="emergency-typing-dot" style={{ animationDelay: '0.4s' }}></span>
                </motion.div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="emergency-chatbot-input">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about predictions, resources..."
                className="emergency-chat-input-field"
              />
              <motion.button
                onClick={handleSendMessage}
                className="emergency-chat-send-btn"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                disabled={!inputMessage.trim()}
              >
                <Send />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!chatOpen && (
        <motion.button
          className="emergency-chatbot-toggle"
          onClick={() => setChatOpen(true)}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <MessageSquare style={{ width: '28px', height: '28px' }} />
          <motion.span
            className="emergency-notification-dot"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.button>
      )}
    </div>
  );
};

export default EmergencyPrediction;
