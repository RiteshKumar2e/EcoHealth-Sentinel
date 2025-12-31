import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity, Heart, Thermometer, Droplets, AlertTriangle, CheckCircle,
  Clock, TrendingUp, User, Phone, Video, MessageSquare, FileText,
  Bell, Settings, Download, Calendar, Zap, Eye, XCircle, Send,
  Shield, Users, BarChart3, Stethoscope, Pill, ClipboardList,
  UserCheck, AlertCircle, MapPin, Mail, PhoneCall
} from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts';
import './RemoteMonitoring.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:5000';

export default function RemoteMonitoring() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [aiInsights, setAiInsights] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [historicalData, setHistoricalData] = useState([]);
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatbotTyping, setIsChatbotTyping] = useState(false);
  const [activeCall, setActiveCall] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const wsRef = useRef(null);
  const chatbotWsRef = useRef(null);

  // Update current time
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Initialize mock data
  useEffect(() => {
    setPatients([
      {
        id: 1,
        name: 'John Anderson',
        age: 45,
        gender: 'Male',
        condition: 'Type 2 Diabetes',
        status: 'stable',
        vitals: {
          heartRate: 72,
          bloodPressure: '120/80',
          temperature: 98.6,
          glucose: 110,
          oxygen: 98
        },
        location: 'Rural Health Center, Springfield',
        lastUpdate: '2 mins ago',
        nextAppointment: 'Oct 10, 2025 - 10:00 AM',
        doctor: 'Dr. Sarah Mitchell',
        alerts: [],
        medications: ['Metformin 500mg', 'Lisinopril 10mg']
      },
      {
        id: 2,
        name: 'Emma Thompson',
        age: 62,
        gender: 'Female',
        condition: 'Hypertension',
        status: 'warning',
        vitals: {
          heartRate: 88,
          bloodPressure: '145/92',
          temperature: 99.1,
          glucose: 125,
          oxygen: 96
        },
        location: 'Remote Clinic, Riverside',
        lastUpdate: '5 mins ago',
        nextAppointment: 'Oct 8, 2025 - 2:30 PM',
        doctor: 'Dr. Michael Chen',
        alerts: ['Elevated BP', 'Heart Rate Above Normal'],
        medications: ['Amlodipine 5mg', 'Aspirin 81mg']
      },
      {
        id: 3,
        name: 'Robert Martinez',
        age: 58,
        gender: 'Male',
        condition: 'Coronary Artery Disease',
        status: 'critical',
        vitals: {
          heartRate: 112,
          bloodPressure: '165/105',
          temperature: 100.4,
          glucose: 142,
          oxygen: 93
        },
        location: 'Mountain View Medical Center',
        lastUpdate: '1 min ago',
        nextAppointment: 'IMMEDIATE ATTENTION REQUIRED',
        doctor: 'Dr. Sarah Mitchell',
        alerts: ['Critical BP', 'Tachycardia', 'Fever Detected', 'Low O2 Saturation'],
        medications: ['Atorvastatin 40mg', 'Clopidogrel 75mg', 'Metoprolol 25mg']
      },
      {
        id: 4,
        name: 'Lisa Patterson',
        age: 51,
        gender: 'Female',
        condition: 'Asthma',
        status: 'stable',
        vitals: {
          heartRate: 68,
          bloodPressure: '118/75',
          temperature: 98.4,
          glucose: 95,
          oxygen: 99
        },
        location: 'Valley Healthcare Clinic',
        lastUpdate: '12 mins ago',
        nextAppointment: 'Oct 12, 2025 - 11:00 AM',
        doctor: 'Dr. James Rodriguez',
        alerts: [],
        medications: ['Albuterol Inhaler', 'Fluticasone']
      }
    ]);

    setAiInsights([
      {
        type: 'success',
        icon: CheckCircle,
        message: 'Patient John Anderson shows consistent improvement in glucose levels over the past 7 days',
        priority: 'low'
      },
      {
        type: 'warning',
        icon: AlertTriangle,
        message: 'Emma Thompson requires medication adjustment - BP readings above target for 3 consecutive days',
        priority: 'medium'
      },
      {
        type: 'critical',
        icon: AlertCircle,
        message: 'URGENT: Robert Martinez vitals indicate immediate medical attention required',
        priority: 'high'
      },
      {
        type: 'info',
        icon: Calendar,
        message: '8 patients have scheduled appointments today. 3 pending confirmations.',
        priority: 'low'
      },
      {
        type: 'info',
        icon: TrendingUp,
        message: 'Overall patient compliance rate: 94% (↑ 3% from last week)',
        priority: 'low'
      }
    ]);

    setNotifications([
      { id: 1, type: 'critical', message: 'Robert Martinez - Critical vitals detected', time: '1 min ago' },
      { id: 2, type: 'info', message: 'Appointment reminder: Emma Thompson at 2:30 PM', time: '15 mins ago' },
      { id: 3, type: 'success', message: 'Lab results available for John Anderson', time: '1 hour ago' }
    ]);

    setIsConnected(true);
  }, []);

  // WebSocket connections
  useEffect(() => {
    connectWebSocket();
    connectChatbotWebSocket();
    return () => {
      if (wsRef.current) wsRef.current.close();
      if (chatbotWsRef.current) chatbotWsRef.current.close();
    };
  }, []);

  const connectWebSocket = () => {
    try {
      const ws = new WebSocket(`${WS_URL}/patients`);
      ws.onopen = () => {
        console.log('Connected to patient monitoring system');
        setIsConnected(true);
      };
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'patients_update') setPatients(data.patients);
        else if (data.type === 'ai_insights') setAiInsights(data.insights);
        else if (data.type === 'historical_data') setHistoricalData(data.data);
      };
      ws.onerror = () => setIsConnected(false);
      ws.onclose = () => {
        setIsConnected(false);
        setTimeout(connectWebSocket, 3000);
      };
      wsRef.current = ws;
    } catch (error) {
      console.log('Using demo mode - WebSocket unavailable');
    }
  };

  const connectChatbotWebSocket = () => {
    try {
      const chatWs = new WebSocket(`${WS_URL}/chatbot`);
      chatWs.onopen = () => console.log('AI Assistant connected');
      chatWs.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setIsChatbotTyping(false);
        setChatMessages(prev => [...prev, {
          id: Date.now(),
          text: data.message,
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString()
        }]);
      };
      chatbotWsRef.current = chatWs;
    } catch (error) {
      console.log('AI Assistant in offline mode');
    }
  };

  const handleSendChatMessage = () => {
    if (chatInput.trim() === '') return;

    const userMessage = {
      id: Date.now(),
      text: chatInput,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setIsChatbotTyping(true);

    setTimeout(() => {
      setIsChatbotTyping(false);
      const responses = [
        `Based on the patient data, ${selectedPatient ? selectedPatient.name + "'s" : 'the'} current vitals are ${selectedPatient ? selectedPatient.status : 'being monitored'}. ${selectedPatient && selectedPatient.status === 'critical' ? 'Immediate intervention is recommended.' : 'Continue regular monitoring.'}`,
        `I can help you with patient management. ${selectedPatient ? `For ${selectedPatient.name}, I recommend reviewing their medication adherence and scheduling a follow-up consultation.` : 'Please select a patient for specific recommendations.'}`,
        `Healthcare AI Analysis: ${chatInput.includes('vital') || chatInput.includes('reading') ? 'Current vital signs are within acceptable parameters for stable patients. Critical cases require immediate attention.' : 'I can provide insights on patient care, medication management, and appointment scheduling.'}`
      ];
      setChatMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString()
      }]);
    }, 1500);

    if (chatbotWsRef.current && chatbotWsRef.current.readyState === WebSocket.OPEN) {
      chatbotWsRef.current.send(JSON.stringify({
        message: chatInput,
        patientContext: selectedPatient
      }));
    }

    setChatInput('');
  };

  const createGoogleMeetLink = async (patientId, patientName) => {
    try {
      const response = await fetch('http://localhost:3000/api/create-meet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId,
          patientName,
          summary: `Medical Consultation - ${patientName}`,
          startTime: new Date().toISOString(),
          endTime: new Date(Date.now() + 3600000).toISOString()
        })
      });

      const data = await response.json();
      navigator.clipboard.writeText(data.meetLink);
      alert(`✅ Video Consultation Link Created\n\nLink: ${data.meetLink}\n\nThe link has been copied to your clipboard. Share it with ${patientName}.`);
      return data.meetLink;
    } catch (error) {
      const demoLink = `https://meet.google.com/healthcare-${Date.now().toString(36)}`;
      navigator.clipboard.writeText(demoLink);
      alert(`📹 Video Consultation Link (Demo Mode)\n\nLink: ${demoLink}\n\nCopied to clipboard! Share with ${patientName} to start the consultation.`);
      return demoLink;
    }
  };

  const handleVideoCall = async (patient) => {
    const meetLink = await createGoogleMeetLink(patient.id, patient.name);
    if (meetLink) {
      window.open(meetLink, '_blank', 'width=1400,height=900');
      setActiveCall({
        patientId: patient.id,
        patientName: patient.name,
        meetLink: meetLink,
        startTime: new Date(),
        doctor: patient.doctor
      });
    }
  };

  const handleCall = (patient) => {
    alert(`📞 Initiating Voice Call\n\nPatient: ${patient.name}\nDoctor: ${patient.doctor}\n\nConnecting...`);
  };

  const handleViewDetails = (patient) => {
    setSelectedPatient(patient);
    setHistoricalData([
      { time: '00:00', heartRate: 70, bloodPressure: 120 },
      { time: '04:00', heartRate: 68, bloodPressure: 118 },
      { time: '08:00', heartRate: 75, bloodPressure: 122 },
      { time: '12:00', heartRate: patient.vitals.heartRate, bloodPressure: parseInt(patient.vitals.bloodPressure.split('/')[0]) },
      { time: '16:00', heartRate: 78, bloodPressure: 125 },
      { time: '20:00', heartRate: 72, bloodPressure: 121 },
      { time: '24:00', heartRate: 69, bloodPressure: 119 }
    ]);
  };

  const handleDownloadReport = (patient) => {
    alert(`📄 Medical Report Download\n\nGenerating comprehensive report for:\n${patient.name}\n\nReport includes:\n• Vital signs history\n• Medication list\n• Recent consultations\n• Lab results\n• AI health insights\n\nDownload starting...`);
  };

  const handleScheduleAppointment = (patient) => {
    const datetime = prompt(`📅 Schedule Appointment\n\nPatient: ${patient.name}\nDoctor: ${patient.doctor}\n\nEnter date and time (YYYY-MM-DD HH:MM):`);
    if (datetime) {
      alert(`✅ Appointment Scheduled Successfully\n\nPatient: ${patient.name}\nDate/Time: ${datetime}\nDoctor: ${patient.doctor}\n\nConfirmation sent to patient via SMS and email.`);
    }
  };

  const getVitalConfig = (label) => {
    const configs = {
      'Heart Rate': {
        icon: Heart,
        color: '#EF4444',
        bgColor: '#FEF2F2',
        borderColor: '#FEE2E2',
        unit: 'bpm',
        normalRange: '60-100'
      },
      'Blood Pressure': {
        icon: Activity,
        color: '#3B82F6',
        bgColor: '#EFF6FF',
        borderColor: '#DBEAFE',
        unit: 'mmHg',
        normalRange: '90-120 / 60-80'
      },
      'Temperature': {
        icon: Thermometer,
        color: '#F97316',
        bgColor: '#FFF7ED',
        borderColor: '#FFEDD5',
        unit: '°F',
        normalRange: '97-99'
      },
      'Glucose': {
        icon: Droplets,
        color: '#8B5CF6',
        bgColor: '#FAF5FF',
        borderColor: '#F3E8FF',
        unit: 'mg/dL',
        normalRange: '70-130'
      },
      'Oxygen': {
        icon: Activity,
        color: '#10B981',
        bgColor: '#F0FDF4',
        borderColor: '#DCFCE7',
        unit: '%',
        normalRange: '95-100'
      }
    };
    return configs[label] || configs['Heart Rate'];
  };

  const getStatusConfig = (status) => {
    const configs = {
      'critical': {
        color: '#DC2626',
        bgColor: '#FEF2F2',
        borderColor: '#FCA5A5',
        icon: AlertCircle,
        label: 'CRITICAL'
      },
      'warning': {
        color: '#D97706',
        bgColor: '#FFFBEB',
        borderColor: '#FCD34D',
        icon: AlertTriangle,
        label: 'NEEDS ATTENTION'
      },
      'stable': {
        color: '#059669',
        bgColor: '#F0FDF4',
        borderColor: '#86EFAC',
        icon: CheckCircle,
        label: 'STABLE'
      }
    };
    return configs[status] || configs['stable'];
  };

  return (
    <div className="rm-page">
      <div className="rm-container">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="card rm-header"
          style={{ marginBottom: '1.5rem' }}
        >
          <div className="header-brand">
            <div className="brand-icon-box flex-center">
              <Stethoscope style={{ width: '28px', height: '28px', color: 'white' }} />
            </div>
            <div>
              <h1 className="brand-title">Remote Patient Monitoring System</h1>
              <p className="brand-subtitle">
                Real-time healthcare monitoring • {currentTime.toLocaleTimeString()} • {currentTime.toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="header-actions">
            {/* Connection Status */}
            <motion.div
              animate={isConnected ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
              className="status-badge"
              style={{
                background: isConnected ? '#F0FDF4' : '#FEF2F2',
                border: `1px solid ${isConnected ? '#86EFAC' : '#FCA5A5'}`,
                color: isConnected ? '#059669' : '#DC2626'
              }}
            >
              <div
                className={`status-dot ${isConnected ? 'pulse-ring' : ''}`}
                style={{ background: isConnected ? '#10B981' : '#EF4444' }}
              />
              <span>{isConnected ? 'System Online' : 'Offline'}</span>
            </motion.div>

            {/* AI Assistant */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowChatbot(!showChatbot)}
              className="btn-base btn-ai"
            >
              <MessageSquare style={{ width: '16px', height: '16px' }} />
              AI Assistant
            </motion.button>

            {/* Notifications */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNotifications(!showNotifications)}
              className="btn-icon"
            >
              <Bell style={{ width: '20px', height: '20px' }} />
              {notifications.length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="notification-count flex-center"
                >
                  {notifications.length}
                </motion.span>
              )}
            </motion.button>

            {/* Settings */}
            <motion.button
              whileHover={{ scale: 1.05, rotate: 90 }}
              whileTap={{ scale: 0.95 }}
              className="btn-icon"
            >
              <Settings style={{ width: '20px', height: '20px' }} />
            </motion.button>
          </div>
        </motion.div>

        {/* AI Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="insights-section"
        >
          <div className="card">
            <h2 className="section-title">
              <BarChart3 style={{ width: '24px', height: '24px', color: '#3B82F6' }} />
              AI Health Insights & Alerts
            </h2>
            <div className="insights-grid">
              {aiInsights.map((insight, idx) => {
                const Icon = insight.icon;
                const colors = {
                  critical: { bg: '#FEF2F2', border: '#FCA5A5', text: '#DC2626' },
                  warning: { bg: '#FFFBEB', border: '#FCD34D', text: '#D97706' },
                  success: { bg: '#F0FDF4', border: '#86EFAC', text: '#059669' },
                  info: { bg: '#EFF6FF', border: '#93C5FD', text: '#2563EB' }
                };
                const color = colors[insight.type];
                return (
                  <motion.div
                    key={idx}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="insight-card"
                    style={{
                      background: color.bg,
                      border: `1px solid ${color.border}`
                    }}
                  >
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <Icon style={{ width: '20px', height: '20px', color: color.text, flexShrink: 0, marginTop: '2px' }} />
                      <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: '1.5', margin: 0 }}>
                        {insight.message}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Statistics Cards */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
          className="stats-grid"
        >
          {[
            { title: 'Total Patients', value: patients.length, icon: Users, color: '#3B82F6', bg: '#EFF6FF', change: '+12%' },
            { title: 'Stable', value: patients.filter(p => p.status === 'stable').length, icon: CheckCircle, color: '#10B981', bg: '#F0FDF4', change: '+5%' },
            { title: 'Need Attention', value: patients.filter(p => p.status === 'warning').length, icon: AlertTriangle, color: '#F59E0B', bg: '#FFFBEB', change: '-2%' },
            { title: 'Critical', value: patients.filter(p => p.status === 'critical').length, icon: AlertCircle, color: '#EF4444', bg: '#FEF2F2', change: '0%' }
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              variants={{
                hidden: { y: 20, opacity: 0 },
                visible: { y: 0, opacity: 1 }
              }}
              className="stat-card"
            >
              <div
                className="stat-bg-circle"
                style={{ background: stat.bg }}
              />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div className="stat-header">
                  <p className="stat-label">
                    {stat.title}
                  </p>
                  <div className="stat-icon-wrapper flex-center" style={{ background: stat.bg }}>
                    <stat.icon style={{ width: '20px', height: '20px', color: stat.color }} />
                  </div>
                </div>
                <div className="stat-value-row">
                  <p className="stat-value">
                    {stat.value}
                  </p>
                  <span className="stat-change" style={{
                    color: stat.change.startsWith('+') ? '#10B981' : stat.change.startsWith('-') ? '#EF4444' : '#6B7280',
                    background: stat.change.startsWith('+') ? '#F0FDF4' : stat.change.startsWith('-') ? '#FEF2F2' : '#F3F4F6'
                  }}>
                    {stat.change}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Patient Cards */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
          className="patients-grid"
        >
          {patients.map((patient) => {
            const statusConfig = getStatusConfig(patient.status);
            const StatusIcon = statusConfig.icon;

            return (
              <motion.div
                key={patient.id}
                variants={{
                  hidden: { scale: 0.95, opacity: 0 },
                  visible: { scale: 1, opacity: 1 }
                }}
                className="patient-card"
                style={{
                  border: `2px solid ${statusConfig.borderColor}`
                }}
              >
                {/* Patient Header */}
                <div className="patient-header" style={{ background: statusConfig.bgColor }}>
                  <div className="patient-title-row">
                    <div className="patient-info-left">
                      <div className="patient-name-box">
                        <h3 className="patient-name">{patient.name}</h3>
                        <div className="patient-status-badge" style={{ background: statusConfig.color }}>
                          <StatusIcon style={{ width: '12px', height: '12px' }} />
                          {statusConfig.label}
                        </div>
                      </div>
                      <div className="patient-meta-row">
                        <span>{patient.age} yrs • {patient.gender}</span>
                        <span>•</span>
                        <span style={{ fontWeight: 500 }}>{patient.condition}</span>
                      </div>
                      <div className="patient-meta-sub">
                        <Clock style={{ width: '14px', height: '14px' }} />
                        <span>Last update: {patient.lastUpdate}</span>
                      </div>
                      <div className="patient-meta-sub" style={{ marginTop: '0.25rem' }}>
                        <MapPin style={{ width: '14px', height: '14px' }} />
                        <span>{patient.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Alerts */}
                  {patient.alerts && patient.alerts.length > 0 && (
                    <div className="patient-alerts">
                      {patient.alerts.map((alert, idx) => (
                        <motion.span
                          key={idx}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          whileHover={{ scale: 1.05 }}
                          className="patient-alert-tag"
                        >
                          ⚠ {alert}
                        </motion.span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Vitals */}
                <div className="patient-content">
                  <h4 className="vitals-title">Current Vitals</h4>
                  <div className="vitals-grid">
                    {[
                      { label: 'Heart Rate', value: `${patient.vitals.heartRate} bpm` },
                      { label: 'Blood Pressure', value: patient.vitals.bloodPressure },
                      { label: 'Temperature', value: `${patient.vitals.temperature}°F` },
                      { label: 'Glucose', value: `${patient.vitals.glucose} mg/dL` },
                      { label: 'Oxygen', value: `${patient.vitals.oxygen}%` }
                    ].map((vital, idx) => {
                      const config = getVitalConfig(vital.label);
                      const VitalIcon = config.icon;
                      return (
                        <motion.div
                          key={idx}
                          whileHover={{ scale: 1.05, y: -2 }}
                          className="vital-box"
                          style={{
                            background: config.bgColor,
                            border: `1px solid ${config.borderColor}`
                          }}
                        >
                          <div className="vital-header">
                            <VitalIcon style={{ width: '16px', height: '16px', color: config.color }} />
                            <span className="vital-label">{vital.label}</span>
                          </div>
                          <p className="vital-value">{vital.value}</p>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Doctor & Appointment Info */}
                  <div className="patient-footer-info">
                    <div>
                      <div className="footer-info-label">Assigned Doctor</div>
                      <div className="footer-info-value">
                        <UserCheck style={{ width: '14px', height: '14px', display: 'inline', marginRight: '4px' }} />
                        {patient.doctor}
                      </div>
                    </div>
                    <div>
                      <div className="footer-info-label">Next Appointment</div>
                      <div className="footer-info-value">
                        <Calendar style={{ width: '14px', height: '14px', display: 'inline', marginRight: '4px' }} />
                        {patient.nextAppointment}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="patient-actions">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCall(patient)}
                    className="btn-base btn-call"
                  >
                    <Phone style={{ width: '16px', height: '16px' }} />
                    Call
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleVideoCall(patient)}
                    className="btn-base btn-video"
                  >
                    <Video style={{ width: '16px', height: '16px' }} />
                    Video
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedPatient(patient);
                      setShowChatbot(true);
                    }}
                    className="btn-base btn-chat"
                  >
                    <MessageSquare style={{ width: '16px', height: '16px' }} />
                    Chat
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleViewDetails(patient)}
                    className="btn-base btn-outline"
                  >
                    <Eye style={{ width: '16px', height: '16px' }} />
                    Details
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDownloadReport(patient)}
                    className="btn-base btn-outline"
                  >
                    <Download style={{ width: '16px', height: '16px' }} />
                    Report
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleScheduleAppointment(patient)}
                    className="btn-base btn-outline"
                  >
                    <Calendar style={{ width: '16px', height: '16px' }} />
                    Schedule
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* AI Chatbot */}
        <AnimatePresence>
          {showChatbot && (
            <motion.div
              initial={{ opacity: 0, x: 400, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 400, scale: 0.8 }}
              className="chatbot-container"
            >
              <div className="chatbot-wrapper">
                {/* Chat Header */}
                <div className="chat-header">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div className="flex-center" style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: 'rgba(255, 255, 255, 0.2)'
                      }}>
                        <MessageSquare style={{ width: '20px', height: '20px' }} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1rem', fontWeight: '700', margin: 0 }}>AI Medical Assistant</h3>
                        <p style={{ fontSize: '0.75rem', margin: 0, opacity: 0.9 }}>Online • Instant Response</p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowChatbot(false)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.2)',
                        border: 'none',
                        color: 'white',
                        cursor: 'pointer',
                        borderRadius: '8px',
                        padding: '0.5rem'
                      }}
                    >
                      <XCircle style={{ width: '20px', height: '20px' }} />
                    </motion.button>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="chat-messages no-scrollbar">
                  {chatMessages.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#9CA3AF' }}>
                      <MessageSquare style={{ width: '48px', height: '48px', margin: '0 auto 1rem', color: '#8B5CF6' }} />
                      <p style={{ fontWeight: 600, color: '#111827', marginBottom: '0.5rem' }}>AI Medical Assistant</p>
                      <p style={{ fontSize: '0.875rem' }}>Ask me anything about patient care, medication, or health insights!</p>
                    </div>
                  )}

                  {chatMessages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        display: 'flex',
                        justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                      }}
                    >
                      <div className={`chat-msg ${msg.sender === 'user' ? 'chat-msg-user' : 'chat-msg-bot'}`}>
                        <p style={{ fontSize: '0.875rem', margin: '0 0 0.5rem 0', lineHeight: '1.5' }}>{msg.text}</p>
                        <p style={{ fontSize: '0.7rem', opacity: 0.7, margin: 0 }}>{msg.timestamp}</p>
                      </div>
                    </motion.div>
                  ))}

                  {isChatbotTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{ display: 'flex', justifyContent: 'flex-start' }}
                    >
                      <div className="chat-msg chat-msg-bot">
                        <div style={{ display: 'flex', gap: '0.375rem' }}>
                          {[0, 1, 2].map((i) => (
                            <motion.span
                              key={i}
                              style={{
                                width: '8px',
                                height: '8px',
                                background: '#8B5CF6',
                                borderRadius: '50%'
                              }}
                              animate={{ y: [0, -8, 0] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Chat Input */}
                <div className="chat-input-box">
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendChatMessage()}
                      placeholder="Type your message..."
                      style={{
                        flex: 1,
                        padding: '0.75rem 1rem',
                        borderRadius: '10px',
                        border: '1px solid #E5E7EB',
                        fontSize: '0.875rem',
                        color: '#111827',
                        background: '#F9FAFB'
                      }}
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSendChatMessage}
                      className="btn-base"
                      style={{
                        padding: '0.75rem',
                        background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                        color: 'white',
                        boxShadow: '0 2px 4px rgba(139, 92, 246, 0.3)'
                      }}
                    >
                      <Send style={{ width: '20px', height: '20px' }} />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active Call Indicator */}
        <AnimatePresence>
          {activeCall && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="card"
              style={{
                position: 'fixed',
                bottom: '1.5rem',
                left: '1.5rem',
                padding: '1rem 1.5rem',
                zIndex: 999,
                maxWidth: '400px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="flex-center"
                  style={{
                    width: '48px',
                    height: '48px',
                    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                    borderRadius: '50%',
                    boxShadow: '0 4px 6px rgba(16, 185, 129, 0.3)'
                  }}
                >
                  <Video style={{ width: '24px', height: '24px', color: 'white' }} />
                </motion.div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: '700', color: '#111827', margin: '0 0 0.25rem 0' }}>Active Video Call</p>
                  <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: 0 }}>{activeCall.patientName}</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    navigator.clipboard.writeText(activeCall.meetLink);
                    alert('✅ Meeting link copied!');
                  }}
                  className="btn-base"
                  style={{ background: '#F3F4F6', border: '1px solid #E5E7EB', color: '#374151' }}
                >
                  Copy Link
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveCall(null)}
                  className="btn-base"
                  style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', color: '#DC2626' }}
                >
                  <XCircle style={{ width: '20px', height: '20px' }} />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Patient Details Modal */}
        <AnimatePresence>
          {selectedPatient && (
            <div
              className="modal-overlay flex-center"
              onClick={() => setSelectedPatient(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 50 }}
                onClick={(e) => e.stopPropagation()}
                className="modal-content"
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <h2 style={{ fontSize: '1.875rem', fontWeight: '700', color: '#111827', margin: 0 }}>
                    {selectedPatient.name} - Patient Details
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedPatient(null)}
                    style={{
                      padding: '0.5rem',
                      borderRadius: '8px',
                      background: '#FEE2E2',
                      border: '1px solid #FCA5A5',
                      color: '#DC2626',
                      cursor: 'pointer'
                    }}
                  >
                    <XCircle style={{ width: '24px', height: '24px' }} />
                  </motion.button>
                </div>

                {/* Historical Chart */}
                {historicalData.length > 0 && (
                  <div className="chart-container">
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#111827', marginBottom: '1rem' }}>
                      24-Hour Vitals Trend
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={historicalData}>
                        <defs>
                          <linearGradient id="colorHR" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="colorBP" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="time" stroke="#6B7280" style={{ fontSize: '12px' }} />
                        <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
                        <Tooltip
                          contentStyle={{
                            background: 'white',
                            border: '1px solid #E5E7EB',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="heartRate"
                          stroke="#EF4444"
                          fill="url(#colorHR)"
                          strokeWidth={2}
                        />
                        <Area
                          type="monotone"
                          dataKey="bloodPressure"
                          stroke="#3B82F6"
                          fill="url(#colorBP)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Additional Info */}
                <div className="modal-info-grid">
                  <div className="modal-info-box" style={{ background: '#EFF6FF', border: '1px solid #DBEAFE' }}>
                    <p className="footer-info-label">Location</p>
                    <p className="footer-info-value">{selectedPatient.location}</p>
                  </div>
                  <div className="modal-info-box" style={{ background: '#F0FDF4', border: '1px solid #DCFCE7' }}>
                    <p className="footer-info-label">Last Updated</p>
                    <p className="footer-info-value">{selectedPatient.lastUpdate}</p>
                  </div>
                  <div className="modal-info-box" style={{ background: '#FEF2F2', border: '1px solid #FEE2E2' }}>
                    <p className="footer-info-label">Condition</p>
                    <p className="footer-info-value">{selectedPatient.condition}</p>
                  </div>
                  <div className="modal-info-box" style={{ background: '#FAF5FF', border: '1px solid #F3E8FF' }}>
                    <p className="footer-info-label">Assigned Doctor</p>
                    <p className="footer-info-value">{selectedPatient.doctor}</p>
                  </div>
                </div>

                {/* Medications */}
                <div style={{ marginTop: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#111827', marginBottom: '1rem' }}>
                    Current Medications
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                    {selectedPatient.medications && selectedPatient.medications.map((med, idx) => (
                      <div key={idx} style={{
                        background: '#EFF6FF',
                        border: '1px solid #DBEAFE',
                        borderRadius: '8px',
                        padding: '0.5rem 1rem',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        color: '#1E40AF'
                      }}>
                        <Pill style={{ width: '14px', height: '14px', display: 'inline', marginRight: '6px' }} />
                        {med}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Security Footer */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="security-footer"
        >
          <div className="security-header">
            <Shield style={{ width: '20px', height: '20px', color: '#3B82F6' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#111827', margin: 0 }}>
              Security & Compliance
            </h3>
          </div>
          <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: 0, lineHeight: '1.6' }}>
            🔒 AES-256 End-to-End Encryption • HIPAA Compliant • SOC 2 Type II Certified • Role-Based Access Control • Real-time TLS 1.3 Secure Connections • Regular Security Audits • Encrypted Data Storage • GDPR Compliant
          </p>
        </motion.div>
      </div>
    </div>
  );
}
