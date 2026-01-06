import React, { useState, useEffect } from 'react';
import { AlertTriangle, CloudRain, Wind, Waves, Thermometer, MapPin, Shield, Clock, Download, RefreshCw, Share2, Bell, Activity, Users, Maximize2, Minimize2, Radio, Satellite, Zap, AlertCircle, CheckCircle, TrendingUp, BarChart3, Eye, EyeOff } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

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
    setFloodHistoryData([]);
    setTemperatureTrendData([]);
    setRainfallPatternData([]);
    setDisasterFrequencyData([]);
    setRiskAssessmentData([]);
    setEvacuationReadinessData([]);
    setSeasonalTrendsData([]);
    setImpactAnalysisData([]);
    setResponseTimeData([]);
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
    setActiveDisasters([]);
    setPreparednessChecklist([]);
    setEarlyWarningSystem({ status: 'active', sensors: 0, coverage: 0, alertsSent: 0 });
    setVulnerabilityAreas([]);
    setResponseTeams([]);
    setAiPredictions([]);
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
    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();

      // Urgent Header
      doc.setFillColor(239, 68, 68); // Red-500
      doc.rect(0, 0, pageWidth, 40, 'F');

      doc.setFontSize(26);
      doc.setTextColor(255, 255, 255);
      doc.text('Disaster Risk Analysis Report', 20, 25);

      doc.setFontSize(10);
      doc.text(`Incident Response Time: ${new Date().toLocaleString()}`, 20, 35);

      // Risk Assessment
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(18);
      doc.text('AI Predictive Risk Assessment', 20, 55);

      doc.setFontSize(11);
      doc.text(`Active Alerts: ${activeDisasters.length}`, 20, 65);
      doc.text(`System Status: ${earlyWarningSystem.status?.toUpperCase() || 'OPERATIONAL'}`, 20, 72);

      // Critical Alerts Table
      doc.setFontSize(16);
      doc.text('Critical Vulnerabilities', 20, 90);

      let yPos = 100;
      activeDisasters.slice(0, 5).forEach((d, i) => {
        doc.setFontSize(10);
        doc.setTextColor(50);
        doc.text(`${i + 1}. ${d.type.toUpperCase()} in ${d.location}`, 25, yPos);
        doc.setTextColor(200, 0, 0);
        doc.text(`Probability: ${d.probability}% - SEVERITY: ${d.severity.toUpperCase()}`, 110, yPos);
        yPos += 8;
      });

      // Preparedness Summary
      const completionRate = Math.round((preparednessChecklist.filter(i => i.completed).length / preparednessChecklist.length) * 100);
      doc.setTextColor(30);
      doc.setFontSize(16);
      doc.text('Preparedness Checklist Status', 20, yPos + 15);
      doc.setFontSize(11);
      doc.text(`Completion Rate: ${completionRate}%`, 20, yPos + 25);

      // Footer
      const pageHeight = doc.internal.pageSize.getHeight();
      doc.setFillColor(248, 250, 252);
      doc.rect(0, pageHeight - 15, pageWidth, 15, 'F');
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text('Emergency Response Coordination - EcoHealth Sentinel AI', pageWidth / 2, pageHeight - 7, { align: 'center' });

      doc.save(`disaster_risk_report_${Date.now()}.pdf`);
      showToast('✅ Professional Risk Report Exported!');
    } catch (e) {
      console.error('PDF Export error:', e);
      showToast('❌ Failed to export PDF');
    }
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
              <div className="icon-box" style={{ background: '#fef2f2', border: '1px solid #fee2e2', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.1)' }}>
                <AlertTriangle size={32} style={{ color: '#ef4444' }} className="float-icon" />
              </div>
              <div className="header-text-container">
                <h1 className="disaster-title">AI Disaster Prediction</h1>
                <p className="disaster-subtitle flex-center gap-8">
                  <Satellite size={16} className="red-text" />
                  Real-time monitoring AI predictions
                </p>
              </div>
            </div>
            <div className="header-actions">
              <button className={`disaster-btn ${showGraphs ? 'btn-purple' : 'btn-blue'}`} onClick={handleShowGraphs}>
                {showGraphs ? <EyeOff size={22} color="#8b5cf6" /> : <Eye size={22} color="#3b82f6" />}
                {showGraphs ? 'Hide Graphs' : 'Show Graphs'}
              </button>
              <button className="disaster-btn" onClick={downloadReport}>
                <Download size={22} color="#4b5563" />
                Download
              </button>
            </div>
          </div>
        </div>

        {/* Early Warning System */}
        <div className="disaster-card early-warning-banner p-24">
          <div className="flex-col gap-24">
            <div className="flex-center gap-16">
              <Shield size={48} className="float-icon" />
              <div>
                <h2 className="disaster-title white-text m-0">Early Warning System</h2>
                <p className="m-0 white-text opacity-9">Status: {earlyWarningSystem.status?.toUpperCase() || 'ACTIVE'}</p>
              </div>
            </div>
            <div className="stats-grid">
              <div className="stat-item">
                <Activity size={18} className="m-auto mb-4" />
                <p className="stat-value">{earlyWarningSystem.sensors ?? 0}</p>
                <p className="stat-label">Sensors</p>
              </div>
              <div className="stat-item">
                <Radio size={18} className="m-auto mb-4" />
                <p className="stat-value">{earlyWarningSystem.coverage ?? 0}%</p>
                <p className="stat-label">Coverage</p>
              </div>
              <div className="stat-item">
                <Zap size={18} className="m-auto mb-4" />
                <p className="stat-value">{earlyWarningSystem.alertsSent ?? 0}</p>
                <p className="stat-label">Alerts</p>
              </div>
              <div className="stat-item">
                <Clock size={18} className="m-auto mb-4" />
                <p className="stat-value small">{earlyWarningSystem.responseTime ?? '--'}</p>
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
          <div className="response-teams-grid">
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
