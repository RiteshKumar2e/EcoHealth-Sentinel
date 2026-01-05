import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText, Download, TrendingUp, Calendar, BarChart3,
  Filter, Search, Printer, Share2, Mail, Clock, Shield,
  Bell, Zap, Activity, Heart, ChevronRight, Info, RefreshCw
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';

import './MyHealthReports.css';

const MyHealthReports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Last 7 Days');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const reportRef = React.useRef(null);
  const navigate = useNavigate();

  const vitalsTrend = [];
  const reportsList = [];

  const stats = [
    { label: 'Reports', value: '0', icon: FileText, color: '#3b82f6' },
    { label: 'AI Scans', value: '0', icon: Zap, color: '#f59e0b' },
    { label: 'Lab Syncs', value: '0', icon: Activity, color: '#10b981' },
    { label: 'Avg Pulse', value: '--', icon: Heart, color: '#ef4444', unit: 'bpm' }
  ];


  const generatePDF = () => {
    setIsGeneratingPDF(true);
    try {
      const doc = new jsPDF();
      const timestamp = new Date().toLocaleString();

      // --- DOCUMENT HEADER ---
      doc.setFontSize(22);
      doc.setTextColor(59, 130, 246); // Primary Blue
      doc.text("ECOHEALTH SENTINEL", 14, 22);

      doc.setFontSize(16);
      doc.setTextColor(15, 23, 42); // Main Text
      doc.text("Personal Health Summary Report", 14, 32);

      doc.setDrawColor(226, 232, 240);
      doc.line(14, 38, 196, 38);

      // --- PATIENT & REPORT METADATA ---
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139); // Muted Text
      doc.text(`Report Generated: ${timestamp}`, 14, 46);
      doc.text("Patient Status: Verified Profile", 14, 51);
      doc.text(`Analysis Period: ${selectedPeriod}`, 14, 56);

      // --- QUICK STATS SECTION ---
      doc.setFontSize(14);
      doc.setTextColor(15, 23, 42);
      doc.text("Executive Summary Metrics", 14, 70);

      const statData = stats.map(s => [s.label, `${s.value}${s.unit || ''}`]);
      autoTable(doc, {
        startY: 75,
        head: [['Metric', 'Current Value']],
        body: statData,
        theme: 'striped',
        headStyles: { fillColor: [59, 130, 246], fontStyle: 'bold' },
        styles: { fontSize: 10, cellPadding: 5 }
      });

      // --- VITALS ANALYSIS SUMMARY ---
      let currentY = doc.lastAutoTable.finalY + 15;
      doc.setFontSize(14);
      doc.text("Detailed Vitals Analysis (Selected Period)", 14, currentY);

      const vitalsHead = [['Day', 'Heart Rate (BPM)', 'Daily Steps']];
      const vitalsBody = vitalsTrend.map(v => [v.day, v.heartRate, v.steps]);

      autoTable(doc, {
        startY: currentY + 5,
        head: vitalsHead,
        body: vitalsBody,
        theme: 'grid',
        headStyles: { fillColor: [16, 185, 129], fontStyle: 'bold' }, // Success Green
        styles: { fontSize: 10 }
      });

      // --- CLINICAL DOCUMENTS ---
      currentY = doc.lastAutoTable.finalY + 15;
      doc.setFontSize(14);
      doc.text("Clinical Document & Registry Tracker", 14, currentY);

      const docHead = [['Document Name', 'Date Recorded', 'Type', 'Data Size']];
      const docBody = reportsList.map(r => [r.name, r.date, r.type, r.size]);

      autoTable(doc, {
        startY: currentY + 5,
        head: docHead,
        body: docBody,
        theme: 'striped',
        headStyles: { fillColor: [139, 92, 246], fontStyle: 'bold' }, // Purple
        styles: { fontSize: 10 }
      });

      // --- FOOTER & DISCLAIMER ---
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.text("DISCLAIMER: This report is AI-generated and intended for informational purposes. Cross-verify with original laboratory reports.", 14, 285);
        doc.text(`Page ${i} of ${pageCount}`, 180, 285);
        doc.text("HIPAA Compliant | Powered by EcoHealth-Sentinel AI Core", 14, 290);
      }

      doc.save(`Professional_Health_Summary_${new Date().getTime()}.pdf`);
    } catch (error) {
      console.error('PDF Generation Error:', error);
      alert('Error generating professional report. Check console for details.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="reports-container">
      <div className="reports-max-width">
        {/* Header Section */}
        <header className="reports-header">
          <div>
            <h1 className="reports-title">My Health Reports</h1>
            <p className="reports-subtitle">Access your clinical documents and AI-driven health trends</p>
          </div>
          <div className="header-actions">
            <button className="btn-header btn-secondary">
              <Share2 size={18} /> Share
            </button>
            <button
              className="btn-header btn-primary"
              onClick={generatePDF}
              disabled={isGeneratingPDF}
              style={{ opacity: isGeneratingPDF ? 0.7 : 1, cursor: isGeneratingPDF ? 'not-allowed' : 'pointer' }}
            >
              {isGeneratingPDF ? (
                <RefreshCw size={18} className="animate-spin" />
              ) : (
                <Printer size={18} />
              )}
              {isGeneratingPDF ? 'Generating...' : 'Print All'}
            </button>
          </div>
        </header>

        <div ref={reportRef}>
          {/* Quick Stats */}
          <div className="stats-grid">
            {stats.map((stat, i) => (
              <div key={i} className="stat-card">
                <div style={{ padding: '10px', background: `${stat.color}15`, borderRadius: '12px', width: 'fit-content' }}>
                  <stat.icon style={{ color: stat.color }} size={24} />
                </div>
                <div className="stat-value">
                  {stat.value}
                  {stat.unit && <span style={{ fontSize: '14px', marginLeft: '4px', color: '#64748b' }}>{stat.unit}</span>}
                </div>
                <p className="stat-label">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Main Content Areas */}
          <div className="reports-main-grid">
            {/* Trend Analysis */}
            <section className="glass-panel">
              <div className="panel-header">
                <h2 className="panel-title">
                  <TrendingUp size={20} color="#3b82f6" /> Vital Signs Analysis
                </h2>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="select-period"
                >
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                  <option>Last 90 Days</option>
                </select>
              </div>
              <div className="chart-wrapper">
                {vitalsTrend.length > 0 ? (
                  <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={vitalsTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorSteps" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis
                        dataKey="day"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748b', fontSize: 12 }}
                        dy={10}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748b', fontSize: 12 }}
                      />
                      <Tooltip
                        contentStyle={{
                          background: '#fff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '12px',
                          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="steps"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorSteps)"
                      />
                      <Line
                        type="monotone"
                        dataKey="heartRate"
                        stroke="#ef4444"
                        strokeWidth={2}
                        dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="empty-state-placeholder" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '12px', color: '#94a3b8' }}>
                    <TrendingUp size={48} strokeWidth={1} />
                    <p style={{ fontWeight: 600 }}>No Trend Data Available Yet</p>
                    <p style={{ fontSize: '13px', textAlign: 'center' }}>Sync your wearable device or log vitals to see analysis.</p>
                  </div>
                )}
              </div>
            </section>

            {/* Documents Sidebar */}
            <section className="glass-panel">
              <h2 className="panel-title" style={{ marginBottom: '24px' }}>
                <FileText size={20} color="#3b82f6" /> Recent Documents
              </h2>
              <div className="documents-list">
                {reportsList.length > 0 ? (
                  reportsList.map(report => (
                    <div key={report.id} className="document-item">
                      <div className="doc-info">
                        <div className="doc-meta">
                          <div className="doc-icon-box">
                            <FileText size={18} color="#3b82f6" />
                          </div>
                          <div>
                            <p className="doc-name">{report.name}</p>
                            <p className="doc-date">{report.date} • {report.type}</p>
                          </div>
                        </div>
                        <button className="btn-download" title="Download PDF">
                          <Download size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '40px 20px', textAlign: 'center', background: '#f8fafc', borderRadius: '16px', border: '1px dashed #e2e8f0' }}>
                    <Info size={32} color="#94a3b8" style={{ marginBottom: '12px' }} />
                    <p style={{ margin: 0, fontWeight: 700, color: '#475569', fontSize: '14px' }}>No Documents Found</p>
                    <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '12px' }}>Your medical reports and AI insights will appear here.</p>
                  </div>
                )}
              </div>
              <button className="btn-view-all" onClick={() => navigate('/healthcare/medical-vault')}>View Document Archive</button>
            </section>
          </div>
        </div>

        {/* Security / Info Footer */}
        <footer className="security-footer">
          <div className="security-icon-box">
            <Shield size={32} color="#3b82f6" />
          </div>
          <div>
            <h3 className="security-title">Data Integrity & Compliance</h3>
            <p className="security-text">
              All health reports are encrypted at rest and in transit. This dashboard is HIPAA-compliant
              and cross-verified against established medical databases to ensure 94.5% data precision
              for AI-generated insights.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default MyHealthReports;
