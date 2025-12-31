import React, { useState, useEffect } from 'react';
import { AlertTriangle, CloudRain, Wind, Waves, Thermometer, MapPin, Shield, Clock, Download, RefreshCw, Share2, Bell, Activity, Users, Maximize2, Minimize2, Radio, Satellite, Zap, AlertCircle, CheckCircle, TrendingUp, BarChart3, Eye, EyeOff } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

import { envService } from '../../services/api';
import './DisasterPrediction.css';

export default function DisasterPrediction() {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [showGraphs, setShowGraphs] = useState(false);
  const [activeDisasters, setActiveDisasters] = useState([]);
  const [preparednessChecklist, setPreparednessChecklist] = useState([]);
  const [earlyWarningSystem, setEarlyWarningSystem] = useState({});
  const [vulnerabilityAreas, setVulnerabilityAreas] = useState([]);
  const [responseTeams, setResponseTeams] = useState([]);
  const [aiPredictions, setAiPredictions] = useState([]);

  // Graph data
  const [floodHistoryData, setFloodHistoryData] = useState([]);
  const [temperatureTrendData, setTemperatureTrendData] = useState([]);
  const [rainfallPatternData, setRainfallPatternData] = useState([]);
  const [disasterFrequencyData, setDisasterFrequencyData] = useState([]);
  const [riskAssessmentData, setRiskAssessmentData] = useState([]);
  const [evacuationReadinessData, setEvacuationReadinessData] = useState([]);
  const [seasonalTrendsData, setSeasonalTrendsData] = useState([]);
  const [impactAnalysisData, setImpactAnalysisData] = useState([]);
  const [responseTimeData, setResponseTimeData] = useState([]);

  const API_BASE_URL = 'http://localhost:5000/api';

  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, 300000);
    return () => clearInterval(interval);
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchDisasterPredictions(),
        fetchEarlyWarningStatus(),
        fetchVulnerabilityData(),
        fetchResponseTeams()
      ]);
      if (showGraphs) {
        await fetchGraphData();
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      loadFallbackData();
    } finally {
      setLoading(false);
    }
  };

  const fetchGraphData = async () => {
    try {
      const response = await envService.getDisasterTrends();
      if (response.data) {
        const data = response.data;
        setFloodHistoryData(data.floodHistory || []);
        setTemperatureTrendData(data.temperatureTrend || []);
        setRainfallPatternData(data.rainfallPattern || []);
        setDisasterFrequencyData(data.disasterFrequency || []);
        setRiskAssessmentData(data.riskAssessment || []);
        setEvacuationReadinessData(data.evacuationReadiness || []);
        setSeasonalTrendsData(data.seasonalTrends || []);
        setImpactAnalysisData(data.impactAnalysis || []);
        setResponseTimeData(data.responseTime || []);
      } else {
        loadGraphFallbackData();
      }
    } catch (error) {
      loadGraphFallbackData();
    }
  };

  const loadGraphFallbackData = () => {
    setFloodHistoryData([
      { year: '2020', actual: 5, predicted: null, severity: 3.2 },
      { year: '2021', actual: 7, predicted: null, severity: 4.1 },
      { year: '2022', actual: 6, predicted: null, severity: 3.8 },
      { year: '2023', actual: 9, predicted: null, severity: 5.2 },
      { year: '2024', actual: 8, predicted: null, severity: 4.7 },
      { year: '2025', actual: null, predicted: 10, severity: 5.8 },
      { year: '2026', actual: null, predicted: 12, severity: 6.5 },
      { year: '2027', actual: null, predicted: 11, severity: 6.2 },
      { year: '2028', actual: null, predicted: 14, severity: 7.1 }
    ]);

    setTemperatureTrendData([
      { month: 'Jan', historical: 16.2, current: 16.8, predicted: 17.2 },
      { month: 'Feb', historical: 18.5, current: 19.1, predicted: 19.8 },
      { month: 'Mar', historical: 23.2, current: 24.1, predicted: 25.0 },
      { month: 'Apr', historical: 28.5, current: 29.5, predicted: 30.8 },
      { month: 'May', historical: 31.2, current: 32.5, predicted: 34.0 },
      { month: 'Jun', historical: 30.8, current: 32.0, predicted: 33.5 },
      { month: 'Jul', historical: 29.5, current: null, predicted: 31.2 },
      { month: 'Aug', historical: 29.8, current: null, predicted: 31.5 },
      { month: 'Sep', historical: 28.5, current: null, predicted: 30.2 },
      { month: 'Oct', historical: 25.2, current: 26.0, predicted: 26.8 },
      { month: 'Nov', historical: 20.8, current: null, predicted: 22.0 },
      { month: 'Dec', historical: 17.5, current: null, predicted: 18.5 }
    ]);

    setRainfallPatternData([
      { month: 'Jan', historical: 15, predicted: 12 },
      { month: 'Feb', historical: 18, predicted: 15 },
      { month: 'Mar', historical: 22, predicted: 20 },
      { month: 'Apr', historical: 28, predicted: 32 },
      { month: 'May', historical: 65, predicted: 58 },
      { month: 'Jun', historical: 220, predicted: 245 },
      { month: 'Jul', historical: 310, predicted: 335 },
      { month: 'Aug', historical: 285, predicted: 295 },
      { month: 'Sep', historical: 240, predicted: 225 },
      { month: 'Oct', historical: 92, predicted: 85 },
      { month: 'Nov', historical: 25, predicted: 22 },
      { month: 'Dec', historical: 12, predicted: 10 }
    ]);

    setDisasterFrequencyData([
      { year: '2020', floods: 5, heatwaves: 2, storms: 3, droughts: 1 },
      { year: '2021', floods: 7, heatwaves: 3, storms: 4, droughts: 1 },
      { year: '2022', floods: 6, heatwaves: 4, storms: 3, droughts: 2 },
      { year: '2023', floods: 9, heatwaves: 5, storms: 5, droughts: 2 },
      { year: '2024', floods: 8, heatwaves: 4, storms: 4, droughts: 3 },
      { year: '2025', floods: 10, heatwaves: 6, storms: 6, droughts: 3 },
      { year: '2026', floods: 12, heatwaves: 7, storms: 7, droughts: 4 },
      { year: '2027', floods: 11, heatwaves: 8, storms: 6, droughts: 4 },
      { year: '2028', floods: 14, heatwaves: 9, storms: 8, droughts: 5 }
    ]);

    setRiskAssessmentData([
      { area: 'Riverside', flood: 85, heat: 45, storm: 60, drought: 30 },
      { area: 'Urban', flood: 65, heat: 75, storm: 55, drought: 40 },
      { area: 'Agricultural', flood: 70, heat: 80, storm: 50, drought: 85 },
      { area: 'Highland', flood: 25, heat: 60, storm: 40, drought: 35 },
      { area: 'Coastal', flood: 55, heat: 55, storm: 85, drought: 25 }
    ]);

    setEvacuationReadinessData([
      { district: 'Darbhanga', readiness: 85, capacity: 12000, drills: 8 },
      { district: 'Muzaffarpur', readiness: 78, capacity: 15000, drills: 6 },
      { district: 'Patna', readiness: 92, capacity: 25000, drills: 12 },
      { district: 'Gaya', readiness: 72, capacity: 10000, drills: 5 },
      { district: 'Bhagalpur', readiness: 68, capacity: 8000, drills: 4 },
      { district: 'Purnia', readiness: 75, capacity: 9500, drills: 7 }
    ]);

    setSeasonalTrendsData([
      { season: 'Winter', floods: 10, heatwaves: 5, storms: 15, droughts: 20 },
      { season: 'Spring', floods: 25, heatwaves: 20, storms: 30, droughts: 15 },
      { season: 'Summer', floods: 15, heatwaves: 85, storms: 40, droughts: 70 },
      { season: 'Monsoon', floods: 90, heatwaves: 10, storms: 75, droughts: 5 },
      { season: 'Autumn', floods: 35, heatwaves: 30, storms: 25, droughts: 25 }
    ]);

    setImpactAnalysisData([
      { year: '2020', economic: 2.5, infrastructure: 1.8, agriculture: 3.2, lives: 125 },
      { year: '2021', economic: 3.1, infrastructure: 2.3, agriculture: 4.1, lives: 178 },
      { year: '2022', economic: 2.8, infrastructure: 2.0, agriculture: 3.5, lives: 142 },
      { year: '2023', economic: 4.2, infrastructure: 3.5, agriculture: 5.8, lives: 245 },
      { year: '2024', economic: 3.8, infrastructure: 3.0, agriculture: 4.9, lives: 198 },
      { year: '2025', economic: 4.5, infrastructure: 3.8, agriculture: 6.2, lives: 280 },
      { year: '2026', economic: 5.2, infrastructure: 4.2, agriculture: 7.1, lives: 315 },
      { year: '2027', economic: 4.9, infrastructure: 4.0, agriculture: 6.8, lives: 295 },
      { year: '2028', economic: 5.8, infrastructure: 4.8, agriculture: 8.2, lives: 350 }
    ]);

    setResponseTimeData([
      { year: '2020', avgTime: 45, successRate: 65 },
      { year: '2021', avgTime: 38, successRate: 72 },
      { year: '2022', avgTime: 32, successRate: 78 },
      { year: '2023', avgTime: 28, successRate: 82 },
      { year: '2024', avgTime: 22, successRate: 88 },
      { year: '2025', avgTime: 18, successRate: 92 },
      { year: '2026', avgTime: 15, successRate: 94 },
      { year: '2027', avgTime: 12, successRate: 96 },
      { year: '2028', avgTime: 10, successRate: 97 }
    ]);
  };

  const fetchDisasterPredictions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/environment/disaster-predictions`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setActiveDisasters(data.disasters || []);
        setAiPredictions(data.aiPredictions || []);
      } else {
        loadFallbackData();
      }
    } catch (error) {
      loadFallbackData();
    }
  };

  const fetchEarlyWarningStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/environment/early-warning-status`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setEarlyWarningSystem(data);
      }
    } catch (error) {
      console.log('Early warning unavailable');
    }
  };

  const fetchVulnerabilityData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/environment/vulnerability-assessment`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setVulnerabilityAreas(data.areas || []);
      }
    } catch (error) {
      console.log('Vulnerability data unavailable');
    }
  };

  const fetchResponseTeams = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/environment/response-teams`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setResponseTeams(data.teams || []);
      }
    } catch (error) {
      console.log('Response teams unavailable');
    }
  };

  const loadFallbackData = () => {
    setActiveDisasters([
      { id: 1, type: 'flood', severity: 'high', location: 'Darbhanga District', probability: 78, timeframe: '24-48 hours', affectedPopulation: 125000, icon: Waves, color: '#3b82f6', trend: '+15%' },
      { id: 2, type: 'heatwave', severity: 'medium', location: 'Bihar Region', probability: 65, timeframe: '3-5 days', affectedPopulation: 450000, icon: Thermometer, color: '#ef4444', trend: '+8%' },
      { id: 3, type: 'storm', severity: 'low', location: 'Northern Bihar', probability: 42, timeframe: '5-7 days', affectedPopulation: 85000, icon: Wind, color: '#8b5cf6', trend: '+3%' }
    ]);

    setPreparednessChecklist([
      { id: 1, task: 'Emergency evacuation routes identified', completed: true, priority: 'Critical' },
      { id: 2, task: 'Emergency supplies stockpiled', completed: true, priority: 'High' },
      { id: 3, task: 'Communication systems tested', completed: false, priority: 'Critical' },
      { id: 4, task: 'Medical facilities on standby', completed: true, priority: 'High' },
      { id: 5, task: 'Community awareness campaigns conducted', completed: false, priority: 'Medium' },
      { id: 6, task: 'Shelter locations designated', completed: true, priority: 'Critical' }
    ]);

    setEarlyWarningSystem({ status: 'active', lastUpdate: '15 minutes ago', sensors: 127, coverage: 92, alertsSent: 45, responseTime: '12 min' });

    setVulnerabilityAreas([
      { area: 'Low-lying riverside zones', risk: 'Very High', population: 45000, preparedness: 'Medium', color: '#ef4444' },
      { area: 'Urban flood-prone areas', risk: 'High', population: 68000, preparedness: 'High', color: '#f97316' },
      { area: 'Agricultural lowlands', risk: 'Medium', population: 92000, preparedness: 'Medium', color: '#f59e0b' },
      { area: 'Highland settlements', risk: 'Low', population: 35000, preparedness: 'High', color: '#10b981' }
    ]);

    setResponseTeams([
      { name: 'Rapid Response Unit A', status: 'Ready', personnel: 45, equipment: 'Full', location: 'Patna Base' },
      { name: 'Medical Emergency Team', status: 'Deployed', personnel: 32, equipment: 'Full', location: 'Field Hospital 1' },
      { name: 'Rescue & Relief Corps', status: 'Ready', personnel: 58, equipment: 'Full', location: 'Central Hub' },
      { name: 'Community Support Team', status: 'Standby', personnel: 28, equipment: 'Partial', location: 'District Office' }
    ]);

    setAiPredictions([
      { title: 'Monsoon Flood Risk', description: 'Heavy rainfall predicted. River levels expected to rise by 3-4 meters.', confidence: 85, recommendation: 'Activate evacuation protocols for riverside communities.', timeframe: '24-48 hours', severity: 'high' },
      { title: 'Heat Stress Alert', description: 'Extended high temperatures forecasted. Vulnerable populations at risk.', confidence: 72, recommendation: 'Set up cooling centers. Issue public health advisories.', timeframe: '3-5 days', severity: 'medium' },
      { title: 'Agricultural Drought', description: 'Below-normal rainfall projected affecting crop cycles.', confidence: 68, recommendation: 'Promote water-efficient irrigation.', timeframe: '2-3 months', severity: 'low' }
    ]);

    loadGraphFallbackData();
  };

  const toggleChecklistItem = (id) => {
    setPreparednessChecklist(prev => prev.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
    showToast('✅ Updated!');
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAllData();
    setRefreshing(false);
    showToast('✅ Refreshed!');
  };

  const handleShowGraphs = async () => {
    setShowGraphs(!showGraphs);
    if (!showGraphs && floodHistoryData.length === 0) {
      await fetchGraphData();
    }
    showToast(showGraphs ? '📊 Graphs hidden' : '📊 Loading graphs...');
  };

  const downloadReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      activeDisasters,
      vulnerabilityAreas,
      preparedness: { completionRate: Math.round((preparednessChecklist.filter(i => i.completed).length / preparednessChecklist.length) * 100), checklist: preparednessChecklist },
      responseTeams,
      earlyWarningSystem,
      graphData: {
        floodHistory: floodHistoryData,
        temperatureTrend: temperatureTrendData,
        rainfallPattern: rainfallPatternData
      }
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `disaster_report_${Date.now()}.json`;
    a.click();
    showToast('✅ Downloaded!');
  };

  const shareAlert = async (disaster) => {
    const text = `⚠️ DISASTER ALERT\n\nType: ${disaster.type.toUpperCase()}\nLocation: ${disaster.location}\nSeverity: ${disaster.severity.toUpperCase()}\nProbability: ${disaster.probability}%\n\nStay safe!`;
    if (navigator.share) {
      try { await navigator.share({ text }); } catch (e) { navigator.clipboard.writeText(text); showToast('✅ Copied!'); }
    } else {
      navigator.clipboard.writeText(text);
      showToast('✅ Copied!');
    }
  };

  const showToast = (msg) => {
    const toast = document.createElement('div');
    toast.textContent = msg;
    toast.className = 'toast-message';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  const completionRate = preparednessChecklist.length > 0 ? Math.round((preparednessChecklist.filter(i => i.completed).length / preparednessChecklist.length) * 100) : 0;

  return (
    <div className={`disaster-container ${isFullscreen ? 'fullscreen' : ''}`}>
      <div className={`disaster-wrapper ${isFullscreen ? 'fullscreen' : ''}`}>
        {/* Header */}
        <div className="disaster-card">
          <div className="disaster-header">
            <div className="flex-center gap-12">
              <div className="icon-box">
                <AlertTriangle size={32} className="white-text float-icon" />
              </div>
              <div className="header-text-container">
                <h1 className="disaster-title">AI Disaster Prediction</h1>
                <p className="disaster-subtitle flex-center gap-8">
                  <Satellite size={16} className="red-text" />
                  Real-time monitoring • AI predictions
                </p>
              </div>
            </div>
            <div className="header-actions">
              <button className={`disaster-btn ${showGraphs ? 'btn-purple' : 'btn-blue'}`} onClick={handleShowGraphs}>
                {showGraphs ? <EyeOff size={18} /> : <Eye size={18} />}
                {showGraphs ? 'Hide Graphs' : 'Show Graphs'}
              </button>
              <button className={`disaster-btn ${notificationsEnabled ? 'btn-green' : 'btn-gray'}`} onClick={() => { setNotificationsEnabled(!notificationsEnabled); if (!notificationsEnabled && 'Notification' in window) Notification.requestPermission(); }}>
                <Bell size={18} />
                {notificationsEnabled ? 'ON' : 'OFF'}
              </button>
              <button className="disaster-btn" onClick={handleRefresh} disabled={refreshing}>
                <RefreshCw size={18} className={refreshing ? 'spin-animation' : ''} />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </button>
              <button className="disaster-btn" onClick={downloadReport}>
                <Download size={18} />
                Download
              </button>
              <button className="disaster-btn btn-blue" onClick={() => setIsFullscreen(!isFullscreen)}>
                {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Early Warning System */}
        <div className="disaster-card early-warning-banner p-24">
          <div className="flex-between flex-wrap gap-24">
            <div className="flex-center gap-16">
              <Shield size={48} className="float-icon" />
              <div>
                <h2 className="disaster-title white-text m-0">Early Warning System</h2>
                <p className="m-0 white-text opacity-9">Status: {earlyWarningSystem.status?.toUpperCase() || 'ACTIVE'}</p>
              </div>
            </div>
            <div className="stats-grid">
              <div className="stat-item">
                <Activity size={24} className="m-auto mb-8" />
                <p className="stat-value">{earlyWarningSystem.sensors || 127}</p>
                <p className="stat-label">Sensors</p>
              </div>
              <div className="stat-item">
                <Radio size={24} className="m-auto mb-8" />
                <p className="stat-value">{earlyWarningSystem.coverage || 92}%</p>
                <p className="stat-label">Coverage</p>
              </div>
              <div className="stat-item">
                <Zap size={24} className="m-auto mb-8" />
                <p className="stat-value">{earlyWarningSystem.alertsSent || 45}</p>
                <p className="stat-label">Alerts</p>
              </div>
              <div className="stat-item">
                <Clock size={24} className="m-auto mb-8" />
                <p className="stat-value small">{earlyWarningSystem.responseTime || '12 min'}</p>
                <p className="stat-label">Response</p>
              </div>
            </div>
          </div>
        </div>

        {/* 9 Predictive Graphs */}
        {showGraphs && (
          <div className="mb-24">
            <h2 className="disaster-title flex-center gap-12">
              <BarChart3 size={32} className="blue-text" />
              Historical Data & AI Predictions (Overview)
            </h2>

            <div className="grid-large">
              {/* Graph 1: Flood History */}
              <div className="graph-card">
                <h3 className="graph-header">
                  <Waves size={20} className="blue-text" />
                  1. Flood Events Trend
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={floodHistoryData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="year" stroke="#64748b" tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="left" stroke="#64748b" tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="right" orientation="right" stroke="#64748b" tick={{ fontSize: 12 }} />
                    <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                    <Legend />
                    <Area yAxisId="left" type="monotone" dataKey="actual" fill="#3b82f680" stroke="#3b82f6" name="Historical" />
                    <Line yAxisId="left" type="monotone" dataKey="predicted" stroke="#ef4444" strokeWidth={3} strokeDasharray="5 5" name="AI Prediction" />
                    <Bar yAxisId="right" dataKey="severity" fill="#f59e0b" name="Severity" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              {/* Graph 2: Temperature */}
              <div className="graph-card">
                <h3 className="graph-header">
                  <Thermometer size={20} className="red-text" />
                  2. Temperature Trend (°C)
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={temperatureTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="historical" stroke="#94a3b8" />
                    <Line type="monotone" dataKey="current" stroke="#10b981" />
                    <Line type="monotone" dataKey="predicted" stroke="#ef4444" strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Graph 3: Rainfall */}
              <div className="graph-card">
                <h3 className="graph-header">
                  <CloudRain size={20} className="blue-text" />
                  3. Rainfall Pattern (mm)
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={rainfallPatternData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="historical" fill="#3b82f6" />
                    <Bar dataKey="predicted" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Graph 4: Risk Radar */}
              <div className="graph-card">
                <h3 className="graph-header">
                  <TrendingUp size={20} className="red-text" />
                  4. Multi-Hazard Risk Assessment
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={riskAssessmentData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="area" />
                    <PolarRadiusAxis />
                    <Radar name="Flood" dataKey="flood" stroke="#3b82f6" fill="#3b82f680" />
                    <Radar name="Heat" dataKey="heat" stroke="#ef4444" fill="#ef444480" />
                    <Radar name="Storm" dataKey="storm" stroke="#8b5cf6" fill="#8b5cf680" />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Active Warnings */}
        <div className="mb-24">
          <h2 className="disaster-title flex-center gap-12">
            <AlertCircle size={32} style={{ color: '#ef4444' }} />
            Active Warnings ({activeDisasters.length})
          </h2>
          {loading ? (
            <div className="flex-center w-full p-24 justify-center">
              <div className="disaster-loader"></div>
            </div>
          ) : (
            <div className="grid-2">
              {activeDisasters.map((d) => {
                const Icon = d.icon;
                return (
                  <div key={d.id} className="disaster-card pos-relative overflow-hidden" style={{ background: d.severity === 'high' ? '#fef2f2' : '#fff7ed', borderLeft: `8px solid ${d.color}` }}>
                    <div className="flex-between mb-16">
                      <div className="icon-box w-56 h-56 br-12" style={{ background: `${d.color}15` }}>
                        <Icon size={32} style={{ color: d.color }} className="float-icon" />
                      </div>
                      <span className="badge p-6-12 br-8 font-800 text-small" style={{ background: d.color, color: 'white' }}>{d.severity.toUpperCase()}</span>
                    </div>
                    <h3 className="text-24 font-800 m-0 mb-12">{d.type.charAt(0).toUpperCase() + d.type.slice(1)} Warning</h3>
                    <div className="flex-col gap-8 mb-20 gray-text">
                      <div className="flex-center gap-8"><MapPin size={16} /> {d.location}</div>
                      <div className="flex-center gap-8"><Clock size={16} /> {d.timeframe}</div>
                      <div className="flex-center gap-8"><Users size={16} /> {d.affectedPopulation.toLocaleString()} affected</div>
                    </div>
                    <div className="mb-20">
                      <div className="flex-between mb-8">
                        <span className="font-800">Probability</span>
                        <span className="font-800" style={{ color: d.color }}>{d.probability}%</span>
                      </div>
                      <div className="progress-bg h-12">
                        <div className="progress-bar h-full" style={{ width: `${d.probability}%`, background: d.color }}></div>
                      </div>
                    </div>
                    <button className="disaster-btn w-full flex-center justify-center" style={{ background: d.color }} onClick={() => shareAlert(d)}>
                      <Share2 size={18} /> Share Alert
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Vulnerability & Preparedness */}
        <div className="grid-2-even mb-24">
          <div className="disaster-card">
            <h2 className="text-24 font-800 mb-20">Vulnerability Assessment</h2>
            <div className="flex-col gap-16">
              {vulnerabilityAreas.map((a, i) => (
                <div key={i} className="vulnerability-item" style={{ background: `${a.color}10`, borderLeft: `4px solid ${a.color}` }}>
                  <div className="flex-between mb-8">
                    <h3 className="m-0 text-18 font-800">{a.area}</h3>
                    <span className="badge p-4-8 br-6 text-10" style={{ background: a.color, color: 'white' }}>{a.risk}</span>
                  </div>
                  <div className="flex-between">
                    <span className="gray-text">Population: {a.population.toLocaleString()}</span>
                    <span className="font-800" style={{ color: a.color }}>{a.preparedness} Prepared</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="disaster-card">
            <div className="flex-between mb-20">
              <h2 className="text-24 font-800 m-0">Preparedness Checklist</h2>
              <div className="badge p-8-16 br-12 font-800" style={{ background: '#dcfce7', color: '#16a34a' }}>{completionRate}%</div>
            </div>
            <div className="flex-col gap-12">
              {preparednessChecklist.map(item => (
                <div key={item.id} className="checklist-item" onClick={() => toggleChecklistItem(item.id)} style={{ background: item.completed ? '#f0fdf4' : '#f8fafc', borderColor: item.completed ? '#10b981' : '#e2e8f0' }}>
                  <div className="flex-center gap-12">
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: '2px solid #cbd5e1', background: item.completed ? '#10b981' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {item.completed && <CheckCircle size={14} color="white" />}
                    </div>
                    <span style={{ fontWeight: 600, color: item.completed ? '#16a34a' : '#1e293b' }}>{item.task}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Response Teams */}
        <div className="disaster-card">
          <h2 className="text-24 font-800 mb-20">Emergency Response Teams</h2>
          <div className="grid-3">
            {responseTeams.map((t, i) => (
              <div key={i} className="response-team-card">
                <div className="flex-between mb-16">
                  <Shield size={32} color="#3b82f6" />
                  <span className="badge p-4-8 br-6 text-10" style={{ background: t.status === 'Ready' ? '#10b981' : '#3b82f6', color: 'white' }}>{t.status}</span>
                </div>
                <h3 className="m-0 mb-8">{t.name}</h3>
                <div className="gray-text text-14">
                  <div>Personnel: <strong>{t.personnel}</strong></div>
                  <div>Location: <strong>{t.location}</strong></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
